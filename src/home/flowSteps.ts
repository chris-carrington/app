import svgSmile from '@src/svg/smile.svg?raw'
import svgPayments from '@src/svg/payments.svg?raw'
import svgMenuBook from '@src/svg/menuBook.svg?raw'
import svgStarAward from '@src/svg/starAward.svg?raw'
import svgPersonAdd from '@src/svg/personAdd.svg?raw'
import svgStoreFront from '@src/svg/storeFront.svg?raw'
import svgSupervisor from '@src/svg/supervisor.svg?raw'
import svgConstruction from '@src/svg/construction.svg?raw'
import svgBarLineChart from '@src/svg/barLineChart.svg?raw'
import svgLineMagnifier from '@src/svg/lineMagnifier.svg?raw'
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
        description: 'Provide your <a href="#join-leadership">application</a> & join our team of skilled tradespeople'
      },
      {
        icon: svgConstruction,
        title: 'Paid to Learn',
        description: 'Receive guidance from experienced mentors and gain California exam experience hours'
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
    steps: [
      {
        icon: svgPersonAdd,
        title: 'Apply + Accept',
        description: 'Provide your <a href="#join-leadership">application</a> & join our team of skilled mentors'
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
        description: 'Direct your donation to specific trade programs (tools, apprentices, low income families, etc.)'
      },
      {
        icon: svgBarLineChart,
        title: 'Track Spending',
        description: 'Monitor how your contribution is used in real-time'
      },
      {
        icon: svgLineMagnifier,
        title: 'Impact Analytics',
        description: 'Receive detailed reports on the community value and careers created thanks to your support'
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
