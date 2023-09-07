/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { test } from 'vitest'
import type { RouteParams } from './type.js'

test('RouteParams', async () => {
  type P = RouteParams<'/api/user/:user_id/:user_name'>
  const params: P = {
    user_id: 'userId',
    user_name: 'userName'
  }
})

test('RouteParams: no params', async () => {
  type P = RouteParams<'/api/user'>
  const params: P = {}
})
