
class AppError extends Error{
    constructor(message , statusCode){
        super(message);

        this.statusCode = statusCode;

        /*
        If the code starts with '4' it's a user err , if it starts with '5' it's the server's err
        */
       this.status= `${statusCode}`.startsWith('4')?'fail':'error';

       /*
        (isOperational is typically true): These are expected, "trusted" errors that are a normal part of the application's runtime and should be handled gracefully. Examples include:
        Invalid user input (e.g., wrong password, missing field).
        A user not found in a database.
        Network failures or a service being temporarily unavailable.
        These errors do not necessarily mean the application is in an inconsistent state and generally do not warrant a process restart.
       */
      this.isOperational = true;

    //   Save where the error came from
    Error.captureStackTrace(this , this.constructor)
    }
}

export default AppError;