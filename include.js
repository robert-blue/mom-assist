function findButton(title, rootElem = document) {
    const buttons = [...rootElem.querySelectorAll('button')];
    let filtered = buttons.filter(
        (b) => b.innerText.trim().replace(/\n.*/g, '').toLowerCase() === title.toLowerCase()
    );

    if (filtered.length === 0) {
        filtered = buttons.filter((button) => button.innerText.trim().replace(/\n.*/g, '').toLowerCase().startsWith(title.toLowerCase()));
    }

    if (filtered.length > 1) {
        throw new Error(`More than one button matched ${title}`);
    }

    return filtered[0];
}

function log(text) {
    console.info(text);
}

function logToast(toast) {
    const split = toast.innerText.split('\n');
    if (split.length > 1) {
        console.info(`${split.join(': ')}`,);
    }
}

function logDismissToast(toast) {
    const message = toast.innerText.trim();

    if (message.toLowerCase().startsWith('success')) {
        console.info('✔', message);
    } else {
        console.info('❌', message);
    }
}

function logButtonClick(button) {
    let text = button.innerText?.replace(/\n+.*/, '');

    const buildingName = button.querySelector('p')
    if (buildingName) {
        text = buildingName.innerText;
    }

    console.info('🖱', text);
}
