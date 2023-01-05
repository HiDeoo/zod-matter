import fs from 'node:fs'

import { expect, test } from 'vitest'
import { z, ZodError } from 'zod'

import { read } from '../src'

test('should read a valid front matter', () => {
  const frontMatter = read(
    'fixtures/multiple.md',
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

test('should read an empty front matter', () => {
  const path = 'fixtures/empty.md'
  const frontMatter = read(path, z.object({}))

  expect(frontMatter).toBeDefined()
  expect(frontMatter.isEmpty).toBe(true)
  expect(frontMatter.empty).toBe(fs.readFileSync(path, 'utf8'))
})

test('should read an input with no front matter', () => {
  const frontMatter = read('fixtures/none.md', z.object({}))

  expect(frontMatter).toBeDefined()
  expect(frontMatter.isEmpty).toBe(false)
})

test('should not read an invalid front matter', () => {
  expect(() =>
    read(
      'fixtures/multiple.md',
      z.object({
        title: z.string(),
        author: z.string(),
      })
    )
  ).toThrow(ZodError)
})

test('should return all properties from a gray-matter file', () => {
  const path = 'fixtures/basic.md'
  const frontMatter = read(
    path,
    z.object({
      title: z.string(),
    })
  )

  expect(frontMatter).toBeDefined()

  expect(frontMatter.data.title).toBe('Hello world')
  expect(frontMatter.content).toBe('\n# Hello world!\n')
  expect(frontMatter.excerpt).toBe('')
  expect(frontMatter.isEmpty).toBe(false)
  expect(frontMatter.empty).toBeUndefined()

  expect(frontMatter.language).toBe('yaml')
  expect(frontMatter.matter).toBe('\ntitle: Hello world')
  expect(frontMatter.orig).toStrictEqual(fs.readFileSync(path))
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
  const frontMatter = read(
    'fixtures/fancy.md',
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
