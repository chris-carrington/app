// app/src/objectives/bindShowObjectiveAddEditModal.directive.ts

import { dom } from '@dom'
import { urlFE } from '@src/url/urlFE'


export default (_: HTMLDivElement) => {
  const modal = dom<HTMLDivElement>('#objective-add-edit-modal').one()
  const showModalButtons = dom<HTMLButtonElement>('[data-show-modal]').many()
  const spanModalTitle = dom<HTMLSpanElement>('.header span').root(modal).one()
  const buttonSubmit = dom<HTMLButtonElement>('button[type="submit"]').root(modal).one()
  const inputTitle = dom<HTMLInputElement>('#text--objective-add-edit--title').root(modal).one()
  const selectColumn = dom<HTMLInputElement>('#select--objective-add-edit--column').root(modal).one()

  const imgEdit = getImg('/img/edit.svg', 'Edit objective')
  const imgLoading = getImg('/img/loading.svg', 'Edit objective modal loading')

  const clientRequest = urlFE().api.objective[':id']

  for (const button of showModalButtons) {
    const id = Number(button.dataset.showModal)

    button.addEventListener('click', async (e) => {
      if (!id) { // create
        inputTitle.value = ''
        modal.dataset.id = ''
        selectColumn.value = '1'
        spanModalTitle.innerText = buttonSubmit.innerText = 'Create Objective'
        buttonSubmit.disabled = false // temp
        modal.classList.remove('hidden')
      } else { // edit
        e.stopPropagation()

        // start loading indicator
        button.innerHTML = imgLoading

        // get objective from db
        const response = await clientRequest.$get({ param: { id: String(id) } })
        const res = await response.json()

        // add objective id to DOM
        modal.dataset.id = String(id)

        // set modal title / button label
        spanModalTitle.innerText = buttonSubmit.innerText = 'Edit Objective'

        // set form
        inputTitle.value = res.title
        selectColumn.value = String(res.columnId)

        buttonSubmit.disabled = true // temp

        // show modal
        modal.classList.remove('hidden')

        setTimeout(() => { // stop loading indicator
          button.innerHTML = imgEdit
        }, 120)
      }
    })
  }
}


function getImg(src: string, alt: string) {
  const imgLoading = document.createElement('img')
  imgLoading.setAttribute('src', src)
  imgLoading.setAttribute('alt', alt)
  return imgLoading.outerHTML
}
