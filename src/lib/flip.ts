// app/src/lib/flip.ts

// Overload 1: Object w/ primitive values
export function flip<T extends Record<string, Primitive>>(obj: T): FlipPrimitive<T>

// Overload 2: Object w/ object values
export function flip<T extends Record<string, Record<P, Primitive>>, P extends string,>(obj: T, prop: P): FlipByProp<T, P>

/**
 * @param obj The object that we are flipping keys and values
 * @param prop If the object's values are also an object then use this prop argument to let us know what attribute will be the key w/in the returned object
 * @returns Object that flips the keys and values
 */
export function flip(obj: Record<string, any>, prop?: string,): Record<string, string> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [prop ? value[prop] : value, key,])
  )
}


/** Primitive data type value */
type Primitive = string | number

/** Maps `{ foo: 1 }` → `{ "1": "foo" }` */
type FlipPrimitive<T extends Record<string, Primitive>> = {
  readonly [K in keyof T as `${T[K]}`]: K
}

/** Maps `{ foo: { id: 1 } }` → `{ "1": "foo" }` using prop `P` */
type FlipByProp<
  T extends Record<string, Record<P, Primitive>>,
  P extends string,
> = {
  readonly [K in keyof T as `${T[K][P]}`]: K
}
