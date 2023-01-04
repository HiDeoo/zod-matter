import { stripIndent } from 'common-tags'
import { expect, test } from 'vitest'

import { stringify } from '../src'

test('should re-export the stringify function', () => {
  const result = stringify('<h1>Hello world!</h1>', { title: 'Hello world' })

  expect(result).toBe(
    `${stripIndent`
      ---
      title: Hello world
      ---
      <h1>Hello world!</h1>\n\n
    `}\n`
  )
})
