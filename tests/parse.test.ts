import { stripIndent } from 'common-tags'
import { expect, test } from 'vitest'
import { z, ZodError } from 'zod'

import { parse } from '../src'

test('should parse a valid front matter', () => {
  const input = stripIndent`
    ---
    title: Hello world
    date: 2023-01-03
    ---
    # Hello world!
  `

  const frontMatter = parse(
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
    # Hello world!
  `

  const frontMatter = parse(input, z.object({}))

  expect(frontMatter).toBeDefined()
  expect(frontMatter.isEmpty).toBe(true)
  expect(frontMatter.empty).toBe(input)
})

test('should parse an input with no front matter', () => {
  const input = `# Hello world!`

  const frontMatter = parse(input, z.object({}))

  expect(frontMatter).toBeDefined()
  expect(frontMatter.isEmpty).toBe(false)
})

test('should not parse an invalid front matter', () => {
  const input = stripIndent`
    ---
    author: HiDeoo
    ---
    # Hello world!
  `

  expect(() =>
    parse(
      input,
      z.object({
        title: z.string(),
        author: z.string(),
      })
    )
  ).toThrow(ZodError)
})

test('should return all properties from a gray-matter file', () => {
  const input = stripIndent`
    ---
    title: Hello world
    ---
    # Hello world!
  `

  const frontMatter = parse(
    input,
    z.object({
      title: z.string(),
    })
  )

  expect(frontMatter).toBeDefined()

  expect(frontMatter.data.title).toBe('Hello world')
  expect(frontMatter.content).toBe('# Hello world!')
  expect(frontMatter.excerpt).toBe('')
  expect(frontMatter.isEmpty).toBe(false)
  expect(frontMatter.empty).toBeUndefined()

  expect(frontMatter.language).toBe('yaml')
  expect(frontMatter.matter).toBe('\ntitle: Hello world')
  expect(frontMatter.orig).toStrictEqual(Buffer.from(input))
  expect(typeof frontMatter.stringify).toBe('function')

  // Debugging properties should be non-enumerable.
  const enumerableProperties = Object.keys(frontMatter)
  expect(Object.getOwnPropertyNames(frontMatter).filter((property) => !enumerableProperties.includes(property)))
    .toMatchInlineSnapshot(`
      [
        "language",
        "matter",
        "orig",
        "stringify",
      ]
    `)
})

test('should support gray-matter options', () => {
  const input = stripIndent`
    ~~~
    {
      "title": "Hello world"
    }
    ~~~
    This is an excerpt.
    <!-- content -->
    # Hello world!
  `

  const frontMatter = parse(
    input,
    z.object({
      title: z.string(),
    }),
    {
      delimiters: '~~~',
      engines: {
        json: JSON.parse,
      },
      excerpt: true,
      excerpt_separator: '<!-- content -->',
      language: 'json',
    }
  )

  expect(frontMatter.data.title).toBe('Hello world')
  expect(frontMatter.excerpt).toBe('This is an excerpt.\n')
})

test('should parse a valid front matter in a buffer', () => {
  const input = Buffer.from(stripIndent`
    ---
    title: Hello world
    ---
    # Hello world!
  `)

  const frontMatter = parse(
    input,
    z.object({
      title: z.string(),
    })
  )

  expect(frontMatter).toBeDefined()

  expect(frontMatter.data.title).toBe('Hello world')
})

test('should parse a valid front matter in an object with a content property', () => {
  const input = {
    content: stripIndent`
      ---
      title: Hello world
      ---
      # Hello world!
    `,
  }

  const frontMatter = parse(
    input,
    z.object({
      title: z.string(),
    })
  )

  expect(frontMatter).toBeDefined()

  expect(frontMatter.data.title).toBe('Hello world')
})
