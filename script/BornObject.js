import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Video, Door } from './GameObject.js';
import { BornAction_Story1, BornAction_Story2 } from './BornAction.js';
import { ColorSlip } from './ColorSlip.js';
import { addPointerEvent, createSprite, createText } from './GameFunction.js';
import { TextStyle } from './TextStyle.js';
import { mapData } from './Data.js';
import { FilterSet } from './FilterSet.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class BornObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "BornObject";
        this.children = {
            "background": new Background(this.manager, this, "image/building/born/bg.png"),
            "door": new Door(this.manager, this, -0.425, -0.026, "image/building/born/door.png"),
            "video": new BornVideo(this.manager, this),
            "mirror": new Mirror(this.manager, this),
            "map": new Map(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class BornVideo extends Video {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = -0.232;
        this.y = -0.055;
        this.url = "image/building/born/video.png";
        this.zoomIn = 1.6;
        this.videoList = [
            function () { return new BornAction_Story1(this.manager, this) }.bind(this),
            function () { return new BornAction_Story2(this.manager, this) }.bind(this)
        ];
    }
}
class Mirror extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.x = 0.296;
        this.y = -0.048;
        this.url = "image/building/born/mirror.png";
        this.zoomIn = 1.5;
    }
}
class Map extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Map";
        this.x = 0.133;
        this.y = -0.071;
        this.url = "image/building/born/map.png";
        this.zoomIn = 1.6;
        this.zoomInPos = [0, -20];
        this.originPos = [0, 43];
        this.uiScale = 0.5;
        //dir = ["north", "west", "south", "east"];
        this.dir = ["n", "w", "s"];
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
        const data_num = mapData.born_num;
        const data_name = mapData.born_name;
        const data_detail = mapData.born_detail;
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
            let title = createText("導盲犬出生分佈地圖", TextStyle.Map_Blue, 0.5, 0.5);
            title.position.set(0, -130);
            c.frontLayer.hint = createText("請選擇出生地區", TextStyle.Map_Blue_16, 0.5, 0.5);
            c.frontLayer.hint.position.set(0, -102);
            c.frontLayer.total_num = createText(
                `各地區收養導盲犬\n北部-${data_num.n}　中部-${data_num.w}\n南部-${data_num.s}`,
                TextStyle.Map_Blue_13, 0.5, 0.5);
            c.frontLayer.total_num.position.set(100, 200);

            gsap.timeline({ repeat: -1 }).to(c.frontLayer.hint, { duration: 1.5, alpha: 0 }).to(c.frontLayer.hint, { duration: 1.5, alpha: 1 })

            c.frontLayer.addChild(title, c.frontLayer.hint, c.frontLayer.total_num);
        }
        function drawBrand() {
            const pos = {
                "n": [122, -62],
                "w": [-119, -37],
                "s": [-119, 142]
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
            c.brand.addChild(c.brand["s"], c.brand["w"], c.brand["n"]);
        }
        function drawMark() {
            const pos = {
                "n": [42, -83],
                "w": [-22.5, 8],
                "s": [-59, 115]
            }
            c.mark = new PIXI.Container();
            c.mark.position.set(ox, oy);
            for (let i = 0; i < dir.length; i++) {
                let e = createSprite(textures[`mark_${dir[i]}.png`], [0.5, 1], scale);
                e.position.set(pos[dir[i]][0], pos[dir[i]][1]);
                gsap.from(e.scale, { duration: 0.8, x: 0, y: 0 })
                c.mark[dir[i]] = e;
            }
            c.mark.addChild(c.mark["s"], c.mark["w"], c.mark["n"]);
        }
        function drawLand() {
            const pos = {
                "n": [39.5, -78],
                "w": [-22.5, -1.5],
                "s": [-45.25, 120]
            }
            const hitArea = {
                "n": new PIXI.Circle(0, 0, 95),
                "w": new PIXI.Circle(0, 0, 95),
                "s": new PIXI.Circle(-0.5, 13.5, 95)
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
            c.land.addChild(tw, c.land["s"], c.land["w"], c.land["n"]);
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

            let title = createText("導盲犬出生分佈地圖", TextStyle.Map_Blue, 0.5, 0.5);
            title.position.set(0 - ox, -130 - oy);

            let pic = createSprite(data_detail[selectDetail].pic, 0.5, scale);


            let detailName = createText(data_detail[selectDetail].name, dirTextStyle[dir[selectDetail]], 0, scale);
            let detailText = createText(
                `生日：${data_detail[selectDetail].birth}\n重量：${data_detail[selectDetail].weight}\n性別：${data_detail[selectDetail].gender}\n犬種：${data_detail[selectDetail].breed}`,
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

const loadList = {
    story1: [
        "sound/born_story.mp3",
        "video/born_story1.mp4"
    ],
    story2: [
        "sound/born_story.mp3",
        "video/born_story2.mp4"
    ]
}
