// app/src/objectives/ObjectiveController.ts

import { query } from '@hono-dom'
import { AppType } from '@src/index'
import { createRPC } from '@hono-api/fe'
import { QueryObjective } from '@src/db/queryObjective'
import type { QueryTags, QueryStaffPeople } from '@src/db'
import { datasetId, idObjectiveInUpModal } from '@src/lib/dom'


export class ObjectiveController {
  tags: QueryTags = []
  rpc = createRPC<AppType>()
  idDataset = datasetId()
  staff: QueryStaffPeople = []
  elModal = query<HTMLDivElement>(idObjectiveInUpModal().query).one()


  async dbQuery(objectiveId: number): Promise<QueryObjective | undefined> {
    const [resTags, resAssignees, resObjective] = await Promise.all([
      this.tags.length === 0 ? this.rpc.api.tags.$get() : null,
      this.staff.length === 0 ? this.rpc.api.staff.$get() : null,
      objectiveId ? this.rpc.api.objective[':id'].$get({ param: { id: String(objectiveId) } }) : null,
    ])

    if (resTags) this.tags = (await resTags.json()).tags

    if (resAssignees) this.staff = (await resAssignees.json()).staff

    if (resObjective) return (await resObjective.json()).objective
  }
}
