import { defineApis, define } from '@tiny-type-api/universal';
// define apis
export const { apis } = defineApis({
    '/api/@me': {
        GET: {
            request: {
                headers: define()
            },
            response: {
                200: {
                    body: define()
                }
            }
        }
    },
    '/api/user/:user_id': {
        POST: {
            request: {
                body: define()
            },
            response: {
                200: {
                    body: define()
                },
                400: {
                    body: define()
                },
                404: {
                    body: define()
                }
            }
        },
        PUT: {
            request: {
                form: define()
            },
            response: {
                200: {
                    body: define()
                }
            }
        }
    },
    '/api/void': {
        PUT: {
            request: {},
            response: {
                200: {
                    body: define()
                }
            }
        }
    },
});
//# sourceMappingURL=universal.js.map