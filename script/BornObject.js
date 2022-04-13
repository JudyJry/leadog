import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Video, Door } from './GameObject.js';
import { BornAction_Story1, BornAction_Story2 } from './BornAction.js';
import { ColorSlip } from './ColorSlip.js';
import { addDragEvent, addPointerEvent, createSprite, createText } from './GameFunction.js';
import { TextStyle } from './TextStyle.js';
import { mapData } from './Data.js';
import { FilterSet } from './FilterSet.js';
import { brightnessOverEvent, drawButton } from './UI.js';
import { math } from './math.js';

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
        this.originPos = [3.5, -15.5]
        this.uiScale = 0.5;
        this.selectGener = undefined;
        this.selectGender = {};
        this.texturesUrl = "image/building/born/sprites.json";
    }
    onClickResize() { this.mirror = this.drawMirror(); }
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
        try {
            const self = this;
            this.manager.app.loader.add(this.texturesUrl);
            this.manager.app.loader.load(() => {
                self.textures = self.manager.app.loader.resources[self.texturesUrl].spritesheet.textures;
                self.mirror = self.drawMirror();
            });
        }
        catch {
            this.textures = this.manager.app.loader.resources[this.texturesUrl].spritesheet.textures;
            this.mirror = this.drawMirror();
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
        this.container.removeChild(this.mirror);
    }
    returnResult() {
        //console.log(this.selectGender);
        let arr = [];
        for (const [key, value] of Object.entries(this.selectGender)) {
            arr.push({ gener: key, gender: value });
        }
        this.manager.userData.born.mirror_collect = arr;
        console.log(this.manager.userData.born.mirror_collect);
    }
    drawMirror() {
        const self = this;
        const ox = this.originPos[0];
        const oy = this.originPos[1];
        const scale = this.uiScale;

        /* const textures = {
            "mask.png": "image/building/born/mirror/mask.png",
            "dialog_start.png": "image/building/born/mirror/dialog_start.png",
            "dialog_dogHint.png": "image/building/born/mirror/dialog_dogHint.png",
            "dogHint.png": "image/building/born/mirror/dogHint.png",
            "frame_dog.png": "image/building/born/mirror/frame_dog.png",
            //8
            "8_m.png": "image/building/born/mirror/8_m.png",
            "8_d.png": "image/building/born/mirror/8_d.png",
            "8_m_s.png": "image/building/born/mirror/8_m_s.png",
            "8_d_s.png": "image/building/born/mirror/8_d_s.png",
            //7
            "7_m.png": "image/building/born/mirror/7_m.png",
            "7_d.png": "image/building/born/mirror/7_d.png",
            "7_m_s.png": "image/building/born/mirror/7_m_s.png",
            "7_d_s.png": "image/building/born/mirror/7_d_s.png",
            //6
            "6_m.png": "image/building/born/mirror/6_m.png",
            "6_d.png": "image/building/born/mirror/6_d.png",
            "6_m_s.png": "image/building/born/mirror/6_m_s.png",
            "6_d_s.png": "image/building/born/mirror/6_d_s.png",
            //5
            "5_m.png": "image/building/born/mirror/6_m.png",
            "5_d.png": "image/building/born/mirror/6_d.png",
            "5_m_s.png": "image/building/born/mirror/6_m_s.png",
            "5_d_s.png": "image/building/born/mirror/6_d_s.png",
            //4
            "4_m.png": "image/building/born/mirror/6_m.png",
            "4_d.png": "image/building/born/mirror/6_d.png",
            "4_m_s.png": "image/building/born/mirror/6_m_s.png",
            "4_d_s.png": "image/building/born/mirror/6_d_s.png",
            //3
            "4_m.png": "image/building/born/mirror/6_m.png",
            "4_d.png": "image/building/born/mirror/6_d.png",
            "4_m_s.png": "image/building/born/mirror/6_m_s.png",
            "4_d_s.png": "image/building/born/mirror/6_d_s.png",
            //2
            "2_m.png": "image/building/born/mirror/6_m.png",
            "2_d.png": "image/building/born/mirror/6_d.png",
            "2_m_s.png": "image/building/born/mirror/6_m_s.png",
            "2_d_s.png": "image/building/born/mirror/6_d_s.png",
            //1
            "1_m.png": "image/building/born/mirror/6_m.png",
            "1_d.png": "image/building/born/mirror/6_d.png",
            "1_m_s.png": "image/building/born/mirror/6_m_s.png",
            "1_d_s.png": "image/building/born/mirror/6_d_s.png",
        }; */

        const textures = this.textures;
        const generStr = ["一", "二", "三", "四", "五", "六", "七", "八"];
        const genderStr = ["Daddy", "Mommy"];
        const gStr = { "Daddy": "d", "Mommy": "m" };
        const genderTextStyle = { "Daddy": TextStyle.Mirror_dad, "Mommy": TextStyle.Mirror_mom };
        let c = new PIXI.Container();
        let mask = createSprite(textures["mask.png"], 0.5, scale);
        c.position.set(ox, oy);
        c.addChild(mask);
        if (this.selectGener === undefined) {
            drawStart_1();
        }
        else {
            drawSelectStage(this.selectGener);
        }
        this.container.addChild(c);
        return c;
        //draw stage
        function drawStart_1() {
            let layer = drawLayer();
            let dialog = createSprite(textures["dialog_start.png"], 0.5, scale);
            let title = createText("遊戲方法", TextStyle.Mirror_title, 0.5, scale);
            let text = createText(`選擇要認識爸爸\n或媽媽，讀完資料\n即可獲得該張卡牌`, TextStyle.Mirror_startText, 0.5, scale);
            let start = drawButton("開始遊戲", ColorSlip.button_submit);
            dialog.position.set(0, -32);
            title.position.set(0, -132);
            start.position.set(0, 200);
            start.clickEvent = () => {
                gsap.to(layer, {
                    duration: 0.2, alpha: 0, onComplete: () => {
                        c.removeChild(layer);
                        drawStart_2();
                    }
                })
            }
            addPointerEvent(start);
            layer.addChild(start, dialog, title, text);
        }
        function drawStart_2() {
            let layer = drawLayer();
            let dialog = createSprite(textures["dialog_start.png"], 0.5, scale);
            let text = createText(
                `我是第九代導盲犬\n我的爸爸媽媽\n也都是導盲犬唷！\n一起來認識我們吧！`
                , TextStyle.Mirror_startText, 0.5, scale);
            let start = drawButton("開始遊戲", ColorSlip.button_submit);
            dialog.position.set(0, -32);
            start.position.set(0, 200);
            start.clickEvent = () => {
                gsap.to(layer, {
                    duration: 0.2, alpha: 0, onComplete: () => {
                        self.selectGener = 8;
                        c.removeChild(layer);
                        drawSelectStage(self.selectGener);
                    }
                })
            }
            addPointerEvent(start);
            layer.addChild(start, dialog, text);
        }
        function drawSelectStage(gener) {
            let layer = drawLayer();
            let title = createText(`第${generStr[gener - 1]}代`, TextStyle.Mirror_title, 0.5, scale);
            let hint = createText("請選擇要認識Daddy、Mommy", TextStyle.Mirror_Hint, 0.5, scale);
            let dad = drawGenderDog(genderStr[0], textures[`${gener}_d_s.png`]);
            let mom = drawGenderDog(genderStr[1], textures[`${gener}_m_s.png`]);
            title.position.set(0, -192);
            hint.position.set(0, -145);
            dad.position.set(-85, 5);
            mom.position.set(85, 5);

            let list = gener !== 8 ? drawSelectList() : new PIXI.Container();
            let dogHint = undefined;
            switch (gener) {
                case 8:
                    dogHint = drawDogHint(`我的Daddy、Mommy\n都是導盲犬喔！`);
                    layer.addChild(dogHint);
                    break;
                case 7:
                    dogHint = drawDogHint(`可點擊下方卡牌看到\n剛剛收集的卡牌喔！`, [-50, -25]);
                    layer.addChild(dogHint);
                    break;
                case 6:
                    dogHint = drawDogHint(`收集的卡牌也會\n在手冊出現喔！`, [-40, -30], scale - 0.1);
                    layer.addChild(dogHint);
                    break;
            }

            layer.addChild(title, hint, dad, mom, list);
        }
        function drawSelected(gener, gender) {
            let layer = drawLayer();
            let dialog = createSprite(textures["dialog_start.png"], 0.5, scale);
            let pic = createSprite(textures[`${gener}_${gStr[gender]}.png`], 0.5, scale);
            let title = createText(`第${generStr[gener - 1]}代`, TextStyle.Mirror_title, 0.5, scale);
            let btn = gener == 1 ? drawButton("結束遊戲", ColorSlip.button_cancel) : drawButton("繼續遊戲", ColorSlip.button_submit);
            let cbtn = createSprite("image/cancel.png", 0.5, scale);
            dialog.position.set(0, -32);
            pic.position.set(0, -32);
            title.position.set(0, -132);
            cbtn.position.set(134, -195);
            btn.clickEvent = () => {
                self.selectGender[gener] = gender;
                console.log("select:" + self.selectGener + "," + self.selectGender[gener]);
                self.selectGener -= 1;
                gsap.to(layer, {
                    duration: 0.2, alpha: 0, onComplete: () => {
                        c.removeChild(layer);
                        if (self.selectGener == 0) {
                            self.returnResult();
                            drawEnd();
                        }
                        else {
                            drawSelectStage(self.selectGener);
                        }
                    }
                })
            }
            btn.position.set(0, 200);
            cbtn.overEvent = brightnessOverEvent;
            cbtn.clickEvent = () => {
                gsap.to(layer, {
                    duration: 0.5, alpha: 0, onComplete: () => {
                        c.removeChild(layer);
                        drawSelectStage(self.selectGener);
                    }
                })
            }
            addPointerEvent(btn);
            addPointerEvent(cbtn);
            layer.addChild(dialog, pic, title, btn, cbtn);
        }
        function drawEnd() {
            let layer = drawLayer();
            let title = createText("恭喜完成", TextStyle.Mirror_title, 0.5, scale);
            let hint = createText(`導盲犬八代都必須是合格導盲犬且健康\n才能誕生健康的導盲犬寶寶喔！`, TextStyle.Mirror_Hint, 0.5, scale);
            let dogHint = drawDogHint(`收集的卡牌也會\n在手冊出現喔！`, [-50, -5], 0.4);
            let cbtn = createSprite("image/cancel.png", 0.5, scale);
            let list = new PIXI.Container();
            for (let i = 0; i < generStr.length; i++) {
                const s = 0.45;
                let card = drawDogCard(i + 1, self.selectGender[i + 1], s);
                let text = createText(`第${generStr[i]}代`, TextStyle.Mirror_title_12, 0.5, scale);
                if (i < 4) {
                    card.position.set(124 + (-80 * i), 88);
                    text.position.set(124 + (-80 * i), 148);
                }
                else {
                    card.position.set(124 + (-80 * (i - 4)), -40);
                    text.position.set(124 + (-80 * (i - 4)), 20);
                }
                list.addChild(card, text);
            }
            cbtn.overEvent = brightnessOverEvent;
            cbtn.clickEvent = () => {
                gsap.to(layer, {
                    duration: 0.2, alpha: 0, onComplete: () => {
                        self.cancelEvent();
                    }
                })
            }
            addPointerEvent(cbtn);
            title.position.set(0, -192);
            hint.position.set(0, -128);
            cbtn.position.set(134, -195);
            layer.addChild(title, hint, dogHint, list, cbtn);
        }
        function drawDogCardDetail(gener, gender) {
            let layer = drawLayer();
            let dialog = createSprite(textures["dialog_start.png"], 0.5, scale);
            let pic = createSprite(textures[`${gener}_${gStr[gender]}.png`], 0.5, scale);
            let title = createText(`第${generStr[gener - 1]}代`, TextStyle.Mirror_title, 0.5, scale);
            let btn = drawButton("關閉", ColorSlip.button_cancel);
            let cbtn = createSprite("image/cancel.png", 0.5, scale);
            let arrow_l = createSprite(textures["arrow_l.png"], 0.5, scale);
            let arrow_r = createSprite(textures["arrow_r.png"], 0.5, scale);
            dialog.position.set(0, -32);
            pic.position.set(0, -32);
            title.position.set(0, -132);
            cbtn.position.set(134, -195);
            arrow_l.position.set(-80, -132);
            arrow_r.position.set(80, -132);
            btn.clickEvent = cbtn.clickEvent = () => {
                gsap.to(layer, {
                    duration: 0.2, alpha: 0, onComplete: () => {
                        c.removeChild(layer);
                        if (self.selectGener == 0) {
                            drawEnd();
                        }
                        else {
                            drawSelectStage(self.selectGener);
                        }
                    }
                })
            }
            btn.position.set(0, 200);
            cbtn.overEvent = arrow_l.overEvent = arrow_r.overEvent = brightnessOverEvent;
            arrow_l.clickEvent = () => {
                gener++;
                if (gener == 8) {
                    arrow_l.interactive = false;
                    arrow_l.alpha = 0.5;
                    arrow_r.interactive = true;
                    arrow_r.alpha = 1;
                }
                else {
                    arrow_r.interactive = true;
                    arrow_r.alpha = 1;
                    arrow_l.interactive = true;
                    arrow_l.alpha = 1;
                }
                gender = self.selectGender[gener];
                title.text = `第${generStr[gener - 1]}代`;
                pic.texture = textures[`${gener}_${gStr[gender]}.png`];
            }
            arrow_r.clickEvent = () => {
                gener--;
                if (gener == 8 - Object.keys(self.selectGender).length + 1) {
                    arrow_r.interactive = false;
                    arrow_r.alpha = 0.5;
                    arrow_l.interactive = true;
                    arrow_l.alpha = 1;
                }
                else {
                    arrow_l.interactive = true;
                    arrow_l.alpha = 1;
                    arrow_r.interactive = true;
                    arrow_r.alpha = 1;
                }
                gender = self.selectGender[gener];
                title.text = `第${generStr[gener - 1]}代`;
                pic.texture = textures[`${gener}_${gStr[gender]}.png`];
            }
            addPointerEvent(btn);
            addPointerEvent(cbtn);
            addPointerEvent(arrow_l);
            addPointerEvent(arrow_r);
            if (gener == 8) {
                arrow_l.interactive = false;
                arrow_l.alpha = 0.5;
            }
            if (gener == 8 - Object.keys(self.selectGender).length + 1) {
                arrow_r.interactive = false;
                arrow_r.alpha = 0.5;
            }
            layer.addChild(dialog, pic, title, btn, cbtn, arrow_l, arrow_r);
        }
        // draw duplicate obj
        function drawLayer() {
            let layer = new PIXI.Container();
            layer.mask = mask;
            //layer.position.set(ox, oy);
            c.addChild(layer);
            gsap.from(layer, { duration: 0.2, alpha: 0 });
            return layer;
        }
        function drawDogHint(str, hintPos = [-68, -25], hintScale = scale) {
            let c = new PIXI.Container();
            let hint = createText(str, TextStyle.Mirror_DogHint, 0.5, hintScale);
            let bg = createSprite(textures["dialog_dogHint.png"], 0.5, hintScale);
            let dog = createSprite(textures["dogHint.png"], 0.5, scale);
            hint.position.set(hintPos[0], hintPos[1]);
            bg.position.set(hintPos[0] + 8, hintPos[1] - 2);
            dog.position.set(95, 13);
            c.position.set(56, 216);
            c.addChild(bg, hint, dog);
            gsap.timeline()
                .from(dog, { duration: 0.5, x: 190, y: 135 })
                .from(hint, { duration: 0.5, alpha: 0 }, 0.5)
                .from(bg, { duration: 0.5, alpha: 0 }, 0.5);
            return c;
        }
        function drawGenderDog(gender, picUrl) {
            const f = FilterSet.link();
            let layer = new PIXI.Container();
            let bg = createSprite(textures["frame_dog.png"], 0.5, scale);
            let pic = createSprite(picUrl, 0.5, scale);
            let text = createText(gender, genderTextStyle[gender], 0.5, scale);
            text.position.set(0, 66);
            layer.gender = gender;
            layer.overEvent = () => {
                if (layer.isPointerOver) { layer.filters = [f]; }
                else { layer.filters = []; }
            }
            layer.clickEvent = () => {
                gsap.to(c.children[1], {
                    duration: 0.2, alpha: 0, onComplete: () => {
                        c.removeChildAt(1);
                        drawSelected(self.selectGener, layer.gender);
                    }
                })
            }
            layer.addChild(bg, pic, text);
            addPointerEvent(layer);
            return layer;
        }
        function drawSelectList() {
            let layer = new PIXI.Container();
            let list = new PIXI.Container();

            let count = 0;
            for (let i = 8; i > 8 - Object.keys(self.selectGender).length; i--) {
                let card = drawDogCard(i, self.selectGender[i], 0.36);
                card.position.set(count * 60, 0);
                list.addChild(card);
                count++;
            }
            if (count > 5) {
                let prevX = undefined;
                let slider = drawSlider(list);
                let len = list.getBounds().width;
                list.dragDownEvent = (e, event) => {
                    prevX = event.data.global.x;
                    slider.track.alpha = 0.5;
                    slider.handle.alpha = 1;
                }
                list.dragMoveEvent = (e, event) => {
                    e.position.x += event.data.global.x - prevX;
                    prevX = event.data.global.x;
                    if (e.position.x > 0) { e.position.x = 0 }
                    if (e.position.x <= slider.trackLength - len) {
                        e.position.x = slider.trackLength - len;
                        slider.handle.position.x = slider.len;
                    }
                    else {
                        slider.handle.position.x = -math.Map(e.position.x, 0, len, 0, slider.trackLength);
                    }
                }
                list.dragUpEvent = (e, event) => {
                    slider.track.alpha = 0;
                    slider.handle.alpha = 0.5;
                    prevX = undefined;
                }
                addDragEvent(list);
                slider.position.set(-28, 43);
                layer.addChild(slider);
            }

            layer.position.set(-132, 196);
            layer.addChild(list);
            return layer;
        }
        function drawDogCard(gener, gender, cardScale) {
            const f = FilterSet.link();
            let layer = new PIXI.Container();
            let dialog = createSprite(textures["frame_dog.png"], 0.5, scale * cardScale);
            let pic = createSprite(textures[`${gener}_${gStr[gender]}_s.png`], 0.5, scale * cardScale);
            layer.addChild(dialog, pic);
            layer.overEvent = () => {
                if (layer.isPointerOver) { layer.filters = [f]; }
                else { layer.filters = []; }
            }
            layer.clickEvent = () => {
                gsap.to(c.children[1], {
                    duration: 0.2, alpha: 0, onComplete: () => {
                        c.removeChildAt(1);
                        drawDogCardDetail(gener, gender);
                    }
                })
            }
            addPointerEvent(layer);
            return layer;
        }
        function drawSlider(obj) {
            let slider = new PIXI.Container();
            slider.handleLength = 40 * (8 - Object.keys(self.selectGender).length + 5);
            slider.trackLength = 320;
            slider.listLength = obj.getBounds().width;
            slider.len = slider.trackLength - slider.handleLength;
            slider.handle = new PIXI.Graphics()
                .beginFill(ColorSlip.white)
                .drawRoundedRect(0, 0, slider.handleLength, 8, 4)
                .endFill();
            slider.track = new PIXI.Graphics()
                .beginFill(ColorSlip.darkBlue)
                .drawRoundedRect(0, 0, slider.trackLength, 8, 4)
                .endFill();

            let prevX = undefined;

            slider.handle.dragDownEvent = (e, event) => {
                prevX = event.data.global.x;
                slider.track.alpha = 0.5;
                slider.handle.alpha = 1;
            }
            slider.handle.dragMoveEvent = (e, event) => {
                e.position.x += event.data.global.x - prevX;
                prevX = event.data.global.x;
                if (e.position.x < 0) { e.position.x = 0 }
                if (slider.handleLength + e.position.x >= slider.trackLength) {
                    e.position.x = slider.len;
                    obj.position.x = slider.trackLength - slider.listLength;
                }
                else {
                    obj.position.x = -math.Map(e.position.x, 0, slider.trackLength, 0, slider.listLength);
                }
            }
            slider.handle.dragUpEvent = (e, event) => {
                slider.track.alpha = 0;
                slider.handle.alpha = 0.5;
                prevX = undefined;
            }
            addDragEvent(slider.handle);
            slider.track.alpha = 0;
            slider.handle.alpha = 0.8;
            slider.addChild(slider.track, slider.handle);
            return slider;
        }
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
                self.textures = self.manager.app.loader.resources[self.texturesUrl].spritesheet.textures;
                self.map = self.drawMap();
            });
        }
        catch {
            this.textures = this.manager.app.loader.resources[this.texturesUrl].spritesheet.textures;
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
            arrow_l.t = createText("上一頁", TextStyle.Map_Green_13, 0.5, scale);
            arrow_l.t.position.set(42, 0);
            arrow_l.position.set(-150, 192);
            arrow_l.addChild(arrow_l.s, arrow_l.t);
            arrow_l.overEvent = brightnessOverEvent;
            arrow_l.clickEvent = changeDetail.bind(this, -1);
            arrow_l.hitArea = new PIXI.Rectangle(-15, -20, 90, 40);
            addPointerEvent(arrow_l);

            let arrow_r = new PIXI.Container();
            arrow_r.s = createSprite(textures["arrowIcon_r.png"], 0.5, scale);
            arrow_r.t = createText("下一頁", TextStyle.Map_Green_13, 0.5, scale);
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

            let title = createText("導盲犬出生分佈地圖", TextStyle.Map_Blue, 0.5, 0.5);
            title.position.set(0 - ox, -130 - oy);

            let pic = createSprite(textures[data_detail[selectDetail].pic], 0.5, scale);


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
