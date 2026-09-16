// app/src/mastery/onStudyGuideLoad.directive.ts

export default (el: HTMLDivElement) => {
  if (window.location.pathname !== '/mastery/2025-class-b-study-guide') return
  const sub = new URLSearchParams(window.location.search).get('sub') ?? 'acronyms'
  el.querySelector(`a[href="/mastery/2025-class-b-study-guide?sub=${sub}"]`)?.classList.add('active')
}
