export type Template = Parameters<typeof String.raw>

const knownTemplates = new WeakSet
export const isTemplate = (args: any[]): args is Template =>
  knownTemplates.has(args) || !!(
    Array.isArray(args[0]) &&
    !args[0].find(x => typeof x !== 'string') &&
    args[0].length === args.length &&
    knownTemplates.add(args[0])
  )

export const isAsString = (args: any[]): args is AsString =>
    isTemplate(args) || typeof args[0] === 'string'

export type AsTemplateOr<T> = Template | [T]
export type AsString = AsTemplateOr<string>

export function asString<I extends any[]>(input: I): (I extends AsString ? string : undefined) {
  return (
    !isAsString(input)
      ? undefined
      :
    isTemplate(input)
      ? String.raw(...input as Template)
      : input[0]
  ) as any
}

// Length-asserting array helpers
export function isNonEmpty<T>(input: T[]): input is [T, ...T[]] {
  return !isEmpty(input)
}

export function isEmpty<T>(input: T[]): input is [] {
  return !input.length
}


export type Fn<I=any, O=any> = (input: I) => O
export type FnInputOf<F extends Fn> = Parameters<F>[0]
export type FnPropsOf<F extends Fn> = Parameters<F>[0] extends {} ? Parameters<F>[0] : {}

import type { ASTNode } from 'graphql'

export function isAst<N extends ASTNode>(obj: any, kind: N["kind"]): obj is N {
  return obj?.kind === kind
}

export type UnionToIntersection<U> =
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never