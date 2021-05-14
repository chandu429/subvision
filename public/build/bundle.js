
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    (function() {
        const env = {};
        try {
            if (process) {
                process.env = Object.assign({}, process.env);
                Object.assign(process.env, env);
                return;
            }
        } catch (e) {} // avoid ReferenceError: process is not defined
        globalThis.process = { env:env };
    })();

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();

    // Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
    // at the end of hydration without touching the remaining nodes.
    let is_hydrating = false;
    const nodes_to_detach = new Set();
    function start_hydrating() {
        is_hydrating = true;
    }
    function end_hydrating() {
        is_hydrating = false;
        for (const node of nodes_to_detach) {
            node.parentNode.removeChild(node);
        }
        nodes_to_detach.clear();
    }
    function append(target, node) {
        if (is_hydrating) {
            nodes_to_detach.delete(node);
        }
        if (node.parentNode !== target) {
            target.appendChild(node);
        }
    }
    function insert(target, node, anchor) {
        if (is_hydrating) {
            nodes_to_detach.delete(node);
        }
        if (node.parentNode !== target || (anchor && node.nextSibling !== anchor)) {
            target.insertBefore(node, anchor || null);
        }
    }
    function detach(node) {
        if (is_hydrating) {
            nodes_to_detach.add(node);
        }
        else if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                start_hydrating();
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            end_hydrating();
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction$1 = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join$1(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction$1(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join$1(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join$1(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join$1(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join$1(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation$1(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation$1(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation$1(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation$1(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query$1(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query$1(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query$1("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    const file$g = "node_modules/svelte-navigator/src/Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$7(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$g, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$g, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[19], dirty, null, null);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$h($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $prevLocation;
    	let $activeRoute;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, "announcementText");
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, "routes");
    	component_subscribe($$self, routes, value => $$invalidate(16, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(18, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, "prevLocation");
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, "Only top-level Routers can have a \"basepath\" prop. It is ignored.", { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ["basepath", "url", "history", "primary", "a11y"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(11, url = $$props.url);
    		if ("history" in $$props) $$invalidate(12, history = $$props.history);
    		if ("primary" in $$props) $$invalidate(13, primary = $$props.primary);
    		if ("a11y" in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ("$$scope" in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$prevLocation,
    		$activeRoute,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ("basepath" in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(11, url = $$props.url);
    		if ("history" in $$props) $$invalidate(12, history = $$props.history);
    		if ("primary" in $$props) $$invalidate(13, primary = $$props.primary);
    		if ("a11y" in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, "You cannot change the \"basepath\" prop. It is ignored.");
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 98304) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 262144) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$routes,
    		$prevLocation,
    		$activeRoute,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$h,
    			create_fragment$h,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /**
     * Access the parent Routes matched params and wildcards
     * @returns {import("svelte/store").Readable<{
         [param: string]: any;
       }>} A readable store containing the matched parameters and wildcards
     *
     * @example
      ```html
      <!--
        Somewhere inside <Route path="user/:id/*splat" />
        with a current url of "/myApp/user/123/pauls-profile"
      -->
      <script>
        import { useParams } from "svelte-navigator";

        const params = useParams();

        $: console.log($params); // -> { id: "123", splat: "pauls-profile" }
      </script>

      <h3>Welcome user {$params.id}! bleep bloop...</h3>
      ```
     */
    function useParams() {
    	usePreflightCheck(USE_PARAMS_ID, null, ROUTE, ROUTE_ID);
    	return toReadonly(ROUTE_PARAMS);
    }

    const file$f = "node_modules/svelte-navigator/src/Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 4
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[2],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$6(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264213) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262164)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[18], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[2] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3604)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 4 && { location: /*$location*/ ctx[2] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[3] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$f, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$f, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$g($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $parentBase;
    	let $location;
    	let $activeRoute;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Route", slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, "parentBase");
    	component_subscribe($$self, parentBase, value => $$invalidate(15, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(2, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, "params");
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("path" in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("meta" in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ("primary" in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ("$$scope" in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join: join$1,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		$parentBase,
    		$location,
    		isActive,
    		$activeRoute,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ("path" in $$props) $$invalidate(12, path = $$new_props.path);
    		if ("component" in $$props) $$invalidate(0, component = $$new_props.component);
    		if ("meta" in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ("primary" in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ("ssrMatch" in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ("isActive" in $$props) $$invalidate(3, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 45062) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join$1($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 81920) {
    			$$invalidate(3, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 81928) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		$location,
    		isActive,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$parentBase,
    		$activeRoute,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const file$e = "node_modules/svelte-navigator/src/Link.svelte";

    function create_fragment$f(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[1], /*props*/ ctx[2]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$e, 63, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 2 && /*ariaCurrent*/ ctx[1],
    				dirty & /*props*/ 4 && /*props*/ ctx[2]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Link", slots, ['default']);
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(9, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(17, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(18, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("to" in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ("replace" in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ("state" in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ("getProps" in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction: isFunction$1,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		$location,
    		isPartiallyCurrent,
    		isCurrent,
    		ariaCurrent,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(17, $$props = assign(assign({}, $$props), $$new_props));
    		if ("to" in $$props) $$invalidate(5, to = $$new_props.to);
    		if ("replace" in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ("state" in $$props) $$invalidate(7, state = $$new_props.state);
    		if ("getProps" in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("isPartiallyCurrent" in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ("isCurrent" in $$props) $$invalidate(11, isCurrent = $$new_props.isCurrent);
    		if ("ariaCurrent" in $$props) $$invalidate(1, ariaCurrent = $$new_props.ariaCurrent);
    		if ("props" in $$props) $$invalidate(2, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 544) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 513) {
    			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 513) {
    			$$invalidate(11, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 2048) {
    			$$invalidate(1, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(2, props = (() => {
    			if (isFunction$1(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		ariaCurrent,
    		props,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		$location,
    		isPartiallyCurrent,
    		isCurrent,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !("to" in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const file$d = "src/MobileMenu.svelte";

    // (5:2) <Link to="/" class="flex mr-auto">
    function create_default_slot$4(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "alt", "Subvisio");
    			attr_dev(img, "class", "w-6");
    			if (img.src !== (img_src_value = "/logo.svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$d, 5, 4, 141);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(5:2) <Link to=\\\"/\\\" class=\\\"flex mr-auto\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div0;
    	let link;
    	let t0;
    	let a0;
    	let i0;
    	let t1;
    	let ul16;
    	let li2;
    	let a1;
    	let div1;
    	let i1;
    	let t2;
    	let div2;
    	let t3;
    	let i2;
    	let t4;
    	let ul0;
    	let li0;
    	let a2;
    	let div3;
    	let i3;
    	let t5;
    	let div4;
    	let t7;
    	let li1;
    	let a3;
    	let div5;
    	let i4;
    	let t8;
    	let div6;
    	let t10;
    	let li6;
    	let a4;
    	let div7;
    	let i5;
    	let t11;
    	let div8;
    	let t12;
    	let i6;
    	let t13;
    	let ul1;
    	let li3;
    	let a5;
    	let div9;
    	let i7;
    	let t14;
    	let div10;
    	let t16;
    	let li4;
    	let a6;
    	let div11;
    	let i8;
    	let t17;
    	let div12;
    	let t19;
    	let li5;
    	let a7;
    	let div13;
    	let i9;
    	let t20;
    	let div14;
    	let t22;
    	let li7;
    	let a8;
    	let div15;
    	let i10;
    	let t23;
    	let div16;
    	let t25;
    	let li8;
    	let a9;
    	let div17;
    	let i11;
    	let t26;
    	let div18;
    	let t28;
    	let li9;
    	let a10;
    	let div19;
    	let i12;
    	let t29;
    	let div20;
    	let t31;
    	let li10;
    	let a11;
    	let div21;
    	let i13;
    	let t32;
    	let div22;
    	let t34;
    	let li11;
    	let a12;
    	let div23;
    	let i14;
    	let t35;
    	let div24;
    	let t37;
    	let li12;
    	let a13;
    	let div25;
    	let i15;
    	let t38;
    	let div26;
    	let t40;
    	let li13;
    	let t41;
    	let li16;
    	let a14;
    	let div27;
    	let i16;
    	let t42;
    	let div28;
    	let t43;
    	let i17;
    	let t44;
    	let ul2;
    	let li14;
    	let a15;
    	let div29;
    	let i18;
    	let t45;
    	let div30;
    	let t47;
    	let li15;
    	let a16;
    	let div31;
    	let i19;
    	let t48;
    	let div32;
    	let t50;
    	let li20;
    	let a17;
    	let div33;
    	let i20;
    	let t51;
    	let div34;
    	let t52;
    	let i21;
    	let t53;
    	let ul3;
    	let li17;
    	let a18;
    	let div35;
    	let i22;
    	let t54;
    	let div36;
    	let t56;
    	let li18;
    	let a19;
    	let div37;
    	let i23;
    	let t57;
    	let div38;
    	let t59;
    	let li19;
    	let a20;
    	let div39;
    	let i24;
    	let t60;
    	let div40;
    	let t62;
    	let li24;
    	let a21;
    	let div41;
    	let i25;
    	let t63;
    	let div42;
    	let t64;
    	let i26;
    	let t65;
    	let ul4;
    	let li21;
    	let a22;
    	let div43;
    	let i27;
    	let t66;
    	let div44;
    	let t68;
    	let li22;
    	let a23;
    	let div45;
    	let i28;
    	let t69;
    	let div46;
    	let t71;
    	let li23;
    	let a24;
    	let div47;
    	let i29;
    	let t72;
    	let div48;
    	let t74;
    	let li48;
    	let a25;
    	let div49;
    	let i30;
    	let t75;
    	let div50;
    	let t76;
    	let i31;
    	let t77;
    	let ul10;
    	let li28;
    	let a26;
    	let div51;
    	let i32;
    	let t78;
    	let div52;
    	let t79;
    	let i33;
    	let t80;
    	let ul5;
    	let li25;
    	let a27;
    	let div53;
    	let i34;
    	let t81;
    	let div54;
    	let t83;
    	let li26;
    	let a28;
    	let div55;
    	let i35;
    	let t84;
    	let div56;
    	let t86;
    	let li27;
    	let a29;
    	let div57;
    	let i36;
    	let t87;
    	let div58;
    	let t89;
    	let li32;
    	let a30;
    	let div59;
    	let i37;
    	let t90;
    	let div60;
    	let t91;
    	let i38;
    	let t92;
    	let ul6;
    	let li29;
    	let a31;
    	let div61;
    	let i39;
    	let t93;
    	let div62;
    	let t95;
    	let li30;
    	let a32;
    	let div63;
    	let i40;
    	let t96;
    	let div64;
    	let t98;
    	let li31;
    	let a33;
    	let div65;
    	let i41;
    	let t99;
    	let div66;
    	let t101;
    	let li35;
    	let a34;
    	let div67;
    	let i42;
    	let t102;
    	let div68;
    	let t103;
    	let i43;
    	let t104;
    	let ul7;
    	let li33;
    	let a35;
    	let div69;
    	let i44;
    	let t105;
    	let div70;
    	let t107;
    	let li34;
    	let a36;
    	let div71;
    	let i45;
    	let t108;
    	let div72;
    	let t110;
    	let li38;
    	let a37;
    	let div73;
    	let i46;
    	let t111;
    	let div74;
    	let t112;
    	let i47;
    	let t113;
    	let ul8;
    	let li36;
    	let a38;
    	let div75;
    	let i48;
    	let t114;
    	let div76;
    	let t116;
    	let li37;
    	let a39;
    	let div77;
    	let i49;
    	let t117;
    	let div78;
    	let t119;
    	let li42;
    	let a40;
    	let div79;
    	let i50;
    	let t120;
    	let div80;
    	let t121;
    	let i51;
    	let t122;
    	let ul9;
    	let li39;
    	let a41;
    	let div81;
    	let i52;
    	let t123;
    	let div82;
    	let t125;
    	let li40;
    	let a42;
    	let div83;
    	let i53;
    	let t126;
    	let div84;
    	let t128;
    	let li41;
    	let a43;
    	let div85;
    	let i54;
    	let t129;
    	let div86;
    	let t131;
    	let li43;
    	let a44;
    	let div87;
    	let i55;
    	let t132;
    	let div88;
    	let t134;
    	let li44;
    	let a45;
    	let div89;
    	let i56;
    	let t135;
    	let div90;
    	let t137;
    	let li45;
    	let a46;
    	let div91;
    	let i57;
    	let t138;
    	let div92;
    	let t140;
    	let li46;
    	let a47;
    	let div93;
    	let i58;
    	let t141;
    	let div94;
    	let t143;
    	let li47;
    	let a48;
    	let div95;
    	let i59;
    	let t144;
    	let div96;
    	let t146;
    	let li49;
    	let t147;
    	let li66;
    	let a49;
    	let div97;
    	let i60;
    	let t148;
    	let div98;
    	let t149;
    	let i61;
    	let t150;
    	let ul13;
    	let li52;
    	let a50;
    	let div99;
    	let i62;
    	let t151;
    	let div100;
    	let t152;
    	let i63;
    	let t153;
    	let ul11;
    	let li50;
    	let a51;
    	let div101;
    	let i64;
    	let t154;
    	let div102;
    	let t156;
    	let li51;
    	let a52;
    	let div103;
    	let i65;
    	let t157;
    	let div104;
    	let t159;
    	let li56;
    	let a53;
    	let div105;
    	let i66;
    	let t160;
    	let div106;
    	let t161;
    	let i67;
    	let t162;
    	let ul12;
    	let li53;
    	let a54;
    	let div107;
    	let i68;
    	let t163;
    	let div108;
    	let t165;
    	let li54;
    	let a55;
    	let div109;
    	let i69;
    	let t166;
    	let div110;
    	let t168;
    	let li55;
    	let a56;
    	let div111;
    	let i70;
    	let t169;
    	let div112;
    	let t171;
    	let li57;
    	let a57;
    	let div113;
    	let i71;
    	let t172;
    	let div114;
    	let t174;
    	let li58;
    	let a58;
    	let div115;
    	let i72;
    	let t175;
    	let div116;
    	let t177;
    	let li59;
    	let a59;
    	let div117;
    	let i73;
    	let t178;
    	let div118;
    	let t180;
    	let li60;
    	let a60;
    	let div119;
    	let i74;
    	let t181;
    	let div120;
    	let t183;
    	let li61;
    	let a61;
    	let div121;
    	let i75;
    	let t184;
    	let div122;
    	let t186;
    	let li62;
    	let a62;
    	let div123;
    	let i76;
    	let t187;
    	let div124;
    	let t189;
    	let li63;
    	let a63;
    	let div125;
    	let i77;
    	let t190;
    	let div126;
    	let t192;
    	let li64;
    	let a64;
    	let div127;
    	let i78;
    	let t193;
    	let div128;
    	let t195;
    	let li65;
    	let a65;
    	let div129;
    	let i79;
    	let t196;
    	let div130;
    	let t198;
    	let li73;
    	let a66;
    	let div131;
    	let i80;
    	let t199;
    	let div132;
    	let t200;
    	let i81;
    	let t201;
    	let ul14;
    	let li67;
    	let a67;
    	let div133;
    	let i82;
    	let t202;
    	let div134;
    	let t204;
    	let li68;
    	let a68;
    	let div135;
    	let i83;
    	let t205;
    	let div136;
    	let t207;
    	let li69;
    	let a69;
    	let div137;
    	let i84;
    	let t208;
    	let div138;
    	let t210;
    	let li70;
    	let a70;
    	let div139;
    	let i85;
    	let t211;
    	let div140;
    	let t213;
    	let li71;
    	let a71;
    	let div141;
    	let i86;
    	let t214;
    	let div142;
    	let t216;
    	let li72;
    	let a72;
    	let div143;
    	let i87;
    	let t217;
    	let div144;
    	let t219;
    	let li77;
    	let a73;
    	let div145;
    	let i88;
    	let t220;
    	let div146;
    	let t221;
    	let i89;
    	let t222;
    	let ul15;
    	let li74;
    	let a74;
    	let div147;
    	let i90;
    	let t223;
    	let div148;
    	let t225;
    	let li75;
    	let a75;
    	let div149;
    	let i91;
    	let t226;
    	let div150;
    	let t228;
    	let li76;
    	let a76;
    	let div151;
    	let i92;
    	let t229;
    	let div152;
    	let current;

    	link = new Link({
    			props: {
    				to: "/",
    				class: "flex mr-auto",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(link.$$.fragment);
    			t0 = space();
    			a0 = element("a");
    			i0 = element("i");
    			t1 = space();
    			ul16 = element("ul");
    			li2 = element("li");
    			a1 = element("a");
    			div1 = element("div");
    			i1 = element("i");
    			t2 = space();
    			div2 = element("div");
    			t3 = text("Dashboard ");
    			i2 = element("i");
    			t4 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			a2 = element("a");
    			div3 = element("div");
    			i3 = element("i");
    			t5 = space();
    			div4 = element("div");
    			div4.textContent = "Auction/Lease";
    			t7 = space();
    			li1 = element("li");
    			a3 = element("a");
    			div5 = element("div");
    			i4 = element("i");
    			t8 = space();
    			div6 = element("div");
    			div6.textContent = "Crowdloan History";
    			t10 = space();
    			li6 = element("li");
    			a4 = element("a");
    			div7 = element("div");
    			i5 = element("i");
    			t11 = space();
    			div8 = element("div");
    			t12 = text("Menu Layout ");
    			i6 = element("i");
    			t13 = space();
    			ul1 = element("ul");
    			li3 = element("li");
    			a5 = element("a");
    			div9 = element("div");
    			i7 = element("i");
    			t14 = space();
    			div10 = element("div");
    			div10.textContent = "Side Menu";
    			t16 = space();
    			li4 = element("li");
    			a6 = element("a");
    			div11 = element("div");
    			i8 = element("i");
    			t17 = space();
    			div12 = element("div");
    			div12.textContent = "Simple Menu";
    			t19 = space();
    			li5 = element("li");
    			a7 = element("a");
    			div13 = element("div");
    			i9 = element("i");
    			t20 = space();
    			div14 = element("div");
    			div14.textContent = "Top Menu";
    			t22 = space();
    			li7 = element("li");
    			a8 = element("a");
    			div15 = element("div");
    			i10 = element("i");
    			t23 = space();
    			div16 = element("div");
    			div16.textContent = "Inbox";
    			t25 = space();
    			li8 = element("li");
    			a9 = element("a");
    			div17 = element("div");
    			i11 = element("i");
    			t26 = space();
    			div18 = element("div");
    			div18.textContent = "File Manager";
    			t28 = space();
    			li9 = element("li");
    			a10 = element("a");
    			div19 = element("div");
    			i12 = element("i");
    			t29 = space();
    			div20 = element("div");
    			div20.textContent = "Point of Sale";
    			t31 = space();
    			li10 = element("li");
    			a11 = element("a");
    			div21 = element("div");
    			i13 = element("i");
    			t32 = space();
    			div22 = element("div");
    			div22.textContent = "Chat";
    			t34 = space();
    			li11 = element("li");
    			a12 = element("a");
    			div23 = element("div");
    			i14 = element("i");
    			t35 = space();
    			div24 = element("div");
    			div24.textContent = "Post";
    			t37 = space();
    			li12 = element("li");
    			a13 = element("a");
    			div25 = element("div");
    			i15 = element("i");
    			t38 = space();
    			div26 = element("div");
    			div26.textContent = "Calendar";
    			t40 = space();
    			li13 = element("li");
    			t41 = space();
    			li16 = element("li");
    			a14 = element("a");
    			div27 = element("div");
    			i16 = element("i");
    			t42 = space();
    			div28 = element("div");
    			t43 = text("Crud ");
    			i17 = element("i");
    			t44 = space();
    			ul2 = element("ul");
    			li14 = element("li");
    			a15 = element("a");
    			div29 = element("div");
    			i18 = element("i");
    			t45 = space();
    			div30 = element("div");
    			div30.textContent = "Data List";
    			t47 = space();
    			li15 = element("li");
    			a16 = element("a");
    			div31 = element("div");
    			i19 = element("i");
    			t48 = space();
    			div32 = element("div");
    			div32.textContent = "Form";
    			t50 = space();
    			li20 = element("li");
    			a17 = element("a");
    			div33 = element("div");
    			i20 = element("i");
    			t51 = space();
    			div34 = element("div");
    			t52 = text("Users ");
    			i21 = element("i");
    			t53 = space();
    			ul3 = element("ul");
    			li17 = element("li");
    			a18 = element("a");
    			div35 = element("div");
    			i22 = element("i");
    			t54 = space();
    			div36 = element("div");
    			div36.textContent = "Layout 1";
    			t56 = space();
    			li18 = element("li");
    			a19 = element("a");
    			div37 = element("div");
    			i23 = element("i");
    			t57 = space();
    			div38 = element("div");
    			div38.textContent = "Layout 2";
    			t59 = space();
    			li19 = element("li");
    			a20 = element("a");
    			div39 = element("div");
    			i24 = element("i");
    			t60 = space();
    			div40 = element("div");
    			div40.textContent = "Layout 3";
    			t62 = space();
    			li24 = element("li");
    			a21 = element("a");
    			div41 = element("div");
    			i25 = element("i");
    			t63 = space();
    			div42 = element("div");
    			t64 = text("Profile ");
    			i26 = element("i");
    			t65 = space();
    			ul4 = element("ul");
    			li21 = element("li");
    			a22 = element("a");
    			div43 = element("div");
    			i27 = element("i");
    			t66 = space();
    			div44 = element("div");
    			div44.textContent = "Overview 1";
    			t68 = space();
    			li22 = element("li");
    			a23 = element("a");
    			div45 = element("div");
    			i28 = element("i");
    			t69 = space();
    			div46 = element("div");
    			div46.textContent = "Overview 2";
    			t71 = space();
    			li23 = element("li");
    			a24 = element("a");
    			div47 = element("div");
    			i29 = element("i");
    			t72 = space();
    			div48 = element("div");
    			div48.textContent = "Overview 3";
    			t74 = space();
    			li48 = element("li");
    			a25 = element("a");
    			div49 = element("div");
    			i30 = element("i");
    			t75 = space();
    			div50 = element("div");
    			t76 = text("Pages ");
    			i31 = element("i");
    			t77 = space();
    			ul10 = element("ul");
    			li28 = element("li");
    			a26 = element("a");
    			div51 = element("div");
    			i32 = element("i");
    			t78 = space();
    			div52 = element("div");
    			t79 = text("Wizards ");
    			i33 = element("i");
    			t80 = space();
    			ul5 = element("ul");
    			li25 = element("li");
    			a27 = element("a");
    			div53 = element("div");
    			i34 = element("i");
    			t81 = space();
    			div54 = element("div");
    			div54.textContent = "Layout 1";
    			t83 = space();
    			li26 = element("li");
    			a28 = element("a");
    			div55 = element("div");
    			i35 = element("i");
    			t84 = space();
    			div56 = element("div");
    			div56.textContent = "Layout 2";
    			t86 = space();
    			li27 = element("li");
    			a29 = element("a");
    			div57 = element("div");
    			i36 = element("i");
    			t87 = space();
    			div58 = element("div");
    			div58.textContent = "Layout 3";
    			t89 = space();
    			li32 = element("li");
    			a30 = element("a");
    			div59 = element("div");
    			i37 = element("i");
    			t90 = space();
    			div60 = element("div");
    			t91 = text("Blog ");
    			i38 = element("i");
    			t92 = space();
    			ul6 = element("ul");
    			li29 = element("li");
    			a31 = element("a");
    			div61 = element("div");
    			i39 = element("i");
    			t93 = space();
    			div62 = element("div");
    			div62.textContent = "Layout 1";
    			t95 = space();
    			li30 = element("li");
    			a32 = element("a");
    			div63 = element("div");
    			i40 = element("i");
    			t96 = space();
    			div64 = element("div");
    			div64.textContent = "Layout 2";
    			t98 = space();
    			li31 = element("li");
    			a33 = element("a");
    			div65 = element("div");
    			i41 = element("i");
    			t99 = space();
    			div66 = element("div");
    			div66.textContent = "Layout 3";
    			t101 = space();
    			li35 = element("li");
    			a34 = element("a");
    			div67 = element("div");
    			i42 = element("i");
    			t102 = space();
    			div68 = element("div");
    			t103 = text("Pricing ");
    			i43 = element("i");
    			t104 = space();
    			ul7 = element("ul");
    			li33 = element("li");
    			a35 = element("a");
    			div69 = element("div");
    			i44 = element("i");
    			t105 = space();
    			div70 = element("div");
    			div70.textContent = "Layout 1";
    			t107 = space();
    			li34 = element("li");
    			a36 = element("a");
    			div71 = element("div");
    			i45 = element("i");
    			t108 = space();
    			div72 = element("div");
    			div72.textContent = "Layout 2";
    			t110 = space();
    			li38 = element("li");
    			a37 = element("a");
    			div73 = element("div");
    			i46 = element("i");
    			t111 = space();
    			div74 = element("div");
    			t112 = text("Invoice ");
    			i47 = element("i");
    			t113 = space();
    			ul8 = element("ul");
    			li36 = element("li");
    			a38 = element("a");
    			div75 = element("div");
    			i48 = element("i");
    			t114 = space();
    			div76 = element("div");
    			div76.textContent = "Layout 1";
    			t116 = space();
    			li37 = element("li");
    			a39 = element("a");
    			div77 = element("div");
    			i49 = element("i");
    			t117 = space();
    			div78 = element("div");
    			div78.textContent = "Layout 2";
    			t119 = space();
    			li42 = element("li");
    			a40 = element("a");
    			div79 = element("div");
    			i50 = element("i");
    			t120 = space();
    			div80 = element("div");
    			t121 = text("FAQ ");
    			i51 = element("i");
    			t122 = space();
    			ul9 = element("ul");
    			li39 = element("li");
    			a41 = element("a");
    			div81 = element("div");
    			i52 = element("i");
    			t123 = space();
    			div82 = element("div");
    			div82.textContent = "Layout 1";
    			t125 = space();
    			li40 = element("li");
    			a42 = element("a");
    			div83 = element("div");
    			i53 = element("i");
    			t126 = space();
    			div84 = element("div");
    			div84.textContent = "Layout 2";
    			t128 = space();
    			li41 = element("li");
    			a43 = element("a");
    			div85 = element("div");
    			i54 = element("i");
    			t129 = space();
    			div86 = element("div");
    			div86.textContent = "Layout 3";
    			t131 = space();
    			li43 = element("li");
    			a44 = element("a");
    			div87 = element("div");
    			i55 = element("i");
    			t132 = space();
    			div88 = element("div");
    			div88.textContent = "Login";
    			t134 = space();
    			li44 = element("li");
    			a45 = element("a");
    			div89 = element("div");
    			i56 = element("i");
    			t135 = space();
    			div90 = element("div");
    			div90.textContent = "Register";
    			t137 = space();
    			li45 = element("li");
    			a46 = element("a");
    			div91 = element("div");
    			i57 = element("i");
    			t138 = space();
    			div92 = element("div");
    			div92.textContent = "Error Page";
    			t140 = space();
    			li46 = element("li");
    			a47 = element("a");
    			div93 = element("div");
    			i58 = element("i");
    			t141 = space();
    			div94 = element("div");
    			div94.textContent = "Update profile";
    			t143 = space();
    			li47 = element("li");
    			a48 = element("a");
    			div95 = element("div");
    			i59 = element("i");
    			t144 = space();
    			div96 = element("div");
    			div96.textContent = "Change Password";
    			t146 = space();
    			li49 = element("li");
    			t147 = space();
    			li66 = element("li");
    			a49 = element("a");
    			div97 = element("div");
    			i60 = element("i");
    			t148 = space();
    			div98 = element("div");
    			t149 = text("Components ");
    			i61 = element("i");
    			t150 = space();
    			ul13 = element("ul");
    			li52 = element("li");
    			a50 = element("a");
    			div99 = element("div");
    			i62 = element("i");
    			t151 = space();
    			div100 = element("div");
    			t152 = text("Table ");
    			i63 = element("i");
    			t153 = space();
    			ul11 = element("ul");
    			li50 = element("li");
    			a51 = element("a");
    			div101 = element("div");
    			i64 = element("i");
    			t154 = space();
    			div102 = element("div");
    			div102.textContent = "Regular Table";
    			t156 = space();
    			li51 = element("li");
    			a52 = element("a");
    			div103 = element("div");
    			i65 = element("i");
    			t157 = space();
    			div104 = element("div");
    			div104.textContent = "Tabulator";
    			t159 = space();
    			li56 = element("li");
    			a53 = element("a");
    			div105 = element("div");
    			i66 = element("i");
    			t160 = space();
    			div106 = element("div");
    			t161 = text("Overlay ");
    			i67 = element("i");
    			t162 = space();
    			ul12 = element("ul");
    			li53 = element("li");
    			a54 = element("a");
    			div107 = element("div");
    			i68 = element("i");
    			t163 = space();
    			div108 = element("div");
    			div108.textContent = "Modal";
    			t165 = space();
    			li54 = element("li");
    			a55 = element("a");
    			div109 = element("div");
    			i69 = element("i");
    			t166 = space();
    			div110 = element("div");
    			div110.textContent = "Slide Over";
    			t168 = space();
    			li55 = element("li");
    			a56 = element("a");
    			div111 = element("div");
    			i70 = element("i");
    			t169 = space();
    			div112 = element("div");
    			div112.textContent = "Notification";
    			t171 = space();
    			li57 = element("li");
    			a57 = element("a");
    			div113 = element("div");
    			i71 = element("i");
    			t172 = space();
    			div114 = element("div");
    			div114.textContent = "Accordion";
    			t174 = space();
    			li58 = element("li");
    			a58 = element("a");
    			div115 = element("div");
    			i72 = element("i");
    			t175 = space();
    			div116 = element("div");
    			div116.textContent = "Button";
    			t177 = space();
    			li59 = element("li");
    			a59 = element("a");
    			div117 = element("div");
    			i73 = element("i");
    			t178 = space();
    			div118 = element("div");
    			div118.textContent = "Alert";
    			t180 = space();
    			li60 = element("li");
    			a60 = element("a");
    			div119 = element("div");
    			i74 = element("i");
    			t181 = space();
    			div120 = element("div");
    			div120.textContent = "Progress Bar";
    			t183 = space();
    			li61 = element("li");
    			a61 = element("a");
    			div121 = element("div");
    			i75 = element("i");
    			t184 = space();
    			div122 = element("div");
    			div122.textContent = "Tooltip";
    			t186 = space();
    			li62 = element("li");
    			a62 = element("a");
    			div123 = element("div");
    			i76 = element("i");
    			t187 = space();
    			div124 = element("div");
    			div124.textContent = "Dropdown";
    			t189 = space();
    			li63 = element("li");
    			a63 = element("a");
    			div125 = element("div");
    			i77 = element("i");
    			t190 = space();
    			div126 = element("div");
    			div126.textContent = "Typography";
    			t192 = space();
    			li64 = element("li");
    			a64 = element("a");
    			div127 = element("div");
    			i78 = element("i");
    			t193 = space();
    			div128 = element("div");
    			div128.textContent = "Icon";
    			t195 = space();
    			li65 = element("li");
    			a65 = element("a");
    			div129 = element("div");
    			i79 = element("i");
    			t196 = space();
    			div130 = element("div");
    			div130.textContent = "Loading Icon";
    			t198 = space();
    			li73 = element("li");
    			a66 = element("a");
    			div131 = element("div");
    			i80 = element("i");
    			t199 = space();
    			div132 = element("div");
    			t200 = text("Forms ");
    			i81 = element("i");
    			t201 = space();
    			ul14 = element("ul");
    			li67 = element("li");
    			a67 = element("a");
    			div133 = element("div");
    			i82 = element("i");
    			t202 = space();
    			div134 = element("div");
    			div134.textContent = "Regular Form";
    			t204 = space();
    			li68 = element("li");
    			a68 = element("a");
    			div135 = element("div");
    			i83 = element("i");
    			t205 = space();
    			div136 = element("div");
    			div136.textContent = "Datepicker";
    			t207 = space();
    			li69 = element("li");
    			a69 = element("a");
    			div137 = element("div");
    			i84 = element("i");
    			t208 = space();
    			div138 = element("div");
    			div138.textContent = "Tail Select";
    			t210 = space();
    			li70 = element("li");
    			a70 = element("a");
    			div139 = element("div");
    			i85 = element("i");
    			t211 = space();
    			div140 = element("div");
    			div140.textContent = "File Upload";
    			t213 = space();
    			li71 = element("li");
    			a71 = element("a");
    			div141 = element("div");
    			i86 = element("i");
    			t214 = space();
    			div142 = element("div");
    			div142.textContent = "Wysiwyg Editor";
    			t216 = space();
    			li72 = element("li");
    			a72 = element("a");
    			div143 = element("div");
    			i87 = element("i");
    			t217 = space();
    			div144 = element("div");
    			div144.textContent = "Validation";
    			t219 = space();
    			li77 = element("li");
    			a73 = element("a");
    			div145 = element("div");
    			i88 = element("i");
    			t220 = space();
    			div146 = element("div");
    			t221 = text("Widgets ");
    			i89 = element("i");
    			t222 = space();
    			ul15 = element("ul");
    			li74 = element("li");
    			a74 = element("a");
    			div147 = element("div");
    			i90 = element("i");
    			t223 = space();
    			div148 = element("div");
    			div148.textContent = "Chart";
    			t225 = space();
    			li75 = element("li");
    			a75 = element("a");
    			div149 = element("div");
    			i91 = element("i");
    			t226 = space();
    			div150 = element("div");
    			div150.textContent = "Slider";
    			t228 = space();
    			li76 = element("li");
    			a76 = element("a");
    			div151 = element("div");
    			i92 = element("i");
    			t229 = space();
    			div152 = element("div");
    			div152.textContent = "Image Zoom";
    			attr_dev(i0, "data-feather", "bar-chart-2");
    			attr_dev(i0, "class", "w-8 h-8 text-white transform -rotate-90");
    			add_location(i0, file$d, 8, 4, 247);
    			attr_dev(a0, "href", "/#");
    			attr_dev(a0, "id", "mobile-menu-toggler");
    			add_location(a0, file$d, 7, 2, 204);
    			attr_dev(div0, "class", "mobile-menu-bar");
    			add_location(div0, file$d, 3, 0, 70);
    			attr_dev(i1, "data-feather", "home");
    			add_location(i1, file$d, 14, 30, 460);
    			attr_dev(div1, "class", "menu__icon");
    			add_location(div1, file$d, 14, 6, 436);
    			attr_dev(i2, "data-feather", "chevron-down");
    			attr_dev(i2, "class", "menu__sub-icon");
    			add_location(i2, file$d, 15, 41, 533);
    			attr_dev(div2, "class", "menu__title");
    			add_location(div2, file$d, 15, 6, 498);
    			attr_dev(a1, "href", "/#");
    			attr_dev(a1, "class", "menu");
    			add_location(a1, file$d, 13, 4, 403);
    			attr_dev(i3, "data-feather", "activity");
    			add_location(i3, file$d, 20, 34, 725);
    			attr_dev(div3, "class", "menu__icon");
    			add_location(div3, file$d, 20, 10, 701);
    			attr_dev(div4, "class", "menu__title");
    			add_location(div4, file$d, 21, 10, 771);
    			attr_dev(a2, "href", "index.html");
    			attr_dev(a2, "class", "menu");
    			add_location(a2, file$d, 19, 8, 656);
    			add_location(li0, file$d, 18, 6, 643);
    			attr_dev(i4, "data-feather", "activity");
    			add_location(i4, file$d, 26, 34, 960);
    			attr_dev(div5, "class", "menu__icon");
    			add_location(div5, file$d, 26, 10, 936);
    			attr_dev(div6, "class", "menu__title");
    			add_location(div6, file$d, 27, 10, 1006);
    			attr_dev(a3, "href", "side-menu-light-dashboard-overview-2.html");
    			attr_dev(a3, "class", "menu");
    			add_location(a3, file$d, 25, 8, 860);
    			add_location(li1, file$d, 24, 6, 847);
    			attr_dev(ul0, "class", "menu__sub-open");
    			add_location(ul0, file$d, 17, 4, 609);
    			add_location(li2, file$d, 12, 2, 394);
    			attr_dev(i5, "data-feather", "box");
    			add_location(i5, file$d, 34, 30, 1179);
    			attr_dev(div7, "class", "menu__icon");
    			add_location(div7, file$d, 34, 6, 1155);
    			attr_dev(i6, "data-feather", "chevron-down");
    			attr_dev(i6, "class", "menu__sub-icon");
    			add_location(i6, file$d, 35, 43, 1253);
    			attr_dev(div8, "class", "menu__title");
    			add_location(div8, file$d, 35, 6, 1216);
    			attr_dev(a4, "href", "/#");
    			attr_dev(a4, "class", "menu menu--active");
    			add_location(a4, file$d, 33, 4, 1109);
    			attr_dev(i7, "data-feather", "activity");
    			add_location(i7, file$d, 40, 34, 1444);
    			attr_dev(div9, "class", "menu__icon");
    			add_location(div9, file$d, 40, 10, 1420);
    			attr_dev(div10, "class", "menu__title");
    			add_location(div10, file$d, 41, 10, 1490);
    			attr_dev(a5, "href", "index.html");
    			attr_dev(a5, "class", "menu menu--active");
    			add_location(a5, file$d, 39, 8, 1362);
    			add_location(li3, file$d, 38, 6, 1349);
    			attr_dev(i8, "data-feather", "activity");
    			add_location(i8, file$d, 46, 34, 1690);
    			attr_dev(div11, "class", "menu__icon");
    			add_location(div11, file$d, 46, 10, 1666);
    			attr_dev(div12, "class", "menu__title");
    			add_location(div12, file$d, 47, 10, 1736);
    			attr_dev(a6, "href", "simple-menu-light-dashboard-overview-1.html");
    			attr_dev(a6, "class", "menu menu--active");
    			add_location(a6, file$d, 45, 8, 1575);
    			add_location(li4, file$d, 44, 6, 1562);
    			attr_dev(i9, "data-feather", "activity");
    			add_location(i9, file$d, 52, 34, 1935);
    			attr_dev(div13, "class", "menu__icon");
    			add_location(div13, file$d, 52, 10, 1911);
    			attr_dev(div14, "class", "menu__title");
    			add_location(div14, file$d, 53, 10, 1981);
    			attr_dev(a7, "href", "top-menu-light-dashboard-overview-1.html");
    			attr_dev(a7, "class", "menu menu--active");
    			add_location(a7, file$d, 51, 8, 1823);
    			add_location(li5, file$d, 50, 6, 1810);
    			attr_dev(ul1, "class", "");
    			add_location(ul1, file$d, 37, 4, 1329);
    			add_location(li6, file$d, 32, 2, 1100);
    			attr_dev(i10, "data-feather", "inbox");
    			add_location(i10, file$d, 60, 30, 2156);
    			attr_dev(div15, "class", "menu__icon");
    			add_location(div15, file$d, 60, 6, 2132);
    			attr_dev(div16, "class", "menu__title");
    			add_location(div16, file$d, 61, 6, 2195);
    			attr_dev(a8, "href", "side-menu-light-inbox.html");
    			attr_dev(a8, "class", "menu");
    			add_location(a8, file$d, 59, 4, 2075);
    			add_location(li7, file$d, 58, 2, 2066);
    			attr_dev(i11, "data-feather", "hard-drive");
    			add_location(i11, file$d, 66, 30, 2348);
    			attr_dev(div17, "class", "menu__icon");
    			add_location(div17, file$d, 66, 6, 2324);
    			attr_dev(div18, "class", "menu__title");
    			add_location(div18, file$d, 67, 6, 2392);
    			attr_dev(a9, "href", "side-menu-light-file-manager.html");
    			attr_dev(a9, "class", "menu");
    			add_location(a9, file$d, 65, 4, 2260);
    			add_location(li8, file$d, 64, 2, 2251);
    			attr_dev(i12, "data-feather", "credit-card");
    			add_location(i12, file$d, 72, 30, 2553);
    			attr_dev(div19, "class", "menu__icon");
    			add_location(div19, file$d, 72, 6, 2529);
    			attr_dev(div20, "class", "menu__title");
    			add_location(div20, file$d, 73, 6, 2598);
    			attr_dev(a10, "href", "side-menu-light-point-of-sale.html");
    			attr_dev(a10, "class", "menu");
    			add_location(a10, file$d, 71, 4, 2464);
    			add_location(li9, file$d, 70, 2, 2455);
    			attr_dev(i13, "data-feather", "message-square");
    			add_location(i13, file$d, 78, 30, 2751);
    			attr_dev(div21, "class", "menu__icon");
    			add_location(div21, file$d, 78, 6, 2727);
    			attr_dev(div22, "class", "menu__title");
    			add_location(div22, file$d, 79, 6, 2799);
    			attr_dev(a11, "href", "side-menu-light-chat.html");
    			attr_dev(a11, "class", "menu");
    			add_location(a11, file$d, 77, 4, 2671);
    			add_location(li10, file$d, 76, 2, 2662);
    			attr_dev(i14, "data-feather", "file-text");
    			add_location(i14, file$d, 84, 30, 2943);
    			attr_dev(div23, "class", "menu__icon");
    			add_location(div23, file$d, 84, 6, 2919);
    			attr_dev(div24, "class", "menu__title");
    			add_location(div24, file$d, 85, 6, 2986);
    			attr_dev(a12, "href", "side-menu-light-post.html");
    			attr_dev(a12, "class", "menu");
    			add_location(a12, file$d, 83, 4, 2863);
    			add_location(li11, file$d, 82, 2, 2854);
    			attr_dev(i15, "data-feather", "calendar");
    			add_location(i15, file$d, 90, 30, 3134);
    			attr_dev(div25, "class", "menu__icon");
    			add_location(div25, file$d, 90, 6, 3110);
    			attr_dev(div26, "class", "menu__title");
    			add_location(div26, file$d, 91, 6, 3176);
    			attr_dev(a13, "href", "side-menu-light-calendar.html");
    			attr_dev(a13, "class", "menu");
    			add_location(a13, file$d, 89, 4, 3050);
    			add_location(li12, file$d, 88, 2, 3041);
    			attr_dev(li13, "class", "menu__devider my-6");
    			add_location(li13, file$d, 94, 2, 3235);
    			attr_dev(i16, "data-feather", "edit");
    			add_location(i16, file$d, 97, 30, 3337);
    			attr_dev(div27, "class", "menu__icon");
    			add_location(div27, file$d, 97, 6, 3313);
    			attr_dev(i17, "data-feather", "chevron-down");
    			attr_dev(i17, "class", "menu__sub-icon");
    			add_location(i17, file$d, 98, 36, 3405);
    			attr_dev(div28, "class", "menu__title");
    			add_location(div28, file$d, 98, 6, 3375);
    			attr_dev(a14, "href", "/#");
    			attr_dev(a14, "class", "menu");
    			add_location(a14, file$d, 96, 4, 3280);
    			attr_dev(i18, "data-feather", "activity");
    			add_location(i18, file$d, 103, 34, 3608);
    			attr_dev(div29, "class", "menu__icon");
    			add_location(div29, file$d, 103, 10, 3584);
    			attr_dev(div30, "class", "menu__title");
    			add_location(div30, file$d, 104, 10, 3654);
    			attr_dev(a15, "href", "side-menu-light-crud-data-list.html");
    			attr_dev(a15, "class", "menu");
    			add_location(a15, file$d, 102, 8, 3514);
    			add_location(li14, file$d, 101, 6, 3501);
    			attr_dev(i19, "data-feather", "activity");
    			add_location(i19, file$d, 109, 34, 3828);
    			attr_dev(div31, "class", "menu__icon");
    			add_location(div31, file$d, 109, 10, 3804);
    			attr_dev(div32, "class", "menu__title");
    			add_location(div32, file$d, 110, 10, 3874);
    			attr_dev(a16, "href", "side-menu-light-crud-form.html");
    			attr_dev(a16, "class", "menu");
    			add_location(a16, file$d, 108, 8, 3739);
    			add_location(li15, file$d, 107, 6, 3726);
    			attr_dev(ul2, "class", "");
    			add_location(ul2, file$d, 100, 4, 3481);
    			add_location(li16, file$d, 95, 2, 3271);
    			attr_dev(i20, "data-feather", "users");
    			add_location(i20, file$d, 117, 30, 4021);
    			attr_dev(div33, "class", "menu__icon");
    			add_location(div33, file$d, 117, 6, 3997);
    			attr_dev(i21, "data-feather", "chevron-down");
    			attr_dev(i21, "class", "menu__sub-icon");
    			add_location(i21, file$d, 118, 37, 4091);
    			attr_dev(div34, "class", "menu__title");
    			add_location(div34, file$d, 118, 6, 4060);
    			attr_dev(a17, "href", "/#");
    			attr_dev(a17, "class", "menu");
    			add_location(a17, file$d, 116, 4, 3964);
    			attr_dev(i22, "data-feather", "activity");
    			add_location(i22, file$d, 123, 34, 4294);
    			attr_dev(div35, "class", "menu__icon");
    			add_location(div35, file$d, 123, 10, 4270);
    			attr_dev(div36, "class", "menu__title");
    			add_location(div36, file$d, 124, 10, 4340);
    			attr_dev(a18, "href", "side-menu-light-users-layout-1.html");
    			attr_dev(a18, "class", "menu");
    			add_location(a18, file$d, 122, 8, 4200);
    			add_location(li17, file$d, 121, 6, 4187);
    			attr_dev(i23, "data-feather", "activity");
    			add_location(i23, file$d, 129, 34, 4518);
    			attr_dev(div37, "class", "menu__icon");
    			add_location(div37, file$d, 129, 10, 4494);
    			attr_dev(div38, "class", "menu__title");
    			add_location(div38, file$d, 130, 10, 4564);
    			attr_dev(a19, "href", "side-menu-light-users-layout-2.html");
    			attr_dev(a19, "class", "menu");
    			add_location(a19, file$d, 128, 8, 4424);
    			add_location(li18, file$d, 127, 6, 4411);
    			attr_dev(i24, "data-feather", "activity");
    			add_location(i24, file$d, 135, 34, 4742);
    			attr_dev(div39, "class", "menu__icon");
    			add_location(div39, file$d, 135, 10, 4718);
    			attr_dev(div40, "class", "menu__title");
    			add_location(div40, file$d, 136, 10, 4788);
    			attr_dev(a20, "href", "side-menu-light-users-layout-3.html");
    			attr_dev(a20, "class", "menu");
    			add_location(a20, file$d, 134, 8, 4648);
    			add_location(li19, file$d, 133, 6, 4635);
    			attr_dev(ul3, "class", "");
    			add_location(ul3, file$d, 120, 4, 4167);
    			add_location(li20, file$d, 115, 2, 3955);
    			attr_dev(i25, "data-feather", "trello");
    			add_location(i25, file$d, 143, 30, 4939);
    			attr_dev(div41, "class", "menu__icon");
    			add_location(div41, file$d, 143, 6, 4915);
    			attr_dev(i26, "data-feather", "chevron-down");
    			attr_dev(i26, "class", "menu__sub-icon");
    			add_location(i26, file$d, 144, 39, 5012);
    			attr_dev(div42, "class", "menu__title");
    			add_location(div42, file$d, 144, 6, 4979);
    			attr_dev(a21, "href", "/#");
    			attr_dev(a21, "class", "menu");
    			add_location(a21, file$d, 142, 4, 4882);
    			attr_dev(i27, "data-feather", "activity");
    			add_location(i27, file$d, 149, 34, 5219);
    			attr_dev(div43, "class", "menu__icon");
    			add_location(div43, file$d, 149, 10, 5195);
    			attr_dev(div44, "class", "menu__title");
    			add_location(div44, file$d, 150, 10, 5265);
    			attr_dev(a22, "href", "side-menu-light-profile-overview-1.html");
    			attr_dev(a22, "class", "menu");
    			add_location(a22, file$d, 148, 8, 5121);
    			add_location(li21, file$d, 147, 6, 5108);
    			attr_dev(i28, "data-feather", "activity");
    			add_location(i28, file$d, 155, 34, 5449);
    			attr_dev(div45, "class", "menu__icon");
    			add_location(div45, file$d, 155, 10, 5425);
    			attr_dev(div46, "class", "menu__title");
    			add_location(div46, file$d, 156, 10, 5495);
    			attr_dev(a23, "href", "side-menu-light-profile-overview-2.html");
    			attr_dev(a23, "class", "menu");
    			add_location(a23, file$d, 154, 8, 5351);
    			add_location(li22, file$d, 153, 6, 5338);
    			attr_dev(i29, "data-feather", "activity");
    			add_location(i29, file$d, 161, 34, 5679);
    			attr_dev(div47, "class", "menu__icon");
    			add_location(div47, file$d, 161, 10, 5655);
    			attr_dev(div48, "class", "menu__title");
    			add_location(div48, file$d, 162, 10, 5725);
    			attr_dev(a24, "href", "side-menu-light-profile-overview-3.html");
    			attr_dev(a24, "class", "menu");
    			add_location(a24, file$d, 160, 8, 5581);
    			add_location(li23, file$d, 159, 6, 5568);
    			attr_dev(ul4, "class", "");
    			add_location(ul4, file$d, 146, 4, 5088);
    			add_location(li24, file$d, 141, 2, 4873);
    			attr_dev(i30, "data-feather", "layout");
    			add_location(i30, file$d, 169, 30, 5878);
    			attr_dev(div49, "class", "menu__icon");
    			add_location(div49, file$d, 169, 6, 5854);
    			attr_dev(i31, "data-feather", "chevron-down");
    			attr_dev(i31, "class", "menu__sub-icon");
    			add_location(i31, file$d, 170, 37, 5949);
    			attr_dev(div50, "class", "menu__title");
    			add_location(div50, file$d, 170, 6, 5918);
    			attr_dev(a25, "href", "/#");
    			attr_dev(a25, "class", "menu");
    			add_location(a25, file$d, 168, 4, 5821);
    			attr_dev(i32, "data-feather", "activity");
    			add_location(i32, file$d, 175, 34, 6119);
    			attr_dev(div51, "class", "menu__icon");
    			add_location(div51, file$d, 175, 10, 6095);
    			attr_dev(i33, "data-feather", "chevron-down");
    			attr_dev(i33, "class", "menu__sub-icon");
    			add_location(i33, file$d, 176, 43, 6198);
    			attr_dev(div52, "class", "menu__title");
    			add_location(div52, file$d, 176, 10, 6165);
    			attr_dev(a26, "href", "/#");
    			attr_dev(a26, "class", "menu");
    			add_location(a26, file$d, 174, 8, 6058);
    			attr_dev(i34, "data-feather", "zap");
    			add_location(i34, file$d, 181, 38, 6422);
    			attr_dev(div53, "class", "menu__icon");
    			add_location(div53, file$d, 181, 14, 6398);
    			attr_dev(div54, "class", "menu__title");
    			add_location(div54, file$d, 182, 14, 6467);
    			attr_dev(a27, "href", "side-menu-light-wizard-layout-1.html");
    			attr_dev(a27, "class", "menu");
    			add_location(a27, file$d, 180, 12, 6323);
    			add_location(li25, file$d, 179, 10, 6306);
    			attr_dev(i35, "data-feather", "zap");
    			add_location(i35, file$d, 187, 38, 6666);
    			attr_dev(div55, "class", "menu__icon");
    			add_location(div55, file$d, 187, 14, 6642);
    			attr_dev(div56, "class", "menu__title");
    			add_location(div56, file$d, 188, 14, 6711);
    			attr_dev(a28, "href", "side-menu-light-wizard-layout-2.html");
    			attr_dev(a28, "class", "menu");
    			add_location(a28, file$d, 186, 12, 6567);
    			add_location(li26, file$d, 185, 10, 6550);
    			attr_dev(i36, "data-feather", "zap");
    			add_location(i36, file$d, 193, 38, 6910);
    			attr_dev(div57, "class", "menu__icon");
    			add_location(div57, file$d, 193, 14, 6886);
    			attr_dev(div58, "class", "menu__title");
    			add_location(div58, file$d, 194, 14, 6955);
    			attr_dev(a29, "href", "side-menu-light-wizard-layout-3.html");
    			attr_dev(a29, "class", "menu");
    			add_location(a29, file$d, 192, 12, 6811);
    			add_location(li27, file$d, 191, 10, 6794);
    			attr_dev(ul5, "class", "");
    			add_location(ul5, file$d, 178, 8, 6282);
    			add_location(li28, file$d, 173, 6, 6045);
    			attr_dev(i37, "data-feather", "activity");
    			add_location(i37, file$d, 201, 34, 7134);
    			attr_dev(div59, "class", "menu__icon");
    			add_location(div59, file$d, 201, 10, 7110);
    			attr_dev(i38, "data-feather", "chevron-down");
    			attr_dev(i38, "class", "menu__sub-icon");
    			add_location(i38, file$d, 202, 40, 7210);
    			attr_dev(div60, "class", "menu__title");
    			add_location(div60, file$d, 202, 10, 7180);
    			attr_dev(a30, "href", "/#");
    			attr_dev(a30, "class", "menu");
    			add_location(a30, file$d, 200, 8, 7073);
    			attr_dev(i39, "data-feather", "zap");
    			add_location(i39, file$d, 207, 38, 7432);
    			attr_dev(div61, "class", "menu__icon");
    			add_location(div61, file$d, 207, 14, 7408);
    			attr_dev(div62, "class", "menu__title");
    			add_location(div62, file$d, 208, 14, 7477);
    			attr_dev(a31, "href", "side-menu-light-blog-layout-1.html");
    			attr_dev(a31, "class", "menu");
    			add_location(a31, file$d, 206, 12, 7335);
    			add_location(li29, file$d, 205, 10, 7318);
    			attr_dev(i40, "data-feather", "zap");
    			add_location(i40, file$d, 213, 38, 7674);
    			attr_dev(div63, "class", "menu__icon");
    			add_location(div63, file$d, 213, 14, 7650);
    			attr_dev(div64, "class", "menu__title");
    			add_location(div64, file$d, 214, 14, 7719);
    			attr_dev(a32, "href", "side-menu-light-blog-layout-2.html");
    			attr_dev(a32, "class", "menu");
    			add_location(a32, file$d, 212, 12, 7577);
    			add_location(li30, file$d, 211, 10, 7560);
    			attr_dev(i41, "data-feather", "zap");
    			add_location(i41, file$d, 219, 38, 7916);
    			attr_dev(div65, "class", "menu__icon");
    			add_location(div65, file$d, 219, 14, 7892);
    			attr_dev(div66, "class", "menu__title");
    			add_location(div66, file$d, 220, 14, 7961);
    			attr_dev(a33, "href", "side-menu-light-blog-layout-3.html");
    			attr_dev(a33, "class", "menu");
    			add_location(a33, file$d, 218, 12, 7819);
    			add_location(li31, file$d, 217, 10, 7802);
    			attr_dev(ul6, "class", "");
    			add_location(ul6, file$d, 204, 8, 7294);
    			add_location(li32, file$d, 199, 6, 7060);
    			attr_dev(i42, "data-feather", "activity");
    			add_location(i42, file$d, 227, 34, 8140);
    			attr_dev(div67, "class", "menu__icon");
    			add_location(div67, file$d, 227, 10, 8116);
    			attr_dev(i43, "data-feather", "chevron-down");
    			attr_dev(i43, "class", "menu__sub-icon");
    			add_location(i43, file$d, 228, 43, 8219);
    			attr_dev(div68, "class", "menu__title");
    			add_location(div68, file$d, 228, 10, 8186);
    			attr_dev(a34, "href", "/#");
    			attr_dev(a34, "class", "menu");
    			add_location(a34, file$d, 226, 8, 8079);
    			attr_dev(i44, "data-feather", "zap");
    			add_location(i44, file$d, 233, 38, 8444);
    			attr_dev(div69, "class", "menu__icon");
    			add_location(div69, file$d, 233, 14, 8420);
    			attr_dev(div70, "class", "menu__title");
    			add_location(div70, file$d, 234, 14, 8489);
    			attr_dev(a35, "href", "side-menu-light-pricing-layout-1.html");
    			attr_dev(a35, "class", "menu");
    			add_location(a35, file$d, 232, 12, 8344);
    			add_location(li33, file$d, 231, 10, 8327);
    			attr_dev(i45, "data-feather", "zap");
    			add_location(i45, file$d, 239, 38, 8689);
    			attr_dev(div71, "class", "menu__icon");
    			add_location(div71, file$d, 239, 14, 8665);
    			attr_dev(div72, "class", "menu__title");
    			add_location(div72, file$d, 240, 14, 8734);
    			attr_dev(a36, "href", "side-menu-light-pricing-layout-2.html");
    			attr_dev(a36, "class", "menu");
    			add_location(a36, file$d, 238, 12, 8589);
    			add_location(li34, file$d, 237, 10, 8572);
    			attr_dev(ul7, "class", "");
    			add_location(ul7, file$d, 230, 8, 8303);
    			add_location(li35, file$d, 225, 6, 8066);
    			attr_dev(i46, "data-feather", "activity");
    			add_location(i46, file$d, 247, 34, 8913);
    			attr_dev(div73, "class", "menu__icon");
    			add_location(div73, file$d, 247, 10, 8889);
    			attr_dev(i47, "data-feather", "chevron-down");
    			attr_dev(i47, "class", "menu__sub-icon");
    			add_location(i47, file$d, 248, 43, 8992);
    			attr_dev(div74, "class", "menu__title");
    			add_location(div74, file$d, 248, 10, 8959);
    			attr_dev(a37, "href", "/#");
    			attr_dev(a37, "class", "menu");
    			add_location(a37, file$d, 246, 8, 8852);
    			attr_dev(i48, "data-feather", "zap");
    			add_location(i48, file$d, 253, 38, 9217);
    			attr_dev(div75, "class", "menu__icon");
    			add_location(div75, file$d, 253, 14, 9193);
    			attr_dev(div76, "class", "menu__title");
    			add_location(div76, file$d, 254, 14, 9262);
    			attr_dev(a38, "href", "side-menu-light-invoice-layout-1.html");
    			attr_dev(a38, "class", "menu");
    			add_location(a38, file$d, 252, 12, 9117);
    			add_location(li36, file$d, 251, 10, 9100);
    			attr_dev(i49, "data-feather", "zap");
    			add_location(i49, file$d, 259, 38, 9462);
    			attr_dev(div77, "class", "menu__icon");
    			add_location(div77, file$d, 259, 14, 9438);
    			attr_dev(div78, "class", "menu__title");
    			add_location(div78, file$d, 260, 14, 9507);
    			attr_dev(a39, "href", "side-menu-light-invoice-layout-2.html");
    			attr_dev(a39, "class", "menu");
    			add_location(a39, file$d, 258, 12, 9362);
    			add_location(li37, file$d, 257, 10, 9345);
    			attr_dev(ul8, "class", "");
    			add_location(ul8, file$d, 250, 8, 9076);
    			add_location(li38, file$d, 245, 6, 8839);
    			attr_dev(i50, "data-feather", "activity");
    			add_location(i50, file$d, 267, 34, 9686);
    			attr_dev(div79, "class", "menu__icon");
    			add_location(div79, file$d, 267, 10, 9662);
    			attr_dev(i51, "data-feather", "chevron-down");
    			attr_dev(i51, "class", "menu__sub-icon");
    			add_location(i51, file$d, 268, 39, 9761);
    			attr_dev(div80, "class", "menu__title");
    			add_location(div80, file$d, 268, 10, 9732);
    			attr_dev(a40, "href", "/#");
    			attr_dev(a40, "class", "menu");
    			add_location(a40, file$d, 266, 8, 9625);
    			attr_dev(i52, "data-feather", "zap");
    			add_location(i52, file$d, 273, 38, 9982);
    			attr_dev(div81, "class", "menu__icon");
    			add_location(div81, file$d, 273, 14, 9958);
    			attr_dev(div82, "class", "menu__title");
    			add_location(div82, file$d, 274, 14, 10027);
    			attr_dev(a41, "href", "side-menu-light-faq-layout-1.html");
    			attr_dev(a41, "class", "menu");
    			add_location(a41, file$d, 272, 12, 9886);
    			add_location(li39, file$d, 271, 10, 9869);
    			attr_dev(i53, "data-feather", "zap");
    			add_location(i53, file$d, 279, 38, 10223);
    			attr_dev(div83, "class", "menu__icon");
    			add_location(div83, file$d, 279, 14, 10199);
    			attr_dev(div84, "class", "menu__title");
    			add_location(div84, file$d, 280, 14, 10268);
    			attr_dev(a42, "href", "side-menu-light-faq-layout-2.html");
    			attr_dev(a42, "class", "menu");
    			add_location(a42, file$d, 278, 12, 10127);
    			add_location(li40, file$d, 277, 10, 10110);
    			attr_dev(i54, "data-feather", "zap");
    			add_location(i54, file$d, 285, 38, 10464);
    			attr_dev(div85, "class", "menu__icon");
    			add_location(div85, file$d, 285, 14, 10440);
    			attr_dev(div86, "class", "menu__title");
    			add_location(div86, file$d, 286, 14, 10509);
    			attr_dev(a43, "href", "side-menu-light-faq-layout-3.html");
    			attr_dev(a43, "class", "menu");
    			add_location(a43, file$d, 284, 12, 10368);
    			add_location(li41, file$d, 283, 10, 10351);
    			attr_dev(ul9, "class", "");
    			add_location(ul9, file$d, 270, 8, 9845);
    			add_location(li42, file$d, 265, 6, 9612);
    			attr_dev(i55, "data-feather", "activity");
    			add_location(i55, file$d, 293, 34, 10708);
    			attr_dev(div87, "class", "menu__icon");
    			add_location(div87, file$d, 293, 10, 10684);
    			attr_dev(div88, "class", "menu__title");
    			add_location(div88, file$d, 294, 10, 10754);
    			attr_dev(a44, "href", "login-light-login.html");
    			attr_dev(a44, "class", "menu");
    			add_location(a44, file$d, 292, 8, 10627);
    			add_location(li43, file$d, 291, 6, 10614);
    			attr_dev(i56, "data-feather", "activity");
    			add_location(i56, file$d, 299, 34, 10919);
    			attr_dev(div89, "class", "menu__icon");
    			add_location(div89, file$d, 299, 10, 10895);
    			attr_dev(div90, "class", "menu__title");
    			add_location(div90, file$d, 300, 10, 10965);
    			attr_dev(a45, "href", "login-light-register.html");
    			attr_dev(a45, "class", "menu");
    			add_location(a45, file$d, 298, 8, 10835);
    			add_location(li44, file$d, 297, 6, 10822);
    			attr_dev(i57, "data-feather", "activity");
    			add_location(i57, file$d, 305, 34, 11134);
    			attr_dev(div91, "class", "menu__icon");
    			add_location(div91, file$d, 305, 10, 11110);
    			attr_dev(div92, "class", "menu__title");
    			add_location(div92, file$d, 306, 10, 11180);
    			attr_dev(a46, "href", "main-light-error-page.html");
    			attr_dev(a46, "class", "menu");
    			add_location(a46, file$d, 304, 8, 11049);
    			add_location(li45, file$d, 303, 6, 11036);
    			attr_dev(i58, "data-feather", "activity");
    			add_location(i58, file$d, 311, 34, 11360);
    			attr_dev(div93, "class", "menu__icon");
    			add_location(div93, file$d, 311, 10, 11336);
    			attr_dev(div94, "class", "menu__title");
    			add_location(div94, file$d, 312, 10, 11406);
    			attr_dev(a47, "href", "side-menu-light-update-profile.html");
    			attr_dev(a47, "class", "menu");
    			add_location(a47, file$d, 310, 8, 11266);
    			add_location(li46, file$d, 309, 6, 11253);
    			attr_dev(i59, "data-feather", "activity");
    			add_location(i59, file$d, 317, 34, 11591);
    			attr_dev(div95, "class", "menu__icon");
    			add_location(div95, file$d, 317, 10, 11567);
    			attr_dev(div96, "class", "menu__title");
    			add_location(div96, file$d, 318, 10, 11637);
    			attr_dev(a48, "href", "side-menu-light-change-password.html");
    			attr_dev(a48, "class", "menu");
    			add_location(a48, file$d, 316, 8, 11496);
    			add_location(li47, file$d, 315, 6, 11483);
    			attr_dev(ul10, "class", "");
    			add_location(ul10, file$d, 172, 4, 6025);
    			add_location(li48, file$d, 167, 2, 5812);
    			attr_dev(li49, "class", "menu__devider my-6");
    			add_location(li49, file$d, 323, 2, 11729);
    			attr_dev(i60, "data-feather", "inbox");
    			add_location(i60, file$d, 326, 30, 11831);
    			attr_dev(div97, "class", "menu__icon");
    			add_location(div97, file$d, 326, 6, 11807);
    			attr_dev(i61, "data-feather", "chevron-down");
    			attr_dev(i61, "class", "menu__sub-icon");
    			add_location(i61, file$d, 327, 42, 11906);
    			attr_dev(div98, "class", "menu__title");
    			add_location(div98, file$d, 327, 6, 11870);
    			attr_dev(a49, "href", "/#");
    			attr_dev(a49, "class", "menu");
    			add_location(a49, file$d, 325, 4, 11774);
    			attr_dev(i62, "data-feather", "activity");
    			add_location(i62, file$d, 332, 34, 12076);
    			attr_dev(div99, "class", "menu__icon");
    			add_location(div99, file$d, 332, 10, 12052);
    			attr_dev(i63, "data-feather", "chevron-down");
    			attr_dev(i63, "class", "menu__sub-icon");
    			add_location(i63, file$d, 333, 41, 12153);
    			attr_dev(div100, "class", "menu__title");
    			add_location(div100, file$d, 333, 10, 12122);
    			attr_dev(a50, "href", "/#");
    			attr_dev(a50, "class", "menu");
    			add_location(a50, file$d, 331, 8, 12015);
    			attr_dev(i64, "data-feather", "zap");
    			add_location(i64, file$d, 338, 38, 12375);
    			attr_dev(div101, "class", "menu__icon");
    			add_location(div101, file$d, 338, 14, 12351);
    			attr_dev(div102, "class", "menu__title");
    			add_location(div102, file$d, 339, 14, 12420);
    			attr_dev(a51, "href", "side-menu-light-regular-table.html");
    			attr_dev(a51, "class", "menu");
    			add_location(a51, file$d, 337, 12, 12278);
    			add_location(li50, file$d, 336, 10, 12261);
    			attr_dev(i65, "data-feather", "zap");
    			add_location(i65, file$d, 344, 38, 12618);
    			attr_dev(div103, "class", "menu__icon");
    			add_location(div103, file$d, 344, 14, 12594);
    			attr_dev(div104, "class", "menu__title");
    			add_location(div104, file$d, 345, 14, 12663);
    			attr_dev(a52, "href", "side-menu-light-tabulator.html");
    			attr_dev(a52, "class", "menu");
    			add_location(a52, file$d, 343, 12, 12525);
    			add_location(li51, file$d, 342, 10, 12508);
    			attr_dev(ul11, "class", "");
    			add_location(ul11, file$d, 335, 8, 12237);
    			add_location(li52, file$d, 330, 6, 12002);
    			attr_dev(i66, "data-feather", "activity");
    			add_location(i66, file$d, 352, 34, 12843);
    			attr_dev(div105, "class", "menu__icon");
    			add_location(div105, file$d, 352, 10, 12819);
    			attr_dev(i67, "data-feather", "chevron-down");
    			attr_dev(i67, "class", "menu__sub-icon");
    			add_location(i67, file$d, 353, 43, 12922);
    			attr_dev(div106, "class", "menu__title");
    			add_location(div106, file$d, 353, 10, 12889);
    			attr_dev(a53, "href", "/#");
    			attr_dev(a53, "class", "menu");
    			add_location(a53, file$d, 351, 8, 12782);
    			attr_dev(i68, "data-feather", "zap");
    			add_location(i68, file$d, 358, 38, 13136);
    			attr_dev(div107, "class", "menu__icon");
    			add_location(div107, file$d, 358, 14, 13112);
    			attr_dev(div108, "class", "menu__title");
    			add_location(div108, file$d, 359, 14, 13181);
    			attr_dev(a54, "href", "side-menu-light-modal.html");
    			attr_dev(a54, "class", "menu");
    			add_location(a54, file$d, 357, 12, 13047);
    			add_location(li53, file$d, 356, 10, 13030);
    			attr_dev(i69, "data-feather", "zap");
    			add_location(i69, file$d, 364, 38, 13372);
    			attr_dev(div109, "class", "menu__icon");
    			add_location(div109, file$d, 364, 14, 13348);
    			attr_dev(div110, "class", "menu__title");
    			add_location(div110, file$d, 365, 14, 13417);
    			attr_dev(a55, "href", "side-menu-light-slide-over.html");
    			attr_dev(a55, "class", "menu");
    			add_location(a55, file$d, 363, 12, 13278);
    			add_location(li54, file$d, 362, 10, 13261);
    			attr_dev(i70, "data-feather", "zap");
    			add_location(i70, file$d, 370, 38, 13615);
    			attr_dev(div111, "class", "menu__icon");
    			add_location(div111, file$d, 370, 14, 13591);
    			attr_dev(div112, "class", "menu__title");
    			add_location(div112, file$d, 371, 14, 13660);
    			attr_dev(a56, "href", "side-menu-light-notification.html");
    			attr_dev(a56, "class", "menu");
    			add_location(a56, file$d, 369, 12, 13519);
    			add_location(li55, file$d, 368, 10, 13502);
    			attr_dev(ul12, "class", "");
    			add_location(ul12, file$d, 355, 8, 13006);
    			add_location(li56, file$d, 350, 6, 12769);
    			attr_dev(i71, "data-feather", "activity");
    			add_location(i71, file$d, 378, 34, 13871);
    			attr_dev(div113, "class", "menu__icon");
    			add_location(div113, file$d, 378, 10, 13847);
    			attr_dev(div114, "class", "menu__title");
    			add_location(div114, file$d, 379, 10, 13917);
    			attr_dev(a57, "href", "side-menu-light-accordion.html");
    			attr_dev(a57, "class", "menu");
    			add_location(a57, file$d, 377, 8, 13782);
    			add_location(li57, file$d, 376, 6, 13769);
    			attr_dev(i72, "data-feather", "activity");
    			add_location(i72, file$d, 384, 34, 14088);
    			attr_dev(div115, "class", "menu__icon");
    			add_location(div115, file$d, 384, 10, 14064);
    			attr_dev(div116, "class", "menu__title");
    			add_location(div116, file$d, 385, 10, 14134);
    			attr_dev(a58, "href", "side-menu-light-button.html");
    			attr_dev(a58, "class", "menu");
    			add_location(a58, file$d, 383, 8, 14002);
    			add_location(li58, file$d, 382, 6, 13989);
    			attr_dev(i73, "data-feather", "activity");
    			add_location(i73, file$d, 390, 34, 14301);
    			attr_dev(div117, "class", "menu__icon");
    			add_location(div117, file$d, 390, 10, 14277);
    			attr_dev(div118, "class", "menu__title");
    			add_location(div118, file$d, 391, 10, 14347);
    			attr_dev(a59, "href", "side-menu-light-alert.html");
    			attr_dev(a59, "class", "menu");
    			add_location(a59, file$d, 389, 8, 14216);
    			add_location(li59, file$d, 388, 6, 14203);
    			attr_dev(i74, "data-feather", "activity");
    			add_location(i74, file$d, 396, 34, 14520);
    			attr_dev(div119, "class", "menu__icon");
    			add_location(div119, file$d, 396, 10, 14496);
    			attr_dev(div120, "class", "menu__title");
    			add_location(div120, file$d, 397, 10, 14566);
    			attr_dev(a60, "href", "side-menu-light-progress-bar.html");
    			attr_dev(a60, "class", "menu");
    			add_location(a60, file$d, 395, 8, 14428);
    			add_location(li60, file$d, 394, 6, 14415);
    			attr_dev(i75, "data-feather", "activity");
    			add_location(i75, file$d, 402, 34, 14741);
    			attr_dev(div121, "class", "menu__icon");
    			add_location(div121, file$d, 402, 10, 14717);
    			attr_dev(div122, "class", "menu__title");
    			add_location(div122, file$d, 403, 10, 14787);
    			attr_dev(a61, "href", "side-menu-light-tooltip.html");
    			attr_dev(a61, "class", "menu");
    			add_location(a61, file$d, 401, 8, 14654);
    			add_location(li61, file$d, 400, 6, 14641);
    			attr_dev(i76, "data-feather", "activity");
    			add_location(i76, file$d, 408, 34, 14958);
    			attr_dev(div123, "class", "menu__icon");
    			add_location(div123, file$d, 408, 10, 14934);
    			attr_dev(div124, "class", "menu__title");
    			add_location(div124, file$d, 409, 10, 15004);
    			attr_dev(a62, "href", "side-menu-light-dropdown.html");
    			attr_dev(a62, "class", "menu");
    			add_location(a62, file$d, 407, 8, 14870);
    			add_location(li62, file$d, 406, 6, 14857);
    			attr_dev(i77, "data-feather", "activity");
    			add_location(i77, file$d, 414, 34, 15178);
    			attr_dev(div125, "class", "menu__icon");
    			add_location(div125, file$d, 414, 10, 15154);
    			attr_dev(div126, "class", "menu__title");
    			add_location(div126, file$d, 415, 10, 15224);
    			attr_dev(a63, "href", "side-menu-light-typography.html");
    			attr_dev(a63, "class", "menu");
    			add_location(a63, file$d, 413, 8, 15088);
    			add_location(li63, file$d, 412, 6, 15075);
    			attr_dev(i78, "data-feather", "activity");
    			add_location(i78, file$d, 420, 34, 15394);
    			attr_dev(div127, "class", "menu__icon");
    			add_location(div127, file$d, 420, 10, 15370);
    			attr_dev(div128, "class", "menu__title");
    			add_location(div128, file$d, 421, 10, 15440);
    			attr_dev(a64, "href", "side-menu-light-icon.html");
    			attr_dev(a64, "class", "menu");
    			add_location(a64, file$d, 419, 8, 15310);
    			add_location(li64, file$d, 418, 6, 15297);
    			attr_dev(i79, "data-feather", "activity");
    			add_location(i79, file$d, 426, 34, 15612);
    			attr_dev(div129, "class", "menu__icon");
    			add_location(div129, file$d, 426, 10, 15588);
    			attr_dev(div130, "class", "menu__title");
    			add_location(div130, file$d, 427, 10, 15658);
    			attr_dev(a65, "href", "side-menu-light-loading-icon.html");
    			attr_dev(a65, "class", "menu");
    			add_location(a65, file$d, 425, 8, 15520);
    			add_location(li65, file$d, 424, 6, 15507);
    			attr_dev(ul13, "class", "");
    			add_location(ul13, file$d, 329, 4, 11982);
    			add_location(li66, file$d, 324, 2, 11765);
    			attr_dev(i80, "data-feather", "sidebar");
    			add_location(i80, file$d, 434, 30, 15813);
    			attr_dev(div131, "class", "menu__icon");
    			add_location(div131, file$d, 434, 6, 15789);
    			attr_dev(i81, "data-feather", "chevron-down");
    			attr_dev(i81, "class", "menu__sub-icon");
    			add_location(i81, file$d, 435, 37, 15885);
    			attr_dev(div132, "class", "menu__title");
    			add_location(div132, file$d, 435, 6, 15854);
    			attr_dev(a66, "href", "/#");
    			attr_dev(a66, "class", "menu");
    			add_location(a66, file$d, 433, 4, 15756);
    			attr_dev(i82, "data-feather", "activity");
    			add_location(i82, file$d, 440, 34, 16086);
    			attr_dev(div133, "class", "menu__icon");
    			add_location(div133, file$d, 440, 10, 16062);
    			attr_dev(div134, "class", "menu__title");
    			add_location(div134, file$d, 441, 10, 16132);
    			attr_dev(a67, "href", "side-menu-light-regular-form.html");
    			attr_dev(a67, "class", "menu");
    			add_location(a67, file$d, 439, 8, 15994);
    			add_location(li67, file$d, 438, 6, 15981);
    			attr_dev(i83, "data-feather", "activity");
    			add_location(i83, file$d, 446, 34, 16310);
    			attr_dev(div135, "class", "menu__icon");
    			add_location(div135, file$d, 446, 10, 16286);
    			attr_dev(div136, "class", "menu__title");
    			add_location(div136, file$d, 447, 10, 16356);
    			attr_dev(a68, "href", "side-menu-light-datepicker.html");
    			attr_dev(a68, "class", "menu");
    			add_location(a68, file$d, 445, 8, 16220);
    			add_location(li68, file$d, 444, 6, 16207);
    			attr_dev(i84, "data-feather", "activity");
    			add_location(i84, file$d, 452, 34, 16533);
    			attr_dev(div137, "class", "menu__icon");
    			add_location(div137, file$d, 452, 10, 16509);
    			attr_dev(div138, "class", "menu__title");
    			add_location(div138, file$d, 453, 10, 16579);
    			attr_dev(a69, "href", "side-menu-light-tail-select.html");
    			attr_dev(a69, "class", "menu");
    			add_location(a69, file$d, 451, 8, 16442);
    			add_location(li69, file$d, 450, 6, 16429);
    			attr_dev(i85, "data-feather", "activity");
    			add_location(i85, file$d, 458, 34, 16757);
    			attr_dev(div139, "class", "menu__icon");
    			add_location(div139, file$d, 458, 10, 16733);
    			attr_dev(div140, "class", "menu__title");
    			add_location(div140, file$d, 459, 10, 16803);
    			attr_dev(a70, "href", "side-menu-light-file-upload.html");
    			attr_dev(a70, "class", "menu");
    			add_location(a70, file$d, 457, 8, 16666);
    			add_location(li70, file$d, 456, 6, 16653);
    			attr_dev(i86, "data-feather", "activity");
    			add_location(i86, file$d, 464, 34, 16984);
    			attr_dev(div141, "class", "menu__icon");
    			add_location(div141, file$d, 464, 10, 16960);
    			attr_dev(div142, "class", "menu__title");
    			add_location(div142, file$d, 465, 10, 17030);
    			attr_dev(a71, "href", "side-menu-light-wysiwyg-editor.html");
    			attr_dev(a71, "class", "menu");
    			add_location(a71, file$d, 463, 8, 16890);
    			add_location(li71, file$d, 462, 6, 16877);
    			attr_dev(i87, "data-feather", "activity");
    			add_location(i87, file$d, 470, 34, 17210);
    			attr_dev(div143, "class", "menu__icon");
    			add_location(div143, file$d, 470, 10, 17186);
    			attr_dev(div144, "class", "menu__title");
    			add_location(div144, file$d, 471, 10, 17256);
    			attr_dev(a72, "href", "side-menu-light-validation.html");
    			attr_dev(a72, "class", "menu");
    			add_location(a72, file$d, 469, 8, 17120);
    			add_location(li72, file$d, 468, 6, 17107);
    			attr_dev(ul14, "class", "");
    			add_location(ul14, file$d, 437, 4, 15961);
    			add_location(li73, file$d, 432, 2, 15747);
    			attr_dev(i88, "data-feather", "hard-drive");
    			add_location(i88, file$d, 478, 30, 17409);
    			attr_dev(div145, "class", "menu__icon");
    			add_location(div145, file$d, 478, 6, 17385);
    			attr_dev(i89, "data-feather", "chevron-down");
    			attr_dev(i89, "class", "menu__sub-icon");
    			add_location(i89, file$d, 479, 39, 17486);
    			attr_dev(div146, "class", "menu__title");
    			add_location(div146, file$d, 479, 6, 17453);
    			attr_dev(a73, "href", "/#");
    			attr_dev(a73, "class", "menu");
    			add_location(a73, file$d, 477, 4, 17352);
    			attr_dev(i90, "data-feather", "activity");
    			add_location(i90, file$d, 484, 34, 17680);
    			attr_dev(div147, "class", "menu__icon");
    			add_location(div147, file$d, 484, 10, 17656);
    			attr_dev(div148, "class", "menu__title");
    			add_location(div148, file$d, 485, 10, 17726);
    			attr_dev(a74, "href", "side-menu-light-chart.html");
    			attr_dev(a74, "class", "menu");
    			add_location(a74, file$d, 483, 8, 17595);
    			add_location(li74, file$d, 482, 6, 17582);
    			attr_dev(i91, "data-feather", "activity");
    			add_location(i91, file$d, 490, 34, 17893);
    			attr_dev(div149, "class", "menu__icon");
    			add_location(div149, file$d, 490, 10, 17869);
    			attr_dev(div150, "class", "menu__title");
    			add_location(div150, file$d, 491, 10, 17939);
    			attr_dev(a75, "href", "side-menu-light-slider.html");
    			attr_dev(a75, "class", "menu");
    			add_location(a75, file$d, 489, 8, 17807);
    			add_location(li75, file$d, 488, 6, 17794);
    			attr_dev(i92, "data-feather", "activity");
    			add_location(i92, file$d, 496, 34, 18111);
    			attr_dev(div151, "class", "menu__icon");
    			add_location(div151, file$d, 496, 10, 18087);
    			attr_dev(div152, "class", "menu__title");
    			add_location(div152, file$d, 497, 10, 18157);
    			attr_dev(a76, "href", "side-menu-light-image-zoom.html");
    			attr_dev(a76, "class", "menu");
    			add_location(a76, file$d, 495, 8, 18021);
    			add_location(li76, file$d, 494, 6, 18008);
    			attr_dev(ul15, "class", "");
    			add_location(ul15, file$d, 481, 4, 17562);
    			add_location(li77, file$d, 476, 2, 17343);
    			attr_dev(ul16, "class", "border-t border-theme-29 py-5 hidden");
    			add_location(ul16, file$d, 11, 0, 342);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(link, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, a0);
    			append_dev(a0, i0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul16, anchor);
    			append_dev(ul16, li2);
    			append_dev(li2, a1);
    			append_dev(a1, div1);
    			append_dev(div1, i1);
    			append_dev(a1, t2);
    			append_dev(a1, div2);
    			append_dev(div2, t3);
    			append_dev(div2, i2);
    			append_dev(li2, t4);
    			append_dev(li2, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, a2);
    			append_dev(a2, div3);
    			append_dev(div3, i3);
    			append_dev(a2, t5);
    			append_dev(a2, div4);
    			append_dev(ul0, t7);
    			append_dev(ul0, li1);
    			append_dev(li1, a3);
    			append_dev(a3, div5);
    			append_dev(div5, i4);
    			append_dev(a3, t8);
    			append_dev(a3, div6);
    			append_dev(ul16, t10);
    			append_dev(ul16, li6);
    			append_dev(li6, a4);
    			append_dev(a4, div7);
    			append_dev(div7, i5);
    			append_dev(a4, t11);
    			append_dev(a4, div8);
    			append_dev(div8, t12);
    			append_dev(div8, i6);
    			append_dev(li6, t13);
    			append_dev(li6, ul1);
    			append_dev(ul1, li3);
    			append_dev(li3, a5);
    			append_dev(a5, div9);
    			append_dev(div9, i7);
    			append_dev(a5, t14);
    			append_dev(a5, div10);
    			append_dev(ul1, t16);
    			append_dev(ul1, li4);
    			append_dev(li4, a6);
    			append_dev(a6, div11);
    			append_dev(div11, i8);
    			append_dev(a6, t17);
    			append_dev(a6, div12);
    			append_dev(ul1, t19);
    			append_dev(ul1, li5);
    			append_dev(li5, a7);
    			append_dev(a7, div13);
    			append_dev(div13, i9);
    			append_dev(a7, t20);
    			append_dev(a7, div14);
    			append_dev(ul16, t22);
    			append_dev(ul16, li7);
    			append_dev(li7, a8);
    			append_dev(a8, div15);
    			append_dev(div15, i10);
    			append_dev(a8, t23);
    			append_dev(a8, div16);
    			append_dev(ul16, t25);
    			append_dev(ul16, li8);
    			append_dev(li8, a9);
    			append_dev(a9, div17);
    			append_dev(div17, i11);
    			append_dev(a9, t26);
    			append_dev(a9, div18);
    			append_dev(ul16, t28);
    			append_dev(ul16, li9);
    			append_dev(li9, a10);
    			append_dev(a10, div19);
    			append_dev(div19, i12);
    			append_dev(a10, t29);
    			append_dev(a10, div20);
    			append_dev(ul16, t31);
    			append_dev(ul16, li10);
    			append_dev(li10, a11);
    			append_dev(a11, div21);
    			append_dev(div21, i13);
    			append_dev(a11, t32);
    			append_dev(a11, div22);
    			append_dev(ul16, t34);
    			append_dev(ul16, li11);
    			append_dev(li11, a12);
    			append_dev(a12, div23);
    			append_dev(div23, i14);
    			append_dev(a12, t35);
    			append_dev(a12, div24);
    			append_dev(ul16, t37);
    			append_dev(ul16, li12);
    			append_dev(li12, a13);
    			append_dev(a13, div25);
    			append_dev(div25, i15);
    			append_dev(a13, t38);
    			append_dev(a13, div26);
    			append_dev(ul16, t40);
    			append_dev(ul16, li13);
    			append_dev(ul16, t41);
    			append_dev(ul16, li16);
    			append_dev(li16, a14);
    			append_dev(a14, div27);
    			append_dev(div27, i16);
    			append_dev(a14, t42);
    			append_dev(a14, div28);
    			append_dev(div28, t43);
    			append_dev(div28, i17);
    			append_dev(li16, t44);
    			append_dev(li16, ul2);
    			append_dev(ul2, li14);
    			append_dev(li14, a15);
    			append_dev(a15, div29);
    			append_dev(div29, i18);
    			append_dev(a15, t45);
    			append_dev(a15, div30);
    			append_dev(ul2, t47);
    			append_dev(ul2, li15);
    			append_dev(li15, a16);
    			append_dev(a16, div31);
    			append_dev(div31, i19);
    			append_dev(a16, t48);
    			append_dev(a16, div32);
    			append_dev(ul16, t50);
    			append_dev(ul16, li20);
    			append_dev(li20, a17);
    			append_dev(a17, div33);
    			append_dev(div33, i20);
    			append_dev(a17, t51);
    			append_dev(a17, div34);
    			append_dev(div34, t52);
    			append_dev(div34, i21);
    			append_dev(li20, t53);
    			append_dev(li20, ul3);
    			append_dev(ul3, li17);
    			append_dev(li17, a18);
    			append_dev(a18, div35);
    			append_dev(div35, i22);
    			append_dev(a18, t54);
    			append_dev(a18, div36);
    			append_dev(ul3, t56);
    			append_dev(ul3, li18);
    			append_dev(li18, a19);
    			append_dev(a19, div37);
    			append_dev(div37, i23);
    			append_dev(a19, t57);
    			append_dev(a19, div38);
    			append_dev(ul3, t59);
    			append_dev(ul3, li19);
    			append_dev(li19, a20);
    			append_dev(a20, div39);
    			append_dev(div39, i24);
    			append_dev(a20, t60);
    			append_dev(a20, div40);
    			append_dev(ul16, t62);
    			append_dev(ul16, li24);
    			append_dev(li24, a21);
    			append_dev(a21, div41);
    			append_dev(div41, i25);
    			append_dev(a21, t63);
    			append_dev(a21, div42);
    			append_dev(div42, t64);
    			append_dev(div42, i26);
    			append_dev(li24, t65);
    			append_dev(li24, ul4);
    			append_dev(ul4, li21);
    			append_dev(li21, a22);
    			append_dev(a22, div43);
    			append_dev(div43, i27);
    			append_dev(a22, t66);
    			append_dev(a22, div44);
    			append_dev(ul4, t68);
    			append_dev(ul4, li22);
    			append_dev(li22, a23);
    			append_dev(a23, div45);
    			append_dev(div45, i28);
    			append_dev(a23, t69);
    			append_dev(a23, div46);
    			append_dev(ul4, t71);
    			append_dev(ul4, li23);
    			append_dev(li23, a24);
    			append_dev(a24, div47);
    			append_dev(div47, i29);
    			append_dev(a24, t72);
    			append_dev(a24, div48);
    			append_dev(ul16, t74);
    			append_dev(ul16, li48);
    			append_dev(li48, a25);
    			append_dev(a25, div49);
    			append_dev(div49, i30);
    			append_dev(a25, t75);
    			append_dev(a25, div50);
    			append_dev(div50, t76);
    			append_dev(div50, i31);
    			append_dev(li48, t77);
    			append_dev(li48, ul10);
    			append_dev(ul10, li28);
    			append_dev(li28, a26);
    			append_dev(a26, div51);
    			append_dev(div51, i32);
    			append_dev(a26, t78);
    			append_dev(a26, div52);
    			append_dev(div52, t79);
    			append_dev(div52, i33);
    			append_dev(li28, t80);
    			append_dev(li28, ul5);
    			append_dev(ul5, li25);
    			append_dev(li25, a27);
    			append_dev(a27, div53);
    			append_dev(div53, i34);
    			append_dev(a27, t81);
    			append_dev(a27, div54);
    			append_dev(ul5, t83);
    			append_dev(ul5, li26);
    			append_dev(li26, a28);
    			append_dev(a28, div55);
    			append_dev(div55, i35);
    			append_dev(a28, t84);
    			append_dev(a28, div56);
    			append_dev(ul5, t86);
    			append_dev(ul5, li27);
    			append_dev(li27, a29);
    			append_dev(a29, div57);
    			append_dev(div57, i36);
    			append_dev(a29, t87);
    			append_dev(a29, div58);
    			append_dev(ul10, t89);
    			append_dev(ul10, li32);
    			append_dev(li32, a30);
    			append_dev(a30, div59);
    			append_dev(div59, i37);
    			append_dev(a30, t90);
    			append_dev(a30, div60);
    			append_dev(div60, t91);
    			append_dev(div60, i38);
    			append_dev(li32, t92);
    			append_dev(li32, ul6);
    			append_dev(ul6, li29);
    			append_dev(li29, a31);
    			append_dev(a31, div61);
    			append_dev(div61, i39);
    			append_dev(a31, t93);
    			append_dev(a31, div62);
    			append_dev(ul6, t95);
    			append_dev(ul6, li30);
    			append_dev(li30, a32);
    			append_dev(a32, div63);
    			append_dev(div63, i40);
    			append_dev(a32, t96);
    			append_dev(a32, div64);
    			append_dev(ul6, t98);
    			append_dev(ul6, li31);
    			append_dev(li31, a33);
    			append_dev(a33, div65);
    			append_dev(div65, i41);
    			append_dev(a33, t99);
    			append_dev(a33, div66);
    			append_dev(ul10, t101);
    			append_dev(ul10, li35);
    			append_dev(li35, a34);
    			append_dev(a34, div67);
    			append_dev(div67, i42);
    			append_dev(a34, t102);
    			append_dev(a34, div68);
    			append_dev(div68, t103);
    			append_dev(div68, i43);
    			append_dev(li35, t104);
    			append_dev(li35, ul7);
    			append_dev(ul7, li33);
    			append_dev(li33, a35);
    			append_dev(a35, div69);
    			append_dev(div69, i44);
    			append_dev(a35, t105);
    			append_dev(a35, div70);
    			append_dev(ul7, t107);
    			append_dev(ul7, li34);
    			append_dev(li34, a36);
    			append_dev(a36, div71);
    			append_dev(div71, i45);
    			append_dev(a36, t108);
    			append_dev(a36, div72);
    			append_dev(ul10, t110);
    			append_dev(ul10, li38);
    			append_dev(li38, a37);
    			append_dev(a37, div73);
    			append_dev(div73, i46);
    			append_dev(a37, t111);
    			append_dev(a37, div74);
    			append_dev(div74, t112);
    			append_dev(div74, i47);
    			append_dev(li38, t113);
    			append_dev(li38, ul8);
    			append_dev(ul8, li36);
    			append_dev(li36, a38);
    			append_dev(a38, div75);
    			append_dev(div75, i48);
    			append_dev(a38, t114);
    			append_dev(a38, div76);
    			append_dev(ul8, t116);
    			append_dev(ul8, li37);
    			append_dev(li37, a39);
    			append_dev(a39, div77);
    			append_dev(div77, i49);
    			append_dev(a39, t117);
    			append_dev(a39, div78);
    			append_dev(ul10, t119);
    			append_dev(ul10, li42);
    			append_dev(li42, a40);
    			append_dev(a40, div79);
    			append_dev(div79, i50);
    			append_dev(a40, t120);
    			append_dev(a40, div80);
    			append_dev(div80, t121);
    			append_dev(div80, i51);
    			append_dev(li42, t122);
    			append_dev(li42, ul9);
    			append_dev(ul9, li39);
    			append_dev(li39, a41);
    			append_dev(a41, div81);
    			append_dev(div81, i52);
    			append_dev(a41, t123);
    			append_dev(a41, div82);
    			append_dev(ul9, t125);
    			append_dev(ul9, li40);
    			append_dev(li40, a42);
    			append_dev(a42, div83);
    			append_dev(div83, i53);
    			append_dev(a42, t126);
    			append_dev(a42, div84);
    			append_dev(ul9, t128);
    			append_dev(ul9, li41);
    			append_dev(li41, a43);
    			append_dev(a43, div85);
    			append_dev(div85, i54);
    			append_dev(a43, t129);
    			append_dev(a43, div86);
    			append_dev(ul10, t131);
    			append_dev(ul10, li43);
    			append_dev(li43, a44);
    			append_dev(a44, div87);
    			append_dev(div87, i55);
    			append_dev(a44, t132);
    			append_dev(a44, div88);
    			append_dev(ul10, t134);
    			append_dev(ul10, li44);
    			append_dev(li44, a45);
    			append_dev(a45, div89);
    			append_dev(div89, i56);
    			append_dev(a45, t135);
    			append_dev(a45, div90);
    			append_dev(ul10, t137);
    			append_dev(ul10, li45);
    			append_dev(li45, a46);
    			append_dev(a46, div91);
    			append_dev(div91, i57);
    			append_dev(a46, t138);
    			append_dev(a46, div92);
    			append_dev(ul10, t140);
    			append_dev(ul10, li46);
    			append_dev(li46, a47);
    			append_dev(a47, div93);
    			append_dev(div93, i58);
    			append_dev(a47, t141);
    			append_dev(a47, div94);
    			append_dev(ul10, t143);
    			append_dev(ul10, li47);
    			append_dev(li47, a48);
    			append_dev(a48, div95);
    			append_dev(div95, i59);
    			append_dev(a48, t144);
    			append_dev(a48, div96);
    			append_dev(ul16, t146);
    			append_dev(ul16, li49);
    			append_dev(ul16, t147);
    			append_dev(ul16, li66);
    			append_dev(li66, a49);
    			append_dev(a49, div97);
    			append_dev(div97, i60);
    			append_dev(a49, t148);
    			append_dev(a49, div98);
    			append_dev(div98, t149);
    			append_dev(div98, i61);
    			append_dev(li66, t150);
    			append_dev(li66, ul13);
    			append_dev(ul13, li52);
    			append_dev(li52, a50);
    			append_dev(a50, div99);
    			append_dev(div99, i62);
    			append_dev(a50, t151);
    			append_dev(a50, div100);
    			append_dev(div100, t152);
    			append_dev(div100, i63);
    			append_dev(li52, t153);
    			append_dev(li52, ul11);
    			append_dev(ul11, li50);
    			append_dev(li50, a51);
    			append_dev(a51, div101);
    			append_dev(div101, i64);
    			append_dev(a51, t154);
    			append_dev(a51, div102);
    			append_dev(ul11, t156);
    			append_dev(ul11, li51);
    			append_dev(li51, a52);
    			append_dev(a52, div103);
    			append_dev(div103, i65);
    			append_dev(a52, t157);
    			append_dev(a52, div104);
    			append_dev(ul13, t159);
    			append_dev(ul13, li56);
    			append_dev(li56, a53);
    			append_dev(a53, div105);
    			append_dev(div105, i66);
    			append_dev(a53, t160);
    			append_dev(a53, div106);
    			append_dev(div106, t161);
    			append_dev(div106, i67);
    			append_dev(li56, t162);
    			append_dev(li56, ul12);
    			append_dev(ul12, li53);
    			append_dev(li53, a54);
    			append_dev(a54, div107);
    			append_dev(div107, i68);
    			append_dev(a54, t163);
    			append_dev(a54, div108);
    			append_dev(ul12, t165);
    			append_dev(ul12, li54);
    			append_dev(li54, a55);
    			append_dev(a55, div109);
    			append_dev(div109, i69);
    			append_dev(a55, t166);
    			append_dev(a55, div110);
    			append_dev(ul12, t168);
    			append_dev(ul12, li55);
    			append_dev(li55, a56);
    			append_dev(a56, div111);
    			append_dev(div111, i70);
    			append_dev(a56, t169);
    			append_dev(a56, div112);
    			append_dev(ul13, t171);
    			append_dev(ul13, li57);
    			append_dev(li57, a57);
    			append_dev(a57, div113);
    			append_dev(div113, i71);
    			append_dev(a57, t172);
    			append_dev(a57, div114);
    			append_dev(ul13, t174);
    			append_dev(ul13, li58);
    			append_dev(li58, a58);
    			append_dev(a58, div115);
    			append_dev(div115, i72);
    			append_dev(a58, t175);
    			append_dev(a58, div116);
    			append_dev(ul13, t177);
    			append_dev(ul13, li59);
    			append_dev(li59, a59);
    			append_dev(a59, div117);
    			append_dev(div117, i73);
    			append_dev(a59, t178);
    			append_dev(a59, div118);
    			append_dev(ul13, t180);
    			append_dev(ul13, li60);
    			append_dev(li60, a60);
    			append_dev(a60, div119);
    			append_dev(div119, i74);
    			append_dev(a60, t181);
    			append_dev(a60, div120);
    			append_dev(ul13, t183);
    			append_dev(ul13, li61);
    			append_dev(li61, a61);
    			append_dev(a61, div121);
    			append_dev(div121, i75);
    			append_dev(a61, t184);
    			append_dev(a61, div122);
    			append_dev(ul13, t186);
    			append_dev(ul13, li62);
    			append_dev(li62, a62);
    			append_dev(a62, div123);
    			append_dev(div123, i76);
    			append_dev(a62, t187);
    			append_dev(a62, div124);
    			append_dev(ul13, t189);
    			append_dev(ul13, li63);
    			append_dev(li63, a63);
    			append_dev(a63, div125);
    			append_dev(div125, i77);
    			append_dev(a63, t190);
    			append_dev(a63, div126);
    			append_dev(ul13, t192);
    			append_dev(ul13, li64);
    			append_dev(li64, a64);
    			append_dev(a64, div127);
    			append_dev(div127, i78);
    			append_dev(a64, t193);
    			append_dev(a64, div128);
    			append_dev(ul13, t195);
    			append_dev(ul13, li65);
    			append_dev(li65, a65);
    			append_dev(a65, div129);
    			append_dev(div129, i79);
    			append_dev(a65, t196);
    			append_dev(a65, div130);
    			append_dev(ul16, t198);
    			append_dev(ul16, li73);
    			append_dev(li73, a66);
    			append_dev(a66, div131);
    			append_dev(div131, i80);
    			append_dev(a66, t199);
    			append_dev(a66, div132);
    			append_dev(div132, t200);
    			append_dev(div132, i81);
    			append_dev(li73, t201);
    			append_dev(li73, ul14);
    			append_dev(ul14, li67);
    			append_dev(li67, a67);
    			append_dev(a67, div133);
    			append_dev(div133, i82);
    			append_dev(a67, t202);
    			append_dev(a67, div134);
    			append_dev(ul14, t204);
    			append_dev(ul14, li68);
    			append_dev(li68, a68);
    			append_dev(a68, div135);
    			append_dev(div135, i83);
    			append_dev(a68, t205);
    			append_dev(a68, div136);
    			append_dev(ul14, t207);
    			append_dev(ul14, li69);
    			append_dev(li69, a69);
    			append_dev(a69, div137);
    			append_dev(div137, i84);
    			append_dev(a69, t208);
    			append_dev(a69, div138);
    			append_dev(ul14, t210);
    			append_dev(ul14, li70);
    			append_dev(li70, a70);
    			append_dev(a70, div139);
    			append_dev(div139, i85);
    			append_dev(a70, t211);
    			append_dev(a70, div140);
    			append_dev(ul14, t213);
    			append_dev(ul14, li71);
    			append_dev(li71, a71);
    			append_dev(a71, div141);
    			append_dev(div141, i86);
    			append_dev(a71, t214);
    			append_dev(a71, div142);
    			append_dev(ul14, t216);
    			append_dev(ul14, li72);
    			append_dev(li72, a72);
    			append_dev(a72, div143);
    			append_dev(div143, i87);
    			append_dev(a72, t217);
    			append_dev(a72, div144);
    			append_dev(ul16, t219);
    			append_dev(ul16, li77);
    			append_dev(li77, a73);
    			append_dev(a73, div145);
    			append_dev(div145, i88);
    			append_dev(a73, t220);
    			append_dev(a73, div146);
    			append_dev(div146, t221);
    			append_dev(div146, i89);
    			append_dev(li77, t222);
    			append_dev(li77, ul15);
    			append_dev(ul15, li74);
    			append_dev(li74, a74);
    			append_dev(a74, div147);
    			append_dev(div147, i90);
    			append_dev(a74, t223);
    			append_dev(a74, div148);
    			append_dev(ul15, t225);
    			append_dev(ul15, li75);
    			append_dev(li75, a75);
    			append_dev(a75, div149);
    			append_dev(div149, i91);
    			append_dev(a75, t226);
    			append_dev(a75, div150);
    			append_dev(ul15, t228);
    			append_dev(ul15, li76);
    			append_dev(li76, a76);
    			append_dev(a76, div151);
    			append_dev(div151, i92);
    			append_dev(a76, t229);
    			append_dev(a76, div152);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(link);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul16);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MobileMenu", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MobileMenu> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link });
    	return [];
    }

    class MobileMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MobileMenu",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    const file$c = "src/SideMenu.svelte";

    // (7:2) <Link to="/" class="intro-x flex justify-center">
    function create_default_slot_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "alt", "Subvisio");
    			if (img.src !== (img_src_value = "/logo.svg")) attr_dev(img, "src", img_src_value);
    			add_location(img, file$c, 7, 4, 224);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(7:2) <Link to=\\\"/\\\" class=\\\"intro-x flex justify-center\\\">",
    		ctx
    	});

    	return block;
    }

    // (23:10) <Link to="/" class="side-menu {path === '/' ? 'side-menu--active' : ''}">
    function create_default_slot_1$1(ctx) {
    	let div0;
    	let i;
    	let t0;
    	let div1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			i = element("i");
    			t0 = space();
    			div1 = element("div");
    			div1.textContent = "Auction";
    			attr_dev(i, "data-feather", "activity");
    			add_location(i, file$c, 23, 41, 800);
    			attr_dev(div0, "class", "side-menu__icon");
    			add_location(div0, file$c, 23, 12, 771);
    			attr_dev(div1, "class", "side-menu__title");
    			add_location(div1, file$c, 24, 12, 848);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, i);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(23:10) <Link to=\\\"/\\\" class=\\\"side-menu {path === '/' ? 'side-menu--active' : ''}\\\">",
    		ctx
    	});

    	return block;
    }

    // (29:10) <Link to="/crowdloan" class="side-menu {path.startsWith('/crowdloan') ? 'side-menu--active' : '' }">
    function create_default_slot$3(ctx) {
    	let div0;
    	let i;
    	let t0;
    	let div1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			i = element("i");
    			t0 = space();
    			div1 = element("div");
    			div1.textContent = "Crowdloan";
    			attr_dev(i, "data-feather", "activity");
    			add_location(i, file$c, 29, 41, 1089);
    			attr_dev(div0, "class", "side-menu__icon");
    			add_location(div0, file$c, 29, 12, 1060);
    			attr_dev(div1, "class", "side-menu__title");
    			add_location(div1, file$c, 30, 12, 1137);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, i);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(29:10) <Link to=\\\"/crowdloan\\\" class=\\\"side-menu {path.startsWith('/crowdloan') ? 'side-menu--active' : '' }\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let nav;
    	let link0;
    	let t0;
    	let div0;
    	let t1;
    	let ul1;
    	let li2;
    	let a;
    	let div1;
    	let i0;
    	let t2;
    	let div3;
    	let t3;
    	let div2;
    	let i1;
    	let t4;
    	let ul0;
    	let li0;
    	let link1;
    	let t5;
    	let li1;
    	let link2;
    	let current;

    	link0 = new Link({
    			props: {
    				to: "/",
    				class: "intro-x flex justify-center",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "/",
    				class: "side-menu " + (/*path*/ ctx[0] === "/" ? "side-menu--active" : ""),
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				to: "/crowdloan",
    				class: "side-menu " + (/*path*/ ctx[0].startsWith("/crowdloan")
    				? "side-menu--active"
    				: ""),
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			ul1 = element("ul");
    			li2 = element("li");
    			a = element("a");
    			div1 = element("div");
    			i0 = element("i");
    			t2 = space();
    			div3 = element("div");
    			t3 = text("Parachain\n          ");
    			div2 = element("div");
    			i1 = element("i");
    			t4 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			create_component(link1.$$.fragment);
    			t5 = space();
    			li1 = element("li");
    			create_component(link2.$$.fragment);
    			attr_dev(div0, "class", "side-nav__devider my-6");
    			add_location(div0, file$c, 10, 2, 276);
    			attr_dev(i0, "data-feather", "home");
    			add_location(i0, file$c, 14, 37, 423);
    			attr_dev(div1, "class", "side-menu__icon");
    			add_location(div1, file$c, 14, 8, 394);
    			attr_dev(i1, "data-feather", "chevron-down");
    			add_location(i1, file$c, 17, 43, 557);
    			attr_dev(div2, "class", "side-menu__sub-icon");
    			add_location(div2, file$c, 17, 10, 524);
    			attr_dev(div3, "class", "side-menu__title");
    			add_location(div3, file$c, 15, 8, 463);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "side-menu side-menu--active");
    			add_location(a, file$c, 13, 6, 337);
    			add_location(li0, file$c, 21, 8, 670);
    			add_location(li1, file$c, 27, 8, 932);
    			attr_dev(ul0, "class", "side-menu__sub-open");
    			add_location(ul0, file$c, 20, 6, 629);
    			add_location(li2, file$c, 12, 4, 326);
    			add_location(ul1, file$c, 11, 2, 317);
    			attr_dev(nav, "class", "side-nav");
    			add_location(nav, file$c, 5, 0, 145);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			mount_component(link0, nav, null);
    			append_dev(nav, t0);
    			append_dev(nav, div0);
    			append_dev(nav, t1);
    			append_dev(nav, ul1);
    			append_dev(ul1, li2);
    			append_dev(li2, a);
    			append_dev(a, div1);
    			append_dev(div1, i0);
    			append_dev(a, t2);
    			append_dev(a, div3);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, i1);
    			append_dev(li2, t4);
    			append_dev(li2, ul0);
    			append_dev(ul0, li0);
    			mount_component(link1, li0, null);
    			append_dev(ul0, t5);
    			append_dev(ul0, li1);
    			mount_component(link2, li1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};
    			if (dirty & /*path*/ 1) link1_changes.class = "side-menu " + (/*path*/ ctx[0] === "/" ? "side-menu--active" : "");

    			if (dirty & /*$$scope*/ 8) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*path*/ 1) link2_changes.class = "side-menu " + (/*path*/ ctx[0].startsWith("/crowdloan")
    			? "side-menu--active"
    			: "");

    			if (dirty & /*$$scope*/ 8) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let path;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SideMenu", slots, []);
    	const location = useLocation();
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(2, $location = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SideMenu> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Link,
    		useLocation,
    		location,
    		path,
    		$location
    	});

    	$$self.$inject_state = $$props => {
    		if ("path" in $$props) $$invalidate(0, path = $$props.path);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$location*/ 4) {
    			$$invalidate(0, path = $location.pathname);
    		}
    	};

    	return [path, location, $location];
    }

    class SideMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideMenu",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    const file$b = "src/Layout.svelte";
    const get_content_slot_changes = dirty => ({});
    const get_content_slot_context = ctx => ({});
    const get_side_menu_slot_changes = dirty => ({});
    const get_side_menu_slot_context = ctx => ({});
    const get_mobile_menu_slot_changes = dirty => ({});
    const get_mobile_menu_slot_context = ctx => ({});

    // (3:29) Mobile menu
    function fallback_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Mobile menu");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(3:29) Mobile menu",
    		ctx
    	});

    	return block;
    }

    // (11:27) Content area
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Content area");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(11:27) Content area",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div2;
    	let nav;
    	let t1;
    	let div1;
    	let current;
    	const mobile_menu_slot_template = /*#slots*/ ctx[1]["mobile-menu"];
    	const mobile_menu_slot = create_slot(mobile_menu_slot_template, ctx, /*$$scope*/ ctx[0], get_mobile_menu_slot_context);
    	const mobile_menu_slot_or_fallback = mobile_menu_slot || fallback_block_1(ctx);
    	const side_menu_slot_template = /*#slots*/ ctx[1]["side-menu"];
    	const side_menu_slot = create_slot(side_menu_slot_template, ctx, /*$$scope*/ ctx[0], get_side_menu_slot_context);
    	const content_slot_template = /*#slots*/ ctx[1].content;
    	const content_slot = create_slot(content_slot_template, ctx, /*$$scope*/ ctx[0], get_content_slot_context);
    	const content_slot_or_fallback = content_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			if (mobile_menu_slot_or_fallback) mobile_menu_slot_or_fallback.c();
    			t0 = space();
    			div2 = element("div");
    			nav = element("nav");
    			if (side_menu_slot) side_menu_slot.c();
    			t1 = space();
    			div1 = element("div");
    			if (content_slot_or_fallback) content_slot_or_fallback.c();
    			attr_dev(div0, "class", "mobile-menu md:hidden");
    			add_location(div0, file$b, 1, 2, 8);
    			attr_dev(nav, "class", "side-nav");
    			add_location(nav, file$b, 6, 4, 127);
    			attr_dev(div1, "class", "content");
    			add_location(div1, file$b, 9, 4, 197);
    			attr_dev(div2, "class", "flex");
    			add_location(div2, file$b, 5, 2, 104);
    			add_location(div3, file$b, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);

    			if (mobile_menu_slot_or_fallback) {
    				mobile_menu_slot_or_fallback.m(div0, null);
    			}

    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, nav);

    			if (side_menu_slot) {
    				side_menu_slot.m(nav, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			if (content_slot_or_fallback) {
    				content_slot_or_fallback.m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (mobile_menu_slot) {
    				if (mobile_menu_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot(mobile_menu_slot, mobile_menu_slot_template, ctx, /*$$scope*/ ctx[0], dirty, get_mobile_menu_slot_changes, get_mobile_menu_slot_context);
    				}
    			}

    			if (side_menu_slot) {
    				if (side_menu_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot(side_menu_slot, side_menu_slot_template, ctx, /*$$scope*/ ctx[0], dirty, get_side_menu_slot_changes, get_side_menu_slot_context);
    				}
    			}

    			if (content_slot) {
    				if (content_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot(content_slot, content_slot_template, ctx, /*$$scope*/ ctx[0], dirty, get_content_slot_changes, get_content_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mobile_menu_slot_or_fallback, local);
    			transition_in(side_menu_slot, local);
    			transition_in(content_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mobile_menu_slot_or_fallback, local);
    			transition_out(side_menu_slot, local);
    			transition_out(content_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (mobile_menu_slot_or_fallback) mobile_menu_slot_or_fallback.d(detaching);
    			if (side_menu_slot) side_menu_slot.d(detaching);
    			if (content_slot_or_fallback) content_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Layout", slots, ['mobile-menu','side-menu','content']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Layout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layout",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    function l$1(a, b) {
      b.tag = a;
      return b;
    }

    function m$1() {}

    function p$1(a) {
      return function (b) {
        var c = a.length;
        let d = !1,
          e = !1,
          f = !1,
          g = 0;
        b(
          l$1(0, [
            function (h) {
              if (h) {
                d = !0;
              } else if (e) {
                f = !0;
              } else {
                for (e = f = !0; f && !d; ) {
                  g < c ? ((h = a[g]), (g = (g + 1) | 0), (f = !1), b(l$1(1, [h]))) : ((d = !0), b(0));
                }
                e = !1;
              }
            },
          ])
        );
      };
    }

    function r$2() {}

    function t$2(a) {
      a(0);
    }

    function u$2(a) {
      let b = !1;
      a(
        l$1(0, [
          function (c) {
            c ? (b = !0) : b || a(0);
          },
        ])
      );
    }

    function x$2(a) {
      if (null === a || a[0] !== v$2) {
        return a;
      }
      if (0 !== (a = a[1])) {
        return [v$2, (a - 1) | 0];
      }
    }

    function z$2(a) {
      return function (b) {
        return function (c) {
          function d(b) {
            'number' == typeof b
              ? k &&
                ((k = !1),
                void 0 !== (b = e.shift())
                  ? ((b = a(x$2(b))), (k = !0), b(d))
                  : q
                  ? c(0)
                  : g || ((g = !0), f(0)))
              : b.tag
              ? k && (c(b), n ? (n = !1) : h(0))
              : ((h = b = b[0]), (n = !1), b(0));
          }
          let e = [],
            f = m$1,
            g = !1,
            h = m$1,
            k = !1,
            n = !1,
            q = !1;
          b(function (b) {
            'number' == typeof b
              ? q || ((q = !0), k || 0 !== e.length || c(0))
              : b.tag
              ? q || ((b = b[0]), (g = !1), k ? e.push(b) : ((b = a(b)), (k = !0), b(d)))
              : (f = b[0]);
          });
          c(
            l$1(0, [
              function (c) {
                if (c) {
                  if ((q || ((q = !0), f(1)), k)) {
                    return (k = !1), h(1);
                  }
                } else {
                  q || g || ((g = !0), f(0)), k && !n && ((n = !0), h(0));
                }
              },
            ])
          );
        };
      };
    }

    function B$1(a) {
      return a;
    }

    function C(a) {
      return a(0);
    }

    function D$1(a) {
      return function (b) {
        return function (c) {
          let e = m$1,
            f = !1,
            g = [],
            h = !1;
          b(function (b) {
            'number' == typeof b
              ? h || ((h = !0), 0 === g.length && c(0))
              : b.tag
              ? h ||
                ((f = !1),
                (function (a) {
                  function b(a) {
                    'number' == typeof a
                      ? 0 !== g.length &&
                        ((g = g.filter(d)),
                        (a = 0 === g.length),
                        h && a ? c(0) : !f && a && ((f = !0), e(0)))
                      : a.tag
                      ? 0 !== g.length && (c(l$1(1, [a[0]])), k(0))
                      : ((k = a = a[0]), (g = g.concat(a)), a(0));
                  }
                  function d(a) {
                    return a !== k;
                  }
                  let k = m$1;
                  1 === a.length ? a(b) : a.bind(null, b);
                })(a(b[0])),
                f || ((f = !0), e(0)))
              : (e = b[0]);
          });
          c(
            l$1(0, [
              function (a) {
                a
                  ? (h || ((h = !0), e(a)),
                    g.forEach(function (c) {
                      return c(a);
                    }),
                    (g = []))
                  : (f || h ? (f = !1) : ((f = !0), e(0)), g.forEach(C));
              },
            ])
          );
        };
      };
    }

    function E$1(a) {
      return a;
    }

    function H$1(a) {
      return function (b) {
        return function (c) {
          let d = !1;
          return b(function (e) {
            if ('number' == typeof e) {
              d || ((d = !0), c(e));
            } else if (e.tag) {
              d || (a(e[0]), c(e));
            } else {
              var g = e[0];
              c(
                l$1(0, [
                  function (a) {
                    if (!d) {
                      return a && (d = !0), g(a);
                    }
                  },
                ])
              );
            }
          });
        };
      };
    }

    function J$1(a) {
      a(0);
    }

    function K(a) {
      return function (b) {
        return function (c) {
          function d(a) {
            h &&
              ('number' == typeof a
                ? ((h = !1), n ? c(a) : f || ((f = !0), e(0)))
                : a.tag
                ? (c(a), k ? (k = !1) : g(0))
                : ((g = a = a[0]), (k = !1), a(0)));
          }
          let e = m$1,
            f = !1,
            g = m$1,
            h = !1,
            k = !1,
            n = !1;
          b(function (b) {
            'number' == typeof b
              ? n || ((n = !0), h || c(0))
              : b.tag
              ? n ||
                (h && (g(1), (g = m$1)), f ? (f = !1) : ((f = !0), e(0)), (b = a(b[0])), (h = !0), b(d))
              : (e = b[0]);
          });
          c(
            l$1(0, [
              function (a) {
                if (a) {
                  if ((n || ((n = !0), e(1)), h)) {
                    return (h = !1), g(1);
                  }
                } else {
                  n || f || ((f = !0), e(0)), h && !k && ((k = !0), g(0));
                }
              },
            ])
          );
        };
      };
    }

    function M$1(a) {
      return function (b) {
        return function (c) {
          let d = [],
            e = m$1;
          return b(function (b) {
            'number' == typeof b
              ? p$1(d)(c)
              : b.tag
              ? (d.length >= a && 0 < a && d.shift(), d.push(b[0]), e(0))
              : ((b = b[0]), 0 >= a ? (b(1), u$2(c)) : ((e = b), b(0)));
          });
        };
      };
    }

    function N$1(a) {
      return function (b) {
        let c = m$1,
          d = !1;
        b(function (e) {
          'number' == typeof e ? (d = !0) : e.tag ? d || (a(e[0]), c(0)) : ((c = e = e[0]), e(0));
        });
        return {
          unsubscribe: function () {
            if (!d) {
              return (d = !0), c(1);
            }
          },
        };
      };
    }

    function O$1() {}

    function concat$1(a) {
      return z$2(B$1)(p$1(a));
    }

    function filter$1(a) {
      return function (b) {
        return function (c) {
          let d = m$1;
          return b(function (b) {
            'number' == typeof b ? c(b) : b.tag ? (a(b[0]) ? c(b) : d(0)) : ((d = b[0]), c(b));
          });
        };
      };
    }

    function fromValue$1(a) {
      return function (b) {
        let c = !1;
        b(
          l$1(0, [
            function (d) {
              d ? (c = !0) : c || ((c = !0), b(l$1(1, [a])), b(0));
            },
          ])
        );
      };
    }

    function make$1(a) {
      return function (b) {
        let c = r$2,
          d = !1;
        c = a({
          next: function (a) {
            d || b(l$1(1, [a]));
          },
          complete: function () {
            d || ((d = !0), b(0));
          },
        });
        b(
          l$1(0, [
            function (a) {
              if (a && !d) {
                return (d = !0), c();
              }
            },
          ])
        );
      };
    }

    function makeSubject$1() {
      let a = [],
        b = !1;
      return {
        source: function (c) {
          function b(a) {
            return a !== c;
          }
          a = a.concat(c);
          c(
            l$1(0, [
              function (c) {
                c && (a = a.filter(b));
              },
            ])
          );
        },
        next: function (c) {
          b ||
            a.forEach(function (a) {
              a(l$1(1, [c]));
            });
        },
        complete: function () {
          b || ((b = !0), a.forEach(t$2));
        },
      };
    }

    function map$1(a) {
      return function (b) {
        return function (c) {
          return b(function (b) {
            b = 'number' == typeof b ? 0 : b.tag ? l$1(1, [a(b[0])]) : l$1(0, [b[0]]);
            c(b);
          });
        };
      };
    }

    function merge$1(a) {
      return D$1(E$1)(p$1(a));
    }

    function onEnd$1(a) {
      return function (b) {
        return function (c) {
          let d = !1;
          return b(function (b) {
            if ('number' == typeof b) {
              if (d) {
                return;
              }
              d = !0;
              c(b);
              return a();
            }
            if (b.tag) {
              d || c(b);
            } else {
              var e = b[0];
              c(
                l$1(0, [
                  function (c) {
                    if (!d) {
                      return c ? ((d = !0), e(c), a()) : e(c);
                    }
                  },
                ])
              );
            }
          });
        };
      };
    }

    function onStart$1(a) {
      return function (b) {
        return function (c) {
          return b(function (b) {
            'number' == typeof b ? c(b) : b.tag ? c(b) : (c(b), a());
          });
        };
      };
    }

    function publish$1(a) {
      return N$1(O$1)(a);
    }

    function scan$1(a, b) {
      return (function (a, b) {
        return function (c) {
          return function (d) {
            let e = b;
            return c(function (c) {
              'number' == typeof c
                ? (c = 0)
                : c.tag
                ? ((e = a(e, c[0])), (c = l$1(1, [e])))
                : (c = l$1(0, [c[0]]));
              d(c);
            });
          };
        };
      })(a, b);
    }

    function share$1(a) {
      function b(a) {
        'number' == typeof a
          ? (c.forEach(J$1), (c = []))
          : a.tag
          ? ((e = !1),
            c.forEach(function (b) {
              b(a);
            }))
          : (d = a[0]);
      }
      let c = [],
        d = m$1,
        e = !1;
      return function (f) {
        function g(a) {
          return a !== f;
        }
        c = c.concat(f);
        1 === c.length && a(b);
        f(
          l$1(0, [
            function (a) {
              if (a) {
                if (((c = c.filter(g)), 0 === c.length)) {
                  return d(1);
                }
              } else {
                e || ((e = !0), d(a));
              }
            },
          ])
        );
      };
    }

    function take$1(a) {
      return function (b) {
        return function (c) {
          let d = !1,
            e = 0,
            f = m$1;
          b(function (b) {
            'number' == typeof b
              ? d || ((d = !0), c(0))
              : b.tag
              ? e < a && !d && ((e = (e + 1) | 0), c(b), !d && e >= a && ((d = !0), c(0), f(1)))
              : ((b = b[0]), 0 >= a ? ((d = !0), c(0), b(1)) : (f = b));
          });
          c(
            l$1(0, [
              function (b) {
                if (!d) {
                  if (b) {
                    return (d = !0), f(1);
                  }
                  if (e < a) {
                    return f(0);
                  }
                }
              },
            ])
          );
        };
      };
    }

    function takeUntil$1(a) {
      return function (b) {
        return function (c) {
          function d(a) {
            'number' != typeof a && (a.tag ? ((e = !0), f(1), c(0)) : ((g = a = a[0]), a(0)));
          }
          let e = !1,
            f = m$1,
            g = m$1;
          b(function (b) {
            'number' == typeof b ? e || ((e = !0), g(1), c(0)) : b.tag ? e || c(b) : ((f = b[0]), a(d));
          });
          c(
            l$1(0, [
              function (a) {
                if (!e) {
                  return a ? ((e = !0), f(1), g(1)) : f(0);
                }
              },
            ])
          );
        };
      };
    }

    function toPromise$1(a) {
      return new Promise(function (b) {
        M$1(1)(a)(function (a) {
          if ('number' != typeof a) {
            if (a.tag) {
              b(a[0]);
            } else {
              a[0](0);
            }
          }
        });
      });
    }

    var v$2 = [];
      'function' == typeof Symbol
          ? Symbol.observable || (Symbol.observable = Symbol('observable'))
          : '@@observable';

    function _typeof$2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }

    /**
     * Return true if `value` is object-like. A value is object-like if it's not
     * `null` and has a `typeof` result of "object".
     */
    function isObjectLike$1(value) {
      return _typeof$2(value) == 'object' && value !== null;
    }

    var SYMBOL_TO_STRING_TAG = typeof Symbol === 'function' && Symbol.toStringTag != null ? Symbol.toStringTag : '@@toStringTag';

    /**
     * Represents a location in a Source.
     */

    /**
     * Takes a Source and a UTF-8 character offset, and returns the corresponding
     * line and column as a SourceLocation.
     */
    function getLocation(source, position) {
      var lineRegexp = /\r\n|[\n\r]/g;
      var line = 1;
      var column = position + 1;
      var match;

      while ((match = lineRegexp.exec(source.body)) && match.index < position) {
        line += 1;
        column = position + 1 - (match.index + match[0].length);
      }

      return {
        line: line,
        column: column
      };
    }

    /**
     * Render a helpful description of the location in the GraphQL Source document.
     */

    function printLocation(location) {
      return printSourceLocation(location.source, getLocation(location.source, location.start));
    }
    /**
     * Render a helpful description of the location in the GraphQL Source document.
     */

    function printSourceLocation(source, sourceLocation) {
      var firstLineColumnOffset = source.locationOffset.column - 1;
      var body = whitespace(firstLineColumnOffset) + source.body;
      var lineIndex = sourceLocation.line - 1;
      var lineOffset = source.locationOffset.line - 1;
      var lineNum = sourceLocation.line + lineOffset;
      var columnOffset = sourceLocation.line === 1 ? firstLineColumnOffset : 0;
      var columnNum = sourceLocation.column + columnOffset;
      var locationStr = "".concat(source.name, ":").concat(lineNum, ":").concat(columnNum, "\n");
      var lines = body.split(/\r\n|[\n\r]/g);
      var locationLine = lines[lineIndex]; // Special case for minified documents

      if (locationLine.length > 120) {
        var subLineIndex = Math.floor(columnNum / 80);
        var subLineColumnNum = columnNum % 80;
        var subLines = [];

        for (var i = 0; i < locationLine.length; i += 80) {
          subLines.push(locationLine.slice(i, i + 80));
        }

        return locationStr + printPrefixedLines([["".concat(lineNum), subLines[0]]].concat(subLines.slice(1, subLineIndex + 1).map(function (subLine) {
          return ['', subLine];
        }), [[' ', whitespace(subLineColumnNum - 1) + '^'], ['', subLines[subLineIndex + 1]]]));
      }

      return locationStr + printPrefixedLines([// Lines specified like this: ["prefix", "string"],
      ["".concat(lineNum - 1), lines[lineIndex - 1]], ["".concat(lineNum), locationLine], ['', whitespace(columnNum - 1) + '^'], ["".concat(lineNum + 1), lines[lineIndex + 1]]]);
    }

    function printPrefixedLines(lines) {
      var existingLines = lines.filter(function (_ref) {
        _ref[0];
            var line = _ref[1];
        return line !== undefined;
      });
      var padLen = Math.max.apply(Math, existingLines.map(function (_ref2) {
        var prefix = _ref2[0];
        return prefix.length;
      }));
      return existingLines.map(function (_ref3) {
        var prefix = _ref3[0],
            line = _ref3[1];
        return leftPad(padLen, prefix) + (line ? ' | ' + line : ' |');
      }).join('\n');
    }

    function whitespace(len) {
      return Array(len + 1).join(' ');
    }

    function leftPad(len, str) {
      return whitespace(len - str.length) + str;
    }

    function _typeof$1(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

    function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

    function _possibleConstructorReturn(self, call) { if (call && (_typeof$1(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

    function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

    function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

    function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

    function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

    function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

    function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

    function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
    /**
     * A GraphQLError describes an Error found during the parse, validate, or
     * execute phases of performing a GraphQL operation. In addition to a message
     * and stack trace, it also includes information about the locations in a
     * GraphQL document and/or execution result that correspond to the Error.
     */

    var GraphQLError = /*#__PURE__*/function (_Error) {
      _inherits(GraphQLError, _Error);

      var _super = _createSuper(GraphQLError);

      /**
       * A message describing the Error for debugging purposes.
       *
       * Enumerable, and appears in the result of JSON.stringify().
       *
       * Note: should be treated as readonly, despite invariant usage.
       */

      /**
       * An array of { line, column } locations within the source GraphQL document
       * which correspond to this error.
       *
       * Errors during validation often contain multiple locations, for example to
       * point out two things with the same name. Errors during execution include a
       * single location, the field which produced the error.
       *
       * Enumerable, and appears in the result of JSON.stringify().
       */

      /**
       * An array describing the JSON-path into the execution response which
       * corresponds to this error. Only included for errors during execution.
       *
       * Enumerable, and appears in the result of JSON.stringify().
       */

      /**
       * An array of GraphQL AST Nodes corresponding to this error.
       */

      /**
       * The source GraphQL document for the first location of this error.
       *
       * Note that if this Error represents more than one node, the source may not
       * represent nodes after the first node.
       */

      /**
       * An array of character offsets within the source GraphQL document
       * which correspond to this error.
       */

      /**
       * The original error thrown from a field resolver during execution.
       */

      /**
       * Extension fields to add to the formatted error.
       */
      function GraphQLError(message, nodes, source, positions, path, originalError, extensions) {
        var _locations2, _source2, _positions2, _extensions2;

        var _this;

        _classCallCheck(this, GraphQLError);

        _this = _super.call(this, message); // Compute list of blame nodes.

        var _nodes = Array.isArray(nodes) ? nodes.length !== 0 ? nodes : undefined : nodes ? [nodes] : undefined; // Compute locations in the source for the given nodes/positions.


        var _source = source;

        if (!_source && _nodes) {
          var _nodes$0$loc;

          _source = (_nodes$0$loc = _nodes[0].loc) === null || _nodes$0$loc === void 0 ? void 0 : _nodes$0$loc.source;
        }

        var _positions = positions;

        if (!_positions && _nodes) {
          _positions = _nodes.reduce(function (list, node) {
            if (node.loc) {
              list.push(node.loc.start);
            }

            return list;
          }, []);
        }

        if (_positions && _positions.length === 0) {
          _positions = undefined;
        }

        var _locations;

        if (positions && source) {
          _locations = positions.map(function (pos) {
            return getLocation(source, pos);
          });
        } else if (_nodes) {
          _locations = _nodes.reduce(function (list, node) {
            if (node.loc) {
              list.push(getLocation(node.loc.source, node.loc.start));
            }

            return list;
          }, []);
        }

        var _extensions = extensions;

        if (_extensions == null && originalError != null) {
          var originalExtensions = originalError.extensions;

          if (isObjectLike$1(originalExtensions)) {
            _extensions = originalExtensions;
          }
        }

        Object.defineProperties(_assertThisInitialized(_this), {
          name: {
            value: 'GraphQLError'
          },
          message: {
            value: message,
            // By being enumerable, JSON.stringify will include `message` in the
            // resulting output. This ensures that the simplest possible GraphQL
            // service adheres to the spec.
            enumerable: true,
            writable: true
          },
          locations: {
            // Coercing falsy values to undefined ensures they will not be included
            // in JSON.stringify() when not provided.
            value: (_locations2 = _locations) !== null && _locations2 !== void 0 ? _locations2 : undefined,
            // By being enumerable, JSON.stringify will include `locations` in the
            // resulting output. This ensures that the simplest possible GraphQL
            // service adheres to the spec.
            enumerable: _locations != null
          },
          path: {
            // Coercing falsy values to undefined ensures they will not be included
            // in JSON.stringify() when not provided.
            value: path !== null && path !== void 0 ? path : undefined,
            // By being enumerable, JSON.stringify will include `path` in the
            // resulting output. This ensures that the simplest possible GraphQL
            // service adheres to the spec.
            enumerable: path != null
          },
          nodes: {
            value: _nodes !== null && _nodes !== void 0 ? _nodes : undefined
          },
          source: {
            value: (_source2 = _source) !== null && _source2 !== void 0 ? _source2 : undefined
          },
          positions: {
            value: (_positions2 = _positions) !== null && _positions2 !== void 0 ? _positions2 : undefined
          },
          originalError: {
            value: originalError
          },
          extensions: {
            // Coercing falsy values to undefined ensures they will not be included
            // in JSON.stringify() when not provided.
            value: (_extensions2 = _extensions) !== null && _extensions2 !== void 0 ? _extensions2 : undefined,
            // By being enumerable, JSON.stringify will include `path` in the
            // resulting output. This ensures that the simplest possible GraphQL
            // service adheres to the spec.
            enumerable: _extensions != null
          }
        }); // Include (non-enumerable) stack trace.

        if (originalError !== null && originalError !== void 0 && originalError.stack) {
          Object.defineProperty(_assertThisInitialized(_this), 'stack', {
            value: originalError.stack,
            writable: true,
            configurable: true
          });
          return _possibleConstructorReturn(_this);
        } // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2317')


        if (Error.captureStackTrace) {
          Error.captureStackTrace(_assertThisInitialized(_this), GraphQLError);
        } else {
          Object.defineProperty(_assertThisInitialized(_this), 'stack', {
            value: Error().stack,
            writable: true,
            configurable: true
          });
        }

        return _this;
      }

      _createClass$1(GraphQLError, [{
        key: "toString",
        value: function toString() {
          return printError(this);
        } // FIXME: workaround to not break chai comparisons, should be remove in v16
        // $FlowFixMe[unsupported-syntax] Flow doesn't support computed properties yet

      }, {
        key: SYMBOL_TO_STRING_TAG,
        get: function get() {
          return 'Object';
        }
      }]);

      return GraphQLError;
    }( /*#__PURE__*/_wrapNativeSuper(Error));
    /**
     * Prints a GraphQLError to a string, representing useful location information
     * about the error's position in the source.
     */

    function printError(error) {
      var output = error.message;

      if (error.nodes) {
        for (var _i2 = 0, _error$nodes2 = error.nodes; _i2 < _error$nodes2.length; _i2++) {
          var node = _error$nodes2[_i2];

          if (node.loc) {
            output += '\n\n' + printLocation(node.loc);
          }
        }
      } else if (error.source && error.locations) {
        for (var _i4 = 0, _error$locations2 = error.locations; _i4 < _error$locations2.length; _i4++) {
          var location = _error$locations2[_i4];
          output += '\n\n' + printSourceLocation(error.source, location);
        }
      }

      return output;
    }

    /**
     * The set of allowed kind values for AST nodes.
     */
    var Kind = Object.freeze({
      // Name
      NAME: 'Name',
      // Document
      DOCUMENT: 'Document',
      OPERATION_DEFINITION: 'OperationDefinition',
      VARIABLE_DEFINITION: 'VariableDefinition',
      SELECTION_SET: 'SelectionSet',
      FIELD: 'Field',
      ARGUMENT: 'Argument',
      // Fragments
      FRAGMENT_SPREAD: 'FragmentSpread',
      INLINE_FRAGMENT: 'InlineFragment',
      FRAGMENT_DEFINITION: 'FragmentDefinition',
      // Values
      VARIABLE: 'Variable',
      INT: 'IntValue',
      FLOAT: 'FloatValue',
      STRING: 'StringValue',
      BOOLEAN: 'BooleanValue',
      NULL: 'NullValue',
      ENUM: 'EnumValue',
      LIST: 'ListValue',
      OBJECT: 'ObjectValue',
      OBJECT_FIELD: 'ObjectField',
      // Directives
      DIRECTIVE: 'Directive',
      // Types
      NAMED_TYPE: 'NamedType',
      LIST_TYPE: 'ListType',
      NON_NULL_TYPE: 'NonNullType',
      // Type System Definitions
      SCHEMA_DEFINITION: 'SchemaDefinition',
      OPERATION_TYPE_DEFINITION: 'OperationTypeDefinition',
      // Type Definitions
      SCALAR_TYPE_DEFINITION: 'ScalarTypeDefinition',
      OBJECT_TYPE_DEFINITION: 'ObjectTypeDefinition',
      FIELD_DEFINITION: 'FieldDefinition',
      INPUT_VALUE_DEFINITION: 'InputValueDefinition',
      INTERFACE_TYPE_DEFINITION: 'InterfaceTypeDefinition',
      UNION_TYPE_DEFINITION: 'UnionTypeDefinition',
      ENUM_TYPE_DEFINITION: 'EnumTypeDefinition',
      ENUM_VALUE_DEFINITION: 'EnumValueDefinition',
      INPUT_OBJECT_TYPE_DEFINITION: 'InputObjectTypeDefinition',
      // Directive Definitions
      DIRECTIVE_DEFINITION: 'DirectiveDefinition',
      // Type System Extensions
      SCHEMA_EXTENSION: 'SchemaExtension',
      // Type Extensions
      SCALAR_TYPE_EXTENSION: 'ScalarTypeExtension',
      OBJECT_TYPE_EXTENSION: 'ObjectTypeExtension',
      INTERFACE_TYPE_EXTENSION: 'InterfaceTypeExtension',
      UNION_TYPE_EXTENSION: 'UnionTypeExtension',
      ENUM_TYPE_EXTENSION: 'EnumTypeExtension',
      INPUT_OBJECT_TYPE_EXTENSION: 'InputObjectTypeExtension'
    });
    /**
     * The enum type representing the possible kind values of AST nodes.
     */

    /**
     * Produces a GraphQLError representing a syntax error, containing useful
     * descriptive information about the syntax error's position in the source.
     */

    function syntaxError(source, position, description) {
      return new GraphQLError("Syntax Error: ".concat(description), undefined, source, [position]);
    }

    function invariant(condition, message) {
      var booleanCondition = Boolean(condition); // istanbul ignore else (See transformation done in './resources/inlineInvariant.js')

      if (!booleanCondition) {
        throw new Error(message != null ? message : 'Unexpected invariant triggered.');
      }
    }

    // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2317')
    var nodejsCustomInspectSymbol = typeof Symbol === 'function' && typeof Symbol.for === 'function' ? Symbol.for('nodejs.util.inspect.custom') : undefined;

    /**
     * The `defineInspect()` function defines `inspect()` prototype method as alias of `toJSON`
     */

    function defineInspect(classObject) {
      var fn = classObject.prototype.toJSON;
      typeof fn === 'function' || invariant(0);
      classObject.prototype.inspect = fn; // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2317')

      if (nodejsCustomInspectSymbol) {
        classObject.prototype[nodejsCustomInspectSymbol] = fn;
      }
    }

    /**
     * Contains a range of UTF-8 character offsets and token references that
     * identify the region of the source from which the AST derived.
     */
    var Location = /*#__PURE__*/function () {
      /**
       * The character offset at which this Node begins.
       */

      /**
       * The character offset at which this Node ends.
       */

      /**
       * The Token at which this Node begins.
       */

      /**
       * The Token at which this Node ends.
       */

      /**
       * The Source document the AST represents.
       */
      function Location(startToken, endToken, source) {
        this.start = startToken.start;
        this.end = endToken.end;
        this.startToken = startToken;
        this.endToken = endToken;
        this.source = source;
      }

      var _proto = Location.prototype;

      _proto.toJSON = function toJSON() {
        return {
          start: this.start,
          end: this.end
        };
      };

      return Location;
    }(); // Print a simplified form when appearing in `inspect` and `util.inspect`.

    defineInspect(Location);
    /**
     * Represents a range of characters represented by a lexical token
     * within a Source.
     */

    var Token$1 = /*#__PURE__*/function () {
      /**
       * The kind of Token.
       */

      /**
       * The character offset at which this Node begins.
       */

      /**
       * The character offset at which this Node ends.
       */

      /**
       * The 1-indexed line number on which this Token appears.
       */

      /**
       * The 1-indexed column number at which this Token begins.
       */

      /**
       * For non-punctuation tokens, represents the interpreted value of the token.
       */

      /**
       * Tokens exist as nodes in a double-linked-list amongst all tokens
       * including ignored tokens. <SOF> is always the first node and <EOF>
       * the last.
       */
      function Token(kind, start, end, line, column, prev, value) {
        this.kind = kind;
        this.start = start;
        this.end = end;
        this.line = line;
        this.column = column;
        this.value = value;
        this.prev = prev;
        this.next = null;
      }

      var _proto2 = Token.prototype;

      _proto2.toJSON = function toJSON() {
        return {
          kind: this.kind,
          value: this.value,
          line: this.line,
          column: this.column
        };
      };

      return Token;
    }(); // Print a simplified form when appearing in `inspect` and `util.inspect`.

    defineInspect(Token$1);
    /**
     * @internal
     */

    function isNode(maybeNode) {
      return maybeNode != null && typeof maybeNode.kind === 'string';
    }
    /**
     * The list of all possible AST node types.
     */

    /**
     * An exported enum describing the different kinds of tokens that the
     * lexer emits.
     */
    var TokenKind = Object.freeze({
      SOF: '<SOF>',
      EOF: '<EOF>',
      BANG: '!',
      DOLLAR: '$',
      AMP: '&',
      PAREN_L: '(',
      PAREN_R: ')',
      SPREAD: '...',
      COLON: ':',
      EQUALS: '=',
      AT: '@',
      BRACKET_L: '[',
      BRACKET_R: ']',
      BRACE_L: '{',
      PIPE: '|',
      BRACE_R: '}',
      NAME: 'Name',
      INT: 'Int',
      FLOAT: 'Float',
      STRING: 'String',
      BLOCK_STRING: 'BlockString',
      COMMENT: 'Comment'
    });
    /**
     * The enum type representing the token kinds values.
     */

    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
    var MAX_ARRAY_LENGTH = 10;
    var MAX_RECURSIVE_DEPTH = 2;
    /**
     * Used to print values in error messages.
     */

    function inspect(value) {
      return formatValue(value, []);
    }

    function formatValue(value, seenValues) {
      switch (_typeof(value)) {
        case 'string':
          return JSON.stringify(value);

        case 'function':
          return value.name ? "[function ".concat(value.name, "]") : '[function]';

        case 'object':
          if (value === null) {
            return 'null';
          }

          return formatObjectValue(value, seenValues);

        default:
          return String(value);
      }
    }

    function formatObjectValue(value, previouslySeenValues) {
      if (previouslySeenValues.indexOf(value) !== -1) {
        return '[Circular]';
      }

      var seenValues = [].concat(previouslySeenValues, [value]);
      var customInspectFn = getCustomFn(value);

      if (customInspectFn !== undefined) {
        var customValue = customInspectFn.call(value); // check for infinite recursion

        if (customValue !== value) {
          return typeof customValue === 'string' ? customValue : formatValue(customValue, seenValues);
        }
      } else if (Array.isArray(value)) {
        return formatArray(value, seenValues);
      }

      return formatObject(value, seenValues);
    }

    function formatObject(object, seenValues) {
      var keys = Object.keys(object);

      if (keys.length === 0) {
        return '{}';
      }

      if (seenValues.length > MAX_RECURSIVE_DEPTH) {
        return '[' + getObjectTag(object) + ']';
      }

      var properties = keys.map(function (key) {
        var value = formatValue(object[key], seenValues);
        return key + ': ' + value;
      });
      return '{ ' + properties.join(', ') + ' }';
    }

    function formatArray(array, seenValues) {
      if (array.length === 0) {
        return '[]';
      }

      if (seenValues.length > MAX_RECURSIVE_DEPTH) {
        return '[Array]';
      }

      var len = Math.min(MAX_ARRAY_LENGTH, array.length);
      var remaining = array.length - len;
      var items = [];

      for (var i = 0; i < len; ++i) {
        items.push(formatValue(array[i], seenValues));
      }

      if (remaining === 1) {
        items.push('... 1 more item');
      } else if (remaining > 1) {
        items.push("... ".concat(remaining, " more items"));
      }

      return '[' + items.join(', ') + ']';
    }

    function getCustomFn(object) {
      var customInspectFn = object[String(nodejsCustomInspectSymbol)];

      if (typeof customInspectFn === 'function') {
        return customInspectFn;
      }

      if (typeof object.inspect === 'function') {
        return object.inspect;
      }
    }

    function getObjectTag(object) {
      var tag = Object.prototype.toString.call(object).replace(/^\[object /, '').replace(/]$/, '');

      if (tag === 'Object' && typeof object.constructor === 'function') {
        var name = object.constructor.name;

        if (typeof name === 'string' && name !== '') {
          return name;
        }
      }

      return tag;
    }

    function devAssert(condition, message) {
      var booleanCondition = Boolean(condition); // istanbul ignore else (See transformation done in './resources/inlineInvariant.js')

      if (!booleanCondition) {
        throw new Error(message);
      }
    }

    /**
     * A replacement for instanceof which includes an error warning when multi-realm
     * constructors are detected.
     */
    // See: https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production
    // See: https://webpack.js.org/guides/production/
    var instanceOf = process.env.NODE_ENV === 'production' ? // istanbul ignore next (See: 'https://github.com/graphql/graphql-js/issues/2317')
    // eslint-disable-next-line no-shadow
    function instanceOf(value, constructor) {
      return value instanceof constructor;
    } : // eslint-disable-next-line no-shadow
    function instanceOf(value, constructor) {
      if (value instanceof constructor) {
        return true;
      }

      if (value) {
        var valueClass = value.constructor;
        var className = constructor.name;

        if (className && valueClass && valueClass.name === className) {
          throw new Error("Cannot use ".concat(className, " \"").concat(value, "\" from another module or realm.\n\nEnsure that there is only one instance of \"graphql\" in the node_modules\ndirectory. If different versions of \"graphql\" are the dependencies of other\nrelied on modules, use \"resolutions\" to ensure only one version is installed.\n\nhttps://yarnpkg.com/en/docs/selective-version-resolutions\n\nDuplicate \"graphql\" modules cannot be used at the same time since different\nversions may have different capabilities and behavior. The data from one\nversion used in the function from another could produce confusing and\nspurious results."));
        }
      }

      return false;
    };

    function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

    function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

    /**
     * A representation of source input to GraphQL. The `name` and `locationOffset` parameters are
     * optional, but they are useful for clients who store GraphQL documents in source files.
     * For example, if the GraphQL input starts at line 40 in a file named `Foo.graphql`, it might
     * be useful for `name` to be `"Foo.graphql"` and location to be `{ line: 40, column: 1 }`.
     * The `line` and `column` properties in `locationOffset` are 1-indexed.
     */
    var Source = /*#__PURE__*/function () {
      function Source(body) {
        var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GraphQL request';
        var locationOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
          line: 1,
          column: 1
        };
        typeof body === 'string' || devAssert(0, "Body must be a string. Received: ".concat(inspect(body), "."));
        this.body = body;
        this.name = name;
        this.locationOffset = locationOffset;
        this.locationOffset.line > 0 || devAssert(0, 'line in locationOffset is 1-indexed and must be positive.');
        this.locationOffset.column > 0 || devAssert(0, 'column in locationOffset is 1-indexed and must be positive.');
      } // $FlowFixMe[unsupported-syntax] Flow doesn't support computed properties yet


      _createClass(Source, [{
        key: SYMBOL_TO_STRING_TAG,
        get: function get() {
          return 'Source';
        }
      }]);

      return Source;
    }();
    /**
     * Test if the given value is a Source object.
     *
     * @internal
     */

    // eslint-disable-next-line no-redeclare
    function isSource(source) {
      return instanceOf(source, Source);
    }

    /**
     * The set of allowed directive location values.
     */
    var DirectiveLocation = Object.freeze({
      // Request Definitions
      QUERY: 'QUERY',
      MUTATION: 'MUTATION',
      SUBSCRIPTION: 'SUBSCRIPTION',
      FIELD: 'FIELD',
      FRAGMENT_DEFINITION: 'FRAGMENT_DEFINITION',
      FRAGMENT_SPREAD: 'FRAGMENT_SPREAD',
      INLINE_FRAGMENT: 'INLINE_FRAGMENT',
      VARIABLE_DEFINITION: 'VARIABLE_DEFINITION',
      // Type System Definitions
      SCHEMA: 'SCHEMA',
      SCALAR: 'SCALAR',
      OBJECT: 'OBJECT',
      FIELD_DEFINITION: 'FIELD_DEFINITION',
      ARGUMENT_DEFINITION: 'ARGUMENT_DEFINITION',
      INTERFACE: 'INTERFACE',
      UNION: 'UNION',
      ENUM: 'ENUM',
      ENUM_VALUE: 'ENUM_VALUE',
      INPUT_OBJECT: 'INPUT_OBJECT',
      INPUT_FIELD_DEFINITION: 'INPUT_FIELD_DEFINITION'
    });
    /**
     * The enum type representing the directive location values.
     */

    /**
     * Produces the value of a block string from its parsed raw value, similar to
     * CoffeeScript's block string, Python's docstring trim or Ruby's strip_heredoc.
     *
     * This implements the GraphQL spec's BlockStringValue() static algorithm.
     *
     * @internal
     */
    function dedentBlockStringValue(rawString) {
      // Expand a block string's raw value into independent lines.
      var lines = rawString.split(/\r\n|[\n\r]/g); // Remove common indentation from all lines but first.

      var commonIndent = getBlockStringIndentation(rawString);

      if (commonIndent !== 0) {
        for (var i = 1; i < lines.length; i++) {
          lines[i] = lines[i].slice(commonIndent);
        }
      } // Remove leading and trailing blank lines.


      var startLine = 0;

      while (startLine < lines.length && isBlank(lines[startLine])) {
        ++startLine;
      }

      var endLine = lines.length;

      while (endLine > startLine && isBlank(lines[endLine - 1])) {
        --endLine;
      } // Return a string of the lines joined with U+000A.


      return lines.slice(startLine, endLine).join('\n');
    }

    function isBlank(str) {
      for (var i = 0; i < str.length; ++i) {
        if (str[i] !== ' ' && str[i] !== '\t') {
          return false;
        }
      }

      return true;
    }
    /**
     * @internal
     */


    function getBlockStringIndentation(value) {
      var _commonIndent;

      var isFirstLine = true;
      var isEmptyLine = true;
      var indent = 0;
      var commonIndent = null;

      for (var i = 0; i < value.length; ++i) {
        switch (value.charCodeAt(i)) {
          case 13:
            //  \r
            if (value.charCodeAt(i + 1) === 10) {
              ++i; // skip \r\n as one symbol
            }

          // falls through

          case 10:
            //  \n
            isFirstLine = false;
            isEmptyLine = true;
            indent = 0;
            break;

          case 9: //   \t

          case 32:
            //  <space>
            ++indent;
            break;

          default:
            if (isEmptyLine && !isFirstLine && (commonIndent === null || indent < commonIndent)) {
              commonIndent = indent;
            }

            isEmptyLine = false;
        }
      }

      return (_commonIndent = commonIndent) !== null && _commonIndent !== void 0 ? _commonIndent : 0;
    }
    /**
     * Print a block string in the indented block form by adding a leading and
     * trailing blank line. However, if a block string starts with whitespace and is
     * a single-line, adding a leading blank line would strip that whitespace.
     *
     * @internal
     */

    function printBlockString(value) {
      var indentation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var preferMultipleLines = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var isSingleLine = value.indexOf('\n') === -1;
      var hasLeadingSpace = value[0] === ' ' || value[0] === '\t';
      var hasTrailingQuote = value[value.length - 1] === '"';
      var hasTrailingSlash = value[value.length - 1] === '\\';
      var printAsMultipleLines = !isSingleLine || hasTrailingQuote || hasTrailingSlash || preferMultipleLines;
      var result = ''; // Format a multi-line block quote to account for leading space.

      if (printAsMultipleLines && !(isSingleLine && hasLeadingSpace)) {
        result += '\n' + indentation;
      }

      result += indentation ? value.replace(/\n/g, '\n' + indentation) : value;

      if (printAsMultipleLines) {
        result += '\n';
      }

      return '"""' + result.replace(/"""/g, '\\"""') + '"""';
    }

    /**
     * Given a Source object, creates a Lexer for that source.
     * A Lexer is a stateful stream generator in that every time
     * it is advanced, it returns the next token in the Source. Assuming the
     * source lexes, the final Token emitted by the lexer will be of kind
     * EOF, after which the lexer will repeatedly return the same EOF token
     * whenever called.
     */

    var Lexer = /*#__PURE__*/function () {
      /**
       * The previously focused non-ignored token.
       */

      /**
       * The currently focused non-ignored token.
       */

      /**
       * The (1-indexed) line containing the current token.
       */

      /**
       * The character offset at which the current line begins.
       */
      function Lexer(source) {
        var startOfFileToken = new Token$1(TokenKind.SOF, 0, 0, 0, 0, null);
        this.source = source;
        this.lastToken = startOfFileToken;
        this.token = startOfFileToken;
        this.line = 1;
        this.lineStart = 0;
      }
      /**
       * Advances the token stream to the next non-ignored token.
       */


      var _proto = Lexer.prototype;

      _proto.advance = function advance() {
        this.lastToken = this.token;
        var token = this.token = this.lookahead();
        return token;
      }
      /**
       * Looks ahead and returns the next non-ignored token, but does not change
       * the state of Lexer.
       */
      ;

      _proto.lookahead = function lookahead() {
        var token = this.token;

        if (token.kind !== TokenKind.EOF) {
          do {
            var _token$next;

            // Note: next is only mutable during parsing, so we cast to allow this.
            token = (_token$next = token.next) !== null && _token$next !== void 0 ? _token$next : token.next = readToken(this, token);
          } while (token.kind === TokenKind.COMMENT);
        }

        return token;
      };

      return Lexer;
    }();
    /**
     * @internal
     */

    function isPunctuatorTokenKind(kind) {
      return kind === TokenKind.BANG || kind === TokenKind.DOLLAR || kind === TokenKind.AMP || kind === TokenKind.PAREN_L || kind === TokenKind.PAREN_R || kind === TokenKind.SPREAD || kind === TokenKind.COLON || kind === TokenKind.EQUALS || kind === TokenKind.AT || kind === TokenKind.BRACKET_L || kind === TokenKind.BRACKET_R || kind === TokenKind.BRACE_L || kind === TokenKind.PIPE || kind === TokenKind.BRACE_R;
    }

    function printCharCode(code) {
      return (// NaN/undefined represents access beyond the end of the file.
        isNaN(code) ? TokenKind.EOF : // Trust JSON for ASCII.
        code < 0x007f ? JSON.stringify(String.fromCharCode(code)) : // Otherwise print the escaped form.
        "\"\\u".concat(('00' + code.toString(16).toUpperCase()).slice(-4), "\"")
      );
    }
    /**
     * Gets the next token from the source starting at the given position.
     *
     * This skips over whitespace until it finds the next lexable token, then lexes
     * punctuators immediately or calls the appropriate helper function for more
     * complicated tokens.
     */


    function readToken(lexer, prev) {
      var source = lexer.source;
      var body = source.body;
      var bodyLength = body.length;
      var pos = prev.end;

      while (pos < bodyLength) {
        var code = body.charCodeAt(pos);
        var _line = lexer.line;

        var _col = 1 + pos - lexer.lineStart; // SourceCharacter


        switch (code) {
          case 0xfeff: // <BOM>

          case 9: //   \t

          case 32: //  <space>

          case 44:
            //  ,
            ++pos;
            continue;

          case 10:
            //  \n
            ++pos;
            ++lexer.line;
            lexer.lineStart = pos;
            continue;

          case 13:
            //  \r
            if (body.charCodeAt(pos + 1) === 10) {
              pos += 2;
            } else {
              ++pos;
            }

            ++lexer.line;
            lexer.lineStart = pos;
            continue;

          case 33:
            //  !
            return new Token$1(TokenKind.BANG, pos, pos + 1, _line, _col, prev);

          case 35:
            //  #
            return readComment(source, pos, _line, _col, prev);

          case 36:
            //  $
            return new Token$1(TokenKind.DOLLAR, pos, pos + 1, _line, _col, prev);

          case 38:
            //  &
            return new Token$1(TokenKind.AMP, pos, pos + 1, _line, _col, prev);

          case 40:
            //  (
            return new Token$1(TokenKind.PAREN_L, pos, pos + 1, _line, _col, prev);

          case 41:
            //  )
            return new Token$1(TokenKind.PAREN_R, pos, pos + 1, _line, _col, prev);

          case 46:
            //  .
            if (body.charCodeAt(pos + 1) === 46 && body.charCodeAt(pos + 2) === 46) {
              return new Token$1(TokenKind.SPREAD, pos, pos + 3, _line, _col, prev);
            }

            break;

          case 58:
            //  :
            return new Token$1(TokenKind.COLON, pos, pos + 1, _line, _col, prev);

          case 61:
            //  =
            return new Token$1(TokenKind.EQUALS, pos, pos + 1, _line, _col, prev);

          case 64:
            //  @
            return new Token$1(TokenKind.AT, pos, pos + 1, _line, _col, prev);

          case 91:
            //  [
            return new Token$1(TokenKind.BRACKET_L, pos, pos + 1, _line, _col, prev);

          case 93:
            //  ]
            return new Token$1(TokenKind.BRACKET_R, pos, pos + 1, _line, _col, prev);

          case 123:
            // {
            return new Token$1(TokenKind.BRACE_L, pos, pos + 1, _line, _col, prev);

          case 124:
            // |
            return new Token$1(TokenKind.PIPE, pos, pos + 1, _line, _col, prev);

          case 125:
            // }
            return new Token$1(TokenKind.BRACE_R, pos, pos + 1, _line, _col, prev);

          case 34:
            //  "
            if (body.charCodeAt(pos + 1) === 34 && body.charCodeAt(pos + 2) === 34) {
              return readBlockString(source, pos, _line, _col, prev, lexer);
            }

            return readString(source, pos, _line, _col, prev);

          case 45: //  -

          case 48: //  0

          case 49: //  1

          case 50: //  2

          case 51: //  3

          case 52: //  4

          case 53: //  5

          case 54: //  6

          case 55: //  7

          case 56: //  8

          case 57:
            //  9
            return readNumber(source, pos, code, _line, _col, prev);

          case 65: //  A

          case 66: //  B

          case 67: //  C

          case 68: //  D

          case 69: //  E

          case 70: //  F

          case 71: //  G

          case 72: //  H

          case 73: //  I

          case 74: //  J

          case 75: //  K

          case 76: //  L

          case 77: //  M

          case 78: //  N

          case 79: //  O

          case 80: //  P

          case 81: //  Q

          case 82: //  R

          case 83: //  S

          case 84: //  T

          case 85: //  U

          case 86: //  V

          case 87: //  W

          case 88: //  X

          case 89: //  Y

          case 90: //  Z

          case 95: //  _

          case 97: //  a

          case 98: //  b

          case 99: //  c

          case 100: // d

          case 101: // e

          case 102: // f

          case 103: // g

          case 104: // h

          case 105: // i

          case 106: // j

          case 107: // k

          case 108: // l

          case 109: // m

          case 110: // n

          case 111: // o

          case 112: // p

          case 113: // q

          case 114: // r

          case 115: // s

          case 116: // t

          case 117: // u

          case 118: // v

          case 119: // w

          case 120: // x

          case 121: // y

          case 122:
            // z
            return readName(source, pos, _line, _col, prev);
        }

        throw syntaxError(source, pos, unexpectedCharacterMessage(code));
      }

      var line = lexer.line;
      var col = 1 + pos - lexer.lineStart;
      return new Token$1(TokenKind.EOF, bodyLength, bodyLength, line, col, prev);
    }
    /**
     * Report a message that an unexpected character was encountered.
     */


    function unexpectedCharacterMessage(code) {
      if (code < 0x0020 && code !== 0x0009 && code !== 0x000a && code !== 0x000d) {
        return "Cannot contain the invalid character ".concat(printCharCode(code), ".");
      }

      if (code === 39) {
        // '
        return 'Unexpected single quote character (\'), did you mean to use a double quote (")?';
      }

      return "Cannot parse the unexpected character ".concat(printCharCode(code), ".");
    }
    /**
     * Reads a comment token from the source file.
     *
     * #[\u0009\u0020-\uFFFF]*
     */


    function readComment(source, start, line, col, prev) {
      var body = source.body;
      var code;
      var position = start;

      do {
        code = body.charCodeAt(++position);
      } while (!isNaN(code) && ( // SourceCharacter but not LineTerminator
      code > 0x001f || code === 0x0009));

      return new Token$1(TokenKind.COMMENT, start, position, line, col, prev, body.slice(start + 1, position));
    }
    /**
     * Reads a number token from the source file, either a float
     * or an int depending on whether a decimal point appears.
     *
     * Int:   -?(0|[1-9][0-9]*)
     * Float: -?(0|[1-9][0-9]*)(\.[0-9]+)?((E|e)(+|-)?[0-9]+)?
     */


    function readNumber(source, start, firstCode, line, col, prev) {
      var body = source.body;
      var code = firstCode;
      var position = start;
      var isFloat = false;

      if (code === 45) {
        // -
        code = body.charCodeAt(++position);
      }

      if (code === 48) {
        // 0
        code = body.charCodeAt(++position);

        if (code >= 48 && code <= 57) {
          throw syntaxError(source, position, "Invalid number, unexpected digit after 0: ".concat(printCharCode(code), "."));
        }
      } else {
        position = readDigits(source, position, code);
        code = body.charCodeAt(position);
      }

      if (code === 46) {
        // .
        isFloat = true;
        code = body.charCodeAt(++position);
        position = readDigits(source, position, code);
        code = body.charCodeAt(position);
      }

      if (code === 69 || code === 101) {
        // E e
        isFloat = true;
        code = body.charCodeAt(++position);

        if (code === 43 || code === 45) {
          // + -
          code = body.charCodeAt(++position);
        }

        position = readDigits(source, position, code);
        code = body.charCodeAt(position);
      } // Numbers cannot be followed by . or NameStart


      if (code === 46 || isNameStart(code)) {
        throw syntaxError(source, position, "Invalid number, expected digit but got: ".concat(printCharCode(code), "."));
      }

      return new Token$1(isFloat ? TokenKind.FLOAT : TokenKind.INT, start, position, line, col, prev, body.slice(start, position));
    }
    /**
     * Returns the new position in the source after reading digits.
     */


    function readDigits(source, start, firstCode) {
      var body = source.body;
      var position = start;
      var code = firstCode;

      if (code >= 48 && code <= 57) {
        // 0 - 9
        do {
          code = body.charCodeAt(++position);
        } while (code >= 48 && code <= 57); // 0 - 9


        return position;
      }

      throw syntaxError(source, position, "Invalid number, expected digit but got: ".concat(printCharCode(code), "."));
    }
    /**
     * Reads a string token from the source file.
     *
     * "([^"\\\u000A\u000D]|(\\(u[0-9a-fA-F]{4}|["\\/bfnrt])))*"
     */


    function readString(source, start, line, col, prev) {
      var body = source.body;
      var position = start + 1;
      var chunkStart = position;
      var code = 0;
      var value = '';

      while (position < body.length && !isNaN(code = body.charCodeAt(position)) && // not LineTerminator
      code !== 0x000a && code !== 0x000d) {
        // Closing Quote (")
        if (code === 34) {
          value += body.slice(chunkStart, position);
          return new Token$1(TokenKind.STRING, start, position + 1, line, col, prev, value);
        } // SourceCharacter


        if (code < 0x0020 && code !== 0x0009) {
          throw syntaxError(source, position, "Invalid character within String: ".concat(printCharCode(code), "."));
        }

        ++position;

        if (code === 92) {
          // \
          value += body.slice(chunkStart, position - 1);
          code = body.charCodeAt(position);

          switch (code) {
            case 34:
              value += '"';
              break;

            case 47:
              value += '/';
              break;

            case 92:
              value += '\\';
              break;

            case 98:
              value += '\b';
              break;

            case 102:
              value += '\f';
              break;

            case 110:
              value += '\n';
              break;

            case 114:
              value += '\r';
              break;

            case 116:
              value += '\t';
              break;

            case 117:
              {
                // uXXXX
                var charCode = uniCharCode(body.charCodeAt(position + 1), body.charCodeAt(position + 2), body.charCodeAt(position + 3), body.charCodeAt(position + 4));

                if (charCode < 0) {
                  var invalidSequence = body.slice(position + 1, position + 5);
                  throw syntaxError(source, position, "Invalid character escape sequence: \\u".concat(invalidSequence, "."));
                }

                value += String.fromCharCode(charCode);
                position += 4;
                break;
              }

            default:
              throw syntaxError(source, position, "Invalid character escape sequence: \\".concat(String.fromCharCode(code), "."));
          }

          ++position;
          chunkStart = position;
        }
      }

      throw syntaxError(source, position, 'Unterminated string.');
    }
    /**
     * Reads a block string token from the source file.
     *
     * """("?"?(\\"""|\\(?!=""")|[^"\\]))*"""
     */


    function readBlockString(source, start, line, col, prev, lexer) {
      var body = source.body;
      var position = start + 3;
      var chunkStart = position;
      var code = 0;
      var rawValue = '';

      while (position < body.length && !isNaN(code = body.charCodeAt(position))) {
        // Closing Triple-Quote (""")
        if (code === 34 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34) {
          rawValue += body.slice(chunkStart, position);
          return new Token$1(TokenKind.BLOCK_STRING, start, position + 3, line, col, prev, dedentBlockStringValue(rawValue));
        } // SourceCharacter


        if (code < 0x0020 && code !== 0x0009 && code !== 0x000a && code !== 0x000d) {
          throw syntaxError(source, position, "Invalid character within String: ".concat(printCharCode(code), "."));
        }

        if (code === 10) {
          // new line
          ++position;
          ++lexer.line;
          lexer.lineStart = position;
        } else if (code === 13) {
          // carriage return
          if (body.charCodeAt(position + 1) === 10) {
            position += 2;
          } else {
            ++position;
          }

          ++lexer.line;
          lexer.lineStart = position;
        } else if ( // Escape Triple-Quote (\""")
        code === 92 && body.charCodeAt(position + 1) === 34 && body.charCodeAt(position + 2) === 34 && body.charCodeAt(position + 3) === 34) {
          rawValue += body.slice(chunkStart, position) + '"""';
          position += 4;
          chunkStart = position;
        } else {
          ++position;
        }
      }

      throw syntaxError(source, position, 'Unterminated string.');
    }
    /**
     * Converts four hexadecimal chars to the integer that the
     * string represents. For example, uniCharCode('0','0','0','f')
     * will return 15, and uniCharCode('0','0','f','f') returns 255.
     *
     * Returns a negative number on error, if a char was invalid.
     *
     * This is implemented by noting that char2hex() returns -1 on error,
     * which means the result of ORing the char2hex() will also be negative.
     */


    function uniCharCode(a, b, c, d) {
      return char2hex(a) << 12 | char2hex(b) << 8 | char2hex(c) << 4 | char2hex(d);
    }
    /**
     * Converts a hex character to its integer value.
     * '0' becomes 0, '9' becomes 9
     * 'A' becomes 10, 'F' becomes 15
     * 'a' becomes 10, 'f' becomes 15
     *
     * Returns -1 on error.
     */


    function char2hex(a) {
      return a >= 48 && a <= 57 ? a - 48 // 0-9
      : a >= 65 && a <= 70 ? a - 55 // A-F
      : a >= 97 && a <= 102 ? a - 87 // a-f
      : -1;
    }
    /**
     * Reads an alphanumeric + underscore name from the source.
     *
     * [_A-Za-z][_0-9A-Za-z]*
     */


    function readName(source, start, line, col, prev) {
      var body = source.body;
      var bodyLength = body.length;
      var position = start + 1;
      var code = 0;

      while (position !== bodyLength && !isNaN(code = body.charCodeAt(position)) && (code === 95 || // _
      code >= 48 && code <= 57 || // 0-9
      code >= 65 && code <= 90 || // A-Z
      code >= 97 && code <= 122) // a-z
      ) {
        ++position;
      }

      return new Token$1(TokenKind.NAME, start, position, line, col, prev, body.slice(start, position));
    } // _ A-Z a-z


    function isNameStart(code) {
      return code === 95 || code >= 65 && code <= 90 || code >= 97 && code <= 122;
    }

    /**
     * Configuration options to control parser behavior
     */

    /**
     * Given a GraphQL source, parses it into a Document.
     * Throws GraphQLError if a syntax error is encountered.
     */
    function parse(source, options) {
      var parser = new Parser(source, options);
      return parser.parseDocument();
    }
    /**
     * This class is exported only to assist people in implementing their own parsers
     * without duplicating too much code and should be used only as last resort for cases
     * such as experimental syntax or if certain features could not be contributed upstream.
     *
     * It is still part of the internal API and is versioned, so any changes to it are never
     * considered breaking changes. If you still need to support multiple versions of the
     * library, please use the `versionInfo` variable for version detection.
     *
     * @internal
     */

    var Parser = /*#__PURE__*/function () {
      function Parser(source, options) {
        var sourceObj = isSource(source) ? source : new Source(source);
        this._lexer = new Lexer(sourceObj);
        this._options = options;
      }
      /**
       * Converts a name lex token into a name parse node.
       */


      var _proto = Parser.prototype;

      _proto.parseName = function parseName() {
        var token = this.expectToken(TokenKind.NAME);
        return {
          kind: Kind.NAME,
          value: token.value,
          loc: this.loc(token)
        };
      } // Implements the parsing rules in the Document section.

      /**
       * Document : Definition+
       */
      ;

      _proto.parseDocument = function parseDocument() {
        var start = this._lexer.token;
        return {
          kind: Kind.DOCUMENT,
          definitions: this.many(TokenKind.SOF, this.parseDefinition, TokenKind.EOF),
          loc: this.loc(start)
        };
      }
      /**
       * Definition :
       *   - ExecutableDefinition
       *   - TypeSystemDefinition
       *   - TypeSystemExtension
       *
       * ExecutableDefinition :
       *   - OperationDefinition
       *   - FragmentDefinition
       */
      ;

      _proto.parseDefinition = function parseDefinition() {
        if (this.peek(TokenKind.NAME)) {
          switch (this._lexer.token.value) {
            case 'query':
            case 'mutation':
            case 'subscription':
              return this.parseOperationDefinition();

            case 'fragment':
              return this.parseFragmentDefinition();

            case 'schema':
            case 'scalar':
            case 'type':
            case 'interface':
            case 'union':
            case 'enum':
            case 'input':
            case 'directive':
              return this.parseTypeSystemDefinition();

            case 'extend':
              return this.parseTypeSystemExtension();
          }
        } else if (this.peek(TokenKind.BRACE_L)) {
          return this.parseOperationDefinition();
        } else if (this.peekDescription()) {
          return this.parseTypeSystemDefinition();
        }

        throw this.unexpected();
      } // Implements the parsing rules in the Operations section.

      /**
       * OperationDefinition :
       *  - SelectionSet
       *  - OperationType Name? VariableDefinitions? Directives? SelectionSet
       */
      ;

      _proto.parseOperationDefinition = function parseOperationDefinition() {
        var start = this._lexer.token;

        if (this.peek(TokenKind.BRACE_L)) {
          return {
            kind: Kind.OPERATION_DEFINITION,
            operation: 'query',
            name: undefined,
            variableDefinitions: [],
            directives: [],
            selectionSet: this.parseSelectionSet(),
            loc: this.loc(start)
          };
        }

        var operation = this.parseOperationType();
        var name;

        if (this.peek(TokenKind.NAME)) {
          name = this.parseName();
        }

        return {
          kind: Kind.OPERATION_DEFINITION,
          operation: operation,
          name: name,
          variableDefinitions: this.parseVariableDefinitions(),
          directives: this.parseDirectives(false),
          selectionSet: this.parseSelectionSet(),
          loc: this.loc(start)
        };
      }
      /**
       * OperationType : one of query mutation subscription
       */
      ;

      _proto.parseOperationType = function parseOperationType() {
        var operationToken = this.expectToken(TokenKind.NAME);

        switch (operationToken.value) {
          case 'query':
            return 'query';

          case 'mutation':
            return 'mutation';

          case 'subscription':
            return 'subscription';
        }

        throw this.unexpected(operationToken);
      }
      /**
       * VariableDefinitions : ( VariableDefinition+ )
       */
      ;

      _proto.parseVariableDefinitions = function parseVariableDefinitions() {
        return this.optionalMany(TokenKind.PAREN_L, this.parseVariableDefinition, TokenKind.PAREN_R);
      }
      /**
       * VariableDefinition : Variable : Type DefaultValue? Directives[Const]?
       */
      ;

      _proto.parseVariableDefinition = function parseVariableDefinition() {
        var start = this._lexer.token;
        return {
          kind: Kind.VARIABLE_DEFINITION,
          variable: this.parseVariable(),
          type: (this.expectToken(TokenKind.COLON), this.parseTypeReference()),
          defaultValue: this.expectOptionalToken(TokenKind.EQUALS) ? this.parseValueLiteral(true) : undefined,
          directives: this.parseDirectives(true),
          loc: this.loc(start)
        };
      }
      /**
       * Variable : $ Name
       */
      ;

      _proto.parseVariable = function parseVariable() {
        var start = this._lexer.token;
        this.expectToken(TokenKind.DOLLAR);
        return {
          kind: Kind.VARIABLE,
          name: this.parseName(),
          loc: this.loc(start)
        };
      }
      /**
       * SelectionSet : { Selection+ }
       */
      ;

      _proto.parseSelectionSet = function parseSelectionSet() {
        var start = this._lexer.token;
        return {
          kind: Kind.SELECTION_SET,
          selections: this.many(TokenKind.BRACE_L, this.parseSelection, TokenKind.BRACE_R),
          loc: this.loc(start)
        };
      }
      /**
       * Selection :
       *   - Field
       *   - FragmentSpread
       *   - InlineFragment
       */
      ;

      _proto.parseSelection = function parseSelection() {
        return this.peek(TokenKind.SPREAD) ? this.parseFragment() : this.parseField();
      }
      /**
       * Field : Alias? Name Arguments? Directives? SelectionSet?
       *
       * Alias : Name :
       */
      ;

      _proto.parseField = function parseField() {
        var start = this._lexer.token;
        var nameOrAlias = this.parseName();
        var alias;
        var name;

        if (this.expectOptionalToken(TokenKind.COLON)) {
          alias = nameOrAlias;
          name = this.parseName();
        } else {
          name = nameOrAlias;
        }

        return {
          kind: Kind.FIELD,
          alias: alias,
          name: name,
          arguments: this.parseArguments(false),
          directives: this.parseDirectives(false),
          selectionSet: this.peek(TokenKind.BRACE_L) ? this.parseSelectionSet() : undefined,
          loc: this.loc(start)
        };
      }
      /**
       * Arguments[Const] : ( Argument[?Const]+ )
       */
      ;

      _proto.parseArguments = function parseArguments(isConst) {
        var item = isConst ? this.parseConstArgument : this.parseArgument;
        return this.optionalMany(TokenKind.PAREN_L, item, TokenKind.PAREN_R);
      }
      /**
       * Argument[Const] : Name : Value[?Const]
       */
      ;

      _proto.parseArgument = function parseArgument() {
        var start = this._lexer.token;
        var name = this.parseName();
        this.expectToken(TokenKind.COLON);
        return {
          kind: Kind.ARGUMENT,
          name: name,
          value: this.parseValueLiteral(false),
          loc: this.loc(start)
        };
      };

      _proto.parseConstArgument = function parseConstArgument() {
        var start = this._lexer.token;
        return {
          kind: Kind.ARGUMENT,
          name: this.parseName(),
          value: (this.expectToken(TokenKind.COLON), this.parseValueLiteral(true)),
          loc: this.loc(start)
        };
      } // Implements the parsing rules in the Fragments section.

      /**
       * Corresponds to both FragmentSpread and InlineFragment in the spec.
       *
       * FragmentSpread : ... FragmentName Directives?
       *
       * InlineFragment : ... TypeCondition? Directives? SelectionSet
       */
      ;

      _proto.parseFragment = function parseFragment() {
        var start = this._lexer.token;
        this.expectToken(TokenKind.SPREAD);
        var hasTypeCondition = this.expectOptionalKeyword('on');

        if (!hasTypeCondition && this.peek(TokenKind.NAME)) {
          return {
            kind: Kind.FRAGMENT_SPREAD,
            name: this.parseFragmentName(),
            directives: this.parseDirectives(false),
            loc: this.loc(start)
          };
        }

        return {
          kind: Kind.INLINE_FRAGMENT,
          typeCondition: hasTypeCondition ? this.parseNamedType() : undefined,
          directives: this.parseDirectives(false),
          selectionSet: this.parseSelectionSet(),
          loc: this.loc(start)
        };
      }
      /**
       * FragmentDefinition :
       *   - fragment FragmentName on TypeCondition Directives? SelectionSet
       *
       * TypeCondition : NamedType
       */
      ;

      _proto.parseFragmentDefinition = function parseFragmentDefinition() {
        var _this$_options;

        var start = this._lexer.token;
        this.expectKeyword('fragment'); // Experimental support for defining variables within fragments changes
        // the grammar of FragmentDefinition:
        //   - fragment FragmentName VariableDefinitions? on TypeCondition Directives? SelectionSet

        if (((_this$_options = this._options) === null || _this$_options === void 0 ? void 0 : _this$_options.experimentalFragmentVariables) === true) {
          return {
            kind: Kind.FRAGMENT_DEFINITION,
            name: this.parseFragmentName(),
            variableDefinitions: this.parseVariableDefinitions(),
            typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
            directives: this.parseDirectives(false),
            selectionSet: this.parseSelectionSet(),
            loc: this.loc(start)
          };
        }

        return {
          kind: Kind.FRAGMENT_DEFINITION,
          name: this.parseFragmentName(),
          typeCondition: (this.expectKeyword('on'), this.parseNamedType()),
          directives: this.parseDirectives(false),
          selectionSet: this.parseSelectionSet(),
          loc: this.loc(start)
        };
      }
      /**
       * FragmentName : Name but not `on`
       */
      ;

      _proto.parseFragmentName = function parseFragmentName() {
        if (this._lexer.token.value === 'on') {
          throw this.unexpected();
        }

        return this.parseName();
      } // Implements the parsing rules in the Values section.

      /**
       * Value[Const] :
       *   - [~Const] Variable
       *   - IntValue
       *   - FloatValue
       *   - StringValue
       *   - BooleanValue
       *   - NullValue
       *   - EnumValue
       *   - ListValue[?Const]
       *   - ObjectValue[?Const]
       *
       * BooleanValue : one of `true` `false`
       *
       * NullValue : `null`
       *
       * EnumValue : Name but not `true`, `false` or `null`
       */
      ;

      _proto.parseValueLiteral = function parseValueLiteral(isConst) {
        var token = this._lexer.token;

        switch (token.kind) {
          case TokenKind.BRACKET_L:
            return this.parseList(isConst);

          case TokenKind.BRACE_L:
            return this.parseObject(isConst);

          case TokenKind.INT:
            this._lexer.advance();

            return {
              kind: Kind.INT,
              value: token.value,
              loc: this.loc(token)
            };

          case TokenKind.FLOAT:
            this._lexer.advance();

            return {
              kind: Kind.FLOAT,
              value: token.value,
              loc: this.loc(token)
            };

          case TokenKind.STRING:
          case TokenKind.BLOCK_STRING:
            return this.parseStringLiteral();

          case TokenKind.NAME:
            this._lexer.advance();

            switch (token.value) {
              case 'true':
                return {
                  kind: Kind.BOOLEAN,
                  value: true,
                  loc: this.loc(token)
                };

              case 'false':
                return {
                  kind: Kind.BOOLEAN,
                  value: false,
                  loc: this.loc(token)
                };

              case 'null':
                return {
                  kind: Kind.NULL,
                  loc: this.loc(token)
                };

              default:
                return {
                  kind: Kind.ENUM,
                  value: token.value,
                  loc: this.loc(token)
                };
            }

          case TokenKind.DOLLAR:
            if (!isConst) {
              return this.parseVariable();
            }

            break;
        }

        throw this.unexpected();
      };

      _proto.parseStringLiteral = function parseStringLiteral() {
        var token = this._lexer.token;

        this._lexer.advance();

        return {
          kind: Kind.STRING,
          value: token.value,
          block: token.kind === TokenKind.BLOCK_STRING,
          loc: this.loc(token)
        };
      }
      /**
       * ListValue[Const] :
       *   - [ ]
       *   - [ Value[?Const]+ ]
       */
      ;

      _proto.parseList = function parseList(isConst) {
        var _this = this;

        var start = this._lexer.token;

        var item = function item() {
          return _this.parseValueLiteral(isConst);
        };

        return {
          kind: Kind.LIST,
          values: this.any(TokenKind.BRACKET_L, item, TokenKind.BRACKET_R),
          loc: this.loc(start)
        };
      }
      /**
       * ObjectValue[Const] :
       *   - { }
       *   - { ObjectField[?Const]+ }
       */
      ;

      _proto.parseObject = function parseObject(isConst) {
        var _this2 = this;

        var start = this._lexer.token;

        var item = function item() {
          return _this2.parseObjectField(isConst);
        };

        return {
          kind: Kind.OBJECT,
          fields: this.any(TokenKind.BRACE_L, item, TokenKind.BRACE_R),
          loc: this.loc(start)
        };
      }
      /**
       * ObjectField[Const] : Name : Value[?Const]
       */
      ;

      _proto.parseObjectField = function parseObjectField(isConst) {
        var start = this._lexer.token;
        var name = this.parseName();
        this.expectToken(TokenKind.COLON);
        return {
          kind: Kind.OBJECT_FIELD,
          name: name,
          value: this.parseValueLiteral(isConst),
          loc: this.loc(start)
        };
      } // Implements the parsing rules in the Directives section.

      /**
       * Directives[Const] : Directive[?Const]+
       */
      ;

      _proto.parseDirectives = function parseDirectives(isConst) {
        var directives = [];

        while (this.peek(TokenKind.AT)) {
          directives.push(this.parseDirective(isConst));
        }

        return directives;
      }
      /**
       * Directive[Const] : @ Name Arguments[?Const]?
       */
      ;

      _proto.parseDirective = function parseDirective(isConst) {
        var start = this._lexer.token;
        this.expectToken(TokenKind.AT);
        return {
          kind: Kind.DIRECTIVE,
          name: this.parseName(),
          arguments: this.parseArguments(isConst),
          loc: this.loc(start)
        };
      } // Implements the parsing rules in the Types section.

      /**
       * Type :
       *   - NamedType
       *   - ListType
       *   - NonNullType
       */
      ;

      _proto.parseTypeReference = function parseTypeReference() {
        var start = this._lexer.token;
        var type;

        if (this.expectOptionalToken(TokenKind.BRACKET_L)) {
          type = this.parseTypeReference();
          this.expectToken(TokenKind.BRACKET_R);
          type = {
            kind: Kind.LIST_TYPE,
            type: type,
            loc: this.loc(start)
          };
        } else {
          type = this.parseNamedType();
        }

        if (this.expectOptionalToken(TokenKind.BANG)) {
          return {
            kind: Kind.NON_NULL_TYPE,
            type: type,
            loc: this.loc(start)
          };
        }

        return type;
      }
      /**
       * NamedType : Name
       */
      ;

      _proto.parseNamedType = function parseNamedType() {
        var start = this._lexer.token;
        return {
          kind: Kind.NAMED_TYPE,
          name: this.parseName(),
          loc: this.loc(start)
        };
      } // Implements the parsing rules in the Type Definition section.

      /**
       * TypeSystemDefinition :
       *   - SchemaDefinition
       *   - TypeDefinition
       *   - DirectiveDefinition
       *
       * TypeDefinition :
       *   - ScalarTypeDefinition
       *   - ObjectTypeDefinition
       *   - InterfaceTypeDefinition
       *   - UnionTypeDefinition
       *   - EnumTypeDefinition
       *   - InputObjectTypeDefinition
       */
      ;

      _proto.parseTypeSystemDefinition = function parseTypeSystemDefinition() {
        // Many definitions begin with a description and require a lookahead.
        var keywordToken = this.peekDescription() ? this._lexer.lookahead() : this._lexer.token;

        if (keywordToken.kind === TokenKind.NAME) {
          switch (keywordToken.value) {
            case 'schema':
              return this.parseSchemaDefinition();

            case 'scalar':
              return this.parseScalarTypeDefinition();

            case 'type':
              return this.parseObjectTypeDefinition();

            case 'interface':
              return this.parseInterfaceTypeDefinition();

            case 'union':
              return this.parseUnionTypeDefinition();

            case 'enum':
              return this.parseEnumTypeDefinition();

            case 'input':
              return this.parseInputObjectTypeDefinition();

            case 'directive':
              return this.parseDirectiveDefinition();
          }
        }

        throw this.unexpected(keywordToken);
      };

      _proto.peekDescription = function peekDescription() {
        return this.peek(TokenKind.STRING) || this.peek(TokenKind.BLOCK_STRING);
      }
      /**
       * Description : StringValue
       */
      ;

      _proto.parseDescription = function parseDescription() {
        if (this.peekDescription()) {
          return this.parseStringLiteral();
        }
      }
      /**
       * SchemaDefinition : Description? schema Directives[Const]? { OperationTypeDefinition+ }
       */
      ;

      _proto.parseSchemaDefinition = function parseSchemaDefinition() {
        var start = this._lexer.token;
        var description = this.parseDescription();
        this.expectKeyword('schema');
        var directives = this.parseDirectives(true);
        var operationTypes = this.many(TokenKind.BRACE_L, this.parseOperationTypeDefinition, TokenKind.BRACE_R);
        return {
          kind: Kind.SCHEMA_DEFINITION,
          description: description,
          directives: directives,
          operationTypes: operationTypes,
          loc: this.loc(start)
        };
      }
      /**
       * OperationTypeDefinition : OperationType : NamedType
       */
      ;

      _proto.parseOperationTypeDefinition = function parseOperationTypeDefinition() {
        var start = this._lexer.token;
        var operation = this.parseOperationType();
        this.expectToken(TokenKind.COLON);
        var type = this.parseNamedType();
        return {
          kind: Kind.OPERATION_TYPE_DEFINITION,
          operation: operation,
          type: type,
          loc: this.loc(start)
        };
      }
      /**
       * ScalarTypeDefinition : Description? scalar Name Directives[Const]?
       */
      ;

      _proto.parseScalarTypeDefinition = function parseScalarTypeDefinition() {
        var start = this._lexer.token;
        var description = this.parseDescription();
        this.expectKeyword('scalar');
        var name = this.parseName();
        var directives = this.parseDirectives(true);
        return {
          kind: Kind.SCALAR_TYPE_DEFINITION,
          description: description,
          name: name,
          directives: directives,
          loc: this.loc(start)
        };
      }
      /**
       * ObjectTypeDefinition :
       *   Description?
       *   type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition?
       */
      ;

      _proto.parseObjectTypeDefinition = function parseObjectTypeDefinition() {
        var start = this._lexer.token;
        var description = this.parseDescription();
        this.expectKeyword('type');
        var name = this.parseName();
        var interfaces = this.parseImplementsInterfaces();
        var directives = this.parseDirectives(true);
        var fields = this.parseFieldsDefinition();
        return {
          kind: Kind.OBJECT_TYPE_DEFINITION,
          description: description,
          name: name,
          interfaces: interfaces,
          directives: directives,
          fields: fields,
          loc: this.loc(start)
        };
      }
      /**
       * ImplementsInterfaces :
       *   - implements `&`? NamedType
       *   - ImplementsInterfaces & NamedType
       */
      ;

      _proto.parseImplementsInterfaces = function parseImplementsInterfaces() {
        var _this$_options2;

        if (!this.expectOptionalKeyword('implements')) {
          return [];
        }

        if (((_this$_options2 = this._options) === null || _this$_options2 === void 0 ? void 0 : _this$_options2.allowLegacySDLImplementsInterfaces) === true) {
          var types = []; // Optional leading ampersand

          this.expectOptionalToken(TokenKind.AMP);

          do {
            types.push(this.parseNamedType());
          } while (this.expectOptionalToken(TokenKind.AMP) || this.peek(TokenKind.NAME));

          return types;
        }

        return this.delimitedMany(TokenKind.AMP, this.parseNamedType);
      }
      /**
       * FieldsDefinition : { FieldDefinition+ }
       */
      ;

      _proto.parseFieldsDefinition = function parseFieldsDefinition() {
        var _this$_options3;

        // Legacy support for the SDL?
        if (((_this$_options3 = this._options) === null || _this$_options3 === void 0 ? void 0 : _this$_options3.allowLegacySDLEmptyFields) === true && this.peek(TokenKind.BRACE_L) && this._lexer.lookahead().kind === TokenKind.BRACE_R) {
          this._lexer.advance();

          this._lexer.advance();

          return [];
        }

        return this.optionalMany(TokenKind.BRACE_L, this.parseFieldDefinition, TokenKind.BRACE_R);
      }
      /**
       * FieldDefinition :
       *   - Description? Name ArgumentsDefinition? : Type Directives[Const]?
       */
      ;

      _proto.parseFieldDefinition = function parseFieldDefinition() {
        var start = this._lexer.token;
        var description = this.parseDescription();
        var name = this.parseName();
        var args = this.parseArgumentDefs();
        this.expectToken(TokenKind.COLON);
        var type = this.parseTypeReference();
        var directives = this.parseDirectives(true);
        return {
          kind: Kind.FIELD_DEFINITION,
          description: description,
          name: name,
          arguments: args,
          type: type,
          directives: directives,
          loc: this.loc(start)
        };
      }
      /**
       * ArgumentsDefinition : ( InputValueDefinition+ )
       */
      ;

      _proto.parseArgumentDefs = function parseArgumentDefs() {
        return this.optionalMany(TokenKind.PAREN_L, this.parseInputValueDef, TokenKind.PAREN_R);
      }
      /**
       * InputValueDefinition :
       *   - Description? Name : Type DefaultValue? Directives[Const]?
       */
      ;

      _proto.parseInputValueDef = function parseInputValueDef() {
        var start = this._lexer.token;
        var description = this.parseDescription();
        var name = this.parseName();
        this.expectToken(TokenKind.COLON);
        var type = this.parseTypeReference();
        var defaultValue;

        if (this.expectOptionalToken(TokenKind.EQUALS)) {
          defaultValue = this.parseValueLiteral(true);
        }

        var directives = this.parseDirectives(true);
        return {
          kind: Kind.INPUT_VALUE_DEFINITION,
          description: description,
          name: name,
          type: type,
          defaultValue: defaultValue,
          directives: directives,
          loc: this.loc(start)
        };
      }
      /**
       * InterfaceTypeDefinition :
       *   - Description? interface Name Directives[Const]? FieldsDefinition?
       */
      ;

      _proto.parseInterfaceTypeDefinition = function parseInterfaceTypeDefinition() {
        var start = this._lexer.token;
        var description = this.parseDescription();
        this.expectKeyword('interface');
        var name = this.parseName();
        var interfaces = this.parseImplementsInterfaces();
        var directives = this.parseDirectives(true);
        var fields = this.parseFieldsDefinition();
        return {
          kind: Kind.INTERFACE_TYPE_DEFINITION,
          description: description,
          name: name,
          interfaces: interfaces,
          directives: directives,
          fields: fields,
          loc: this.loc(start)
        };
      }
      /**
       * UnionTypeDefinition :
       *   - Description? union Name Directives[Const]? UnionMemberTypes?
       */
      ;

      _proto.parseUnionTypeDefinition = function parseUnionTypeDefinition() {
        var start = this._lexer.token;
        var description = this.parseDescription();
        this.expectKeyword('union');
        var name = this.parseName();
        var directives = this.parseDirectives(true);
        var types = this.parseUnionMemberTypes();
        return {
          kind: Kind.UNION_TYPE_DEFINITION,
          description: description,
          name: name,
          directives: directives,
          types: types,
          loc: this.loc(start)
        };
      }
      /**
       * UnionMemberTypes :
       *   - = `|`? NamedType
       *   - UnionMemberTypes | NamedType
       */
      ;

      _proto.parseUnionMemberTypes = function parseUnionMemberTypes() {
        return this.expectOptionalToken(TokenKind.EQUALS) ? this.delimitedMany(TokenKind.PIPE, this.parseNamedType) : [];
      }
      /**
       * EnumTypeDefinition :
       *   - Description? enum Name Directives[Const]? EnumValuesDefinition?
       */
      ;

      _proto.parseEnumTypeDefinition = function parseEnumTypeDefinition() {
        var start = this._lexer.token;
        var description = this.parseDescription();
        this.expectKeyword('enum');
        var name = this.parseName();
        var directives = this.parseDirectives(true);
        var values = this.parseEnumValuesDefinition();
        return {
          kind: Kind.ENUM_TYPE_DEFINITION,
          description: description,
          name: name,
          directives: directives,
          values: values,
          loc: this.loc(start)
        };
      }
      /**
       * EnumValuesDefinition : { EnumValueDefinition+ }
       */
      ;

      _proto.parseEnumValuesDefinition = function parseEnumValuesDefinition() {
        return this.optionalMany(TokenKind.BRACE_L, this.parseEnumValueDefinition, TokenKind.BRACE_R);
      }
      /**
       * EnumValueDefinition : Description? EnumValue Directives[Const]?
       *
       * EnumValue : Name
       */
      ;

      _proto.parseEnumValueDefinition = function parseEnumValueDefinition() {
        var start = this._lexer.token;
        var description = this.parseDescription();
        var name = this.parseName();
        var directives = this.parseDirectives(true);
        return {
          kind: Kind.ENUM_VALUE_DEFINITION,
          description: description,
          name: name,
          directives: directives,
          loc: this.loc(start)
        };
      }
      /**
       * InputObjectTypeDefinition :
       *   - Description? input Name Directives[Const]? InputFieldsDefinition?
       */
      ;

      _proto.parseInputObjectTypeDefinition = function parseInputObjectTypeDefinition() {
        var start = this._lexer.token;
        var description = this.parseDescription();
        this.expectKeyword('input');
        var name = this.parseName();
        var directives = this.parseDirectives(true);
        var fields = this.parseInputFieldsDefinition();
        return {
          kind: Kind.INPUT_OBJECT_TYPE_DEFINITION,
          description: description,
          name: name,
          directives: directives,
          fields: fields,
          loc: this.loc(start)
        };
      }
      /**
       * InputFieldsDefinition : { InputValueDefinition+ }
       */
      ;

      _proto.parseInputFieldsDefinition = function parseInputFieldsDefinition() {
        return this.optionalMany(TokenKind.BRACE_L, this.parseInputValueDef, TokenKind.BRACE_R);
      }
      /**
       * TypeSystemExtension :
       *   - SchemaExtension
       *   - TypeExtension
       *
       * TypeExtension :
       *   - ScalarTypeExtension
       *   - ObjectTypeExtension
       *   - InterfaceTypeExtension
       *   - UnionTypeExtension
       *   - EnumTypeExtension
       *   - InputObjectTypeDefinition
       */
      ;

      _proto.parseTypeSystemExtension = function parseTypeSystemExtension() {
        var keywordToken = this._lexer.lookahead();

        if (keywordToken.kind === TokenKind.NAME) {
          switch (keywordToken.value) {
            case 'schema':
              return this.parseSchemaExtension();

            case 'scalar':
              return this.parseScalarTypeExtension();

            case 'type':
              return this.parseObjectTypeExtension();

            case 'interface':
              return this.parseInterfaceTypeExtension();

            case 'union':
              return this.parseUnionTypeExtension();

            case 'enum':
              return this.parseEnumTypeExtension();

            case 'input':
              return this.parseInputObjectTypeExtension();
          }
        }

        throw this.unexpected(keywordToken);
      }
      /**
       * SchemaExtension :
       *  - extend schema Directives[Const]? { OperationTypeDefinition+ }
       *  - extend schema Directives[Const]
       */
      ;

      _proto.parseSchemaExtension = function parseSchemaExtension() {
        var start = this._lexer.token;
        this.expectKeyword('extend');
        this.expectKeyword('schema');
        var directives = this.parseDirectives(true);
        var operationTypes = this.optionalMany(TokenKind.BRACE_L, this.parseOperationTypeDefinition, TokenKind.BRACE_R);

        if (directives.length === 0 && operationTypes.length === 0) {
          throw this.unexpected();
        }

        return {
          kind: Kind.SCHEMA_EXTENSION,
          directives: directives,
          operationTypes: operationTypes,
          loc: this.loc(start)
        };
      }
      /**
       * ScalarTypeExtension :
       *   - extend scalar Name Directives[Const]
       */
      ;

      _proto.parseScalarTypeExtension = function parseScalarTypeExtension() {
        var start = this._lexer.token;
        this.expectKeyword('extend');
        this.expectKeyword('scalar');
        var name = this.parseName();
        var directives = this.parseDirectives(true);

        if (directives.length === 0) {
          throw this.unexpected();
        }

        return {
          kind: Kind.SCALAR_TYPE_EXTENSION,
          name: name,
          directives: directives,
          loc: this.loc(start)
        };
      }
      /**
       * ObjectTypeExtension :
       *  - extend type Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
       *  - extend type Name ImplementsInterfaces? Directives[Const]
       *  - extend type Name ImplementsInterfaces
       */
      ;

      _proto.parseObjectTypeExtension = function parseObjectTypeExtension() {
        var start = this._lexer.token;
        this.expectKeyword('extend');
        this.expectKeyword('type');
        var name = this.parseName();
        var interfaces = this.parseImplementsInterfaces();
        var directives = this.parseDirectives(true);
        var fields = this.parseFieldsDefinition();

        if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
          throw this.unexpected();
        }

        return {
          kind: Kind.OBJECT_TYPE_EXTENSION,
          name: name,
          interfaces: interfaces,
          directives: directives,
          fields: fields,
          loc: this.loc(start)
        };
      }
      /**
       * InterfaceTypeExtension :
       *  - extend interface Name ImplementsInterfaces? Directives[Const]? FieldsDefinition
       *  - extend interface Name ImplementsInterfaces? Directives[Const]
       *  - extend interface Name ImplementsInterfaces
       */
      ;

      _proto.parseInterfaceTypeExtension = function parseInterfaceTypeExtension() {
        var start = this._lexer.token;
        this.expectKeyword('extend');
        this.expectKeyword('interface');
        var name = this.parseName();
        var interfaces = this.parseImplementsInterfaces();
        var directives = this.parseDirectives(true);
        var fields = this.parseFieldsDefinition();

        if (interfaces.length === 0 && directives.length === 0 && fields.length === 0) {
          throw this.unexpected();
        }

        return {
          kind: Kind.INTERFACE_TYPE_EXTENSION,
          name: name,
          interfaces: interfaces,
          directives: directives,
          fields: fields,
          loc: this.loc(start)
        };
      }
      /**
       * UnionTypeExtension :
       *   - extend union Name Directives[Const]? UnionMemberTypes
       *   - extend union Name Directives[Const]
       */
      ;

      _proto.parseUnionTypeExtension = function parseUnionTypeExtension() {
        var start = this._lexer.token;
        this.expectKeyword('extend');
        this.expectKeyword('union');
        var name = this.parseName();
        var directives = this.parseDirectives(true);
        var types = this.parseUnionMemberTypes();

        if (directives.length === 0 && types.length === 0) {
          throw this.unexpected();
        }

        return {
          kind: Kind.UNION_TYPE_EXTENSION,
          name: name,
          directives: directives,
          types: types,
          loc: this.loc(start)
        };
      }
      /**
       * EnumTypeExtension :
       *   - extend enum Name Directives[Const]? EnumValuesDefinition
       *   - extend enum Name Directives[Const]
       */
      ;

      _proto.parseEnumTypeExtension = function parseEnumTypeExtension() {
        var start = this._lexer.token;
        this.expectKeyword('extend');
        this.expectKeyword('enum');
        var name = this.parseName();
        var directives = this.parseDirectives(true);
        var values = this.parseEnumValuesDefinition();

        if (directives.length === 0 && values.length === 0) {
          throw this.unexpected();
        }

        return {
          kind: Kind.ENUM_TYPE_EXTENSION,
          name: name,
          directives: directives,
          values: values,
          loc: this.loc(start)
        };
      }
      /**
       * InputObjectTypeExtension :
       *   - extend input Name Directives[Const]? InputFieldsDefinition
       *   - extend input Name Directives[Const]
       */
      ;

      _proto.parseInputObjectTypeExtension = function parseInputObjectTypeExtension() {
        var start = this._lexer.token;
        this.expectKeyword('extend');
        this.expectKeyword('input');
        var name = this.parseName();
        var directives = this.parseDirectives(true);
        var fields = this.parseInputFieldsDefinition();

        if (directives.length === 0 && fields.length === 0) {
          throw this.unexpected();
        }

        return {
          kind: Kind.INPUT_OBJECT_TYPE_EXTENSION,
          name: name,
          directives: directives,
          fields: fields,
          loc: this.loc(start)
        };
      }
      /**
       * DirectiveDefinition :
       *   - Description? directive @ Name ArgumentsDefinition? `repeatable`? on DirectiveLocations
       */
      ;

      _proto.parseDirectiveDefinition = function parseDirectiveDefinition() {
        var start = this._lexer.token;
        var description = this.parseDescription();
        this.expectKeyword('directive');
        this.expectToken(TokenKind.AT);
        var name = this.parseName();
        var args = this.parseArgumentDefs();
        var repeatable = this.expectOptionalKeyword('repeatable');
        this.expectKeyword('on');
        var locations = this.parseDirectiveLocations();
        return {
          kind: Kind.DIRECTIVE_DEFINITION,
          description: description,
          name: name,
          arguments: args,
          repeatable: repeatable,
          locations: locations,
          loc: this.loc(start)
        };
      }
      /**
       * DirectiveLocations :
       *   - `|`? DirectiveLocation
       *   - DirectiveLocations | DirectiveLocation
       */
      ;

      _proto.parseDirectiveLocations = function parseDirectiveLocations() {
        return this.delimitedMany(TokenKind.PIPE, this.parseDirectiveLocation);
      }
      /*
       * DirectiveLocation :
       *   - ExecutableDirectiveLocation
       *   - TypeSystemDirectiveLocation
       *
       * ExecutableDirectiveLocation : one of
       *   `QUERY`
       *   `MUTATION`
       *   `SUBSCRIPTION`
       *   `FIELD`
       *   `FRAGMENT_DEFINITION`
       *   `FRAGMENT_SPREAD`
       *   `INLINE_FRAGMENT`
       *
       * TypeSystemDirectiveLocation : one of
       *   `SCHEMA`
       *   `SCALAR`
       *   `OBJECT`
       *   `FIELD_DEFINITION`
       *   `ARGUMENT_DEFINITION`
       *   `INTERFACE`
       *   `UNION`
       *   `ENUM`
       *   `ENUM_VALUE`
       *   `INPUT_OBJECT`
       *   `INPUT_FIELD_DEFINITION`
       */
      ;

      _proto.parseDirectiveLocation = function parseDirectiveLocation() {
        var start = this._lexer.token;
        var name = this.parseName();

        if (DirectiveLocation[name.value] !== undefined) {
          return name;
        }

        throw this.unexpected(start);
      } // Core parsing utility functions

      /**
       * Returns a location object, used to identify the place in the source that created a given parsed object.
       */
      ;

      _proto.loc = function loc(startToken) {
        var _this$_options4;

        if (((_this$_options4 = this._options) === null || _this$_options4 === void 0 ? void 0 : _this$_options4.noLocation) !== true) {
          return new Location(startToken, this._lexer.lastToken, this._lexer.source);
        }
      }
      /**
       * Determines if the next token is of a given kind
       */
      ;

      _proto.peek = function peek(kind) {
        return this._lexer.token.kind === kind;
      }
      /**
       * If the next token is of the given kind, return that token after advancing the lexer.
       * Otherwise, do not change the parser state and throw an error.
       */
      ;

      _proto.expectToken = function expectToken(kind) {
        var token = this._lexer.token;

        if (token.kind === kind) {
          this._lexer.advance();

          return token;
        }

        throw syntaxError(this._lexer.source, token.start, "Expected ".concat(getTokenKindDesc(kind), ", found ").concat(getTokenDesc(token), "."));
      }
      /**
       * If the next token is of the given kind, return that token after advancing the lexer.
       * Otherwise, do not change the parser state and return undefined.
       */
      ;

      _proto.expectOptionalToken = function expectOptionalToken(kind) {
        var token = this._lexer.token;

        if (token.kind === kind) {
          this._lexer.advance();

          return token;
        }

        return undefined;
      }
      /**
       * If the next token is a given keyword, advance the lexer.
       * Otherwise, do not change the parser state and throw an error.
       */
      ;

      _proto.expectKeyword = function expectKeyword(value) {
        var token = this._lexer.token;

        if (token.kind === TokenKind.NAME && token.value === value) {
          this._lexer.advance();
        } else {
          throw syntaxError(this._lexer.source, token.start, "Expected \"".concat(value, "\", found ").concat(getTokenDesc(token), "."));
        }
      }
      /**
       * If the next token is a given keyword, return "true" after advancing the lexer.
       * Otherwise, do not change the parser state and return "false".
       */
      ;

      _proto.expectOptionalKeyword = function expectOptionalKeyword(value) {
        var token = this._lexer.token;

        if (token.kind === TokenKind.NAME && token.value === value) {
          this._lexer.advance();

          return true;
        }

        return false;
      }
      /**
       * Helper function for creating an error when an unexpected lexed token is encountered.
       */
      ;

      _proto.unexpected = function unexpected(atToken) {
        var token = atToken !== null && atToken !== void 0 ? atToken : this._lexer.token;
        return syntaxError(this._lexer.source, token.start, "Unexpected ".concat(getTokenDesc(token), "."));
      }
      /**
       * Returns a possibly empty list of parse nodes, determined by the parseFn.
       * This list begins with a lex token of openKind and ends with a lex token of closeKind.
       * Advances the parser to the next lex token after the closing token.
       */
      ;

      _proto.any = function any(openKind, parseFn, closeKind) {
        this.expectToken(openKind);
        var nodes = [];

        while (!this.expectOptionalToken(closeKind)) {
          nodes.push(parseFn.call(this));
        }

        return nodes;
      }
      /**
       * Returns a list of parse nodes, determined by the parseFn.
       * It can be empty only if open token is missing otherwise it will always return non-empty list
       * that begins with a lex token of openKind and ends with a lex token of closeKind.
       * Advances the parser to the next lex token after the closing token.
       */
      ;

      _proto.optionalMany = function optionalMany(openKind, parseFn, closeKind) {
        if (this.expectOptionalToken(openKind)) {
          var nodes = [];

          do {
            nodes.push(parseFn.call(this));
          } while (!this.expectOptionalToken(closeKind));

          return nodes;
        }

        return [];
      }
      /**
       * Returns a non-empty list of parse nodes, determined by the parseFn.
       * This list begins with a lex token of openKind and ends with a lex token of closeKind.
       * Advances the parser to the next lex token after the closing token.
       */
      ;

      _proto.many = function many(openKind, parseFn, closeKind) {
        this.expectToken(openKind);
        var nodes = [];

        do {
          nodes.push(parseFn.call(this));
        } while (!this.expectOptionalToken(closeKind));

        return nodes;
      }
      /**
       * Returns a non-empty list of parse nodes, determined by the parseFn.
       * This list may begin with a lex token of delimiterKind followed by items separated by lex tokens of tokenKind.
       * Advances the parser to the next lex token after last item in the list.
       */
      ;

      _proto.delimitedMany = function delimitedMany(delimiterKind, parseFn) {
        this.expectOptionalToken(delimiterKind);
        var nodes = [];

        do {
          nodes.push(parseFn.call(this));
        } while (this.expectOptionalToken(delimiterKind));

        return nodes;
      };

      return Parser;
    }();
    /**
     * A helper function to describe a token as a string for debugging.
     */

    function getTokenDesc(token) {
      var value = token.value;
      return getTokenKindDesc(token.kind) + (value != null ? " \"".concat(value, "\"") : '');
    }
    /**
     * A helper function to describe a token kind as a string for debugging.
     */


    function getTokenKindDesc(kind) {
      return isPunctuatorTokenKind(kind) ? "\"".concat(kind, "\"") : kind;
    }

    /**
     * A visitor is provided to visit, it contains the collection of
     * relevant functions to be called during the visitor's traversal.
     */

    var QueryDocumentKeys = {
      Name: [],
      Document: ['definitions'],
      OperationDefinition: ['name', 'variableDefinitions', 'directives', 'selectionSet'],
      VariableDefinition: ['variable', 'type', 'defaultValue', 'directives'],
      Variable: ['name'],
      SelectionSet: ['selections'],
      Field: ['alias', 'name', 'arguments', 'directives', 'selectionSet'],
      Argument: ['name', 'value'],
      FragmentSpread: ['name', 'directives'],
      InlineFragment: ['typeCondition', 'directives', 'selectionSet'],
      FragmentDefinition: ['name', // Note: fragment variable definitions are experimental and may be changed
      // or removed in the future.
      'variableDefinitions', 'typeCondition', 'directives', 'selectionSet'],
      IntValue: [],
      FloatValue: [],
      StringValue: [],
      BooleanValue: [],
      NullValue: [],
      EnumValue: [],
      ListValue: ['values'],
      ObjectValue: ['fields'],
      ObjectField: ['name', 'value'],
      Directive: ['name', 'arguments'],
      NamedType: ['name'],
      ListType: ['type'],
      NonNullType: ['type'],
      SchemaDefinition: ['description', 'directives', 'operationTypes'],
      OperationTypeDefinition: ['type'],
      ScalarTypeDefinition: ['description', 'name', 'directives'],
      ObjectTypeDefinition: ['description', 'name', 'interfaces', 'directives', 'fields'],
      FieldDefinition: ['description', 'name', 'arguments', 'type', 'directives'],
      InputValueDefinition: ['description', 'name', 'type', 'defaultValue', 'directives'],
      InterfaceTypeDefinition: ['description', 'name', 'interfaces', 'directives', 'fields'],
      UnionTypeDefinition: ['description', 'name', 'directives', 'types'],
      EnumTypeDefinition: ['description', 'name', 'directives', 'values'],
      EnumValueDefinition: ['description', 'name', 'directives'],
      InputObjectTypeDefinition: ['description', 'name', 'directives', 'fields'],
      DirectiveDefinition: ['description', 'name', 'arguments', 'locations'],
      SchemaExtension: ['directives', 'operationTypes'],
      ScalarTypeExtension: ['name', 'directives'],
      ObjectTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
      InterfaceTypeExtension: ['name', 'interfaces', 'directives', 'fields'],
      UnionTypeExtension: ['name', 'directives', 'types'],
      EnumTypeExtension: ['name', 'directives', 'values'],
      InputObjectTypeExtension: ['name', 'directives', 'fields']
    };
    var BREAK = Object.freeze({});
    /**
     * visit() will walk through an AST using a depth-first traversal, calling
     * the visitor's enter function at each node in the traversal, and calling the
     * leave function after visiting that node and all of its child nodes.
     *
     * By returning different values from the enter and leave functions, the
     * behavior of the visitor can be altered, including skipping over a sub-tree of
     * the AST (by returning false), editing the AST by returning a value or null
     * to remove the value, or to stop the whole traversal by returning BREAK.
     *
     * When using visit() to edit an AST, the original AST will not be modified, and
     * a new version of the AST with the changes applied will be returned from the
     * visit function.
     *
     *     const editedAST = visit(ast, {
     *       enter(node, key, parent, path, ancestors) {
     *         // @return
     *         //   undefined: no action
     *         //   false: skip visiting this node
     *         //   visitor.BREAK: stop visiting altogether
     *         //   null: delete this node
     *         //   any value: replace this node with the returned value
     *       },
     *       leave(node, key, parent, path, ancestors) {
     *         // @return
     *         //   undefined: no action
     *         //   false: no action
     *         //   visitor.BREAK: stop visiting altogether
     *         //   null: delete this node
     *         //   any value: replace this node with the returned value
     *       }
     *     });
     *
     * Alternatively to providing enter() and leave() functions, a visitor can
     * instead provide functions named the same as the kinds of AST nodes, or
     * enter/leave visitors at a named key, leading to four permutations of the
     * visitor API:
     *
     * 1) Named visitors triggered when entering a node of a specific kind.
     *
     *     visit(ast, {
     *       Kind(node) {
     *         // enter the "Kind" node
     *       }
     *     })
     *
     * 2) Named visitors that trigger upon entering and leaving a node of
     *    a specific kind.
     *
     *     visit(ast, {
     *       Kind: {
     *         enter(node) {
     *           // enter the "Kind" node
     *         }
     *         leave(node) {
     *           // leave the "Kind" node
     *         }
     *       }
     *     })
     *
     * 3) Generic visitors that trigger upon entering and leaving any node.
     *
     *     visit(ast, {
     *       enter(node) {
     *         // enter any node
     *       },
     *       leave(node) {
     *         // leave any node
     *       }
     *     })
     *
     * 4) Parallel visitors for entering and leaving nodes of a specific kind.
     *
     *     visit(ast, {
     *       enter: {
     *         Kind(node) {
     *           // enter the "Kind" node
     *         }
     *       },
     *       leave: {
     *         Kind(node) {
     *           // leave the "Kind" node
     *         }
     *       }
     *     })
     */

    function visit(root, visitor) {
      var visitorKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : QueryDocumentKeys;

      /* eslint-disable no-undef-init */
      var stack = undefined;
      var inArray = Array.isArray(root);
      var keys = [root];
      var index = -1;
      var edits = [];
      var node = undefined;
      var key = undefined;
      var parent = undefined;
      var path = [];
      var ancestors = [];
      var newRoot = root;
      /* eslint-enable no-undef-init */

      do {
        index++;
        var isLeaving = index === keys.length;
        var isEdited = isLeaving && edits.length !== 0;

        if (isLeaving) {
          key = ancestors.length === 0 ? undefined : path[path.length - 1];
          node = parent;
          parent = ancestors.pop();

          if (isEdited) {
            if (inArray) {
              node = node.slice();
            } else {
              var clone = {};

              for (var _i2 = 0, _Object$keys2 = Object.keys(node); _i2 < _Object$keys2.length; _i2++) {
                var k = _Object$keys2[_i2];
                clone[k] = node[k];
              }

              node = clone;
            }

            var editOffset = 0;

            for (var ii = 0; ii < edits.length; ii++) {
              var editKey = edits[ii][0];
              var editValue = edits[ii][1];

              if (inArray) {
                editKey -= editOffset;
              }

              if (inArray && editValue === null) {
                node.splice(editKey, 1);
                editOffset++;
              } else {
                node[editKey] = editValue;
              }
            }
          }

          index = stack.index;
          keys = stack.keys;
          edits = stack.edits;
          inArray = stack.inArray;
          stack = stack.prev;
        } else {
          key = parent ? inArray ? index : keys[index] : undefined;
          node = parent ? parent[key] : newRoot;

          if (node === null || node === undefined) {
            continue;
          }

          if (parent) {
            path.push(key);
          }
        }

        var result = void 0;

        if (!Array.isArray(node)) {
          if (!isNode(node)) {
            throw new Error("Invalid AST Node: ".concat(inspect(node), "."));
          }

          var visitFn = getVisitFn(visitor, node.kind, isLeaving);

          if (visitFn) {
            result = visitFn.call(visitor, node, key, parent, path, ancestors);

            if (result === BREAK) {
              break;
            }

            if (result === false) {
              if (!isLeaving) {
                path.pop();
                continue;
              }
            } else if (result !== undefined) {
              edits.push([key, result]);

              if (!isLeaving) {
                if (isNode(result)) {
                  node = result;
                } else {
                  path.pop();
                  continue;
                }
              }
            }
          }
        }

        if (result === undefined && isEdited) {
          edits.push([key, node]);
        }

        if (isLeaving) {
          path.pop();
        } else {
          var _visitorKeys$node$kin;

          stack = {
            inArray: inArray,
            index: index,
            keys: keys,
            edits: edits,
            prev: stack
          };
          inArray = Array.isArray(node);
          keys = inArray ? node : (_visitorKeys$node$kin = visitorKeys[node.kind]) !== null && _visitorKeys$node$kin !== void 0 ? _visitorKeys$node$kin : [];
          index = -1;
          edits = [];

          if (parent) {
            ancestors.push(parent);
          }

          parent = node;
        }
      } while (stack !== undefined);

      if (edits.length !== 0) {
        newRoot = edits[edits.length - 1][1];
      }

      return newRoot;
    }
    /**
     * Given a visitor instance, if it is leaving or not, and a node kind, return
     * the function the visitor runtime should call.
     */

    function getVisitFn(visitor, kind, isLeaving) {
      var kindVisitor = visitor[kind];

      if (kindVisitor) {
        if (!isLeaving && typeof kindVisitor === 'function') {
          // { Kind() {} }
          return kindVisitor;
        }

        var kindSpecificVisitor = isLeaving ? kindVisitor.leave : kindVisitor.enter;

        if (typeof kindSpecificVisitor === 'function') {
          // { Kind: { enter() {}, leave() {} } }
          return kindSpecificVisitor;
        }
      } else {
        var specificVisitor = isLeaving ? visitor.leave : visitor.enter;

        if (specificVisitor) {
          if (typeof specificVisitor === 'function') {
            // { enter() {}, leave() {} }
            return specificVisitor;
          }

          var specificKindVisitor = specificVisitor[kind];

          if (typeof specificKindVisitor === 'function') {
            // { enter: { Kind() {} }, leave: { Kind() {} } }
            return specificKindVisitor;
          }
        }
      }
    }

    /**
     * Converts an AST into a string, using one set of reasonable
     * formatting rules.
     */

    function print(ast) {
      return visit(ast, {
        leave: printDocASTReducer
      });
    }
    var MAX_LINE_LENGTH = 80; // TODO: provide better type coverage in future

    var printDocASTReducer = {
      Name: function Name(node) {
        return node.value;
      },
      Variable: function Variable(node) {
        return '$' + node.name;
      },
      // Document
      Document: function Document(node) {
        return join(node.definitions, '\n\n') + '\n';
      },
      OperationDefinition: function OperationDefinition(node) {
        var op = node.operation;
        var name = node.name;
        var varDefs = wrap('(', join(node.variableDefinitions, ', '), ')');
        var directives = join(node.directives, ' ');
        var selectionSet = node.selectionSet; // Anonymous queries with no directives or variable definitions can use
        // the query short form.

        return !name && !directives && !varDefs && op === 'query' ? selectionSet : join([op, join([name, varDefs]), directives, selectionSet], ' ');
      },
      VariableDefinition: function VariableDefinition(_ref) {
        var variable = _ref.variable,
            type = _ref.type,
            defaultValue = _ref.defaultValue,
            directives = _ref.directives;
        return variable + ': ' + type + wrap(' = ', defaultValue) + wrap(' ', join(directives, ' '));
      },
      SelectionSet: function SelectionSet(_ref2) {
        var selections = _ref2.selections;
        return block(selections);
      },
      Field: function Field(_ref3) {
        var alias = _ref3.alias,
            name = _ref3.name,
            args = _ref3.arguments,
            directives = _ref3.directives,
            selectionSet = _ref3.selectionSet;
        var prefix = wrap('', alias, ': ') + name;
        var argsLine = prefix + wrap('(', join(args, ', '), ')');

        if (argsLine.length > MAX_LINE_LENGTH) {
          argsLine = prefix + wrap('(\n', indent(join(args, '\n')), '\n)');
        }

        return join([argsLine, join(directives, ' '), selectionSet], ' ');
      },
      Argument: function Argument(_ref4) {
        var name = _ref4.name,
            value = _ref4.value;
        return name + ': ' + value;
      },
      // Fragments
      FragmentSpread: function FragmentSpread(_ref5) {
        var name = _ref5.name,
            directives = _ref5.directives;
        return '...' + name + wrap(' ', join(directives, ' '));
      },
      InlineFragment: function InlineFragment(_ref6) {
        var typeCondition = _ref6.typeCondition,
            directives = _ref6.directives,
            selectionSet = _ref6.selectionSet;
        return join(['...', wrap('on ', typeCondition), join(directives, ' '), selectionSet], ' ');
      },
      FragmentDefinition: function FragmentDefinition(_ref7) {
        var name = _ref7.name,
            typeCondition = _ref7.typeCondition,
            variableDefinitions = _ref7.variableDefinitions,
            directives = _ref7.directives,
            selectionSet = _ref7.selectionSet;
        return (// Note: fragment variable definitions are experimental and may be changed
          // or removed in the future.
          "fragment ".concat(name).concat(wrap('(', join(variableDefinitions, ', '), ')'), " ") + "on ".concat(typeCondition, " ").concat(wrap('', join(directives, ' '), ' ')) + selectionSet
        );
      },
      // Value
      IntValue: function IntValue(_ref8) {
        var value = _ref8.value;
        return value;
      },
      FloatValue: function FloatValue(_ref9) {
        var value = _ref9.value;
        return value;
      },
      StringValue: function StringValue(_ref10, key) {
        var value = _ref10.value,
            isBlockString = _ref10.block;
        return isBlockString ? printBlockString(value, key === 'description' ? '' : '  ') : JSON.stringify(value);
      },
      BooleanValue: function BooleanValue(_ref11) {
        var value = _ref11.value;
        return value ? 'true' : 'false';
      },
      NullValue: function NullValue() {
        return 'null';
      },
      EnumValue: function EnumValue(_ref12) {
        var value = _ref12.value;
        return value;
      },
      ListValue: function ListValue(_ref13) {
        var values = _ref13.values;
        return '[' + join(values, ', ') + ']';
      },
      ObjectValue: function ObjectValue(_ref14) {
        var fields = _ref14.fields;
        return '{' + join(fields, ', ') + '}';
      },
      ObjectField: function ObjectField(_ref15) {
        var name = _ref15.name,
            value = _ref15.value;
        return name + ': ' + value;
      },
      // Directive
      Directive: function Directive(_ref16) {
        var name = _ref16.name,
            args = _ref16.arguments;
        return '@' + name + wrap('(', join(args, ', '), ')');
      },
      // Type
      NamedType: function NamedType(_ref17) {
        var name = _ref17.name;
        return name;
      },
      ListType: function ListType(_ref18) {
        var type = _ref18.type;
        return '[' + type + ']';
      },
      NonNullType: function NonNullType(_ref19) {
        var type = _ref19.type;
        return type + '!';
      },
      // Type System Definitions
      SchemaDefinition: addDescription(function (_ref20) {
        var directives = _ref20.directives,
            operationTypes = _ref20.operationTypes;
        return join(['schema', join(directives, ' '), block(operationTypes)], ' ');
      }),
      OperationTypeDefinition: function OperationTypeDefinition(_ref21) {
        var operation = _ref21.operation,
            type = _ref21.type;
        return operation + ': ' + type;
      },
      ScalarTypeDefinition: addDescription(function (_ref22) {
        var name = _ref22.name,
            directives = _ref22.directives;
        return join(['scalar', name, join(directives, ' ')], ' ');
      }),
      ObjectTypeDefinition: addDescription(function (_ref23) {
        var name = _ref23.name,
            interfaces = _ref23.interfaces,
            directives = _ref23.directives,
            fields = _ref23.fields;
        return join(['type', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
      }),
      FieldDefinition: addDescription(function (_ref24) {
        var name = _ref24.name,
            args = _ref24.arguments,
            type = _ref24.type,
            directives = _ref24.directives;
        return name + (hasMultilineItems(args) ? wrap('(\n', indent(join(args, '\n')), '\n)') : wrap('(', join(args, ', '), ')')) + ': ' + type + wrap(' ', join(directives, ' '));
      }),
      InputValueDefinition: addDescription(function (_ref25) {
        var name = _ref25.name,
            type = _ref25.type,
            defaultValue = _ref25.defaultValue,
            directives = _ref25.directives;
        return join([name + ': ' + type, wrap('= ', defaultValue), join(directives, ' ')], ' ');
      }),
      InterfaceTypeDefinition: addDescription(function (_ref26) {
        var name = _ref26.name,
            interfaces = _ref26.interfaces,
            directives = _ref26.directives,
            fields = _ref26.fields;
        return join(['interface', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
      }),
      UnionTypeDefinition: addDescription(function (_ref27) {
        var name = _ref27.name,
            directives = _ref27.directives,
            types = _ref27.types;
        return join(['union', name, join(directives, ' '), types && types.length !== 0 ? '= ' + join(types, ' | ') : ''], ' ');
      }),
      EnumTypeDefinition: addDescription(function (_ref28) {
        var name = _ref28.name,
            directives = _ref28.directives,
            values = _ref28.values;
        return join(['enum', name, join(directives, ' '), block(values)], ' ');
      }),
      EnumValueDefinition: addDescription(function (_ref29) {
        var name = _ref29.name,
            directives = _ref29.directives;
        return join([name, join(directives, ' ')], ' ');
      }),
      InputObjectTypeDefinition: addDescription(function (_ref30) {
        var name = _ref30.name,
            directives = _ref30.directives,
            fields = _ref30.fields;
        return join(['input', name, join(directives, ' '), block(fields)], ' ');
      }),
      DirectiveDefinition: addDescription(function (_ref31) {
        var name = _ref31.name,
            args = _ref31.arguments,
            repeatable = _ref31.repeatable,
            locations = _ref31.locations;
        return 'directive @' + name + (hasMultilineItems(args) ? wrap('(\n', indent(join(args, '\n')), '\n)') : wrap('(', join(args, ', '), ')')) + (repeatable ? ' repeatable' : '') + ' on ' + join(locations, ' | ');
      }),
      SchemaExtension: function SchemaExtension(_ref32) {
        var directives = _ref32.directives,
            operationTypes = _ref32.operationTypes;
        return join(['extend schema', join(directives, ' '), block(operationTypes)], ' ');
      },
      ScalarTypeExtension: function ScalarTypeExtension(_ref33) {
        var name = _ref33.name,
            directives = _ref33.directives;
        return join(['extend scalar', name, join(directives, ' ')], ' ');
      },
      ObjectTypeExtension: function ObjectTypeExtension(_ref34) {
        var name = _ref34.name,
            interfaces = _ref34.interfaces,
            directives = _ref34.directives,
            fields = _ref34.fields;
        return join(['extend type', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
      },
      InterfaceTypeExtension: function InterfaceTypeExtension(_ref35) {
        var name = _ref35.name,
            interfaces = _ref35.interfaces,
            directives = _ref35.directives,
            fields = _ref35.fields;
        return join(['extend interface', name, wrap('implements ', join(interfaces, ' & ')), join(directives, ' '), block(fields)], ' ');
      },
      UnionTypeExtension: function UnionTypeExtension(_ref36) {
        var name = _ref36.name,
            directives = _ref36.directives,
            types = _ref36.types;
        return join(['extend union', name, join(directives, ' '), types && types.length !== 0 ? '= ' + join(types, ' | ') : ''], ' ');
      },
      EnumTypeExtension: function EnumTypeExtension(_ref37) {
        var name = _ref37.name,
            directives = _ref37.directives,
            values = _ref37.values;
        return join(['extend enum', name, join(directives, ' '), block(values)], ' ');
      },
      InputObjectTypeExtension: function InputObjectTypeExtension(_ref38) {
        var name = _ref38.name,
            directives = _ref38.directives,
            fields = _ref38.fields;
        return join(['extend input', name, join(directives, ' '), block(fields)], ' ');
      }
    };

    function addDescription(cb) {
      return function (node) {
        return join([node.description, cb(node)], '\n');
      };
    }
    /**
     * Given maybeArray, print an empty string if it is null or empty, otherwise
     * print all items together separated by separator if provided
     */


    function join(maybeArray) {
      var _maybeArray$filter$jo;

      var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      return (_maybeArray$filter$jo = maybeArray === null || maybeArray === void 0 ? void 0 : maybeArray.filter(function (x) {
        return x;
      }).join(separator)) !== null && _maybeArray$filter$jo !== void 0 ? _maybeArray$filter$jo : '';
    }
    /**
     * Given array, print each item on its own line, wrapped in an
     * indented "{ }" block.
     */


    function block(array) {
      return wrap('{\n', indent(join(array, '\n')), '\n}');
    }
    /**
     * If maybeString is not null or empty, then wrap with start and end, otherwise print an empty string.
     */


    function wrap(start, maybeString) {
      var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      return maybeString != null && maybeString !== '' ? start + maybeString + end : '';
    }

    function indent(str) {
      return wrap('  ', str.replace(/\n/g, '\n  '));
    }

    function isMultiline(str) {
      return str.indexOf('\n') !== -1;
    }

    function hasMultilineItems(maybeArray) {
      return maybeArray != null && maybeArray.some(isMultiline);
    }

    function k(a) {
      return "string" == typeof a ? new GraphQLError(a) : "object" == typeof a && a.message ? new GraphQLError(a.message, a.nodes, a.source, a.positions, a.path, a, a.extensions || {}) : a;
    }

    function l() {
      return this.message;
    }

    function n$1(a, b) {
      a |= 0;
      for (var c = 0, d = 0 | b.length; c < d; c++) {
        a = (a << 5) + a + b.charCodeAt(c);
      }
      return a;
    }

    function t$1(a) {
      var b, c, d, e, f, g;
      if (null === a || q.has(a)) {
        return "null";
      }
      if ("object" != typeof a) {
        return JSON.stringify(a) || "";
      }
      if (a.toJSON) {
        return t$1(a.toJSON());
      }
      if (Array.isArray(a)) {
        for (b = "[", c = 0, d = a.length; c < d; c++) {
          0 < c && (b += ",");
          b += 0 < (e = t$1(a[c])).length ? e : "null";
        }
        return b + "]";
      }
      if (!(b = Object.keys(a).sort()).length && a.constructor && a.constructor !== Object) {
        return b = r$1.get(a) || Math.random().toString(36).slice(2), r$1.set(a, b), '{"__key":"' + b + '"}';
      }
      q.add(a);
      c = "{";
      d = 0;
      for (e = b.length; d < e; d++) {
        (g = t$1(a[f = b[d]])) && (1 < c.length && (c += ","), c += t$1(f) + ":" + g);
      }
      q.delete(a);
      return c + "}";
    }

    function u$1(a) {
      q.clear();
      return t$1(a);
    }

    function v$1(a) {
      var b = ("string" != typeof a ? a.loc && a.loc.source.body || print(a) : a).replace(/([\s,]|#[^\n\r]+)+/g, " ").trim();
      "string" != typeof a && (a.loc ? (a = "definitions" in a && w$1(a)) && (b = "# " + a + "\n" + b) : a.loc = {
        start: 0,
        end: b.length,
        source: {
          body: b,
          name: "gql",
          locationOffset: {
            line: 1,
            column: 1
          }
        }
      });
      return b;
    }

    function y$1(a) {
      if ("string" == typeof a) {
        var b = n$1(5381, v$1(a)) >>> 0;
        a = x$1.get(b) || parse(a, {
          noLocation: !0
        });
      } else {
        b = a.__key || n$1(5381, v$1(a)) >>> 0, a = x$1.get(b) || a;
      }
      a.loc || v$1(a);
      a.__key = b;
      x$1.set(b, a);
      return a;
    }

    function w$1(a) {
      var b, c, d;
      for (b = 0, c = a.definitions.length; b < c; b++) {
        if ((d = a.definitions[b]).kind === Kind.OPERATION_DEFINITION && d.name) {
          return d.name.value;
        }
      }
    }

    function z$1(a, b, c) {
      return {
        operation: a,
        data: b.data,
        error: Array.isArray(b.errors) ? new m({
          graphQLErrors: b.errors,
          response: c
        }) : void 0,
        extensions: "object" == typeof b.extensions && b.extensions || void 0
      };
    }

    function A(a, b, c) {
      return {
        operation: a,
        data: void 0,
        error: new m({
          networkError: b,
          response: c
        }),
        extensions: void 0
      };
    }

    function B() {
      return (B = Object.assign || function(a) {
        var b, c, d;
        for (b = 1; b < arguments.length; b++) {
          c = arguments[b];
          for (d in c) {
            Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d]);
          }
        }
        return a;
      }).apply(this, arguments);
    }

    function makeFetchBody(a) {
      return {
        query: print(a.query),
        operationName: w$1(a.query),
        variables: a.variables || void 0,
        extensions: void 0
      };
    }

    function makeFetchURL(a, b) {
      var c = a.context.url;
      if ("query" !== a.kind || !a.context.preferGetMethod || !b) {
        return c;
      }
      a = [];
      b.operationName && a.push("operationName=" + encodeURIComponent(b.operationName));
      b.query && a.push("query=" + encodeURIComponent(b.query.replace(/([\s,]|#[^\n\r]+)+/g, " ").trim()));
      b.variables && a.push("variables=" + encodeURIComponent(u$1(b.variables)));
      b.extensions && a.push("extensions=" + encodeURIComponent(u$1(b.extensions)));
      return c + "?" + a.join("&");
    }

    function makeFetchOptions(a, b) {
      var c = "query" === a.kind && !!a.context.preferGetMethod;
      return B({}, a = "function" == typeof a.context.fetchOptions ? a.context.fetchOptions() : a.context.fetchOptions || {}, {
        body: !c && b ? JSON.stringify(b) : void 0,
        method: c ? "GET" : "POST",
        headers: c ? a.headers : B({}, {
          "content-type": "application/json"
        }, a.headers)
      });
    }

    function makeFetchSource(a, b, c) {
      return make$1((function(d) {
        var e = d.next, f = d.complete, g = "undefined" != typeof AbortController ? new AbortController : null, p = !1;
        Promise.resolve().then((function() {
          if (!p) {
            return g && (c.signal = g.signal), function C(a, b, c) {
              var e, d = !1;
              return (a.context.fetch || fetch)(b, c).then((function(a) {
                e = a;
                d = 200 > a.status || a.status >= ("manual" === c.redirect ? 400 : 300);
                return a.json();
              })).then((function(b) {
                if (!("data" in b) && !("errors" in b)) {
                  throw Error("No Content");
                }
                return z$1(a, b, e);
              })).catch((function(b) {
                if ("AbortError" !== b.name) {
                  return A(a, d ? Error(e.statusText) : b, e);
                }
              }));
            }(a, b, c);
          }
        })).then((function(a) {
          p || (p = !0, a && e(a), f());
        }));
        return function() {
          p = !0;
          g && g.abort();
        };
      }));
    }

    function createRequest(a, b) {
      a = y$1(a);
      return {
        key: b ? n$1(a.__key, u$1(b)) >>> 0 : a.__key,
        query: a,
        variables: b || {}
      };
    }

    var m, q, r$1, x$1;

    m = function(a) {
      function b(b) {
        var f, c = b.networkError, e = b.response;
        f = function h(a, b) {
          var d = "";
          if (void 0 !== a) {
            return d = "[Network] " + a.message;
          }
          void 0 !== b && b.forEach((function c(a) {
            d += "[GraphQL] " + a.message + "\n";
          }));
          return d.trim();
        }(c, b = (b.graphQLErrors || []).map(k));
        a.call(this, f);
        this.name = "CombinedError";
        this.message = f;
        this.graphQLErrors = b;
        this.networkError = c;
        this.response = e;
      }
      a && (b.__proto__ = a);
      (b.prototype = Object.create(a && a.prototype)).constructor = b;
      b.prototype.toString = l;
      return b;
    }(Error);

    q = new Set, r$1 = new WeakMap;

    x$1 = new Map;

    function n(a, b) {
      if (Array.isArray(a)) {
        for (var c = 0; c < a.length; c++) {
          n(a[c], b);
        }
      } else if ("object" == typeof a && null !== a) {
        for (c in a) {
          "__typename" === c && "string" == typeof a[c] ? b[a[c]] = 0 : n(a[c], b);
        }
      }
      return b;
    }

    function p(a) {
      return a.kind === Kind.FIELD && "__typename" === a.name.value && !a.alias;
    }

    function r(a) {
      if (a.selectionSet && !a.selectionSet.selections.some(p)) {
        return B({}, a, {
          selectionSet: B({}, a.selectionSet, {
            selections: a.selectionSet.selections.concat([ {
              kind: Kind.FIELD,
              name: {
                kind: Kind.NAME,
                value: "__typename"
              }
            } ])
          })
        });
      }
    }

    function u(a) {
      a = y$1(a);
      var b = t.get(a.__key);
      b || ((b = visit(a, {
        Field: r,
        InlineFragment: r
      })).__key = a.__key, t.set(a.__key, b));
      return b;
    }

    function v(a) {
      return a && "object" == typeof a ? Object.keys(a).reduce((function(b, c) {
        var d = a[c];
        "__typename" === c ? Object.defineProperty(b, "__typename", {
          enumerable: !1,
          value: d
        }) : Array.isArray(d) ? b[c] = d.map(v) : b[c] = d && "object" == typeof d && "__typename" in d ? v(d) : d;
        return b;
      }), {}) : a;
    }

    function w(a) {
      a.toPromise = function() {
        return toPromise$1(take$1(1)(a));
      };
      return a;
    }

    function x(a, b, c) {
      c || (c = b.context);
      return {
        key: b.key,
        query: b.query,
        variables: b.variables,
        kind: a,
        context: c
      };
    }

    function y(a, b) {
      return x(a.kind, a, B({}, a.context, {
        meta: B({}, a.context.meta, b)
      }));
    }

    function z() {}

    function D(a) {
      return "mutation" !== (a = a.kind) && "query" !== a;
    }

    function E(a) {
      var b = x(a.kind, a);
      b.query = u(a.query);
      return b;
    }

    function F(a) {
      return "query" !== a.kind || "cache-only" !== a.context.requestPolicy;
    }

    function G(a) {
      return y(a, {
        cacheOutcome: "miss"
      });
    }

    function H(a) {
      return D(a);
    }

    function I(a) {
      function b(a) {
        var b = a.context.requestPolicy;
        return "query" === a.kind && "network-only" !== b && ("cache-only" === b || k.has(a.key));
      }
      function c(a) {
        var c = k.get(a.key);
        "production" !== process.env.NODE_ENV && q(B({}, {
          operation: a
        }, c ? {
          type: "cacheHit",
          message: "The result was successfully retried from the cache"
        } : {
          type: "cacheMiss",
          message: "The result could not be retrieved from the cache"
        }));
        c = B({}, c, {
          operation: y(a, {
            cacheOutcome: c ? "hit" : "miss"
          })
        });
        "cache-and-network" === a.context.requestPolicy && (c.stale = !0, J(m, a));
        return c;
      }
      function d(a) {
        return !D(a) && b(a);
      }
      function e(a) {
        function c(a) {
          g.add(a);
        }
        var e, g, l, d = a.operation;
        if (d) {
          e = Object.keys(n(a.data, {})).concat(d.context.additionalTypenames || []);
          if ("mutation" === a.operation.kind) {
            g = new Set;
            "production" !== process.env.NODE_ENV && q({
              type: "cacheInvalidation",
              message: "The following typenames have been invalidated: " + e,
              operation: d,
              data: {
                typenames: e,
                response: a
              },
              source: "cacheExchange"
            });
            for (a = 0; a < e.length; a++) {
              (l = h[l = e[a]] || (h[l] = new Set)).forEach(c);
              l.clear();
            }
            g.forEach((function b(a) {
              k.has(a) && (d = k.get(a).operation, k.delete(a), J(m, d));
            }));
          } else if ("query" === d.kind && a.data) {
            for (k.set(d.key, a), a = 0; a < e.length; a++) {
              (h[l = e[a]] || (h[l] = new Set)).add(d.key);
            }
          }
        }
      }
      function f(a) {
        return !D(a) && !b(a);
      }
      var g = a.forward, m = a.client, q = a.dispatchDebug, k = new Map, h = Object.create(null);
      return function(a) {
        var b = share$1(a);
        a = map$1(c)(filter$1(d)(b));
        b = H$1(e)(g(filter$1(F)(map$1(G)(merge$1([ map$1(E)(filter$1(f)(b)), filter$1(H)(b) ])))));
        return merge$1([ a, b ]);
      };
    }

    function J(a, b) {
      return a.reexecuteOperation(x(b.kind, b, B({}, b.context, {
        requestPolicy: "network-only"
      })));
    }

    function M(a) {
      function b(a) {
        f.delete(a.operation.key);
      }
      function c(a) {
        var c = a.key, b = a.kind;
        if ("teardown" === b) {
          return f.delete(c), !0;
        }
        if ("query" !== b && "subscription" !== b) {
          return !0;
        }
        b = f.has(c);
        f.add(c);
        b && "production" !== process.env.NODE_ENV && e({
          type: "dedup",
          message: "An operation has been deduped.",
          operation: a,
          source: "dedupExchange"
        });
        return !b;
      }
      var d = a.forward, e = a.dispatchDebug, f = new Set;
      return function(a) {
        a = filter$1(c)(a);
        return H$1(b)(d(a));
      };
    }

    function N(a) {
      return "query" === a.kind || "mutation" === a.kind;
    }

    function O(a) {
      return "query" !== a.kind && "mutation" !== a.kind;
    }

    function P(a) {
      var b = a.forward, c = a.dispatchDebug;
      return function(a) {
        var f, d = share$1(a);
        a = D$1((function(a) {
          var b = a.key, e = filter$1((function(a) {
            return "teardown" === a.kind && a.key === b;
          }))(d), g = makeFetchBody(a), h = makeFetchURL(a, g), l = makeFetchOptions(a, g);
          "production" !== process.env.NODE_ENV && c({
            type: "fetchRequest",
            message: "A fetch request is being executed.",
            operation: a,
            data: {
              url: h,
              fetchOptions: l
            },
            source: "fetchExchange"
          });
          return H$1((function(b) {
            var d = b.data ? void 0 : b.error;
            "production" !== process.env.NODE_ENV && c({
              type: d ? "fetchError" : "fetchSuccess",
              message: "A " + (d ? "failed" : "successful") + " fetch response has been returned.",
              operation: a,
              data: {
                url: h,
                fetchOptions: l,
                value: d || b
              },
              source: "fetchExchange"
            });
          }))(takeUntil$1(e)(makeFetchSource(a, h, l)));
        }))(filter$1(N)(d));
        f = b(filter$1(O)(d));
        return merge$1([ a, f ]);
      };
    }

    function Q() {
      return !1;
    }

    function R(a) {
      function b(a) {
        if ("teardown" !== a.kind && "production" !== process.env.NODE_ENV) {
          var b = 'No exchange has handled operations of kind "' + a.kind + "\". Check whether you've added an exchange responsible for these operations.";
          "production" !== process.env.NODE_ENV && c({
            type: "fallbackCatch",
            message: b,
            operation: a,
            source: "fallbackExchange"
          });
          console.warn(b);
        }
      }
      var c = a.dispatchDebug;
      return function(a) {
        return filter$1(Q)(H$1(b)(a));
      };
    }

    function T(a) {
      return function(b) {
        var c = b.client, d = b.dispatchDebug;
        return a.reduceRight((function(a, b) {
          return b({
            client: c,
            forward: a,
            dispatchDebug: function(a) {
              "production" !== process.env.NODE_ENV && d(B({}, {
                timestamp: Date.now(),
                source: b.name
              }, a));
            }
          });
        }), b.forward);
      };
    }

    function V(a) {
      var d, e, f, g, m, c = this;
      this.activeOperations = Object.create(null);
      this.queue = [];
      this.createOperationContext = function(a) {
        a || (a = {});
        return B({}, {
          url: c.url,
          fetchOptions: c.fetchOptions,
          fetch: c.fetch,
          preferGetMethod: c.preferGetMethod
        }, a, {
          suspense: a.suspense || !1 !== a.suspense && c.suspense,
          requestPolicy: a.requestPolicy || c.requestPolicy
        });
      };
      this.createRequestOperation = function(a, b, d) {
        return x(a, b, c.createOperationContext(d));
      };
      this.executeQuery = function(a, b) {
        a = c.createRequestOperation("query", a, b);
        return c.executeRequestOperation(a);
      };
      this.executeSubscription = function(a, b) {
        a = c.createRequestOperation("subscription", a, b);
        return c.executeRequestOperation(a);
      };
      this.executeMutation = function(a, b) {
        a = c.createRequestOperation("mutation", a, b);
        return c.executeRequestOperation(a);
      };
      if ("production" !== process.env.NODE_ENV && !a.url) {
        throw Error("You are creating an urql-client without a url.");
      }
      d = z;
      if ("production" !== process.env.NODE_ENV) {
        e = (d = makeSubject$1()).next, f = d.source;
        this.subscribeToDebugTarget = function b(a) {
          return N$1(a)(f);
        };
        d = e;
      }
      this.url = a.url;
      this.fetchOptions = a.fetchOptions;
      this.fetch = a.fetch;
      this.suspense = !!a.suspense;
      this.requestPolicy = a.requestPolicy || "cache-first";
      this.preferGetMethod = !!a.preferGetMethod;
      this.maskTypename = !!a.maskTypename;
      e = makeSubject$1();
      g = e.next;
      this.operations$ = e.source;
      m = !1;
      this.dispatchOperation = function(a) {
        m = !0;
        for (a && g(a); a = c.queue.shift(); ) {
          g(a);
        }
        m = !1;
      };
      this.reexecuteOperation = function(a) {
        if ("mutation" === a.kind || 0 < (c.activeOperations[a.key] || 0)) {
          c.queue.push(a), m || Promise.resolve().then(c.dispatchOperation);
        }
      };
      a = T(void 0 !== a.exchanges ? a.exchanges : U);
      this.results$ = share$1(a({
        client: this,
        dispatchDebug: d,
        forward: R({
          dispatchDebug: d
        })
      })(this.operations$));
      publish$1(this.results$);
    }

    function W(a) {
      a.data = v(a.data);
      return a;
    }

    var t, U;

    t = new Map;

    R({
      dispatchDebug: z
    });

    U = [ M, I, P ];

    V.prototype.onOperationStart = function(a) {
      var b = a.key;
      this.activeOperations[b] = (this.activeOperations[b] || 0) + 1;
      this.dispatchOperation(a);
    };

    V.prototype.onOperationEnd = function(a) {
      var b = a.key, c = this.activeOperations[b] || 0;
      if (0 >= (this.activeOperations[b] = 0 >= c ? 0 : c - 1)) {
        for (b = this.queue.length - 1; 0 <= b; b--) {
          this.queue[b].key === a.key && this.queue.splice(b, 1);
        }
        this.dispatchOperation(x("teardown", a, a.context));
      }
    };

    V.prototype.executeRequestOperation = function(a) {
      var e, f, c = this, d = filter$1((function(b) {
        return b.operation.key === a.key;
      }))(this.results$);
      this.maskTypename && (d = map$1(W)(d));
      if ("mutation" === a.kind) {
        return take$1(1)(onStart$1((function b() {
          return c.dispatchOperation(a);
        }))(d));
      }
      e = filter$1((function(b) {
        return "teardown" === b.kind && b.key === a.key;
      }))(this.operations$), f = filter$1((function(b) {
        return b.kind === a.kind && b.key === a.key && "cache-only" !== b.context.requestPolicy;
      }))(this.operations$);
      return onEnd$1((function() {
        c.onOperationEnd(a);
      }))(onStart$1((function() {
        c.onOperationStart(a);
      }))(K((function(a) {
        return a.stale ? fromValue$1(a) : merge$1([ fromValue$1(a), map$1((function() {
          return B({}, a, {
            stale: !0
          });
        }))(take$1(1)(f)) ]);
      }))(takeUntil$1(e)(d))));
    };

    V.prototype.query = function(a, b, c) {
      c && "boolean" == typeof c.suspense || (c = B({}, c, {
        suspense: !1
      }));
      return w(this.executeQuery(createRequest(a, b), c));
    };

    V.prototype.readQuery = function(a, b, c) {
      var d = null;
      N$1((function(a) {
        d = a;
      }))(this.executeQuery(createRequest(a, b), c)).unsubscribe();
      return d;
    };

    V.prototype.subscription = function(a, b, c) {
      return this.executeSubscription(createRequest(a, b), c);
    };

    V.prototype.mutation = function(a, b, c) {
      return w(this.executeMutation(createRequest(a, b), c));
    };

    function _extends() {
      return (_extends = Object.assign || function(target) {
        var i, source, key;
        for (i = 1; i < arguments.length; i++) {
          source = arguments[i];
          for (key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
        return target;
      }).apply(this, arguments);
    }

    function _set() {
      throw new TypeError("It is not allowed to update result properties on an OperationStore.");
    }

    function operationStore(query, variables, context) {
      var result, internal = {
        query: query,
        variables: variables || null,
        context: context
      }, state = {
        stale: !1,
        fetching: !0,
        data: void 0,
        error: void 0,
        extensions: void 0
      }, svelteStore = writable(state), _internalUpdate = !1;
      state.set = function set(value) {
        var key, key$1;
        if (!value || value === state) {
          value = emptyUpdate;
        }
        _internalUpdate = !0;
        if ("production" !== process.env.NODE_ENV) {
          if (!_storeUpdate.has(value)) {
            for (key in value) {
              if (!(key in internal)) {
                throw new TypeError("It is not allowed to update result properties on an OperationStore.");
              }
            }
          }
          _storeUpdate.delete(value);
        }
        for (key$1 in value) {
          if ("query" === key$1 || "variables" === key$1 || "context" === key$1) {
            internal[key$1] = value[key$1];
          } else if ("fetching" === key$1) {
            state[key$1] = !!value[key$1];
          } else if (key$1 in state) {
            state[key$1] = value[key$1];
          }
        }
        state.stale = !!value.stale;
        _internalUpdate = !1;
        svelteStore.set(state);
      };
      state.update = function update(fn) {
        state.set(fn(state));
      };
      state.subscribe = function subscribe(run, invalidate) {
        return svelteStore.subscribe(run, invalidate);
      };
      Object.keys(internal).forEach((function(prop) {
        Object.defineProperty(state, prop, {
          configurable: !1,
          get: function() {
            return internal[prop];
          },
          set: function set(value) {
            internal[prop] = value;
            if (!_internalUpdate) {
              svelteStore.set(state);
            }
          }
        });
      }));
      if ("production" !== process.env.NODE_ENV) {
        result = _extends({}, state);
        Object.keys(state).forEach((function _ref(prop) {
          Object.defineProperty(result, prop, {
            configurable: !1,
            get: function get() {
              return state[prop];
            },
            set: _set
          });
        }));
        Object.keys(internal).forEach((function _ref2(prop) {
          Object.defineProperty(result, prop, {
            configurable: !1,
            get: function() {
              return internal[prop];
            },
            set: function set(value) {
              internal[prop] = value;
              if (!_internalUpdate) {
                svelteStore.set(state);
              }
            }
          });
        }));
        return result;
      }
      return state;
    }

    function toSource$1(store) {
      return make$1((function(observer) {
        var $request, $contextKey;
        return store.subscribe((function(state) {
          var request = createRequest(state.query, state.variables), contextKey = u$1(request.context = state.context);
          if (void 0 === $request || request.key !== $request.key || void 0 === $contextKey || contextKey !== $contextKey) {
            $contextKey = contextKey;
            $request = request;
            observer.next(request);
          }
        }));
      }));
    }

    function _ref(result, partial) {
      return _extends({}, result, partial);
    }

    function _ref2(result) {
      return _extends({}, {
        fetching: !1
      }, result, {
        stale: !!result.stale
      });
    }

    function query(store) {
      var client = getClient(), subscription = N$1((function(update) {
        _markStoreUpdate(update);
        store.set(update);
      }))(scan$1(_ref, baseState)(K((function(request) {
        if (request.context && request.context.pause) {
          return fromValue$1({
            fetching: !1,
            stale: !1
          });
        }
        return concat$1([ fromValue$1({
          fetching: !0,
          stale: !1
        }), map$1(_ref2)(client.executeQuery(request, request.context)), fromValue$1({
          fetching: !1,
          stale: !1
        }) ]);
      }))(toSource$1(store))));
      onDestroy(subscription.unsubscribe);
      return store;
    }

    var _contextKey, _storeUpdate, _markStoreUpdate, emptyUpdate, getClient, setClient, initClient, baseState;

    _contextKey = "$$_urql";

    _storeUpdate = new Set;

    _markStoreUpdate = "production" !== process.env.NODE_ENV ? function(value) {
      return _storeUpdate.add(value);
    } : function() {
      return;
    };

    emptyUpdate = Object.create(null);

    getClient = function() {
      return getContext(_contextKey);
    };

    setClient = function(client) {
      setContext(_contextKey, client);
    };

    initClient = function(args) {
      var client = new V(args);
      setClient(client);
      return client;
    };

    baseState = {
      fetching: !1,
      stale: !1,
      error: void 0,
      data: void 0,
      extensions: void 0
    };

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /** Built-in value references. */
    var Symbol$1 = root.Symbol;

    /** Used for built-in method references. */
    var objectProto$c = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$9 = objectProto$c.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$c.toString;

    /** Built-in value references. */
    var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty$9.call(value, symToStringTag$1),
          tag = value[symToStringTag$1];

      try {
        value[symToStringTag$1] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString$1.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag$1] = tag;
        } else {
          delete value[symToStringTag$1];
        }
      }
      return result;
    }

    /** Used for built-in method references. */
    var objectProto$b = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto$b.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /** `Object#toString` result references. */
    var symbolTag$1 = '[object Symbol]';

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag$1);
    }

    /**
     * A specialized version of `_.map` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
          length = array == null ? 0 : array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /** Used as references for various `Number` constants. */
    var INFINITY$2 = 1 / 0;

    /** Used to convert symbols to primitives and strings. */
    var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : undefined,
        symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return arrayMap(value, baseToString) + '';
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
    }

    /** Used to match a single whitespace character. */
    var reWhitespace = /\s/;

    /**
     * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
     * character of `string`.
     *
     * @private
     * @param {string} string The string to inspect.
     * @returns {number} Returns the index of the last non-whitespace character.
     */
    function trimmedEndIndex(string) {
      var index = string.length;

      while (index-- && reWhitespace.test(string.charAt(index))) {}
      return index;
    }

    /** Used to match leading whitespace. */
    var reTrimStart = /^\s+/;

    /**
     * The base implementation of `_.trim`.
     *
     * @private
     * @param {string} string The string to trim.
     * @returns {string} Returns the trimmed string.
     */
    function baseTrim(string) {
      return string
        ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
        : string;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /** Used as references for various `Number` constants. */
    var NAN = 0 / 0;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    var reIsOctal = /^0o[0-7]+$/i;

    /** Built-in method references without a dependency on `root`. */
    var freeParseInt = parseInt;

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /** Used as references for various `Number` constants. */
    var INFINITY$1 = 1 / 0,
        MAX_INTEGER = 1.7976931348623157e+308;

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY$1 || value === -INFINITY$1) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    /** `Object#toString` result references. */
    var asyncTag = '[object AsyncFunction]',
        funcTag$1 = '[object Function]',
        genTag = '[object GeneratorFunction]',
        proxyTag = '[object Proxy]';

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root['__core-js_shared__'];

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /** Used for built-in method references. */
    var funcProto$1 = Function.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString$1 = funcProto$1.toString;

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString$1.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used for built-in method references. */
    var funcProto = Function.prototype,
        objectProto$a = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty$8).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /* Built-in method references that are verified to be native. */
    var WeakMap$1 = getNative(root, 'WeakMap');

    var defineProperty = (function() {
      try {
        var func = getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER$1 = 9007199254740991;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER$1 : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    /**
     * The base implementation of `assignValue` and `assignMergeValue` without
     * value checks.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function baseAssignValue(object, key, value) {
      if (key == '__proto__' && defineProperty) {
        defineProperty(object, key, {
          'configurable': true,
          'enumerable': true,
          'value': value,
          'writable': true
        });
      } else {
        object[key] = value;
      }
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * Checks if the given arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
     *  else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
            ? (isArrayLike(object) && isIndex(index, object.length))
            : (type == 'string' && index in object)
          ) {
        return eq(object[index], value);
      }
      return false;
    }

    /** Used for built-in method references. */
    var objectProto$9 = Object.prototype;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$9;

      return value === proto;
    }

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    /** `Object#toString` result references. */
    var argsTag$2 = '[object Arguments]';

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag$2;
    }

    /** Used for built-in method references. */
    var objectProto$8 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$7 = objectProto$8.hasOwnProperty;

    /** Built-in value references. */
    var propertyIsEnumerable$1 = objectProto$8.propertyIsEnumerable;

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty$7.call(value, 'callee') &&
        !propertyIsEnumerable$1.call(value, 'callee');
    };

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    /** Detect free variable `exports`. */
    var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

    /** Built-in value references. */
    var Buffer = moduleExports$1 ? root.Buffer : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /** `Object#toString` result references. */
    var argsTag$1 = '[object Arguments]',
        arrayTag$1 = '[object Array]',
        boolTag$1 = '[object Boolean]',
        dateTag$1 = '[object Date]',
        errorTag$1 = '[object Error]',
        funcTag = '[object Function]',
        mapTag$2 = '[object Map]',
        numberTag$1 = '[object Number]',
        objectTag$2 = '[object Object]',
        regexpTag$1 = '[object RegExp]',
        setTag$2 = '[object Set]',
        stringTag$1 = '[object String]',
        weakMapTag$1 = '[object WeakMap]';

    var arrayBufferTag$1 = '[object ArrayBuffer]',
        dataViewTag$2 = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
    typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
    typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
    typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
    typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] =
    typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
    typedArrayTags[dataViewTag$2] = typedArrayTags[dateTag$1] =
    typedArrayTags[errorTag$1] = typedArrayTags[funcTag] =
    typedArrayTags[mapTag$2] = typedArrayTags[numberTag$1] =
    typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$1] =
    typedArrayTags[setTag$2] = typedArrayTags[stringTag$1] =
    typedArrayTags[weakMapTag$1] = false;

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike(value) &&
        isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }

    /** Detect free variable `exports`. */
    var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports && freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function() {
      try {
        // Use `util.types` for Node.js 10+.
        var types = freeModule && freeModule.require && freeModule.require('util').types;

        if (types) {
          return types;
        }

        // Legacy `process.binding('util')` for Node.js < 10.
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }());

    /* Node.js helper references. */
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

    /** Used for built-in method references. */
    var objectProto$7 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
          isArg = !isArr && isArguments(value),
          isBuff = !isArr && !isArg && isBuffer(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty$6.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeKeys = overArg(Object.keys, Object);

    /** Used for built-in method references. */
    var objectProto$6 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty$5.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /** Used to match property names within property paths. */
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        reIsPlainProp = /^\w*$/;

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    /* Built-in method references that are verified to be native. */
    var nativeCreate = getNative(Object, 'create');

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

    /** Used for built-in method references. */
    var objectProto$5 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED$2 ? undefined : result;
      }
      return hasOwnProperty$4.call(data, key) ? data[key] : undefined;
    }

    /** Used for built-in method references. */
    var objectProto$4 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
    }

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
      return this;
    }

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /** Used for built-in method references. */
    var arrayProto = Array.prototype;

    /** Built-in value references. */
    var splice = arrayProto.splice;

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /* Built-in method references that are verified to be native. */
    var Map$1 = getNative(root, 'Map');

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map$1 || ListCache),
        'string': new Hash
      };
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /** Error message constants. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = MapCache;

    /** Used as the maximum memoize cache size. */
    var MAX_MEMOIZE_SIZE = 500;

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped(func) {
      var result = memoize(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    /** Used to match property names within property paths. */
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

    /** Used to match backslashes in property paths. */
    var reEscapeChar = /\\(\\)?/g;

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : baseToString(value);
    }

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {Object} [object] The object to query keys on.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value, object) {
      if (isArray(value)) {
        return value;
      }
      return isKey(value, object) ? [value] : stringToPath(toString(value));
    }

    /** Used as references for various `Number` constants. */
    var INFINITY = 1 / 0;

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache;
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map$1 || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype['delete'] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /**
     * A specialized version of `_.filter` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /** Used for built-in method references. */
    var objectProto$3 = Object.prototype;

    /** Built-in value references. */
    var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols;

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(root, 'DataView');

    /* Built-in method references that are verified to be native. */
    var Promise$1 = getNative(root, 'Promise');

    /* Built-in method references that are verified to be native. */
    var Set$1 = getNative(root, 'Set');

    /** `Object#toString` result references. */
    var mapTag$1 = '[object Map]',
        objectTag$1 = '[object Object]',
        promiseTag = '[object Promise]',
        setTag$1 = '[object Set]',
        weakMapTag = '[object WeakMap]';

    var dataViewTag$1 = '[object DataView]';

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
        mapCtorString = toSource(Map$1),
        promiseCtorString = toSource(Promise$1),
        setCtorString = toSource(Set$1),
        weakMapCtorString = toSource(WeakMap$1);

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
        (Map$1 && getTag(new Map$1) != mapTag$1) ||
        (Promise$1 && getTag(Promise$1.resolve()) != promiseTag) ||
        (Set$1 && getTag(new Set$1) != setTag$1) ||
        (WeakMap$1 && getTag(new WeakMap$1) != weakMapTag)) {
      getTag = function(value) {
        var result = baseGetTag(value),
            Ctor = result == objectTag$1 ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag$1;
            case mapCtorString: return mapTag$1;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag$1;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    var getTag$1 = getTag;

    /** Built-in value references. */
    var Uint8Array = root.Uint8Array;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /**
     * A specialized version of `_.some` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    /**
     * Checks if a `cache` value for `key` exists.
     *
     * @private
     * @param {Object} cache The cache to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function cacheHas(cache, key) {
      return cache.has(key);
    }

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$5 = 1,
        COMPARE_UNORDERED_FLAG$3 = 2;

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Check that cyclic values are equal.
      var arrStacked = stack.get(array);
      var othStacked = stack.get(other);
      if (arrStacked && othStacked) {
        return arrStacked == other && othStacked == array;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG$3) ? new SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    /**
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */
    function mapToArray(map) {
      var index = -1,
          result = Array(map.size);

      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }

    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */
    function setToArray(set) {
      var index = -1,
          result = Array(set.size);

      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$4 = 1,
        COMPARE_UNORDERED_FLAG$2 = 2;

    /** `Object#toString` result references. */
    var boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        symbolTag = '[object Symbol]';

    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]';

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG$2;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$3 = 1;

    /** Used for built-in method references. */
    var objectProto$2 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3,
          objProps = getAllKeys(object),
          objLength = objProps.length,
          othProps = getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty$2.call(other, key))) {
          return false;
        }
      }
      // Check that cyclic values are equal.
      var objStacked = stack.get(object);
      var othStacked = stack.get(other);
      if (objStacked && othStacked) {
        return objStacked == other && othStacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$2 = 1;

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        objectTag = '[object Object]';

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = objIsArr ? arrayTag : getTag$1(object),
          othTag = othIsArr ? arrayTag : getTag$1(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return (objIsArr || isTypedArray(object))
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
        var objIsWrapped = objIsObj && hasOwnProperty$1.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty$1.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack);
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$1 = 1,
        COMPARE_UNORDERED_FLAG$1 = 2;

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack;
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === undefined
                ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = keys(object),
          length = result.length;

      while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }

    /**
     * A specialized version of `matchesProperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue &&
          (srcValue !== undefined || (key in Object(object)));
      };
    }

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      path = castPath(path, object);

      var index = -1,
          length = path.length,
          result = false;

      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength(length) && isIndex(key, length) &&
        (isArray(object) || isArguments(object));
    }

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b');
     * // => true
     *
     * _.hasIn(object, ['a', 'b']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG = 1,
        COMPARE_UNORDERED_FLAG = 2;

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn(object, path)
          : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': 2 } },
     *   { 'a': { 'b': 1 } }
     * ];
     *
     * _.map(objects, _.property('a.b'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }

    /**
     * A specialized version of `baseAggregator` for arrays.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function arrayAggregator(array, setter, iteratee, accumulator) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        var value = array[index];
        setter(accumulator, value, iteratee(value), array);
      }
      return accumulator;
    }

    /**
     * Creates a base function for methods like `_.forIn` and `_.forOwn`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1,
            iterable = Object(object),
            props = keysFunc(object),
            length = props.length;

        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * The base implementation of `baseForOwn` which iterates over `object`
     * properties returned by `keysFunc` and invokes `iteratee` for each property.
     * Iteratee functions may exit iteration early by explicitly returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * The base implementation of `_.forOwn` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return object && baseFor(object, iteratee, keys);
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length,
            index = fromRight ? length : -1,
            iterable = Object(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * The base implementation of `_.forEach` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * Aggregates elements of `collection` on `accumulator` with keys transformed
     * by `iteratee` and values set by `setter`.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} setter The function to set `accumulator` values.
     * @param {Function} iteratee The iteratee to transform keys.
     * @param {Object} accumulator The initial aggregated object.
     * @returns {Function} Returns `accumulator`.
     */
    function baseAggregator(collection, setter, iteratee, accumulator) {
      baseEach(collection, function(value, key, collection) {
        setter(accumulator, value, iteratee(value), collection);
      });
      return accumulator;
    }

    /**
     * Creates a function like `_.groupBy`.
     *
     * @private
     * @param {Function} setter The function to set accumulator values.
     * @param {Function} [initializer] The accumulator object initializer.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee) {
        var func = isArray(collection) ? arrayAggregator : baseAggregator,
            accumulator = initializer ? initializer() : {};

        return func(collection, setter, baseIteratee(iteratee), accumulator);
      };
    }

    /**
     * The base implementation of `_.map` without support for iteratee shorthands.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` thru `iteratee`. The order of grouped values
     * is determined by the order they occur in `collection`. The corresponding
     * value of each key is an array of elements responsible for generating the
     * key. The iteratee is invoked with one argument: (value).
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([6.1, 4.2, 6.3], Math.floor);
     * // => { '4': [4.2], '6': [6.1, 6.3] }
     *
     * // The `_.property` iteratee shorthand.
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        baseAssignValue(result, key, [value]);
      }
    });

    /**
     * The base implementation of `_.sortBy` which uses `comparer` to define the
     * sort order of `array` and replaces criteria objects with their corresponding
     * values.
     *
     * @private
     * @param {Array} array The array to sort.
     * @param {Function} comparer The function to define sort order.
     * @returns {Array} Returns `array`.
     */
    function baseSortBy(array, comparer) {
      var length = array.length;

      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }

    /**
     * Compares values to sort them in ascending order.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {number} Returns the sort order indicator for `value`.
     */
    function compareAscending(value, other) {
      if (value !== other) {
        var valIsDefined = value !== undefined,
            valIsNull = value === null,
            valIsReflexive = value === value,
            valIsSymbol = isSymbol(value);

        var othIsDefined = other !== undefined,
            othIsNull = other === null,
            othIsReflexive = other === other,
            othIsSymbol = isSymbol(other);

        if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
            (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
            (valIsNull && othIsDefined && othIsReflexive) ||
            (!valIsDefined && othIsReflexive) ||
            !valIsReflexive) {
          return 1;
        }
        if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
            (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
            (othIsNull && valIsDefined && valIsReflexive) ||
            (!othIsDefined && valIsReflexive) ||
            !othIsReflexive) {
          return -1;
        }
      }
      return 0;
    }

    /**
     * Used by `_.orderBy` to compare multiple properties of a value to another
     * and stable sort them.
     *
     * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
     * specify an order of "desc" for descending or "asc" for ascending sort order
     * of corresponding values.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {boolean[]|string[]} orders The order to sort by for each property.
     * @returns {number} Returns the sort order indicator for `object`.
     */
    function compareMultiple(object, other, orders) {
      var index = -1,
          objCriteria = object.criteria,
          othCriteria = other.criteria,
          length = objCriteria.length,
          ordersLength = orders.length;

      while (++index < length) {
        var result = compareAscending(objCriteria[index], othCriteria[index]);
        if (result) {
          if (index >= ordersLength) {
            return result;
          }
          var order = orders[index];
          return result * (order == 'desc' ? -1 : 1);
        }
      }
      // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
      // that causes it, under certain circumstances, to provide the same value for
      // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
      // for more details.
      //
      // This also ensures a stable sort in V8 and other engines.
      // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
      return object.index - other.index;
    }

    /**
     * The base implementation of `_.orderBy` without param guards.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {string[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseOrderBy(collection, iteratees, orders) {
      if (iteratees.length) {
        iteratees = arrayMap(iteratees, function(iteratee) {
          if (isArray(iteratee)) {
            return function(value) {
              return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
            }
          }
          return iteratee;
        });
      } else {
        iteratees = [identity];
      }

      var index = -1;
      iteratees = arrayMap(iteratees, baseUnary(baseIteratee));

      var result = baseMap(collection, function(value, key, collection) {
        var criteria = arrayMap(iteratees, function(iteratee) {
          return iteratee(value);
        });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * This method is like `_.sortBy` except that it allows specifying the sort
     * orders of the iteratees to sort by. If `orders` is unspecified, all values
     * are sorted in ascending order. Otherwise, specify an order of "desc" for
     * descending or "asc" for ascending sort order of corresponding values.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Collection
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
     *  The iteratees to sort by.
     * @param {string[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 40 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // Sort by `user` in ascending order and by `age` in descending order.
     * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
     * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
     */
    function orderBy(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      orders = guard ? undefined : orders;
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseOrderBy(collection, iteratees, orders);
    }

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeMax = Math.max;

    /**
     * The base implementation of `_.range` and `_.rangeRight` which doesn't
     * coerce arguments.
     *
     * @private
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @param {number} step The value to increment or decrement by.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the range of numbers.
     */
    function baseRange(start, end, step, fromRight) {
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (length--) {
        result[fromRight ? length : ++index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Creates a `_.range` or `_.rangeRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new range function.
     */
    function createRange(fromRight) {
      return function(start, end, step) {
        if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
          end = step = undefined;
        }
        // Ensure the sign of `-0` is preserved.
        start = toFinite(start);
        if (end === undefined) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
        return baseRange(start, end, step, fromRight);
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. A step of `-1` is used if a negative
     * `start` is specified without an `end` or `step`. If `end` is not specified,
     * it's set to `start` with `start` then set to `0`.
     *
     * **Note:** JavaScript follows the IEEE-754 standard for resolving
     * floating-point values which can produce unexpected results.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the range of numbers.
     * @see _.inRange, _.rangeRight
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(-4);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    var range = createRange();

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var big = createCommonjsModule(function (module) {
    (function (GLOBAL) {
      var Big,


    /************************************** EDITABLE DEFAULTS *****************************************/


        // The default values below must be integers within the stated ranges.

        /*
         * The maximum number of decimal places (DP) of the results of operations involving division:
         * div and sqrt, and pow with negative exponents.
         */
        DP = 20,            // 0 to MAX_DP

        /*
         * The rounding mode (RM) used when rounding to the above decimal places.
         *
         *  0  Towards zero (i.e. truncate, no rounding).       (ROUND_DOWN)
         *  1  To nearest neighbour. If equidistant, round up.  (ROUND_HALF_UP)
         *  2  To nearest neighbour. If equidistant, to even.   (ROUND_HALF_EVEN)
         *  3  Away from zero.                                  (ROUND_UP)
         */
        RM = 1,             // 0, 1, 2 or 3

        // The maximum value of DP and Big.DP.
        MAX_DP = 1E6,       // 0 to 1000000

        // The maximum magnitude of the exponent argument to the pow method.
        MAX_POWER = 1E6,    // 1 to 1000000

        /*
         * The negative exponent (NE) at and beneath which toString returns exponential notation.
         * (JavaScript numbers: -7)
         * -1000000 is the minimum recommended exponent value of a Big.
         */
        NE = -7,            // 0 to -1000000

        /*
         * The positive exponent (PE) at and above which toString returns exponential notation.
         * (JavaScript numbers: 21)
         * 1000000 is the maximum recommended exponent value of a Big, but this limit is not enforced.
         */
        PE = 21,            // 0 to 1000000

        /*
         * When true, an error will be thrown if a primitive number is passed to the Big constructor,
         * or if valueOf is called, or if toNumber is called on a Big which cannot be converted to a
         * primitive number without a loss of precision.
         */
        STRICT = false,     // true or false


    /**************************************************************************************************/


        // Error messages.
        NAME = '[big.js] ',
        INVALID = NAME + 'Invalid ',
        INVALID_DP = INVALID + 'decimal places',
        INVALID_RM = INVALID + 'rounding mode',
        DIV_BY_ZERO = NAME + 'Division by zero',

        // The shared prototype object.
        P = {},
        UNDEFINED = void 0,
        NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;


      /*
       * Create and return a Big constructor.
       */
      function _Big_() {

        /*
         * The Big constructor and exported function.
         * Create and return a new instance of a Big number object.
         *
         * n {number|string|Big} A numeric value.
         */
        function Big(n) {
          var x = this;

          // Enable constructor usage without new.
          if (!(x instanceof Big)) return n === UNDEFINED ? _Big_() : new Big(n);

          // Duplicate.
          if (n instanceof Big) {
            x.s = n.s;
            x.e = n.e;
            x.c = n.c.slice();
          } else {
            if (typeof n !== 'string') {
              if (Big.strict === true) {
                throw TypeError(INVALID + 'number');
              }

              // Minus zero?
              n = n === 0 && 1 / n < 0 ? '-0' : String(n);
            }

            parse(x, n);
          }

          // Retain a reference to this Big constructor.
          // Shadow Big.prototype.constructor which points to Object.
          x.constructor = Big;
        }

        Big.prototype = P;
        Big.DP = DP;
        Big.RM = RM;
        Big.NE = NE;
        Big.PE = PE;
        Big.strict = STRICT;
        Big.roundDown = 0;
        Big.roundHalfUp = 1;
        Big.roundHalfEven = 2;
        Big.roundUp = 3;

        return Big;
      }


      /*
       * Parse the number or string value passed to a Big constructor.
       *
       * x {Big} A Big number instance.
       * n {number|string} A numeric value.
       */
      function parse(x, n) {
        var e, i, nl;

        if (!NUMERIC.test(n)) {
          throw Error(INVALID + 'number');
        }

        // Determine sign.
        x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;

        // Decimal point?
        if ((e = n.indexOf('.')) > -1) n = n.replace('.', '');

        // Exponential form?
        if ((i = n.search(/e/i)) > 0) {

          // Determine exponent.
          if (e < 0) e = i;
          e += +n.slice(i + 1);
          n = n.substring(0, i);
        } else if (e < 0) {

          // Integer.
          e = n.length;
        }

        nl = n.length;

        // Determine leading zeros.
        for (i = 0; i < nl && n.charAt(i) == '0';) ++i;

        if (i == nl) {

          // Zero.
          x.c = [x.e = 0];
        } else {

          // Determine trailing zeros.
          for (; nl > 0 && n.charAt(--nl) == '0';);
          x.e = e - i - 1;
          x.c = [];

          // Convert string to array of digits without leading/trailing zeros.
          for (e = 0; i <= nl;) x.c[e++] = +n.charAt(i++);
        }

        return x;
      }


      /*
       * Round Big x to a maximum of sd significant digits using rounding mode rm.
       *
       * x {Big} The Big to round.
       * sd {number} Significant digits: integer, 0 to MAX_DP inclusive.
       * rm {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
       * [more] {boolean} Whether the result of division was truncated.
       */
      function round(x, sd, rm, more) {
        var xc = x.c;

        if (rm === UNDEFINED) rm = x.constructor.RM;
        if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
          throw Error(INVALID_RM);
        }

        if (sd < 1) {
          more =
            rm === 3 && (more || !!xc[0]) || sd === 0 && (
            rm === 1 && xc[0] >= 5 ||
            rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED))
          );

          xc.length = 1;

          if (more) {

            // 1, 0.1, 0.01, 0.001, 0.0001 etc.
            x.e = x.e - sd + 1;
            xc[0] = 1;
          } else {

            // Zero.
            xc[0] = x.e = 0;
          }
        } else if (sd < xc.length) {

          // xc[sd] is the digit after the digit that may be rounded up.
          more =
            rm === 1 && xc[sd] >= 5 ||
            rm === 2 && (xc[sd] > 5 || xc[sd] === 5 &&
              (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) ||
            rm === 3 && (more || !!xc[0]);

          // Remove any digits after the required precision.
          xc.length = sd--;

          // Round up?
          if (more) {

            // Rounding up may mean the previous digit has to be rounded up.
            for (; ++xc[sd] > 9;) {
              xc[sd] = 0;
              if (!sd--) {
                ++x.e;
                xc.unshift(1);
              }
            }
          }

          // Remove trailing zeros.
          for (sd = xc.length; !xc[--sd];) xc.pop();
        }

        return x;
      }


      /*
       * Return a string representing the value of Big x in normal or exponential notation.
       * Handles P.toExponential, P.toFixed, P.toJSON, P.toPrecision, P.toString and P.valueOf.
       */
      function stringify(x, doExponential, isNonzero) {
        var e = x.e,
          s = x.c.join(''),
          n = s.length;

        // Exponential notation?
        if (doExponential) {
          s = s.charAt(0) + (n > 1 ? '.' + s.slice(1) : '') + (e < 0 ? 'e' : 'e+') + e;

        // Normal notation.
        } else if (e < 0) {
          for (; ++e;) s = '0' + s;
          s = '0.' + s;
        } else if (e > 0) {
          if (++e > n) {
            for (e -= n; e--;) s += '0';
          } else if (e < n) {
            s = s.slice(0, e) + '.' + s.slice(e);
          }
        } else if (n > 1) {
          s = s.charAt(0) + '.' + s.slice(1);
        }

        return x.s < 0 && isNonzero ? '-' + s : s;
      }


      // Prototype/instance methods


      /*
       * Return a new Big whose value is the absolute value of this Big.
       */
      P.abs = function () {
        var x = new this.constructor(this);
        x.s = 1;
        return x;
      };


      /*
       * Return 1 if the value of this Big is greater than the value of Big y,
       *       -1 if the value of this Big is less than the value of Big y, or
       *        0 if they have the same value.
       */
      P.cmp = function (y) {
        var isneg,
          x = this,
          xc = x.c,
          yc = (y = new x.constructor(y)).c,
          i = x.s,
          j = y.s,
          k = x.e,
          l = y.e;

        // Either zero?
        if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;

        // Signs differ?
        if (i != j) return i;

        isneg = i < 0;

        // Compare exponents.
        if (k != l) return k > l ^ isneg ? 1 : -1;

        j = (k = xc.length) < (l = yc.length) ? k : l;

        // Compare digit by digit.
        for (i = -1; ++i < j;) {
          if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
        }

        // Compare lengths.
        return k == l ? 0 : k > l ^ isneg ? 1 : -1;
      };


      /*
       * Return a new Big whose value is the value of this Big divided by the value of Big y, rounded,
       * if necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
       */
      P.div = function (y) {
        var x = this,
          Big = x.constructor,
          a = x.c,                  // dividend
          b = (y = new Big(y)).c,   // divisor
          k = x.s == y.s ? 1 : -1,
          dp = Big.DP;

        if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
          throw Error(INVALID_DP);
        }

        // Divisor is zero?
        if (!b[0]) {
          throw Error(DIV_BY_ZERO);
        }

        // Dividend is 0? Return +-0.
        if (!a[0]) {
          y.s = k;
          y.c = [y.e = 0];
          return y;
        }

        var bl, bt, n, cmp, ri,
          bz = b.slice(),
          ai = bl = b.length,
          al = a.length,
          r = a.slice(0, bl),   // remainder
          rl = r.length,
          q = y,                // quotient
          qc = q.c = [],
          qi = 0,
          p = dp + (q.e = x.e - y.e) + 1;    // precision of the result

        q.s = k;
        k = p < 0 ? 0 : p;

        // Create version of divisor with leading zero.
        bz.unshift(0);

        // Add zeros to make remainder as long as divisor.
        for (; rl++ < bl;) r.push(0);

        do {

          // n is how many times the divisor goes into current remainder.
          for (n = 0; n < 10; n++) {

            // Compare divisor and remainder.
            if (bl != (rl = r.length)) {
              cmp = bl > rl ? 1 : -1;
            } else {
              for (ri = -1, cmp = 0; ++ri < bl;) {
                if (b[ri] != r[ri]) {
                  cmp = b[ri] > r[ri] ? 1 : -1;
                  break;
                }
              }
            }

            // If divisor < remainder, subtract divisor from remainder.
            if (cmp < 0) {

              // Remainder can't be more than 1 digit longer than divisor.
              // Equalise lengths using divisor with extra leading zero?
              for (bt = rl == bl ? b : bz; rl;) {
                if (r[--rl] < bt[rl]) {
                  ri = rl;
                  for (; ri && !r[--ri];) r[ri] = 9;
                  --r[ri];
                  r[rl] += 10;
                }
                r[rl] -= bt[rl];
              }

              for (; !r[0];) r.shift();
            } else {
              break;
            }
          }

          // Add the digit n to the result array.
          qc[qi++] = cmp ? n : ++n;

          // Update the remainder.
          if (r[0] && cmp) r[rl] = a[ai] || 0;
          else r = [a[ai]];

        } while ((ai++ < al || r[0] !== UNDEFINED) && k--);

        // Leading zero? Do not remove if result is simply zero (qi == 1).
        if (!qc[0] && qi != 1) {

          // There can't be more than one zero.
          qc.shift();
          q.e--;
          p--;
        }

        // Round?
        if (qi > p) round(q, p, Big.RM, r[0] !== UNDEFINED);

        return q;
      };


      /*
       * Return true if the value of this Big is equal to the value of Big y, otherwise return false.
       */
      P.eq = function (y) {
        return this.cmp(y) === 0;
      };


      /*
       * Return true if the value of this Big is greater than the value of Big y, otherwise return
       * false.
       */
      P.gt = function (y) {
        return this.cmp(y) > 0;
      };


      /*
       * Return true if the value of this Big is greater than or equal to the value of Big y, otherwise
       * return false.
       */
      P.gte = function (y) {
        return this.cmp(y) > -1;
      };


      /*
       * Return true if the value of this Big is less than the value of Big y, otherwise return false.
       */
      P.lt = function (y) {
        return this.cmp(y) < 0;
      };


      /*
       * Return true if the value of this Big is less than or equal to the value of Big y, otherwise
       * return false.
       */
      P.lte = function (y) {
        return this.cmp(y) < 1;
      };


      /*
       * Return a new Big whose value is the value of this Big minus the value of Big y.
       */
      P.minus = P.sub = function (y) {
        var i, j, t, xlty,
          x = this,
          Big = x.constructor,
          a = x.s,
          b = (y = new Big(y)).s;

        // Signs differ?
        if (a != b) {
          y.s = -b;
          return x.plus(y);
        }

        var xc = x.c.slice(),
          xe = x.e,
          yc = y.c,
          ye = y.e;

        // Either zero?
        if (!xc[0] || !yc[0]) {
          if (yc[0]) {
            y.s = -b;
          } else if (xc[0]) {
            y = new Big(x);
          } else {
            y.s = 1;
          }
          return y;
        }

        // Determine which is the bigger number. Prepend zeros to equalise exponents.
        if (a = xe - ye) {

          if (xlty = a < 0) {
            a = -a;
            t = xc;
          } else {
            ye = xe;
            t = yc;
          }

          t.reverse();
          for (b = a; b--;) t.push(0);
          t.reverse();
        } else {

          // Exponents equal. Check digit by digit.
          j = ((xlty = xc.length < yc.length) ? xc : yc).length;

          for (a = b = 0; b < j; b++) {
            if (xc[b] != yc[b]) {
              xlty = xc[b] < yc[b];
              break;
            }
          }
        }

        // x < y? Point xc to the array of the bigger number.
        if (xlty) {
          t = xc;
          xc = yc;
          yc = t;
          y.s = -y.s;
        }

        /*
         * Append zeros to xc if shorter. No need to add zeros to yc if shorter as subtraction only
         * needs to start at yc.length.
         */
        if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--;) xc[i++] = 0;

        // Subtract yc from xc.
        for (b = i; j > a;) {
          if (xc[--j] < yc[j]) {
            for (i = j; i && !xc[--i];) xc[i] = 9;
            --xc[i];
            xc[j] += 10;
          }

          xc[j] -= yc[j];
        }

        // Remove trailing zeros.
        for (; xc[--b] === 0;) xc.pop();

        // Remove leading zeros and adjust exponent accordingly.
        for (; xc[0] === 0;) {
          xc.shift();
          --ye;
        }

        if (!xc[0]) {

          // n - n = +0
          y.s = 1;

          // Result must be zero.
          xc = [ye = 0];
        }

        y.c = xc;
        y.e = ye;

        return y;
      };


      /*
       * Return a new Big whose value is the value of this Big modulo the value of Big y.
       */
      P.mod = function (y) {
        var ygtx,
          x = this,
          Big = x.constructor,
          a = x.s,
          b = (y = new Big(y)).s;

        if (!y.c[0]) {
          throw Error(DIV_BY_ZERO);
        }

        x.s = y.s = 1;
        ygtx = y.cmp(x) == 1;
        x.s = a;
        y.s = b;

        if (ygtx) return new Big(x);

        a = Big.DP;
        b = Big.RM;
        Big.DP = Big.RM = 0;
        x = x.div(y);
        Big.DP = a;
        Big.RM = b;

        return this.minus(x.times(y));
      };


      /*
       * Return a new Big whose value is the value of this Big plus the value of Big y.
       */
      P.plus = P.add = function (y) {
        var e, k, t,
          x = this,
          Big = x.constructor;

        y = new Big(y);

        // Signs differ?
        if (x.s != y.s) {
          y.s = -y.s;
          return x.minus(y);
        }

        var xe = x.e,
          xc = x.c,
          ye = y.e,
          yc = y.c;

        // Either zero?
        if (!xc[0] || !yc[0]) {
          if (!yc[0]) {
            if (xc[0]) {
              y = new Big(x);
            } else {
              y.s = x.s;
            }
          }
          return y;
        }

        xc = xc.slice();

        // Prepend zeros to equalise exponents.
        // Note: reverse faster than unshifts.
        if (e = xe - ye) {
          if (e > 0) {
            ye = xe;
            t = yc;
          } else {
            e = -e;
            t = xc;
          }

          t.reverse();
          for (; e--;) t.push(0);
          t.reverse();
        }

        // Point xc to the longer array.
        if (xc.length - yc.length < 0) {
          t = yc;
          yc = xc;
          xc = t;
        }

        e = yc.length;

        // Only start adding at yc.length - 1 as the further digits of xc can be left as they are.
        for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;

        // No need to check for zero, as +x + +y != 0 && -x + -y != 0

        if (k) {
          xc.unshift(k);
          ++ye;
        }

        // Remove trailing zeros.
        for (e = xc.length; xc[--e] === 0;) xc.pop();

        y.c = xc;
        y.e = ye;

        return y;
      };


      /*
       * Return a Big whose value is the value of this Big raised to the power n.
       * If n is negative, round to a maximum of Big.DP decimal places using rounding
       * mode Big.RM.
       *
       * n {number} Integer, -MAX_POWER to MAX_POWER inclusive.
       */
      P.pow = function (n) {
        var x = this,
          one = new x.constructor('1'),
          y = one,
          isneg = n < 0;

        if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
          throw Error(INVALID + 'exponent');
        }

        if (isneg) n = -n;

        for (;;) {
          if (n & 1) y = y.times(x);
          n >>= 1;
          if (!n) break;
          x = x.times(x);
        }

        return isneg ? one.div(y) : y;
      };


      /*
       * Return a new Big whose value is the value of this Big rounded to a maximum precision of sd
       * significant digits using rounding mode rm, or Big.RM if rm is not specified.
       *
       * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
       * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
       */
      P.prec = function (sd, rm) {
        if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
          throw Error(INVALID + 'precision');
        }
        return round(new this.constructor(this), sd, rm);
      };


      /*
       * Return a new Big whose value is the value of this Big rounded to a maximum of dp decimal places
       * using rounding mode rm, or Big.RM if rm is not specified.
       * If dp is negative, round to an integer which is a multiple of 10**-dp.
       * If dp is not specified, round to 0 decimal places.
       *
       * dp? {number} Integer, -MAX_DP to MAX_DP inclusive.
       * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
       */
      P.round = function (dp, rm) {
        if (dp === UNDEFINED) dp = 0;
        else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
          throw Error(INVALID_DP);
        }
        return round(new this.constructor(this), dp + this.e + 1, rm);
      };


      /*
       * Return a new Big whose value is the square root of the value of this Big, rounded, if
       * necessary, to a maximum of Big.DP decimal places using rounding mode Big.RM.
       */
      P.sqrt = function () {
        var r, c, t,
          x = this,
          Big = x.constructor,
          s = x.s,
          e = x.e,
          half = new Big('0.5');

        // Zero?
        if (!x.c[0]) return new Big(x);

        // Negative?
        if (s < 0) {
          throw Error(NAME + 'No square root');
        }

        // Estimate.
        s = Math.sqrt(x + '');

        // Math.sqrt underflow/overflow?
        // Re-estimate: pass x coefficient to Math.sqrt as integer, then adjust the result exponent.
        if (s === 0 || s === 1 / 0) {
          c = x.c.join('');
          if (!(c.length + e & 1)) c += '0';
          s = Math.sqrt(c);
          e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
          r = new Big((s == 1 / 0 ? '5e' : (s = s.toExponential()).slice(0, s.indexOf('e') + 1)) + e);
        } else {
          r = new Big(s + '');
        }

        e = r.e + (Big.DP += 4);

        // Newton-Raphson iteration.
        do {
          t = r;
          r = half.times(t.plus(x.div(t)));
        } while (t.c.slice(0, e).join('') !== r.c.slice(0, e).join(''));

        return round(r, (Big.DP -= 4) + r.e + 1, Big.RM);
      };


      /*
       * Return a new Big whose value is the value of this Big times the value of Big y.
       */
      P.times = P.mul = function (y) {
        var c,
          x = this,
          Big = x.constructor,
          xc = x.c,
          yc = (y = new Big(y)).c,
          a = xc.length,
          b = yc.length,
          i = x.e,
          j = y.e;

        // Determine sign of result.
        y.s = x.s == y.s ? 1 : -1;

        // Return signed 0 if either 0.
        if (!xc[0] || !yc[0]) {
          y.c = [y.e = 0];
          return y;
        }

        // Initialise exponent of result as x.e + y.e.
        y.e = i + j;

        // If array xc has fewer digits than yc, swap xc and yc, and lengths.
        if (a < b) {
          c = xc;
          xc = yc;
          yc = c;
          j = a;
          a = b;
          b = j;
        }

        // Initialise coefficient array of result with zeros.
        for (c = new Array(j = a + b); j--;) c[j] = 0;

        // Multiply.

        // i is initially xc.length.
        for (i = b; i--;) {
          b = 0;

          // a is yc.length.
          for (j = a + i; j > i;) {

            // Current sum of products at this digit position, plus carry.
            b = c[j] + yc[i] * xc[j - i - 1] + b;
            c[j--] = b % 10;

            // carry
            b = b / 10 | 0;
          }

          c[j] = b;
        }

        // Increment result exponent if there is a final carry, otherwise remove leading zero.
        if (b) ++y.e;
        else c.shift();

        // Remove trailing zeros.
        for (i = c.length; !c[--i];) c.pop();
        y.c = c;

        return y;
      };


      /*
       * Return a string representing the value of this Big in exponential notation rounded to dp fixed
       * decimal places using rounding mode rm, or Big.RM if rm is not specified.
       *
       * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
       * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
       */
      P.toExponential = function (dp, rm) {
        var x = this,
          n = x.c[0];

        if (dp !== UNDEFINED) {
          if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
            throw Error(INVALID_DP);
          }
          x = round(new x.constructor(x), ++dp, rm);
          for (; x.c.length < dp;) x.c.push(0);
        }

        return stringify(x, true, !!n);
      };


      /*
       * Return a string representing the value of this Big in normal notation rounded to dp fixed
       * decimal places using rounding mode rm, or Big.RM if rm is not specified.
       *
       * dp? {number} Decimal places: integer, 0 to MAX_DP inclusive.
       * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
       *
       * (-0).toFixed(0) is '0', but (-0.1).toFixed(0) is '-0'.
       * (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
       */
      P.toFixed = function (dp, rm) {
        var x = this,
          n = x.c[0];

        if (dp !== UNDEFINED) {
          if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
            throw Error(INVALID_DP);
          }
          x = round(new x.constructor(x), dp + x.e + 1, rm);

          // x.e may have changed if the value is rounded up.
          for (dp = dp + x.e + 1; x.c.length < dp;) x.c.push(0);
        }

        return stringify(x, false, !!n);
      };


      /*
       * Return a string representing the value of this Big.
       * Return exponential notation if this Big has a positive exponent equal to or greater than
       * Big.PE, or a negative exponent equal to or less than Big.NE.
       * Omit the sign for negative zero.
       */
      P.toJSON = P.toString = function () {
        var x = this,
          Big = x.constructor;
        return stringify(x, x.e <= Big.NE || x.e >= Big.PE, !!x.c[0]);
      };


      /*
       * Return the value of this Big as a primitve number.
       */
      P.toNumber = function () {
        var n = Number(stringify(this, true, true));
        if (this.constructor.strict === true && !this.eq(n.toString())) {
          throw Error(NAME + 'Imprecise conversion');
        }
        return n;
      };


      /*
       * Return a string representing the value of this Big rounded to sd significant digits using
       * rounding mode rm, or Big.RM if rm is not specified.
       * Use exponential notation if sd is less than the number of digits necessary to represent
       * the integer part of the value in normal notation.
       *
       * sd {number} Significant digits: integer, 1 to MAX_DP inclusive.
       * rm? {number} Rounding mode: 0 (down), 1 (half-up), 2 (half-even) or 3 (up).
       */
      P.toPrecision = function (sd, rm) {
        var x = this,
          Big = x.constructor,
          n = x.c[0];

        if (sd !== UNDEFINED) {
          if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
            throw Error(INVALID + 'precision');
          }
          x = round(new Big(x), sd, rm);
          for (; x.c.length < sd;) x.c.push(0);
        }

        return stringify(x, sd <= x.e || x.e <= Big.NE || x.e >= Big.PE, !!n);
      };


      /*
       * Return a string representing the value of this Big.
       * Return exponential notation if this Big has a positive exponent equal to or greater than
       * Big.PE, or a negative exponent equal to or less than Big.NE.
       * Include the sign for negative zero.
       */
      P.valueOf = function () {
        var x = this,
          Big = x.constructor;
        if (Big.strict === true) {
          throw Error(NAME + 'valueOf disallowed');
        }
        return stringify(x, x.e <= Big.NE || x.e >= Big.PE, true);
      };


      // Export


      Big = _Big_();

      Big['default'] = Big.Big = Big;

      //AMD.
      if (module.exports) {
        module.exports = Big;

      //Browser.
      } else {
        GLOBAL.Big = Big;
      }
    })(commonjsGlobal);
    });

    const { STAGE, NODE_ENV } = process.env;
    const isProd = NODE_ENV === null || NODE_ENV === void 0 ? void 0 : NODE_ENV.startsWith('prod');
    const NetworkConfigs = {
        polkadot: {
            leasePeriod: 259200,
            decimal: 10,
            tokenSymbol: 'DOT',
            endpoint: ''
        },
        kusama: {
            leasePeriod: 129600,
            decimal: 12,
            tokenSymbol: 'KSM',
            endpoint: 'https://api.subquery.network/sq/subvis-io/kusama-auction'
        },
        rococo: {
            leasePeriod: 14400,
            decimal: 12,
            tokenSymbol: 'ROC',
            endpoint: 'https://api.subquery.network/sq/subvis-io/rococo-auction'
        }
    };
    const config = Object.assign(Object.assign({}, NetworkConfigs[STAGE || 'rococo']), (!isProd && { endpoint: 'http://localhost:3000' }));

    const file$a = "src/Token.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*title*/ ctx[0]);
    			attr_dev(div, "class", "inline-block");
    			add_location(div, file$a, 13, 0, 421);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let tokenValue;
    	let title;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Token", slots, []);
    	let { value } = $$props;
    	let { allowZero = false } = $$props;
    	let { emptyDisplay = "" } = $$props;
    	let { addSymbol = true } = $$props;
    	const { decimal, tokenSymbol } = config;
    	const writable_props = ["value", "allowZero", "emptyDisplay", "addSymbol"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Token> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(1, value = $$props.value);
    		if ("allowZero" in $$props) $$invalidate(2, allowZero = $$props.allowZero);
    		if ("emptyDisplay" in $$props) $$invalidate(3, emptyDisplay = $$props.emptyDisplay);
    		if ("addSymbol" in $$props) $$invalidate(4, addSymbol = $$props.addSymbol);
    	};

    	$$self.$capture_state = () => ({
    		Big: big,
    		config,
    		value,
    		allowZero,
    		emptyDisplay,
    		addSymbol,
    		decimal,
    		tokenSymbol,
    		tokenValue,
    		title
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(1, value = $$props.value);
    		if ("allowZero" in $$props) $$invalidate(2, allowZero = $$props.allowZero);
    		if ("emptyDisplay" in $$props) $$invalidate(3, emptyDisplay = $$props.emptyDisplay);
    		if ("addSymbol" in $$props) $$invalidate(4, addSymbol = $$props.addSymbol);
    		if ("tokenValue" in $$props) $$invalidate(5, tokenValue = $$props.tokenValue);
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 2) {
    			$$invalidate(5, tokenValue = big(value || 0).div(10 ** decimal).toNumber());
    		}

    		if ($$self.$$.dirty & /*allowZero, tokenValue, emptyDisplay, addSymbol*/ 60) {
    			$$invalidate(0, title = !allowZero && tokenValue == 0
    			? emptyDisplay
    			: tokenValue + (addSymbol ? ` ${tokenSymbol}` : ""));
    		}
    	};

    	return [title, value, allowZero, emptyDisplay, addSymbol, tokenValue];
    }

    class Token extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			value: 1,
    			allowZero: 2,
    			emptyDisplay: 3,
    			addSymbol: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Token",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[1] === undefined && !("value" in props)) {
    			console.warn("<Token> was created without expected prop 'value'");
    		}
    	}

    	get value() {
    		throw new Error("<Token>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Token>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get allowZero() {
    		throw new Error("<Token>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allowZero(value) {
    		throw new Error("<Token>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get emptyDisplay() {
    		throw new Error("<Token>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set emptyDisplay(value) {
    		throw new Error("<Token>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addSymbol() {
    		throw new Error("<Token>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addSymbol(value) {
    		throw new Error("<Token>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const file$9 = "src/AuctionSlot.svelte";

    // (31:8) {#if paraId}
    function create_if_block$5(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "mx-1 rounded-full");
    			if (img.src !== (img_src_value = "./ksm-logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*paraId*/ ctx[2]);
    			attr_dev(img, "width", "22");
    			attr_dev(img, "height", "22");
    			add_location(img, file$9, 31, 8, 1532);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*paraId*/ 4) {
    				attr_dev(img, "alt", /*paraId*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(31:8) {#if paraId}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div15;
    	let div2;
    	let div0;
    	let t0;
    	let t1_value = /*slots*/ ctx[5].join(" - ") + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let t4_value = (/*leaseStart*/ ctx[0] || /*blockStart*/ ctx[6]) + "";
    	let t4;
    	let t5;
    	let t6_value = (/*leaseEnd*/ ctx[1] || /*blockEnd*/ ctx[7]) + "";
    	let t6;
    	let t7;
    	let div14;
    	let div6;
    	let div3;
    	let t9;
    	let div5;
    	let t10;
    	let div4;
    	let t11_value = (/*paraId*/ ctx[2] || "N/A") + "";
    	let t11;
    	let t12;
    	let div9;
    	let div7;
    	let t14;
    	let div8;
    	let token;
    	let t15;
    	let div13;
    	let div10;
    	let t17;
    	let div12;
    	let div11;
    	let t18_value = (/*wonBlocks*/ ctx[4] || "N/A") + "";
    	let t18;
    	let current;
    	let if_block = /*paraId*/ ctx[2] && create_if_block$5(ctx);

    	token = new Token({
    			props: {
    				class: "fixed-line-height",
    				value: /*amount*/ ctx[3],
    				emptyDisplay: "N/A"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div15 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text("Slot ");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");
    			t3 = text("Block: ");
    			t4 = text(t4_value);
    			t5 = text(" - ");
    			t6 = text(t6_value);
    			t7 = space();
    			div14 = element("div");
    			div6 = element("div");
    			div3 = element("div");
    			div3.textContent = "Current Winner";
    			t9 = space();
    			div5 = element("div");
    			if (if_block) if_block.c();
    			t10 = space();
    			div4 = element("div");
    			t11 = text(t11_value);
    			t12 = space();
    			div9 = element("div");
    			div7 = element("div");
    			div7.textContent = "Bid Price";
    			t14 = space();
    			div8 = element("div");
    			create_component(token.$$.fragment);
    			t15 = space();
    			div13 = element("div");
    			div10 = element("div");
    			div10.textContent = "Winning Chance";
    			t17 = space();
    			div12 = element("div");
    			div11 = element("div");
    			t18 = text(t18_value);
    			attr_dev(div0, "class", "col-span-3 text-base");
    			add_location(div0, file$9, 22, 4, 929);
    			attr_dev(div1, "class", "col-span-2 text-gray-400 text-xs text-right");
    			add_location(div1, file$9, 23, 4, 998);
    			attr_dev(div2, "class", "grid grid-cols-5 mb-2");
    			add_location(div2, file$9, 21, 2, 889);
    			attr_dev(div3, "class", "text-gray-400 mb-2");
    			add_location(div3, file$9, 28, 6, 1388);
    			attr_dev(div4, "class", "mx-1");
    			add_location(div4, file$9, 33, 8, 1645);
    			attr_dev(div5, "class", "flex flex-row justify-center items-center");
    			add_location(div5, file$9, 29, 6, 1447);
    			attr_dev(div6, "class", "text-center text-xm flex flex-col");
    			add_location(div6, file$9, 27, 4, 1334);
    			attr_dev(div7, "class", "text-gray-400 mb-2");
    			add_location(div7, file$9, 37, 6, 1769);
    			attr_dev(div8, "class", "flex flex-row justify-center items-center fixed-line-height svelte-pgbpgd");
    			add_location(div8, file$9, 38, 6, 1823);
    			attr_dev(div9, "class", "text-center text-xm flex flex-col");
    			add_location(div9, file$9, 36, 4, 1715);
    			attr_dev(div10, "class", "text-gray-400 mb-2");
    			add_location(div10, file$9, 43, 6, 2056);
    			attr_dev(div11, "class", "fixed-line-height svelte-pgbpgd");
    			add_location(div11, file$9, 45, 8, 2179);
    			attr_dev(div12, "class", "flex flex-row justify-center items-center");
    			add_location(div12, file$9, 44, 6, 2115);
    			attr_dev(div13, "class", "text-center text-xm flex flex-col");
    			add_location(div13, file$9, 42, 4, 2002);
    			attr_dev(div14, "class", "grid grid-cols-3 gap-1");
    			add_location(div14, file$9, 26, 2, 1293);
    			attr_dev(div15, "class", "rounded-lg p-2 col-span-6");
    			set_style(div15, "background-color", /*bgColor*/ ctx[8]);
    			set_style(div15, "border", "1px solid " + /*borderColor*/ ctx[9]);
    			add_location(div15, file$9, 20, 0, 778);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div15, anchor);
    			append_dev(div15, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, t6);
    			append_dev(div15, t7);
    			append_dev(div15, div14);
    			append_dev(div14, div6);
    			append_dev(div6, div3);
    			append_dev(div6, t9);
    			append_dev(div6, div5);
    			if (if_block) if_block.m(div5, null);
    			append_dev(div5, t10);
    			append_dev(div5, div4);
    			append_dev(div4, t11);
    			append_dev(div14, t12);
    			append_dev(div14, div9);
    			append_dev(div9, div7);
    			append_dev(div9, t14);
    			append_dev(div9, div8);
    			mount_component(token, div8, null);
    			append_dev(div14, t15);
    			append_dev(div14, div13);
    			append_dev(div13, div10);
    			append_dev(div13, t17);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, t18);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*slots*/ 32) && t1_value !== (t1_value = /*slots*/ ctx[5].join(" - ") + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*leaseStart, blockStart*/ 65) && t4_value !== (t4_value = (/*leaseStart*/ ctx[0] || /*blockStart*/ ctx[6]) + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*leaseEnd, blockEnd*/ 130) && t6_value !== (t6_value = (/*leaseEnd*/ ctx[1] || /*blockEnd*/ ctx[7]) + "")) set_data_dev(t6, t6_value);

    			if (/*paraId*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(div5, t10);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if ((!current || dirty & /*paraId*/ 4) && t11_value !== (t11_value = (/*paraId*/ ctx[2] || "N/A") + "")) set_data_dev(t11, t11_value);
    			const token_changes = {};
    			if (dirty & /*amount*/ 8) token_changes.value = /*amount*/ ctx[3];
    			token.$set(token_changes);
    			if ((!current || dirty & /*wonBlocks*/ 16) && t18_value !== (t18_value = (/*wonBlocks*/ ctx[4] || "N/A") + "")) set_data_dev(t18, t18_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(token.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(token.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div15);
    			if (if_block) if_block.d();
    			destroy_component(token);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let slots;
    	let blockStart;
    	let blockEnd;
    	let { $$slots: slots$1 = {}, $$scope } = $$props;
    	validate_slots("AuctionSlot", slots$1, []);

    	let { firstSlot } = $$props,
    		{ lastSlot } = $$props,
    		{ leaseStart = "" } = $$props,
    		{ leaseEnd = "" } = $$props,
    		{ paraId } = $$props,
    		{ amount } = $$props,
    		{ wonBlocks } = $$props,
    		{ groupIdx } = $$props;

    	const colorConfigs = [
    		{
    			bgColor: "#f5f6ff",
    			borderColor: "#ced8ff",
    			btnColor: "#9e89f0"
    		},
    		{
    			borderColor: "#d0ebff",
    			bgColor: "#f3faff",
    			btnColor: "#5dbdf5"
    		},
    		{
    			bgColor: "#fffcf0",
    			borderColor: "#fcf4ba",
    			btnColor: "#f3df2a"
    		},
    		{
    			borderColor: "#d3eaea",
    			bgColor: "#f3fbfd",
    			btnColor: "#91dadb"
    		}
    	];

    	const { bgColor, borderColor, btnColor } = colorConfigs[groupIdx] || {};

    	const writable_props = [
    		"firstSlot",
    		"lastSlot",
    		"leaseStart",
    		"leaseEnd",
    		"paraId",
    		"amount",
    		"wonBlocks",
    		"groupIdx"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AuctionSlot> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("firstSlot" in $$props) $$invalidate(10, firstSlot = $$props.firstSlot);
    		if ("lastSlot" in $$props) $$invalidate(11, lastSlot = $$props.lastSlot);
    		if ("leaseStart" in $$props) $$invalidate(0, leaseStart = $$props.leaseStart);
    		if ("leaseEnd" in $$props) $$invalidate(1, leaseEnd = $$props.leaseEnd);
    		if ("paraId" in $$props) $$invalidate(2, paraId = $$props.paraId);
    		if ("amount" in $$props) $$invalidate(3, amount = $$props.amount);
    		if ("wonBlocks" in $$props) $$invalidate(4, wonBlocks = $$props.wonBlocks);
    		if ("groupIdx" in $$props) $$invalidate(12, groupIdx = $$props.groupIdx);
    	};

    	$$self.$capture_state = () => ({
    		range,
    		Token,
    		config,
    		firstSlot,
    		lastSlot,
    		leaseStart,
    		leaseEnd,
    		paraId,
    		amount,
    		wonBlocks,
    		groupIdx,
    		colorConfigs,
    		bgColor,
    		borderColor,
    		btnColor,
    		slots,
    		blockStart,
    		blockEnd
    	});

    	$$self.$inject_state = $$props => {
    		if ("firstSlot" in $$props) $$invalidate(10, firstSlot = $$props.firstSlot);
    		if ("lastSlot" in $$props) $$invalidate(11, lastSlot = $$props.lastSlot);
    		if ("leaseStart" in $$props) $$invalidate(0, leaseStart = $$props.leaseStart);
    		if ("leaseEnd" in $$props) $$invalidate(1, leaseEnd = $$props.leaseEnd);
    		if ("paraId" in $$props) $$invalidate(2, paraId = $$props.paraId);
    		if ("amount" in $$props) $$invalidate(3, amount = $$props.amount);
    		if ("wonBlocks" in $$props) $$invalidate(4, wonBlocks = $$props.wonBlocks);
    		if ("groupIdx" in $$props) $$invalidate(12, groupIdx = $$props.groupIdx);
    		if ("slots" in $$props) $$invalidate(5, slots = $$props.slots);
    		if ("blockStart" in $$props) $$invalidate(6, blockStart = $$props.blockStart);
    		if ("blockEnd" in $$props) $$invalidate(7, blockEnd = $$props.blockEnd);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*firstSlot, lastSlot*/ 3072) {
    			$$invalidate(5, slots = range(firstSlot, lastSlot + 1));
    		}

    		if ($$self.$$.dirty & /*firstSlot*/ 1024) {
    			$$invalidate(6, blockStart = firstSlot * config.leasePeriod);
    		}

    		if ($$self.$$.dirty & /*lastSlot*/ 2048) {
    			$$invalidate(7, blockEnd = lastSlot * config.leasePeriod);
    		}
    	};

    	return [
    		leaseStart,
    		leaseEnd,
    		paraId,
    		amount,
    		wonBlocks,
    		slots,
    		blockStart,
    		blockEnd,
    		bgColor,
    		borderColor,
    		firstSlot,
    		lastSlot,
    		groupIdx
    	];
    }

    class AuctionSlot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			firstSlot: 10,
    			lastSlot: 11,
    			leaseStart: 0,
    			leaseEnd: 1,
    			paraId: 2,
    			amount: 3,
    			wonBlocks: 4,
    			groupIdx: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AuctionSlot",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*firstSlot*/ ctx[10] === undefined && !("firstSlot" in props)) {
    			console.warn("<AuctionSlot> was created without expected prop 'firstSlot'");
    		}

    		if (/*lastSlot*/ ctx[11] === undefined && !("lastSlot" in props)) {
    			console.warn("<AuctionSlot> was created without expected prop 'lastSlot'");
    		}

    		if (/*paraId*/ ctx[2] === undefined && !("paraId" in props)) {
    			console.warn("<AuctionSlot> was created without expected prop 'paraId'");
    		}

    		if (/*amount*/ ctx[3] === undefined && !("amount" in props)) {
    			console.warn("<AuctionSlot> was created without expected prop 'amount'");
    		}

    		if (/*wonBlocks*/ ctx[4] === undefined && !("wonBlocks" in props)) {
    			console.warn("<AuctionSlot> was created without expected prop 'wonBlocks'");
    		}

    		if (/*groupIdx*/ ctx[12] === undefined && !("groupIdx" in props)) {
    			console.warn("<AuctionSlot> was created without expected prop 'groupIdx'");
    		}
    	}

    	get firstSlot() {
    		throw new Error("<AuctionSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set firstSlot(value) {
    		throw new Error("<AuctionSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lastSlot() {
    		throw new Error("<AuctionSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lastSlot(value) {
    		throw new Error("<AuctionSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get leaseStart() {
    		throw new Error("<AuctionSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set leaseStart(value) {
    		throw new Error("<AuctionSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get leaseEnd() {
    		throw new Error("<AuctionSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set leaseEnd(value) {
    		throw new Error("<AuctionSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paraId() {
    		throw new Error("<AuctionSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paraId(value) {
    		throw new Error("<AuctionSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get amount() {
    		throw new Error("<AuctionSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set amount(value) {
    		throw new Error("<AuctionSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wonBlocks() {
    		throw new Error("<AuctionSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wonBlocks(value) {
    		throw new Error("<AuctionSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get groupIdx() {
    		throw new Error("<AuctionSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set groupIdx(value) {
    		throw new Error("<AuctionSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const normalize = (node) => {
        if (Array.isArray(node)) {
            return node.map(normalize);
        }
        if (typeof node === 'object') {
            return Object.entries(node).reduce((prev, [key, val]) => {
                if (typeof val == 'object' && Array.isArray(val === null || val === void 0 ? void 0 : val['nodes'])) {
                    return Object.assign(Object.assign({}, prev), { [key]: normalize(val['nodes']) });
                }
                if (Array.isArray(val)) {
                    return Object.assign(Object.assign({}, prev), { [key]: normalize(val) });
                }
                return Object.assign(Object.assign({}, prev), { [key]: val });
            }, {});
        }
        return node;
    };
    const getSlotsCombination = (start) => {
        return [
            // 0 - 3
            { start, end: start + 3 },
            // 0 - 2
            { start, end: start + 2 },
            // 1 - 3
            { start: start + 1, end: start + 3 },
            // 0 - 1
            { start, end: start + 1 },
            // 1 - 2
            { start: start + 1, end: start + 2 },
            // 2 - 3
            { start: start + 2, end: start + 3 },
            // 0, 1, 2, 3
            { start, end: start },
            { start: start + 1, end: start + 1 },
            { start: start + 2, end: start + 2 },
            { start: start + 3, end: start + 3 }
        ];
    };
    const getTimeUnitInWord = ({ value, name }) => value > 1 ? `${value} ${value != 1 ? name + 's' : name}` : '';
    const getTimeDiffInWord = (timeDeltaMs) => {
        const timeUnits = [
            { value: 86400000, name: 'day' },
            { value: 3600000, name: 'hour' },
            { value: 60000, name: 'min' },
            { value: 1000, name: 'sec' }
        ];
        const { units } = timeUnits.reduce(({ remain, units }, unit) => {
            const { value, name } = unit;
            const curUnitValue = Math.floor(remain / value);
            return { remain: remain % value, units: units.concat({ name, value: curUnitValue }) };
        }, { remain: timeDeltaMs, units: [] });
        return units.map(getTimeUnitInWord).join(' ');
    };
    const getDateFromBlockNum = (blockNum, curBlockNum, timestamp) => {
        const diff = blockNum - curBlockNum;
        const timeDiff = diff * 6000;
        const date = timestamp ? new Date(timestamp) : new Date();
        return formatter.format(new Date(date.getTime() + timeDiff)).replace(',', ' ');
    };
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour12: false,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    });
    const getColSpan = (allSlots, curSlots) => {
        const { result: occupied } = allSlots.reduce(({ result, idx }, cur) => {
            if (cur === curSlots[idx]) {
                return {
                    result: result.concat(1),
                    idx: idx + 1
                };
            }
            return {
                result: result.concat(0),
                idx
            };
        }, { result: [], idx: 0 });
        const span = occupied.filter((val) => !!val).reduce((all, cur) => all + cur, 0);
        const startIdx = occupied.findIndex((val) => !!val);
        const result = occupied.slice(0, startIdx).concat(span);
        return result;
    };

    const timeStr = readable(null, function start(set) {
        const interval = setInterval(() => {
            set(formatter.format(new Date()));
        }, 1000);
        return function stop() {
            clearInterval(interval);
        };
    });
    const curAuction = writable(null);
    const chronicle = writable(null);
    const lastBlockNum = derived(chronicle, ($chronicle) => ($chronicle === null || $chronicle === void 0 ? void 0 : $chronicle.curBlockNum) || 0);
    const lastBlockTime = derived(chronicle, ($chronicle) => $chronicle === null || $chronicle === void 0 ? void 0 : $chronicle.updatedAt);

    const CHRONICLE_QUERY = `
query {
  chronicle(id: "ChronicleKey"){
    curAuctionId
    curBlockNum
    updatedAt
  }
}
`;
    const AUCTION_QUERY = `
query ($auctionStatusFilter: AuctionFilter) {
  parachainLeaseds {
    nodes {
      parachain {
        paraId
      }
      firstSlot
      lastSlot
      winningAmount
    }
  }
  auctions (filter: $auctionStatusFilter, first: 1) {
    nodes {
      id
      blockNum
      slotsStart
      slotsEnd
      status
      leaseStart
      leaseEnd
      closingEnd
      closingStart
      winningBids: bids (filter: {winningAuction: { isNull: false }}) {
        nodes {
          ...bidParachainFields
        }
      }
      loseBids: bids (filter: {winningAuction: {isNull: true }}) {
        nodes {
          ...bidParachainFields
        }
      }
      participateParachain: parachains {
        nodes {
          parachain {
            ...parachainFields
          }
          blockNum
          firstSlot
          lastSlot
        }
      }
    }
  }
}

fragment bidParachainFields on Bid {
  id
  bidder
  firstSlot
  lastSlot
  amount
  parachain {
    ...parachainFields
  }
  isCrowdloan
  createdAt
}

fragment parachainFields on Parachain {
  id
  manager
  paraId
  deposit
  creationBlock
  createdAt
}
`;
    const CROWDLOAN_QUERY = `
query {
  crowdloans(orderBy: BLOCK_NUM_DESC) {
    nodes {
      id
      parachain {
        paraId
        manager
      }
      retiring
      depositor
      verifier
      cap
      raised
      lockExpiredBlock
      blockNum
      createdAt
    }
  }
}
`;
    const CONTRIBUTORS_QUERY = `
query ($fundId: String!, $fundIdFilter: ContributionFilter!) {
  crowdloan (id: $fundId) {
    id
    parachain {
      paraId
      manager
    }
    retiring
    depositor
    verifier
    cap
    raised
    lockExpiredBlock
    createdAt
  }
	contributions (filter: $fundIdFilter, orderBy: BLOCK_NUM_DESC) {
    nodes {
      id
      account
      amount
      createdAt
      blockNum
      parachain {
        paraId
        manager
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
`;

    const file$8 = "src/BidCard.svelte";

    // (21:4) {:else}
    function create_else_block$3(ctx) {
    	let div;
    	let span;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text("From bidder ");
    			t1 = text(/*bidder*/ ctx[0]);
    			attr_dev(span, "alt", /*bidder*/ ctx[0]);
    			add_location(span, file$8, 21, 47, 880);
    			attr_dev(div, "class", "text-gray-600 ellipsis-text svelte-1b6jv3z");
    			add_location(div, file$8, 21, 6, 839);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*bidder*/ 1) set_data_dev(t1, /*bidder*/ ctx[0]);

    			if (dirty & /*bidder*/ 1) {
    				attr_dev(span, "alt", /*bidder*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(21:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#if isCrowdloan }
    function create_if_block$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `From Crowdloan ${/*paraId*/ ctx[6]}`;
    			attr_dev(div, "class", "text-gray-600");
    			add_location(div, file$8, 19, 6, 764);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(19:4) {#if isCrowdloan }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div5;
    	let div1;
    	let div0;
    	let t2;
    	let div2;
    	let t3_value = getTimeDiffInWord(Date.now() - new Date(/*createdAt*/ ctx[3]).getTime()) + "";
    	let t3;
    	let t4;
    	let div3;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let token;
    	let t10;
    	let div4;
    	let current;

    	token = new Token({
    			props: { value: /*amount*/ ctx[4] },
    			$$inline: true
    		});

    	function select_block_type(ctx, dirty) {
    		if (/*isCrowdloan*/ ctx[5]) return create_if_block$4;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = `Parachain ${/*paraId*/ ctx[6]}`;
    			t2 = space();
    			div2 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div3 = element("div");
    			t5 = text("has submit a new bid for slot ");
    			t6 = text(/*firstSlot*/ ctx[1]);
    			t7 = text(" - ");
    			t8 = text(/*lastSlot*/ ctx[2]);
    			t9 = text(" at ");
    			create_component(token.$$.fragment);
    			t10 = space();
    			div4 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "text text-sm");
    			add_location(div0, file$8, 11, 4, 371);
    			attr_dev(div1, "class", "col-span-2");
    			add_location(div1, file$8, 10, 2, 342);
    			attr_dev(div2, "class", "text-xs text-gray-500 col-span-3 text-right");
    			add_location(div2, file$8, 13, 2, 433);
    			attr_dev(div3, "class", "text-base col-span-5");
    			add_location(div3, file$8, 14, 2, 562);
    			attr_dev(div4, "class", "text-base col-span-5 flex");
    			add_location(div4, file$8, 17, 2, 695);
    			attr_dev(div5, "class", "box mb-3 px-5 py-3 grid grid-cols-5 grid-flow-row gap-2");
    			add_location(div5, file$8, 9, 0, 270);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div1);
    			append_dev(div1, div0);
    			append_dev(div5, t2);
    			append_dev(div5, div2);
    			append_dev(div2, t3);
    			append_dev(div5, t4);
    			append_dev(div5, div3);
    			append_dev(div3, t5);
    			append_dev(div3, t6);
    			append_dev(div3, t7);
    			append_dev(div3, t8);
    			append_dev(div3, t9);
    			mount_component(token, div3, null);
    			append_dev(div5, t10);
    			append_dev(div5, div4);
    			if_block.m(div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*createdAt*/ 8) && t3_value !== (t3_value = getTimeDiffInWord(Date.now() - new Date(/*createdAt*/ ctx[3]).getTime()) + "")) set_data_dev(t3, t3_value);
    			if (!current || dirty & /*firstSlot*/ 2) set_data_dev(t6, /*firstSlot*/ ctx[1]);
    			if (!current || dirty & /*lastSlot*/ 4) set_data_dev(t8, /*lastSlot*/ ctx[2]);
    			const token_changes = {};
    			if (dirty & /*amount*/ 16) token_changes.value = /*amount*/ ctx[4];
    			token.$set(token_changes);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div4, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(token.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(token.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(token);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BidCard", slots, []);

    	let { bidder } = $$props,
    		{ firstSlot } = $$props,
    		{ lastSlot } = $$props,
    		{ createdAt } = $$props,
    		{ amount } = $$props,
    		{ parachain } = $$props,
    		{ isCrowdloan } = $$props;

    	const { paraId } = parachain || {};

    	const writable_props = [
    		"bidder",
    		"firstSlot",
    		"lastSlot",
    		"createdAt",
    		"amount",
    		"parachain",
    		"isCrowdloan"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BidCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("bidder" in $$props) $$invalidate(0, bidder = $$props.bidder);
    		if ("firstSlot" in $$props) $$invalidate(1, firstSlot = $$props.firstSlot);
    		if ("lastSlot" in $$props) $$invalidate(2, lastSlot = $$props.lastSlot);
    		if ("createdAt" in $$props) $$invalidate(3, createdAt = $$props.createdAt);
    		if ("amount" in $$props) $$invalidate(4, amount = $$props.amount);
    		if ("parachain" in $$props) $$invalidate(7, parachain = $$props.parachain);
    		if ("isCrowdloan" in $$props) $$invalidate(5, isCrowdloan = $$props.isCrowdloan);
    	};

    	$$self.$capture_state = () => ({
    		now,
    		Token,
    		getTimeDiffInWord,
    		bidder,
    		firstSlot,
    		lastSlot,
    		createdAt,
    		amount,
    		parachain,
    		isCrowdloan,
    		paraId
    	});

    	$$self.$inject_state = $$props => {
    		if ("bidder" in $$props) $$invalidate(0, bidder = $$props.bidder);
    		if ("firstSlot" in $$props) $$invalidate(1, firstSlot = $$props.firstSlot);
    		if ("lastSlot" in $$props) $$invalidate(2, lastSlot = $$props.lastSlot);
    		if ("createdAt" in $$props) $$invalidate(3, createdAt = $$props.createdAt);
    		if ("amount" in $$props) $$invalidate(4, amount = $$props.amount);
    		if ("parachain" in $$props) $$invalidate(7, parachain = $$props.parachain);
    		if ("isCrowdloan" in $$props) $$invalidate(5, isCrowdloan = $$props.isCrowdloan);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [bidder, firstSlot, lastSlot, createdAt, amount, isCrowdloan, paraId, parachain];
    }

    class BidCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			bidder: 0,
    			firstSlot: 1,
    			lastSlot: 2,
    			createdAt: 3,
    			amount: 4,
    			parachain: 7,
    			isCrowdloan: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BidCard",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*bidder*/ ctx[0] === undefined && !("bidder" in props)) {
    			console.warn("<BidCard> was created without expected prop 'bidder'");
    		}

    		if (/*firstSlot*/ ctx[1] === undefined && !("firstSlot" in props)) {
    			console.warn("<BidCard> was created without expected prop 'firstSlot'");
    		}

    		if (/*lastSlot*/ ctx[2] === undefined && !("lastSlot" in props)) {
    			console.warn("<BidCard> was created without expected prop 'lastSlot'");
    		}

    		if (/*createdAt*/ ctx[3] === undefined && !("createdAt" in props)) {
    			console.warn("<BidCard> was created without expected prop 'createdAt'");
    		}

    		if (/*amount*/ ctx[4] === undefined && !("amount" in props)) {
    			console.warn("<BidCard> was created without expected prop 'amount'");
    		}

    		if (/*parachain*/ ctx[7] === undefined && !("parachain" in props)) {
    			console.warn("<BidCard> was created without expected prop 'parachain'");
    		}

    		if (/*isCrowdloan*/ ctx[5] === undefined && !("isCrowdloan" in props)) {
    			console.warn("<BidCard> was created without expected prop 'isCrowdloan'");
    		}
    	}

    	get bidder() {
    		throw new Error("<BidCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bidder(value) {
    		throw new Error("<BidCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get firstSlot() {
    		throw new Error("<BidCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set firstSlot(value) {
    		throw new Error("<BidCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lastSlot() {
    		throw new Error("<BidCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lastSlot(value) {
    		throw new Error("<BidCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get createdAt() {
    		throw new Error("<BidCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set createdAt(value) {
    		throw new Error("<BidCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get amount() {
    		throw new Error("<BidCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set amount(value) {
    		throw new Error("<BidCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parachain() {
    		throw new Error("<BidCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parachain(value) {
    		throw new Error("<BidCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCrowdloan() {
    		throw new Error("<BidCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCrowdloan(value) {
    		throw new Error("<BidCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const file$7 = "src/AuctionProgressIndicator.svelte";

    function create_fragment$8(ctx) {
    	let div5;
    	let div0;
    	let svg;
    	let g3;
    	let g2;
    	let g1;
    	let circle;
    	let g0;
    	let path;
    	let t0;
    	let div4;
    	let div1;
    	let t1;
    	let t2;
    	let p;
    	let t3;
    	let t4;
    	let div3;
    	let div2;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			svg = svg_element("svg");
    			g3 = svg_element("g");
    			g2 = svg_element("g");
    			g1 = svg_element("g");
    			circle = svg_element("circle");
    			g0 = svg_element("g");
    			path = svg_element("path");
    			t0 = space();
    			div4 = element("div");
    			div1 = element("div");
    			t1 = text(/*title*/ ctx[0]);
    			t2 = space();
    			p = element("p");
    			t3 = text(/*timeRemain*/ ctx[1]);
    			t4 = space();
    			div3 = element("div");
    			div2 = element("div");
    			attr_dev(circle, "id", "Color");
    			attr_dev(circle, "fill", "#EAEEFF");
    			attr_dev(circle, "cx", "45");
    			attr_dev(circle, "cy", "45");
    			attr_dev(circle, "r", "45");
    			add_location(circle, file$7, 23, 12, 1173);
    			attr_dev(path, "d", "M18.5487981,17.681523 L26.2723558,17.681523 C27.1264423,17.681523 27.8170673,18.3628219 27.8170673,19.2053751 C27.8170673,20.0479283 27.1264423,20.7292273 26.2723558,20.7292273 L17.0040865,20.7292273 C16.15,20.7292273 15.459375,20.0479283 15.459375,19.2053751 L15.459375,13.1099664 C15.459375,12.2674132 16.15,11.5861142 17.0040865,11.5861142 C17.8581731,11.5861142 18.5487981,12.2674132 18.5487981,13.1099664 L18.5487981,17.681523 Z M17.0040865,35.9677492 C7.61730769,35.9677492 0.0122596154,28.4613662 0.0122596154,19.2053751 C0.0122596154,9.94535274 7.62139423,2.44300112 17.0040865,2.44300112 C26.3867788,2.44300112 33.9959135,9.9493841 33.9959135,19.2053751 C34,28.4613662 26.3908654,35.9677492 17.0040865,35.9677492 Z M17.0040865,32.9200448 C24.6826923,32.9200448 30.9064904,26.7802912 30.9064904,19.2053751 C30.9064904,11.6304591 24.6826923,5.48667413 17.0040865,5.48667413 C9.32548077,5.48667413 3.10168269,11.6264278 3.10168269,19.2013438 C3.10168269,26.7762598 9.32548077,32.9200448 17.0040865,32.9200448 Z M25.8228365,0.471668533 C26.4276442,-0.124972004 27.4043269,-0.124972004 28.0091346,0.471668533 L32.3776442,4.78118701 C32.9824519,5.37782755 32.9824519,6.34132139 32.3776442,6.93796193 C31.7728365,7.53460246 30.7961538,7.53460246 30.1913462,6.93796193 L25.8228365,2.62844345 C25.2180288,2.02777156 25.2180288,1.06427772 25.8228365,0.471668533 Z M7.65817308,0.471668533 C8.26298077,1.06830907 8.26298077,2.03180291 7.65817308,2.62844345 L3.28966346,6.93393057 C2.68485577,7.53057111 1.70817308,7.53057111 1.10336538,6.93393057 C0.498557692,6.33729003 0.498557692,5.37379619 1.10336538,4.77715566 L5.471875,0.467637178 C6.07668269,-0.124972004 7.05336538,-0.124972004 7.65817308,0.471668533 Z");
    			attr_dev(path, "id", "Shape");
    			add_location(path, file$7, 25, 14, 1349);
    			attr_dev(g0, "transform", "translate(28.000000, 26.000000)");
    			attr_dev(g0, "fill", "#2549E6");
    			attr_dev(g0, "fill-rule", "nonzero");
    			add_location(g0, file$7, 24, 12, 1252);
    			attr_dev(g1, "id", "Group-4");
    			attr_dev(g1, "transform", "translate(963.000000, 135.000000)");
    			add_location(g1, file$7, 22, 10, 1098);
    			attr_dev(g2, "id", "Dashboard01_new01");
    			attr_dev(g2, "transform", "translate(-963.000000, -135.000000)");
    			add_location(g2, file$7, 21, 8, 1013);
    			attr_dev(g3, "id", "Page-1");
    			attr_dev(g3, "stroke", "none");
    			attr_dev(g3, "stroke-width", "1");
    			attr_dev(g3, "fill", "none");
    			attr_dev(g3, "fill-rule", "evenodd");
    			add_location(g3, file$7, 20, 6, 926);
    			attr_dev(svg, "width", "90px");
    			attr_dev(svg, "height", "90px");
    			attr_dev(svg, "viewBox", "0 0 90 90");
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			add_location(svg, file$7, 19, 4, 775);
    			attr_dev(div0, "class", "rounded-full h-20 w-20 flex items-center justify-center bg-blue-50");
    			add_location(div0, file$7, 18, 2, 690);
    			attr_dev(div1, "class", "text-lg");
    			add_location(div1, file$7, 33, 4, 3188);
    			add_location(p, file$7, 34, 4, 3227);
    			attr_dev(div2, "class", "progress-bar bg-theme-1");
    			attr_dev(div2, "role", "progressbar");
    			set_style(div2, "width", /*progress*/ ctx[2] + "%");
    			add_location(div2, file$7, 36, 6, 3289);
    			attr_dev(div3, "class", "progress h-1 mt-4");
    			add_location(div3, file$7, 35, 4, 3251);
    			attr_dev(div4, "class", "px-4");
    			add_location(div4, file$7, 32, 2, 3165);
    			attr_dev(div5, "class", "justify-center col-span-2 flex flex-row min-w-max");
    			add_location(div5, file$7, 17, 0, 624);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, svg);
    			append_dev(svg, g3);
    			append_dev(g3, g2);
    			append_dev(g2, g1);
    			append_dev(g1, circle);
    			append_dev(g1, g0);
    			append_dev(g0, path);
    			append_dev(div5, t0);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, t1);
    			append_dev(div4, t2);
    			append_dev(div4, p);
    			append_dev(p, t3);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);
    			if (dirty & /*timeRemain*/ 2) set_data_dev(t3, /*timeRemain*/ ctx[1]);

    			if (dirty & /*progress*/ 4) {
    				set_style(div2, "width", /*progress*/ ctx[2] + "%");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AuctionProgressIndicator", slots, []);

    	let { closingStart } = $$props,
    		{ closingEnd } = $$props,
    		{ curBlockNum } = $$props;

    	let title, timeRemain, isClosing, progress;
    	const writable_props = ["closingStart", "closingEnd", "curBlockNum"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AuctionProgressIndicator> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("closingStart" in $$props) $$invalidate(3, closingStart = $$props.closingStart);
    		if ("closingEnd" in $$props) $$invalidate(4, closingEnd = $$props.closingEnd);
    		if ("curBlockNum" in $$props) $$invalidate(5, curBlockNum = $$props.curBlockNum);
    	};

    	$$self.$capture_state = () => ({
    		getTimeDiffInWord,
    		closingStart,
    		closingEnd,
    		curBlockNum,
    		title,
    		timeRemain,
    		isClosing,
    		progress
    	});

    	$$self.$inject_state = $$props => {
    		if ("closingStart" in $$props) $$invalidate(3, closingStart = $$props.closingStart);
    		if ("closingEnd" in $$props) $$invalidate(4, closingEnd = $$props.closingEnd);
    		if ("curBlockNum" in $$props) $$invalidate(5, curBlockNum = $$props.curBlockNum);
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("timeRemain" in $$props) $$invalidate(1, timeRemain = $$props.timeRemain);
    		if ("isClosing" in $$props) $$invalidate(6, isClosing = $$props.isClosing);
    		if ("progress" in $$props) $$invalidate(2, progress = $$props.progress);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*curBlockNum, closingStart, isClosing, closingEnd*/ 120) {
    			{
    				$$invalidate(6, isClosing = curBlockNum >= closingStart);

    				const timeDelta = (isClosing
    				? closingEnd - (curBlockNum || 0)
    				: closingStart - curBlockNum) * 6000;

    				const timeDiff = getTimeDiffInWord(timeDelta);
    				$$invalidate(0, title = isClosing ? "Auction ending started" : "Auction started");
    				$$invalidate(1, timeRemain = (isClosing ? "Closed " : "Ending starts in ") + timeDiff);

    				$$invalidate(2, progress = curBlockNum < closingEnd
    				? Math.floor(curBlockNum / closingEnd * 100)
    				: 100);
    			}
    		}
    	};

    	return [title, timeRemain, progress, closingStart, closingEnd, curBlockNum, isClosing];
    }

    class AuctionProgressIndicator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			closingStart: 3,
    			closingEnd: 4,
    			curBlockNum: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AuctionProgressIndicator",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*closingStart*/ ctx[3] === undefined && !("closingStart" in props)) {
    			console.warn("<AuctionProgressIndicator> was created without expected prop 'closingStart'");
    		}

    		if (/*closingEnd*/ ctx[4] === undefined && !("closingEnd" in props)) {
    			console.warn("<AuctionProgressIndicator> was created without expected prop 'closingEnd'");
    		}

    		if (/*curBlockNum*/ ctx[5] === undefined && !("curBlockNum" in props)) {
    			console.warn("<AuctionProgressIndicator> was created without expected prop 'curBlockNum'");
    		}
    	}

    	get closingStart() {
    		throw new Error("<AuctionProgressIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closingStart(value) {
    		throw new Error("<AuctionProgressIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closingEnd() {
    		throw new Error("<AuctionProgressIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closingEnd(value) {
    		throw new Error("<AuctionProgressIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get curBlockNum() {
    		throw new Error("<AuctionProgressIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set curBlockNum(value) {
    		throw new Error("<AuctionProgressIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const file$6 = "src/Loading.svelte";

    function create_fragment$7(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let h2;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			h2 = element("h2");
    			h2.textContent = "Loading...";
    			attr_dev(div0, "class", "loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-16 w-16 mb-6 svelte-13ld8dg");
    			add_location(div0, file$6, 8, 4, 325);
    			attr_dev(h2, "class", "text-center text-gray-600 text-xl font-semibold");
    			add_location(h2, file$6, 9, 4, 432);
    			attr_dev(div1, "wire:loading", "");
    			attr_dev(div1, "class", "w-full overflow-hidden flex flex-col items-center justify-center");
    			add_location(div1, file$6, 7, 2, 229);
    			attr_dev(div2, "class", "py-8");
    			add_location(div2, file$6, 6, 0, 208);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t0);
    			append_dev(div1, h2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Loading", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const file$5 = "src/ProgressBar.svelte";

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "w-12/12 bg-purple-500 py-1 rounded-full");
    			add_location(div0, file$5, 1, 2, 41);
    			attr_dev(div1, "class", "bg-gray-400 rounded-full");
    			add_location(div1, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ProgressBar", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ProgressBar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class ProgressBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProgressBar",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const file$4 = "src/SlotLeaseChart.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (37:6) {#each allSlots as slot (slot.idx)}
    function create_each_block_2$1(key_1, ctx) {
    	let td;
    	let div1;
    	let p0;
    	let t0;
    	let t1_value = /*slot*/ ctx[13].idx + "";
    	let t1;
    	let t2;
    	let p1;
    	let t3_value = /*slot*/ ctx[13].startBlock + "";
    	let t3;
    	let t4;
    	let t5_value = /*slot*/ ctx[13].startBlock + /*leasePeriod*/ ctx[5] + "";
    	let t5;
    	let t6;
    	let div0;
    	let t7_value = getDateFromBlockNum(/*slot*/ ctx[13].startBlock, /*$lastBlockNum*/ ctx[2], /*$lastBlockTime*/ ctx[4]) + "";
    	let t7;
    	let t8;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			td = element("td");
    			div1 = element("div");
    			p0 = element("p");
    			t0 = text("Slot ");
    			t1 = text(t1_value);
    			t2 = space();
    			p1 = element("p");
    			t3 = text(t3_value);
    			t4 = text(" - ");
    			t5 = text(t5_value);
    			t6 = space();
    			div0 = element("div");
    			t7 = text(t7_value);
    			t8 = space();
    			attr_dev(p0, "class", "text-lg");
    			add_location(p0, file$4, 39, 10, 1345);
    			attr_dev(p1, "class", "text-gray-400 text-xs");
    			add_location(p1, file$4, 40, 10, 1394);
    			attr_dev(div0, "class", "slot-time text-gray-400 text-xs svelte-dxv2mm");
    			add_location(div0, file$4, 41, 10, 1493);
    			attr_dev(div1, "class", "slot-head svelte-dxv2mm");
    			add_location(div1, file$4, 38, 8, 1311);
    			add_location(td, file$4, 37, 6, 1298);
    			this.first = td;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t0);
    			append_dev(p0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p1);
    			append_dev(p1, t3);
    			append_dev(p1, t4);
    			append_dev(p1, t5);
    			append_dev(div1, t6);
    			append_dev(div1, div0);
    			append_dev(div0, t7);
    			append_dev(td, t8);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*allSlots*/ 8 && t1_value !== (t1_value = /*slot*/ ctx[13].idx + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*allSlots*/ 8 && t3_value !== (t3_value = /*slot*/ ctx[13].startBlock + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*allSlots*/ 8 && t5_value !== (t5_value = /*slot*/ ctx[13].startBlock + /*leasePeriod*/ ctx[5] + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*allSlots, $lastBlockNum, $lastBlockTime*/ 28 && t7_value !== (t7_value = getDateFromBlockNum(/*slot*/ ctx[13].startBlock, /*$lastBlockNum*/ ctx[2], /*$lastBlockTime*/ ctx[4]) + "")) set_data_dev(t7, t7_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(37:6) {#each allSlots as slot (slot.idx)}",
    		ctx
    	});

    	return block;
    }

    // (48:4) {#if !activeLeases.length}
    function create_if_block_1$2(ctx) {
    	let tr;
    	let td0;
    	let t0;
    	let td1;
    	let div1;
    	let div0;
    	let td1_colspan_value;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = space();
    			td1 = element("td");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "No Parachain Leased Yet";
    			add_location(td0, file$4, 49, 6, 1723);
    			add_location(div0, file$4, 52, 10, 1849);
    			attr_dev(div1, "class", "flex empty-content justify-center items-center svelte-dxv2mm");
    			add_location(div1, file$4, 51, 8, 1778);
    			attr_dev(td1, "colspan", td1_colspan_value = /*allSlots*/ ctx[3].length);
    			add_location(td1, file$4, 50, 6, 1739);
    			add_location(tr, file$4, 48, 4, 1712);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			append_dev(td1, div1);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*allSlots*/ 8 && td1_colspan_value !== (td1_colspan_value = /*allSlots*/ ctx[3].length)) {
    				attr_dev(td1, "colspan", td1_colspan_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(48:4) {#if !activeLeases.length}",
    		ctx
    	});

    	return block;
    }

    // (68:8) {#if span > 0}
    function create_if_block$3(ctx) {
    	let progressbar;
    	let current;
    	progressbar = new ProgressBar({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(progressbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(progressbar, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(progressbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(progressbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(progressbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(68:8) {#if span > 0}",
    		ctx
    	});

    	return block;
    }

    // (66:6) {#each getColSpan(slotIdxs, lease.slots) as span}
    function create_each_block_1$1(ctx) {
    	let td;
    	let td_colspan_value;
    	let current;
    	let if_block = /*span*/ ctx[10] > 0 && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (if_block) if_block.c();
    			attr_dev(td, "colspan", td_colspan_value = /*span*/ ctx[10]);
    			add_location(td, file$4, 66, 6, 2346);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			if (if_block) if_block.m(td, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*span*/ ctx[10] > 0) {
    				if (if_block) {
    					if (dirty & /*slotIdxs, activeLeases*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(td, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*slotIdxs, activeLeases*/ 3 && td_colspan_value !== (td_colspan_value = /*span*/ ctx[10])) {
    				attr_dev(td, "colspan", td_colspan_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(66:6) {#each getColSpan(slotIdxs, lease.slots) as span}",
    		ctx
    	});

    	return block;
    }

    // (58:4) {#each activeLeases as lease (lease.id)}
    function create_each_block$3(key_1, ctx) {
    	let tr;
    	let td;
    	let div1;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div0;
    	let t1_value = /*lease*/ ctx[7].parachain.paraId + "";
    	let t1;
    	let t2;
    	let t3;
    	let current;
    	let each_value_1 = getColSpan(/*slotIdxs*/ ctx[1], /*lease*/ ctx[7].slots);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			attr_dev(img, "class", "mx-1 rounded-full");
    			if (img.src !== (img_src_value = "./ksm-logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*lease*/ ctx[7].parachain.paraId);
    			attr_dev(img, "width", "22");
    			attr_dev(img, "height", "22");
    			add_location(img, file$4, 61, 10, 2074);
    			attr_dev(div0, "class", "text-gray-400 text-lg");
    			add_location(div0, file$4, 62, 10, 2191);
    			attr_dev(div1, "class", "flex justify-center items-center");
    			add_location(div1, file$4, 60, 8, 2017);
    			attr_dev(td, "class", "py-4");
    			add_location(td, file$4, 59, 6, 1991);
    			add_location(tr, file$4, 58, 4, 1980);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(tr, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t3);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*activeLeases*/ 1 && img_alt_value !== (img_alt_value = /*lease*/ ctx[7].parachain.paraId)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if ((!current || dirty & /*activeLeases*/ 1) && t1_value !== (t1_value = /*lease*/ ctx[7].parachain.paraId + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*getColSpan, slotIdxs, activeLeases*/ 3) {
    				each_value_1 = getColSpan(/*slotIdxs*/ ctx[1], /*lease*/ ctx[7].slots);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tr, t3);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(58:4) {#each activeLeases as lease (lease.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let table;
    	let tr;
    	let th;
    	let t0;
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let t1;
    	let t2;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let current;
    	let each_value_2 = /*allSlots*/ ctx[3];
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*slot*/ ctx[13].idx;
    	validate_each_keys(ctx, each_value_2, get_each_context_2$1, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2$1(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_2$1(key, child_ctx));
    	}

    	let if_block = !/*activeLeases*/ ctx[0].length && create_if_block_1$2(ctx);
    	let each_value = /*activeLeases*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key_1 = ctx => /*lease*/ ctx[7].id;
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key_1);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			tr = element("tr");
    			th = element("th");
    			t0 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(th, "class", "empty-head svelte-dxv2mm");
    			add_location(th, file$4, 35, 6, 1221);
    			add_location(tr, file$4, 34, 4, 1210);
    			attr_dev(table, "class", "w-full text-center");
    			add_location(table, file$4, 33, 2, 1171);
    			attr_dev(div, "class", "box overflow-x-scroll p-2");
    			add_location(div, file$4, 32, 0, 1129);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, tr);
    			append_dev(tr, th);
    			append_dev(tr, t0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr, null);
    			}

    			append_dev(table, t1);
    			if (if_block) if_block.m(table, null);
    			append_dev(table, t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*getDateFromBlockNum, allSlots, $lastBlockNum, $lastBlockTime, leasePeriod*/ 60) {
    				each_value_2 = /*allSlots*/ ctx[3];
    				validate_each_argument(each_value_2);
    				validate_each_keys(ctx, each_value_2, get_each_context_2$1, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_2, each0_lookup, tr, destroy_block, create_each_block_2$1, null, get_each_context_2$1);
    			}

    			if (!/*activeLeases*/ ctx[0].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(table, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*getColSpan, slotIdxs, activeLeases*/ 3) {
    				each_value = /*activeLeases*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key_1);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx, each_value, each1_lookup, table, outro_and_destroy_block, create_each_block$3, null, get_each_context$3);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			if (if_block) if_block.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $lastBlockNum;
    	let $lastBlockTime;
    	validate_store(lastBlockNum, "lastBlockNum");
    	component_subscribe($$self, lastBlockNum, $$value => $$invalidate(2, $lastBlockNum = $$value));
    	validate_store(lastBlockTime, "lastBlockTime");
    	component_subscribe($$self, lastBlockTime, $$value => $$invalidate(4, $lastBlockTime = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SlotLeaseChart", slots, []);
    	let { leases } = $$props;
    	const { leasePeriod } = config;
    	let activeLeases, slotIdxs, allSlots;
    	const writable_props = ["leases"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SlotLeaseChart> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("leases" in $$props) $$invalidate(6, leases = $$props.leases);
    	};

    	$$self.$capture_state = () => ({
    		range,
    		config,
    		ProgressBar,
    		lastBlockNum,
    		lastBlockTime,
    		getDateFromBlockNum,
    		getColSpan,
    		leases,
    		leasePeriod,
    		activeLeases,
    		slotIdxs,
    		allSlots,
    		$lastBlockNum,
    		$lastBlockTime
    	});

    	$$self.$inject_state = $$props => {
    		if ("leases" in $$props) $$invalidate(6, leases = $$props.leases);
    		if ("activeLeases" in $$props) $$invalidate(0, activeLeases = $$props.activeLeases);
    		if ("slotIdxs" in $$props) $$invalidate(1, slotIdxs = $$props.slotIdxs);
    		if ("allSlots" in $$props) $$invalidate(3, allSlots = $$props.allSlots);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$lastBlockNum, leases, activeLeases, slotIdxs*/ 71) {
    			{
    				const defaultSlotEnd = Math.floor($lastBlockNum / leasePeriod);
    				const defaultSlotStart = Math.max(defaultSlotEnd - 4, 0);

    				$$invalidate(0, activeLeases = leases.filter(({ lastSlot }) => lastSlot * leasePeriod > $lastBlockNum).map(({ firstSlot, lastSlot, ...rest }) => ({
    					slots: range(firstSlot, lastSlot + 1),
    					firstSlot,
    					lastSlot,
    					...rest
    				})));

    				const [first, last] = activeLeases.reduce(
    					([earliest, lastest], { firstSlot, lastSlot }) => {
    						const first = Math.min(earliest, firstSlot);
    						const last = Math.max(lastest, lastSlot);
    						return [first, last];
    					},
    					[defaultSlotStart, defaultSlotEnd]
    				);

    				$$invalidate(1, slotIdxs = range(first, last + 1));

    				$$invalidate(3, allSlots = slotIdxs.map(slotIdx => ({
    					idx: slotIdx,
    					startBlock: slotIdx * leasePeriod
    				})));
    			}
    		}
    	};

    	return [
    		activeLeases,
    		slotIdxs,
    		$lastBlockNum,
    		allSlots,
    		$lastBlockTime,
    		leasePeriod,
    		leases
    	];
    }

    class SlotLeaseChart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { leases: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SlotLeaseChart",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*leases*/ ctx[6] === undefined && !("leases" in props)) {
    			console.warn("<SlotLeaseChart> was created without expected prop 'leases'");
    		}
    	}

    	get leases() {
    		throw new Error("<SlotLeaseChart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set leases(value) {
    		throw new Error("<SlotLeaseChart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const { Object: Object_1 } = globals;
    const file$3 = "src/AuctionPage.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	child_ctx[17] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (91:2) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let slotleasechart;
    	let t;
    	let if_block_anchor;
    	let current;

    	slotleasechart = new SlotLeaseChart({
    			props: { leases: /*slotLeases*/ ctx[2] },
    			$$inline: true
    		});

    	let if_block = /*$curAuction*/ ctx[1] && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(slotleasechart.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "box mt-4");
    			add_location(div, file$3, 91, 2, 3008);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(slotleasechart, div, null);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const slotleasechart_changes = {};
    			if (dirty & /*slotLeases*/ 4) slotleasechart_changes.leases = /*slotLeases*/ ctx[2];
    			slotleasechart.$set(slotleasechart_changes);

    			if (/*$curAuction*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$curAuction*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(slotleasechart.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(slotleasechart.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(slotleasechart);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(91:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (89:0) {#if $activeAuctions.fetching && !chronicle}
    function create_if_block$2(ctx) {
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(89:0) {#if $activeAuctions.fetching && !chronicle}",
    		ctx
    	});

    	return block;
    }

    // (95:2) {#if $curAuction}
    function create_if_block_1$1(ctx) {
    	let div20;
    	let div12;
    	let div0;
    	let h2;
    	let t1;
    	let div11;
    	let div10;
    	let div3;
    	let div1;
    	let t3;
    	let div2;
    	let t4_value = (/*$curAuction*/ ctx[1]?.id || "") + "";
    	let t4;
    	let t5;
    	let div6;
    	let div4;
    	let t7;
    	let div5;
    	let t8_value = (/*$curAuction*/ ctx[1]?.slotsStart || "") + "";
    	let t8;
    	let t9;
    	let t10_value = (/*$curAuction*/ ctx[1]?.slotsEnd || "") + "";
    	let t10;
    	let t11;
    	let div9;
    	let div7;
    	let t13;
    	let div8;
    	let t14_value = /*$chronicle*/ ctx[6]?.curBlockNum + "";
    	let t14;
    	let t15;
    	let auctionprogressindicator;
    	let t16;
    	let div16;
    	let div13;
    	let p0;
    	let t18;
    	let div15;
    	let div14;
    	let t19;
    	let div19;
    	let div17;
    	let p1;
    	let t21;
    	let div18;
    	let current;

    	auctionprogressindicator = new AuctionProgressIndicator({
    			props: {
    				closingStart: /*$curAuction*/ ctx[1]?.closingStart,
    				closingEnd: /*$curAuction*/ ctx[1]?.closingEnd,
    				curBlockNum: /*$chronicle*/ ctx[6]?.curBlockNum,
    				auctionStart: /*$curAuction*/ ctx[1]?.blockNum
    			},
    			$$inline: true
    		});

    	let each_value_1 = /*groupedSlots*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*latestBids*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div20 = element("div");
    			div12 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Current Auction";
    			t1 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div1.textContent = "Auction Index";
    			t3 = space();
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div6 = element("div");
    			div4 = element("div");
    			div4.textContent = "Current Lease";
    			t7 = space();
    			div5 = element("div");
    			t8 = text(t8_value);
    			t9 = text(" - ");
    			t10 = text(t10_value);
    			t11 = space();
    			div9 = element("div");
    			div7 = element("div");
    			div7.textContent = "Current Block";
    			t13 = space();
    			div8 = element("div");
    			t14 = text(t14_value);
    			t15 = space();
    			create_component(auctionprogressindicator.$$.fragment);
    			t16 = space();
    			div16 = element("div");
    			div13 = element("div");
    			p0 = element("p");
    			p0.textContent = "Auction Slots";
    			t18 = space();
    			div15 = element("div");
    			div14 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t19 = space();
    			div19 = element("div");
    			div17 = element("div");
    			p1 = element("p");
    			p1.textContent = "Live Bids";
    			t21 = space();
    			div18 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "text-lg font-medium mr-5");
    			add_location(h2, file$3, 98, 8, 3267);
    			attr_dev(div0, "class", "block sm:flex items-center h-10");
    			add_location(div0, file$3, 97, 6, 3213);
    			attr_dev(div1, "class", "mt-1 text-gray-600 dark:text-gray-600 text-center");
    			add_location(div1, file$3, 104, 12, 3501);
    			attr_dev(div2, "class", "text-3xl font-bold mt-4 text-center");
    			add_location(div2, file$3, 105, 12, 3596);
    			attr_dev(div3, "class", "justify-center");
    			add_location(div3, file$3, 103, 10, 3460);
    			attr_dev(div4, "class", "mt-1 text-gray-600 dark:text-gray-600 text-center");
    			add_location(div4, file$3, 108, 12, 3743);
    			attr_dev(div5, "class", "text-3xl font-bold mt-4 text-center");
    			add_location(div5, file$3, 109, 12, 3838);
    			attr_dev(div6, "class", "justify-center");
    			add_location(div6, file$3, 107, 10, 3702);
    			attr_dev(div7, "class", "mt-1 text-gray-600 dark:text-gray-600 text-center");
    			add_location(div7, file$3, 112, 12, 4025);
    			attr_dev(div8, "class", "text-3xl font-bold mt-4 text-center");
    			add_location(div8, file$3, 113, 12, 4120);
    			attr_dev(div9, "class", "justify-center");
    			add_location(div9, file$3, 111, 10, 3984);
    			attr_dev(div10, "class", "box grid grid-cols-5 gap-4 divide-x divide-gray-200 p-4");
    			add_location(div10, file$3, 102, 8, 3380);
    			attr_dev(div11, "class", "mt-4 sm:mt-1");
    			add_location(div11, file$3, 101, 6, 3345);
    			attr_dev(div12, "class", "col-span-12 lg:col-span-12 xl:col-span-12 mt-2");
    			add_location(div12, file$3, 96, 4, 3146);
    			add_location(p0, file$3, 121, 8, 4554);
    			attr_dev(div13, "class", "py-2 text-lg");
    			add_location(div13, file$3, 120, 6, 4519);
    			attr_dev(div14, "class", "");
    			add_location(div14, file$3, 124, 8, 4617);
    			attr_dev(div15, "class", "");
    			add_location(div15, file$3, 123, 6, 4594);
    			attr_dev(div16, "class", "col-span-8 m:col-span-12 s:col-span-12 my-4");
    			add_location(div16, file$3, 119, 4, 4455);
    			add_location(p1, file$3, 142, 8, 5188);
    			attr_dev(div17, "class", "py-2 text-lg");
    			add_location(div17, file$3, 141, 6, 5153);
    			add_location(div18, file$3, 144, 6, 5224);
    			attr_dev(div19, "class", "col-span-4 m:col-span-12 s:col-span-12 mt-4");
    			add_location(div19, file$3, 140, 4, 5089);
    			attr_dev(div20, "class", "grid grid-cols-12 gap-6");
    			add_location(div20, file$3, 95, 2, 3104);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div20, anchor);
    			append_dev(div20, div12);
    			append_dev(div12, div0);
    			append_dev(div0, h2);
    			append_dev(div12, t1);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div3);
    			append_dev(div3, div1);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, t4);
    			append_dev(div10, t5);
    			append_dev(div10, div6);
    			append_dev(div6, div4);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, t8);
    			append_dev(div5, t9);
    			append_dev(div5, t10);
    			append_dev(div10, t11);
    			append_dev(div10, div9);
    			append_dev(div9, div7);
    			append_dev(div9, t13);
    			append_dev(div9, div8);
    			append_dev(div8, t14);
    			append_dev(div10, t15);
    			mount_component(auctionprogressindicator, div10, null);
    			append_dev(div20, t16);
    			append_dev(div20, div16);
    			append_dev(div16, div13);
    			append_dev(div13, p0);
    			append_dev(div16, t18);
    			append_dev(div16, div15);
    			append_dev(div15, div14);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div14, null);
    			}

    			append_dev(div20, t19);
    			append_dev(div20, div19);
    			append_dev(div19, div17);
    			append_dev(div17, p1);
    			append_dev(div19, t21);
    			append_dev(div19, div18);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div18, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$curAuction*/ 2) && t4_value !== (t4_value = (/*$curAuction*/ ctx[1]?.id || "") + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*$curAuction*/ 2) && t8_value !== (t8_value = (/*$curAuction*/ ctx[1]?.slotsStart || "") + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty & /*$curAuction*/ 2) && t10_value !== (t10_value = (/*$curAuction*/ ctx[1]?.slotsEnd || "") + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty & /*$chronicle*/ 64) && t14_value !== (t14_value = /*$chronicle*/ ctx[6]?.curBlockNum + "")) set_data_dev(t14, t14_value);
    			const auctionprogressindicator_changes = {};
    			if (dirty & /*$curAuction*/ 2) auctionprogressindicator_changes.closingStart = /*$curAuction*/ ctx[1]?.closingStart;
    			if (dirty & /*$curAuction*/ 2) auctionprogressindicator_changes.closingEnd = /*$curAuction*/ ctx[1]?.closingEnd;
    			if (dirty & /*$chronicle*/ 64) auctionprogressindicator_changes.curBlockNum = /*$chronicle*/ ctx[6]?.curBlockNum;
    			if (dirty & /*$curAuction*/ 2) auctionprogressindicator_changes.auctionStart = /*$curAuction*/ ctx[1]?.blockNum;
    			auctionprogressindicator.$set(auctionprogressindicator_changes);

    			if (dirty & /*groupedSlots*/ 8) {
    				each_value_1 = /*groupedSlots*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div14, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*latestBids*/ 16) {
    				each_value = /*latestBids*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div18, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(auctionprogressindicator.$$.fragment, local);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(auctionprogressindicator.$$.fragment, local);
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div20);
    			destroy_component(auctionprogressindicator);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(95:2) {#if $curAuction}",
    		ctx
    	});

    	return block;
    }

    // (132:14) {#each slots as slot }
    function create_each_block_2(ctx) {
    	let auctionslot;
    	let current;
    	const auctionslot_spread_levels = [/*slot*/ ctx[18], { groupIdx: /*groupIdx*/ ctx[17] }];
    	let auctionslot_props = {};

    	for (let i = 0; i < auctionslot_spread_levels.length; i += 1) {
    		auctionslot_props = assign(auctionslot_props, auctionslot_spread_levels[i]);
    	}

    	auctionslot = new AuctionSlot({ props: auctionslot_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(auctionslot.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(auctionslot, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const auctionslot_changes = (dirty & /*groupedSlots*/ 8)
    			? get_spread_update(auctionslot_spread_levels, [get_spread_object(/*slot*/ ctx[18]), auctionslot_spread_levels[1]])
    			: {};

    			auctionslot.$set(auctionslot_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(auctionslot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(auctionslot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(auctionslot, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(132:14) {#each slots as slot }",
    		ctx
    	});

    	return block;
    }

    // (126:8) {#each groupedSlots as slots, groupIdx}
    function create_each_block_1(ctx) {
    	let div2;
    	let div0;
    	let p;
    	let t0;
    	let t1_value = /*slots*/ ctx[15].length + "";
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let current;
    	let each_value_2 = /*slots*/ ctx[15];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text("Group ");
    			t1 = text(t1_value);
    			t2 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			add_location(p, file$3, 128, 14, 4773);
    			attr_dev(div0, "class", "pl-4 text-base");
    			add_location(div0, file$3, 127, 12, 4730);
    			attr_dev(div1, "class", "grid grid-cols-12 gap-6 gap-y-8 p-4");
    			add_location(div1, file$3, 130, 12, 4832);
    			attr_dev(div2, "class", "box mb-6 py-4");
    			add_location(div2, file$3, 126, 10, 4690);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div2, t3);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*groupedSlots*/ 8) && t1_value !== (t1_value = /*slots*/ ctx[15].length + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*groupedSlots*/ 8) {
    				each_value_2 = /*slots*/ ctx[15];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(126:8) {#each groupedSlots as slots, groupIdx}",
    		ctx
    	});

    	return block;
    }

    // (146:8) {#each latestBids as bid}
    function create_each_block$2(ctx) {
    	let bidcard;
    	let current;
    	const bidcard_spread_levels = [/*bid*/ ctx[12]];
    	let bidcard_props = {};

    	for (let i = 0; i < bidcard_spread_levels.length; i += 1) {
    		bidcard_props = assign(bidcard_props, bidcard_spread_levels[i]);
    	}

    	bidcard = new BidCard({ props: bidcard_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(bidcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bidcard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const bidcard_changes = (dirty & /*latestBids*/ 16)
    			? get_spread_update(bidcard_spread_levels, [get_spread_object(/*bid*/ ctx[12])])
    			: {};

    			bidcard.$set(bidcard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bidcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bidcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bidcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(146:8) {#each latestBids as bid}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t0;
    	let svg;
    	let polyline;
    	let t1;
    	let a;
    	let t3;
    	let div1;
    	let t4;
    	let t5;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$activeAuctions*/ ctx[0].fetching && !chronicle) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text("Parachain ");
    			svg = svg_element("svg");
    			polyline = svg_element("polyline");
    			t1 = space();
    			a = element("a");
    			a.textContent = "Auction";
    			t3 = space();
    			div1 = element("div");
    			t4 = text(/*$timeStr*/ ctx[5]);
    			t5 = space();
    			if_block.c();
    			attr_dev(polyline, "points", "9 18 15 12 9 6");
    			add_location(polyline, file$3, 81, 63, 2751);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "1.5");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", "feather feather-chevron-right breadcrumb__icon");
    			add_location(svg, file$3, 71, 16, 2433);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "breadcrumb--active");
    			add_location(a, file$3, 82, 8, 2801);
    			add_location(div0, file$3, 70, 4, 2411);
    			attr_dev(div1, "class", "text-right flex-1");
    			add_location(div1, file$3, 84, 4, 2867);
    			attr_dev(div2, "class", "top-bar");
    			add_location(div2, file$3, 69, 2, 2385);
    			attr_dev(div3, "class", "content");
    			add_location(div3, file$3, 68, 0, 2361);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, svg);
    			append_dev(svg, polyline);
    			append_dev(div0, t1);
    			append_dev(div0, a);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, t4);
    			append_dev(div3, t5);
    			if_blocks[current_block_type_index].m(div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$timeStr*/ 32) set_data_dev(t4, /*$timeStr*/ ctx[5]);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div3, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let slotsCombination;
    	let slotsWithWiningBid;
    	let groupedSlots;
    	let latestBids;
    	let $activeAuctions;
    	let $curAuction;
    	let $timeStr;
    	let $chronicle;
    	validate_store(curAuction, "curAuction");
    	component_subscribe($$self, curAuction, $$value => $$invalidate(1, $curAuction = $$value));
    	validate_store(timeStr, "timeStr");
    	component_subscribe($$self, timeStr, $$value => $$invalidate(5, $timeStr = $$value));
    	validate_store(chronicle, "chronicle");
    	component_subscribe($$self, chronicle, $$value => $$invalidate(6, $chronicle = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("AuctionPage", slots, []);
    	let timer = 0;
    	let slotLeases = [];

    	const activeAuction = {
    		auctionStatusFilter: { ongoing: { equalTo: true } }
    	};

    	const activeAuctions = operationStore(AUCTION_QUERY, activeAuction, {
    		requestPolicy: "network-only",
    		timeFlag: 0
    	});

    	validate_store(activeAuctions, "activeAuctions");
    	component_subscribe($$self, activeAuctions, value => $$invalidate(0, $activeAuctions = value));
    	query(activeAuctions);

    	onMount(async () => {
    		timer = setInterval(
    			() => {
    				activeAuctions.update(origin => {
    					origin.context = {
    						...origin.context,
    						timeFlag: Math.random()
    					};
    				});
    			},
    			5000
    		);

    		return () => {
    			if (timer) {
    				clearInterval(timer);
    				timer = 0;
    			}
    		};
    	});

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<AuctionPage> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		operationStore,
    		query,
    		AuctionSlot,
    		timeStr,
    		AUCTION_QUERY,
    		normalize,
    		getSlotsCombination,
    		groupBy,
    		orderBy,
    		BidCard,
    		AuctionProgressIndicator,
    		curAuction,
    		chronicle,
    		onMount,
    		Loading,
    		SlotLeaseChart,
    		timer,
    		slotLeases,
    		activeAuction,
    		activeAuctions,
    		$activeAuctions,
    		slotsCombination,
    		$curAuction,
    		slotsWithWiningBid,
    		groupedSlots,
    		latestBids,
    		$timeStr,
    		$chronicle
    	});

    	$$self.$inject_state = $$props => {
    		if ("timer" in $$props) timer = $$props.timer;
    		if ("slotLeases" in $$props) $$invalidate(2, slotLeases = $$props.slotLeases);
    		if ("slotsCombination" in $$props) $$invalidate(8, slotsCombination = $$props.slotsCombination);
    		if ("slotsWithWiningBid" in $$props) $$invalidate(9, slotsWithWiningBid = $$props.slotsWithWiningBid);
    		if ("groupedSlots" in $$props) $$invalidate(3, groupedSlots = $$props.groupedSlots);
    		if ("latestBids" in $$props) $$invalidate(4, latestBids = $$props.latestBids);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeAuctions*/ 1) {
    			{
    				if ($activeAuctions.data) {
    					const { auctions, parachainLeaseds: leases } = normalize($activeAuctions.data) || {};
    					const [auction] = auctions;

    					if (auction) {
    						curAuction.set(auction);
    					}

    					if (leases) {
    						$$invalidate(2, slotLeases = leases);
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*$curAuction*/ 2) {
    			$$invalidate(8, slotsCombination = $curAuction
    			? getSlotsCombination($curAuction.slotsStart)
    			: []);
    		}

    		if ($$self.$$.dirty & /*slotsCombination, $curAuction*/ 258) {
    			$$invalidate(9, slotsWithWiningBid = slotsCombination.map(({ start, end }) => {
    				const { amount, parachain, isCrowdloan, bidder } = $curAuction.winningBids.find(({ firstSlot, lastSlot }) => firstSlot == start && lastSlot == end) || {};
    				const { paraId, manager, id, deposit, creationBlock } = parachain || {};

    				return {
    					firstSlot: start,
    					lastSlot: end,
    					isCrowdloan,
    					amount,
    					bidder,
    					paraId,
    					manager,
    					id,
    					deposit,
    					creationBlock,
    					start,
    					end
    				};
    			}));
    		}

    		if ($$self.$$.dirty & /*slotsWithWiningBid*/ 512) {
    			$$invalidate(3, groupedSlots = orderBy(Object.values(groupBy(slotsWithWiningBid, ({ start, end }) => end - start)), ["length"], ["asc"]));
    		}

    		if ($$self.$$.dirty & /*$curAuction*/ 2) {
    			$$invalidate(4, latestBids = $curAuction
    			? orderBy([].concat($curAuction.winningBids, $curAuction.loseBids), ["createdAt"], ["desc"]).slice(0, 10)
    			: []);
    		}
    	};

    	return [
    		$activeAuctions,
    		$curAuction,
    		slotLeases,
    		groupedSlots,
    		latestBids,
    		$timeStr,
    		$chronicle,
    		activeAuctions,
    		slotsCombination,
    		slotsWithWiningBid
    	];
    }

    class AuctionPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AuctionPage",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const file$2 = "src/CrowdloanPage.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (39:2) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t13;
    	let th7;
    	let t15;
    	let tbody;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*crowdloans*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*crowdloan*/ ctx[6].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Parachain";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Creator";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "First slot";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Last slot";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Raised / Cap";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Ends";
    			t11 = space();
    			th6 = element("th");
    			th6.textContent = "Status";
    			t13 = space();
    			th7 = element("th");
    			th7.textContent = "Contributors";
    			t15 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(th0, "class", "whitespace-nowrap");
    			add_location(th0, file$2, 43, 10, 1287);
    			attr_dev(th1, "class", "whitespace-nowrap");
    			add_location(th1, file$2, 44, 10, 1342);
    			attr_dev(th2, "class", "text-center whitespace-nowrap");
    			add_location(th2, file$2, 45, 10, 1395);
    			attr_dev(th3, "class", "text-center whitespace-nowrap");
    			add_location(th3, file$2, 46, 10, 1463);
    			attr_dev(th4, "class", "text-right whitespace-nowrap");
    			add_location(th4, file$2, 47, 10, 1530);
    			attr_dev(th5, "class", "text-right whitespace-nowrap");
    			add_location(th5, file$2, 48, 10, 1599);
    			attr_dev(th6, "class", "text-center whitespace-nowrap");
    			add_location(th6, file$2, 49, 10, 1660);
    			attr_dev(th7, "class", "text-center whitespace-nowrap");
    			add_location(th7, file$2, 50, 10, 1724);
    			add_location(tr, file$2, 42, 8, 1272);
    			add_location(thead, file$2, 41, 6, 1256);
    			add_location(tbody, file$2, 53, 6, 1819);
    			attr_dev(table, "class", "table table-report -mt-2");
    			add_location(table, file$2, 40, 4, 1209);
    			attr_dev(div, "class", "mt-6");
    			add_location(div, file$2, 39, 2, 1186);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(tr, t7);
    			append_dev(tr, th4);
    			append_dev(tr, t9);
    			append_dev(tr, th5);
    			append_dev(tr, t11);
    			append_dev(tr, th6);
    			append_dev(tr, t13);
    			append_dev(tr, th7);
    			append_dev(table, t15);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*crowdloans, getDateFromBlockNum, $lastBlockNum, $lastBlockTime*/ 26) {
    				each_value = /*crowdloans*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, tbody, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(39:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:2) {#if $crowdloanOps.fetching }
    function create_if_block$1(ctx) {
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(37:2) {#if $crowdloanOps.fetching }",
    		ctx
    	});

    	return block;
    }

    // (80:14) <Link to="/crowdloan/{crowdloan.id}" class="btn text-sm">
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("View");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(80:14) <Link to=\\\"/crowdloan/{crowdloan.id}\\\" class=\\\"btn text-sm\\\">",
    		ctx
    	});

    	return block;
    }

    // (55:8) {#each crowdloans as crowdloan (crowdloan.id) }
    function create_each_block$1(key_1, ctx) {
    	let tr;
    	let td0;
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1_value = /*crowdloan*/ ctx[6].parachain.paraId + "";
    	let t1;
    	let t2;
    	let td1;
    	let div3;
    	let t3_value = /*crowdloan*/ ctx[6].depositor + "";
    	let t3;
    	let div3_title_value;
    	let t4;
    	let td2;
    	let div4;
    	let t5_value = /*crowdloan*/ ctx[6].firstSlot + "";
    	let t5;
    	let t6;
    	let td3;
    	let div5;
    	let t7_value = /*crowdloan*/ ctx[6].lastSlot + "";
    	let t7;
    	let t8;
    	let td4;
    	let div6;
    	let token0;
    	let t9;
    	let token1;
    	let t10;
    	let div7;
    	let t11_value = (/*crowdloan*/ ctx[6].raised / /*crowdloan*/ ctx[6].cap * 100).toFixed(2) + "";
    	let t11;
    	let t12;
    	let t13;
    	let td5;
    	let div8;
    	let t14_value = /*crowdloan*/ ctx[6].lockExpiredBlock + "";
    	let t14;
    	let t15;
    	let div9;
    	let t16_value = getDateFromBlockNum(/*crowdloan*/ ctx[6].lockExpiredBlock, /*$lastBlockNum*/ ctx[3], /*$lastBlockTime*/ ctx[4]) + "";
    	let t16;
    	let t17;
    	let td6;
    	let div10;
    	let t18_value = (/*crowdloan*/ ctx[6].retiring ? "Retired" : "Active") + "";
    	let t18;
    	let t19;
    	let td7;
    	let link;
    	let t20;
    	let current;

    	token0 = new Token({
    			props: {
    				value: /*crowdloan*/ ctx[6].raised,
    				allowZero: true,
    				addSymbol: false
    			},
    			$$inline: true
    		});

    	token1 = new Token({
    			props: {
    				allowZero: true,
    				value: /*crowdloan*/ ctx[6].cap
    			},
    			$$inline: true
    		});

    	link = new Link({
    			props: {
    				to: "/crowdloan/" + /*crowdloan*/ ctx[6].id,
    				class: "btn text-sm",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			td1 = element("td");
    			div3 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			td2 = element("td");
    			div4 = element("div");
    			t5 = text(t5_value);
    			t6 = space();
    			td3 = element("td");
    			div5 = element("div");
    			t7 = text(t7_value);
    			t8 = space();
    			td4 = element("td");
    			div6 = element("div");
    			create_component(token0.$$.fragment);
    			t9 = text(" / ");
    			create_component(token1.$$.fragment);
    			t10 = space();
    			div7 = element("div");
    			t11 = text(t11_value);
    			t12 = text("%");
    			t13 = space();
    			td5 = element("td");
    			div8 = element("div");
    			t14 = text(t14_value);
    			t15 = space();
    			div9 = element("div");
    			t16 = text(t16_value);
    			t17 = space();
    			td6 = element("td");
    			div10 = element("div");
    			t18 = text(t18_value);
    			t19 = space();
    			td7 = element("td");
    			create_component(link.$$.fragment);
    			t20 = space();
    			add_location(div0, file$2, 58, 16, 2013);
    			add_location(div1, file$2, 59, 16, 2041);
    			attr_dev(div2, "class", "text-center flex");
    			add_location(div2, file$2, 57, 14, 1966);
    			attr_dev(td0, "class", "w-40");
    			add_location(td0, file$2, 56, 12, 1934);
    			attr_dev(div3, "class", "text-gray-600 whitespace-nowrap ellipsis-text w-40 svelte-1b6jv3z");
    			attr_dev(div3, "title", div3_title_value = /*crowdloan*/ ctx[6].depositor);
    			add_location(div3, file$2, 63, 14, 2160);
    			attr_dev(td1, "class", "");
    			add_location(td1, file$2, 62, 12, 2132);
    			attr_dev(div4, "class", "text-center ");
    			add_location(div4, file$2, 65, 16, 2314);
    			add_location(td2, file$2, 65, 12, 2310);
    			attr_dev(div5, "class", "text-center ");
    			add_location(div5, file$2, 66, 16, 2389);
    			add_location(td3, file$2, 66, 12, 2385);
    			attr_dev(div6, "class", "text-right");
    			add_location(div6, file$2, 68, 14, 2478);
    			attr_dev(div7, "class", "text-right");
    			add_location(div7, file$2, 69, 14, 2643);
    			add_location(td4, file$2, 67, 12, 2459);
    			attr_dev(div8, "class", "text-right");
    			add_location(div8, file$2, 72, 14, 2788);
    			attr_dev(div9, "class", "text-right text-gray-600");
    			add_location(div9, file$2, 73, 14, 2861);
    			attr_dev(td5, "class", "");
    			add_location(td5, file$2, 71, 12, 2760);
    			attr_dev(div10, "class", "flex justify-center items-center");
    			add_location(div10, file$2, 76, 14, 3044);
    			attr_dev(td6, "class", "");
    			add_location(td6, file$2, 75, 12, 3016);
    			attr_dev(td7, "class", "text-center");
    			add_location(td7, file$2, 78, 12, 3170);
    			attr_dev(tr, "class", "intro-x zoom-in");
    			add_location(tr, file$2, 55, 10, 1893);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(tr, t2);
    			append_dev(tr, td1);
    			append_dev(td1, div3);
    			append_dev(div3, t3);
    			append_dev(tr, t4);
    			append_dev(tr, td2);
    			append_dev(td2, div4);
    			append_dev(div4, t5);
    			append_dev(tr, t6);
    			append_dev(tr, td3);
    			append_dev(td3, div5);
    			append_dev(div5, t7);
    			append_dev(tr, t8);
    			append_dev(tr, td4);
    			append_dev(td4, div6);
    			mount_component(token0, div6, null);
    			append_dev(div6, t9);
    			mount_component(token1, div6, null);
    			append_dev(td4, t10);
    			append_dev(td4, div7);
    			append_dev(div7, t11);
    			append_dev(div7, t12);
    			append_dev(tr, t13);
    			append_dev(tr, td5);
    			append_dev(td5, div8);
    			append_dev(div8, t14);
    			append_dev(td5, t15);
    			append_dev(td5, div9);
    			append_dev(div9, t16);
    			append_dev(tr, t17);
    			append_dev(tr, td6);
    			append_dev(td6, div10);
    			append_dev(div10, t18);
    			append_dev(tr, t19);
    			append_dev(tr, td7);
    			mount_component(link, td7, null);
    			append_dev(tr, t20);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*crowdloans*/ 2) && t1_value !== (t1_value = /*crowdloan*/ ctx[6].parachain.paraId + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*crowdloans*/ 2) && t3_value !== (t3_value = /*crowdloan*/ ctx[6].depositor + "")) set_data_dev(t3, t3_value);

    			if (!current || dirty & /*crowdloans*/ 2 && div3_title_value !== (div3_title_value = /*crowdloan*/ ctx[6].depositor)) {
    				attr_dev(div3, "title", div3_title_value);
    			}

    			if ((!current || dirty & /*crowdloans*/ 2) && t5_value !== (t5_value = /*crowdloan*/ ctx[6].firstSlot + "")) set_data_dev(t5, t5_value);
    			if ((!current || dirty & /*crowdloans*/ 2) && t7_value !== (t7_value = /*crowdloan*/ ctx[6].lastSlot + "")) set_data_dev(t7, t7_value);
    			const token0_changes = {};
    			if (dirty & /*crowdloans*/ 2) token0_changes.value = /*crowdloan*/ ctx[6].raised;
    			token0.$set(token0_changes);
    			const token1_changes = {};
    			if (dirty & /*crowdloans*/ 2) token1_changes.value = /*crowdloan*/ ctx[6].cap;
    			token1.$set(token1_changes);
    			if ((!current || dirty & /*crowdloans*/ 2) && t11_value !== (t11_value = (/*crowdloan*/ ctx[6].raised / /*crowdloan*/ ctx[6].cap * 100).toFixed(2) + "")) set_data_dev(t11, t11_value);
    			if ((!current || dirty & /*crowdloans*/ 2) && t14_value !== (t14_value = /*crowdloan*/ ctx[6].lockExpiredBlock + "")) set_data_dev(t14, t14_value);
    			if ((!current || dirty & /*crowdloans, $lastBlockNum, $lastBlockTime*/ 26) && t16_value !== (t16_value = getDateFromBlockNum(/*crowdloan*/ ctx[6].lockExpiredBlock, /*$lastBlockNum*/ ctx[3], /*$lastBlockTime*/ ctx[4]) + "")) set_data_dev(t16, t16_value);
    			if ((!current || dirty & /*crowdloans*/ 2) && t18_value !== (t18_value = (/*crowdloan*/ ctx[6].retiring ? "Retired" : "Active") + "")) set_data_dev(t18, t18_value);
    			const link_changes = {};
    			if (dirty & /*crowdloans*/ 2) link_changes.to = "/crowdloan/" + /*crowdloan*/ ctx[6].id;

    			if (dirty & /*$$scope*/ 512) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(token0.$$.fragment, local);
    			transition_in(token1.$$.fragment, local);
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(token0.$$.fragment, local);
    			transition_out(token1.$$.fragment, local);
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(token0);
    			destroy_component(token1);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(55:8) {#each crowdloans as crowdloan (crowdloan.id) }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t0;
    	let svg;
    	let polyline;
    	let t1;
    	let a;
    	let t3;
    	let div1;
    	let t4;
    	let t5;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$crowdloanOps*/ ctx[0].fetching) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text("Parachain ");
    			svg = svg_element("svg");
    			polyline = svg_element("polyline");
    			t1 = space();
    			a = element("a");
    			a.textContent = "Crowdloan";
    			t3 = space();
    			div1 = element("div");
    			t4 = text(/*$timeStr*/ ctx[2]);
    			t5 = space();
    			if_block.c();
    			attr_dev(polyline, "points", "9 18 15 12 9 6");
    			add_location(polyline, file$2, 28, 63, 940);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "stroke-width", "1.5");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "class", "feather feather-chevron-right breadcrumb__icon");
    			add_location(svg, file$2, 18, 16, 622);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "breadcrumb--active");
    			add_location(a, file$2, 29, 8, 990);
    			add_location(div0, file$2, 17, 4, 600);
    			attr_dev(div1, "class", "text-right flex-1");
    			add_location(div1, file$2, 31, 4, 1058);
    			attr_dev(div2, "class", "top-bar");
    			add_location(div2, file$2, 16, 2, 574);
    			attr_dev(div3, "class", "content");
    			add_location(div3, file$2, 15, 0, 550);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, svg);
    			append_dev(svg, polyline);
    			append_dev(div0, t1);
    			append_dev(div0, a);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, t4);
    			append_dev(div3, t5);
    			if_blocks[current_block_type_index].m(div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$timeStr*/ 4) set_data_dev(t4, /*$timeStr*/ ctx[2]);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div3, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let crowdloans;
    	let $crowdloanOps;
    	let $timeStr;
    	let $lastBlockNum;
    	let $lastBlockTime;
    	validate_store(timeStr, "timeStr");
    	component_subscribe($$self, timeStr, $$value => $$invalidate(2, $timeStr = $$value));
    	validate_store(lastBlockNum, "lastBlockNum");
    	component_subscribe($$self, lastBlockNum, $$value => $$invalidate(3, $lastBlockNum = $$value));
    	validate_store(lastBlockTime, "lastBlockTime");
    	component_subscribe($$self, lastBlockTime, $$value => $$invalidate(4, $lastBlockTime = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CrowdloanPage", slots, []);
    	const crowdloanOps = operationStore(CROWDLOAN_QUERY, null, { requestPolicy: "network-only" });
    	validate_store(crowdloanOps, "crowdloanOps");
    	component_subscribe($$self, crowdloanOps, value => $$invalidate(0, $crowdloanOps = value));
    	query(crowdloanOps);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CrowdloanPage> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		operationStore,
    		query,
    		timeStr,
    		lastBlockNum,
    		lastBlockTime,
    		CROWDLOAN_QUERY,
    		Token,
    		getDateFromBlockNum,
    		Link,
    		Loading,
    		crowdloanOps,
    		crowdloans,
    		$crowdloanOps,
    		$timeStr,
    		$lastBlockNum,
    		$lastBlockTime
    	});

    	$$self.$inject_state = $$props => {
    		if ("crowdloans" in $$props) $$invalidate(1, crowdloans = $$props.crowdloans);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$crowdloanOps*/ 1) {
    			$$invalidate(1, crowdloans = $crowdloanOps.data?.crowdloans.nodes || []);
    		}
    	};

    	return [
    		$crowdloanOps,
    		crowdloans,
    		$timeStr,
    		$lastBlockNum,
    		$lastBlockTime,
    		crowdloanOps
    	];
    }

    class CrowdloanPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CrowdloanPage",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    const file$1 = "src/ContributorPage.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (50:8) <Link to="/crowdloan" class="breadcrumb--active">
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Crowdloan");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(50:8) <Link to=\\\"/crowdloan\\\" class=\\\"breadcrumb--active\\\">",
    		ctx
    	});

    	return block;
    }

    // (70:2) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let tbody;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*contributions*/ ctx[2]?.length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Contributor";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Amount";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Ratio";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Contributed at";
    			t7 = space();
    			tbody = element("tbody");
    			if_block.c();
    			attr_dev(th0, "class", "border-b-2 dark:border-dark-5 whitespace-nowrap");
    			add_location(th0, file$1, 75, 12, 2105);
    			attr_dev(th1, "class", "border-b-2 dark:border-dark-5 whitespace-nowrap text-right");
    			add_location(th1, file$1, 76, 12, 2194);
    			attr_dev(th2, "class", "border-b-2 dark:border-dark-5 whitespace-nowrap text-right");
    			add_location(th2, file$1, 77, 12, 2289);
    			attr_dev(th3, "class", "border-b-2 dark:border-dark-5 whitespace-nowrap text-right");
    			add_location(th3, file$1, 78, 12, 2383);
    			add_location(tr, file$1, 74, 10, 2088);
    			add_location(thead, file$1, 73, 8, 2070);
    			add_location(tbody, file$1, 81, 8, 2515);
    			attr_dev(table, "class", "table");
    			add_location(table, file$1, 72, 6, 2040);
    			attr_dev(div0, "class", "overflow-x-auto");
    			add_location(div0, file$1, 71, 4, 2003);
    			attr_dev(div1, "class", "mt-6");
    			add_location(div1, file$1, 70, 2, 1980);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(table, t7);
    			append_dev(table, tbody);
    			if_blocks[current_block_type_index].m(tbody, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(tbody, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(70:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (68:2) {#if $contributionsOps.fetching}
    function create_if_block(ctx) {
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(68:2) {#if $contributionsOps.fetching}",
    		ctx
    	});

    	return block;
    }

    // (95:10) {:else}
    function create_else_block_1(ctx) {
    	let tr;
    	let td;
    	let div;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			div = element("div");
    			div.textContent = "No contributions found";
    			attr_dev(div, "class", "py-5 text-xl text-gray-600");
    			add_location(div, file$1, 96, 48, 3425);
    			attr_dev(td, "colspan", "4");
    			attr_dev(td, "class", "text-center");
    			add_location(td, file$1, 96, 12, 3389);
    			add_location(tr, file$1, 95, 10, 3372);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(95:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (83:10) {#if contributions?.length}
    function create_if_block_1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*contributions*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*contribution*/ ctx[9].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contributions, getDateFromBlockNum, $lastBlockNum, $lastBlockTime, Big, fund*/ 108) {
    				each_value = /*contributions*/ ctx[2];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(83:10) {#if contributions?.length}",
    		ctx
    	});

    	return block;
    }

    // (84:10) {#each contributions as contribution, i (contribution.id)}
    function create_each_block(key_1, ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*contribution*/ ctx[9].account + "";
    	let t0;
    	let t1;
    	let td1;
    	let token;
    	let t2;
    	let td2;
    	let t3_value = big(/*contribution*/ ctx[9].amount).div(/*fund*/ ctx[3].raised).times(100).toFixed(4) + "";
    	let t3;
    	let t4;
    	let t5;
    	let td3;
    	let div0;
    	let t6_value = /*contribution*/ ctx[9].blockNum + "";
    	let t6;
    	let t7;
    	let div1;
    	let t8_value = getDateFromBlockNum(/*contribution*/ ctx[9].blockNum, /*$lastBlockNum*/ ctx[5], /*$lastBlockTime*/ ctx[6]) + "";
    	let t8;
    	let t9;
    	let tr_class_value;
    	let current;

    	token = new Token({
    			props: {
    				allowZero: true,
    				value: /*contribution*/ ctx[9].amount
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			create_component(token.$$.fragment);
    			t2 = space();
    			td2 = element("td");
    			t3 = text(t3_value);
    			t4 = text("%");
    			t5 = space();
    			td3 = element("td");
    			div0 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div1 = element("div");
    			t8 = text(t8_value);
    			t9 = space();
    			attr_dev(td0, "class", "border-b dark:border-dark-5");
    			add_location(td0, file$1, 85, 12, 2714);
    			attr_dev(td1, "class", "border-b dark:border-dark-5 text-right");
    			add_location(td1, file$1, 86, 12, 2794);
    			attr_dev(td2, "class", "border-b dark:border-dark-5 text-right");
    			add_location(td2, file$1, 87, 12, 2917);
    			attr_dev(div0, "class", "text-right");
    			add_location(div0, file$1, 89, 14, 3118);
    			attr_dev(div1, "class", "text-right");
    			add_location(div1, file$1, 90, 14, 3186);
    			attr_dev(td3, "class", "border-b dark:border-dark-5 text-right");
    			add_location(td3, file$1, 88, 12, 3052);
    			attr_dev(tr, "class", tr_class_value = "" + ((/*i*/ ctx[11] % 2 == 0 ? "bg-gray-200" : "") + " dark:bg-dark-1"));
    			add_location(tr, file$1, 84, 10, 2640);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			mount_component(token, td1, null);
    			append_dev(tr, t2);
    			append_dev(tr, td2);
    			append_dev(td2, t3);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, div0);
    			append_dev(div0, t6);
    			append_dev(td3, t7);
    			append_dev(td3, div1);
    			append_dev(div1, t8);
    			append_dev(tr, t9);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*contributions*/ 4) && t0_value !== (t0_value = /*contribution*/ ctx[9].account + "")) set_data_dev(t0, t0_value);
    			const token_changes = {};
    			if (dirty & /*contributions*/ 4) token_changes.value = /*contribution*/ ctx[9].amount;
    			token.$set(token_changes);
    			if ((!current || dirty & /*contributions, fund*/ 12) && t3_value !== (t3_value = big(/*contribution*/ ctx[9].amount).div(/*fund*/ ctx[3].raised).times(100).toFixed(4) + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*contributions*/ 4) && t6_value !== (t6_value = /*contribution*/ ctx[9].blockNum + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*contributions, $lastBlockNum, $lastBlockTime*/ 100) && t8_value !== (t8_value = getDateFromBlockNum(/*contribution*/ ctx[9].blockNum, /*$lastBlockNum*/ ctx[5], /*$lastBlockTime*/ ctx[6]) + "")) set_data_dev(t8, t8_value);

    			if (!current || dirty & /*contributions*/ 4 && tr_class_value !== (tr_class_value = "" + ((/*i*/ ctx[11] % 2 == 0 ? "bg-gray-200" : "") + " dark:bg-dark-1"))) {
    				attr_dev(tr, "class", tr_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(token.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(token.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(token);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(84:10) {#each contributions as contribution, i (contribution.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t0;
    	let svg0;
    	let polyline0;
    	let t1;
    	let link;
    	let t2;
    	let svg1;
    	let polyline1;
    	let t3;
    	let t4;
    	let t5;
    	let div1;
    	let t6;
    	let t7;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	link = new Link({
    			props: {
    				to: "/crowdloan",
    				class: "breadcrumb--active",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$contributionsOps*/ ctx[1].fetching) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text("Parachain ");
    			svg0 = svg_element("svg");
    			polyline0 = svg_element("polyline");
    			t1 = space();
    			create_component(link.$$.fragment);
    			t2 = space();
    			svg1 = svg_element("svg");
    			polyline1 = svg_element("polyline");
    			t3 = space();
    			t4 = text(/*fundId*/ ctx[0]);
    			t5 = space();
    			div1 = element("div");
    			t6 = text(/*$timeStr*/ ctx[4]);
    			t7 = space();
    			if_block.c();
    			attr_dev(polyline0, "points", "9 18 15 12 9 6");
    			add_location(polyline0, file$1, 48, 63, 1363);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "width", "24");
    			attr_dev(svg0, "height", "24");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "stroke-width", "1.5");
    			attr_dev(svg0, "stroke-linecap", "round");
    			attr_dev(svg0, "stroke-linejoin", "round");
    			attr_dev(svg0, "class", "feather feather-chevron-right breadcrumb__icon");
    			add_location(svg0, file$1, 38, 16, 1045);
    			attr_dev(polyline1, "points", "9 18 15 12 9 6");
    			add_location(polyline1, file$1, 59, 61, 1777);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "width", "24");
    			attr_dev(svg1, "height", "24");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "stroke-width", "1.5");
    			attr_dev(svg1, "stroke-linecap", "round");
    			attr_dev(svg1, "stroke-linejoin", "round");
    			attr_dev(svg1, "class", "feather feather-chevron-right breadcrumb__icon");
    			add_location(svg1, file$1, 49, 74, 1479);
    			add_location(div0, file$1, 37, 4, 1023);
    			attr_dev(div1, "class", "text-right flex-1");
    			add_location(div1, file$1, 62, 4, 1849);
    			attr_dev(div2, "class", "top-bar");
    			add_location(div2, file$1, 36, 2, 997);
    			attr_dev(div3, "class", "content");
    			add_location(div3, file$1, 35, 0, 973);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, svg0);
    			append_dev(svg0, polyline0);
    			append_dev(div0, t1);
    			mount_component(link, div0, null);
    			append_dev(div0, t2);
    			append_dev(div0, svg1);
    			append_dev(svg1, polyline1);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, t6);
    			append_dev(div3, t7);
    			if_blocks[current_block_type_index].m(div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			if (!current || dirty & /*fundId*/ 1) set_data_dev(t4, /*fundId*/ ctx[0]);
    			if (!current || dirty & /*$timeStr*/ 16) set_data_dev(t6, /*$timeStr*/ ctx[4]);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div3, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(link);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $contributionsOps;
    	let $timeStr;
    	let $lastBlockNum;
    	let $lastBlockTime;
    	validate_store(timeStr, "timeStr");
    	component_subscribe($$self, timeStr, $$value => $$invalidate(4, $timeStr = $$value));
    	validate_store(lastBlockNum, "lastBlockNum");
    	component_subscribe($$self, lastBlockNum, $$value => $$invalidate(5, $lastBlockNum = $$value));
    	validate_store(lastBlockTime, "lastBlockTime");
    	component_subscribe($$self, lastBlockTime, $$value => $$invalidate(6, $lastBlockTime = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ContributorPage", slots, []);
    	let { fundId } = $$props;

    	const params = {
    		fundId,
    		fundIdFilter: { fundId: { equalTo: fundId } }
    	};

    	let contributions, fund;
    	const contributionsOps = operationStore(CONTRIBUTORS_QUERY, params, { requestPolicy: "network-only" });
    	validate_store(contributionsOps, "contributionsOps");
    	component_subscribe($$self, contributionsOps, value => $$invalidate(1, $contributionsOps = value));
    	query(contributionsOps);
    	const writable_props = ["fundId"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ContributorPage> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("fundId" in $$props) $$invalidate(0, fundId = $$props.fundId);
    	};

    	$$self.$capture_state = () => ({
    		operationStore,
    		query,
    		timeStr,
    		lastBlockNum,
    		lastBlockTime,
    		CONTRIBUTORS_QUERY,
    		Token,
    		Big: big,
    		Link,
    		normalize,
    		getDateFromBlockNum,
    		Loading,
    		fundId,
    		params,
    		contributions,
    		fund,
    		contributionsOps,
    		$contributionsOps,
    		$timeStr,
    		$lastBlockNum,
    		$lastBlockTime
    	});

    	$$self.$inject_state = $$props => {
    		if ("fundId" in $$props) $$invalidate(0, fundId = $$props.fundId);
    		if ("contributions" in $$props) $$invalidate(2, contributions = $$props.contributions);
    		if ("fund" in $$props) $$invalidate(3, fund = $$props.fund);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$contributionsOps*/ 2) {
    			{
    				if (!contributionsOps.fetching && contributionsOps.data) {
    					const { contributions: fundContribution, crowdloan } = normalize($contributionsOps.data);
    					$$invalidate(2, contributions = fundContribution);
    					$$invalidate(3, fund = crowdloan);
    				}
    			}
    		}
    	};

    	return [
    		fundId,
    		$contributionsOps,
    		contributions,
    		fund,
    		$timeStr,
    		$lastBlockNum,
    		$lastBlockTime,
    		contributionsOps
    	];
    }

    class ContributorPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { fundId: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContributorPage",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*fundId*/ ctx[0] === undefined && !("fundId" in props)) {
    			console.warn("<ContributorPage> was created without expected prop 'fundId'");
    		}
    	}

    	get fundId() {
    		throw new Error("<ContributorPage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fundId(value) {
    		throw new Error("<ContributorPage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function create_fragment$1(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tailwind", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tailwind> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Tailwind extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tailwind",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const file = "src/App.svelte";

    // (57:6) 
    function create_mobile_menu_slot(ctx) {
    	let div;
    	let mobilemenu;
    	let current;
    	mobilemenu = new MobileMenu({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(mobilemenu.$$.fragment);
    			attr_dev(div, "slot", "mobile-menu");
    			add_location(div, file, 56, 6, 1454);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(mobilemenu, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mobilemenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mobilemenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(mobilemenu);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_mobile_menu_slot.name,
    		type: "slot",
    		source: "(57:6) ",
    		ctx
    	});

    	return block;
    }

    // (60:6) 
    function create_side_menu_slot(ctx) {
    	let div;
    	let sidemenu;
    	let current;
    	sidemenu = new SideMenu({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(sidemenu.$$.fragment);
    			attr_dev(div, "slot", "side-menu");
    			add_location(div, file, 59, 6, 1521);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(sidemenu, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sidemenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sidemenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(sidemenu);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_side_menu_slot.name,
    		type: "slot",
    		source: "(60:6) ",
    		ctx
    	});

    	return block;
    }

    // (64:8) <Route path="/crowdloan/:id" let:params>
    function create_default_slot_1(ctx) {
    	let contributorpage;
    	let current;

    	contributorpage = new ContributorPage({
    			props: { fundId: /*params*/ ctx[3].id },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(contributorpage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(contributorpage, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const contributorpage_changes = {};
    			if (dirty & /*params*/ 8) contributorpage_changes.fundId = /*params*/ ctx[3].id;
    			contributorpage.$set(contributorpage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(contributorpage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(contributorpage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(contributorpage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(64:8) <Route path=\\\"/crowdloan/:id\\\" let:params>",
    		ctx
    	});

    	return block;
    }

    // (61:6) 
    function create_content_slot(ctx) {
    	let div;
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let current;

    	route0 = new Route({
    			props: { path: "/", component: AuctionPage },
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/crowdloan",
    				component: CrowdloanPage
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "/crowdloan/:id",
    				$$slots: {
    					default: [
    						create_default_slot_1,
    						({ params }) => ({ 3: params }),
    						({ params }) => params ? 8 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			attr_dev(div, "slot", "content");
    			add_location(div, file, 60, 6, 1568);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(route0, div, null);
    			append_dev(div, t0);
    			mount_component(route1, div, null);
    			append_dev(div, t1);
    			mount_component(route2, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route2_changes = {};

    			if (dirty & /*$$scope, params*/ 24) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot.name,
    		type: "slot",
    		source: "(61:6) ",
    		ctx
    	});

    	return block;
    }

    // (54:0) <Router>
    function create_default_slot(ctx) {
    	let main;
    	let layout;
    	let current;

    	layout = new Layout({
    			props: {
    				$$slots: {
    					content: [create_content_slot],
    					"side-menu": [create_side_menu_slot],
    					"mobile-menu": [create_mobile_menu_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(layout.$$.fragment);
    			attr_dev(main, "class", "main");
    			add_location(main, file, 54, 2, 1415);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(layout, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layout_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				layout_changes.$$scope = { dirty, ctx };
    			}

    			layout.$set(layout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(layout);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(54:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let tailwind;
    	let t;
    	let router;
    	let current;
    	tailwind = new Tailwind({ $$inline: true });

    	router = new Router({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tailwind.$$.fragment);
    			t = space();
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tailwind, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tailwind.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tailwind.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tailwind, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $chronicleOps;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	initClient({ url: config.endpoint });
    	let timer = 0;

    	const chronicleOps = operationStore(CHRONICLE_QUERY, null, {
    		requestPolicy: "network-only",
    		timeFlag: 0
    	});

    	validate_store(chronicleOps, "chronicleOps");
    	component_subscribe($$self, chronicleOps, value => $$invalidate(1, $chronicleOps = value));
    	query(chronicleOps);

    	onMount(async () => {
    		if (!timer) {
    			timer = setInterval(
    				() => {
    					chronicleOps.update(origin => {
    						origin.context = {
    							...origin.context,
    							timeFlag: Math.random()
    						};
    					});
    				},
    				2500
    			);
    		}

    		return () => {
    			clearInterval(timer);
    			timer = 0;
    		};
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		useParams,
    		MobileMenu,
    		SideMenu,
    		Layout,
    		AuctionPage,
    		CrowdloanPage,
    		ContributorPage,
    		Tailwind,
    		initClient,
    		config,
    		operationStore,
    		query,
    		CHRONICLE_QUERY,
    		onMount,
    		onDestroy,
    		normalize,
    		chronicle,
    		timer,
    		chronicleOps,
    		$chronicleOps
    	});

    	$$self.$inject_state = $$props => {
    		if ("timer" in $$props) timer = $$props.timer;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$chronicleOps*/ 2) {
    			{
    				const { chronicle: curChronicle } = normalize($chronicleOps.data) || {};

    				if (curChronicle) {
    					chronicle.set(curChronicle);
    				}
    			}
    		}
    	};

    	return [chronicleOps, $chronicleOps];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
