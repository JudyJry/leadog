import * as PIXI from 'pixi.js';
import gsap from "gsap";
import $ from "jquery";
import { PixiPlugin } from "gsap/PixiPlugin";
import { sound } from '@pixi/sound';
import { linkObject, PageObject, Background, Player, OtherObject } from './GameObject.js';
import { addPointerEvent, createSprite, createText } from './GameFunction.js';
import { brightnessOverEvent, Dialog } from './UI.js';
import { ColorSlip } from './ColorSlip.js';
import { FilterSet } from './FilterSet.js';
import { TextStyle } from './TextStyle.js';

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
            "market_0": new Market(this.manager, this, -0.325, -0.019, 0, "a"),
            "market_1": new Market(this.manager, this, -0.038, -0.017, 1, "b"),
            "market_2": new Market(this.manager, this, 0.247, -0.023, 2, "b"),
            "market_3": new Market(this.manager, this, 0.533, -0.019, 3, "c"),
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
    constructor(manager, page, x, y, i, sort) {
        super(manager, page);
        this.x = x;
        this.y = y;
        this.url = `image/building/market/market_${i}.png`;
        this.zoomIn = 1.5;
        this.index = i;
        this.sort = sort;
        this.uiScale = 1;
    }
    onClickResize() {
        let htmlform = $('#pixi-form');
        htmlform.css('--x', (window.innerWidth / 2) + this.market.form.position.x - (this.market.form.width / 2) + 'px');
        htmlform.css('--y', (window.innerHeight / 2) + this.market.form.position.y - (this.market.form.height / 2) - 1 + 'px');

        let submit = $('.pixi-submit');
        submit.css('--x', (window.innerWidth / 2) + this.market.btn.position.x - (this.market.btn.width / 2) + 'px');
        submit.css('--y', (window.innerHeight / 2) + this.market.btn.position.y - (this.market.btn.height / 2) - 1 + 'px');
    }
    onClickUpdate() { }
    resize() {
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.container.removeChildren();
        this.draw();
        if (this.isClick) {
            this.sprite.interactive = false;
            if (this.cancel) {
                this.cancel.position.set((this.w * 0.5) - 60, (this.h * -0.5) + 60);
            }
            this.onClickResize();
        }
        this.container.scale.set(this.manager.canvasScale);
    }
    clickEvent() {
        this.blink.outerStrength = 0;
        this.sprite.interactive = false;
        this.page.children.player.move(this._x, this.sprite.width);
        this.page.isZoomIn = true;
        this.isClick = true;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.textures = this.manager.resources["image/building/market/event/sprites.json"].spritesheet.textures;
        this.market = this.drawMarket(this.index + 1, this.sort);
    }
    cancelEvent() {
        $('#pixi-form').detach();
        $('.pixi-submit').detach();
        this.sprite.interactive = true;
        this.isClick = false;
        this.page.isZoomIn = false;
        this.cancel.visible = false;
        this.cancel = undefined;
        this.manager.app.stage.removeChild(this.market);
    }
    drawCancel() {
        let _x = (this.w * 0.5) - 60;
        let _y = (this.h * -0.5) + 60;
        this.cancel = createSprite('image/cancel.png', 0.5);
        this.cancel.zIndex = 180;
        this.cancel.position.set(_x, _y);
        this.cancel.overEvent = brightnessOverEvent;
        this.cancel.clickEvent = this.cancelEvent.bind(this);
        addPointerEvent(this.cancel);
        this.manager.app.stage.addChildAt(this.cancel, 3);
        this.cancel.visible = false;
    }
    drawMarket(index = undefined, selectSort = undefined) {
        const self = this;
        const scale = this.uiScale;
        const textures = this.textures;
        const sortList = ["all", "a", "b", "c"];
        const pageSort = [0, 1, 2, 4];
        const page = [
            drawAll,
            drawEvent_1,
            drawEvent_2,
            drawEvent_3,
            drawEvent_4,
        ];
        selectSort = selectSort == undefined ? sortList[0] : selectSort;
        let c = new PIXI.Container();
        let bg = drawBg();
        let mark = drawMark();
        let usingLayer = new PIXI.Container();
        c.zIndex = 100;
        onSelectSort(selectSort, index);
        this.manager.app.stage.addChildAt(c, 3);
        return c;
        //page
        function drawAll() {
            let layer = drawLayer();
            let arrow_l = drawArrow("left", () => { });
            let arrow_r = drawArrow("right", () => { index++; onSelectSort(sortList[1]); });
            arrow_l.interactive = false;
            arrow_l.alpha = 0.5;
            let btn = drawSearchButton(index, 620, 188);
            layer.addChild(arrow_l, arrow_r, btn);
            usingLayer = layer;
            function drawSearchButton(i, x, y) {
                let e = createSprite(textures[`btn_${i}.png`], 0.5, scale);
                e.filters = [FilterSet.shadow()];
                e.position.set(x, y);
                e.overEvent = brightnessOverEvent;
                e.clickEvent = () => {
                    dialog();
                }
                addPointerEvent(e);
                return e;
                function dialog() {
                    let d = new Dialog(self.manager, {
                        context: "此功能未開放",
                        submit: () => { d.remove(); },
                        cancel: null
                    })
                }
            }
        }
        function drawEvent_1() {
            index = 1;
            let layer = drawLayer();
            let arrow_l = drawArrow("left", () => { index--; onSelectSort(sortList[0]); });
            let arrow_r = drawArrow("right", () => { index++; onSelectSort(sortList[2]); });
            let btn = drawButton(index, 660, 144);
            let form = drawForm();
            form.position.set(420, 200);
            drawHtmlForm(form, btn);
            c.form = form;
            c.btn = btn;
            layer.addChild(arrow_l, arrow_r, form, btn);
            usingLayer = layer;
        }
        function drawEvent_2() {
            index = 2;
            let layer = drawLayer();
            let arrow_l = drawArrow("left", () => { index--; onSelectSort(sortList[1]); });
            let arrow_r = drawArrow("right", () => { index++; onSelectSort(); });
            let btn = drawButton(index, -184, 140);
            let form = drawForm();
            form.position.set(-420, 200);
            drawHtmlForm(form, btn);
            c.form = form;
            c.btn = btn;
            layer.addChild(arrow_l, arrow_r, form, btn);
            usingLayer = layer;
        }
        function drawEvent_3() {
            index = 3;
            let layer = drawLayer();
            let arrow_l = drawArrow("left", () => { index--; onSelectSort(); });
            let arrow_r = drawArrow("right", () => { index++; onSelectSort(sortList[3]); });
            let btn = drawButton(index, -184, 140);
            let form = drawForm();
            form.position.set(-420, 200);
            drawHtmlForm(form, btn);
            c.form = form;
            c.btn = btn;
            layer.addChild(arrow_l, arrow_r, form, btn);
            usingLayer = layer;
        }
        function drawEvent_4() {
            index = 4;
            let layer = drawLayer();
            let arrow_l = drawArrow("left", () => { index--; onSelectSort(sortList[2]); });
            let arrow_r = drawArrow("right", () => { });
            arrow_r.interactive = false;
            arrow_r.alpha = 0.5;
            let btn = drawButton(index, 660, 144);
            let form = drawForm();
            form.position.set(420, 200);
            drawHtmlForm(form, btn);
            c.form = form;
            c.btn = btn;
            layer.addChild(arrow_l, arrow_r, form, btn);
            usingLayer = layer;
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
            const bookmarkPosY = { "all": -224, "a": -84, "b": 56, "c": 196 };
            let e = new PIXI.Container();
            e.bookmark = {};
            for (let i of sortList) {
                e.bookmark[i] = createSprite(textures[`mark_${i}.png`], 0.5, scale);
                e.bookmark[i].position.set(540, bookmarkPosY[i]);
                e.bookmark[i].overEvent = bookmarkOverEvent;
                e.bookmark[i].clickEvent = (e) => { index = pageSort[sortList.indexOf(i)]; onSelectSort(i); }
                addPointerEvent(e.bookmark[i]);
                e.addChild(e.bookmark[i]);
            }
            c.addChild(e);
            return e;
            function bookmarkOverEvent(e) {
                if (e.isPointerOver) {
                    gsap.killTweensOf(e);
                    gsap.to(e, { duration: 0.5, x: 856 });
                }
                else {
                    gsap.killTweensOf(e);
                    gsap.to(e, { duration: 0.5, x: 848 });
                }
            }
        }
        function drawArrow(dir, clickEvent) {
            let arrow;
            switch (dir) {
                case "right":
                    arrow = createSprite(textures["arrow_r.png"], 0.5, scale);
                    arrow.position.set(776, 305);
                    break;
                case "left":
                    arrow = createSprite(textures["arrow_l.png"], 0.5, scale);
                    arrow.position.set(-776, 305);
                    break;
            }
            arrow.filters = [FilterSet.shadow()];
            arrow.overEvent = brightnessOverEvent;
            arrow.clickEvent = clickEvent;
            addPointerEvent(arrow);
            return arrow;
        }
        function drawLayer() {
            let layer = new PIXI.Container();
            let p = createSprite(textures[`page_${index}.png`], 0.5, scale);
            layer.addChild(p);
            c.addChild(layer);
            c.setChildIndex(mark, c.children.length - 1);
            return layer;
        }
        function onSelectSort(sort = selectSort) {
            c.removeChild(usingLayer);
            $('#pixi-form').detach();
            $('.pixi-submit').detach();
            page[index]();
            selectSort = sort;
            for (let i in mark.bookmark) {
                mark.bookmark[i].position.x = 848;
                mark.bookmark[i].interactive = true;
                mark.addChildAt(mark.bookmark[i], 1);
            }
            mark.removeChild(mark.bookmark[sort]);
            mark.bookmark[sort].position.x += 10;
            mark.bookmark[sort].interactive = false;
            mark.addChild(mark.bookmark[sort]);
        }
        function drawButton(i, x, y) {
            let e = createSprite(textures[`btn_${i}.png`], 0.5, scale);
            e.filters = [FilterSet.shadow()];
            e.position.set(x, y);
            addPointerEvent(e);
            return e;
        }
        function drawForm() {
            const space = 60;
            let e = new PIXI.Container();
            let title = createText("填寫報名表", TextStyle.Form_Unit, [0, 0.5], scale * 0.5);
            let name = drawInput("姓名", 220);
            let phone = drawInput("電話", 220);
            let email = drawInput("電子信箱", 728);
            e.addChild(name, phone, email);
            e.children.forEach((e, i) => {
                e.position.y = i * space;
            });
            let num = drawUnitInput("報名人數", "人", 120);
            num.position.x = 250;
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
            let nameInput = drawInput(220, false);
            let numInput = drawInput(120);
            let phoneInput = drawInput(220);
            let emailInput = drawInput(728);
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
                        context: "確定要報名嗎？",
                        submit: () => { d.remove(); writeData(dialog_1); },
                        cancel: () => { d.remove(); }
                    })
                }
                function dialog_1() {
                    let d = new Dialog(self.manager, {
                        context: "報名成功",
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
                        let jsonData = JSON.parse(localStorage.getItem('event'));
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
                        localStorage.setItem("event", JSON.stringify(jsonData));
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
}