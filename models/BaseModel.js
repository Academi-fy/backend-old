import cache from "../httpServer/cache.js";
import RetrievalError from "../httpServer/errors/RetrievalError.js";
import * as mongoAccess from '../mongoDb/mongoAccess.js';
import DatabaseError from "../httpServer/errors/DatabaseError.js";
import CacheError from "../httpServer/errors/CacheError.js";
import { populate } from "dotenv";
import { findByRule } from "./findByRule.js";

/**
 * @file BaseModel.js - The base model for all models in the application.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
export default class BaseModel {

    static modelName = '';
    static schema = '';
    static cacheKey = '';
    static expirationTime = 0;
    static populationPaths = [];

    constructor(
        data
    ) {
        this._data = data;
    }

    get id(){
        throw new Error(`${this.constructor.modelName}: id getter method not implemented`);
    }

    set id(value){
        throw new Error(`${this.constructor.modelName}: id setter method not implemented`);
    }

    /**
     * @description Gets all instances of the model saved in either cache or database.
     * @returns {Promise<Array<Object>>}
     * */
     static async getAll(){

        const cacheResults = cache.get(this.cacheKey);

        if(cacheResults){
            return cacheResults;
        }
        else return await this.updateCache();
    }

    /**
     * Retrieves a specific instance of the model by its ID.
     * @param {string} id - The ID of the instance to retrieve.
     * @returns {Promise<Object>} The instance of the model with the given ID.
     * @throws {RetrievalError} If the instance with the given ID is not found.
     */
    static async getById(id){

        const items  = await this.getAll();

        const item = items.find(i => i._id === id);
        if(!item) throw  new RetrievalError(`Failed to find ${ this.modelName } with id '${ id }'`);

        return item;
    }

    /**
     * @description Get all instances of the model that match the rule.
     * @param {Object} rule - The rule to find the instances by.
     * @return {Promise<Array<Object>>} The matching instances.
     * @throws {RetrievalError} When the instances could not be found.
     */
    static async getAllByRule(rule) {

        const items = await this.getAll();

        const matchingItems = findByRule(items, rule);
        if(!matchingItems) throw new RetrievalError(`Failed to find ${ this.modelName } with rule '${ rule }'`);

        return matchingItems;
    }

    /**
     * Creates a new instance of the model and saves it to the database and cache.
     * @returns {Promise<Object>} The newly created instance of the model.
     * @throws {DatabaseError} If the instance could not be created in the database.
     * @throws {CacheError} If the instance could not be added to the cache.
     */
    async create(){
        const id = this.id;

        const items = await BaseModel.getAll();

        let insertedItem = await mongoAccess.createDocument(this.constructor.schema, this.data);
        if(!insertedItem) throw new DatabaseError(`Failed to create ${ this.constructor.modelName } with id '${ this.id }'`);

        insertedItem = this.constructor.populate(insertedItem);

        items.push(insertedItem);
        cache.put(this.constructor.cacheKey, items, this.constructor.expirationTime  * 60 * 1000);

        if(!this.constructor.verifyInCache(id))
            throw new CacheError(`Failed to put item in cache:\n${ insertedItem }`);

        return insertedItem;
    }

    /**
     * Updates an existing instance of the model in the database and cache.
     * @param {Object} newModel - The new data for the instance.
     * @returns {Promise<Object>} The updated instance of the model.
     * @throws {DatabaseError} If the instance could not be updated in the database.
     * @throws {CacheError} If the updated instance could not be updated in the cache.
     */
    async update(newModel){
        const id = this.id;

        const items = await BaseModel.getAll();

        let updatedItem = await mongoAccess.updateDocument(this.constructor.schema, id, newModel);
        if(!updatedItem) throw new DatabaseError(`Failed to update ${ this.constructor.modelName } with id '${ id }'`);

        updatedItem = this.constructor.populate(updatedItem);

        items.splice(items.findIndex(item => item._id === id), 1, updatedItem);
        cache.put(this.constructor.cacheKey, items, this.constructor.expirationTime  * 60 * 1000);

        if(!this.constructor.verifyInCache(id))
            throw new CacheError(`Failed insert item:\n${ updatedItem }`);

        return updatedItem;
    }

    /**
     * Deletes an existing instance of the model from the database and cache.
     * @returns {Promise<boolean>} Returns true if the instance was successfully deleted.
     * @throws {DatabaseError} If the instance could not be deleted from the database.
     * @throws {CacheError} If the instance could not be removed from the cache.
     */
    async delete(){
        const id = this.id;

        const deletedItem = await mongoAccess.deleteDocument(this.constructor.schema, id);
        if(!deletedItem) throw new DatabaseError(`Failed to delete ${ this.constructor.modelName } with id '${ id }'`);

        const items = await BaseModel.getAll();
        items.splice(items.findIndex(item => item._id === id), 1);
        cache.put(this.constructor.cacheKey, items, this.constructor.expirationTime * 60 * 1000);

        if(this.constructor.verifyInCache(id))
            throw new CacheError(`Failed to delete item from cache with id '${ id }'`);

        return true;
    }

    /**
     * Updates the cache with all instances of the model from the database.
     * @returns {Promise<Array<Object>>} The instances of the model from the database.
     * @throws {DatabaseError} If the instances could not be fetched from the database.
     * @throws {CacheError} If an instance could not be added to the cache.
     */
    static async updateCache(){

        const itemsFromDb = await mongoAccess.getAllDocuments(this.schema);
        if(!itemsFromDb || !Array.isArray(itemsFromDb)){
            throw new DatabaseError(`'Failed to fetch ${ this.modelName }s from database')`);
        }

        let items = [];
        for (const item of itemsFromDb) {
            items.push(await this.populate(item));
        }
        cache.put(this.cacheKey, items, this.expirationTime * 60 * 1000);

        items.forEach(item => {
            if (item && !this.verifyInCache(item._id)) {
                throw new CacheError(`Failed to insert ${ this.modelName } with id '${ item._id }'`);
            }
        });

        return itemsFromDb;
    }

    /**
     * Verifies if an instance of the model with the given ID is in the cache.
     * @param {string} id - The ID of the instance to verify.
     * @returns {boolean} Returns true if the instance is in the cache, false otherwise.
     */
    static verifyInCache(id){
        const items = cache.get(this.cacheKey);
        return items.some(i => i._id === id);
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

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

}