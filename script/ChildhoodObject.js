import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { PageObject, linkObject, Background, Player, Door, Video } from './GameObject.js';
import { ChildhoodAction_Dora, ChildhoodAction_Kelly } from './ChildhoodAction.js';
import { brightnessOverEvent, Dialog, glowOverEvent } from './UI.js';
import { addDragEvent, addPointerEvent, createSprite, createText, rectCollision } from './GameFunction.js';
import { TextStyle } from './TextStyle.js';
import { FilterSet } from './FilterSet.js';
import { ColorSlip } from './ColorSlip.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class ChildhoodObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "ChildhoodObject";
        this.soundUrl = "sound/childhood.mp3";
        this.userData = this.manager.userData.childhood;
        this.children = {
            "background": new Background(this.manager, this, "image/building/childhood/bg.png"),
            "door": new Door(this.manager, this, -0.404, -0.032, "image/building/childhood/door.png"),
            "video": new ChildhoodVideo(this.manager, this),
            "book": new Book(this.manager, this),
            "puzzle": new Puzzle(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class ChildhoodVideo extends Video {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = 0.372;
        this.y = -0.059;
        this.url = "image/building/childhood/video.png";
        this.videoList = [
            function () { return new ChildhoodAction_Kelly(this.manager, this) }.bind(this),
            function () { return new ChildhoodAction_Dora(this.manager, this) }.bind(this),
        ];
    }
}
class Book extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Book";
        this.x = -0.302;
        this.y = -0.103;
        this.url = "image/building/childhood/book.png";
        this.zoomIn = 2;
        this.spriteHeight = 120;
        this.uiScale = 1;
        this.originPos = [0, 0];
        this.texturesUrl = "image/building/childhood/book/sprites.json"
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
        const centerX = 300;
        let c = new PIXI.Container();
        let bg = drawBg();
        let page = undefined;
        let usingLayer = new PIXI.Container();
        c.zIndex = 100;
        c.addChild(usingLayer);
        drawStart();
        this.manager.app.stage.addChildAt(c, 1);
        c.onCancel = drawEnd;
        return c;
        //page
        function drawStart() {
            let s = createSprite("image/building/childhood/book/cover.png", 0.5, scale * 0.5);
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
                case 2:
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
            let s = createSprite("image/building/childhood/book/cover.png", 0.5, scale * 0.5);
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
class Puzzle extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.isComplete = this.page.userData.puzzle_complete;
        this.x = -0.083;
        this.y = -0.046;
        this.textureUrl = ["image/building/childhood/puzzle.png", "image/building/childhood/puzzle_complete.png"];
        this.url = this.isComplete ? this.textureUrl[1] : this.textureUrl[0];
        this.zoomIn = 1.4;
        this.zoomInPos = [0, 40];
        this.hintList = [
            "黃金獵犬個性聰明、有主見在教導指令時可以快速學會！",
            "拉不拉多的臉比較長且耳朵也比較長。",
            "黃金拉拉個性平易近人、服從性高，面對危險能更加的敏銳！",
            "拉不拉多的尾巴為短毛無裝飾毛。",
            "拉不拉多的個性溫和、活潑，較沒有攻擊性。",
            "拉不拉多多為短毛，毛色有黑色、米黃色、巧克力色。",
            "黃金獵犬的的毛髮較長，多為奶油或深咖啡色。",
            "黃金獵犬的臉比較短、且耳朵也比較短。",
            "黃金獵犬的的尾巴蓬鬆且有裝飾毛。",
        ]
        this.random = Math.floor(Math.random() * this.hintList.length);
        this.isAnswer = new Array(this.hintList.length).fill(false);
    }
    drawHintBar() {
        let c = new PIXI.Container();
        let bar = createSprite(this.textures["hintBar.png"]);
        c.exitButton = createSprite(this.textures["exit.png"], 0.5, 0.25);
        c.exitButton.position.set(425, -3);
        c.exitButton.overEvent = brightnessOverEvent;
        c.exitButton.clickEvent = this.cancelEvent.bind(this);
        addPointerEvent(c.exitButton);
        c.text = createText(this.hintList[this.random], TextStyle.Puzzle_Hint, [0, 0.5]);
        c.text.position.set(-450, -5);
        c.position.set(0, -330);
        c.addChild(bar, c.exitButton, c.text);
        this.container.addChild(c);
        return c;
    }
    drawPieceBar() {
        const t = this;
        const pos = [
            [-430, 7],
            [-325, 7],
            [-215, 7],
            [-109, 17],
            [0, 10],
            [108, 7],
            [215, 10],
            [325, 7],
            [435, 14],
        ]
        let c = new PIXI.Container();
        drawPieceBarBackground();
        drawPieces();
        this.container.addChild(c);
        return c;
        function drawPieceBarBackground() {
            let bar = createSprite(t.textures["pieceBar.png"]);
            let pieces = createSprite(t.textures["piece.png"]);
            let pieceText = createSprite(t.textures["piece.png"]);
            let mask = new PIXI.Graphics()
                .beginFill(0xff0000)
                .drawRect(0, 0, 976, 22)
                .endFill()
            mask.pivot.set(488, 11);
            mask.position.set(0, -40);
            pieceText.mask = mask;
            pieces.alpha = 0.5;
            c.position.set(0, 196);
            c.addChild(bar, pieces, pieceText, mask);
        }
        function drawPieces() {
            c.piece = [];
            for (let i = 0; i < t.hintList.length; i++) {
                c.piece.push(new PIXI.Sprite(t.textures[`piece_${i}.png`]));
                c.piece[i].index = i;
                c.piece[i].anchor.set(0.5);
                c.piece[i].scale.set(1);
                c.piece[i].position.set(pos[i][0], pos[i][1]);
                c.piece[i].hitArea = new PIXI.Rectangle(-50, -50, 100, 100);
                if (t.isAnswer[i] != true) {
                    addPieceEvent(c.piece[i]);
                    c.addChild(c.piece[i]);
                }
            }
        }
        function addPieceEvent(e) {
            e.overEvent = glowOverEvent;
            e.dragMoveEvent = (e, event) => {
                e.position.x = event.data.global.x - (t.w / 2);
                e.position.y = event.data.global.y - (t.h / 2);
            }
            e.dragDownEvent = (e, event) => {
                e.scale.set(t.zoomIn);
                c.removeChild(e);
                t.manager.app.stage.addChild(e);
                e.isDragging = true;
                e.position.x = event.data.global.x - (t.w / 2);
                e.position.y = event.data.global.y - (t.h / 2);
            };
            e.dragUpEvent = (e, event) => {
                let collision = rectCollision(e, t.answer.piece[e.index]);
                console.log(collision);
                if (collision) {
                    t.manager.app.stage.removeChild(e);
                    t.answer.piece[e.index].alpha = 1;
                    e.interactive = false;
                    t.isAnswer[e.index] = true;
                    t.hintBar.text.text = t.hintList[e.index];
                }
                else {
                    e.scale.set(t.scale);
                    t.manager.app.stage.removeChild(e);
                    c.addChild(e);
                    e.position.x = pos[e.index][0];
                    e.position.y = pos[e.index][1];
                    e.isDragging = false;
                }
            };
            addDragEvent(e);
        }
    }
    drawPieceAnswer() {
        const t = this;
        let c = new PIXI.Container();
        drawPieces();
        c.position.set(-19, -99);
        this.container.addChild(c);
        return c;
        function drawPieces() {
            const pos = [
                [-353, -57],
                [-1, -57],
                [372, -58],
                [74, 86],
                [19.5, 47],
                [41, -57],
                [-332, 41],
                [-313, -57],
                [-395, 87]
            ]
            c.piece = [];
            for (let i = 0; i < t.hintList.length; i++) {
                c.piece.push(new PIXI.Sprite(t.textures[`piece_${i}.png`]));
                c.piece[i].index = i;
                c.piece[i].anchor.set(0.5);
                c.piece[i].scale.set(1);
                c.piece[i].position.set(pos[i][0], pos[i][1]);
                c.piece[i].alpha = t.isAnswer[i] == true ? 1 : 0;
                c.addChild(c.piece[i]);
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
        this.textures = this.manager.resources["image/building/childhood/sprites.json"].spritesheet.textures;
        if (!this.isComplete) {
            gameStart.call(this);
        }
        else {
            this.drawCancel();
            this.cancel.visible = true;
        }
        function gameStart() {
            const t = this;
            const m = this.manager;
            let d = new Dialog(m, {
                context: `台灣的導盲犬為哪種狗狗呢？\n讓我們一起認識他們吧！`,
                submitText: "開始遊戲",
                cancelText: "結束遊戲",
                cancel: () => { d.remove(); t.cancelEvent(); },
                submit: () => {
                    d.remove();
                    let d2 = new Dialog(m, {
                        context: `請先觀察相框中狗狗的特徵\n結合下方拼圖拼到上方的相框中`,
                        submitText: "開始遊戲",
                        cancelText: "結束遊戲",
                        cancel: () => { d2.remove(); t.cancelEvent(); },
                        submit: () => {
                            d2.remove();
                            if (t.isComplete) {
                                t.sprite.texture = PIXI.Texture.from(t.textureUrl[0]);
                                t.isAnswer = new Array(t.hintList.length).fill(false);
                                t.isComplete = false;
                            }
                            t.hintBar = t.drawHintBar();
                            t.pieceBar = t.drawPieceBar();
                            t.answer = t.drawPieceAnswer();
                        }
                    })
                }
            })
        }
    }
    onClickResize() {
        this.hintBar = this.drawHintBar();
        this.pieceBar = this.drawPieceBar();
        this.answer = this.drawPieceAnswer();
    }
    onClickUpdate() {
        if (this.isAnswer.every(e => e) && !this.isComplete) {
            this.onComplete();
        }
    }
    onComplete() {
        this.isComplete = this.page.userData.puzzle_complete = true;
        this.url = this.textureUrl[1];
        let s = createSprite(this.url);
        s.alpha = 0;
        this.container.addChild(s);
        gsap.to(s, { duration: 1, alpha: 1 });
        let d = new Dialog(this.manager, {
            context: `恭喜你解完所有狗狗拼圖，\n現在讓我們繼續認識導盲犬吧！`,
            cancel: () => {
                d.remove();
                this.cancelEvent();
                this.container.removeChild(s);
                this.sprite.texture = PIXI.Texture.from(this.url);
            }
        })
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
        if (this.cancel) { this.cancel.visible = false; }
        this.container.removeChild(this.hintBar, this.pieceBar, this.answer);
    }
}

const loadList = {
    toys: [
        "image/video/childhood/Kelly/stage_1_title.png",
        "image/video/childhood/Kelly/stage_1_hint.png",
        "image/video/childhood/Kelly/stage_2_title.png",
        "image/video/childhood/Kelly/stage_2_hint.png",
        "image/video/childhood/Kelly/stage_2_img.jpg",
        "image/video/childhood/Kelly/stage_3_title.png",
        "image/video/childhood/Kelly/stage_3_hint.png"
    ]
}
