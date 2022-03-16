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
export { objType, Page, homePageData, uiData, videoData };