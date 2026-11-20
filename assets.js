// 사용자가 직접 만든 파일이나 사용 권한이 있는 파일을 연결하려면
// 아래 빈 문자열("")에 파일 경로(예: "./images/chengdu.png", "./audio/bgm.mp3")를 입력하세요.
const CUSTOM_ASSETS = {
  castles: {
    chengdu: "./images/chengdu.jpg",
    hanzhong: "./images/hanzhong.jpg",
    xuchang: "./images/xuchang.jpg",
    luoyang: "./images/luoyang.jpg",
    jianye: "./images/jianye.jpg",
    jingzhou: "./images/jingzhou.jpg"
  },
  battles: {
    mountain: "./images/battle_mountain.jpg",
    plains: "./images/battle_plains.jpg",
    river: "./images/battle_river.jpg"
  },
  characters: {
    liubei: "./images/liubei.jpg",
    caocao: "./images/caocao.jpg",
    sunquan: "./images/sunquan.jpg",
    general_shu: "./images/general_shu.jpg",
    general_wei: "./images/general_wei.jpg",
    general_wu: "./images/general_wu.jpg",
    soldier_shu: "./images/soldier_shu.jpg",
    soldier_wei: "./images/soldier_wei.jpg",
    soldier_wu: "./images/soldier_wu.jpg",
    citizen: "./images/citizen.jpg"
  },
  audio: {
    bgm: "",
    click: "",
    battle: ""
  }
};

function svgUri(svg) {
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg.trim());
}

function makeCastleDiorama(skyTop, skyBottom, terrain, roofColor, wallColor, feature) {
  return svgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${skyTop}"/>
          <stop offset="100%" stop-color="${skyBottom}"/>
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${terrain}"/>
          <stop offset="100%" stop-color="#0f1726"/>
        </linearGradient>
      </defs>
      <rect width="960" height="540" fill="url(#sky)"/>
      <circle cx="790" cy="95" r="44" fill="#f6e3a1" opacity="0.85"/>
      <polygon points="0,300 180,175 360,295 540,165 730,285 960,180 960,360 0,360" fill="#18243d" opacity="0.8"/>
      <polygon points="70,350 480,260 890,350 480,500" fill="url(#ground)" stroke="#d4af37" stroke-width="3"/>
      <polygon points="70,350 480,500 480,530 70,380" fill="#0d1320"/>
      <polygon points="890,350 480,500 480,530 890,380" fill="#172238"/>
      ${feature}
      <polygon points="270,320 480,270 690,320 690,375 480,425 270,375" fill="${wallColor}" stroke="#202a3c" stroke-width="2"/>
      <rect x="415" y="215" width="130" height="95" fill="${wallColor}" stroke="#1b2230" stroke-width="2"/>
      <polygon points="385,222 480,170 575,222" fill="${roofColor}" stroke="#d4af37" stroke-width="2"/>
      <polygon points="405,180 480,138 555,180" fill="${roofColor}" stroke="#d4af37" stroke-width="2"/>
      <path d="M452,372 L452,326 Q480,304 508,326 L508,372 Z" fill="#1b1410" stroke="#d4af37" stroke-width="2"/>
      <rect x="295" y="255" width="54" height="68" fill="${wallColor}"/>
      <polygon points="282,258 322,226 362,258" fill="${roofColor}" stroke="#d4af37" stroke-width="1.5"/>
      <rect x="611" y="255" width="54" height="68" fill="${wallColor}"/>
      <polygon points="598,258 638,226 678,258" fill="${roofColor}" stroke="#d4af37" stroke-width="1.5"/>
    </svg>
  `);
}

function makeBattleBg(sky, ground, detail) {
  return svgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 360">
      <rect width="960" height="360" fill="${sky}"/>
      <rect y="205" width="960" height="155" fill="${ground}"/>
      ${detail}
    </svg>
  `);
}

function makeCharacterSvg(robeColor, trimColor, hatType, weaponType) {
  const hat =
    hatType === "crown"
      ? `<rect x="44" y="18" width="32" height="14" rx="3" fill="#d4af37"/><rect x="38" y="14" width="44" height="6" rx="2" fill="#f3d98b"/>`
      : hatType === "helmet"
      ? `<path d="M40,38 Q60,12 80,38 Z" fill="#8b9bb4" stroke="#d4af37" stroke-width="2"/><path d="M58,12 L64,4 L68,16" fill="#d9534f"/>`
      : `<path d="M42,34 Q60,22 78,34 Z" fill="#5c4938"/>`;

  const weapon =
    weaponType === "sword"
      ? `<line x1="94" y1="30" x2="94" y2="108" stroke="#dce4f2" stroke-width="4"/><rect x="86" y="78" width="16" height="5" fill="#d4af37"/>`
      : weaponType === "spear"
      ? `<line x1="98" y1="18" x2="98" y2="112" stroke="#8a5a36" stroke-width="4"/><polygon points="98,8 92,24 104,24" fill="#dce4f2"/>`
      : `<rect x="84" y="74" width="16" height="18" rx="2" fill="#b88b4a"/>`;

  return svgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <ellipse cx="60" cy="112" rx="26" ry="6" fill="#000" opacity="0.35"/>
      <path d="M32,108 L40,58 L80,58 L88,108 Z" fill="${robeColor}" stroke="${trimColor}" stroke-width="3"/>
      <rect x="38" y="76" width="44" height="8" fill="${trimColor}"/>
      <circle cx="60" cy="42" r="16" fill="#f1c7a1" stroke="#3a281d" stroke-width="1.5"/>
      <circle cx="54" cy="40" r="2" fill="#1a1a1a"/>
      <circle cx="66" cy="40" r="2" fill="#1a1a1a"/>
      <path d="M54,48 Q60,52 66,48" stroke="#4a2e1f" stroke-width="2" fill="none"/>
      ${hat}
      ${weapon}
    </svg>
  `);
}

const DEFAULT_ASSETS = {
  castles: {
    chengdu: makeCastleDiorama("#142b3c", "#2d5d5e", "#2b5b3c", "#1f6f50", "#8e887c", `<path d="M120,365 Q300,340 420,410" stroke="#4ca8a0" stroke-width="14" fill="none" opacity="0.65"/>`),
    hanzhong: makeCastleDiorama("#1a2238", "#414c6b", "#4e5642", "#596b47", "#7d776d", `<polygon points="150,335 230,255 310,335" fill="#3a4352"/>`),
    xuchang: makeCastleDiorama("#15203b", "#394d7a", "#6e5c3e", "#2f578c", "#9b9387", `<rect x="190" y="370" width="90" height="35" fill="#b99346" opacity="0.5"/>`),
    luoyang: makeCastleDiorama("#221b38", "#5b3d63", "#695140", "#9c2f2f", "#a3988a", `<rect x="650" y="365" width="95" height="32" fill="#d4af37" opacity="0.35"/>`),
    jianye: makeCastleDiorama("#132640", "#2f5b82", "#355e57", "#a64032", "#8e8c87", `<path d="M100,400 Q480,460 860,390" stroke="#3f8ec4" stroke-width="22" fill="none" opacity="0.7"/>`),
    jingzhou: makeCastleDiorama("#192836", "#3d5e69", "#405c44", "#8a4b32", "#888379", `<path d="M590,345 Q730,380 840,360" stroke="#4998b8" stroke-width="18" fill="none" opacity="0.65"/>`)
  },
  battles: {
    mountain: makeBattleBg("#1d2640", "#3a4033", `<polygon points="0,210 190,85 370,210 560,70 760,210 960,115 960,210" fill="#2a3247"/>`),
    plains: makeBattleBg("#2b2640", "#594832", `<circle cx="800" cy="85" r="38" fill="#e6b25c"/><rect y="195" width="960" height="18" fill="#7a5e3c"/>`),
    river: makeBattleBg("#142742", "#265c78", `<path d="M0,245 Q240,215 480,245 T960,245 L960,360 L0,360 Z" fill="#1e4963"/>`)
  },
  characters: {
    liubei: makeCharacterSvg("#2a754c", "#d4af37", "crown", "sword"),
    caocao: makeCharacterSvg("#2c5185", "#d4af37", "crown", "sword"),
    sunquan: makeCharacterSvg("#9e3a2d", "#d4af37", "crown", "sword"),
    general_shu: makeCharacterSvg("#266341", "#e0be5a", "helmet", "spear"),
    general_wei: makeCharacterSvg("#244370", "#e0be5a", "helmet", "spear"),
    general_wu: makeCharacterSvg("#8a3328", "#e0be5a", "helmet", "spear"),
    soldier_shu: makeCharacterSvg("#387855", "#9fb3a8", "helmet", "spear"),
    soldier_wei: makeCharacterSvg("#3a5d8f", "#a7b7cc", "helmet", "spear"),
    soldier_wu: makeCharacterSvg("#9e4a3d", "#c7aaa5", "helmet", "spear"),
    citizen: makeCharacterSvg("#7d6b52", "#c7b293", "plain", "bundle")
  }
};

function getAsset(category, key) {
  if (CUSTOM_ASSETS[category] && CUSTOM_ASSETS[category][key]) {
    return CUSTOM_ASSETS[category][key];
  }
  return DEFAULT_ASSETS[category][key];
}
