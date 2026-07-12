/*
====================================================
GUIA TURÍSTICO DE ANDRELÂNDIA
MAPA SVG
Versão 3.0
====================================================
*/

/*
====================================================
DIMENSÕES DO SVG
====================================================
*/

const SVG_WIDTH = 94517.3;
const SVG_HEIGHT = 66878.4;
/*
====================================================
CONFIGURAÇÕES
====================================================
*/

/*
Zoom inicial.

0      = tamanho real
-1     = afasta um pouco
-2     = afasta mais
-3     = recomendado
-4     = muito distante
*/

const ZOOM_INICIAL = -3.5;

/*
Limite máximo de aproximação.
*/

const ZOOM_MAXIMO = 8;

/*
Limite máximo de afastamento.
*/

const ZOOM_MINIMO = -6;

/*
Margem invisível ao redor do mapa.
Serve apenas para deixar a navegação mais agradável.
*/

const BORDA = 3000;

/*
====================================================
LIMITES
====================================================
*/

const AREA_MAPA = L.latLngBounds(

    [0, 0],

    [SVG_HEIGHT, SVG_WIDTH]

);

const AREA_NAVEGACAO = L.latLngBounds(

    [-BORDA, -BORDA],

    [

        SVG_HEIGHT + BORDA,

        SVG_WIDTH + BORDA

    ]

);

/*
====================================================
VARIÁVEIS
====================================================
*/

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

        minZoom: ZOOM_MINIMO,

        maxZoom: ZOOM_MAXIMO,

        zoomSnap: 0.25,

        zoomDelta: 0.25,

        wheelPxPerZoomLevel: 120,

        maxBounds: AREA_NAVEGACAO,

        maxBoundsViscosity: 1,

        preferCanvas: true

    });

    /*
    ====================================================
    IMAGEM DO MAPA
    ====================================================
    */

    L.imageOverlay(

        "img/mapa/mapa.svg",

        AREA_MAPA

    ).addTo(mapa);

    /*
    ====================================================
    CENTRALIZA O MAPA
    ====================================================
    */

    mapa.setView(

        [

            SVG_HEIGHT / 2,

            SVG_WIDTH / 2

        ],

        ZOOM_INICIAL

    );

    /*
    ====================================================
    GARANTE QUE O MAPA NÃO FIQUE DESALINHADO
    ====================================================
    */

    mapa.setMaxBounds(AREA_NAVEGACAO);

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
CARREGAR LOCAIS
====================================================
*/

async function carregarMarcadores() {

    try {

        const resposta = await fetch("data/locais.json");

        if (!resposta.ok) {

            throw new Error("Erro ao carregar locais.");

        }

        const locais = await resposta.json();

        criarMarcadores(locais);

    }

    catch (erro) {

        console.error(erro);

    }

}

/*
====================================================
CRIAR MARCADORES
====================================================
*/

function criarMarcadores(locais) {

    camadaMarcadores.clearLayers();

    locais.forEach(local => {

        /*
        Ignora locais sem coordenadas.
        */

        if (

            local.x == null ||

            local.y == null

        ) {

            return;

        }

        const marcador = L.marker(

            [

                local.y,

                local.x

            ],

            {

                icon: obterIcone(local.categoria)

            }

        );

        marcador.bindPopup(

            criarPopup(local),

            {

                maxWidth: 320,

                autoPan: true,

                closeButton: true

            }

        );

        marcador.addTo(camadaMarcadores);

    });

}

/*
====================================================
POPUP
====================================================
*/

function criarPopup(local) {

    return `

    <div class="popup-card">

        <img

            class="popup-capa"

            src="${local.capa}"

            alt="${local.nome}">

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
ÍCONES
====================================================
*/

/*
====================================================
ÍCONES
====================================================
*/

function obterIcone(categoria) {

    let arquivo = "marker-cinza.png";

    switch (categoria) {

        case "Igreja":  
        case "Histórico":
        case "Estação":
        case "Mirante":    
            arquivo = "marker-vermelho.png";
            break;      
       
        case "Natureza":
            arquivo = "marker-verde.png";
            break;

        case "Cafeteria":
            arquivo = "marker-marrom.png";
            break;

        case "Restaurante":
            arquivo = "marker-amarelo.png";
            break;
            
        case "esporte":
            arquivo = "marker-azul.png";
            break;

    }

    return L.icon({

        iconUrl: `icons/${arquivo}`,

        iconSize: [18, 30],

        iconAnchor: [19, 50],

        popupAnchor: [0, -45]

    });

}
/*
====================================================
MODO EDIÇÃO
Clique no mapa para descobrir X e Y
====================================================
*/

const MODO_EDICAO = true;

function habilitarModoEdicao() {

    if (!MODO_EDICAO) {

        return;

    }

    mapa.on("click", function(e) {

        const x = Math.round(e.latlng.lng);

        const y = Math.round(e.latlng.lat);

        console.clear();

        console.log("================================");

        console.log("COORDENADAS");

        console.log("X:", x);

        console.log("Y:", y);

        console.log("================================");

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

function centralizarMapa(x, y) {

    mapa.flyTo(

        [

            y,

            x

        ],

        Math.max(mapa.getZoom(), 2),

        {

            animate: true,

            duration: 1.2

        }

    );

}

/*
====================================================
DESTACAR LOCAL
====================================================
*/

function destacarLocal(local) {

    if (

        local.x == null ||

        local.y == null

    ) {

        return;

    }

    centralizarMapa(

        local.x,

        local.y

    );

}

/*
====================================================
REDIMENSIONAMENTO
====================================================
*/

window.addEventListener(

    "resize",

    function() {

        if (mapa) {

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

    async function() {

        inicializarMapa();

        await carregarMarcadores();

        habilitarModoEdicao();

    }

);
