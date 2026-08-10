// app/src/json/serviceRequest.json.ts

import svgTree from '@src/svg/tree.svg?raw'
import svgDoor from '@src/svg/door.svg?raw'
import svgRoof from '@src/svg/roof.svg?raw'
import svgTile from '@src/svg/tile.svg?raw'
import svgFence from '@src/svg/fence.svg?raw'
import svgFaucet from '@src/svg/faucet.svg?raw'
import svgWindow from '@src/svg/window.svg?raw'
import svgStairs from '@src/svg/stairs.svg?raw'
import svgGarage from '@src/svg/garage.svg?raw'
import svgDrywall from '@src/svg/drywall.svg?raw'
import svgPlumbing from '@src/svg/plumbing.svg?raw'
import svgShoveling from '@src/svg/shoveling.svg?raw'
import svgSpoonFork from '@src/svg/spoonFork.svg?raw'
import svgElectrical from '@src/svg/electrical.svg?raw'


export const jsonServiceRequest = [
  {
    value: 'bathroom',
    icon: svgFaucet,
    label: 'Bathroom',
    description: `We'll turn your bathroom into a spa-like retreat with elegant tile work, new vanity installations and/or shower system upgrades that maximize both style and function`
  },
  {
    value: 'carpentry',
    icon: svgTree,
    label: 'Carpentry',
    description: `We'll turn lumber yard wood or wood that's headed to the landfill into beauty (tables, planters, etc.,)`
  },
  {
    value: 'concrete',
    icon: svgShoveling,
    label: 'Concrete',
    description: `We'll create lasting foundations and surfaces with expert slab pouring, decorative stamped concrete patios and/or crack repairs that restore strength and appearance`
  },
  {
    value: 'decks',
    icon: svgStairs,
    label: 'Decks',
    description: `We'll create your dream outdoor living space with custom deck designs, sturdy railing installations and/or premium wood sealing for years of backyard enjoyment`
  },
  {
    value: 'doors',
    icon: svgDoor,
    label: 'Doors',
    description: `We'll enhance your home's security and curb appeal with custom door installations, precise hardware alignment and/or weather stripping that seals out the elements`
  },
  {
    value: 'drywall',
    icon: svgDrywall,
    label: 'Drywall',
    description: `We'll get your walls looking flawless with seamless patchwork, full room installations and/or custom texture matching that blends perfectly with existing surfaces`
  },
  {
    value: 'electrical',
    icon: svgElectrical,
    label: 'Electrical',
    description: `We'll brighten your home by installing new lighting, upgrading outdated outlets and/or safely running wiring for ceiling fans or home theaters`
  },
  {
    value: 'fence',
    icon: svgFence,
    label: 'Fencing',
    description: `We'll install new fencing or address issues like structural instability, material decay, and/or hardware failures`
  },
  {
    value: 'flooring',
    icon: svgTile,
    label: 'Flooring',
    description: `We'll refresh every step of your home with eco friendly bamboo, durable vinyl and/or cozy carpet`
  },
  {
    value: 'kitchen-remodeling',
    icon: svgSpoonFork,
    label: 'Kitchen',
    description: `We'll transform your kitchen into a culinary showpiece with custom cabinet installation, modern countertop upgrades and/or efficient appliance hookups that flow perfectly`
  },
  {
    value: 'plumbing',
    icon: svgPlumbing,
    label: 'Plumbing',
    description: `We'll clear stubborn clogs, repair leaky faucets and/or upgrade everything`
  },
  {
    value: 'roofing',
    icon: svgRoof,
    label: 'Roofing',
    description: `We'll protect your home from the elements with thorough leak repairs, shingle installation or metal installation`
  },
  {
    value: 'siding',
    icon: svgGarage,
    label: 'Siding',
    description: `We'll restore your home's exterior protection with seamless siding replacements, rot damage fixes and/or color-matched installations that boost curb appeal`
  },
  {
    value: 'tiling',
    icon: svgTree,
    label: 'Tiling',
    description: `We'll add stunning visual appeal with custom backsplash designs, luxurious shower tile installations and/or durable floor tiling that stands up to heavy traffic`
  },
  {
    value: 'windows',
    icon: svgWindow,
    label: 'Windows',
    description: `We'll improve your home's efficiency and beauty with seamless glass replacements, stuck window fixes and/or new energy-efficient window installations`
  }
]
