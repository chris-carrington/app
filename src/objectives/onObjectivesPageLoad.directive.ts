// app/src/objectives/onObjectivesPageLoad.directive.ts

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
}
