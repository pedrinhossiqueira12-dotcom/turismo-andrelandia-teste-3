/*
====================================================
MAPA TURÍSTICO
Versão SVG + CRS.Simple
====================================================
*/

const MAP_WIDTH = 10000;
const MAP_HEIGHT = 8000;

let mapa;
let marcadores;

const bounds = [
    [0, 0],
    [MAP_HEIGHT, MAP_WIDTH]
];

function inicializarMapa() {

    mapa = L.map("map", {

        crs: L.CRS.Simple,

        minZoom: -2,

        maxZoom: 3,

        zoomSnap: 0.25,

        zoomDelta: 0.25,

        maxBounds: bounds,

        maxBoundsViscosity: 1,

        zoomControl: true

    });

    L.imageOverlay(

        "img/mapa/mapa.svg",

        bounds

    ).addTo(mapa);

    mapa.fitBounds(bounds);

    marcadores = L.layerGroup().addTo(mapa);

}
/*
====================================================
CARREGAR PONTOS TURÍSTICOS
====================================================
*/

async function carregarLocais() {

    try {

        const resposta =
            await fetch("data/locais.json");

        if (!resposta.ok) {

            throw new Error(
                "Erro ao carregar locais."
            );

        }

        const locais =
            await resposta.json();

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

    marcadores.clearLayers();

    locais.forEach(local => {

        const marcador = L.marker(

            [
                local.y,
                local.x
            ]

        );

        marcador.bindPopup(

            `
            <div class="popup">

                <h3>${local.nome}</h3>

                <p>${local.descricao}</p>

                <a
                href="pages/local.html?id=${local.id}">

                    Conhecer

                </a>

            </div>
            `

        );

        marcador.addTo(marcadores);

    });

}
/*
====================================================
ÍCONES DOS MARCADORES
====================================================
*/

const icones = {

    "Igreja": criarIcone("icons/igreja.png"),

    "Mirante": criarIcone("icons/mirante.png"),

    "Histórico": criarIcone("icons/monumento.png"),

    "Natureza": criarIcone("icons/natureza.png"),

    "Estação": criarIcone("icons/estacao.png"),

    "Museu": criarIcone("icons/museu.png"),

    "Restaurante": criarIcone("icons/restaurante.png"),

    "default": criarIcone("icons/padrao.png")

};

function criarIcone(caminho){

    return L.icon({

        iconUrl: caminho,

        iconSize: [40,40],

        iconAnchor: [20,40],

        popupAnchor: [0,-35]

    });

}