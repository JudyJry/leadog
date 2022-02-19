import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background } from './GameObject.js';
import { BronAction_Story1, BronAction_Story2 } from './BronAction_Story.js';

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
    //clickEvent() { }
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
    //clickEvent() { }
}
class Photo extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "狗狗出生照片";
        this.x = 0.245;
        this.y = -0.249;
        this.url = "image/building/bron/photo.png";
        this.surl = "image/building/bron/photo_shadow.png";
        this.random = Math.floor(Math.random() * 2);
    }
    clickEvent() {
        switch (this.random) {
            case 0:
                this.manager.loadAction(new BronAction_Story1(this.manager), loadList.story1);
                break;
            case 1:
                this.manager.loadAction(new BronAction_Story2(this.manager), loadList.story2);
                break;
        }
    }
}

const loadList = {
    story1: [
        "sound/bron_story1.wav",
        "video/bron_story1.mp4"
    ],
    story2: [
        "sound/bron_story2.mp3",
        "video/bron_story2.mp4"
    ]
}