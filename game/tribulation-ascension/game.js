'use strict';

const config = {
  initialHp: 10,
  initialBoltDamage: 5,
  maxDamageRatio: 0.6,
  hitInvulnSec: 0.35,
  hitFlashSec: 0.14,
  enableVibration: true,
  hitRadius: 30,
  hitBreakGain: 8,
  stageBreakGain: 10,
  stageHealBase: 1,
  stageDamageUpEvery: 10,
  waveRestSec: 3,
  realmNeedScale: 0.08,
  realmNeedBase: 6,
  realmBreakthroughMaxHpUp: 2,
  realmBreakthroughDamageUp: 1,
  baseBoltWidth: 20,
  playerRadius: 20,
  moveBoundPadding: 24,
  playerFollowSpeed: 0.16,
  keyboardMoveSpeed: 320,
  scorePerStage: 100,
  bgPath: './assets/bg.png',
  bgFocusY: 0.82,
  groundYRatio: 0.9,
  groundYOffsetPx: 20,
  playerDrawOffsetY: 20,
  trackTelegraphHeight: 72,
  trackTelegraphTipOffset: 22,
  telegraphBaseBonusSec: 0.14,
  spriteIdlePathLeft: './assets/sprites/idle-spritesheet-left.png',
  spriteIdlePathRight: './assets/sprites/idle-spritesheet-right.png',
  spriteWalkPathLeft: './assets/sprites/walk-spritesheet-left.png',
  spriteWalkPathRight: './assets/sprites/walk-spritesheet-right.png',
  spriteIdleCols: 6,
  spriteIdleRows: 5,
  spriteIdleFrames: 30,
  spriteWalkCols: 5,
  spriteWalkRows: 5,
  spriteWalkFrames: 21,
  spriteScale: 0.5,
  spriteFps: 10,
  bgmPath: './assets/audio/bgm-loop.ogg',
  sfxBreakPath: './assets/audio/sfx-breakthrough.ogg',
  sfxHitPath: './assets/audio/sfx-hit.ogg',
  sfxThunderPath: './assets/audio/thunder.ogg',
  bgmVolume: 0.4,
  sfxVolume: 0.75,
  thunderVolume: 0.25,
  thunderPoolSize: 8,
  boltZigzagSegments: 19,
  breakAuraSec: 0.9
};

const storageKeys = {
  bestScore: 'oktt_best_score',
  bestStage: 'oktt_best_stage',
  bestRealm: 'oktt_best_realm'
};

const smallRealmConfig = {
  realms: [
    {
      id: 'qi',
      name: '練氣',
      max_stage: 3,
      stages: [
        { stage: 1, need_break: 40 },
        { stage: 2, need_break: 47 },
        { stage: 3, need_break: 56 }
      ],
      next_id: 'foundation'
    },
    {
      id: 'foundation',
      name: '築基',
      max_stage: 3,
      stages: [
        { stage: 1, need_break: 66 },
        { stage: 2, need_break: 78 },
        { stage: 3, need_break: 92 }
      ],
      next_id: 'core'
    },
    {
      id: 'core',
      name: '金丹',
      max_stage: 3,
      stages: [
        { stage: 1, need_break: 108 },
        { stage: 2, need_break: 127 },
        { stage: 3, need_break: 150 }
      ],
      next_id: 'nascent'
    },
    {
      id: 'nascent',
      name: '元嬰',
      max_stage: 3,
      stages: [
        { stage: 1, need_break: 177 },
        { stage: 2, need_break: 209 },
        { stage: 3, need_break: 247 }
      ],
      next_id: 'spirit'
    },
    {
      id: 'spirit',
      name: '化神',
      max_stage: 3,
      stages: [
        { stage: 1, need_break: 292 },
        { stage: 2, need_break: 344 },
        { stage: 3, need_break: 406 }
      ],
      next_id: 'void'
    }
  ]
};

const buffDefs = [
  { id: 'tiegu', name: '鐵骨', desc: '血量上限 +3/+6/+9', maxStacks: 3, type: 'buff' },
  { id: 'gangqi', name: '罡氣', desc: '落雷傷害 -1/-2/-3', maxStacks: 3, type: 'buff' },
  { id: 'jinshen', name: '金身', desc: '血量上限 +6/+12/+18\n落雷傷害 +1/+2/+3', maxStacks: 3, type: 'buff' },
  { id: 'huiqi', name: '回氣', desc: '每劫回血 +1/+2/+3', maxStacks: 3, type: 'buff' },
  { id: 'lianxue', name: '煉血', desc: '每劫回血 +2/+4/+6\n每波雷數 +1/+2/+3', maxStacks: 3, type: 'buff' },
  { id: 'huxin', name: '護心', desc: '受擊後回血 +1/+2/+3', maxStacks: 3, type: 'buff' },
  { id: 'wuxing', name: '悟性', desc: '突破值 +25%/+50%/+75%', maxStacks: 3, type: 'buff' },
  { id: 'ningshen', name: '凝神', desc: '預警 +0.05/+0.10/+0.15 秒', maxStacks: 3, type: 'buff' }
];

const daoDefs = [
  {
    id: 'xuanwu',
    name: '玄武金身道',
    desc: '落雷傷害 -4\n血量上限 +20\n每劫回血 +3',
    type: 'dao',
    req: { tiegu: 3, gangqi: 2 }
  },
  {
    id: 'changsheng',
    name: '長生回春道',
    desc: '每劫回血 +6\n受擊回血 +3\n突破值 +20%',
    type: 'dao',
    req: { huiqi: 3, huxin: 2 }
  },
  {
    id: 'tongming',
    name: '通明悟道道',
    desc: '突破值 +50%\n預警 +0.20 秒\n每劫回血 +2',
    type: 'dao',
    req: { wuxing: 3, ningshen: 2 }
  },
  {
    id: 'xuelian',
    name: '血煉化劫道',
    desc: '血量上限 ×2\n每波雷數 +2\n每劫回血 +6',
    type: 'dao',
    req: { lianxue: 3, jinshen: 2 }
  }
];

const boltPalette = {
  normal: {
    telegraph: 'rgba(255,88,88,0.9)',
    glow: 'rgba(140,206,255,0.5)',
    core: 'rgba(226,246,255,0.98)',
    ground: 'rgba(171,220,255,0.42)'
  },
  track: {
    telegraph: 'rgba(255,170,76,0.92)',
    glow: 'rgba(255,196,120,0.52)',
    core: 'rgba(255,236,196,0.98)',
    ground: 'rgba(255,202,132,0.45)'
  },
  chain: {
    telegraph: 'rgba(194,113,255,0.92)',
    glow: 'rgba(206,146,255,0.54)',
    core: 'rgba(239,223,255,0.98)',
    ground: 'rgba(210,170,255,0.45)'
  }
};

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const viewportEl = document.getElementById('gameViewport');

const hpEl = document.getElementById('hp');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const realmEl = document.getElementById('realm');
const breakFillEl = document.getElementById('breakFill');
const breakTextEl = document.getElementById('breakText');
const buffsEl = document.getElementById('buffs');
const daoLabelEl = document.getElementById('daoLabel');
const waveStatusEl = document.getElementById('waveStatus');
const waveStageEl = document.getElementById('waveStage');

const overlay = document.getElementById('overlay');
const startPanel = document.getElementById('startPanel');
const buffPickPanel = document.getElementById('buffPickPanel');
const buffTitleEl = document.getElementById('buffTitle');
const buffGrid = document.getElementById('buffGrid');
const gameOverPanel = document.getElementById('gameOverPanel');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

const finalScoreEl = document.getElementById('finalScore');
const finalStageEl = document.getElementById('finalStage');
const finalRealmEl = document.getElementById('finalRealm');
const finalBestEl = document.getElementById('finalBest');

let state = 'menu';
let w = 0;
let h = 0;
let groundY = 0;
let nowSec = 0;
let lastTs = 0;

const player = {
  x: 0,
  y: 0,
  targetX: 0,
  baseRadius: config.playerRadius,
  radius: config.playerRadius,
  invulnTimer: 0,
  facing: -1
};

const keys = {
  left: false,
  right: false
};

const sprite = {
  idleLeftImage: new Image(),
  idleRightImage: new Image(),
  walkLeftImage: new Image(),
  walkRightImage: new Image(),
  loadedIdleLeft: false,
  loadedIdleRight: false,
  loadedWalkLeft: false,
  loadedWalkRight: false,
  motion: 'idle',
  frameSize: {
    idle: { frameW: 0, frameH: 0 },
    walk: { frameW: 0, frameH: 0 }
  },
  frame: 0,
  timer: 0
};

const bgImage = {
  image: new Image(),
  loaded: false
};

const audio = {
  bgm: null,
  breakSfx: null,
  hitSfx: null,
  thunderPool: [],
  thunderIndex: 0
};

const realm = {
  config: smallRealmConfig,
  byId: new Map(),
  currentId: 'qi',
  stage: 1,
  breakValue: 0,
  needBreak: 1,
  pendingBuffPicks: 0
};

const game = {
  hp: config.initialHp,
  maxHp: config.initialHp,
  baseMaxHp: config.initialHp,
  boltDamage: config.initialBoltDamage,
  baseBoltDamage: config.initialBoltDamage,
  stage: 0,
  score: 0,
  timeSec: 0,
  bonusScore: 0,
  bestScore: 0,
  bestStage: 0,
  bestRealmText: '練氣 1',
  pointerActive: false,
  bolts: [],
  waveActive: false,
  waveGapTimer: 0,
  pendingWave: null,
  buffOptions: [],
  buffStacks: {},
  dao: null,
  hitFlashTimer: 0,
  breakAuraTimer: 0,
  stats: {
    followSpeed: config.playerFollowSpeed,
    telegraphBonusSec: 0,
    radiusMultiplier: 1,
    hitBreakGain: config.hitBreakGain,
    stageHeal: config.stageHealBase,
    breakGainMultiplier: 1,
    extraBoltsPerWave: 0,
    onHitHeal: 0,
    lureChance: 0,
    stageBonus: 0,
    trackChance: 0,
    doubleChance: 0,
    boltWidthMultiplier: 1
  }
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randRange(min, max) {
  return min + Math.random() * (max - min);
}

function minX() {
  return config.moveBoundPadding + player.radius;
}

function maxX() {
  return w - config.moveBoundPadding - player.radius;
}

function getBuffStack(id) {
  return game.buffStacks[id] || 0;
}

function currentDaoDef() {
  if (!game.dao) {
    return null;
  }
  return daoDefs.find((d) => d.id === game.dao) || null;
}

function unlockedDaoDefs() {
  return daoDefs.filter((dao) => {
    const req = dao.req || {};
    for (const key of Object.keys(req)) {
      if (getBuffStack(key) < req[key]) {
        return false;
      }
    }
    return true;
  });
}

function safeLoadBest() {
  try {
    return {
      score: Number(localStorage.getItem(storageKeys.bestScore) || 0),
      stage: Number(localStorage.getItem(storageKeys.bestStage) || 0),
      realmText: localStorage.getItem(storageKeys.bestRealm) || '練氣 1'
    };
  } catch (_err) {
    return { score: 0, stage: 0, realmText: '練氣 1' };
  }
}

function safeSaveBest() {
  try {
    localStorage.setItem(storageKeys.bestScore, String(game.bestScore));
    localStorage.setItem(storageKeys.bestStage, String(game.bestStage));
    localStorage.setItem(storageKeys.bestRealm, game.bestRealmText);
  } catch (_err) {
    // ignore storage issues
  }
}

function buildRealmIndex() {
  realm.byId = new Map();
  for (const item of realm.config.realms) {
    realm.byId.set(item.id, item);
  }
}

function currentRealm() {
  return realm.byId.get(realm.currentId);
}

function currentRealmStageData() {
  const r = currentRealm();
  if (!r) {
    return null;
  }
  return r.stages.find((item) => item.stage === realm.stage) || r.stages[r.stages.length - 1];
}

function isBreakGaugeCapped() {
  const r = currentRealm();
  return Boolean(r && r.id === 'spirit' && realm.stage >= 3);
}

function updateNeedBreak() {
  if (isBreakGaugeCapped()) {
    realm.needBreak = 0;
    realm.breakValue = 0;
    return;
  }
  const stageData = currentRealmStageData();
  const rawNeed = stageData ? stageData.need_break : 40;
  realm.needBreak = Math.max(1, rawNeed);
}

function realmLabel() {
  const r = currentRealm();
  const realmName = r ? r.name : '未知';
  const stageLabels = ['初期', '中期', '後期'];
  const suffix = stageLabels[clamp(realm.stage, 1, 3) - 1] || '初期';
  return realmName + suffix;
}

function clampBoltDamage() {
  const maxAllowed = Math.ceil(game.maxHp * config.maxDamageRatio);
  game.boltDamage = clamp(game.boltDamage, 3, maxAllowed);
}

function refreshDerivedStats() {
  const tiegu = getBuffStack('tiegu');
  const gangqi = getBuffStack('gangqi');
  const jinshen = getBuffStack('jinshen');
  const huiqi = getBuffStack('huiqi');
  const lianxue = getBuffStack('lianxue');
  const huxin = getBuffStack('huxin');
  const wuxing = getBuffStack('wuxing');
  const ningshen = getBuffStack('ningshen');

  let maxHp = game.baseMaxHp + tiegu * 3 + jinshen * 6;
  let boltDamage = game.baseBoltDamage + jinshen - gangqi;
  let stageHeal = config.stageHealBase + huiqi + lianxue * 2;
  let breakGainMultiplier = 1 + wuxing * 0.25;
  let telegraphBonusSec = ningshen * 0.05;
  let extraBoltsPerWave = lianxue;
  let onHitHeal = huxin;

  const dao = currentDaoDef();
  if (dao) {
    if (dao.id === 'xuanwu') {
      boltDamage -= 4;
      maxHp += 20;
      stageHeal += 3;
    } else if (dao.id === 'changsheng') {
      stageHeal += 6;
      onHitHeal += 3;
      breakGainMultiplier += 0.2;
    } else if (dao.id === 'tongming') {
      breakGainMultiplier += 0.5;
      telegraphBonusSec += 0.2;
      stageHeal += 2;
    } else if (dao.id === 'xuelian') {
      maxHp *= 2;
      extraBoltsPerWave += 2;
      stageHeal += 6;
    }
  }

  game.maxHp = Math.round(maxHp);
  game.hp = clamp(game.hp, 0, game.maxHp);

  game.boltDamage = Math.round(boltDamage);
  clampBoltDamage();

  game.stats.followSpeed = config.playerFollowSpeed;
  game.stats.telegraphBonusSec = telegraphBonusSec;
  game.stats.radiusMultiplier = 1;
  game.stats.hitBreakGain = config.hitBreakGain;
  game.stats.stageHeal = Math.max(0, stageHeal);
  game.stats.breakGainMultiplier = breakGainMultiplier;
  game.stats.extraBoltsPerWave = extraBoltsPerWave;
  game.stats.onHitHeal = onHitHeal;
  game.stats.lureChance = 0;
  game.stats.stageBonus = 0;

  player.radius = player.baseRadius * game.stats.radiusMultiplier;
  player.y = groundY - player.radius;
  player.x = clamp(player.x, minX(), maxX());
  player.targetX = clamp(player.targetX, minX(), maxX());

}

function buffSummaryText() {
  const parts = [];
  for (const def of buffDefs) {
    const stack = getBuffStack(def.id);
    if (stack > 0) {
      parts.push(`${def.name}${stack}`);
    }
  }
  return parts.length ? parts.join('、') : '無';
}

function recomputeScore() {
  game.score = game.stage * config.scorePerStage + Math.floor(game.timeSec) + game.bonusScore;
}

function formatRestTime(sec) {
  const clamped = Math.max(0, sec);
  const total = Math.ceil(clamped);
  const mm = String(Math.floor(total / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function updateWaveBanner() {
  if (!waveStatusEl || !waveStageEl) {
    return;
  }

  if (state === 'playing') {
    if (game.waveActive) {
      waveStatusEl.textContent = '渡劫開始';
    } else {
      waveStatusEl.textContent = formatRestTime(game.waveGapTimer);
    }
  } else if (state === 'buff_pick') {
    waveStatusEl.textContent = '天賦選擇中';
  } else if (state === 'gameover') {
    waveStatusEl.textContent = '渡劫失敗';
  } else {
    waveStatusEl.textContent = '準備中';
  }

  waveStageEl.textContent = '渡劫次數：' + String(game.stage);
}

function updateHud() {
  hpEl.textContent = `${Math.floor(game.hp)}/${game.maxHp}`;
  scoreEl.textContent = String(game.score);
  bestEl.textContent = String(game.bestScore);
  realmEl.textContent = realmLabel();

  if (isBreakGaugeCapped()) {
    breakFillEl.style.width = '100%';
    breakTextEl.textContent = '0/0';
  } else {
    const breakRatio = clamp(realm.breakValue / realm.needBreak, 0, 1);
    breakFillEl.style.width = `${breakRatio * 100}%`;
    breakTextEl.textContent = `${realm.breakValue}/${realm.needBreak}`;
  }
  buffsEl.textContent = buffSummaryText();
  if (daoLabelEl) {
    daoLabelEl.textContent = '道途：' + (currentDaoDef() ? currentDaoDef().name : '無');
  }
  updateWaveBanner();
}

function initSprite() {
  const setFrameSizeFrom = (motion, img) => {
    const cols = motion === 'walk' ? config.spriteWalkCols : config.spriteIdleCols;
    const rows = motion === 'walk' ? config.spriteWalkRows : config.spriteIdleRows;
    if (!sprite.frameSize[motion].frameW || !sprite.frameSize[motion].frameH) {
      sprite.frameSize[motion].frameW = img.naturalWidth / cols;
      sprite.frameSize[motion].frameH = img.naturalHeight / rows;
    }
  };

  sprite.idleLeftImage.decoding = 'async';
  sprite.idleRightImage.decoding = 'async';
  sprite.walkLeftImage.decoding = 'async';
  sprite.walkRightImage.decoding = 'async';

  sprite.idleLeftImage.onload = () => {
    sprite.loadedIdleLeft = true;
    setFrameSizeFrom('idle', sprite.idleLeftImage);
  };
  sprite.idleLeftImage.onerror = () => {
    sprite.loadedIdleLeft = false;
  };

  sprite.idleRightImage.onload = () => {
    sprite.loadedIdleRight = true;
    setFrameSizeFrom('idle', sprite.idleRightImage);
  };
  sprite.idleRightImage.onerror = () => {
    sprite.loadedIdleRight = false;
  };

  sprite.walkLeftImage.onload = () => {
    sprite.loadedWalkLeft = true;
    setFrameSizeFrom('walk', sprite.walkLeftImage);
  };
  sprite.walkLeftImage.onerror = () => {
    sprite.loadedWalkLeft = false;
  };

  sprite.walkRightImage.onload = () => {
    sprite.loadedWalkRight = true;
    setFrameSizeFrom('walk', sprite.walkRightImage);
  };
  sprite.walkRightImage.onerror = () => {
    sprite.loadedWalkRight = false;
  };

  sprite.idleLeftImage.src = config.spriteIdlePathLeft;
  sprite.idleRightImage.src = config.spriteIdlePathRight;
  sprite.walkLeftImage.src = config.spriteWalkPathLeft;
  sprite.walkRightImage.src = config.spriteWalkPathRight;
}

function spriteMetaByMotion(motion) {
  if (motion === 'walk') {
    return {
      cols: config.spriteWalkCols,
      rows: config.spriteWalkRows,
      totalFrames: config.spriteWalkFrames,
      frameW: sprite.frameSize.walk.frameW,
      frameH: sprite.frameSize.walk.frameH
    };
  }

  return {
    cols: config.spriteIdleCols,
    rows: config.spriteIdleRows,
    totalFrames: config.spriteIdleFrames,
    frameW: sprite.frameSize.idle.frameW,
    frameH: sprite.frameSize.idle.frameH
  };
}

function initBackground() {
  bgImage.image.decoding = 'async';
  bgImage.image.onload = () => {
    bgImage.loaded = true;
  };
  bgImage.image.onerror = () => {
    bgImage.loaded = false;
  };
  bgImage.image.src = config.bgPath;
}

function initAudio() {
  audio.bgm = new Audio(config.bgmPath);
  audio.bgm.loop = true;
  audio.bgm.volume = clamp(config.bgmVolume, 0, 1);
  audio.bgm.preload = 'auto';

  audio.breakSfx = new Audio(config.sfxBreakPath);
  audio.breakSfx.volume = clamp(config.sfxVolume, 0, 1);
  audio.breakSfx.preload = 'auto';

  audio.hitSfx = new Audio(config.sfxHitPath);
  audio.hitSfx.volume = clamp(config.sfxVolume, 0, 1);
  audio.hitSfx.preload = 'auto';

  audio.thunderPool = [];
  audio.thunderIndex = 0;
  const poolSize = Math.max(1, Math.floor(config.thunderPoolSize));
  for (let i = 0; i < poolSize; i += 1) {
    const thunderClip = new Audio(config.sfxThunderPath);
    thunderClip.volume = clamp(config.thunderVolume, 0, 1);
    thunderClip.preload = 'auto';
    audio.thunderPool.push(thunderClip);
  }
}

function playBgm() {
  if (!audio.bgm) {
    return;
  }
  const p = audio.bgm.play();
  if (p && typeof p.catch === 'function') {
    p.catch(() => {});
  }
}

function playSfx(kind) {
  let clip = null;
  if (kind === 'break') {
    clip = audio.breakSfx;
  } else if (kind === 'hit') {
    clip = audio.hitSfx;
  } else if (kind === 'thunder') {
    if (!audio.thunderPool.length) {
      return;
    }
    clip = audio.thunderPool[audio.thunderIndex];
    audio.thunderIndex = (audio.thunderIndex + 1) % audio.thunderPool.length;
  }
  if (!clip) {
    return;
  }
  clip.currentTime = 0;
  const p = clip.play();
  if (p && typeof p.catch === 'function') {
    p.catch(() => {});
  }
}

function resize() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const rect = viewportEl ? viewportEl.getBoundingClientRect() : null;
  w = Math.max(1, Math.floor(rect ? rect.width : window.innerWidth));
  h = Math.max(1, Math.floor(rect ? rect.height : window.innerHeight));
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  groundY = Math.min(h - 6, h * config.groundYRatio + config.groundYOffsetPx);
  player.y = groundY - player.radius;
  player.x = clamp(player.x || w * 0.5, minX(), maxX());
  player.targetX = clamp(player.targetX || player.x, minX(), maxX());
}

function resetRealmProgress() {
  realm.currentId = 'qi';
  realm.stage = 1;
  realm.breakValue = 0;
  realm.pendingBuffPicks = 0;
  updateNeedBreak();
}

function resetRound() {
  game.hp = config.initialHp;
  game.maxHp = config.initialHp;
  game.baseMaxHp = config.initialHp;
  game.boltDamage = config.initialBoltDamage;
  game.baseBoltDamage = config.initialBoltDamage;
  game.stage = 0;
  game.score = 0;
  game.timeSec = 0;
  game.bonusScore = 0;
  game.pointerActive = false;
  game.bolts = [];
  game.waveActive = false;
  game.waveGapTimer = 0;
  game.pendingWave = null;
  game.buffOptions = [];
  game.buffStacks = {};
  game.dao = null;
  game.hitFlashTimer = 0;
  game.breakAuraTimer = 0;

  player.x = w * 0.5;
  player.targetX = player.x;
  player.invulnTimer = 0;
  player.facing = -1;

  sprite.frame = 0;
  sprite.timer = 0;
  sprite.motion = 'idle';

  resetRealmProgress();
  refreshDerivedStats();
  recomputeScore();
  updateHud();
}

function calcBoltsByStage(stage) {
  let bolts = Math.min(10, 1 + Math.floor(stage / 4));
  bolts += game.stats.extraBoltsPerWave;
  if (game.timeSec > 600) {
    bolts += 1 + Math.floor((game.timeSec - 600) / 40);
  }
  if (Math.random() < game.stats.lureChance) {
    bolts += 1;
  }
  return Math.min(10, bolts);
}

function calcWaveGap(stage) {
  const early = 1 + Math.floor(game.timeSec / 60) * 0.03;
  const late = game.timeSec > 600 ? Math.floor((game.timeSec - 600) / 30) * 0.12 : 0;
  const timeFactor = early + late;
  return Math.max(0.35, 1.1 - stage * 0.02) / timeFactor;
}

function calcTelegraph(stage) {
  const early = 1 + Math.floor(game.timeSec / 60) * 0.03;
  const late = game.timeSec > 600 ? Math.floor((game.timeSec - 600) / 30) * 0.12 : 0;
  const timeFactor = early + late;
  const base =
    Math.max(0.22, 0.55 - stage * 0.006) + game.stats.telegraphBonusSec + config.telegraphBaseBonusSec;
  return base / timeFactor;
}

function classifyBolt(stage) {
  if (stage <= 7) {
    return 'normal';
  }

  const roll = Math.random();
  if (stage <= 15) {
    return roll < 0.3 ? 'track' : 'normal';
  }

  if (roll < 0.45) {
    return 'normal';
  }
  if (roll < 0.8) {
    return 'track';
  }
  return 'chain';
}

function makeWavePlan() {
  const stage = Math.max(1, game.stage + 1);
  const count = calcBoltsByStage(stage);
  const telegraph = calcTelegraph(stage);
  const waveGap = config.waveRestSec;
  const boltWidth = config.baseBoltWidth;
  const bolts = [];
  let launchOffset = randRange(0.1, 0.35);

  for (let i = 0; i < count; i += 1) {
    const kind = classifyBolt(stage);
    const x = randRange(minX(), maxX());
    if (i > 0) {
      launchOffset += randRange(0.1, 1.0);
    }
    bolts.push({
      x,
      width: boltWidth,
      kind,
      phase: 'queued',
      timer: launchOffset,
      telegraphSec: telegraph,
      hitAwarded: false,
      targetX: x,
      startX: x
    });
  }

  return { waveGap, bolts };
}

function prepareNextWave(immediate = false) {
  if (state !== 'playing') {
    return;
  }

  game.pendingWave = makeWavePlan();
  game.waveGapTimer = immediate ? 0 : config.waveRestSec;
  updateWaveBanner();
}

function startPendingWave() {
  if (!game.pendingWave) {
    return;
  }

  game.bolts = game.pendingWave.bolts.map((bolt) => ({ ...bolt }));
  game.pendingWave = null;
  game.waveActive = true;
  updateWaveBanner();
}

function movePlayer(pointerX) {
  if (pointerX > player.x + 0.5) {
    player.facing = 1;
  } else if (pointerX < player.x - 0.5) {
    player.facing = -1;
  }
  player.targetX = clamp(pointerX, minX(), maxX());
}

function pointerToGameX(clientX) {
  const rect = canvas.getBoundingClientRect();
  return clientX - rect.left;
}

function awardBreak(value) {
  if (isBreakGaugeCapped()) {
    return;
  }
  realm.breakValue += value;
  updateHud();
}

function applyHitFeedback() {
  game.hitFlashTimer = config.hitFlashSec;
  playSfx('hit');
  if (config.enableVibration && navigator.vibrate) {
    navigator.vibrate(45);
  }
}

function resolveNearOrHit(bolt) {
  const hitRadius = config.hitRadius * game.stats.radiusMultiplier + player.radius * 0.6;
  let hit = false;

  if (Array.isArray(bolt.path) && bolt.path.length > 1) {
    const px = player.x;
    const py = player.y;
    let minDist = Infinity;
    for (let i = 0; i < bolt.path.length - 1; i += 1) {
      const a = bolt.path[i];
      const b = bolt.path[i + 1];
      const abx = b.x - a.x;
      const aby = b.y - a.y;
      const apx = px - a.x;
      const apy = py - a.y;
      const ab2 = abx * abx + aby * aby || 1;
      const t = clamp((apx * abx + apy * aby) / ab2, 0, 1);
      const cx = a.x + abx * t;
      const cy = a.y + aby * t;
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < minDist) {
        minDist = dist;
      }
    }
    hit = minDist <= hitRadius;
  } else {
    const dx = Math.abs(player.x - bolt.x);
    hit = dx <= hitRadius;
  }

  if (player.invulnTimer <= 0 && hit) {
    game.hp = Math.max(0, game.hp - game.boltDamage);
    if (game.hp <= 0) {
      applyHitFeedback();
      endGame();
      return;
    }
    if (game.stats.onHitHeal > 0) {
      game.hp = Math.min(game.maxHp, game.hp + game.stats.onHitHeal);
    }
    player.invulnTimer = config.hitInvulnSec;
    applyHitFeedback();

    if (!bolt.hitAwarded) {
      awardBreak(Math.round(game.stats.hitBreakGain * game.stats.breakGainMultiplier));
      bolt.hitAwarded = true;
    }

  }
}

function buildBoltPath(startX, endX, segments) {
  const points = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const y = t * groundY;
    const envelope = Math.sin(Math.PI * t);
    let x = startX + (endX - startX) * t;

    if (i !== 0 && i !== segments) {
      const dir = i % 2 === 0 ? -1 : 1;
      const amp = 18;
      x += dir * amp * envelope;
    }

    points.push({ x, y });
  }
  return points;
}

function drawBoltPath(points, strokeStyle, lineWidth) {
  if (!points || points.length < 2) {
    return;
  }

  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
}

function tryBreakthrough() {
  if (isBreakGaugeCapped()) {
    realm.breakValue = 0;
    realm.needBreak = 0;
    return;
  }
  if (realm.breakValue < realm.needBreak) {
    return;
  }

  const current = currentRealm();
  if (!current) {
    return;
  }

  if (realm.stage < current.max_stage) {
    realm.stage += 1;
  } else if (current.next_id) {
    realm.currentId = current.next_id;
    realm.stage = 1;
  } else {
    realm.breakValue = realm.needBreak;
    return;
  }

  realm.breakValue = 0;
  realm.pendingBuffPicks += 1;

  const oldMaxHp = game.maxHp;
  game.baseMaxHp += config.realmBreakthroughMaxHpUp;
  game.baseBoltDamage += config.realmBreakthroughDamageUp;
  refreshDerivedStats();
  const newMaxHp = game.maxHp;
  game.hp = clamp(game.hp + (newMaxHp - oldMaxHp), 0, newMaxHp);
  clampBoltDamage();
  updateNeedBreak();
  updateHud();
  game.breakAuraTimer = config.breakAuraSec;
  playSfx('break');

  if (state === 'playing') {
    enterBuffPick();
  }
}

function finishWave() {
  game.waveActive = false;
  game.stage += 1;

  game.hp = Math.min(game.maxHp, game.hp + game.stats.stageHeal);

  game.baseBoltDamage += 1;

  game.bonusScore += game.stats.stageBonus;

  refreshDerivedStats();
  awardBreak(Math.round(config.stageBreakGain * game.stats.breakGainMultiplier));
  tryBreakthrough();

  if (state === 'playing') {
    prepareNextWave();
  }

  recomputeScore();
  updateHud();
}

function updateWave(dt) {
  if (state !== 'playing') {
    return;
  }

  if (!game.waveActive) {
    game.waveGapTimer -= dt;
    if (game.waveGapTimer <= 0) {
      startPendingWave();
    }
    return;
  }

  for (let i = game.bolts.length - 1; i >= 0; i -= 1) {
    const bolt = game.bolts[i];
    bolt.timer -= dt;

    if (bolt.phase === 'queued' && bolt.timer <= 0) {
      if (bolt.kind === 'track') {
        bolt.startX = bolt.x;
        bolt.targetX = clamp(player.x, minX(), maxX());
      }
      bolt.phase = 'telegraph';
      bolt.timer = bolt.telegraphSec;
      continue;
    }

    if (bolt.phase === 'telegraph' && bolt.timer <= 0) {
      if (bolt.kind === 'track') {
        bolt.x = clamp(bolt.targetX, minX(), maxX());
      }

      if (bolt.kind === 'chain') {
        bolt.phase = 'strike1';
      } else {
        bolt.phase = 'strike';
      }
      bolt.timer = 0.1;
      bolt.path = buildBoltPath(bolt.kind === 'track' ? bolt.startX : bolt.x, bolt.x, config.boltZigzagSegments);
      playSfx('thunder');
      resolveNearOrHit(bolt);
      if (state !== 'playing') {
        return;
      }
      continue;
    }

    if (bolt.phase === 'strike' && bolt.timer <= 0) {
      game.bolts.splice(i, 1);
      continue;
    }

    if (bolt.phase === 'strike1' && bolt.timer <= 0) {
      bolt.phase = 'chain_wait1';
      bolt.timer = 0.18;
      continue;
    }

    if (bolt.phase === 'chain_wait1' && bolt.timer <= 0) {
      bolt.phase = 'chain_telegraph2';
      bolt.timer = 0.1;
      continue;
    }

    if (bolt.phase === 'chain_telegraph2' && bolt.timer <= 0) {
      bolt.phase = 'strike2';
      bolt.timer = 0.1;
      bolt.path = buildBoltPath(bolt.x, bolt.x, config.boltZigzagSegments);
      playSfx('thunder');
      resolveNearOrHit(bolt);
      if (state !== 'playing') {
        return;
      }
      continue;
    }

    if (bolt.phase === 'strike2' && bolt.timer <= 0) {
      bolt.phase = 'chain_wait2';
      bolt.timer = 0.18;
      continue;
    }

    if (bolt.phase === 'chain_wait2' && bolt.timer <= 0) {
      bolt.phase = 'chain_telegraph3';
      bolt.timer = 0.1;
      continue;
    }

    if (bolt.phase === 'chain_telegraph3' && bolt.timer <= 0) {
      bolt.phase = 'strike3';
      bolt.timer = 0.1;
      bolt.path = buildBoltPath(bolt.x, bolt.x, config.boltZigzagSegments);
      playSfx('thunder');
      resolveNearOrHit(bolt);
      if (state !== 'playing') {
        return;
      }
      continue;
    }

    if (bolt.phase === 'strike3' && bolt.timer <= 0) {
      game.bolts.splice(i, 1);
    }

    if (
      bolt.phase === 'strike' ||
      bolt.phase === 'strike1' ||
      bolt.phase === 'strike2' ||
      bolt.phase === 'strike3'
    ) {
      resolveNearOrHit(bolt);
      if (state !== 'playing') {
        return;
      }
    }
  }

  if (game.waveActive && game.bolts.length === 0) {
    finishWave();
  }
}

function weightedPickUnique(pool, count) {
  const picked = [];
  const source = pool.slice();

  while (picked.length < count && source.length > 0) {
    let weightSum = 0;
    for (const item of source) {
      weightSum += item.weight;
    }

    let roll = Math.random() * weightSum;
    let chosenIndex = 0;
    for (let i = 0; i < source.length; i += 1) {
      roll -= source[i].weight;
      if (roll <= 0) {
        chosenIndex = i;
        break;
      }
    }

    picked.push(source[chosenIndex]);
    source.splice(chosenIndex, 1);
  }

  return picked;
}

function rollBuffOptions() {
  const availableBuffs = buffDefs.filter((buff) => getBuffStack(buff.id) < buff.maxStacks);
  const unlockedDaos = game.dao ? [] : unlockedDaoDefs();

  const pickRandom = (pool, count) => {
    const source = pool.slice();
    const picked = [];
    while (picked.length < count && source.length > 0) {
      const idx = Math.floor(Math.random() * source.length);
      picked.push(source[idx]);
      source.splice(idx, 1);
    }
    return picked;
  };

  let options = [];
  if (!game.dao && unlockedDaos.length >= 2) {
    options = options.concat(pickRandom(unlockedDaos, 2));
    options = options.concat(pickRandom(availableBuffs, 1));
  } else if (!game.dao && unlockedDaos.length === 1) {
    options = options.concat(unlockedDaos[0]);
    options = options.concat(pickRandom(availableBuffs, 2));
  } else {
    options = options.concat(pickRandom(availableBuffs, 3));
  }

  if (options.length < 3) {
    const existingIds = new Set(options.map((item) => item.id));
    const fallbackBuffs = availableBuffs.filter((buff) => !existingIds.has(buff.id));
    options = options.concat(pickRandom(fallbackBuffs, 3 - options.length));
  }

  game.buffOptions = options.slice(0, 3);
}

function renderBuffOptions() {
  buffGrid.innerHTML = '';
  for (const buff of game.buffOptions) {
    const isDao = buff.type === 'dao';
    const stack = isDao ? 0 : getBuffStack(buff.id);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'buff-card';
    btn.dataset.buffId = buff.id;
    btn.innerHTML = `
      <h3>${buff.name}</h3>
      <p>${buff.desc}</p>
      <div class="buff-lv">${isDao ? '道途' : `等級 ${stack}/${buff.maxStacks}`}</div>
    `;
    buffGrid.appendChild(btn);
  }
}

function enterBuffPick() {
  state = 'buff_pick';
  overlay.style.display = 'grid';
  startPanel.hidden = true;
  gameOverPanel.hidden = true;
  buffPickPanel.hidden = false;

  buffTitleEl.textContent = '突破成功！選擇一項天賦';
  rollBuffOptions();
  if (game.buffOptions.length === 0) {
    buffPickPanel.hidden = true;
    overlay.style.display = 'none';
    state = 'playing';
    prepareNextWave();
    updateWaveBanner();
    return;
  }
  renderBuffOptions();
  updateWaveBanner();
}

function applyBuff(buffId) {
  const def = buffDefs.find((item) => item.id === buffId) || daoDefs.find((item) => item.id === buffId);
  if (!def) {
    return;
  }

  if (def.type === 'dao') {
    if (game.dao) {
      return;
    }
    game.dao = def.id;
    refreshDerivedStats();
    recomputeScore();
    updateHud();
    return;
  }

  const current = getBuffStack(buffId);
  if (current >= def.maxStacks) {
    return;
  }

  game.buffStacks[buffId] = current + 1;
  refreshDerivedStats();
  game.hp = Math.min(game.maxHp, game.hp);

  recomputeScore();
  updateHud();
}

function onBuffPickClick(ev) {
  const btn = ev.target.closest('.buff-card');
  if (!btn) {
    return;
  }

  applyBuff(btn.dataset.buffId);

  realm.pendingBuffPicks = Math.max(0, realm.pendingBuffPicks - 1);

  if (realm.pendingBuffPicks > 0) {
    buffTitleEl.textContent = '再突破！選擇一項天賦（剩餘 ' + String(realm.pendingBuffPicks) + ' 次）';
    rollBuffOptions();
    if (game.buffOptions.length === 0) {
      realm.pendingBuffPicks = 0;
      buffPickPanel.hidden = true;
      overlay.style.display = 'none';
      state = 'playing';
      prepareNextWave();
      updateWaveBanner();
      return;
    }
    renderBuffOptions();
    return;
  }

  buffPickPanel.hidden = true;
  overlay.style.display = 'none';
  state = 'playing';
  prepareNextWave();
  updateWaveBanner();
}

function startGame() {
  resetRound();
  playBgm();
  state = 'playing';
  overlay.style.display = 'none';
  startPanel.hidden = true;
  buffPickPanel.hidden = true;
  gameOverPanel.hidden = true;
  prepareNextWave(true);
  startPendingWave();
  updateWaveBanner();
}

function endGame() {
  state = 'gameover';
  game.waveActive = false;
  game.waveGapTimer = 0;
  game.pendingWave = null;
  game.bolts = [];

  if (game.score > game.bestScore) {
    game.bestScore = game.score;
  }
  if (game.stage > game.bestStage) {
    game.bestStage = game.stage;
  }
  game.bestRealmText = realmLabel();
  safeSaveBest();

  finalScoreEl.textContent = String(game.score);
  finalStageEl.textContent = String(game.stage);
  finalRealmEl.textContent = realmLabel();
  finalBestEl.textContent =
    String(game.bestScore) + '(渡劫' + String(game.bestStage) + '次 / ' + game.bestRealmText + ')';

  overlay.style.display = 'grid';
  startPanel.hidden = true;
  buffPickPanel.hidden = true;
  gameOverPanel.hidden = false;
  updateWaveBanner();
}

function onPointerDown(ev) {
  void ev;
}

function onPointerMove(ev) {
  void ev;
}

function onPointerUp(ev) {
  void ev;
}

function onKeyDown(ev) {
  if (ev.key === 'ArrowLeft' || ev.key === 'a' || ev.key === 'A') {
    keys.left = true;
    ev.preventDefault();
  } else if (ev.key === 'ArrowRight' || ev.key === 'd' || ev.key === 'D') {
    keys.right = true;
    ev.preventDefault();
  }
}

function onKeyUp(ev) {
  if (ev.key === 'ArrowLeft' || ev.key === 'a' || ev.key === 'A') {
    keys.left = false;
    ev.preventDefault();
  } else if (ev.key === 'ArrowRight' || ev.key === 'd' || ev.key === 'D') {
    keys.right = false;
    ev.preventDefault();
  }
}

function updateSprite(dt, moving) {
  if (
    !sprite.loadedIdleLeft &&
    !sprite.loadedIdleRight &&
    !sprite.loadedWalkLeft &&
    !sprite.loadedWalkRight
  ) {
    return;
  }

  const nextMotion = moving ? 'walk' : 'idle';
  if (sprite.motion !== nextMotion) {
    sprite.motion = nextMotion;
    sprite.frame = 0;
    sprite.timer = 0;
  }

  const frameDuration = 1 / config.spriteFps;
  const meta = spriteMetaByMotion(sprite.motion);
  sprite.timer += dt;
  while (sprite.timer >= frameDuration) {
    sprite.timer -= frameDuration;
    sprite.frame = (sprite.frame + 1) % meta.totalFrames;
  }
}

function update(dt) {
  if (state !== 'playing' && state !== 'buff_pick') {
    return;
  }

  const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  if (dir !== 0) {
    movePlayer(player.targetX + dir * config.keyboardMoveSpeed * dt);
  }

  const prevX = player.x;
  player.x += (player.targetX - player.x) * game.stats.followSpeed;
  player.x = clamp(player.x, minX(), maxX());

  const moveDx = player.x - prevX;
  if (moveDx > 0.1) {
    player.facing = 1;
  } else if (moveDx < -0.1) {
    player.facing = -1;
  }

  const moving = Math.abs(moveDx) > 0.08 || Math.abs(player.targetX - player.x) > 1.5;
  updateSprite(dt, moving);

  if (player.invulnTimer > 0) {
    player.invulnTimer = Math.max(0, player.invulnTimer - dt);
  }

  if (state === 'playing') {
    game.timeSec += dt;
    updateWave(dt);
    recomputeScore();
    tryBreakthrough();
    updateHud();
  }

  if (game.hitFlashTimer > 0) {
    game.hitFlashTimer = Math.max(0, game.hitFlashTimer - dt);
  }
  if (game.breakAuraTimer > 0) {
    game.breakAuraTimer = Math.max(0, game.breakAuraTimer - dt);
  }
}

function drawBackground() {
  if (bgImage.loaded) {
    const img = bgImage.image;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const viewRatio = w / h;
    let sx = 0;
    let sy = 0;
    let sw = img.naturalWidth;
    let sh = img.naturalHeight;

    if (imgRatio > viewRatio) {
      sw = Math.floor(img.naturalHeight * viewRatio);
      sx = Math.floor((img.naturalWidth - sw) * 0.5);
    } else {
      sh = Math.floor(img.naturalWidth / viewRatio);
      sy = Math.floor((img.naturalHeight - sh) * clamp(config.bgFocusY, 0, 1));
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  } else {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#071237');
  grad.addColorStop(1, '#02040d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  }

}

function drawFallbackPlayer() {
  ctx.fillStyle = '#7eb2ff';
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#d7e9ff';
  ctx.fillRect(player.x - 4, player.y - player.radius - 18, 8, 14);
}

function drawSpritePlayer() {
  const preferRight = player.facing === 1;
  const isWalk = sprite.motion === 'walk';

  let spriteImage = null;
  let drawMotion = isWalk ? 'walk' : 'idle';
  if (isWalk) {
    if (preferRight && sprite.loadedWalkRight) {
      spriteImage = sprite.walkRightImage;
    } else if (!preferRight && sprite.loadedWalkLeft) {
      spriteImage = sprite.walkLeftImage;
    }
  } else {
    if (preferRight && sprite.loadedIdleRight) {
      spriteImage = sprite.idleRightImage;
    } else if (!preferRight && sprite.loadedIdleLeft) {
      spriteImage = sprite.idleLeftImage;
    }
  }

  if (!spriteImage) {
    if (preferRight && sprite.loadedIdleRight) {
      spriteImage = sprite.idleRightImage;
      drawMotion = 'idle';
    } else if (!preferRight && sprite.loadedIdleLeft) {
      spriteImage = sprite.idleLeftImage;
      drawMotion = 'idle';
    } else if (preferRight && sprite.loadedWalkRight) {
      spriteImage = sprite.walkRightImage;
      drawMotion = 'walk';
    } else if (!preferRight && sprite.loadedWalkLeft) {
      spriteImage = sprite.walkLeftImage;
      drawMotion = 'walk';
    }
  }

  if (!spriteImage) {
    drawFallbackPlayer();
    return;
  }

  const meta = spriteMetaByMotion(drawMotion);
  if (!meta.frameW || !meta.frameH) {
    drawFallbackPlayer();
    return;
  }

  const frameIndex = sprite.frame % meta.totalFrames;
  const frameCol = frameIndex % meta.cols;
  const frameRow = Math.floor(frameIndex / meta.cols);
  const srcX = frameCol * meta.frameW;
  const srcY = frameRow * meta.frameH;
  const drawW = meta.frameW * config.spriteScale;
  const drawH = meta.frameH * config.spriteScale;
  const drawX = player.x - drawW * 0.5;
  const drawY = groundY - drawH + config.playerDrawOffsetY;
  ctx.drawImage(spriteImage, srcX, srcY, meta.frameW, meta.frameH, drawX, drawY, drawW, drawH);
}

function drawPlayer() {
  ctx.save();
  const blinking = player.invulnTimer > 0 && Math.floor(nowSec * 24) % 2 === 0;
  if (blinking) {
    ctx.globalAlpha = 0.45;
  }

  if (sprite.loadedIdleLeft || sprite.loadedIdleRight || sprite.loadedWalkLeft || sprite.loadedWalkRight) {
    drawSpritePlayer();
  } else {
    drawFallbackPlayer();
  }

  ctx.restore();
}

function drawBreakAura() {
  if (game.breakAuraTimer <= 0) {
    return;
  }

  const t = game.breakAuraTimer / config.breakAuraSec;
  const p = 1 - t;
  const centerX = player.x;
  const centerY = groundY - player.radius - 64;
  const radiusOuter = 46 + p * 84;
  const radiusInner = 26 + p * 40;
  const pulse = 1 + Math.sin(nowSec * 28) * 0.08;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const grad = ctx.createRadialGradient(
    centerX,
    centerY,
    radiusInner * 0.15,
    centerX,
    centerY,
    radiusOuter * 1.15
  );
  grad.addColorStop(0, `rgba(255, 248, 196, ${0.42 * t})`);
  grad.addColorStop(0.45, `rgba(255, 195, 102, ${0.36 * t})`);
  grad.addColorStop(0.78, `rgba(255, 132, 52, ${0.24 * t})`);
  grad.addColorStop(1, 'rgba(255, 120, 40, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radiusOuter * pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(255, 232, 170, ${0.9 * t})`;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radiusOuter * 0.78, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = `rgba(255, 170, 92, ${0.72 * t})`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radiusInner, 0, Math.PI * 2);
  ctx.stroke();

  const rayAlpha = 0.55 * t;
  ctx.strokeStyle = `rgba(255, 220, 148, ${rayAlpha})`;
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i += 1) {
    const a = nowSec * 1.8 + i * (Math.PI / 4);
    const r1 = radiusInner * 0.8;
    const r2 = radiusOuter * 0.92;
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(a) * r1, centerY + Math.sin(a) * r1);
    ctx.lineTo(centerX + Math.cos(a) * r2, centerY + Math.sin(a) * r2);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.9 * t;
  ctx.fillStyle = 'rgba(255, 245, 198, 0.6)';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 11 + p * 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBolts() {
  const telegraphPhases = new Set(['telegraph', 'chain_telegraph2', 'chain_telegraph3']);
  const strikePhases = new Set(['strike', 'strike1', 'strike2', 'strike3']);

  for (const bolt of game.bolts) {
    const palette = boltPalette[bolt.kind] || boltPalette.normal;

    if (bolt.phase === 'queued') {
      continue;
    }

    if (telegraphPhases.has(bolt.phase)) {
      const markerX = bolt.kind === 'track' ? bolt.targetX : bolt.x;
      const markerHeight = bolt.kind === 'track' ? config.trackTelegraphHeight : 36;
      const markerY = groundY - markerHeight;
      const markerW = bolt.width;
      ctx.fillStyle = palette.telegraph;
      ctx.beginPath();
      if (bolt.kind === 'track') {
        const dir = Math.sign((bolt.startX || markerX) - markerX) || -1;
        const tipX = markerX + dir * config.trackTelegraphTipOffset;
        ctx.moveTo(markerX - markerW * 0.55, groundY);
        ctx.lineTo(markerX + markerW * 0.45, groundY);
        ctx.lineTo(tipX, markerY);
      } else {
        ctx.moveTo(markerX - markerW * 0.5, groundY);
        ctx.lineTo(markerX + markerW * 0.5, groundY);
        ctx.lineTo(markerX, markerY);
      }
      ctx.closePath();
      ctx.fill();
      continue;
    }

    if (!strikePhases.has(bolt.phase)) {
      continue;
    }

    if (!bolt.path) {
      bolt.path = buildBoltPath(bolt.kind === 'track' ? bolt.startX : bolt.x, bolt.x, config.boltZigzagSegments);
    }

    drawBoltPath(bolt.path, palette.glow, Math.max(8, bolt.width * 0.68));
    drawBoltPath(bolt.path, palette.core, Math.max(3, bolt.width * 0.3));

    ctx.fillStyle = palette.ground;
    ctx.fillRect(bolt.x - bolt.width * 0.5, groundY - 8, bolt.width, 8);
  }
}

function drawHitFlash() {
  if (game.hitFlashTimer <= 0) {
    return;
  }

  const alpha = game.hitFlashTimer / config.hitFlashSec;
  ctx.fillStyle = `rgba(255,255,255,${0.35 * alpha})`;
  ctx.fillRect(0, 0, w, h);
}

function render() {
  drawBackground();
  drawPlayer();
  drawBolts();
  drawBreakAura();
  drawHitFlash();
}

function loop(ts) {
  if (!lastTs) {
    lastTs = ts;
  }
  const dt = Math.min(0.033, (ts - lastTs) / 1000);
  lastTs = ts;
  nowSec += dt;

  update(dt);
  render();
  requestAnimationFrame(loop);
}

function bindEvents() {
  window.addEventListener('resize', resize);

  canvas.addEventListener('pointerdown', onPointerDown, { passive: false });
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp, { passive: false });
  window.addEventListener('pointercancel', onPointerUp, { passive: false });
  window.addEventListener('keydown', onKeyDown, { passive: false });
  window.addEventListener('keyup', onKeyUp, { passive: false });

  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);
  buffGrid.addEventListener('click', onBuffPickClick);
}

async function loadRealmConfig() {
  realm.config = smallRealmConfig;
  buildRealmIndex();
}

async function init() {
  const best = safeLoadBest();
  game.bestScore = best.score;
  game.bestStage = best.stage;
  game.bestRealmText = best.realmText;

  await loadRealmConfig();

  initBackground();
  initSprite();
  initAudio();
  resize();
  resetRound();
  bindEvents();

  overlay.style.display = 'grid';
  startPanel.hidden = false;
  buffPickPanel.hidden = true;
  gameOverPanel.hidden = true;

  requestAnimationFrame(loop);
}

init();
