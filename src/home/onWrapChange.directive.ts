// app/src/home/onWrapChange.directive.ts

export default (el: HTMLElement) => {
  const onWrapChange = () => {
    const children = el.querySelectorAll('.step')

    if (children.length === 0) {
      el.classList.remove('wrapped')
      return
    }

    let wrapped = false
    const firstTop = children[0].getBoundingClientRect().top
  
    for (const child of children) {
      if (child.getBoundingClientRect().top > firstTop + 1) { // IF any child is lower than the first THEN the row has wrapped
        wrapped = true
        break
      }
    }

    el.classList.toggle('wrapped', wrapped)
  }

  (new ResizeObserver(onWrapChange)).observe(el);
}
