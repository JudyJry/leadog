import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Door } from './GameObject.js';
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
            "door": new Door(this.manager, this, -0.403, -0.067, "image/building/childhood/door.png"),
            "video": new Video(this.manager, this),
            "tv": new Tv(this.manager, this),
            "book": new Book(this.manager, this),
            "map": new Map(this.manager, this),
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
        this.random = Math.floor(Math.random() * 3);
        this.videoList = [
            "video/elderly_story1.mp4",
            "video/elderly_story2.mp4",
            "video/elderly_story3.mp4"
        ];
    }
    clickEvent() {
        let tl = gsap.timeline();
        tl.to(this.page.container.scale, { duration: 0.5, x: this.zoomIn, y: this.zoomIn });
        tl.to(this.page.container, { duration: 0.5, x: -this._x * this.zoomIn, y: -this._y * this.zoomIn }, 0);
        this.page.isZoomIn = true;
        this.drawCancel();
        this.drawVideo();
        this.drawUI();
    }
    drawVideo() {
        this.manager.loader.load(this.videoList[this.random],
            function (loader, resources) {
                this.video = new PIXI.Sprite(resources[this.videoList[this.random]].texture);
                this.video.anchor.set(0.5);
                this.video.scale.set(this.scale);
                this.videoTexture = this.video.texture.baseTexture;
                this.videoCrol = this.videoTexture.resource.source;
                this.videoTexture.autoPlay = false;
                this.videoTexture.resource.autoPlay = false;
                this.videoCrol.muted = this.manager.isMute;
                this.currentTime = this.videoCrol.currentTime;
                this.container.addChild(this.video);
                this.container.position.set(0, -2.5);
                this.container.alpha = 0;
            }.bind(this));
    }
    drawUI() {
        this.ui = new PIXI.Container();
        this.frame = PIXI.Sprite.from("image/video/video.png");
        this.frame.anchor.set(0.5);
        this.frame.scale.set(this.scale);
        this.container.addChild(this.frame);

    }

}
class Tv extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Tv";
        this.x = 0.276;
        this.y = 0;
        this.url = "image/building/elderly/tv.png";
        this.zoomIn = 2;
        this.fadeText = "點擊播放影片";
        this.spriteHeight = 10;
        this.random = Math.floor(Math.random() * 4);
    }
    clickEvent() {
        this.page.container.scale.set(1);
        this.page.container.position.set(0, 0);
        this.manager.loadAction(new ElderlyAction_Hair(this.manager), loadList.hair);
    }
}
class Map extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Map";
        this.x = 0.44;
        this.y = -0.081;
        this.url = "image/building/elderly/map.png";
        this.zoomIn = 1.5;
    }
}
class Book extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Book";
        this.x = -0.294;
        this.y = -0.121;
        this.url = "image/building/elderly/book.png";
        this.zoomIn = 2;
        this.spriteHeight = 120;
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