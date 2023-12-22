import cache from "../httpServer/cache.js";
import RetrievalError from "../httpServer/errors/RetrievalError.js";
import * as mongoAccess from '../mongoDb/mongoAccess.js';
import DatabaseError from "../httpServer/errors/DatabaseError.js";
import CacheError from "../httpServer/errors/CacheError.js";
import { findByRule } from "./findByRule.js";
import { castProperties, mapProperties } from "./modelPropertyHelper.js";
import logger from "../tools/logging/logger.js";
import { Mutex } from 'async-mutex';

/**
 * @file BaseModel.js - The base model for all models in the application.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
export default class BaseModel {

    static cacheMutex = new Mutex();

    static modelName = '';
    static schema = '';
    static cacheKey = '';
    static expirationTime = 0;
    static populationPaths = [];

    static getMapPaths() {
        throw new Error('method not yet implemented')
    }

    static getCastPaths() {
        throw new Error('method not yet implemented')
    }

    constructor(
        data
    ) {
        this._data = data;
    }

    get _id(){
        throw new Error(`${this.constructor.modelName}: _id getter method not implemented`);
    }

    set _id(value){
        throw new Error(`${this.constructor.modelName}: _id setter method not implemented`);
    }

    /**
     * @description Gets all instances of the model saved in either cache or database.
     * @param {Function} searchFunction - Optional function that is called to find the object(s) when the cache is expired.
     * @returns {Promise<Array<BaseModel>>}
     * */
     static async getAll(searchFunction){
        if (this.cacheUpdating) {
            await this.cacheUpdatePromise;
        }

        const cacheResults = cache.get(this.cacheKey);

        if(cacheResults){
            return cacheResults;
        }
        else {
            let result = searchFunction ? await searchFunction() : null;
            if(!result) {
                try {
                    result = [ ...await this.updateCache() ];
                } catch (error) {
                    logger.database.fatal(`Failed to update ${ this.modelName } cache:\n${ error.stack }`);
                }
            } else {
                this.updateCache().catch(error => {
                    logger.database.fatal(`Failed to update ${ this.modelName } cache:\n${ error.stack }`);
                });
            }
            if(!result) throw new DatabaseError(`Failed to fetch ${ this.modelName }s from database`);
            return result;
        }
    }

    /**
     * Retrieves a specific instance of the model by its ID.
     * @param {string} _id - The ID of the instance to retrieve.
     * @returns {Promise<Object>} The instance of the model with the given ID.
     * @throws {RetrievalError} If the instance with the given ID is not found.
     */
    static async getById(_id){
        let item = this.verifyInCache(_id) ? cache.get(this.cacheKey).find(i => i._id === _id) : null;

        if (!item) {
            const result = await mongoAccess.getDocument(this.schema, _id);
            if(!result) throw new DatabaseError(`Failed to fetch ${ this.modelName } with _id '${ _id }' from database`);
            item = await this.populate(result);

            Promise.resolve(item).then(async () => {
                const release = await this.cacheMutex.acquire();
                try {
                    const items = await this.getAll(null);
                    items.push(item);
                    cache.put(this.cacheKey, items, this.expirationTime * 60 * 1000);
                } finally {
                    release();
                }
            });
        }

        return item;
    }

    /**
     * @description Get all instances of the model that match the rule.
     * @param {Object} rule - The rule to find the instances by.
     * @return {Promise<Array<Object>>} The matching instances.
     * @throws {RetrievalError} When the instances could not be found.
     */
    static async getAllByRule(rule) {
        let items = cache.get(this.cacheKey);
        if (items) {
            items = items.filter(i => findByRule(i, rule));
        }

        if (!items || items.length === 0) {
            items = await mongoAccess.getDocumentsByRule(this.schema, rule);
            if (!items) throw new DatabaseError(`Failed to fetch ${ this.modelName }s from database`);

            let populatedItems = [];
            for (let item of items) {
                populatedItems.push(await this.populate(item));
            }
            items = populatedItems;

            Promise.resolve(items).then(async () => {
                const release = await this.cacheMutex.acquire();
                try {
                    const allItems = await this.getAll(null);
                    allItems.push(...items);
                    cache.put(this.cacheKey, allItems, this.expirationTime * 60 * 1000);
                } finally {
                    release();
                }
            });
        }

        return items;
    }

    /**
     * Creates a new instance of the model and saves it to the database and cache.
     * The method returns the newly created instance immediately and continues updating the cache in the background.
     * @returns {Promise<Object>} The newly created instance of the model.
     * @throws {DatabaseError} If the instance could not be created in the database.
     * @throws {CacheError} If the instance could not be added to the cache.
     */
    async create(){
        const _id = this._id;

        let insertedItem = await mongoAccess.createDocument(this.constructor.schema, this.data);
        if(!insertedItem) throw new DatabaseError(`Failed to create ${ this.constructor.modelName } with _id '${ _id }'`);

        insertedItem = this.constructor.populate(insertedItem);

        const release = await this.constructor.cacheMutex.acquire();
        try {
            BaseModel.getAll(null).then(items => {
                items.push(insertedItem);
                cache.put(this.constructor.cacheKey, items, this.constructor.expirationTime  * 60 * 1000);

                if(!this.constructor.verifyInCache(_id))
                    throw new CacheError(`Failed to put ${this.constructor.modelName} with id '${ _id }' in cache`);
            });
        } finally {
            release();
        }

        return insertedItem;
    }

    /**
     * Updates an existing instance of the model in the database and cache.
     * The method returns the updated instance immediately and continues updating the cache in the background.
     * @param {Object} newModel - The new data for the instance.
     * @returns {Promise<Object>} The updated instance of the model.
     * @throws {DatabaseError} If the instance could not be updated in the database.
     * @throws {CacheError} If the updated instance could not be updated in the cache.
     */
    async update(newModel){
        const _id = this._id;

        let updatedItem = await mongoAccess.updateDocument(this.constructor.schema, _id, newModel);
        if(!updatedItem) throw new DatabaseError(`Failed to update ${ this.constructor.modelName } with _id '${ _id }'`);

        updatedItem = this.constructor.populate(updatedItem);

        const release = await this.constructor.cacheMutex.acquire();
        try {
            BaseModel.getAll(null).then(items => {
                const index = items.findIndex(item => item._id === _id);
                if (index !== -1) {
                    items[index] =  updatedItem;
                }
                cache.put(this.constructor.cacheKey, items, this.constructor.expirationTime  * 60 * 1000);

                if(!this.constructor.verifyInCache(_id))
                    throw new CacheError(`Failed to update ${this.constructor.modelName} with id '${ _id }' in cache`);
            });
        } finally {
            release();
        }

        return updatedItem;
    }

    /**
     * Deletes an existing instance of the model from the database and cache.
     * The method returns true immediately and continues updating the cache in the background.
     * @returns {Promise<boolean>} Returns true if the instance was successfully deleted.
     * @throws {DatabaseError} If the instance could not be deleted from the database.
     * @throws {CacheError} If the instance could not be removed from the cache.
     */
    async delete(){
        const _id = this._id;

        const deletedItem = await mongoAccess.deleteDocument(this.constructor.schema, _id);
        if(!deletedItem) throw new DatabaseError(`Failed to delete ${ this.constructor.modelName } with _id '${ _id }'`);

        const release = await this.constructor.cacheMutex.acquire();
        try {
            if (this.constructor.cacheUpdating) {
                await this.constructor.cacheUpdating;
            }
            BaseModel.getAll(null).then(items => {
                const index = items.findIndex(item => item._id === _id);
                if (index !== -1) {
                    items.splice(index, 1);
                }
                cache.put(this.constructor.cacheKey, items, this.constructor.expirationTime * 60 * 1000);

                if(this.constructor.verifyInCache(_id))
                    throw new CacheError(`Failed to delete ${this.constructor.modelName} from cache with _id '${ _id }'`);
            });
        } finally {
            release();
        }

        return true;
    }

    /**
     * Updates the cache with all instances of the model from the database.
     * The function is designed to run asynchronously and slowly, spreading out the performance impact.
     * Each operation is delayed by an additional 100 milliseconds.
     *
     * @throws {DatabaseError} If the instances could not be fetched from the database.
     * @throws {CacheError} If an instance could not be added to the cache.
     */
    static updateCache() {
        this.cacheUpdating = true;
        this.cacheUpdatePromise = new Promise(async (resolve, reject) => {
            try {
                const itemsFromDb = await mongoAccess.getAllDocuments(this.schema);
                if (!itemsFromDb || !Array.isArray(itemsFromDb)) {
                    reject(new DatabaseError(`Failed to fetch ${ this.modelName }s from database`));
                }

                let before = Date.now();
                let items = [];
                let promises = [];

                for (let i = 0; i < itemsFromDb.length; i++) {
                    promises.push(new Promise(resolve => {
                        setTimeout(() => {
                            this.populate(itemsFromDb[i]).then(item => {
                                items.push(item);
                                cache.put(this.cacheKey, items, this.expirationTime * 60 * 1000);

                                if (item && !this.verifyInCache(item._id)) {
                                    throw new CacheError(`Failed to insert ${ this.modelName } with _id '${ item._id }'`);
                                }
                                resolve();
                            });
                        }, i * 100);
                    }));
                }

                await Promise.all(promises);
                logger.database.info(`Updated ${ this.modelName } cache in ${ Date.now() - before }ms`);

                this.cacheUpdating = false;
                resolve(items);
            } catch (error) {
                reject(error); // Reject the Promise if an error occurs
            }
        });

        if (!(this.cacheUpdatePromise instanceof Promise)) {
            throw new Error('cacheUpdatePromise is not a Promise');
        }

        return this.cacheUpdatePromise; // Return the Promise that resolves with the new cache
    }


        /**
     * Verifies if an instance of the model with the given ID is in the cache.
     * @param {string} _id - The ID of the instance to verify.
     * @returns {boolean} Returns true if the instance is in the cache, false otherwise.
     */
    static verifyInCache(_id){
        const items = cache.get(this.cacheKey);
        return items ? items.some(i => i._id === _id) : false;
    }

    /**
     * Populates the instance with related data from other collections.
     * This method should be overridden in subclasses.
     * @param {Object} object - The instance to populate.
     * @returns {Promise<BaseModel>} The populated instance.
     * @throws {Error} If the instance could not be populated.
     */
    static async populate(object) {
        throw new Error('Populate method not implemented');
    }

    /**
     * Returns the paths for populating the instance.
     * @returns {Array<Object>} The paths for populating an instance of the model.
     */
    static getPopulationPaths() {
        return this.populationPaths;
    }

    handleProperties(){
        mapProperties({_id: this._id, ...this.data}, this.constructor.getMapPaths());
        castProperties({_id: this._id, ...this.data}, this.constructor.getCastPaths());
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

}