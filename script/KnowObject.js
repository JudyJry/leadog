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
        const textures = this.textures;
        const lucky = {
            "big": "大吉",
            "middle": "中吉",
            "middle2": "中吉",
            "small": "小吉",
        }
        const eggsPos = [
            [-55.684, 62.3096],
            [-38.59, 23.615],
            [-33.972, 0.963],
            [-45.184, 26.545],
            [-26.744, 77.742]
        ]
        let random = undefined;
        let c = new PIXI.Container();
        let frame = drawFrame();
        drawStart();
        this.container.addChild(c);
        this.sprite.alpha = 0;
        return c;
        //layer
        function drawFrame() {
            let e = new PIXI.Container();
            e.eggs = createSprite(textures["eggs_0.png"], 0.5, scale);
            e.front = createSprite(textures["gashapon_front.png"], 0.5, scale);
            e.back = createSprite(textures["gashapon_back.png"], 0.5, scale);
            e.turn = createSprite(textures["turn.png"], 0.5, scale);
            e.mouth = createSprite(textures["mouth.png"], 0.5, scale);
            e.eggMask = createSprite(textures["mask.png"], 0.5, scale);
            e.egg = createSprite(textures["egg.png"], 0.5, scale);
            e.eggs.position.set(eggsPos[0][0], eggsPos[0][1]);
            e.back.position.set(0, -30);//ok
            e.turn.position.set(76, 274.5);//ok
            e.mouth.position.set(-139.452, 328.55);//ok
            e.eggMask.position.set(-139.452, 306);//ok
            e.egg.position.set(-49, 168.4);
            e.egg.mask = e.eggMask;
            e.addChild(e.back, e.eggs, e.front, e.turn, e.eggMask, e.egg, e.mouth);
            c.addChild(e);
            return e;
        }
        function drawStart() {
            let d = new Dialog(self.manager, {
                context: `抽抽運氣吧！\n看看今天哪隻狗狗適合你吧！`,
                submitText: "開始遊戲",
                cancelText: "結束遊戲",
                submit: () => { d.remove(); drawEggRotate(); },
                cancel: () => { d.remove(); self.cancelEvent(); }
            })
        }
        function drawEggRotate() {
            const eggsTime = 0.3;
            let tl = gsap.timeline()
                .to(frame.turn, { duration: 0.75, rotation: Math.PI, ease: "none" })
                .to(frame.turn, { duration: 0.75, rotation: Math.PI * 2, ease: "none" }, 1)
                .to(frame.turn, { duration: 0.75, rotation: Math.PI * 3, ease: "none" }, 2)
                .to(frame.egg, { duration: 1, x: -139.452, y: 306 }, 3);
            let tl2 = gsap.timeline()
                .to(frame.eggs, { duration: eggsTime, onComplete: () => { EggsAnim(1); } })
                .to(frame.eggs, { duration: eggsTime, onComplete: () => { EggsAnim(2); } })
                .to(frame.eggs, { duration: eggsTime, onComplete: () => { EggsAnim(3); } })
                .to(frame.eggs, { duration: eggsTime, onComplete: () => { EggsAnim(1); } })
                .to(frame.eggs, { duration: eggsTime, onComplete: () => { EggsAnim(2); } })
                .to(frame.eggs, { duration: eggsTime, onComplete: () => { EggsAnim(3); } })
                .to(frame.eggs, { duration: eggsTime, onComplete: () => { EggsAnim(1); } })
                .to(frame.eggs, { duration: eggsTime, onComplete: () => { EggsAnim(2); } })
                .to(frame.eggs, { duration: eggsTime, onComplete: () => { EggsAnim(3); } })
                .to(frame.eggs, { duration: eggsTime, onComplete: () => { EggsAnim(4); } })
            let anim = gsap.timeline({ onComplete: drawResult });
            anim.add(tl);
            anim.add(tl2, 0);

        }
        function drawResult() {
            random = Math.floor(Math.random() * Object.keys(lucky).length);
            self.manager.userData.know.lucky = { pic: Object.keys(lucky)[random], str: Object.values(lucky)[random] };
            let layer = drawLayer();
            let arrow_l = createSprite("image/arrow_left.svg", 0.5, scale);
            let arrow_r = createSprite("image/arrow_right.svg", 0.5, scale);
            let pic_f = createSprite(textures[`${Object.keys(lucky)[random]}_front.png`], 0.5, scale);
            let pic_b = createSprite(textures[`${Object.keys(lucky)[random]}_back.png`], 0.5, scale);
            arrow_l.position.set(-200, 12);
            arrow_r.position.set(200, 12);
            pic_b.position.set(0, 16);
            pic_f.position.set(0, 16);
            pic_b.scale.x = 0;
            arrow_l.overEvent = brightnessOverEvent;
            arrow_r.overEvent = brightnessOverEvent;
            arrow_l.clickEvent = picAnim.bind(this, pic_f, pic_b);
            arrow_r.clickEvent = picAnim.bind(this, pic_f, pic_b);
            addPointerEvent(arrow_l);
            addPointerEvent(arrow_r);
            layer.addChild(arrow_l, arrow_r, pic_f, pic_b);

            setTimeout(drawEnd, 5000);
        }
        function drawEnd() {
            let d = new Dialog(self.manager, {
                context: `恭喜您獲得${Object.values(lucky)[random]}！\n點擊回家手冊\n一起認識更多導盲犬吧！`,
                submitText: "前往手冊",
                cancelText: "結束遊戲",
                submit: () => {
                    d.remove();
                    self.cancelEvent();
                    //todo
                },
                cancel: () => { d.remove(); self.cancelEvent(); }
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
            frame.eggs.position.set(eggsPos[count][0], eggsPos[count][1]);
        }
        function picAnim(pic_f, pic_b) {
            if (pic_b.scale.x == 0) {
                gsap.timeline()
                    .to(pic_f.scale, { duration: 0.5, x: 0, ease: "none" })
                    .to(pic_b.scale, { duration: 0.5, x: 1, ease: "none" })
            }
            else if (pic_f.scale.x == 0) {
                gsap.timeline()
                    .to(pic_b.scale, { duration: 0.5, x: 0, ease: "none" })
                    .to(pic_f.scale, { duration: 0.5, x: 1, ease: "none" })
            }
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