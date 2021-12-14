import { PageObject,GameObject } from "./GameObject";

export class Action extends PageObject{
    constructor(manager) {
        super(manager);
    }
}

export class ActionObject extends GameObject{
    constructor(manager) {
        super(manager);
    }
}