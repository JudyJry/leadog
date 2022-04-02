import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Door, OtherObject } from './GameObject.js';
import { FilterSet } from './FilterSet.js';
import { addPointerEvent, createSprite } from './GameFunction.js';
import { brightnessOverEvent, Dialog, glowOverEvent } from './UI.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class KnowObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "KnowObject";
        this.container = new PIXI.Container();
        this.isZoomIn = false;
        this.children = {
            "background": new Background(this.manager, this, "image/building/know/bg.png"),
            "door": new Door(this.manager, this, -0.411, -0.054, "image/building/know/door.png"),
            "tent": new OtherObject(this.manager, "Tent", 0.378, -0.02, "image/building/know/tent.png"),
            "book": new Book(this.manager, this),
            "billboard": new Billboard(this.manager, this),
            "blackboard": new Blackboard(this.manager, this),
            "gashapon": new Gashapon(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class Billboard extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "寄養家庭條件";
        this.x = -0.189;
        this.y = 0.017;
        this.url = "image/building/know/billboard.png";
        this.zoomIn = 2;
    }
    onClickResize() { this.clickButton = this.drawClickButton(); }
    clickEvent() {
        this.blink.outerStrength = 0;
        this.sprite.interactive = false;
        this.zoom();
        this.page.children.player.move(this._x, this.sprite.width);
        this.page.isZoomIn = true;
        this.isClick = true;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.clickButton = this.drawClickButton();
    }
    cancelEvent() {
        let tl = gsap.timeline({
            onComplete: function () {
                this.sprite.interactive = true;
            }.bind(this)
        });
        tl.to(this.page.container.scale, { duration: 0.5, x: this.scale, y: this.scale });
        tl.to(this.page.container, { duration: 0.5, x: -this._x / 2, y: 0 }, 0);
        this.isClick = false;
        this.page.isZoomIn = false;
        this.cancel.visible = false;
        this.cancel = undefined;
        this.container.removeChild(this.clickButton);
    }
    drawClickButton() {
        let e = createSprite("image/building/know/billboard_click.png");
        e.position.set(34, 108);
        e.overEvent = brightnessOverEvent;
        e.clickEvent = () => {
            //todo
        }
        addPointerEvent(e);
        this.container.addChild(e);
        return e;
    }
}
class Blackboard extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "收養家庭條件";
        this.x = -0.017;
        this.y = -0.095;
        this.url = "image/building/know/blackboard.png";
        this.zoomIn = 2;
    }
    onClickResize() { this.clickButton = this.drawClickButton(); }
    clickEvent() {
        this.blink.outerStrength = 0;
        this.sprite.interactive = false;
        this.zoom();
        this.page.children.player.move(this._x, this.sprite.width);
        this.page.isZoomIn = true;
        this.isClick = true;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.clickButton = this.drawClickButton();
    }
    cancelEvent() {
        let tl = gsap.timeline({
            onComplete: function () {
                this.sprite.interactive = true;
            }.bind(this)
        });
        tl.to(this.page.container.scale, { duration: 0.5, x: this.scale, y: this.scale });
        tl.to(this.page.container, { duration: 0.5, x: -this._x / 2, y: 0 }, 0);
        this.isClick = false;
        this.page.isZoomIn = false;
        this.cancel.visible = false;
        this.cancel = undefined;
        this.container.removeChild(this.clickButton);
    }
    drawClickButton() {
        let e = createSprite("image/building/know/blackboard_click.png");
        e.position.set(272, 122);
        e.overEvent = brightnessOverEvent;
        e.clickEvent = () => {
            //todo
        }
        addPointerEvent(e);
        this.container.addChild(e);
        return e;
    }
}
class Gashapon extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "收養家庭條件";
        this.x = 0.18;
        this.y = -0.05;
        this.url = "image/building/know/gashapon.png";
        this.aurl = "image/building/know/gashapon_alpha.png";
        this.zoomIn = 1.2;
        this.zoomInPos = [20, -50];
        this.uiScale = 1;
        this.fadeText = "開始遊戲";
        this.draw = function () {
            this._x = (this.x * this.w * 2);
            this._y = (this.y * this.h * 2);
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);

            this.blink = FilterSet.blink_alpha();
            this.alphaSprite = PIXI.Sprite.from(this.aurl);
            this.alphaSprite.anchor.set(0.5);
            this.alphaSprite.scale.set(this.scale);
            this.alphaSprite.filters = [this.blink.filter];
            this.blink.knockout = true;
            this.container.addChild(this.alphaSprite);

            this.text = new PIXI.Text(this.fadeText, this.ts);
            this.text.anchor.set(0.5);
            this.textHeight = this.spriteHeight + 10;
            this.text.position.y = -this.spriteHeight;
            this.text.alpha = 0;
            this.container.addChild(this.sprite, this.text);

            this.sprite.clickEvent = this.clickEvent.bind(this);
            this.sprite.overEvent = this.overEvent.bind(this);
            addPointerEvent(this.sprite);
            this.container.position.set(this._x, this._y);
        }
    }
    onClickResize() { this.gashapon = this.drawGashapon(); }
    clickEvent() {
        this.blink.outerStrength = 0;
        this.sprite.interactive = false;
        this.zoom();
        this.page.children.player.move(this._x, this.sprite.width);
        this.page.isZoomIn = true;
        this.isClick = true;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.textures = this.manager.app.loader.resources["image/building/know/gashapon/sprites.json"].spritesheet.textures;
        this.gashapon = this.drawGashapon();
    }
    cancelEvent() {
        let tl = gsap.timeline({
            onComplete: function () {
                this.sprite.interactive = true;
            }.bind(this)
        });
        tl.to(this.page.container.scale, { duration: 0.5, x: this.scale, y: this.scale });
        tl.to(this.page.container, { duration: 0.5, x: -this._x / 2, y: 0 }, 0);
        this.isClick = false;
        this.page.isZoomIn = false;
        this.cancel.visible = false;
        this.cancel = undefined;
        this.container.removeChild(this.gashapon);
        this.sprite.alpha = 1;
    }
    drawGashapon() {
        const self = this;
        const scale = this.uiScale;
        //const textures = this.textures;
        const textures = GashaponTextures;
        this.sprite.alpha = 0;
        let c = new PIXI.Container();
        let frame = drawFrame();
        drawStart();
        this.container.addChild(c);
        return c;
        //layer
        function drawFrame() {
            let frame = new PIXI.Container();
            frame.eggs = createSprite(textures["eggs_0.png"], 0.5, scale);
            frame.front = createSprite(textures["gashapon_front.png"], 0.5, scale);
            frame.back = createSprite(textures["gashapon_back.png"], 0.5, scale);
            frame.turn = createSprite(textures["turn.png"], 0.5, scale);
            frame.mouth = createSprite(textures["mouth.png"], 0.5, scale);
            frame.eggMask = createSprite(textures["mask.png"], 0.5, scale);
            frame.egg = createSprite(textures["egg.png"], 0.5, scale);
            frame.eggs.position.set(-19.607, 21.94);
            frame.back.position.set(0, -11.868);
            frame.turn.position.set(27, 96.5);
            frame.mouth.position.set(-49.103, 115.687);
            frame.eggMask.position.set(-49.103, 107.742);
            frame.egg.position.set(-24.454, 84.206);
            frame.egg.mask = frame.eggMask;
            frame.addChild(frame.back, frame.eggs, frame.front, frame.turn, frame.eggMask, frame.egg, frame.mouth);
            this.container.addChild(frame);
            return frame;
        }
        function drawStart() {
            let d = new Dialog(self.manager, {
                context: `抽抽運氣吧！\n看看今天哪隻狗狗適合你吧！`,
                submitText: "開始遊戲",
                cancelText: "結束遊戲",
                submit: () => { drawEggRotate(); },
                cancel: () => { self.cancelEvent(); }
            })
        }
        function drawEggRotate() {
            let tl = gsap.timeline()
                .to(frame.turn, { duration: 0.75, rotate: 180, ease: "none" })
                .to(frame.turn, { duration: 0.75, rotate: 180, ease: "none" }, 1)
                .to(frame.turn, { duration: 0.75, rotate: 180, ease: "none" }, 2)
                .to(frame.egg, { duration: 1, x: -49.103, y: 107.742 }, 3);
            let tl2 = gsap.timeline()
                .to(frame.eggs, { duration: 0.75, onComplete: () => { EggsAnim(1); } })
                .to(frame.eggs, { duration: 0.75, onComplete: () => { EggsAnim(2); } })
                .to(frame.eggs, { duration: 0.75, onComplete: () => { EggsAnim(3); } })
                .to(frame.eggs, { duration: 0.75, onComplete: () => { EggsAnim(4); } })
                .to(frame.eggs, { duration: 0.75, onComplete: () => { EggsAnim(0); } })
            let anim = gsap.timeline({ onComplete: drawResult });
            anim.add(tl);
            anim.add(tl2, 0);
        }
        function drawResult() {
            let layer = drawLayer();
            let arrow_l = createSprite("image/arrow_l.svg", 0.5, scale), arrow_r, pic_f, pic_b;
            layer.addChild(arrow_l, arrow_r, pic_f, pic_b);
        }
        function drawEnd() {
            let d = new Dialog(self.manager, {
                context: `恭喜您獲得${小吉}！點擊回家手冊\n一起認識更多導盲犬吧！`,
                submitText: "前往手冊",
                cancelText: "結束遊戲",
                submit: () => {
                    //todo
                },
                cancel: () => { self.cancelEvent(); }
            })
        }
        //obj
        function drawLayer() {
            let layer = new PIXI.Container();
            c.addChild(layer);
            return layer;
        }
        function EggsAnim(count) {
            frame.eggs.texture = textures[`eggs_${count}.png`];
        }
    }
}
class Book extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Book";
        this.x = 0.445;
        this.y = 0.067;
        this.url = "image/building/know/book.png";
        this.zoomIn = 2;
        this.spriteHeight = 120;
    }
}

const GashaponTextures = {
    "gashapon_back.png": "image/building/know/gashapon/gashapon_back.png",
    "gashapon_front.png": "image/building/know/gashapon/gashapon_front.png",
    "mask.png": "image/building/know/gashapon/mask.png",
    "mouth.png": "image/building/know/gashapon/mouth.png",
    "turn.png": "image/building/know/gashapon/turn.png",
    "big_back.png": "image/building/know/gashapon/big_back.png",
    "big_front.png": "image/building/know/gashapon/big_front.png",
    "middle_back.png": "image/building/know/gashapon/middle_back.png",
    "middle_front.png": "image/building/know/gashapon/middle_front.png",
    "middle2_back.png": "image/building/know/gashapon/middle2_back.png",
    "middle2_front.png": "image/building/know/gashapon/middle2_front.png",
    "small_back.png": "image/building/know/gashapon/small_back.png",
    "small_front.png": "image/building/know/gashapon/small_front.png",
    "egg.png": "image/building/know/gashapon/egg.png",
    "eggs_0.png": "image/building/know/gashapon/eggs_0.png",
    "eggs_1.png": "image/building/know/gashapon/eggs_1.png",
    "eggs_2.png": "image/building/know/gashapon/eggs_2.png",
    "eggs_3.png": "image/building/know/gashapon/eggs_3.png",
    "eggs_4.png": "image/building/know/gashapon/eggs_4.png",
}