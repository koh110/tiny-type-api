import { test, before, mock, type TestContext } from 'node:test'
import { defineApis, define } from '@tiny-type-api/universal'
import { createClients, type Fetcher } from './index.ts'

// define apis
const { apis } = defineApis({
  '/api/@me': {
    GET: {
      request: {},
      response: {
        200: {
          body: define<string>()
        }
      }
    }
  },
  '/api/user/:user_id': {
    POST: {
      request: {
        headers: define<{ Authorization: `Bearer ${string}` }>(),
        body: define<{ name: string }>()
      },
      response: {
        200: {
          body: define<{
            id: string
            name: string
            email?: string
          }>()
        },
        400: {
          body: define<{
            status: 400
            reason: 'no body'
          }>()
        },
        404: {
          body: define<{
            status: 404
            reason: 'no user_id'
          }>()
        }
      }
    },
    PUT: {
      request: {
        form: define<{ icon: Blob }>()
      },
      response: {
        200: {
          body: define<void>()
        }
      }
    }
  },
  '/api/void': {
    PUT: {
      request: {},
      response: {
        200: {
          body: define<void>()
        }
      }
    }
  }
})

const clients = createClients(apis, 'https://localhost:8000')

before(() => {
  mock.method(globalThis, 'fetch', () => {
    return Promise.resolve({
      ok: true,
      status: 200,
      text: async () => ''
    } as Response)
  })
})

test('clients', async (t: TestContext) => {
  t.mock.reset()

  type Response = Awaited<ReturnType<typeof fetch>>

  const resMock = {
    ok: true,
    status: 200,
    text: async () => JSON.stringify({ name: 'user-name-response' })
  } satisfies Pick<Response, 'ok' | 'status' | 'text'>

  const requestMock = t.mock.method(globalThis, 'fetch', () => {
    return Promise.resolve(resMock as unknown as Response)
  })

  const res = await clients['/api/user/:user_id'].POST.client({
    headers: {
      Authorization: 'Bearer tokenxxx'
    },
    params: { user_id: 'user-id' },
    body: { name: 'user-name' }
  })

  t.assert.strictEqual(res.ok, true)
  t.assert.strictEqual(res.status, 200)
  t.assert.deepEqual(res.body, { name: 'user-name-response' })
  t.assert.strictEqual(requestMock.mock.callCount(), 1)
  t.assert.deepEqual(requestMock.mock.calls[0].arguments, [
    'https://localhost:8000/api/user/user-id',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer tokenxxx',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'user-name' })
    }
  ])
})

test('clients: void response body', async (t: TestContext) => {
  t.mock.reset()
  type Response = Awaited<ReturnType<typeof fetch>>

  const textFn = t.mock.fn(() => Promise.resolve(''))
  const resMock = {
    ok: true,
    status: 200,
    text: textFn
  } satisfies Pick<Response, 'ok' | 'status' | 'text'>

  const requestMock = t.mock.method(globalThis, 'fetch', () => {
    return Promise.resolve(resMock as unknown as Response)
  })

  const res = await clients['/api/void'].PUT.client({})

  t.assert.strictEqual(res.ok, true)
  t.assert.strictEqual(res.status, 200)
  t.assert.strictEqual(res.body, '')
  t.assert.strictEqual(requestMock.mock.callCount(), 1)
  t.assert.deepEqual(requestMock.mock.calls[0].arguments, [
    'https://localhost:8000/api/void',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }
  ])
  t.assert.strictEqual(textFn.mock.callCount(), 1)
})

test('clients: FormData', async (t: TestContext) => {
  t.mock.reset()

  type Response = Awaited<ReturnType<typeof fetch>>
  const resMock = {
    ok: true,
    status: 200,
    headers: {
      get: t.mock.fn(() => '64')
    },
    text: async () => 'user-name'
  } satisfies Pick<Response, 'ok' | 'status' | 'text'> & {
    headers: Pick<Response['headers'], 'get'>
  }

  const requestMock = t.mock.method(globalThis, 'fetch', () => {
    return Promise.resolve(resMock as unknown as Response)
  })

  const iconData = new Blob()

  const res = await clients['/api/user/:user_id'].PUT.client({
    params: { user_id: 'user-id' },
    form: { icon: iconData }
  })

  const formData = new FormData()
  formData.append('icon', iconData)
  t.assert.strictEqual(res.ok, true)
  t.assert.strictEqual(res.status, 200)
  t.assert.strictEqual(requestMock.mock.callCount(), 1)
  t.assert.deepEqual(requestMock.mock.calls[0].arguments, [
    'https://localhost:8000/api/user/user-id',
    {
      method: 'PUT',
      headers: {},
      body: formData
    }
  ])
  t.assert.deepEqual(
    Array.from(
      (requestMock.mock.calls[0].arguments[1]?.body as FormData).entries()
    ),
    Array.from(formData.entries())
  )
})

test('clients: custom fetcher', async (t: TestContext) => {
  t.mock.reset()

  const requestMock = t.mock.fn(global.fetch)

  const fetcher = t.mock.fn((options: Parameters<Fetcher>[0]) => {
    return Promise.resolve({
      ok: false,
      status: 200,
      body: options.url
    })
  })

  const res = await clients['/api/@me'].GET.client({
    fetcher: fetcher as Fetcher
  })

  t.assert.strictEqual(res.ok, false)
  t.assert.strictEqual(res.status, 200)
  t.assert.strictEqual(res.body, 'https://localhost:8000/api/@me')
  t.assert.strictEqual(requestMock.mock.callCount(), 0)
  t.assert.strictEqual(fetcher.mock.callCount(), 1)
  t.assert.deepEqual(fetcher.mock.calls[0].arguments, [
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://localhost:8000/api/@me'
    }
  ])
})
