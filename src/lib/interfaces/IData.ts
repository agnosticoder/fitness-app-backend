export type Data =
    | { data: any, code: 200} // GET request with data - OK
    | { data: any, code: 201} //in case of POST - Created
    | { code: 202 } // in case of PUT - Accepted
    | { code: 204 } // useful to upadate cache or put request(update an move on) - No Content
    | { error: string, code: 400 } // malformed request - Bad Request
    | { error: string, code: 401 } // client must authenticate - Unauthorized
    | { error: string, code: 403 } // server know the client but content is forbidden (unauthorized) - Forbidden
    | { error: string, code: 404 } // resource not found - Not Found
    | { error: string, code: 405 } // does recogonize method but target resource does not support it - Method Not Allowed
    | { error: string, code: 409 } //in case of put request - Conflict
    | { error:string, code: 500 } // server error - Internal Server Error
    | { error: string, code: 501 } //in case of delete request - Not Implemented
    | { error: string, code: 503 }; //server down for maintenance, user friendly page should be shown - Service Unavailable