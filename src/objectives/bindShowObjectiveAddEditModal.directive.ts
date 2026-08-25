// app/src/objectives/bindShowObjectiveAddEditModal.directive.ts

import { urlFE } from '@src/url/urlFE'
import { query, type Dataset } from '@hono-dom'
import type { QueryPeople } from '@src/db/queryPeople'
import { QueryObjective } from '@src/db/queryObjective'
import { idObjectiveAddEditModal, idObjectiveAddEditModalTitle, idObjectiveAddEditModalSubmit, fieldObjectiveAddEditTitle, fieldObjectiveAddEditColumn, fieldObjectiveAddEditDescription, fieldObjectiveAddEditAssignees, datasetObjectiveAddEditShowModal } from '@src/lib/dom'


export default (_: HTMLDivElement) => {
  const vars = new DirectiveVars()
  bindShowModalButtons(vars)
}


export class DirectiveVars {
  modal: HTMLDivElement
  showModalButtons: NodeListOf<HTMLButtonElement>
  spanModalTitle: HTMLSpanElement
  buttonSubmit: HTMLButtonElement
  inputTitle: HTMLInputElement
  textareaDescription: HTMLTextAreaElement
  selectColumn: HTMLInputElement
  errorMessages: NodeListOf<HTMLDivElement>
  fieldAssignees: ReturnType<typeof fieldObjectiveAddEditAssignees>
  datasetShowModal: Dataset

  assignees: QueryPeople = []
  objective: QueryObjective | undefined = undefined
  assigneeCheckboxes: HTMLInputElement[] = []

  imgEdit: string
  imgLoading: string
  apiPeople: ReturnType<typeof urlFE>['api']['people']
  apiObjective: ReturnType<typeof urlFE>['api']['objective'][':id']

  constructor() {
    this.fieldAssignees = fieldObjectiveAddEditAssignees()
    this.datasetShowModal = datasetObjectiveAddEditShowModal()

    this.modal = query<HTMLDivElement>(idObjectiveAddEditModal().query).one()
    this.showModalButtons = query<HTMLButtonElement>(this.datasetShowModal.query()).many()
    this.spanModalTitle = query<HTMLSpanElement>(idObjectiveAddEditModalTitle().query).root(this.modal).one()
    this.buttonSubmit = query<HTMLButtonElement>(idObjectiveAddEditModalSubmit().query).root(this.modal).one()
    this.inputTitle = query<HTMLInputElement>(fieldObjectiveAddEditTitle().query).root(this.modal).one()
    this.textareaDescription = query<HTMLTextAreaElement>(fieldObjectiveAddEditDescription().query).root(this.modal).one()
    this.selectColumn = query<HTMLInputElement>(fieldObjectiveAddEditColumn().query).root(this.modal).one()
    this.errorMessages = query<HTMLDivElement>('.error-message').root(this.modal).many()

    this.imgEdit = getImg('/img/edit.svg', 'Edit objective')
    this.imgLoading = getImg('/img/loading.svg', 'Edit objective modal loading')

    const client = urlFE()
    this.apiPeople = client.api.people
    this.apiObjective = client.api.objective[':id']
  }
}


function getImg(src: string, alt: string) {
  const img = document.createElement('img')
  img.setAttribute('src', src)
  img.setAttribute('alt', alt)
  return img.outerHTML
}


function bindShowModalButtons(vars: DirectiveVars) {
  for (const button of vars.showModalButtons) {
    const objectiveId = Number(button.dataset[vars.datasetShowModal.camel])

    button.addEventListener('click', async (e) => {
      main(e, vars, button, objectiveId)
    })
  }
}


async function main(e: PointerEvent, vars: DirectiveVars, button: HTMLButtonElement, objectiveId: number) {
  startLoadingIndicator(button, vars.imgLoading)

  await queryDatabase(vars, objectiveId)

  if (!objectiveId) {
    create(vars, button)
  } else if (vars.objective) {
    edit(e, vars, button)
  }
}


function startLoadingIndicator(button: HTMLButtonElement, imgLoading: string) {
  button.innerHTML = imgLoading
}


async function queryDatabase(vars: DirectiveVars, objectiveId: number) {
  if (!vars.assignees.length && objectiveId) {
    const [resPeople, resObjective] = await Promise.all([
      vars.apiPeople.$get(),
      vars.apiObjective.$get({ param: { id: String(objectiveId) } }),
    ])

    vars.assignees = await resPeople.json()
    vars.objective = await resObjective.json()
    addAssigneesToDom(vars)
  } else if (vars.assignees.length && objectiveId) {
    const response = await vars.apiObjective.$get({ param: { id: String(objectiveId) } })
    vars.objective = await response.json()
  } else if (!vars.assignees.length) {
    const response = await vars.apiPeople.$get()
    vars.assignees = await response.json()
    addAssigneesToDom(vars)
  }
}


function addAssigneesToDom(vars: DirectiveVars) {
  const fieldset = vars.modal.querySelector('fieldset')
  if (!fieldset) throw new Error('!fieldset')

  for (const p of vars.assignees) {
    const div = document.createElement('div')
    div.className = 'checkbox'

    const input = document.createElement('input')
    input.type = 'checkbox'
    input.id = `checkbox--${vars.fieldAssignees.prefix}--${vars.fieldAssignees.name}--${p.id}`
    input.name = vars.fieldAssignees.name
    input.value = String(p.id)

    vars.assigneeCheckboxes.push(input)

    const label = document.createElement('label')
    label.htmlFor = input.id
    label.textContent = `${p.firstName} ${p.lastName}`

    div.appendChild(input)
    div.appendChild(label)
    fieldset.appendChild(div)
  }
}


function create(vars: DirectiveVars, button: HTMLButtonElement) {
  vars.inputTitle.value = ''
  vars.modal.dataset.id = ''
  vars.selectColumn.value = '1'
  vars.textareaDescription.value = ''
  vars.assigneeCheckboxes?.forEach(checkbox => checkbox.checked = false)
  vars.spanModalTitle.innerText = vars.buttonSubmit.innerText = 'Create Objective'
  vars.buttonSubmit.disabled = false
  vars.modal.classList.remove('hidden')
  vars.errorMessages.forEach(div => div.textContent = '')
  vars.modal.querySelectorAll('.has-error')?.forEach(input => input.classList.remove('has-error'))

  setTimeout(() => {
    button.innerHTML = 'New'
  }, 120)
}


function edit(event: PointerEvent, vars: DirectiveVars, button: HTMLButtonElement) {
  event.stopPropagation()

  if (vars.objective) {
    vars.modal.dataset.id = String(vars.objective.id)
    vars.spanModalTitle.innerText = vars.buttonSubmit.innerText = 'Edit Objective'

    vars.inputTitle.value = vars.objective.title
    vars.textareaDescription.value = vars.objective.description ?? ''
    vars.selectColumn.value = String(vars.objective.columnId)

    const objectiveAssigneeIds = new Set(vars.objective.assignees.map(assignee => assignee.id))
    vars.assigneeCheckboxes?.forEach(checkbox => {
      checkbox.checked = objectiveAssigneeIds.has(Number(checkbox.value))
    })

    vars.buttonSubmit.disabled = true
    vars.modal.classList.remove('hidden')

    setTimeout(() => {
      button.innerHTML = vars.imgEdit
    }, 120)
  }
}
