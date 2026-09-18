// app/src/dataStructures/masteryMarkdowns.ds.ts

import mdStudyGuide2025Faq from '@src/mastery/studyGuide2025Faq.md?raw'
import mdYoutubeUniversity from '@src/mastery/youtubeUniversity.md?raw'


export const dsMasteryMarkdownsDefault = { id: 'youtube-university', title: 'Youtube University', md: mdYoutubeUniversity, wrapTables: false, enableAccordion: true }

export const dsMasteryMarkdownStudyGuideId = '2025-class-b-study-guide'

export const dsMasteryMarkdowns = [
  dsMasteryMarkdownsDefault,
  { id: dsMasteryMarkdownStudyGuideId, title: '2025 Class B Study Guide', md: mdStudyGuide2025Faq, wrapTables: false, enableAccordion: true },
]
