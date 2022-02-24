import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player } from './GameObject.js';
import { ElderlyAction_Story1, ElderlyAction_Story2, ElderlyAction_Story3 } from './ElderlyAction_Story.js';
import { ElderlyAction_Hair } from './ElderlyAction_Hair.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class ElderlyObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "ElderlyObject";
        this.children = {
            "background": new Background(this.manager, this, "image/building/elderly/bg.png"),
            "video": new Video(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class Video extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = -0.103;
        this.y = -0.067;
        this.url = "image/building/elderly/video.png";
        this.zoomIn = 2;
        this.fadeText = "點擊播放影片";
        this.spriteHeight = 10;
        this.random = Math.floor(Math.random() * 4);
    }
    clickEvent() {
        this.page.container.scale.set(1);
        this.page.container.position.set(0, 0);
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
