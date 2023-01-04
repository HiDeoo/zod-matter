import matter from 'gray-matter'
import { type z, type AnyZodObject } from 'zod'

export function parseMatter<TSchema extends AnyZodObject, TInput extends matter.Input>(
  input: TInput,
  schema: TSchema
): ZodMatterFile<TSchema, TInput> {
  const grayMatterFile = matter(input)
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
