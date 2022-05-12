import * as PIXI from 'pixi.js';
import gsap from "gsap";
import $ from "jquery";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Door, Video } from './GameObject.js';
import { addDragEvent, addPointerEvent, createSprite, createText } from './GameFunction.js';
import { brightnessOverEvent, Dialog } from './UI.js';
import { ColorSlip } from './ColorSlip.js';
import { math } from './math.js';
import { bookData, Page, userData } from './Data.js';
import * as Action from "./Action";
import { videoData } from './Data';
import { sound } from '@pixi/sound';
import { TextStyle } from './TextStyle.js';
import { FilterSet } from './FilterSet.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class CompanyObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "companyObject";
        this.soundUrl = "sound/company.mp3";
        this.children = {
            "background": new Background(this.manager, this, "image/building/company/bg.png"),
            "door": new Door(this.manager, this, -0.434, -0.052, "image/building/company/door.png"),
            "webside": new Webside(this.manager, this),
            "merch": new Merch(this.manager, this),
            "video": new CompanyVideo(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class Webside extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Webside";
        this.x = -0.02;
        this.y = -0.07;
        this.url = "image/building/company/webside.png";
        this.zoomIn = 1.5;
        this.originPos = [0, 0]
        this.uiScale = 0.5;
    }
    onClickResize() { this.webside = this.drawWebside(); }
    onClickUpdate() { }
    clickEvent() {
        this.blink.outerStrength = 0;
        this.sprite.interactive = false;
        this.zoom();
        this.page.children.player.move(this._x, this.sprite.width);
        this.page.isZoomIn = true;
        this.isClick = true;
        this.textures = this.manager.resources["image/building/company/webside/sprites.json"].spritesheet.textures;
        this.webside = this.drawWebside();
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
        this.container.removeChild(this.webside);
    }
    drawWebside() {
        const self = this;
        const ox = 410;
        const oy = 290.75;
        const py = -13;
        const scale = this.uiScale;
        const textures = this.textures;
        const pageTextures = {
            "page_0_0.png": "image/building/company/webside/page_0_0.png",
            "page_0_1.png": "image/building/company/webside/page_0_1.png",
            "page_0_2.png": "image/building/company/webside/page_0_2.png",
            "page_0_3.png": "image/building/company/webside/page_0_3.png",
            "page_0_4.png": "image/building/company/webside/page_0_4.png",
            "page_0_5.png": "image/building/company/webside/page_0_5.png",
            "page_0_6.png": "image/building/company/webside/page_0_6.png",
            "page_1.png": "image/building/company/webside/page_1.png",
            "page_2.png": "image/building/company/webside/page_2.png",
            "page_3.png": "image/building/company/webside/page_3.png",
            "page_4.png": "image/building/company/webside/page_4.png",
        }
        const themeList = [
            ["light", "light", "dark", "light", "dark", "dark", "dark"]
            , "dark", "light", "dark", "dark"];
        let c = new PIXI.Container();
        let pages = new PIXI.Container();
        let navMask = { "light": new PIXI.Container(), "dark": new PIXI.Container() };
        let frame = drawFrame();
        let layer = drawPage();
        c.slider = drawSlider(pages);
        c.nav = drawNav();
        frame.addChild(c.slider);
        layer.addChild(c.nav);
        c.addChild(frame);

        this.container.addChild(c);
        return c;
        function drawPage() {
            pages.addChild(navMask.light, navMask.dark);
            c.carouselPage = drawCarouselPage();
            c.carouselCrol = drawCarouselCrol();

            for (let i = 1; i < 5; i++) {
                let e = createSprite(pageTextures[`page_${i}.png`], 0.5, scale);
                e.position.y = py + (399 * i) + (89 * (i - 1));
                pages.addChild(e);

                let m = drawNavMask(e);
                navMask[themeList[i]].addChild(m);
            }
            let layer = drawLayer();
            layer.addChildAt(pages, 0);
            return layer;
        }
        //obj
        function drawFrame() {
            let e = new PIXI.Container();
            let frame = createSprite(textures["frame.png"], 0.5, scale);
            let cancel = createSprite(textures["cancel.png"], 0.5, scale);

            cancel.position.set(ox - 46, -oy + 46);

            cancel.overEvent = brightnessOverEvent;
            cancel.clickEvent = self.cancelEvent.bind(self);
            addPointerEvent(cancel);

            e.addChild(frame, cancel);
            return e;
        }
        function drawLayer() {
            let layer = new PIXI.Container();
            let logo = createSprite("image/logo.png", 0.5, scale * 0.25);
            let mask = new PIXI.Graphics()
                .beginFill(ColorSlip.white)
                .drawRect(0, 0, 815, 575)
                .endFill();
            mask.pivot.set(815 / 2, 575 / 2);
            logo.position.set(-ox + 65, -oy + 105);
            layer.addChild(logo, mask);
            c.addChildAt(layer, 0);
            layer.mask = mask;
            return layer;
        }
        function drawSlider(obj) {
            let slider = new PIXI.Container();
            slider.handleLength = 150;
            slider.trackLength = 406;
            slider.listLength = obj.getBounds().height + 541.25;
            slider.len = slider.trackLength - slider.handleLength;

            slider.handle = new PIXI.Graphics()
                .lineStyle(1.5, ColorSlip.black, 0.27)
                .beginFill(ColorSlip.white)
                .drawRect(0, 0, 20, slider.handleLength)
                .endFill();

            slider.track = new PIXI.Graphics()
                .beginFill(ColorSlip.black, 0.2)
                .drawRect(0, 0, 20, slider.trackLength)
                .endFill();
            slider.track.visible = false;

            slider.getHandle = () => {
                return math.Map(slider.handle.position.y, 0, slider.trackLength, 0, 1);
            }
            slider.setHandle = (percent) => {
                const e = slider.handle;
                e.position.y = math.Map(percent, 0, 1, 0, slider.trackLength);
                if (e.position.y < 0) { e.position.y = 0 }

                if (slider.handleLength + e.position.y >= slider.trackLength) {
                    e.position.y = slider.len;
                    obj.position.y = -slider.listLength + (541.25 * 2);
                }
                else {
                    obj.position.y = -math.Map(e.position.y, 0, slider.trackLength, 0, slider.listLength);
                }
            }

            let prevY = undefined;
            slider.handle.dragDownEvent = (e, event) => {
                prevY = event.data.global.y;
            }
            slider.handle.dragMoveEvent = (e, event) => {
                e.position.y += event.data.global.y - prevY;
                prevY = event.data.global.y;
                if (e.position.y < 0) { e.position.y = 0 }

                if (slider.handleLength + e.position.y >= slider.trackLength) {
                    e.position.y = slider.len;
                    obj.position.y = -slider.listLength + (541.25 * 2);
                }
                else {
                    obj.position.y = -math.Map(e.position.y, 0, slider.trackLength, 0, slider.listLength);
                }

                if (slider.getHandle() < 0.12) {
                    navReset();
                }
                else if (slider.getHandle() < 0.29) {
                    navActiveChange(0);
                }
                else if (slider.getHandle() < 0.46) {
                    navActiveChange(1);
                }
                else if (slider.getHandle() < 0.63) {
                    navActiveChange(2);
                }
                else {
                    navReset(false);
                }
            }
            slider.handle.dragUpEvent = (e, event) => {
                prevY = undefined;
            }
            addDragEvent(slider.handle);

            let arrow_up = drawArrow(slider, "up");
            let arrow_down = drawArrow(slider, "down");
            arrow_up.position.set(10, -24);
            arrow_down.position.set(10, 430);
            slider.addChild(slider.track, slider.handle, arrow_up, arrow_down);
            slider.position.set(ox - 46.5, -oy + 112);
            return slider;
        }
        function drawArrow(slider, dir) {
            const d = dir == "up" ? -1 : 1;
            let e = createSprite(textures["arrow.png"], 0.5, scale);
            e.rotation = dir == "up" ? 0 : Math.PI;

            let tl = undefined;
            e.interactive = true;
            e.buttonMode = true;
            e.overEvent = brightnessOverEvent;
            e.clickEvent = () => {
                tl = gsap.timeline({ repeat: -1 }).to(e, {
                    duration: 0.01, onComplete: () => {
                        slider.setHandle(slider.getHandle() + (d * 0.01));
                    }
                })
            }
            e.on("pointerover", onOverE);
            e.on("pointerout", onOutE);
            e.on("pointerdown", onDown);
            e.on("pointerup", onUp);
            e.on("pointerupoutside", onUp);
            return e;
            function onOverE(event) { e.isPointerOver = true; e.overEvent(e); }
            function onOutE(event) { e.isPointerOver = false; e.overEvent(e); }
            function onDown(event) { e.clickEvent(e); }
            function onUp(event) { gsap.killTweensOf(e); }
        }
        function drawNav() {
            const theme = ["light", "dark"];
            let e = new PIXI.Container();
            e.pageNav = [];
            e.button = new PIXI.Container();
            for (let i = 0; i < theme.length; i++) {
                e.pageNav.push(new PIXI.Container());
                for (let j = 0; j < 3; j++) {
                    let item = createSprite(textures[`nav_${theme[i]}_${j}.png`], 0.5, scale);
                    item.position.x = 120 * j;
                    e.pageNav[i].addChild(item);
                }
                e.addChild(e.pageNav[i]);
                e.pageNav[i].mask = navMask[theme[i]];
            }
            for (let j = 0; j < 3; j++) {
                let lightItem = e.pageNav[0].children[j];
                let darkItem = e.pageNav[1].children[j];
                let p = new PIXI.Graphics()
                    .beginFill(ColorSlip.white)
                    .drawRect(0, 0, 110, 34.5)
                    .endFill();
                p.pivot.set(110 / 2, 34.5 / 2);
                p.isActive = true;
                p.overEvent = () => {
                    if (p.isPointerOver || p.isActive) {
                        gsap.killTweensOf(lightItem);
                        gsap.to(lightItem, { duration: 0.5, alpha: 1 });
                        gsap.killTweensOf(darkItem);
                        gsap.to(darkItem, { duration: 0.5, alpha: 1 });
                    }
                    else {
                        gsap.killTweensOf(lightItem);
                        gsap.to(lightItem, { duration: 0.5, alpha: 0.5 });
                        gsap.killTweensOf(darkItem);
                        gsap.to(darkItem, { duration: 0.5, alpha: 0.5 });
                    }
                };
                p.clickEvent = () => {
                    for (let i in e.button.children) {
                        e.button.children[i].isActive = false;
                        e.pageNav[0].children[i].alpha = 0.5;
                        e.pageNav[1].children[i].alpha = 0.5;
                    }
                    p.isActive = true;
                    c.slider.setHandle(0.125 + (0.17 * j));
                }
                addPointerEvent(p);
                p.position.x = 120 * j;
                p.alpha = 0;
                e.button.addChild(p);
            }
            e.addChild(e.button);
            e.position.set(50, -oy + 105);
            return e;
        }
        function drawNavMask(page) {
            const bound = page.getBounds();
            let e = new PIXI.Graphics()
                .beginFill(ColorSlip.white)
                .drawRect(0, 0, bound.width, bound.height)
                .endFill();
            e.pivot.set(bound.width / 2, bound.height / 2);
            e.position.set(page.position.x, page.position.y);
            return e;
        }
        function navReset(bool = true, nav = c.nav) {
            for (let i in nav.button.children) {
                nav.button.children[i].isActive = bool;
                nav.pageNav[0].children[i].alpha = bool ? 1 : 0.5;
                nav.pageNav[1].children[i].alpha = bool ? 1 : 0.5;
            }
        }
        function navActiveChange(active, nav = c.nav) {
            for (let i in nav.button.children) {
                nav.button.children[i].isActive = false;
                nav.pageNav[0].children[i].alpha = 0.5;
                nav.pageNav[1].children[i].alpha = 0.5;
            }
            nav.button.children[active].isActive = true;
            nav.pageNav[0].children[active].alpha = 1;
            nav.pageNav[1].children[active].alpha = 1;
        }
        function drawCarouselPage() {
            let e = new PIXI.Container();
            let p = createSprite(pageTextures["page_0_0.png"], 0.5, scale);
            p.clickEvent = () => {
                let d = new Dialog(self.manager, {
                    context: ` 確定前往${Page.home}？`,
                    submitText: "前往房間",
                    cancelText: "取消",
                    submit: () => { self.manager.toOtherPage(Page.home); },
                    cancel: () => { d.remove(); }
                })
            }
            addPointerEvent(p);
            e.position.y = py - 50;
            e.addChild(p);
            pages.addChild(e);

            p.navMask = drawNavMask(p);
            navMask[themeList[0][0]].addChild(p.navMask);
            return e;
        }
        function drawCarouselCrol() {
            const r = 15;
            const len = 7;
            let item = new PIXI.Container();
            item.actionPoint = 0;
            let tl = gsap.timeline({ repeat: -1 })
                .to(item, {
                    duration: 5, onComplete: () => {
                        item.actionPoint++;
                        if (item.actionPoint >= len) { item.actionPoint = 0; }
                        pointClickEvent(item.actionPoint);
                    }
                });
            for (let i = 0; i < len; i++) {
                let p = new PIXI.Graphics()
                    .lineStyle(2, ColorSlip.black, 0.27)
                    .beginFill(ColorSlip.white)
                    .drawCircle(0, 0, r / 2)
                    .endFill()
                p.position.x = i * r * 2;
                p.hitArea = new PIXI.Circle(0, 0, r * 1.25);
                if (i != 0) { p.alpha = 0.5; }
                p.overEvent = brightnessOverEvent;
                p.clickEvent = () => { tl.play(0.001); pointClickEvent(i) };
                addPointerEvent(p);
                item.addChild(p);
            }

            item.position.set(ox - 270, 120);
            pages.addChild(item);
            return item;
            function pointClickEvent(i) {
                let p = item.children[i];
                item.actionPoint = i;
                for (let j of item.children) {
                    j.alpha = 0.5;
                }
                p.alpha = 1;

                const m = c.carouselPage.children[0].navMask;
                m.position.x = -1000;

                let cp = createSprite(pageTextures[`page_0_${i}.png`], 0.5, scale);
                cp.clickEvent = () => {
                    let d = new Dialog(self.manager, {
                        context: i == 0 ? ` 確定前往${Page[Object.keys(Page)[i]]}？` : ` 確定前往${Page[Object.keys(Page)[i]]}房間？`,
                        submitText: "前往房間",
                        cancelText: "取消",
                        submit: () => { self.manager.toOtherPage(Page[Object.keys(Page)[i]]); },
                        cancel: () => { d.remove(); }
                    })
                }
                addPointerEvent(cp);
                cp.navMask = drawNavMask(cp);
                navMask[themeList[0][i]].addChild(cp.navMask);
                c.carouselPage.addChild(cp);
                gsap.timeline({
                    onComplete: () => {
                        if (i == 0) {
                            navMask[themeList[0][len - 1]].removeChild(m);
                        }
                        else {
                            navMask[themeList[0][i - 1]].removeChild(m);
                        }
                        c.carouselPage.removeChildAt(0);
                    }
                })
                    .from(cp, { duration: 1, x: 1000 })
                    .from(cp.navMask, { duration: 1, x: 1000 }, 0)
                    .from(m, { duration: 0.8, x: 0, ease: "power1.in" }, 0);
            }
        }
    }
}
class Merch extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Webside";
        this.x = -0.266;
        this.y = -0.079;
        this.url = "image/building/company/merch.png";
        this.zoomIn = 1.5;
        this.originPos = [0, 0];
        this.uiScale = 1;
    }
    onClickResize() {
        let htmlform = $('#pixi-form');
        htmlform.css('--x', (window.innerWidth / 2) + this.merch.form.position.x - (this.merch.form.width / 2) + 'px');
        htmlform.css('--y', (window.innerHeight / 2) + this.merch.form.position.y - (this.merch.form.height / 2) - 1 + 'px');

        let submit = $('.pixi-submit');
        submit.css('--x', (window.innerWidth / 2) + this.merch.btn.position.x - (this.merch.btn.width / 2) + 'px');
        submit.css('--y', (window.innerHeight / 2) + this.merch.btn.position.y - (this.merch.btn.height / 2) - 1 + 'px');
    }
    onClickUpdate() { }
    clickEvent() {
        this.blink.outerStrength = 0;
        this.sprite.interactive = false;
        this.zoom();
        this.page.children.player.move(this._x, this.sprite.width);
        this.page.isZoomIn = true;
        this.isClick = true;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.textures = this.manager.resources["image/building/company/merch/sprites.json"].spritesheet.textures;
        this.merch = this.drawMerch();
    }
    cancelEvent() {
        $('#pixi-form').detach();
        $('.pixi-submit').detach();
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
        this.manager.app.stage.removeChild(this.merch);
    }
    drawMerch() {
        const self = this;
        const scale = this.uiScale;
        const textures = this.textures;
        const sortList = ["all", "a", "b", "c"];
        const picDialog = { "a": "疫情下還是要美美的", "b": "展場可以訂購喔！", "c": "展場可以訂購喔！" }
        const markX = 675;
        let selectSort = sortList[0];
        let c = new PIXI.Container();
        let bg = drawBg();
        let mark = drawMark();
        let usingLayer = new PIXI.Container();
        c.zIndex = 100;
        onSelectSort();
        this.manager.app.stage.addChildAt(c, 1);
        return c;
        //page
        function drawAll() {
            const text = {
                "a": {
                    name: "LEADOG口罩",
                    tag: ["口罩", "時尚單品"],
                    cost: "一包四片$100"
                },
                "b": {
                    name: "LEADOG詩籤",
                    tag: ["運勢", "大吉大利"],
                    cost: "遊玩即送"
                },
                "c": {
                    name: "LEADOG明信片",
                    tag: ["友誼", "傳遞", "溫暖"],
                    cost: "1張$30 / 4張$100"
                }
            }
            let layer = drawLayer();
            let arrow_l = drawArrow("left", () => { });
            let arrow_r = drawArrow("right", () => { onSelectSort(sortList[1]); });
            if (selectSort == sortList[0]) { arrow_l.interactive = false; arrow_l.alpha = 0.5; }

            let title = createText("LEADOG商品冊：", TextStyle.Mirror_title_36, [0, 0.5], scale * 0.625);
            let dog = createSprite(textures["dog.png"], 0.5, scale);
            title.position.set(-605, -228);
            dog.position.set(550, -220);

            for (let i = 1; i < sortList.length; i++) {
                let item = drawItem(sortList[i]);
                item.position.x = -425 + ((i - 1) * 425);
                layer.addChild(item);
            }

            layer.addChild(title, arrow_l, arrow_r, dog);
            usingLayer = layer;
            function drawItem(sort) {
                const d = 175;
                let e = new PIXI.Container();
                let p = createSprite(textures[`pic_${sort}_0.png`], 0.5, scale * 0.65);
                let name = createText(text[sort].name, TextStyle.white, 1, scale);
                let tag = createText("#" + text[sort].tag.join(" #"), TextStyle.white, 0, scale * 0.625);
                let cost = createText(text[sort].cost, TextStyle.Mirror_title_16, 0.5, scale);
                let like = drawLike();
                name.filters = [FilterSet.shadow()];
                tag.filters = [FilterSet.shadow()];
                name.position.set(d, d);
                tag.position.set(-d, -d);
                cost.position.y = d + 50;
                like.position.set(-d, d);
                p.overEvent = brightnessOverEvent;
                p.clickEvent = () => { onSelectSort(sort); }
                addPointerEvent(p);
                e.addChild(p, tag, name, like, cost);
                return e;
                function drawLike() {
                    let gf = FilterSet.lineGlow();
                    let e = new PIXI.Container();
                    let h = createSprite(textures["love.png"], [0, 1], scale);
                    let t = createText(bookData.merch.like[sort], TextStyle.white, [0, 1], scale);
                    t.filters = [FilterSet.shadow()];
                    h.position.set(0, -5);
                    t.position.set(45, 0);
                    if (!userData.company.like[sort]) {
                        h.filters = [gf];
                    }
                    h.overEvent = brightnessOverEvent;
                    h.clickEvent = () => {
                        if (!userData.company.like[sort]) {
                            userData.company.like[sort] = true;
                            bookData.merch.like[sort]++;
                            t.text = bookData.merch.like[sort];
                            h.filters = [FilterSet.shadow()];

                        }
                        else {
                            userData.company.like[sort] = false;
                            bookData.merch.like[sort]--;
                            t.text = bookData.merch.like[sort];
                            h.filters = [gf];
                        }
                    }
                    addPointerEvent(h);
                    e.addChild(h, t);
                    return e;
                }
            }
        }
        function drawMerchItem(pageNum, picLen) {
            let layer = drawLayer();
            let arrow_l = drawArrow("left", () => { onSelectSort(sortList[pageNum - 1]); });
            let arrow_r = drawArrow("right", () => { onSelectSort(sortList[pageNum + 1]); });
            if (selectSort == sortList[3]) { arrow_r.interactive = false; arrow_r.alpha = 0.5; }

            let pic = drawPic();
            let form = drawForm();
            let btn = createSprite(textures[`submit_${selectSort}.png`], 0.5, scale);
            form.position.set(337, 100);
            btn.position.set(520, 20);

            drawHtmlForm(form, btn);
            c.form = form;
            c.btn = btn;

            layer.addChild(arrow_l, arrow_r, pic, form, btn);
            usingLayer = layer;

            function drawPic() {
                const d = 262;
                let picNum = 0;
                let e = new PIXI.Container();
                let p = new PIXI.Container();
                let pd = drawPicDialog();
                let date = createSprite(textures["date.png"], 1, scale);
                let arrow_l = drawPicArrow("l");
                let arrow_r = drawPicArrow("r");
                p.addChild(createSprite(textures[`pic_${selectSort}_0.png`], 0.5, scale));
                date.position.set(d + 15, d + 15);
                e.position.set(-327, 0);
                e.addChild(p, date, arrow_l, arrow_r, pd);
                let tl = gsap.timeline({ repeat: -1 }).to(p, { duration: 5, onComplete: () => { arrow_r.clickEvent() } });
                return e;
                function drawPicDialog() {
                    let e = new PIXI.Container();
                    let p = createSprite(textures[`dialog.png`], 0.5, scale);
                    let t = createText(picDialog[selectSort], TextStyle.Mirror_DogHint, 0.5, scale * 0.625);
                    e.addChild(p, t);
                    e.position.set(d + 5, -d - 5);
                    return e;
                }
                function drawPicArrow(dir) {
                    let a = createSprite(textures["pic_arrow_" + dir + ".png"], 0.5, scale);
                    a.position.x = dir == "r" ? d : -d;
                    a.overEvent = brightnessOverEvent;
                    a.clickEvent = () => {
                        tl.play(0.01);
                        picNum++;
                        if (picNum == picLen) { picNum = 0 }
                        let np = createSprite(textures[`pic_${selectSort}_${picNum}.png`], 0.5, scale);
                        p.addChild(np);
                        gsap.from(np, {
                            duration: 0.5, alpha: 0, onComplete: () => {
                                p.removeChildAt(0);
                            }
                        })
                    }

                    addPointerEvent(a);
                    return a;
                }
            }
            function drawForm() {
                const space = 60;
                let e = new PIXI.Container();
                let title = createText("填寫訂購表", TextStyle.Form_Unit, [0, 0.5], scale * 0.5);
                let name = drawInput("姓名", 180);
                let phone = drawInput("電話", 180);
                let email = drawInput("電子信箱", 585);
                e.addChild(name, phone, email);
                e.children.forEach((e, i) => {
                    e.position.y = i * space;
                });
                let num = drawUnitInput("訂購數量", "個", 100);
                num.position.x = 215;
                title.position.y = -40;
                e.addChild(num, title);
                e.pivot.x = e.width / 2;
                e.pivot.y = e.height / 2;
                return e;
                function drawInput(labelText, width) {
                    const space = 15;
                    let e = new PIXI.Container();
                    let label = drawLabel(labelText + " *", 0, -space);
                    let bg = drawRoundRect(width, 32, 0, space);
                    e.addChild(label, bg);
                    return e;
                }
                function drawUnitInput(labelText, unitText, width) {
                    const space = 15;
                    let e = new PIXI.Container();
                    let label = drawLabel(labelText + " *", 0, -space);
                    let unit = createText(unitText, TextStyle.Form_Unit, [1, 0.5], scale * 0.5);
                    let input = drawRoundRect(width, 32, 0, space);
                    unit.position.set(width - 8, space);
                    e.addChild(label, input, unit);
                    return e;
                }
                function drawRoundRect(w, h, x, y) {
                    const r = h / 2;
                    let g = new PIXI.Graphics()
                        .lineStyle(1, 0xfbe3d0)
                        .beginFill(0xfaefe4)
                        .drawRoundedRect(x, y, w, h, r)
                        .endFill()
                    g.pivot.y = g.height / 2;
                    return g;
                }
                function drawLabel(text, x, y) {
                    let t = createText(text, TextStyle.Form_Label, [0, 0.5], scale * 0.5);
                    t.position.set(x, y);
                    return t;
                }
            }
            function drawHtmlForm(e, btn) {
                let htmlform = $("<form id='pixi-form'></form>");
                htmlform.css('--x', (window.innerWidth / 2) + e.position.x - (e.width / 2) + 'px');
                htmlform.css('--y', (window.innerHeight / 2) + e.position.y - (e.height / 2) - 1 + 'px');
                let nameInput = drawInput(180, false);
                let numInput = drawInput(100);
                let phoneInput = drawInput(180);
                let emailInput = drawInput(585);
                $('body').append(htmlform);
                let submit = drawSubmit();
                function drawInput(width, br = true) {
                    const space = 15;
                    let input = $("<input class='pixi-input' type='text'></input>");
                    input.css('--w', width + 'px');
                    htmlform.append(input);
                    if (br) htmlform.append($('<br>'));
                    return input;
                }
                function drawSubmit(e = btn) {
                    let submit = $("<button class='pixi-submit'></button>");
                    submit.css('--w', 195 + 'px');
                    submit.css('--h', 66 + 'px');
                    submit.css('--x', (window.innerWidth / 2) + e.position.x - (e.width / 2) + 'px');
                    submit.css('--y', (window.innerHeight / 2) + e.position.y - (e.height / 2) - 1 + 'px');
                    $('body').append(submit);

                    let arr = [];
                    submit.on('click', () => {
                        for (let i = 0; i < 4; i++) {
                            arr.push($('.pixi-input').eq(i).val());
                        }
                        if (arr.some(e => e == "")) {
                            dialog_error();
                        }
                        else { dialog_0(); }
                    })
                    return submit;
                    function dialog_0() {
                        let d = new Dialog(self.manager, {
                            context: "確定要訂購嗎？",
                            submit: () => { d.remove(); writeData(dialog_1); },
                            cancel: () => { d.remove(); }
                        })
                    }
                    function dialog_1() {
                        let d = new Dialog(self.manager, {
                            context: "訂購成功",
                            submit: () => { d.remove(); },
                            cancel: null
                        })
                    }
                    function dialog_error() {
                        let d = new Dialog(self.manager, {
                            context: "請先填寫資料喔！",
                            submit: () => { d.remove(); },
                            cancel: null
                        })
                    }
                    async function writeData(onComplete) {
                        await new Promise((resolve, _) => {
                            let jsonData = JSON.parse(localStorage.getItem('merch'));
                            if (jsonData == null) { jsonData = [] }
                            let data = {
                                "name": "",
                                "num": "",
                                "phone": "",
                                "email": ""
                            };
                            for (let i in Object.keys(data)) {
                                data[Object.keys(data)[i]] = arr[i];
                            }
                            jsonData.push(data);
                            localStorage.setItem("merch", JSON.stringify(jsonData));
                            console.log(jsonData);

                            arr = [];
                            $('#pixi-form')[0].reset();
                            resolve();
                        });
                        return onComplete();
                    }
                }
            }
        }
        //obj
        function drawBg() {
            let bg = new PIXI.Graphics()
                .beginFill(ColorSlip.black, 0.2)
                .drawRect(0, 0, 1920, 1080)
                .endFill();
            bg.pivot.set(1920 / 2, 1080 / 2);
            bg.interactive = true;
            c.addChild(bg);
            gsap.from(bg, { duration: 1, alpha: 0 });
            return bg;
        }
        function drawMark() {
            const bookmarkPosY = { "all": -285, "a": -170, "b": -55, "c": 60 };
            let e = new PIXI.Container();
            e.bookmark = {};
            for (let i of sortList) {
                e.bookmark[i] = createSprite(textures[`mark_${i}.png`], 0.5, scale);
                e.bookmark[i].position.set(markX, bookmarkPosY[i]);
                e.bookmark[i].overEvent = bookmarkOverEvent;
                e.bookmark[i].clickEvent = (e) => { onSelectSort(i); }
                addPointerEvent(e.bookmark[i]);
                e.addChild(e.bookmark[i]);
            }
            c.addChild(e);
            return e;
            function bookmarkOverEvent(e) {
                if (e.isPointerOver) {
                    gsap.killTweensOf(e);
                    gsap.to(e, { duration: 0.5, x: markX + 8 });
                }
                else {
                    gsap.killTweensOf(e);
                    gsap.to(e, { duration: 0.5, x: markX });
                }
            }
        }
        function drawArrow(dir, clickEvent) {
            const x = 630, y = 363;
            let arrow;
            switch (dir) {
                case "right":
                    arrow = createSprite(textures["arrow_r.png"], 0.5, scale);
                    arrow.position.set(x, y);
                    break;
                case "left":
                    arrow = createSprite(textures["arrow_l.png"], 0.5, scale);
                    arrow.position.set(-x, y);
                    break;
            }
            arrow.filters = [FilterSet.shadow()];
            arrow.overEvent = brightnessOverEvent;
            arrow.clickEvent = clickEvent;
            addPointerEvent(arrow);
            return arrow;
        }
        function drawLayer() {
            $('#pixi-form').detach();
            $('.pixi-submit').detach();
            let layer = new PIXI.Container();
            let p = createSprite(textures[`page_${selectSort}.png`], 0.5, scale);
            layer.addChild(p);
            c.addChild(layer);
            c.setChildIndex(mark, c.children.length - 1);
            return layer;
        }
        function onSelectSort(sort = selectSort) {
            c.removeChild(usingLayer);
            selectSort = sort;
            switch (sort) {
                case sortList[0]:
                    drawAll();
                    break;
                case sortList[1]:
                    drawMerchItem(1, 2);
                    break;
                case sortList[2]:
                    drawMerchItem(2, 1);
                    break;
                case sortList[3]:
                    drawMerchItem(3, 4);
                    break;
            }
            for (let i in mark.bookmark) {
                mark.bookmark[i].position.x = markX;
                mark.bookmark[i].interactive = true;
                mark.addChildAt(mark.bookmark[i], 1);
            }
            mark.removeChild(mark.bookmark[sort]);
            mark.bookmark[sort].position.x += 10;
            mark.bookmark[sort].interactive = false;
            mark.addChild(mark.bookmark[sort]);
        }
    }
}
class CompanyVideo extends Video {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = 0.372;
        this.y = -0.07;
        this.url = "image/building/company/video.png";
        this.zoomIn = 1.6;
        this.videoList = [
            function () { return new CompanyAction_Promotion(this.manager, this) }.bind(this),
        ];
    }
    drawUI() {
        this.ui = new PIXI.Container();
        const self = this;
        const textures = this.manager.resources[this.uiOptions.texturesUrl].spritesheet.textures;
        const uiScale = this.uiOptions.uiScale;
        const stan = this.uiOptions.standard;
        const h = this.uiOptions.height;
        const space = this.uiOptions.space;
        this.frame = createSprite(this.uiOptions.frameUrl, 0.5, this.uiOptions.frameScale);
        this.ui.addChild(this.frame);
        this.playButton = drawPlayButton();
        this.volumeButton = drawVolumeButton();
        this.nextButton = drawNextButton();
        this.fullButton = drawFullButton();
        this.container.addChild(this.ui);
        function drawPlayButton() {
            let e = createSprite(textures["play.png"], 0.5, uiScale);
            e.position.set(stan, h);
            e.clickEvent = function () {
                if (self.video.videoCrol.paused) { self.play(); } else { self.pause(); }
            }.bind(self);
            addUIButtonEvent(e);
            self.ui.addChild(e);
            return e;
        }
        function drawVolumeButton() {
            let e = createSprite(textures["volume.png"], 0.5, uiScale);
            e.position.set(stan + space * 2, h);
            e.clickEvent = function () {
                if (self.video.videoCrol.muted) {
                    e.turn = false;
                    self.video.videoCrol.muted = false;
                    e.texture = textures["volume.png"];
                }
                else {
                    e.turn = true;
                    self.video.videoCrol.muted = true;
                    e.texture = textures["volume_off.png"];
                }
            }.bind(self);
            e.turn = false;
            addUIButtonEvent(e);
            self.ui.addChild(e);
            return e;
        }
        function drawNextButton() {
            let e = createSprite(textures["next.png"], 0.5, uiScale);
            e.position.set(stan + space * 1, h);
            e.alpha = 0.5;
            self.ui.addChild(e);
            return e;
        }
        function drawFullButton() {
            let e = createSprite(textures["full.png"], 0.5, uiScale);
            e.position.set(-stan, h);
            e.clickEvent = function () {
                if (e.turn) {
                    closeFullscreen();
                    e.turn = false;
                }
                else {
                    openFullscreen(document.documentElement);
                    e.turn = true;
                }
                function openFullscreen(elem) {
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.webkitRequestFullscreen) { /* Safari */
                        elem.webkitRequestFullscreen();
                    } else if (elem.msRequestFullscreen) { /* IE11 */
                        elem.msRequestFullscreen();
                    }
                }
                function closeFullscreen() {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) { /* Safari */
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) { /* IE11 */
                        document.msExitFullscreen();
                    }
                }
            }.bind(self);
            e.turn = false;
            addUIButtonEvent(e);
            self.ui.addChild(e);
            return e;
        }
        function addUIButtonEvent(e) {
            const uiHitArea = self.uiOptions.uiHitArea;
            e.hitArea = new PIXI.Rectangle(-uiHitArea, -uiHitArea, uiHitArea * 2, uiHitArea * 2);
            addPointerEvent(e);
        }
    }
    clickEvent() {
        this.sprite.interactive = false;
        this.zoom();
        this.page.children.player.move(this._x, this.sprite.width);
        sound.pause(this.page.name);
        this.video = this.videoList[this.random]();
        this.video.setup();
        this.video.container.position.set(0, -7.4);
        this.drawUI();
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.page.isZoomIn = true;
        this.isClick = true;
        setTimeout(() => { this.play(); }, 500);
    }
    cancelEvent() {
        sound.play(this.page.name);
        let tl = gsap.timeline({ onComplete: function () { this.sprite.interactive = true; }.bind(this) });
        tl.to(this.page.container.scale, { duration: 0.5, x: this.scale, y: this.scale });
        tl.to(this.page.container, { duration: 0.5, x: -this._x / 2, y: 0 }, 0);
        this.pause();
        this.video.container.removeChildren();
        this.container.removeChild(this.video.container, this.ui);

        this.page.isZoomIn = false;
        this.isClick = false;
        this.cancel.visible = false;
        this.video = undefined;
        this.cancel = undefined;
        if (this.fullButton.turn) {
            closeFullscreen();
            this.fullButton.turn = false;
        }
        gsap.killTweensOf(this.manager.uiSystem.container);
        this.manager.uiSystem.container.position.x = 0;

        function closeFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    play() {
        this.video.videoCrol.play();
        this.playButton.texture = this.manager.resources[this.uiOptions.texturesUrl].spritesheet.textures["pause.png"];
    }
    pause() {
        this.video.videoCrol.pause();
        this.playButton.texture = this.manager.resources[this.uiOptions.texturesUrl].spritesheet.textures["play.png"];
    }
}

export class CompanyAction_Promotion extends Action.ActionPage {
    constructor(manager, obj, scale = 0.44) {
        super(manager, obj);
        this.offset = 50;
        this.isPlayGame = false;
        this.videoScale = scale;
        this.videoData = videoData.company[0];
        this.children = {
            "video": new Company_Promotion_Video(this.manager, this, this.videoData.url, this.videoData.endTime)
        }
    }

}
class Company_Promotion_Video extends Action.ActionVideo {
    constructor(manager, action, url, end) {
        super(manager, action, url);
        this.pauseTime = [0, end];
        this.isEnd = true;
        this.count = 0;
        this.draw = function () {
            return new Promise(function (resolve, _) {
                this.loadVideo(url);
                resolve();
            }.bind(this))
                .then(function () {
                    this.videoCrol.pause();
                    this.videoCrol.volume = 1;
                    this.videoCrol.currentTime = 0;
                    this.videoCrol.ontimeupdate = () => {
                        this.currentTime = this.videoCrol.currentTime;
                    };
                    this.count = 0;
                    this.isEnd = false;
                    console.log("load " + this.name);
                }.bind(this))
                .catch(function () {
                    console.error("fall load " + this.name);
                }.bind(this));
        }
    }
    update() {
        if (this.currentTime > this.pauseTime[this.count]) {
            switch (this.count) {
                case 0:
                    gsap.to(this.container, { duration: 1, alpha: 1 });
                    break;
                case 1:
                    if (!this.isEnd) {
                        this.isEnd = true;
                        this.onEnd();
                    }
                    break;
            }
            this.count++;
        }

    }
    onEnd() {
        this.videoCrol.ontimeupdate = undefined;
        this.pause();
        this.videoCrol.currentTime = 0;
        this.action.obj.cancelEvent();
    }
}

