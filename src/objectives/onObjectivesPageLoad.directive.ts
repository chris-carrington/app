// app/src/objectives/onObjectivesPageLoad.directive.ts

type ColumnId = number;
type ColumnValue = string;
type Column = { id: ColumnId; value: ColumnValue };
type Task = { title: string; order: number };
type KanbanData = Record<ColumnValue, Task[]>;
type DraggedTaskInfo = { taskTitle: string; sourceColumnValue: ColumnValue };

export default (el: HTMLDivElement): void => {
  // ============================================================
  // CONSTANTS & INITIAL DATA
  // ============================================================

  const COLUMNS: Column[] = [
    { id: 1, value: "To Do" },
    { id: 2, value: "In Progress" },
    { id: 3, value: "Completed" }
  ];

  const kanbanData: KanbanData = {
    "To Do": [
      { title: "Design homepage mockup", order: 1 },
      { title: "Write API documentation", order: 2 },
      { title: "Setup CI/CD pipeline", order: 3 }
    ],
    "In Progress": [
      { title: "Implement authentication flow", order: 1 },
      { title: "Create database schema", order: 2 }
    ],
    "Completed": [
      { title: "Project kickoff meeting", order: 1 },
      { title: "Requirements gathering", order: 2 },
      { title: "Wireframe approval", order: 3 }
    ]
  };

  // ============================================================
  // DRAG AND DROP STATE
  // ============================================================

  let currentlyDraggedTaskInfo: DraggedTaskInfo | null = null;

  // Perf: reusable indicator + rAF throttle
  let dropIndicatorElement: HTMLDivElement | null = null;
  let pendingDragPosition: { columnBody: HTMLDivElement; clientY: number } | null = null;
  let animationFrameId: number | null = null;

  // ============================================================
  // ORDER CALCULATION FUNCTIONS
  // ============================================================

  function calculateOrderForTaskInsertedAtTopOfColumn(columnTasks: Task[]): number {
    if (columnTasks.length === 0) return 1;
    const firstTaskOrder: number = columnTasks[0].order;
    return (0 + firstTaskOrder) / 2;
  }

  function calculateOrderForTaskInsertedBetweenTwoTasks(taskAbove: Task, taskBelow: Task): number {
    return (taskAbove.order + taskBelow.order) / 2;
  }

  function calculateOrderForTaskInsertedAtBottomOfColumn(columnTasks: Task[]): number {
    if (columnTasks.length === 0) return 1;
    const lastTaskOrder: number = columnTasks[columnTasks.length - 1].order;
    return lastTaskOrder + 1;
  }

  function calculateOrderForTaskInsertedAtIndex(columnTasks: Task[], insertionIndex: number): number {
    const hasTaskAbove: boolean = insertionIndex > 0;
    const hasTaskBelow: boolean = insertionIndex < columnTasks.length;
    if (!hasTaskAbove && !hasTaskBelow) return 1;
    if (!hasTaskAbove) return calculateOrderForTaskInsertedAtTopOfColumn(columnTasks);
    if (!hasTaskBelow) return calculateOrderForTaskInsertedAtBottomOfColumn(columnTasks);
    return calculateOrderForTaskInsertedBetweenTwoTasks(
      columnTasks[insertionIndex - 1],
      columnTasks[insertionIndex]
    );
  }

  // ============================================================
  // DATA MANIPULATION FUNCTIONS
  // ============================================================

  function getSortedTasksForColumn(columnValue: ColumnValue): Task[] {
    const tasksForColumn: Task[] = kanbanData[columnValue] || [];
    return [...tasksForColumn].sort((a: Task, b: Task) => a.order - b.order);
  }

  function getTasksForColumn(columnValue: ColumnValue): Task[] {
    return kanbanData[columnValue] || [];
  }

  function addNewTaskToTopOfColumn(taskTitle: string, columnValue: ColumnValue): void {
    const sortedTasks: Task[] = getSortedTasksForColumn(columnValue);
    const newOrder: number = calculateOrderForTaskInsertedAtTopOfColumn(sortedTasks);
    const newTask: Task = { title: taskTitle, order: newOrder };
    kanbanData[columnValue].push(newTask);
    sortTasksInColumnByOrder(columnValue);
  }

  function sortTasksInColumnByOrder(columnValue: ColumnValue): void {
    kanbanData[columnValue].sort((a: Task, b: Task) => a.order - b.order);
  }

  function findTaskIndexInColumnByTitle(taskTitle: string, columnValue: ColumnValue): number {
    return kanbanData[columnValue].findIndex((task: Task) => task.title === taskTitle);
  }

  function removeTaskFromColumnByTitle(taskTitle: string, columnValue: ColumnValue): boolean {
    const index: number = findTaskIndexInColumnByTitle(taskTitle, columnValue);
    if (index !== -1) {
      kanbanData[columnValue].splice(index, 1);
      return true;
    }
    return false;
  }

  function retrieveTaskObjectByTitle(taskTitle: string, columnValue: ColumnValue): Task | null {
    return kanbanData[columnValue].find((task: Task) => task.title === taskTitle) || null;
  }

  function insertTaskObjectIntoColumnAtIndex(
    taskObject: Task,
    columnValue: ColumnValue,
    insertionIndex: number
  ): void {
    kanbanData[columnValue].splice(insertionIndex, 0, taskObject);
    sortTasksInColumnByOrder(columnValue);
  }

  function moveTaskBetweenColumns(
    taskTitle: string,
    sourceColumnValue: ColumnValue,
    targetColumnValue: ColumnValue,
    targetInsertionIndex: number
  ): boolean {
    const taskObject: Task | null = retrieveTaskObjectByTitle(taskTitle, sourceColumnValue);
    if (!taskObject) return false;
    removeTaskFromColumnByTitle(taskTitle, sourceColumnValue);
    const sortedTargetTasks: Task[] = getSortedTasksForColumn(targetColumnValue);
    const clampedIndex: number = Math.max(0, Math.min(targetInsertionIndex, sortedTargetTasks.length));
    const newOrder: number = calculateOrderForTaskInsertedAtIndex(sortedTargetTasks, clampedIndex);
    taskObject.order = newOrder;
    insertTaskObjectIntoColumnAtIndex(taskObject, targetColumnValue, clampedIndex);
    return true;
  }

  // ============================================================
  // DOM QUERY HELPER FUNCTIONS
  // ============================================================

  function getColumnBodyElementByName(columnValue: ColumnValue): HTMLDivElement | null {
    return el.querySelector<HTMLDivElement>(`.column-body[data-column-body="${columnValue}"]`);
  }

  function getTaskCountBadgeElement(columnValue: ColumnValue): HTMLElement | null {
    return document.getElementById(`count-${columnValue}`);
  }

  function findAllTaskCardElementsInColumnBody(columnBodyElement: HTMLDivElement): HTMLDivElement[] {
    return Array.from(columnBodyElement.querySelectorAll<HTMLDivElement>('.task-card'));
  }

  // ============================================================
  // RENDERING FUNCTIONS
  // ============================================================

  function createTaskCardElement(taskObject: Task): HTMLDivElement {
    const card: HTMLDivElement = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.dataset.taskTitle = taskObject.title;
    card.dataset.taskOrder = String(taskObject.order);

    const titleSpan: HTMLSpanElement = document.createElement('span');
    titleSpan.className = 'task-title';
    titleSpan.textContent = taskObject.title;
    card.appendChild(titleSpan);

    card.addEventListener('dragstart', handleTaskCardDragStart);
    card.addEventListener('dragend', handleTaskCardDragEnd);
    return card;
  }

  function clearColumnBodyElement(columnBodyElement: HTMLDivElement): void {
    columnBodyElement.innerHTML = '';
  }

  function appendTaskCardsToColumnBody(
    columnBodyElement: HTMLDivElement,
    taskObjects: Task[]
  ): void {
    taskObjects.forEach((task: Task) => {
      columnBodyElement.appendChild(createTaskCardElement(task));
    });
  }

  function updateColumnTaskCountBadge(columnValue: ColumnValue): void {
    const badge: HTMLElement | null = getTaskCountBadgeElement(columnValue);
    if (badge) badge.textContent = String(getTasksForColumn(columnValue).length);
  }

  function renderSingleColumnBody(columnValue: ColumnValue): void {
    const columnBody: HTMLDivElement | null = getColumnBodyElementByName(columnValue);
    if (!columnBody) return;
    clearColumnBodyElement(columnBody);
    const sortedTasks: Task[] = getSortedTasksForColumn(columnValue);
    appendTaskCardsToColumnBody(columnBody, sortedTasks);
  }

  function renderEntireKanbanBoard(): void {
    COLUMNS.forEach((column: Column) => {
      renderSingleColumnBody(column.value);
      updateColumnTaskCountBadge(column.value);
    });
    removeDropIndicatorElement();
  }

  function renderBoardAfterTaskMove(
    sourceColumnValue: ColumnValue,
    targetColumnValue: ColumnValue
  ): void {
    if (sourceColumnValue !== targetColumnValue) {
      renderSingleColumnBody(sourceColumnValue);
      updateColumnTaskCountBadge(sourceColumnValue);
    }
    renderSingleColumnBody(targetColumnValue);
    updateColumnTaskCountBadge(targetColumnValue);
  }

  function updateAllColumnTaskCountBadges(): void {
    COLUMNS.forEach((column: Column) => updateColumnTaskCountBadge(column.value));
  }

  // ============================================================
  // DROP INDICATOR FUNCTIONS (optimised)
  // ============================================================

  function createDropIndicatorElement(): HTMLDivElement {
    const indicator: HTMLDivElement = document.createElement('div');
    indicator.className = 'drop-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    return indicator;
  }

  function removeDropIndicatorElement(): void {
    if (dropIndicatorElement) {
      dropIndicatorElement.remove();
      dropIndicatorElement = null;
    }
  }

  function scheduleIndicatorUpdate(columnBody: HTMLDivElement, clientY: number): void {
    pendingDragPosition = { columnBody, clientY };
    if (animationFrameId === null) {
      animationFrameId = requestAnimationFrame(processPendingDragPosition);
    }
  }

  function processPendingDragPosition(): void {
    animationFrameId = null;
    if (!pendingDragPosition) return;

    const { columnBody, clientY } = pendingDragPosition;
    pendingDragPosition = null;

    const insertionIndex = determineVisualInsertionIndexFromMouse(columnBody, clientY);
    const taskCards = findAllTaskCardElementsInColumnBody(columnBody);
    const clampedIndex = Math.max(0, Math.min(insertionIndex, taskCards.length));

    if (!dropIndicatorElement) {
      dropIndicatorElement = createDropIndicatorElement();
    }

    if (clampedIndex < taskCards.length) {
      columnBody.insertBefore(dropIndicatorElement, taskCards[clampedIndex]);
    } else {
      columnBody.appendChild(dropIndicatorElement);
    }
  }

  function determineInsertionIndexFromMousePosition(
    columnBodyElement: HTMLDivElement,
    mouseYPosition: number,
    draggedTaskTitle: string
  ): number {
    const allTaskCards: HTMLDivElement[] = findAllTaskCardElementsInColumnBody(columnBodyElement);
    const visibleTaskCards: HTMLDivElement[] = allTaskCards.filter(
      (card: HTMLDivElement) => card.dataset.taskTitle !== draggedTaskTitle
    );
    for (let i: number = 0; i < visibleTaskCards.length; i++) {
      const rect: DOMRect = visibleTaskCards[i].getBoundingClientRect();
      const midY: number = rect.top + rect.height / 2;
      if (mouseYPosition < midY) return i;
    }
    return visibleTaskCards.length;
  }

  function determineVisualInsertionIndexFromMouse(
    columnBodyElement: HTMLDivElement,
    mouseYPosition: number
  ): number {
    const allTaskCards: HTMLDivElement[] = findAllTaskCardElementsInColumnBody(columnBodyElement);
    for (let i: number = 0; i < allTaskCards.length; i++) {
      const rect: DOMRect = allTaskCards[i].getBoundingClientRect();
      const midY: number = rect.top + rect.height / 2;
      if (mouseYPosition < midY) return i;
    }
    return allTaskCards.length;
  }

  // ============================================================
  // DRAG AND DROP EVENT HANDLERS (delegated + throttled)
  // ============================================================

  function handleTaskCardDragStart(event: DragEvent): void {
    const card: HTMLDivElement = event.currentTarget as HTMLDivElement;
    const taskTitle: string | undefined = card.dataset.taskTitle;
    const sourceColumnElement: HTMLElement | null = card.closest('.kanban-column');
    const sourceColumnValue: string | undefined = sourceColumnElement?.dataset.columnName;
    if (!taskTitle || !sourceColumnValue) {
      event.preventDefault();
      return;
    }

    currentlyDraggedTaskInfo = {
      taskTitle: taskTitle,
      sourceColumnValue: sourceColumnValue as ColumnValue
    };

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', taskTitle);
      event.dataTransfer.setData('application/x-kanban-source-column', sourceColumnValue);
    }

    requestAnimationFrame(() => card.classList.add('is-being-dragged'));
  }

  function handleTaskCardDragEnd(event: DragEvent): void {
    cleanupAfterDragOperation();
  }

  function handleBoardDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';

    const target = event.target as HTMLElement;
    const columnBody = target.closest<HTMLDivElement>('.column-body');
    if (columnBody) {
      scheduleIndicatorUpdate(columnBody, event.clientY);
    } else {
      removeDropIndicatorElement();
    }
  }

  function handleBoardDrop(event: DragEvent): void {
    event.preventDefault();

    const target = event.target as HTMLElement;
    const columnBody = target.closest<HTMLDivElement>('.column-body');
    if (!columnBody || !currentlyDraggedTaskInfo) {
      cleanupAfterDragOperation();
      return;
    }

    const draggedTaskTitle = currentlyDraggedTaskInfo.taskTitle;
    const sourceColumnValue = currentlyDraggedTaskInfo.sourceColumnValue;
    const targetColumnValue = columnBody.dataset.columnBody as ColumnValue;

    const insertionIndex = determineInsertionIndexFromMousePosition(
      columnBody,
      event.clientY,
      draggedTaskTitle
    );

    const success = moveTaskBetweenColumns(
      draggedTaskTitle,
      sourceColumnValue,
      targetColumnValue,
      insertionIndex
    );

    if (success) {
      renderBoardAfterTaskMove(sourceColumnValue, targetColumnValue);
    }
    cleanupAfterDragOperation();
  }

  function cleanupAfterDragOperation(): void {
    currentlyDraggedTaskInfo = null;
    removeDropIndicatorElement();

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    pendingDragPosition = null;

    el.querySelectorAll<HTMLDivElement>('.task-card.is-being-dragged').forEach(
      (card: HTMLDivElement) => card.classList.remove('is-being-dragged')
    );
  }

  // ============================================================
  // FORM HANDLING FUNCTIONS
  // ============================================================

  function extractTaskTitleFromForm(): string {
    const input = document.getElementById('taskTitleInput') as HTMLInputElement | null;
    return input ? input.value.trim() : '';
  }

  function extractSelectedColumnFromForm(): ColumnValue {
    const select = document.getElementById('taskColumnSelect') as HTMLSelectElement | null;
    return (select ? select.value : 'To Do') as ColumnValue;
  }

  function clearTaskTitleInputField(): void {
    const input = document.getElementById('taskTitleInput') as HTMLInputElement | null;
    if (input) input.value = '';
  }

  function resetColumnSelectToDefault(): void {
    const select = document.getElementById('taskColumnSelect') as HTMLSelectElement | null;
    if (select) select.value = 'To Do';
  }

  function resetAddTaskFormFields(): void {
    clearTaskTitleInputField();
    resetColumnSelectToDefault();
  }

  function handleAddTaskFormSubmission(event: SubmitEvent): void {
    event.preventDefault();
    const title = extractTaskTitleFromForm();
    const column = extractSelectedColumnFromForm();

    if (!title) {
      const input = document.getElementById('taskTitleInput') as HTMLInputElement | null;
      if (input) {
        input.focus();
        input.style.borderColor = '#ef4444';
        input.style.boxShadow = '0 0 0 0.4rem rgba(239,68,68,0.15)';
        setTimeout(() => {
          input.style.borderColor = '';
          input.style.boxShadow = '';
        }, 800);
      }
      return;
    }

    addNewTaskToTopOfColumn(title, column);
    renderSingleColumnBody(column);
    updateColumnTaskCountBadge(column);
    resetAddTaskFormFields();
    document.getElementById('taskTitleInput')?.focus();
  }

  // ============================================================
  // EVENT LISTENER SETUP (delegation)
  // ============================================================

  function attachDelegatedDragAndDropListeners(): void {
    el.addEventListener('dragover', handleBoardDragOver);
    el.addEventListener('drop', handleBoardDrop);
  }

  function attachFormSubmissionListener(): void {
    const form = document.getElementById('addTaskForm') as HTMLFormElement | null;
    if (form) form.addEventListener('submit', handleAddTaskFormSubmission);
  }

  function attachDocumentLevelDragOverPrevention(): void {
    document.addEventListener('dragover', function (event: DragEvent) {
      if (!(event.target as HTMLElement)?.closest('.column-body')) {
        removeDropIndicatorElement();
        event.preventDefault();
      }
    });

    document.addEventListener('drop', function (event: DragEvent) {
      if (!(event.target as HTMLElement)?.closest('.column-body')) {
        event.preventDefault();
        cleanupAfterDragOperation();
      }
    });
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  function initializeKanbanBoard(): void {
    attachDelegatedDragAndDropListeners();
    attachFormSubmissionListener();
    attachDocumentLevelDragOverPrevention();
    renderEntireKanbanBoard();
    updateAllColumnTaskCountBadges();
  }

  initializeKanbanBoard();
};
