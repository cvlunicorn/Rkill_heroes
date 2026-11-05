import { get } from '../../../noname.js';

// AI只使用本人的手牌、已知手牌和公开区域。
function knownHandCards(viewer, target) {
    if (viewer === target || viewer.hasSkillTag('viewHandcard', null, target, true)) return target.getCards('h');
    return typeof target.getKnownCards === 'function' ? target.getKnownCards(viewer) : [];
}
function isAttack(card, player) {
    return ['sha', 'sheji9'].includes(get.name(card, player));
}
function exchangeCost(card, target) {
    if (get.position(card) === 'j') return get.effect(target, { name: card.name }, target, target) * 2;
    return Math.max(0, get.value(card, target));
}
function exchangeFireCost(source, target, amount) {
    if (amount <= 0) return 0;
    const effect = get.damageEffect(target, source, target, 'fire');
    if (effect >= 0) return -effect * amount;
    const lethal = amount >= target.hp + (target.hujia || 0);
    return Math.max(7, -effect * 3) * amount + (lethal ? 100 : 0);
}
// 动态规划求恰好指定花色数的最佳交换，允许多交低价值牌以避免火伤。
function exchangePlan(source, target, offered, available) {
    const suitCount = new Set(offered.map(card => get.suit(card))).size;
    if (!suitCount || !available.length) return null;
    const suits = [...new Set(available.map(card => get.suit(card)))];
    const bits = new Map(suits.map((suit, index) => [suit, 1 << index]));
    const bitCount = mask => {
        let count = 0;
        for (; mask; mask &= mask - 1) count++;
        return count;
    };
    let states = new Map([['0:0', { mask: 0, count: 0, cost: 0, cards: [] }]]);
    for (const card of available) {
        const next = new Map(states);
        for (const state of states.values()) {
            const mask = state.mask | bits.get(get.suit(card));
            if (bitCount(mask) > suitCount) continue;
            const count = state.count + 1;
            const cost = state.cost + exchangeCost(card, target);
            const key = mask + ':' + count;
            if (!next.has(key) || next.get(key).cost > cost) next.set(key, { mask, count, cost, cards: state.cards.concat(card) });
        }
        states = next;
    }
    let best = null;
    const incoming = offered.reduce((sum, card) => sum + Math.max(0, get.value(card, target)), 0);
    for (const state of states.values()) {
        if (bitCount(state.mask) !== suitCount) continue;
        const damage = Math.max(0, offered.length - state.count);
        const score = incoming - state.cost - exchangeFireCost(source, target, damage);
        if (!best || score > best.score) best = { cards: state.cards, score, damage };
    }
    return best;
}

export { knownHandCards, isAttack, exchangePlan };
