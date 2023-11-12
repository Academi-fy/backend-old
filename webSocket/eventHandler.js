export function handleEvents(ws, data){

    switch (data.event) {

        case "MESSAGE_SEND":
            break;

        case "MESSAGE_EDIT":
            break;

        case "MESSAGE_DELETE":
            break;

        case "MESSAGE_REACTION_ADD":
            break;

        case "MESSAGE_REACTION_REMOVE":
            break;

        case "TYPING":
            break;

        case "POLL_VOTE":
            break;

        default:
            console.error(`Unknown event: ${ data.event }`);
            ws.send(
                JSON.stringify({
                    event: "ERROR",
                    payload: {
                        errorCode: 2,
                        errorMessage: `Unknown event: ${ data.event }`
                    }
                })
            );
    }

}