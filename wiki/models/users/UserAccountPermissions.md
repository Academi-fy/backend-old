**DIESE SEITE IST NOCH NICHT FORMATIERT** \
Sie ist nur ein Entwurf. 

## Permissions

```javascript

const permissions = {

    club: {
        creation: {
            execute: "club.creation.execute",
            suggest: "club.creation.suggest"
        },
        deletion: {
            execute: "club.deletion.execute",
            suggest: "club.deletion.suggest"
        },
        join: "club.join",
        leave: "club.leave",
        edit: {
            suggest: "club.edit.suggest",
            execute: "club.edit.execute"
        },
        administration: {
            suggestion: {
                creation: {
                    approve: "club.administration.creation.approve",
                    reject: "club.administration.creation.reject"
                },
                deletion: {
                    approve: "club.administration.suggestion.deletion.approve",
                    reject: "club.administration.suggestion.deletion.reject"
                },
                edit: {
                    approve: "club.administration.suggestion.edit.approve",
                    reject: "club.administration.suggestion.edit.reject"
                }
            }
        }
    },
    event: {
        ... TODO
    }

    ... TODO

}

```