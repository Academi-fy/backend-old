/**
 * @file errors.js - Class exporting error codes for different actions across the project.
 * @author Daniel Dopatka
 * @copyright 2023 Daniel Dopatka, Linus Bung
 */
export default {

    server: {
        document: {
            query: {
                failed: 4
            },
            creation: {
                failed: 5
            },
            update: {
                failed: 6
            },
            deletion: {
                failed: 7
            }
        }
    },
    socket: {
        messages: {
            parsing: {
                failed: {
                    unknownReason: 0,
                    invalidFormBody: 1,
                    unknownEvent: 2
                }
            }
        }
    }

}