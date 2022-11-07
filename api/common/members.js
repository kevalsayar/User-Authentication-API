const Messages = {
    "calculate" : {
        "success" : {
            "addition-success" : "Numbers Added!",
            "multiplication-success" : "Numbers Multiplied!",
            "division-success" : "Numbers Divided!",
            "subtraction-success" : "Numbers Subtracted!"
        },
        "error" : {
            "insufficient-numbers" : "Add atmost two numbers!"
        }
    },
    "data" : {
        "success" : "Data Fetched!",
        "error" : "Error Faced!"
     },
     "user" : {
        "uuid-does-not-exist" : "uuid does not exist, try again!",
        "no-user-found" : "User email not found!",
        "login-success" : "Login completed successfully!",
        "wrong-password" : "Please enter the right password!",
        "email-password-both-necessary" : "Please enter both, email and password!",
        "user-exists" : "User already exists, Please login!"
     }
}

const REQUEST_CODE = {
    BAD_REQUEST: 400,
    SUCCESS: 200,
    INTERNAL_SERVER_ERROR: 500,
    ENTRY_ADDED: 201,
    UNAUTHORIZED_USER: 401
}

const STATUS = {
    TRUE: true,
    FALSE: false
}

module.exports = {
    REQUEST_CODE,
    Messages,
    STATUS
}