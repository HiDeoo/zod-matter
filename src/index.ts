import matter from 'gray-matter'
import { type z, type AnyZodObject } from 'zod'

/**
 * Extracts and parses front matter according to the given Zod schema.
 *
 * @example
 * ```ts
 * import { parse } from 'zod-matter'
 * import { z } from 'zod'
 *
 * const frontMatter = parse(
 *   input,
 *   z.object({
 *     author: z.string(),
 *     date: z.date(),
 *     category: z.string().optional(),
 *   })
 * )
 * ```
 *
 * @param input - The string, buffer or object with a `content` property to parse.
 * @param schema - The Zod schema to use to parse the front matter.
 * @param options - The gray-matter options to use.
 */
export function parse<
  TInput extends matter.Input,
  TSchema extends AnyZodObject,
  TOptions extends matter.GrayMatterOption<TInput, TOptions>
>(input: TInput | { content: TInput }, schema: TSchema, options?: TOptions): ZodMatterFile<TSchema, TInput> {
  return parseFrontMatter(schema, matter(input, options))
}

/**
 * Extracts and parses front matter from a file according to the given Zod schema.
 *
 * @example
 * ```ts
 * import { read } from 'zod-matter'
 * import { z } from 'zod'
 *
 * const frontMatter = read(
 *   path,
 *   z.object({
 *     author: z.string(),
 *     date: z.date(),
 *     category: z.string().optional(),
 *   })
 * )
 * ```
 *
 * @param path - The path to the file to read and parse.
 * @param schema - The Zod schema to use to parse the front matter.
 * @param options - The gray-matter options to use.
 */
export function read<TSchema extends AnyZodObject, TOptions extends matter.GrayMatterOption<string, TOptions>>(
  path: string,
  schema: TSchema,
  options?: TOptions
): ZodMatterFile<TSchema, string> {
  return parseFrontMatter(schema, matter.read(path, options))
}

export const stringify = matter.stringify

export const test = matter.test

function parseFrontMatter<TInput extends matter.Input, TSchema extends AnyZodObject>(
  schema: TSchema,
  grayMatterFile: matter.GrayMatterFile<TInput>
): ZodMatterFile<TSchema, TInput> {
  const { data, ...dataLessGrayMatterFile } = grayMatterFile

  const zodMatterFile = {
    ...dataLessGrayMatterFile,
    data: schema.parse(data),
  }

  addNonEnumerableProperty(zodMatterFile, 'language', grayMatterFile.language)
  addNonEnumerableProperty(zodMatterFile, 'matter', grayMatterFile.matter)
  addNonEnumerableProperty(zodMatterFile, 'orig', grayMatterFile.orig)
  addNonEnumerableProperty(zodMatterFile, 'stringify', grayMatterFile.stringify)

  return zodMatterFile
}

function addNonEnumerableProperty(object: object, key: string, value: unknown) {
  Object.defineProperty(object, key, {
    configurable: true,
    enumerable: false,
    value,
    writable: true,
  })
}

type ZodMatterFile<TSchema extends AnyZodObject, TInput extends matter.Input> = Omit<
  matter.GrayMatterFile<TInput>,
  'data'
> & {
  data: z.infer<TSchema>
}
