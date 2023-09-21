"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apis = void 0;
const universal_1 = require("@tiny-type-api/universal");
exports.apis = (0, universal_1.defineApis)({
    '/api/user/:user_id': {
        POST: {
            request: {
                body: (0, universal_1.define)()
            },
            response: {
                200: {
                    body: (0, universal_1.define)()
                },
                400: {
                    body: (0, universal_1.define)()
                },
                404: {
                    body: (0, universal_1.define)()
                }
            }
        },
        PUT: {
            request: {
                form: (0, universal_1.define)()
            },
            response: {
                200: {
                    body: (0, universal_1.define)()
                }
            }
        }
    }
}).apis;
//# sourceMappingURL=universal.cjs.map