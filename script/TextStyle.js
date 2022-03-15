import * as PIXI from "pixi.js";
import { ColorSlip } from "./ColorSlip";

const TextStyle = {
    link: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fontSize: 30,
        fill: ColorSlip.darkOrange,
        stroke: ColorSlip.white,
        lineJoin: "round",
        strokeThickness: 5
    }),
    UI: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fontSize: 30,
        fill: ColorSlip.darkOrange,
    }),
    UI_small: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fontSize: 18,
        fill: ColorSlip.darkOrange,
    }),
    Dialog: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fontSize: 24,
        fill: ColorSlip.white,
        stroke: ColorSlip.lightGreen,
        lineJoin: "round",
        strokeThickness: 3,
        leading: 20,
        align: "center"
    }),
    Hint: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fontSize: 24,
        fill: ColorSlip.white,
        stroke: ColorSlip.lightGreen,
        lineJoin: "round",
        strokeThickness: 3,
        leading: 20,
        align: "left"
    }),
    Act: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fontSize: 54,
        fill: ColorSlip.darkOrange,
    }),
    Act_small: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fontSize: 36,
        fill: ColorSlip.darkOrange,
        align: "center",
        lineHeight: 60
    }),
}
export { TextStyle };