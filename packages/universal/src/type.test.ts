import { test } from 'node:test'
import type { RouteParams } from './type.js'

test('RouteParams', async () => {
  type P = RouteParams<'/api/user/:user_id/:user_name'>
  // oxlint-disable-next-line no-unused-vars
  const params: P = {
    user_id: 'userId',
    user_name: 'userName'
  }
})

test('RouteParams: no params', async () => {
  type P = RouteParams<'/api/user'>
  // oxlint-disable-next-line no-unused-vars
  const params: P = {}
})
