/*
 * Modal
 * Taken from https://github.com/picocss/pico/blob/master/docs/js/modal.js
 * pico has no js included, this is their implementation of a modal js
 */
(function (namespace) {
	namespace.Modal = class Modal {
		constructor(config = {}) {
			this.config = {
				isOpenClass: 'modal-is-open',
				openingClass: 'modal-is-opening',
				closingClass: 'modal-is-closing',
				animationDuration: 400, // ms
				...config,
			};

			this.isOpenClass = this.config.isOpenClass;
			this.openingClass = this.config.openingClass;
			this.closingClass = this.config.closingClass;
			this.animationDuration = this.config.animationDuration;
			this.visibleModal = null;

			// Close with a click outside
			document.addEventListener('click', (event) => {
				if (this.visibleModal !== null) {
					const modalContent = this.visibleModal.querySelector('article');
					const isClickInside = modalContent.contains(event.target);
					!isClickInside && this.closeModal(this.visibleModal);
				}
			});

			// Close with Esc key
			document.addEventListener('keydown', (event) => {
				if (event.key === 'Escape' && this.visibleModal !== null) {
					this.closeModal(this.visibleModal);
				}
			});
		}

		toggleModal(event) {
			event.preventDefault();
			const modal = document.getElementById(event.currentTarget.getAttribute('data-target'));

			if (typeof modal !== 'undefined' && modal !== null && this.isModalOpen(modal)) {
				this.closeModal(modal);
			} else {
				this.openModal(modal);
			}
		}

		isModalOpen(modal) {
			return modal.hasAttribute('open') && modal.getAttribute('open') != 'false'
				? true
				: false;
		}

		openModal(modal) {
			if (this.isScrollbarVisible()) {
				document.documentElement.style.setProperty(
					'--scrollbar-width',
					`${this.getScrollbarWidth()}px`,
				);
			}
			document.documentElement.classList.add(this.isOpenClass, this.openingClass);
			setTimeout(() => {
				this.visibleModal = modal;
				document.documentElement.classList.remove(this.openingClass);
			}, this.animationDuration);
			modal.setAttribute('open', true);
		}

		closeModal(modal) {
			this.visibleModal = null;
			document.documentElement.classList.add(this.closingClass);
			setTimeout(() => {
				document.documentElement.classList.remove(this.closingClass, this.isOpenClass);
				document.documentElement.style.removeProperty('--scrollbar-width');
				modal.removeAttribute('open');
			}, this.animationDuration);
		}

		getScrollbarWidth() {
			// Creating invisible container
			const outer = document.createElement('div');
			outer.style.visibility = 'hidden';
			outer.style.overflow = 'scroll'; // forcing scrollbar to appear
			outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
			document.body.appendChild(outer);

			// Creating inner element and placing it in the container
			const inner = document.createElement('div');
			outer.appendChild(inner);

			// Calculating difference between container's full width and the child width
			const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

			// Removing temporary elements from the DOM
			outer.parentNode.removeChild(outer);

			return scrollbarWidth;
		}

		isScrollbarVisible() {
			return document.body.scrollHeight > screen.height;
		}
	};
})(extend('Pico'));
