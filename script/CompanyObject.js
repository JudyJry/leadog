import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Door, Video } from './GameObject.js';
import { addDragEvent, addPointerEvent, createSprite } from './GameFunction.js';
import { brightnessOverEvent, Dialog } from './UI.js';
import { ColorSlip } from './ColorSlip.js';
import { math } from './math.js';
import { Page } from './Data.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class CompanyObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "companyObject";
        this.children = {
            "background": new Background(this.manager, this, "image/building/company/bg.png"),
            "door": new Door(this.manager, this, -0.434, -0.052, "image/building/company/door.png"),
            "webside": new Webside(this.manager, this),
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
        this.textures = this.manager.app.loader.resources["image/building/company/webside/sprites.json"].spritesheet.textures;
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
class CompanyVideo extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = 0.372;
        this.y = -0.07;
        this.url = "image/building/company/video.png";
        this.zoomIn = 1.6;
        this.videoList = [
            function () { return undefined }.bind(this),
        ];
    }
}


