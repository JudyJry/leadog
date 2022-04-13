import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { TextStyle } from './TextStyle.js';
import { addPointerEvent, createSprite, createText } from './GameFunction.js';
import { Page, uiData } from './Data.js';
import { ColorSlip } from './ColorSlip.js';
import { FilterSet } from './FilterSet.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class UIsystem {
    constructor(manager) {
        this.manager = manager;
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.container = new PIXI.Container();
        this.uiContainer = new PIXI.Container();
        this.uiSpacing = 85;
        this.container.zIndex = 100;
        this.uiContainer.zIndex = 100;
        this.ui = {
            "book": new Book(this.manager, this),
            "notify": new Notify(this.manager, this),
            "user": new User(this.manager, this),
            "menu": new Menu(this.manager, this),
            "home": new Index(this.manager, this),
            "cancel": new Cancel(this.manager, this)
        }
        this.logo = undefined;
    }
    drawLogo() {
        this.logo = PIXI.Sprite.from("image/logo.png");
        this.logo.scale.set(0.4);
        this.logo.position.set((-0.5 * this.w) + 50, (-0.5 * this.h) + 20);
        this.container.addChild(this.logo);
    }
    setup() {
        for (let [_, e] of Object.entries(this.ui)) { e.setup(); }
        this.uiContainer.position.set((-0.5 * this.w) + 110, (-0.5 * this.h) + 240);
        this.drawLogo();
        this.container.addChild(this.uiContainer);
        this.container.position.set(0, 0);
        this.manager.app.stage.addChild(this.container);
    }
    resize() {
        this.w = this.manager.w;
        this.h = this.manager.h;
        for (let [_, e] of Object.entries(this.ui)) { e.resize(); }
        this.uiContainer.position.set((-0.5 * this.w) + 110, (-0.5 * this.h) + 240);
        this.logo.position.set((-0.5 * this.w) + 30, (-0.5 * this.h) + 10);
    }
    update() {
        for (let [_, e] of Object.entries(this.ui)) { e.update(); }
    }
}
export class UI {
    constructor(manager, UIsystem) {
        this.manager = manager;
        this.UIsystem = UIsystem;
        this.name = "UI";
        this.container = new PIXI.Container();
        this.draw = undefined;
        this.icon = undefined;
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.scale = 0.75;
        this.ts = TextStyle.UI;
        this.tsm = TextStyle.UI_small;
    }
    drawIcon(path, anchor = 0.5) {
        let icon = PIXI.Sprite.from(path);
        icon.scale.set(this.scale);
        icon.anchor.set(anchor);
        icon.clickEvent = this.clickEvent.bind(this);
        icon.overEvent = brightnessOverEvent;
        addPointerEvent(icon);
        return icon;
    }
    clickEvent() {
        let d = new Dialog(this.manager, {
            context: `這是一個${this.name}框框`,
            cancel: () => d.remove()
        })
    }
    setup() {
        this.draw();
        this.UIsystem.uiContainer.addChild(this.container);
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.container.removeChildren();
        this.draw();
    }
    update() {
    }
}
class Book extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "Book";
        this.uiScale = 1;
        this.originPos = [0, 0];
        this.texturesUrl = "image/book/sprites.json"
        this.draw = function () {
            this.icon = this.drawIcon('image/book.svg');
            this.container.position.set(0, 0 * this.UIsystem.uiSpacing);
            this.container.addChild(this.icon);
        }
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.container.removeChildren();
        this.draw();
        if (this.isClick) {
            this.icon.interactive = false;
            this.onClickResize();
        }
    }
    update() {
        if (this.isClick) { this.onClickUpdate(); }
    }
    onClickResize() { this.book = this.drawBook(); }
    onClickResize() { }
    clickEvent() {
        this.icon.interactive = false;
        this.isClick = true;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.textures = this.manager.app.loader.resources[this.texturesUrl].spritesheet.textures;
        this.book = this.drawBook();
    }
    drawCancel() {
        let _x = (this.w * 0.5) - 60;
        let _y = (this.h * -0.5) + 60;
        this.cancel = createSprite('image/cancel.svg', 0.5);
        this.cancel.position.set(_x, _y);
        this.cancel.overEvent = brightnessOverEvent;
        this.cancel.clickEvent = this.cancelEvent.bind(this);
        addPointerEvent(this.cancel);
        this.manager.app.stage.addChildAt(this.cancel, 1);
        this.cancel.visible = false;
    }
    cancelEvent() {
        this.icon.interactive = true;
        this.isClick = false;
        this.manager.app.stage.removeChild(this.book);
        this.cancel.visible = false;
    }
    drawBook() {
        const self = this;
        const scale = this.uiScale;
        const textures = this.textures;
        const centerX = 300;
        const sortList = ["a", "b", "c"];
        const bookpage = [drawPage_0];
        const userData = this.manager.userData;
        let selectSort = sortList[0];
        let c = new PIXI.Container();
        let bg = drawBg();
        let page = undefined;
        let usingLayer = new PIXI.Container();
        c.zIndex = 100;
        c.addChild(usingLayer);
        drawStart();
        this.manager.app.stage.addChildAt(c, 1);
        c.onCancel = drawEnd;
        return c;
        //page
        function drawStart() {
            let s = createSprite("image/book/cover.png", 0.5, scale * 0.5);
            s.alpha = 0;
            c.addChild(s);
            gsap.timeline()
                .to(s, { duration: 0.5, alpha: 1 })
                .to(s, {
                    duration: 0.5, x: centerX, onComplete: () => {
                        page = drawPages();
                        onSelectSort();
                        c.removeChild(s);
                    }
                })
        }
        function drawPage_0() {
            let layer = drawLayer(0);
            let bigTitle = createText("一起探險吧！", TextStyle.Mirror_title_36, 0.5, scale * 0.75);
            bigTitle.position.set(-centerX, -340);
            layer.addChild(bigTitle);
            layer.sortChildren();
            usingLayer = layer;
        }
        function drawPage_n() {
            let layer = drawLayer(0);
            let title = drawTitle("影片收集");
            let hint = drawHint(`點擊進入首頁中的房子，尋找房間中”互動影片”\n，藉由互動的方式了解導盲犬知識與生活，每觀賞完一部\n皆放入探險手冊之中。`);
            let it = drawItemText("出生房間", ColorSlip.button_cancel,
                textures["text_born.png"], () => { self.manager.toOtherPage(Page.born) });
            let tv = drawTv("", textures["video_born_0.png"], 0, false);
            tv.position.set(0, 0);
            e.addChild(tv);
            it.position.set(centerX, -240);
            layer.addChild(title, hint, it);
            layer.sortChildren();
            usingLayer = layer;
        }
        function drawEnd() {
            let s = createSprite("image/building/know/book/cover.png", 0.5, scale * 0.5);
            s.position.x = centerX;
            c.removeChild(page, usingLayer);
            c.addChild(s);
            gsap.timeline()
                .to(s, {
                    duration: 0.5, x: 0
                })
                .to(s, {
                    duration: 0.5, alpha: 0, onComplete: () => {
                        c.removeChild(s);
                        self.manager.app.stage.removeChild(self.book);
                    }
                })
                .to(bg, { duration: 1, alpha: 0 }, 0);
        }
        //obj
        function drawBg() {
            let bg = new PIXI.Graphics()
                .beginFill(ColorSlip.black, 0.2)
                .drawRect(0, 0, 1920, 1080)
                .endFill();
            bg.pivot.set(1920 / 2, 1080 / 2);
            c.addChild(bg);
            gsap.from(bg, { duration: 1, alpha: 0 });
            return bg;
        }
        function drawPages() {
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
            arrow.zIndex = 10;
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
        function drawLayer(num) {
            let layer = new PIXI.Container();
            layer.pageIndex = num;
            let arrow_l = drawArrow("left", () => { changePage("right", bookpage[layer.pageIndex - 1]) });
            let arrow_r = drawArrow("right", () => { changePage("right", bookpage[layer.pageIndex + 1]) });
            if (layer.pageIndex == 0) { arrow_l.interactive = false; arrow_l.alpha = 0.5; }
            if (layer.pageIndex == bookpage.length - 1) { arrow_r.interactive = false; arrow_r.alpha = 0.5; }
            layer.addChild(arrow_l, arrow_r);
            c.addChild(layer);
            gsap.from(layer, { duration: 0.5, alpha: 0 });
            return layer;
        }
        //in-page-item
        function drawTitle(text, x = centerX, y = -340) {
            let e = createText(text, TextStyle.Mirror_title_16, 0.5, scale);
            e.position.set(x, y);
            return e;
        }
        function drawHint(text, x = centerX, y = -280) {
            let e = createText(text, TextStyle.Mirror_DogHint_16, 0.5, scale * 0.6);
            e.position.set(x, y);
            return e;
        }
        function drawItemText(text, color, textUrl, onClick = () => { }) {
            let e = new PIXI.Container();
            let btn = drawButton(text, color, scale);
            let st = createSprite(textUrl, [0, 0.5], scale);
            btn.clickEvent = () => {
                let d = new Dialog(self.manager, {
                    context: `確定前往${text}？`,
                    submitText: "前往",
                    submit: () => { d.remove(); onClick(); },
                    cancelText: "取消",
                    cancel: () => { d.remove(); }
                })
            };
            addPointerEvent(btn);
            st.position.set(0, 37);
            e.addChild(btn, st);
            return e;
        }
        function drawTv(videoUrl, picUrl, tvType = 0, unlock = false) {
            let e = new PIXI.Container();
            let v = createSprite(textures[picUrl], 0.5, scale);
            let s = createSprite(textures[`tv_${tvType}.png`], 0.5, scale);
            v.position.set(-24, -6);
            e.addChild(v, s);
            if (!unlock) {
                let lock = createSprite(textures["lock.png"], 0.5, scale);
                lock.position.set(-24, -6);
                v.tint = 0x7e7e7e;
                e.addChild(lock);
            }
            else if (unlock) {
                e.overEvent = glowOverEvent;
                e.clickEvent = () => {
                    drawVideo(videoUrl);
                }
                addPointerEvent(e);
            }
            return e;
        }
        //event
        function changePage(dir = "right", goto = () => { }) {
            c.removeChild(usingLayer);
            pageAnim(dir, goto);
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
        function onSelectSort(sort = selectSort, goto = () => { }) {
            c.removeChild(usingLayer);
            if (sortList.indexOf(sort) < sortList.indexOf(selectSort)) { pageAnim("left", goto) }
            else if (sortList.indexOf(sort) > sortList.indexOf(selectSort)) { pageAnim("right", goto) }
            else { goto(); }
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
        function drawVideo(url) {

        }
    }
}
class Notify extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "Notify";
        this.draw = function () {
            this.icon = this.drawIcon('image/notify.svg');
            this.container.position.set(0, 1 * this.UIsystem.uiSpacing);
            this.container.addChild(this.icon);
        }
    }
}
class User extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "User";
        this.turn = false;
        this.index = new PIXI.Container();
        this.draw = function () {
            this.icon = this.drawIcon('image/user.svg');
            this.drawIndex();
            this.container.position.set(0, 2 * this.UIsystem.uiSpacing);
            this.container.addChild(this.icon);
        }
    }
    drawIndex() {
        this.indexBg = PIXI.Sprite.from("image/ui_1.svg");
        this.indexBg.anchor.set(0.05, 0.5);
        this.indexBg.scale.set(this.scale);
        this.index.addChild(this.indexBg);
        drawItem(this, 0, "image/buy.svg",
            function () {
                let d = new Dialog(this.manager, {
                    context: "這是一個購物框框",
                    cancelUrl: "image/dialog_exit.png",
                    cancel: () => d.remove()
                })
            }.bind(this));
        drawItem(this, 1, "image/info.svg",
            function () {
                let d = new Dialog(this.manager, {
                    context: "這是一個資訊框框",
                    cancelUrl: "image/dialog_exit.png",
                    cancel: () => d.remove()
                })
            }.bind(this));

        function drawItem(self, index, path, clickEvent) {
            let i = PIXI.Sprite.from(path);
            i.anchor.set(0.5, 1);
            i.scale.set(0.8);
            i.position.set(90 + (index * 75), 25);
            i.clickEvent = clickEvent;
            addPointerEvent(i);
            self.index.addChild(i);
        }
    }
    clickEvent() {
        if (!this.turn) {
            this.container.addChildAt(this.index, 0);
            this.turn = true;
        }
        else {
            this.container.removeChild(this.index);
            this.turn = false;
        }
    }
}
class Menu extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "Menu";
        this.turn = false;
        this.index = new PIXI.Container();
        this.draw = function () {
            this.icon = this.drawIcon('image/menu.svg');
            this.drawIndex();
            this.container.position.set(0, 3 * this.UIsystem.uiSpacing);
            this.container.addChild(this.icon);
        }
    }
    drawIndex() {
        this.indexBg = PIXI.Sprite.from("image/ui_1.svg");
        this.indexBg.anchor.set(0.05, 0.5);
        this.indexBg.scale.set(this.scale);
        this.index.addChild(this.indexBg);
        drawItem(this, 0, "image/question.svg",
            function () {
                let d = new Dialog(this.manager, {
                    context: "這是一個問題框框",
                    cancelUrl: "image/dialog_exit.png",
                    cancel: () => d.remove()
                })
            }.bind(this));
        this.sound = drawItem(this, 1, "image/soundon.svg",
            function () {
                let e = this.sound;
                if (this.manager.isMute == false) {
                    e.texture = PIXI.Texture.from("image/soundoff.svg");
                    this.manager.isMute = true;
                }
                else if (this.manager.isMute == true) {
                    e.texture = PIXI.Texture.from("image/soundon.svg");
                    this.manager.isMute = false;
                }
            }.bind(this));
        function drawItem(self, index, path, clickEvent) {
            let i = PIXI.Sprite.from(path);
            i.anchor.set(0.5, 1);
            i.scale.set(0.8);
            i.position.set(90 + (index * 75), 25);
            i.clickEvent = clickEvent;
            addPointerEvent(i);
            self.index.addChild(i);
            return i;
        }
    }
    clickEvent() {
        if (!this.turn) {
            this.container.addChildAt(this.index, 0);
            this.turn = true;
        }
        else {
            this.container.removeChild(this.index);
            this.turn = false;
        }
    }
}
class Index extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "Index";
        this.turn = false;
        this.index = new PIXI.Container();
        this.draw = function () {
            this.icon = this.drawIcon('image/index.svg');
            this.drawIndex();
            this.container.position.set(0, 4 * this.UIsystem.uiSpacing);
            this.container.addChild(this.icon);
        }
    }
    drawIndex() {
        this.indexBg = PIXI.Sprite.from("image/ui_2.svg");
        this.indexBg.anchor.set(0, 0.24);
        this.indexBg.scale.set(this.scale);
        this.index.addChild(this.indexBg);
        for (let i = 0; i < uiData.length; i++) {
            let s = PIXI.Sprite.from(uiData[i].url);
            s.anchor.set(0.5, 1);
            s.scale.set(0.8);
            if (i < 4) { s.position.set(90 + (i * 75), 25); }
            else if (i >= 4) { s.position.set(90 + ((i - 4) * 75), 95); }
            s.clickEvent = function () { this.manager.toOtherPage(uiData[i].name); }.bind(this);
            addPointerEvent(s);
            this.index.addChild(s);
        }
    }
    clickEvent() {
        if (!this.turn) {
            this.container.addChildAt(this.index, 0);
            this.turn = true;
        }
        else {
            this.container.removeChild(this.index);
            this.turn = false;
        }
    }
}
class Cancel extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "Cancel";
        this.turn = false;
        this.index = new PIXI.Container();
        this.scale = 0.85;
        this.draw = function () {
            this.icon = this.drawIcon('image/cancel.svg');
            this.icon.scale.set(-this.scale, this.scale);
            this.container.position.set(15, 5 * this.UIsystem.uiSpacing);
            this.container.addChild(this.icon);
            this.icon.visible = false;
        }
    }
}

const defaultDialogOptions = {
    context: "",
    scale: 1,
    backgroundScale: 1,
    submit: false,
    submitText: "確認",
    submitColor: ColorSlip.button_submit,
    cancel: () => { },
    cancelText: "關閉",
    cancelColor: ColorSlip.button_cancel,
}
export class Dialog {
    constructor(manager, options = defaultDialogOptions) {
        this.manager = manager;
        this.options = Object.assign({}, defaultDialogOptions, options);
        this.textStyle = TextStyle.Dialog;
        this.container = new PIXI.Container();
        this.dialog = createSprite("image/dialog.png", 0.5, this.options.backgroundScale * this.options.scale);
        this.context = createText(this.options.context, this.textStyle, 0.5, this.options.scale);
        this.submitColor = this.options.submitColor;
        this.cancelColor = this.options.cancelColor;
        this.submit = this.options.submit ? this.drawSubmit() : false;
        this.cancel = this.options.cancel ? this.drawCancel() : false;
        this.buttonHeight = 70;
        this.buttonSpace = 88;
        this.draw();
    }
    overEvent(e) {
        if (e.isPointerOver) {
            gsap.killTweensOf(e.sprite);
            gsap.killTweensOf(e.text);
            gsap.timeline()
                .to(e.sprite, { duration: 0.25, y: 4 })
                .to(e.text, { duration: 0.25, y: 4 }, 0);
        }
        else {
            gsap.killTweensOf(e.sprite);
            gsap.killTweensOf(e.text);
            gsap.timeline()
                .to(e.sprite, { duration: 0.25, y: 0 })
                .to(e.text, { duration: 0.25, y: 0 }, 0);
        }
    }
    drawSubmit() {
        let c = drawButton(this.options.submitText, this.submitColor, this.options.scale);
        c.overEvent = this.overEvent;
        c.clickEvent = this.options.submit;
        addPointerEvent(c);
        return c;
    }
    drawCancel() {
        let c = drawButton(this.options.cancelText, this.cancelColor, this.options.scale);
        c.overEvent = this.overEvent;
        c.clickEvent = this.options.cancel;
        addPointerEvent(c);
        return c;
    }
    draw() {
        this.container.zIndex = 150;
        let btnh = (this.dialog.height / 2) - this.buttonHeight - (20 * (this.options.backgroundScale - 1));
        this.context.position.set(0, -50);
        this.container.addChild(this.dialog, this.context);
        if (this.submit && this.cancel) {
            this.submit.position.set(-this.buttonSpace - 5, btnh);
            this.cancel.position.set(this.buttonSpace - 5, btnh);
            this.container.addChild(this.submit, this.cancel);
        }
        else if (this.submit) {
            this.submit.position.set(-5, btnh);
            this.container.addChild(this.submit);
        }
        else if (this.cancel) {
            this.cancel.position.set(-5, btnh);
            this.container.addChild(this.cancel);
        }
        this.manager.app.stage.addChild(this.container);
        this.manager.app.stage.sortChildren();
        let tl = gsap.timeline();
        tl.from(this.container.scale, { duration: 0.5, x: 0.7, y: 0.7, ease: "back.out(1.5)" });
        tl.from(this.container, { duration: 0.5, alpha: 0 }, 0);
    }
    remove() {
        if (this.submit) { this.submit.interactive = false; }
        if (this.cancel) { this.cancel.interactive = false; }
        let tl = gsap.timeline({
            onComplete: function () {
                this.manager.app.stage.removeChild(this.container);
                this.container.destroy({ children: true });
                this.destroy();
            }.bind(this)
        });
        tl.to(this.container.scale, { duration: 0.5, x: 0.7, y: 0.7, ease: "back.in(1.5)" });
        tl.to(this.container, { duration: 0.5, alpha: 0 }, 0);
    }
    destroy() {
        for (const prop of Object.getOwnPropertyNames(this)) delete this[prop];
    }
}
export function drawButton(text, color, scale = 1) {
    const texture = PIXI.Texture.from("image/dialog_button.png");
    const ts = TextStyle.Dialog_Button;
    let c = new PIXI.Container();
    let b = createSprite(texture, 0.5, scale);
    c.sprite = createSprite(texture, 0.5, scale);
    c.text = createText(text, ts, 0.5, scale);
    c.sprite.tint = color;
    b.tint = ColorSlip.button_back;
    b.position.y = 10;
    c.addChild(b, c.sprite, c.text);
    c.overEvent = buttonOverEvent;
    return c;
}

function buttonOverEvent(e) {
    if (e.isPointerOver) {
        gsap.killTweensOf(e.sprite);
        gsap.killTweensOf(e.text);
        gsap.timeline()
            .to(e.sprite, { duration: 0.25, y: 4 })
            .to(e.text, { duration: 0.25, y: 4 }, 0);
    }
    else {
        gsap.killTweensOf(e.sprite);
        gsap.killTweensOf(e.text);
        gsap.timeline()
            .to(e.sprite, { duration: 0.25, y: 0 })
            .to(e.text, { duration: 0.25, y: 0 }, 0);
    }
}

export function brightnessOverEvent(e) {
    if (e.isPointerOver) {
        gsap.killTweensOf(e);
        gsap.to(e, { duration: 0.5, pixi: { brightness: 0.8 } });
    }
    else {
        gsap.killTweensOf(e);
        gsap.to(e, { duration: 0.5, pixi: { brightness: 1 } });
    }
}
export function glowOverEvent(e) {
    if (e.isPointerOver) { e.filters = [FilterSet.link()]; }
    else { e.filters = []; }
}