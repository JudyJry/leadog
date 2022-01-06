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
            "doll": new Doll(manager),
            "book": new Book(manager),
            "wallCalendar": new WallCalendar(manager)
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
    todo() {
        this.manager.loadAction(new ChildhoodAction(this.manager));
    }
}
class Doll extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "幼年品種";
        this.x = -0.102;
        this.y = -0.362;
        this.url = "image/building/childhood/doll.png";
        this.surl = "image/building/childhood/doll_shadow.png"
    }
    //todo() {}
}
class Book extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "寄養家庭故事";
        this.x = -0.335;
        this.y = 0.058;
        this.url = "image/building/childhood/book.png";
        this.surl = "image/building/childhood/book_shadow.png"
    }
    //todo() {}
}
class WallCalendar extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "故事回顧";
        this.x = -0.028;
        this.y = -0.225;
        this.url = "image/building/childhood/wallCalendar.png";
        this.surl = "image/building/childhood/wallCalendar_shadow.png"
    }
    //todo() {}
}