import 'gray-matter'

declare module 'gray-matter' {
  // https://github.com/jonschlinkert/gray-matter#returned-object
  interface GrayMatterFile<I extends matter.Input> {
    empty?: string
    isEmpty: boolean
  }
}
