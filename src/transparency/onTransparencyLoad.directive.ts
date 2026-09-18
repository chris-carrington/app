// app/src/transparency/onTransparencyLoad.directive.ts

import { AppType } from '@src/index'
import { createRPC } from '@hono-api/fe'
import { bindAccordionItems } from '@hono-accordion'
import { query, type DatasetReturn } from '@hono-dom'
import { classNameMd, datasetId, idDownload } from '@src/lib/dom'


export default (el: HTMLDivElement) => {
  const idDataset = datasetId()

  const elContents = new Map<string, HTMLDivElement>()
  const elAnchors = query<HTMLAnchorElement>('a').root(el).many()
  const elDownload = query<HTMLDivElement>(idDownload().query).one()
  const elGithubAnchor = query<HTMLAnchorElement>('a:first-child').root(elDownload).one()
  const elPdfAnchor = query<HTMLAnchorElement>('a:last-child').root(elDownload).one()

  populateElContents(idDataset, elContents)
  addAnchorListeners(idDataset, elContents, elAnchors, elDownload, elGithubAnchor, elPdfAnchor)
}


function populateElContents(idDataset: DatasetReturn, elContents: Map<string, HTMLDivElement>) {
  for (const elContent of query<HTMLDivElement>(classNameMd().query + ' ' + idDataset.query()).many()) {
    const mdId = elContent.dataset[idDataset.camel]
    if (!mdId) throw new Error('!mdId')
    elContents.set(mdId, elContent)
  }
}


function addAnchorListeners(idDataset: DatasetReturn, elContents: Map<string, HTMLDivElement>, elAnchors: NodeListOf<HTMLAnchorElement>, elDownload: HTMLDivElement, elGithubAnchor: HTMLAnchorElement, elPdfAnchor: HTMLAnchorElement) {
  const rpc = createRPC<AppType>()

  for (const anchor of elAnchors) {
    const mdId = anchor.dataset[idDataset.camel]
    if (!mdId) throw new Error('!mdId')

    const elContent = elContents.get(mdId)
    if (!elContent) throw new Error('!elContent')

    anchor.addEventListener('click', async e => {
      e.preventDefault()

      if (!elContent.innerText) {
        // start loading indicator
        elContent.innerHTML = '<img src="/img/loading.svg" alt="Loading..." />'

        // get api data
        const response = await rpc.api.transparency[':id'].$get({ param: { id: mdId } })
        const { html } = await response.json()

        // update html
        elContent.innerHTML = html

        // add click listeners
        bindAccordionItems(elContent)
      }

      // update dom
      setAnchorClass(idDataset, elAnchors, mdId)
      setContentClass(idDataset, elContents, mdId)
      setDownloadAnchors(elDownload, elGithubAnchor, elPdfAnchor, mdId)

      // update url
      const url = rpc.transparency[':id?'].$url({ param: { id: mdId } })
      history.replaceState(history.state, '', url.pathname)
    })
  }
}


function setAnchorClass(idDataset: DatasetReturn, elAnchors: NodeListOf<HTMLAnchorElement>, activeMdId: string) {
  for (const anchor of elAnchors) {
    const domMdId = anchor.dataset[idDataset.camel]
    if (!domMdId) throw new Error('!domMdId')

    if (domMdId === activeMdId) {
      anchor.classList.add('orange')
      anchor.classList.remove('transparent')
    } else {
      anchor.classList.add('transparent')
      anchor.classList.remove('orange')
    }
  }
}


function setContentClass(idDataset: DatasetReturn, elContents: Map<string, HTMLDivElement>, activeMdId: string) {
  for (const [domMdId, elContent] of elContents) {
    const domMdId = elContent.dataset[idDataset.camel]
    if (!domMdId) throw new Error('!domMdId')

    elContent.classList.toggle('hidden', (domMdId !== activeMdId))
  }
}


function setDownloadAnchors(elDownload: HTMLDivElement, elGithubAnchor: HTMLAnchorElement, elPdfAnchor: HTMLAnchorElement, activeMdId: string) {
  elDownload.classList.toggle('hidden', (activeMdId === 'schema'))

  elGithubAnchor.setAttribute('href', `https://github.com/chris-carrington/app/blob/main/src/transparency/${activeMdId}.md`)

  elPdfAnchor.setAttribute('href', `/pdf/${activeMdId}.pdf`)
  elPdfAnchor.setAttribute('download', `${activeMdId}.pdf`)
}
