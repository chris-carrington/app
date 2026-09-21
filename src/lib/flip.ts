// app/src/lib/flip.ts

type Primitive = string | number;

/** Maps `{ foo: 1 }` → `{ "1": "foo" }` */
type FlipPrimitive<T extends Record<string, Primitive>> = {
  readonly [K in keyof T as `${T[K]}`]: K;
};

/** Maps `{ foo: { id: 1 } }` → `{ "1": "foo" }` using prop `P` */
type FlipByProp<
  T extends Record<string, Record<P, Primitive>>,
  P extends string,
> = {
    readonly [K in keyof T as `${T[K][P]}`]: K;
  };

export function flip<T extends Record<string, Primitive>>(
  obj: T,
): FlipPrimitive<T>;
export function flip<
  T extends Record<string, Record<P, Primitive>>,
  P extends string,
>(obj: T, prop: P): FlipByProp<T, P>;
export function flip(
  obj: Record<string, any>,
  prop?: string,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      prop ? value[prop] : value,
      key,
    ]),
  );
}
