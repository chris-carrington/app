// app/npm/drizzle-compose/index.ts


// Overload: w/ groupId → returns object keyed by groupId (placed first)
export function leftJoin<
  Row,
  ParentKey extends PropertyKey,
  GroupKey extends PropertyKey,
  Parent extends Record<string, any>,
  const Children extends readonly ChildConfig<Row, any, any>[]
>(
  rows: Row[],
  config: {
    parent: {
      id?: (row: Row) => PropertyKey,
      groupId: (row: Row) => GroupKey,
      shape: (row: Row) => Parent
    },
    children: Children
  }
): Record<GroupKey, FinalParent<Parent, Children>[]>


// Overload: w/o `groupId` → returns an array of parent objects, preserving the order they appear in the query
export function leftJoin<
  Row,
  ParentKey extends PropertyKey,
  Parent extends Record<string, any>,
  const Children extends readonly ChildConfig<Row, any, any>[]
>(
  rows: Row[],
  config: {
    parent: {
      id?: (row: Row) => PropertyKey,
      shape: (row: Row) => Parent
    },
    children: Children
  }
): FinalParent<Parent, Children>[]


// Implementation
/**
 * Flatten left‑joined rows into nested parent objects with arrays of children.
 *
 * This function takes the result of a Drizzle query that uses one or more
 * `LEFT JOIN`s and transforms it into a nested structure where each parent object
 * contains arrays of child objects (e.g., tasks with tags and assignees).
 *
 * Two overloads are provided:
 * 1. **With `groupId`** – returns an object keyed by the group value.
 * 2. **Without `groupId`** – returns a flat array of parent objects.
 *
 * The `prop` helper should be used inside `shape` functions to ensure values are
 * typed according to the Drizzle schema, including correct nullability.
 *
 * @template Row - The type of a flat row returned by the Drizzle select.
 * @template ParentKey - The type of the parent's unique key.
 * @template GroupKey - The type of the grouping key (only for grouped output).
 * @template Parent - The type of the parent object produced by `parent.shape`.
 * @template Children - The tuple of child relation configs.
 *
 * @param rows - The flat rows from a Drizzle `select` with left joins.
 * @param config.parent.id - (Optional) Callback that returns the unique identifier for a parent row. Defaults to `row => row.id`.
 * @param config.parent.groupId - (Optional) Callback that returns the grouping key.
 * @param config.parent.shape - Callback that creates the parent object (without children).
 * @param config.children - Array of child relation definitions.
 */
export function leftJoin<
  Row,
  GroupKey extends PropertyKey,
  Parent extends Record<string, any>,
  const Children extends readonly ChildConfig<Row, any, any>[]
>(
  rows: Row[],
  config: {
    parent: {
      id?: (row: Row) => PropertyKey,
      groupId?: (row: Row) => GroupKey,
      shape: (row: Row) => Parent
    }
    children: Children
  }
): Record<GroupKey, FinalParent<Parent, Children>[]> | FinalParent<Parent, Children>[] {
  const hasGrouping = config.parent.groupId !== undefined

  const idFn = config.parent.id ?? ((row: Row) => (row as any).id as PropertyKey)

  const groupMap = new Map<GroupKey | undefined, Map<PropertyKey, FinalParent<Parent, Children>>>()

  for (const row of rows) {
    const parentKey = idFn(row)
    const groupKey = hasGrouping ? config.parent.groupId!(row) : undefined

    let parentMap = groupMap.get(groupKey)
    if (!parentMap) {
      parentMap = new Map()
      groupMap.set(groupKey, parentMap)
    }

    let parent = parentMap.get(parentKey)
    if (!parent) {
      const scalarParent = config.parent.shape(row) as Parent
      const augmentedParent = { ...scalarParent } as FinalParent<Parent, Children>
      for (const child of config.children) {
        (augmentedParent as any)[child.prop] = []
      }
      parent = augmentedParent
      parentMap.set(parentKey, parent)
    }

    for (const child of config.children) {
      const childKey = child.id(row)
      if (childKey === null || childKey === undefined) continue

      const setProp = Symbol.for(`__set_${child.prop}`)
      const existingSet: Set<unknown> = (parent as any)[setProp] ?? new Set<unknown>();
      (parent as any)[setProp] = existingSet

      if (!existingSet.has(childKey)) {
        existingSet.add(childKey)
        const childObject = child.shape(row);
        (parent as any)[child.prop].push(childObject)
      }
    }
  }

  if (!hasGrouping) {
    const allParents: FinalParent<Parent, Children>[] = []
    for (const parentMap of groupMap.values()) {
      allParents.push(...parentMap.values())
    }
    return allParents as any
  }

  return Object.fromEntries(
    Array.from(groupMap.entries()).map(([groupKey, parentMap]) => [
      groupKey as GroupKey,
      Array.from(parentMap.values()),
    ])
  ) as any
}


type ChildConfig<Row, Prop extends string, Child> = {
  prop: Prop
  id: (row: Row) => unknown
  shape: (row: Row) => Child
}


type FinalParent<Parent, Children extends readonly ChildConfig<any, any, any>[]> = Parent & {
  [K in Children[number]['prop']]: Extract<Children[number], { prop: K }>['shape'] extends (
    row: any
  ) => infer Child
  ? Child[]
  : never
}


/**
 * - `LEFT JOIN` creates a row where columns from joined tables can be null, so **TypeScript sees these values as nullable even when the schema says NOT NULL**
 * - `prop()` asserts the original column's type by referencing the Drizzle column object, which knows whether the field is truly nullable or not
 *
 * @param value - The selected value from a row (may be `null` due to a `LEFT JOIN`)
 * @param column - A Drizzle column object thst contains the schema data type
 * @returns The value cast to the exact type inferred from the column's schema
 *
 * @example
  ```ts
  const firstName = prop(row.assigneeFirstName, Person.firstName)
  ```
 */
export function prop<C>(value: unknown, column: C): ExtractColumnData<C> {
  return value as ExtractColumnData<C>
}


/** Extract the data type from a Drizzle column object */
type ExtractColumnData<C> = C extends { _: { data: infer D; notNull: infer N } }
  ? N extends true ? D : D | null
  : never;

// ----------------------------------------------------------------------
// Helper: createParentShape
// ----------------------------------------------------------------------
/**
 * Create a parent‑shape builder that infers the row type from a query function.
 * @param queryFn - A function that returns a Drizzle query builder (e.g., `getBaseQuery`)
 * @returns An object with a `.fn()` method that takes the shape callback.
 */
export function createParentShape<Q extends (...args: any[]) => any>(queryFn: Q) {
  type Row = InferRow<Q>

  return {
    fn: <Parent>(shapeFn: (row: Row) => Parent) => shapeFn,
  }
}

// ----------------------------------------------------------------------
// Helper: createChildren
// ----------------------------------------------------------------------
/**
 * Create a children‑builder that infers the row type from a query function.
 * @param queryFn - A function that returns a Drizzle query builder.
 * @returns An object with a `.fn()` method that accepts a list of child configs.
 *          The configs are inferred as a tuple – no `as const` needed.
 */
export function createChildren<Q extends (...args: any[]) => any>(queryFn: Q) {
  type Row = InferRow<Q>

  return {
    fn: <const T extends readonly ChildConfig<Row, any, any>[]>(
      ...children: T
    ) => children,
  }
}

// ----------------------------------------------------------------------
// Type helpers (for convenience)
// ----------------------------------------------------------------------
export type InferRow<T extends (...args: any) => any> = Awaited<ReturnType<T>>[number]
export type InferQuery<T extends (...args: any) => any> = Awaited<ReturnType<T>>
