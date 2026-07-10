/*
====================================================
GUIA TURÍSTICO DE ANDRELÂNDIA
MAPA SVG
====================================================
*/

const SVG_WIDTH = 84666.66;
const SVG_HEIGHT = 67733.32;

const bounds = [
    [0, 0],
    [SVG_HEIGHT, SVG_WIDTH]
];

let mapa = null;
let camadaMarcadores = null;

/*
====================================================
INICIALIZAR MAPA
====================================================
*/

function inicializarMapa() {

    mapa = L.map("map", {

        crs: L.CRS.Simple,

        attributionControl: false,

        zoomControl: true,

        /*
        ====================================================
        ALTERE ESTE VALOR PARA CONTROLAR O MÁXIMO
        DISTANCIAMENTO DA CÂMERA
        ====================================================

        -2  = pouco afastamento
        -3  = médio
        -4  = grande
        -5  = muito grande
        -6  = extremamente grande (recomendado)
        -7  = exagerado
        */

        minZoom: -15,

        /*
        ====================================================
        ALTERE ESTE VALOR PARA CONTROLAR O MÁXIMO
        DE APROXIMAÇÃO
        ====================================================
        */

        maxZoom: 8,

        zoomSnap: 0.25,

        zoomDelta: 0.25,

        wheelPxPerZoomLevel: 120,

        maxBounds: bounds,

        maxBoundsViscosity: 1

    });

    L.imageOverlay(

        "img/mapa/mapa.svg",

        bounds

    ).addTo(mapa);

    mapa.fitBounds(bounds);

    /*
    ====================================================
    ALTERE ESTE VALOR PARA DEFINIR O ZOOM
    INICIAL DO MAPA
    ====================================================

    Quanto mais negativo,
    mais distante o mapa abrirá.

    -2
    -3
    -4
    -5
    -6
    */

    mapa.setZoom(-6);

    mapa.setMaxBounds(bounds);

    camadaMarcadores = L.layerGroup();

    camadaMarcadores.addTo(mapa);

}
/*
====================================================
CARREGAR MARCADORES
====================================================
*/

async function carregarMarcadores() {

    try {

        const resposta = await fetch("data/locais.json");

        if (!resposta.ok) {

            throw new Error("Não foi possível carregar os locais.");

        }

        const locais = await resposta.json();

        criarMarcadores(locais);

    }

    catch (erro) {

        console.error("Erro ao carregar marcadores:", erro);

    }

}
/*
====================================================
CRIAR MARCADORES
====================================================
*/

function criarMarcadores(locais){

    camadaMarcadores.clearLayers();

    locais.forEach(local=>{

        /*
        Se ainda não definiu X e Y,
        o marcador não é criado.
        */

        if(
            local.x === undefined ||
            local.y === undefined
        ){
            return;
        }

        const marcador = L.marker(

            [

                local.y,

                local.x

            ],

            {

                // Marcador padrão do Leaflet
                // Depois você troca pelos ícones personalizados.

                icon: new L.Icon.Default()

            }

        );

        marcador.bindPopup(

            criarPopup(local),

            {

                maxWidth:320

            }

        );

        marcador.addTo(

            camadaMarcadores

        );

    });

}
/*
====================================================
POPUP
====================================================
*/

function criarPopup(local){

    return `

    <div class="popup-card">

        <img
            src="${local.capa}"
            alt="${local.nome}"
            class="popup-capa">

        <h3>

            ${local.nome}

        </h3>

        <p>

            ${local.descricao}

        </p>

        <a

            class="popup-link"

            href="pages/local.html?id=${local.id}">

            Conhecer

        </a>

    </div>

    `;

}
/*
====================================================
MODO EDIÇÃO
Clique no mapa para descobrir X e Y
====================================================
*/

let modoEdicao = true;

function habilitarModoEdicao() {

    if (!modoEdicao) return;

    mapa.on("click", function (e) {

        const x = Math.round(e.latlng.lng);
        const y = Math.round(e.latlng.lat);

        console.clear();

        console.log("==============================");
        console.log("Coordenadas");
        console.log("X:", x);
        console.log("Y:", y);
        console.log("==============================");

        L.popup()

            .setLatLng(e.latlng)

            .setContent(

                `
                <strong>X:</strong> ${x}<br>
                <strong>Y:</strong> ${y}
                `

            )

            .openOn(mapa);

    });

}

/*
====================================================
CENTRALIZAR MAPA
====================================================
*/

function centralizarMapa(x, y){

    mapa.flyTo(

        [

            y,

            x

        ],

        mapa.getZoom(),

        {

            animate:true,

            duration:1.2

        }

    );

}

/*
====================================================
DESTACAR LOCAL
====================================================
*/

function destacarLocal(local){

    if(local.x === undefined || local.y === undefined){

        return;

    }

    centralizarMapa(

        local.x,

        local.y

    );

}

/*
====================================================
ÍCONE PADRÃO
====================================================
*/

function obterIcone(){

    return new L.Icon.Default();

}
/*
====================================================
REDIMENSIONAMENTO
====================================================
*/

window.addEventListener(

    "resize",

    () => {

        if(mapa){

            mapa.invalidateSize();

        }

    }

);

/*
====================================================
INICIALIZAÇÃO
====================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        inicializarMapa();

        await carregarMarcadores();

        habilitarModoEdicao();

    }

);
