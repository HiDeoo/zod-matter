import matter from 'gray-matter'
import { type z, type AnyZodObject } from 'zod'

export function parse<
  TInput extends matter.Input,
  TSchema extends AnyZodObject,
  TOptions extends matter.GrayMatterOption<TInput, TOptions>
>(input: TInput | { content: TInput }, schema: TSchema, options?: TOptions): ZodMatterFile<TSchema, TInput> {
  return parseFrontMatter(schema, matter(input, options))
}

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
