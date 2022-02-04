import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background } from './GameObject.js';
import { ElderlyAction_Story1, ElderlyAction_Story2, ElderlyAction_Story3 } from './ElderlyAction_Story.js';
import { ElderlyAction_Hair } from './ElderlyAction_Hair.js';

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
        //this.random = Math.floor(Math.random() * 3);
        this.random = 3
    }
    todo() {
        switch (this.random) {
            case 0:
                this.manager.loadAction(new ElderlyAction_Story1(this.manager), loadList.story1);
                break;
            case 1:
                this.manager.loadAction(new ElderlyAction_Story2(this.manager), loadList.story2);
                break;
            case 2:
                this.manager.loadAction(new ElderlyAction_Story3(this.manager), loadList.story3);
                break;
            case 3:
                this.manager.loadAction(new ElderlyAction_Hair(this.manager), loadList.hair);
                break;
        }
    }
}

const loadList = {
    story1: [
        "sound/elderly_story1.wav",
        "video/elderly_story1.mp4"
    ],
    story2: [
        "sound/elderly_story2.mp3",
        "video/elderly_story2.mp4"
    ],
    story3: [
        "sound/elderly_story3.wav",
        "video/elderly_story3.mp4"
    ],
    hair: [
        "sound/elderly_hair.mp3",
        "video/elderly_hair.mp4",
        "image/video/elderly/hair/title_1.png",
        "image/video/elderly/hair/title_2.png",
        "image/video/elderly/hair/title_3.png",
        "image/video/elderly/hair/hint_1.png",
        "image/video/elderly/hair/hint_2.png",
        "image/video/elderly/hair/hint_3.png",
        "image/video/elderly/hair/button_1.png",
        "image/video/elderly/hair/button_2.png",
        "image/video/elderly/hair/button_3.png"
    ]
}
