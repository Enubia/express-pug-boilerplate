function extend(ns_string) {
    window.Pico = window.Pico || {};

    let parts = ns_string.split('.');
    let parent = window.Pico;

    if (parts[0] === 'Pico') {
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