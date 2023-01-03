import { stripIndent } from 'common-tags'
import { describe, expect, test } from 'vitest'
import { z, ZodError } from 'zod'

import { parseMatter } from '../src'

describe('parse', () => {
  test('should parse a valid front matter', () => {
    const input = stripIndent`
      ---
      title: Hello world
      date: 2023-01-03
      ---

      <h1>Hello world!</h1>
    `

    const frontMatter = parseMatter(
      input,
      z.object({
        title: z.string(),
        date: z.date(),
        category: z.string().optional(),
      })
    )

    expect(frontMatter).toBeDefined()

    expect(frontMatter.data.title).toBe('Hello world')
    expect(frontMatter.data.date).toBeInstanceOf(Date)
    expect(frontMatter.data.category).toBeUndefined()
  })

  test('should parse an empty front matter', () => {
    const input = stripIndent`
      ---
      ---

      <h1>Hello world!</h1>
    `

    const frontMatter = parseMatter(input, z.object({}))

    expect(frontMatter).toBeDefined()
  })

  test('should parse an input with no front matter', () => {
    const input = stripIndent`
      <h1>Hello world!</h1>
    `

    const frontMatter = parseMatter(input, z.object({}))

    expect(frontMatter).toBeDefined()
  })

  test('should not parse an invalid front matter', () => {
    const input = stripIndent`
      ---
      author: HiDeoo
      ---

      <h1>Hello world!</h1>
    `

    expect(() =>
      parseMatter(
        input,
        z.object({
          title: z.string(),
          author: z.string(),
        })
      )
    ).toThrow(ZodError)
  })
})
