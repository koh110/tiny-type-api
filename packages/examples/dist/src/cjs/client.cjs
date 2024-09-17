"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = client;
const client_1 = require("@tiny-type-api/client");
const universal_cjs_1 = require("./universal.cjs");
async function client(port) {
    const clients = (0, client_1.createClients)(universal_cjs_1.apis, `http://localhost:${port}`);
    const res = await clients['/api/user/:user_id'].POST.client({
        params: { user_id: 'user-id' },
        body: {
            name: 'user-name'
        }
    });
    if (res.status === 400) {
        console.error(res.status, res.body.status, res.body.reason);
        return;
    }
    if (res.status === 404) {
        console.error(res.status, res.body.status, res.body.reason);
        return;
    }
    if (!res.ok) {
        return;
    }
    console.log(res.status, res.body.id, res.body.name, res.body.email);
}
//# sourceMappingURL=client.cjs.map