/**
 * 舰R牌将 · 强化装备(_qianghuazhuang) / 建造(_jianzaochuan) AI 决策模块
 * ------------------------------------------------------------------
 * 设计目标：
 *  1) 发动(ai.result.player)、选牌(check)、升级按钮(chooseButton ai) 三处
 *     共用同一套「付款方案 → 付款后局面 → 升级净增收益」评价，不再各算各的。
 *  2) 付款成本 = 牌面价值 + 生存/行动风险溢价；升级收益按付款后的真实手牌、
 *     真实射程/出杀次数/防御距离/溢出/后勤触发条件计算，并扣除经验点数的机会成本。
 *  3) 允许 AI 不强化：净收益不过线就不发动，不会为了“存经验”白扔好牌；
 *     只有手牌溢出时，“将弃之牌转经验”才被视为正当动机。
 *  4) 不改动任何强化成本(一级2点/二级3点)、建造规则与玩家手动操作流程；
 *     本模块只服务 AI 决策。
 *
 * 可测试性：本文件不 import 引擎，所有外部依赖通过
 *   env = { get, game, lib, ui, _status }
 * 注入；导出函数均为纯逻辑，可传入 mock player/game/get 做单元测试。
 */

/* ================= 可调参数（导出便于测试校准） ================= */

export const EXP_PT = 0.6;            // 每点强化经验的机会成本（≈半张低值手牌）
export const STORE_PT_VALUE = 0.45;   // 结算时剩余经验点的折现价值（存款，略低于即期）
export const OVERFLOW_DISCOUNT = 0.12; // 溢出位付款成本系数（反正回合结束要弃）
export const ACTIVATE_MIN = 0.4;      // 发动净收益门槛

export const UPGRADE_MARKS = ['mopaiup', 'jinengup', 'wuqiup', 'useshaup', 'jidongup', 'shoupaiup'];

/* ================= 基础工具（全部容错、可 mock） ================= */

function G(env) { return env.get; }

function eachPlayer(env, fn) {
    const game = env.game;
    try {
        if (game && Array.isArray(game.players)) {
            for (const p of game.players) fn(p);
            return;
        }
    } catch (e) { /* fallthrough */ }
    try {
        if (game && game.filterPlayer) {
            const list = game.filterPlayer();
            for (const p of list) fn(p);
        }
    } catch (e) { /* ignore */ }
}

function countPlayers(env, pred) {
    let n = 0;
    eachPlayer(env, p => { try { if (pred(p)) n++; } catch (e) {} });
    return n;
}

function hasPlayer(env, pred) {
    let f = false;
    eachPlayer(env, p => { try { if (!f && pred(p)) f = true; } catch (e) {} });
    return f;
}

function eachCard(env, player, pos, fn) {
    try {
        const cs = player.getCards(pos);
        if (cs) for (const c of cs) fn(c);
    } catch (e) { /* ignore */ }
}

export function countMark(player, mark) {
    try { return (player.countMark && player.countMark(mark)) || 0; } catch (e) { return 0; }
}

function hasSkill(player, s) {
    try { return !!(player.hasSkill && player.hasSkill(s)); } catch (e) { return false; }
}

function cardName(c) { return (c && c.name) || ''; }

function safeValue(env, card) {
    try {
        const v = G(env).value(card);
        return (typeof v === 'number' && !isNaN(v)) ? v : 3;
    } catch (e) { return 3; }
}
function safeSuit(env, card) {
    try { return G(env).suit(card) || ''; } catch (e) { return ''; }
}
function safeColor(env, card) {
    try { return G(env).color(card) || ''; } catch (e) { return ''; }
}
function safeType(env, card) {
    try { return G(env).type(card) || ''; } catch (e) { return ''; }
}
function safeSubtype(env, card) {
    try { return G(env).subtype(card) || ''; } catch (e) { return ''; }
}
function safeNature(env, card) {
    try { return G(env).nature(card) || ''; } catch (e) { return ''; }
}
function safePos(env, card) {
    try { return G(env).position(card) || 'h'; } catch (e) { return 'h'; }
}
function safeDist(env, from, to, method) {
    try {
        const d = G(env).distance(from, to, method);
        return (typeof d === 'number' && !isNaN(d)) ? d : 99;
    } catch (e) { return 99; }
}
function attackRange(env, player) {
    try {
        if (player.getAttackRange) {
            const r = player.getAttackRange();
            if (typeof r === 'number' && r > 0) return r;
        }
    } catch (e) { /* ignore */ }
    return 1;
}
function handLimit(env, player) {
    try {
        if (player.getHandcardLimit) {
            const l = player.getHandcardLimit();
            if (typeof l === 'number') return l;
        }
    } catch (e) { /* ignore */ }
    return player.maxHandcard || player.maxHp || 3;
}
function attitude(env, a, b) {
    try {
        const v = G(env).attitude(a, b);
        return (typeof v === 'number') ? v : 0;
    } catch (e) { return 0; }
}
function countCardsSafe(player, pos, pred) {
    try {
        if (!player.countCards) return 0;
        return pred ? player.countCards(pos, pred) : player.countCards(pos);
    } catch (e) { return 0; }
}
function shaUsedThisTurn(player) {
    try {
        if (!player.getHistory) return 0;
        return player.getHistory('useCard', evt =>
            evt.card && evt.card.name === 'sha' && (!evt.isPhaseUsing || evt.isPhaseUsing())).length;
    } catch (e) { return 0; }
}

/* ================= 手牌统计 / 局面上下文 ================= */

/**
 * 统计一组手牌的构成。
 * @returns {{total:number, sha:number, shan:number, tao:number, jiu:number,
 *            wuxie:number, trick:number, equip:number, usable:number}}
 */
export function handStats(env, player, cards) {
    const s = { total: cards.length, sha: 0, shan: 0, tao: 0, jiu: 0, wuxie: 0, trick: 0, equip: 0, usable: 0 };
    for (const c of cards) {
        const n = cardName(c);
        if (n === 'sha') s.sha++;
        else if (n === 'shan') s.shan++;
        else if (n === 'tao') s.tao++;
        else if (n === 'jiu') s.jiu++;
        else if (n === 'wuxie') s.wuxie++;
        const t = safeType(env, c);
        if (t === 'trick') s.trick++;
        else if (t === 'equip') s.equip++;
        try { if (player.hasUseTarget && player.hasUseTarget(c)) s.usable++; } catch (e) { /* ignore */ }
    }
    return s;
}

/* ================= 局面上下文（两层缓存） ================= */

/**
 * 全局不变量缓存：敌我态度、射程、威胁、技能适配基线等「同一次技能发动内不变」的量。
 * 用 WeakMap 按 event 对象缓存；同一 chooseButton 的多个按钮 / 同一 planPayment 的多个 k 值共享一份。
 * 失效 = event 对象生命周期（chooseButton 一次发动一个 event；planPayment 内部共享）。
 * 绝不跨 event 缓存含手牌的结论（stats/handAfter/paySet 仍每付款集增量算）。
 */
let _sharedCacheRef = new WeakMap();
/** 清空 shared 缓存（测试隔离用；正常游戏不需要——WeakMap 随 event 对象 GC）。 */
export function _resetSharedCache() { _sharedCacheRef = new WeakMap(); }

/**
 * 取/建本次发动的全局不变量快照。
 * @param {object} env
 * @param {object} player
 * @param {object|null} cacheKey  事件对象（chooseButton 的 _status.event 或 planPayment 自建帧）；
 *                                null/undefined → 不缓存（一次性调用）
 */
export function buildShared(env, player, cacheKey) {
    if (cacheKey != null && typeof cacheKey === 'object') {
        const hit = _sharedCacheRef.get(cacheKey);
        if (hit && hit.player === player) return hit;
    }
    const enemiesInRange = countPlayers(env, cur =>
        cur !== player && attitude(env, player, cur) < 0 && cur.inRange && cur.inRange(player));
    const enemiesTotal = countPlayers(env, cur => cur !== player && attitude(env, player, cur) < 0);
    const hasTargetInRange = hasPlayer(env, cur =>
        cur !== player && attitude(env, player, cur) < 0 && player.inRange && player.inRange(cur));
    const shaUsed = shaUsedThisTurn(player);
    const shaLimit = 1 + countMark(player, 'useshaup');
    const judgeThreat = countCardsSafe(player, 'j') > 0;
    const trickThreat = hasPlayer(env, cur =>
        cur !== player && attitude(env, player, cur) < 0 &&
        countCardsSafe(cur, 'h', c => safeType(env, c) === 'trick') > 0);
    const teamHasDamage = hasPlayer(env, cur =>
        cur !== player && attitude(env, player, cur) > 0 &&
        (hasSkill(cur, 'kaimuhangkong') || hasSkill(cur, 'zhongxunca') ||
            hasSkill(cur, 'fanjiandaodan') || hasSkill(cur, 'kaimuleiji')));

    /* —— jinengup 各分支的全局量（与付款集无关，一次算好）—— */
    const trickPressure = hasSkill(player, 'fangkongdaodan') ? countPlayers(env, cur =>
        cur !== player && attitude(env, player, cur) < 0 &&
        countCardsSafe(cur, 'h', c => safeType(env, c) == 'trick') > 0) : 0;
    const supportNeed = hasSkill(player, 'junfu') ? countPlayers(env, cur =>
        cur !== player && attitude(env, player, cur) > 0 &&
        (cur.hp <= 2 || countCardsSafe(cur, 'h') <= cur.hp)) : 0;
    const fangkong2NewProtected = (lv) => {   // fangkong2 的 lv→lv+1 新增保护人数
        if (!hasSkill(player, 'fangkong2')) return 0;
        const beforeRange = hasSkill(player, 'duikongfangyu') ? 5 : 1 + 2 * lv;
        const afterRange = hasSkill(player, 'duikongfangyu') ? 5 : 1 + 2 * (lv + 1);
        return countPlayers(env, cur =>
            cur !== player && attitude(env, player, cur) > 0 &&
            safeDist(env, player, cur) > beforeRange &&
            safeDist(env, player, cur) <= afterRange);
    };
    const armorPressureByLv = {};  // zhuangjiafh 按等级算一次敌人手牌属性压力
    const zhuangjiafhPressure = (lv) => {
        if (armorPressureByLv[lv] !== undefined) return armorPressureByLv[lv];
        const n = countPlayers(env, cur =>
            cur !== player && attitude(env, player, cur) < 0 &&
            countCardsSafe(cur, 'h', card => {
                if (lv <= 0) return safeNature(env, card) == 'fire';
                if (lv == 1) { const na = safeNature(env, card); return !!na && na != 'fire'; }
                return false;
            }) > 0);
        armorPressureByLv[lv] = n;
        return n;
    };
    // 敌我攻击范围快照（wuqiup/jidongup 增量用）
    const playerRange = attackRange(env, player);
    const enemyRanges = [];      // [{player, range, dist, inMyRange, outOfMyRangeBy1...}]
    eachPlayer(env, t => {
        if (t === player || attitude(env, player, t) >= 0) return;
        const d = safeDist(env, player, t, 'attack');
        const er = attackRange(env, t);
        enemyRanges.push({ t, d, er, canHitMe: d <= er, wouldMissAfterPlus1: d + 1 > er });
    });
    // 敌我效果查询（jinengup 的 getEnemyEffectInfo 底表）—— 按 card 名+属性缓存
    const effectCache = new Map();
    const enemyEffectInfo = function (card, nature, ignoreRange) {
        const ck = (card && card.name || '') + '|' + (nature || '') + '|' + (ignoreRange ? 1 : 0);
        const hit = effectCache.get(ck);
        if (hit) return hit;
        const info = { total: 0, best: 0, weak: 0 };
        eachPlayer(env, target => {
            if (target === player || attitude(env, player, target) >= 0) return;
            try {
                if (!ignoreRange && player.canUse && !player.canUse(card, target, false)) return;
            } catch (e) { return; }
            let effect = 0;
            try {
                effect = nature ? G(env).damageEffect(target, player, player, nature)
                    : G(env).effect(target, card, player, player);
            } catch (e) { /* ignore */ }
            if (effect > 0) {
                info.total += effect;
                info.best = Math.max(info.best, effect);
                if (target.hp <= 1 || countCardsSafe(target, 'h') === 0) info.weak++;
            }
        });
        effectCache.set(ck, info);
        return info;
    };
    // damageEffect 专用（不带 nature）—— 导弹回退路径用，缓存在 enemyEffectInfo 同一 Map
    const enemyDamageInfo = function (ignoreRange) {
        const ck = '__dmg__|' + (ignoreRange ? 1 : 0);
        const hit = effectCache.get(ck);
        if (hit) return hit;
        const info = { total: 0, best: 0, weak: 0 };
        eachPlayer(env, target => {
            if (target === player || attitude(env, player, target) >= 0) return;
            try {
                if (!ignoreRange && player.canUse && !player.canUse({ name: 'sha' }, target, false)) return;
            } catch (e) { return; }
            let effect = 0;
            try { effect = G(env).damageEffect(target, player, player); } catch (e) { /* ignore */ }
            if (effect > 0) {
                info.total += effect;
                info.best = Math.max(info.best, effect);
                if (target.hp <= 1 || countCardsSafe(target, 'h') === 0) info.weak++;
            }
        });
        effectCache.set(ck, info);
        return info;
    };
    const daodanNewTargets = (lv) => {   // fanjiandaodan 升级射程新增可打目标
        if (!hasSkill(player, 'fanjiandaodan')) return 0;
        const curRange = playerRange;
        const newRange = curRange + 2;
        return countPlayers(env, cur =>
            cur !== player && attitude(env, player, cur) < 0 &&
            safeDist(env, player, cur) > curRange && safeDist(env, player, cur) <= newRange);
    };

    const shared = {
        player, enemiesInRange, enemiesTotal, hasTargetInRange,
        shaUsed, shaLimit, shaUseLeft: Math.max(0, shaLimit - shaUsed),
        judgeThreat, trickThreat, teamHasDamage,
        trickPressure, supportNeed, fangkong2NewProtected, zhuangjiafhPressure,
        playerRange, enemyRanges, enemyEffectInfo, enemyDamageInfo, daodanNewTargets,
        /** 生存风险分（血量部分不变；shan 缺牌项由 ctx 级补） */
        baseRisk: 0,
    };
    const hp = player.hp || 0, maxHp = player.maxHp || hp;
    if (hp <= 1) shared.baseRisk += 0.6;
    else if (hp <= 2) shared.baseRisk += 0.3;
    else if (hp <= maxHp / 2) shared.baseRisk += 0.15;
    shared.baseRisk += Math.min(0.3, enemiesInRange * 0.1);

    if (cacheKey != null && typeof cacheKey === 'object') {
        _sharedCacheRef.set(cacheKey, shared);
    }
    return shared;
}

/**
 * 构造「付款 payCards 之后」的局面上下文。
 * 付款只涉及手牌区(position 'h')，装备区不受影响。
 * @param {object|null} cacheKey  事件/帧 key，用于共享 buildShared；不跨事件缓存手牌结论。
 */
export function buildCtx(env, player, payCards, cacheKey) {
    const shared = buildShared(env, player, cacheKey);
    const hand = player.getCards ? player.getCards('h') : [];
    const pay = payCards || [];
    const paySet = new Set(pay);
    // 付款集匹配：优先引用相等。对引用不匹配的（测试 mock 重建对象场景），
    // 按 name+suit+number 做次数级剔除（同名片付几张就剔几张）。
    const keyOf = c => cardName(c) + '|' + (c.suit || '') + '|' + (c.number || '');
    const needKey = {};
    for (const c of pay) {
        if (paySet.has(c) && hand.includes(c)) continue;   // 引用命中，下面 filter 已排除
        const k = keyOf(c);
        needKey[k] = (needKey[k] || 0) + 1;
    }
    const handAfter = hand.filter(c => {
        if (paySet.has(c)) return false;
        const k = keyOf(c);
        if (needKey[k] > 0) { needKey[k]--; return false; }
        return true;
    });
    const stats = handStats(env, player, handAfter);
    const beforeStats = paySet.size ? handStats(env, player, hand) : stats;
    const limit = handLimit(env, player);
    const hp = player.hp || 0;

    const ctx = {
        env, player, paySet, handAfter, shared,
        stats,           // 付款后手牌统计（增量）
        beforeStats,     // 付款前手牌统计（增量）
        limit,
        overflowBefore: Math.max(0, beforeStats.total - limit),
        overflowAfter: Math.max(0, stats.total - limit),
        // —— 以下字段透传 shared，保持旧调用 ctx.enemiesInRange 等兼容 ——
        enemiesInRange: shared.enemiesInRange, enemiesTotal: shared.enemiesTotal,
        hasTargetInRange: shared.hasTargetInRange,
        shaUsed: shared.shaUsed, shaLimit: shared.shaLimit, shaUseLeft: shared.shaUseLeft,
        judgeThreat: shared.judgeThreat, trickThreat: shared.trickThreat,
        teamHasDamage: shared.teamHasDamage,
        // 风险分 = 全局血量风险 + 付款后缺闪惩罚
        risk: shared.baseRisk + (stats.shan === 0 && hp <= 2 ? 0.2 : 0),
    };
    /** 付款后手牌中满足 pred 的张数 */
    ctx.countAfterH = function (pred) {
        let n = 0;
        for (const c of handAfter) { try { if (!pred || pred(c)) n++; } catch (e) {} }
        return n;
    };
    /** 付款后 手牌+装备区 中满足 pred 的张数 */
    ctx.countAfterHE = function (pred) {
        let n = ctx.countAfterH(pred);
        eachCard(env, player, 'e', c => { try { if (!pred || pred(c)) n++; } catch (e) {} });
        return n;
    };
    return ctx;
}

/* ================= 付款牌成本 ================= */

/**
 * 单张付款牌的风险调整成本：牌面价值 + 生存/行动溢价。
 * 越大越不该付。返回负值表示“弃掉它本身有收益”（如判定区延时锦囊）。
 */
export function cardRiskCost(env, player, card, ctx) {
    ctx = ctx || buildCtx(env, player, []);
    const pos = safePos(env, card);
    if (pos === 'j') return -2;                    // 判定区牌被弃是收益（建造可用 hejs）
    let cost = safeValue(env, card);
    const st = ctx.beforeStats;
    const hp = player.hp || 0, maxHp = player.maxHp || hp;
    const inDanger = hp <= 2 || ctx.enemiesInRange > 0;
    const n = cardName(card);
    if (pos === 'e') cost += 1;                    // 已装备牌额外保留倾向
    if (n === 'shan') {
        if (st.shan <= 1 && inDanger) cost += 9;   // 最后一张闪 + 有威胁：几乎不卖
        else if (st.shan <= 1) cost += 3;
        else if (hp <= 2) cost += 2;
    } else if (n === 'tao') {
        if (st.tao <= 1 && (hp <= 2 || hp < maxHp)) cost += 7;
        else if (st.tao <= 1) cost += 3;
    } else if (n === 'jiu') {
        if (st.jiu <= 1 && hp <= 1) cost += 6;
        else if (st.jiu <= 1 && hp <= 2) cost += 2;
    } else if (n === 'wuxie') {
        if (ctx.judgeThreat || ctx.trickThreat) cost += 2.5;
    } else if (n === 'sha') {
        // 本回合计划要打的杀不许轻易付掉
        if (ctx.hasTargetInRange && st.sha <= ctx.shaUseLeft + 1) cost += 2.5;
        else if (ctx.hasTargetInRange && st.sha <= 1) cost += 1;
    }
    if (st.total <= 2) cost += 1.5;                // 手牌见底时每张都贵
    return cost;
}

/* ================= 升级目录（成本/上限规则与 content 完全一致） ================= */

/** 强化等级上限 = min(2, 建造等级+1)，与 content/filter 中 buildLevel 一致 */
export function upgradeCap(env, player) {
    return Math.min(2, countMark(player, '_jianzaochuan') + 1);
}
/** 一级2点、二级3点 */
export function upgradeCost(lv) { return lv + 2; }

/**
 * 当前可购买升级项：未满级、建造上限内、费用可负担；十项全能禁 jinengup。
 */
export function upgradeOptions(env, player, points) {
    const cap = upgradeCap(env, player);
    const out = [];
    for (const mark of UPGRADE_MARKS) {
        const lv = countMark(player, mark);
        if (lv >= cap) continue;
        if (mark === 'jinengup' && hasSkill(player, 'shixiangquanneng')) continue;
        const cost = upgradeCost(lv);
        if (cost <= points) out.push({ mark, lv, cost });
    }
    return out;
}

/* ================= 升级边际收益（付款后局面） ================= */

/**
 * 单项升级在「付款后局面」下的边际收益（不扣费，费用由调用方按 EXP_PT 扣）。
 * @param opt {{mark:string, lv:number, cost:number}}
 */
export function evalUpgradeGain(env, player, opt, ctx) {
    ctx = ctx || buildCtx(env, player, []);
    const st = ctx.stats, hp = player.hp || 0;
    let g = 0;
    switch (opt.mark) {
        case 'mopaiup': {
            // 后勤升级 = 上限+1 → 每回合 phaseBegin 回满到 mopaiup+1，
            // 升级当下不增加现有 _yuanhang_mopai 标记（不立刻多摸），
            // 每次 lose 也只 draw(1)。真实价值 = 未来回合多 1 次低手牌补摸。
            const left = countMark(player, '_yuanhang_mopai');   // 当前剩余补牌标记
            const cap = opt.lv + 1;                              // 现有上限（mopaiup+1）
            g = 1.0;                                             // 基础：未来每回合多 1 token 的保底价值
            // 付款后手牌已低到触发线（<= limit/2，非 <）→ 后勤本回合/下回合真实可触发
            if (st.total <= ctx.limit / 2) g += 1.4;
            else if (st.total <= ctx.limit / 2 + 1) g += 0.5;
            // token 未回满（left < cap）说明上限确实有约束作用，升级多存 1 有意义
            if (left < cap) g += 0.5;
            // token 已等于上限（left >= cap）— 未来回合上限+1 仍多 1 次补摸，不减分
            // 付款后手牌爆满 → 后勤本回合用不上，未来价值打折
            if (st.total > ctx.limit) g -= 1.0;
            break;
        }
        case 'wuqiup': {    // 射程：升级后「刚好能打到」的敌人数（用 shared 快照，全场只算一次）
            let newly = 0;
            for (const r of ctx.shared.enemyRanges) {
                if (r.d > ctx.shared.playerRange && r.d - 1 <= ctx.shared.playerRange) newly++;
            }
            g = newly * 1.2 + (newly > 0 ? 0.8 : 0);
            if (st.sha <= 0) g *= 0.3;               // 付款后没杀，射程暂时白买
            break;
        }
        case 'useshaup': {  // 出杀次数：付款后真实杀数 vs 剩余可用次数
            const extraNow = Math.min(st.sha, ctx.shaUseLeft);
            const extraAfter = Math.min(st.sha, ctx.shaUseLeft + 1);
            g = (extraAfter - extraNow) * 2.4;
            if (extraAfter === extraNow) g += st.sha > 0 ? 0.5 : 0.15; // 只存未来价值
            if (hasSkill(player, 'kaimuhangkong') || hasSkill(player, 'zhongxunca') ||
                hasSkill(player, 'fanjiandaodan') || hasSkill(player, 'kaimuleiji')) g += 0.6;
            break;
        }
        case 'jidongup': {  // 防御距离：升级后「恰好打不到我」的敌人数（shared.enemyRanges 一次算好）
            let out = 0;
            for (const r of ctx.shared.enemyRanges) {
                if (r.canHitMe && r.wouldMissAfterPlus1) out++;
            }
            g = out * 1.4;
            if (out === 0 && ctx.enemiesInRange > 0) g += 0.3;
            if (st.shan === 0) g += 0.9;             // 付款后没闪，距离就是命
            if (hp <= 2) g += 0.8;
            break;
        }
        case 'shoupaiup': { // 手牌上限：按付款后真实溢出评估
            if (ctx.overflowAfter > 0) g = Math.min(2.2, ctx.overflowAfter * 1.1);
            else if (st.total === ctx.limit) g = 0.8;
            else if (st.total >= ctx.limit - 1) g = 0.4;
            else g = 0.15;                            // 付款后离上限远，买了也用不上
            break;
        }
        case 'jinengup': {
            g = evalJinengupGain(env, player, opt, ctx);
            break;
        }
    }
    /* —— 风险/团队微调（沿用旧按钮 AI 的思路，保持行为风格一致） —— */
    if (ctx.risk > 0.5) {
        if (opt.mark === 'jidongup' || opt.mark === 'shoupaiup') g += 1.5;
        if (opt.mark === 'jinengup' && hasSkill(player, 'yaosai') && hp <= 2) g += 2.5;
        if (opt.mark === 'wuqiup' || opt.mark === 'useshaup') g -= 1.2;
    } else {
        // 质变一级：仅当 jinengup 命中舰种分支才算（无舰种时 evalJinengupGain 已返 0）
        if (opt.mark === 'jinengup' && opt.lv === 0 && g > 0) g += 1.2;
        if (opt.mark === 'wuqiup' || opt.mark === 'useshaup') g += 0.4;
    }
    if ((hasSkill(player, 'zhanliebb') || hasSkill(player, 'yaosai')) && !ctx.teamHasDamage &&
        (opt.mark === 'wuqiup' || opt.mark === 'useshaup')) g += 1.2;
    return g;
}

/**
 * jinengup 分支收益：移植自旧 chooseButton ai，
 * 全部改为「付款后手牌」计数（ctx.countAfterH / countAfterHE）。
 */
function evalJinengupGain(env, player, opt, ctx) {
    const currentLv = opt.lv, nextLv = opt.lv + 1;
    const st = ctx.stats;
    const handCards = st.total, shanCount = st.shan;
    const enemiesInRange = ctx.enemiesInRange, riskScore = ctx.risk;
    const hp = player.hp || 0, maxHp = player.maxHp || hp;
    // 无舰种技能时 jinengup 是纯白买：先探测是否命中任一升级分支，未命中直接 0
    const hitAnyBranch = hasSkill(player, 'kaimuhangkong') || hasSkill(player, 'fanjiandaodan') ||
        hasSkill(player, 'kaimuleiji') || hasSkill(player, 'fangkongdaodan') || hasSkill(player, 'junfu') ||
        hasSkill(player, 'fangkong2') || hasSkill(player, 'zhuangjiafh') || hasSkill(player, 'quzhudd') ||
        hasSkill(player, 'yaosai');
    if (!hitAnyBranch) return 0;
    let baseScore = 1.0;   // 有舰种时的底分（质变一级在外层 lv0 微调体现）

    const addNewCardScore = function (newCards, weight) {
        if (newCards > 0) baseScore += Math.min(3.5, newCards * weight);
    };
    // 敌我效果查询走 shared.enemyEffectInfo（按牌名+属性缓存，多按钮/多付款集复用）
    const getEnemyEffectInfo = ctx.shared.enemyEffectInfo;
    const addEffectScore = function (info, cap) {
        if (info.total > 0) baseScore += Math.min(cap, info.best + info.total * 0.25 + info.weak * 0.5);
    };
    const countH = fn => ctx.countAfterH(fn);
    const countHE = fn => ctx.countAfterHE(fn);

    if (hasSkill(player, 'kaimuhangkong')) {           // 航母：万箭齐发限制放宽
        const hangkongCard = function (card, lv) {
            if (lv <= 0) return safeColor(env, card) == 'black';
            if (lv == 1) return safeColor(env, card) == 'black' || safeSuit(env, card) == 'heart';
            return true;
        };
        const beforeUpgrade = countH(c => hangkongCard(c, currentLv));
        const afterUpgrade = countH(c => hangkongCard(c, nextLv));
        addNewCardScore(afterUpgrade - beforeUpgrade, 1.2);
        if (afterUpgrade > 0) {
            addEffectScore(getEnemyEffectInfo({ name: 'wanjian' }, null, false), 3);
        }
    }

    if (hasSkill(player, 'fanjiandaodan')) {           // 导驱：导弹条件放宽 + 射程
        const daodanCard = function (card, lv) {
            if (lv <= 0) return safeSubtype(env, card) == 'equip1';
            if (lv == 1) return safeType(env, card) == 'equip';
            return safeType(env, card) != 'basic';
        };
        const beforeUpgrade = countHE(c => daodanCard(c, currentLv));
        const afterUpgrade = countHE(c => daodanCard(c, nextLv));
        addNewCardScore(afterUpgrade - beforeUpgrade, 1.5);
        if (afterUpgrade > 0) {
            // 导弹效果：lib.card 有 yuanchengdaodan9 时用之，否则回退 damageEffect（保持原语义）；
            // 结果经 shared.enemyEffectInfo 缓存（按牌名 key）。
            let missileInfo;
            if (env.lib && env.lib.card && env.lib.card["yuanchengdaodan9"]) {
                missileInfo = getEnemyEffectInfo({ name: "yuanchengdaodan9", isCard: true }, null, false);
            } else {
                missileInfo = ctx.shared.enemyDamageInfo(false);   // 回退 damageEffect（缓存路径）
            }
            addEffectScore(missileInfo, 3);
            const newTargets = ctx.shared.daodanNewTargets(currentLv);
            if (newTargets > 0) baseScore += Math.min(2.4, newTargets * 1.2);
        }
    }

    if (hasSkill(player, 'kaimuleiji')) {              // 潜艇：雷杀花色放宽
        const leijiCard = function (card, lv) {
            const suit = safeSuit(env, card);
            if (lv <= 0) return suit == 'heart' || suit == 'spade';
            if (lv == 1) return suit == 'heart' || suit == 'spade' || suit == 'diamond';
            return true;
        };
        const beforeUpgrade = countH(c => leijiCard(c, currentLv));
        const afterUpgrade = countH(c => leijiCard(c, nextLv));
        addNewCardScore(afterUpgrade - beforeUpgrade, 1.2);
        let srcDmg = 0;
        try { srcDmg = (player.getHistory ? player.getHistory("sourceDamage") : []).length; } catch (e) {}
        if (afterUpgrade > 0 && srcDmg == 0) {
            addEffectScore(getEnemyEffectInfo({ name: 'sha', nature: 'thunder', isCard: true }, 'thunder', true), 3);
        }
    }

    if (hasSkill(player, 'fangkongdaodan')) {          // 防空导弹存储位
        let storedMissiles = 0;
        try { storedMissiles += player.getExpansions('daodan').length; } catch (e) {}
        try { storedMissiles += player.getCards('s', c => c.hasGaintag && c.hasGaintag('daodan')).length; } catch (e) {}
        const currentSlots = Math.max(0, 1 + currentLv - storedMissiles);
        const nextSlots = Math.max(0, 1 + nextLv - storedMissiles);
        const newSlots = Math.min(handCards, nextSlots) - Math.min(handCards, currentSlots);
        if (newSlots > 0) {
            baseScore += Math.min(3, newSlots * 1.2 + ctx.shared.trickPressure * 0.4);
        }
    }

    if (hasSkill(player, 'junfu')) {                   // 军辅存牌位
        let storedSupport = 0;
        try { storedSupport += player.getExpansions('junfu').length; } catch (e) {}
        try { storedSupport += player.getCards('s', c => c.hasGaintag && c.hasGaintag('junfu')).length; } catch (e) {}
        const currentSupportSlots = Math.max(0, 1 + currentLv - storedSupport);
        const nextSupportSlots = Math.max(0, 1 + nextLv - storedSupport);
        const newSupportSlots = Math.min(handCards, nextSupportSlots) - Math.min(handCards, currentSupportSlots);
        if (newSupportSlots > 0) {
            baseScore += Math.min(3, newSupportSlots * 1.2 + ctx.shared.supportNeed * 0.4);
        }
    }

    if (hasSkill(player, 'fangkong2')) {               // 防空圈保护范围（shared.fangkong2NewProtected 缓存）
        const newProtected = ctx.shared.fangkong2NewProtected(currentLv);
        if (newProtected > 0 && countCardsSafe(player, 'he') > 0) {
            baseScore += Math.min(2.5, newProtected * 0.8 + riskScore);
        }
    }

    if (hasSkill(player, 'zhuangjiafh')) {             // 装甲防护范围扩大（按等级缓存压力）
        const armorPressure = ctx.shared.zhuangjiafhPressure(currentLv);
        if (armorPressure > 0) baseScore += Math.min(2, armorPressure * 0.6 + riskScore);
    }

    if (hasSkill(player, 'quzhudd')) {                 // 驱逐回避率
        const dodgePressure = enemiesInRange + (shanCount == 0 && hp <= 2 ? 1 : 0);
        if (dodgePressure > 0) baseScore += Math.min(2, dodgePressure * 0.4 + riskScore);
    }

    if (hasSkill(player, 'yaosai')) {                  // 要塞回血上限
        let yaosaiUsed = 0;
        try { yaosaiUsed = (player.storage && player.storage.yaosai) || 0; } catch (e) {}
        if (yaosaiUsed >= currentLv && yaosaiUsed < nextLv) {
            let recoverScore = 2;
            if (hp <= 1) recoverScore += 2;
            else if (hp <= 2) recoverScore += 1;
            if (hp < maxHp) recoverScore += 1;
            baseScore += Math.min(4, recoverScore);
        } else if (yaosaiUsed < nextLv && hp < maxHp) {
            baseScore += 1.5;
        }
    }

    if (hasSkill(player, 'yuanchengdaji') || hasSkill(player, 'bm_huanxing')) baseScore = 0;
    return Math.max(0, baseScore);
}

/* ================= 付款方案（三处 AI 的统一核心） ================= */

/**
 * 求最优付款方案：
 *  枚举付款张数 k ∈ [max(0,2-exp), min(4,h)]，按付款成本升序贪心取 k 张，
 *  在 (经验+k) 点预算内按「净贡献 = 边际收益 - 费用×EXP_PT」贪心选升级组合，
 *  净收益 = Σ升级增益 + 剩余经验折现 - 付款成本（溢出位打折） - 行动底线罚。
 * @returns {?{net:number, k:number, pay:Card[], points:number, used:number,
 *             leftover:number, upgrades:Array, overflowBefore:number}}
 */
export function planPayment(env, player, cacheKey) {
    const hand = player.getCards ? player.getCards('h') : [];
    const exp = countMark(player, 'Expup');
    const minCards = Math.max(0, 2 - exp);
    const maxCards = Math.min(4, hand.length);
    if (minCards > maxCards) return null;

    // 本次发动帧 key：显式传入则用（chooseButton 链路），否则自建空对象。
    // WeakMap 按此 key 缓存 shared；不同 event/帧各自独立，绝不跨事件共享含手牌结论。
    const frameKey = (cacheKey && typeof cacheKey === 'object') ? cacheKey : {};
    const baseCtx = buildCtx(env, player, [], frameKey);
    const ranked = hand
        .map(c => ({ card: c, cost: cardRiskCost(env, player, c, baseCtx) }))
        .sort((a, b) => a.cost - b.cost);

    let best = null;
    for (let k = minCards; k <= maxCards; k++) {
        const pay = ranked.slice(0, k).map(r => r.card);
        let payCost = 0;
        for (let i = 0; i < k; i++) {
            // 前 overflowBefore 个付款位本来就要弃，成本打折
            payCost += (i < baseCtx.overflowBefore) ? ranked[i].cost * OVERFLOW_DISCOUNT : ranked[i].cost;
        }
        const ctx = buildCtx(env, player, pay, frameKey);
        const points = exp + k;
        const scored = upgradeOptions(env, player, points)
            .map(o => {
                const gain = evalUpgradeGain(env, player, o, ctx);
                return { o, gain, net: gain - o.cost * EXP_PT };
            })
            .filter(x => x.net > 0)
            .sort((a, b) => b.net - a.net);
        const chosen = [];
        let budget = points, used = 0, upGain = 0;
        for (const x of scored) {
            if (x.o.cost <= budget) {
                chosen.push({ mark: x.o.mark, cost: x.o.cost, gain: x.gain });
                budget -= x.o.cost; used += x.o.cost; upGain += x.gain;
            }
        }
        const leftover = points - used;
        let net = upGain + leftover * STORE_PT_VALUE - payCost;
        // 行动底线：付款后没有一张可出的牌而本来有 → 罚
        if (k > 0 && ctx.stats.usable === 0 && baseCtx.stats.usable > 0) net -= 2.0;
        if (!best || net > best.net) {
            best = { net, k, pay, points, used, leftover, upgrades: chosen, overflowBefore: baseCtx.overflowBefore };
        }
    }
    return best;
}

/* ================= 对外接口（供 globalskills.js 回调调用） ================= */

/**
 * _qianghuazhuang 的 ai.result.player：发动意愿。
 * 有净增益为正的升级 → 发动；纯存经验仅当付款全部落在溢出额度内才发动；否则不强化。
 */
export function skillResult(env, player, cacheKey) {
    const plan = planPayment(env, player, cacheKey);
    if (!plan) return 0;
    if (plan.upgrades.length > 0 && plan.net > ACTIVATE_MIN) {
        return Math.min(6, 0.8 + plan.net * 0.4);
    }
    if (plan.k > 0 && plan.k <= plan.overflowBefore && plan.net > ACTIVATE_MIN) {
        return 0.6; // 将弃之牌转经验
    }
    return 0;
}

/**
 * _qianghuazhuang 的 check：与发动评价共用付款方案。
 * 方案内的牌给正分（按付款顺序递减），方案外的牌给负分避免误付；
 * 方案缓存在事件上，同一 chooseCard 过程只算一次。
 */
export function cardCheck(env, player, card, event) {
    let plan = event && event._qhPlan;
    if (!plan) {
        plan = planPayment(env, player, event);   // 用 event 作 cacheKey，与 buttonScore 共享 shared
        if (event && plan) { try { event._qhPlan = plan; } catch (e) {} }
    }
    if (!plan) return -1;
    const idx = plan.pay.indexOf(card);
    if (idx >= 0) return 10 - idx;
    return -cardRiskCost(env, player, card) - 0.5;
}

/**
 * 从 chooseButton 事件链上回溯技能事件，取出本次付款牌（event.cards）。
 * content 在 chooseButton 前已 addMark('Expup')，牌尚未弃置。
 */
export function resolvePayCards(event) {
    let e = event, guard = 0;
    while (e && guard++ < 24) {
        try {
            if (e.upgradeConfigMap && Array.isArray(e.cards)) return e.cards;
            if (e.name === '_qianghuazhuang' && Array.isArray(e.cards)) return e.cards;
        } catch (err) { /* ignore */ }
        e = (e.getParent && e.getParent()) || e.parent || null;
    }
    return [];
}

/**
 * chooseButton 的 ai：按「付款后局面」评估每个升级项的净增收益
 * （边际收益 - 费用×EXP_PT）；store_only 兜底存经验。
 */
export function buttonScore(env, player, link, event) {
    if (link === 'store_only') return 0.01;
    if (UPGRADE_MARKS.indexOf(link) < 0) return 0;
    const lv = countMark(player, link);
    if (lv >= 2 || lv >= upgradeCap(env, player)) return 0;
    if (link === 'jinengup' && hasSkill(player, 'shixiangquanneng')) return 0;
    const cost = upgradeCost(lv);
    if (cost > countMark(player, 'Expup')) return 0; // Expup 已含本次付款点数
    // event 作 cacheKey：同一 chooseButton 的多个按钮共享 shared（敌我态度/射程/威胁等），
    // 付款集 resolvePayCards 只算一次，ctx 只算增量。
    const ctx = buildCtx(env, player, resolvePayCards(event), event);
    const gain = evalUpgradeGain(env, player, { mark: link, lv, cost }, ctx);
    return gain - cost * EXP_PT;
}

/* ================= 建造(_jianzaochuan) ================= */

/** 建造 check：溢出时更愿意弃；判定区牌优先弃（收益）；其余按风险成本 */
export function jianzaoCardCheck(env, player, card) {
    const ctx = buildCtx(env, player, []);
    if (safePos(env, card) === 'j') return 15 - safeValue(env, card);
    const base = ctx.overflowBefore > 0 ? 9 : 6.5;
    return base - cardRiskCost(env, player, card, ctx);
}

/** 建造 ai.result.player：上限收益 - 最低成本三张不同花色付款 */
export function jianzaoResult(env, player) {
    try { if (player.hasMark && player.hasMark('_jianzaochuan')) return 0; } catch (e) {}
    if (countCardsSafe(player, 'hejs') < 3) return 0;
    // 与 filter 规则一致：没有进行过任何强化则不发动建造
    let totalLevels = 0;
    for (const m of UPGRADE_MARKS) totalLevels += countMark(player, m);
    if (totalLevels === 0) return 0;
    const ctx = buildCtx(env, player, []);
    const bySuit = {};
    eachCard(env, player, 'hejs', c => {
        const s = safeSuit(env, c);
        if (!s) return;
        const cost = cardRiskCost(env, player, c, ctx);
        if (bySuit[s] === undefined || cost < bySuit[s]) bySuit[s] = cost;
    });
    const costs = Object.keys(bySuit).map(k => bySuit[k]).sort((a, b) => a - b);
    if (costs.length < 3) return 0;
    const payCost = costs[0] + costs[1] + costs[2];
    let gain = 1.6;                                       // 血量上限 + 强化上限解锁
    if ((player.hp || 0) < (player.maxHp || 0)) gain += 0.8;
    let lv1 = 0;
    for (const m of UPGRADE_MARKS) if (countMark(player, m) === 1) lv1++;
    gain += Math.min(4, lv1 * 1.6);                        // 有1级项等升2级，解锁更值
    if (lv1 === 0) gain += 0.5;                            // 建造本身解锁（低优先级）
    if (ctx.overflowBefore > 0) gain += Math.min(1.2, ctx.overflowBefore * 0.5);
    const net = gain - payCost * 0.3;
    return net > 0 ? Math.min(6, net) : 0;
}

/* ================= 技能级包装接口 ================= */

/**
 * 挂在 lib.skill._qianghuazhuang 上的只读决策接口（测试可包装采样，不改行为）。
 * 由 globalskills.js 在技能定义处赋值：
 *   skill.plan / skill.getPlan / skill.paymentScore / skill.checkPlan
 * env 默认用本模块调用方传入的引擎引用；测试可在包装时换 env。
 */
export function makeSkillEnv(get, game, lib, ui, _status) {
    return { get, game, lib, ui, _status };
}

/** 返回完整付款方案（含 Card 引用），供引擎内决策/测试采样 */
export function skillPlan(env, player) { return planPayment(env, player); }

/**
 * 付款方案的 JSON 化快照（去 Card 引用），便于测试序列化。
 */
export function planSnapshot(env, player) {
    const p = planPayment(env, player);
    if (!p) return null;
    return {
        net: p.net, k: p.k, points: p.points, used: p.used, leftover: p.leftover,
        overflowBefore: p.overflowBefore,
        pay: p.pay.map(c => ({ name: c.name, suit: safeSuit(env, c), value: safeValue(env, c) })),
        upgrades: p.upgrades.map(u => ({ mark: u.mark, cost: u.cost, gain: +u.gain.toFixed(3) })),
    };
}

/**
 * 单项升级在指定付款集下的净收益（含付费折现）。
 * @param {Card[]|null} payCards 显式付款集；null 则沿用事件链回溯（真实 chooseButton 路径）
 */
export function paymentScore(env, player, mark, payCards, event) {
    if (mark === 'store_only') return 0.01;
    if (UPGRADE_MARKS.indexOf(mark) < 0) return 0;
    const lv = countMark(player, mark);
    if (lv >= 2 || lv >= upgradeCap(env, player)) return 0;
    if (mark === 'jinengup' && hasSkill(player, 'shixiangquanneng')) return 0;
    const cost = upgradeCost(lv);
    const ctx = buildCtx(env, player, payCards != null ? payCards : resolvePayCards(event));
    const gain = evalUpgradeGain(env, player, { mark, lv, cost }, ctx);
    return gain - cost * EXP_PT;
}

/** 建造(_jianzaochuan) 方案快照 */
export function jianzaoPlan(env, player) {
    return { score: jianzaoResult(env, player) };
}

/* ================= 便捷封装（可选） ================= */

/** 绑定 env 返回一组方法，供回调与单元测试直接使用。 */
export function createQianghuaAI(env) {
    return {
        skillResult: p => skillResult(env, p),
        cardCheck: (p, c, e) => cardCheck(env, p, c, e),
        buttonScore: (p, l, e) => buttonScore(env, p, l, e),
        jianzaoCardCheck: (p, c) => jianzaoCardCheck(env, p, c),
        jianzaoResult: p => jianzaoResult(env, p),
        planPayment: p => planPayment(env, p),
        buildCtx: (p, pay) => buildCtx(env, p, pay),
        upgradeOptions: (p, pts) => upgradeOptions(env, p, pts),
        upgradeCap: p => upgradeCap(env, p),
        evalUpgradeGain: (p, o, c) => evalUpgradeGain(env, p, o, c),
        cardRiskCost: (p, c, ctx) => cardRiskCost(env, p, c, ctx),
        handStats: (p, cards) => handStats(env, p, cards),
        resolvePayCards: e => resolvePayCards(e),
        planSnapshot: p => planSnapshot(env, p),
        paymentScore: (p, m, pay, e) => paymentScore(env, p, m, pay, e),
        jianzaoPlan: p => jianzaoPlan(env, p),
        buildShared: (p, key) => buildShared(env, p, key),
        resetCache: () => _resetSharedCache(),
    };
}
