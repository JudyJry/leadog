import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { TextStyle } from './TextStyle.js';
import { addPointerEvent, createSprite, createText } from './GameFunction.js';
import { Page, uiData, videoData } from './Data.js';
import { ColorSlip } from './ColorSlip.js';
import { FilterSet } from './FilterSet.js';
import { sound } from '@pixi/sound';

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
    onClickUpdate() { }
    clickEvent() {
        this.icon.interactive = false;
        gsap.to(this.icon, { duration: 0.5, pixi: { brightness: 1 } });
        this.manager.activeObj.isZoomIn = true;
        this.isClick = true;
        this.drawCancel();
        this.textures = this.manager.app.loader.resources[this.texturesUrl].spritesheet.textures;
        this.book = this.drawBook();
    }
    drawCancel() {
        let _x = (this.w * 0.5) - 60;
        let _y = (this.h * -0.5) + 60;
        this.cancel = createSprite('image/cancel.png', 0.5);
        this.cancel.zIndex = 199;
        this.cancel.position.set(_x, _y);
        this.cancel.overEvent = brightnessOverEvent;
        this.cancel.clickEvent = this.cancelEvent.bind(this);
        addPointerEvent(this.cancel);
        this.manager.app.stage.addChildAt(this.cancel, 1);
    }
    cancelEvent() {
        this.icon.interactive = true;
        this.manager.activeObj.isZoomIn = false;
        this.isClick = false;
        this.manager.app.stage.removeChild(this.book, this.cancel);

    }
    drawBook() {
        const self = this;
        const scale = this.uiScale;
        const textures = this.textures;
        const centerX = 292;
        const centerY = -24;
        const sortList = ["a", "b", "c"];
        const bookmarkPage = { "a": 0, "b": 3, "c": 5 };//todo
        const bookpage = [
            drawPage_0,
            drawPage_1,
            drawPage_2,
            drawPage_3,
            drawPage_4,
            drawPage_5
        ];
        const userData = this.manager.userData;
        const animTime = 0.5;
        let selectSort = 0;
        let c = new PIXI.Container();
        let bg = drawBg();
        let page = undefined;
        let usingLayer = new PIXI.Container();
        usingLayer.pageIndex = 0;
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
                        usingLayer.addChild(page.ribbon);
                        c.removeChild(s);
                    }
                })
        }
        function drawPage_0() {
            let layer = drawLayer(0);

            let bigTitle = createText("一起探險吧！", TextStyle.Mirror_title_36, 0.5, scale * 0.75);
            let title_l = createText("LeaDog島嶼", TextStyle.Mirror_title_16, 0.5, scale);
            let text_l = createSprite(textures["page_a_0.png"], 0.5, scale);

            bigTitle.position.y = -330;
            title_l.position.y = -260;
            text_l.position.y = 60;
            layer.left.addChild(bigTitle, title_l, text_l);

            let title_r = drawTitle("影片收集");
            let hint = drawHint(`點擊進入首頁中的房子，尋找房間中”互動影片”，\n藉由互動的方式了解導盲犬知識與生活，每觀賞完一\n部皆放入探險手冊之中。`);

            let it_born = drawItemText("出生房間", ColorSlip.button_cancel, "text_born.png", () => { self.manager.toOtherPage(Page.born) });
            let tv_born_0 = drawTv("born", 0, 0);
            let tv_born_1 = drawTv("born", 1, 1);

            let it_childhood = drawItemText("幼年房間", ColorSlip.button_cancel, "text_childhood.png", () => { self.manager.toOtherPage(Page.childhood) });
            let tv_childhood_0 = drawTv("childhood", 0, 2);
            let tv_childhood_1 = drawTv("childhood", 1, 3);

            it_born.position.y = -165;
            tv_born_0.position.set(-120, -36);
            tv_born_1.position.set(120, -36);

            it_childhood.position.y = 90;
            tv_childhood_0.position.set(-120, 220);
            tv_childhood_1.position.set(120, 220);

            layer.right.addChild(title_r, hint, it_born, tv_born_0, tv_born_1, it_childhood, tv_childhood_0, tv_childhood_1);

            usingLayer = layer;
        }
        function drawPage_1() {
            let layer = drawLayer(1);

            let title_l = drawTitle("影片收集");
            let pic_l = createSprite(textures["pic_youth.png"], 0.5, scale);
            let it_youth = drawItemText("壯年房間", ColorSlip.button_cancel, "text_youth.png", () => { self.manager.toOtherPage(Page.youth) });
            let tv_youth_0 = drawTv("youth", 0, 0);
            let tv_youth_1 = drawTv("youth", 1, 1);
            let tv_youth_2 = drawTv("youth", 2, 2);
            let tv_youth_3 = drawTv("youth", 3, 3);

            pic_l.position.y = 240;
            it_youth.position.y = -280;
            tv_youth_0.position.set(-120, -150);
            tv_youth_1.position.set(120, -150);
            tv_youth_2.position.set(-120, 50);
            tv_youth_3.position.set(120, 50);

            layer.left.addChild(title_l, it_youth, tv_youth_0, tv_youth_1, tv_youth_2, tv_youth_3, pic_l);

            let title_r = drawTitle("影片收集");
            let pic_r = createSprite(textures["pic_elderly.png"], 0.5, scale);
            let it_elderly = drawItemText("老年房間", ColorSlip.button_cancel, "text_elderly.png", () => { self.manager.toOtherPage(Page.elderly) });
            let tv_elderly_0 = drawTv("elderly", 0, 0);
            let tv_elderly_1 = drawTv("elderly", 1, 1);
            let tv_elderly_2 = drawTv("elderly", 2, 2);
            let tv_elderly_3 = drawTv("elderly", 3, 3);

            pic_r.position.y = 0;
            it_elderly.position.y = -280;
            tv_elderly_0.position.set(-120, -150);
            tv_elderly_1.position.set(120, -150);
            tv_elderly_2.position.set(-120, 220);
            tv_elderly_3.position.set(120, 220);


            layer.right.addChild(title_r, it_elderly, tv_elderly_0, tv_elderly_1, pic_r, tv_elderly_2, tv_elderly_3);

            usingLayer = layer;
        }
        function drawPage_2() {
            let layer = drawLayer(2);

            let title_l = drawTitle("影片收集");
            let pic_l = createSprite(textures["pic_know.png"], 0.5, scale);
            let it_know = drawItemText("知識教育", ColorSlip.button_cancel, "text_know.png", () => { self.manager.toOtherPage(Page.know) });
            let tv_know_0 = drawTv("know", 0, 0);
            let tv_know_1 = drawTv("know", 1, 1);
            let tv_know_2 = drawTv("know", 2, 2);
            let tv_know_3 = drawTv("know", 3, 3);
            let tv_know_4 = drawTv("know", 4, 0);

            pic_l.position.set(135, 250);
            it_know.position.y = -280;
            tv_know_0.position.set(-120, -150);
            tv_know_1.position.set(120, -150);
            tv_know_2.position.set(-120, 50);
            tv_know_3.position.set(120, 50);
            tv_know_4.position.set(-120, 250);

            layer.left.addChild(title_l, it_know, tv_know_0, tv_know_1, tv_know_2, tv_know_3, tv_know_4, pic_l);

            let title_r = drawTitle("影片收集");
            let pic_r = createSprite(textures["pic_a.png"], 0.5, scale);

            layer.right.addChild(pic_r, title_r);

            usingLayer = layer;
        }
        function drawPage_3() {
            let layer = drawLayer(3);

            let title_l = drawTitle("遊戲收集");
            let hint = drawHint(`點擊進入首頁中的房子，尋找房間中的”互動遊戲”，\n藉由遊戲的方式了解導盲犬知識與樂趣，成功完成遊\n戲將會獲得獎勵，放入探險手冊之中。`);
            let it_mirror = drawItemText("祖宗八代", ColorSlip.button_submit, "text_mirror.png", () => { self.manager.toOtherPage(Page.born) });
            let mirror = drawMirror();
            it_mirror.position.y = -165;
            mirror.position.set(-194, 0);
            layer.left.addChild(title_l, hint, it_mirror, mirror);

            let title_r = drawTitle("遊戲收集");
            let it_puzzle = drawItemText("品種拼圖", ColorSlip.button_submit, "text_puzzle.png", () => { self.manager.toOtherPage(Page.childhood) });
            let puzzle_0 = drawPuzzle(0);
            let puzzle_1 = drawPuzzle(1);
            let puzzle_2 = drawPuzzle(2);
            it_puzzle.position.y = -280;
            puzzle_0.position.set(0, -90);
            puzzle_1.position.set(-130, 192);
            puzzle_2.position.set(130, 192);
            layer.right.addChild(title_r, it_puzzle, puzzle_0, puzzle_1, puzzle_2);

            usingLayer = layer;
            function drawMirror() { //todo
                const picUrl = "image/building/born/sprites.json";
                const generText = ["八", "七", "六", "五", "四", "三", "二", "一"];
                let picTextures;
                let e = new PIXI.Container();
                try {
                    self.manager.app.loader.add(picUrl);
                    self.manager.app.loader.load(onload);
                }
                catch { onload(); }
                return e;
                function onload() {
                    picTextures = self.manager.app.loader.resources[picUrl].spritesheet.textures;
                    for (let i = 0; i < 8; i++) {
                        let item = drawPicItem(i);
                        if (i < 4) {
                            item.position.set(128 * i, 0);
                        }
                        else {
                            item.position.set(128 * (i - 4), 192);
                        }
                        e.addChild(item);
                    }
                }
                function drawPicItem(i) {
                    const d = userData.born.mirror_collect[i];
                    const genderStr = d.gender === "Daddy" ? "d" : "m";
                    let e = new PIXI.Container();
                    let b = createSprite(textures["mirror_frame.png"], 0.5, scale);
                    let p;
                    let t = createText(`第${generText[i]}代`, TextStyle.Mirror_title_12, 0.5, scale * 0.8);
                    t.position.y = 95;
                    e.addChild(b, t);
                    if (!d) {
                        let lock = createSprite(textures["lock.png"], 0.5, scale * 0.75);
                        p = createSprite(picTextures["frame_dog.png"], 0.5, scale * 0.3);
                        p.tint = 0x7e7e7e;
                        e.addChild(p, lock);
                    }
                    else {
                        p = createSprite(picTextures[`${d.gener}_${genderStr}_s.png`], 0.5, scale * 0.35);
                        e.addChild(p);
                        e.overEvent = brightnessOverEvent;
                        e.clickEvent = () => {
                            let bg = drawBg();
                            let bbg = createSprite(picTextures["dialog_start.png"], 0.5, scale);
                            let ss = createSprite(picTextures[`${d.gener}_${genderStr}.png`], 0.5, scale);
                            bg.clickEvent = () => {
                                gsap.timeline({ onComplete: () => { c.removeChild(ss, bbg, bg); } })
                                    .to(ss, { duration: animTime, alpha: 0 })
                                    .to(bg, { duration: animTime, alpha: 0 }, 0)
                                    .to(bbg, { duration: animTime, alpha: 0 }, 0)
                            }
                            addPointerEvent(bg);
                            c.addChild(bbg, ss);
                            gsap.from(ss, { duration: animTime, alpha: 0 });
                        }
                        addPointerEvent(e);
                    }
                    return e;
                }
            }
            function drawPuzzle(i) {
                let e = new PIXI.Container();
                let p = createSprite(textures[`puzzle_${i}.png`], 0.5, scale);
                e.addChild(p);
                if (!userData.childhood.puzzle_complete) {
                    let lock = createSprite(textures["lock.png"], 0.5, scale);
                    p.tint = 0x7e7e7e;
                    e.addChild(lock);
                }
                else {
                    e.overEvent = brightnessOverEvent;
                    e.clickEvent = () => { drawUnlockObject(`image/book/puzzle_${i}.png`); }
                    addPointerEvent(e);
                }
                return e;
            }
        }
        function drawPage_4() {
            let layer = drawLayer(4);

            let title_l = drawTitle("遊戲收集");
            let it_tnoq = drawItemText("三不一問", ColorSlip.button_submit, "text_tnoq.png", () => { self.manager.toOtherPage(Page.youth) });
            let medal = drawMedal();
            let pic_l = createSprite(textures["pic_tnoq.png"], 0.5, scale);
            it_tnoq.position.y = -280;
            medal.position.y = -128;
            pic_l.position.y = 156;
            layer.left.addChild(title_l, it_tnoq, medal, pic_l);

            let title_r = drawTitle("遊戲收集");
            let pic_r = createSprite(textures["pic_b.png"], 0.5, scale);
            layer.right.addChild(title_r, pic_r);

            usingLayer = layer;
            function drawMedal() {
                let e = new PIXI.Container();
                let s = createSprite(textures["medal.png"], 0.5, scale);
                let l = createSprite(textures["light.png"], 0.5, scale);
                e.addChild(l, s);
                if (!userData.youth.mirror_correct) {
                    let bg = new PIXI.Graphics()
                        .beginFill(ColorSlip.black, 0.5)
                        .drawCircle(0, 0, 118.5)
                        .endFill()
                    let lock = createSprite(textures["lock.png"], 0.5, scale);
                    e.addChild(bg, lock);
                }
                else {
                    gsap.timeline({ repeat: -1 }).to(l, { duration: 5, rotation: Math.PI * 2, ease: "none" });
                    e.overEvent = brightnessOverEvent;
                    e.clickEvent = () => { drawUnlockObject(`image/book/medal.png`); }
                    addPointerEvent(e);
                }
                return e;
            }
        }
        function drawPage_5() {
            let layer = drawLayer(5);

            let title_l = drawTitle("詩籤收集");
            let hint = drawHint(`點擊進入知識教育館，點選房間中”扭蛋機”，會依照\n您今天的運氣分配相應的導盲犬，最後會獲得導盲犬\n詩籤，並放入探險手冊之中。`);
            let it_l = drawItemText("導盲犬詩籤", ColorSlip.button_yellow, "text_gashapon_0.png", () => { self.manager.toOtherPage(Page.know) }, 1.15);
            let pic_l = createSprite(textures["pic_gashapon.png"]);

            it_l.position.y = -165;
            pic_l.position.y = 116;

            layer.left.addChild(title_l, hint, it_l, pic_l);

            let title_r = drawTitle("詩籤收集");
            let it_r = drawItemText("導盲犬詩籤", ColorSlip.button_yellow, "text_gashapon_1.png", () => { self.manager.toOtherPage(Page.know) }, 1.15);
            let pic_r = drawPic();
            it_r.position.y = -280;
            pic_r.position.set(-192, -88);
            layer.right.addChild(title_r, it_r, pic_r);

            usingLayer = layer;
            function drawPic() {
                const picUrl = "image/building/know/gashapon/sprites.json";
                const picList = [
                    "small_front.png",
                    "small_back.png",
                    "middle2_front.png",
                    "middle2_back.png",
                    "middle_front.png",
                    "middle_back.png",
                    "big_front.png",
                    "big_back.png",
                ]
                let picTextures;
                let pic = new PIXI.Container();
                try {
                    self.manager.app.loader.add(picUrl);
                    self.manager.app.loader.load(drawPicItem);
                }
                catch { drawPicItem(); }
                return pic;
                function drawPicItem() {
                    picTextures = self.manager.app.loader.resources[picUrl].spritesheet.textures;
                    for (let i = 0; i < picList.length; i++) {
                        let e = new PIXI.Container();
                        let s = createSprite(picTextures[picList[i]], 0.5, scale * 0.45);
                        if (i < 4) { e.position.set(130 * i, 0); }
                        else { e.position.set(130 * (i - 4), 282); }
                        e.addChild(s);
                        if (!userData.know.lucky[picList[i].split("_")[0]]) {
                            let lock = createSprite(textures["lock.png"], 0.5, scale * 0.9);
                            s.tint = 0x7e7e7e;
                            e.addChild(lock);
                        }
                        else {
                            e.overEvent = brightnessOverEvent;
                            e.clickEvent = () => { drawUnlockObject(picTextures[picList[i]]); }
                            addPointerEvent(e);
                        }
                        pic.addChild(e);
                    }
                }
            }
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
            bg.interactive = true;
            c.addChild(bg);
            gsap.from(bg, { duration: 1, alpha: 0 });
            return bg;
        }
        function drawPages() {
            const bookmarkPosY = { "a": -280, "b": -80, "c": 120 };

            let e = new PIXI.Container();

            let cover = createSprite(textures["bookcover.png"], 0.5, scale);
            let pages = createSprite(textures["pages.png"], 0.5, scale);
            e.ribbon = createSprite(textures[`ribbon_${sortList[selectSort]}.png`], 0.5, scale);
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
                e.bookmark[i].clickEvent = (e) => { onSelectSort(i, bookmarkPage[i], bookpage[bookmarkPage[i]]); }
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
            let arrow_l, arrow_r;
            if (layer.pageIndex - 1 === bookmarkPage[sortList[selectSort - 1]]) {
                arrow_l = drawArrow("left", () => { onSelectSort(sortList[selectSort - 1], layer.pageIndex - 1, bookpage[layer.pageIndex - 1]) });
            }
            else {
                arrow_l = drawArrow("left", () => { changePage("left", bookpage[layer.pageIndex - 1]) });
            }
            if (layer.pageIndex + 1 === bookmarkPage[sortList[selectSort + 1]]) {
                arrow_r = drawArrow("right", () => { onSelectSort(sortList[selectSort + 1], layer.pageIndex + 1, bookpage[layer.pageIndex + 1]) });
            }
            else {
                arrow_r = drawArrow("right", () => { changePage("right", bookpage[layer.pageIndex + 1]) });
            }

            if (layer.pageIndex === 0) { arrow_l.interactive = false; arrow_l.alpha = 0.5; }
            if (layer.pageIndex === bookpage.length - 1) { arrow_r.interactive = false; arrow_r.alpha = 0.5; }

            layer.right = new PIXI.Container();
            layer.left = new PIXI.Container();
            layer.left.position.set(-centerX, centerY);
            layer.right.position.set(centerX, centerY);

            layer.addChild(layer.right, layer.left, arrow_l, arrow_r);
            c.addChild(layer);
            gsap.from(layer, { duration: 0.5, alpha: 0 });
            return layer;
        }
        //in-page-item
        function drawTitle(text, x = 0, y = -340) {
            let e = createText(text, TextStyle.Mirror_title_16, 0.5, scale);
            e.position.set(x, y);
            return e;
        }
        function drawHint(text, x = 0, y = -250) {
            let e = createText(text, TextStyle.Mirror_DogHint_16, 0.5, scale * 0.6);
            e.position.set(x, y);
            return e;
        }
        function drawItemText(text, color, textUrl, onClick = () => { }, width = 1) {
            let e = new PIXI.Container();
            let btn = drawButton(text, color, scale * 0.75, width);
            let st = createSprite(textures[textUrl], [0, 0.5], scale);
            btn.clickEvent = () => {
                let d = new Dialog(self.manager, {
                    context: `確定前往${text}？`,
                    submitText: "前往",
                    submit: () => { d.remove(); onClick(); self.cancelEvent(); },
                    cancelText: "取消",
                    cancel: () => { d.remove(); }
                })
            };
            addPointerEvent(btn);
            st.position.set(65 * width, 5);
            e.addChild(btn, st);
            e.position.x = -180 + (10 * width);
            return e;
        }
        function drawTv(pageName, videoIndex, tvType = 0) {
            const videoUrl = videoData[pageName][videoIndex].url;
            const picUrl = `video_${pageName}_${videoIndex}.png`;
            const videoName = videoData[pageName][videoIndex].name.split("_")[1];
            const unlock = userData[pageName].video[videoName];
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
            function drawVideo(url) {
                //todo
                drawDialog();
            }
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
        function onSelectSort(sort = sortList[selectSort], pageIndex = usingLayer.pageIndex, goto = drawPage_0) {
            let sortIndex = sortList.indexOf(sort);
            if (sortIndex < selectSort || pageIndex < usingLayer.pageIndex) { changePage("left", goto) }
            else if (sortIndex > selectSort || pageIndex > usingLayer.pageIndex) { changePage("right", goto) }
            else { goto(); }
            selectSort = sortIndex;
            page.ribbon.texture = textures[`ribbon_${sortList[selectSort]}.png`];
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
        function drawUnlockObject(url) {
            let bg = drawBg();
            let ss = createSprite(url, 0.5, scale);
            let hint = createText("點擊任意處關閉", TextStyle.white, 0.5, scale);
            hint.position.set(0, -(self.h / 2) + 80);
            bg.clickEvent = () => {
                gsap.killTweensOf(hint);
                c.removeChild(hint);
                gsap.timeline({ onComplete: () => { c.removeChild(ss, bg); } })
                    .to(ss, { duration: animTime, alpha: 0 })
                    .to(bg, { duration: animTime, alpha: 0 }, 0)
            }
            addPointerEvent(bg);
            c.addChild(hint, ss);
            gsap.from(ss, { duration: animTime, alpha: 0 });
            gsap.timeline({ repeat: -1 })
                .from(hint, { duration: animTime * 2, alpha: 0 })
                .from(hint, { duration: animTime * 2, alpha: 1 })
        }
        function drawDialog() {
            let d = new Dialog(self.manager, {
                context: `這個功能還沒完成喔`,
                cancelText: "確定",
                cancel: () => { d.remove(); }
            })
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
                    sound.muteAll();
                }
                else if (this.manager.isMute == true) {
                    e.texture = PIXI.Texture.from("image/soundon.svg");
                    this.manager.isMute = false;
                    sound.unmuteAll();
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
            s.clickEvent = function () {
                this.manager.toOtherPage(uiData[i].name);
            }.bind(this);
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
            this.icon = this.drawIcon('image/cancel.png');
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
export function drawButton(text, color, scale = 1, width = 1) {
    const texture = PIXI.Texture.from("image/dialog_button.png");
    const ts = TextStyle.Dialog_Button;
    let c = new PIXI.Container();
    let b = createSprite(texture, 0.5, [scale * width, scale]);
    c.sprite = createSprite(texture, 0.5, [scale * width, scale]);
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