// app/src/objectives/bindShowObjectiveAddEditModal.directive.ts

import { urlFE } from '@src/url/urlFE'
import { FieldReturn, query, type DatasetReturn } from '@hono-dom'
import type { QueryTags, QueryPeople } from '@src/db'
import { QueryObjective } from '@src/db/queryObjective'
import { idObjectiveAddEditModal, idObjectiveAddEditModalTitle, idObjectiveAddEditModalSubmit, fieldObjectiveAddEditTitle, fieldObjectiveAddEditColumn, fieldObjectiveAddEditDescription, fieldObjectiveAddEditAssignees, fieldObjectiveAddEditTags, datasetObjectiveAddEditShowModal } from '@src/lib/dom'


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
  datasetShowModal: DatasetReturn
  fieldsetTags: HTMLFieldSetElement
  fieldTags: ReturnType<typeof fieldObjectiveAddEditTags>
  fieldsetAssignees: HTMLFieldSetElement
  fieldAssignees: ReturnType<typeof fieldObjectiveAddEditAssignees>

  tags: QueryTags = []
  assignees: QueryPeople = []
  objective: QueryObjective | undefined = undefined
  assigneeCheckboxes: HTMLInputElement[] = []

  imgEdit: string
  imgLoading: string
  apiTags: ReturnType<typeof urlFE>['api']['tags']
  apiPeople: ReturnType<typeof urlFE>['api']['people']
  apiObjective: ReturnType<typeof urlFE>['api']['objective'][':id']

  constructor() {
    this.fieldTags = fieldObjectiveAddEditTags()
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
    this.fieldsetAssignees = query<HTMLFieldSetElement>(this.fieldAssignees.query()).root(this.modal).one()
    this.fieldsetTags = query<HTMLFieldSetElement>(this.fieldTags.query()).root(this.modal).one()

    this.imgEdit = getImg('/img/edit.svg', 'Edit objective')
    this.imgLoading = getImg('/img/loading.svg', 'Edit objective modal loading')

    const client = urlFE()
    this.apiTags = client.api.tags
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
  const [resTags, resAssignees, resObjective] = await Promise.all([
    vars.tags.length === 0 ? vars.apiTags.$get() : null,
    vars.assignees.length === 0 ? vars.apiPeople.$get() : null,
    objectiveId ? vars.apiObjective.$get({ param: { id: String(objectiveId) } }) : null,
  ])

  if (resObjective) vars.objective = await resObjective.json()

  if (resAssignees) {
    vars.assignees = await resAssignees.json()
    addAssigneesToDom(vars)
  }

  if (resTags) {
    vars.tags = await resTags.json()
    addTagsToDom(vars)
  }
}


function addAssigneesToDom(vars: DirectiveVars) {
  addCheckboxesToDom(
    vars,
    vars.assignees,
    (p) => `${p.firstName} ${p.lastName}`,
    vars.fieldAssignees,
    vars.fieldsetAssignees,
    vars.assigneeCheckboxes
  )
}


function addTagsToDom(vars: DirectiveVars) {
  addCheckboxesToDom(
    vars,
    vars.tags,
    (t) => t.value,
    vars.fieldTags,
    vars.fieldsetTags,
    vars.assigneeCheckboxes,
  )
}


function addCheckboxesToDom<T_Items extends { id: number }[]>(
  vars: DirectiveVars,
  items: T_Items,
  getLabel: (item: T_Items[number]) => string,
  field: FieldReturn<'checkbox'>,
  container: HTMLElement,
  checkboxArray: HTMLInputElement[],
): void {
  for (const item of items) {
    const div = document.createElement('div')
    div.className = 'checkbox'

    const input = document.createElement('input')
    input.type = 'checkbox'
    input.id = field.query(String(item.id)).slice(1)
    input.name = vars.fieldAssignees.name
    input.value = String(item.id)

    checkboxArray.push(input)

    const label = document.createElement('label')
    label.htmlFor = input.id
    label.textContent = getLabel(item)

    div.appendChild(input)
    div.appendChild(label)
    container.appendChild(div)
  }
}


function create(vars: DirectiveVars, button: HTMLButtonElement) {
  vars.inputTitle.value = ''
  vars.selectColumn.value = '1'
  vars.textareaDescription.value = ''
  vars.assigneeCheckboxes?.forEach(checkbox => checkbox.checked = false)
  vars.buttonSubmit.disabled = false
  resetErrors(vars)
  setTitleText(vars, 'Create Objective')

  vars.modal.classList.remove('hidden')

  setTimeout(() => button.innerHTML = 'New', 450) // give time for the modal to be over the button
}


function edit(event: PointerEvent, vars: DirectiveVars, button: HTMLButtonElement) {
  event.stopPropagation()

  if (vars.objective) {
    vars.inputTitle.value = vars.objective.title
    vars.textareaDescription.value = vars.objective.description ?? ''
    vars.selectColumn.value = String(vars.objective.columnId)

    resetErrors(vars)
    setTitleText(vars, 'Edit Objective')

    const objectiveAssigneeIds = new Set(vars.objective.assignees.map(assignee => assignee.id))
    vars.assigneeCheckboxes?.forEach(checkbox => {
      checkbox.checked = objectiveAssigneeIds.has(Number(checkbox.value))
    })

    vars.buttonSubmit.disabled = true
    vars.modal.classList.remove('hidden')

    setTimeout(() => button.innerHTML = vars.imgEdit, 120) // give time so it's not so jittery if the request is fast
  }
}


function resetErrors(vars: DirectiveVars) {
  vars.errorMessages.forEach(div => div.textContent = '')
  vars.modal.querySelectorAll('.has-error')?.forEach(input => input.classList.remove('has-error'))
}


function setTitleText(vars: DirectiveVars, title: string) {
  vars.spanModalTitle.innerText = vars.buttonSubmit.innerText = title
}
