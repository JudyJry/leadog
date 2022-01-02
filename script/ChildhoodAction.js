import * as PIXI from 'pixi.js';
import gsap from "gsap";
import * as Action from "./Action";

export default class ChildhoodAction extends Action.ActionPage {
    constructor(manager) {
        super(manager);
        this.name = "ChildhoodAction";
        this.offset = 50;
        this.isPlayGame = false;
        this.children = {
            "video": new ChildhoodVideo(this.manager, this, "video/childhood_kelly.mp4"),
            "rope": new Action.ActionRope(this.manager, this),
            "ui": new UI_Start(this.manager, this),
            "logo": new LogoVideo(this.manager, this)
        }
    }
}
class LogoVideo extends Action.LogoVideo {
    constructor(manager, action) {
        super(manager, action);
    }
    onEnd() {
        this.action.children.ui.start();
        this.manager.removeChild(this.container);
        this.container.destroy({ children: true });
        delete this.action.children.logo;
    }
}
class ChildhoodVideo extends Action.ActionVideo {
    constructor(manager, action, url) {
        super(manager, action, url);
        this.name = "ChildhoodVideo";
        this.pauseTime = [10.5, 30, 50.29];
        this.isEnd = false;
        this.uiTime = [
            new UI_Stage1(this.manager, this.action),
            new UI_Stage2(this.manager, this.action),
            new UI_Stage3(this.manager, this.action),
        ]
        this.count = 0;
    }
    update() {
        if (this.currentTime > this.pauseTime[this.count]) {
            this.action.isPlayGame = true;
            this.onPlayGame();
            this.action.children.ui = this.uiTime[this.count];
            this.action.children.ui.setup();
            this.count++;
            //console.log(this.videoCrol.duration);
        }
        else if (this.currentTime > this.videoCrol.duration - 5 && !this.isEnd) {
            this.isEnd = true;
            this.onEnd();
        }
    }
    onEnd() {
        this.drawBg("white");
        gsap.to(this.bg, {
            duration: 3, alpha: 1, onComplete: function () {
                this.action.children.ui = new UI_End(this.manager, this.action);
                this.action.children.ui.setup();
                this.action.children.ui.start();
            }.bind(this)
        });
    }
}
class UI_Start extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "UI_Start";
        this.isNotStart = true;
        this.draw = function () {
            this.sprite.texture = PIXI.Texture.from("image/video/know.png");
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.setPosition(this.sprite, 0, 0.3);
            this.sprite.alpha = 0;

            let textTitle = new PIXI.Text("任務目標", this.UItextStyle);
            textTitle.anchor.set(0.5);
            this.setPosition(textTitle, 0, -0.3);
            let textDescribe = new PIXI.Text("一起幫助狗狗在寄養家庭中習慣人類社會生活吧！", this.UItextStyleSmall);
            textDescribe.anchor.set(0.5);
            this.setPosition(textDescribe, 0, 0);

            this.container.addChild(textTitle, textDescribe, this.sprite);
            this.container.alpha = 0;
        }
    }
    start() {
        let tl = gsap.timeline();
        tl.to(this.container, { duration: 1, alpha: 1 });
        tl.to(this.sprite, { duration: 1, alpha: 1, onComplete: this.setInteract.bind(this) }, "+=0.5");
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        if (!this.action.children.video.isStart) {
            this.container.removeChildren();
            this.draw();
        }
    }
    clickEvent() {
        if (this.isNotStart) {
            this.isNotStart = false;

            let text = new PIXI.Text("新的一天開始了", this.UItextStyle);
            text.anchor.set(0.5);
            text.alpha = 0;
            this.setPosition(text, 0, 0);

            let tl = gsap.timeline();
            tl.to(this.container, {
                duration: 1, alpha: 0, onComplete: function () {
                    this.manager.removeChild(this.container);
                    this.container.destroy({ children: true });
                    this.manager.addChild(text);
                }.bind(this)
            });
            tl.to(text, { duration: 0.5, alpha: 1 }, "+=1");
            tl.to(text, {
                duration: 0.5, alpha: 0, onComplete: function () {
                    this.manager.removeChild(text);
                    text.destroy();
                    this.action.children.video.isStart = true;
                    this.action.children.video.play();
                }.bind(this)
            }, "+=2");
        }
    }
}
class UI_Stage1 extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "UI_Stage1";
        this.scale = 1;
        this.draw = function () {
            this.countdown = new Action.ActionCountDown(manager, action, this);
            this.action.children.line = new Stage1_Line(manager, action);
            this.countdown.setup();
            this.action.children.line.setup();

            let title = PIXI.Sprite.from("image/video/childhood/Kelly/stage_1_title.png");
            let hint = PIXI.Sprite.from("image/video/childhood/Kelly/stage_1_hint.png");
            title.anchor.set(0.5);
            title.scale.set(this.scale);
            this.setPosition(title, 0.38, -0.42);
            hint.anchor.set(0.5);
            hint.scale.set(this.scale);
            this.setPosition(hint, -0.25, 0.05);

            this.container.addChild(title, hint);
            this.container.alpha = 0;
            gsap.to(this.container, { duration: 1, alpha: 1 });
        }
    }
    onClearGame() {
        let gj = new Action.ActionGoodjob(this.manager, this.action);
        gj.setup();
        gsap.to(this.container, {
            duration: 1, alpha: 0,
            onComplete: function () {
                this.manager.removeChild(this.container);
                this.manager.removeChild(this.action.children.line.container);
                this.manager.removeChild(this.action.children.rope.container);
                this.container.destroy({ children: true });
                this.action.children.line.container.destroy({ children: true });
                this.action.children.rope.container.destroy({ children: true });
                this.action.children.line.hintGsap.kill();
                delete this.action.children.line;
                delete this.action.children.rope;
                delete this.action.children.ui;
            }.bind(this)
        });
    }
    update() {
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.manager.removeChild(this.countdown.container);
                this.countdown.sprite.destroy();
                this.countdown.container.destroy();
                this.countdown = undefined;
            }
            else {
                this.countdown.update();
            }
        }
        catch {
            this.countdown = new Action.ActionCountDown(this.manager, this.action, this);
            this.countdown.setup();
        }
    }
}
class Stage1_Line extends Action.ActionLine {
    constructor(manager, action) {
        super(manager, action);
        this.draw = function () {
            this.sprite.moveTo(1109, 365).bezierCurveTo(1109, 365, 1196, 446, 1217, 552);
            //this.sprite.moveTo(0, 0).bezierCurveTo(0, 0, 87, 81, 108, 187);
            this.drawHint();
            this.container.addChild(this.sprite);
            this.container.position.set(-this.w / 2, -this.h / 2);
            this.manager.app.stage.sortChildren();
        }
    }
}
class UI_Stage2 extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "UI_Stage2";
        this.scale = 1;
        this.draw = function () {
            this.countdown = new Action.ActionCountDown(manager, action, this);
            this.button = new Stage2_Button(manager, action, this);
            this.countdown.setup();
            this.button.setup();

            let title = PIXI.Sprite.from("image/video/childhood/Kelly/stage_2_title.png");
            let hint = PIXI.Sprite.from("image/video/childhood/Kelly/stage_2_hint.png");
            title.anchor.set(0.5);
            title.scale.set(0.4);
            this.setPosition(title, 0.36, -0.42);
            hint.anchor.set(0.5);
            hint.scale.set(this.scale);
            this.setPosition(hint, -0.25, -0.1);

            this.container.addChild(title, hint);
            this.container.alpha = 0;
            gsap.to(this.container, { duration: 1, alpha: 1 });
        }
    }
    onClearGame() {
        let gj = new Action.ActionGoodjob(this.manager, this.action);
        gj.setup();
        gsap.to(this.container, {
            duration: 1, alpha: 0,
            onComplete: function () {
                this.manager.removeChild(this.container);
                this.container.destroy({ children: true });
                delete this.action.children.ui;
            }.bind(this)
        });
    }
    update() {
        this.button.update();
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.manager.removeChild(this.countdown.container);
                this.countdown.sprite.destroy();
                this.countdown.container.destroy();
                this.countdown = undefined;
            }
            else {
                this.countdown.update();
            }
        }
        catch {
            this.countdown = new Action.ActionCountDown(this.manager, this.action, this);
            this.countdown.setup();
        }
    }
}
class Stage2_Button extends Action.ActionUI {
    constructor(manager, action, stage) {
        super(manager, action);
        this.stage = stage;
        this.name = "Stage2_Button";
        this.count = 0;
        this.draw = function () {
            this.sprite.texture = PIXI.Texture.from("image/video/space.png");
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);

            this.bar = PIXI.Sprite.from("image/video/bar.png");
            this.bar.anchor.set(0.5);
            this.bar.scale.set(0.7);

            this.fullbar = PIXI.Sprite.from("image/video/bar_full.png");
            this.fullbar.anchor.set(0.5);
            this.fullbar.scale.set(0.7);
            this.mask = new PIXI.Graphics();
            this.fullbar.mask = this.mask;

            this.container.addChild(this.bar, this.fullbar, this.sprite);
            this.setPosition(this.sprite, 0, 0.32);
            this.setPosition(this.bar, 0, 0.18);
            this.setPosition(this.fullbar, 0, 0.18);
            this.setInteract();

            this.barGsap = gsap.timeline()
                .to([this.bar, this.fullbar], { duration: 0.1, x: -5 })
                .to([this.bar, this.fullbar], { duration: 0.1, x: 5 })
                .to([this.bar, this.fullbar], { duration: 0.1, x: 0 });
            this.barGsap.pause();
        }
    }
    clickEvent() {
        this.count += 20;
        this.barGsap.play(0.001);
    }
    maskUpdate() {
        let b = this.fullbar.getBounds();
        let progress = (b.width / 100) * this.count;
        this.mask.clear();
        this.mask.drawRect(b.x, b.y, progress, b.height);
    }
    onClearGame() {
        this.manager.removeChild(this.container);
        this.container.destroy({ children: true });
    }
    update() {
        if (this.action.isPlayGame) {
            if (this.count > 100) {
                this.action.isPlayGame = false;
                this.action.children.video.onClearGame();
                this.barGsap.kill();
                this.onClearGame();
                this.stage.onClearGame();
            } else if (this.count > 0) { this.count--; this.maskUpdate(); }
        }
        if (this.isPointerOver) {
            gsap.to(this.sprite, { duration: 0.5, pixi: { brightness: 0.9 } });
        }
        else {
            gsap.to(this.sprite, { duration: 0.5, pixi: { brightness: 1 } });
        }
    }
}
class UI_Stage3 extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "UI_Stage3";
        this.scale = 1;
        this.draw = function () {
            this.countdown = new Action.ActionCountDown(manager, action, this);
            this.button = new Stage3_Button(manager, action, this);
            this.countdown.setup();
            this.button.setup();

            let title = PIXI.Sprite.from("image/video/childhood/Kelly/stage_3_title.png");
            let hint = PIXI.Sprite.from("image/video/childhood/Kelly/stage_3_hint.png");
            title.anchor.set(0.5);
            title.scale.set(this.scale);
            this.setPosition(title, 0.38, -0.42);
            hint.anchor.set(0.5);
            hint.scale.set(this.scale);
            this.setPosition(hint, 0.27, -0.2);

            this.container.addChild(title, hint);
            this.container.alpha = 0;
            gsap.to(this.container, { duration: 1, alpha: 1 });
        }
    }
    onClearGame() {
        let gj = new Action.ActionGoodjob(this.manager, this.action);
        gj.setup();
        gsap.to(this.container, {
            duration: 1, alpha: 0,
            onComplete: function () {
                this.manager.removeChild(this.container);
                this.container.destroy({ children: true });
                delete this.action.children.ui;
            }.bind(this)
        });
    }
    update() {
        this.button.update();
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.manager.removeChild(this.countdown.container);
                this.countdown.sprite.destroy();
                this.countdown.container.destroy();
                this.countdown = undefined;
            }
            else {
                this.countdown.update();
            }
        }
        catch {
            this.countdown = new Action.ActionCountDown(this.manager, this.action, this);
            this.countdown.setup();
        }
    }
}
class Stage3_Button extends Action.ActionUI {
    constructor(manager, action, stage) {
        super(manager, action);
        this.stage = stage;
        this.name = "Stage3_Button";
        this.times = 0;
        this.draw = function () {
            this.spriteSheet = [
                PIXI.Texture.from("image/video/wait.png"),
                PIXI.Texture.from("image/video/ok.png")
            ];
            this.sprite.texture = this.spriteSheet[0];
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.container.addChild(this.sprite);
            this.setPosition(this.sprite, -0.3, 0.1);
        }
    }

    onClearGame() {
        this.manager.removeChild(this.container);
        this.container.destroy({ children: true });
    }
    clickEvent() {
        this.action.isPlayGame = false;
        this.onClearGame();
        this.action.children.video.onClearGame();
        this.stage.onClearGame();
    }
    update() {
        this.times += this.manager.deltaTime;
        if (Math.floor(this.times) >= 1.5) {
            this.sprite.texture = this.spriteSheet[1];
            this.setInteract();
            if (this.isPointerOver) {
                gsap.to(this.sprite, { duration: 0.5, pixi: { brightness: 0.9 } });
            }
            else {
                gsap.to(this.sprite, { duration: 0.5, pixi: { brightness: 1 } });
            }
        }
    }
}
class UI_End extends Action.ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.name = "UI_Start";
        this.isNotStart = true;
        this.draw = function () {
            let textTitle = new PIXI.Text("任務完成", this.UItextStyle);
            textTitle.anchor.set(0.5);
            this.setPosition(textTitle, 0, -0.3);
            let textDescribe = new PIXI.Text(
                `謝謝你幫助狗狗完成在寄養家庭階段的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
                this.UItextStyleSmall);
            textDescribe.anchor.set(0.5);
            this.setPosition(textDescribe, 0, 0);

            this.container.addChild(textTitle, textDescribe);
            this.container.alpha = 0;
        }
    }
    draw2() {
        this.sprite.texture = PIXI.Texture.from("image/TGDAlogo.png");
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(1.75);
        this.setPosition(this.sprite, 0, 0);

        this.container.removeChildren();
        let text1 = new PIXI.Text("感謝", this.UItextStyle);
        text1.anchor.set(0.5);
        this.setPosition(text1, -0.25, 0);
        let text2 = new PIXI.Text("協助拍攝", this.UItextStyle);
        text2.anchor.set(0.5);
        this.setPosition(text2, 0.25, 0);
        this.container.addChild(text1, text2, this.sprite);
        this.container.alpha = 0;
    }
    start() {
        let tl = gsap.timeline();
        tl.to(this.container, { duration: 1, alpha: 1 });
        tl.to(this.container, {
            duration: 1, alpha: 0, onComplete: function () {
                this.draw2();
            }.bind(this)
        }, "+=2");
        tl.to(this.container, { duration: 1, alpha: 1 });
        tl.to(this.container, {
            duration: 1, alpha: 0, onComplete: function () {
                this.manager.loadPage(this.manager.childhoodObj);
            }.bind(this)
        }, "+=2");
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        if (!this.action.children.video.isStart) {
            this.container.removeChildren();
            this.draw();
        }
    }
}