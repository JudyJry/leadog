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

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class ElderlyObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "ElderlyObject";
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
        this.zoomInPos = [83.4, -73.35]
        this.fadeText = "點擊播放影片";
        this.spriteHeight = 10;
        this.videoList = [function () { return new ElderlyAction_Hair(this.manager, this) }.bind(this)];
        this.uiOptions = {
            texturesUrl: "image/video/elderly/elderly_video_sprites.json",
            frameUrl: "image/video/tv.png",
            frameScale: 0.5,
            uiHitArea: 79, uiScale: 0.25,
            standard: -270, height: 235, space: 42
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
        this.sprite.interactive = false;
        this.zoom();
        this.page.children.player.move(this._x, this.sprite.width);
        this.video = this.videoList[this.random]();
        this.video.setup();
        this.video.container.position.set(-83, 73);
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
        this.textures = this.manager.app.loader.resources["image/map/sprites.json"].spritesheet.textures;
        this.map = this.drawMap();
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
    uiOverEvent(e) {
        if (e.isPointerOver) {
            gsap.killTweensOf(e);
            gsap.to(e, { duration: 0.5, pixi: { brightness: 0.9 } });
        }
        else {
            gsap.killTweensOf(e);
            gsap.to(e, { duration: 0.5, pixi: { brightness: 1 } });
        }
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
        let frame = createSprite("image/map/frame.png", 0.5, scale);
        let mask = createSprite("image/map/mask.png", 0.5, scale);
        mask.position.set(ox, oy);
        drawFrist();
        this.container.addChild(c, frame);
        return c;
        function drawFrist() {
            let bg = new PIXI.Graphics()
                .beginFill(ColorSlip.lightBlue)
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
            let title = createText("導盲犬收養分佈地圖", TextStyle.Map_Blue, 0.5, 0.5);
            title.position.set(0, -130);
            c.frontLayer.hint = createText("請選擇收養地區", TextStyle.Map_Blue_16, 0.5, 0.5);
            c.frontLayer.hint.position.set(0, -102);
            c.frontLayer.total_num = createText(
                `各地區收養導盲犬\n北部-${data_num.n}　中部-${data_num.w}\n南部-${data_num.s}　東部-${data_num.e}`,
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
                e.text = createText(data_num[dir[i]] + "隻", TextStyle.Map_Blue_13, 0.5, 0.5);
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
            //todo: click marks=> drawDetail()
            c.secondLayer = new PIXI.Container();
            let arror_r = createSprite(textures["arror.png"], 0.5, scale);
            let arror_l = createSprite(textures["arror.png"], 0.5, [-scale, scale]);
            arror_r.position.set(48, -102);
            arror_l.position.set(-48, -102);
            arror_r.clickEvent = changeDir.bind(this, 1);
            arror_r.overEvent = self.uiOverEvent.bind(self);
            arror_r.hitArea = new PIXI.Circle(0, 0, 30);
            addPointerEvent(arror_r);
            arror_l.clickEvent = changeDir.bind(this, -1);
            arror_l.overEvent = self.uiOverEvent.bind(self);
            arror_l.hitArea = new PIXI.Circle(0, 0, 30);
            addPointerEvent(arror_l);


            let cancelIcon = createSprite(textures["cancel.png"], 0.5, scale);
            cancelIcon.position.set(140, -130);
            cancelIcon.clickEvent = returnFrist;
            cancelIcon.overEvent = self.uiOverEvent.bind(self);
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
            c.secondLayer.addChild(marks, arror_l, arror_r, cancelIcon);
            c.addChild(c.secondLayer);

        }
        function changeDir(arror) {
            let i = dir.indexOf(selectDir) + arror;
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
            //todo: click bottom arror=> change nameText, detail text, pic
            c.detailLayer = new PIXI.Container();

            let arror_l = new PIXI.Container();
            arror_l.s = createSprite(textures["arrorIcon_l.png"], 0.5, scale);
            arror_l.t = createText("上一頁", TextStyle.Map_Green_13, 0.5, scale);
            arror_l.t.position.set(42, 0);
            arror_l.position.set(-150, 192);
            arror_l.addChild(arror_l.s, arror_l.t);
            arror_l.overEvent = self.uiOverEvent.bind(self);
            arror_l.clickEvent = changeDetail.bind(this, -1);
            arror_l.hitArea = new PIXI.Rectangle(-15, -20, 90, 40);
            addPointerEvent(arror_l);

            let arror_r = new PIXI.Container();
            arror_r.s = createSprite(textures["arrorIcon_r.png"], 0.5, scale);
            arror_r.t = createText("下一頁", TextStyle.Map_Green_13, 0.5, scale);
            arror_r.t.position.set(-42, 0);
            arror_r.position.set(150, 192);
            arror_r.addChild(arror_r.s, arror_r.t);
            arror_r.overEvent = self.uiOverEvent.bind(self);
            arror_r.clickEvent = changeDetail.bind(this, 1);
            arror_r.hitArea = new PIXI.Rectangle(-75, -20, 90, 40);
            addPointerEvent(arror_r);

            let cancelIcon = createSprite(textures["cancel.png"], 0.5, scale);
            cancelIcon.position.set(140, -173);
            cancelIcon.hitArea = new PIXI.Circle(0, 0, 40);
            cancelIcon.clickEvent = () => {
                c.removeChild(c.detailLayer)
            };
            cancelIcon.overEvent = self.uiOverEvent.bind(self);
            addPointerEvent(cancelIcon);

            let title = createText("導盲犬收養分佈地圖", TextStyle.Map_Blue, 0.5, 0.5);
            title.position.set(0 - ox, -130 - oy);

            let pic = createSprite(data_detail[selectDetail].pic, 0.5, scale);


            let detailName = createText(data_detail[selectDetail].name, dirTextStyle[dir[selectDetail]], 0, scale);
            let detailText = createText(
                `生日：${data_detail[selectDetail].birth}\n性別：${data_detail[selectDetail].gender}\n犬種：${data_detail[selectDetail].breed}\n性格：${data_detail[selectDetail].nature}`,
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
            c.detailLayer.addChild(pic, detailName, detailText, arror_l, arror_r, cancelIcon, title);
            c.addChild(c.detailLayer);
        }
        function changeDetail(arror) {
            selectDetail += arror;
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