// app/src/lib/dom.ts

import { id, field, dataset, className } from '@hono-dom'


// id
export const idNavModal = () => id('nav-modal')
export const idAuthModal = () => id('auth-modal')
export const idObjectiveAddEditModal = () => id('objective-add-edit-modal')
export const idObjectiveAddEditModalTitle = () => id('objective-add-edit-modal-title')
export const idObjectiveAddEditModalSubmit = () => id('objective-add-edit-modal-submit')


// field
export const fieldObjectiveAddEditTitle = () => field('text', 'title', 'objective-add-edit')
export const fieldObjectiveAddEditColumn = () => field('select', 'column', 'objective-add-edit')
export const fieldObjectiveAddEditAssignees = () => field('checkbox', 'assignees', 'objective-add-edit')
export const fieldObjectiveAddEditDescription = () => field('textarea', 'description', 'objective-add-edit')


// dataset
export const datasetAuth = () => dataset('auth')
export const datasetFlowStepButton = () => dataset('flowStepButton')
export const datasetFlowStepContainer = () => dataset('flowStepContainer')
export const datasetConnectStepButton = () => dataset('connectStepButton')
export const datasetConnectStepContainer = () => dataset('connectStepContainer')
export const datasetObjectiveAddEditShowModal = () => dataset('objectiveAddEditShowModal')


// className
export const classNameStep = () => className('step')
