import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player } from './GameObject.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class KnowObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "KnowObject";
        this.container = new PIXI.Container();
        this.isZoomIn = false;
        this.children = {
            "background": new Background(this.manager, this, "image/building/know/bg.png"),
            "billboard": new Billboard(this.manager, this),
            "blackboard": new Blackboard(this.manager, this),
            "gashapon": new Gashapon(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class Billboard extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "寄養家庭條件";
        this.x = -0.189;
        this.y = 0.017;
        this.url = "image/building/know/billboard.png";
        this.zoomIn = 2;
    }
}
class Blackboard extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "收養家庭條件";
        this.x = -0.017;
        this.y = -0.095;
        this.url = "image/building/know/blackboard.png";
        this.zoomIn = 2;
    }
}
class Gashapon extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "收養家庭條件";
        this.x = 0.259;
        this.y = -0.05;
        this.url = "image/building/know/gashapon.png";
        this.aurl = "image/building/know/gashapon_alpha.png";
        this.zoomIn = 1.2;
        this.fadeText = "開始遊戲";
    }
}

