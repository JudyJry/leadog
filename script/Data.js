const objType = Object.freeze({
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
    { type: objType.building, name: "出生", url: "image/homepage/born.png", x: 0.157, y: 0.116 },
    { type: objType.building, name: "幼年", url: "image/homepage/childhood.png", x: 0.123, y: -0.029 },
    { type: objType.building, name: "壯年", url: "image/homepage/youth.png", x: 0.057, y: 0.124 },
    { type: objType.building, name: "老年", url: "image/homepage/elderly.png", x: -0.023, y: 0.098 },
    { type: objType.building, name: "知識教育館", url: "image/homepage/know.png", x: 0.027, y: -0.147 },
    { type: objType.building, name: "LEADOG公司", url: "image/homepage/company.png", x: -0.082, y: -0.175 },
    { type: objType.building, name: "相關活動", url: "image/homepage/market.png", x: 0.158, y: -0.227 },
];

const videoData = {
    born: [
        {
            name: "this.born_story",
            url: "video/this.born_story1.mp4",
            soundUrl: "sound/this.born_story.mp3",
            startText: "來聽聽剛出生的寶寶都在做什麼吧！",
            endText: `謝謝你聆聽剛出生的狗狗的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 46
        },
        {
            name: "this.born_story",
            url: "video/this.born_story2.mp4",
            soundUrl: "sound/this.born_story.mp3",
            startText: "來聽聽剛出生的寶寶都在做什麼吧！",
            endText: `謝謝你聆聽剛出生的狗狗的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 30
        }
    ],
    childhood: [
        {
            name: "childhood_kelly",
            url: "video/childhood_kelly.mp4",
            soundUrl: "sound/childhood_kelly.wav",
            startText: "一起幫助狗狗在寄養家庭中習慣人類社會生活吧！",
            endText: `謝謝你幫助狗狗完成在寄養家庭階段的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 57
        },
        {
            name: "childhood_dora",
            url: "video/childhood_dora.mp4",
            soundUrl: "sound/childhood_dora.wav",
            startText: "一起幫助狗狗在生活中習慣與人相處吧！",
            endText: `謝謝你幫助狗狗完成在寄養家庭階段的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 94
        },
    ],
    youth: [
        {
            name: "youth_bus",
            url: "video/youth_bus.mp4",
            soundUrl: "sound/youth_bus.wav",
            startText: "一起幫助狗狗與訓練師習慣人類生活步調吧！",
            endText: `謝謝你幫助狗狗完成與訓練師生活的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 45
        },
        {
            name: "youth_instruction",
            url: "video/youth_instruction.mp4",
            soundUrl: "sound/youth_instruction.wav",
            startText: "一起幫助狗狗認識指令並成功做到吧！",
            endText: `謝謝你幫助狗狗完成指令訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 65
        },
        {
            name: "youth_instruction2",
            url: "video/youth_instruction2.mp4",
            soundUrl: "sound/youth_instruction2.wav",
            startText: "一起幫助狗狗與訓練師習慣人類生活步調吧！",
            endText: `謝謝你幫助狗狗完成與訓練師生活的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 29
        },
        {
            name: "youth_traffic",
            url: "video/youth_traffic.mp4",
            soundUrl: "sound/youth_traffic.wav",
            startText: "一起幫助狗狗帶領訓練師平安度過挑戰吧！",
            endText: `謝謝你幫助狗狗完成與訓練師生活的訓練\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 17
        },
    ],
    elderly: [
        {
            name: "elderly_story1",
            url: "video/elderly_story1.mp4",
            soundUrl: "sound/elderly_story1.wav",
            startText: "一起看看狗狗與收養家庭的故事吧！",
            endText: `謝謝你聆聽狗狗與收養家庭的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 178
        },
        {
            name: "elderly_story2",
            url: "video/elderly_story2.mp4",
            soundUrl: "sound/elderly_story2.mp3",
            startText: "一起看看狗狗與收養家庭的故事吧！",
            endText: `謝謝你聆聽狗狗與收養家庭的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 137
        },
        {
            name: "elderly_story3",
            url: "video/elderly_story3.mp4",
            soundUrl: "sound/elderly_story3.wav",
            startText: "一起看看狗狗與收養家庭的故事吧！",
            endText: `謝謝你聆聽狗狗與收養家庭的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 116
        },
        {
            name: "elderly_hair",
            url: "video/elderly_hair.mp4",
            soundUrl: "sound/elderly_hair.mp3",
            startText: "一起幫助狗狗整理毛髮吧！",
            endText: `謝謝你幫助狗狗整理毛髮\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`,
            endTime: 43
        }
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
            pic: "image/map/born_pic_0.png",
            pos: [-159, 53],
            align: "left"
        },
        {
            name: "Judy",
            birth: "01/27",
            weight: "320g",
            gender: "男生",
            breed: "拉不拉多",
            pic: "image/map/born_pic_1.png",
            pos: [-159, 53],
            align: "left"
        },
        {
            name: "Ryan",
            birth: "05/20",
            weight: "420g",
            gender: "女生",
            breed: "黃金拉拉",
            pic: "image/map/born_pic_2.png",
            pos: [-159, 53],
            align: "left"
        },
        {
            name: "Green",
            birth: "10/14",
            weight: "400g",
            gender: "男生",
            breed: "黃金獵犬",
            pic: "image/map/born_pic_3.png",
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
            pic: "image/map/elderly_pic_0.png",
            pos: [-159, 53],
            align: "left"
        },
        {
            name: "Coco",
            birth: "01/27",
            gender: "男生",
            breed: "黃金獵犬",
            nature: "超喜歡散步",
            pic: "image/map/elderly_pic_1.png",
            pos: [159, 53],
            align: "right"
        },
        {
            name: "Kally",
            birth: "02/14",
            gender: "女生",
            breed: "拉不拉多",
            nature: "喜歡摸摸",
            pic: "image/map/elderly_pic_2.png",
            pos: [46, 31],
            align: "left"
        },
        {
            name: "Green",
            birth: "04/30",
            gender: "女生",
            breed: "黃金獵犬",
            nature: "喜歡分享",
            pic: "image/map/elderly_pic_3.png",
            pos: [159, 53],
            align: "right"
        }
    ]
}
export { objType, Page, homePageData, uiData, videoData, mapData };