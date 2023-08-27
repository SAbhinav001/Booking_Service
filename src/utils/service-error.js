const {StatusCodes}  =require("http-status-codes")

class ServiceError extends Error {
    constructor(
        message= "something went wrong",
        explanation="service layer layer",
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        ) {
            super();
            this.name = 'serviceError',
            this.message = message,
            this.explanation = explanation,
            this.statusCode = statusCode

        }
}

module.exports = ServiceError