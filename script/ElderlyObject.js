import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background } from './GameObject.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class ElderlyObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "ElderlyObject";
        this.children = {
            "background": new Background(manager, "image/building/elderly/elderly_bg.png"),
            "distributed": new Distributed(manager),
            "story": new Story(manager)
        };
    }
}

class Distributed extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "收養分佈地圖";
        this.x = -0.145;
        this.y = -0.269;
        this.url = "image/building/elderly/distributed.png";
        this.surl = "image/building/elderly/distributed_shadow.png";
    }
    //todo() { }
}
class Story extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "收養家庭故事";
        this.x = -0.08;
        this.y = 0.171;
        this.url = "image/building/elderly/story.png";
        this.surl = "image/building/elderly/story_shadow.png";
    }
    //todo() { }
}


