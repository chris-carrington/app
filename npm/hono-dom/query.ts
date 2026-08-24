// app/npm/hono-dom/query.ts

export function query<T_Element extends HTMLElement>(query: string): QueryBuilder<T_Element> {
  return new QueryBuilder<T_Element>(query);
}


class QueryBuilder<T_Element extends HTMLElement> {
  #root: HTMLElement | Document = document;
  #query: string;

  constructor(query: string) {
    this.#query = query;
  }

  /** Set the root element. */
  root(el: HTMLElement): this {
    this.#root = el;
    return this;
  }

  /** Get first match. */
  one(): T_Element {
    const el = this.#root.querySelector<T_Element>(this.#query);
    if (!el) throw new Error('❌ Not found: ' + this.#query);
    return el;
  }

  /** Get all matches. */
  many(): NodeListOf<T_Element> {
    const list = this.#root.querySelectorAll<T_Element>(this.#query);
    if (!list.length) throw new Error('❌ Not found: ' + this.#query);
    return list;
  }
}
