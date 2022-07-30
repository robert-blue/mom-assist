const rePathCoords = /M(-?\d+) (-?\d+)/;

function unmarkPaths() {
    const elems = document.querySelectorAll('.path-index-markers');
    for (const elem of elems) {
        elem.parentElement.removeChild(elem);
    }
}

function markPaths() {
    if (document.querySelector('.path-index-markers')) {
        return;
    }

    const paths = document.body.querySelectorAll('.leaflet-overlay-pane > svg > g > path');
    if (!paths || paths.length < 1) {
        return;
    }

    let tileIndexMarkersHTML = '';

    for (let i = 0; i < paths.length; i++) {
        const match = rePathCoords.exec(paths[i].getAttribute('d'));
        if (!match) {
            continue;
        }

        const coords = [Number.parseInt(match[1]), Number.parseInt(match[2])]
        if (coords[0] === 0 && coords[1] === 0) {
            continue;
        }

        tileIndexMarkersHTML += `
            <div class="leaflet-marker-icon leaflet-zoom-animated" 
                 tabindex="0"
                 style="transform: translate3d(${coords[0]}px, ${coords[1]}px, 0px); z-index: 99999; margin-left: -5px; margin-top: 10px; background-color: transparent">
              ${i + 1}
            </div>`;
    }

    setTimeout(() => {
        const markerPane = document.querySelector('.leaflet-pane');
        markerPane.insertAdjacentHTML("beforeend", `<div class="leaflet-pane leaflet-marker-pane path-index-markers">${tileIndexMarkersHTML}</div>`)
    }, 1);
}
