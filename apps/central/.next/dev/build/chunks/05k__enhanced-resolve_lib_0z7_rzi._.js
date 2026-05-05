module.exports = [
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/CloneBasenamePlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class CloneBasenamePlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, target){
        this.source = source;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("CloneBasenamePlugin", (request, resolveContext, callback)=>{
            const requestPath = request.path;
            const filename = resolver.basename(requestPath);
            const filePath = resolver.join(requestPath, filename);
            /** @type {ResolveRequest} */ const obj = {
                ...request,
                path: filePath,
                relativePath: request.relativePath && resolver.join(request.relativePath, filename)
            };
            resolver.doResolve(target, obj, `using path: ${filePath}`, resolveContext, callback);
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/LogInfoPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class LogInfoPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 */ constructor(source){
        this.source = source;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const { source } = this;
        resolver.getHook(this.source).tapAsync("LogInfoPlugin", (request, resolveContext, callback)=>{
            if (!resolveContext.log) return callback();
            const { log } = resolveContext;
            const prefix = `[${source}] `;
            if (request.path) {
                log(`${prefix}Resolving in directory: ${request.path}`);
            }
            if (request.request) {
                log(`${prefix}Resolving request: ${request.request}`);
            }
            if (request.module) log(`${prefix}Request is an module request.`);
            if (request.directory) log(`${prefix}Request is a directory request.`);
            if (request.query) {
                log(`${prefix}Resolving request query: ${request.query}`);
            }
            if (request.fragment) {
                log(`${prefix}Resolving request fragment: ${request.fragment}`);
            }
            if (request.descriptionFilePath) {
                log(`${prefix}Has description data from ${request.descriptionFilePath}`);
            }
            if (request.relativePath) {
                log(`${prefix}Relative path from description file is: ${request.relativePath}`);
            }
            callback();
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/forEachBail.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /**
 * @template T
 * @template Z
 * @callback Iterator
 * @param {T} item item
 * @param {(err?: null | Error, result?: null | Z) => void} callback callback
 * @param {number} i index
 * @returns {void}
 */ /**
 * @template T
 * @template Z
 * @param {T[]} array array
 * @param {Iterator<T, Z>} iterator iterator
 * @param {(err?: null | Error, result?: null | Z, i?: number) => void} callback callback after all items are iterated
 * @returns {void}
 */ module.exports = function forEachBail(array, iterator, callback) {
    if (array.length === 0) return callback();
    let i = 0;
    const next = ()=>{
        /** @type {boolean | undefined} */ let loop;
        iterator(array[i++], (err, result)=>{
            if (err || result !== undefined || i >= array.length) {
                return callback(err, result, i);
            }
            if (loop === false) while(next());
            loop = true;
        }, i);
        if (!loop) loop = false;
        return loop;
    };
    while(next());
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/path.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
const CHAR_HASH = "#".charCodeAt(0);
const CHAR_SLASH = "/".charCodeAt(0);
const CHAR_BACKSLASH = "\\".charCodeAt(0);
const CHAR_A = "A".charCodeAt(0);
const CHAR_Z = "Z".charCodeAt(0);
const CHAR_LOWER_A = "a".charCodeAt(0);
const CHAR_LOWER_Z = "z".charCodeAt(0);
const CHAR_DOT = ".".charCodeAt(0);
const CHAR_COLON = ":".charCodeAt(0);
const CHAR_QUESTION = "?".charCodeAt(0);
const posixNormalize = path.posix.normalize;
const winNormalize = path.win32.normalize;
/**
 * @enum {number}
 */ const PathType = Object.freeze({
    Empty: 0,
    Normal: 1,
    Relative: 2,
    AbsoluteWin: 3,
    AbsolutePosix: 4,
    Internal: 5
});
const deprecatedInvalidSegmentRegEx = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))(\\|\/|$)/i;
const invalidSegmentRegEx = /(^|\\|\/)((\.|%2e)(\.|%2e)?|(n|%6e|%4e)(o|%6f|%4f)(d|%64|%44)(e|%65|%45)(_|%5f)(m|%6d|%4d)(o|%6f|%4f)(d|%64|%44)(u|%75|%55)(l|%6c|%4c)(e|%65|%45)(s|%73|%53))?(\\|\/|$)/i;
/**
 * @param {string} maybePath a path known to start with `\\`
 * @returns {PathType} AbsoluteWin for `\\?\…` / `\\.\…`, otherwise Normal
 */ const getDosDeviceType = (maybePath)=>{
    if (maybePath.length >= 4 && maybePath.charCodeAt(3) === CHAR_BACKSLASH) {
        const c2 = maybePath.charCodeAt(2);
        if (c2 === CHAR_QUESTION || c2 === CHAR_DOT) {
            return PathType.AbsoluteWin;
        }
    }
    return PathType.Normal;
};
/**
 * @param {string} maybePath a path
 * @returns {PathType} type of path
 */ const getType = (maybePath)=>{
    switch(maybePath.length){
        case 0:
            return PathType.Empty;
        case 1:
            {
                const c0 = maybePath.charCodeAt(0);
                switch(c0){
                    case CHAR_DOT:
                        return PathType.Relative;
                    case CHAR_SLASH:
                        return PathType.AbsolutePosix;
                    case CHAR_HASH:
                        return PathType.Internal;
                }
                return PathType.Normal;
            }
        case 2:
            {
                const c0 = maybePath.charCodeAt(0);
                switch(c0){
                    case CHAR_DOT:
                        {
                            const c1 = maybePath.charCodeAt(1);
                            switch(c1){
                                case CHAR_DOT:
                                case CHAR_SLASH:
                                    return PathType.Relative;
                            }
                            return PathType.Normal;
                        }
                    case CHAR_SLASH:
                        return PathType.AbsolutePosix;
                    case CHAR_HASH:
                        return PathType.Internal;
                }
                const c1 = maybePath.charCodeAt(1);
                if (c1 === CHAR_COLON && (c0 >= CHAR_A && c0 <= CHAR_Z || c0 >= CHAR_LOWER_A && c0 <= CHAR_LOWER_Z)) {
                    return PathType.AbsoluteWin;
                }
                return PathType.Normal;
            }
    }
    const c0 = maybePath.charCodeAt(0);
    switch(c0){
        case CHAR_DOT:
            {
                const c1 = maybePath.charCodeAt(1);
                switch(c1){
                    case CHAR_SLASH:
                        return PathType.Relative;
                    case CHAR_DOT:
                        {
                            const c2 = maybePath.charCodeAt(2);
                            if (c2 === CHAR_SLASH) return PathType.Relative;
                            return PathType.Normal;
                        }
                }
                return PathType.Normal;
            }
        case CHAR_SLASH:
            return PathType.AbsolutePosix;
        case CHAR_HASH:
            return PathType.Internal;
    }
    const c1 = maybePath.charCodeAt(1);
    if (c1 === CHAR_COLON) {
        const c2 = maybePath.charCodeAt(2);
        if ((c2 === CHAR_BACKSLASH || c2 === CHAR_SLASH) && (c0 >= CHAR_A && c0 <= CHAR_Z || c0 >= CHAR_LOWER_A && c0 <= CHAR_LOWER_Z)) {
            return PathType.AbsoluteWin;
        }
    }
    // DOS device paths (`\\?\…`, `\\.\…`) are handled in a cold helper so
    // this function stays small — inlining the full check here regressed
    // `description-files-multi` under `--no-opt` interpretation. Here we
    // only pay the two-byte gate for non-DOS inputs.
    if (c0 === CHAR_BACKSLASH && c1 === CHAR_BACKSLASH) {
        return getDosDeviceType(maybePath);
    }
    return PathType.Normal;
};
/**
 * @param {string} maybePath a path
 * @returns {string} the normalized path
 */ const normalize = (maybePath)=>{
    switch(getType(maybePath)){
        case PathType.Empty:
            return maybePath;
        case PathType.AbsoluteWin:
            return winNormalize(maybePath);
        case PathType.Relative:
            {
                const r = posixNormalize(maybePath);
                return getType(r) === PathType.Relative ? r : `./${r}`;
            }
    }
    return posixNormalize(maybePath);
};
/**
 * @param {string} rootPath the root path
 * @param {string | undefined} request the request path
 * @returns {string} the joined path
 */ const join = (rootPath, request)=>{
    if (!request) return normalize(rootPath);
    const requestType = getType(request);
    switch(requestType){
        case PathType.AbsolutePosix:
            return posixNormalize(request);
        case PathType.AbsoluteWin:
            return winNormalize(request);
    }
    switch(getType(rootPath)){
        case PathType.Normal:
        case PathType.Relative:
        case PathType.AbsolutePosix:
            return posixNormalize(`${rootPath}/${request}`);
        case PathType.AbsoluteWin:
            return winNormalize(`${rootPath}\\${request}`);
    }
    switch(requestType){
        case PathType.Empty:
            return rootPath;
        case PathType.Relative:
            {
                const r = posixNormalize(rootPath);
                return getType(r) === PathType.Relative ? r : `./${r}`;
            }
    }
    return posixNormalize(rootPath);
};
/**
 * @param {string} maybePath a path
 * @returns {string} the directory name
 */ const dirname = (maybePath)=>{
    switch(getType(maybePath)){
        case PathType.AbsoluteWin:
            return path.win32.dirname(maybePath);
    }
    return path.posix.dirname(maybePath);
};
/** @typedef {{ fn: (rootPath: string, request: string) => string, cache: Map<string, Map<string, string | undefined>> }} CachedJoin */ /**
 * @returns {CachedJoin} cached join
 */ const createCachedJoin = ()=>{
    /** @type {CachedJoin["cache"]} */ const cache = new Map();
    /** @type {CachedJoin["fn"]} */ const fn = (rootPath, request)=>{
        /** @type {string | undefined} */ let cacheEntry;
        let inner = cache.get(rootPath);
        if (inner === undefined) {
            cache.set(rootPath, inner = new Map());
        } else {
            cacheEntry = inner.get(request);
            if (cacheEntry !== undefined) return cacheEntry;
        }
        cacheEntry = join(rootPath, request);
        inner.set(request, cacheEntry);
        return cacheEntry;
    };
    return {
        fn,
        cache
    };
};
/** @typedef {{ fn: (maybePath: string) => string, cache: Map<string, string> }} CachedDirname */ /**
 * @returns {CachedDirname} cached dirname
 */ const createCachedDirname = ()=>{
    /** @type {CachedDirname["cache"]} */ const cache = new Map();
    /** @type {CachedDirname["fn"]} */ const fn = (maybePath)=>{
        const cacheEntry = cache.get(maybePath);
        if (cacheEntry !== undefined) return cacheEntry;
        const result = dirname(maybePath);
        cache.set(maybePath, result);
        return result;
    };
    return {
        fn,
        cache
    };
};
/** @typedef {{ fn: (maybePath: string, suffix?: string) => string, cache: Map<string, Map<string | undefined, string | undefined>> }} CachedBasename */ /**
 * @returns {CachedBasename} cached basename
 */ const createCachedBasename = ()=>{
    /** @type {CachedBasename["cache"]} */ const cache = new Map();
    /** @type {CachedBasename["fn"]} */ const fn = (maybePath, suffix)=>{
        /** @type {string | undefined} */ let cacheEntry;
        let inner = cache.get(maybePath);
        if (inner === undefined) {
            cache.set(maybePath, inner = new Map());
        } else {
            cacheEntry = inner.get(suffix);
            if (cacheEntry !== undefined) return cacheEntry;
        }
        cacheEntry = path.basename(maybePath, suffix);
        inner.set(suffix, cacheEntry);
        return cacheEntry;
    };
    return {
        fn,
        cache
    };
};
/**
 * Whether `request` is a relative request — i.e. matches `^\.\.?(?:\/|$)`.
 *
 * This is called on every `doResolve` via `UnsafeCachePlugin` and
 * `getInnerRequest`, so the char-code form is meaningfully faster than the
 * equivalent regex test: no regex state machine, no string object churn.
 * @param {string} request request string
 * @returns {boolean} true if request is relative
 */ const isRelativeRequest = (request)=>{
    const len = request.length;
    if (len === 0 || request.charCodeAt(0) !== CHAR_DOT) return false;
    if (len === 1) return true; // "."
    const c1 = request.charCodeAt(1);
    if (c1 === CHAR_SLASH) return true; // "./..."
    if (c1 !== CHAR_DOT) return false; // ".x..."
    if (len === 2) return true; // ".."
    return request.charCodeAt(2) === CHAR_SLASH; // "../..."
};
/**
 * Check if childPath is a subdirectory of parentPath.
 *
 * Called from `TsconfigPathsPlugin._selectPathsDataForContext` inside a loop
 * over every tsconfig-paths context on every resolve, so it's worth keeping
 * cheap. Compared to the previous `startsWith(normalize(parent + "/"))`
 * version, this: checks the last char with `charCodeAt` instead of two
 * `endsWith` calls; and skips `normalize()` entirely in the common case
 * (parent has no trailing separator), since all we really need is the same
 * anchoring effect — a cheap `startsWith` plus a separator char check on the
 * byte immediately after `parentPath.length`.
 * @param {string} parentPath parent directory path
 * @param {string} childPath child path to check
 * @returns {boolean} true if childPath is under parentPath
 */ const isSubPath = (parentPath, childPath)=>{
    const parentLen = parentPath.length;
    if (parentLen === 0) {
        // Match the old `normalize("" + "/") === "/"` fallback: an empty
        // parent only "contains" a child that starts with a forward slash.
        return childPath.length > 0 && childPath.charCodeAt(0) === CHAR_SLASH;
    }
    const lastChar = parentPath.charCodeAt(parentLen - 1);
    if (lastChar === CHAR_SLASH || lastChar === CHAR_BACKSLASH) {
        // Parent already ends with a separator — a plain prefix test is enough.
        return childPath.startsWith(parentPath);
    }
    if (childPath.length <= parentLen) return false;
    if (!childPath.startsWith(parentPath)) return false;
    // Must be followed by a separator so "/app" doesn't match "/app-other".
    const nextChar = childPath.charCodeAt(parentLen);
    return nextChar === CHAR_SLASH || nextChar === CHAR_BACKSLASH;
};
module.exports.PathType = PathType;
module.exports.createCachedBasename = createCachedBasename;
module.exports.createCachedDirname = createCachedDirname;
module.exports.createCachedJoin = createCachedJoin;
module.exports.deprecatedInvalidSegmentRegEx = deprecatedInvalidSegmentRegEx;
module.exports.dirname = dirname;
module.exports.getType = getType;
module.exports.invalidSegmentRegEx = invalidSegmentRegEx;
module.exports.isRelativeRequest = isRelativeRequest;
module.exports.isSubPath = isSubPath;
module.exports.join = join;
module.exports.normalize = normalize;
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/AliasUtils.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ const forEachBail = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/forEachBail.js [postcss] (ecmascript)");
const { PathType, getType } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/path.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveContext} ResolveContext */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ /** @typedef {import("./Resolver").ResolveCallback} ResolveCallback */ /** @typedef {string | string[] | false} Alias */ /** @typedef {{ alias: Alias, name: string, onlyModule?: boolean }} AliasOption */ /**
 * @typedef {object} CompiledAliasOption
 * @property {string} name original alias name
 * @property {string} nameWithSlash name + "/" — precomputed to avoid per-resolve concat
 * @property {Alias} alias alias target(s)
 * @property {boolean} onlyModule normalized onlyModule flag
 * @property {string | null} absolutePath absolute form of `name` (with slash ending), null when not absolute
 * @property {string | null} wildcardPrefix substring before the single "*" in `name`, null when no wildcard
 * @property {string | null} wildcardSuffix substring after the single "*" in `name`, null when no wildcard
 * @property {number} firstCharCode first character code of `name` — used as a cheap screen on the hot path. `-1` indicates "matches any first char" (empty wildcard prefix).
 * @property {boolean} arrayAlias true when `alias` is an array — precomputed so the hot path skips `Array.isArray`
 */ const EMPTY_COMPILED_OPTIONS = [];
/**
 * Precompute per-option strings used on every resolve so the hot path in
 * `aliasResolveHandler` does no string concatenation / split work per entry.
 * Called once per plugin apply — the returned array is stable for the
 * lifetime of the resolver.
 * @param {Resolver} resolver resolver
 * @param {AliasOption[]} options options
 * @returns {CompiledAliasOption[]} compiled options
 */ function compileAliasOptions(resolver, options) {
    if (options.length === 0) return EMPTY_COMPILED_OPTIONS;
    const result = Array.from({
        length: options.length
    });
    for(let i = 0; i < options.length; i++){
        const item = options[i];
        const { name } = item;
        let absolutePath = null;
        const type = getType(name);
        if (type === PathType.AbsolutePosix || type === PathType.AbsoluteWin) {
            absolutePath = resolver.join(name, "_").slice(0, -1);
        }
        const firstStar = name.indexOf("*");
        let wildcardPrefix = null;
        let wildcardSuffix = null;
        if (firstStar !== -1 && !name.includes("*", firstStar + 1)) {
            wildcardPrefix = name.slice(0, firstStar);
            wildcardSuffix = name.slice(firstStar + 1);
        }
        // firstCharCode: used by `aliasResolveHandler` to quickly skip aliases
        // whose name can't possibly match the current innerRequest. For a plain
        // alias (no wildcard) the first char of the name is also the first char
        // of `nameWithSlash` and of `absolutePath` (since the latter is derived
        // from name via `resolver.join(name, "_")`, which only appends). For a
        // wildcard with a non-empty prefix, the first char of that prefix is
        // also the first char of name. Only the `name === "*"` case (empty
        // wildcard prefix) can match arbitrary first chars — encode that as -1.
        let firstCharCode;
        if (wildcardPrefix !== null && wildcardPrefix.length === 0) {
            firstCharCode = -1;
        } else {
            firstCharCode = name.length > 0 ? name.charCodeAt(0) : -1;
        }
        result[i] = {
            name,
            nameWithSlash: `${name}/`,
            alias: item.alias,
            onlyModule: Boolean(item.onlyModule),
            absolutePath,
            wildcardPrefix,
            wildcardSuffix,
            firstCharCode,
            arrayAlias: Array.isArray(item.alias)
        };
    }
    return result;
}
/** @typedef {(err?: null | Error, result?: null | ResolveRequest) => void} InnerCallback */ /**
 * @param {Resolver} resolver resolver
 * @param {CompiledAliasOption[]} options compiled options
 * @param {ResolveStepHook} target target
 * @param {ResolveRequest} request request
 * @param {ResolveContext} resolveContext resolve context
 * @param {InnerCallback} callback callback
 * @returns {void}
 */ function aliasResolveHandler(resolver, options, target, request, resolveContext, callback) {
    if (options.length === 0) return callback();
    const innerRequest = request.request || request.path;
    if (!innerRequest) return callback();
    // Precompute values used in the inner scan loop so we don't recompute
    // them per option. This is meaningful when `options` has hundreds of
    // entries (e.g. monorepos with generated alias lists) — see the
    // `huge-alias-list` / `huge-alias-miss` benchmarks.
    const innerFirstCharCode = innerRequest.charCodeAt(0);
    const hasRequestString = Boolean(request.request);
    forEachBail(options, (item, callback)=>{
        // Cheap char-code screen: when the compiled option's first char
        // doesn't match the request's first char (and it isn't an
        // "empty-prefix wildcard" — encoded as -1), this option cannot
        // possibly match, so skip straight away and avoid the
        // `startsWith` / `===` work below.
        const { firstCharCode } = item;
        if (firstCharCode !== -1 && firstCharCode !== innerFirstCharCode) {
            return callback();
        }
        /** @type {boolean} */ let shouldStop = false;
        // For absolute-name aliases, accept the normalized
        // `absolutePath` form as well as the raw `nameWithSlash`.
        // `nameWithSlash` unconditionally appends `/`, so a raw
        // windows request with native backslashes
        // (e.g. `C:\\abs\\foo\\baz` against `name: "C:\\abs\\foo"`)
        // otherwise fails `startsWith("C:\\abs\\foo/")` and is
        // silently skipped. The `!hasRequestString` branch already
        // uses `absolutePath`; mirroring it here closes the gap
        // without changing any existing matches.
        const matchRequest = innerRequest === item.name || !item.onlyModule && (hasRequestString ? innerRequest.startsWith(item.nameWithSlash) || item.absolutePath !== null && innerRequest.startsWith(item.absolutePath) : item.absolutePath !== null && innerRequest.startsWith(item.absolutePath));
        const matchWildcard = !item.onlyModule && item.wildcardPrefix !== null;
        if (matchRequest || matchWildcard) {
            /**
				 * @param {Alias} alias alias
				 * @param {(err?: null | Error, result?: null | ResolveRequest) => void} callback callback
				 * @returns {void}
				 */ const resolveWithAlias = (alias, callback)=>{
                if (alias === false) {
                    /** @type {ResolveRequest} */ const ignoreObj = {
                        ...request,
                        path: false
                    };
                    if (typeof resolveContext.yield === "function") {
                        resolveContext.yield(ignoreObj);
                        return callback(null, null);
                    }
                    return callback(null, ignoreObj);
                }
                let newRequestStr;
                if (matchWildcard && innerRequest.startsWith(item.wildcardPrefix) && innerRequest.endsWith(item.wildcardSuffix)) {
                    const match = innerRequest.slice(/** @type {string} */ item.wildcardPrefix.length, innerRequest.length - /** @type {string} */ item.wildcardSuffix.length);
                    newRequestStr = alias.toString().replace("*", match);
                }
                if (matchRequest && innerRequest !== alias && !innerRequest.startsWith(`${alias}/`)) {
                    /** @type {string} */ const remainingRequest = innerRequest.slice(item.name.length);
                    newRequestStr = alias + remainingRequest;
                }
                if (newRequestStr !== undefined) {
                    shouldStop = true;
                    /** @type {ResolveRequest} */ const obj = {
                        ...request,
                        request: newRequestStr,
                        fullySpecified: false
                    };
                    return resolver.doResolve(target, obj, `aliased with mapping '${item.name}': '${alias}' to '${newRequestStr}'`, resolveContext, (err, result)=>{
                        if (err) return callback(err);
                        if (result) return callback(null, result);
                        return callback();
                    });
                }
                return callback();
            };
            /**
				 * @param {(null | Error)=} err error
				 * @param {(null | ResolveRequest)=} result result
				 * @returns {void}
				 */ const stoppingCallback = (err, result)=>{
                if (err) return callback(err);
                if (result) return callback(null, result);
                // Don't allow other aliasing or raw request
                if (shouldStop) return callback(null, null);
                return callback();
            };
            if (item.arrayAlias) {
                return forEachBail(item.alias, resolveWithAlias, stoppingCallback);
            }
            return resolveWithAlias(item.alias, stoppingCallback);
        }
        return callback();
    }, callback);
}
module.exports.aliasResolveHandler = aliasResolveHandler;
module.exports.compileAliasOptions = compileAliasOptions;
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/getPaths.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver").FileSystem} FileSystem */ /** @typedef {{ paths: string[], segments: string[] }} GetPathsResult */ /**
 * Walk `path` from tip to root, returning every ancestor directory (plus the
 * input itself) in `paths`, and each corresponding segment name in `segments`.
 *
 * The return value may be shared across callers via `getPathsCached` — treat
 * it as read-only. Callers that need to mutate (currently only
 * `SymlinkPlugin`) should `slice()` the arrays locally before writing.
 * @param {string} path path
 * @returns {GetPathsResult} paths and segments
 */ function getPaths(path) {
    if (path === "/") return {
        paths: [
            "/"
        ],
        segments: [
            ""
        ]
    };
    const parts = path.split(/(.*?[\\/]+)/);
    const paths = [
        path
    ];
    const segments = [
        parts[parts.length - 1]
    ];
    let part = parts[parts.length - 1];
    path = path.slice(0, Math.max(0, path.length - part.length - 1));
    for(let i = parts.length - 2; i > 2; i -= 2){
        paths.push(path);
        part = parts[i];
        path = path.slice(0, Math.max(0, path.length - part.length)) || "/";
        segments.push(part.slice(0, -1));
    }
    [, part] = parts;
    segments.push(part);
    paths.push(part);
    return {
        paths,
        segments
    };
}
/**
 * Per-filesystem memoization of `getPaths`. Kept in a standalone WeakMap
 * rather than being hung off `resolver.pathCache` so that adding this cache
 * does not change the hidden-class shape of `pathCache` — which is accessed
 * on the hot path of every resolve as `resolver.pathCache.{join,dirname,
 * basename}.fn(...)`. CodSpeed caught that shape change as a ~1–2%
 * instruction-count regression on `cache-predicate`, so we keep pathCache
 * shape-stable by owning this cache here instead.
 *
 * The cache lifetime is tied to the filesystem object (same invariant as
 * `_pathCacheByFs` in `Resolver.js`): when the user swaps filesystems the
 * entries become unreachable and get collected.
 * @type {WeakMap<FileSystem, Map<string, GetPathsResult>>}
 */ const _getPathsCacheByFs = new WeakMap();
/**
 * Memoized `getPaths`. The returned object is shared across callers — do
 * not mutate the `paths` or `segments` arrays in-place; `slice()` first if
 * you need a mutable copy.
 * @param {FileSystem} fileSystem filesystem used as the cache namespace
 * @param {string} path path
 * @returns {GetPathsResult} paths and segments
 */ function getPathsCached(fileSystem, path) {
    let cache = _getPathsCacheByFs.get(fileSystem);
    if (cache === undefined) {
        cache = new Map();
        _getPathsCacheByFs.set(fileSystem, cache);
    } else {
        const cached = cache.get(path);
        if (cached !== undefined) return cached;
    }
    const result = getPaths(path);
    cache.set(path, result);
    return result;
}
module.exports = getPaths;
module.exports.getPathsCached = getPathsCached;
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ModulesUtils.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ const forEachBail = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/forEachBail.js [postcss] (ecmascript)");
const { getPathsCached } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/getPaths.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ /** @typedef {import("./Resolver").ResolveContext} ResolveContext */ /** @typedef {(err?: null | Error, result?: null | ResolveRequest) => void} InnerCallback */ /**
 * Per-(directories-array) cache of the flat `addrs` list produced for a given
 * `request.path`. For a fixed directories configuration the fan-out of
 * `ancestor × directory` is deterministic per request.path, and many resolves
 * share the same starting directory (sibling files in one project, loops over
 * a batch of imports, etc.) — caching avoids the `getPaths` regex split plus
 * `len(paths) × len(directories)` join calls per resolve.
 *
 * The outer map is keyed on the directories array reference (plugin-owned,
 * stable for the lifetime of the resolver), and the inner map on the
 * starting `request.path`. Kept private to this module (rather than hung off
 * `resolver.pathCache`) so the pathCache's hidden-class shape is unchanged —
 * that avoids perturbing the interpreter-mode IC state for the
 * `resolver.pathCache.{join,dirname,basename}.fn(...)` accesses that run on
 * every resolve, which the CodSpeed instruction-count harness is sensitive to.
 * @type {WeakMap<string[], Map<string, string[]>>}
 */ const _addrsCacheByDirs = new WeakMap();
/**
 * @param {Resolver} resolver resolver
 * @param {string[]} directories directories
 * @param {ResolveStepHook} target target
 * @param {ResolveRequest} request request
 * @param {ResolveContext} resolveContext resolve context
 * @param {InnerCallback} callback callback
 * @returns {void}
 */ function modulesResolveHandler(resolver, directories, target, request, resolveContext, callback) {
    const fs = resolver.fileSystem;
    const requestPath = request.path;
    // Compute-or-reuse the flat `addrs` list. Inlined (rather than a helper
    // function) so the cache-hit path — which is the vast majority of
    // invocations — stays a single WeakMap + Map lookup with no function-call
    // overhead. See `_addrsCacheByDirs` above for caching rationale.
    let addrs;
    let perPath = _addrsCacheByDirs.get(directories);
    if (perPath === undefined) {
        perPath = new Map();
        _addrsCacheByDirs.set(directories, perPath);
    } else {
        addrs = perPath.get(requestPath);
    }
    if (addrs === undefined) {
        const { paths } = getPathsCached(fs, requestPath);
        const pathsLen = paths.length;
        const dirsLen = directories.length;
        // Pre-size the flat array rather than going through `map().reduce()`
        // with intermediate arrays + spreads.
        // eslint-disable-next-line unicorn/no-new-array
        addrs = new Array(pathsLen * dirsLen);
        let idx = 0;
        const joinFn = resolver.pathCache.join.fn;
        for(let pi = 0; pi < pathsLen; pi++){
            const pathItem = paths[pi];
            for(let di = 0; di < dirsLen; di++){
                addrs[idx++] = joinFn(pathItem, directories[di]);
            }
        }
        perPath.set(requestPath, addrs);
    }
    // Hoist the dot-prefixed request out of the per-addr iterator. `addrs`
    // can have up to `paths.length × directories.length` entries (e.g. 36
    // for an 8-deep source dir × 4-module config), and concatenating the
    // same `./${request.request}` string on every iteration is wasted
    // work — it's constant for the whole fan-out.
    const relRequest = `./${request.request}`;
    forEachBail(addrs, /**
		 * @param {string} addr addr
		 * @param {(err?: null | Error, result?: null | ResolveRequest) => void} callback callback
		 * @returns {void}
		 */ (addr, callback)=>{
        fs.stat(addr, (err, stat)=>{
            if (!err && stat && stat.isDirectory()) {
                /** @type {ResolveRequest} */ const obj = {
                    ...request,
                    path: addr,
                    request: relRequest,
                    module: false
                };
                const message = `looking for modules in ${addr}`;
                return resolver.doResolve(target, obj, message, resolveContext, callback);
            }
            if (resolveContext.log) {
                resolveContext.log(`${addr} doesn't exist or is not a directory`);
            }
            if (resolveContext.missingDependencies) {
                resolveContext.missingDependencies.add(addr);
            }
            return callback();
        });
    }, callback);
}
module.exports = {
    modulesResolveHandler
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/strip-json-comments.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Natsu @xiaoxiaojx

	This file contains code ported from strip-json-comments:
	https://github.com/sindresorhus/strip-json-comments
	Original license: MIT
	Original author: Sindre Sorhus
*/ /**
 * @typedef {object} StripJsonCommentsOptions
 * @property {boolean=} whitespace Replace comments with whitespace
 * @property {boolean=} trailingCommas Strip trailing commas
 */ const singleComment = Symbol("singleComment");
const multiComment = Symbol("multiComment");
/**
 * Strip without whitespace (returns empty string)
 * @param {string} _string Unused
 * @param {number} _start Unused
 * @param {number} _end Unused
 * @returns {string} Empty string for all input
 */ const stripWithoutWhitespace = (_string, _start, _end)=>"";
/**
 * Replace all characters except ASCII spaces, tabs and line endings with regular spaces to ensure valid JSON output.
 * @param {string} string String to process
 * @param {number} start Start index
 * @param {number} end End index
 * @returns {string} Processed string with comments replaced by whitespace
 */ const stripWithWhitespace = (string, start, end)=>string.slice(start, end).replace(/[^ \t\r\n]/g, " ");
/**
 * Check if a quote is escaped
 * @param {string} jsonString JSON string
 * @param {number} quotePosition Position of the quote
 * @returns {boolean} True if the quote at the given position is escaped
 */ const isEscaped = (jsonString, quotePosition)=>{
    let index = quotePosition - 1;
    let backslashCount = 0;
    while(jsonString[index] === "\\"){
        index -= 1;
        backslashCount += 1;
    }
    return Boolean(backslashCount % 2);
};
/**
 * Strip comments from JSON string
 * @param {string} jsonString JSON string with potential comments
 * @param {StripJsonCommentsOptions} options Options
 * @returns {string} JSON string without comments
 */ function stripJsonComments(jsonString, { whitespace = true, trailingCommas = false } = {}) {
    if (typeof jsonString !== "string") {
        throw new TypeError(`Expected argument \`jsonString\` to be a \`string\`, got \`${typeof jsonString}\``);
    }
    const strip = whitespace ? stripWithWhitespace : stripWithoutWhitespace;
    let isInsideString = false;
    /** @type {false | typeof singleComment | typeof multiComment} */ let isInsideComment = false;
    let offset = 0;
    let buffer = "";
    let result = "";
    let commaIndex = -1;
    for(let index = 0; index < jsonString.length; index++){
        const currentCharacter = jsonString[index];
        const nextCharacter = jsonString[index + 1];
        if (!isInsideComment && currentCharacter === '"') {
            // Enter or exit string
            const escaped = isEscaped(jsonString, index);
            if (!escaped) {
                isInsideString = !isInsideString;
            }
        }
        if (isInsideString) {
            continue;
        }
        if (!isInsideComment && currentCharacter + nextCharacter === "//") {
            // Enter single-line comment
            buffer += jsonString.slice(offset, index);
            offset = index;
            isInsideComment = singleComment;
            index++;
        } else if (isInsideComment === singleComment && currentCharacter + nextCharacter === "\r\n") {
            // Exit single-line comment via \r\n
            index++;
            isInsideComment = false;
            buffer += strip(jsonString, offset, index);
            offset = index;
            continue;
        } else if (isInsideComment === singleComment && currentCharacter === "\n") {
            // Exit single-line comment via \n
            isInsideComment = false;
            buffer += strip(jsonString, offset, index);
            offset = index;
        } else if (!isInsideComment && currentCharacter + nextCharacter === "/*") {
            // Enter multiline comment
            buffer += jsonString.slice(offset, index);
            offset = index;
            isInsideComment = multiComment;
            index++;
            continue;
        } else if (isInsideComment === multiComment && currentCharacter + nextCharacter === "*/") {
            // Exit multiline comment
            index++;
            isInsideComment = false;
            buffer += strip(jsonString, offset, index + 1);
            offset = index + 1;
            continue;
        } else if (trailingCommas && !isInsideComment) {
            if (commaIndex !== -1) {
                if (currentCharacter === "}" || currentCharacter === "]") {
                    // Strip trailing comma
                    buffer += jsonString.slice(offset, index);
                    result += strip(buffer, 0, 1) + buffer.slice(1);
                    buffer = "";
                    offset = index;
                    commaIndex = -1;
                } else if (currentCharacter !== " " && currentCharacter !== "\t" && currentCharacter !== "\r" && currentCharacter !== "\n") {
                    // Hit non-whitespace following a comma; comma is not trailing
                    buffer += jsonString.slice(offset, index);
                    offset = index;
                    commaIndex = -1;
                }
            } else if (currentCharacter === ",") {
                // Flush buffer prior to this point, and save new comma index
                result += buffer + jsonString.slice(offset, index);
                buffer = "";
                offset = index;
                commaIndex = index;
            }
        }
    }
    const remaining = isInsideComment === singleComment ? strip(jsonString, offset, jsonString.length) : jsonString.slice(offset);
    return result + buffer + remaining;
}
module.exports = stripJsonComments;
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/fs.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Natsu @xiaoxiaojx
*/ const stripJsonComments = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/strip-json-comments.js [postcss] (ecmascript)");
/** @typedef {import("../Resolver").FileSystem} FileSystem */ /** @typedef {import("../Resolver").JsonObject} JsonObject */ /**
 * @typedef {object} ReadJsonOptions
 * @property {boolean=} stripComments Whether to strip JSONC comments
 */ /** @type {WeakMap<Buffer, JsonObject>} */ const _stripCommentsCache = new WeakMap();
/**
 * Read and parse JSON file (supports JSONC with comments)
 * @template T
 * @param {FileSystem} fileSystem the file system
 * @param {string} jsonFilePath absolute path to JSON file
 * @param {ReadJsonOptions} options Options
 * @returns {Promise<T>} parsed JSON content
 */ async function readJson(fileSystem, jsonFilePath, options = {}) {
    const { stripComments = false } = options;
    const { readJson: readJson1 } = fileSystem;
    if (readJson1 && !stripComments) {
        return new Promise((resolve, reject)=>{
            readJson1(jsonFilePath, (err, content)=>{
                if (err) return reject(err);
                resolve(content);
            });
        });
    }
    const buf = await new Promise((resolve, reject)=>{
        fileSystem.readFile(jsonFilePath, (err, data)=>{
            if (err) return reject(err);
            resolve(data);
        });
    });
    if (stripComments) {
        const cached = _stripCommentsCache.get(buf);
        if (cached !== undefined) return cached;
    }
    const jsonText = buf.toString();
    // Strip comments to support JSONC (e.g., tsconfig.json with comments)
    const jsonWithoutComments = stripComments ? stripJsonComments(jsonText, {
        trailingCommas: true,
        whitespace: true
    }) : jsonText;
    const result = JSON.parse(jsonWithoutComments);
    if (stripComments) {
        _stripCommentsCache.set(buf, result);
    }
    return result;
}
module.exports.readJson = readJson;
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/TsconfigPathsPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Natsu @xiaoxiaojx
*/ const { aliasResolveHandler, compileAliasOptions } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/AliasUtils.js [postcss] (ecmascript)");
const { modulesResolveHandler } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ModulesUtils.js [postcss] (ecmascript)");
const { readJson } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/fs.js [postcss] (ecmascript)");
const { PathType: _PathType, isSubPath, normalize } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/path.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ /** @typedef {import("./AliasUtils").AliasOption} AliasOption */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveContext} ResolveContext */ /** @typedef {import("./Resolver").FileSystem} FileSystem */ /** @typedef {import("./Resolver").TsconfigPathsData} TsconfigPathsData */ /** @typedef {import("./Resolver").TsconfigPathsMap} TsconfigPathsMap */ /** @typedef {import("./ResolverFactory").TsconfigOptions} TsconfigOptions */ /**
 * @typedef {object} TsconfigCompilerOptions
 * @property {string=} baseUrl Base URL for resolving paths
 * @property {{ [key: string]: string[] }=} paths TypeScript paths mapping
 */ /**
 * @typedef {object} TsconfigReference
 * @property {string} path Path to the referenced project
 */ /**
 * @typedef {object} Tsconfig
 * @property {TsconfigCompilerOptions=} compilerOptions Compiler options
 * @property {string | string[]=} extends Extended configuration paths
 * @property {TsconfigReference[]=} references Project references
 */ const DEFAULT_CONFIG_FILE = "tsconfig.json";
/**
 * @param {string} pattern Path pattern
 * @returns {number} Length of the prefix
 */ function getPrefixLength(pattern) {
    const prefixLength = pattern.indexOf("*");
    if (prefixLength === -1) {
        return pattern.length;
    }
    return prefixLength;
}
/**
 * Sort path patterns.
 * If a module name can be matched with multiple patterns then pattern with the longest prefix will be picked.
 * @param {string[]} arr Array of path patterns
 * @returns {string[]} Array of path patterns sorted by longest prefix
 */ function sortByLongestPrefix(arr) {
    return [
        ...arr
    ].sort((a, b)=>getPrefixLength(b) - getPrefixLength(a));
}
/**
 * Merge two tsconfig objects
 * @param {Tsconfig | null} base base config
 * @param {Tsconfig | null} config config to merge
 * @returns {Tsconfig} merged config
 */ function mergeTsconfigs(base, config) {
    base = base || {};
    config = config || {};
    return {
        ...base,
        ...config,
        compilerOptions: {
            ...base.compilerOptions,
            ...config.compilerOptions
        }
    };
}
/**
 * Substitute ${configDir} template variable in path
 * @param {string} pathValue the path value
 * @param {string} configDir the config directory
 * @returns {string} the path with substituted template
 */ function substituteConfigDir(pathValue, configDir) {
    return pathValue.replace(/\$\{configDir\}/g, configDir);
}
/**
 * Convert tsconfig paths to resolver options
 * @param {string} configDir Config file directory
 * @param {{ [key: string]: string[] }} paths TypeScript paths mapping
 * @param {Resolver} resolver resolver instance
 * @param {string=} baseUrl Base URL for resolving paths (relative to configDir)
 * @returns {TsconfigPathsData} the resolver options
 */ function tsconfigPathsToResolveOptions(configDir, paths, resolver, baseUrl) {
    // Calculate absolute base URL
    const absoluteBaseUrl = !baseUrl ? configDir : resolver.join(configDir, baseUrl);
    /** @type {string[]} */ const sortedKeys = sortByLongestPrefix(Object.keys(paths));
    /** @type {AliasOption[]} */ const alias = [];
    /** @type {string[]} */ const modules = [];
    for (const pattern of sortedKeys){
        const mappings = paths[pattern];
        // Substitute ${configDir} in path mappings
        const absolutePaths = mappings.map((mapping)=>{
            const substituted = substituteConfigDir(mapping, configDir);
            return resolver.join(absoluteBaseUrl, substituted);
        });
        if (absolutePaths.length > 0) {
            if (pattern === "*") {
                modules.push(...absolutePaths.map((dir)=>{
                    if (/[/\\]\*$/.test(dir)) {
                        return dir.replace(/[/\\]\*$/, "");
                    }
                    return "";
                }).filter(Boolean));
            } else {
                alias.push({
                    name: pattern,
                    alias: absolutePaths
                });
            }
        }
    }
    if (absoluteBaseUrl && !modules.includes(absoluteBaseUrl)) {
        modules.push(absoluteBaseUrl);
    }
    return {
        alias: compileAliasOptions(resolver, alias),
        modules
    };
}
/**
 * Get the base context for the current project
 * @param {string} context the context
 * @param {Resolver} resolver resolver instance
 * @param {string=} baseUrl base URL for resolving paths
 * @returns {string} the base context
 */ function getAbsoluteBaseUrl(context, resolver, baseUrl) {
    return !baseUrl ? context : resolver.join(context, baseUrl);
}
module.exports = class TsconfigPathsPlugin {
    /**
	 * @param {true | string | TsconfigOptions} configFileOrOptions tsconfig file path or options object
	 */ constructor(configFileOrOptions){
        if (typeof configFileOrOptions === "object" && configFileOrOptions !== null) {
            // Options object format
            const { configFile } = configFileOrOptions;
            /** @type {boolean} */ this.isAutoConfigFile = typeof configFile !== "string";
            /** @type {string} */ this.configFile = this.isAutoConfigFile ? DEFAULT_CONFIG_FILE : configFile;
            /** @type {string[] | "auto"} */ if (Array.isArray(configFileOrOptions.references)) {
                /** @type {TsconfigReference[] | "auto"} */ this.references = configFileOrOptions.references.map((ref)=>({
                        path: ref
                    }));
            } else if (configFileOrOptions.references === "auto") {
                this.references = "auto";
            } else {
                this.references = [];
            }
            /** @type {string | undefined} */ this.baseUrl = configFileOrOptions.baseUrl;
        } else {
            /** @type {boolean} */ this.isAutoConfigFile = configFileOrOptions === true;
            /** @type {string} */ this.configFile = this.isAutoConfigFile ? DEFAULT_CONFIG_FILE : configFileOrOptions;
            /** @type {TsconfigReference[] | "auto"} */ this.references = [];
            /** @type {string | undefined} */ this.baseUrl = undefined;
        }
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const aliasTarget = resolver.ensureHook("internal-resolve");
        const moduleTarget = resolver.ensureHook("module");
        resolver.getHook("raw-resolve").tapAsync("TsconfigPathsPlugin", async (request, resolveContext, callback)=>{
            try {
                const tsconfigPathsMap = await this._getTsconfigPathsMap(resolver, request, resolveContext);
                if (!tsconfigPathsMap) return callback();
                const selectedData = this._selectPathsDataForContext(request.path, tsconfigPathsMap);
                if (!selectedData) return callback();
                aliasResolveHandler(resolver, selectedData.alias, aliasTarget, request, resolveContext, callback);
            } catch (err) {
                callback(err);
            }
        });
        resolver.getHook("raw-module").tapAsync("TsconfigPathsPlugin", async (request, resolveContext, callback)=>{
            try {
                const tsconfigPathsMap = await this._getTsconfigPathsMap(resolver, request, resolveContext);
                if (!tsconfigPathsMap) return callback();
                const selectedData = this._selectPathsDataForContext(request.path, tsconfigPathsMap);
                if (!selectedData) return callback();
                modulesResolveHandler(resolver, selectedData.modules, moduleTarget, request, resolveContext, callback);
            } catch (err) {
                callback(err);
            }
        });
    }
    /**
	 * Get TsconfigPathsMap for the request (with caching)
	 * @param {Resolver} resolver the resolver
	 * @param {ResolveRequest} request the request
	 * @param {ResolveContext} resolveContext the resolve context
	 * @returns {Promise<TsconfigPathsMap | null>} the tsconfig paths map or null
	 */ async _getTsconfigPathsMap(resolver, request, resolveContext) {
        if (typeof request.tsconfigPathsMap === "undefined") {
            try {
                const absTsconfigPath = resolver.join(request.path || process.cwd(), this.configFile);
                const result = await this._loadTsconfigPathsMap(resolver, absTsconfigPath);
                request.tsconfigPathsMap = result;
            } catch (err) {
                request.tsconfigPathsMap = null;
                if (this.isAutoConfigFile && /** @type {NodeJS.ErrnoException} */ err.code === "ENOENT") {
                    return null;
                }
                throw err;
            }
        }
        if (!request.tsconfigPathsMap) {
            return null;
        }
        for (const fileDependency of request.tsconfigPathsMap.fileDependencies){
            if (resolveContext.fileDependencies) {
                resolveContext.fileDependencies.add(fileDependency);
            }
        }
        return request.tsconfigPathsMap;
    }
    /**
	 * Load tsconfig.json and build complete TsconfigPathsMap
	 * Includes main project paths and all referenced projects
	 * @param {Resolver} resolver the resolver
	 * @param {string} absTsconfigPath absolute path to tsconfig.json
	 * @returns {Promise<TsconfigPathsMap>} the complete tsconfig paths map
	 */ async _loadTsconfigPathsMap(resolver, absTsconfigPath) {
        /** @type {Set<string>} */ const fileDependencies = new Set();
        const config = await this._loadTsconfig(resolver, absTsconfigPath, fileDependencies);
        const compilerOptions = config.compilerOptions || {};
        const mainContext = resolver.dirname(absTsconfigPath);
        const baseUrl = this.baseUrl !== undefined ? this.baseUrl : compilerOptions.baseUrl;
        const main = tsconfigPathsToResolveOptions(mainContext, compilerOptions.paths || {}, resolver, baseUrl);
        /** @type {{ [baseUrl: string]: TsconfigPathsData }} */ const refs = {};
        let referencesToUse = null;
        if (this.references === "auto") {
            referencesToUse = config.references;
        } else if (Array.isArray(this.references)) {
            referencesToUse = this.references;
        }
        if (Array.isArray(referencesToUse)) {
            await this._loadTsconfigReferences(resolver, mainContext, referencesToUse, fileDependencies, refs);
        }
        const allContexts = {
            [mainContext]: main,
            ...refs
        };
        // Precompute the key list once per tsconfig load. `_selectPathsDataForContext`
        // runs per resolve and otherwise would call `Object.entries(allContexts)`
        // each time, allocating a fresh [key, value][] array.
        const contextList = Object.keys(allContexts);
        return {
            main,
            mainContext,
            refs,
            allContexts,
            contextList,
            fileDependencies
        };
    }
    /**
	 * Select the correct TsconfigPathsData based on request.path (context-aware)
	 * Matches the behavior of tsconfig-paths-webpack-plugin
	 * @param {string | false} requestPath the request path
	 * @param {TsconfigPathsMap} tsconfigPathsMap the tsconfig paths map
	 * @returns {TsconfigPathsData | null} the selected paths data
	 */ _selectPathsDataForContext(requestPath, tsconfigPathsMap) {
        const { main, allContexts, contextList } = tsconfigPathsMap;
        if (!requestPath) {
            return main;
        }
        let longestMatch = null;
        let longestMatchLength = 0;
        // Iterate over the pre-computed key list + indexed access into
        // `allContexts` — the previous `Object.entries(allContexts)` form
        // allocated a fresh `[key, value][]` array on every resolve.
        for(let i = 0; i < contextList.length; i++){
            const context = contextList[i];
            const data = allContexts[context];
            if (context === requestPath) {
                return data;
            }
            if (isSubPath(context, requestPath) && context.length > longestMatchLength) {
                longestMatch = data;
                longestMatchLength = context.length;
            }
        }
        if (longestMatch) {
            return longestMatch;
        }
        return null;
    }
    /**
	 * Load tsconfig from extends path
	 * @param {Resolver} resolver the resolver
	 * @param {string} configFilePath current config file path
	 * @param {string} extendedConfigValue extends value
	 * @param {Set<string>} fileDependencies the file dependencies
	 * @param {Set<string>} visitedConfigPaths config paths being loaded (for circular extends detection)
	 * @returns {Promise<Tsconfig>} the extended tsconfig
	 */ async _loadTsconfigFromExtends(resolver, configFilePath, extendedConfigValue, fileDependencies, visitedConfigPaths) {
        const { fileSystem } = resolver;
        const currentDir = resolver.dirname(configFilePath);
        // Substitute ${configDir} in extends path
        extendedConfigValue = substituteConfigDir(extendedConfigValue, currentDir);
        // Remember the original value before potentially appending .json
        const originalExtendedConfigValue = extendedConfigValue;
        if (typeof extendedConfigValue === "string" && !extendedConfigValue.includes(".json")) {
            extendedConfigValue += ".json";
        }
        let extendedConfigPath = resolver.join(currentDir, extendedConfigValue);
        const exists = await new Promise((resolve)=>{
            fileSystem.readFile(extendedConfigPath, (err)=>{
                resolve(!err);
            });
        });
        if (!exists) {
            // Handle scoped package extends like "@scope/name" (no sub-path):
            // "@scope/name" should resolve to node_modules/@scope/name/tsconfig.json,
            // not node_modules/@scope/name.json
            // See: test/fixtures/tsconfig-paths/extends-pkg-entry/
            if (typeof originalExtendedConfigValue === "string" && originalExtendedConfigValue.startsWith("@") && originalExtendedConfigValue.split("/").length === 2) {
                extendedConfigPath = resolver.join(currentDir, normalize(`node_modules/${originalExtendedConfigValue}/${DEFAULT_CONFIG_FILE}`));
            } else if (extendedConfigValue.includes("/")) {
                // Handle package sub-path extends like "react/tsconfig":
                // "react/tsconfig" resolves to node_modules/react/tsconfig.json
                // See: test/fixtures/tsconfig-paths/extends-npm/
                extendedConfigPath = resolver.join(currentDir, normalize(`node_modules/${extendedConfigValue}`));
            }
        }
        const config = await this._loadTsconfig(resolver, extendedConfigPath, fileDependencies, visitedConfigPaths);
        const compilerOptions = config.compilerOptions || {
            baseUrl: undefined
        };
        if (compilerOptions.baseUrl) {
            const extendedConfigDir = resolver.dirname(extendedConfigPath);
            compilerOptions.baseUrl = getAbsoluteBaseUrl(extendedConfigDir, resolver, compilerOptions.baseUrl);
        }
        delete config.references;
        return config;
    }
    /**
	 * Load referenced tsconfig projects and store in referenceMatchMap
	 * Simple implementation matching tsconfig-paths-webpack-plugin:
	 * Just load each reference and store independently
	 * @param {Resolver} resolver the resolver
	 * @param {string} context the context
	 * @param {TsconfigReference[]} references array of references
	 * @param {Set<string>} fileDependencies the file dependencies
	 * @param {{ [baseUrl: string]: TsconfigPathsData }} referenceMatchMap the map to populate
	 * @returns {Promise<void>}
	 */ async _loadTsconfigReferences(resolver, context, references, fileDependencies, referenceMatchMap) {
        await Promise.all(references.map(async (ref)=>{
            const refPath = substituteConfigDir(ref.path, context);
            const refConfigPath = resolver.join(resolver.join(context, refPath), DEFAULT_CONFIG_FILE);
            try {
                const refConfig = await this._loadTsconfig(resolver, refConfigPath, fileDependencies);
                if (refConfig.compilerOptions && refConfig.compilerOptions.paths) {
                    const refContext = resolver.dirname(refConfigPath);
                    referenceMatchMap[refContext] = tsconfigPathsToResolveOptions(refContext, refConfig.compilerOptions.paths || {}, resolver, refConfig.compilerOptions.baseUrl);
                }
                if (this.references === "auto" && Array.isArray(refConfig.references)) {
                    await this._loadTsconfigReferences(resolver, resolver.dirname(refConfigPath), refConfig.references, fileDependencies, referenceMatchMap);
                }
            } catch (_err) {
            // continue
            }
        }));
    }
    /**
	 * Load tsconfig.json with extends support
	 * @param {Resolver} resolver the resolver
	 * @param {string} configFilePath absolute path to tsconfig.json
	 * @param {Set<string>} fileDependencies the file dependencies
	 * @param {Set<string>=} visitedConfigPaths config paths being loaded (for circular extends detection)
	 * @returns {Promise<Tsconfig>} the merged tsconfig
	 */ async _loadTsconfig(resolver, configFilePath, fileDependencies, visitedConfigPaths = new Set()) {
        if (visitedConfigPaths.has(configFilePath)) {
            return {};
        }
        visitedConfigPaths.add(configFilePath);
        const config = await readJson(resolver.fileSystem, configFilePath, {
            stripComments: true
        });
        fileDependencies.add(configFilePath);
        let result = config;
        const extendedConfig = config.extends;
        if (extendedConfig) {
            let base;
            if (Array.isArray(extendedConfig)) {
                base = {};
                for (const extendedConfigElement of extendedConfig){
                    const extendedTsconfig = await this._loadTsconfigFromExtends(resolver, configFilePath, extendedConfigElement, fileDependencies, visitedConfigPaths);
                    base = mergeTsconfigs(base, extendedTsconfig);
                }
            } else {
                base = await this._loadTsconfigFromExtends(resolver, configFilePath, extendedConfig, fileDependencies, visitedConfigPaths);
            }
            result = mergeTsconfigs(base, config);
        }
        return result;
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/memoize.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /**
 * @template T
 * @typedef {() => T} FunctionReturning
 */ /**
 * @template T
 * @param {FunctionReturning<T>} fn memorized function
 * @returns {FunctionReturning<T>} new function
 */ const memoize = (fn)=>{
    let cache = false;
    /** @type {T | undefined} */ let result;
    return ()=>{
        if (cache) {
            return result;
        }
        result = fn();
        cache = true;
        // Allow to clean up memory for fn
        // and all dependent resources
        /** @type {FunctionReturning<T> | undefined} */ fn = undefined;
        return result;
    };
};
module.exports = memoize;
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ // eslint-disable-next-line n/prefer-global/process
const { nextTick } = __turbopack_context__.r("[externals]/process [external] (process, cjs)");
/** @typedef {import("./Resolver").FileSystem} FileSystem */ /** @typedef {import("./Resolver").PathLike} PathLike */ /** @typedef {import("./Resolver").PathOrFileDescriptor} PathOrFileDescriptor */ /** @typedef {import("./Resolver").SyncFileSystem} SyncFileSystem */ /** @typedef {FileSystem & SyncFileSystem} BaseFileSystem */ /**
 * @template T
 * @typedef {import("./Resolver").FileSystemCallback<T>} FileSystemCallback<T>
 */ /**
 * @param {string} path path
 * @returns {string} dirname
 */ const dirname = (path)=>{
    let idx = path.length - 1;
    while(idx >= 0){
        const char = path.charCodeAt(idx);
        // slash or backslash
        if (char === 47 || char === 92) break;
        idx--;
    }
    if (idx < 0) return "";
    return path.slice(0, idx);
};
/**
 * @template T
 * @param {FileSystemCallback<T>[]} callbacks callbacks
 * @param {Error | null} err error
 * @param {T} result result
 */ const runCallbacks = (callbacks, err, result)=>{
    if (callbacks.length === 1) {
        callbacks[0](err, result);
        callbacks.length = 0;
        return;
    }
    let error;
    for (const callback of callbacks){
        try {
            callback(err, result);
        } catch (err) {
            if (!error) error = err;
        }
    }
    callbacks.length = 0;
    if (error) throw error;
};
// eslint-disable-next-line jsdoc/reject-function-type
/** @typedef {Function} EXPECTED_FUNCTION */ // eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {any} EXPECTED_ANY */ class OperationMergerBackend {
    /**
	 * @param {EXPECTED_FUNCTION | undefined} provider async method in filesystem
	 * @param {EXPECTED_FUNCTION | undefined} syncProvider sync method in filesystem
	 * @param {BaseFileSystem} providerContext call context for the provider methods
	 */ constructor(provider, syncProvider, providerContext){
        this._provider = provider;
        this._syncProvider = syncProvider;
        this._providerContext = providerContext;
        this._activeAsyncOperations = new Map();
        this.provide = this._provider ? /**
				 * @param {PathLike | PathOrFileDescriptor} path path
				 * @param {object | FileSystemCallback<EXPECTED_ANY> | undefined} options options
				 * @param {FileSystemCallback<EXPECTED_ANY>=} callback callback
				 * @returns {EXPECTED_ANY} result
				 */ (path, options, callback)=>{
            if (typeof options === "function") {
                callback = options;
                options = undefined;
            }
            if (typeof path !== "string" && !Buffer.isBuffer(path) && !(path instanceof URL) && typeof path !== "number") {
                /** @type {EXPECTED_FUNCTION} */ callback(new TypeError("path must be a string, Buffer, URL or number"));
                return;
            }
            if (options) {
                return /** @type {EXPECTED_FUNCTION} */ this._provider.call(this._providerContext, path, options, callback);
            }
            let callbacks = this._activeAsyncOperations.get(path);
            if (callbacks) {
                callbacks.push(callback);
                return;
            }
            this._activeAsyncOperations.set(path, callbacks = [
                callback
            ]);
            /** @type {EXPECTED_FUNCTION} */ provider(path, /**
						 * @param {Error} err error
						 * @param {EXPECTED_ANY} result result
						 */ (err, result)=>{
                this._activeAsyncOperations.delete(path);
                runCallbacks(callbacks, err, result);
            });
        } : null;
        this.provideSync = this._syncProvider ? /**
				 * @param {PathLike | PathOrFileDescriptor} path path
				 * @param {object=} options options
				 * @returns {EXPECTED_ANY} result
				 */ (path, options)=>/** @type {EXPECTED_FUNCTION} */ this._syncProvider.call(this._providerContext, path, options) : null;
    }
    purge() {}
    purgeParent() {}
}
/*

IDLE:
	insert data: goto SYNC

SYNC:
	before provide: run ticks
	event loop tick: goto ASYNC_ACTIVE

ASYNC:
	timeout: run tick, goto ASYNC_PASSIVE

ASYNC_PASSIVE:
	before provide: run ticks

IDLE --[insert data]--> SYNC --[event loop tick]--> ASYNC_ACTIVE --[interval tick]-> ASYNC_PASSIVE
                                                          ^                             |
                                                          +---------[insert data]-------+
*/ const STORAGE_MODE_IDLE = 0;
const STORAGE_MODE_SYNC = 1;
const STORAGE_MODE_ASYNC = 2;
/**
 * @callback Provide
 * @param {PathLike | PathOrFileDescriptor} path path
 * @param {EXPECTED_ANY} options options
 * @param {FileSystemCallback<EXPECTED_ANY>} callback callback
 * @returns {void}
 */ class CacheBackend {
    /**
	 * @param {number} duration max cache duration of items
	 * @param {EXPECTED_FUNCTION | undefined} provider async method
	 * @param {EXPECTED_FUNCTION | undefined} syncProvider sync method
	 * @param {BaseFileSystem} providerContext call context for the provider methods
	 */ constructor(duration, provider, syncProvider, providerContext){
        this._duration = duration;
        this._provider = provider;
        this._syncProvider = syncProvider;
        this._providerContext = providerContext;
        /** @type {Map<string, FileSystemCallback<EXPECTED_ANY>[]>} */ this._activeAsyncOperations = new Map();
        /** @type {Map<string, { err: Error | null, result?: EXPECTED_ANY, level: Set<string> }>} */ this._data = new Map();
        /** @type {Set<string>[]} */ this._levels = [];
        for(let i = 0; i < 10; i++)this._levels.push(new Set());
        if (duration !== Infinity) {
            for(let i = 5000; i < duration; i += 500){
                this._levels.push(new Set());
            }
        }
        this._currentLevel = 0;
        this._tickInterval = Math.floor(duration / this._levels.length);
        /** @type {STORAGE_MODE_IDLE | STORAGE_MODE_SYNC | STORAGE_MODE_ASYNC} */ this._mode = STORAGE_MODE_IDLE;
        /** @type {NodeJS.Timeout | undefined} */ this._timeout = undefined;
        /** @type {number | undefined} */ this._nextDecay = undefined;
        // eslint-disable-next-line no-warning-comments
        // @ts-ignore
        this.provide = provider ? this.provide.bind(this) : null;
        // eslint-disable-next-line no-warning-comments
        // @ts-ignore
        this.provideSync = syncProvider ? this.provideSync.bind(this) : null;
    }
    /**
	 * @param {PathLike | PathOrFileDescriptor} path path
	 * @param {EXPECTED_ANY} options options
	 * @param {FileSystemCallback<EXPECTED_ANY>} callback callback
	 * @returns {void}
	 */ provide(path, options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = undefined;
        }
        if (typeof path !== "string" && !Buffer.isBuffer(path) && !(path instanceof URL) && typeof path !== "number") {
            callback(new TypeError("path must be a string, Buffer, URL or number"));
            return;
        }
        const strPath = typeof path !== "string" ? path.toString() : path;
        if (options) {
            return /** @type {EXPECTED_FUNCTION} */ this._provider.call(this._providerContext, path, options, callback);
        }
        // When in sync mode we can move to async mode
        if (this._mode === STORAGE_MODE_SYNC) {
            this._enterAsyncMode();
        }
        // Check in cache
        const cacheEntry = this._data.get(strPath);
        if (cacheEntry !== undefined) {
            if (cacheEntry.err) return nextTick(callback, cacheEntry.err);
            return nextTick(callback, null, cacheEntry.result);
        }
        // Check if there is already the same operation running
        let callbacks = this._activeAsyncOperations.get(strPath);
        if (callbacks !== undefined) {
            callbacks.push(callback);
            return;
        }
        this._activeAsyncOperations.set(strPath, callbacks = [
            callback
        ]);
        // Run the operation
        /** @type {EXPECTED_FUNCTION} */ this._provider.call(this._providerContext, path, /**
			 * @param {Error | null} err error
			 * @param {EXPECTED_ANY=} result result
			 */ (err, result)=>{
            this._activeAsyncOperations.delete(strPath);
            this._storeResult(strPath, err, result);
            // Enter async mode if not yet done
            this._enterAsyncMode();
            runCallbacks(callbacks, err, result);
        });
    }
    /**
	 * @param {PathLike | PathOrFileDescriptor} path path
	 * @param {EXPECTED_ANY} options options
	 * @returns {EXPECTED_ANY} result
	 */ provideSync(path, options) {
        if (typeof path !== "string" && !Buffer.isBuffer(path) && !(path instanceof URL) && typeof path !== "number") {
            throw new TypeError("path must be a string");
        }
        const strPath = typeof path !== "string" ? path.toString() : path;
        if (options) {
            return /** @type {EXPECTED_FUNCTION} */ this._syncProvider.call(this._providerContext, path, options);
        }
        // In sync mode we may have to decay some cache items
        if (this._mode === STORAGE_MODE_SYNC) {
            this._runDecays();
        }
        // Check in cache
        const cacheEntry = this._data.get(strPath);
        if (cacheEntry !== undefined) {
            if (cacheEntry.err) throw cacheEntry.err;
            return cacheEntry.result;
        }
        // Get all active async operations
        // This sync operation will also complete them
        const callbacks = this._activeAsyncOperations.get(strPath);
        this._activeAsyncOperations.delete(strPath);
        // Run the operation
        // When in idle mode, we will enter sync mode
        let result;
        try {
            result = /** @type {EXPECTED_FUNCTION} */ this._syncProvider.call(this._providerContext, path);
        } catch (err) {
            this._storeResult(strPath, err, undefined);
            this._enterSyncModeWhenIdle();
            if (callbacks) {
                runCallbacks(callbacks, err, undefined);
            }
            throw err;
        }
        this._storeResult(strPath, null, result);
        this._enterSyncModeWhenIdle();
        if (callbacks) {
            runCallbacks(callbacks, null, result);
        }
        return result;
    }
    /**
	 * @param {(string | Buffer | URL | number | (string | URL | Buffer | number)[] | Set<string | URL | Buffer | number>)=} what what to purge
	 */ purge(what) {
        if (!what) {
            if (this._mode !== STORAGE_MODE_IDLE) {
                this._data.clear();
                for (const level of this._levels){
                    level.clear();
                }
                this._enterIdleMode();
            }
        } else if (typeof what === "string" || Buffer.isBuffer(what) || what instanceof URL || typeof what === "number") {
            const strWhat = typeof what !== "string" ? what.toString() : what;
            for (const [key, data] of this._data){
                if (key.startsWith(strWhat)) {
                    this._data.delete(key);
                    data.level.delete(key);
                }
            }
            if (this._data.size === 0) {
                this._enterIdleMode();
            }
        } else {
            for (const [key, data] of this._data){
                for (const item of what){
                    const strItem = typeof item !== "string" ? item.toString() : item;
                    if (key.startsWith(strItem)) {
                        this._data.delete(key);
                        data.level.delete(key);
                        break;
                    }
                }
            }
            if (this._data.size === 0) {
                this._enterIdleMode();
            }
        }
    }
    /**
	 * @param {(string | Buffer | URL | number | (string | URL | Buffer | number)[] | Set<string | URL | Buffer | number>)=} what what to purge
	 */ purgeParent(what) {
        if (!what) {
            this.purge();
        } else if (typeof what === "string" || Buffer.isBuffer(what) || what instanceof URL || typeof what === "number") {
            const strWhat = typeof what !== "string" ? what.toString() : what;
            this.purge(dirname(strWhat));
        } else {
            const set = new Set();
            for (const item of what){
                const strItem = typeof item !== "string" ? item.toString() : item;
                set.add(dirname(strItem));
            }
            this.purge(set);
        }
    }
    /**
	 * @param {string} path path
	 * @param {Error | null} err error
	 * @param {EXPECTED_ANY} result result
	 */ _storeResult(path, err, result) {
        if (this._data.has(path)) return;
        const level = this._levels[this._currentLevel];
        this._data.set(path, {
            err,
            result,
            level
        });
        level.add(path);
    }
    _decayLevel() {
        const nextLevel = (this._currentLevel + 1) % this._levels.length;
        const decay = this._levels[nextLevel];
        this._currentLevel = nextLevel;
        for (const item of decay){
            this._data.delete(item);
        }
        decay.clear();
        if (this._data.size === 0) {
            this._enterIdleMode();
        } else {
            /** @type {number} */ this._nextDecay += this._tickInterval;
        }
    }
    _runDecays() {
        while(/** @type {number} */ this._nextDecay <= Date.now() && this._mode !== STORAGE_MODE_IDLE){
            this._decayLevel();
        }
    }
    _enterAsyncMode() {
        let timeout = 0;
        switch(this._mode){
            case STORAGE_MODE_ASYNC:
                return;
            case STORAGE_MODE_IDLE:
                this._nextDecay = Date.now() + this._tickInterval;
                timeout = this._tickInterval;
                break;
            case STORAGE_MODE_SYNC:
                this._runDecays();
                // _runDecays may change the mode
                if (/** @type {STORAGE_MODE_IDLE | STORAGE_MODE_SYNC | STORAGE_MODE_ASYNC} */ this._mode === STORAGE_MODE_IDLE) {
                    return;
                }
                timeout = Math.max(0, /** @type {number} */ this._nextDecay - Date.now());
                break;
        }
        this._mode = STORAGE_MODE_ASYNC;
        // When duration is Infinity, cache entries never expire, so there
        // is no need to schedule a decay timer.
        if (this._duration === Infinity) {
            return;
        }
        const ref = setTimeout(()=>{
            this._mode = STORAGE_MODE_SYNC;
            this._runDecays();
        }, timeout);
        if (ref.unref) ref.unref();
        this._timeout = ref;
    }
    _enterSyncModeWhenIdle() {
        if (this._mode === STORAGE_MODE_IDLE) {
            this._mode = STORAGE_MODE_SYNC;
            this._nextDecay = Date.now() + this._tickInterval;
        }
    }
    _enterIdleMode() {
        this._mode = STORAGE_MODE_IDLE;
        this._nextDecay = undefined;
        if (this._timeout) clearTimeout(this._timeout);
    }
}
/**
 * @template {EXPECTED_FUNCTION} Provider
 * @template {EXPECTED_FUNCTION} AsyncProvider
 * @template FileSystem
 * @param {number} duration duration in ms files are cached
 * @param {Provider | undefined} provider provider
 * @param {AsyncProvider | undefined} syncProvider sync provider
 * @param {BaseFileSystem} providerContext provider context
 * @returns {OperationMergerBackend | CacheBackend} backend
 */ const createBackend = (duration, provider, syncProvider, providerContext)=>{
    if (duration > 0) {
        return new CacheBackend(duration, provider, syncProvider, providerContext);
    }
    return new OperationMergerBackend(provider, syncProvider, providerContext);
};
module.exports = class CachedInputFileSystem {
    /**
	 * @param {BaseFileSystem} fileSystem file system
	 * @param {number} duration duration in ms files are cached
	 */ constructor(fileSystem, duration){
        this.fileSystem = fileSystem;
        this._lstatBackend = createBackend(duration, this.fileSystem.lstat, this.fileSystem.lstatSync, this.fileSystem);
        const lstat = this._lstatBackend.provide;
        this.lstat = lstat;
        const lstatSync = this._lstatBackend.provideSync;
        this.lstatSync = lstatSync;
        this._statBackend = createBackend(duration, this.fileSystem.stat, this.fileSystem.statSync, this.fileSystem);
        const stat = this._statBackend.provide;
        this.stat = stat;
        const statSync = this._statBackend.provideSync;
        this.statSync = statSync;
        this._readdirBackend = createBackend(duration, this.fileSystem.readdir, this.fileSystem.readdirSync, this.fileSystem);
        const readdir = this._readdirBackend.provide;
        this.readdir = readdir;
        const readdirSync = this._readdirBackend.provideSync;
        this.readdirSync = readdirSync;
        this._readFileBackend = createBackend(duration, this.fileSystem.readFile, this.fileSystem.readFileSync, this.fileSystem);
        const readFile = this._readFileBackend.provide;
        this.readFile = readFile;
        const readFileSync = this._readFileBackend.provideSync;
        this.readFileSync = readFileSync;
        this._readJsonBackend = createBackend(duration, // prettier-ignore
        this.fileSystem.readJson || this.readFile && (/**
						 * @param {string} path path
						 * @param {FileSystemCallback<EXPECTED_ANY>} callback callback
						 */ (path, callback)=>{
            this.readFile(path, (err, buffer)=>{
                if (err) return callback(err);
                if (!buffer || buffer.length === 0) {
                    return callback(new Error("No file content"));
                }
                let data;
                try {
                    data = JSON.parse(buffer.toString("utf8"));
                } catch (err_) {
                    return callback(err_);
                }
                callback(null, data);
            });
        }), // prettier-ignore
        this.fileSystem.readJsonSync || this.readFileSync && (/**
						 * @param {string} path path
						 * @returns {EXPECTED_ANY} result
						 */ (path)=>{
            const buffer = this.readFileSync(path);
            const data = JSON.parse(buffer.toString("utf8"));
            return data;
        }), this.fileSystem);
        const readJson = this._readJsonBackend.provide;
        this.readJson = readJson;
        const readJsonSync = this._readJsonBackend.provideSync;
        this.readJsonSync = readJsonSync;
        this._readlinkBackend = createBackend(duration, this.fileSystem.readlink, this.fileSystem.readlinkSync, this.fileSystem);
        const readlink = this._readlinkBackend.provide;
        this.readlink = readlink;
        const readlinkSync = this._readlinkBackend.provideSync;
        this.readlinkSync = readlinkSync;
        this._realpathBackend = createBackend(duration, this.fileSystem.realpath, this.fileSystem.realpathSync, this.fileSystem);
        const realpath = this._realpathBackend.provide;
        this.realpath = realpath;
        const realpathSync = this._realpathBackend.provideSync;
        this.realpathSync = realpathSync;
    }
    /**
	 * @param {(string | Buffer | URL | number | (string | URL | Buffer | number)[] | Set<string | URL | Buffer | number>)=} what what to purge
	 */ purge(what) {
        this._statBackend.purge(what);
        this._lstatBackend.purge(what);
        this._readdirBackend.purgeParent(what);
        this._readFileBackend.purge(what);
        this._readlinkBackend.purge(what);
        this._readJsonBackend.purge(what);
        this._realpathBackend.purge(what);
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/DescriptionFileUtils.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ const forEachBail = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/forEachBail.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").JsonObject} JsonObject */ /** @typedef {import("./Resolver").JsonValue} JsonValue */ /** @typedef {import("./Resolver").ResolveContext} ResolveContext */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /**
 * @typedef {object} DescriptionFileInfo
 * @property {JsonObject=} content content
 * @property {string} path path
 * @property {string} directory directory
 */ /**
 * @callback ErrorFirstCallback
 * @param {Error | null=} error
 * @param {DescriptionFileInfo=} result
 */ /**
 * @typedef {object} Result
 * @property {string} path path to description file
 * @property {string} directory directory of description file
 * @property {JsonObject} content content of description file
 */ const CHAR_SLASH = 47;
const CHAR_BACKSLASH = 92;
/**
 * Walk up one directory. Called once per package-root candidate and once per
 * `described-resolve` (to find the enclosing description file), so it's on
 * the resolver's hot path.
 *
 * Previous implementation called `lastIndexOf("/")` and `lastIndexOf("\\")`
 * separately and then picked the larger. For any non-trivial directory
 * string on POSIX, `lastIndexOf("\\")` scans the full string just to return
 * -1. A single reverse char-code scan does the same work in one pass.
 *
 * Any single-character directory is treated as a root — `directory.length
 * <= 1` collapses the `"/"`, `"\\"` and `""` branches into one compare.
 * Without the `"\\"` case, `cdUp("\\")` (reached from a UNC root or a DOS
 * device path like `\\?\…`) would return itself via `slice(0, i || 1)`
 * and trap `loadDescriptionFile` in an infinite loop. Once single-char
 * roots are filtered up front, the reverse scan always produces a
 * strictly shorter string.
 * @param {string} directory directory
 * @returns {string | null} parent directory or null
 */ function cdUp(directory) {
    if (directory.length <= 1) return null;
    for(let i = directory.length - 1; i >= 0; i--){
        const code = directory.charCodeAt(i);
        if (code === CHAR_SLASH || code === CHAR_BACKSLASH) {
            return directory.slice(0, i || 1);
        }
    }
    return null;
}
/**
 * @param {Resolver} resolver resolver
 * @param {string} directory directory
 * @param {string[]} filenames filenames
 * @param {DescriptionFileInfo | undefined} oldInfo oldInfo
 * @param {ResolveContext} resolveContext resolveContext
 * @param {ErrorFirstCallback} callback callback
 */ function loadDescriptionFile(resolver, directory, filenames, oldInfo, resolveContext, callback) {
    (function findDescriptionFile() {
        if (oldInfo && oldInfo.directory === directory) {
            // We already have info for this directory and can reuse it
            return callback(null, oldInfo);
        }
        forEachBail(filenames, /**
			 * @param {string} filename filename
			 * @param {(err?: null | Error, result?: null | Result) => void} callback callback
			 * @returns {void}
			 */ (filename, callback)=>{
            const descriptionFilePath = resolver.join(directory, filename);
            /**
				 * @param {(null | Error)=} err error
				 * @param {JsonObject=} resolvedContent content
				 * @returns {void}
				 */ function onJson(err, resolvedContent) {
                if (err) {
                    if (resolveContext.log) {
                        resolveContext.log(`${descriptionFilePath} (directory description file): ${err}`);
                    } else {
                        err.message = `${descriptionFilePath} (directory description file): ${err}`;
                    }
                    return callback(err);
                }
                callback(null, {
                    content: resolvedContent,
                    directory,
                    path: descriptionFilePath
                });
            }
            if (resolver.fileSystem.readJson) {
                resolver.fileSystem.readJson(descriptionFilePath, (err, content)=>{
                    if (err) {
                        if (typeof /** @type {NodeJS.ErrnoException} */ err.code !== "undefined") {
                            if (resolveContext.missingDependencies) {
                                resolveContext.missingDependencies.add(descriptionFilePath);
                            }
                            return callback();
                        }
                        if (resolveContext.fileDependencies) {
                            resolveContext.fileDependencies.add(descriptionFilePath);
                        }
                        return onJson(err);
                    }
                    if (resolveContext.fileDependencies) {
                        resolveContext.fileDependencies.add(descriptionFilePath);
                    }
                    onJson(null, content);
                });
            } else {
                resolver.fileSystem.readFile(descriptionFilePath, (err, content)=>{
                    if (err) {
                        if (resolveContext.missingDependencies) {
                            resolveContext.missingDependencies.add(descriptionFilePath);
                        }
                        return callback();
                    }
                    if (resolveContext.fileDependencies) {
                        resolveContext.fileDependencies.add(descriptionFilePath);
                    }
                    /** @type {JsonObject | undefined} */ let json;
                    if (content) {
                        try {
                            json = JSON.parse(content.toString());
                        } catch (/** @type {unknown} */ err_) {
                            return onJson(err_);
                        }
                    } else {
                        return onJson(new Error("No content in file"));
                    }
                    onJson(null, json);
                });
            }
        }, /**
			 * @param {(null | Error)=} err error
			 * @param {(null | Result)=} result result
			 * @returns {void}
			 */ (err, result)=>{
            if (err) return callback(err);
            if (result) return callback(null, result);
            const dir = cdUp(directory);
            if (!dir) {
                return callback();
            }
            directory = dir;
            return findDescriptionFile();
        });
    })();
}
/**
 * @param {JsonObject} content content
 * @param {string | string[]} field field
 * @returns {JsonValue | undefined} field data
 */ function getField(content, field) {
    if (!content) return undefined;
    if (Array.isArray(field)) {
        /** @type {JsonValue} */ let current = content;
        for(let j = 0; j < field.length; j++){
            if (current === null || typeof current !== "object") {
                current = null;
                break;
            }
            current = /** @type {JsonObject} */ current[field[j]];
        }
        return current;
    }
    return content[field];
}
module.exports.cdUp = cdUp;
module.exports.getField = getField;
module.exports.loadDescriptionFile = loadDescriptionFile;
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/getInnerRequest.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ const { isRelativeRequest } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/path.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /**
 * @param {Resolver} resolver resolver
 * @param {ResolveRequest} request string
 * @returns {string} inner request
 */ module.exports = function getInnerRequest(resolver, request) {
    if (typeof request.__innerRequest === "string" && request.__innerRequest_request === request.request && request.__innerRequest_relativePath === request.relativePath) {
        return request.__innerRequest;
    }
    /** @type {string | undefined} */ let innerRequest;
    if (request.request) {
        innerRequest = request.request;
        if (request.relativePath && isRelativeRequest(innerRequest)) {
            innerRequest = resolver.join(request.relativePath, innerRequest);
        }
    } else {
        innerRequest = request.relativePath;
    }
    // eslint-disable-next-line camelcase
    request.__innerRequest_request = request.request;
    // eslint-disable-next-line camelcase
    request.__innerRequest_relativePath = request.relativePath;
    return request.__innerRequest = innerRequest;
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/AliasFieldPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ const DescriptionFileUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/DescriptionFileUtils.js [postcss] (ecmascript)");
const getInnerRequest = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/getInnerRequest.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").JsonPrimitive} JsonPrimitive */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ // Sentinel stored in `_fieldDataCache` when a description file does not
// contain a usable alias field object. Lets us distinguish "not cached yet"
// from "no valid field" without calling back into `getField`.
const NO_FIELD_OBJECT = Symbol("NoFieldObject");
module.exports = class AliasFieldPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | string[]} field field
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, field, target){
        this.source = source;
        this.field = field;
        this.target = target;
        // `this.field` is fixed for the plugin's lifetime, so caching
        // per description-file content is safe. The cached value is either
        // the resolved alias-map object or the `NO_FIELD_OBJECT` sentinel
        // meaning "description file has no usable alias field".
        /** @type {WeakMap<import("./Resolver").JsonObject, { [k: string]: JsonPrimitive } | typeof NO_FIELD_OBJECT>} */ this._fieldDataCache = new WeakMap();
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("AliasFieldPlugin", (request, resolveContext, callback)=>{
            if (!request.descriptionFileData) return callback();
            const innerRequest = getInnerRequest(resolver, request);
            if (!innerRequest) return callback();
            const { descriptionFileData } = request;
            let fieldData = this._fieldDataCache.get(descriptionFileData);
            if (fieldData === undefined) {
                const raw = DescriptionFileUtils.getField(descriptionFileData, this.field);
                if (raw === null || typeof raw !== "object") {
                    this._fieldDataCache.set(descriptionFileData, NO_FIELD_OBJECT);
                    if (resolveContext.log) {
                        resolveContext.log(`Field '${this.field}' doesn't contain a valid alias configuration`);
                    }
                    return callback();
                }
                fieldData = raw;
                this._fieldDataCache.set(descriptionFileData, fieldData);
            } else if (fieldData === NO_FIELD_OBJECT) {
                if (resolveContext.log) {
                    resolveContext.log(`Field '${this.field}' doesn't contain a valid alias configuration`);
                }
                return callback();
            }
            /** @type {JsonPrimitive | undefined} */ const data = Object.prototype.hasOwnProperty.call(fieldData, innerRequest) ? /** @type {{ [Key in string]: JsonPrimitive }} */ fieldData[innerRequest] : innerRequest.startsWith("./") ? /** @type {{ [Key in string]: JsonPrimitive }} */ fieldData[innerRequest.slice(2)] : undefined;
            if (data === innerRequest) return callback();
            if (data === undefined) return callback();
            if (data === false) {
                /** @type {ResolveRequest} */ const ignoreObj = {
                    ...request,
                    path: false
                };
                if (typeof resolveContext.yield === "function") {
                    resolveContext.yield(ignoreObj);
                    return callback(null, null);
                }
                return callback(null, ignoreObj);
            }
            /** @type {ResolveRequest} */ const obj = {
                ...request,
                path: request.descriptionFileRoot,
                request: data,
                fullySpecified: false
            };
            resolver.doResolve(target, obj, `aliased from description file ${request.descriptionFilePath} with mapping '${innerRequest}' to '${/** @type {string} */ data}'`, resolveContext, (err, result)=>{
                if (err) return callback(err);
                // Don't allow other aliasing or raw request
                if (result === undefined) return callback(null, null);
                callback(null, result);
            });
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/AliasPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ /** @typedef {string | string[] | false} Alias */ /** @typedef {{ alias: Alias, name: string, onlyModule?: boolean }} AliasOption */ const { aliasResolveHandler, compileAliasOptions } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/AliasUtils.js [postcss] (ecmascript)");
/**
 * When `alias` is given as an array, the targets are tried in priority
 * order and the first matching one wins. Tried-and-failed higher-priority
 * targets are recorded on `resolveContext.missingDependencies` (via the
 * downstream `FileExistsPlugin`) so that a consumer's watcher can
 * invalidate the resolve once one of them appears. The winning target is
 * recorded on `resolveContext.fileDependencies`; its removal triggers
 * re-resolution, at which point the fallback target is returned.
 *
 * Callers that cache successful resolves (e.g. webpack's `unsafeCache`)
 * are responsible for invalidating those entries when the tracked
 * dependencies change -- otherwise a stale path may survive across
 * rebuilds even though this plugin itself would return the correct
 * fallback on a fresh resolve.
 */ module.exports = class AliasPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {AliasOption | AliasOption[]} options options
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, options, target){
        this.source = source;
        this.options = Array.isArray(options) ? options : [
            options
        ];
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        const compiled = compileAliasOptions(resolver, this.options);
        resolver.getHook(this.source).tapAsync("AliasPlugin", (request, resolveContext, callback)=>{
            aliasResolveHandler(resolver, compiled, target, request, resolveContext, callback);
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/AppendPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class AppendPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string} appending appending
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, appending, target){
        this.source = source;
        this.appending = appending;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("AppendPlugin", (request, resolveContext, callback)=>{
            /** @type {ResolveRequest} */ const obj = {
                ...request,
                path: request.path + this.appending,
                relativePath: request.relativePath && request.relativePath + this.appending
            };
            resolver.doResolve(target, obj, this.appending, resolveContext, callback);
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ConditionalPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class ConditionalPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {Partial<ResolveRequest>} test compare object
	 * @param {string | null} message log message
	 * @param {boolean} allowAlternatives when false, do not continue with the current step when "test" matches
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, test, message, allowAlternatives, target){
        this.source = source;
        this.test = test;
        this.message = message;
        this.allowAlternatives = allowAlternatives;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        const { test, message, allowAlternatives } = this;
        const keys = Object.keys(test);
        resolver.getHook(this.source).tapAsync("ConditionalPlugin", (request, resolveContext, callback)=>{
            for (const prop of keys){
                if (request[prop] !== test[prop]) return callback();
            }
            resolver.doResolve(target, request, message, resolveContext, allowAlternatives ? callback : (err, result)=>{
                if (err) return callback(err);
                // Don't allow other alternatives
                if (result === undefined) return callback(null, null);
                callback(null, result);
            });
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/DescriptionFilePlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ const DescriptionFileUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/DescriptionFileUtils.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class DescriptionFilePlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string[]} filenames filenames
	 * @param {boolean} pathIsFile pathIsFile
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, filenames, pathIsFile, target){
        this.source = source;
        this.filenames = filenames;
        this.pathIsFile = pathIsFile;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("DescriptionFilePlugin", (request, resolveContext, callback)=>{
            const { path } = request;
            if (!path) return callback();
            const directory = this.pathIsFile ? DescriptionFileUtils.cdUp(path) : path;
            if (!directory) return callback();
            DescriptionFileUtils.loadDescriptionFile(resolver, directory, this.filenames, request.descriptionFilePath ? {
                path: request.descriptionFilePath,
                content: request.descriptionFileData,
                directory: request.descriptionFileRoot
            } : undefined, resolveContext, (err, result)=>{
                if (err) return callback(err);
                if (!result) {
                    if (resolveContext.log) {
                        resolveContext.log(`No description file found in ${directory} or above`);
                    }
                    return callback();
                }
                // Normalize the relative path to use POSIX separators. On
                // POSIX most paths never contain a backslash, so skip the
                // regex replace when possible — `includes` is one pass,
                // `replace` with a global regex allocates a lastIndex
                // state machine.
                const rawRelative = path.slice(result.directory.length);
                const relativePath = `.${rawRelative.includes("\\") ? rawRelative.replace(/\\/g, "/") : rawRelative}`;
                /** @type {ResolveRequest} */ const obj = {
                    ...request,
                    descriptionFilePath: result.path,
                    descriptionFileData: result.content,
                    descriptionFileRoot: result.directory,
                    relativePath
                };
                resolver.doResolve(target, obj, `using description file: ${result.path} (relative path: ${relativePath})`, resolveContext, (err, result)=>{
                    if (err) return callback(err);
                    // Don't allow other processing
                    if (result === undefined) return callback(null, null);
                    callback(null, result);
                });
            });
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/DirectoryExistsPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class DirectoryExistsPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, target){
        this.source = source;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("DirectoryExistsPlugin", (request, resolveContext, callback)=>{
            const fs = resolver.fileSystem;
            const directory = request.path;
            if (!directory) return callback();
            fs.stat(directory, (err, stat)=>{
                if (err || !stat) {
                    if (resolveContext.missingDependencies) {
                        resolveContext.missingDependencies.add(directory);
                    }
                    if (resolveContext.log) {
                        resolveContext.log(`${directory} doesn't exist`);
                    }
                    return callback();
                }
                if (!stat.isDirectory()) {
                    if (resolveContext.missingDependencies) {
                        resolveContext.missingDependencies.add(directory);
                    }
                    if (resolveContext.log) {
                        resolveContext.log(`${directory} is not a directory`);
                    }
                    return callback();
                }
                if (resolveContext.fileDependencies) {
                    resolveContext.fileDependencies.add(directory);
                }
                resolver.doResolve(target, request, `existing directory ${directory}`, resolveContext, callback);
            });
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/identifier.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/ const memorize = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/memoize.js [postcss] (ecmascript)");
const getUrl = memorize(()=>__turbopack_context__.r("[externals]/url [external] (url, cjs)"));
const PATH_QUERY_FRAGMENT_REGEXP = /^(#?(?:\0.|[^?#\0])*)(\?(?:\0.|[^#\0])*)?(#.*)?$/;
const ZERO_ESCAPE_REGEXP = /\0(.)/g;
const FILE_REG_EXP = /file:/i;
/**
 * Index past a DOS device path prefix (`\\?\…` or `\\.\…`), or 0. Kept
 * out of `parseIdentifier` on purpose: inlining it back bloats the caller
 * beyond the size where V8's interpreter and JIT both handle it well
 * (the cause of the description-files-multi CodSpeed regression).
 * @param {string} identifier identifier known to start with `\`
 * @returns {number} 4 if identifier starts with a DOS device prefix, else 0
 */ function dosPrefixEnd(identifier) {
    if (identifier.length >= 4 && identifier.charCodeAt(1) === 92 && identifier.charCodeAt(3) === 92) {
        const c2 = identifier.charCodeAt(2);
        if (c2 === 63 || c2 === 46) return 4;
    }
    return 0;
}
/**
 * @param {string} identifier identifier
 * @returns {[string, string, string] | null} parsed identifier
 */ function parseIdentifier(identifier) {
    if (!identifier) {
        return null;
    }
    if (FILE_REG_EXP.test(identifier)) {
        identifier = getUrl().fileURLToPath(identifier);
    }
    const firstEscape = identifier.indexOf("\0");
    // Handle `\0`
    if (firstEscape !== -1) {
        const match = PATH_QUERY_FRAGMENT_REGEXP.exec(identifier);
        if (!match) return null;
        return [
            match[1].replace(ZERO_ESCAPE_REGEXP, "$1"),
            match[2] ? match[2].replace(ZERO_ESCAPE_REGEXP, "$1") : "",
            match[3] || ""
        ];
    }
    // Fast path for inputs that don't use \0 escaping. DOS device paths
    // (`\\?\…`, `\\.\…`) embed a literal `?` / `.` that must not be read
    // as a query separator; skip past the prefix when the input actually
    // starts with `\`. Gate is a single char-code compare so this function
    // stays inside V8's inline budget for its hot callers (resolver parse).
    const scanStart = identifier.charCodeAt(0) === 92 ? dosPrefixEnd(identifier) : 0;
    const queryStart = identifier.indexOf("?", scanStart);
    // Start at index 1 (or past a DOS prefix) to ignore a possible leading hash.
    const fragmentStart = identifier.indexOf("#", scanStart || 1);
    if (fragmentStart < 0) {
        if (queryStart < 0) {
            // No fragment, no query
            return [
                identifier,
                "",
                ""
            ];
        }
        // Query, no fragment
        return [
            identifier.slice(0, queryStart),
            identifier.slice(queryStart),
            ""
        ];
    }
    if (queryStart < 0 || fragmentStart < queryStart) {
        // Fragment, no query
        return [
            identifier.slice(0, fragmentStart),
            "",
            identifier.slice(fragmentStart)
        ];
    }
    // Query and fragment
    return [
        identifier.slice(0, queryStart),
        identifier.slice(queryStart, fragmentStart),
        identifier.slice(fragmentStart)
    ];
}
module.exports.parseIdentifier = parseIdentifier;
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/entrypoints.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/ const { parseIdentifier } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/identifier.js [postcss] (ecmascript)");
/** @typedef {string | (string | ConditionalMapping)[]} DirectMapping */ /** @typedef {{ [k: string]: MappingValue }} ConditionalMapping */ /** @typedef {ConditionalMapping | DirectMapping | null} MappingValue */ /** @typedef {Record<string, MappingValue> | ConditionalMapping | DirectMapping} ExportsField */ /** @typedef {Record<string, MappingValue>} ImportsField */ /**
 * Processing exports/imports field
 * @callback FieldProcessor
 * @param {string} request request
 * @param {Set<string>} conditionNames condition names
 * @returns {[string[], string | null]} resolved paths with used field
 */ /*
Example exports field:
{
  ".": "./main.js",
  "./feature": {
    "browser": "./feature-browser.js",
    "default": "./feature.js"
  }
}
Terminology:

Enhanced-resolve name keys ("." and "./feature") as exports field keys.

If value is string or string[], mapping is called as a direct mapping
and value called as a direct export.

If value is key-value object, mapping is called as a conditional mapping
and value called as a conditional export.

Key in conditional mapping is called condition name.

Conditional mapping nested in another conditional mapping is called nested mapping.

----------

Example imports field:
{
  "#a": "./main.js",
  "#moment": {
    "browser": "./moment/index.js",
    "default": "moment"
  },
  "#moment/": {
    "browser": "./moment/",
    "default": "moment/"
  }
}
Terminology:

Enhanced-resolve name keys ("#a" and "#moment/", "#moment") as imports field keys.

If value is string or string[], mapping is called as a direct mapping
and value called as a direct export.

If value is key-value object, mapping is called as a conditional mapping
and value called as a conditional export.

Key in conditional mapping is called condition name.

Conditional mapping nested in another conditional mapping is called nested mapping.

*/ const slashCode = "/".charCodeAt(0);
const dotCode = ".".charCodeAt(0);
const hashCode = "#".charCodeAt(0);
const patternRegEx = /\*/g;
/** @typedef {Record<string, MappingValue>} RecordMapping */ /**
 * Cached `Object.keys()` for objects whose shape does not change after the
 * first observation — i.e. parsed `package.json` fields and the nested
 * conditional mappings inside them. `Object.keys` allocates a fresh array
 * on every call; since `findMatch` / `conditionalMapping` run on every
 * bare-specifier resolve, the allocation adds up quickly.
 * @type {WeakMap<RecordMapping, string[]>}
 */ const _keysCache = new WeakMap();
/**
 * @param {RecordMapping} obj object to read keys from
 * @returns {string[]} cached keys array (DO NOT mutate)
 */ function cachedKeys(obj) {
    let keys = _keysCache.get(obj);
    if (keys === undefined) {
        keys = Object.keys(obj);
        _keysCache.set(obj, keys);
    }
    return keys;
}
/**
 * Per-key precomputed info used by `findMatch`. Equivalent to what the
 * previous implementation recomputed inline on every resolve.
 * @typedef {object} FieldKeyInfo
 * @property {string} key the original key
 * @property {number} patternIndex position of the single "*" in the key, or -1 when absent
 * @property {string} wildcardPrefix substring before "*" (empty when patternIndex === -1)
 * @property {string} wildcardSuffix substring after "*" (empty when patternIndex === -1)
 * @property {boolean} isLegacySubpath true when key is a legacy `./foo/`-style folder key with no "*"
 * @property {boolean} isPattern true when key contains "*"
 * @property {boolean} isSubpathMapping true when key ends with "/"
 * @property {boolean} isValidPattern true when key has at most one "*"
 */ /**
 * Cached per-field key metadata, keyed by the exports/imports field
 * object. Computed lazily on first `findMatch` call and reused forever.
 * Safe because `package.json` fields are immutable JSON values.
 * @type {WeakMap<RecordMapping, FieldKeyInfo[]>}
 */ const _fieldKeyInfoCache = new WeakMap();
/**
 * @param {ExportsField | ImportsField} field field object
 * @returns {FieldKeyInfo[]} precomputed per-key info
 */ function getFieldKeyInfos(field) {
    const fieldKey = field;
    let infos = _fieldKeyInfoCache.get(fieldKey);
    if (infos !== undefined) return infos;
    const keys = Object.getOwnPropertyNames(field);
    infos = Array.from({
        length: keys.length
    });
    for(let i = 0; i < keys.length; i++){
        const key = keys[i];
        const patternIndex = key.indexOf("*");
        const lastStar = patternIndex === -1 ? -1 : key.lastIndexOf("*");
        const keyLen = key.length;
        const endsWithSlash = keyLen > 0 && key.charCodeAt(keyLen - 1) === slashCode;
        infos[i] = {
            key,
            patternIndex,
            wildcardPrefix: patternIndex === -1 ? "" : key.slice(0, patternIndex),
            wildcardSuffix: patternIndex === -1 ? "" : key.slice(patternIndex + 1),
            isLegacySubpath: patternIndex === -1 && endsWithSlash,
            isPattern: patternIndex !== -1,
            isSubpathMapping: endsWithSlash,
            isValidPattern: patternIndex === -1 || lastStar === patternIndex
        };
    }
    _fieldKeyInfoCache.set(fieldKey, infos);
    return infos;
}
/**
 * @param {string} a first string
 * @param {string} b second string
 * @returns {number} compare result
 */ function patternKeyCompare(a, b) {
    const aPatternIndex = a.indexOf("*");
    const bPatternIndex = b.indexOf("*");
    const baseLenA = aPatternIndex === -1 ? a.length : aPatternIndex + 1;
    const baseLenB = bPatternIndex === -1 ? b.length : bPatternIndex + 1;
    if (baseLenA > baseLenB) return -1;
    if (baseLenB > baseLenA) return 1;
    if (aPatternIndex === -1) return 1;
    if (bPatternIndex === -1) return -1;
    if (a.length > b.length) return -1;
    if (b.length > a.length) return 1;
    return 0;
}
/** @typedef {[MappingValue, string, boolean, boolean, string] | null} MatchTuple */ /**
 * Per-field memoization of `findMatch(request, field)`. For a given field
 * the result depends only on the `request` string (it does NOT depend on
 * `conditionNames` — that's applied separately by `conditionalMapping`),
 * so we can cache the tuple keyed by request.
 *
 * Typical build traffic runs the same request through the resolver
 * repeatedly (same import re-resolved from different source files, module
 * graph traversals that revisit a package, etc.), and every one of those
 * hits walks the same key list and allocates the same tuple. Caching the
 * tuple turns the second-and-onward call into a single Map lookup.
 *
 * Keyed on the field object via a module-level `WeakMap`, so the cache
 * is freed automatically when the owning description file is GC'd.
 * @type {WeakMap<RecordMapping, Map<string, MatchTuple>>}
 */ const _findMatchCache = new WeakMap();
/**
 * @param {string} request request
 * @param {ExportsField | ImportsField} field exports or import field
 * @returns {MatchTuple} match result (uncached)
 */ function computeFindMatch(request, field) {
    const requestLen = request.length;
    const requestEndsWithSlash = requestLen > 0 && request.charCodeAt(requestLen - 1) === slashCode;
    const requestHasStar = request.includes("*");
    if (!requestHasStar && !requestEndsWithSlash && Object.prototype.hasOwnProperty.call(field, request)) {
        const target = /** @type {{ [k: string]: MappingValue }} */ field[request];
        return [
            target,
            "",
            false,
            false,
            request
        ];
    }
    /** @type {string} */ let bestMatch = "";
    /** @type {FieldKeyInfo | null} */ let bestMatchInfo = null;
    /** @type {string | undefined} */ let bestMatchSubpath;
    const infos = getFieldKeyInfos(field);
    for(let i = 0; i < infos.length; i++){
        const info = infos[i];
        const { key, patternIndex } = info;
        if (patternIndex !== -1) {
            if (!info.isValidPattern || !request.startsWith(info.wildcardPrefix) || requestLen < key.length || !request.endsWith(info.wildcardSuffix) || patternKeyCompare(bestMatch, key) !== 1) {
                continue;
            }
            bestMatch = key;
            bestMatchInfo = info;
            bestMatchSubpath = request.slice(patternIndex, requestLen - info.wildcardSuffix.length);
        } else if (info.isLegacySubpath && request.startsWith(key) && patternKeyCompare(bestMatch, key) === 1) {
            bestMatch = key;
            bestMatchInfo = info;
            bestMatchSubpath = request.slice(key.length);
        }
    }
    if (bestMatch === "") return null;
    const target = /** @type {{ [k: string]: MappingValue }} */ field[bestMatch];
    return [
        target,
        bestMatchSubpath,
        /** @type {FieldKeyInfo} */ bestMatchInfo.isSubpathMapping,
        /** @type {FieldKeyInfo} */ bestMatchInfo.isPattern,
        bestMatch
    ];
}
/**
 * Trying to match request to field
 * @param {string} request request
 * @param {ExportsField | ImportsField} field exports or import field
 * @returns {MatchTuple} match or null, number is negative and one less when it's a folder mapping, number is request.length + 1 for direct mappings
 */ function findMatch(request, field) {
    const fieldKey = field;
    let perRequest = _findMatchCache.get(fieldKey);
    if (perRequest !== undefined) {
        const cached = perRequest.get(request);
        if (cached !== undefined) return cached;
        // `null` is a valid cached value (= "no match"), so a `get(...)`
        // that returns undefined could either mean "not cached yet" or
        // "cached null". Do the explicit `has` only in the undefined case.
        if (perRequest.has(request)) return null;
    } else {
        perRequest = new Map();
        _findMatchCache.set(fieldKey, perRequest);
    }
    const result = computeFindMatch(request, field);
    perRequest.set(request, result);
    return result;
}
/**
 * @param {ConditionalMapping | DirectMapping | null} mapping mapping
 * @returns {boolean} is conditional mapping
 */ function isConditionalMapping(mapping) {
    return mapping !== null && typeof mapping === "object" && !Array.isArray(mapping);
}
/**
 * Sentinel stored in the conditional-mapping cache for inputs whose walk
 * returns `null` ("no condition matched"). Using a non-null marker lets the
 * cache-hit path be a single `WeakMap.get()` — we distinguish
 * "cached null" from "not cached yet" without a second `has` call.
 */ const NULL_RESULT = Symbol("NULL_RESULT");
/**
 * Memoization of `conditionalMapping(mapping, conditionNames)`. The result
 * depends only on the mapping object (immutable — owned by a parsed
 * `package.json`) and the `conditionNames` Set (owned by the resolver's
 * options and stable for its lifetime), so it is safe to cache per (mapping,
 * conditionNames) pair.
 *
 * A conditional `exports` entry that appears inside a `directMapping` array
 * (the common `"browser": [...fallback list...]` shape, plus nested
 * conditions) gets walked on every resolve that traverses the parent entry.
 * Without this cache each of those walks re-reads `Object.keys` on the
 * mapping and re-visits every condition until one matches, even though the
 * inputs are identical.
 *
 * Outer key is the conditional mapping itself; inner key is the condition
 * Set. Both are object references, so WeakMap-of-WeakMap lets both levels
 * be collected automatically when the description file or resolver go away.
 * @type {WeakMap<ConditionalMapping, WeakMap<Set<string>, DirectMapping | typeof NULL_RESULT>>}
 */ const _conditionalMappingCache = new WeakMap();
/**
 * @param {ConditionalMapping} conditionalMapping_ conditional mapping
 * @param {Set<string>} conditionNames condition names
 * @returns {DirectMapping | null} direct mapping if found (uncached)
 */ function computeConditionalMapping(conditionalMapping_, conditionNames) {
    /** @type {[ConditionalMapping, string[], number][]} */ const lookup = [
        [
            conditionalMapping_,
            cachedKeys(conditionalMapping_),
            0
        ]
    ];
    loop: while(lookup.length > 0){
        const [mapping, conditions, j] = lookup[lookup.length - 1];
        for(let i = j; i < conditions.length; i++){
            const condition = conditions[i];
            if (condition === "default") {
                const innerMapping = mapping[condition];
                // is nested
                if (isConditionalMapping(innerMapping)) {
                    const conditionalMapping = innerMapping;
                    lookup[lookup.length - 1][2] = i + 1;
                    lookup.push([
                        conditionalMapping,
                        cachedKeys(conditionalMapping),
                        0
                    ]);
                    continue loop;
                }
                return innerMapping;
            }
            if (conditionNames.has(condition)) {
                const innerMapping = mapping[condition];
                // is nested
                if (isConditionalMapping(innerMapping)) {
                    const conditionalMapping = innerMapping;
                    lookup[lookup.length - 1][2] = i + 1;
                    lookup.push([
                        conditionalMapping,
                        cachedKeys(conditionalMapping),
                        0
                    ]);
                    continue loop;
                }
                return innerMapping;
            }
        }
        lookup.pop();
    }
    return null;
}
/**
 * @param {ConditionalMapping} conditionalMapping_ conditional mapping
 * @param {Set<string>} conditionNames condition names
 * @returns {DirectMapping | null} direct mapping if found
 */ function conditionalMapping(conditionalMapping_, conditionNames) {
    let perSet = _conditionalMappingCache.get(conditionalMapping_);
    if (perSet !== undefined) {
        const cached = perSet.get(conditionNames);
        if (cached !== undefined) {
            return cached === NULL_RESULT ? null : cached;
        }
    } else {
        perSet = new WeakMap();
        _conditionalMappingCache.set(conditionalMapping_, perSet);
    }
    const result = computeConditionalMapping(conditionalMapping_, conditionNames);
    perSet.set(conditionNames, result === null ? NULL_RESULT : result);
    return result;
}
/**
 * @param {string | undefined} remainingRequest remaining request when folder mapping, undefined for file mappings
 * @param {boolean} isPattern true, if mapping is a pattern (contains "*")
 * @param {boolean} isSubpathMapping true, for subpath mappings
 * @param {string} mappingTarget direct export
 * @param {(d: string, f: boolean) => void} assert asserting direct value
 * @returns {string} mapping result
 */ function targetMapping(remainingRequest, isPattern, isSubpathMapping, mappingTarget, assert) {
    if (remainingRequest === undefined) {
        assert(mappingTarget, false);
        return mappingTarget;
    }
    if (isSubpathMapping) {
        assert(mappingTarget, true);
        return mappingTarget + remainingRequest;
    }
    assert(mappingTarget, false);
    let result = mappingTarget;
    if (isPattern) {
        result = result.replace(patternRegEx, remainingRequest.replace(/\$/g, "$$"));
    }
    return result;
}
/**
 * @param {string | undefined} remainingRequest remaining request when folder mapping, undefined for file mappings
 * @param {boolean} isPattern true, if mapping is a pattern (contains "*")
 * @param {boolean} isSubpathMapping true, for subpath mappings
 * @param {DirectMapping | null} mappingTarget direct export
 * @param {Set<string>} conditionNames condition names
 * @param {(d: string, f: boolean) => void} assert asserting direct value
 * @returns {string[]} mapping result
 */ function directMapping(remainingRequest, isPattern, isSubpathMapping, mappingTarget, conditionNames, assert) {
    if (mappingTarget === null) return [];
    if (typeof mappingTarget === "string") {
        return [
            targetMapping(remainingRequest, isPattern, isSubpathMapping, mappingTarget, assert)
        ];
    }
    /** @type {string[]} */ const targets = [];
    for (const exp of mappingTarget){
        if (typeof exp === "string") {
            targets.push(targetMapping(remainingRequest, isPattern, isSubpathMapping, exp, assert));
            continue;
        }
        const mapping = conditionalMapping(exp, conditionNames);
        if (!mapping) continue;
        const innerExports = directMapping(remainingRequest, isPattern, isSubpathMapping, mapping, conditionNames, assert);
        for (const innerExport of innerExports){
            targets.push(innerExport);
        }
    }
    return targets;
}
/**
 * @param {ExportsField | ImportsField} field root
 * @param {(s: string) => string} normalizeRequest Normalize request, for `imports` field it adds `#`, for `exports` field it adds `.` or `./`
 * @param {(s: string) => string} assertRequest assertRequest
 * @param {(s: string, f: boolean) => void} assertTarget assertTarget
 * @returns {FieldProcessor} field processor
 */ function createFieldProcessor(field, normalizeRequest, assertRequest, assertTarget) {
    return function fieldProcessor(request, conditionNames) {
        request = assertRequest(request);
        const match = findMatch(normalizeRequest(request), field);
        if (match === null) return [
            [],
            null
        ];
        const [mapping, remainingRequest, isSubpathMapping, isPattern, usedField] = match;
        /** @type {DirectMapping | null} */ let direct = null;
        if (isConditionalMapping(mapping)) {
            direct = conditionalMapping(mapping, conditionNames);
            // matching not found
            if (direct === null) return [
                [],
                null
            ];
        } else {
            direct = mapping;
        }
        return [
            directMapping(remainingRequest, isPattern, isSubpathMapping, direct, conditionNames, assertTarget),
            usedField
        ];
    };
}
/**
 * @param {string} request request
 * @returns {string} updated request
 */ function assertExportsFieldRequest(request) {
    if (request.charCodeAt(0) !== dotCode) {
        throw new Error('Request should be relative path and start with "."');
    }
    if (request.length === 1) return "";
    if (request.charCodeAt(1) !== slashCode) {
        throw new Error('Request should be relative path and start with "./"');
    }
    if (request.charCodeAt(request.length - 1) === slashCode) {
        throw new Error("Only requesting file allowed");
    }
    return request.slice(2);
}
/**
 * @param {ExportsField} field exports field
 * @returns {ExportsField} normalized exports field
 */ function buildExportsField(field) {
    // handle syntax sugar, if exports field is direct mapping for "."
    if (typeof field === "string" || Array.isArray(field)) {
        return {
            ".": field
        };
    }
    const keys = Object.keys(field);
    for(let i = 0; i < keys.length; i++){
        const key = keys[i];
        if (key.charCodeAt(0) !== dotCode) {
            // handle syntax sugar, if exports field is conditional mapping for "."
            if (i === 0) {
                while(i < keys.length){
                    const charCode = keys[i].charCodeAt(0);
                    if (charCode === dotCode || charCode === slashCode) {
                        throw new Error(`Exports field key should be relative path and start with "." (key: ${JSON.stringify(key)})`);
                    }
                    i++;
                }
                return {
                    ".": field
                };
            }
            throw new Error(`Exports field key should be relative path and start with "." (key: ${JSON.stringify(key)})`);
        }
        if (key.length === 1) {
            continue;
        }
        if (key.charCodeAt(1) !== slashCode) {
            throw new Error(`Exports field key should be relative path and start with "./" (key: ${JSON.stringify(key)})`);
        }
    }
    return field;
}
/**
 * @param {string} exp export target
 * @param {boolean} expectFolder is folder expected
 */ function assertExportTarget(exp, expectFolder) {
    const parsedIdentifier = parseIdentifier(exp);
    if (!parsedIdentifier) {
        return;
    }
    const [relativePath] = parsedIdentifier;
    const isFolder = relativePath.charCodeAt(relativePath.length - 1) === slashCode;
    if (isFolder !== expectFolder) {
        throw new Error(expectFolder ? `Expecting folder to folder mapping. ${JSON.stringify(exp)} should end with "/"` : `Expecting file to file mapping. ${JSON.stringify(exp)} should not end with "/"`);
    }
}
/**
 * @param {ExportsField} exportsField the exports field
 * @returns {FieldProcessor} process callback
 */ module.exports.processExportsField = function processExportsField(exportsField) {
    return createFieldProcessor(buildExportsField(exportsField), (request)=>request.length === 0 ? "." : `./${request}`, assertExportsFieldRequest, assertExportTarget);
};
/**
 * @param {string} request request
 * @returns {string} updated request
 */ function assertImportsFieldRequest(request) {
    if (request.charCodeAt(0) !== hashCode) {
        throw new Error('Request should start with "#"');
    }
    if (request.length === 1) {
        throw new Error("Request should have at least 2 characters");
    }
    // Note: #/ patterns are now allowed per Node.js PR #60864
    // https://github.com/nodejs/node/pull/60864
    if (request.charCodeAt(request.length - 1) === slashCode) {
        throw new Error("Only requesting file allowed");
    }
    return request.slice(1);
}
/**
 * @param {string} imp import target
 * @param {boolean} expectFolder is folder expected
 */ function assertImportTarget(imp, expectFolder) {
    const parsedIdentifier = parseIdentifier(imp);
    if (!parsedIdentifier) {
        return;
    }
    const [relativePath] = parsedIdentifier;
    const isFolder = relativePath.charCodeAt(relativePath.length - 1) === slashCode;
    if (isFolder !== expectFolder) {
        throw new Error(expectFolder ? `Expecting folder to folder mapping. ${JSON.stringify(imp)} should end with "/"` : `Expecting file to file mapping. ${JSON.stringify(imp)} should not end with "/"`);
    }
}
/**
 * @param {ImportsField} importsField the exports field
 * @returns {FieldProcessor} process callback
 */ module.exports.processImportsField = function processImportsField(importsField) {
    return createFieldProcessor(importsField, (request)=>`#${request}`, assertImportsFieldRequest, assertImportTarget);
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ExportsFieldPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/ const DescriptionFileUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/DescriptionFileUtils.js [postcss] (ecmascript)");
const forEachBail = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/forEachBail.js [postcss] (ecmascript)");
const { processExportsField } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/entrypoints.js [postcss] (ecmascript)");
const { parseIdentifier } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/identifier.js [postcss] (ecmascript)");
const { deprecatedInvalidSegmentRegEx, invalidSegmentRegEx } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/path.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").JsonObject} JsonObject */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ /** @typedef {import("./util/entrypoints").ExportsField} ExportsField */ /** @typedef {import("./util/entrypoints").FieldProcessor} FieldProcessor */ module.exports = class ExportsFieldPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {Set<string>} conditionNames condition names
	 * @param {string | string[]} fieldNamePath name path
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, conditionNames, fieldNamePath, target){
        this.source = source;
        this.target = target;
        this.conditionNames = conditionNames;
        this.fieldName = fieldNamePath;
        // `null` is cached for description files that have no exports field,
        // so subsequent resolves against the same package.json skip the
        // `DescriptionFileUtils.getField` walk entirely.
        /** @type {WeakMap<JsonObject, FieldProcessor | null>} */ this._fieldProcessorCache = new WeakMap();
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("ExportsFieldPlugin", (request, resolveContext, callback)=>{
            // When there is no description file, abort
            if (!request.descriptionFileData) return callback();
            if (// When the description file is inherited from parent, abort
            // (There is no description file inside of this package)
            request.relativePath !== "." || request.request === undefined) {
                return callback();
            }
            const { descriptionFileData } = request;
            const remainingRequest = request.query || request.fragment ? (request.request === "." ? "./" : request.request) + request.query + request.fragment : request.request;
            /** @type {string[]} */ let paths;
            /** @type {string | null} */ let usedField;
            try {
                // Look up the cached processor first. On a cache hit we
                // avoid re-walking the description file for the exports
                // field — and `null` is cached for description files that
                // have no exports field at all, so those skip the read
                // entirely. `processExportsField` can throw on a malformed
                // `exports` map (e.g. a key without a leading `.`), so
                // building the processor must stay inside this try/catch.
                let fieldProcessor = this._fieldProcessorCache.get(descriptionFileData);
                if (fieldProcessor === undefined && !this._fieldProcessorCache.has(descriptionFileData)) {
                    const exportsField = DescriptionFileUtils.getField(descriptionFileData, this.fieldName);
                    fieldProcessor = exportsField ? processExportsField(exportsField) : null;
                    this._fieldProcessorCache.set(descriptionFileData, fieldProcessor);
                }
                if (!fieldProcessor) return callback();
                if (request.directory) {
                    return callback(new Error(`Resolving to directories is not possible with the exports field (request was ${remainingRequest}/)`));
                }
                [paths, usedField] = fieldProcessor(remainingRequest, this.conditionNames);
            } catch (/** @type {unknown} */ err) {
                if (resolveContext.log) {
                    resolveContext.log(`Exports field in ${request.descriptionFilePath} can't be processed: ${err}`);
                }
                return callback(err);
            }
            if (paths.length === 0) {
                const conditions = [
                    ...this.conditionNames
                ];
                const conditionsStr = conditions.length === 1 ? `the condition "${conditions[0]}"` : `the conditions ${JSON.stringify(conditions)}`;
                return callback(new Error(`"${remainingRequest}" is not exported under ${conditionsStr} from package ${request.descriptionFileRoot} (see exports field in ${request.descriptionFilePath})`));
            }
            forEachBail(paths, /**
					 * @param {string} path path
					 * @param {(err?: null | Error, result?: null | ResolveRequest) => void} callback callback
					 * @param {number} i index
					 * @returns {void}
					 */ (path, callback, i)=>{
                const parsedIdentifier = parseIdentifier(path);
                if (!parsedIdentifier) return callback();
                const [relativePath, query, fragment] = parsedIdentifier;
                if (relativePath.length === 0 || !relativePath.startsWith("./")) {
                    if (paths.length === i) {
                        return callback(new Error(`Invalid "exports" target "${path}" defined for "${usedField}" in the package config ${request.descriptionFilePath}, targets must start with "./"`));
                    }
                    return callback();
                }
                const withoutDotSlash = relativePath.slice(2);
                if (invalidSegmentRegEx.exec(withoutDotSlash) !== null && deprecatedInvalidSegmentRegEx.test(withoutDotSlash)) {
                    if (paths.length === i) {
                        return callback(new Error(`Invalid "exports" target "${path}" defined for "${usedField}" in the package config ${request.descriptionFilePath}, targets must start with "./"`));
                    }
                    return callback();
                }
                /** @type {ResolveRequest} */ const obj = {
                    ...request,
                    request: undefined,
                    path: resolver.join(request.descriptionFileRoot, relativePath),
                    relativePath,
                    query,
                    fragment
                };
                resolver.doResolve(target, obj, `using exports field: ${path}`, resolveContext, (err, result)=>{
                    if (err) return callback(err);
                    // Don't allow to continue - https://github.com/webpack/enhanced-resolve/issues/400
                    if (result === undefined) return callback(null, null);
                    callback(null, result);
                });
            }, /**
					 * @param {(null | Error)=} err error
					 * @param {(null | ResolveRequest)=} result result
					 * @returns {void}
					 */ (err, result)=>{
                if (err) return callback(err);
                // When an exports field match was found but the target file doesn't exist,
                // return an error to prevent fallback to parent node_modules directories.
                // Per the Node.js ESM spec, a matched exports entry that fails to resolve
                // is a hard error, not a signal to continue searching up the directory tree.
                // See: https://github.com/webpack/enhanced-resolve/issues/399
                if (!result) {
                    return callback(new Error(`Package path ${remainingRequest} is exported from package ${request.descriptionFileRoot}, but no valid target file was found (see exports field in ${request.descriptionFilePath})`));
                }
                callback(null, result);
            });
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ExtensionAliasPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/ const forEachBail = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/forEachBail.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ /** @typedef {{ alias: string | string[], extension: string }} ExtensionAliasOption */ module.exports = class ExtensionAliasPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {ExtensionAliasOption} options options
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, options, target){
        this.source = source;
        this.options = options;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        const { extension, alias } = this.options;
        resolver.getHook(this.source).tapAsync("ExtensionAliasPlugin", (request, resolveContext, callback)=>{
            // Two modes of operation:
            // - "request" mode: original request specifier still carries the
            //   extension (e.g. user wrote `./foo.js`). We swap the extension
            //   on `request.request` and re-resolve.
            // - "path" mode: the specifier has already been joined into an
            //   absolute `request.path` (e.g. produced by the imports field).
            //   We swap the extension on `request.path` and `request.relativePath`.
            const useRequest = request.request !== undefined;
            const source = useRequest ? request.request : request.path;
            if (!source || !source.endsWith(extension)) return callback();
            const isAliasString = typeof alias === "string";
            // Hoist the base (everything before the old extension) out of the
            // per-alias `resolve` callback. For an array `alias`, the callback
            // runs once per candidate extension; the base does not change
            // between iterations, so there's no reason to recompute it.
            const sourceBase = source.slice(0, -extension.length);
            const relativePathBase = !useRequest && request.relativePath && request.relativePath.endsWith(extension) ? request.relativePath.slice(0, -extension.length) : null;
            /**
				 * @param {string} alias extension alias
				 * @param {(err?: null | Error, result?: null | ResolveRequest) => void} callback callback
				 * @param {number=} index index
				 * @returns {void}
				 */ const resolve = (alias, callback, index)=>{
                const newValue = `${sourceBase}${alias}`;
                const nextRequest = useRequest ? {
                    ...request,
                    request: newValue,
                    fullySpecified: true
                } : {
                    ...request,
                    path: newValue,
                    relativePath: relativePathBase !== null ? `${relativePathBase}${alias}` : request.relativePath,
                    fullySpecified: true
                };
                return resolver.doResolve(target, nextRequest, `aliased from extension alias with mapping '${extension}' to '${alias}'`, resolveContext, (err, result)=>{
                    // Throw error if we are on the last alias (for multiple aliases) and it failed, always throw if we are not an array or we have only one alias
                    if (!isAliasString && index) {
                        if (index !== this.options.alias.length) {
                            if (resolveContext.log) {
                                resolveContext.log(`Failed to alias from extension alias with mapping '${extension}' to '${alias}' for '${newValue}': ${err}`);
                            }
                            return callback(null, result);
                        }
                        return callback(err, result);
                    }
                    callback(err, result);
                });
            };
            /**
				 * @param {(null | Error)=} err error
				 * @param {(null | ResolveRequest)=} result result
				 * @returns {void}
				 */ const stoppingCallback = (err, result)=>{
                if (err) return callback(err);
                if (result) return callback(null, result);
                // Don't allow other aliasing or raw request
                return callback(null, null);
            };
            if (isAliasString) {
                resolve(alias, stoppingCallback);
            } else if (alias.length > 1) {
                forEachBail(alias, resolve, stoppingCallback);
            } else {
                resolve(alias[0], stoppingCallback);
            }
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/FileExistsPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class FileExistsPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, target){
        this.source = source;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        const fs = resolver.fileSystem;
        resolver.getHook(this.source).tapAsync("FileExistsPlugin", (request, resolveContext, callback)=>{
            const file = request.path;
            if (!file) return callback();
            fs.stat(file, (err, stat)=>{
                if (err || !stat) {
                    if (resolveContext.missingDependencies) {
                        resolveContext.missingDependencies.add(file);
                    }
                    if (resolveContext.log) resolveContext.log(`${file} doesn't exist`);
                    return callback();
                }
                if (!stat.isFile()) {
                    if (resolveContext.missingDependencies) {
                        resolveContext.missingDependencies.add(file);
                    }
                    if (resolveContext.log) resolveContext.log(`${file} is not a file`);
                    return callback();
                }
                if (resolveContext.fileDependencies) {
                    resolveContext.fileDependencies.add(file);
                }
                resolver.doResolve(target, request, `existing file: ${file}`, resolveContext, callback);
            });
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ImportsFieldPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/ const DescriptionFileUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/DescriptionFileUtils.js [postcss] (ecmascript)");
const forEachBail = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/forEachBail.js [postcss] (ecmascript)");
const { processImportsField } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/entrypoints.js [postcss] (ecmascript)");
const { parseIdentifier } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/identifier.js [postcss] (ecmascript)");
const { deprecatedInvalidSegmentRegEx, invalidSegmentRegEx } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/path.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").JsonObject} JsonObject */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ /** @typedef {import("./util/entrypoints").FieldProcessor} FieldProcessor */ /** @typedef {import("./util/entrypoints").ImportsField} ImportsField */ const dotCode = ".".charCodeAt(0);
module.exports = class ImportsFieldPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {Set<string>} conditionNames condition names
	 * @param {string | string[]} fieldNamePath name path
	 * @param {string | ResolveStepHook} targetFile target file
	 * @param {string | ResolveStepHook} targetPackage target package
	 */ constructor(source, conditionNames, fieldNamePath, targetFile, targetPackage){
        this.source = source;
        this.targetFile = targetFile;
        this.targetPackage = targetPackage;
        this.conditionNames = conditionNames;
        this.fieldName = fieldNamePath;
        // `null` is cached for description files that have no imports field,
        // so subsequent resolves against the same package.json skip the
        // `DescriptionFileUtils.getField` walk entirely.
        /** @type {WeakMap<JsonObject, FieldProcessor | null>} */ this._fieldProcessorCache = new WeakMap();
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const targetFile = resolver.ensureHook(this.targetFile);
        const targetPackage = resolver.ensureHook(this.targetPackage);
        resolver.getHook(this.source).tapAsync("ImportsFieldPlugin", (request, resolveContext, callback)=>{
            // When there is no description file, abort
            if (!request.descriptionFileData || request.request === undefined) {
                return callback();
            }
            const { descriptionFileData } = request;
            const remainingRequest = request.request + request.query + request.fragment;
            /** @type {string[]} */ let paths;
            /** @type {string | null} */ let usedField;
            try {
                // Look up the cached processor first. On a cache hit we
                // avoid re-walking the description file for the imports
                // field — and `null` is cached for description files that
                // have no imports field at all, so those skip the read
                // entirely. `processImportsField` can throw on a
                // malformed `imports` map, so building the processor must
                // stay inside this try/catch.
                let fieldProcessor = this._fieldProcessorCache.get(descriptionFileData);
                if (fieldProcessor === undefined && !this._fieldProcessorCache.has(descriptionFileData)) {
                    const importsField = DescriptionFileUtils.getField(descriptionFileData, this.fieldName);
                    fieldProcessor = importsField ? processImportsField(importsField) : null;
                    this._fieldProcessorCache.set(descriptionFileData, fieldProcessor);
                }
                if (!fieldProcessor) return callback();
                if (request.directory) {
                    return callback(new Error(`Resolving to directories is not possible with the imports field (request was ${remainingRequest}/)`));
                }
                [paths, usedField] = fieldProcessor(remainingRequest, this.conditionNames);
            } catch (/** @type {unknown} */ err) {
                if (resolveContext.log) {
                    resolveContext.log(`Imports field in ${request.descriptionFilePath} can't be processed: ${err}`);
                }
                return callback(err);
            }
            if (paths.length === 0) {
                return callback(new Error(`Package import ${remainingRequest} is not imported from package ${request.descriptionFileRoot} (see imports field in ${request.descriptionFilePath})`));
            }
            forEachBail(paths, /**
					 * @param {string} path path
					 * @param {(err?: null | Error, result?: null | ResolveRequest) => void} callback callback
					 * @param {number} i index
					 * @returns {void}
					 */ (path, callback, i)=>{
                const parsedIdentifier = parseIdentifier(path);
                if (!parsedIdentifier) return callback();
                const [path_, query, fragment] = parsedIdentifier;
                switch(path_.charCodeAt(0)){
                    // should be relative
                    case dotCode:
                        {
                            const withoutDotSlash = path_.slice(2);
                            if (invalidSegmentRegEx.exec(withoutDotSlash) !== null && deprecatedInvalidSegmentRegEx.test(withoutDotSlash) !== null) {
                                if (paths.length === i) {
                                    return callback(new Error(`Invalid "imports" target "${path}" defined for "${usedField}" in the package config ${request.descriptionFilePath}, targets must start with "./"`));
                                }
                                return callback();
                            }
                            /** @type {ResolveRequest} */ const obj = {
                                ...request,
                                request: undefined,
                                path: resolver.join(request.descriptionFileRoot, path_),
                                relativePath: path_,
                                query,
                                fragment
                            };
                            resolver.doResolve(targetFile, obj, `using imports field: ${path}`, resolveContext, (err, result)=>{
                                if (err) return callback(err);
                                // Don't allow to continue - https://github.com/webpack/enhanced-resolve/issues/400
                                if (result === undefined) return callback(null, null);
                                callback(null, result);
                            });
                            break;
                        }
                    // package resolving
                    default:
                        {
                            /** @type {ResolveRequest} */ const obj = {
                                ...request,
                                request: path_,
                                relativePath: path_,
                                fullySpecified: true,
                                query,
                                fragment
                            };
                            resolver.doResolve(targetPackage, obj, `using imports field: ${path}`, resolveContext, (err, result)=>{
                                if (err) return callback(err);
                                // Don't allow to continue - https://github.com/webpack/enhanced-resolve/issues/400
                                if (result === undefined) return callback(null, null);
                                callback(null, result);
                            });
                        }
                }
            }, /**
					 * @param {null | Error=} err error
					 * @param {null | ResolveRequest=} result result
					 * @returns {void}
					 */ (err, result)=>callback(err, result || null));
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/JoinRequestPartPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ const namespaceStartCharCode = "@".charCodeAt(0);
module.exports = class JoinRequestPartPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, target){
        this.source = source;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("JoinRequestPartPlugin", (request, resolveContext, callback)=>{
            const req = request.request || "";
            let i = req.indexOf("/", 3);
            if (i >= 0 && req.charCodeAt(2) === namespaceStartCharCode) {
                i = req.indexOf("/", i + 1);
            }
            /** @type {string} */ let moduleName;
            /** @type {string} */ let remainingRequest;
            /** @type {boolean} */ let fullySpecified;
            if (i < 0) {
                moduleName = req;
                remainingRequest = ".";
                fullySpecified = false;
            } else {
                moduleName = req.slice(0, i);
                remainingRequest = `.${req.slice(i)}`;
                fullySpecified = request.fullySpecified;
            }
            /** @type {ResolveRequest} */ const obj = {
                ...request,
                path: resolver.join(request.path, moduleName),
                relativePath: request.relativePath && resolver.join(request.relativePath, moduleName),
                request: remainingRequest,
                fullySpecified
            };
            resolver.doResolve(target, obj, null, resolveContext, callback);
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/JoinRequestPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class JoinRequestPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, target){
        this.source = source;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("JoinRequestPlugin", (request, resolveContext, callback)=>{
            const requestPath = request.path;
            const requestRequest = request.request;
            /** @type {ResolveRequest} */ const obj = {
                ...request,
                path: resolver.join(requestPath, requestRequest),
                relativePath: request.relativePath && resolver.join(request.relativePath, requestRequest),
                request: undefined
            };
            resolver.doResolve(target, obj, null, resolveContext, callback);
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/MainFieldPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ const DescriptionFileUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/DescriptionFileUtils.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").JsonObject} JsonObject */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ /** @typedef {{ name: string | string[], forceRelative: boolean }} MainFieldOptions */ const alreadyTriedMainField = Symbol("alreadyTriedMainField");
// Sentinel cached for description files where the main field resolves to a
// value we cannot use (missing, non-string, ".", "./"). Cheaper to store and
// check than to re-walk the description file on every resolve.
const NO_MAIN = Symbol("NoMain");
module.exports = class MainFieldPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {MainFieldOptions} options options
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, options, target){
        this.source = source;
        this.options = options;
        this.target = target;
        // Cache the resolved `mainModule` per description-file content. The
        // options (`name`, `forceRelative`) are fixed for this plugin
        // instance, so caching against content alone is safe. Stores either
        // the ready-to-use request string or the `NO_MAIN` sentinel.
        /** @type {WeakMap<JsonObject, string | typeof NO_MAIN>} */ this._mainModuleCache = new WeakMap();
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("MainFieldPlugin", (request, resolveContext, callback)=>{
            if (request.path !== request.descriptionFileRoot || /** @type {ResolveRequest & { [alreadyTriedMainField]?: string }} */ request[alreadyTriedMainField] === request.descriptionFilePath || !request.descriptionFilePath) {
                return callback();
            }
            const descFileData = request.descriptionFileData;
            let mainModule = this._mainModuleCache.get(descFileData);
            if (mainModule === undefined) {
                let raw = DescriptionFileUtils.getField(descFileData, this.options.name);
                if (!raw || typeof raw !== "string" || raw === "." || raw === "./") {
                    this._mainModuleCache.set(descFileData, NO_MAIN);
                    return callback();
                }
                if (this.options.forceRelative && !/^\.\.?\//.test(raw)) {
                    raw = `./${raw}`;
                }
                mainModule = raw;
                this._mainModuleCache.set(descFileData, mainModule);
            } else if (mainModule === NO_MAIN) {
                return callback();
            }
            const filename = resolver.basename(request.descriptionFilePath);
            /** @type {ResolveRequest & { [alreadyTriedMainField]?: string }} */ const obj = {
                ...request,
                request: mainModule,
                module: false,
                directory: mainModule.endsWith("/"),
                [alreadyTriedMainField]: request.descriptionFilePath
            };
            return resolver.doResolve(target, obj, `use ${mainModule} from ${this.options.name} in ${filename}`, resolveContext, callback);
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ModulesInHierarchicalDirectoriesPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ const { modulesResolveHandler } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ModulesUtils.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class ModulesInHierarchicalDirectoriesPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | string[]} directories directories
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, directories, target){
        this.source = source;
        this.directories = /** @type {string[]} */ [
            ...directories
        ];
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("ModulesInHierarchicalDirectoriesPlugin", (request, resolveContext, callback)=>{
            modulesResolveHandler(resolver, this.directories, target, request, resolveContext, callback);
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ModulesInRootPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class ModulesInRootPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string} path path
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, path, target){
        this.source = source;
        this.path = path;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("ModulesInRootPlugin", (request, resolveContext, callback)=>{
            /** @type {ResolveRequest} */ const obj = {
                ...request,
                path: this.path,
                request: `./${request.request}`,
                module: false
            };
            resolver.doResolve(target, obj, `looking for modules in ${this.path}`, resolveContext, callback);
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/NextPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class NextPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, target){
        this.source = source;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("NextPlugin", (request, resolveContext, callback)=>{
            resolver.doResolve(target, request, null, resolveContext, callback);
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ParsePlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class ParsePlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {Partial<ResolveRequest>} requestOptions request options
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, requestOptions, target){
        this.source = source;
        this.requestOptions = requestOptions;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("ParsePlugin", (request, resolveContext, callback)=>{
            const parsed = resolver.parse(request.request);
            /** @type {ResolveRequest} */ const obj = {
                ...request,
                ...parsed,
                ...this.requestOptions
            };
            if (request.query && !parsed.query) {
                obj.query = request.query;
            }
            if (request.fragment && !parsed.fragment) {
                obj.fragment = request.fragment;
            }
            if (parsed && resolveContext.log) {
                if (parsed.module) resolveContext.log("Parsed request is a module");
                if (parsed.directory) {
                    resolveContext.log("Parsed request is a directory");
                }
            }
            // There is an edge-case where a request with # can be a path or a fragment -> try both
            if (obj.request && !obj.query && obj.fragment) {
                const directory = obj.fragment.endsWith("/");
                /** @type {ResolveRequest} */ const alternative = {
                    ...obj,
                    directory,
                    request: obj.request + (obj.directory ? "/" : "") + (directory ? obj.fragment.slice(0, -1) : obj.fragment),
                    fragment: ""
                };
                resolver.doResolve(target, alternative, null, resolveContext, (err, result)=>{
                    if (err) return callback(err);
                    if (result) return callback(null, result);
                    resolver.doResolve(target, obj, null, resolveContext, callback);
                });
                return;
            }
            resolver.doResolve(target, obj, null, resolveContext, callback);
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/PnpPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Maël Nison @arcanis
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /**
 * @typedef {object} PnpApiImpl
 * @property {(packageName: string, issuer: string, options: { considerBuiltins: boolean }) => string | null} resolveToUnqualified resolve to unqualified
 */ module.exports = class PnpPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {PnpApiImpl} pnpApi pnpApi
	 * @param {string | ResolveStepHook} target target
	 * @param {string | ResolveStepHook} alternateTarget alternateTarget
	 */ constructor(source, pnpApi, target, alternateTarget){
        this.source = source;
        this.pnpApi = pnpApi;
        this.target = target;
        this.alternateTarget = alternateTarget;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        /** @type {ResolveStepHook} */ const target = resolver.ensureHook(this.target);
        const alternateTarget = resolver.ensureHook(this.alternateTarget);
        resolver.getHook(this.source).tapAsync("PnpPlugin", (request, resolveContext, callback)=>{
            const req = request.request;
            if (!req) return callback();
            // The trailing slash indicates to PnP that this value is a folder rather than a file
            const issuer = `${request.path}/`;
            const packageMatch = /^(@[^/]+\/)?[^/]+/.exec(req);
            if (!packageMatch) return callback();
            const [packageName] = packageMatch;
            const innerRequest = `.${req.slice(packageName.length)}`;
            /** @type {string | undefined | null} */ let resolution;
            /** @type {string | undefined | null} */ let apiResolution;
            try {
                resolution = this.pnpApi.resolveToUnqualified(packageName, issuer, {
                    considerBuiltins: false
                });
                if (resolution === null) {
                    // This is either not a PnP managed issuer or it's a Node builtin
                    // Try to continue resolving with our alternatives
                    resolver.doResolve(alternateTarget, request, "issuer is not managed by a pnpapi", resolveContext, (err, result)=>{
                        if (err) return callback(err);
                        if (result) return callback(null, result);
                        // Skip alternatives
                        return callback(null, null);
                    });
                    return;
                }
                if (resolveContext.fileDependencies) {
                    apiResolution = this.pnpApi.resolveToUnqualified("pnpapi", issuer, {
                        considerBuiltins: false
                    });
                }
            } catch (/** @type {unknown} */ error) {
                if (/** @type {Error & { code: string }} */ error.code === "MODULE_NOT_FOUND" && /** @type {Error & { pnpCode: string }} */ error.pnpCode === "UNDECLARED_DEPENDENCY") {
                    // This is not a PnP managed dependency.
                    // Try to continue resolving with our alternatives
                    if (resolveContext.log) {
                        resolveContext.log("request is not managed by the pnpapi");
                        for (const line of error.message.split("\n").filter(Boolean)){
                            resolveContext.log(`  ${line}`);
                        }
                    }
                    return callback();
                }
                return callback(error);
            }
            if (resolution === packageName) return callback();
            if (apiResolution && resolveContext.fileDependencies) {
                resolveContext.fileDependencies.add(apiResolution);
            }
            /** @type {ResolveRequest} */ const obj = {
                ...request,
                path: resolution,
                request: innerRequest,
                ignoreSymlinks: true,
                fullySpecified: request.fullySpecified && innerRequest !== "."
            };
            resolver.doResolve(target, obj, `resolved by pnp to ${resolution}`, resolveContext, (err, result)=>{
                if (err) return callback(err);
                if (result) return callback(null, result);
                // Skip alternatives
                return callback(null, null);
            });
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/createInnerContext.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver").ResolveContext} ResolveContext */ /**
 * Build the `ResolveContext` passed into the next hook in the chain.
 *
 * The caller — `Resolver.doResolve` — runs on every resolve step, so we
 * want to allocate as little as possible here. Previously the caller
 * constructed a temporary `{ log, yield, fileDependencies, ... }` literal
 * and handed it to this helper, which then copied those same fields into
 * a second fresh object. That's two allocations per step for what is
 * effectively a struct copy with one mutated field (`stack`) and one
 * optionally-wrapped field (`log`). Taking the parent context and the
 * two things we actually want to change (stack, message) as separate
 * arguments lets us allocate exactly one inner context.
 * @param {ResolveContext} parent parent resolve context to inherit dependency sets / yield from
 * @param {ResolveContext["stack"]} stack new stack tip for the nested call
 * @param {null | string} message log message prefix for this step
 * @returns {ResolveContext} inner context
 */ module.exports = function createInnerContext(parent, stack, message) {
    const parentLog = parent.log;
    let innerLog;
    if (parentLog) {
        if (message) {
            let messageReported = false;
            /**
			 * @param {string} msg message
			 */ innerLog = (msg)=>{
                if (!messageReported) {
                    parentLog(message);
                    messageReported = true;
                }
                parentLog(`  ${msg}`);
            };
        } else {
            innerLog = parentLog;
        }
    }
    return {
        log: innerLog,
        yield: parent.yield,
        fileDependencies: parent.fileDependencies,
        contextDependencies: parent.contextDependencies,
        missingDependencies: parent.missingDependencies,
        stack
    };
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/Resolver.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ const { AsyncSeriesBailHook, AsyncSeriesHook, SyncHook } = __turbopack_context__.r("[project]/node_modules/.pnpm/tapable@2.3.3/node_modules/tapable/lib/index.js [postcss] (ecmascript)");
const createInnerContext = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/createInnerContext.js [postcss] (ecmascript)");
const { parseIdentifier } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/identifier.js [postcss] (ecmascript)");
const { PathType, createCachedBasename, createCachedDirname, createCachedJoin, getType, normalize } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/path.js [postcss] (ecmascript)");
/* eslint-disable jsdoc/check-alignment */ // TODO in the next major release use only `Promise.withResolvers()`
const _withResolvers = // eslint-disable-next-line n/no-unsupported-features/es-syntax
Promise.withResolvers ? /**
			 * @param {Resolver} self resolver
			 * @param {Context} context context information object
			 * @param {string} path context path
			 * @param {string} request request string
			 * @param {ResolveContext} resolveContext resolve context
			 * @returns {Promise<string | false>} result
			 */ (self, context, path, request, resolveContext)=>{
    // eslint-disable-next-line n/no-unsupported-features/es-syntax
    const { promise, resolve, reject } = Promise.withResolvers();
    self.resolve(context, path, request, resolveContext, (err, res)=>{
        if (err) reject(err);
        else resolve(res);
    });
    return promise;
} : /**
			 * @param {Resolver} self resolver
			 * @param {Context} context context information object
			 * @param {string} path context path
			 * @param {string} request request string
			 * @param {ResolveContext} resolveContext resolve context
			 * @returns {Promise<string | false>} result
			 */ (self, context, path, request, resolveContext)=>new Promise((resolve, reject)=>{
        self.resolve(context, path, request, resolveContext, (err, res)=>{
            if (err) reject(err);
            else resolve(res);
        });
    });
/* eslint-enable jsdoc/check-alignment */ /** @typedef {import("./AliasUtils").AliasOption} AliasOption */ /** @typedef {import("./util/path").CachedJoin} CachedJoin */ /** @typedef {import("./util/path").CachedDirname} CachedDirname */ /** @typedef {import("./util/path").CachedBasename} CachedBasename */ /**
 * @typedef {object} JoinCacheEntry
 * @property {CachedJoin["fn"]} fn cached join function
 * @property {CachedJoin["cache"]} cache the underlying cache map
 */ /**
 * @typedef {object} DirnameCacheEntry
 * @property {CachedDirname["fn"]} fn cached dirname function
 * @property {CachedDirname["cache"]} cache the underlying cache map
 */ /**
 * @typedef {object} BasenameCacheEntry
 * @property {CachedBasename["fn"]} fn cached dirname function
 * @property {CachedBasename["cache"]} cache the underlying cache map
 */ /**
 * @typedef {object} PathCacheFunctions
 * @property {JoinCacheEntry} join cached join
 * @property {DirnameCacheEntry} dirname cached dirname
 * @property {BasenameCacheEntry} basename cached basename
 */ /** @type {WeakMap<FileSystem, PathCacheFunctions>} */ const _pathCacheByFs = new WeakMap();
/** @typedef {import("./ResolverFactory").ResolveOptions} ResolveOptions */ /**
 * @typedef {object} KnownContext
 * @property {string[]=} environments environments
 */ // eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {KnownContext & Record<any, any>} Context */ /** @typedef {Error & { details?: string }} ErrorWithDetail */ /** @typedef {(err: ErrorWithDetail | null, res?: string | false, req?: ResolveRequest) => void} ResolveCallback */ /**
 * @typedef {object} PossibleFileSystemError
 * @property {string=} code code
 * @property {number=} errno number
 * @property {string=} path path
 * @property {string=} syscall syscall
 */ /**
 * @template T
 * @callback FileSystemCallback
 * @param {PossibleFileSystemError & Error | null} err
 * @param {T=} result
 */ /**
 * @typedef {string | Buffer | URL} PathLike
 */ /**
 * @typedef {PathLike | number} PathOrFileDescriptor
 */ /**
 * @typedef {object} ObjectEncodingOptions
 * @property {BufferEncoding | null | undefined=} encoding encoding
 */ /**
 * @typedef {ObjectEncodingOptions | BufferEncoding | undefined | null} EncodingOption
 */ /** @typedef {(err: NodeJS.ErrnoException | null, result?: string) => void} StringCallback */ /** @typedef {(err: NodeJS.ErrnoException | null, result?: Buffer) => void} BufferCallback */ /** @typedef {(err: NodeJS.ErrnoException | null, result?: (string | Buffer)) => void} StringOrBufferCallback */ /** @typedef {(err: NodeJS.ErrnoException | null, result?: IStats) => void} StatsCallback */ /** @typedef {(err: NodeJS.ErrnoException | null, result?: IBigIntStats) => void} BigIntStatsCallback */ /** @typedef {(err: NodeJS.ErrnoException | null, result?: (IStats | IBigIntStats)) => void} StatsOrBigIntStatsCallback */ /** @typedef {(err: NodeJS.ErrnoException | Error | null, result?: JsonObject) => void} ReadJsonCallback */ /**
 * @template T
 * @typedef {object} IStatsBase
 * @property {() => boolean} isFile is file
 * @property {() => boolean} isDirectory is directory
 * @property {() => boolean} isBlockDevice is block device
 * @property {() => boolean} isCharacterDevice is character device
 * @property {() => boolean} isSymbolicLink is symbolic link
 * @property {() => boolean} isFIFO is FIFO
 * @property {() => boolean} isSocket is socket
 * @property {T} dev dev
 * @property {T} ino ino
 * @property {T} mode mode
 * @property {T} nlink nlink
 * @property {T} uid uid
 * @property {T} gid gid
 * @property {T} rdev rdev
 * @property {T} size size
 * @property {T} blksize blksize
 * @property {T} blocks blocks
 * @property {T} atimeMs atime ms
 * @property {T} mtimeMs mtime ms
 * @property {T} ctimeMs ctime ms
 * @property {T} birthtimeMs birthtime ms
 * @property {Date} atime atime
 * @property {Date} mtime mtime
 * @property {Date} ctime ctime
 * @property {Date} birthtime birthtime
 */ /**
 * @typedef {IStatsBase<number>} IStats
 */ /**
 * @typedef {IStatsBase<bigint> & { atimeNs: bigint, mtimeNs: bigint, ctimeNs: bigint, birthtimeNs: bigint }} IBigIntStats
 */ /**
 * @template {string | Buffer} [T=string]
 * @typedef {object} Dirent
 * @property {() => boolean} isFile true when is file, otherwise false
 * @property {() => boolean} isDirectory true when is directory, otherwise false
 * @property {() => boolean} isBlockDevice true when is block device, otherwise false
 * @property {() => boolean} isCharacterDevice true when is character device, otherwise false
 * @property {() => boolean} isSymbolicLink true when is symbolic link, otherwise false
 * @property {() => boolean} isFIFO true when is FIFO, otherwise false
 * @property {() => boolean} isSocket true when is socket, otherwise false
 * @property {T} name name
 * @property {string} parentPath path
 * @property {string=} path path
 */ /**
 * @typedef {object} StatOptions
 * @property {(boolean | undefined)=} bigint need bigint values
 */ /**
 * @typedef {object} StatSyncOptions
 * @property {(boolean | undefined)=} bigint need bigint values
 * @property {(boolean | undefined)=} throwIfNoEntry throw if no entry
 */ /**
 * @typedef {{
 * (path: PathOrFileDescriptor, options: ({ encoding?: null | undefined, flag?: string | undefined } & import("events").Abortable) | undefined | null, callback: BufferCallback): void,
 * (path: PathOrFileDescriptor, options: ({ encoding: BufferEncoding, flag?: string | undefined } & import("events").Abortable) | BufferEncoding, callback: StringCallback): void,
 * (path: PathOrFileDescriptor, options: (ObjectEncodingOptions & { flag?: string | undefined } & import("events").Abortable) | BufferEncoding | undefined | null, callback: StringOrBufferCallback): void,
 * (path: PathOrFileDescriptor, callback: BufferCallback): void,
 * }} ReadFile
 */ /**
 * @typedef {"buffer" | { encoding: "buffer" }} BufferEncodingOption
 */ /**
 * @typedef {{
 * (path: PathOrFileDescriptor, options?: { encoding?: null | undefined, flag?: string | undefined } | null): Buffer,
 * (path: PathOrFileDescriptor, options: { encoding: BufferEncoding, flag?: string | undefined } | BufferEncoding): string,
 * (path: PathOrFileDescriptor, options?: (ObjectEncodingOptions & { flag?: string | undefined }) | BufferEncoding | null): string | Buffer,
 * }} ReadFileSync
 */ /**
 * @typedef {{
 * (path: PathLike, options: { encoding: BufferEncoding | null, withFileTypes?: false | undefined, recursive?: boolean | undefined } | BufferEncoding | undefined | null, callback: (err: NodeJS.ErrnoException | null, files?: string[]) => void): void,
 * (path: PathLike, options: { encoding: "buffer", withFileTypes?: false | undefined, recursive?: boolean | undefined } | "buffer", callback: (err: NodeJS.ErrnoException | null, files?: Buffer[]) => void): void,
 * (path: PathLike, options: (ObjectEncodingOptions & { withFileTypes?: false | undefined, recursive?: boolean | undefined }) | BufferEncoding | undefined | null, callback: (err: NodeJS.ErrnoException | null, files?: string[] | Buffer[]) => void): void,
 * (path: PathLike, callback: (err: NodeJS.ErrnoException | null, files?: string[]) => void): void,
 * (path: PathLike, options: ObjectEncodingOptions & { withFileTypes: true, recursive?: boolean | undefined }, callback: (err: NodeJS.ErrnoException | null, files?: Dirent<string>[]) => void): void,
 * (path: PathLike, options: { encoding: "buffer", withFileTypes: true, recursive?: boolean | undefined }, callback: (err: NodeJS.ErrnoException | null, files: Dirent<Buffer>[]) => void): void,
 * }} Readdir
 */ /**
 * @typedef {{
 * (path: PathLike, options?: { encoding: BufferEncoding | null, withFileTypes?: false | undefined, recursive?: boolean | undefined } | BufferEncoding | null): string[],
 * (path: PathLike, options: { encoding: "buffer", withFileTypes?: false | undefined, recursive?: boolean | undefined } | "buffer"): Buffer[],
 * (path: PathLike, options?: (ObjectEncodingOptions & { withFileTypes?: false | undefined, recursive?: boolean | undefined }) | BufferEncoding | null): string[] | Buffer[],
 * (path: PathLike, options: ObjectEncodingOptions & { withFileTypes: true, recursive?: boolean | undefined }): Dirent[],
 * (path: PathLike, options: { encoding: "buffer", withFileTypes: true, recursive?: boolean | undefined }): Dirent<Buffer>[],
 * }} ReaddirSync
 */ /**
 * @typedef {(pathOrFileDescription: PathOrFileDescriptor, callback: ReadJsonCallback) => void} ReadJson
 */ /**
 * @typedef {(pathOrFileDescription: PathOrFileDescriptor) => JsonObject} ReadJsonSync
 */ /**
 * @typedef {{
 * (path: PathLike, options: EncodingOption, callback: StringCallback): void,
 * (path: PathLike, options: BufferEncodingOption, callback: BufferCallback): void,
 * (path: PathLike, options: EncodingOption, callback: StringOrBufferCallback): void,
 * (path: PathLike, callback: StringCallback): void,
 * }} Readlink
 */ /**
 * @typedef {{
 * (path: PathLike, options?: EncodingOption): string,
 * (path: PathLike, options: BufferEncodingOption): Buffer,
 * (path: PathLike, options?: EncodingOption): string | Buffer,
 * }} ReadlinkSync
 */ /**
 * @typedef {{
 * (path: PathLike, callback: StatsCallback): void,
 * (path: PathLike, options: (StatOptions & { bigint?: false | undefined }) | undefined, callback: StatsCallback): void,
 * (path: PathLike, options: StatOptions & { bigint: true }, callback: BigIntStatsCallback): void,
 * (path: PathLike, options: StatOptions | undefined, callback: StatsOrBigIntStatsCallback): void,
 * }} LStat
 */ /**
 * @typedef {{
 * (path: PathLike, options?: undefined): IStats,
 * (path: PathLike, options?: StatSyncOptions & { bigint?: false | undefined, throwIfNoEntry: false }): IStats | undefined,
 * (path: PathLike, options: StatSyncOptions & { bigint: true, throwIfNoEntry: false }): IBigIntStats | undefined,
 * (path: PathLike, options?: StatSyncOptions & { bigint?: false | undefined }): IStats,
 * (path: PathLike, options: StatSyncOptions & { bigint: true }): IBigIntStats,
 * (path: PathLike, options: StatSyncOptions & { bigint: boolean, throwIfNoEntry?: false | undefined }): IStats | IBigIntStats,
 * (path: PathLike, options?: StatSyncOptions): IStats | IBigIntStats | undefined,
 * }} LStatSync
 */ /**
 * @typedef {{
 * (path: PathLike, callback: StatsCallback): void,
 * (path: PathLike, options: (StatOptions & { bigint?: false | undefined }) | undefined, callback: StatsCallback): void,
 * (path: PathLike, options: StatOptions & { bigint: true }, callback: BigIntStatsCallback): void,
 * (path: PathLike, options: StatOptions | undefined, callback: StatsOrBigIntStatsCallback): void,
 * }} Stat
 */ /**
 * @typedef {{
 * (path: PathLike, options?: undefined): IStats,
 * (path: PathLike, options?: StatSyncOptions & { bigint?: false | undefined, throwIfNoEntry: false }): IStats | undefined,
 * (path: PathLike, options: StatSyncOptions & { bigint: true, throwIfNoEntry: false }): IBigIntStats | undefined,
 * (path: PathLike, options?: StatSyncOptions & { bigint?: false | undefined }): IStats,
 * (path: PathLike, options: StatSyncOptions & { bigint: true }): IBigIntStats,
 * (path: PathLike, options: StatSyncOptions & { bigint: boolean, throwIfNoEntry?: false | undefined }): IStats | IBigIntStats,
 * (path: PathLike, options?: StatSyncOptions): IStats | IBigIntStats | undefined,
 * }} StatSync
 */ /**
 * @typedef {{
 * (path: PathLike, options: EncodingOption, callback: StringCallback): void,
 * (path: PathLike, options: BufferEncodingOption, callback: BufferCallback): void,
 * (path: PathLike, options: EncodingOption, callback: StringOrBufferCallback): void,
 * (path: PathLike, callback: StringCallback): void,
 * }} RealPath
 */ /**
 * @typedef {{
 * (path: PathLike, options?: EncodingOption): string,
 * (path: PathLike, options: BufferEncodingOption): Buffer,
 * (path: PathLike, options?: EncodingOption): string | Buffer,
 * }} RealPathSync
 */ /**
 * @typedef {object} FileSystem
 * @property {ReadFile} readFile read file method
 * @property {Readdir} readdir readdir method
 * @property {ReadJson=} readJson read json method
 * @property {Readlink} readlink read link method
 * @property {LStat=} lstat lstat method
 * @property {Stat} stat stat method
 * @property {RealPath=} realpath realpath method
 */ /**
 * @typedef {object} SyncFileSystem
 * @property {ReadFileSync} readFileSync read file sync method
 * @property {ReaddirSync} readdirSync read dir sync method
 * @property {ReadJsonSync=} readJsonSync read json sync method
 * @property {ReadlinkSync} readlinkSync read link sync method
 * @property {LStatSync=} lstatSync lstat sync method
 * @property {StatSync} statSync stat sync method
 * @property {RealPathSync=} realpathSync real path sync method
 */ /**
 * @typedef {object} ParsedIdentifier
 * @property {string} request request
 * @property {string} query query
 * @property {string} fragment fragment
 * @property {boolean} directory is directory
 * @property {boolean} module is module
 * @property {boolean} file is file
 * @property {boolean} internal is internal
 */ /** @typedef {string | number | boolean | null} JsonPrimitive */ /** @typedef {JsonValue[]} JsonArray */ /** @typedef {JsonPrimitive | JsonObject | JsonArray} JsonValue */ /** @typedef {{ [Key in string]?: JsonValue | undefined }} JsonObject */ /**
 * @typedef {object} TsconfigPathsMap
 * @property {TsconfigPathsData} main main tsconfig paths data
 * @property {string} mainContext main tsconfig base URL (absolute path)
 * @property {{ [baseUrl: string]: TsconfigPathsData }} refs referenced tsconfig paths data mapped by baseUrl
 * @property {{ [context: string]: TsconfigPathsData }} allContexts all contexts (main + refs) for quick lookup
 * @property {string[]} contextList precomputed `Object.keys(allContexts)` — read-only; used on the `_selectPathsDataForContext` hot path
 * @property {Set<string>} fileDependencies file dependencies
 */ /**
 * @typedef {object} TsconfigPathsData
 * @property {import("./AliasUtils").CompiledAliasOption[]} alias tsconfig file data
 * @property {string[]} modules tsconfig file data
 */ /**
 * @typedef {object} BaseResolveRequest
 * @property {string | false} path path
 * @property {Context=} context content
 * @property {string=} descriptionFilePath description file path
 * @property {string=} descriptionFileRoot description file root
 * @property {JsonObject=} descriptionFileData description file data
 * @property {TsconfigPathsMap | null | undefined=} tsconfigPathsMap tsconfig paths map
 * @property {string=} relativePath relative path
 * @property {boolean=} ignoreSymlinks true when need to ignore symlinks, otherwise false
 * @property {boolean=} fullySpecified true when full specified, otherwise false
 * @property {string=} __innerRequest inner request for internal usage
 * @property {string=} __innerRequest_request inner request for internal usage
 * @property {string=} __innerRequest_relativePath inner relative path for internal usage
 */ /** @typedef {BaseResolveRequest & Partial<ParsedIdentifier>} ResolveRequest */ /**
 * @template T
 * @typedef {{ add: (item: T) => void }} WriteOnlySet
 */ /** @typedef {(request: ResolveRequest) => void} ResolveContextYield */ /**
 * Singly-linked stack entry that also exposes a Set-like API
 * (`has`, `size`, iteration). Each `doResolve` call prepends a new
 * `StackEntry` that points at the previous tip via `.parent`, so pushing
 * is O(1) in time and memory. Recursion detection walks the linked list
 * (O(n)) but the stack is typically shallow, so this is cheaper overall
 * than cloning a `Set` per call.
 */ class StackEntry {
    /**
	 * @param {ResolveStepHook} hook hook
	 * @param {ResolveRequest} request request
	 * @param {StackEntry=} parent previous tip
	 * @param {Set<string>=} preSeeded entries pre-seeded via the legacy `Set<string>` API
	 */ constructor(hook, request, parent, preSeeded){
        this.name = hook.name;
        this.path = request.path;
        this.request = request.request || "";
        this.query = request.query || "";
        this.fragment = request.fragment || "";
        this.directory = Boolean(request.directory);
        this.module = Boolean(request.module);
        /** @type {StackEntry | undefined} */ this.parent = parent;
        /**
		 * Strings seeded by callers that still pass `stack: new Set([...])`.
		 * Propagated through the chain so deeper `doResolve` calls still see
		 * them during recursion checks. `undefined` in the common case so
		 * there is no extra work on the hot path.
		 * @type {Set<string> | undefined}
		 */ this.preSeeded = preSeeded;
    }
    /**
	 * Walk the linked list looking for an entry with the same request shape.
	 * Set-compatible: callers that used `stack.has(entry)` keep working.
	 * @param {StackEntry} query entry to look for
	 * @returns {boolean} whether the stack already contains an equivalent entry
	 */ has(query) {
        /** @type {StackEntry | undefined} */ let node = this;
        while(node){
            if (node.name === query.name && node.path === query.path && node.request === query.request && node.query === query.query && node.fragment === query.fragment && node.directory === query.directory && node.module === query.module) {
                return true;
            }
            node = node.parent;
        }
        return this.preSeeded !== undefined && this.preSeeded.has(query.toString());
    }
    /**
	 * Number of entries on the stack (oldest-to-newest length).
	 * @returns {number} size
	 */ get size() {
        let count = this.preSeeded ? this.preSeeded.size : 0;
        /** @type {StackEntry | undefined} */ let node = this;
        while(node){
            count++;
            node = node.parent;
        }
        return count;
    }
    /**
	 * Iterate entries from oldest (root) to newest (tip), matching how a
	 * `Set` that was populated in insertion order would iterate. Pre-seeded
	 * legacy `Set<string>` entries come first so error-message output stays
	 * ordered oldest-to-newest.
	 * @returns {IterableIterator<StackEntry | string>} iterator
	 */ *[Symbol.iterator]() {
        if (this.preSeeded !== undefined) {
            for (const entry of this.preSeeded)yield entry;
        }
        /** @type {StackEntry[]} */ const entries = [];
        /** @type {StackEntry | undefined} */ let node = this;
        while(node){
            entries.push(node);
            node = node.parent;
        }
        for(let i = entries.length - 1; i >= 0; i--)yield entries[i];
    }
    /**
	 * Human-readable form used in recursion error messages and logs.
	 * Matches the historical string format so existing log parsers stay valid.
	 * @returns {string} formatted entry
	 */ toString() {
        return `${this.name}: (${this.path}) ${this.request}${this.query}${this.fragment}${this.directory ? " directory" : ""}${this.module ? " module" : ""}`;
    }
}
/**
 * Resolve context
 * @typedef {object} ResolveContext
 * @property {WriteOnlySet<string>=} contextDependencies directories that was found on file system
 * @property {WriteOnlySet<string>=} fileDependencies files that was found on file system
 * @property {WriteOnlySet<string>=} missingDependencies dependencies that was not found on file system
 * @property {StackEntry | Set<string>=} stack tip of the resolver call stack (a singly-linked list with Set-like API). For instance, `resolve → parsedResolve → describedResolve`. Accepts a legacy `Set<string>` for back-compat with older callers; it is normalized internally without a hot-path branch.
 * @property {((str: string) => void)=} log log function
 * @property {ResolveContextYield=} yield yield result, if provided plugins can return several results
 */ /** @typedef {AsyncSeriesBailHook<[ResolveRequest, ResolveContext], ResolveRequest | null>} ResolveStepHook */ /**
 * @typedef {object} KnownHooks
 * @property {SyncHook<[ResolveStepHook, ResolveRequest], void>} resolveStep resolve step hook
 * @property {SyncHook<[ResolveRequest, Error]>} noResolve no resolve hook
 * @property {ResolveStepHook} resolve resolve hook
 * @property {AsyncSeriesHook<[ResolveRequest, ResolveContext]>} result result hook
 */ /**
 * @typedef {{ [key: string]: ResolveStepHook }} EnsuredHooks
 */ /**
 * @param {string} str input string
 * @returns {string} in camel case
 */ function toCamelCase(str) {
    return str.replace(/-([a-z])/g, (str)=>str.slice(1).toUpperCase());
}
class Resolver {
    /**
	 * @param {ResolveStepHook} hook hook
	 * @param {ResolveRequest} request request
	 * @param {StackEntry=} parent previous tip of the stack
	 * @param {Set<string>=} preSeeded entries pre-seeded via the legacy `Set<string>` API
	 * @returns {StackEntry} stack entry
	 */ static createStackEntry(hook, request, parent, preSeeded) {
        return new StackEntry(hook, request, parent, preSeeded);
    }
    /**
	 * @param {FileSystem} fileSystem a filesystem
	 * @param {ResolveOptions} options options
	 */ constructor(fileSystem, options){
        /** @type {FileSystem} */ this.fileSystem = fileSystem;
        /** @type {ResolveOptions} */ this.options = options;
        let pathCache = _pathCacheByFs.get(fileSystem);
        if (!pathCache) {
            pathCache = {
                join: createCachedJoin(),
                dirname: createCachedDirname(),
                basename: createCachedBasename()
            };
            _pathCacheByFs.set(fileSystem, pathCache);
        }
        /** @type {PathCacheFunctions} */ this.pathCache = pathCache;
        /** @type {KnownHooks} */ this.hooks = {
            resolveStep: new SyncHook([
                "hook",
                "request"
            ], "resolveStep"),
            noResolve: new SyncHook([
                "request",
                "error"
            ], "noResolve"),
            resolve: new AsyncSeriesBailHook([
                "request",
                "resolveContext"
            ], "resolve"),
            result: new AsyncSeriesHook([
                "result",
                "resolveContext"
            ], "result")
        };
    }
    /**
	 * @param {string | ResolveStepHook} name hook name or hook itself
	 * @returns {ResolveStepHook} the hook
	 */ ensureHook(name) {
        if (typeof name !== "string") {
            return name;
        }
        name = toCamelCase(name);
        if (name.startsWith("before")) {
            return this.ensureHook(name[6].toLowerCase() + name.slice(7)).withOptions({
                stage: -10
            });
        }
        if (name.startsWith("after")) {
            return this.ensureHook(name[5].toLowerCase() + name.slice(6)).withOptions({
                stage: 10
            });
        }
        /** @type {ResolveStepHook} */ const hook = /** @type {KnownHooks & EnsuredHooks} */ this.hooks[name];
        if (!hook) {
            /** @type {KnownHooks & EnsuredHooks} */ this.hooks[name] = new AsyncSeriesBailHook([
                "request",
                "resolveContext"
            ], name);
            return /** @type {KnownHooks & EnsuredHooks} */ this.hooks[name];
        }
        return hook;
    }
    /**
	 * @param {string | ResolveStepHook} name hook name or hook itself
	 * @returns {ResolveStepHook} the hook
	 */ getHook(name) {
        if (typeof name !== "string") {
            return name;
        }
        name = toCamelCase(name);
        if (name.startsWith("before")) {
            return this.getHook(name[6].toLowerCase() + name.slice(7)).withOptions({
                stage: -10
            });
        }
        if (name.startsWith("after")) {
            return this.getHook(name[5].toLowerCase() + name.slice(6)).withOptions({
                stage: 10
            });
        }
        /** @type {ResolveStepHook} */ const hook = /** @type {KnownHooks & EnsuredHooks} */ this.hooks[name];
        if (!hook) {
            throw new Error(`Hook ${name} doesn't exist`);
        }
        return hook;
    }
    /**
	 * @overload
	 * @param {string} path context path
	 * @param {string} request request string
	 * @param {ResolveContext=} resolveContext resolve context
	 * @returns {string | false} result
	 */ /**
	 * @overload
	 * @param {Context} context context information object
	 * @param {string} path context path
	 * @param {string} request request string
	 * @param {ResolveContext=} resolveContext resolve context
	 * @returns {string | false} result
	 */ /**
	 * @param {Context | string} context context information object or context path when no context is provided
	 * @param {string | ResolveContext=} path context path or resolve context when no context is provided
	 * @param {string | ResolveContext=} request request string or resolve context when no context is provided
	 * @param {ResolveContext=} resolveContext resolve context
	 * @returns {string | false} result
	 */ resolveSync(context, path, request, resolveContext) {
        /** @type {Error | null | undefined} */ let err;
        /** @type {string | false | undefined} */ let result;
        let sync = false;
        // `|| {}` so the underlying `resolve()` hits its 5-arg fast path
        // (skips the overload-shifting prologue) regardless of whether the
        // caller supplied a resolveContext.
        this.resolve(context, path, request, /** @type {ResolveContext} */ resolveContext || {}, (_err, r)=>{
            err = _err;
            result = r;
            sync = true;
        });
        if (!sync) {
            throw new Error("Cannot 'resolveSync' because the fileSystem is not sync. Use 'resolve'!");
        }
        if (err) throw err;
        if (result === undefined) throw new Error("No result");
        return result;
    }
    /**
	 * @overload
	 * @param {string} path context path
	 * @param {string} request request string
	 * @param {ResolveContext=} resolveContext resolve context
	 * @returns {Promise<string | false>} result
	 */ /**
	 * @overload
	 * @param {Context} context context information object
	 * @param {string} path context path
	 * @param {string} request request string
	 * @param {ResolveContext=} resolveContext resolve context
	 * @returns {Promise<string | false>} result
	 */ /**
	 * @param {Context | string} context context information object or context path when no context is provided
	 * @param {string | ResolveContext=} path context path or resolve context when no context is provided
	 * @param {string | ResolveContext=} request request string or resolve context when no context is provided
	 * @param {ResolveContext=} resolveContext resolve context
	 * @returns {Promise<string | false>} result
	 */ resolvePromise(context, path, request, resolveContext) {
        // `|| {}` ensures the 5-arg fast path inside `resolve()` is reached
        // even when the caller doesn't pass a resolveContext.
        return _withResolvers(this, context, path, request, /** @type {ResolveContext} */ resolveContext || {});
    }
    /**
	 * @overload
	 * @param {string} path context path
	 * @param {string} request request string
	 * @param {ResolveCallback} callback callback function
	 * @returns {void}
	 */ /**
	 * @overload
	 * @param {string} path context path
	 * @param {string} request request string
	 * @param {ResolveContext} resolveContext resolve context
	 * @param {ResolveCallback} callback callback function
	 * @returns {void}
	 */ /**
	 * @overload
	 * @param {Context} context context information object
	 * @param {string} path context path
	 * @param {string} request request string
	 * @param {ResolveCallback} callback callback function
	 * @returns {void}
	 */ /**
	 * @overload
	 * @param {Context} context context information object
	 * @param {string} path context path
	 * @param {string} request request string
	 * @param {ResolveContext} resolveContext resolve context
	 * @param {ResolveCallback} callback callback function
	 * @returns {void}
	 */ /**
	 * @param {Context | string} context context information object or context path when no context is provided
	 * @param {string | ResolveContext | ResolveCallback=} path context path or (when no context) resolve context or callback
	 * @param {string | ResolveContext | ResolveCallback=} request request string or (when no context) resolve context or callback
	 * @param {ResolveContext | ResolveCallback=} resolveContext resolve context or callback when no resolve context is provided
	 * @param {ResolveCallback=} callback callback function
	 * @returns {void}
	 */ resolve(context, path, request, resolveContext, callback) {
        // Fast path for the common 5-arg call (`resolver.resolve(ctx, from,
        // req, resolveCtx, cb)`) — every call from `resolveSync` /
        // `resolvePromise` plus the vast majority of direct API callers.
        // PR #536 added runtime overload-shifting to support optional
        // `context` / `resolveContext`; that adds several `typeof` checks
        // per resolve which show up as a measurable instruction-count
        // regression on every benchmark that calls into this method. Skip
        // the shifting entirely when all 5 args are already well-typed.
        if (typeof callback === "function" && typeof context === "object" && context !== null && typeof resolveContext === "object" && resolveContext !== null) {
        // proceed straight to per-arg validation below
        } else {
            // Slow path: shift positional args based on what was supplied.
            // Shift when context is omitted (first positional arg is the path string).
            if (typeof context === "string") {
                // Keep an already-supplied callback (resolveSync / resolvePromise
                // always pass one in the 5th position).
                if (typeof callback !== "function") {
                    callback = resolveContext;
                }
                resolveContext = request;
                request = path;
                path = context;
                context = {};
            }
            // 4-arg form: the resolveContext slot holds the callback.
            if (typeof resolveContext === "function") {
                callback = resolveContext;
                resolveContext = {};
            } else if (!resolveContext || typeof resolveContext !== "object") {
                resolveContext = {};
            }
            if (typeof callback !== "function") {
                throw new TypeError("callback argument is not a function");
            }
            if (!context || typeof context !== "object") {
                context = {};
            }
        }
        if (typeof path !== "string") {
            return callback(new Error("path argument is not a string"));
        }
        if (typeof request !== "string") {
            return callback(new Error("request argument is not a string"));
        }
        /** @type {ResolveRequest} */ const obj = {
            context,
            path,
            request
        };
        /** @type {ResolveContextYield | undefined} */ let yield_;
        let yieldCalled = false;
        /** @type {ResolveContextYield | undefined} */ let finishYield;
        if (typeof resolveContext.yield === "function") {
            const old = resolveContext.yield;
            /**
			 * @param {ResolveRequest} obj object
			 */ yield_ = (obj)=>{
                old(obj);
                yieldCalled = true;
            };
            /**
			 * @param {ResolveRequest} result result
			 * @returns {void}
			 */ finishYield = (result)=>{
                if (result) {
                    /** @type {ResolveContextYield} */ yield_(result);
                }
                callback(null);
            };
        }
        const message = `resolve '${request}' in '${path}'`;
        /**
		 * @param {ResolveRequest} result result
		 * @returns {void}
		 */ const finishResolved = (result)=>callback(null, result.path === false ? false : `${result.path.replace(/#/g, "\0#")}${result.query ? result.query.replace(/#/g, "\0#") : ""}${result.fragment || ""}`, result);
        /**
		 * @param {string[]} log logs
		 * @returns {void}
		 */ const finishWithoutResolve = (log)=>{
            /**
			 * @type {ErrorWithDetail}
			 */ const error = new Error(`Can't ${message}`);
            error.details = log.join("\n");
            this.hooks.noResolve.call(obj, error);
            return callback(error);
        };
        if (resolveContext.log) {
            // We need log anyway to capture it in case of an error
            const parentLog = resolveContext.log;
            /** @type {string[]} */ const log = [];
            return this.doResolve(this.hooks.resolve, obj, message, {
                log: (msg)=>{
                    parentLog(msg);
                    log.push(msg);
                },
                yield: yield_,
                fileDependencies: resolveContext.fileDependencies,
                contextDependencies: resolveContext.contextDependencies,
                missingDependencies: resolveContext.missingDependencies,
                stack: resolveContext.stack
            }, (err, result)=>{
                if (err) return callback(err);
                if (yieldCalled || result && yield_) {
                    return /** @type {ResolveContextYield} */ finishYield(result);
                }
                if (result) return finishResolved(result);
                return finishWithoutResolve(log);
            });
        }
        // Try to resolve assuming there is no error
        // We don't log stuff in this case
        return this.doResolve(this.hooks.resolve, obj, message, {
            log: undefined,
            yield: yield_,
            fileDependencies: resolveContext.fileDependencies,
            contextDependencies: resolveContext.contextDependencies,
            missingDependencies: resolveContext.missingDependencies,
            stack: resolveContext.stack
        }, (err, result)=>{
            if (err) return callback(err);
            if (yieldCalled || result && yield_) {
                return /** @type {ResolveContextYield} */ finishYield(result);
            }
            if (result) return finishResolved(result);
            // log is missing for the error details
            // so we redo the resolving for the log info
            // this is more expensive to the success case
            // is assumed by default
            /** @type {string[]} */ const log = [];
            return this.doResolve(this.hooks.resolve, obj, message, {
                log: (msg)=>log.push(msg),
                yield: yield_,
                stack: resolveContext.stack
            }, (err, result)=>{
                if (err) return callback(err);
                // In a case that there is a race condition and yield will be called
                if (yieldCalled || result && yield_) {
                    return /** @type {ResolveContextYield} */ finishYield(result);
                }
                return finishWithoutResolve(log);
            });
        });
    }
    /**
	 * @param {ResolveStepHook} hook hook
	 * @param {ResolveRequest} request request
	 * @param {null | string} message string
	 * @param {ResolveContext} resolveContext resolver context
	 * @param {(err?: null | Error, result?: ResolveRequest) => void} callback callback
	 * @returns {void}
	 */ doResolve(hook, request, message, resolveContext, callback) {
        const rawStack = resolveContext.stack;
        /** @type {StackEntry | undefined} */ let parent;
        /** @type {Set<string> | undefined} */ let preSeeded;
        if (rawStack instanceof StackEntry) {
            parent = rawStack;
            preSeeded = rawStack.preSeeded;
        } else if (rawStack) {
            // TODO in the next major remove `Set<string>` support in favor of `StackEntry`
            // Legacy `stack: new Set<string>()` API: don't link the Set into
            // the parent chain (it would pollute iteration and field-compare
            // walks). Carry the strings on the StackEntry itself instead so
            // deeper `doResolve` calls keep seeing pre-seeded entries.
            preSeeded = rawStack;
        }
        // Prepend a new linked-list node. O(1) allocation, no Set clone.
        const stackEntry = Resolver.createStackEntry(hook, request, parent, preSeeded);
        // When `parent` exists, its `has()` already consults `preSeeded`
        // (inherited from the same chain), so we only need the direct Set
        // lookup on the very first `doResolve` call (no parent yet).
        if (parent !== undefined ? parent.has(stackEntry) : preSeeded !== undefined && preSeeded.has(stackEntry.toString())) {
            /**
			 * Prevent recursion
			 * @type {Error & { recursion?: boolean }}
			 */ const recursionError = new Error(`Recursion in resolving\nStack:\n  ${[
                ...stackEntry
            ].map((entry)=>entry.toString()).join("\n  ")}`);
            recursionError.recursion = true;
            if (resolveContext.log) {
                resolveContext.log("abort resolving because of recursion");
            }
            return callback(recursionError);
        }
        this.hooks.resolveStep.call(hook, request);
        if (hook.isUsed()) {
            // Pass `resolveContext` and the override fields (stack, message)
            // directly instead of constructing an intermediate options-object
            // literal — `createInnerContext` reads from the parent and
            // allocates exactly one inner context per step. See the comment
            // on `createInnerContext` itself for the allocation rationale.
            const innerContext = createInnerContext(resolveContext, stackEntry, message);
            return hook.callAsync(request, innerContext, (err, result)=>{
                if (err) return callback(err);
                if (result) return callback(null, result);
                callback();
            });
        }
        callback();
    }
    /**
	 * @param {string} identifier identifier
	 * @returns {ParsedIdentifier} parsed identifier
	 */ parse(identifier) {
        /** @type {ParsedIdentifier} */ const part = {
            request: "",
            query: "",
            fragment: "",
            module: false,
            directory: false,
            file: false,
            internal: false
        };
        const parsedIdentifier = parseIdentifier(identifier);
        if (!parsedIdentifier) return part;
        [part.request, part.query, part.fragment] = parsedIdentifier;
        if (part.request.length > 0) {
            part.internal = this.isPrivate(identifier);
            part.module = this.isModule(part.request);
            part.directory = this.isDirectory(part.request);
            if (part.directory) {
                part.request = part.request.slice(0, -1);
            }
        }
        return part;
    }
    /**
	 * @param {string} path path
	 * @returns {boolean} true, if the path is a module
	 */ isModule(path) {
        return getType(path) === PathType.Normal;
    }
    /**
	 * @param {string} path path
	 * @returns {boolean} true, if the path is private
	 */ isPrivate(path) {
        return getType(path) === PathType.Internal;
    }
    /**
	 * @param {string} path a path
	 * @returns {boolean} true, if the path is a directory path
	 */ isDirectory(path) {
        return path.endsWith("/");
    }
    /**
	 * @param {string} path path
	 * @returns {string} normalized path
	 */ normalize(path) {
        return normalize(path);
    }
    /**
	 * @param {string} path path
	 * @param {string} request request
	 * @returns {string} joined path
	 */ join(path, request) {
        return this.pathCache.join.fn(path, request);
    }
    /**
	 * @param {string} path path
	 * @returns {string} parent directory
	 */ dirname(path) {
        return this.pathCache.dirname.fn(path);
    }
    /**
	 * @param {string} path the path to evaluate
	 * @param {string=} suffix an extension to remove from the result
	 * @returns {string} the last portion of a path
	 */ basename(path, suffix) {
        return this.pathCache.basename.fn(path, suffix);
    }
}
module.exports = Resolver;
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/RestrictionsPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ const slashCode = "/".charCodeAt(0);
const backslashCode = "\\".charCodeAt(0);
/**
 * @param {string} path path
 * @param {string} parent parent path
 * @returns {boolean} true, if path is inside of parent
 */ const isInside = (path, parent)=>{
    if (!path.startsWith(parent)) return false;
    if (path.length === parent.length) return true;
    const charCode = path.charCodeAt(parent.length);
    return charCode === slashCode || charCode === backslashCode;
};
module.exports = class RestrictionsPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {Set<string | RegExp>} restrictions restrictions
	 */ constructor(source, restrictions){
        this.source = source;
        this.restrictions = restrictions;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        resolver.getHook(this.source).tapAsync("RestrictionsPlugin", (request, resolveContext, callback)=>{
            if (typeof request.path === "string") {
                const { path } = request;
                for (const rule of this.restrictions){
                    if (typeof rule === "string") {
                        if (!isInside(path, rule)) {
                            if (resolveContext.log) {
                                resolveContext.log(`${path} is not inside of the restriction ${rule}`);
                            }
                            return callback(null, null);
                        }
                    } else if (!rule.test(path)) {
                        if (resolveContext.log) {
                            resolveContext.log(`${path} doesn't match the restriction ${rule}`);
                        }
                        return callback(null, null);
                    }
                }
            }
            callback();
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ResultPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class ResultPlugin {
    /**
	 * @param {ResolveStepHook} source source
	 */ constructor(source){
        this.source = source;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        this.source.tapAsync("ResultPlugin", (request, resolverContext, callback)=>{
            const obj = {
                ...request
            };
            if (resolverContext.log) {
                resolverContext.log(`reporting result ${obj.path}`);
            }
            resolver.hooks.result.callAsync(obj, resolverContext, (err)=>{
                if (err) return callback(err);
                if (typeof resolverContext.yield === "function") {
                    resolverContext.yield(obj);
                    callback(null, null);
                } else {
                    callback(null, obj);
                }
            });
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/RootsPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Ivan Kopeykin @vankop
*/ const forEachBail = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/forEachBail.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ class RootsPlugin {
    /**
	 * @param {string | ResolveStepHook} source source hook
	 * @param {Set<string>} roots roots
	 * @param {string | ResolveStepHook} target target hook
	 */ constructor(source, roots, target){
        this.roots = [
            ...roots
        ];
        this.source = source;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("RootsPlugin", (request, resolveContext, callback)=>{
            const req = request.request;
            if (!req) return callback();
            if (!req.startsWith("/")) return callback();
            forEachBail(this.roots, /**
					 * @param {string} root root
					 * @param {(err?: null | Error, result?: null | ResolveRequest) => void} callback callback
					 * @returns {void}
					 */ (root, callback)=>{
                const path = resolver.join(root, req.slice(1));
                /** @type {ResolveRequest} */ const obj = {
                    ...request,
                    path,
                    relativePath: request.relativePath && path
                };
                resolver.doResolve(target, obj, `root path ${root}`, resolveContext, callback);
            }, callback);
        });
    }
}
module.exports = RootsPlugin;
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/SelfReferencePlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ const DescriptionFileUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/DescriptionFileUtils.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").JsonObject} JsonObject */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ const slashCode = "/".charCodeAt(0);
// Sentinel stored in `_nameCache` when the description file either has no
// exports field (so self-reference can't apply) or no string `name`.
const NO_SELF_REF = Symbol("NoSelfRef");
module.exports = class SelfReferencePlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | string[]} fieldNamePath name path
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, fieldNamePath, target){
        this.source = source;
        this.target = target;
        this.fieldName = fieldNamePath;
        // Self-reference needs both an exports field and a `"name"` string.
        // Both are stable per description-file content, so cache the decision
        // in one WeakMap: the resolved name when self-reference is possible,
        // or `NO_SELF_REF` when it isn't. This skips the two per-resolve
        // `DescriptionFileUtils.getField` walks for hot packages.
        /** @type {WeakMap<JsonObject, string | typeof NO_SELF_REF>} */ this._nameCache = new WeakMap();
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("SelfReferencePlugin", (request, resolveContext, callback)=>{
            if (!request.descriptionFileData) return callback();
            const req = request.request;
            if (!req) return callback();
            const { descriptionFileData } = request;
            let name = this._nameCache.get(descriptionFileData);
            if (name === undefined) {
                // Feature is only enabled when an exports field is present
                const exportsField = DescriptionFileUtils.getField(descriptionFileData, this.fieldName);
                if (!exportsField) {
                    this._nameCache.set(descriptionFileData, NO_SELF_REF);
                    return callback();
                }
                const rawName = DescriptionFileUtils.getField(descriptionFileData, "name");
                if (typeof rawName !== "string") {
                    this._nameCache.set(descriptionFileData, NO_SELF_REF);
                    return callback();
                }
                name = rawName;
                this._nameCache.set(descriptionFileData, name);
            } else if (name === NO_SELF_REF) {
                return callback();
            }
            if (req.startsWith(name) && (req.length === name.length || req.charCodeAt(name.length) === slashCode)) {
                const remainingRequest = `.${req.slice(name.length)}`;
                /** @type {ResolveRequest} */ const obj = {
                    ...request,
                    request: remainingRequest,
                    path: request.descriptionFileRoot,
                    relativePath: "."
                };
                resolver.doResolve(target, obj, "self reference", resolveContext, callback);
            } else {
                return callback();
            }
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/SymlinkPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ const forEachBail = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/forEachBail.js [postcss] (ecmascript)");
const { getPathsCached } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/getPaths.js [postcss] (ecmascript)");
const { PathType, getType } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/path.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class SymlinkPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, target){
        this.source = source;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        const fs = resolver.fileSystem;
        resolver.getHook(this.source).tapAsync("SymlinkPlugin", (request, resolveContext, callback)=>{
            if (request.ignoreSymlinks) return callback();
            const pathsResult = getPathsCached(fs, request.path);
            const { paths, segments } = pathsResult;
            // `pathsResult.segments` is shared across callers via the cache.
            // The only place we need to mutate is `pathSegments[idx] = result`
            // when `fs.readlink` succeeds — which is rare (the vast majority
            // of paths contain no symlinks, e.g. every resolve on
            // `cache-predicate`'s no-symlink fixture). Defer the copy until
            // we actually see a symlink so the common no-symlink path stays
            // allocation-free.
            /** @type {string[] | null} */ let pathSegments = null;
            let containsSymlink = false;
            let idx = -1;
            forEachBail(paths, /**
					 * @param {string} path path
					 * @param {(err?: null | Error, result?: null | number) => void} callback callback
					 * @returns {void}
					 */ (path, callback)=>{
                idx++;
                if (resolveContext.fileDependencies) {
                    resolveContext.fileDependencies.add(path);
                }
                fs.readlink(path, (err, result)=>{
                    if (!err && result) {
                        // First symlink seen — take our own copy now, so
                        // the cached `segments` array stays pristine for
                        // sibling resolves.
                        if (pathSegments === null) {
                            pathSegments = [
                                ...segments
                            ];
                        }
                        pathSegments[idx] = result;
                        containsSymlink = true;
                        // Shortcut when absolute symlink found
                        const resultType = getType(result.toString());
                        if (resultType === PathType.AbsoluteWin || resultType === PathType.AbsolutePosix) {
                            return callback(null, idx);
                        }
                    }
                    callback();
                });
            }, /**
					 * @param {null | Error=} err error
					 * @param {null | number=} idx result
					 * @returns {void}
					 */ (err, idx)=>{
                if (!containsSymlink) return callback();
                // `containsSymlink === true` implies we took a copy in
                // `pathSegments` already, so it's non-null. The copy is
                // our own, so `slice` to trim is fine and spreading to
                // "unshare" is no longer necessary.
                const own = pathSegments;
                const resultSegments = typeof idx === "number" ? own.slice(0, idx + 1) : own;
                const result = resultSegments.reduceRight((a, b)=>resolver.join(a, b));
                /** @type {ResolveRequest} */ const obj = {
                    ...request,
                    path: result
                };
                resolver.doResolve(target, obj, `resolved symlink to ${result}`, resolveContext, callback);
            });
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/SyncAsyncFileSystemDecorator.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver").FileSystem} FileSystem */ /** @typedef {import("./Resolver").StringCallback} StringCallback */ /** @typedef {import("./Resolver").SyncFileSystem} SyncFileSystem */ // eslint-disable-next-line jsdoc/reject-function-type
/** @typedef {Function} SyncOrAsyncFunction */ // eslint-disable-next-line jsdoc/reject-any-type
/** @typedef {any} ResultOfSyncOrAsyncFunction */ /**
 * @param {SyncFileSystem} fs file system implementation
 * @constructor
 */ function SyncAsyncFileSystemDecorator(fs) {
    this.fs = fs;
    this.lstat = undefined;
    this.lstatSync = undefined;
    const { lstatSync } = fs;
    if (lstatSync) {
        this.lstat = (arg, options, callback)=>{
            let result;
            try {
                result = /** @type {SyncOrAsyncFunction | undefined} */ callback ? lstatSync.call(fs, arg, options) : lstatSync.call(fs, arg);
            } catch (err) {
                return (callback || options)(err);
            }
            (callback || options)(null, result);
        };
        this.lstatSync = (arg, options)=>lstatSync.call(fs, arg, options);
    }
    this.stat = (arg, options, callback)=>{
        let result;
        try {
            result = /** @type {SyncOrAsyncFunction | undefined} */ callback ? fs.statSync(arg, options) : fs.statSync(arg);
        } catch (err) {
            return (callback || options)(err);
        }
        (callback || options)(null, result);
    };
    this.statSync = (arg, options)=>fs.statSync(arg, options);
    this.readdir = (arg, options, callback)=>{
        let result;
        try {
            result = /** @type {SyncOrAsyncFunction | undefined} */ callback ? fs.readdirSync(arg, options) : fs.readdirSync(arg);
        } catch (err) {
            return (callback || options)(err, []);
        }
        (callback || options)(null, result);
    };
    this.readdirSync = (arg, options)=>fs.readdirSync(arg, options);
    this.readFile = (arg, options, callback)=>{
        let result;
        try {
            result = /** @type {SyncOrAsyncFunction | undefined} */ callback ? fs.readFileSync(arg, options) : fs.readFileSync(arg);
        } catch (err) {
            return (callback || options)(err);
        }
        (callback || options)(null, result);
    };
    this.readFileSync = (arg, options)=>fs.readFileSync(arg, options);
    this.readlink = (arg, options, callback)=>{
        let result;
        try {
            result = /** @type {SyncOrAsyncFunction | undefined} */ callback ? fs.readlinkSync(arg, options) : fs.readlinkSync(arg);
        } catch (err) {
            return (callback || options)(err);
        }
        (callback || options)(null, result);
    };
    this.readlinkSync = (arg, options)=>fs.readlinkSync(arg, options);
    this.readJson = undefined;
    this.readJsonSync = undefined;
    const { readJsonSync } = fs;
    if (readJsonSync) {
        this.readJson = (arg, callback)=>{
            let result;
            try {
                result = readJsonSync.call(fs, arg);
            } catch (err) {
                return callback(err);
            }
            callback(null, result);
        };
        this.readJsonSync = (arg)=>readJsonSync.call(fs, arg);
    }
    this.realpath = undefined;
    this.realpathSync = undefined;
    const { realpathSync } = fs;
    if (realpathSync) {
        this.realpath = (arg, options, callback)=>{
            let result;
            try {
                result = /** @type {SyncOrAsyncFunction | undefined} */ callback ? realpathSync.call(fs, arg, options) : realpathSync.call(fs, arg);
            } catch (err) {
                return (callback || options)(err);
            }
            (callback || options)(null, result);
        };
        this.realpathSync = (arg, options)=>realpathSync.call(fs, arg, options);
    }
}
module.exports = SyncAsyncFileSystemDecorator;
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/TryNextPlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class TryNextPlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string} message message
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, message, target){
        this.source = source;
        this.message = message;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("TryNextPlugin", (request, resolveContext, callback)=>{
            resolver.doResolve(target, request, this.message, resolveContext, callback);
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/UnsafeCachePlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ const { isRelativeRequest } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/path.js [postcss] (ecmascript)");
/** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ /** @typedef {import("./Resolver").ResolveContextYield} ResolveContextYield */ /** @typedef {{ [k: string]: undefined | ResolveRequest | ResolveRequest[] }} Cache */ /**
 * @param {string} relativePath relative path from package root
 * @param {string} request relative request
 * @param {Resolver} resolver resolver instance
 * @returns {string} normalized request with a preserved leading dot
 */ function joinRelativePreservingLeadingDot(relativePath, request, resolver) {
    const normalized = resolver.join(relativePath, request);
    return isRelativeRequest(normalized) ? normalized : `./${normalized}`;
}
/**
 * @param {ResolveRequest} request request
 * @returns {string | false | undefined} normalized path
 */ function getCachePath(request) {
    if (request.descriptionFileRoot && !request.module) {
        return request.descriptionFileRoot;
    }
    return request.path;
}
/**
 * @param {ResolveRequest} request request
 * @param {Resolver} resolver resolver instance
 * @returns {string | undefined} normalized request string
 */ function getCacheRequest(request, resolver) {
    const requestString = request.request;
    if (!requestString || !request.relativePath || !isRelativeRequest(requestString)) {
        return requestString;
    }
    return joinRelativePreservingLeadingDot(request.relativePath, requestString, resolver);
}
// Cache-key separator: `\0` is safe because paths, requests, queries and
// fragments produced by `parseIdentifier` never contain a raw NUL (the
// \0-escape in identifier.js is decoded back to the original char), and the
// context, when included, is passed through `JSON.stringify`, which escapes
// any NUL to \u0000.
// const SEP = "\0";
/**
 * Build the cache id for a request. Called on every `described-resolve`
 * invocation when `unsafeCache` is on, so it's a hot path.
 *
 * Equivalent in meaning to the previous `JSON.stringify({ ... })` form, but
 * ~3–5× faster since we avoid the object allocation and JSON serializer for
 * the fields that are already plain strings.
 * @param {string} type type of cache
 * @param {ResolveRequest} request request
 * @param {boolean} withContext cache with context?
 * @param {Resolver} resolver resolver instance
 * @returns {string} cache id
 */ function getCacheId(type, request, withContext, resolver) {
    // TODO use it in the next major release, it is faster
    // const contextPart = withContext ? JSON.stringify(request.context) : "";
    // const path = getCachePath(request);
    // const cacheRequest = getCacheRequest(request, resolver);
    // return (
    // 	type +
    // 	SEP +
    // 	contextPart +
    // 	SEP +
    // 	(path || "") +
    // 	SEP +
    // 	(request.query || "") +
    // 	SEP +
    // 	(request.fragment || "") +
    // 	SEP +
    // 	(cacheRequest || "")
    // );
    return JSON.stringify({
        type,
        context: withContext ? request.context : "",
        path: getCachePath(request),
        query: request.query,
        fragment: request.fragment,
        request: getCacheRequest(request, resolver)
    });
}
module.exports = class UnsafeCachePlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {(request: ResolveRequest) => boolean} filterPredicate filterPredicate
	 * @param {Cache} cache cache
	 * @param {boolean} withContext withContext
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, filterPredicate, cache, withContext, target){
        this.source = source;
        this.filterPredicate = filterPredicate;
        this.withContext = withContext;
        this.cache = cache;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("UnsafeCachePlugin", (request, resolveContext, callback)=>{
            if (!this.filterPredicate(request)) {
                return resolver.doResolve(target, request, null, resolveContext, callback);
            }
            const isYield = typeof resolveContext.yield === "function";
            const cacheId = getCacheId(isYield ? "yield" : "default", request, this.withContext, resolver);
            const cacheEntry = this.cache[cacheId];
            if (cacheEntry) {
                if (isYield) {
                    const yield_ = resolveContext.yield;
                    if (Array.isArray(cacheEntry)) {
                        for (const result of cacheEntry)yield_(result);
                    } else {
                        yield_(cacheEntry);
                    }
                    return callback(null, null);
                }
                return callback(null, cacheEntry);
            }
            /** @type {ResolveContextYield | undefined} */ let yieldFn;
            /** @type {ResolveContextYield | undefined} */ let yield_;
            /** @type {ResolveRequest[]} */ const yieldResult = [];
            if (isYield) {
                yieldFn = resolveContext.yield;
                yield_ = (result)=>{
                    yieldResult.push(result);
                };
            }
            resolver.doResolve(target, request, null, yield_ ? {
                ...resolveContext,
                yield: yield_
            } : resolveContext, (err, result)=>{
                if (err) return callback(err);
                if (isYield) {
                    if (result) yieldResult.push(result);
                    for (const result of yieldResult){
                        /** @type {ResolveContextYield} */ yieldFn(result);
                    }
                    this.cache[cacheId] = yieldResult;
                    return callback(null, null);
                }
                if (result) return callback(null, this.cache[cacheId] = result);
                callback();
            });
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/UseFilePlugin.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */ module.exports = class UseFilePlugin {
    /**
	 * @param {string | ResolveStepHook} source source
	 * @param {string} filename filename
	 * @param {string | ResolveStepHook} target target
	 */ constructor(source, filename, target){
        this.source = source;
        this.filename = filename;
        this.target = target;
    }
    /**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */ apply(resolver) {
        const target = resolver.ensureHook(this.target);
        resolver.getHook(this.source).tapAsync("UseFilePlugin", (request, resolveContext, callback)=>{
            const filePath = resolver.join(request.path, this.filename);
            /** @type {ResolveRequest} */ const obj = {
                ...request,
                path: filePath,
                relativePath: request.relativePath && resolver.join(request.relativePath, this.filename)
            };
            resolver.doResolve(target, obj, `using path: ${filePath}`, resolveContext, callback);
        });
    }
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ResolverFactory.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ // eslint-disable-next-line n/prefer-global/process
const { versions } = __turbopack_context__.r("[externals]/process [external] (process, cjs)");
const AliasFieldPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/AliasFieldPlugin.js [postcss] (ecmascript)");
const AliasPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/AliasPlugin.js [postcss] (ecmascript)");
const AppendPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/AppendPlugin.js [postcss] (ecmascript)");
const ConditionalPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ConditionalPlugin.js [postcss] (ecmascript)");
const DescriptionFilePlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/DescriptionFilePlugin.js [postcss] (ecmascript)");
const DirectoryExistsPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/DirectoryExistsPlugin.js [postcss] (ecmascript)");
const ExportsFieldPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ExportsFieldPlugin.js [postcss] (ecmascript)");
const ExtensionAliasPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ExtensionAliasPlugin.js [postcss] (ecmascript)");
const FileExistsPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/FileExistsPlugin.js [postcss] (ecmascript)");
const ImportsFieldPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ImportsFieldPlugin.js [postcss] (ecmascript)");
const JoinRequestPartPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/JoinRequestPartPlugin.js [postcss] (ecmascript)");
const JoinRequestPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/JoinRequestPlugin.js [postcss] (ecmascript)");
const MainFieldPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/MainFieldPlugin.js [postcss] (ecmascript)");
const ModulesInHierarchicalDirectoriesPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ModulesInHierarchicalDirectoriesPlugin.js [postcss] (ecmascript)");
const ModulesInRootPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ModulesInRootPlugin.js [postcss] (ecmascript)");
const NextPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/NextPlugin.js [postcss] (ecmascript)");
const ParsePlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ParsePlugin.js [postcss] (ecmascript)");
const PnpPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/PnpPlugin.js [postcss] (ecmascript)");
const Resolver = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/Resolver.js [postcss] (ecmascript)");
const RestrictionsPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/RestrictionsPlugin.js [postcss] (ecmascript)");
const ResultPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ResultPlugin.js [postcss] (ecmascript)");
const RootsPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/RootsPlugin.js [postcss] (ecmascript)");
const SelfReferencePlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/SelfReferencePlugin.js [postcss] (ecmascript)");
const SymlinkPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/SymlinkPlugin.js [postcss] (ecmascript)");
const SyncAsyncFileSystemDecorator = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/SyncAsyncFileSystemDecorator.js [postcss] (ecmascript)");
const TryNextPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/TryNextPlugin.js [postcss] (ecmascript)");
const TsconfigPathsPlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/TsconfigPathsPlugin.js [postcss] (ecmascript)");
const UnsafeCachePlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/UnsafeCachePlugin.js [postcss] (ecmascript)");
const UseFilePlugin = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/UseFilePlugin.js [postcss] (ecmascript)");
const { PathType, getType } = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/path.js [postcss] (ecmascript)");
/** @typedef {import("./AliasPlugin").AliasOption} AliasOptionEntry */ /** @typedef {import("./ExtensionAliasPlugin").ExtensionAliasOption} ExtensionAliasOption */ /** @typedef {import("./PnpPlugin").PnpApiImpl} PnpApi */ /** @typedef {import("./Resolver").EnsuredHooks} EnsuredHooks */ /** @typedef {import("./Resolver").FileSystem} FileSystem */ /** @typedef {import("./Resolver").KnownHooks} KnownHooks */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").SyncFileSystem} SyncFileSystem */ /** @typedef {import("./UnsafeCachePlugin").Cache} Cache */ /** @typedef {string | string[] | false} AliasOptionNewRequest */ /** @typedef {{ [k: string]: AliasOptionNewRequest }} AliasOptions */ /** @typedef {{ [k: string]: string | string[] }} ExtensionAliasOptions */ /** @typedef {false | 0 | "" | null | undefined} Falsy */ /** @typedef {{ apply: (resolver: Resolver) => void } | ((this: Resolver, resolver: Resolver) => void) | Falsy} Plugin */ /**
 * @typedef {object} TsconfigOptions
 * @property {string=} configFile A relative path to the tsconfig file based on cwd, or an absolute path of tsconfig file
 * @property {string[] | "auto"=} references References to other tsconfig files. 'auto' inherits from TypeScript config, or an array of relative/absolute paths
 * @property {string=} baseUrl Override baseUrl from tsconfig.json. If provided, this value will be used instead of the baseUrl in the tsconfig file
 */ /**
 * @typedef {object} UserResolveOptions
 * @property {(AliasOptions | AliasOptionEntry[])=} alias A list of module alias configurations or an object which maps key to value
 * @property {(AliasOptions | AliasOptionEntry[])=} fallback A list of module alias configurations or an object which maps key to value, applied only after modules option
 * @property {ExtensionAliasOptions=} extensionAlias An object which maps extension to extension aliases
 * @property {boolean=} extensionAliasForExports Also apply `extensionAlias` to paths resolved through the package.json `exports` field. Off by default (Node.js-aligned); when enabled, matches TypeScript's behavior for packages that ship TS sources alongside compiled JS.
 * @property {(string | string[])[]=} aliasFields A list of alias fields in description files
 * @property {((predicate: ResolveRequest) => boolean)=} cachePredicate A function which decides whether a request should be cached or not. An object is passed with at least `path` and `request` properties.
 * @property {boolean=} cacheWithContext Whether or not the unsafeCache should include request context as part of the cache key.
 * @property {string[]=} descriptionFiles A list of description files to read from
 * @property {string[]=} conditionNames A list of exports field condition names.
 * @property {boolean=} enforceExtension Enforce that a extension from extensions must be used
 * @property {(string | string[])[]=} exportsFields A list of exports fields in description files
 * @property {(string | string[])[]=} importsFields A list of imports fields in description files
 * @property {string[]=} extensions A list of extensions which should be tried for files
 * @property {FileSystem} fileSystem The file system which should be used
 * @property {(Cache | boolean)=} unsafeCache Use this cache object to unsafely cache the successful requests
 * @property {boolean=} symlinks Resolve symlinks to their symlinked location
 * @property {Resolver=} resolver A prepared Resolver to which the plugins are attached
 * @property {string[] | string=} modules A list of directories to resolve modules from, can be absolute path or folder name
 * @property {(string | string[] | { name: string | string[], forceRelative: boolean })[]=} mainFields A list of main fields in description files
 * @property {string[]=} mainFiles A list of main files in directories
 * @property {Plugin[]=} plugins A list of additional resolve plugins which should be applied
 * @property {PnpApi | null=} pnpApi A PnP API that should be used - null is "never", undefined is "auto"
 * @property {string[]=} roots A list of root paths
 * @property {boolean=} fullySpecified The request is already fully specified and no extensions or directories are resolved for it
 * @property {boolean=} resolveToContext Resolve to a context instead of a file
 * @property {(string | RegExp)[]=} restrictions A list of resolve restrictions
 * @property {boolean=} useSyncFileSystemCalls Use only the sync constraints of the file system calls
 * @property {boolean=} preferRelative Prefer to resolve module requests as relative requests before falling back to modules
 * @property {boolean=} preferAbsolute Prefer to resolve server-relative urls as absolute paths before falling back to resolve in roots
 * @property {string | boolean | TsconfigOptions=} tsconfig TypeScript config file path or config object with configFile and references
 */ /**
 * @typedef {object} ResolveOptions
 * @property {AliasOptionEntry[]} alias alias
 * @property {AliasOptionEntry[]} fallback fallback
 * @property {Set<string | string[]>} aliasFields alias fields
 * @property {ExtensionAliasOption[]} extensionAlias extension alias
 * @property {boolean} extensionAliasForExports apply extension alias to exports field targets
 * @property {(predicate: ResolveRequest) => boolean} cachePredicate cache predicate
 * @property {boolean} cacheWithContext cache with context
 * @property {Set<string>} conditionNames A list of exports field condition names.
 * @property {string[]} descriptionFiles description files
 * @property {boolean} enforceExtension enforce extension
 * @property {Set<string | string[]>} exportsFields exports fields
 * @property {Set<string | string[]>} importsFields imports fields
 * @property {Set<string>} extensions extensions
 * @property {FileSystem} fileSystem fileSystem
 * @property {Cache | false} unsafeCache unsafe cache
 * @property {boolean} symlinks symlinks
 * @property {Resolver=} resolver resolver
 * @property {(string | string[])[]} modules modules
 * @property {{ name: string[], forceRelative: boolean }[]} mainFields main fields
 * @property {Set<string>} mainFiles main files
 * @property {Plugin[]} plugins plugins
 * @property {PnpApi | null} pnpApi pnp API
 * @property {Set<string>} roots roots
 * @property {boolean} fullySpecified fully specified
 * @property {boolean} resolveToContext resolve to context
 * @property {Set<string | RegExp>} restrictions restrictions
 * @property {boolean} preferRelative prefer relative
 * @property {boolean} preferAbsolute prefer absolute
 * @property {string | boolean | TsconfigOptions} tsconfig tsconfig file path or config object
 */ /**
 * @param {PnpApi | null=} option option
 * @returns {PnpApi | null} processed option
 */ function processPnpApiOption(option) {
    if (option === undefined && /** @type {NodeJS.ProcessVersions & { pnp: string }} */ versions.pnp) {
        const _findPnpApi = // @ts-expect-error maybe nothing
        __turbopack_context__.r("[externals]/module [external] (module, cjs)").findPnpApi;
        if (_findPnpApi) {
            return {
                resolveToUnqualified (request, issuer, opts) {
                    const pnpapi = _findPnpApi(issuer);
                    if (!pnpapi) {
                        // Issuer isn't managed by PnP
                        return null;
                    }
                    return pnpapi.resolveToUnqualified(request, issuer, opts);
                }
            };
        }
    }
    return option || null;
}
/**
 * @param {AliasOptions | AliasOptionEntry[] | undefined} alias alias
 * @returns {AliasOptionEntry[]} normalized aliases
 */ function normalizeAlias(alias) {
    return typeof alias === "object" && !Array.isArray(alias) && alias !== null ? Object.keys(alias).map((key)=>{
        /** @type {AliasOptionEntry} */ const obj = {
            name: key,
            onlyModule: false,
            alias: alias[key]
        };
        if (/\$$/.test(key)) {
            obj.onlyModule = true;
            obj.name = key.slice(0, -1);
        }
        return obj;
    }) : /** @type {AliasOptionEntry[]} */ alias || [];
}
/**
 * Merging filtered elements
 * @param {string[]} array source array
 * @param {(item: string) => boolean} filter predicate
 * @returns {(string | string[])[]} merge result
 */ function mergeFilteredToArray(array, filter) {
    /** @type {(string | string[])[]} */ const result = [];
    const set = new Set(array);
    for (const item of set){
        if (filter(item)) {
            const lastElement = result.length > 0 ? result[result.length - 1] : undefined;
            if (Array.isArray(lastElement)) {
                lastElement.push(item);
            } else {
                result.push([
                    item
                ]);
            }
        } else {
            result.push(item);
        }
    }
    return result;
}
/**
 * @param {UserResolveOptions} options input options
 * @returns {ResolveOptions} output options
 */ function createOptions(options) {
    const mainFieldsSet = new Set(options.mainFields || [
        "main"
    ]);
    /** @type {ResolveOptions["mainFields"]} */ const mainFields = [];
    for (const item of mainFieldsSet){
        if (typeof item === "string") {
            mainFields.push({
                name: [
                    item
                ],
                forceRelative: true
            });
        } else if (Array.isArray(item)) {
            mainFields.push({
                name: item,
                forceRelative: true
            });
        } else {
            mainFields.push({
                name: Array.isArray(item.name) ? item.name : [
                    item.name
                ],
                forceRelative: item.forceRelative
            });
        }
    }
    return {
        alias: normalizeAlias(options.alias),
        fallback: normalizeAlias(options.fallback),
        aliasFields: new Set(options.aliasFields),
        cachePredicate: options.cachePredicate || function trueFn() {
            return true;
        },
        cacheWithContext: typeof options.cacheWithContext !== "undefined" ? options.cacheWithContext : true,
        exportsFields: new Set(options.exportsFields || [
            "exports"
        ]),
        importsFields: new Set(options.importsFields || [
            "imports"
        ]),
        conditionNames: new Set(options.conditionNames),
        descriptionFiles: [
            ...new Set(options.descriptionFiles || [
                "package.json"
            ])
        ],
        enforceExtension: options.enforceExtension === undefined ? Boolean(options.extensions && options.extensions.includes("")) : options.enforceExtension,
        extensions: new Set(options.extensions || [
            ".js",
            ".json",
            ".node"
        ]),
        extensionAlias: options.extensionAlias ? Object.keys(options.extensionAlias).map((k)=>({
                extension: k,
                alias: /** @type {ExtensionAliasOptions} */ options.extensionAlias[k]
            })) : [],
        extensionAliasForExports: options.extensionAliasForExports || false,
        fileSystem: options.useSyncFileSystemCalls ? new SyncAsyncFileSystemDecorator(options.fileSystem) : options.fileSystem,
        unsafeCache: options.unsafeCache && typeof options.unsafeCache !== "object" ? {} : options.unsafeCache || false,
        symlinks: typeof options.symlinks !== "undefined" ? options.symlinks : true,
        resolver: options.resolver,
        modules: mergeFilteredToArray(Array.isArray(options.modules) ? options.modules : options.modules ? [
            options.modules
        ] : [
            "node_modules"
        ], (item)=>{
            const type = getType(item);
            return type === PathType.Normal || type === PathType.Relative;
        }),
        mainFields,
        mainFiles: new Set(options.mainFiles || [
            "index"
        ]),
        plugins: options.plugins || [],
        pnpApi: processPnpApiOption(options.pnpApi),
        roots: new Set(options.roots || undefined),
        fullySpecified: options.fullySpecified || false,
        resolveToContext: options.resolveToContext || false,
        preferRelative: options.preferRelative || false,
        preferAbsolute: options.preferAbsolute || false,
        restrictions: new Set(options.restrictions),
        tsconfig: typeof options.tsconfig === "undefined" ? false : options.tsconfig
    };
}
/**
 * @param {UserResolveOptions} options resolve options
 * @returns {Resolver} created resolver
 */ module.exports.createResolver = function createResolver(options) {
    const normalizedOptions = createOptions(options);
    const { alias, fallback, aliasFields, extensionAliasForExports, cachePredicate, cacheWithContext, conditionNames, descriptionFiles, enforceExtension, exportsFields, extensionAlias, importsFields, extensions, fileSystem, fullySpecified, mainFields, mainFiles, modules, plugins: userPlugins, pnpApi, resolveToContext, preferRelative, preferAbsolute, symlinks, unsafeCache, resolver: customResolver, restrictions, roots, tsconfig } = normalizedOptions;
    const plugins = [
        ...userPlugins
    ];
    const resolver = customResolver || new Resolver(fileSystem, normalizedOptions);
    // // pipeline ////
    resolver.ensureHook("resolve");
    resolver.ensureHook("internalResolve");
    resolver.ensureHook("newInternalResolve");
    resolver.ensureHook("importsResolve");
    resolver.ensureHook("parsedResolve");
    resolver.ensureHook("describedResolve");
    resolver.ensureHook("rawResolve");
    resolver.ensureHook("normalResolve");
    resolver.ensureHook("internal");
    resolver.ensureHook("rawModule");
    resolver.ensureHook("alternateRawModule");
    resolver.ensureHook("module");
    resolver.ensureHook("resolveAsModule");
    resolver.ensureHook("undescribedResolveInPackage");
    resolver.ensureHook("resolveInPackage");
    resolver.ensureHook("resolveInExistingDirectory");
    resolver.ensureHook("importsFieldRelative");
    if (extensionAliasForExports) {
        resolver.ensureHook("exportsFieldRelative");
    }
    resolver.ensureHook("relative");
    resolver.ensureHook("describedRelative");
    resolver.ensureHook("directory");
    resolver.ensureHook("undescribedExistingDirectory");
    resolver.ensureHook("existingDirectory");
    resolver.ensureHook("undescribedRawFile");
    resolver.ensureHook("rawFile");
    resolver.ensureHook("file");
    resolver.ensureHook("finalFile");
    resolver.ensureHook("existingFile");
    resolver.ensureHook("resolved");
    // TODO remove in next major
    // cspell:word Interal
    // Backward-compat
    // @ts-expect-error
    resolver.hooks.newInteralResolve = resolver.hooks.newInternalResolve;
    // resolve
    for (const { source, resolveOptions } of [
        {
            source: "resolve",
            resolveOptions: {
                fullySpecified
            }
        },
        {
            source: "internal-resolve",
            resolveOptions: {
                fullySpecified: false
            }
        },
        // Entry point for non-relative targets from the imports field.
        // Sets internal: false to prevent re-entering imports resolution,
        // aligning with the Node.js ESM spec where PACKAGE_IMPORTS_RESOLVE
        // does not recursively resolve # specifiers.
        // https://nodejs.org/api/esm.html#resolution-algorithm-specification
        {
            source: "imports-resolve",
            resolveOptions: {
                fullySpecified: false,
                internal: false
            }
        }
    ]){
        plugins.push(new ParsePlugin(source, resolveOptions, "parsed-resolve"));
    }
    // parsed-resolve
    plugins.push(new DescriptionFilePlugin("parsed-resolve", descriptionFiles, false, "described-resolve"));
    plugins.push(new NextPlugin("after-parsed-resolve", "described-resolve"));
    // described-resolve
    if (unsafeCache) {
        plugins.push(new UnsafeCachePlugin("described-resolve", cachePredicate, unsafeCache, cacheWithContext, "raw-resolve"));
    } else {
        plugins.push(new NextPlugin("described-resolve", "raw-resolve"));
    }
    if (fallback.length > 0) {
        plugins.push(new AliasPlugin("described-resolve", fallback, "internal-resolve"));
    }
    // raw-resolve
    if (alias.length > 0) {
        plugins.push(new AliasPlugin("raw-resolve", alias, "internal-resolve"));
    }
    if (tsconfig) {
        plugins.push(new TsconfigPathsPlugin(tsconfig));
    }
    for (const item of aliasFields){
        plugins.push(new AliasFieldPlugin("raw-resolve", item, "internal-resolve"));
    }
    for (const item of extensionAlias){
        plugins.push(new ExtensionAliasPlugin("raw-resolve", item, "normal-resolve"));
    }
    plugins.push(new NextPlugin("raw-resolve", "normal-resolve"));
    // normal-resolve
    if (preferRelative) {
        plugins.push(new JoinRequestPlugin("after-normal-resolve", "relative"));
    }
    plugins.push(new ConditionalPlugin("after-normal-resolve", {
        module: true
    }, "resolve as module", false, "raw-module"));
    plugins.push(new ConditionalPlugin("after-normal-resolve", {
        internal: true
    }, "resolve as internal import", false, "internal"));
    if (preferAbsolute) {
        plugins.push(new JoinRequestPlugin("after-normal-resolve", "relative"));
    }
    if (roots.size > 0) {
        plugins.push(new RootsPlugin("after-normal-resolve", roots, "relative"));
    }
    if (!preferRelative && !preferAbsolute) {
        plugins.push(new JoinRequestPlugin("after-normal-resolve", "relative"));
    }
    // internal
    for (const importsField of importsFields){
        plugins.push(new ImportsFieldPlugin("internal", conditionNames, importsField, "imports-field-relative", "imports-resolve"));
    }
    // imports-field-relative: apply extensionAlias to paths produced by the
    // imports field (TypeScript-style extension substitution for self-package
    // imports like `#foo` -> `./foo.js` -> `./foo.ts`). Unlike the exports
    // field, the imports field is internal to the package, so applying the
    // consumer's extension aliases does not expose files the package author
    // did not intend to export. See issue #413.
    for (const item of extensionAlias){
        plugins.push(new ExtensionAliasPlugin("imports-field-relative", item, "relative"));
    }
    plugins.push(new NextPlugin("imports-field-relative", "relative"));
    // raw-module
    for (const exportsField of exportsFields){
        plugins.push(new SelfReferencePlugin("raw-module", exportsField, "resolve-as-module"));
    }
    for (const item of modules){
        if (Array.isArray(item)) {
            if (item.includes("node_modules") && pnpApi) {
                plugins.push(new ModulesInHierarchicalDirectoriesPlugin("raw-module", item.filter((i)=>i !== "node_modules"), "module"));
                plugins.push(new PnpPlugin("raw-module", pnpApi, "undescribed-resolve-in-package", "alternate-raw-module"));
                plugins.push(new ModulesInHierarchicalDirectoriesPlugin("alternate-raw-module", [
                    "node_modules"
                ], "module"));
            } else {
                plugins.push(new ModulesInHierarchicalDirectoriesPlugin("raw-module", item, "module"));
            }
        } else {
            plugins.push(new ModulesInRootPlugin("raw-module", item, "module"));
        }
    }
    // module
    plugins.push(new JoinRequestPartPlugin("module", "resolve-as-module"));
    // resolve-as-module
    if (!resolveToContext) {
        plugins.push(new ConditionalPlugin("resolve-as-module", {
            directory: false,
            request: "."
        }, "single file module", true, "undescribed-raw-file"));
    }
    plugins.push(new DirectoryExistsPlugin("resolve-as-module", "undescribed-resolve-in-package"));
    // undescribed-resolve-in-package
    plugins.push(new DescriptionFilePlugin("undescribed-resolve-in-package", descriptionFiles, false, "resolve-in-package"));
    plugins.push(new NextPlugin("after-undescribed-resolve-in-package", "resolve-in-package"));
    // resolve-in-package
    const exportsFieldTarget = extensionAliasForExports ? "exports-field-relative" : "relative";
    for (const exportsField of exportsFields){
        plugins.push(new ExportsFieldPlugin("resolve-in-package", conditionNames, exportsField, exportsFieldTarget));
    }
    plugins.push(new NextPlugin("resolve-in-package", "resolve-in-existing-directory"));
    // exports-field-relative (opt-in via `extensionAliasForExports`):
    // apply `extensionAlias` to paths produced by the exports field. This is
    // off by default to match Node.js (which does not substitute extensions on
    // bare-module targets), and on opt-in aligns with TypeScript for packages
    // that ship TS sources alongside the compiled JS they list in `exports`.
    if (extensionAliasForExports) {
        for (const item of extensionAlias){
            plugins.push(new ExtensionAliasPlugin("exports-field-relative", item, "relative"));
        }
        plugins.push(new NextPlugin("exports-field-relative", "relative"));
    }
    // resolve-in-existing-directory
    plugins.push(new JoinRequestPlugin("resolve-in-existing-directory", "relative"));
    // relative
    plugins.push(new DescriptionFilePlugin("relative", descriptionFiles, true, "described-relative"));
    plugins.push(new NextPlugin("after-relative", "described-relative"));
    // described-relative
    if (resolveToContext) {
        plugins.push(new NextPlugin("described-relative", "directory"));
    } else {
        plugins.push(new ConditionalPlugin("described-relative", {
            directory: false
        }, null, true, "raw-file"));
        plugins.push(new ConditionalPlugin("described-relative", {
            fullySpecified: false
        }, "as directory", true, "directory"));
    }
    // directory
    plugins.push(new DirectoryExistsPlugin("directory", "undescribed-existing-directory"));
    if (resolveToContext) {
        // undescribed-existing-directory
        plugins.push(new NextPlugin("undescribed-existing-directory", "resolved"));
    } else {
        // undescribed-existing-directory
        plugins.push(new DescriptionFilePlugin("undescribed-existing-directory", descriptionFiles, false, "existing-directory"));
        for (const item of mainFiles){
            plugins.push(new UseFilePlugin("undescribed-existing-directory", item, "undescribed-raw-file"));
        }
        // described-existing-directory
        for (const item of mainFields){
            plugins.push(new MainFieldPlugin("existing-directory", item, "resolve-in-existing-directory"));
        }
        for (const item of mainFiles){
            plugins.push(new UseFilePlugin("existing-directory", item, "undescribed-raw-file"));
        }
        // undescribed-raw-file
        plugins.push(new DescriptionFilePlugin("undescribed-raw-file", descriptionFiles, true, "raw-file"));
        plugins.push(new NextPlugin("after-undescribed-raw-file", "raw-file"));
        // raw-file
        plugins.push(new ConditionalPlugin("raw-file", {
            fullySpecified: true
        }, null, false, "file"));
        if (!enforceExtension) {
            plugins.push(new TryNextPlugin("raw-file", "no extension", "file"));
        }
        for (const item of extensions){
            plugins.push(new AppendPlugin("raw-file", item, "file"));
        }
        // file
        if (alias.length > 0) {
            plugins.push(new AliasPlugin("file", alias, "internal-resolve"));
        }
        for (const item of aliasFields){
            plugins.push(new AliasFieldPlugin("file", item, "internal-resolve"));
        }
        plugins.push(new NextPlugin("file", "final-file"));
        // final-file
        plugins.push(new FileExistsPlugin("final-file", "existing-file"));
        // existing-file
        if (symlinks) {
            plugins.push(new SymlinkPlugin("existing-file", "existing-file"));
        }
        plugins.push(new NextPlugin("existing-file", "resolved"));
    }
    const { resolved } = resolver.hooks;
    // resolved
    if (restrictions.size > 0) {
        plugins.push(new RestrictionsPlugin(resolved, restrictions));
    }
    plugins.push(new ResultPlugin(resolved));
    // // RESOLVER ////
    for (const plugin of plugins){
        if (typeof plugin === "function") {
            /** @type {(this: Resolver, resolver: Resolver) => void} */ plugin.call(resolver, resolver);
        } else if (plugin) {
            plugin.apply(resolver);
        }
    }
    return resolver;
};
}),
"[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/index.js [postcss] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/ const memoize = __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/util/memoize.js [postcss] (ecmascript)");
/** @typedef {import("./CachedInputFileSystem").BaseFileSystem} BaseFileSystem */ /** @typedef {import("./PnpPlugin").PnpApiImpl} PnpApi */ /** @typedef {import("./Resolver")} Resolver */ /** @typedef {import("./Resolver").Context} Context */ /** @typedef {import("./Resolver").FileSystem} FileSystem */ /** @typedef {import("./Resolver").ResolveCallback} ResolveCallback */ /** @typedef {import("./Resolver").ResolveContext} ResolveContext */ /** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */ /** @typedef {import("./Resolver").SyncFileSystem} SyncFileSystem */ /** @typedef {import("./ResolverFactory").Plugin} Plugin */ /** @typedef {import("./ResolverFactory").UserResolveOptions} ResolveOptions */ /**
 * @typedef {{
 * (context: Context, path: string, request: string, resolveContext: ResolveContext, callback: ResolveCallback): void,
 * (context: Context, path: string, request: string, callback: ResolveCallback): void,
 * (path: string, request: string, resolveContext: ResolveContext, callback: ResolveCallback): void,
 * (path: string, request: string, callback: ResolveCallback): void,
 * }} ResolveFunctionAsync
 */ /**
 * @typedef {{
 * (context: Context, path: string, request: string, resolveContext?: ResolveContext): string | false,
 * (path: string, request: string, resolveContext?: ResolveContext): string | false,
 * }} ResolveFunction
 */ /**
 * @typedef {{
 * (context: Context, path: string, request: string, resolveContext?: ResolveContext): Promise<string | false>,
 * (path: string, request: string, resolveContext?: ResolveContext): Promise<string | false>,
 * }} ResolveFunctionPromise
 */ const getCachedFileSystem = memoize(()=>__turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js [postcss] (ecmascript)"));
const getNodeFileSystem = memoize(()=>{
    const fs = __turbopack_context__.r("[project]/node_modules/.pnpm/graceful-fs@4.2.11/node_modules/graceful-fs/graceful-fs.js [postcss] (ecmascript)");
    const CachedInputFileSystem = getCachedFileSystem();
    return new CachedInputFileSystem(fs, 4000);
});
const getNodeContext = memoize(()=>({
        environments: [
            "node+es3+es5+process+native"
        ]
    }));
const getResolverFactory = memoize(()=>__turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/ResolverFactory.js [postcss] (ecmascript)"));
const getAsyncResolver = memoize(()=>getResolverFactory().createResolver({
        conditionNames: [
            "node"
        ],
        extensions: [
            ".js",
            ".json",
            ".node"
        ],
        fileSystem: getNodeFileSystem()
    }));
/**
 * @type {ResolveFunctionAsync}
 */ const resolve = /**
	 * @param {object | string} context context
	 * @param {string} path path
	 * @param {string | ResolveContext | ResolveCallback} request request
	 * @param {ResolveContext | ResolveCallback=} resolveContext resolve context
	 * @param {ResolveCallback=} callback callback
	 */ (context, path, request, resolveContext, callback)=>{
    if (typeof context === "string") {
        callback = resolveContext;
        resolveContext = request;
        request = path;
        path = context;
        context = getNodeContext();
    }
    if (typeof callback !== "function") {
        callback = resolveContext;
    }
    getAsyncResolver().resolve(context, path, request, resolveContext, callback);
};
const getSyncResolver = memoize(()=>getResolverFactory().createResolver({
        conditionNames: [
            "node"
        ],
        extensions: [
            ".js",
            ".json",
            ".node"
        ],
        useSyncFileSystemCalls: true,
        fileSystem: getNodeFileSystem()
    }));
/**
 * @type {ResolveFunction}
 */ const resolveSync = /**
	 * @param {object | string} context context
	 * @param {string} path path
	 * @param {string | ResolveContext | undefined} request request
	 * @param {ResolveContext=} resolveContext resolve context
	 * @returns {string | false} resolved path
	 */ (context, path, request, resolveContext)=>{
    if (typeof context === "string") {
        resolveContext = request;
        request = path;
        path = context;
        context = getNodeContext();
    }
    return getSyncResolver().resolveSync(context, path, request, resolveContext);
};
/**
 * @type {ResolveFunctionPromise}
 */ const resolvePromise = /**
	 * @param {object | string} context context
	 * @param {string} path path
	 * @param {string | ResolveContext | undefined} request request
	 * @param {ResolveContext=} resolveContext resolve context
	 * @returns {Promise<string | false>} resolved path
	 */ (context, path, request, resolveContext)=>{
    if (typeof context === "string") {
        resolveContext = request;
        request = path;
        path = context;
        context = getNodeContext();
    }
    return getAsyncResolver().resolvePromise(context, path, request, resolveContext);
};
/** @typedef {Omit<ResolveOptions, "fileSystem"> & Partial<Pick<ResolveOptions, "fileSystem">>} ResolveOptionsOptionalFS */ /**
 * @param {ResolveOptionsOptionalFS} options Resolver options
 * @returns {ResolveFunctionAsync} Resolver function
 */ function create(options) {
    const resolver = getResolverFactory().createResolver({
        fileSystem: getNodeFileSystem(),
        ...options
    });
    /**
	 * @param {object | string} context Custom context
	 * @param {string} path Base path
	 * @param {string | ResolveContext | ResolveCallback} request String to resolve
	 * @param {ResolveContext | ResolveCallback=} resolveContext Resolve context
	 * @param {ResolveCallback=} callback Result callback
	 */ return function create(context, path, request, resolveContext, callback) {
        if (typeof context === "string") {
            callback = resolveContext;
            resolveContext = request;
            request = path;
            path = context;
            context = getNodeContext();
        }
        if (typeof callback !== "function") {
            callback = resolveContext;
        }
        resolver.resolve(context, path, request, resolveContext, callback);
    };
}
/**
 * @param {ResolveOptionsOptionalFS} options Resolver options
 * @returns {ResolveFunction} Resolver function
 */ function createSync(options) {
    const resolver = getResolverFactory().createResolver({
        useSyncFileSystemCalls: true,
        fileSystem: getNodeFileSystem(),
        ...options
    });
    /**
	 * @param {object | string} context custom context
	 * @param {string} path base path
	 * @param {string | ResolveContext | undefined} request request to resolve
	 * @param {ResolveContext=} resolveContext Resolve context
	 * @returns {string | false} Resolved path or false
	 */ return function createSync(context, path, request, resolveContext) {
        if (typeof context === "string") {
            resolveContext = request;
            request = path;
            path = context;
            context = getNodeContext();
        }
        return resolver.resolveSync(context, path, request, resolveContext);
    };
}
/**
 * @param {ResolveOptionsOptionalFS} options Resolver options
 * @returns {ResolveFunctionPromise} Resolver function
 */ function createPromise(options) {
    const resolver = getResolverFactory().createResolver({
        fileSystem: getNodeFileSystem(),
        ...options
    });
    /**
	 * @param {object | string} context Custom context
	 * @param {string} path Base path
	 * @param {string | ResolveContext | undefined} request String to resolve
	 * @param {ResolveContext=} resolveContext Resolve context
	 * @returns {Promise<string | false>} resolved path
	 */ return function createPromise(context, path, request, resolveContext) {
        if (typeof context === "string") {
            resolveContext = request;
            request = path;
            path = context;
            context = getNodeContext();
        }
        return resolver.resolvePromise(context, path, request, resolveContext);
    };
}
/**
 * @template A
 * @template B
 * @param {A} obj input a
 * @param {B} exports input b
 * @returns {A & B} merged
 */ const mergeExports = (obj, exports)=>{
    const descriptors = Object.getOwnPropertyDescriptors(exports);
    Object.defineProperties(obj, descriptors);
    return Object.freeze(obj);
};
module.exports = mergeExports(resolve, {
    get sync () {
        return resolveSync;
    },
    get promise () {
        return resolvePromise;
    },
    create: mergeExports(create, {
        get sync () {
            return createSync;
        },
        get promise () {
            return createPromise;
        }
    }),
    get ResolverFactory () {
        return getResolverFactory();
    },
    get CachedInputFileSystem () {
        return getCachedFileSystem();
    },
    get CloneBasenamePlugin () {
        return __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/CloneBasenamePlugin.js [postcss] (ecmascript)");
    },
    get LogInfoPlugin () {
        return __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/LogInfoPlugin.js [postcss] (ecmascript)");
    },
    get TsconfigPathsPlugin () {
        return __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/TsconfigPathsPlugin.js [postcss] (ecmascript)");
    },
    get forEachBail () {
        return __turbopack_context__.r("[project]/node_modules/.pnpm/enhanced-resolve@5.21.0/node_modules/enhanced-resolve/lib/forEachBail.js [postcss] (ecmascript)");
    }
});
}),
];

//# sourceMappingURL=05k__enhanced-resolve_lib_0z7_rzi._.js.map