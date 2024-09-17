import { test, type TestContext } from 'node:test'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { execFile } from 'node:child_process'

const rootCwd = resolve(fileURLToPath(import.meta.url), '../../')
const controller = new AbortController();

test('ECMAScript Modules', (t: TestContext, done) => {
  execFile('node', ['dist/src/server.js'], {
    cwd: rootCwd,
    encoding: 'utf-8',
    signal: controller.signal
  }, (err, stdout, stderr) => {
    if (err) {
      done(err)
      return
    }
    done()
  })
})

test('CommonJS', (t: TestContext, done) => {
  execFile('node', ['dist/src/cjs/server.cjs'], {
    cwd: rootCwd,
    encoding: 'utf-8',
    signal: controller.signal
  }, (err, stdout, stderr) => {
    if (err) {
      done(err)
      return
    }
    done()
  })
})
