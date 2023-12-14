import http from 'http';
import express from 'express';
import { apis } from './universal.js';
import { client } from './client.js';
async function handler(req, res) {
    const api = apis['/api/user/:user_id']['POST'];
    // parse req.params
    if (!req.params.user_id) {
        const error = api.response[404].body({ status: 404, reason: 'no user_id' });
        return res.status(404).json(error);
    }
    const params = req.params; // @todo create parser
    // parser req.body
    if (!req.body) {
        const error = api.response[400].body({ status: 400, reason: 'no body' });
        return res.status(400).json(error);
    }
    const body = req.body; // @todo create parser
    // get email from database...
    const email = `${params.user_id}@example.jp`;
    // check response body type
    const resBody = api.response[200].body({
        id: params.user_id,
        name: body.name,
        email
    });
    return res.status(200).json(resBody);
}
const app = express();
app.use(express.json());
app.post('/api/user/:user_id', (req, res, next) => {
    handler(req, res).catch(next);
});
app.put('/api/void', (req, res, next) => {
    res.status(200).send();
});
app.use((err, req, res, next) => {
    res.status(500).send('internal server error');
});
const server = http.createServer(app).listen(process.env.PORT || 0, () => {
    const address = server?.address();
    console.log(address);
    if (!address)
        return console.error('server is not listening');
    const port = typeof address === 'string' ? address : address.port;
    client(port)
        .then(() => {
        process.exit(0);
    })
        .catch((err) => {
        console.log('err:', err);
        process.exit(1);
    });
});
//# sourceMappingURL=server.js.map