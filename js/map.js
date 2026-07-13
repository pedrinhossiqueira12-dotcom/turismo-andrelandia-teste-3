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

/*
Todos os marcadores carregados
*/

let todosMarcadores = [];

/*
Camadas por categoria
*/

const camadas = {};

/*
Lista completa de locais e comércios
*/

let todosLocais = [];
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

}
/*
====================================================
CARREGAR LOCAIS
====================================================
*/

async function carregarMarcadores() {

    try {

        const [

            respostaLocais,

            respostaComercios

        ] = await Promise.all([

            fetch("data/locais.json"),

            fetch("data/comercios.json")

        ]);

        if (

            !respostaLocais.ok ||

            !respostaComercios.ok

        ) {

            throw new Error(

                "Erro ao carregar os arquivos JSON."

            );

        }

        const locais =

            await respostaLocais.json();

        const comercios =

            await respostaComercios.json();

        /*
        Junta tudo em um único vetor
        */

        todosLocais = [

            ...locais,

            ...comercios

        ];

        criarMarcadores(todosLocais);

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

    /*
    Limpa todas as camadas antigas
    */

    Object.values(camadas).forEach(camada => {

        mapa.removeLayer(camada);

    });

    todosMarcadores = [];

    /*
    Cria os marcadores
    */

    locais.forEach(local => {

        /*
        Ignora registros sem coordenadas
        */

        if (

            local.x == null ||

            local.y == null ||

            local.x === 0 ||

            local.y === 0

        ) {

            return;

        }

        /*
        Cria a camada da categoria caso não exista
        */

        if (!camadas[local.categoria]) {

            camadas[local.categoria] = L.layerGroup();

        }

        /*
        Marcador
        */

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

        marcador.addTo(

            camadas[local.categoria]

        );

        todosMarcadores.push(marcador);

    });

    /*
    Adiciona todas as categorias ao mapa
    */

    Object.values(camadas).forEach(camada => {

        camada.addTo(mapa);

    });

}
/*
====================================================
POPUP
====================================================
*/

function criarPopup(local) {

    const pagina =

        local.tipo === "comercio"

        ? "comercio.html"

        : "local.html";

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

            href="pages/${pagina}?id=${local.id}">

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

function obterIcone(categoria) {

    let arquivo = "marker-cinza.png";

    switch (categoria) {

       
        case "Histórico":
        case "Estação":
            arquivo = "casarao.png";
            break;

       case "Igreja":  
            arquivo = "igreja.png";
            break;
        
        case "Igreja ":  
            arquivo = "igreja2.png";
            break;
            
       
        case "Natureza":
            arquivo = "cachoeira.png";
            break;

        case "Mirante":
            arquivo = "cristo.png";
            break;

        case "Cafeteria":
            arquivo = "cafe.png";
            break;

        case "Restaurante":
            arquivo = "lanche.png";
            break;

        case "Pedra":
            arquivo = "Pedra.png";
            break;
            
        case "esporte":
            arquivo = "esporte.png";
            break;



    }

    return L.icon({

        iconUrl: `icons/${arquivo}`,

        iconSize: [60, 60],

        iconAnchor: [19, 50],

        popupAnchor: [0, -45]

    });

}
/*
====================================================
FILTROS
====================================================
*/

function inicializarFiltros() {

    const filtros =

        document.querySelectorAll(

            ".map-filter"

        );

    filtros.forEach(filtro => {

        filtro.addEventListener(

            "change",

            function() {

                const categoria =

                    this.value;

                if (

                    !camadas[categoria]

                ) {

                    return;

                }

                if (

                    this.checked

                ) {

                    mapa.addLayer(

                        camadas[categoria]

                    );

                }

                else {

                    mapa.removeLayer(

                        camadas[categoria]

                    );

                }

            }

        );

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

        inicializarFiltros();

        habilitarModoEdicao();

    }

);
