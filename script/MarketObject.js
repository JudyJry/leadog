import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, OtherObject } from './GameObject.js';
import { sound } from '@pixi/sound';
import { createSprite } from './GameFunction.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class MarketObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "MarketObject";
        this.soundUrl = "sound/market.mp3";
        this.background = new PIXI.Container();
        this.children = {
            "background": new MarketBackground(this.manager, this, "image/building/market/bg.png"),
            "grass_0": new OtherObject(this.manager, "grass_0", -0.3, 0.102, "image/building/market/grass_0.png"),
            "grass_1": new OtherObject(this.manager, "grass_1", 0.124, 0.102, "image/building/market/grass_1.png"),
            "market_0": new Market(this.manager, this, -0.325, -0.019, "image/building/market/market_0.png"),
            "market_1": new Market(this.manager, this, -0.038, -0.017, "image/building/market/market_1.png"),
            "market_2": new Market(this.manager, this, 0.247, -0.023, "image/building/market/market_2.png"),
            "market_3": new Market(this.manager, this, 0.533, -0.019, "image/building/market/market_3.png"),
            "player": new Player(this.manager, this, 0.22)
        };
    }
    setup() {
        this.container.name = this.name;
        this.sound = sound.add(this.name, this.soundUrl);
        this.sound.loop = true;
        this.sound.muted = this.manager.isMute;
        this.sound.volume = 0.5;
        return new Promise(function (resolve, _) {
            for (let [_, e] of Object.entries(this.children)) { e.setup(); }
            this.manager.app.stage.addChild(this.background);
            this.manager.app.stage.addChild(this.container);
            this.sound.play();
            resolve();
        }.bind(this))
    }
    addChild(...e) {
        this.childrenContainer.addChild(...e);
        this.childrenContainer.sortChildren();
    }
    removeChild(...e) {
        if (e.length === 0) { this.childrenContainer.removeChildren(); }
        else { this.childrenContainer.removeChild(...e); }
    }
}
class MarketBackground extends Background {
    constructor(manager, page, url, width = window.innerWidth, height = window.innerHeight) {
        super(manager, page, url);
        this.w = 1920;
        this.h = 1080;
        this.draw = function () {
            width = window.innerWidth;
            height = window.innerHeight;
            this.wall = {
                "right": (-width / 2) + ((this.space / 10) + this.speed) - 750,
                "left": (width / 2) - ((this.space / 10) + this.speed)
            }
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.manager.canvasScale = width / 1920;
            this.container.addChild(this.sprite);
            this.page.container.position.x = this.wall.left;
            this.caution = createSprite("image/building/caution.png", 1, 0.75);
            this.caution.zIndex = 200;
            this.caution.position.set((width / 2) - 10, (height / 2) - 10);
            this.manager.app.stage.addChild(this.caution);
        }
    }
    setup() {
        this.draw();
        this.container.name = this.name;
        this.container.scale.set(this.manager.canvasScale);
        this.page.background.addChild(this.container);
    }
    update() {
        if (!this.page.isZoomIn) {
            const frame = this.page.container;
            if (this.manager.mouse.x > window.innerWidth - this.space && frame.position.x > this.wall.right) {
                let distance = (this.space - (window.innerWidth - this.manager.mouse.x)) / 10;
                frame.position.x -= this.speed + distance;
            }
            if (this.manager.mouse.x < this.space && frame.position.x < this.wall.left) {
                let distance = (this.space - this.manager.mouse.x) / 10;
                frame.position.x += this.speed + distance;
            }
        }
    }
}
class Market extends linkObject {
    constructor(manager, page, x, y, url) {
        super(manager, page);
        this.x = x;
        this.y = y;
        this.url = url;
        this.zoomIn = 1.5;
    }
}