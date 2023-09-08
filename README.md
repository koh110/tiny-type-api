# tiny-type-api

library for defining api interface server/client by TypeScript

[@tiny-type-api/universal](https://www.npmjs.com/package/@tiny-type-api/universal)

[![npm version](https://badge.fury.io/js/@tiny-type-api%2Funiversal.svg)](https://badge.fury.io/js/@tiny-type-api%2Funiversal)

[@tiny-type-api/client](https://www.npmjs.com/package/@tiny-type-api/client)

[![npm version](https://badge.fury.io/js/@tiny-type-api%2Fclient.svg)](https://badge.fury.io/js/@tiny-type-api%2Fclient)

## how to use

```javascript
// universal.ts
import { defineApis, define } from '@tiny-type-api/universal'

// define apis
export const { apis } = defineApis({
  '/api/@me': {
    GET: {
      request: {
        headers: define<{
          Authorization: `Bearer ${string}`
        }>()
      },
      response: {
        200: {
          body: define<{ id: string; name: string, email?: string }>()
        }
      }
    }
  },
  '/api/user/:user_id': {
    GET: {
      request: {},
      response: {
        200: {
          body: define<{ id: string; name: string }>()
        }
      }
    },
    POST: {
      request: {
        body: define<{ name: string }>()
      },
      response: {
        200: {
          body: define<{
            id: string;
            name: string;
            email?: string;
          }>()
        },
        400: {
          body: define<{
            status: 400,
            reason: 'no body'
          }>()
        },
        404: {
          body: define<{
            status: 404,
            reason: 'no user_id'
          }>()
        }
      }
    },
    PUT: {
      request: {
        // FormData
        form: define<{ icon: Blob }>()
      },
      response: {
        200: {
          body: define<void>()
        }
      }
    }
  }
})

---

// client.ts
import { createClients, type Fetcher } from '@tiny-type-api/client'
import { apis } from './universal.js'

const clients = createClients(apis, 'http://localhost:8000')

clients['/api/user/:user_id'].POST.client({
  params: { user_id: 'user-id' },
  body: {
    name: 'user-name'
  }
}).then((res) => {
  if (res.status === 400) {
    console.error(res.status, res.body.status, res.body.reason)
    return
  }
  if (res.status === 404) {
    console.error(res.status, res.body.status, res.body.reason)
    return
  }
  if (!res.ok) {
    return
  }
  console.log(res.status, res.body.id, res.body.name, res.body.email)
})

// send FormData
clients['/api/user/:user_id'].PUT.client({
  params: { user_id: 'user-id' },
  form: {
    icon: new Blob()
  }
}).then(console.log)

// use custom fetcher
const fetcher: Fetcher = async <T>(options: Parameters<Fetcher>[0]) => {
  const init: Parameters<typeof fetch>[1] = {
    method: options.method
  }

  if (options.body) {
    init.body =
      typeof options.body === 'string'
        ? options.body
        : JSON.stringify(options.body)
  }

  const res = await fetch(options.url, init)
  return res as T
}

clients['/api/user/:user_id'].POST.client({
  params: { user_id: 'user-id' },
  body: {
    name: 'user-name'
  },
  fetcher: fetcher
}).then(console.log)

---

// server.ts
import { apis } from './universal.js'

async function handler(req: Request, res: Response) {
  const api = apis['/api/user/:user_id']['POST']

  // parse req.params
  if (!req.params.user_id) {
    const error = api.response[404].body({ status: 404, reason: 'no user_id' })
    return res.status(404).json(error)
  }
  const params = req.params as ReturnType<typeof api.request.params> // @todo create parser

  // parser req.body
  if (!req.body) {
    const error = api.response[400].body({ status: 400, reason: 'no body' })
    return res.status(400).json(error)
  }
  const body = req.body as ReturnType<typeof api.request.body> // @todo create parser

  // get email from database...
  const email = `${params.user_id}@example.jp`

  // check response body type
  const resBody = api.response[200].body({ id: params.user_id, name: body.name, email })
  return res.status(200).json(resBody)
}
```

## how to exec example

```bash
$ npm install
$ npm run start:server -w @tiny-type-api/examples
$ npm run start:client -w @tiny-type-api/examples
```
