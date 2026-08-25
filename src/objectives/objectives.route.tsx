// app/src/objectives/objectives.route.tsx

import { Hono } from 'hono'
import type { FC } from 'hono/jsx'
import { css, Style } from 'hono/css'
import { kanbanColumns } from '@src/lib/vars'
import { formStyle } from '@src/lib/formStyle'
import type { DatasetReturn } from '@hono-dom'
import { subPageHeroStyle } from '@src/lib/subPageHeroStyle'
import ObjectiveAddEdit from '@src/objectives/ObjectiveAddEdit'
import { datasetObjectiveAddEditShowModal } from '@src/lib/dom'
import { queryObjectives, type QueryObjective, type QueryObjectives } from '@src/db/queryObjective'
import { onObjectivesPageLoad, bindShowObjectiveAddEditModal } from '@hono-directives'


export default new Hono()
  .get('/', async (c) => {
    // const kanbanData = await queryObjectives()
    const kanbanData: QueryObjectives = { "1": [{ "id": 1, "columnId": 1, "title": "Profile: EditPerson.tsx", "description": "- Edit Self\n- [Trustee, President, Executive Director, CTO] may update any person\n- hono-img, Upload image, WASM Rust Shrink, Webp, Preview, R2\n- Edit: First Name / Last Name / Email / Newsletter Subscriber", "order": 1, "createdAt": "2026-08-24T03:59:26.000Z", "tags": [], "assignees": [{ "id": 1, "imageId": "be46a51d-131d-41d6-ac58-df29843d1cc0", "firstName": "Christopher", "lastName": "Carrington" }] }, { "id": 2, "columnId": 1, "title": "Profile: ContactUsMessages.tsx", "description": "- Seen by [Trustee, President, Secretary, Executive Director, CTO]", "order": 2, "createdAt": "2026-08-24T03:59:26.000Z", "tags": [], "assignees": [{ "id": 1, "imageId": "be46a51d-131d-41d6-ac58-df29843d1cc0", "firstName": "Christopher", "lastName": "Carrington" }] }], "2": [{ "id": 3, "columnId": 2, "title": "Create Objectives Page", "description": "- AddEditModal\n    - Description (Markdown)\n    - Assignees\n    - Tags\n    - Call again bindShowObjectiveAddEditModal() post create\n    - Loading icon post edit click\n    - New loading indicator\n- All / Mine\n    - May only drag and drop when looking @ All", "order": 1, "createdAt": "2026-08-24T03:59:26.000Z", "tags": [{ "id": 1, "value": "In Development", "bgHex": "#DBEAFE", "fgHex": "#1E40AF" }], "assignees": [{ "id": 1, "imageId": "be46a51d-131d-41d6-ac58-df29843d1cc0", "firstName": "Christopher", "lastName": "Carrington" }, { "id": 2, "imageId": "7a0e296f-5eda-401a-88fb-80c1577926c6", "firstName": "Megha", "lastName": "Carrington" }] }] }
    const datasetShowModal = datasetObjectiveAddEditShowModal()

    return c.render(
      <>
        <title>Shasta Trades · Objectives</title>
        <Style>{style}</Style>
        <Style>{formStyle}</Style>
        <Style>{subPageHeroStyle}</Style>

        <div class="objectives" data-directive={bindShowObjectiveAddEditModal()}>
          <div class="sub-page-hero">
            <div class="bg"></div>
            <div class="header">
              <h1>Objectives</h1>
              <div class="sub-title">Our objectives are publicly available here, we're making progress and we invite all to see, celebrate, and hold us accountable!</div>
            </div>

            <div class="buttons">
              <button {...datasetObjectiveAddEditShowModal().attr()} class="transparent big" type="button">New</button>
              <button class="orange big" type="button">All</button>
              <button class="transparent big" type="button">Mine</button>
            </div>
          </div>

          <div data-directive={onObjectivesPageLoad(kanbanData)} class="kanban-board-wrapper">
            <div class="kanban-board" id="kanbanBoard" aria-label="Kanban Board">
              <div class="kanban-board-inner">
                {kanbanColumns.map((column) => (
                  <section class="column" data-column-id={column.id} aria-label={`${column.value} column`}>
                    <header class="header">
                      <h2 class="title">{column.value}</h2>
                      <span class="count" id={`count-${column.id}`}>
                        {kanbanData[column.id]?.length || 0}
                      </span>
                    </header>
                    <div class="objectives" data-column-id={column.id}>
                      {kanbanData[column.id] && kanbanData[column.id].map((o) => (
                        <ObjectiveCard objective={o} datasetShowModal={datasetShowModal} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ObjectiveAddEdit />

        {/* Single source of truth for client-created objective cards */}
        <template id="objective-template">
          <ObjectiveCard objective={null} datasetShowModal={datasetShowModal} />
        </template>
      </>
    )
  })


const ObjectiveCard: FC<{ objective: QueryObjective | null, datasetShowModal: DatasetReturn }> = ({ objective, datasetShowModal }) => {
  return <>
    <div class="objective" draggable="true" data-id={objective ? String(objective.id) : ''} data-order={objective ? String(objective.order) : undefined}>
      <div class="top-row">
        <span class="title">{objective?.title ?? ''}</span>
        <button {...datasetShowModal.attr(objective?.id)} type="button" class="svg">
          <img src="/img/edit.svg" alt="Edit objective" />
        </button>
      </div>
      <div class="bottom-row" data-populated={Number(objective?.tags?.length) > 0 || Number(objective?.assignees?.length) > 0 ? 'true' : 'false'}>
        <div class="tags">
          {objective?.tags?.map((tag) => <>
            <span class="tag" style={`background-color: ${tag.bgHex}; color: ${tag.fgHex};`}>
              {tag.value}
            </span>
          </>)}
        </div>
        <div class="assignees">
          {objective?.assignees?.map((assignee) => <>
            <img
              class="avatar"
              src={`https://r2.shastatrades.org/${assignee.imageId}.webp`}
              alt={`Assignee ${assignee.id}`}
            />
          </>)}
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
            padding: 1.5rem 1.5rem 1.6rem 1.5rem;
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
                border: none;
                outline: none;
                &:hover {
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
              gap: 0.3rem;
              &[data-populated="true"] {
                margin-top: calc(var(--space-lite) / 2);
              }

              .tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.6rem;
                flex: 1;
                justify-content: flex-start;

                .tag {
                  font-size: 1.4rem;
                  font-weight: 600;
                  padding: 0.45rem 0.9rem;
                  border-radius: 2rem;
                  white-space: nowrap;
                }
              }

              .assignees {
                display: flex;
                align-items: center;
                gap: 0.6rem;
                flex-shrink: 0;
                transform: translateX(0.51rem);

                .avatar {
                  width: 3rem;
                  height: 3rem;
                  border-radius: 50%;
                  object-fit: cover;
                  object-position: center center;
                  box-shadow: 0 0 0 0.1rem #e2e8f0;
                  background-color: #f1f5f9; /* fallback */
                }
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
