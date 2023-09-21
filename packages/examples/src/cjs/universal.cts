import { defineApis, define } from '@tiny-type-api/universal'

export const { apis } = defineApis({
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
  }
})
