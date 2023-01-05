import { stripIndent } from 'common-tags'
import { expectTypeOf, test } from 'vitest'
import { z } from 'zod'

import { parse } from '../src'

test('should parse and return a typed front matter', () => {
  const schema = z.object({
    title: z.string(),
    date: z.date(),
    category: z.string().optional(),
  })

  const frontMatter = parse(
    stripIndent`
      ---
      title: Hello world
      date: 2023-01-03
      ---
      # Hello world!
    `,
    schema
  )

  expectTypeOf(frontMatter.data).toEqualTypeOf<z.infer<typeof schema>>()

  expectTypeOf(frontMatter.content).toBeString()
  expectTypeOf(frontMatter.excerpt).toEqualTypeOf<string | undefined>()
  expectTypeOf(frontMatter.isEmpty).toBeBoolean()
  expectTypeOf(frontMatter.empty).toEqualTypeOf<string | undefined>()

  expectTypeOf(frontMatter.language).toBeString()
  expectTypeOf(frontMatter.matter).toBeString()
  expectTypeOf(frontMatter.orig).toEqualTypeOf<string | Buffer>()
  expectTypeOf(frontMatter.stringify).toBeFunction()
})
