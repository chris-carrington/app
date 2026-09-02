// app/src/objectives/ObjectiveInUpShowModal.ts

import { query, type FieldReturn } from '@hono-dom'
import { QueryObjective } from '@src/db/queryObjective'
import { ObjectiveController } from '@src/objectives/ObjectiveController'
import { datasetId, idObjectiveInUpModalTitle, idObjectiveInUpModalSubmit, fieldObjectiveInUpTitle, fieldObjectiveInUpColumnId, fieldObjectiveInUpDescription, fieldObjectiveInUpAssigneeIds, fieldObjectiveInUpTagIds, datasetObjectiveInUpShowModal, idObjectiveInUpModalMdToggle, idObjectiveInUpModalMd } from '@src/lib/dom'



export class ObjectiveInUpShowModal {
  divMd: HTMLDivElement
  inputTitle: HTMLInputElement
  selectColumn: HTMLInputElement
  spanModalTitle: HTMLSpanElement
  buttonSubmit: HTMLButtonElement
  inputMdToggle: HTMLInputElement
  fieldsetTags: HTMLFieldSetElement
  controller: ObjectiveController
  fieldTags = fieldObjectiveInUpTagIds()
  tagCheckboxes: HTMLInputElement[] = []
  fieldsetAssignees: HTMLFieldSetElement
  textareaDescription: HTMLTextAreaElement
  errorMessages: NodeListOf<HTMLDivElement>
  assigneeCheckboxes: HTMLInputElement[] = []
  fieldAssignees = fieldObjectiveInUpAssigneeIds()
  showModalButtons: NodeListOf<HTMLButtonElement>
  objective: QueryObjective | undefined = undefined
  datasetShowModal = datasetObjectiveInUpShowModal()
  imgEdit = ObjectiveInUpShowModal.#getImg('/img/edit.svg', 'Edit objective')
  imgLoading = ObjectiveInUpShowModal.#getImg('/img/loading.svg', 'Edit objective modal loading')


  constructor(controller: ObjectiveController) {
    this.controller = controller
    this.showModalButtons = query<HTMLButtonElement>(this.datasetShowModal.query()).many()
    this.spanModalTitle = query<HTMLSpanElement>(idObjectiveInUpModalTitle().query).root(this.controller.elModal).one()
    this.buttonSubmit = query<HTMLButtonElement>(idObjectiveInUpModalSubmit().query).root(this.controller.elModal).one()
    this.inputTitle = query<HTMLInputElement>(fieldObjectiveInUpTitle().query).root(this.controller.elModal).one()
    this.inputMdToggle = query<HTMLInputElement>(idObjectiveInUpModalMdToggle().query).root(this.controller.elModal).one()
    this.textareaDescription = query<HTMLTextAreaElement>(fieldObjectiveInUpDescription().query).root(this.controller.elModal).one()
    this.selectColumn = query<HTMLInputElement>(fieldObjectiveInUpColumnId().query).root(this.controller.elModal).one()
    this.errorMessages = query<HTMLDivElement>('.error-message').root(this.controller.elModal).many()
    this.fieldsetAssignees = query<HTMLFieldSetElement>(this.fieldAssignees.query()).root(this.controller.elModal).one()
    this.fieldsetTags = query<HTMLFieldSetElement>(this.fieldTags.query()).root(this.controller.elModal).one()
    this.divMd = query<HTMLDivElement>(idObjectiveInUpModalMd().query).root(this.controller.elModal).one()
  }



  main() {
    for (const button of this.showModalButtons) {
      const objectiveId = Number(button.dataset[this.datasetShowModal.camel])

      button.addEventListener('click', async () => {
        this.showModal(button, objectiveId)
      })
    }
  }



  async showModal(button: HTMLButtonElement, objectiveId: number) {
    this.#startLoadingIndicator(button)

    await this.#dbQuery(objectiveId)

    if (!objectiveId) this.#create(button)
    else if (this.objective) this.#edit(button)
  }



  #startLoadingIndicator(button: HTMLButtonElement) {
    button.style.width = button.offsetWidth + 'px'
    button.innerHTML = this.imgLoading
  }



  #stopLoadingIndicator(button: HTMLButtonElement, innerHTML: string, ms: number) {
    setTimeout(() => {
      button.innerHTML = innerHTML
      button.style.width = ''
    }, ms)
  }



  async #dbQuery(objectiveId: number) {
    let noTags = !this.controller.tags.length
    let noAssignees = !this.controller.assignees.length

    if (noTags || noAssignees || objectiveId) {
      this.objective = await this.controller.dbQuery(objectiveId)

      if (noTags) this.#addTagsToDom()
      if (noAssignees) this.#addAssigneesToDom()
    }
  }



  #addAssigneesToDom() {
    ObjectiveInUpShowModal.#addCheckboxesToDom(
      this.controller.assignees,
      (p) => `${p.firstName} ${p.lastName}`,
      this.fieldAssignees,
      this.fieldsetAssignees,
      this.assigneeCheckboxes
    )
  }



  #addTagsToDom() {
    ObjectiveInUpShowModal.#addCheckboxesToDom(
      this.controller.tags,
      (t) => t.value,
      this.fieldTags,
      this.fieldsetTags,
      this.tagCheckboxes,
    )
  }



  static #addCheckboxesToDom<T_Items extends { id: number }[]>(
    items: T_Items,
    getLabel: (item: T_Items[number]) => string,
    field: FieldReturn<'checkbox'>,
    elFieldset: HTMLElement,
    checkboxes: HTMLInputElement[],
  ): void {
    const errorElement = query<HTMLElement>('.error-message').root(elFieldset).one()

    for (const item of items) {
      const div = document.createElement('div')
      div.className = 'checkbox'

      const input = document.createElement('input')
      input.type = 'checkbox'
      input.id = field.query(String(item.id)).slice(1)
      input.name = field.name
      input.value = String(item.id)
      checkboxes.push(input)

      const label = document.createElement('label')
      label.htmlFor = input.id
      label.textContent = getLabel(item)

      div.appendChild(input)
      div.appendChild(label)
      elFieldset.insertBefore(div, errorElement)
    }
  }



  #create(button: HTMLButtonElement) {
    this.inputTitle.value = ''
    this.selectColumn.value = '1'
    this.textareaDescription.value = ''

    this.inputMdToggle.checked = true
    this.inputMdToggle.dispatchEvent(new Event('change', { bubbles: true }))

    this.tagCheckboxes?.forEach(checkbox => checkbox.checked = false)
    this.assigneeCheckboxes?.forEach(checkbox => checkbox.checked = false)

    this.controller.elModal.dataset[datasetId().camel] = ''

    this.#resetErrors()
    this.#setTitleText('Create Objective')

    this.controller.elModal.classList.remove('hidden')

    this.#stopLoadingIndicator(button, 'New', 450) // give time for the modal to be over the button
  }



  #edit(button: HTMLButtonElement) {
    if (!this.objective) return

    this.inputTitle.value = this.objective.title
    this.textareaDescription.value = this.objective.description ?? ''
    this.selectColumn.value = String(this.objective.columnId)
    this.inputMdToggle.checked = false
    this.inputMdToggle.dispatchEvent(new Event('change', { bubbles: true }))
    this.controller.elModal.dataset[datasetId().camel] = String(this.objective.id)

    this.#resetErrors()
    this.#setTitleText('Edit Objective')
    ObjectiveInUpShowModal.#setCheckboxes(this.objective.tags, this.tagCheckboxes)
    ObjectiveInUpShowModal.#setCheckboxes(this.objective.assignees, this.assigneeCheckboxes)

    this.controller.elModal.classList.remove('hidden')

    this.#stopLoadingIndicator(button, this.imgEdit, 120) // give time so it's not so jittery if the request is fast
  }



  static #setCheckboxes(masterList: { id: number }[], checkboxes: HTMLInputElement[]) {
    const ids = new Set(masterList.map(v => v.id))

    for (const checkbox of checkboxes) {
      checkbox.checked = ids.has(Number(checkbox.value))
    }
  }



  #resetErrors() {
    this.errorMessages.forEach(div => div.textContent = '')
    this.controller.elModal.querySelectorAll('.has-error')?.forEach(input => input.classList.remove('has-error'))
  }



  #setTitleText(title: string) {
    this.spanModalTitle.innerText = this.buttonSubmit.innerText = title
  }



  static #getImg(src: string, alt: string) {
    const img = document.createElement('img')
    img.setAttribute('src', src)
    img.setAttribute('alt', alt)
    return img.outerHTML
  }
}
