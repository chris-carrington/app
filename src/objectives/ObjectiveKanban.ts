// app/src/objectives/ObjectiveKanban.ts

import { showErrorToast } from '@hono-toast'
import type { InferJson } from '@hono-rpc/fe'
import { FormUtil, Loading } from '@hono-security'
import { serverErrorMessage } from '@src/lib/vars'
import { query, type FieldReturn } from '@hono-dom'
import { ObjectiveController } from '@src/objectives/ObjectiveController'
import type { QueryObjectives, QueryObjective } from '@src/db/queryObjective'
import { ObjectiveInUpShowModal } from '@src/objectives/ObjectiveInUpShowModal'
import { formObjectiveValidator } from '@src/validators/inupObjective.validator'
import { classNameAssignees, classNameColumn, classNameColumnCount, classNameIsBeingDragged, classNameObjective, classNameObjectives, classNameSvg, classNameTags, classNameTitle, datasetColumnId, datasetId, datasetOrder, fieldObjectiveInUpAssigneeIds, fieldObjectiveInUpTagIds, idObjectiveInUpForm, idObjectiveTemplate } from '@src/lib/dom'



export class ObjectiveKanban {
  el: HTMLDivElement
  columns: HTMLElement[]
  idDataset = datasetId()
  isDropInProgress = false
  kanbanData: QueryObjectives
  orderDataset = datasetOrder()
  svgClassName = classNameSvg()
  columnCounts: HTMLSpanElement[]
  controller: ObjectiveController
  tagsClassName = classNameTags()
  titleClassName = classNameTitle()
  columnIdDataset = datasetColumnId()
  columnClassName = classNameColumn()
  assigneesClassName = classNameAssignees()
  objectiveClassName = classNameObjective()
  objectivesClassName = classNameObjectives()
  elDropIndicator: HTMLDivElement | null = null
  requestAnimationFrameId: number | null = null
  objectiveInUpShowModal: ObjectiveInUpShowModal
  currentObjective: CurrentObjective | null = null
  isBeingDraggedClassName = classNameIsBeingDragged()
  objectiveCardsCache = new Map<number, HTMLDivElement[]>()
  pendingDropPosition: { elColumn: HTMLDivElement; clientY: number } | null = null

  constructor(controller: ObjectiveController, objectiveInUpShowModal: ObjectiveInUpShowModal, el: HTMLDivElement, kanbanData: QueryObjectives) {
    this.el = el
    this.controller = controller
    this.kanbanData = kanbanData
    this.objectiveInUpShowModal = objectiveInUpShowModal
    this.columns = Array.from(query<HTMLElement>(this.columnClassName.query).root(this.el).many())
    this.columnCounts = Array.from(query<HTMLSpanElement>(classNameColumnCount().query).root(this.el).many())
  }



  main() {
    this.#initKanbanData()
    this.#setBoardDragAndDropListeners()
    this.#setSubmitListener()
    this.#setDocumentDragAndDropListeners()
    this.#initObjectiveCardsCache()
  }



  #initKanbanData() {
    if (!this.kanbanData[1]) this.kanbanData[1] = []
    if (!this.kanbanData[2]) this.kanbanData[2] = []
    if (!this.kanbanData[3]) this.kanbanData[3] = []
  }



  #setBoardDragAndDropListeners() {
    this.el.addEventListener('dragstart', e => this.#onDragStart(e))
    this.el.addEventListener('dragover', e => this.#onBoardDragOver(e))
    this.el.addEventListener('dragend', () => this.#onDragEnd()) // drag ended
    this.el.addEventListener('drop', e => this.#onBoardDrop(e)) // drag ended on a drop zone
  }



  #onDragStart(event: DragEvent) {
    const aim = event.target as HTMLElement
    const card = aim.closest<HTMLDivElement>(this.objectiveClassName.query)
    if (!card) return

    const objectiveId = Number(card.dataset[this.idDataset.camel])
    const sourceColumnElement = card.closest<HTMLElement>(this.columnClassName.query)
    const currentObjectiveSourceColumnId = Number(sourceColumnElement?.dataset.columnId)

    if (!objectiveId || !currentObjectiveSourceColumnId) {
      event.preventDefault()
      return
    }

    this.currentObjective = {
      objectiveId,
      currentObjectiveSourceColumnId
    }

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(objectiveId))
      event.dataTransfer.setData('application/x-kanban-source-column', String(currentObjectiveSourceColumnId))
    }

    requestAnimationFrame(() => card.classList.add(this.isBeingDraggedClassName.className))
  }



  #onDragEnd() {
    if (!this.isDropInProgress) {
      this.currentObjective = null
      this.#removeDropIndicatorElement()
    }

    if (this.requestAnimationFrameId !== null) {
      cancelAnimationFrame(this.requestAnimationFrameId)
      this.requestAnimationFrameId = null
    }

    this.pendingDropPosition = null

    const selector = this.objectiveClassName.query + this.isBeingDraggedClassName.query
    this.el.querySelectorAll<HTMLDivElement>(selector).forEach(
      (card: HTMLDivElement) => card.classList.remove(this.isBeingDraggedClassName.className)
    )
  }



  #onBoardDragOver(event: DragEvent) {
    event.preventDefault()

    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'

    const aim = event.target as HTMLElement
    const selector = this.objectivesClassName.query + this.columnIdDataset.query()
    const elColumn = aim.closest<HTMLDivElement>(selector)

    if (elColumn) this.#scheduleIndicatorUpdate(elColumn, event.clientY)
    else this.#removeDropIndicatorElement()
  }



  #scheduleIndicatorUpdate(elColumn: HTMLDivElement, clientY: number) {
    this.pendingDropPosition = { elColumn, clientY }

    if (this.requestAnimationFrameId === null) {
      this.requestAnimationFrameId = requestAnimationFrame(() => this.#processPendingDropPosition())
    }
  }



  #removeDropIndicatorElement() {
    if (this.elDropIndicator) {
      this.elDropIndicator.remove()
      this.elDropIndicator = null
    }
  }



  #processPendingDropPosition() {
    this.requestAnimationFrameId = null
    if (!this.pendingDropPosition) return

    const { elColumn, clientY } = this.pendingDropPosition
    this.pendingDropPosition = null

    const insertionIndex = this.#determineVisualInsertionIndexFromMouse(elColumn, clientY)
    const objectiveCards = this.#findAllObjectiveCardElementsInColumn(elColumn)
    const clampedIndex = Math.max(0, Math.min(insertionIndex, objectiveCards.length))

    if (!this.elDropIndicator) {
      this.elDropIndicator = this.#createDropIndicatorElement()
    }

    if (clampedIndex < objectiveCards.length) {
      elColumn.insertBefore(this.elDropIndicator, objectiveCards[clampedIndex])
    } else {
      elColumn.appendChild(this.elDropIndicator)
    }
  }


  #determineVisualInsertionIndexFromMouse(elColumn: HTMLDivElement, mouseYPosition: number): number {
    const allObjectiveCards: HTMLDivElement[] = this.#findAllObjectiveCardElementsInColumn(elColumn)

    for (let i: number = 0; i < allObjectiveCards.length; i++) {
      const rect: DOMRect = allObjectiveCards[i].getBoundingClientRect()
      const midY: number = rect.top + rect.height / 2

      if (mouseYPosition < midY) {
        return i
      }
    }

    return allObjectiveCards.length
  }



  #findAllObjectiveCardElementsInColumn(elColumn: HTMLDivElement): HTMLDivElement[] {
    const columnId = Number(elColumn.dataset.columnId)
    if (!columnId) return []

    const cached = this.objectiveCardsCache.get(columnId)
    if (cached) return cached

    const cards = Array.from(elColumn.querySelectorAll<HTMLDivElement>(this.objectiveClassName.query))
    this.objectiveCardsCache.set(columnId, cards)
    return cards
  }



  async #onBoardDrop(event: DragEvent) {
    event.preventDefault()

    const aim = event.target as HTMLElement
    const columnSelector = this.objectivesClassName.query
    const elColumn = aim.closest<HTMLDivElement>(columnSelector)

    if (!elColumn || !this.currentObjective) {
      this.#onDragEnd()
      return
    }

    const objectiveId = this.currentObjective.objectiveId
    const sourceColumnId = this.currentObjective.currentObjectiveSourceColumnId
    const targetColumnId = Number(elColumn.dataset.columnId)

    // Determine insertion index and order BEFORE removing the dragged card from the DOM/data
    const insertionIndex = this.#determineInsertionIndexFromMousePosition(elColumn, event.clientY, objectiveId)

    let aimColumnData = [...this.kanbanData[targetColumnId]]
    if (sourceColumnId === targetColumnId) {
      aimColumnData = aimColumnData.filter(o => o.id !== objectiveId)
    }

    const newOrder = ObjectiveKanban.#getObjectiveOrder(aimColumnData, insertionIndex)

    // Prevent #onDragEnd from removing the indicator while the API call is in flight
    this.isDropInProgress = true
    this.#setDropIndicatorToLoading()

    try {
      const response = await this.controller.rpc.api.objective.$put({
        json: { id: objectiveId, columnId: targetColumnId, order: newOrder }
      })
      const res = await response.json()
      if ('error' in res) {
        showErrorToast(res.error)
        return
      }

      // On success, apply the move using explicit IDs
      this.#applyObjectiveMove(objectiveId, sourceColumnId, targetColumnId, insertionIndex, newOrder)
    } catch (error) {
      console.error('❌ Drag and drop error:', error)
      showErrorToast(serverErrorMessage)
    } finally {
      this.isDropInProgress = false
      this.#onDragEnd()
    }
  }



  #setDropIndicatorToLoading(): void {
    if (this.elDropIndicator) {
      this.elDropIndicator.classList.add('is-loading')
      this.elDropIndicator.innerHTML = '<img src="/img/loading.svg" alt="Loading..." />'
    }
  }



  #applyObjectiveMove(objectiveId: number, sourceColumnId: number, targetColumnId: number, insertionIndex: number, newOrder: number): void {
    const objective = this.#retrieveObjectiveById(objectiveId, sourceColumnId)
    if (!objective) return

    // remove from source data
    const sourceData = this.kanbanData[sourceColumnId]
    const sourceIndex = sourceData.findIndex(o => o.id === objectiveId)
    if (sourceIndex === -1) return
    sourceData.splice(sourceIndex, 1)

    // update objective and insert into target data
    objective.order = newOrder
    objective.columnId = targetColumnId
    this.kanbanData[targetColumnId].splice(insertionIndex, 0, objective)

    // update DOM
    const card = this.el.querySelector<HTMLDivElement>(this.objectiveClassName.query + this.idDataset.query(objectiveId))
    const columnSection = this.columns[targetColumnId - 1]
    const objectivesContainer = columnSection?.querySelector<HTMLDivElement>(this.objectivesClassName.query)

    if (card && objectivesContainer) {
      card.dataset[this.orderDataset.camel] = String(newOrder)

      const children = Array.from(objectivesContainer.children) as HTMLDivElement[]

      const refIndex = children.findIndex(child => {
        const childOrder = Number(child.dataset[this.orderDataset.camel])
        return childOrder > newOrder
      })

      if (refIndex === -1) objectivesContainer.appendChild(card)
      else objectivesContainer.insertBefore(card, children[refIndex])

      this.#updateObjectiveCardsCache(targetColumnId)

      if (sourceColumnId !== targetColumnId) {
        this.#updateObjectiveCardsCache(sourceColumnId)
      }
    }

    // update counts
    this.#setColumnCount(sourceColumnId)
    if (sourceColumnId !== targetColumnId) this.#setColumnCount(targetColumnId)
  }



  #retrieveObjectiveById(objectiveId: number, columnId: number): QueryObjective | null {
    return this.kanbanData[columnId]?.find(o => o.id === objectiveId) || null
  }



  #determineInsertionIndexFromMousePosition(elColumn: HTMLDivElement, clientY: number, draggedObjectiveId: number): number {
    const allObjectiveCards: HTMLDivElement[] = this.#findAllObjectiveCardElementsInColumn(elColumn)
    const visibleObjectiveCards: HTMLDivElement[] = allObjectiveCards.filter(
      (card: HTMLDivElement) => card.dataset[this.idDataset.camel] !== String(draggedObjectiveId)
    )

    for (let i: number = 0; i < visibleObjectiveCards.length; i++) {
      const rect: DOMRect = visibleObjectiveCards[i].getBoundingClientRect()
      const midY: number = rect.top + rect.height / 2
      if (clientY < midY) return i
    }

    return visibleObjectiveCards.length
  }



  static #getObjectiveOrder(columnObjectives: QueryObjective[], insertionIndex: number): number {
    const hasObjectiveAbove: boolean = insertionIndex > 0
    const hasObjectiveBelow: boolean = insertionIndex < columnObjectives.length

    if (!hasObjectiveAbove && !hasObjectiveBelow) return 1
    if (!hasObjectiveAbove) return ObjectiveKanban.#getOrderIfAtTopOfColumn(columnObjectives)
    if (!hasObjectiveBelow) return ObjectiveKanban.#getOrderIfAtBottomOfColumn(columnObjectives)

    return ObjectiveKanban.#getOrderIfBetweenTwoObjectives(
      columnObjectives[insertionIndex - 1],
      columnObjectives[insertionIndex]
    )
  }



  static #getOrderIfAtTopOfColumn(columnObjectives: QueryObjective[]): number {
    if (columnObjectives.length === 0) return 1
    const firstObjectiveOrder: number = columnObjectives[0].order
    return (0 + firstObjectiveOrder) / 2
  }



  static #getOrderIfAtBottomOfColumn(columnObjectives: QueryObjective[]): number {
    if (columnObjectives.length === 0) return 1
    const lastObjectiveOrder: number = columnObjectives[columnObjectives.length - 1].order
    return lastObjectiveOrder + 1
  }



  static #getOrderIfBetweenTwoObjectives(above: QueryObjective, below: QueryObjective): number {
    return (above.order + below.order) / 2
  }


  #setColumnCount(columnId: number) {
    const badge = this.columnCounts[columnId - 1]
    const count = String(this.kanbanData[columnId].length)
    badge.textContent = count
  }



  #setSubmitListener() {
    const elForm = query<HTMLFormElement>(idObjectiveInUpForm().query).one()
    const form = new FormUtil(elForm, formObjectiveValidator)

    elForm.addEventListener('submit', e => this.#onSubmit(e, elForm, form))
  }



  async #onSubmit(event: SubmitEvent, elForm: HTMLFormElement, form: typeof formObjectiveValidator.$typeFormUtil): Promise<void> {
    event.preventDefault()

    const result = form.validateForm()

    if (!result.success) return

    const idStr = this.controller.elModal.dataset[this.idDataset.camel]
    const id = idStr ? Number(idStr) : null

    let objective = null
    const loading = new Loading(elForm)

    try {
      loading.start()

      objective = id
        ? await this.#putObjectiveFromModal({...result, id})
        : await this.#postObjectiveFromModal(result)
    } catch (error) {
      console.error('❌ Submission error:', error)
      showErrorToast(serverErrorMessage)
    } finally {
      loading.stop()

      if (objective) {
        this.controller.elModal.classList.add('hidden')
      }
    }
  }



  #buildPostJson(data: typeof formObjectiveValidator.$typeData) {
    const columnId = Number(data.columnId)
    const tagIds = this.#getCheckedIds(fieldObjectiveInUpTagIds())
    const assigneeIds = this.#getCheckedIds(fieldObjectiveInUpAssigneeIds())
    const order = ObjectiveKanban.#getObjectiveOrder(this.kanbanData[columnId], 0)

    const json: InferJson<typeof this.controller.rpc.api.objective.$post> = {
      description: data.description,
      columnId,
      tagIds,
      assigneeIds,
      title: data.title,
      order,
    }

    return json
  }



  async #putObjectiveFromModal(result: typeof formObjectiveValidator.$typeResult & {id: number}): Promise<null | QueryObjective> {
    if (!result.success) return null

    const json = { // with a put request we want a post json + the id of the objective that we want to put
      id: result.id,
      ...this.#buildPostJson(result.data)
    }

    const response = await this.controller.rpc.api.objective.$put({ json })

    const res = await response.json()

    if ('error' in res) {
      showErrorToast(res.error)
      return null
    }

    return this.#onInupFromModalSuccess(result.data, result.id, json)
  }



  async #postObjectiveFromModal(result: typeof formObjectiveValidator.$typeResult): Promise<null | QueryObjective> {
    if (!result.success) return null

    const json = this.#buildPostJson(result.data)

    const response = await this.controller.rpc.api.objective.$post({ json })

    const res = await response.json()

    if ('error' in res) {
      showErrorToast(res.error)
      return null
    }

    if (!('objectiveId' in res)) {
      showErrorToast('Unexpected response')
      return null
    }

    const objective = this.#onInupFromModalSuccess(result.data, res.objectiveId, json)
    this.kanbanData[json.columnId].unshift(objective)
    return objective
  }



  #onInupFromModalSuccess(data: typeof formObjectiveValidator.data, id: number, json: InferJson<typeof this.controller.rpc.api.objective.$post>) {
    const objective: QueryObjective = {
      id,
      title: data.title,
      description: data.description ?? '',
      order: json.order,
      columnId: json.columnId,
      createdAt: new Date().toISOString(),
      tags: this.controller.tags.filter(tag => json.tagIds.includes(tag.id)),
      assignees: this.controller.assignees.filter(person => json.assigneeIds.includes(person.id)),
    }

    const existingCard = this.el.querySelector<HTMLDivElement>(this.objectiveClassName.query + this.idDataset.query(id))

    if (existingCard) {
      // Update existing card in place
      this.#populateObjectiveCard(existingCard, objective)

      // If column changed, move the card to the correct column and position
      const currentColumnId = Number(existingCard.closest<HTMLElement>(this.columnClassName.query)?.dataset.columnId)
      const newColumnId = objective.columnId

      if (currentColumnId !== newColumnId) {
        // Remove from current column's data array
        const currentColumnData = this.kanbanData[currentColumnId]
        const index = currentColumnData.findIndex(o => o.id === id)
        if (index !== -1) currentColumnData.splice(index, 1)

        // Add to new column's data array at the correct position (order already set)
        this.kanbanData[newColumnId].push(objective)
        this.kanbanData[newColumnId].sort((a, b) => a.order - b.order)

        // Move DOM node
        const targetColumn = this.columns[newColumnId - 1]
        const objectivesContainer = targetColumn.querySelector<HTMLDivElement>(this.objectivesClassName.query)

        if (objectivesContainer) {
          // Insert at the correct position based on order
          const children = Array.from(objectivesContainer.children) as HTMLDivElement[]
          const refIndex = children.findIndex(child => Number(child.dataset.order) > objective.order)
          if (refIndex === -1) {
            objectivesContainer.appendChild(existingCard)
          } else {
            objectivesContainer.insertBefore(existingCard, children[refIndex])
          }
        }

        // Update caches and counts for both columns
        this.#updateObjectiveCardsCache(currentColumnId)
        this.#updateObjectiveCardsCache(newColumnId)
        this.#setColumnCount(currentColumnId)
        this.#setColumnCount(newColumnId)
      } else {
        // Column unchanged, just update cache (order may have changed)
        this.#updateObjectiveCardsCache(newColumnId)
        this.#setColumnCount(newColumnId)
      }
    } else {
      // New objective – insert at top of its column
      const columnData = this.kanbanData[objective.columnId]
      columnData.unshift(objective)

      const card = this.#cloneObjectiveCardTemplate()
      const button = query<HTMLButtonElement>(this.svgClassName.query).root(card).one()

      button.addEventListener('click', () => {
        this.objectiveInUpShowModal.showModal(button, id)
      })

      this.#populateObjectiveCard(card, objective)
      const objectivesContainer = this.columns[objective.columnId - 1].querySelector<HTMLDivElement>(this.objectivesClassName.query)

      if (objectivesContainer) {
        objectivesContainer.insertBefore(card, objectivesContainer.firstChild)
      }

      this.#updateObjectiveCardsCache(objective.columnId)
      this.#setColumnCount(objective.columnId)
    }

    return objective
  }



  #getCheckedIds(field: FieldReturn<'checkbox'>) {
    return Array.from(
      this.controller.elModal.querySelectorAll<HTMLInputElement>(field.query() + ' input[name="' + field.name + '"]:checked'),
      checkbox => Number(checkbox.value)
    )
  }


  #setDocumentDragAndDropListeners() {
    const selector = this.objectivesClassName.query + this.columnIdDataset.query()

    document.addEventListener('dragover', (event: DragEvent) => {
      if (!(event.target as HTMLElement)?.closest(selector)) {
        this.#removeDropIndicatorElement()
        event.preventDefault()
      }
    })

    document.addEventListener('drop', (event: DragEvent) => {
      if (!(event.target as HTMLElement)?.closest(selector)) {
        event.preventDefault()
        this.#onDragEnd()
      }
    })
  }



  #initObjectiveCardsCache() {
    for (const column of this.columns) {
      const columnId = Number(column.dataset[this.columnIdDataset.camel])
      if (!columnId) throw new Error('!columnId')
      this.#updateObjectiveCardsCache(columnId)
    }
  }



  #updateObjectiveCardsCache(columnId: number) {
    const elColumn = this.columns[columnId - 1]
    if (!elColumn) return
    const cards = Array.from(elColumn.querySelectorAll<HTMLDivElement>(this.objectiveClassName.query))
    this.objectiveCardsCache.set(columnId, cards)
  }



  #createDropIndicatorElement(): HTMLDivElement {
    const elDropIndicator: HTMLDivElement = document.createElement('div')
    elDropIndicator.className = 'drop-indicator'
    elDropIndicator.setAttribute('aria-hidden', 'true')

    return elDropIndicator
  }



  #cloneObjectiveCardTemplate() {
    const template = query<HTMLTemplateElement>(idObjectiveTemplate().query).one()
    if (!(template.content.firstElementChild instanceof HTMLDivElement)) throw new Error('!(template.content.firstElementChild instanceof HTMLDivElement)')
    return template.content.firstElementChild?.cloneNode(true) as HTMLDivElement
  }



  #populateObjectiveCard(card: HTMLDivElement, objective: QueryObjective) {
    card.dataset[this.idDataset.camel] = String(objective.id)
    card.dataset[this.orderDataset.camel] = String(objective.order)

    query<HTMLSpanElement>(this.titleClassName.query).root(card).one().textContent = objective.title

    const tagsContainer = query<HTMLDivElement>(this.tagsClassName.query).root(card).one()

    tagsContainer.innerHTML = ''

    for (const tag of objective.tags) {
      const tagEl = document.createElement('span')
      tagEl.textContent = tag.value
      tagEl.style.backgroundColor = tag.bgHex
      tagEl.style.color = tag.fgHex
      tagsContainer.appendChild(tagEl)
    }

    const assigneesContainer = query<HTMLDivElement>(this.assigneesClassName.query).root(card).one()

    assigneesContainer.innerHTML = ''

    for (const assignee of objective.assignees) {
      const img = document.createElement('img')
      img.src = `https://r2.shastatrades.org/${assignee.imageId}.webp`
      img.alt = `Assignee ${assignee.id}`
      assigneesContainer.appendChild(img)
    }
  }
}



type CurrentObjective = {
  objectiveId: number
  currentObjectiveSourceColumnId: number
}
