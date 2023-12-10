import type { Method, Routes, RouteParams, HasParamsInPath } from './type.js'

export type {
  RouteType,
  HasParamsInPath,
  RouteParams,
  DefinedType,
  RouteMethodType,
  Method
} from './type.js'

export function define<T>() {
  return (args: T) => args
}

export const methods: readonly Method[] = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH'
] as const

function addParams<T extends Routes<string>>(apis: T) {
  for (const [key, api] of Object.entries(apis)) {
    if (key.includes('/:')) {
      for (const method of Object.keys(api)) {
        // @ts-expect-error
        api[method].request.params = define<typeof key>()
      }
    }
  }
  return apis as {
    [key in keyof T & string]: {
      [methodKey in keyof T[key]]: (HasParamsInPath<key> extends true
        ? {
            request: {
              params: (params: RouteParams<key>) => RouteParams<key>
            }
          }
        : {}) &
        T[key][methodKey]
    }
  }
}

export function defineApis<T extends Routes<TKeys>, TKeys extends string>(
  apis: T
) {
  const paramsApi = addParams(apis)
  return { apis: paramsApi }
}
