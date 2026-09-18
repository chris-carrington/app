// app/npm/safe-access/safeObjectAccess.ts


/**
 * - `noUncheckedIndexedAccess` also applies to index signatures and `Record` types, typing `obj[key]` as `V | undefined` even when the key is known to exist
 * - This is correct for sparse/missing keys, but it forces `| undefined` noise (or `!` assertions) at every call site where the key is guaranteed
 * @example
```
const users: Record<string, User> = {};
console.log(users["alice"].name); // Runtime error: Cannot read property 'name' of undefined
```
* - `safeObjectAccess()` is unnecessary when the record value can legitimately be `undefined` (e.g. `Record<string, User | undefined>`)
* - `safeObjectAccess()` is recommended when a missing key indicates a bug (e.g. indexing a `Record<ColumnId, Row[]>`) and we want to fail loudly rather than silently skip
* - `safeObjectAccess()` provides compile time convenience w/o the boilerplate (we can destructure w/o if statement checks)
* - `safeObjectAccess()` provides runtime safety b/c it includes an `if` statement that throws when the value is `undefined`
* - 🚨 Do not use if the record legitimately maps keys to `undefined`
* - 🚨 Only distinguishes "missing" vs "present" by value, so a key explicitly set to `undefined` will also throw. If that distinction matters, use `key in rec` instead
* @param rec The `Record` (or any object with an index signature) we would love to get a value from
* @param key The key w/in the record that we would love to get a value for
* @returns typed record value
* @example
```
const tagsById = kanbanData[targetColumnId]
const aimColumnData = [...safeObjectAccess(kanbanData, targetColumnId)]
```
 */
export function safeObjectAccess<K extends PropertyKey, V>(rec: Readonly<Record<K, V>>, key: K): V {
  const v = rec[key]
  if (v === undefined) throw new RangeError(`missing key: ${String(key)}`)
  return v
}
