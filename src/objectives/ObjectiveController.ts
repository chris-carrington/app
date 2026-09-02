// app/src/objectives/ObjectiveController.ts

import { query } from '@hono-dom'
import { rpcFE } from '@hono-rpc/fe'
import { AppType } from '@src/index'
import { idObjectiveInUpModal } from '@src/lib/dom'
import type { QueryTags, QueryPeople } from '@src/db'
import { QueryObjective } from '@src/db/queryObjective'


export class ObjectiveController {
  tags: QueryTags = []
  rpc = rpcFE<AppType>()
  assignees: QueryPeople = []
  elModal = query<HTMLDivElement>(idObjectiveInUpModal().query).one()

  async dbQuery(objectiveId: number): Promise<QueryObjective | undefined> {
    const [resTags, resAssignees, resObjective] = await Promise.all([
      this.tags.length === 0 ? this.rpc.api.tags.$get() : null,
      this.assignees.length === 0 ? this.rpc.api.people.$get() : null,
      objectiveId ? this.rpc.api.objective[':id'].$get({ param: { id: String(objectiveId) } }) : null,
    ])

    if (resAssignees) this.assignees = await resAssignees.json()

    if (resTags) this.tags = await resTags.json()

    if (resObjective) return await resObjective.json()
  }
}
