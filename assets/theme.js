// Light/dark theme: follows the system setting until the visitor picks one,
// then remembers it (same "theme" key as /poems/, so the choice carries over).
(function () {
    var root = document.documentElement;
    var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    function saved() {
        try {
            var t = localStorage.getItem('theme');
            return t === 'light' || t === 'dark' ? t : null;
        } catch (e) {
            return null;
        }
    }

    function apply(theme) {
        root.setAttribute('data-theme', theme);
        root.style.colorScheme = theme;
    }

    // Runs in <head>, before first paint, so there is no flash of the wrong theme.
    apply(saved() || (media && media.matches ? 'dark' : 'light'));

    var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
    var MOON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

    var CSS =
        '.theme-toggle-btn{position:fixed;top:16px;right:16px;z-index:1000;width:44px;height:44px;border-radius:50%;' +
        'display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;' +
        'background:#ffffff;color:#57068c;border:2px solid #ab82c5;box-shadow:0 4px 12px rgba(51,6,98,.2);' +
        'transition:transform .2s ease}' +
        '.theme-toggle-btn:hover{transform:scale(1.08) rotate(12deg)}' +
        '.theme-toggle-btn:focus-visible{outline:3px solid #8900e1;outline-offset:2px}' +
        '.theme-toggle-btn svg{width:22px;height:22px}' +
        '[data-theme="dark"] .theme-toggle-btn{background:#eee6f3;color:#330662;border-color:#7b5aa6}';

    document.addEventListener('DOMContentLoaded', function () {
        var style = document.createElement('style');
        style.textContent = CSS;
        document.head.appendChild(style);

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-toggle-btn';

        function render() {
            var dark = root.getAttribute('data-theme') === 'dark';
            btn.innerHTML = dark ? MOON : SUN;
            btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
        }

        btn.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            apply(next);
            try {
                localStorage.setItem('theme', next);
            } catch (e) {}
            render();
        });

        if (media && media.addEventListener) {
            media.addEventListener('change', function (e) {
                if (!saved()) {
                    apply(e.matches ? 'dark' : 'light');
                    render();
                }
            });
        }

        render();
        document.body.appendChild(btn);
    });
})();
