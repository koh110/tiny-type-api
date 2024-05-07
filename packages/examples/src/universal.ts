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
          body: define<{ id: string; name: string; email?: string }>()
        }
      }
    }
  },
  '/api/user/:user_id': {
    POST: {
      request: {
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
