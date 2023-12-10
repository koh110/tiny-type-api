/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { beforeAll, vi, test, expect } from 'vitest'
import { defineApis, define } from '@tiny-type-api/universal'

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
  }
})

import { createClients } from './index.js'

const clients = createClients(apis, 'https://localhost:8000')

beforeAll(() => {
  global.fetch = vi.fn()
})

test('clients', async () => {
  const requestMock = vi.mocked(fetch).mockReset()
  type Response = Awaited<ReturnType<typeof fetch>>
  const resMock = {
    ok: true,
    status: 200,
    json: async () => ({ name: 'user-name' })
  } satisfies Pick<Response, 'ok' | 'status' | 'json'>
  requestMock.mockResolvedValue(resMock as Response)

  const res = await clients['/api/user/:user_id'].POST.client({
    headers: {
      Authorization: 'Bearer tokenxxx'
    },
    params: { user_id: 'user-id' },
    body: { name: 'user-name' }
  })

  expect(res.ok).toStrictEqual(true)
  expect(res.status).toStrictEqual(200)
  expect(requestMock).toBeCalledTimes(1)
  expect(requestMock).toBeCalledWith(
    'https://localhost:8000/api/user/user-id',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer tokenxxx',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'user-name' })
    }
  )
})

test('clients: FormData', async () => {
  const requestMock = vi.mocked(fetch).mockReset()
  type Response = Awaited<ReturnType<typeof fetch>>
  const resMock = {
    ok: true,
    status: 200,
    text: async () => 'user-name'
  } satisfies Pick<Response, 'ok' | 'status' | 'text'>
  requestMock.mockResolvedValue(resMock as Response)

  const iconData = new Blob()

  const res = await clients['/api/user/:user_id'].PUT.client({
    params: { user_id: 'user-id' },
    form: { icon: iconData }
  })

  const formData = new FormData()
  formData.append('icon', iconData)
  expect(res.ok).toStrictEqual(true)
  expect(res.status).toStrictEqual(200)
  expect(requestMock).toBeCalledTimes(1)
  expect(requestMock).toBeCalledWith(
    'https://localhost:8000/api/user/user-id',
    {
      method: 'PUT',
      headers: {},
      body: formData
    }
  )
  expect(
    Array.from((requestMock.mock.calls[0][1]?.body as FormData).entries())
  ).toStrictEqual(Array.from(formData.entries()))
})

test('clients: custom fetcher', async () => {
  const requestMock = vi.mocked(fetch).mockReset()

  const fetcher = vi.fn().mockImplementation(async (options) => {
    return {
      ok: false,
      status: 200,
      body: options.url
    }
  })

  const res = await clients['/api/@me'].GET.client({
    fetcher: fetcher
  })

  expect(res.ok).toStrictEqual(false)
  expect(res.status).toStrictEqual(200)
  expect(res.body).toStrictEqual('https://localhost:8000/api/@me')
  expect(requestMock).toBeCalledTimes(0)
  expect(fetcher).toBeCalledTimes(1)
  expect(fetcher).toBeCalledWith({
    url: 'https://localhost:8000/api/@me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
})
