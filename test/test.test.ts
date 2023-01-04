import { stripIndent } from 'common-tags'
import { expect, test } from 'vitest'

import { test as testMatter } from '../src'

test('should re-export the test function', () => {
  expect(testMatter('<h1>Hello world!</h1>')).toBe(false)

  expect(
    testMatter(stripIndent`
      ---
      title: Hello world
      ---
      <h1>Hello world!</h1>
    `)
  ).toBe(true)
})
