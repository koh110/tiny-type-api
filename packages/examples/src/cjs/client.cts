import { createClients } from '@tiny-type-api/client'
import { apis } from './universal.cjs'

export async function client(port: string | number) {
  const clients = createClients(apis, `http://localhost:${port}`)

  const res = await clients['/api/user/:user_id'].POST.client({
    params: { user_id: 'user-id' },
    body: {
      name: 'user-name'
    }
  })

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
}
