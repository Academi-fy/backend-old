import yupSchemas from "./yupSchemas.js";

export function parseMessage(message){

    const object = JSON.parse(message);

    if(!("event" in object)) throw new Error("Invalid message: no event");
    if(!("payload" in object)) throw new Error("Invalid message: no payload");

    object.payload = yupSchemas[object.event].validateSync(object.payload);

    return object;
}