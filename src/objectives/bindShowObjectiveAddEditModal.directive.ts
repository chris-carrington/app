// app/src/objectives/bindShowObjectiveAddEditModal.directive.ts

import { query } from '@hono-dom'
import { urlFE } from '@src/url/urlFE'
import { idObjectiveAddEditModal, idObjectiveAddEditModalTitle, idObjectiveAddEditModalSubmit, fieldObjectiveAddEditTitle, fieldObjectiveAddEditColumn, datasetObjectiveAddEditShowModal } from '@src/lib/dom'


export default (_: HTMLDivElement) => {
  const datasetShowModal = datasetObjectiveAddEditShowModal()

  const modal = query<HTMLDivElement>(idObjectiveAddEditModal().query).one()
  const showModalButtons = query<HTMLButtonElement>(datasetShowModal.query()).many()
  const spanModalTitle = query<HTMLSpanElement>(idObjectiveAddEditModalTitle().query).root(modal).one()
  const buttonSubmit = query<HTMLButtonElement>(idObjectiveAddEditModalSubmit().query).root(modal).one()
  const inputTitle = query<HTMLInputElement>(fieldObjectiveAddEditTitle().query).root(modal).one()
  const selectColumn = query<HTMLInputElement>(fieldObjectiveAddEditColumn().query).root(modal).one()

  const imgEdit = getImg('/img/edit.svg', 'Edit objective')
  const imgLoading = getImg('/img/loading.svg', 'Edit objective modal loading')

  const clientRequest = urlFE().api.objective[':id']

  for (const button of showModalButtons) {
    const id = Number(button.dataset[datasetShowModal.camel])

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
