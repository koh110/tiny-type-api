/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { test, expect } from 'vitest'
import { defineApis, define } from './index.js'

const { apis } = defineApis({
  '/api/user': {
    GET: {
      request: {},
      response: {
        200: {
          body: define<void>()
        }
      }
    }
  },
  '/api/user/:user_id': {
    GET: {
      request: {},
      response: {
        200: {
          body: define<void>()
        }
      }
    },
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

test('added params function', async () => {
  expect(apis['/api/user/:user_id'].GET.request.params({ user_id: '1' }).user_id).toStrictEqual('1')
})


test('no params function', async () => {
  expect((apis['/api/user'].GET.request as any).params).toStrictEqual(undefined)
})
