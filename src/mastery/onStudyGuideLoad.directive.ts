// app/src/mastery/onStudyGuideLoad.directive.ts

import { query } from '@hono-dom'
import { AppType } from '@src/index'
import { tabsEvents } from '@hono-tabs'
import { createRPC } from '@hono-api/fe'
import { bindAccordionItems } from '@hono-accordion'
import { dsMasteryMarkdownStudyGuideId } from '@src/dataStructures/masteryMarkdowns.ds'


export default (el: HTMLDivElement) => {
  const rpc = createRPC<AppType>()

  // IF the current route is on the study guide page (not youtube mastery)
  if (location.pathname === rpc.mastery[':id?'].$url({ param: { id: dsMasteryMarkdownStudyGuideId }}).pathname) {
    tabsEvents.on('tabChanged', async ({ id }) => {
      const elTabContent = query<HTMLDivElement>(`#tabs-content-${id}`).one()

      if (!elTabContent.innerText) {
        // start loading indicator
        elTabContent.innerHTML = '<img src="/img/loading.svg" alt="Loading..." />'

        // get api data
        const response = await rpc.api['study-guide'][':id'].$get({ param: { id } })
        const { html } = await response.json()

        // update html
        elTabContent.innerHTML = html

        // add click listeners
        bindAccordionItems(el)
      }

      // update url
      const url = rpc.mastery[':id?'].$url({ param: { id: dsMasteryMarkdownStudyGuideId } })
      url.searchParams.set('sub', id)
      history.replaceState(history.state, '', url.pathname + url.search)
    })
  }
}
