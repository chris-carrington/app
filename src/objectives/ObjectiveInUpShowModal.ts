// app/src/objectives/ObjectiveInUpShowModal.ts

import { showToast } from '@hono-toast'
import type { AppType } from '@src/index'
import { toggleModalDom } from '@hono-modal'
import { FormUtil, Loading } from '@hono-form'
import { formatTime } from '@src/time/formatTime'
import { createRPC, onError } from '@hono-api/fe'
import { QueryObjective } from '@src/db/queryObjective'
import { dom, query, type FieldReturn } from '@hono-dom'
import { ObjectiveController } from '@src/objectives/ObjectiveController'
import { formObjectiveCommentValidator } from '@src/validators/objectiveComment.validator'
import { idObjectiveInUpModalTitle, idObjectiveInUpModalSubmit, fieldObjectiveInUpTitle, fieldObjectiveInUpColumnId, fieldObjectiveInUpDescription, fieldObjectiveInUpAssigneeIds, fieldObjectiveInUpTagIds, datasetObjectiveInUpShowModal, idObjectiveInUpModalMdToggle, idObjectiveInUpModalMd, idObjectiveInUpModalDelete, idObjectiveInUpModalCommentSpacer, idObjectiveInUpModalCommentForm, idObjectiveInUpModalComments, classNameName, classNameValue, classNameTemporal, idObjectiveInUpModalComment, classNameComment, classNameCount, classNameObjective } from '@src/lib/dom'



export class ObjectiveInUpShowModal {
  divMd: HTMLDivElement
  divComment: HTMLDivElement
  divComments: HTMLDivElement
  inputTitle: HTMLInputElement
  formComment: HTMLFormElement
  selectColumn: HTMLInputElement
  controller: ObjectiveController
  spanModalTitle: HTMLSpanElement
  buttonSubmit: HTMLButtonElement
  buttonDelete: HTMLButtonElement
  inputMdToggle: HTMLInputElement
  divCommentSpacer: HTMLDivElement
  fieldsetTags: HTMLFieldSetElement
  fieldTags = fieldObjectiveInUpTagIds()
  tagCheckboxes: HTMLInputElement[] = []
  fieldsetAssignees: HTMLFieldSetElement
  textareaDescription: HTMLTextAreaElement
  errorMessages: NodeListOf<HTMLDivElement>
  assigneeCheckboxes: HTMLInputElement[] = []
  showModalButtons: NodeListOf<HTMLButtonElement>
  fieldAssignees = fieldObjectiveInUpAssigneeIds()
  objective: QueryObjective | undefined = undefined
  imgEdit = ObjectiveInUpShowModal.#getImg('/img/edit.svg', 'Edit objective')
  imgLoading = ObjectiveInUpShowModal.#getImg('/img/loading.svg', 'Edit objective modal loading')


  constructor(controller: ObjectiveController) {
    this.controller = controller
    this.showModalButtons = query<HTMLButtonElement>(this.controller.datasetShowModal.query()).all()
    this.spanModalTitle = query<HTMLSpanElement>(idObjectiveInUpModalTitle().query).root(this.controller.elModal).one()
    this.buttonSubmit = query<HTMLButtonElement>(idObjectiveInUpModalSubmit().query).root(this.controller.elModal).one()
    this.buttonDelete = query<HTMLButtonElement>(idObjectiveInUpModalDelete().query).root(this.controller.elModal).one()
    this.inputTitle = query<HTMLInputElement>(fieldObjectiveInUpTitle().query).root(this.controller.elModal).one()
    this.inputMdToggle = query<HTMLInputElement>(idObjectiveInUpModalMdToggle().query).root(this.controller.elModal).one()
    this.textareaDescription = query<HTMLTextAreaElement>(fieldObjectiveInUpDescription().query).root(this.controller.elModal).one()
    this.selectColumn = query<HTMLInputElement>(fieldObjectiveInUpColumnId().query).root(this.controller.elModal).one()
    this.errorMessages = query<HTMLDivElement>('.error-message').root(this.controller.elModal).all()
    this.fieldsetAssignees = query<HTMLFieldSetElement>(this.fieldAssignees.query()).root(this.controller.elModal).one()
    this.fieldsetTags = query<HTMLFieldSetElement>(this.fieldTags.query()).root(this.controller.elModal).one()
    this.divMd = query<HTMLDivElement>(idObjectiveInUpModalMd().query).root(this.controller.elModal).one()
    this.divCommentSpacer = query<HTMLDivElement>(idObjectiveInUpModalCommentSpacer().query).root(this.controller.elModal).one()
    this.formComment = query<HTMLFormElement>(idObjectiveInUpModalCommentForm().query).root(this.controller.elModal).one()
    this.divComment = query<HTMLDivElement>(idObjectiveInUpModalComment().query).root(this.controller.elModal).one()
    this.divComments = query<HTMLDivElement>(idObjectiveInUpModalComments().query).root(this.controller.elModal).one()
  }



  main() {
    for (const button of this.showModalButtons) {
      const objectiveId = Number(button.dataset[this.controller.datasetShowModal.camel])

      button.addEventListener('click', async () => {
        this.showModal(button, objectiveId)
      })
    }

    this.formComment.addEventListener('submit', (e) => {
      this.onAddComment(e)
    })

    this.controller.launchObjective()
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
    let noStaff = !this.controller.staff.length

    if (noTags || noStaff || objectiveId) {
      this.objective = await this.controller.dbQuery(objectiveId)

      if (noTags) this.#addTagsToDom()
      if (noStaff) this.#addAssigneesToDom()
    }
  }



  #addAssigneesToDom() {
    ObjectiveInUpShowModal.#addCheckboxesToDom(
      this.controller.staff,
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

    this.controller.elModal.dataset[this.controller.idDataset.camel] = ''

    this.#resetErrors()
    this.buttonSubmit.classList.add('wide')
    this.buttonDelete.style.display = 'none'
    this.formComment.style.display = 'none'
    this.divCommentSpacer.style.display = 'none'
    this.divComments.style.display = 'none'
    this.#setTitleAndSubmit('Create Objective', 'Create')

    toggleModalDom(this.controller.elModal, true)

    this.#stopLoadingIndicator(button, 'Create', 450) // give time for the modal to be over the button
  }



  #edit(button: HTMLButtonElement) {
    if (!this.objective) return

    this.inputTitle.value = this.objective.title
    this.textareaDescription.value = this.objective.description ?? ''
    this.selectColumn.value = String(this.objective.columnId)
    this.inputMdToggle.checked = false
    this.inputMdToggle.dispatchEvent(new Event('change', { bubbles: true }))
    this.controller.elModal.dataset[this.controller.idDataset.camel] = String(this.objective.id)

    this.#resetErrors()
    this.buttonSubmit.classList.remove('wide')
    this.buttonDelete.style.display = 'block'
    this.formComment.style.display = 'block'
    this.divCommentSpacer.style.display = 'block'
    this.divComments.style.display = (this.objective.comments.length) ? 'block' : 'none'

    this.#setTitleAndSubmit('Edit Objective', 'Edit')
    ObjectiveInUpShowModal.#setCheckboxes(this.objective.tags, this.tagCheckboxes)
    ObjectiveInUpShowModal.#setCheckboxes(this.objective.assignees, this.assigneeCheckboxes)

    toggleModalDom(this.controller.elModal, true)

    this.#clearPreviousComments()
    this.#addCommentsToDom()

    this.#stopLoadingIndicator(button, this.imgEdit, 120) // give time so it's not so jittery if the request is fast
  }


  #clearPreviousComments() {
    const elComments = this.divComments.querySelectorAll(classNameComment().query)

    for (const elComment of elComments) {
      elComment.remove()
    }
  }


  #addCommentsToDom() {
    if (!this.objective?.comments.length) return

    for (const comment of this.objective.comments) {
      this.#addCommentToDom(comment.createdBy.firstName, comment.createdBy.lastName, comment.value, comment.createdAt, comment.createdBy.imageId)
    }
  }


  #addCommentToDom(firstName: string, lastName: string, comment: string, createdAt: string, imageId: string | null) {
    dom('one', idObjectiveInUpModalComment(), HTMLDivElement)
      .on(classNameValue(), el => el.textContent = comment)
      .on(classNameName(), el => el.textContent = `${firstName} ${lastName}`)
      .on(classNameTemporal(), el => el.textContent = formatTime(createdAt))
      .on('img', img => {
        if (imageId) img.setAttribute('src', `https://r2.shastatrades.org/${imageId}.webp`)
        else img.style.display = 'none'
      })
      .clone('append', this.divComments)
      .run()
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



  #setTitleAndSubmit(title: string, submitText: string) {
    this.spanModalTitle.innerText = title
    this.buttonSubmit.innerText = submitText
  }



  static #getImg(src: string, alt: string) {
    const img = document.createElement('img')
    img.setAttribute('src', src)
    img.setAttribute('alt', alt)
    return img.outerHTML
  }


  async onAddComment(e: SubmitEvent) {
    e.preventDefault()

    const form = new FormUtil(this.formComment, formObjectiveCommentValidator)

    const result = form.validateForm()
    if (!result.success) return

    const rpc = createRPC<AppType>()
    const loading = new Loading(this.formComment)
    const objectiveId = Number(this.controller.elModal.dataset[this.controller.idDataset.camel])

    try {
      loading.start()
      const { res } = await form.rpc(rpc.api['objective-comment'].$post, { json: { objectiveId, value: result.data.comment } })

      if (res.success) {
        showToast({ variant: 'success', value: 'Success!' })
        this.formComment.reset()
        this.#addCommentToDom(res.firstName, res.lastName, result.data.comment, new Date().toISOString(), res.imageId)
        this.divComments.style.display = 'block'

        // update comment count
        const commentCount = query(classNameComment().query).root(this.divComments).all().length
        const card = this.controller.getObjectiveCard(objectiveId)
        if (!card) throw new Error('!card')

        if (commentCount) {
          const elCount = query<HTMLDivElement>(classNameCount().query).root(card).one()
          elCount.style.setProperty('display', 'flex', 'important');
          elCount.innerText = String(commentCount)
        }
      }
    } catch (e) {
      form.catch(e, onError)
    } finally {
      loading.stop()
    }
  }
}
