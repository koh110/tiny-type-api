import { afterAll, test } from 'vitest'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { execFile } from 'node:child_process'

const rootCwd = resolve(fileURLToPath(import.meta.url), '../../')
const controller = new AbortController();

afterAll(() => {
//  controller.abort()
})

test('ECMAScript Modules', () => {
  return new Promise((resolve, reject) => {
    execFile('node', ['dist/src/server.js'], {
      cwd: rootCwd,
      encoding: 'utf-8',
      signal: controller.signal
    }, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }
      resolve(stdout)
    })
  })
})

test('CommonJS', () => {
  return new Promise((resolve, reject) => {
    execFile('node', ['dist/src/cjs/server.cjs'], {
      cwd: rootCwd,
      encoding: 'utf-8',
      signal: controller.signal
    }, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }
      resolve(stdout)
    })
  })
})
