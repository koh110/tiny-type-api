export declare const apis: {
    "/api/user/:user_id": {
        POST: {
            request: {
                params: (params: {
                    user_id: string;
                }) => {
                    user_id: string;
                };
            };
        } & {
            request: {
                body: (args: {
                    name: string;
                }) => {
                    name: string;
                };
            };
            response: {
                200: {
                    body: (args: {
                        id: string;
                        name: string;
                        email?: string;
                    }) => {
                        id: string;
                        name: string;
                        email?: string;
                    };
                };
                400: {
                    body: (args: {
                        status: 400;
                        reason: "no body";
                    }) => {
                        status: 400;
                        reason: "no body";
                    };
                };
                404: {
                    body: (args: {
                        status: 404;
                        reason: "no user_id";
                    }) => {
                        status: 404;
                        reason: "no user_id";
                    };
                };
            };
        };
        PUT: {
            request: {
                params: (params: {
                    user_id: string;
                }) => {
                    user_id: string;
                };
            };
        } & {
            request: {
                form: (args: {
                    icon: Blob;
                }) => {
                    icon: Blob;
                };
            };
            response: {
                200: {
                    body: (args: void) => void;
                };
            };
        };
    };
};
