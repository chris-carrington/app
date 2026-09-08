// app/src/mastery/onStudyGuideLoad.directive.ts

export default (el: HTMLDivElement) => {
  const sub = new URLSearchParams(window.location.search).get('sub')
  if (!sub) return
  el.querySelector(`a[href="/mastery/2025-class-b-study-guide?sub=${sub}"]`)?.classList.add('active')
}
