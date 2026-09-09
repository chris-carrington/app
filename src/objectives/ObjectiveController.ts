// app/src/objectives/ObjectiveController.ts

import { query } from '@hono-dom'
import { AppType } from '@src/index'
import { createRPC } from '@hono-api/fe'
import type { QueryTags, QueryPeople } from '@src/db'
import { QueryObjective } from '@src/db/queryObjective'
import { datasetId, idObjectiveInUpModal } from '@src/lib/dom'


export class ObjectiveController {
  tags: QueryTags = []
  rpc = createRPC<AppType>()
  idDataset = datasetId()
  assignees: QueryPeople = []
  elModal = query<HTMLDivElement>(idObjectiveInUpModal().query).one()

  async dbQuery(objectiveId: number): Promise<QueryObjective | undefined> {
    const [resTags, resAssignees, resObjective] = await Promise.all([
      this.tags.length === 0 ? this.rpc.api.tags.$get() : null,
      this.assignees.length === 0 ? this.rpc.api.people.$get() : null,
      objectiveId ? this.rpc.api.objective[':id'].$get({ param: { id: String(objectiveId) } }) : null,
    ])

    if (resTags) this.tags = (await resTags.json()).tags

    if (resAssignees) this.assignees = (await resAssignees.json()).people

    if (resObjective) return (await resObjective.json()).objective
  }
}
