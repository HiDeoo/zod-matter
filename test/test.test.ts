import { stripIndent } from 'common-tags'
import { expect, test } from 'vitest'

import { test as testMatter } from '../src'

test('should re-export the test function', () => {
  expect(testMatter('# Hello world!')).toBe(false)

  expect(
    testMatter(stripIndent`
      ---
      title: Hello world
      ---
      # Hello world!
    `)
  ).toBe(true)
})
