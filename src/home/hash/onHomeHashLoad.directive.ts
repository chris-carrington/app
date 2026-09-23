// app/src/home/hash/onHomeHashLoad.directive.ts

import { defaultHashKey, parseHash, updateDOM } from './updateDOM'


export default (el: HTMLDivElement) => {
    const id = parseHash(window.location.hash) ?? defaultHashKey
    const hadHash = Boolean(window.location.hash)

    updateDOM(el, id, { scroll: hadHash }) // only scroll if a hash is present on reload
}
