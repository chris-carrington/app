// app/src/objectives/onObjectivesPageLoad.directive.ts

import { FormUtil } from '@hono-security'
import type { Objective, ColumnId, KanbanData, DraggedObjectiveInfo } from '@src/objectives/objectives.types'
import { objectiveAddEditValidator, type ObjectiveAddEditFormData } from '@src/objectives/objectiveAddEdit.validator'


export default (el: HTMLDivElement, kanbanData: KanbanData): void => {
  // ============================================================
  // DRAG AND DROP STATE
  // ============================================================

  let currentlyDraggedObjectiveInfo: DraggedObjectiveInfo | null = null
  let dropIndicatorElement: HTMLDivElement | null = null
  let pendingDragPosition: { columnBody: HTMLDivElement; clientY: number } | null = null
  let animationFrameId: number | null = null

  // Counter for new objective IDs (temporary until DB integration)
  let nextObjectiveId = 9

  // ============================================================
  // ORDER CALCULATION FUNCTIONS
  // ============================================================

  function calculateOrderForObjectiveInsertedAtTopOfColumn(columnObjectives: Objective[]): number {
    if (columnObjectives.length === 0) return 1
    const firstObjectiveOrder: number = columnObjectives[0].order
    return (0 + firstObjectiveOrder) / 2
  }

  function calculateOrderForObjectiveInsertedBetweenTwoObjectives(above: Objective, below: Objective): number {
    return (above.order + below.order) / 2
  }

  function calculateOrderForObjectiveInsertedAtBottomOfColumn(columnObjectives: Objective[]): number {
    if (columnObjectives.length === 0) return 1
    const lastObjectiveOrder: number = columnObjectives[columnObjectives.length - 1].order
    return lastObjectiveOrder + 1
  }

  function calculateOrderForObjectiveInsertedAtIndex(columnObjectives: Objective[], insertionIndex: number): number {
    const hasObjectiveAbove: boolean = insertionIndex > 0
    const hasObjectiveBelow: boolean = insertionIndex < columnObjectives.length
    if (!hasObjectiveAbove && !hasObjectiveBelow) return 1
    if (!hasObjectiveAbove) return calculateOrderForObjectiveInsertedAtTopOfColumn(columnObjectives)
    if (!hasObjectiveBelow) return calculateOrderForObjectiveInsertedAtBottomOfColumn(columnObjectives)
    return calculateOrderForObjectiveInsertedBetweenTwoObjectives(
      columnObjectives[insertionIndex - 1],
      columnObjectives[insertionIndex]
    )
  }

  // ============================================================
  // DATA MANIPULATION FUNCTIONS
  // ============================================================

  function getSortedObjectivesForColumn(columnId: ColumnId): Objective[] {
    const objectivesForColumn: Objective[] = kanbanData[columnId] || []
    return [...objectivesForColumn].sort((a: Objective, b: Objective) => a.order - b.order)
  }

  function getObjectivesForColumn(columnId: ColumnId): Objective[] {
    return kanbanData[columnId] || []
  }

  function addNewObjectiveToTopOfColumn(title: string, columnId: ColumnId): void {
    const sortedObjectives: Objective[] = getSortedObjectivesForColumn(columnId)
    const newOrder: number = calculateOrderForObjectiveInsertedAtTopOfColumn(sortedObjectives)
    const newObjective: Objective = { id: nextObjectiveId++, title: title, order: newOrder }
    kanbanData[columnId].push(newObjective)
    sortObjectivesInColumnByOrder(columnId)
  }

  function sortObjectivesInColumnByOrder(columnId: ColumnId): void {
    kanbanData[columnId].sort((a: Objective, b: Objective) => a.order - b.order)
  }

  function findObjectiveIndexInColumnById(objectiveId: number, columnId: ColumnId): number {
    return kanbanData[columnId].findIndex((objective: Objective) => objective.id === objectiveId)
  }

  function removeObjectiveFromColumnById(objectiveId: number, columnId: ColumnId): boolean {
    const index: number = findObjectiveIndexInColumnById(objectiveId, columnId)
    if (index !== -1) {
      kanbanData[columnId].splice(index, 1)
      return true
    }
    return false
  }

  function retrieveObjectiveById(objectiveId: number, columnId: ColumnId): Objective | null {
    return kanbanData[columnId].find((objective: Objective) => objective.id === objectiveId) || null
  }

  function insertObjectiveIntoColumnAtIndex(
    objective: Objective,
    columnId: ColumnId,
    insertionIndex: number
  ): void {
    kanbanData[columnId].splice(insertionIndex, 0, objective)
    sortObjectivesInColumnByOrder(columnId)
  }

  function moveObjectiveBetweenColumns(
    objectiveId: number,
    sourceColumnId: ColumnId,
    targetColumnId: ColumnId,
    targetInsertionIndex: number
  ): boolean {
    const objective: Objective | null = retrieveObjectiveById(objectiveId, sourceColumnId)
    if (!objective) return false
    removeObjectiveFromColumnById(objectiveId, sourceColumnId)
    const sortedTargetObjectives: Objective[] = getSortedObjectivesForColumn(targetColumnId)
    const clampedIndex: number = Math.max(0, Math.min(targetInsertionIndex, sortedTargetObjectives.length))
    const newOrder: number = calculateOrderForObjectiveInsertedAtIndex(sortedTargetObjectives, clampedIndex)
    objective.order = newOrder
    insertObjectiveIntoColumnAtIndex(objective, targetColumnId, clampedIndex)
    return true
  }

  // ============================================================
  // DOM QUERY HELPER FUNCTIONS
  // ============================================================

  function getColumnObjectivesContainerElement(columnId: ColumnId): HTMLDivElement | null {
    return el.querySelector<HTMLDivElement>(`.objectives[data-column-id="${columnId}"]`)
  }

  function getObjectiveCountBadgeElement(columnId: ColumnId): HTMLElement | null {
    return document.getElementById(`count-${columnId}`)
  }

  function findAllObjectiveCardElementsInContainer(container: HTMLDivElement): HTMLDivElement[] {
    return Array.from(container.querySelectorAll<HTMLDivElement>('.objective'))
  }

  // ============================================================
  // OBJECTIVE CARD CLONE & POPULATE
  // ============================================================

  function cloneObjectiveCardTemplate(): HTMLDivElement {
    const template = document.getElementById('objective-template') as HTMLTemplateElement | null
    if (!template || !template.content.firstElementChild) {
      // Fallback (should never happen)
      const fallback = document.createElement('div')
      fallback.className = 'objective'
      fallback.draggable = true
      return fallback
    }
    return template.content.firstElementChild.cloneNode(true) as HTMLDivElement
  }

  function populateObjectiveCard(card: HTMLDivElement, objective: Objective): void {
    card.dataset.id = String(objective.id)
    card.dataset.order = String(objective.order)

    const titleEl = card.querySelector<HTMLSpanElement>('.title')
    if (titleEl) titleEl.textContent = objective.title

    const tagsContainer = card.querySelector<HTMLDivElement>('.tags')
    if (tagsContainer) {
      tagsContainer.innerHTML = ''
      objective.tags?.forEach((tag) => {
        const tagEl = document.createElement('span')
        tagEl.className = 'tag'
        tagEl.textContent = tag.value
        tagEl.style.backgroundColor = tag.bgHex
        tagEl.style.color = tag.fgHex
        tagsContainer.appendChild(tagEl)
      })
    }

    const assigneesContainer = card.querySelector<HTMLDivElement>('.assignees')

    if (assigneesContainer) {
      assigneesContainer.innerHTML = ''
      objective.assignees?.forEach((assignee) => {
        const img = document.createElement('img')
        img.className = 'avatar'
        img.src = `https://r2.shastatrades.org/${assignee.imageId}.webp`
        img.alt = `Assignee ${assignee.id}`
        assigneesContainer.appendChild(img)
      })
    }
  }

  // ============================================================
  // RENDERING FUNCTIONS
  // ============================================================

  function clearColumnObjectivesContainer(container: HTMLDivElement): void {
    container.innerHTML = ''
  }

  function appendObjectiveCardsToContainer(
    container: HTMLDivElement,
    objectives: Objective[]
  ): void {
    objectives.forEach((objective: Objective) => {
      const card = cloneObjectiveCardTemplate()
      populateObjectiveCard(card, objective)
      container.appendChild(card)
    })
  }

  function updateColumnObjectiveCountBadge(columnId: ColumnId): void {
    const badge: HTMLElement | null = getObjectiveCountBadgeElement(columnId)
    if (badge) badge.textContent = String(getObjectivesForColumn(columnId).length)
  }

  function renderSingleColumnObjectives(columnId: ColumnId): void {
    const container: HTMLDivElement | null = getColumnObjectivesContainerElement(columnId)
    if (!container) return
    clearColumnObjectivesContainer(container)
    const sortedObjectives: Objective[] = getSortedObjectivesForColumn(columnId)
    appendObjectiveCardsToContainer(container, sortedObjectives)
  }

  function renderBoardAfterObjectiveMove(
    sourceColumnId: ColumnId,
    targetColumnId: ColumnId
  ): void {
    if (sourceColumnId !== targetColumnId) {
      renderSingleColumnObjectives(sourceColumnId)
      updateColumnObjectiveCountBadge(sourceColumnId)
    }
    renderSingleColumnObjectives(targetColumnId)
    updateColumnObjectiveCountBadge(targetColumnId)
  }

  // ============================================================
  // DROP INDICATOR FUNCTIONS (optimised)
  // ============================================================

  function createDropIndicatorElement(): HTMLDivElement {
    const indicator: HTMLDivElement = document.createElement('div')
    indicator.className = 'drop-indicator'
    indicator.setAttribute('aria-hidden', 'true')
    return indicator
  }

  function removeDropIndicatorElement(): void {
    if (dropIndicatorElement) {
      dropIndicatorElement.remove()
      dropIndicatorElement = null
    }
  }

  function scheduleIndicatorUpdate(container: HTMLDivElement, clientY: number): void {
    pendingDragPosition = { columnBody: container, clientY }
    if (animationFrameId === null) {
      animationFrameId = requestAnimationFrame(processPendingDragPosition)
    }
  }

  function processPendingDragPosition(): void {
    animationFrameId = null
    if (!pendingDragPosition) return

    const { columnBody, clientY } = pendingDragPosition
    pendingDragPosition = null

    const insertionIndex = determineVisualInsertionIndexFromMouse(columnBody, clientY)
    const objectiveCards = findAllObjectiveCardElementsInContainer(columnBody)
    const clampedIndex = Math.max(0, Math.min(insertionIndex, objectiveCards.length))

    if (!dropIndicatorElement) {
      dropIndicatorElement = createDropIndicatorElement()
    }

    if (clampedIndex < objectiveCards.length) {
      columnBody.insertBefore(dropIndicatorElement, objectiveCards[clampedIndex])
    } else {
      columnBody.appendChild(dropIndicatorElement)
    }
  }

  function determineInsertionIndexFromMousePosition(
    container: HTMLDivElement,
    mouseYPosition: number,
    draggedObjectiveId: number
  ): number {
    const allObjectiveCards: HTMLDivElement[] = findAllObjectiveCardElementsInContainer(container)
    const visibleObjectiveCards: HTMLDivElement[] = allObjectiveCards.filter(
      (card: HTMLDivElement) => card.dataset.id !== String(draggedObjectiveId)
    )
    for (let i: number = 0; i < visibleObjectiveCards.length; i++) {
      const rect: DOMRect = visibleObjectiveCards[i].getBoundingClientRect()
      const midY: number = rect.top + rect.height / 2
      if (mouseYPosition < midY) return i
    }
    return visibleObjectiveCards.length
  }

  function determineVisualInsertionIndexFromMouse(
    container: HTMLDivElement,
    mouseYPosition: number
  ): number {
    const allObjectiveCards: HTMLDivElement[] = findAllObjectiveCardElementsInContainer(container)
    for (let i: number = 0; i < allObjectiveCards.length; i++) {
      const rect: DOMRect = allObjectiveCards[i].getBoundingClientRect()
      const midY: number = rect.top + rect.height / 2
      if (mouseYPosition < midY) return i
    }
    return allObjectiveCards.length
  }

  // ============================================================
  // DRAG AND DROP EVENT HANDLERS (delegated)
  // ============================================================

  function handleDelegatedDragStart(event: DragEvent): void {
    const target = event.target as HTMLElement
    const card = target.closest<HTMLDivElement>('.objective')
    if (!card) return

    const objectiveId = Number(card.dataset.id)
    const sourceColumnElement = card.closest<HTMLElement>('.column')
    const sourceColumnId = Number(sourceColumnElement?.dataset.columnId)
    if (!objectiveId || !sourceColumnId) {
      event.preventDefault()
      return
    }

    currentlyDraggedObjectiveInfo = {
      objectiveId,
      sourceColumnId
    }

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(objectiveId))
      event.dataTransfer.setData('application/x-kanban-source-column', String(sourceColumnId))
    }

    requestAnimationFrame(() => card.classList.add('is-being-dragged'))
  }

  function handleDelegatedDragEnd(event: DragEvent): void {
    cleanupAfterDragOperation()
  }

  function handleBoardDragOver(event: DragEvent): void {
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'

    const target = event.target as HTMLElement
    const container = target.closest<HTMLDivElement>('.objectives[data-column-id]')
    if (container) {
      scheduleIndicatorUpdate(container, event.clientY)
    } else {
      removeDropIndicatorElement()
    }
  }

  function handleBoardDrop(event: DragEvent): void {
    event.preventDefault()

    const target = event.target as HTMLElement
    const container = target.closest<HTMLDivElement>('.objectives[data-column-id]')
    if (!container || !currentlyDraggedObjectiveInfo) {
      cleanupAfterDragOperation()
      return
    }

    const draggedObjectiveId = currentlyDraggedObjectiveInfo.objectiveId
    const sourceColumnId = currentlyDraggedObjectiveInfo.sourceColumnId
    const targetColumnId = Number(container.dataset.columnId)

    const insertionIndex = determineInsertionIndexFromMousePosition(
      container,
      event.clientY,
      draggedObjectiveId
    )

    const success = moveObjectiveBetweenColumns(
      draggedObjectiveId,
      sourceColumnId,
      targetColumnId,
      insertionIndex
    )

    if (success) {
      renderBoardAfterObjectiveMove(sourceColumnId, targetColumnId)
    }
    cleanupAfterDragOperation()
  }

  function cleanupAfterDragOperation(): void {
    currentlyDraggedObjectiveInfo = null
    removeDropIndicatorElement()

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    pendingDragPosition = null

    el.querySelectorAll<HTMLDivElement>('.objective.is-being-dragged').forEach(
      (card: HTMLDivElement) => card.classList.remove('is-being-dragged')
    )
  }

  // ============================================================
  // FORM HANDLING FUNCTIONS
  // ============================================================

  function clearObjectiveTitleInputField(): void {
    const input = document.getElementById('objectiveTitleInput') as HTMLInputElement | null
    if (input) input.value = ''
  }

  function resetColumnSelectToDefault(): void {
    const select = document.getElementById('objectiveColumnSelect') as HTMLSelectElement | null
    if (select) select.value = '1'
  }

  function resetAddObjectiveFormFields(): void {
    clearObjectiveTitleInputField()
    resetColumnSelectToDefault()
  }

  function handleAddObjectiveFormSubmission(event: SubmitEvent, form: FormUtil<ObjectiveAddEditFormData>): void {
    event.preventDefault()

    const result = form.validateForm()

    if (!result.success) return

    addNewObjectiveToTopOfColumn(result.data.title, Number(result.data.column))
    renderSingleColumnObjectives(Number(result.data.column))
    updateColumnObjectiveCountBadge(Number(result.data.column))
    resetAddObjectiveFormFields()
    document.getElementById('objectiveTitleInput')?.focus()
  }

  // ============================================================
  // EVENT LISTENER SETUP (delegation)
  // ============================================================

  function attachDelegatedDragAndDropListeners(): void {
    el.addEventListener('dragover', handleBoardDragOver)
    el.addEventListener('drop', handleBoardDrop)
    el.addEventListener('dragstart', handleDelegatedDragStart)
    el.addEventListener('dragend', handleDelegatedDragEnd)
  }

  function attachFormSubmissionListener(): void {
    const el = document.querySelector<HTMLFormElement>('#objective-add-edit-form')
    if (!el) throw new Error('!el')

    const form = new FormUtil(el, objectiveAddEditValidator)
    el.addEventListener('submit', e => handleAddObjectiveFormSubmission(e, form))
  }

  function attachDocumentLevelDragOverPrevention(): void {
    document.addEventListener('dragover', function (event: DragEvent) {
      if (!(event.target as HTMLElement)?.closest('.objectives[data-column-id]')) {
        removeDropIndicatorElement()
        event.preventDefault()
      }
    })

    document.addEventListener('drop', function (event: DragEvent) {
      if (!(event.target as HTMLElement)?.closest('.objectives[data-column-id]')) {
        event.preventDefault()
        cleanupAfterDragOperation()
      }
    })
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  function initializeKanbanBoard(): void {
    attachDelegatedDragAndDropListeners()
    attachFormSubmissionListener()
    attachDocumentLevelDragOverPrevention()
  }

  initializeKanbanBoard()
}