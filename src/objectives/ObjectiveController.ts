// app/src/objectives/ObjectiveController.ts

import { query } from '@hono-dom'
import { AppType } from '@src/index'
import { FormUtil } from '@hono-form'
import { showToast } from '@hono-toast'
import { createRPC, onError } from '@hono-api/fe'
import { QueryObjective } from '@src/db/queryObjective'
import type { QueryTags, QueryStaffPeople } from '@src/db'
import { toggleModalDom, onConfirmEvents } from '@hono-modal'
import { datasetId, classNameObjective, idObjectiveInUpModal, datasetObjectiveInUpShowModal } from '@src/lib/dom'


export class ObjectiveController {
  tags: QueryTags = []
  idDataset = datasetId()
  rpc = createRPC<AppType>()
  staff: QueryStaffPeople = []
  datasetShowModal = datasetObjectiveInUpShowModal()
  elModal = query<HTMLDivElement>(idObjectiveInUpModal().query).one()


  constructor() {
    this.#bindConfirmButtonClickedEvent()
  }


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


  getObjectiveCard(objectiveId: string | number) {
    return document.querySelector<HTMLDivElement>(classNameObjective().query + this.idDataset.query(objectiveId))
  }


  launchObjective() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
      const card = this.getObjectiveCard(id)
      if (!card) return

      const button = query<HTMLButtonElement>(datasetObjectiveInUpShowModal().query(id)).root(card).one()
      button.click()
    }
  }


  #bindConfirmButtonClickedEvent() {
    onConfirmEvents.on('confirmButtonClicked', async () => { // delete objective requested
      const objectiveId = this.elModal.dataset[this.idDataset.camel] // get objectiveId from DOM
      if (!objectiveId) throw new Error('Objective id read from modal is not working')

      onConfirmEvents.emit('isConfirmActionLoading', true) // start confirm modal button loading indicator

      try {
        const response = await this.rpc.api.objective[':id'].$delete({ param: { id: objectiveId } }) // delete objective in db
        const res = await response.json()
        FormUtil.responseThrow(response, res) // throw IF status is not 200

        const card = this.getObjectiveCard(objectiveId)
        if (!card) throw new Error('!card')

        card.remove() // remove card from kanban

        onConfirmEvents.emit('hideModal') // hide confirm modal
   
        toggleModalDom(this.elModal, false) // hide inup modal

        showToast({ variant: 'success', value: 'Success!' }) // notify success
      } catch (e) { // IF status is not 200
        onError(e)
      } finally { // stop confirm modal button loading indicator
        onConfirmEvents.emit('isConfirmActionLoading', false)
      }
    })
  }
}
