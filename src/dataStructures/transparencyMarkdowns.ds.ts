// app/src/dataStructures/transparencyMarkdowns.ds.ts

import schema from '@src/transparency/schema.md?raw'
import byLaws from '@src/transparency/bylaws.md?raw'
import byLawsFaq from '@src/transparency/bylaws-faq.md?raw'
import trustDocumentFaq from '@src/transparency/trust-document-faq.md?raw'
import trustDocument from '@src/transparency/trust-document.md?raw'
import whistleblowerPolicy from '@src/transparency/whistleblower-policy.md?raw'
import whistleblowerPolicyFaq from '@src/transparency/whistleblower-policy-faq.md?raw'
import articlesOfIncorporation from '@src/transparency/articles-of-incorporation.md?raw'
import conflictOfInterestPolicy from '@src/transparency/conflict-of-interest-policy.md?raw'
import articlesOfIncorporationFaq from '@src/transparency/articles-of-incorporation-faq.md?raw'
import conflictOfInterestPolicyFaq from '@src/transparency/conflict-of-interest-policy-faq.md?raw'


export const dsTransparencyMarkdownsDefault = { id: 'trust-document', title: 'Trust Document', md: [trustDocumentFaq, trustDocument], wrapTables: false, enableAccordion: true }

export const dsTransparencyMarkdowns = [
  dsTransparencyMarkdownsDefault,
  { id: 'bylaws', title: 'Bylaws', md: [byLawsFaq, byLaws], wrapTables: false, enableAccordion: true },
  { id: 'articles-of-incorporation', title: 'Articles of Incorporation', md: [articlesOfIncorporationFaq, articlesOfIncorporation], wrapTables: true, enableAccordion: true },
  { id: 'conflict-of-interest-policy', title: 'Conflict of Interest Policy', md: [conflictOfInterestPolicyFaq, conflictOfInterestPolicy], wrapTables: true, enableAccordion: true },
  { id: 'whistleblower-policy', title: 'Whistleblower Policy', md: [whistleblowerPolicyFaq, whistleblowerPolicy], wrapTables: false, enableAccordion: true },
  { id: 'schema', title: 'Schema', md: schema, wrapTables: true, enableAccordion: true },
]

export type DsTransparencyMarkdowns = typeof dsTransparencyMarkdowns[number]
