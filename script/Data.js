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
    elderly: [
        {
            name: "elderly_story1",
            url: "video/elderly_story1.mp4",
            soundUrl: "sound/elderly_story1.wav",
            startText: "一起看看狗狗與收養家庭的故事吧！",
            endText: `謝謝你聆聽狗狗與收養家庭的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`
        },
        {
            name: "elderly_story2",
            url: "video/elderly_story2.mp4",
            soundUrl: "sound/elderly_story2.mp3",
            startText: "一起看看狗狗與收養家庭的故事吧！",
            endText: `謝謝你聆聽狗狗與收養家庭的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`
        },
        {
            name: "elderly_story3",
            url: "video/elderly_story3.mp4",
            soundUrl: "sound/elderly_story3.wav",
            startText: "一起看看狗狗與收養家庭的故事吧！",
            endText: `謝謝你聆聽狗狗與收養家庭的故事\n以後可以在「探險手冊」重新觀看狗狗的生活喔！`
        }
    ]
}
export { objType, Page, homePageData, uiData, videoData };