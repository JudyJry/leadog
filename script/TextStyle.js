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
        align: "left",
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
    Mirror_title: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fill: "white",
        fontSize: 60,
        lineJoin: "round",
        stroke: ColorSlip.mirror_brown,
        strokeThickness: 8,
        align: "center"
    }),
    Mirror_startText: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fontSize: 54,
        fill: ColorSlip.mirror_brown,
        align: "center",
        lineHeight: 112
    }),
    Mirror_DogHint: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fontSize: 28,
        fill: ColorSlip.mirror_brown,
        align: "center",
        lineHeight: 54
    }),
    Mirror_Hint: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fontSize: 32,
        fill: ColorSlip.mirror_lightBrown,
        align: "center",
        lineHeight: 60
    }),
    Mirror_dad: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fontSize: 48,
        fill: ColorSlip.white,
        stroke: ColorSlip.mirror_dad,
        strokeThickness: 5,
        align: "center",
        lineHeight: 60
    }),
    Mirror_mom: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fontSize: 48,
        fill: ColorSlip.white,
        stroke: ColorSlip.mirror_mom,
        strokeThickness: 5,
        align: "center",
        lineHeight: 60
    }),
    Mirror_title_12: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fill: "white",
        fontSize: 24,
        lineJoin: "round",
        stroke: ColorSlip.mirror_brown,
        strokeThickness: 5,
        align: "center"
    }),
    Mirror_title_16: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fill: "white",
        fontSize: 32,
        lineJoin: "round",
        stroke: ColorSlip.mirror_brown,
        strokeThickness: 5,
        align: "center"
    }),
    Mirror_title_20: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fill: "white",
        fontSize: 40,
        lineJoin: "round",
        stroke: ColorSlip.mirror_brown,
        strokeThickness: 5,
        align: "center"
    }),
    Mirror_title_36: new PIXI.TextStyle({
        fontFamily: "GenSenRounded-B",
        fill: "white",
        fontSize: 72,
        lineJoin: "round",
        stroke: ColorSlip.mirror_brown,
        strokeThickness: 8,
        align: "center"
    }),
}
export { TextStyle };