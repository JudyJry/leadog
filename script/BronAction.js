import { Action, ActionObject } from "./Action";
export default class BronAction extends Action {
    constructor(manager) {
        super(manager);
        this.name = "BronAction";
        this.children = {
            "bronActionObject": new BronActionObject(manager),
        }
    }
}

class BronActionObject extends ActionObject {
    constructor(manager) {
        super(manager);
        this.name = "BronActionObject";
        this.draw = function(){
            
        }
    }
}