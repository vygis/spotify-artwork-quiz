import { Action } from '@ngrx/store';
import { Album } from '../models/album';
import { Answer } from '../models/answer';
import { type } from '../util';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const ActionTypes = {
  INIT:           type('[Quiz] Init'),
  LOAD:           type('[Quiz] Load'),
  ANSWER:         type('[Quiz] Answer'),
  NEXT_QUESTION:  type('[Quiz] Next Question')
};


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class InitAction implements Action {
  type = ActionTypes.INIT;

  constructor(public payload: number) { }
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: {genres: string[], albums: Album[]}) { }
}

export class AnswerAction implements Action {
  type = ActionTypes.ANSWER;

  constructor(public payload: Answer) { }
}

export class NextQuestionAction implements Action {
  type = ActionTypes.NEXT_QUESTION;

  constructor() { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = LoadAction
  | InitAction
  | AnswerAction
  | NextQuestionAction;
