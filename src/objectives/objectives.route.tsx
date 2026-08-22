// app/src/objectives/objectives.route.tsx

import { Hono } from 'hono'
import { css, Style } from 'hono/css'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'
import ObjectivesAddEdit from '@src/objectives/ObjectivesAddEdit'
import { onModalToggle, onObjectivesPageLoad } from '@hono-directives'
import type { Column, KanbanData } from '@src/objectives/objectives.types'


export default new Hono()
  .get('/', async (c) => {
    const COLUMNS: Column[] = [
      { id: 1, value: 'To Do' },
      { id: 2, value: 'In Progress' },
      { id: 3, value: 'Completed' }
    ]

    const kanbanData: KanbanData = {
      'To Do': [
        { title: 'Design homepage mockup', order: 1 },
        { title: 'Write API documentation', order: 2 },
        { title: 'Setup CI/CD pipeline', order: 3 }
      ],
      'In Progress': [
        { title: 'Implement authentication flow', order: 1 },
        { title: 'Create database schema', order: 2 }
      ],
      'Completed': [
        { title: 'Project kickoff meeting', order: 1 },
        { title: 'Requirements gathering', order: 2 },
        { title: 'Wireframe approval', order: 3 }
      ]
    }

    return c.render(
      <>
        <title>Shasta Trades · Objectives</title>
        <Style>{style}</Style>
        <Style>{subPageHeroStyle}</Style>

        <div class="objectives">
          <div class="sub-page-hero">
            <div class="bg"></div>
            <div class="header">
              <h1>Objectives</h1>
              <div class="sub-title">Our objectives are publicly available here, we're making progress and we invite all to see, celebrate, and hold us accountable!</div>
            </div>

            <div class="buttons">
              <button data-directive={onModalToggle('objectives-add-edit-modal')} type="button">New</button>
              <button class="active" type="button">All</button>
              <button type="button">Mine</button>
            </div>
          </div>

          <div data-directive={onObjectivesPageLoad(kanbanData)} class="kanban-board-wrapper">
            <div class="kanban-board" id="kanbanBoard" aria-label="Kanban Board">
              <div class="kanban-board-inner">
                {COLUMNS.map((column) => (
                  <section class="kanban-column" data-column-name={column.value} aria-label={`${column.value} column`}>
                    <header class="column-header">
                      <h2 class="column-title">{column.value}</h2>
                      <span class="column-task-count" id={`count-${column.value}`}>
                        {kanbanData[column.value]?.length || 0}
                      </span>
                    </header>
                    <div class="column-body" data-column-body={column.value}>
                      {kanbanData[column.value].map((task) => (
                        <div class="task-card" draggable="true" data-task-title={task.title} data-task-order={String(task.order)}>
                          <span class="task-title">{task.title}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ObjectivesAddEdit COLUMNS={COLUMNS} />
      </>
    )
  })


const style = css`
  .kanban-board-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.4rem;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    padding: 0 var(--space-lite);
    margin-bottom: var(--space-huge);
  }

  /* ===== KANBAN BOARD – SCROLL CONTAINER ===== */
  .kanban-board {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    padding-bottom: 1rem;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
    -webkit-overflow-scrolling: touch;
  }

  .kanban-board::-webkit-scrollbar {
    height: 0.8rem;
  }

  .kanban-board::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 1rem;
  }

  .kanban-board::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 1rem;
  }

  .kanban-board::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* Inner flex row – uses margin:auto to center when fits, left‑align when overflow */
  .kanban-board-inner {
    display: flex;
    gap: 2rem;
    margin: auto;
    width: max-content;
    /* ensures row width = content */
  }

  .kanban-column {
    background-color: #f7f8fa;
    border-radius: 1.4rem;
    box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.06), 0 0.2rem 0.4rem rgba(0, 0, 0, 0.04);
    flex: 0 0 auto;
    width: 30rem;
    min-width: 30rem;
    max-width: 34rem;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.25s ease;
    overflow: visible;
  }

  .column-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.8rem 2rem 1.4rem 2rem;
    border-bottom: 0.3rem solid transparent;
    border-radius: 1.4rem 1.4rem 0 0;
  }

  .kanban-column:nth-child(1) .column-header {
    border-bottom-color: #6366f1;
    background: linear-gradient(to bottom, rgba(99, 102, 241, 0.08), transparent);
  }

  .kanban-column:nth-child(2) .column-header {
    border-bottom-color: #f59e0b;
    background: linear-gradient(to bottom, rgba(245, 158, 11, 0.08), transparent);
  }

  .kanban-column:nth-child(3) .column-header {
    border-bottom-color: #10b981;
    background: linear-gradient(to bottom, rgba(16, 185, 129, 0.08), transparent);
  }

  .column-title {
    font-size: 2.2rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #1e293b;
    text-transform: uppercase;
  }

  .column-task-count {
    font-size: 1.8rem;
    font-weight: 600;
    color: #64748b;
    background-color: #e2e8f0;
    border-radius: 3rem;
    padding: 0.4rem 1.2rem;
    min-width: 3.6rem;
    text-align: center;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .kanban-column:nth-child(1) .column-task-count {
    color: #4f46e5;
    background-color: #e0e7ff;
  }

  .kanban-column:nth-child(2) .column-task-count {
    color: #b45309;
    background-color: #fef3c7;
  }

  .kanban-column:nth-child(3) .column-task-count {
    color: #047857;
    background-color: #d1fae5;
  }

  .column-body {
    padding: 1.4rem 1.4rem 1.8rem 1.4rem;
    min-height: 12rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    flex: 1;
    border-radius: 0 0 1.4rem 1.4rem;
  }

  /* ===== TASK CARDS ===== */
  .task-card {
    background-color: #ffffff;
    border: 0.2rem solid #e2e8f0;
    border-radius: 1rem;
    padding: 1.6rem 1.8rem;
    box-shadow: 0 0.2rem 0.6rem rgba(0, 0, 0, 0.04);
    cursor: grab;
    transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
    user-select: none;
    -webkit-user-select: none;
    animation: cardFadeIn 0.25s ease;
    position: relative;
  }

  .task-card:hover {
    box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
    transform: translateY(-0.2rem);
  }

  .task-card:active {
    cursor: grabbing;
    transform: translateY(0) scale(0.98);
  }

  .task-card.is-being-dragged {
    opacity: 0.4;
    border-style: dashed;
    border-color: #94a3b8;
    transform: scale(0.96);
    box-shadow: none;
    cursor: grabbing;
  }

  .task-title {
    font-size: 1.8rem;
    font-weight: 500;
    color: #1e293b;
    line-height: 1.45;
    word-break: break-word;
    display: block;
  }

  /* ===== DROP INDICATOR ===== */
  .drop-indicator {
    height: 0.35rem;
    background: linear-gradient(90deg, #6366f1, #a855f7, #6366f1);
    background-size: 200% 100%;
    border-radius: 1rem;
    box-shadow: 0 0 1rem rgba(99, 102, 241, 0.55), 0 0 2.4rem rgba(168, 85, 247, 0.3);
    animation: indicatorPulse 0.8s ease-in-out infinite alternate;
    margin: 0.1rem 0;
    flex-shrink: 0;
    pointer-events: none;
    transition: all 0.15s ease;
  }

  @keyframes indicatorPulse {
    0% {
      opacity: 0.7;
      background-position: 0% 50%;
      box-shadow: 0 0 0.6rem rgba(99, 102, 241, 0.4);
    }

    100% {
      opacity: 1;
      background-position: 100% 50%;
      box-shadow: 0 0 1.6rem rgba(168, 85, 247, 0.6);
    }
  }

  @keyframes cardFadeIn {
    from {
      opacity: 0;
      transform: translateY(-0.8rem);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`
