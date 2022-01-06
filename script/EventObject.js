import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background } from './GameObject.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class EventObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "EventObject";
        this.children = {
            "background": new Background(manager, "image/building/event/event_bg.png"),
            "signup": new Signup(manager)
        };
    }
}

class Signup extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "報名";
        this.x = -0.093;
        this.y = 0.161;
        this.url = "image/building/event/signup.png";
        this.surl = "image/building/event/signup_shadow.png";
    }
    //todo() { }
}
