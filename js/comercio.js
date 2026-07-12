/*
=========================================================
GUIA TURÍSTICO DE ANDRELÂNDIA
comercio.js
=========================================================
*/

let mapaLocal;
let comercioAtual = null;

/*
=========================================================
OBTER PARÂMETRO DA URL
=========================================================
*/

function obterParametro(nome){

    const parametros =
    new URLSearchParams(window.location.search);

    return parametros.get(nome);

}

/*
=========================================================
CARREGAR DADOS
=========================================================
*/

async function carregarComercio(){

    try{

        const resposta =
        await fetch("../data/comercios.json");

        if(!resposta.ok){

            throw new Error(
                "Erro ao carregar os dados."
            );

        }

        const comercios =
        await resposta.json();

        const id =
        obterParametro("id");

        comercioAtual =
        comercios.find(

            comercio => comercio.id === id

        );

        if(!comercioAtual){

            document.querySelector("main").innerHTML =

            `
            <section class="bloco">

                <h2>

                    Comércio não encontrado

                </h2>

                <p>

                    Este comércio não existe.

                </p>

            </section>
            `;

            return;

        }

        preencherPagina();

        criarGaleria(comercioAtual.galeria);

        inicializarMapa();

    }

    catch(erro){

        console.error(erro);

    }

}

/*
=========================================================
PREENCHER PÁGINA
=========================================================
*/

function preencherPagina(){

    document.title =
    comercioAtual.nome +
    " - Guia de Andrelândia";

    document.getElementById("capa").src =
    "../" + comercioAtual.capa;

    document.getElementById("capa").alt =
    comercioAtual.nome;

    document.getElementById("nome").textContent =
    comercioAtual.nome;

    document.getElementById("categoria").textContent =
    comercioAtual.categoria;

    document.getElementById("descricao").textContent =
    comercioAtual.descricao;

    document.getElementById("sobre").textContent =
    comercioAtual.sobre;

    document.getElementById("horario").textContent =
    comercioAtual.horario;

    document.getElementById("telefone").textContent =
    comercioAtual.telefone;

    document.getElementById("endereco").textContent =
    comercioAtual.endereco;

}

/*
=========================================================
MAPA
=========================================================
*/

function inicializarMapa(){

    mapaLocal = L.map("map").setView(

        [

            comercioAtual.latitude,

            comercioAtual.longitude

        ],

        16

    );

    L.tileLayer(

        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",

        {

            attribution:"&copy; Esri"

        }

    ).addTo(mapaLocal);

    L.marker(

        [

            comercioAtual.latitude,

            comercioAtual.longitude

        ]

    )

    .addTo(mapaLocal)

    .bindPopup(

        `<strong>${comercioAtual.nome}</strong>`

    )

    .openPopup();

}

/*
=========================================================
BOTÕES
=========================================================
*/

function configurarBotoes(){

    const btnComoChegar =
    document.getElementById("btnComoChegar");

    if(btnComoChegar){

        btnComoChegar.href =

        `https://www.google.com/maps/search/?api=1&query=${comercioAtual.latitude},${comercioAtual.longitude}`;

    }

    const btnVerMapa =
    document.getElementById("btnVerMapa");

    if(btnVerMapa){

        btnVerMapa.href =
        "../index.html#comercios";

    }

    const btnInstagram =
    document.getElementById("btnInstagram");

    if(btnInstagram){

        if(comercioAtual.instagram){

            btnInstagram.href =
            comercioAtual.instagram;

        }

        else{

            btnInstagram.style.display =
            "none";

        }

    }

    const btnSite =
    document.getElementById("btnSite");

    if(btnSite){

        if(comercioAtual.site){

            btnSite.href =
            comercioAtual.site;

        }

        else{

            btnSite.style.display =
            "none";

        }

    }

    const btnVoltar =
    document.getElementById("btnVoltar");

    if(btnVoltar){

        btnVoltar.addEventListener(

            "click",

            ()=>{

                if(window.history.length>1){

                    window.history.back();

                }

                else{

                    window.location.href =
                    "../index.html";

                }

            }

        );

    }

}

/*
=========================================================
INICIALIZAÇÃO
=========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    async ()=>{

        await carregarComercio();

        if(comercioAtual){

            configurarBotoes();

        }

    }

);
