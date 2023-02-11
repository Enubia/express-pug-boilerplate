/*
 * ThemeSwitcher
 * Taken from https://github.com/picocss/pico/blob/master/docs/js/src/theme-switcher.js
 */
((namespace) => {
	namespace.ThemeSwitcher = class ThemeSwitcher {
		constructor() {
			// Config
			this._scheme = 'auto';
			this.change = {
				light: '<i>Turn on dark mode</i>',
				dark: '<i>Turn off dark mode</i>',
			};
			this.buttonsTarget = '.theme-switcher';
			this.localStorageKey = 'picoPreferredColorScheme';
		}

		init() {
			this.scheme = this.schemeFromLocalStorage;
			this.initSwitchers();
		}

		get schemeFromLocalStorage() {
			if (typeof window.localStorage !== 'undefined') {
				if (window.localStorage.getItem(this.localStorageKey) !== null) {
					return window.localStorage.getItem(this.localStorageKey);
				}
			}
			return this._scheme;
		}

		get preferredColorScheme() {
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}

		initSwitchers() {
			const buttons = document.querySelectorAll(this.buttonsTarget);
			buttons.forEach((button) => {
				button.addEventListener(
					'click',
					() => {
						this.scheme === 'dark' ? (this.scheme = 'light') : (this.scheme = 'dark');
					},
					false,
				);
			});
		}

		addButton(config) {
			let button = document.createElement(config.tag);
			button.className = config.class;
			document.querySelector(config.target).appendChild(button);
		}

		set scheme(scheme) {
			if (scheme === 'auto') {
				this.preferredColorScheme === 'dark'
					? (this._scheme = 'dark')
					: (this._scheme = 'light');
			} else if (scheme === 'dark' || scheme === 'light') {
				this._scheme = scheme;
			}
			this.applyScheme();
			this.schemeToLocalStorage();
		}

		get scheme() {
			return this._scheme;
		}

		applyScheme() {
			document.querySelector('html').setAttribute('data-theme', this.scheme);
			const buttons = document.querySelectorAll(this.buttonsTarget);
			buttons.forEach((button) => {
				const text = this.scheme === 'dark' ? this.change.dark : this.change.light;
				button.innerHTML = text;
				button.setAttribute('aria-label', text.replace(/<[^>]*>?/gm, ''));
			});
		}

		schemeToLocalStorage() {
			if (typeof window.localStorage !== 'undefined') {
				window.localStorage.setItem(this.localStorageKey, this.scheme);
			}
		}
	};
})(extend('Pico'));
