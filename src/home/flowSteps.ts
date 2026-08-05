import svgSmile from '@src/svg/smile.svg?raw'
import svgMenuBook from '@src/svg/menuBook.svg?raw'
import svgStoreFront from '@src/svg/storeFront.svg?raw'
import svgStarAward from '@src/svg/starAward.svg?raw'
import svgPersonAdd from '@src/svg/personAdd.svg?raw'
import svgConstruction from '@src/svg/construction.svg?raw'
import svgToolsClipboard from '@src/svg/toolsClipboard.svg?raw'


export const flowSteps: FlowStep[] = [
  {
    id: 'community',
    button: 'COMMUNITY',
    steps: [
      {
        icon: svgToolsClipboard,
        title: 'Request a Service',
        description: `Provide a <a href="#service-request">service request</a> that details the work you'd love done`
      },
      {
        icon: svgSmile,
        title: 'Quality at a Discount',
        description: 'Receive professional results at a discount, thanks to our nonprofit grants'
      },
    ]
  },
  {
    id: 'apprentice',
    button: 'APPRENTICE',
    steps: [
      {
        icon: svgPersonAdd,
        title: 'Apply / Accepted',
        description: 'Provide your <a href="#join-leadership">application</a> to join our team of skilled tradespeople'
      },
      {
        icon: svgConstruction,
        title: 'Paid to Learn',
        description: `Receive guidance from experienced mentors and gain California exam experience hours`
      },
      {
        icon: svgMenuBook,
        title: 'Free Study Guide',
        description: 'Other courses charge over $1,000 to get their license study guide'
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
    steps: []
  },
  {
    id: 'supporter',
    button: 'SUPPORTER',
    steps: []
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
