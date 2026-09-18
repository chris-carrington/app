// app/src/mastery/queryStudyGuide.ts

import { md2html } from '@src/md/md2html'


export async function queryStudyGuide(id?: string) {
  const verifiedId = id && studyGuideIds.has(id)
    ? id
    : defaultId

  const md = await import(`./studyGuide2025_${verifiedId}.md?raw`)

  return {
    verifiedId,
    html: await md2html(md.default, { wrapTables: false, enableAccordion: true })
  }
}


const defaultId = 'acronyms'


const studyGuideIds = new Set([
  defaultId,
  'random',
  'occupancy_classification',
])
