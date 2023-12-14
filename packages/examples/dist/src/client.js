import { createClients } from '@tiny-type-api/client';
import { apis } from './universal.js';
export async function client(port) {
    const clients = createClients(apis, `http://localhost:${port}`);
    const res = await clients['/api/user/:user_id'].POST.client({
        params: { user_id: 'user-id' },
        body: {
            name: 'user-name'
        }
    });
    console.log(res);
    const res2 = await clients['/api/void'].PUT.client({});
    console.log(res2);
}
//# sourceMappingURL=client.js.map