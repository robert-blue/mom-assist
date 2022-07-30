// this code will be executed after page load

(async function () {
    log('👽👽👽 MoM Assist Loading 👽👽👽');

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(async (mutations) => await observeHandler(mutations));

    // Start observing the target node for configured mutations
    observer.observe(document, {
        attributes: false,
        childList: true,
        subtree: true,
        characterData: false,
    });

    document.addEventListener('click', async (e) => {
        const button = e.target.closest('button');
        if (!button || !button.innerText) {
            return;
        }

        logButtonClick(button);
    });

    // When CTRL is pressed, show the tile numbers to be used in the highlightPlots
    // value in settings.js

    document.addEventListener('keydown', async (e) => {
        if (e.key.toLowerCase() === 'control') {
            setTimeout(() => {
                markPaths();
            }, 1);
        }
    });

    document.addEventListener('keyup', async (e) => {
        if (e.key.toLowerCase() === 'control') {
            setTimeout(() => {
                unmarkPaths();
            })
        }
    });

    //===================

    async function observeHandler(mutations) {
        const skipTags = ['style'];

        for (const mutation of mutations) {
            for (const added of mutation.addedNodes) {
                const tag = added.tagName?.toLowerCase();
                if (added && added.innerHTML && !skipTags.includes(tag)) {
                    await handleElemMutation(added);
                }
            }
        }
    }

    async function handleElemMutation(added) {
        // Log toast messages to the debug console which should be more quiet than default console
        const toast = added.querySelector('.MuiAlert-message');
        if (toast) {
            logToast(toast);
            return;
        }

        // Log to debug console the text in toasts that have a dismiss button
        const dismiss = findButton('dismiss', added);
        if (dismiss) {
            const toast = added.querySelector('#notistack-snackbar');
            if (toast) {
                logDismissToast(toast);
            }
        }
    }

    let highlightCSS = '';

    // Add CSS rules to apply color to plot tiles on DTM map view
    for (const [dtm, highlights] of Object.entries(highlightPlots)) {
        if (!window.location.href.includes(`/${dtm}/`)) {
            continue;
        }

        for (const [color, tileIndex] of highlights) {
            highlightCSS += `
                ${tileIndex.map((x) => 'div.leaflet-pane.leaflet-overlay-pane > svg > g > path:nth-child(' + x + ')').join(',')} {
                    fill: ${color};
                    fill-opacity: .2;    
                }`;
        }
    }

    setTimeout(() => {
        document.head.insertAdjacentHTML('beforeend', `<style>${highlightCSS}</style>`);
    }, 1);

})();
