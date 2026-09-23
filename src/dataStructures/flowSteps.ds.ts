// app/src/dataStructures/flowSteps.ds.ts

import svgSmile from '@src/svg/smile.svg?raw'
import { safeArrayAccess } from '@safely-access'
import svgPayments from '@src/svg/payments.svg?raw'
import svgMenuBook from '@src/svg/menuBook.svg?raw'
import svgStarAward from '@src/svg/starAward.svg?raw'
import svgPersonAdd from '@src/svg/personAdd.svg?raw'
import svgStoreFront from '@src/svg/storeFront.svg?raw'
import svgSupervisor from '@src/svg/supervisor.svg?raw'
import svgConstruction from '@src/svg/construction.svg?raw'
import svgLineMagnifier from '@src/svg/lineMagnifier.svg?raw'
import { dsHomeForms } from '@src/dataStructures/homeForms.ds'
import svgToolsClipboard from '@src/svg/toolsClipboard.svg?raw'


export const dsFlowSteps: FlowStep[] = [
  {
    id: 'community',
    button: 'COMMUNITY',
    steps: [
      {
        icon: svgToolsClipboard,
        title: 'Request a Service',
        description: `Provide a <a href="#${safeArrayAccess(dsHomeForms, 0).id}" data-scroll="true">service request</a> that details the work you'd love done`
      },
      {
        icon: svgSmile,
        title: 'Quality at a Discount',
        description: 'Receive lovely results at a discount, thanks to our nonprofit grants'
      },
    ]
  },
  {
    id: 'apprentice',
    button: 'APPRENTICE',
    steps: [
      {
        icon: svgPersonAdd,
        title: 'Apply + Accept',
        description: `Provide your <a href="#${safeArrayAccess(dsHomeForms, 1).id}" data-scroll="true">application</a> and ace our interview process`
      },
      {
        icon: svgConstruction,
        title: 'Paid to Learn',
        description: 'Receive a salary, experience and guidance from skilled mentors'
      },
      {
        icon: svgMenuBook,
        title: 'Free Study Guide',
        description: `No signing up for a $1,000 course to get a study guide required`
      },
      {
        icon: svgStarAward,
        title: 'Pass State Exam',
        description: `Receive your general contractor's license`
      },
      {
        icon: svgStoreFront,
        title: 'Mentor / Owner',
        description: 'Be a Shasta Trades Mentor and/or start your own Business'
      },
    ]
  },
  {
    id: 'mentor',
    button: 'MENTOR',
    steps: [
      {
        icon: svgPersonAdd,
        title: 'Apply + Accept',
        description: 'Provide your <a href="#join-leadership">application</a> and ace our interview process'
      },
      {
        icon: svgSupervisor,
        title: 'Mentor',
        description: 'Lead projects, share wisdom and earn a competitive salary'
      },
    ]
  },
  {
    id: 'supporter',
    button: 'SUPPORTER',
    steps: [
      {
        icon: svgPayments,
        title: 'Support',
        description: 'Direct your donation to specific cohorts (tools, low income families, etc.)'
      },
      {
        icon: svgLineMagnifier,
        title: 'Impact Analytics',
        description: `Receive detailed, real-time reports, to monitor your contribution's impact`
      },
    ]
  }
]


export type FlowStep = {
  id: string,
  button: string,
  domSteps?: null | HTMLDivElement,
  domButton?: null | HTMLButtonElement,
  steps: {
    icon: string,
    title: string,
    description: string,
  }[]
}
