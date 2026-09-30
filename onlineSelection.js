// Adapt native online Guozhan without changing the engine or its chooseButtonOL event.
export function installJianROnlineSelection({ lib, game, get, _status, characterIds, packName }) {
    if (lib.jianrOnlineSelection) return lib.jianrOnlineSelection;
    const ids = new Set(characterIds);
    const enabled = () => lib.config.extension_舰R牌将_characters_enable !== false;
    const yeEnabled = () => lib.config.extension_舰R牌将_yexinjie_enable !== false;
    const isYe = id => {
        const info = lib.character[id];
        return Boolean(info && (info[1] === 'ye' || (Array.isArray(info[4]) && info[4].some(tag => typeof tag === 'string' && tag.startsWith('doublegroup:') && tag.split(':').includes('ye')))));
    };
    const merge = (target, allow, eligibleIds) => {
        const eligible = eligibleIds && new Set(eligibleIds);
        if (yeEnabled() === false) {
            for (const id of Object.keys(target)) {
                if (isYe(id)) delete target[id];
            }
        }
        for (const id of ids) {
            if (yeEnabled() === false && isYe(id)) {
                delete target[id];
                continue;
            }
            if (allow && (!eligible || eligible.has(id)) && lib.character[id]) target[id] = lib.character[id];
            else delete target[id];
        }
        return target;
    };
    const groups = name => {
        const double = get.is.double(name, true);
        return double || [lib.character[name][1]];
    };
    const compatible = (main, vice) => {
        if (main === vice) return false;
        if (_status.separatism) return true;
        const a = groups(main), b = groups(vice);
        return a.includes('ye') ? !b.includes('ye') : a.some(group => b.includes(group));
    };
    // Always consume returned candidates from the shared list, as the native allocator does.
    // Seed a legal pair for arbitrary extension groups, then fill the remaining slots.
    const choice = (list, num) => {
        const available = [...new Set(list)].filter(id => lib.character[id]);
        let pair;
        for (let i = 0; i < available.length && !pair; i++) {
            for (let j = i + 1; j < available.length; j++) {
                if (compatible(available[i], available[j]) || compatible(available[j], available[i])) {
                    pair = [available[i], available[j]];
                    break;
                }
            }
        }
        // Match the native short-pool behavior; do not abort the whole room from an allocator.
        if (!pair) return list.splice(0, num);
        const selected = pair.concat(available.filter(id => !pair.includes(id)).slice(0, Math.max(0, num - 2)));
        for (let i = list.length - 1; i >= 0; i--) if (selected.includes(list[i])) list.splice(i, 1);
        return selected;
    };
    const prepare = (allow, eligibleIds) => {
        if (!lib.characterPack.mode_guozhan) lib.characterPack.mode_guozhan = {};
        merge(lib.characterPack.mode_guozhan, allow, eligibleIds);
        if (lib.configOL) {
            lib.configOL.jianrGuozhanEnabled = allow;
            if (eligibleIds) lib.configOL.jianrGuozhanCharacters = eligibleIds;
        }
    };
    const patchMode = mode => {
        if (!mode || (mode.name && mode.name !== 'guozhan') || !mode.game?.chooseCharacterOL) return mode;
        if (mode._jianrOnlineSelection) return mode;
        mode._jianrOnlineSelection = true;
        if (mode.characterPack?.mode_guozhan) merge(mode.characterPack.mode_guozhan, enabled());
        const originalChoose = mode.game.chooseCharacterOL;
        mode.game.chooseCharacterOL = function () {
            // The host's switch is authoritative; clients still retain all resources for replay/rejoin.
            const allow = enabled();
            const eligibleIds = allow ? [...ids].filter(id => {
                const info = lib.character[id];
                if (!info || (!yeEnabled() && isYe(id)) || lib.filter.characterDisabled(id)) return false;
                const hpParts = String(info[2]).split('/');
                const hp = info.hp ?? Number(hpParts[0]);
                const maxHp = info.maxHp ?? Number(hpParts[hpParts.length - 1]);
                return !info.hasHiddenSkill && hp === maxHp && hp >= 3 && hp <= 5;
            }) : [];
            prepare(allow, eligibleIds);
            game.broadcastAll(function (allow, eligibleIds) {
                if (lib.jianrOnlineSelection) lib.jianrOnlineSelection.prepare(allow, eligibleIds);
            }, allow, eligibleIds);
            return originalChoose.apply(this, arguments);
        };
        mode.game.chooseCharacterOL._jianrSelectionLoaded = true;
        const originalChoice = mode.game.getCharacterChoice;
        mode.game.getCharacterChoice = function (list, num) {
            if (_status.connectMode && list.some(id => ids.has(id))) return choice(list, num);
            return originalChoice.apply(this, arguments);
        };
        const originalReinit = mode.onreinit;
        mode.onreinit = function () {
            const allow = typeof lib.configOL?.jianrGuozhanEnabled === 'boolean' ? lib.configOL.jianrGuozhanEnabled : enabled();
            prepare(allow, lib.configOL?.jianrGuozhanCharacters);
            if (originalReinit) return originalReinit.apply(this, arguments);
        };
        return mode;
    };
    const api = lib.jianrOnlineSelection = { prepare, patchMode, compatible, choice, packName };
    const originalImport = game.import;
    game.import = function (type, content, ...rest) {
        // Keep the original factory intact: the engine also accepts generator factories.
        const result = originalImport.call(this, type, content, ...rest);
        if (type !== 'mode') return result;
        const patchImported = () => {
            const mode = lib.imported.mode?.guozhan;
            if (mode) patchMode(mode);
        };
        if (result?.then) return result.then(value => { patchImported(); return value; });
        patchImported();
        return result;
    };
    // Modes may already have been imported before extension precontent (including headless).
    const patchLoaded = () => {
        const mode = lib.imported.mode?.guozhan;
        if (mode) patchMode(mode);
        if (lib.config.mode === 'guozhan' && game.chooseCharacterOL && !game.chooseCharacterOL._jianrSelectionLoaded) {
            const holder = { name: 'guozhan', game: { chooseCharacterOL: game.chooseCharacterOL, getCharacterChoice: game.getCharacterChoice } };
            patchMode(holder);
            game.chooseCharacterOL = holder.game.chooseCharacterOL;
            game.chooseCharacterOL._jianrSelectionLoaded = true;
            game.getCharacterChoice = holder.game.getCharacterChoice;
        }
    };
    patchLoaded();
    if (Array.isArray(lib.onload)) lib.onload.push(patchLoaded);
    return api;
}
