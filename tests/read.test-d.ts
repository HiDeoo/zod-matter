import { expectTypeOf, test } from 'vitest'
import { z } from 'zod'

import { read } from '../src'

test('should read and return a typed front matter', () => {
  const schema = z.object({
    title: z.string(),
    date: z.date(),
    category: z.string().optional(),
  })

  const frontMatter = read('fixtures/multiple.md', schema)

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
