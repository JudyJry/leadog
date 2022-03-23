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
        fill: ColorSlip.darkOrange,
        leading: 20,
        align: "center"
    }),
    Dialog_Button: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fontSize: 24,
        fill: ColorSlip.white
    }),
    Puzzle_Hint: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fontSize: 24,
        fill: ColorSlip.darkOrange,
        leading: 20,
        align: "left"
    }),
    Map_Blue: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-R",
        fill: "white",
        fontSize: 20,
        lineJoin: "round",
        stroke: ColorSlip.darkBlue,
        strokeThickness: 3,
        align: "center"
    }),
    Map_Blue_16: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-R",
        fill: "white",
        fontSize: 16,
        lineJoin: "round",
        stroke: ColorSlip.darkBlue,
        strokeThickness: 3,
        align: "center"
    }),
    Map_Blue_13: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-R",
        fill: "white",
        fontSize: 13,
        lineJoin: "round",
        stroke: ColorSlip.darkBlue,
        strokeThickness: 3,
        align: "center",
        leading: 9
    }),
    Map_Green: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-R",
        fill: "white",
        fontSize: 20,
        lineJoin: "round",
        stroke: ColorSlip.button_submit,
        strokeThickness: 3,
        align: "center"
    }),
    Map_Green_16: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-R",
        fill: "white",
        fontSize: 16,
        lineJoin: "round",
        stroke: ColorSlip.button_submit,
        strokeThickness: 3,
        align: "center"
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