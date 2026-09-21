// app/src/lib/ObjectiveActivity.tsx

import { css } from 'hono/css'
import type { FC } from 'hono/jsx'
import { formatTime } from '@hono-directives'
import { safeObjectAccess } from '@safely-access'
import svgPersonAdd from '@src/svg/personAdd.svg?raw'
import svgAddComment from '@src/svg/addComment.svg?raw'
import svgAddDocument from '@src/svg/addDocument.svg?raw'
import svgpPersonRemove from '@src/svg/personRemove.svg?raw'
import type { QueryObjectiveActivity, QueryObjectiveActivityItem } from '@src/db'
import { dsObjectiveTags, dsObjectiveTagsByIds } from '@src/dataStructures/objectiveTags.ds'
import { dsObjectiveColumns, dsObjectiveColumnsByIds } from '@src/dataStructures/objectiveColumns.ds'


export const ObjectiveActivity = (({ res }) => {
  return <>
    <div class="feed">
      {res.items.map(item => <ObjectiveActivityItem item={item} />)}
    </div>

    {
      res.nextCursor && <>
        <div class="feed-footer">
          <hr />
          <button type="button" class="primary">Load older activity</button>
        </div>
      </>
    }
  </>
}) satisfies FC<{ res: QueryObjectiveActivity }>



export const ObjectiveActivityItem = (({ item }) => {
  switch (item.typeId) {
    case 1: return <AssigneeAdded actorName={item.actor?.firstName + ' ' + item.actor?.lastName} assigneeName={item.assignee?.firstName + ' ' + item.assignee?.lastName} objectiveId={item.objective.id} objectiveName={item.objective.title} epoch={item.createdAtMs} />
    case 2: return <AssigneeRemoved actorName={item.actor?.firstName + ' ' + item.actor?.lastName} assigneeName={item.assignee?.firstName + ' ' + item.assignee?.lastName} objectiveId={item.objective.id} objectiveName={item.objective.title} epoch={item.createdAtMs} />
    case 4:
      if (!item.tag?.id) throw new Error('!item.tag?.id', { cause: item })
      return <TagAdded actorName={item.actor?.firstName + ' ' + item.actor?.lastName} tagId={item.tag.id} objectiveId={item.objective.id} objectiveName={item.objective.title} epoch={item.createdAtMs} />
    case 5:
      if (!item.tag?.id) throw new Error('!item.tag?.id', { cause: item })
      return <TagRemoved actorName={item.actor?.firstName + ' ' + item.actor?.lastName} tagId={item.tag.id} objectiveId={item.objective.id} objectiveName={item.objective.title} epoch={item.createdAtMs} />
    case 6:
      if (!item.comment) throw new Error('!item.comment', { cause: item })
      return <CommentAdded actorName={item.actor?.firstName + ' ' + item.actor?.lastName} objectiveId={item.objective.id} objectiveName={item.objective.title} comment={item.comment.value} epoch={item.createdAtMs} />
    case 7:
      if (!item.toColumn?.id) throw new Error('!item.toColumn?.id', { cause: item })
      return <ObjectiveCreated actorName={item.actor?.firstName + ' ' + item.actor?.lastName} columnId={item.toColumn.id} objectiveId={item.objective.id} objectiveName={item.objective.title} epoch={item.createdAtMs} />
    case 3:
      if (!item.toColumn?.id) throw new Error('!item.toColumn?.id', { cause: item })
      if (!item.fromColumn?.id) throw new Error('!item.fromColumn?.id', { cause: item })
      return <ColumnChanged actorName={item.actor?.firstName + ' ' + item.actor?.lastName} fromColumnId={item.fromColumn.id} toColumnId={item.toColumn.id} objectiveId={item.objective.id} objectiveName={item.objective.title} epoch={item.createdAtMs} />
    default: return <></>
  }
}) satisfies FC<{ item: QueryObjectiveActivityItem }>



export const objectiveActivityStyle = css`
  .feed {
    margin: 0 auto;
    max-width: 87rem;
    position: relative;
    padding-top: var(--space-lite);
    &::before {
      content: '';
      position: absolute;
      left: 1.9rem;
      top: 1.2rem;
      bottom: 1.2rem;
      width: 0.1rem;
      background: #ececec;
    }

    .event {
      position: relative;
      display: flex;
      gap: 1.6rem;
      padding-bottom: 2.8rem;
      &:last-child {
        padding-bottom: 0;
      }

      .icon {
        position: relative;
        z-index: 1;
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.7rem;
        flex-shrink: 0;
        background: #ffffff;
        box-shadow: 0 0 0 0.4rem #ffffff;
          &.add {
          color: #327c4e;
          background-color: #e9faef;
        }
        &.move {
          background: #eff6ff;
          color: #2563eb;
        }
        &.remove {
          background: #fdf4ff;
          color: #c026d3;
        }

        svg {
          width: 1.8rem;
          height: 1.8rem;
        }
      }

      .body {
        flex: 1;
        min-width: 0;
        padding-top: 0.6rem;

        .text {
          color: #2b2b2b;
          /* allow a/span/strong words to break mid-word when needed */
          overflow-wrap: anywhere;
          word-break: normal;

          a,
          span,
          strong {
            margin-right: 0.6rem;
            &:last-child {
              margin-right: 0;
            }
          }

          a,
          strong {
            font-weight: 500;
          }

          a {
            color: rgb(1, 59, 144);
            text-decoration: none;
            &:hover {
              text-decoration: underline;
            }
          }

          .chip {
            display: inline-block;
            white-space: nowrap;
            overflow-wrap: normal;
            word-break: keep-all;
            vertical-align: middle;
            padding: 0.3rem 1.2rem;
            border-radius: 99rem;
            font-size: 1.61rem;
            font-weight: 500;

            /* tags */
            &.inDevelopment {
              color: #1E40AF;
              border: 1px solid #1E40AF;
              background-color: #DBEAFE;
            }
            &.readyForQa {
              color: #5027FF;
              background-color: #E1DBFE;
              border: 1px solid #5027FF;
            }
            &.inQa {
              color: #92400E;
              background-color: #FEF3C7;
              border: 1px solid #92400E;
            }
            &.failedQa {
              color: #991B1B;
              background-color: #FEE2E2;
              border: 1px solid #991B1B;
            }
            &.passedQa {
              color: #018A5D;
              border: 1px solid #018a5d;
              background: #F3F9F5;
            }
            &.completed {
              color: #166534;
              background-color: #DCFCE7;
              border: 1px solid #166534;
            }
            &.archived {
              color: #475569;
              background-color: #F1F5F9;
              border: 1px solid #475569;
            }

            /* columns */
            &.todo {
              color: #6366f1;
              border: 1px solid #6366f1;
              background: linear-gradient(to bottom, rgba(99, 102, 241, 0.08), transparent);
            }
            &.inProgress {
              color: #cc8100;
              border: 1px solid #f59e0b;
              background: linear-gradient(to bottom, rgba(245, 158, 11, 0.08), transparent);
            }
            &.completed {
              color: #166534;
              background-color: #DCFCE7;
              border: 1px solid #166534;
            }
          }
        }

        time {
          display: block;
          font-size: 1.5rem;
          color: #9a9a9a;
          margin-top: 0.4rem;
        }

        .comment-preview {
          margin-top: var(--space-lite);
          padding: var(--space-lite);
          background: #fafafa;
          border-left: 0.3rem solid #e5e5e5;
          border-radius: 0 0.8rem 0.8rem 0;
          color: #4b4b4b;
          line-height: 1.6;
          margin-bottom: calc(var(--space-lite) / 2);
          font-size: 90%;
        }
      }
    }
  }

  .feed-footer {
    padding: var(--space);
    text-align: center;
    overflow: visible;

    hr {
      height: 1px;
      width: 100%;
      border: none;
      background: linear-gradient(90deg, transparent 0%, rgba(6, 27, 14, 0.1) 9%, rgba(6, 27, 14, 0.1) 91%, transparent 100%);
      margin: var(--space) 0;
    }

    button {
      display: inline-block;
      font-size: 90%;
    }
  }
`



const Chip = ((props) => {
  let key, label

  if ('tagId' in props) {
    key = safeObjectAccess(dsObjectiveTagsByIds, props.tagId)
    label = safeObjectAccess(dsObjectiveTags, key).label
  }

  if ('columnId' in props) {
    key = safeObjectAccess(dsObjectiveColumnsByIds, props.columnId)
    label = safeObjectAccess(dsObjectiveColumns, key).label
  }

  if (!key) throw new Error('!key', { cause: props })
  if (!label) throw new Error('!label', { cause: props })

  return <span class={`chip ${key}`}>{label}</span>
}) satisfies FC<{ tagId: number } | { columnId: number }>



const ColumnChanged = (({ actorName, objectiveId, objectiveName, fromColumnId, toColumnId, epoch }) => {
  return <>
    <div class="event">
      <div class="icon move" aria-hidden="true">→</div>
      <div class="body">
        <div class="text">
          <strong>{actorName}</strong>
          <span>moved</span>
          <a href={`/objectives?id=${objectiveId}`} target="_blank">{objectiveName}</a>
          <span>from</span>
          <Chip columnId={fromColumnId} />
          <span>to</span>
          <Chip columnId={toColumnId} />
        </div>
        <time data-directive={formatTime(epoch)}>{epoch}</time>
      </div>
    </div>
  </>
}) satisfies FC<{ actorName: string, objectiveId: number, objectiveName: string, fromColumnId: number, toColumnId: number, epoch: number }>



const CommentAdded = (({ actorName, objectiveId, objectiveName, comment, epoch }) => {
  return <>
    <div class="event">
      <div class="icon add" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svgAddComment }} />
      <div class="body">
        <div class="text">
          <strong>{actorName}</strong>
          <span>commented on</span>
          <a href={`/objectives?id=${objectiveId}`} target="_blank">{objectiveName}</a>
        </div>
        <div class="comment-preview">{comment}</div>
       <time data-directive={formatTime(epoch)}>{epoch}</time>
      </div>
    </div>
  </>
}) satisfies FC<{ actorName: string, objectiveId: number, objectiveName: string, comment: string, epoch: number }>



const AssigneeAdded = (({ actorName, assigneeName, objectiveId, objectiveName, epoch }) => {
  return <>
    <div class="event">
      <div class="icon add" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svgPersonAdd }} />
      <div class="body">
        <div class="text">
          <strong>{actorName}</strong>
          <span>assigned</span>
          <strong>{assigneeName}</strong>
          <span>to</span>
          <a href={`/objectives?id=${objectiveId}`} target="_blank">{objectiveName}</a>
        </div>
       <time data-directive={formatTime(epoch)}>{epoch}</time>
      </div>
    </div>
  </>
}) satisfies FC<{ actorName: string, assigneeName: string, objectiveId: number, objectiveName: string, epoch: number }>



const AssigneeRemoved = (({ actorName, assigneeName, objectiveId, objectiveName, epoch }) => {
  return <>
    <div class="event">
      <div class="icon remove" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svgpPersonRemove }} />
      <div class="body">
        <div class="text">
          <strong>{actorName}</strong>
          <span>removed</span>
          <strong>{assigneeName}</strong>
          <span>from</span>
          <a href={`/objectives?id=${objectiveId}`} target="_blank">{objectiveName}</a>
        </div>
       <time data-directive={formatTime(epoch)}>{epoch}</time>
      </div>
    </div>
  </>
}) satisfies FC<{ actorName: string, assigneeName: string, objectiveId: number, objectiveName: string, epoch: number }>



const TagAdded = (({ actorName, objectiveId, objectiveName, tagId, epoch }) => {
  return <>
    <div class="event">
      <div class="icon add" aria-hidden="true">✦</div>
      <div class="body">
        <div class="text">
          <strong>{actorName}</strong>
          <span>added the tag</span>
          <Chip tagId={tagId} />
          <span>to</span>
          <a href={`/objectives?id=${objectiveId}`} target="_blank">{objectiveName}</a>
        </div>
       <time data-directive={formatTime(epoch)}>{epoch}</time>
      </div>
    </div>
  </>
}) satisfies FC<{ actorName: string, objectiveId: number, objectiveName: string, tagId: number, epoch: number }>



const TagRemoved = (({ actorName, objectiveId, objectiveName, tagId, epoch }) => {
  return <>
    <div class="event">
      <div class="icon remove" aria-hidden="true">✦</div>
      <div class="body">
        <div class="text">
          <strong>{actorName}</strong>
          <span>removed the tag</span>
          <Chip tagId={tagId} />
          <span>from</span>
          <a href={`/objectives?id=${objectiveId}`} target="_blank">{objectiveName}</a>
        </div>
       <time data-directive={formatTime(epoch)}>{epoch}</time>
      </div>
    </div>
  </>
}) satisfies FC<{ actorName: string, objectiveId: number, objectiveName: string, tagId: number, epoch: number }>



const ObjectiveCreated = (({ actorName, columnId, objectiveId, objectiveName, epoch }) => {
  return <>
    <div class="event">
      <div dangerouslySetInnerHTML={{ __html: svgAddDocument }} class="icon add" aria-hidden="true" />
      <div class="body">
        <div class="text">
          <strong>{actorName}</strong>
          <span>created</span>
          <a href={`/objectives?id=${objectiveId}`} target="_blank">{objectiveName}</a>
          <span>and placed it into</span>
          <Chip columnId={columnId} />
        </div>
       <time data-directive={formatTime(epoch)}>{epoch}</time>
      </div>
    </div>
  </>
}) satisfies FC<{ actorName: string, columnId: number, objectiveId: number, objectiveName: string, epoch: number }>
