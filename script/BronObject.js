import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background } from './GameObject.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class BronObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "BronObject";
        this.children = {
            "background": new Background(manager, "image/building/bron/bron_bg.png"),
            "calendar": new Calendar(manager),
            "distributed": new Distributed(manager),
            "photo": new Photo(manager)
        };
    }
}

class Calendar extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "狗狗出生日歷";
        this.x = -0.015;
        this.y = -0.293;
        this.url = "image/building/bron/calendar.png";
        this.surl = "image/building/bron/calendar_shadow.png";
    }
    //todo() { }
}
class Distributed extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "狗狗出生分布地圖";
        this.x = -0.366;
        this.y = -0.252;
        this.url = "image/building/bron/distributed.png";
        this.surl = "image/building/bron/distributed_shadow.png";
    }
    //todo() { }
}
class Photo extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "狗狗出生照片";
        this.x = 0.245;
        this.y = -0.249;
        this.url = "image/building/bron/photo.png";
        this.surl = "image/building/bron/photo_shadow.png";
    }
    //todo() { }
}