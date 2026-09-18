// app/src/mastery/queryStudyGuide.ts

import { md2html } from '@src/md/md2html'
import { dsStudyGuideSectionIdDefault, dsStudyGuideSectionIds } from '@src/dataStructures/studyGuideSections.ds'


export async function queryStudyGuide(id?: string) {
  const verifiedId = id && dsStudyGuideSectionIds.has(id)
    ? id
    : dsStudyGuideSectionIdDefault

  const md = await import(`./studyGuide2025_${verifiedId}.md?raw`)

  return {
    verifiedId,
    html: await md2html(md.default, { wrapTables: false, enableAccordion: true })
  }
}
