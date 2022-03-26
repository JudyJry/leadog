import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { TextStyle } from './TextStyle.js';
import { addPointerEvent, createSprite, createText } from './GameFunction.js';
import { uiData } from './Data.js';
import { ColorSlip } from './ColorSlip.js';

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
        this.logo = PIXI.Sprite.from("image/logo.svg");
        this.logo.scale.set(0.8);
        this.logo.position.set((-0.5 * this.w) + 30, (-0.5 * this.h) + 10);
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
            cancelUrl: "image/dialog_exit.png",
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
        this.draw = function () {
            this.icon = this.drawIcon('image/book.svg');
            this.container.position.set(0, 0 * this.UIsystem.uiSpacing);
            this.container.addChild(this.icon);
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
                }
                else if (this.manager.isMute == true) {
                    e.texture = PIXI.Texture.from("image/soundon.svg");
                    this.manager.isMute = false;
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
            s.clickEvent = function () { this.manager.toOtherPage(uiData[i].name); }.bind(this);
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
            this.icon = this.drawIcon('image/cancel.svg');
            this.icon.scale.set(-this.scale, this.scale);
            this.container.position.set(15, 5 * this.UIsystem.uiSpacing);
            this.container.addChild(this.icon);
            this.icon.visible = false;
        }
    }
}

const defaultDialogOptions = {
    context: "",
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
        this.dialog = createSprite("image/dialog.png");
        this.context = createText(this.options.context, this.textStyle);
        this.submitColor = this.options.submitColor;
        this.cancelColor = this.options.cancelColor;
        this.submit = this.options.submit ? this.drawSubmit() : false;
        this.cancel = this.options.cancel ? this.drawCancel() : false;
        this.buttonHeight = 60;
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
        let c = drawButton(this.options.submitText, this.submitColor);
        c.overEvent = this.overEvent;
        c.clickEvent = this.options.submit;
        addPointerEvent(c);
        return c;
    }
    drawCancel() {
        let c = drawButton(this.options.cancelText, this.cancelColor);
        c.overEvent = this.overEvent;
        c.clickEvent = this.options.cancel;
        addPointerEvent(c);
        return c;
    }
    draw() {
        this.context.position.set(0, -50);
        this.container.addChild(this.dialog, this.context);
        if (this.submit && this.cancel) {
            this.submit.position.set(-this.buttonSpace - 5, this.buttonHeight);
            this.cancel.position.set(this.buttonSpace - 5, this.buttonHeight);
            this.container.addChild(this.submit, this.cancel);
        }
        else if (this.submit) {
            this.submit.position.set(-5, this.buttonHeight);
            this.container.addChild(this.submit);
        }
        else if (this.cancel) {
            this.cancel.position.set(-5, this.buttonHeight);
            this.container.addChild(this.cancel);
        }
        //this.container.alpha = 0;
        //this.container.scale.set(0);
        this.manager.app.stage.addChildAt(this.container, 1);
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
export function drawButton(text, color) {
    const texture = PIXI.Texture.from("image/dialog_button.png");
    const ts = TextStyle.Dialog_Button;
    let c = new PIXI.Container();
    let b = createSprite(texture);
    c.sprite = createSprite(texture);
    c.text = createText(text, ts);
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