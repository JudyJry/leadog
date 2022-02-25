import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Door } from './GameObject.js';
import { ElderlyAction_Story1, ElderlyAction_Story2, ElderlyAction_Story3 } from './ElderlyAction_Story.js';
import { ElderlyAction_Hair } from './ElderlyAction_Hair.js';
import { addPointerEvent, createSprite } from './GameFunction.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class ElderlyObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "ElderlyObject";
        this.children = {
            "background": new Background(this.manager, this, "image/building/elderly/bg.png"),
            "door": new Door(this.manager, this, -0.403, -0.067, "image/building/elderly/door.png"),
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
        this.y = -0.077;
        this.url = "image/building/elderly/video.png";
        this.zoomIn = 1.6;
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
    cancelEvent() {
        let tl = gsap.timeline();
        tl.to(this.page.container.scale, { duration: 0.5, x: this.scale, y: this.scale });
        tl.to(this.page.container, { duration: 0.5, x: -this._x / 2, y: 0 }, 0);
        this.page.isZoomIn = false;
        this.cancel.remove();
        //this.videoCrol.pause();
        this.container.removeChild(this.video, this.ui);
    }
    drawVideo(url = this.videoList[this.random]) {
        this.video = createSprite(url, 0.5, 0.44);
        this.videoTexture = this.video.texture.baseTexture;
        this.videoCrol = this.videoTexture.resource.source;
        this.videoTexture.autoPlay = false;
        this.videoTexture.resource.autoPlay = false;
        this.videoCrol.muted = this.manager.isMute;
        this.currentTime = this.videoCrol.currentTime;
        this.video.position.set(0, -7.5);
        //this.video.alpha = 0;
        this.videoCrol.pause();
        this.videoCrol.currentTime = 0;
        this.videoCrol.ontimeupdate = () => {
            this.currentTime = this.videoCrol.currentTime;
        };
        this.container.addChildAt(this.video, 1);
        this.videoCrol.play();
        this.video.clickEvent = function () {
            if (this.videoCrol.paused) { this.videoCrol.play(); this.playButton.texture = PIXI.Texture.from("image/video/pause.png"); }
            else { this.videoCrol.pause(); this.playButton.texture = PIXI.Texture.from("image/video/play.png"); }
        }.bind(this);
        addPointerEvent(this.video);
    }
    drawUI() {
        this.ui = new PIXI.Container();
        this.frame = createSprite("image/video/video.png", 0.5, this.scale);
        this.playButton = createSprite("image/video/play.png", 0.5, this.scale);
        this.volumeButton = createSprite("image/video/volume.png", 0.5, this.scale);
        this.nextButton = createSprite("image/video/next.png", 0.5, this.scale);
        this.fullButton = createSprite("image/video/full.png", 0.5, this.scale);

        let standard = -385;
        let h = 260;
        let space = 42;
        this.playButton.position.set(standard, h);
        this.nextButton.position.set(standard + space * 1, h);
        this.volumeButton.position.set(standard + space * 2, h);
        this.fullButton.position.set(-standard, h);

        this.playButton.clickEvent = function () {
            if (this.videoCrol.paused) { this.videoCrol.play(); this.playButton.texture = PIXI.Texture.from("image/video/pause.png"); }
            else { this.videoCrol.pause(); this.playButton.texture = PIXI.Texture.from("image/video/play.png"); }
        }.bind(this);

        this.nextButton.clickEvent = function () {
            if (this.random === 2) { this.random = 0 }
            else { this.random += 1 }
            this.container.removeChild(this.video);
            this.drawVideo();
        }.bind(this);

        this.volumeButton.clickEvent = function () {
            if (this.videoCrol.muted) { this.videoCrol.muted = false; this.volumeButton.texture = PIXI.Texture.from("image/video/volume.png"); }
            else { this.videoCrol.muted = true; this.volumeButton.texture = PIXI.Texture.from("image/video/volume_off.png"); }
        }.bind(this);

        this.fullButton.clickEvent = function () {

        }.bind(this);

        addPointerEvent(this.playButton);
        addPointerEvent(this.volumeButton);
        addPointerEvent(this.nextButton);
        addPointerEvent(this.fullButton);

        this.ui.addChild(this.frame, this.playButton, this.volumeButton, this.nextButton, this.fullButton);
        this.container.addChild(this.ui);
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