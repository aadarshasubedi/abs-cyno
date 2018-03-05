import { ActionType} from './ActionType';

export class Action {
    constructor(public type: ActionType, public data?: any) {}
}
