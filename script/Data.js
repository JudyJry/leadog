const objType = Object.freeze({
    "building": 1,
    "character": 2,
    "animation": 3,
    "other": 4
});

const pageEnum = Object.freeze({
    "home": "首頁",
    "bron": "出生",
    "childhood": "幼年",
    "youth": "壯年",
    "elderly": "老年",
    "know": "知識教育館",
    "company": "LEADOG公司",
    "market": "相關活動"
});

const uiData = [
    { name: pageEnum.home, url: "image/home.svg" },
    { name: pageEnum.market, url: "image/market.svg" },
    { name: pageEnum.know, url: "image/know.svg" },
    { name: pageEnum.company, url: "image/company.svg" },
    { name: pageEnum.bron, url: "image/bron.svg" },
    { name: pageEnum.childhood, url: "image/childhood.svg" },
    { name: pageEnum.youth, url: "image/youth.svg" },
    { name: pageEnum.elderly, url: "image/elderly.svg" },
];

const buildingData = [
    { type: objType.building, name: "出生", url: "image/homepage/bron.png", x: 0.157, y: 0.116 },
    { type: objType.building, name: "幼年", url: "image/homepage/childhood.png", x: 0.123, y: -0.029 },
    { type: objType.building, name: "壯年", url: "image/homepage/youth.png", x: 0.057, y: 0.124 },
    { type: objType.building, name: "老年", url: "image/homepage/elderly.png", x: -0.023, y: 0.098 },
    { type: objType.building, name: "知識教育館", url: "image/homepage/know.png", x: 0.027, y: -0.147 },
    { type: objType.building, name: "LEADOG公司", url: "image/homepage/company.png", x: -0.082, y: -0.175 },
    { type: objType.building, name: "相關活動", url: "image/homepage/market.png", x: 0.158, y: -0.227 },
];

export { objType, pageEnum, buildingData, uiData };