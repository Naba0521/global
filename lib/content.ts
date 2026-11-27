import type { Locale } from "./locale";

export type Category = "concert" | "festival" | "exhibition" | "broadcast";
export type SystemTag = "truss" | "layher" | "steel" | "stage" | "automation";
export type ServiceId = "truss" | "steel" | "layher" | "stage" | "automation";

export type Project = {
  id: string;
  image: string;
  category: Category;
  systems: SystemTag[];
  date: string;
  featured?: boolean;
  latest?: boolean;
  ko: { title: string; place: string; note?: string };
  en: { title: string; place: string; note?: string };
};

export const contactEmail: string | null = null;
export const phone = { display: "010-6616-6491", href: "tel:+821066166491" };

export const projects: Project[] = [
  {
    id: "mama",
    image: "/work/mama.jpg",
    category: "broadcast",
    systems: ["truss"],
    date: "2025.11.28–29",
    featured: true,
    ko: { title: "2025 MAMA Awards", place: "카이탁 스타디움, 홍콩" },
    en: { title: "2025 MAMA Awards", place: "Kai Tak Stadium, Hong Kong" },
  },
  {
    id: "blackpink",
    image: "/work/blackpink.jpg",
    category: "concert",
    systems: ["truss", "stage"],
    date: "2025.07.05–06",
    featured: true,
    ko: { title: "BLACKPINK World Tour Deadline", place: "고양종합운동장" },
    en: { title: "BLACKPINK World Tour Deadline", place: "Goyang Stadium" },
  },
  {
    id: "gdragon",
    image: "/work/gdragon.jpg",
    category: "concert",
    systems: ["truss", "stage"],
    date: "2025.12.12–14",
    featured: true,
    ko: { title: "G-DRAGON Ubermensch", place: "고척스카이돔 · 고양종합운동장" },
    en: { title: "G-DRAGON Ubermensch", place: "Gocheok Sky Dome · Goyang Stadium" },
  },
  {
    id: "bigbang",
    image: "/work/bigbang.jpg",
    category: "concert",
    systems: ["steel"],
    date: "2026.08.21–23",
    featured: true,
    ko: { title: "BIGBANG 2026 World Tour in Goyang", place: "고양종합운동장" },
    en: { title: "BIGBANG 2026 World Tour in Goyang", place: "Goyang Stadium" },
  },
  {
    id: "imhero",
    image: "/work/imhero.jpg",
    category: "concert",
    systems: ["steel"],
    date: "2026.09.04–06",
    featured: true,
    ko: { title: "임영웅 IM HERO THE STADIUM 2", place: "고양종합운동장" },
    en: { title: "Lim Young Woong IM HERO THE STADIUM 2", place: "Goyang Stadium" },
  },
  {
    id: "physical",
    image: "/work/physical.jpg",
    category: "broadcast",
    systems: ["automation", "truss"],
    date: "2025.01.03–02.23",
    featured: true,
    ko: {
      title: "피지컬: 아시아",
      place: "킨텍스",
      note: "호이스트 370개, 트러스 3,200m.",
    },
    en: {
      title: "Physical: Asia",
      place: "KINTEX",
      note: "370 hoists and 3,200m of truss.",
    },
  },
  {
    id: "psy",
    image: "/work/psy.jpg",
    category: "concert",
    systems: ["truss"],
    date: "2025–2026",
    featured: true,
    ko: {
      title: "PSY Summer Swag",
      place: "9개 도시",
      note: "9개 도시를 도는 투어의 트러스.",
    },
    en: {
      title: "PSY Summer Swag",
      place: "9 cities",
      note: "Truss for a nine-city tour.",
    },
  },
  {
    id: "netflix",
    image: "/work/netflix.jpg",
    category: "exhibition",
    systems: ["truss", "stage"],
    date: "2026.11.07",
    featured: true,
    ko: { title: "넷플릭스 코리아 10주년 넷플잔치", place: "파라다이스시티" },
    en: { title: "Netflix Korea 10th Anniversary", place: "Paradise City" },
  },
  {
    id: "mcr",
    image: "/work/mcr.jpg",
    category: "concert",
    systems: ["truss", "layher"],
    date: "2026.11.07",
    latest: true,
    ko: { title: "My Chemical Romance Live in Korea", place: "파라다이스시티, 인천" },
    en: { title: "My Chemical Romance Live in Korea", place: "Paradise City, Incheon" },
  },
  {
    id: "moon",
    image: "/work/moon.jpg",
    category: "concert",
    systems: ["truss", "layher"],
    date: "2026.11.15",
    latest: true,
    ko: { title: "프로젝트문 10주년", place: "경희대학교 평화의전당" },
    en: { title: "Project Moon 10th Anniversary", place: "Kyung Hee University, Peace Hall" },
  },
  {
    id: "campus",
    image: "/work/campus.jpg",
    category: "broadcast",
    systems: ["truss"],
    date: "2026.11.19",
    latest: true,
    ko: { title: "2026 MBC 대학가요제", place: "부경대학교" },
    en: { title: "2026 MBC University Song Festival", place: "Pukyong National University" },
  },
  {
    id: "cho",
    image: "/work/cho.jpg",
    category: "concert",
    systems: ["truss", "stage"],
    date: "2025.12–2026.01",
    ko: { title: "조용필 & 위대한탄생", place: "벡스코 · 엑스코 · KSPO DOME" },
    en: { title: "Cho Yong-pil & Great Birth", place: "BEXCO · EXCO · KSPO DOME" },
  },
  {
    id: "park",
    image: "/work/park.jpg",
    category: "concert",
    systems: ["truss", "stage"],
    date: "2026.04",
    ko: { title: "박효신 LIVE A & E 2026", place: "인천문학경기장" },
    en: { title: "Park Hyo Shin LIVE A & E 2026", place: "Incheon Munhak Stadium" },
  },
  {
    id: "akmu",
    image: "/work/akmu.jpg",
    category: "concert",
    systems: ["truss"],
    date: "2026.10.09–11",
    ko: { title: "AKMU 소문의 낙원", place: "KSPO DOME" },
    en: { title: "AKMU Paradise of Rumors", place: "KSPO DOME" },
  },
  {
    id: "kim",
    image: "/work/kim.jpg",
    category: "concert",
    systems: ["truss"],
    date: "2026.10.17–25",
    ko: { title: "김동률 오래된 노래", place: "세종문화회관 대극장" },
    en: { title: "Kim Dong-ryul, Old Song", place: "Sejong Center Grand Theater" },
  },
  {
    id: "mint",
    image: "/work/mint.jpg",
    category: "festival",
    systems: ["truss"],
    date: "2026.10.17–18",
    ko: { title: "그랜드 민트 페스티벌 2026", place: "KSPO DOME" },
    en: { title: "Grand Mint Festival 2026", place: "KSPO DOME" },
  },
  {
    id: "edc",
    image: "/work/edc.jpg",
    category: "festival",
    systems: ["truss"],
    date: "2026.10.03–04",
    ko: { title: "EDC Korea 2026", place: "인스파이어, 인천" },
    en: { title: "EDC Korea 2026", place: "Inspire, Incheon" },
  },
  {
    id: "fashion",
    image: "/work/fashion.jpg",
    category: "exhibition",
    systems: ["truss", "layher", "automation"],
    date: "2026",
    ko: { title: "서울패션위크", place: "DDP · 롯데월드타워" },
    en: { title: "Seoul Fashion Week", place: "DDP · Lotte World Tower" },
  },
  {
    id: "chanel",
    image: "/work/chanel.jpg",
    category: "exhibition",
    systems: ["truss"],
    date: "2026.05.19",
    ko: { title: "Chanel", place: "DDP" },
    en: { title: "Chanel", place: "DDP" },
  },
  {
    id: "ap",
    image: "/work/ap.jpg",
    category: "exhibition",
    systems: ["truss"],
    date: "2026.05.17",
    ko: { title: "Audemars Piguet", place: "푸투라서울" },
    en: { title: "Audemars Piguet", place: "Futura Seoul" },
  },
  {
    id: "mbc",
    image: "/work/mbc.jpg",
    category: "broadcast",
    systems: ["truss", "automation"],
    date: "2026.06.03",
    ko: {
      title: "MBC 선택 2026",
      place: "상암 MBC",
      note: "트러스와 트롤리.",
    },
    en: {
      title: "MBC Election 2026",
      place: "Sangam MBC",
      note: "Truss and trolley.",
    },
  },
  {
    id: "gayo",
    image: "/work/gayo.jpg",
    category: "broadcast",
    systems: ["truss", "stage"],
    date: "2025.12",
    ko: { title: "2025 SBS 가요대전 · MBC 가요대제전", place: "인스파이어 아레나 · MBC 드림센터" },
    en: { title: "2025 SBS & MBC Gayo Daejeon", place: "Inspire Arena · MBC Dream Center" },
  },
];

export const services: {
  id: ServiceId;
  index: string;
  ko: { name: string; line: string; body: string; seen: string; types?: string[] };
  en: { name: string; line: string; body: string; seen: string; types?: string[] };
}[] = [
  {
    id: "truss",
    index: "01",
    ko: {
      name: "Truss",
      line: "직선, 원형, 기둥.",
      body: "가볍고 빠른 알루미늄 시스템 트러스입니다. 콘서트, 전시, 음악방송의 뼈대를 현장에 맞춰 조립합니다.",
      seen: "MBC 대학가요제, 프로젝트문, AKMU, MAMA",
      types: ["직선 트러스", "원형 트러스", "기둥 트러스"],
    },
    en: {
      name: "Truss",
      line: "Straight, circle, tower.",
      body: "A light aluminum system, assembled to the room. It is the frame for concerts, exhibitions, and music broadcasts.",
      seen: "MBC University Song Festival, Project Moon, AKMU, MAMA",
      types: ["Straight truss", "Circle truss", "Pillar truss"],
    },
  },
  {
    id: "steel",
    index: "02",
    ko: {
      name: "Steel Truss",
      line: "경기장의 하중.",
      body: "알루미늄으로 감당하지 않는 스팬과 하중을 강재 트러스와 스틸 딜레이 타워로 받습니다.",
      seen: "BIGBANG 2026, 임영웅 IM HERO",
    },
    en: {
      name: "Steel Truss",
      line: "Stadium load.",
      body: "Steel truss and steel delay towers carry the spans and loads that aluminum does not.",
      seen: "BIGBANG 2026, Lim Young Woong IM HERO",
    },
  },
  {
    id: "layher",
    index: "03",
    ko: {
      name: "Layher",
      line: "하나의 모듈.",
      body: "무대, 스탠드, 전시 구조가 같은 치수로 연결됩니다. 바람이 있는 야외와 짧은 설치 일정에 맞습니다.",
      seen: "My Chemical Romance, 유튜브 페스티벌, QCE Prudential",
    },
    en: {
      name: "Layher",
      line: "One module.",
      body: "Stage, grandstand, and exhibition structures share one grid. It suits wind, outdoor sites, and short build windows.",
      seen: "My Chemical Romance, YouTube Festival, QCE Prudential",
    },
  },
  {
    id: "stage",
    index: "04",
    ko: {
      name: "Stage Deck",
      line: "공연면.",
      body: "높이, 크기, 하중을 그 공연에 맞춘 무대 바닥입니다. 트러스와 레이허 위에 올라앉습니다.",
      seen: "스타디움 투어, 돔, 실내 공연장",
    },
    en: {
      name: "Stage Deck",
      line: "The floor.",
      body: "A performance deck sized for the height, span, and load of that show. It sits on truss and Layher.",
      seen: "Stadium tours, domes, indoor halls",
    },
  },
  {
    id: "automation",
    index: "05",
    ko: {
      name: "Automation",
      line: "Kinesys · Glosys · Trolley · Hoist",
      body: "조명, 세트, 스크린이 움직이는 구간입니다. 키네시스, 글로시스, 트롤리, 호이스트를 현장에서 운용합니다.",
      seen: "피지컬: 아시아 370 hoist · 트러스 3,200m, MBC 선택 2026 trolley",
    },
    en: {
      name: "Automation",
      line: "Kinesys · Glosys · Trolley · Hoist",
      body: "The part of the show that moves: lights, scenery, and screens. Kinesys, Glosys, trolleys, and hoists, run on site.",
      seen: "Physical: Asia, 370 hoists and 3,200m of truss. MBC Election 2026, trolley",
    },
  },
];

const ko = {
  meta: {
    title: "글로벌스테이지그룹",
    description:
      "공연, 전시, 기업행사의 구조물을 설치합니다. 트러스, 레이허, 스테이지 데크, 오토메이션.",
  },
  nav: {
    about: "회사",
    work: "작업",
    contact: "견적",
    menu: "메뉴",
    close: "닫기",
    call: "전화",
  },
  detail: {
    date: "일정",
    place: "장소",
    category: "분야",
    systems: "구조",
    all: "작업 전체",
    next: "다음 작업",
    ask: "비슷한 현장이 있다면, 일정과 장소부터 알려 주십시오.",
  },
  clientsTitle: "함께한 무대",
  hero: {
    kicker: "Global Stage Group",
    title: "보이지 않는 곳에서,\n무대를 완성합니다.",
    sub: "공연 · 전시 · 기업행사",
    scroll: "Scroll",
  },
  stats: [
    { value: "370", unit: "호이스트", label: "피지컬: 아시아" },
    { value: "3,200m", unit: "truss", label: "같은 현장" },
    { value: "9", unit: "도시", label: "PSY Summer Swag" },
  ],
  servicesTitle: "사업",
  servicesLead: "한 현장에서 이어지는 다섯 가지 구조.",
  workTitle: "작업",
  workLead: "이름, 장소, 날짜. 구조는 그 아래에 있습니다.",
  latestTitle: "최근",
  relatedTitle: "이 구조로 선 현장",
  whyTitle: "기준",
  why: [
    {
      index: "01",
      title: "안전",
      body: "하중과 바람 앞에서 구조가 먼저입니다. 완성도 높은 무대는 안정적인 설치에서 시작합니다.",
    },
    {
      index: "02",
      title: "일정",
      body: "도시마다 다른 현장. 설치와 철수, 상하차, 중장비가 하나의 일정 안에서 맞물립니다.",
    },
    {
      index: "03",
      title: "한 팀",
      body: "트러스, 레이허, 스테이지, 오토메이션을 나눠 맡기지 않습니다. 같은 팀이 잇습니다.",
    },
  ],
  cta: {
    title: "현장을 알려 주십시오.",
    body: "일정, 장소, 규모. 전화가 가장 빠릅니다.",
  },
  about: {
    title: "회사",
    lead: "무대 뒤에서 일하는 사람들.",
    body: "글로벌스테이지그룹은 공연, 전시, 기업행사에 필요한 구조물을 설치합니다. 2022년 파주에서 시작했습니다. 대표는 김현준입니다.",
    letter:
      "무대가 열리기 전, 장비와 사람과 시간이 맞물리는 곳이 우리의 일입니다. 안정적인 구조와 완성도 높은 무대로 응답하겠습니다.",
    sign: "대표 김현준",
    repLabel: "대표",
    rep: "김현준",
    phoneLabel: "전화",
    regLabel: "사업자등록번호",
    reg: "883-88-02449",
    photoAlt: "킨텍스에 설치된 트러스",
    photoCaption: "피지컬: 아시아 · 킨텍스",
    officeLabel: "사무실",
    yardLabel: "창고",
    office: "경기도 파주시 와석순환로 507, 월드타워9 1201호",
    yard: "경기도 파주시 조리읍 정문로 114-27",
    foundedLabel: "설립",
    founded: "2022.03.17",
  },
  workPage: {
    title: "작업",
    all: "전체",
    concert: "콘서트",
    festival: "페스티벌",
    exhibition: "전시",
    broadcast: "방송",
  },
  contact: {
    title: "견적",
    lead: "어떤 현장이든, 일정과 장소를 먼저 받습니다.",
    name: "이름",
    company: "회사",
    type: "유형",
    date: "일정",
    message: "내용",
    place: "장소",
    setting: "실내 / 야외",
    indoor: "실내",
    outdoor: "야외",
    undecided: "미정",
    send: "메일로 작성",
    note: "공개된 이메일이 없습니다. 버튼을 누르면 내용이 적힌 메일 창이 열립니다. 급한 건은 전화로 주십시오.",
    map: "지도",
  },
  footer: {
    rights: "© Global Stage Group",
  },
  system: {
    truss: "Truss",
    layher: "Layher",
    steel: "Steel",
    stage: "Stage",
    automation: "Automation",
  } as Record<SystemTag, string>,
};

const en = {
  meta: {
    title: "Global Stage Group",
    description:
      "Structures for concerts, exhibitions, and corporate events. Truss, Layher, stage deck, automation.",
  },
  nav: {
    about: "Company",
    work: "Work",
    contact: "Quote",
    menu: "Menu",
    close: "Close",
    call: "Call",
  },
  detail: {
    date: "Date",
    place: "Place",
    category: "Field",
    systems: "Structure",
    all: "All work",
    next: "Next",
    ask: "If your site is like this one, send the date and the place.",
  },
  clientsTitle: "Stages we built for",
  hero: {
    kicker: "Global Stage Group",
    title: "The people\nbehind the stage.",
    sub: "Concerts · Exhibitions · Corporate events",
    scroll: "Scroll",
  },
  stats: [
    { value: "370", unit: "hoists", label: "Physical: Asia" },
    { value: "3,200m", unit: "truss", label: "On that build" },
    { value: "9", unit: "cities", label: "PSY Summer Swag" },
  ],
  servicesTitle: "Practice",
  servicesLead: "Five structures, one site.",
  workTitle: "Work",
  workLead: "Name, place, date. The structure sits underneath.",
  latestTitle: "Latest",
  relatedTitle: "Sites built with this",
  whyTitle: "Standard",
  why: [
    {
      index: "01",
      title: "Safety",
      body: "Load and wind come first. A finished stage starts with a stable build.",
    },
    {
      index: "02",
      title: "Schedule",
      body: "A different site every city. Load-in, strike, trucks, and plant share one calendar.",
    },
    {
      index: "03",
      title: "One crew",
      body: "Truss, Layher, deck, and automation stay with the same team.",
    },
  ],
  cta: {
    title: "Tell us the site.",
    body: "Date, place, scale. A call is the fastest way.",
  },
  about: {
    title: "Company",
    lead: "The people behind the stage.",
    body: "Global Stage Group installs the structures behind concerts, exhibitions, and corporate events. Founded in Paju in 2022. Representative Kim Hyun-jun.",
    letter:
      "Before the house lights drop, equipment, people, and time have to lock together. We answer with a stable structure and a finished stage.",
    sign: "Kim Hyun-jun, Representative",
    repLabel: "Representative",
    rep: "Kim Hyun-jun",
    phoneLabel: "Phone",
    regLabel: "Business registration",
    reg: "883-88-02449",
    photoAlt: "Truss installed at KINTEX",
    photoCaption: "Physical: Asia · KINTEX",
    officeLabel: "Office",
    yardLabel: "Yard",
    office: "World Tower 9, 1201, 507 Waseoksunhwan-ro, Paju",
    yard: "114-27 Jeongmun-ro, Jori-eup, Paju",
    foundedLabel: "Founded",
    founded: "17 March 2022",
  },
  workPage: {
    title: "Work",
    all: "All",
    concert: "Concert",
    festival: "Festival",
    exhibition: "Exhibition",
    broadcast: "Broadcast",
  },
  contact: {
    title: "Quote",
    lead: "Send the date and the place first.",
    name: "Name",
    company: "Company",
    type: "Type",
    date: "Date",
    message: "Note",
    place: "Place",
    setting: "Indoor / outdoor",
    indoor: "Indoor",
    outdoor: "Outdoor",
    undecided: "Not yet",
    send: "Open in mail",
    note: "There is no public email yet. This opens a draft with your note. For anything urgent, call.",
    map: "Map",
  },
  footer: {
    rights: "© Global Stage Group",
  },
  system: {
    truss: "Truss",
    layher: "Layher",
    steel: "Steel",
    stage: "Stage",
    automation: "Automation",
  } as Record<SystemTag, string>,
};

export type Copy = typeof ko;

export function t(locale: Locale): Copy {
  return locale === "en" ? en : ko;
}

export function serviceById(id: string) {
  return services.find((item) => item.id === id);
}

export function projectById(id: string) {
  return projects.find((project) => project.id === id);
}

export function projectAfter(id: string) {
  const index = projects.findIndex((project) => project.id === id);
  return projects[(index + 1) % projects.length];
}

export function projectsForSystem(system: SystemTag) {
  return projects.filter((project) => project.systems.includes(system));
}
