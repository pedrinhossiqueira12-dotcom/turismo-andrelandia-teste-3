/*
====================================================
GUIA TURÍSTICO DE ANDRELÂNDIA
MAPA SVG
Versão 2.0
====================================================
*/

const SVG_WIDTH = 84666.66;
const SVG_HEIGHT = 67733.32;

const bounds = [

    [0, 0],

    [SVG_HEIGHT, SVG_WIDTH]

];

let mapa;

let camadaMarcadores;

/*
====================================================
INICIALIZAR MAPA
====================================================
*/

function inicializarMapa(){

    mapa = L.map("map",{

        crs: L.CRS.Simple,

        attributionControl:false,

        zoomControl:true,

        minZoom:-3,

        maxZoom:2,

        zoomSnap:0.25,

        zoomDelta:0.25,

        maxBounds:bounds,

        maxBoundsViscosity:1.0

    });

    L.imageOverlay(

        "img/mapa/mapa.svg",

        bounds

    ).addTo(mapa);

    mapa.fitBounds(bounds);

    camadaMarcadores = L.layerGroup();

    camadaMarcadores.addTo(mapa);

}
/*
====================================================
CARREGAR LOCAIS
====================================================
*/

async function carregarLocais() {

    try {

        const resposta = await fetch("data/locais.json");

        if (!resposta.ok) {

            throw new Error("Não foi possível carregar os locais.");

        }

        const locais = await resposta.json();

        criarMarcadores(locais);

    }

    catch (erro) {

        console.error("Erro:", erro);

    }

}

/*
====================================================
CRIAR MARCADORES
====================================================
*/

function criarMarcadores(locais){

    camadaMarcadores.clearLayers();

    locais.forEach(local => {

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

                maxWidth:320

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

function criarPopup(local){

    return `

        <div class="popup-card">

            <img
                src="${local.capa}"
                alt="${local.nome}"
                class="popup-capa">

            <h3>${local.nome}</h3>

            <p>${local.descricao}</p>

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

        console.log("--------------------------------");
        console.log("Coordenadas do mapa");
        console.log("X:", x);
        console.log("Y:", y);
        console.log("--------------------------------");

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
CENTRALIZAR NO LOCAL
====================================================
*/

function centralizarMapa(x, y) {

    mapa.flyTo(

        [

            y,

            x

        ],

        0,

        {

            animate: true,

            duration: 1.5

        }

    );

}
/*
====================================================
DESTACAR LOCAL
====================================================
*/

function destacarLocal(local){

    centralizarMapa(

        local.x,

        local.y

    );

}
document.addEventListener(

    "DOMContentLoaded",

    () => {

        inicializarMapa();

        carregarLocais();

        habilitarModoEdicao();

    }

);
/*
====================================================
CRIAR ÍCONE
====================================================
*/

function obterIcone(categoria){

    let arquivo = "padrao.png";

    switch(categoria){

        case "Igreja":
            arquivo = "igreja.png";
            break;

        case "Mirante":
            arquivo = "mirante.png";
            break;

        case "Natureza":
            arquivo = "natureza.png";
            break;

        case "Histórico":
            arquivo = "historico.png";
            break;

        case "Estação":
            arquivo = "estacao.png";
            break;

    }

    return L.icon({

        iconUrl:`icons/${arquivo}`,

        iconSize:[42,42],

        iconAnchor:[21,42],

        popupAnchor:[0,-36]

    });

}
