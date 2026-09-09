// app/src/objectives/onObjectivesPageLoad.directive.ts

import { query } from '@hono-dom'
import { FormUtil } from '@hono-form'
import { onError } from '@hono-api/fe'
import { showToast } from '@hono-toast'
import { onConfirmEvents } from '@hono-modal'
import type { QueryObjectives } from '@src/db/queryObjective'
import { ObjectiveKanban } from '@src/objectives/ObjectiveKanban'
import { ObjectiveController } from '@src/objectives/ObjectiveController'
import { ObjectiveInUpShowModal } from '@src/objectives/ObjectiveInUpShowModal'


export default (el: HTMLDivElement, kanbanData: QueryObjectives): void => {
  const controller = new ObjectiveController()
  const showModal = new ObjectiveInUpShowModal(controller)
  const kanban = new ObjectiveKanban(controller, showModal, el, kanbanData)

  showModal.main()
  kanban.main()

  onConfirmEvents.on('confirmButtonClicked', async () => { // delete objective requested
    const objectiveId = controller.elModal.dataset[controller.idDataset.camel] // get objectiveId from DOM
    if (!objectiveId) throw new Error('Objective id read from modal is not working')

    onConfirmEvents.emit('isConfirmActionLoading', true) // start confirm modal button loading indicator

    try {
      const response = await controller.rpc.api.objective[':id'].$delete({ param: { id: objectiveId } }) // delete objective in db
      const res = await response.json()
      FormUtil.responseThrow(response, res) // throw IF status is not 200

      const card = query<HTMLDivElement>(kanban.objectiveClassName.query + controller.idDataset.query(objectiveId)).root(kanban.el).one()
      card.remove() // remove card from kanban

      onConfirmEvents.emit('hideModal') // hide confirm modal

      controller.elModal.classList.add('hidden') // hide inup modal

      showToast({ variant: 'success', value: 'Success!' }) // notify success
    } catch (error) { // IF status is not 200
      onError(error)
    } finally { // stop confirm modal button loading indicator
      onConfirmEvents.emit('isConfirmActionLoading', false)
    }
  })
}
