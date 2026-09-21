// app/src/objectives/ObjectiveKanban.ts

import { onError } from '@hono-api/fe'
import { toggleModalDom } from '@hono-modal'
import { showErrorToast } from '@hono-toast'
import type { InferJson } from '@hono-api/fe'
import { FormUtil, Loading } from '@hono-form'
import { safeObjectAccess, safeArrayAccess } from '@safely-access'
import { ObjectiveController } from '@src/objectives/ObjectiveController'
import { dom, query, type DomBuilder, type FieldReturn } from '@hono-dom'
import type { QueryObjectives, QueryObjective } from '@src/db/queryObjective'
import { ObjectiveInUpShowModal } from '@src/objectives/ObjectiveInUpShowModal'
import { formObjectiveValidator } from '@src/validators/inupObjective.validator'
import { classNameAssignees, classNameColumn, classNameCount, classNameIsBeingDragged, classNameObjective, classNameObjectives, classNameSvg, classNameTags, classNameTitle, datasetColumnId, datasetOrder, fieldObjectiveInUpAssigneeIds, fieldObjectiveInUpTagIds, idObjectiveInUpForm, idObjectiveTemplate } from '@src/lib/dom'



export class ObjectiveKanban {
  el: HTMLDivElement
  columns: HTMLElement[]
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
    this.columns = Array.from(query<HTMLElement>(this.columnClassName.query).root(this.el).all())
    this.columnCounts = Array.from(query<HTMLSpanElement>('header ' + classNameCount().query).root(this.el).all())
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

    const objectiveId = Number(card.dataset[this.controller.idDataset.camel])
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
      elColumn.insertBefore(this.elDropIndicator, safeArrayAccess(objectiveCards, clampedIndex))
    } else {
      elColumn.appendChild(this.elDropIndicator)
    }
  }


  #determineVisualInsertionIndexFromMouse(elColumn: HTMLDivElement, mouseYPosition: number): number {
    const allObjectiveCards: HTMLDivElement[] = this.#findAllObjectiveCardElementsInColumn(elColumn)

    for (let i: number = 0; i < allObjectiveCards.length; i++) {
      const rect: DOMRect = safeArrayAccess(allObjectiveCards, i).getBoundingClientRect()
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

    let aimColumnData = [...safeObjectAccess(this.kanbanData, targetColumnId)]
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

      FormUtil.responseThrow(response, res)

      // On success, apply the move using explicit IDs
      this.#applyObjectiveMove(objectiveId, sourceColumnId, targetColumnId, insertionIndex, newOrder)
    } catch (e) {
      onError(e)
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
    const sourceData = safeObjectAccess(this.kanbanData, sourceColumnId)
    const sourceIndex = sourceData.findIndex(o => o.id === objectiveId)
    if (sourceIndex === -1) return
    sourceData.splice(sourceIndex, 1)

    // update objective and insert into target data
    objective.order = newOrder
    objective.columnId = targetColumnId
    safeObjectAccess(this.kanbanData, targetColumnId).splice(insertionIndex, 0, objective)

    // update DOM
    const card = query<HTMLDivElement>(this.objectiveClassName.query + this.controller.idDataset.query(objectiveId)).root(this.el).one()
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
      else objectivesContainer.insertBefore(card, safeArrayAccess(children, refIndex))

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
      (card: HTMLDivElement) => card.dataset[this.controller.idDataset.camel] !== String(draggedObjectiveId)
    )

    for (let i: number = 0; i < visibleObjectiveCards.length; i++) {
      const rect: DOMRect = safeArrayAccess(visibleObjectiveCards, i).getBoundingClientRect()
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
      safeArrayAccess(columnObjectives, insertionIndex - 1),
      safeArrayAccess(columnObjectives, insertionIndex)
    )
  }



  static #getOrderIfAtTopOfColumn(columnObjectives: QueryObjective[]): number {
    if (columnObjectives.length === 0) return 1
    const firstObjectiveOrder: number = safeArrayAccess(columnObjectives, 0).order
    return (0 + firstObjectiveOrder) / 2
  }



  static #getOrderIfAtBottomOfColumn(columnObjectives: QueryObjective[]): number {
    if (columnObjectives.length === 0) return 1
    const lastObjectiveOrder: number = safeArrayAccess(columnObjectives, columnObjectives.length - 1).order
    return lastObjectiveOrder + 1
  }



  static #getOrderIfBetweenTwoObjectives(above: QueryObjective, below: QueryObjective): number {
    return (above.order + below.order) / 2
  }


  #setColumnCount(columnId: number) {
    const badge = safeArrayAccess(this.columnCounts, columnId - 1)
    const count = String(safeObjectAccess(this.kanbanData, columnId).length)
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

    const idStr = this.controller.elModal.dataset[this.controller.idDataset.camel]
    const id = idStr ? Number(idStr) : null

    let objective = null
    const loading = new Loading(elForm)

    try {
      loading.start()

      objective = id
        ? await this.#putObjectiveFromModal({...result, id}, form)
        : await this.#postObjectiveFromModal(result, form)
    } catch (e) {
      form.catch(e, onError)
    } finally {
      loading.stop()

      if (objective) {
        toggleModalDom(this.controller.elModal, false)
      }
    }
  }



  #buildPostJson(data: typeof formObjectiveValidator.$typeData) {
    const columnId = Number(data.columnId)
    const tagIds = this.#getCheckedIds(fieldObjectiveInUpTagIds())
    const assigneeIds = this.#getCheckedIds(fieldObjectiveInUpAssigneeIds())
    const order = ObjectiveKanban.#getObjectiveOrder(safeObjectAccess(this.kanbanData, columnId), 0)

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



  async #putObjectiveFromModal(result: typeof formObjectiveValidator.$typeResult & { id: number }, form: typeof formObjectiveValidator.$typeFormUtil) {
    if (!result.success) return null

    const json = { // with a put request we want a post json + the id of the objective that we want to put
      id: result.id,
      ...this.#buildPostJson(result.data)
    }

    await form.rpc(this.controller.rpc.api.objective.$put, { json })

    return this.#onInupModalSuccess(result.data, result.id, json)
  }



  async #postObjectiveFromModal(result: typeof formObjectiveValidator.$typeResult, form: typeof formObjectiveValidator.$typeFormUtil) {
    if (!result.success) return null

    const json = this.#buildPostJson(result.data)

    const { res } = await form.rpc(this.controller.rpc.api.objective.$post, { json })

    if (!('objectiveId' in res)) {
      showErrorToast('Unexpected response')
      return null
    }

    const objective = this.#onInupModalSuccess(result.data, res.objectiveId, json)
    safeObjectAccess(this.kanbanData, json.columnId).unshift(objective)
    return objective
  }



  #onInupModalSuccess(data: typeof formObjectiveValidator.data, id: number, json: InferJson<typeof this.controller.rpc.api.objective.$post>) {
    const objective: QueryObjective = {
      id,
      comments: [],
      title: data.title,
      description: data.description ?? '',
      order: json.order,
      columnId: json.columnId,
      createdAt: new Date().toISOString(),
      tags: this.controller.tags.filter(tag => json.tagIds.includes(tag.id)),
      assignees: this.controller.staff.filter(person => json.assigneeIds.includes(person.id)),
    }

    const existingCard = this.el.querySelector<HTMLDivElement>(
      this.objectiveClassName.query + this.controller.idDataset.query(id),
    )

    if (!existingCard) { // insert
      const columnData = safeObjectAccess(this.kanbanData, objective.columnId)
      columnData.unshift(objective)

      const objectivesContainer = safeArrayAccess(this.columns, objective.columnId - 1)
        .querySelector<HTMLDivElement>(this.objectivesClassName.query)

      if (objectivesContainer) {
        this.#populateObjective(
          objective,
          dom('one', idObjectiveTemplate(), HTMLDivElement)
            .clone('prepend', objectivesContainer)
            .on<HTMLButtonElement>(this.svgClassName, button => {
              button.addEventListener('click', () => {
                this.objectiveInUpShowModal.showModal(button, id)
              })
            }),
        ).run()
      }

      this.#updateObjectiveCardsCache(objective.columnId)
      this.#setColumnCount(objective.columnId)
    } else { // update
      this.#populateObjective(objective, dom('one', existingCard)).run()

      const currentColumnId = Number(
        existingCard.closest<HTMLElement>(this.columnClassName.query)?.dataset.columnId,
      )

      const newColumnId = objective.columnId

      if (currentColumnId !== newColumnId) {
        const currentColumnData = safeObjectAccess(this.kanbanData, currentColumnId)
        const index = currentColumnData.findIndex(o => o.id === id)

        if (index !== -1) currentColumnData.splice(index, 1)

        const newColumn = safeObjectAccess(this.kanbanData, newColumnId)
        newColumn.push(objective)
        newColumn.sort((a, b) => a.order - b.order)

        const targetColumn = safeArrayAccess(this.columns, newColumnId - 1)
        const objectivesContainer = targetColumn.querySelector<HTMLDivElement>(
          this.objectivesClassName.query,
        )

        if (objectivesContainer) {
          // Position the moved card by `order`. This is a *move*, not a
          // clone/insert, so dom() stays out of it — direct insertBefore
          // keeps the same node (and its listener).
          const children = Array.from(objectivesContainer.children) as HTMLDivElement[]
          const refIndex = children.findIndex(c => Number(c.dataset.order) > objective.order)
          if (refIndex === -1) objectivesContainer.appendChild(existingCard)
          else objectivesContainer.insertBefore(existingCard, safeArrayAccess(children, refIndex))
        }

        this.#updateObjectiveCardsCache(currentColumnId)
        this.#updateObjectiveCardsCache(newColumnId)
        this.#setColumnCount(currentColumnId)
        this.#setColumnCount(newColumnId)
      } else {
        this.#updateObjectiveCardsCache(newColumnId)
        this.#setColumnCount(newColumnId)
      }
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



  #populateObjective<B extends DomBuilder<'one', HTMLDivElement>>(
    objective: QueryObjective,
    b: B,
  ): B {
    return b
      .onSource(card => {
        card.dataset[this.controller.idDataset.camel] = String(objective.id)
        card.dataset[this.orderDataset.camel] = String(objective.order)
      })
      .on<HTMLSpanElement>(this.titleClassName, el => {
        el.textContent = objective.title
      })
      .on<HTMLDivElement>(this.tagsClassName, el => {
        el.replaceChildren(...objective.tags.map(tag => {
          const span = document.createElement('span')
          span.textContent = tag.value
          span.style.backgroundColor = tag.bgHex
          span.style.color = tag.fgHex
          return span
        }))
      })
      .on<HTMLDivElement>(this.assigneesClassName, el => {
        el.replaceChildren(...objective.assignees.map(a => {
          const img = document.createElement('img')
          img.src = `https://r2.shastatrades.org/${a.imageId}.webp`
          img.alt = `Assignee ${a.id}`
          return img
        }))
      })
  }
}



type CurrentObjective = {
  objectiveId: number
  currentObjectiveSourceColumnId: number
}
