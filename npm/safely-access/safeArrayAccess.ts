// app/npm/safe-access/safeArrayAccess.ts


/**
 * - By default, TypeScript assumes that any array index or object key access returns a valid value, which is often not true at runtime. This can hide dangerous bugs
 * @example
  ```
  const users: Array<User> = [];
  console.log(users[0].name); // Runtime error: Cannot read property 'name' of undefined
  ```
 * - Enabling `noUncheckedIndexedAccess` in our `tsconfig` forces TypeScript to flag this by typing `users[0]` as `User | undefined`, making the potential error explicit
 * - `safeArrayAccess()` is unnecessary when we do not need the index w/in each loop, just use for..of b/c each const is typed w/o the `| undefined`
 * - `safeArrayAccess()` is recommended when we want the index w/in each loop
 * - `safeArrayAccess()` provides compile time convenience w/o the boilerplate (we can destructure w/o if statement checks)
 * - `safeArrayAccess()` provides runtime safety b/c it includes an if statement that throws when the array value is undefined
 * - 🚨 Do not use if array includes `undefined`
 * @param arr The array that we would love to get a value from
 * @param i The index w/in the array that we would love to get a value 
 * @returns typed array value
 * @example
  ```
  for (let i = 0; i < profiles.length; i++) {
    const { id, firstName, lastName } = safeArrayAccess(profiles, i)
  }
  ```
 */
export function safeArrayAccess<T>(arr: ArrayLike<T>, i: number): T {
  const v = arr[i]
  if (v === undefined) throw new RangeError(`index ${i} out of bounds`)
  return v
}
