// Garden controls: category filter and rating sort.
// Posters, thumbnails and notes are handled by threshold.js.
(function () {
    'use strict';

    function init() {
        const grid = document.querySelector('.garden-grid');
        if (!grid) return;

        const cards = () => [...grid.querySelectorAll('.threshold-hover-wrapper')];
        const initialOrder = cards();
        // threshold.js wraps each poster on DOMContentLoaded; wait for it if needed.
        if (!initialOrder.length) {
            requestAnimationFrame(init);
            return;
        }

        const filterButtons = document.querySelectorAll('.garden-filter-btn');
        const sortTrigger = document.querySelector('.garden-sort-trigger');
        const sortMenu = document.querySelector('.garden-sort-menu');
        const sortLabel = document.querySelector('.garden-sort-label');
        const sortButtons = document.querySelectorAll('.garden-sort-btn');
        const emptyState = document.querySelector('.garden-empty-msg');

        let activeFilter = 'all';
        let activeSort = 'default';

        const setPressed = (buttons, chosen) => {
            buttons.forEach(b => {
                b.classList.toggle('button-secondary', b === chosen);
                b.classList.toggle('button-primary', b !== chosen);
            });
        };

        const closeSortMenu = () => {
            sortMenu.hidden = true;
            sortTrigger.setAttribute('aria-expanded', 'false');
        };

        const scoreOf = card => Number(card.dataset.score);

        function applyView() {
            const items = cards();
            items.forEach(card => {
                const category = (card.dataset.category || '').trim().toLowerCase();
                card.hidden = !(activeFilter === 'all' || category === activeFilter);
            });

            if (activeSort === 'default') {
                initialOrder.forEach(card => grid.appendChild(card));
            } else {
                const direction = activeSort === 'highest' ? -1 : 1;
                [...items]
                    .sort((a, b) => {
                        const aOk = Number.isFinite(scoreOf(a));
                        const bOk = Number.isFinite(scoreOf(b));
                        if (aOk !== bOk) return aOk ? -1 : 1;
                        return direction * (scoreOf(a) - scoreOf(b));
                    })
                    .forEach(card => grid.appendChild(card));
            }

            emptyState.hidden = items.some(card => !card.hidden);
        }

        sortTrigger.addEventListener('click', () => {
            const opening = sortMenu.hidden;
            sortMenu.hidden = !opening;
            sortTrigger.setAttribute('aria-expanded', String(opening));
        });

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                activeFilter = btn.dataset.filter.toLowerCase();
                setPressed(filterButtons, btn);
                applyView();
            });
        });

        sortButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                activeSort = btn.dataset.sort;
                sortLabel.textContent = btn.textContent;
                setPressed(sortButtons, btn);
                closeSortMenu();
                applyView();
            });
        });

        document.addEventListener('click', event => {
            if (!event.target.closest('.garden-sort-dropdown')) closeSortMenu();
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
