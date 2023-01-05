import { stripIndent } from 'common-tags'
import { expect, test } from 'vitest'

import { stringify } from '../src'

test('should re-export the stringify function', () => {
  const result = stringify('# Hello world!', { title: 'Hello world' })

  expect(result).toBe(
    `${stripIndent`
      ---
      title: Hello world
      ---
      # Hello world!\n\n
    `}\n`
  )
})
