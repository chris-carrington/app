// app/npm/hono-tabs/tabs.tsx


import type { Child } from 'hono/jsx'
import { tabs } from '@hono-directives'


export function Tabs(props: TabsProps) {
  let initialIndex = props.tabs.findIndex((tab) => tab.isInitiallyActive)
  if (initialIndex < 0) initialIndex = 0

  return <>
    <div
      data-directive={tabs()}
      data-tabs={props.name ?? ''}
      data-tabs-variant={props.variant}
      class={`tabs tabs--${props.variant}`}
    >
      <div class="tabs__inner" role="tablist" aria-orientation="horizontal">
        {props.tabs.map((tab, i) => {
          const isActive = i === initialIndex

          return <>
            <div
              role="tab"
              id={idFor(props.name, 'tab', tab.id)}
              aria-selected={isActive ? 'true' : 'false'}
              aria-controls={idFor(props.name, 'tab-content', tab.id)}
              tabindex={isActive ? 0 : -1}
              class={isActive ? 'tabs__tab tabs__active' : 'tabs__tab'}
              data-tab-id={tab.id}
            >
              {tab.label}
            </div>
          </>
        })}
        <div class="tabs__marker" />
      </div>

      <div class="tabs__contents">
        {props.tabs.map((tab, i) => {
          const isActive = i === initialIndex

          return <>
            <div
              role="tabpanel"
              id={idFor(props.name, 'tab-content', tab.id)}
              aria-labelledby={idFor(props.name, 'tab', tab.id)}
              class={isActive ? 'tabs__content tabs__active' : 'tabs__content'}
            >
              {tab.content}
            </div>
          </>
        })}
      </div>
    </div>
  </>
}


/** `id`s are necessary for accessibility */
function idFor(name: string | undefined, prefix: string, id: string) {
  return `${prefix}-${name ? `${name}-` : ''}${id}`
}


export type TabsVariant = 'pill' | 'classic' | 'underline'


export type Tab = {
  /** Helpful for setting DOM id's and for knowing what tab is active when listening to tabsEvents  */
  id: string,
  /** Tab button label */
  label: Child
  /** Panel content, rendered on the server */
  content: Child
  /** Only the first tab flagged `true` wins; falls back to index 0 */
  isInitiallyActive?: boolean
}


export type TabsProps = {
  /** The tabs to render */
  tabs: Tab[]
  /** Optional, unique name for tabs, used to create dom id's, helpful when multiple tabs on same page */
  name?: string
  /** Optional, defaults to `pill`. `underline` is google style, `classic` is bootstrap style */
  variant?: TabsVariant
}
