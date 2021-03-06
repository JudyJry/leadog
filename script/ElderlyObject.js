import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Door, Video } from './GameObject.js';
import { ElderlyAction_Hair, ElderlyAction_Story1, ElderlyAction_Story2, ElderlyAction_Story3 } from './ElderlyAction.js';
import { ColorSlip } from './ColorSlip.js';
import { addPointerEvent, createSprite, createText } from './GameFunction.js';
import { TextStyle } from './TextStyle.js';
import { mapData } from './Data.js';
import { FilterSet } from './FilterSet.js';
import { brightnessOverEvent } from './UI.js';
import { sound } from '@pixi/sound';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class ElderlyObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "ElderlyObject";
        this.soundUrl = "sound/elderly.mp3";
        this.children = {
            "background": new Background(this.manager, this, "image/building/elderly/bg.png"),
            "door": new Door(this.manager, this, -0.403, -0.067, "image/building/elderly/door.png"),
            "video": new ElderlyVideo(this.manager, this),
            "tv": new Tv(this.manager, this),
            "book": new Book(this.manager, this),
            "map": new Map(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class ElderlyVideo extends Video {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = -0.103;
        this.y = -0.077;
        this.url = "image/building/elderly/video.png";
        this.zoomIn = 1.6;
        this.videoList = [
            function () { return new ElderlyAction_Story1(this.manager, this) }.bind(this),
            function () { return new ElderlyAction_Story2(this.manager, this) }.bind(this),
            function () { return new ElderlyAction_Story3(this.manager, this) }.bind(this)
        ];
    }
}
class Tv extends Video {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Tv";
        this.x = 0.275;
        this.y = -0.049;
        this.url = "image/building/elderly/tv.png";
        this.zoomIn = 2.6;
        this.zoomInPos = [83.4, -70]
        this.fadeText = "??????????????????";
        this.spriteHeight = 10;
        this.videoList = [function () { return new ElderlyAction_Hair(this.manager, this) }.bind(this)];
        this.uiOptions = {
            texturesUrl: "image/video/elderly/elderly_video_sprites.json",
            frameUrl: "image/video/tv.png",
            frameScale: 0.5,
            uiHitArea: 79, uiScale: 0.25,
            standard: -270, height: 230, space: 42,
            videoPos: [-83.5, 70]
        }
    }
    onClickResize() {
        if (!this.fullButton.turn) {
            this.frame.alpha = 1;
            this.UItint("white");
            this.page.container.scale.set(this.zoomIn);
            this.page.container.position.set((-this._x + this.zoomInPos[0]) * this.zoomIn, (-this._y + this.zoomInPos[1]) * this.zoomIn);
        }
        else if (this.fullButton.turn) {
            let fz = 3.92;
            this.frame.alpha = 0;
            this.UItint("brown");
            this.page.container.scale.set(fz);
            this.page.container.position.set((-this._x + this.zoomInPos[0]) * fz, (-this._y + this.zoomInPos[1]) * fz);
        }
    }
    onClickUpdate() {
        this.video.update();
        if (this.fullButton.turn) {
            if (this.manager.mouse.x < 250) {
                gsap.to(this.manager.uiSystem.container, { duration: 1, x: 0 });
            }
            else if (this.manager.mouse.x > 500) {
                gsap.to(this.manager.uiSystem.container, { duration: 1, x: -250 });
            }
            if (this.manager.mouse.y > this.h - 110) {
                gsap.to(this.ui, { duration: 1, y: -((screen.height - window.innerHeight + 160) / 3.92) });
            }
            else if (this.manager.mouse.y < this.h - 110) {
                gsap.to(this.ui, { duration: 1, y: 0 });
            }
        }
        else {
            this.manager.uiSystem.container.position.x = 0;
            this.ui.position.set(0);
        }
    }
    clickEvent() {
        sound.pause(this.page.name);
        this.sprite.interactive = false;
        this.zoom();
        this.page.children.player.move(this._x, this.sprite.width);
        this.video = this.videoList[this.random]();
        this.video.setup();
        this.video.container.position.set(this.uiOptions.videoPos[0], this.uiOptions.videoPos[1]);
        this.drawUI();
        this.fullButton.position.set(-this.uiOptions.standard - 160, this.uiOptions.height);
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.page.isZoomIn = true;
        this.isClick = true;
    }
    UItint(color = "brown") {
        this.playButton.tint = ColorSlip[color];
        this.volumeButton.tint = ColorSlip[color];
        this.nextButton.tint = ColorSlip[color];
        this.fullButton.tint = ColorSlip[color];
    }
    play() {
        this.video.videoCrol.play();
        this.video.sound.play();
        this.playButton.texture =
            this.manager.resources[this.uiOptions.texturesUrl]
                .spritesheet.textures["pause.png"];
    }
    pause() {
        this.video.videoCrol.pause();
        this.video.sound.pause();
        this.playButton.texture =
            this.manager.resources[this.uiOptions.texturesUrl]
                .spritesheet.textures["play.png"];
    }
}
class Map extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Map";
        this.x = 0.44;
        this.y = -0.081;
        this.url = "image/building/elderly/map.png";
        this.zoomIn = 1.6;
        this.zoomInPos = [0, -20];
        this.originPos = [0, 43];
        this.uiScale = 0.5;
        //dir = ["north", "west", "south", "east"];
        this.dir = ["n", "w", "s", "e"];
        this.texturesUrl = "image/map/sprites.json";
    }
    onClickResize() {
        this.map = this.drawMap();
    }
    onClickUpdate() {
        for (let i = 0; i < this.dir.length; i++) {
            if (this.map.land[this.dir[i]].isPointerOver) {
                this.map.land[this.dir[i]].blink.outerStrength = 5;
            }
            else {
                this.map.land[this.dir[i]].blink.effect();
            }
        }
    }
    clickEvent() {
        this.blink.outerStrength = 0;
        this.sprite.interactive = false;
        this.zoom();
        this.page.children.player.move(this._x, this.sprite.width);
        this.page.isZoomIn = true;
        this.isClick = true;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        try {
            const self = this;
            this.manager.app.loader.add(this.texturesUrl);
            this.manager.app.loader.load(() => {
                self.textures = self.manager.resources[self.texturesUrl].spritesheet.textures;
                self.map = self.drawMap();
            });
        }
        catch {
            this.textures = this.manager.resources[this.texturesUrl].spritesheet.textures;
            this.map = this.drawMap();
        }
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
        this.container.removeChild(this.map);
    }
    drawMap() {
        const self = this;
        const ox = this.originPos[0];
        const oy = this.originPos[1];
        const scale = this.uiScale;
        const textures = this.textures;
        const data_num = mapData.elderly_num;
        const data_name = mapData.elderly_name;
        const data_detail = mapData.elderly_detail;
        const dir = this.dir;
        const dirTextStyle_13 = {
            n: TextStyle.Map_N_13,
            w: TextStyle.Map_W_13,
            s: TextStyle.Map_S_13,
            e: TextStyle.Map_E_13
        }
        const dirTextStyle = {
            n: TextStyle.Map_N,
            w: TextStyle.Map_W,
            s: TextStyle.Map_S,
            e: TextStyle.Map_E
        }
        let selectDir = undefined;
        let selectDetail = undefined;
        let c = new PIXI.Container();
        let frame = createSprite(textures["frame.png"], 0.5, scale);
        let mask = createSprite(textures["mask.png"], 0.5, scale);
        mask.position.set(ox, oy);
        drawFrist();
        this.container.addChild(c, frame);
        return c;
        function drawFrist() {
            let bg = new PIXI.Graphics()
                .beginFill(ColorSlip.map_bg)
                .drawRect(0, 0, 352, 434.5);
            bg.pivot.set(352 / 2, 434.5 / 2);
            bg.position.set(ox, oy);
            bg.mask = mask;
            drawFrontLayer();
            drawBrand();
            drawMark();
            drawLand();
            c.addChild(mask, bg, c.land, c.brand, c.mark, c.frontLayer);
        }
        function drawFrontLayer() {
            c.frontLayer = new PIXI.Container();

            let frame = createSprite("image/map/frame.png", 0.5, scale);
            let title = createText("???????????????????????????", TextStyle.Map_Blue, 0.5, 0.5);
            title.position.set(0, -130);
            c.frontLayer.hint = createText("?????????????????????", TextStyle.Map_Blue_16, 0.5, 0.5);
            c.frontLayer.hint.position.set(0, -102);
            c.frontLayer.total_num = createText(
                `????????????????????????\n??????-${data_num.n}?????????-${data_num.w}\n??????-${data_num.s}?????????-${data_num.e}`,
                TextStyle.Map_Blue_13, 0.5, 0.5);
            c.frontLayer.total_num.position.set(100, 200);

            gsap.timeline({ repeat: -1 }).to(c.frontLayer.hint, { duration: 1.5, alpha: 0 }).to(c.frontLayer.hint, { duration: 1.5, alpha: 1 })

            c.frontLayer.addChild(title, c.frontLayer.hint, c.frontLayer.total_num);
        }
        function drawBrand() {
            const pos = {
                "n": [122, -62],
                "w": [-119, -37],
                "s": [-119, 142],
                "e": [109, 65]
            }
            c.brand = new PIXI.Container();
            c.brand.position.set(ox, oy);
            for (let i = 0; i < dir.length; i++) {
                let e = new PIXI.Container();
                e.brand = createSprite(textures[`brand_${dir[i]}.png`], 0.5, scale);
                e.text = createText(data_num[dir[i]] + "???", TextStyle.Map_Blue_13, 0.5, 0.5);
                e.text.position.set(0, 20);
                e.position.set(pos[dir[i]][0], pos[dir[i]][1]);
                e.addChild(e.brand, e.text);
                c.brand[dir[i]] = e;
            }
            c.brand.addChild(c.brand["s"], c.brand["w"], c.brand["n"], c.brand["e"]);
        }
        function drawMark() {
            const pos = {
                "n": [42, -83],
                "w": [-22.5, 8],
                "s": [-59, 115],
                "e": [22.5, 58]
            }
            c.mark = new PIXI.Container();
            c.mark.position.set(ox, oy);
            for (let i = 0; i < dir.length; i++) {
                let e = createSprite(textures[`mark_${dir[i]}.png`], [0.5, 1], scale);
                e.position.set(pos[dir[i]][0], pos[dir[i]][1]);
                gsap.from(e.scale, { duration: 0.8, x: 0, y: 0 })
                c.mark[dir[i]] = e;
            }
            c.mark.addChild(c.mark["s"], c.mark["w"], c.mark["n"], c.mark["e"]);
        }
        function drawLand() {
            const pos = {
                "n": [39.5, -78],
                "w": [-22.5, -1.5],
                "s": [-45.25, 120],
                "e": [22.5, 63]
            }
            const hitArea = {
                "n": new PIXI.Circle(0, 0, 95),
                "w": new PIXI.Circle(0, 0, 95),
                "s": new PIXI.Circle(-0.5, 13.5, 95),
                "e": new PIXI.Rectangle(-198 / 2, -406 / 2, 198, 406)
            }
            c.land = new PIXI.Container();
            c.land.mask = mask;
            c.land.position.set(ox, oy);

            let tw = createSprite(textures["taiwan.png"], 0.5, scale);
            tw.position.set(0, 35);
            for (let i = 0; i < dir.length; i++) {
                let e = createSprite(textures[`land_${dir[i]}.png`], 0.5, scale);
                e.position.set(pos[dir[i]][0], pos[dir[i]][1]);
                e.blink = FilterSet.blink();
                e.filters = [e.blink.filter];
                e.hitArea = hitArea[dir[i]];
                e.clickEvent = () => {
                    selectDir = dir[i];
                    c.mark.alpha = 0;
                    c.frontLayer.hint.alpha = 0;
                    //c.frontLayer.total_num.alpha = 0;
                    for (let j = 0; j < dir.length; j++) {
                        c.brand[dir[j]].alpha = 0;
                        c.land[dir[j]].interactive = false;
                        c.land[dir[j]].filters = [];
                    }
                    c.brand[dir[i]].alpha = 1;

                    let z = 2;
                    let offset = [0, 0];
                    switch (dir[i]) {
                        case "s":
                            offset = [-10, 0];
                            break;
                        case "e":
                            z = 1.6;
                            offset = [20, 5];
                            break;
                    }
                    gsap.timeline()
                        .to(c.land.scale, { duration: 0.5, x: z, y: z })
                        .to(c.land, { duration: 0.5, x: (-e.position.x + offset[0] + ox) * z, y: (-e.position.y + offset[1] + oy) * z }, 0)
                        .to(c.brand[dir[i]], { duration: 0.5, x: 0 - ox, y: -102 - oy }, 0);
                    gsap.killTweensOf(c.frontLayer.hint);
                    drawSecond();
                }
                addPointerEvent(e);
                c.land[dir[i]] = e;
            }
            c.land.addChild(tw, c.land["e"], c.land["s"], c.land["w"], c.land["n"]);
        }
        function drawSecond() {
            c.secondLayer = new PIXI.Container();
            let arrow_r = createSprite(textures["arrow.png"], 0.5, scale);
            let arrow_l = createSprite(textures["arrow.png"], 0.5, [-scale, scale]);
            arrow_r.position.set(48, -102);
            arrow_l.position.set(-48, -102);
            arrow_r.clickEvent = changeDir.bind(this, 1);
            arrow_r.overEvent = brightnessOverEvent;
            arrow_r.hitArea = new PIXI.Circle(0, 0, 30);
            addPointerEvent(arrow_r);
            arrow_l.clickEvent = changeDir.bind(this, -1);
            arrow_l.overEvent = brightnessOverEvent;
            arrow_l.hitArea = new PIXI.Circle(0, 0, 30);
            addPointerEvent(arrow_l);


            let cancelIcon = createSprite(textures["cancel.png"], 0.5, scale);
            cancelIcon.position.set(140, -130);
            cancelIcon.clickEvent = returnFrist;
            cancelIcon.overEvent = brightnessOverEvent;
            cancelIcon.hitArea = new PIXI.Circle(0, 0, 40);
            addPointerEvent(cancelIcon);

            let tl = gsap.timeline().from(c.secondLayer, { duration: 0.8, alpha: 0 });

            let marks = new PIXI.Container();
            for (let i = 0; i < data_name[selectDir].length; i++) {
                let m = new PIXI.Container();
                let e = createSprite(textures[`mark_${selectDir}.png`], [0.5, 1], data_name[selectDir][i].scale);
                let t = createText(data_name[selectDir][i].name, dirTextStyle_13[selectDir], 0.5, 0.5);
                t.position.set(0, -90 * data_name[selectDir][i].scale);
                m.position.set(data_name[selectDir][i].pos[0] + ox, data_name[selectDir][i].pos[1] + oy);
                tl.from(m.scale, { duration: 0.8, x: 0, y: 0 }, 0.4);
                const moffset = 0.05;
                m.overEvent = () => {
                    if (m.isPointerOver) {
                        gsap.timeline()
                            .to(e.scale, { duration: 0.5, x: data_name[selectDir][i].scale + moffset, y: data_name[selectDir][i].scale + moffset })
                            .to(t, { duration: 0.5, x: 0, y: -90 * (data_name[selectDir][i].scale + moffset) }, 0)
                    }
                    else {
                        gsap.timeline()
                            .to(e.scale, { duration: 0.5, x: data_name[selectDir][i].scale, y: data_name[selectDir][i].scale })
                            .to(t, { duration: 0.5, x: 0, y: -90 * data_name[selectDir][i].scale }, 0)
                    }
                }
                m.clickEvent = () => {
                    selectDetail = dir.indexOf(selectDir);
                    drawDetail();
                }
                addPointerEvent(m);

                m.addChild(e, t);
                marks.addChild(m);
            }
            c.secondLayer.addChild(marks, arrow_l, arrow_r, cancelIcon);
            c.addChild(c.secondLayer);

        }
        function changeDir(arrow) {
            let i = dir.indexOf(selectDir) + arrow;
            if (i >= dir.length) { i = 0 }
            else if (i < 0) { i = dir.length - 1; }
            selectDir = dir[i];
            for (let j = 0; j < dir.length; j++) {
                c.brand[dir[j]].alpha = 0;
            }
            c.brand[selectDir].alpha = 1;
            c.brand[selectDir].position.set(0 - ox, -102 - oy);
            c.removeChild(c.secondLayer);
            let z = 2;
            let offset = [0, 0];
            switch (selectDir) {
                case "s":
                    offset = [-10, 0];
                    break;
                case "e":
                    z = 1.6;
                    offset = [20, 5];
                    break;
            }
            gsap.timeline()
                .to(c.land.scale, { duration: 0.5, x: z, y: z })
                .to(c.land, {
                    duration: 0.5,
                    x: (-c.land[selectDir].position.x + offset[0] + ox) * z,
                    y: (-c.land[selectDir].position.y + offset[1] + oy) * z
                }, 0)
            drawSecond();
        }
        function returnFrist() {
            c.removeChild(c.secondLayer, c.brand, c.mark);
            for (let j = 0; j < dir.length; j++) {
                c.land[dir[j]].interactive = true;
                c.land[dir[j]].filters = [c.land[dir[j]].blink.filter];
            }
            gsap.timeline()
                .to(c.land.scale, { duration: 0.5, x: 1, y: 1 })
                .to(c.land, { duration: 0.5, x: ox, y: oy }, 0)
                .to(c.brand, { duration: 0.5, alpha: 1 }, 0)
            drawBrand();
            drawMark();
            c.frontLayer.hint.alpha = 1;
            gsap.timeline({ repeat: -1 }).to(c.frontLayer.hint, { duration: 1.5, alpha: 0 }).to(c.frontLayer.hint, { duration: 1.5, alpha: 1 })
            c.addChild(c.brand, c.mark);
        }
        function drawDetail() {
            console.log(selectDir, selectDetail);
            c.detailLayer = new PIXI.Container();

            let arrow_l = new PIXI.Container();
            arrow_l.s = createSprite(textures["arrowIcon_l.png"], 0.5, scale);
            arrow_l.t = createText("?????????", TextStyle.Map_Green_13, 0.5, scale);
            arrow_l.t.position.set(42, 0);
            arrow_l.position.set(-150, 192);
            arrow_l.addChild(arrow_l.s, arrow_l.t);
            arrow_l.overEvent = brightnessOverEvent;
            arrow_l.clickEvent = changeDetail.bind(this, -1);
            arrow_l.hitArea = new PIXI.Rectangle(-15, -20, 90, 40);
            addPointerEvent(arrow_l);

            let arrow_r = new PIXI.Container();
            arrow_r.s = createSprite(textures["arrowIcon_r.png"], 0.5, scale);
            arrow_r.t = createText("?????????", TextStyle.Map_Green_13, 0.5, scale);
            arrow_r.t.position.set(-42, 0);
            arrow_r.position.set(150, 192);
            arrow_r.addChild(arrow_r.s, arrow_r.t);
            arrow_r.overEvent = brightnessOverEvent;
            arrow_r.clickEvent = changeDetail.bind(this, 1);
            arrow_r.hitArea = new PIXI.Rectangle(-75, -20, 90, 40);
            addPointerEvent(arrow_r);

            let cancelIcon = createSprite(textures["cancel.png"], 0.5, scale);
            cancelIcon.position.set(140, -173);
            cancelIcon.hitArea = new PIXI.Circle(0, 0, 40);
            cancelIcon.clickEvent = () => {
                c.removeChild(c.detailLayer)
            };
            cancelIcon.overEvent = brightnessOverEvent;
            addPointerEvent(cancelIcon);

            let title = createText("???????????????????????????", TextStyle.Map_Blue, 0.5, 0.5);
            title.position.set(0 - ox, -130 - oy);

            let pic = createSprite(textures[data_detail[selectDetail].pic], 0.5, scale);


            let detailName = createText(data_detail[selectDetail].name, dirTextStyle[dir[selectDetail]], 0, scale);
            let detailText = createText(
                `?????????${data_detail[selectDetail].birth}\n?????????${data_detail[selectDetail].gender}\n?????????${data_detail[selectDetail].breed}\n?????????${data_detail[selectDetail].nature}`,
                TextStyle.Map_detail, 0, scale);
            detailName.style.align = data_detail[selectDetail].align;
            detailText.style.align = data_detail[selectDetail].align;
            if (data_detail[selectDetail].align === "right") {
                detailName.anchor.set(1, 0);
                detailText.anchor.set(1, 0);
            }
            detailName.position.set(data_detail[selectDetail].pos[0], data_detail[selectDetail].pos[1]);
            detailText.position.set(data_detail[selectDetail].pos[0], data_detail[selectDetail].pos[1] + 30);

            c.detailLayer.position.set(ox, oy);
            c.detailLayer.addChild(pic, detailName, detailText, arrow_l, arrow_r, cancelIcon, title);
            c.addChild(c.detailLayer);
        }
        function changeDetail(arrow) {
            selectDetail += arrow;
            if (selectDetail >= data_detail.length) { selectDetail = 0 }
            else if (selectDetail < 0) { selectDetail = data_detail.length - 1; }
            c.removeChild(c.detailLayer);
            drawDetail();
        }
    }
}
class Book extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Book";
        this.x = -0.294;
        this.y = -0.121;
        this.url = "image/building/elderly/book.png";
        this.zoomIn = 2;
        this.spriteHeight = 120;
        this.uiScale = 1;
        this.originPos = [0, 0];
        this.texturesUrl = "image/building/elderly/book/sprites.json"
    }
    zoom() { }
    clickEvent() {
        this.blink.outerStrength = 0;
        this.sprite.interactive = false;
        this.page.children.player.move(this._x, this.sprite.width);
        this.page.isZoomIn = true;
        this.isClick = true;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        try {
            const self = this;
            this.manager.app.loader.add(this.texturesUrl);
            this.manager.app.loader.load(() => {
                self.textures = self.manager.resources[self.texturesUrl].spritesheet.textures;
                self.book = self.drawBook();
            });
        }
        catch {
            this.textures = this.manager.resources[this.texturesUrl].spritesheet.textures;
            this.book = this.drawBook();
        }
    }
    cancelEvent() {
        this.sprite.interactive = true;
        this.isClick = false;
        this.page.isZoomIn = false;
        this.cancel.visible = false;
        this.cancel = undefined;
        this.book.onCancel();
    }
    drawBook() {
        const self = this;
        const scale = this.uiScale;
        const textures = this.textures;
        const centerX = 463;
        let c = new PIXI.Container();
        let bg = drawBg();
        let page = undefined;
        let usingLayer = new PIXI.Container();
        c.zIndex = 100;
        c.addChild(usingLayer);
        drawStart();
        c.scale.set(this.manager.canvasScale * 0.9);
        this.manager.app.stage.addChildAt(c, 1);
        c.onCancel = drawEnd;
        return c;
        //page
        function drawStart() {
            let s = createSprite("image/building/elderly/book/cover.png", 0.5, scale * 0.9);
            s.alpha = 0;
            c.addChild(s);
            gsap.timeline()
                .to(s, { duration: 0.5, alpha: 1 })
                .to(s, {
                    duration: 0.5, x: centerX, onComplete: () => {
                        page = drawPage();
                        drawPage_n(0);
                        usingLayer.addChild(page.ribbon);
                        c.removeChild(s);
                    }
                })
        }
        function drawPage_n(index) {
            let layer = drawLayer();
            let arrow_l = drawArrow("left", () => {
                c.removeChild(layer);
                pageAnim("left", drawPage_n.bind(this, index - 1))
            });
            let arrow_r = drawArrow("right", () => {
                c.removeChild(layer);
                pageAnim("right", drawPage_n.bind(this, index + 1))
            });
            switch (index) {
                case 0:
                    arrow_l.interactive = false;
                    arrow_l.alpha = 0.5;
                    break;
                case 1:
                    arrow_r.interactive = false;
                    arrow_r.alpha = 0.5;
                    break;
            }
            let page = createSprite(textures[`page_${index}.png`]);
            page.position.set(0, -25);
            layer.addChild(page, arrow_l, arrow_r);
            usingLayer = layer;
        }
        function drawEnd() {
            let s = createSprite("image/building/elderly/book/cover.png", 0.5, scale * 0.9);
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
            bg.scale.set(1.2);
            c.addChild(bg);
            gsap.from(bg, { duration: 1, alpha: 0 });
            return bg;
        }
        function drawPage() {
            let e = new PIXI.Container();
            let cover = createSprite(textures["bookcover.png"], 0.5, scale);
            let pages = createSprite(textures["pages.png"], 0.5, scale);
            e.ribbon = createSprite(textures["ribbon.png"], 0.5, scale);
            e.page_l = createSprite(textures["page_l.png"], 1, scale);
            e.page_r = createSprite(textures["page_r.png"], [0, 1], scale);

            pages.position.set(0, -11.408);
            e.page_l.position.set(0.5, 372.272);
            e.page_r.position.set(-0.5, 372.272);
            e.ribbon.position.set(-23, -316);
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
                    text.text = "?????????";
                    text.position.set(-47, 0);
                    arrow.position.set(884, 340);
                    arrow.addChild(text, a);
                    break;
                case "left":
                    a = createSprite(textures["arrow_l.png"], 0.5, scale);
                    text.text = "?????????";
                    text.position.set(47, 0);
                    arrow.position.set(-884, 340);
                    arrow.addChild(text, a);
                    break;
            }
            arrow.overEvent = brightnessOverEvent;
            arrow.clickEvent = () => { arrow.interactive = false; clickEvent(); };
            addPointerEvent(arrow);
            return arrow;
        }
        function drawLayer() {
            let layer = new PIXI.Container();
            c.addChild(layer);
            gsap.from(layer, { duration: 0.5, alpha: 0 });
            return layer;
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
    }
}
const loadList = {
    "story1": [
        "sound/elderly_story1.wav",
        "video/elderly_story1.mp4"
    ],
    "story2": [
        "sound/elderly_story2.mp3",
        "video/elderly_story2.mp4"
    ],
    "story3": [
        "sound/elderly_story3.wav",
        "video/elderly_story3.mp4"
    ],
    "hair": [
        "sound/elderly_hair.mp3",
        "video/elderly_hair.mp4",
        "image/video/elderly/hair/title_1.png",
        "image/video/elderly/hair/title_2.png",
        "image/video/elderly/hair/title_3.png",
        "image/video/elderly/hair/hint_1.png",
        "image/video/elderly/hair/hint_2.png",
        "image/video/elderly/hair/hint_3.png",
        "image/video/elderly/hair/button_1.png",
        "image/video/elderly/hair/button_2.png",
        "image/video/elderly/hair/button_3.png"
    ]
}