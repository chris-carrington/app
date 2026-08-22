// app/src/objectives/objectives.route.tsx

import { Hono } from 'hono'
import type { FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'
// import { getKanbanBoard } from '@src/objectives/getKanbanBoard'
import ObjectivesAddEdit from '@src/objectives/ObjectivesAddEdit'
import { onModalToggle, onObjectivesPageLoad } from '@hono-directives'
import type { Column, KanbanData, Objective } from '@src/objectives/objectives.types'


export default new Hono()
  .get('/', async (c) => {
    const COLUMNS: Column[] = [
      { id: 1, value: 'To Do' },
      { id: 2, value: 'In Progress' },
      { id: 3, value: 'Completed' }
    ]

    // const kanbanBoard = await getKanbanBoard()
    // console.log('kanbanBoard', JSON.stringify(kanbanBoard, null, 2))

    // const x = kanbanBoard[1][0].assignees[0]
    // const y = kanbanBoard[1][0].tags[0]
    // const z = kanbanBoard[0]

    const kanbanData: KanbanData = {
      '1': [
        { id: 1, title: 'Design homepage mockup', order: 1 },
        { id: 2, title: 'Write API documentation', order: 2 },
        { id: 3, title: 'Setup CI/CD pipeline', order: 3 }
      ],
      '2': [
        { id: 4, title: 'Implement authentication flow', order: 1, assignees: [{ id: 1, imageId: 1 }], tags: [{ id: 1, value: 'In Development', bgHex: '#DBEAFE', fgHex: '#1E40AF' }] },
        { id: 5, title: 'Create database schema', order: 2, assignees: [{ id: 1, imageId: 1 }, { id: 1, imageId: 2 }], tags: [{ id: 1, value: 'In QA', bgHex: '#FEF3C7', fgHex: '#92400E' }] }
      ],
      '3': [
        { id: 6, title: 'Project kickoff meeting', order: 1, tags: [{ id: 1, value: 'Completed', bgHex: '#CFFAFE', fgHex: '#155E75' }] },
        { id: 7, title: 'Requirements gathering', order: 2, tags: [{ id: 1, value: 'Completed', bgHex: '#CFFAFE', fgHex: '#155E75' }] },
        { id: 8, title: 'Wireframe approval', order: 3, tags: [{ id: 1, value: 'Completed', bgHex: '#CFFAFE', fgHex: '#155E75' }] }
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
                  <section class="column" data-column-id={column.id} aria-label={`${column.value} column`}>
                    <header class="header">
                      <h2 class="title">{column.value}</h2>
                      <span class="count" id={`count-${column.id}`}>
                        {kanbanData[column.id]?.length || 0}
                      </span>
                    </header>
                    <div class="objectives" data-column-id={column.id}>
                      {kanbanData[column.id].map((o) => (
                        <ObjectiveCard objective={o} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ObjectivesAddEdit COLUMNS={COLUMNS} />

        {/* Single source of truth for client-created objective cards */}
        <template id="objective-template">
          <ObjectiveCard objective={null} />
        </template>
      </>
    )
  })


const ObjectiveCard: FC<{ objective: Objective | null }> = ({ objective }) => {
  return <>
    <div class="objective" draggable="true" data-id={objective?.id} data-order={objective ? String(objective.order) : undefined}>
      <div class="top-row">
        <span class="title">{objective?.title ?? ''}</span>
        <div class="svg">
          <img src="/img/edit.svg" alt="Edit objective" />
        </div>
      </div>
      <div class="bottom-row" data-populated={Number(objective?.tags?.length) > 0 || Number(objective?.assignees?.length) > 0 ? 'true' : 'false'}>
        <div class="tags">
          {objective?.tags?.map((tag) => (
            <span class="tag" style={`background-color: ${tag.bgHex}; color: ${tag.fgHex};`}>
              {tag.value}
            </span>
          ))}
        </div>
        <div class="assignees">
          {objective?.assignees?.map((assignee) => (
            <img
              class="assignee-avatar"
              src={`/avatars/${assignee.imageId}.webp`}
              alt={`Assignee ${assignee.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  </>
}


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
    &::-webkit-scrollbar {
      height: 0.8rem;
    }
    &::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 1rem;
    }
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 1rem;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .kanban-board-inner {
      display: flex;
      gap: 2rem;
      margin: auto;
      width: max-content; /* ensures row width = content */

      .column {
        border-radius: 1.4rem;
        box-shadow: 0 0.4rem 1.2rem rgba(0, 0, 0, 0.06), 0 0.2rem 0.4rem rgba(0, 0, 0, 0.04);
        flex: 0 0 auto;
        width: 36rem;
        max-width: 84vw;
        display: flex;
        flex-direction: column;
        transition: box-shadow 0.25s ease;
        overflow: visible;
        &:nth-child(1) {
          background: linear-gradient(to bottom, rgba(99, 102, 241, 0.08), transparent);

          .header {
            border-bottom-color: #6366f1;
          }

          .count {
            color: #4f46e5;
            background-color: #e0e7ff;
          }
        }
        &:nth-child(2) {
          background: linear-gradient(to bottom, rgba(245, 158, 11, 0.08), transparent);

          .header {
            border-bottom-color: #f59e0b;
          }

          .count {
            color: #b45309;
            background-color: #fef3c7;
          }
        }
        &:nth-child(3) {
          background: linear-gradient(to bottom, rgba(16, 185, 129, 0.08), transparent);

          .header {
            border-bottom-color: #10b981;
          }

          .count {
            color: #047857;
            background-color: #d1fae5;
          }
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.8rem 2rem 1.4rem 2rem;
          border-bottom: 0.3rem solid transparent;
          border-radius: 1.4rem 1.4rem 0 0;

          .title {
            font-size: 2.2rem;
            font-weight: 700;
            letter-spacing: 0.02em;
            color: #1e293b;
            text-transform: uppercase;
          }

          .count {
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
        }

        .objectives {
          padding: 1.4rem 1.4rem 1.8rem 1.4rem;
          min-height: 12rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          flex: 1;
          border-radius: 0 0 1.4rem 1.4rem;

          .objective {
            background-color: #ffffff;
            border: 0.2rem solid #e2e8f0;
            border-radius: 1rem;
            padding: 1.6rem 1.8rem;
            box-shadow: 0 0.2rem 0.6rem rgba(0, 0, 0, 0.04);
            cursor: grab;
            transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
            user-select: none;
            -webkit-user-select: none;
            position: relative;
            &:hover {
              box-shadow: 0 0.8rem 2rem rgba(0, 0, 0, 0.08);
              border-color: #cbd5e1;
              transform: translateY(-0.2rem);
            }
            &:active {
              cursor: grabbing;
              transform: translateY(0) scale(0.98);
            }
            &.is-being-dragged {
              opacity: 0.4;
              border-style: dashed;
              border-color: #94a3b8;
              transform: scale(0.96);
              box-shadow: none;
              cursor: grabbing;
            }

            .top-row {
              display: flex;
              align-items: start;
              justify-content: space-between;

              .title {
                font-size: 1.8rem;
                font-weight: 500;
                color: #1e293b;
                line-height: 1.45;
                word-break: break-word;
                flex: 1;
              }

              .svg {
                width: 2.7rem;
                height: 2.7rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transform: translateX(0.9rem);
                transition: var(--transition);
                cursor: pointer;
                opacity: 0.3;
                &:hover {
                  scale: 1.2;
                  opacity: 1;
                  background-color: #f1f5f9;
                }

                img {
                  width: 1.8rem;
                  height: 1.8rem;
                  object-fit: contain;
                  pointer-events: none;
                }
              }
            }

            .bottom-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 1.2rem;
              &[data-populated="true"] {
                margin-top: calc(var(--space-lite) / 2);
              }

              .tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.6rem;
                flex: 1;
                justify-content: flex-start;
              }

              .tag {
                font-size: 1.2rem;  /* small but readable, no text smaller than 1.8rem? But tags are decorative; still use 1.2rem? Better 1.4rem */
                font-weight: 600;
                padding: 0.4rem 1rem;
                border-radius: 2rem;
                white-space: nowrap;
                letter-spacing: 0.02em;
              }

              .assignees {
                display: flex;
                align-items: center;
                gap: 0.4rem;
                flex-shrink: 0;
              }

              .assignee-avatar {
                width: 2.8rem;
                height: 2.8rem;
                border-radius: 50%;
                object-fit: cover;
                object-position: center center;
                border: 0.2rem solid #ffffff;
                box-shadow: 0 0 0 0.1rem #e2e8f0;
                background-color: #f1f5f9; /* fallback */
              }
            }
          }
        }

        .drop-indicator {
          height: 0.35rem;
          background: linear-gradient(90deg, #6366f1, #a855f7, #6366f1);
          background-size: 200% 100%;
          border-radius: 1rem;
          box-shadow: 0 0 1rem rgba(99, 102, 241, 0.55), 0 0 2.4rem rgba(168, 85, 247, 0.3);
          margin: 0.1rem 0;
          flex-shrink: 0;
          pointer-events: none;
          transition: all 0.15s ease;
        }
      }
    }
  }
`
