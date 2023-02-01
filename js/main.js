function extend(ns_string) {
    window.PicoJS = window.PicoJS || {};

    let parts = ns_string.split('.');
    let parent = window.PicoJS;

    if (parts[0] === 'PicoJS') {
        parts = parts.slice(1);
    }

    for (let i = 0; i < parts.length; i++) {
        if (!parent[parts[i]]) {
            parent[parts[i]] = {};
        }

        parent = parent[parts[i]];
    }

    return parent;
}

function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}