import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Door, OtherObject } from './GameObject.js';
import { FilterSet } from './FilterSet.js';
import { addPointerEvent, createSprite, createText } from './GameFunction.js';
import { brightnessOverEvent, Dialog, drawButton, glowOverEvent } from './UI.js';
import { bookData } from './Data.js';
import { TextStyle } from './TextStyle.js';
import { ColorSlip } from './ColorSlip.js';

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
            if (self.isClick) {
                let d = new Dialog(self.manager, {
                    context: `恭喜您獲得${Object.values(lucky)[random]}！\n點擊回家手冊\n一起認識更多導盲犬吧！`,
                    submitText: "前往手冊",
                    cancelText: "結束遊戲",
                    submit: () => {
                        d.remove();
                        self.cancelEvent();
                        self.page.children.book.clickEvent();
                    },
                    cancel: () => { d.remove(); self.cancelEvent(); }
                })
            }
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
        this.uiScale = 1;
        this.originPos = [0, 0];
        this.texturesUrl = "image/building/know/book/sprites.json"
    }
    zoom() { }
    onClickResize() { this.book = this.drawBook(); }
    clickEvent() {
        this.blink.outerStrength = 0;
        this.sprite.interactive = false;
        this.zoom();
        this.page.children.player.move(this._x, this.sprite.width);
        this.page.isZoomIn = true;
        this.isClick = true;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.textures = this.manager.app.loader.resources[this.texturesUrl].spritesheet.textures;
        this.book = this.drawBook();
    }
    cancelEvent() {
        /* let tl = gsap.timeline({
            onComplete: function () {
                this.sprite.interactive = true;
            }.bind(this)
        });
        tl.to(this.page.container.scale, { duration: 0.5, x: this.scale, y: this.scale });
        tl.to(this.page.container, { duration: 0.5, x: -this._x / 2, y: 0 }, 0); */
        this.isClick = false;
        this.page.isZoomIn = false;
        this.cancel.visible = false;
        this.cancel = undefined;
        this.manager.app.stage.removeChild(this.book);
    }
    drawBook() {
        const self = this;
        const scale = this.uiScale;
        const textures = this.textures;
        const data = bookData.know;
        const centerX = 300;
        const sortList = ["a", "b", "c"];
        const sortText = {
            "a": {
                title_1: "寄養家庭",
                title_2: "寄養幼犬(2個月~2歲)",
                hint: `點擊下方”我要寄養”可了解幼犬資料，並且可及時\n連結到台灣各個導盲犬協會獲得更多資訊。`,
                buttonText: "我要寄養",
                picNum: 2
            },
            "b": {
                title_1: "申請導盲犬",
                title_2: "申請導盲犬(2歲~10歲)",
                hint: `點擊下方”我要申請”可了解導盲犬資料，並且可及時\n連結到台灣各個導盲犬協會獲得更多資訊。`,
                buttonText: "我要申請",
                picNum: 3
            },
            "c": {
                title_1: "收養家庭",
                title_2: "收養退休犬(11歲以後)",
                hint: `點擊下方”我要收養”可了解退休犬資料，並且可及時\n連結到台灣各個導盲犬協會獲得更多資訊。`,
                buttonText: "我要收養",
                picNum: 2
            }
        }
        let selectSort = sortList[0];
        let c = new PIXI.Container();
        let page = drawPage();
        let usingLayer = new PIXI.Container();
        c.zIndex = 100;
        c.addChild(usingLayer);
        onSelectSort();
        this.manager.app.stage.addChildAt(c, 1);
        return c;
        //page
        function drawIntroduction() {
            let layer = drawLayer(sortText[selectSort].title_1, sortText[selectSort].title_2);
            let instruction = createSprite(textures[`text_${selectSort}.png`], [0.5, 0], scale);
            let hint = createText(sortText[selectSort].hint, TextStyle.Mirror_DogHint_16, 0.5, scale * 0.6);
            let dogList = drawDogList(selectSort);
            let arrow_l = drawArrow("left", () => { onSelectSort(sortList[sortList.indexOf(selectSort) - 1], drawDogDetail); });
            let arrow_r = drawArrow("right", () => { c.removeChild(usingLayer); pageAnim("right", drawDogDetail) });
            if (selectSort == sortList[0]) { arrow_l.interactive = false; arrow_l.alpha = 0.5; }
            instruction.position.set(-centerX, -220);
            hint.position.set(centerX, -280);
            dogList.position.set(124, 20);
            layer.addChild(instruction, dogList, hint, arrow_l, arrow_r);
            usingLayer = layer;
        }
        function drawDogDetail() {
            let layer = drawLayer(sortText[selectSort].title_1, sortText[selectSort].title_2);
            let picLayer = new PIXI.Container();
            let pic = createSprite(textures[`detail_pic_${selectSort}_0.png`], 0.5, scale);
            let text = createSprite(textures[`detail_${selectSort}.png`], 0, scale);
            let btn1 = drawButton(sortText[selectSort].buttonText, ColorSlip.button_submit, scale * 1.2);
            let btn2 = drawButton("我要捐款", ColorSlip.button_cancel, scale * 1.2);
            let slideCrol = drawSlideCrol(picLayer);
            let arrow_l = drawArrow("left", () => { c.removeChild(usingLayer); pageAnim("left", drawIntroduction) });
            let arrow_r = drawArrow("right", () => { onSelectSort(sortList[sortList.indexOf(selectSort) + 1]); });
            if (selectSort == sortList.at(-1)) { arrow_r.interactive = false; arrow_r.alpha = 0.5; }
            picLayer.addChild(pic);
            picLayer.position.set(-centerX + 9, -25);
            text.position.set(72, -308);
            slideCrol.position.set(-centerX, 300);
            btn1.position.set(-centerX - 100, -172);
            btn2.position.set(-centerX + 100, -172);
            btn1.clickEvent = btn2.clickEvent = drawDialog;
            addPointerEvent(btn1);
            addPointerEvent(btn2);
            layer.addChildAt(picLayer, 0);
            layer.addChild(text, btn1, btn2, slideCrol, arrow_l, arrow_r);
            usingLayer = layer;
        }
        //obj
        function drawPage() {
            const bookmarkPosY = { "a": -280, "b": -80, "c": 120 };
            let e = new PIXI.Container();
            let cover = createSprite(textures["bookcover.png"], 0.5, scale);
            let pages = createSprite(textures["pages.png"], 0.5, scale);
            e.ribbon = createSprite(textures[`ribbon_${selectSort}.png`], 0.5, scale);
            e.page_l = createSprite(textures["page_l.png"], 1, scale);
            e.page_r = createSprite(textures["page_r.png"], [0, 1], scale);

            pages.position.set(0, -11.408);
            e.page_l.position.set(0.5, 372.272);
            e.page_r.position.set(-0.5, 372.272);
            e.ribbon.position.set(-23, -316);

            e.bookmark = {};
            for (let i of sortList) {
                e.bookmark[i] = createSprite(textures[`bookmark_${i}.png`], 0.5, scale);
                e.bookmark[i].position.set(600, bookmarkPosY[i]);
                e.bookmark[i].overEvent = bookmarkOverEvent;
                e.bookmark[i].clickEvent = (e) => { onSelectSort(i); }
                addPointerEvent(e.bookmark[i]);
            }
            cover.interactive = true;
            e.addChild(cover, pages);
            c.addChild(e);
            return e;
        }
        function drawArrow(dir, clickEvent) {
            let arrow = new PIXI.Container();
            let a;
            let text = createText("", TextStyle.Map_Green_13, 0.5, scale * 0.6);
            switch (dir) {
                case "right":
                    a = createSprite(textures["arrow_r.png"], 0.5, scale);
                    text.text = "下一頁";
                    text.position.set(-47, 0);
                    arrow.position.set(537, 334);
                    arrow.addChild(text, a);
                    break;
                case "left":
                    a = createSprite(textures["arrow_l.png"], 0.5, scale);
                    text.text = "上一頁";
                    text.position.set(47, 0);
                    arrow.position.set(-537, 334);
                    arrow.addChild(text, a);
                    break;
            }
            arrow.overEvent = brightnessOverEvent;
            arrow.clickEvent = clickEvent;
            addPointerEvent(arrow);
            return arrow;
        }
        function drawLayer(title_1, title_2) {
            let layer = new PIXI.Container();
            let bigTitle = createText("一起回家吧！", TextStyle.Mirror_title_36, 0.5, scale * 0.75);
            let title = createText(title_1, TextStyle.Mirror_title_16, 0.5, scale);
            let title2 = createText(title_2, TextStyle.Mirror_title_16, 0.5, scale);
            bigTitle.position.set(-centerX, -340);
            title.position.set(-centerX, -270);
            title2.position.set(centerX, -350);
            layer.addChild(bigTitle, title, title2);
            c.addChild(layer);
            gsap.from(layer, { duration: 0.5, alpha: 0 });
            return layer;
        }
        function drawDogList(sort) {
            const spaceX = 175;
            const spaceY = 140;
            let e = new PIXI.Container();
            for (let i = 0; i < data[sort].length; i++) {
                let child = drawDog(sort, i);
                child.position.x = i < 3 ? i * spaceX : (i - 3) * spaceX;
                child.position.y = i < 3 ? -spaceY : spaceY;
                e.addChild(child);
            }
            return e;
        }
        function drawDog(sort, index) {
            let e = new PIXI.Container();
            let dog = new PIXI.Container();
            let dogFrame = createSprite(textures[`dogFrame.png`], 0.5, scale);
            let name = createText(data[sort][index].name, TextStyle[`Book_${sort}_13`], 0.5, scale * 0.75);
            let pic = createSprite(textures[`pic_${sort}_${index}.png`], 0.5, scale);
            let love = drawLove(data[sort][index].love);
            let btn = drawButton(sortText[sort].buttonText, ColorSlip.button_submit, scale * 0.75);
            name.position.y = -100;
            btn.position.y = 120;
            dog.overEvent = glowOverEvent;
            btn.clickEvent = dog.clickEvent = () => { c.removeChild(usingLayer); pageAnim("right", drawDogDetail); }
            addPointerEvent(dog);
            addPointerEvent(btn);
            dog.addChild(dogFrame, pic);
            e.addChild(dog, love, name, btn);
            return e;
        }
        function drawLove(num) {
            let e = new PIXI.Container();
            let n = createText(num, TextStyle.Mirror_title_12, 0.5, scale);
            let s = createSprite(textures["love.png"], 0.5, scale);
            n.position.set(10, 0);
            s.position.set(-27, 0);
            e.position.set(0, 50);
            e.addChild(n, s);
            return e;
        }
        function drawSlideCrol(picLayer) {
            const r = 40;
            const sw = 5;
            const as = 150 * 2;
            const animTime = 0.8;
            const len = sortText[selectSort].picNum;
            let e = new PIXI.Container();
            e.actionPoint = 0;
            let arrow_r = new PIXI.Graphics()
                .lineStyle(sw, ColorSlip.brown)
                .beginFill(ColorSlip.white)
                .moveTo(0, 0)
                .lineTo(0, r)
                .lineTo((Math.sqrt(3) / 2) * r, r / 2)
                .closePath()
                .endFill();
            let arrow_l = arrow_r.clone()
            arrow_l.rotation = Math.PI;
            arrow_l.pivot.set((Math.sqrt(3) / 4) * r, r / 2);
            arrow_r.pivot.set((Math.sqrt(3) / 4) * r, r / 2);
            arrow_l.hitArea = new PIXI.Circle((Math.sqrt(3) / 4) * r, r / 2, r * 2);
            arrow_r.hitArea = new PIXI.Circle((Math.sqrt(3) / 4) * r, r / 2, r * 2);
            arrow_l.position.set(-as, 0);
            arrow_r.position.set(as, 0);
            let list = new PIXI.Container();
            for (let i = 0; i < len; i++) {
                let p = new PIXI.Graphics()
                    .lineStyle(sw, ColorSlip.brown)
                    .beginFill(ColorSlip.white)
                    .drawCircle(0, 0, r / 2)
                    .endFill()
                p.position.x = i * r * 2;
                p.hitArea = new PIXI.Circle(0, 0, r * 1.25);
                if (i != 0) { p.alpha = 0.5; }
                p.overEvent = brightnessOverEvent;
                p.clickEvent = () => {
                    e.actionPoint = i;
                    for (let j of list.children) {
                        j.alpha = 0.5;
                    }
                    p.alpha = 1;
                    picLayer.texture = textures[`detail_pic_${selectSort}_${e.actionPoint}.png`];
                }
                addPointerEvent(p);
                list.addChild(p);
            }
            list.pivot.set((r) * len / 2, 0);

            let tl = gsap.timeline({ repeat: -1 });
            tl.to(e, { duration: 3, onComplete: () => { arrow_r.clickEvent(); } });
            arrow_l.overEvent = brightnessOverEvent;
            arrow_r.overEvent = brightnessOverEvent;
            arrow_l.clickEvent = () => {
                tl.play(0.001);
                e.actionPoint--;
                if (e.actionPoint <= 0) { e.actionPoint = len - 1; }
                for (let j of list.children) {
                    j.alpha = 0.5;
                }
                list.children[e.actionPoint].alpha = 1;

                let newpic = createSprite(textures[`detail_pic_${selectSort}_${e.actionPoint}.png`], 0.5, scale);
                picLayer.addChild(newpic);
                gsap.timeline({ onComplete: () => { picLayer.removeChildAt(0); } })
                    .from(newpic, { duration: animTime, alpha: 0 })
            }
            arrow_r.clickEvent = () => {
                tl.play(0.001);
                e.actionPoint++;
                if (e.actionPoint >= len) { e.actionPoint = 0 }
                for (let j of list.children) {
                    j.alpha = 0.5;
                }
                list.children[e.actionPoint].alpha = 1;

                let newpic = createSprite(textures[`detail_pic_${selectSort}_${e.actionPoint}.png`], 0.5, scale);
                picLayer.addChild(newpic);
                gsap.timeline({ onComplete: () => { picLayer.removeChildAt(0); } })
                    .from(newpic, { duration: animTime, alpha: 0 })
            }


            addPointerEvent(arrow_l);
            addPointerEvent(arrow_r);
            e.addChild(arrow_l, arrow_r, list);
            e.scale.set(scale * 0.5);
            return e;
        }
        function pageAnim(dir = "right", onComplete = () => { }) {
            const animTime = 0.17;
            const scaleTime = 0.08;
            let flip = undefined;
            let skewDir = undefined;
            if (dir == "left") {
                flip = page.page_l;
                skewDir = 1;
            }
            else {
                flip = page.page_r;
                skewDir = -1;
            }
            page.ribbon.alpha = 0;
            page.addChild(flip);
            flip.scale.set(scale);
            flip.skew.set(0);
            gsap.timeline({
                onComplete: () => {
                    flip.scale.set(scale);
                    flip.skew.set(0);
                    page.removeChild(flip);
                    page.ribbon.alpha = 1;
                    onComplete();
                    usingLayer.addChild(page.ribbon);
                }
            })
                .to(flip, { duration: animTime + scaleTime, pixi: { skewY: 45 * skewDir, scaleX: scale * 0.5 }, ease: "none" })
                .to(flip, { duration: animTime, pixi: { skewY: 90 * skewDir }, ease: "none" })
                .to(flip, { duration: animTime, pixi: { skewY: 135 * skewDir, scaleX: scale * 0.5 }, ease: "none" })
                .to(flip, { duration: animTime + scaleTime, pixi: { skewY: 180 * skewDir, scaleX: scale }, ease: "none" })
        }
        function onSelectSort(sort = selectSort, goto = drawIntroduction) {
            c.removeChild(usingLayer);
            if (sortList.indexOf(sort) < sortList.indexOf(selectSort)) { pageAnim("left", goto) }
            else if (sortList.indexOf(sort) > sortList.indexOf(selectSort)) { pageAnim("right", goto) }
            else { drawIntroduction(); }
            selectSort = sort;
            page.ribbon.texture = textures[`ribbon_${selectSort}.png`];
            for (let i in page.bookmark) {
                page.bookmark[i].position.x = 600;
                page.bookmark[i].interactive = true;
                page.addChildAt(page.bookmark[i], 1);
            }
            page.removeChild(page.bookmark[sort]);
            page.bookmark[sort].position.x += 10;
            page.bookmark[sort].interactive = false;
            page.addChild(page.bookmark[sort]);
        }
        function bookmarkOverEvent(e) {
            if (e.isPointerOver) {
                gsap.killTweensOf(e);
                gsap.to(e, { duration: 0.5, x: 608 });
            }
            else {
                gsap.killTweensOf(e);
                gsap.to(e, { duration: 0.5, x: 600 });
            }

        }
        function drawDialog() {
            let d = new Dialog(self.manager, {
                context: `確定要離開本網站，前往\n台灣導盲犬協會獲得資料`,
                submitText: "前往網站",
                cancelText: "繼續閱讀",
                submit: () => { d.remove(); window.open("https://www.guidedog.org.tw/", "_blank"); },
                cancel: () => { d.remove(); }
            })
        }
    }
}