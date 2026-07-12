/*
=========================================================
GUIA TURÍSTICO DE ANDRELÂNDIA
local.js
=========================================================
*/

let mapaLocal;
let localAtual = null;

/*
=========================================================
OBTER PARÂMETRO DA URL
=========================================================
*/

function obterParametro(nome) {

    const parametros = new URLSearchParams(window.location.search);

    return parametros.get(nome);

}

/*
=========================================================
CARREGAR DADOS DO LOCAL
=========================================================
*/

async function carregarLocal() {

    try {

        const resposta = await fetch("../data/locais.json");

        if (!resposta.ok) {

            throw new Error("Erro ao carregar os dados.");

        }

        const locais = await resposta.json();

        const id = obterParametro("id");

        localAtual = locais.find(local => local.id === id);

        if (!localAtual) {

            document.querySelector("main").innerHTML = `
                <section class="bloco">
                    <h2>Local não encontrado</h2>
                    <p>O ponto turístico solicitado não existe.</p>
                </section>
            `;

            return;

        }

        preencherPagina();

        criarGaleria(localAtual.galeria);

        inicializarMapa();

    }

    catch (erro) {

        console.error(erro);

    }

}

/*
=========================================================
PREENCHER A PÁGINA
=========================================================
*/

function preencherPagina() {

    document.title =
        localAtual.nome + " - Guia Turístico";

    document.getElementById("capa").src =
        "../" + localAtual.capa;

    document.getElementById("capa").alt =
        localAtual.nome;

    document.getElementById("nome").textContent =
        localAtual.nome;

    document.getElementById("categoria").textContent =
        localAtual.categoria;

    document.getElementById("descricao").textContent =
        localAtual.descricao;

    document.getElementById("historia").textContent =
        localAtual.historia;

    document.getElementById("curiosidades").textContent =
        localAtual.curiosidades;

    document.getElementById("endereco").textContent =
        localAtual.endereco;
/*
==============================================
NOVOS CAMPOS
==============================================
*/

preencherCampo(
    "horario",
    localAtual.horario
);

preencherCampo(
    "entrada",
    localAtual.entrada
);

preencherCampo(
    "telefone",
    localAtual.telefone,
    "telefoneCard"
);

preencherCampo(
    "site",
    localAtual.site,
    "siteCard"
);

preencherCampo(
    "instagram",
    localAtual.instagram,
    "instagramCard"
);
}
/*
=========================================================
PREENCHER CAMPO
=========================================================
*/

function preencherCampo(
    idCampo,
    valor,
    idCard = null
){

    const campo =
        document.getElementById(idCampo);

    if(!campo){

        return;

    }

    if(
        valor &&
        valor.trim() !== ""
    ){

        campo.textContent = valor;

    }

    else{

        if(idCard){

            document
                .getElementById(idCard)
                .style.display = "none";

        }

        else{

            campo
                .parentElement
                .style.display = "none";

        }

    }

}
/*
=========================================================
MAPA INDIVIDUAL
=========================================================
*/

function inicializarMapa() {

    mapaLocal = L.map("map").setView(
        [
            localAtual.latitude,
            localAtual.longitude
        ],
        16
    );

L.tileLayer(

    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",

    {
        attribution: "&copy; Esri"
    }

).addTo(mapaLocal);

    L.marker(
        [
            localAtual.latitude,
            localAtual.longitude
        ]
    )
    .addTo(mapaLocal)
    .bindPopup(
        `<strong>${localAtual.nome}</strong>`
    )
    .openPopup();

}

/*
=========================================================
BOTÕES
=========================================================
*/

function configurarBotoes() {
    const btnVerMapa =
    document.getElementById("btnVerMapa");
    
    if(btnVerMapa){

    btnVerMapa.href =
        `../index.html#${localAtual.id}`;

}
    const btnComoChegar =
        document.getElementById("btnComoChegar");

    btnComoChegar.href =
        `https://www.google.com/maps/search/?api=1&query=${localAtual.latitude},${localAtual.longitude}`;
    /*
==============================================
SITE
==============================================
*/

const btnSite =
document.getElementById("btnSite");

if(localAtual.site){

    btnSite.href =
        localAtual.site;

}

else{

    btnSite.style.display =
        "none";

}

/*
==============================================
INSTAGRAM
==============================================
*/

const btnInstagram =
document.getElementById("btnInstagram");

if(localAtual.instagram){

    btnInstagram.href =
        localAtual.instagram;

}

else{

    btnInstagram.style.display =
        "none";

}

    document
        .getElementById("btnVoltar")
        .addEventListener(
            "click",
            () => {

                if (window.history.length > 1) {

                    window.history.back();

                } else {

                    window.location.href =
                        "../index.html";

                }

            }
        );

}

/*
=========================================================
INICIALIZAÇÃO
=========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarLocal()
            .then(() => {

                if (localAtual) {

                    configurarBotoes();

                }

            });

    }
);
