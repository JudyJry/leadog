import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Video, OtherObject, Door } from './GameObject.js';
import YouthAction_Bus from './YouthAction_bus.js';
import YouthAction_Instruction from './YouthAction_Instruction.js';
import YouthAction_Traffic from './YouthAction_Traffic.js';
import YouthAction_Instruction2 from './YouthAction_Instruction2.js';
import { addPointerEvent, createSprite, createText } from './GameFunction.js';
import { FilterSet } from './FilterSet.js';
import { brightnessOverEvent, drawButton, glowOverEvent } from './UI.js';
import { TextStyle } from './TextStyle.js';
import { ThreeNotOneQuestionData } from './Data.js';
import { ColorSlip } from './ColorSlip.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class YouthObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "YouthObject";
        this.children = {
            "background": new Background(this.manager, this, "image/building/youth/bg.png"),
            "door": new Door(this.manager, this, -0.064, 0.117, "image/building/youth/door.png"),
            "video": new YouthVideo(this.manager, this),
            "graduate": new Graduate(this.manager, this),
            "grass": new OtherObject(this.manager, "grass", 0.028, 0.054, "image/building/youth/grass.png"),
            "mirror": new Mirror(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class YouthVideo extends Video {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = 0.363;
        this.y = -0.037;
        this.url = "image/building/youth/video.png";
        this.zoomIn = 1.8;
        this.zoomInPos = [0, 25];
        this.uiOptions = {
            texturesUrl: "image/video/actionUI_sprites.json",
            frameUrl: "image/video/youth/video.png",
            frameScale: 0.25,
            uiHitArea: 65, uiScale: 0.2,
            standard: -300, height: 186, space: 35
        }
        this.videoList = [
            function () { return new YouthAction_Bus(this.manager, this) }.bind(this),
            function () { return new YouthAction_Traffic(this.manager, this) }.bind(this),
            function () { return new YouthAction_Instruction(this.manager, this) }.bind(this),
            function () { return new YouthAction_Instruction2(this.manager, this) }.bind(this)
        ]
    }
    onClickResize() {
        if (!this.fullButton.turn) {
            this.page.container.scale.set(this.zoomIn);
            this.page.container.position.set((-this._x + this.zoomInPos[0]) * this.zoomIn, (-this._y + this.zoomInPos[1]) * this.zoomIn);
        }
        else if (this.fullButton.turn) {
            let fz = 2.85;
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
                gsap.to(this.ui, { duration: 1, y: -((screen.height - window.innerHeight + 128) / 2.85) });
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
        this.drawUI();
        this.video.container.position.set(0, -24);
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.page.isZoomIn = true;
        this.isClick = true;
    }
}
class Graduate extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Graduate";
        this.x = -0.294;
        this.y = -0.118;
        this.url = "image/building/youth/graduate.png";
        this.zoomIn = 1.3;
        this.zoomInPos = [35, -100];
        this.originPos = [-13, 101];
        this.uiScale = 1;
        this.texturesUrl = "image/building/youth/graduate/sprites.json";
    }
    onClickResize() { this.graduate = this.drawGraduate(); }
    onClickUpdate() { }
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
        this.container.removeChild(this.graduate);
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
                self.graduate = self.drawGraduate();
            });
        }
        catch {
            this.textures = this.manager.app.loader.resources[this.texturesUrl].spritesheet.textures;
            this.graduate = this.drawGraduate();
        }
    }
    drawGraduate() {
        const self = this;
        const ox = this.originPos[0];
        const oy = this.originPos[1];
        const scale = this.uiScale;
        const textures = this.textures;
        const gradLength = 7;
        let c = new PIXI.Container();
        c.position.set(ox, oy);
        drawGrad();
        this.container.addChild(c);
        return c;
        function drawGrad() {
            const pos = [
                [-503, 0],
                [-251, -115],
                [0, 0],
                [251, -115],
                [503, 0],
                [-251, 115],
                [251, 115]
            ]
            const pic = [
                "grad_Brwon.png",
                "grad_Brwon.png",
                "grad_kelly.png",
                "grad_kelly.png",
                "grad_Vivian.png",
                "grad_Vivian.png",
                "grad_Vivian.png",
            ]
            let layer = drawLayer();
            layer.position.set(0, 32);
            for (let i = 0; i < gradLength; i++) {
                let e = createSprite(textures[`grad_0${i + 1}.png`], 0.5, scale);
                e.position.set(pos[i][0], pos[i][1]);
                e.overEvent = glowOverEvent;
                e.clickEvent = () => {
                    c.removeChild(layer);
                    drawGradDetail(pic[i]);
                }
                addPointerEvent(e);
                layer.addChild(e);
            }

        }
        function drawGradDetail(pic) {
            let layer = drawLayer();
            let bg = createSprite(textures["board.png"], 0.5, scale);
            let detail = createSprite(textures[pic], 0.5, scale);
            let btn = createSprite("image/cancel.png", 0.5, scale * 0.6);
            btn.position.set(530, -145);
            detail.position.set(0, 30);
            btn.overEvent = brightnessOverEvent;
            btn.clickEvent = () => {
                c.removeChild(layer);
                drawGrad();
            }
            addPointerEvent(btn);
            layer.addChild(bg, detail, btn)
        }
        function drawLayer() {
            let layer = new PIXI.Container();
            c.addChild(layer);
            return layer;
        }
    }
}
class Mirror extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.x = 0.108;
        this.y = -0.026;
        this.url = "image/building/youth/mirror.png";
        this.zoomIn = 1.5;
        this.zoomInPos = [0, 0];
        this.originPos = [-2, -37];
        this.uiScale = 0.5;
        this.texturesUrl = "image/building/youth/mirror/sprites.json";
    }
    onClickResize() { this.mirror = this.drawMirror(); }
    onClickUpdate() { }
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
    drawMirror() {
        const self = this;
        const ox = this.originPos[0];
        const oy = this.originPos[1];
        const scale = this.uiScale;
        const textures = this.textures;
        const data = ThreeNotOneQuestionData;
        const options = ["A", "B", "C", "D"];
        let count = undefined;
        let correct = [];
        let frame = createSprite(textures["frame.png"], 0.5, scale);
        let c = new PIXI.Container();
        let mask = createSprite(textures["mask.png"], 0.5, scale);
        c.addChild(mask, frame);
        c.mask = mask;
        frame.position.set(-ox, -oy);
        c.position.set(ox, oy);
        drawPage(1);
        this.container.addChild(c);
        return c;
        // draw page
        function drawPage(page) {
            let layer = page == 1 ? drawLayer("公共場所遇見導盲犬時：") : drawLayer("法律知識");
            let arrow_r = drawArrow("right", () => {
                c.removeChild(layer);
                drawPage(page + 1);
            });
            let arrow_l = drawArrow("left", () => {
                c.removeChild(layer);
                drawPage(page - 1);
            });
            let pagePic = createSprite(textures[`page_${page}.png`], [0.5, 0], scale);
            pagePic.position.set(0, -100);
            if (page == 1) { arrow_l.interactive = false; arrow_l.alpha = 0.5; }
            else if (page == 3) {
                arrow_r.interactive = false; arrow_r.alpha = 0.5;
                let dogHint = drawDogHint(`如果您也想要認識導盲犬時，\n也請您務必先徵求主人的同意！`);
                let startIcon = createSprite(textures["startIcon.png"], 0.5, scale);
                startIcon.position.set(196, 149);
                startIcon.overEvent = glowOverEvent;
                startIcon.clickEvent = () => {
                    c.removeChild(layer);
                    count = 0;
                    drawQuestion();
                }
                addPointerEvent(startIcon);
                layer.addChild(dogHint, startIcon);
            }
            layer.addChild(arrow_r, arrow_l, pagePic);
        }
        function drawQuestion() {
            const pos = [
                [-234, 9],
                [-234, 68],
                [-13, 9],
                [-13, 68]
            ]
            let layer = drawLayer("問答遊戲");
            let dogHint = drawDogHint(`如果您也想要認識導盲犬時，\n也請您務必先徵求主人的同意！`);
            let q = createText("Q" + (count + 1) + ":" + data[count].Q, TextStyle.Mirror_DogHint_16, 0.5, scale);
            let select = new PIXI.Container();
            for (let i = 0; i < data[count].select.length; i++) {
                let e = new PIXI.Container();
                let s = createText(data[count].select[i], TextStyle.Mirror_title_20, [0, 0.5], scale);
                let o = createText(options[i], TextStyle.Mirror_DogHint_16, 0.5, scale);
                let bg = createSprite(textures["option.png"], 0.5, scale);
                s.position.set(50, 6);
                o.position.set(-0.5, 9);
                e.position.set(pos[i][0], pos[i][1]);
                e.addChild(bg, s, o);
                e.overEvent = glowOverEvent;
                e.clickEvent = () => {
                    let ox = undefined;
                    if (s.text === data[count].A) {
                        correct[count] = true;
                        ox = createSprite(textures["correct.png"], 0.5, scale * 0.9);
                        ox.position.set(-0.5, 6);
                        e.addChild(ox);
                        gsap.timeline({
                            onComplete: () => {
                                c.removeChild(layer);
                                drawAnswer(correct[count]);
                                console.log(correct[count]);
                            }
                        })
                            .from(ox.scale, { duration: 0.5, x: scale * 1.2, y: scale * 1.2 })
                            .from(ox, { duration: 0.3 })
                    }
                    else {
                        correct[count] = false;
                        ox = createSprite(textures["incorrect.png"], 0.5, scale * 0.9);
                        e.addChild(ox);
                        ox.position.set(-0.5, 6);
                        gsap.timeline({
                            onComplete: () => {
                                c.removeChild(layer);
                                drawAnswer(correct[count]);
                                console.log(correct[count]);
                            }
                        })
                            .from(ox.scale, { duration: 0.3, x: scale * 1.2, y: scale * 1.2 })
                            .from(ox, { duration: 0.3, x: "+=2", y: "+=2" }, 0)
                            .from(ox, { duration: 0.3, x: "-=4", y: "-=4" })
                            .from(ox, { duration: 0.3 })
                    }
                }
                addPointerEvent(e);
                select.addChild(e);
            }
            q.position.set(0, -50);
            layer.addChild(dogHint, q, select);
        }
        function drawAnswer(isCorrect) {
            let layer = drawLayer("問答遊戲");
            let dog = drawDog();
            let q = createText("Q" + (count + 1) + ":" + data[count].Q, TextStyle.Mirror_DogHint_16, 0.5, scale);
            let explain = createText(data[count].explain, TextStyle.Mirror_DogHint_16, 0.5, scale);
            let select = new PIXI.Container();
            let s = createText(data[count].A, TextStyle.Mirror_title_20, [0, 0.5], scale);
            let o = createText(options[data[count].select.indexOf(data[count].A)], TextStyle.Mirror_DogHint_16, 0.5, scale);
            let bg = createSprite(textures["option.png"], 0.5, scale);
            let btn = count == 3 ? drawButton("結束遊戲", ColorSlip.button_cancel, scale * 1.5) : drawButton("繼續遊戲", ColorSlip.button_submit, scale * 1.5);

            s.position.set(50, 6);
            o.position.set(-0.5, 9);
            select.position.set(-234, 9);
            select.addChild(bg, s, o);
            explain.position.set(91, 55);
            q.position.set(0, -50);
            btn.position.set(197, 160);
            btn.clickEvent = () => {
                count++;
                c.removeChild(layer);
                if (count >= 4) {
                    if (correct.every(e => e)) { drawGameClear(); }
                    else { drawGameOver(); }
                }
                else { drawQuestion(); }
            }
            addPointerEvent(btn);
            layer.addChild(dog, q, select, explain, btn);
        }
        function drawGameClear() {
            self.manager.userData.youth.mirror_correct = true;
            let layer = drawLayer("問答遊戲");
            let dog = drawDog();
            let restart = drawButton("重新遊戲", ColorSlip.button_submit, scale * 1.5);
            let exit = drawButton("打開手冊", ColorSlip.button_cancel, scale * 1.5);
            let text = createText(`恭喜你答對所有問題！\n獲得導盲犬徽章，可在探險手冊中顯示`, TextStyle.Mirror_title_20, 0.5, scale);
            let medal = drawMedal();
            restart.position.set(44, 122);
            exit.position.set(155, 122);
            text.position.set(0, 55);
            medal.position.set(0, -40);
            restart.clickEvent = () => {
                c.removeChild(layer);
                count = 0;
                correct = [];
                drawQuestion();
            }
            exit.clickEvent = () => {
                c.removeChild(layer);
                self.cancelEvent();
                self.manager.uiSystem.ui.book.clickEvent();
            }
            addPointerEvent(restart);
            addPointerEvent(exit);
            layer.addChild(dog, restart, exit, text, medal);
            function drawMedal() {
                const medalTextures = self.manager.app.loader.resources["image/book/sprites.json"].spritesheet.textures;
                let e = new PIXI.Container();
                let s = createSprite(medalTextures["medal.png"], 0.5, scale);
                let l = createSprite(medalTextures["light.png"], 0.5, scale);
                e.addChild(l, s);
                gsap.timeline({ repeat: -1 }).to(l, { duration: 5, rotation: Math.PI * 2, ease: "none" });
                return e;
            }
        }
        function drawGameOver() {
            let layer = drawLayer("問答遊戲");
            let dog = drawDog();
            let restart = drawButton("再試一次", ColorSlip.button_submit, scale * 1.5);
            let exit = drawButton("離開遊戲", ColorSlip.button_cancel, scale * 1.5);
            let text = createText(`真可惜！你沒有答對所有問題\n再試一次吧！`, TextStyle.Mirror_title_20, 0.5, scale);
            restart.position.set(44, 122);
            exit.position.set(155, 122);
            text.position.set(0, 25);
            restart.clickEvent = () => {
                c.removeChild(layer);
                count = 0;
                correct = [];
                drawQuestion();
            }
            exit.clickEvent = () => {
                c.removeChild(layer);
                drawPage(3);
            }
            addPointerEvent(restart);
            addPointerEvent(exit);
            layer.addChild(dog, restart, exit, text);
        }
        // draw obj
        function drawLayer(titleText) {
            let layer = new PIXI.Container();
            let bigTitle = createText("三不一問知識", TextStyle.Mirror_title_36, 0.5, scale);
            let title = createText(titleText, TextStyle.Mirror_title_16, 0.5, scale);
            bigTitle.position.set(0, -155);
            title.position.set(0, -112);
            layer.addChild(bigTitle, title);
            c.addChild(layer);
            return layer;
        }
        function drawArrow(dir, clickEvent) {
            let arrow = new PIXI.Container();
            let a = createSprite(textures["arrow.png"], 0.5, scale);
            let text = createText("", TextStyle.Map_Green_13, 0.5, scale);
            switch (dir) {
                case "right":
                    text.text = "下一頁";
                    text.position.set(-47, 0);
                    arrow.position.set(190, -112);
                    break;
                case "left":
                    text.text = "上一頁";
                    text.position.set(47, 0);
                    a.scale.set(-scale, scale);
                    arrow.position.set(-190, -112);
                    break;
            }
            arrow.addChild(text, a);

            arrow.overEvent = brightnessOverEvent;
            arrow.clickEvent = clickEvent;
            addPointerEvent(arrow);
            return arrow;
        }
        function drawDogHint(str, hintPos = [32, -19], hintScale = scale) {
            let e = new PIXI.Container();
            let hint = createText(str, TextStyle.Mirror_DogHint, 0.5, hintScale);
            let bg = createSprite(textures["dialog.png"], 0.5, hintScale);
            let dog = createSprite(textures["dogHint.png"], 0.5, scale);
            hint.position.set(hintPos[0], hintPos[1]);
            bg.position.set(hintPos[0] + 2, hintPos[1] - 1);
            dog.position.set(-118, 20);
            e.position.set(-35, 164);
            e.addChild(bg, hint, dog);
            gsap.timeline()
                .from(dog, { duration: 0.75, y: 264 })
                .from(hint, { duration: 0.75, alpha: 0 }, 0.5)
                .from(bg, { duration: 0.75, alpha: 0 }, 0.5);
            return e;
        }
        function drawDog() {
            let dog = createSprite(textures["dog.png"], 0.5, scale);
            dog.position.set(-171, 182);
            gsap.from(dog, { duration: 0.75, y: 380 });
            return dog;
        }
    }
}
const loadList = {
    bus: [
        "video/youth_bus.mp4",
        "sound/youth_bus.wav",
        "image/video/youth/bus/stage_1_title.png",
        "image/video/youth/bus/stage_1_hint.png"
    ],
    instruction: [
        "video/youth_instruction.mp4",
        "sound/youth_instruction.wav",
        "image/video/youth/instruction/stage_1_title.png",
        "image/video/youth/instruction/stage_1_hint.png",
        "image/video/youth/instruction/stage_2_title.png",
        "image/video/youth/instruction/stage_2_hint.png",
        "image/video/youth/instruction/stage_3_title.png",
        "image/video/youth/instruction/stage_3_hint.png",
        "image/video/youth/instruction/stage_4_title.png",
        "image/video/youth/instruction/stage_4_hint.png",
        "image/video/youth/instruction/stage_5_title.png",
        "image/video/youth/instruction/stage_5_hint.png",
    ],
    instruction2: [
        "video/youth_instruction2.mp4",
        "sound/youth_instruction2.wav",
        "image/video/youth_instruction2/stage_1_title.png",
        "image/video/youth_instruction2/stage_1_hint.png",
        "image/video/youth_instruction2/stage_2_title.png",
        "image/video/youth_instruction2/stage_2_hint.png"
    ],
    traffic: [
        "video/youth_traffic.mp4",
        "video/youth_traffic_1.mp4",
        "video/youth_traffic_2.mp4",
        "sound/youth_traffic.wav",
        "sound/youth_traffic_1.mp3",
        "sound/youth_traffic_2.mp3",
        "image/video/youth/traffic/stage_1_title.png",
        "image/video/youth/traffic/stage_1_hint.png",
        "image/video/youth/traffic/stage_1_choose_1.png",
        "image/video/youth/traffic/stage_1_choose_2.png",
        "image/video/youth/traffic/stage_1_button_1.png",
        "image/video/youth/traffic/stage_1_button_2.png"
    ]
}