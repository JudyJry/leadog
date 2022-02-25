import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player } from './GameObject.js';
import { BronAction_Story1, BronAction_Story2 } from './BronAction_Story.js';
import { FilterSet } from './FilterSet.js';
import { addPointerEvent } from './GameFunction.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class BronObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "BronObject";
        this.children = {
            "background": new Background(this.manager, this, "image/building/bron/bg.png"),
            "video": new Video(this.manager, this),
            "clan": new Clan(this.manager, this),
            "map": new Map(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class Video extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = -0.291;
        this.y = -0.046;
        this.url = "image/building/bron/video.png";
        this.zoomIn = 2;
        this.fadeText = "點擊播放影片";
        this.spriteHeight = 10;
        this.random = Math.floor(Math.random() * 2);
    }
    clickEvent() {
        this.page.container.scale.set(1);
        this.page.container.position.set(0, 0);
        switch (this.random) {
            case 0:
                this.manager.loadAction(new BronAction_Story1(this.manager), loadList.toys);
                break;
            case 1:
                this.manager.loadAction(new BronAction_Story2(this.manager), loadList.toys);
                break;
        }

    }
}
class Clan extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Clan";
        this.x = 0.162;
        this.y = 0.205;
        this.url = "image/building/bron/clan.png";
        this.turl = "image/building/bron/clan_tree.png";
        this.zoomIn = 2;
        this.spriteHeight = 120;
        this.draw = function () {
            this._x = (this.x * this.w * 2);
            this._y = (this.y * this.h * 2);
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.tree = PIXI.Sprite.from(this.turl);
            this.tree.anchor.set(0.5, 1);
            this.tree.scale.set(this.scale);
            this.tree.alpha = 0.5;
            this.tree.position.set(-10, -50);

            this.blink = FilterSet.blink();
            this.sprite.filters = [this.blink.filter];

            this.text = new PIXI.Text(this.fadeText, this.ts);
            this.text.anchor.set(0.5);
            this.textHeight = this.spriteHeight + 10;

            this.container.addChild(this.tree, this.sprite, this.text);

            this.sprite.clickEvent = this.clickEvent.bind(this);
            addPointerEvent(this.sprite);
            this.container.position.set(this._x, this._y);
        }
    }
}
class Map extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Map";
        this.x = 0.424;
        this.y = -0.082;
        this.url = "image/building/bron/map.png";
        this.zoomIn = 1.5;
    }
}

const loadList = {
    story1: [
        "sound/bron_story.mp3",
        "video/bron_story1.mp4"
    ],
    story2: [
        "sound/bron_story.mp3",
        "video/bron_story2.mp4"
    ]
}
