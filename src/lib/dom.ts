// app/src/lib/dom.ts

import { id, field, dataset, className } from '@hono-dom'


// id
export const idNavModal = () => id('nav-modal')
export const idAuthModal = () => id('auth-modal')
export const idObjectiveTemplate = () => id('objective-template')
export const idObjectiveInUpForm = () => id('objective-in-up-form')
export const idObjectiveInUpModal = () => id('objective-in-up-modal')
export const idObjectiveInUpModalMd = () => id('objective-in-up-modal-md')
export const idObjectiveInUpModalTitle = () => id('objective-in-up-modal-title')
export const idObjectiveInUpModalSubmit = () => id('objective-in-up-modal-submit')
export const idObjectiveInUpModalMdToggle = () => id('objective-in-up-modal-md-toggle')


// field
export const fieldObjectiveInUpTitle = () => field('text', 'title', 'objective-in-up')
export const fieldObjectiveInUpTagIds = () => field('checkbox', 'tagIds', 'objective-in-up')
export const fieldObjectiveInUpColumnId = () => field('select', 'columnId', 'objective-in-up')
export const fieldObjectiveInUpAssigneeIds = () => field('checkbox', 'assigneeIds', 'objective-in-up')
export const fieldObjectiveInUpDescription = () => field('textarea', 'description', 'objective-in-up')


// dataset
export const datasetId = () => dataset('id')
export const datasetAuth = () => dataset('auth')
export const datasetOrder = () => dataset('order')
export const datasetColumnId = () => dataset('columnId')
export const datasetFlowStepButton = () => dataset('flowStepButton')
export const datasetFlowStepContainer = () => dataset('flowStepContainer')
export const datasetConnectStepButton = () => dataset('connectStepButton')
export const datasetConnectStepContainer = () => dataset('connectStepContainer')
export const datasetObjectiveInUpShowModal = () => dataset('objectiveInUpShowModal')


// className
export const classNameSvg = () => className('svg')
export const classNameTags = () => className('tags')
export const classNameStep = () => className('step')
export const classNameTitle = () => className('title')
export const classNameColumn = () => className('column')
export const classNameAssignees = () => className('assignees')
export const classNameObjective = () => className('objective')
export const classNameObjectives = () => className('objectives')
export const classNameColumnCount = () => className('column-count')
export const classNameIsBeingDragged = () => className('is-being-dragged')
