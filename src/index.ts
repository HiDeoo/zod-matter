import matter from 'gray-matter'
import { type z, type AnyZodObject } from 'zod'

export function parseMatter<TSchema extends AnyZodObject, TInput extends matter.Input>(
  input: TInput,
  schema: TSchema
): ZodMatterFile<TSchema, TInput> {
  const { data, ...dataLessFile } = matter(input)

  return {
    ...dataLessFile,
    data: schema.parse(data),
  }
}

type ZodMatterFile<TSchema extends AnyZodObject, TInput extends matter.Input> = Omit<
  matter.GrayMatterFile<TInput>,
  'data'
> & {
  data: z.infer<TSchema>
}
