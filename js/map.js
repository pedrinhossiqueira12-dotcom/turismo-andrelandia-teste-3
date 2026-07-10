/*
====================================================
GUIA TURÍSTICO DE ANDRELÂNDIA
MAPA SVG
====================================================
*/

const SVG_WIDTH = 84666.66;
const SVG_HEIGHT = 67733.32;

const MARGEM = 90000;

const bounds = [
    [-MARGEM, -MARGEM],
    [SVG_HEIGHT + MARGEM, SVG_WIDTH + MARGEM]
];

let mapa = null;
let camadaMarcadores = null;

/*
====================================================
INICIALIZAR MAPA
====================================================
*/

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
        Quanto menor, mais longe pode afastar.
        */
        minZoom: -6,

        /*
        Quanto maior, mais aproxima.
        */
        maxZoom: 8,

        zoomSnap: 0.25,

        zoomDelta: 0.25,

        wheelPxPerZoomLevel: 120,

        /*
        Impede sair muito do mapa.
        */
        maxBounds: [

            [-5000, -5000],

            [SVG_HEIGHT + 5000, SVG_WIDTH + 5000]

        ],

        maxBoundsViscosity: 1

    });

    /*
    ====================================================
    DESENHA O SVG
    ====================================================
    */

    L.imageOverlay(

        "img/mapa/mapa.svg",

        [

            [0, 0],

            [SVG_HEIGHT, SVG_WIDTH]

        ]

    ).addTo(mapa);

    /*
    ====================================================
    ZOOM INICIAL
    ====================================================

    Altere SOMENTE este valor.

    -2.0
    -2.5
    -3.0
    -3.5
    -4.0
    */

    mapa.setView(

        [

            SVG_HEIGHT / 2,

            SVG_WIDTH / 2

        ],

        -3.5

    );

    /*
    ====================================================
    CAMADA DOS MARCADORES
    ====================================================
    */

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
