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
        fontFamily: "GenSenRounded-B",
        fill: "white",
        fontSize: 40,
        lineJoin: "round",
        stroke: ColorSlip.darkBlue,
        strokeThickness: 5,
        align: "center"
    }),
    Map_Blue_16: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-R",
        fill: "white",
        fontSize: 32,
        lineJoin: "round",
        stroke: ColorSlip.darkBlue,
        strokeThickness: 5,
        align: "center"
    }),
    Map_Blue_13: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-R",
        fill: "white",
        fontSize: 26,
        lineJoin: "round",
        stroke: ColorSlip.darkBlue,
        strokeThickness: 5,
        align: "center",
        leading: 9
    }),
    Map_Green_13: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-R",
        fill: "white",
        fontSize: 26,
        lineJoin: "round",
        stroke: ColorSlip.button_submit,
        strokeThickness: 5,
        align: "center",
        leading: 9
    }),
    Map_N: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fill: "white",
        fontSize: 40,
        lineJoin: "round",
        stroke: ColorSlip.map_n_d,
        strokeThickness: 5,
        align: "center"
    }),
    Map_N_13: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-R",
        fill: "white",
        fontSize: 26,
        lineJoin: "round",
        stroke: ColorSlip.map_n_d,
        strokeThickness: 5,
        align: "center",
        leading: 9
    }),
    Map_W: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fill: "white",
        fontSize: 40,
        lineJoin: "round",
        stroke: ColorSlip.map_w_d,
        strokeThickness: 5,
        align: "center"
    }),
    Map_W_13: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-R",
        fill: "white",
        fontSize: 26,
        lineJoin: "round",
        stroke: ColorSlip.map_w_d,
        strokeThickness: 5,
        align: "center",
        leading: 9
    }),
    Map_S: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fill: "white",
        fontSize: 40,
        lineJoin: "round",
        stroke: ColorSlip.map_s_d,
        strokeThickness: 5,
        align: "center"
    }),
    Map_S_13: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-R",
        fill: "white",
        fontSize: 26,
        lineJoin: "round",
        stroke: ColorSlip.map_s_d,
        strokeThickness: 5,
        align: "center",
        leading: 9
    }),
    Map_E: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fill: "white",
        fontSize: 40,
        lineJoin: "round",
        stroke: ColorSlip.map_e_d,
        strokeThickness: 5,
        align: "center"
    }),
    Map_E_13: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-R",
        fill: "white",
        fontSize: 26,
        lineJoin: "round",
        stroke: ColorSlip.map_e_d,
        strokeThickness: 5,
        align: "center",
        leading: 9
    }),
    Map_detail: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fill: "white",
        fontSize: 26,
        leading: 9
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