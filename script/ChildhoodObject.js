import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { PageObject, linkObject, Background } from './GameObject.js';
import ChildhoodAction from './ChildhoodAction.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class ChildhoodObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "ChildhoodObject";
        this.children = {
            "background": new Background(manager, "image/building/childhood/childhood_bg.png"),
            "toys": new Toys(manager),
        };
    }
}
class Toys extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "玩具互動";
        this.x = 0.33;
        this.y = 0.143;
        this.url = "image/building/childhood/toys.png";
        this.surl = "image/building/childhood/toys_shadow.png"
    }
    todo(){
        this.manager.loadAction(new ChildhoodAction(this.manager));
    }
}