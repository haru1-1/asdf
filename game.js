const SAVE_KEY = "samgukji_basic_save_v1";

const RESEARCH_TREE = [
  {
    id: "econ_1",
    branch: "내정",
    tier: 1,
    name: "수리 시설 정비",
    cost: 180,
    turns: 2,
    req: null,
    desc: "매달 금·군량 수입 +15%"
  },
  {
    id: "econ_2",
    branch: "내정",
    tier: 2,
    name: "둔전제 시행",
    cost: 300,
    turns: 2,
    req: "econ_1",
    desc: "매달 금·군량 수입 추가 +20%"
  },
  {
    id: "mil_1",
    branch: "군사",
    tier: 1,
    name: "강철 무구 보급",
    cost: 200,
    turns: 2,
    req: null,
    desc: "전투 시 공격력 +15%"
  },
  {
    id: "mil_2",
    branch: "군사",
    tier: 2,
    name: "정예 진법 훈련",
    cost: 320,
    turns: 2,
    req: "mil_1",
    desc: "전투 시 공격·방어력 추가 +15%"
  },
  {
    id: "dip_1",
    branch: "외교",
    tier: 1,
    name: "사절단 파견",
    cost: 160,
    turns: 2,
    req: null,
    desc: "외교 관계 개선 효과 +10 증가"
  },
  {
    id: "dip_2",
    branch: "외교",
    tier: 2,
    name: "천하 명성 확립",
    cost: 280,
    turns: 2,
    req: "dip_1",
    desc: "장수 등용 비용 50 감소, 외교 효과 +10"
  }
];

const TUTORIAL_STEPS = [
  {
    title: "1. 삼국지 게임의 목표",
    body: "역사를 잘 몰라도 괜찮습니다. 유비·조조·손권 중 한 군주가 되어 6개의 성을 모두 차지하면 '천하통일'로 승리하고, 내 성을 모두 잃으면 패배합니다."
  },
  {
    title: "2. 한 턴은 한 달입니다",
    body: "상단에 현재 연월과 금·군량·총 병력이 표시됩니다. 성을 발전시키면 매달 초에 금과 군량이 들어오고, 병사 수만큼 군량을 소비합니다."
  },
  {
    title: "3. 성 선택과 내정 명령",
    body: "왼쪽 지도나 목록에서 내 성을 누르면 중앙에 성 내부가 보입니다. 각 성은 한 달에 1번 농업 개발, 상업 개발, 병력 훈련, 장수 등용 또는 인접 성 공격을 할 수 있습니다."
  },
  {
    title: "4. 연구 단계 해금",
    body: "우측 '연구' 탭에서 내정·군사·외교 기술을 연구할 수 있습니다. 반드시 같은 분야의 1단계 연구를 끝내야 2단계를 선택할 수 있습니다."
  },
  {
    title: "5. 외교와 전투",
    body: "우측 '외교' 탭에서 다른 세력과 관계를 개선하면 공격받을 위험이 줄어듭니다. 전투는 병력, 장수 능력, 훈련도, 연구 보너스로 계산되며 결과가 자세히 표시됩니다."
  },
  {
    title: "6. 턴 종료와 자동 저장",
    body: "'턴 종료'를 누르면 다음 달로 넘어가며 다른 세력도 내정이나 공격을 수행합니다. 모든 진행 상황은 자동 저장되어 다시 열어도 이어서 할 수 있습니다."
  }
];

const HELP_TEXTS = {
  map: "지도에서 성을 클릭해 상태를 확인하세요. 선으로 연결된 성끼리만 공격할 수 있습니다.",
  castle: "선택한 성의 3D 디오라마 화면입니다. 군주·장수·병사·백성 이미지가 성 안에서 천천히 움직입니다.",
  actions: "내 성은 매달 1회 행동할 수 있습니다. 농업은 군량 수입, 상업은 금 수입, 훈련은 병력을 늘립니다.",
  battle: "인접한 적 성을 공격합니다. 병력의 70%가 출진하며, 병력·장수 무력·훈련도·연구 보너스로 승패가 갈립니다.",
  research: "한 번에 하나의 연구를 진행합니다. 같은 분야의 1단계를 완료해야 2단계 버튼이 열립니다.",
  diplomacy: "금 150을 써서 다른 세력과의 우호도를 높입니다. 우호도가 높으면 먼저 공격해 올 확률이 낮아집니다.",
  generals: "장수의 무력은 공격력을, 통솔은 방어력을 높여 줍니다. 장수 등용으로 재야 장수를 늘릴 수 있습니다."
};

let state = null;
let tutorialIndex = 0;

function createInitialState(playerFactionId) {
  return {
    year: 208,
    month: 1,
    playerFaction: playerFactionId,
    selectedCastleId:
      playerFactionId === "liubei"
        ? "chengdu"
        : playerFactionId === "caocao"
        ? "xuchang"
        : "jianye",
    gameOver: null,
    factions: {
      liubei: {
        id: "liubei",
        name: "유비 (촉)",
        rulerName: "유비",
        gold: 500,
        food: 600,
        completedResearch: [],
        activeResearch: null,
        relations: { caocao: 30, sunquan: 55 }
      },
      caocao: {
        id: "caocao",
        name: "조조 (위)",
        rulerName: "조조",
        gold: 600,
        food: 650,
        completedResearch: [],
        activeResearch: null,
        relations: { liubei: 30, sunquan: 35 }
      },
      sunquan: {
        id: "sunquan",
        name: "손권 (오)",
        rulerName: "손권",
        gold: 550,
        food: 620,
        completedResearch: [],
        activeResearch: null,
        relations: { liubei: 55, caocao: 35 }
      }
    },
    castles: {
      chengdu: {
        id: "chengdu",
        name: "성도",
        owner: "liubei",
        x: 18,
        y: 66,
        region: "mountain",
        agri: 55,
        comm: 50,
        troops: 1400,
        training: 55,
        acted: false,
        neighbors: ["hanzhong", "jingzhou"]
      },
      hanzhong: {
        id: "hanzhong",
        name: "한중",
        owner: "liubei",
        x: 28,
        y: 34,
        region: "mountain",
        agri: 45,
        comm: 40,
        troops: 1100,
        training: 50,
        acted: false,
        neighbors: ["chengdu", "luoyang"]
      },
      luoyang: {
        id: "luoyang",
        name: "낙양",
        owner: "caocao",
        x: 52,
        y: 28,
        region: "plains",
        agri: 60,
        comm: 60,
        troops: 1500,
        training: 60,
        acted: false,
        neighbors: ["hanzhong", "xuchang", "jingzhou"]
      },
      xuchang: {
        id: "xuchang",
        name: "허창",
        owner: "caocao",
        x: 75,
        y: 34,
        region: "plains",
        agri: 62,
        comm: 65,
        troops: 1500,
        training: 62,
        acted: false,
        neighbors: ["luoyang", "jianye"]
      },
      jingzhou: {
        id: "jingzhou",
        name: "형주",
        owner: "sunquan",
        x: 52,
        y: 72,
        region: "river",
        agri: 58,
        comm: 55,
        troops: 1350,
        training: 55,
        acted: false,
        neighbors: ["chengdu", "luoyang", "jianye"]
      },
      jianye: {
        id: "jianye",
        name: "건업",
        owner: "sunquan",
        x: 82,
        y: 68,
        region: "river",
        agri: 60,
        comm: 64,
        troops: 1450,
        training: 58,
        acted: false,
        neighbors: ["xuchang", "jingzhou"]
      }
    },
    generals: [
      { id: "g1", name: "관우", faction: "liubei", might: 95, lead: 92, sprite: "general_shu" },
      { id: "g2", name: "장비", faction: "liubei", might: 96, lead: 84, sprite: "general_shu" },
      { id: "g3", name: "하후돈", faction: "caocao", might: 89, lead: 88, sprite: "general_wei" },
      { id: "g4", name: "곽가", faction: "caocao", might: 68, lead: 90, sprite: "general_wei" },
      { id: "g5", name: "주유", faction: "sunquan", might: 82, lead: 95, sprite: "general_wu" },
      { id: "g6", name: "감녕", faction: "sunquan", might: 92, lead: 83, sprite: "general_wu" },
      { id: "g7", name: "조운", faction: null, might: 94, lead: 90, sprite: "general_shu" },
      { id: "g8", name: "장료", faction: null, might: 91, lead: 91, sprite: "general_wei" },
      { id: "g9", name: "태사자", faction: null, might: 92, lead: 85, sprite: "general_wu" }
    ],
    logs: ["208년 1월: 천하 통일의 서막이 올랐습니다. 내 성을 눌러 내정이나 전투를 시작하세요."]
  };
}

function saveGame() {
  if (!state) return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  const el = document.getElementById("save-indicator");
  if (el) el.textContent = `자동 저장 (${state.year}년 ${state.month}월)`;
}

function loadSavedGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function addLog(text) {
  state.logs.unshift(`[${state.year}년 ${state.month}월] ${text}`);
  if (state.logs.length > 40) state.logs.pop();
}

function getFactionCastles(factionId) {
  return Object.values(state.castles).filter((c) => c.owner === factionId);
}

function getFactionGenerals(factionId) {
  return state.generals.filter((g) => g.faction === factionId);
}

function getBestGeneral(factionId, statKey) {
  const list = getFactionGenerals(factionId);
  if (list.length === 0) return { name: "수비 대장", might: 60, lead: 60, sprite: "soldier_wei" };
  return list.slice().sort((a, b) => b[statKey] - a[statKey])[0];
}

function hasResearch(factionId, researchId) {
  return state.factions[factionId].completedResearch.includes(researchId);
}

function renderAll() {
  renderTopBar();
  renderMap();
  renderCastleList();
  renderStage();
  renderActions();
  renderResearch();
  renderDiplomacy();
  renderGenerals();
  renderLogs();
  checkEnding();
}

function renderTopBar() {
  const pf = state.factions[state.playerFaction];
  const myCastles = getFactionCastles(state.playerFaction);
  const totalTroops = myCastles.reduce((sum, c) => sum + c.troops, 0);

  document.getElementById("date-display").textContent = `${state.year}년 ${state.month}월`;
  document.getElementById("ruler-badge").textContent = pf.name;
  document.getElementById("res-gold").textContent = pf.gold.toLocaleString();
  document.getElementById("res-food").textContent = pf.food.toLocaleString();
  document.getElementById("res-troops").textContent = totalTroops.toLocaleString();
  document.getElementById("res-castles").textContent = `${myCastles.length} / ${Object.keys(state.castles).length}`;
}

function renderMap() {
  const svg = document.getElementById("map-lines");
  const nodesEl = document.getElementById("map-nodes");
  svg.innerHTML = "";
  nodesEl.innerHTML = "";

  const drawn = new Set();
  Object.values(state.castles).forEach((c) => {
    c.neighbors.forEach((nId) => {
      const key = [c.id, nId].sort().join("-");
      if (drawn.has(key)) return;
      drawn.add(key);
      const target = state.castles[nId];
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", (c.x / 100) * 360);
      line.setAttribute("y1", (c.y / 100) * 280);
      line.setAttribute("x2", (target.x / 100) * 360);
      line.setAttribute("y2", (target.y / 100) * 280);
      line.setAttribute("stroke", "#d4af37");
      line.setAttribute("stroke-opacity", "0.45");
      line.setAttribute("stroke-width", "2");
      svg.appendChild(line);
    });

    const btn = document.createElement("button");
    btn.className = `map-node faction-${c.owner} ${state.selectedCastleId === c.id ? "selected" : ""}`;
    btn.style.left = `${c.x}%`;
    btn.style.top = `${c.y}%`;
    btn.textContent = c.name;
    btn.onclick = () => {
      sound.playClick();
      state.selectedCastleId = c.id;
      saveGame();
      renderAll();
    };
    nodesEl.appendChild(btn);
  });
}

function renderCastleList() {
  const listEl = document.getElementById("castle-list");
  listEl.innerHTML = "";
  Object.values(state.castles).forEach((c) => {
    const btn = document.createElement("button");
    btn.className = `castle-row ${state.selectedCastleId === c.id ? "selected" : ""}`;
    btn.innerHTML = `
      <div>
        <strong>${c.name}</strong>
        <div style="font-size:0.8rem;color:#aebad0;">${state.factions[c.owner].name}</div>
      </div>
      <div style="text-align:right;font-size:0.84rem;">
        <div>병력 ${c.troops.toLocaleString()}</div>
        <div style="color:#f3d98b;">${c.owner === state.playerFaction ? (c.acted ? "행동 완료" : "행동 가능") : "타 세력"}</div>
      </div>
    `;
    btn.onclick = () => {
      sound.playClick();
      state.selectedCastleId = c.id;
      saveGame();
      renderAll();
    };
    listEl.appendChild(btn);
  });
}

function renderStage() {
  const castle = state.castles[state.selectedCastleId];
  const ownerFaction = state.factions[castle.owner];

  document.getElementById("stage-title").textContent = castle.name;
  document.getElementById("stage-owner").textContent = `${ownerFaction.name} 지배 중`;
  document.getElementById("stage-bg").src = getAsset("castles", castle.id);

  const actorsEl = document.getElementById("stage-actors");
  actorsEl.innerHTML = "";
  const soldierKey =
    castle.owner === "liubei"
      ? "soldier_shu"
      : castle.owner === "caocao"
      ? "soldier_wei"
      : "soldier_wu";
  const topGen = getBestGeneral(castle.owner, "might");

  const actors = [
    { label: ownerFaction.rulerName, img: getAsset("characters", castle.owner), left: "16%", moveX: "36px", dur: "11s", size: "76px" },
    { label: topGen.name, img: getAsset("characters", topGen.sprite), left: "38%", moveX: "48px", dur: "13s", size: "74px" },
    { label: "수비 병사", img: getAsset("characters", soldierKey), left: "58%", moveX: "52px", dur: "9s", size: "68px" },
    { label: "성내 백성", img: getAsset("characters", "citizen"), left: "74%", moveX: "-44px", dur: "14s", size: "64px" }
  ];

  actors.forEach((a) => {
    const div = document.createElement("div");
    div.className = "actor-sprite";
    div.style.left = a.left;
    div.style.setProperty("--move-x", a.moveX);
    div.style.setProperty("--dur", a.dur);
    div.style.setProperty("--size", a.size);
    div.innerHTML = `<img src="${a.img}" alt="${a.label}" /><span class="actor-label">${a.label}</span>`;
    actorsEl.appendChild(div);
  });

  document.getElementById("stage-stats").innerHTML = `
    <div class="stage-stat-box"><span>농업</span><strong>${castle.agri}</strong></div>
    <div class="stage-stat-box"><span>상업</span><strong>${castle.comm}</strong></div>
    <div class="stage-stat-box"><span>병력</span><strong>${castle.troops.toLocaleString()}</strong></div>
    <div class="stage-stat-box"><span>훈련도</span><strong>${castle.training}</strong></div>
    <div class="stage-stat-box"><span>상태</span><strong>${castle.owner === state.playerFaction ? (castle.acted ? "행동 완료" : "대기 중") : "적/타국"}</strong></div>
  `;
}

function renderActions() {
  const castle = state.castles[state.selectedCastleId];
  const isMine = castle.owner === state.playerFaction;
  const statusEl = document.getElementById("action-status");

  if (!isMine) {
    statusEl.textContent = `${castle.name}은(는) 다른 세력의 성입니다. 내 성을 선택해야 명령을 내릴 수 있습니다.`;
  } else if (castle.acted) {
    statusEl.textContent = `${castle.name}은(는) 이번 달 행동을 마쳤습니다. 다른 내 성을 선택하거나 턴을 종료하세요.`;
  } else {
    statusEl.textContent = `${castle.name}에서 이번 달 명령을 1회 실행할 수 있습니다.`;
  }

  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.disabled = !isMine || castle.acted || Boolean(state.gameOver);
  });

  const attackEl = document.getElementById("attack-targets");
  attackEl.innerHTML = "";
  const enemyNeighbors = castle.neighbors
    .map((id) => state.castles[id])
    .filter((target) => target.owner !== state.playerFaction);

  if (!isMine || enemyNeighbors.length === 0) {
    attackEl.innerHTML = `<div class="card-box">공격 가능한 인접 적성이 없습니다.</div>`;
    return;
  }

  enemyNeighbors.forEach((target) => {
    const box = document.createElement("div");
    box.className = "card-box";
    const sendTroops = Math.floor(castle.troops * 0.7);
    box.innerHTML = `
      <div class="card-row">
        <div>
          <strong>${target.name} (${state.factions[target.owner].name})</strong>
          <div style="font-size:0.82rem;color:#aebad0;">적 병력 ${target.troops.toLocaleString()} · 출진 예정 ${sendTroops.toLocaleString()}</div>
        </div>
        <button class="btn-sm btn-danger" ${castle.acted || castle.troops < 300 ? "disabled" : ""}>공격</button>
      </div>
    `;
    box.querySelector("button").onclick = () => {
      sound.playBattle();
      executeBattle(castle.id, target.id, true);
    };
    attackEl.appendChild(box);
  });
}

function renderResearch() {
  const pf = state.factions[state.playerFaction];
  const activeEl = document.getElementById("research-active");
  if (pf.activeResearch) {
    const item = RESEARCH_TREE.find((r) => r.id === pf.activeResearch.id);
    activeEl.textContent = `진행 중: ${item.name} (남은 기간 ${pf.activeResearch.remaining}개월)`;
  } else {
    activeEl.textContent = "현재 진행 중인 연구가 없습니다. 아래에서 연구를 선택하세요.";
  }

  const grid = document.getElementById("research-grid");
  grid.innerHTML = "";
  RESEARCH_TREE.forEach((r) => {
    const completed = pf.completedResearch.includes(r.id);
    const inProgress = pf.activeResearch && pf.activeResearch.id === r.id;
    const reqMet = !r.req || pf.completedResearch.includes(r.req);
    const disabled = completed || Boolean(pf.activeResearch) || !reqMet || pf.gold < r.cost;

    const card = document.createElement("div");
    card.className = "card-box";
    card.innerHTML = `
      <div class="card-row">
        <strong>[${r.branch} ${r.tier}단계] ${r.name}</strong>
        <span style="font-size:0.8rem;color:#f3d98b;">${
          completed ? "완료" : inProgress ? "연구 중" : reqMet ? `금 ${r.cost} / ${r.turns}개월` : "1단계 필요"
        }</span>
      </div>
      <div style="font-size:0.84rem;color:#aebad0;">${r.desc}</div>
      <button class="btn-sm" ${disabled ? "disabled" : ""}>
        ${completed ? "연구 완료" : inProgress ? "진행 중" : reqMet ? "연구 시작" : "잠김 (1단계 먼저 완료)"}
      </button>
    `;
    card.querySelector("button").onclick = () => {
      sound.playClick();
      pf.gold -= r.cost;
      pf.activeResearch = { id: r.id, remaining: r.turns };
      addLog(`'${r.name}' 연구를 시작했습니다. (${r.turns}개월 소요)`);
      saveGame();
      renderAll();
    };
    grid.appendChild(card);
  });
}

function renderDiplomacy() {
  const pf = state.factions[state.playerFaction];
  const listEl = document.getElementById("diplomacy-list");
  listEl.innerHTML = "";

  Object.values(state.factions)
    .filter((f) => f.id !== state.playerFaction)
    .forEach((other) => {
      const rel = pf.relations[other.id] ?? 40;
      const gain = 15 + (hasResearch(pf.id, "dip_1") ? 10 : 0) + (hasResearch(pf.id, "dip_2") ? 10 : 0);
      const box = document.createElement("div");
      box.className = "card-box";
      box.innerHTML = `
        <div class="card-row">
          <div>
            <strong>${other.name}</strong>
            <div style="font-size:0.84rem;color:#aebad0;">우호도: ${rel} / 100</div>
          </div>
          <button class="btn-sm" ${pf.gold < 150 || rel >= 100 ? "disabled" : ""}>관계 개선 (금 150)</button>
        </div>
      `;
      box.querySelector("button").onclick = () => {
        sound.playClick();
        pf.gold -= 150;
        pf.relations[other.id] = Math.min(100, rel + gain);
        other.relations[pf.id] = pf.relations[other.id];
        addLog(`${other.name}에 사절을 보내 우호도가 +${gain} 올랐습니다. (현재 ${pf.relations[other.id]})`);
        saveGame();
        renderAll();
      };
      listEl.appendChild(box);
    });
}

function renderGenerals() {
  const listEl = document.getElementById("general-list");
  listEl.innerHTML = "";
  const mine = getFactionGenerals(state.playerFaction);
  mine.forEach((g) => {
    const box = document.createElement("div");
    box.className = "card-box general-card";
    box.innerHTML = `
      <img src="${getAsset("characters", g.sprite)}" alt="${g.name}" />
      <div>
        <strong>${g.name}</strong>
        <div style="font-size:0.84rem;color:#aebad0;">무력 ${g.might} · 통솔 ${g.lead}</div>
      </div>
    `;
    listEl.appendChild(box);
  });
}

function renderLogs() {
  const ul = document.getElementById("log-list");
  ul.innerHTML = state.logs.map((line) => `<li>${line}</li>`).join("");
}

function performCastleAction(actionType) {
  const castle = state.castles[state.selectedCastleId];
  const pf = state.factions[state.playerFaction];
  if (castle.owner !== state.playerFaction || castle.acted) return;

  sound.playClick();

  if (actionType === "farm") {
    if (pf.gold < 120) return alert("금이 부족합니다. (필요: 금 120)");
    pf.gold -= 120;
    castle.agri += 15;
    castle.acted = true;
    addLog(`${castle.name}에서 농업을 개발했습니다. (농업 ${castle.agri})`);
  } else if (actionType === "commerce") {
    if (pf.gold < 120) return alert("금이 부족합니다. (필요: 금 120)");
    pf.gold -= 120;
    castle.comm += 15;
    castle.acted = true;
    addLog(`${castle.name}에서 상업을 개발했습니다. (상업 ${castle.comm})`);
  } else if (actionType === "train") {
    if (pf.gold < 100 || pf.food < 80) return alert("금 100과 군량 80이 필요합니다.");
    pf.gold -= 100;
    pf.food -= 80;
    castle.troops += 400;
    castle.training = Math.min(100, castle.training + 8);
    castle.acted = true;
    addLog(`${castle.name}에서 병력을 훈련했습니다. (병력 ${castle.troops}, 훈련도 ${castle.training})`);
  } else if (actionType === "recruit") {
    const recruitCost = hasResearch(pf.id, "dip_2") ? 100 : 150;
    const freeGenerals = state.generals.filter((g) => g.faction === null);
    if (freeGenerals.length === 0) return alert("현재 등용할 수 있는 재야 장수가 없습니다.");
    if (pf.gold < recruitCost) return alert(`금이 부족합니다. (필요: 금 ${recruitCost})`);
    pf.gold -= recruitCost;
    const hired = freeGenerals[0];
    hired.faction = pf.id;
    castle.acted = true;
    addLog(`재야 장수 ${hired.name}(무력 ${hired.might}, 통솔 ${hired.lead})을 등용했습니다.`);
  }

  saveGame();
  renderAll();
}

function executeBattle(fromId, toId, showModal) {
  const attackerCastle = state.castles[fromId];
  const defenderCastle = state.castles[toId];
  const attFactionId = attackerCastle.owner;
  const defFactionId = defenderCastle.owner;

  const sentTroops = Math.floor(attackerCastle.troops * 0.7);
  attackerCastle.troops -= sentTroops;
  attackerCastle.acted = true;

  const attGen = getBestGeneral(attFactionId, "might");
  const defGen = getBestGeneral(defFactionId, "lead");

  const attResearchMult =
    1 + (hasResearch(attFactionId, "mil_1") ? 0.15 : 0) + (hasResearch(attFactionId, "mil_2") ? 0.15 : 0);
  const defResearchMult = 1 + (hasResearch(defFactionId, "mil_2") ? 0.15 : 0);

  const attPower = Math.round(
    sentTroops * (1 + attGen.might / 100) * (1 + attackerCastle.training / 200) * attResearchMult
  );
  const defPower = Math.round(
    defenderCastle.troops * (1 + defGen.lead / 100) * 1.15 * defResearchMult
  );

  state.factions[attFactionId].relations[defFactionId] = Math.max(
    0,
    (state.factions[attFactionId].relations[defFactionId] ?? 40) - 25
  );
  state.factions[defFactionId].relations[attFactionId] = state.factions[attFactionId].relations[defFactionId];

  const attackerWon = attPower > defPower;
  let resultSummary = "";

  if (attackerWon) {
    const ratio = Math.min(0.75, defPower / Math.max(1, attPower));
    const survivors = Math.max(200, Math.round(sentTroops * (1 - ratio * 0.6)));
    defenderCastle.owner = attFactionId;
    defenderCastle.troops = survivors;
    defenderCastle.acted = true;
    resultSummary = `${state.factions[attFactionId].name}이(가) ${defenderCastle.name}을(를) 점령했습니다! (잔여 병력 ${survivors.toLocaleString()})`;
  } else {
    const ratio = Math.min(0.75, attPower / Math.max(1, defPower));
    const defSurvivors = Math.max(200, Math.round(defenderCastle.troops * (1 - ratio * 0.55)));
    const retreated = Math.round(sentTroops * 0.25);
    defenderCastle.troops = defSurvivors;
    attackerCastle.troops += retreated;
    resultSummary = `${defenderCastle.name} 수비군이 공격을 막아냈습니다! (수비 잔여 ${defSurvivors.toLocaleString()}, 공격군 후퇴 ${retreated.toLocaleString()})`;
  }

  addLog(`${attackerCastle.name} → ${defenderCastle.name} 전투: ${resultSummary}`);

  if (showModal) {
    document.getElementById("battle-bg").src = getAsset("battles", defenderCastle.region);
    document.getElementById("battle-title").textContent = `${attackerCastle.name} → ${defenderCastle.name} 공성전`;
    document.getElementById("battle-visual").innerHTML = `
      <div class="battle-unit">
        <img src="${getAsset("characters", attGen.sprite)}" alt="${attGen.name}" />
        <div><strong>${attGen.name}</strong> (공격 ${sentTroops.toLocaleString()})</div>
      </div>
      <strong style="font-size:1.5rem;color:#f3d98b;">VS</strong>
      <div class="battle-unit">
        <img src="${getAsset("characters", defGen.sprite)}" alt="${defGen.name}" />
        <div><strong>${defGen.name}</strong> (수비 ${defenderCastle.troops.toLocaleString()})</div>
      </div>
    `;
    document.getElementById("battle-formula").textContent =
      `[공격 전투력] ${attPower.toLocaleString()}점
` +
      ` = 출진 병력(${sentTroops}) × 장수 무력 보정(1 + ${attGen.might}/100) × 훈련 보정(1 + ${attackerCastle.training}/200) × 연구(${attResearchMult.toFixed(2)})

` +
      `[방어 전투력] ${defPower.toLocaleString()}점
` +
      ` = 수비 병력 × 장수 통솔 보정(1 + ${defGen.lead}/100) × 성벽 방어(1.15) × 연구(${defResearchMult.toFixed(2)})`;
    document.getElementById("battle-result-text").textContent = resultSummary;
    document.getElementById("battle-modal").classList.remove("hidden");
  }

  saveGame();
  renderAll();
}

function endTurn() {
  if (state.gameOver) return;
  sound.playClick();

  Object.values(state.factions).forEach((f) => {
    const owned = getFactionCastles(f.id);
    if (owned.length === 0) return;

    const econMult =
      1 + (hasResearch(f.id, "econ_1") ? 0.15 : 0) + (hasResearch(f.id, "econ_2") ? 0.2 : 0);
    const goldIncome = Math.round(owned.reduce((s, c) => s + c.comm * 2.5, 0) * econMult);
    const foodIncome = Math.round(owned.reduce((s, c) => s + c.agri * 2.8, 0) * econMult);
    const upkeep = Math.round(owned.reduce((s, c) => s + c.troops * 0.08, 0));

    f.gold += goldIncome;
    f.food = Math.max(0, f.food + foodIncome - upkeep);

    if (f.id === state.playerFaction) {
      addLog(`월간 결산: 금 +${goldIncome}, 군량 +${foodIncome}, 병력 소비 -${upkeep}`);
    }

    if (f.activeResearch) {
      f.activeResearch.remaining -= 1;
      if (f.activeResearch.remaining <= 0) {
        const done = RESEARCH_TREE.find((r) => r.id === f.activeResearch.id);
        f.completedResearch.push(done.id);
        f.activeResearch = null;
        if (f.id === state.playerFaction) {
          addLog(`연구 완료! '${done.name}' 효과가 적용되었습니다.`);
        }
      }
    }
  });

  Object.values(state.factions)
    .filter((f) => f.id !== state.playerFaction)
    .forEach((ai) => {
      const owned = getFactionCastles(ai.id);
      if (owned.length === 0) return;

      let acted = false;
      for (const castle of owned) {
        const weakTarget = castle.neighbors
          .map((id) => state.castles[id])
          .find((t) => {
            if (t.owner === ai.id) return false;
            const rel = ai.relations[t.owner] ?? 40;
            return castle.troops > t.troops * 1.25 && rel < 70;
          });

        if (weakTarget && castle.troops >= 900) {
          const involvesPlayer = weakTarget.owner === state.playerFaction;
          if (involvesPlayer) sound.playBattle();
          executeBattle(castle.id, weakTarget.id, involvesPlayer);
          acted = true;
          break;
        }
      }

      if (!acted) {
        const c = owned[0];
        if (ai.gold >= 120 && c.troops < 1800 && ai.food >= 80) {
          ai.gold -= 100;
          ai.food -= 80;
          c.troops += 350;
          addLog(`${ai.name}이(가) ${c.name}에서 병력을 훈련했습니다.`);
        } else {
          c.agri += 10;
          c.comm += 10;
          addLog(`${ai.name}이(가) ${c.name}의 내정을 정비했습니다.`);
        }
      }
    });

  state.month += 1;
  if (state.month > 12) {
    state.month = 1;
    state.year += 1;
  }
  Object.values(state.castles).forEach((c) => {
    c.acted = false;
  });

  saveGame();
  renderAll();
}

function checkEnding() {
  const total = Object.keys(state.castles).length;
  const mine = getFactionCastles(state.playerFaction).length;
  const modal = document.getElementById("ending-modal");

  if (mine === total) {
    state.gameOver = "win";
    document.getElementById("ending-title").textContent = "천하통일 달성!";
    document.getElementById("ending-desc").textContent =
      `${state.year}년 ${state.month}월, ${state.factions[state.playerFaction].name}이(가) 모든 성을 평정하고 천하를 통일했습니다.`;
    modal.classList.remove("hidden");
  } else if (mine === 0) {
    state.gameOver = "lose";
    document.getElementById("ending-title").textContent = "세력 멸망 (패배)";
    document.getElementById("ending-desc").textContent =
      `${state.year}년 ${state.month}월, 모든 성을 잃었습니다. 다시 도전하여 천하를 도모해 보세요.`;
    modal.classList.remove("hidden");
  }
}

function renderTutorial() {
  const step = TUTORIAL_STEPS[tutorialIndex];
  document.getElementById("tutorial-step-title").textContent = step.title;
  document.getElementById("tutorial-step-body").textContent = step.body;
  document.getElementById("tutorial-step-indicator").textContent = `${tutorialIndex + 1} / ${TUTORIAL_STEPS.length}`;
  document.getElementById("btn-tut-prev").disabled = tutorialIndex === 0;
  document.getElementById("btn-tut-next").textContent =
    tutorialIndex === TUTORIAL_STEPS.length - 1 ? "완료" : "다음";
}

function startGameWithState(loadedState, openTutorial) {
  state = loadedState;
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game-app").classList.remove("hidden");
  document.getElementById("ending-modal").classList.add("hidden");
  sound.startBgm();
  saveGame();
  renderAll();
  if (openTutorial) {
    tutorialIndex = 0;
    renderTutorial();
    document.getElementById("tutorial-modal").classList.remove("hidden");
  }
}

function initUI() {
  document.getElementById("preview-liubei").src = getAsset("characters", "liubei");
  document.getElementById("preview-caocao").src = getAsset("characters", "caocao");
  document.getElementById("preview-sunquan").src = getAsset("characters", "sunquan");

  const saved = loadSavedGame();
  if (saved && !saved.gameOver) {
    const box = document.getElementById("continue-box");
    box.classList.remove("hidden");
    document.getElementById("continue-info").textContent =
      `저장된 기록: ${saved.year}년 ${saved.month}월 · ${saved.factions[saved.playerFaction].name}`;
    document.getElementById("btn-continue").onclick = () => {
      sound.playClick();
      startGameWithState(saved, false);
    };
  }

  document.querySelectorAll(".btn-select").forEach((btn) => {
    btn.onclick = () => {
      sound.playClick();
      const ruler = btn.dataset.ruler;
      startGameWithState(createInitialState(ruler), true);
    };
  });

  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.onclick = () => performCastleAction(btn.dataset.action);
  });

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.onclick = () => {
      sound.playClick();
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`panel-${btn.dataset.tab}`).classList.add("active");
    };
  });

  document.getElementById("btn-end-turn").onclick = endTurn;

  document.getElementById("btn-bgm").onclick = (e) => {
    const on = sound.toggleBgm();
    e.target.textContent = `배경음악: ${on ? "ON" : "OFF"}`;
  };

  document.getElementById("btn-sfx").onclick = (e) => {
    const on = sound.toggleSfx();
    e.target.textContent = `효과음: ${on ? "ON" : "OFF"}`;
  };

  document.getElementById("btn-tutorial").onclick = () => {
    sound.playClick();
    tutorialIndex = 0;
    renderTutorial();
    document.getElementById("tutorial-modal").classList.remove("hidden");
  };

  document.getElementById("btn-new-game").onclick = () => {
    if (confirm("시작 화면으로 돌아가시겠습니까? (현재 진행은 저장되어 있습니다)")) {
      sound.stopBgm();
      location.reload();
    }
  };

  document.getElementById("btn-ending-restart").onclick = () => {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  };

  document.getElementById("btn-close-battle").onclick = () => {
    sound.playClick();
    document.getElementById("battle-modal").classList.add("hidden");
  };

  document.getElementById("btn-tut-prev").onclick = () => {
    if (tutorialIndex > 0) {
      tutorialIndex--;
      renderTutorial();
    }
  };

  document.getElementById("btn-tut-next").onclick = () => {
    if (tutorialIndex < TUTORIAL_STEPS.length - 1) {
      tutorialIndex++;
      renderTutorial();
    } else {
      document.getElementById("tutorial-modal").classList.add("hidden");
    }
  };

  document.getElementById("btn-tut-close").onclick = () => {
    document.getElementById("tutorial-modal").classList.add("hidden");
  };

  document.querySelectorAll(".help-btn").forEach((btn) => {
    btn.onclick = () => {
      sound.playClick();
      const key = btn.dataset.help;
      document.getElementById("help-toast-title").textContent = "기능 안내";
      document.getElementById("help-toast-body").textContent = HELP_TEXTS[key];
      document.getElementById("help-toast").classList.remove("hidden");
    };
  });

  document.getElementById("btn-close-help").onclick = () => {
    document.getElementById("help-toast").classList.add("hidden");
  };
}

window.addEventListener("DOMContentLoaded", initUI);
