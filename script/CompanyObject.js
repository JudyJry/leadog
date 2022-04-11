import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Door, Video } from './GameObject.js';
import { addDragEvent, addPointerEvent, createSprite } from './GameFunction.js';
import { brightnessOverEvent } from './UI.js';
import { ColorSlip } from './ColorSlip.js';
import { math } from './math.js';

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
        let c = new PIXI.Container();
        let pages = new PIXI.Container();
        drawPage();

        let frame = drawFrame();
        c.addChild(frame);

        this.container.addChild(c);
        return c;
        function drawPage() {
            let layer = drawLayer();
            let page_0 = createSprite(pageTextures["page_0_0.png"], 0.5, scale);
            page_0.position.y = py - 50;
            pages.addChild(page_0);

            for (let i = 1; i < 5; i++) {
                let e = createSprite(pageTextures[`page_${i}.png`], 0.5, scale);
                e.position.y = py + (399 * i) + (89 * (i - 1));
                pages.addChild(e);
            }
            layer.addChildAt(pages, 0);
        }
        //obj
        function drawFrame() {
            let e = new PIXI.Container();
            let frame = createSprite(textures["frame.png"], 0.5, scale);
            let cancel = createSprite(textures["cancel.png"], 0.5, scale);
            e.slider = drawSlider(pages);

            cancel.position.set(ox - 46, -oy + 46);

            cancel.overEvent = brightnessOverEvent;
            cancel.clickEvent = self.cancelEvent.bind(self);
            addPointerEvent(cancel);

            e.addChild(frame, cancel, e.slider);
            return e;
        }
        function drawLayer() {
            let layer = new PIXI.Container();
            let logo = createSprite("image/logo.png", 0.5, scale * 0.25);
            layer.nav = drawNav();
            let mask = new PIXI.Graphics()
                .beginFill(ColorSlip.white)
                .drawRect(0, 0, 815, 575)
                .endFill();
            mask.pivot.set(815 / 2, 575 / 2);
            logo.position.set(-ox + 65, -oy + 105);
            layer.addChild(logo, layer.nav, mask);
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
            }
            slider.handle.dragUpEvent = (e, event) => {
                prevY = undefined;
            }
            addDragEvent(slider.handle);

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
            let e = new PIXI.Container();
            e.light = new PIXI.Container();
            e.dark = new PIXI.Container();
            for (let i = 0; i < 3; i++) {
                e[`nav_light_${i}`] = createSprite(textures[`nav_light_${i}.png`], 0.5, scale);
                e[`nav_dark_${i}`] = createSprite(textures[`nav_dark_${i}.png`], 0.5, scale);
                e[`nav_light_${i}`].position.x = 120 * i;
                e[`nav_dark_${i}`].position.x = 120 * i;
                e.light.addChild(e[`nav_light_${i}`]);
                e.dark.addChild(e[`nav_dark_${i}`]);
            }
            e.dark.alpha = 0;
            e.change = (theme) => {
                let item = theme == "light" ? e.light : e.dark;
                let alphaItem = theme == "light" ? e.dark : e.light;
                gsap.to(item, { duration: 0.5, alpha: 1 });
                gsap.to(alphaItem, { duration: 0.5, alpha: 0 });
            }
            e.addChild(e.light, e.dark);
            e.position.set(50, -oy + 105);
            return e;
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


