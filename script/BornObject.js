import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Video, Door } from './GameObject.js';
import { BornAction_Story1, BornAction_Story2 } from './BornAction_Story.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class BornObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "BornObject";
        this.children = {
            "background": new Background(this.manager, this, "image/building/born/bg.png"),
            "door": new Door(this.manager, this, -0.425, -0.026, "image/building/born/door.png"),
            "video": new BornVideo(this.manager, this),
            "mirror": new Mirror(this.manager, this),
            "map": new Map(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class BornVideo extends Video {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = -0.232;
        this.y = -0.055;
        this.url = "image/building/born/video.png";
        this.zoomIn = 1.6;
        this.videoList = [
            function () { return new BornAction_Story1(this.manager, this) }.bind(this),
            function () { return new BornAction_Story2(this.manager, this) }.bind(this)
        ];
    }
}
class Mirror extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.x = 0.296;
        this.y = -0.048;
        this.url = "image/building/born/mirror.png";
        this.zoomIn = 1.5;
    }
}
class Map extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Map";
        this.x = 0.133;
        this.y = -0.071;
        this.url = "image/building/born/map.png";
        this.zoomIn = 1.5;
    }
}

const loadList = {
    story1: [
        "sound/born_story.mp3",
        "video/born_story1.mp4"
    ],
    story2: [
        "sound/born_story.mp3",
        "video/born_story2.mp4"
    ]
}
