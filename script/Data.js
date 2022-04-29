import { BornAction_Story1, BornAction_Story2 } from "./BornAction";
import { ChildhoodAction_Dora, ChildhoodAction_Kelly } from "./ChildhoodAction";
import YouthAction_Bus from "./YouthAction_bus";
import YouthAction_Instruction from "./YouthAction_Instruction";
import YouthAction_Instruction2 from "./YouthAction_Instruction2";
import YouthAction_Traffic from "./YouthAction_Traffic";
import { ElderlyAction_Hair, ElderlyAction_Story1, ElderlyAction_Story2, ElderlyAction_Story3 } from "./ElderlyAction";
import { KnowAction_Story1, KnowAction_Story2, KnowAction_Story3, KnowAction_Story4, KnowAction_Story5 } from "./KnowAction";

const objType = Object.freeze({
    "island": 0,
    "building": 1,
    "animation": 2,
    "other": 3
});

const Page = Object.freeze({
    "home": "首頁",
    "born": "出生",
    "childhood": "幼年",
    "youth": "壯年",
    "elderly": "老年",
    "know": "知識教育館",
    "company": "LEADOG公司",
    "market": "相關活動"
});

const uiData = [
    { name: Page.home, url: "image/home.svg" },
    { name: Page.market, url: "image/market.svg" },
    { name: Page.know, url: "image/know.svg" },
    { name: Page.company, url: "image/company.svg" },
    { name: Page.born, url: "image/born.svg" },
    { name: Page.childhood, url: "image/childhood.svg" },
    { name: Page.youth, url: "image/youth.svg" },
    { name: Page.elderly, url: "image/elderly.svg" },
];

const homePageData = [
    { type: objType.building, name: "出生", url: "born.png", x: 151, y: 48 },
    { type: objType.building, name: "幼年", url: "childhood.png", x: 117, y: -19 },
    { type: objType.building, name: "壯年", url: "youth.png", x: 54, y: 52 },
    { type: objType.building, name: "老年", url: "elderly.png", x: -22, y: 39 },
    { type: objType.building, name: "知識教育館", url: "know.png", x: 25, y: -80 },
    { type: objType.building, name: "LEADOG公司", url: "company.png", x: -78, y: -87 },
    { type: objType.building, name: "相關活動", url: "market.png", x: 151, y: -112 },
];

const videoData = {
    born: [
        {
            name: "born_story1",
            url: "video/born_story1.mp4",
            soundUrl: "sound/born_story.mp3",
            startText: "來聽聽剛出生的寶寶都在做什麼吧！",
            endText: `謝謝你聆聽剛出生的狗狗的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 46,
            call: (manager, obj, scale) => { return new BornAction_Story1(manager, obj, scale); }
        },
        {
            name: "born_story2",
            url: "video/born_story2.mp4",
            soundUrl: "sound/born_story.mp3",
            startText: "來聽聽剛出生的寶寶都在做什麼吧！",
            endText: `謝謝你聆聽剛出生的狗狗的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 30,
            call: (manager, obj, scale) => { return new BornAction_Story2(manager, obj, scale); }
        }
    ],
    childhood: [
        {
            name: "childhood_kelly",
            url: "video/childhood_kelly.mp4",
            soundUrl: "sound/childhood_kelly.wav",
            startText: "一起幫助狗狗在寄養家庭中習慣人類社會生活吧！",
            endText: `謝謝你幫助狗狗完成在寄養家庭階段的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 57,
            call: (manager, obj, scale) => { return new ChildhoodAction_Kelly(manager, obj, scale); }
        },
        {
            name: "childhood_dora",
            url: "video/childhood_dora.mp4",
            soundUrl: "sound/childhood_dora.wav",
            startText: "一起幫助狗狗在生活中習慣與人相處吧！",
            endText: `謝謝你幫助狗狗完成在寄養家庭階段的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 94,
            call: (manager, obj, scale) => { return new ChildhoodAction_Dora(manager, obj, scale); }
        },
    ],
    youth: [
        {
            name: "youth_bus",
            url: "video/youth_bus.mp4",
            soundUrl: "sound/youth_bus.wav",
            startText: "一起幫助狗狗與訓練師習慣人類生活步調吧！",
            endText: `謝謝你幫助狗狗完成與訓練師生活的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 45,
            call: (manager, obj, scale) => { return new YouthAction_Bus(manager, obj, scale); }
        },
        {
            name: "youth_instruction",
            url: "video/youth_instruction.mp4",
            soundUrl: "sound/youth_instruction.wav",
            startText: "一起幫助狗狗認識指令並成功做到吧！",
            endText: `謝謝你幫助狗狗完成指令訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 65,
            call: (manager, obj, scale) => { return new YouthAction_Instruction(manager, obj, scale); }
        },
        {
            name: "youth_instruction2",
            url: "video/youth_instruction2.mp4",
            soundUrl: "sound/youth_instruction2.wav",
            startText: "一起幫助狗狗與訓練師習慣人類生活步調吧！",
            endText: `謝謝你幫助狗狗完成與訓練師生活的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 29,
            call: (manager, obj, scale) => { return new YouthAction_Instruction2(manager, obj, scale); }
        },
        {
            name: "youth_traffic",
            url: "video/youth_traffic.mp4",
            soundUrl: "sound/youth_traffic.wav",
            startText: "一起幫助狗狗帶領訓練師平安度過挑戰吧！",
            endText: `謝謝你幫助狗狗完成與訓練師生活的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 17,
            call: (manager, obj, scale) => { return new YouthAction_Traffic(manager, obj, scale); }
        },
    ],
    elderly: [
        {
            name: "elderly_story1",
            url: "video/elderly_story1.mp4",
            soundUrl: "sound/elderly_story1.wav",
            startText: "一起看看狗狗與收養家庭的故事吧！",
            endText: `謝謝你聆聽狗狗與收養家庭的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 178,
            call: (manager, obj, scale) => { return new ElderlyAction_Story1(manager, obj, scale); }
        },
        {
            name: "elderly_story2",
            url: "video/elderly_story2.mp4",
            soundUrl: "sound/elderly_story2.mp3",
            startText: "一起看看狗狗與收養家庭的故事吧！",
            endText: `謝謝你聆聽狗狗與收養家庭的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 137,
            call: (manager, obj, scale) => { return new ElderlyAction_Story2(manager, obj, scale); }
        },
        {
            name: "elderly_story3",
            url: "video/elderly_story3.mp4",
            soundUrl: "sound/elderly_story3.wav",
            startText: "一起看看狗狗與收養家庭的故事吧！",
            endText: `謝謝你聆聽狗狗與收養家庭的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 116,
            call: (manager, obj, scale) => { return new ElderlyAction_Story3(manager, obj, scale); }
        },
        {
            name: "elderly_hair",
            url: "video/elderly_hair.mp4",
            soundUrl: "sound/elderly_hair.mp3",
            startText: "一起幫助狗狗整理毛髮吧！",
            endText: `謝謝你幫助狗狗整理毛髮\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 43,
            call: (manager, obj, scale) => { return new ElderlyAction_Hair(manager, obj, scale); }
        }
    ],
    know: [
        {
            name: "know_story1",
            url: "video/know_story1.mp4",
            soundUrl: "sound/know_story1.mp3",
            startText: "一起來聽聽輔導員的自我介紹吧！",
            endText: `謝謝你聆聽輔導員的自我介紹\n以後可以在「探險手冊」重新觀看喔！`,
            endTime: 91,
            call: (manager, obj, scale) => { return new KnowAction_Story1(manager, obj, scale); }
        },
        {
            name: "know_story2",
            url: "video/know_story2.mp4",
            soundUrl: "sound/know_story2.mp3",
            startText: "一起來聽聽寄養家庭的申請流程吧！",
            endText: `謝謝你聆聽寄養家庭的申請流程\n以後可以在「探險手冊」重新觀看喔！`,
            endTime: 89,
            call: (manager, obj, scale) => { return new KnowAction_Story2(manager, obj, scale); }
        },
        {
            name: "know_story3",
            url: "video/know_story3.mp4",
            soundUrl: "sound/know_story3.mp3",
            startText: "一起來聽聽想成為寄養家庭的原因吧！",
            endText: `謝謝你聆聽想成為寄養家庭的原因\n以後可以在「探險手冊」重新觀看喔！`,
            endTime: 69,
            call: (manager, obj, scale) => { return new KnowAction_Story3(manager, obj, scale); }
        },
        {
            name: "know_story4",
            url: "video/know_story4.mp4",
            soundUrl: "sound/know_story4.mp3",
            startText: "一起來聽聽寄養家庭的改變吧！",
            endText: `謝謝你聆聽寄養家庭的改變\n以後可以在「探險手冊」重新觀看喔！`,
            endTime: 99,
            call: (manager, obj, scale) => { return new KnowAction_Story4(manager, obj, scale); }
        },
        {
            name: "know_story5",
            url: "video/know_story5.mp4",
            soundUrl: "sound/know_story5.mp3",
            startText: "一起來聽聽來自輔導員的呼籲吧！",
            endText: `謝謝你聆聽來自輔導員的呼籲\n以後可以在「探險手冊」重新觀看喔！`,
            endTime: 57,
            call: (manager, obj, scale) => { return new KnowAction_Story5(manager, obj, scale); }
        },
    ]
}

const mapData = {
    born_num: {
        n: 26, w: 18, s: 22
    },
    born_name: {
        n: [
            {
                name: "Celine",
                pos: [24, -18],
                scale: 0.8
            },
            {
                name: "IQ",
                pos: [-40, -7],
                scale: 0.7
            },
            {
                name: "Gavin",
                pos: [87, 0],
                scale: 0.75
            },
            {
                name: "Dora",
                pos: [-70, 45],
                scale: 0.7
            },
            {
                name: "Danny",
                pos: [19, 43],
                scale: 0.5
            },
            {
                name: "Alfa",
                pos: [-34, 79],
                scale: 0.5
            },
            {
                name: "Joe",
                pos: [6, 114],
                scale: 0.5
            },
            {
                name: "Uwu",
                pos: [61, 114],
                scale: 0.6
            },
        ],
        w: [
            {
                name: "Coco",
                pos: [0, 55],
                scale: 0.8
            },
            {
                name: "King",
                pos: [20, -40],
                scale: 0.5
            },
            {
                name: "Kia",
                pos: [67, 57],
                scale: 0.75
            },
            {
                name: "Judy",
                pos: [-80, 50],
                scale: 0.7
            },
            {
                name: "Jasmin",
                pos: [-39, 106],
                scale: 0.7
            },
            {
                name: "DJ",
                pos: [30, 110],
                scale: 0.6
            },
            {
                name: "Ethan",
                pos: [-101, 125],
                scale: 0.55
            },
            {
                name: "Jazz",
                pos: [-32, 165],
                scale: 0.6
            },
        ],
        s: [
            {
                name: "Ryan",
                pos: [18, -23],
                scale: 0.8
            },
            {
                name: "Ueqen",
                pos: [-68, -22],
                scale: 0.6
            },
            {
                name: "Celie",
                pos: [-35, 17],
                scale: 0.75
            },
            {
                name: "Doag",
                pos: [16, 47],
                scale: 0.65
            },
            {
                name: "Ale",
                pos: [-17, 76],
                scale: 0.5
            },
            {
                name: "George",
                pos: [25, 115],
                scale: 0.7
            },
            {
                name: "Kally",
                pos: [25, 178],
                scale: 0.5
            },
        ],
    },
    born_detail: [
        {
            name: "Ben",
            birth: "10/14",
            weight: "400g",
            gender: "男生",
            breed: "黃金拉拉",
            pic: "born_pic_0.png",
            pos: [-159, 53],
            align: "left"
        },
        {
            name: "Judy",
            birth: "01/27",
            weight: "320g",
            gender: "男生",
            breed: "拉不拉多",
            pic: "born_pic_1.png",
            pos: [-159, 53],
            align: "left"
        },
        {
            name: "Ryan",
            birth: "05/20",
            weight: "420g",
            gender: "女生",
            breed: "黃金拉拉",
            pic: "born_pic_2.png",
            pos: [-159, 53],
            align: "left"
        }
    ],
    elderly_num: {
        n: 26, w: 18, s: 22, e: 14
    },
    elderly_name: {
        n: [
            {
                name: "Celine",
                pos: [24, -18],
                scale: 0.8
            },
            {
                name: "IQ",
                pos: [-40, -7],
                scale: 0.7
            },
            {
                name: "Gavin",
                pos: [87, 0],
                scale: 0.75
            },
            {
                name: "Dora",
                pos: [-70, 45],
                scale: 0.7
            },
            {
                name: "Danny",
                pos: [19, 43],
                scale: 0.5
            },
            {
                name: "Alfa",
                pos: [-34, 79],
                scale: 0.5
            },
            {
                name: "Joe",
                pos: [6, 114],
                scale: 0.5
            },
            {
                name: "Uwu",
                pos: [61, 114],
                scale: 0.6
            },
        ],
        w: [
            {
                name: "Coco",
                pos: [0, 55],
                scale: 0.8
            },
            {
                name: "King",
                pos: [20, -40],
                scale: 0.5
            },
            {
                name: "Kia",
                pos: [67, 57],
                scale: 0.75
            },
            {
                name: "Judy",
                pos: [-80, 50],
                scale: 0.7
            },
            {
                name: "Jasmin",
                pos: [-39, 106],
                scale: 0.7
            },
            {
                name: "DJ",
                pos: [30, 110],
                scale: 0.6
            },
            {
                name: "Ethan",
                pos: [-101, 125],
                scale: 0.55
            },
            {
                name: "Jazz",
                pos: [-32, 165],
                scale: 0.6
            },
        ],
        s: [
            {
                name: "Ryan",
                pos: [18, -23],
                scale: 0.8
            },
            {
                name: "Ueqen",
                pos: [-68, -22],
                scale: 0.6
            },
            {
                name: "Celie",
                pos: [-35, 17],
                scale: 0.75
            },
            {
                name: "Doag",
                pos: [16, 47],
                scale: 0.65
            },
            {
                name: "Ale",
                pos: [-17, 76],
                scale: 0.5
            },
            {
                name: "George",
                pos: [25, 115],
                scale: 0.7
            },
            {
                name: "Kally",
                pos: [25, 178],
                scale: 0.5
            },
        ],
        e: [
            {
                name: "Lady",
                pos: [57, -19],
                scale: 0.8
            },
            {
                name: "Ginger",
                pos: [86, -69],
                scale: 0.55
            },
            {
                name: "Deny",
                pos: [48, 35],
                scale: 0.5
            },
            {
                name: "Jazz",
                pos: [13, 43],
                scale: 0.45
            },
            {
                name: "Green",
                pos: [-16, 82],
                scale: 0.7
            },
            {
                name: "News",
                pos: [17, 110],
                scale: 0.6
            },
            {
                name: "Jet",
                pos: [-7, 132],
                scale: 0.5
            },
        ]
    },
    elderly_detail: [
        {
            name: "Umo",
            birth: "12/12",
            gender: "女生",
            breed: "黃金獵犬",
            nature: "親狗也親人",
            pic: "elderly_pic_0.png",
            pos: [-159, 53],
            align: "left"
        },
        {
            name: "Coco",
            birth: "01/27",
            gender: "男生",
            breed: "黃金獵犬",
            nature: "超喜歡散步",
            pic: "elderly_pic_1.png",
            pos: [159, 53],
            align: "right"
        },
        {
            name: "Kally",
            birth: "02/14",
            gender: "女生",
            breed: "拉不拉多",
            nature: "喜歡摸摸",
            pic: "elderly_pic_2.png",
            pos: [46, 31],
            align: "left"
        },
        {
            name: "Green",
            birth: "04/30",
            gender: "女生",
            breed: "黃金獵犬",
            nature: "喜歡分享",
            pic: "elderly_pic_3.png",
            pos: [159, 53],
            align: "right"
        }
    ]
}

const ThreeNotOneQuestionData = [
    {
        Q: `今天在路上看到導盲犬，不知道他是不是肚子餓了，我手上有一份\n狗狗食用的肉乾，請問我該怎麼做呢？`,
        A: "詢問主人",
        explain: `遇到導盲犬可以主動詢問是否需\n要幫忙，但絕對不要以任何食物\n吸引或餵食導盲犬，以免打擾他\n們工作，無法引導主人唷！`,
        select: [
            "直接給牠吃",
            "詢問主人",
            "偷偷丟在牠行徑的路上",
            "假裝沒看到",
        ],
    },
    {
        Q: `請問我該怎麼做呢今天在路上看到導盲犬，他的毛看起來好好摸\n，一般寵物我摸牠們都很開心，請問我該怎麼做呢？`,
        A: "許可的情況摸",
        explain: `一般遇到導盲犬基本都是在訓練中或\n是工作中，因此絕對不要以任意干擾\n或撫摸導盲犬。台灣導盲犬協會有定\n期舉辦教育宣導活動，歡迎大家來認\n識、接觸導盲犬！`,
        select: [
            "直接摸摸按摩",
            "做動作吸引他",
            "假裝沒看到",
            "許可的情況摸",
        ],
    },
    {
        Q: `今天導盲犬想要進去餐廳用餐，而我正好是這家餐廳的店員，請\n問我要如何接待牠呢？`,
        A: "一般接待他",
        explain: `根據身心障礙者權益保障法第60條，\n導盲犬著工作服時，可以自由出入公\n共場所和大眾運輸工具，不能收取額\n外費用，也不得拒絕或附加其他出入\n條件。`,
        select: [
            "請他離開",
            "不理會他",
            "請示店長",
            "一般接待他",
        ],
    },
    {
        Q: `前方看到一位視障者牽著導盲犬在路口徘徊，好像遇到了困難，\n請問我能夠怎麼幫助他呢？`,
        A: "主動詢問",
        explain: `當看到視障朋友猶豫徘徊不前時，\n鼓勵大家可以主動詢問是否需要協\n助，幫助有需要的人唷！`,
        select: [
            "主動詢問",
            "不理會他",
            "直接拉他過馬路",
            "跟導盲犬暗示",
        ],
    },
]

const bookData = {
    know: {
        a: [
            {
                name: "Judy",
                love: "152",
            },
            {
                name: "Coco",
                love: "520",
            },
            {
                name: "Lady",
                love: "100",
            },
            {
                name: "Ella",
                love: "666",
            },
            {
                name: "Uwu",
                love: "880",
            },
            {
                name: "Woff",
                love: "134",
            }
        ],
        b: [
            {
                name: "Pola",
                love: "945",
            },
            {
                name: "Dodo",
                love: "522",
            },
            {
                name: "Cady",
                love: "130",
            },
            {
                name: "Hebe",
                love: "676",
            },
            {
                name: "Owo",
                love: "980",
            },
            {
                name: "Wendy",
                love: "341",
            }
        ],
        c: [
            {
                name: "Elsa",
                love: "561",
            },
            {
                name: "Celine",
                love: "945",
            },
            {
                name: "Unao",
                love: "743",
            },
            {
                name: "Gloria",
                love: "486",
            },
            {
                name: "Ama",
                love: "007",
            },
            {
                name: "Edward",
                love: "845",
            }
        ]
    }
}

const userData = {
    born: {
        video: {
            story1: false,
            story2: false
        },
        mirror_collect: new Array(8).fill(false)
    },
    childhood: {
        video: {
            kelly: false,
            dora: false
        },
        puzzle_complete: false
    },
    youth: {
        video: {
            bus: false,
            instruction: false,
            instruction2: false,
            traffic: false,
        },
        mirror_correct: false
    },
    elderly: {
        video: {
            story1: false,
            story2: false,
            story3: false,
            hair: false
        },
    },
    know: {
        video: {
            story1: false,
            story2: false,
            story3: false,
            story4: false,
            story5: false,
        },
        lucky: {
            big: false,
            middle: false,
            middle2: false,
            small: false,
        }
    }
}

export { objType, Page, homePageData, uiData, videoData, mapData, ThreeNotOneQuestionData, bookData, userData };