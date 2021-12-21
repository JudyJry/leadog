import { PageObject, GameObject } from "./GameObject";
import { UI } from "./UI";

export class Action extends PageObject {
    constructor(manager) {
        super(manager);
    }
}

export class ActionObject extends GameObject {
    constructor(manager, action) {
        super(manager);
        this.action = action;
    }
}

export class ActionUI extends UI {
    constructor(manager, action) {
        super(manager);
        this.action = action;
    }
}