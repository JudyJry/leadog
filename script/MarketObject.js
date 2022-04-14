import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player } from './GameObject.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class MarketObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "MarketObject";
        this.soundUrl = "sound/market.mp3";
        this.children = {
            "background": new Background(this.manager, this, "image/building/born/bg.png"),
            "player": new Player(this.manager, this)
        };
    }
}
