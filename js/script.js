/*
=========================================================
GUIA TURÍSTICO DE ANDRELÂNDIA
script.js
Versão 3.0
=========================================================
*/

/*
=========================================================
VARIÁVEIS
=========================================================
*/

let locais = [];
let locaisFiltrados = [];

const cardsContainer =
document.getElementById("cardsContainer");

const commerceContainer =
document.getElementById("commerceCardsContainer");

const artistsContainer =
document.getElementById("artistsContainer");

const eventsContainer =
document.getElementById("eventsContainer");

const searchInput =
document.getElementById("searchInput");

/*
=========================================================
NORMALIZAR TEXTO
=========================================================
*/

function normalizarTexto(texto){

    return texto

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .toLowerCase()

        .trim();

}

/*
=========================================================
CRIAR LINK DO BOTÃO
=========================================================
*/

function obterLink(local){

    switch(local.tipo){

        case "comercio":

            return `pages/comercio.html?id=${local.id}`;

        case "artista":

            return local.instagram || "";

        case "evento":

            return local.instagram || "";

        default:

            return `pages/local.html?id=${local.id}`;

    }

}

/*
=========================================================
CARREGAR LOCAIS
=========================================================
*/

async function carregarLocais(){

    try{

        const resposta =
        await fetch("data/locais.json");

        if(!resposta.ok){

            throw new Error(
                "Erro ao carregar locais."
            );

        }

        locais =
        await resposta.json();

        locaisFiltrados =
        [...locais];

        renderizarCards(locaisFiltrados);

        if(

            typeof atualizarMarcadores ===
            "function"

        ){

            atualizarMarcadores(

                locaisFiltrados

            );

        }

    }

    catch(erro){

        console.error(erro);

        if(cardsContainer){

            cardsContainer.innerHTML =

            `
            <div class="erro">

                Não foi possível carregar os locais.

            </div>
            `;

        }

    }

    
}
/*
=========================================================
CRIAR CARD
=========================================================
*/

function criarCard(local){

    const card = document.createElement("article");

    card.className = "card";

    const link = obterLink(local);

    let botao = "";

    if(link){

        const novaAba =

            local.tipo === "artista" ||

            local.tipo === "evento";

        botao =

        `
        <a
            class="card-button"
            href="${link}"
            ${novaAba ? 'target="_blank" rel="noopener"' : ""}>

            Conhecer

        </a>
        `;

    }

    card.innerHTML =

    `
    <img
        src="${local.capa}"
        alt="${local.nome}"
        loading="lazy">

    <div class="card-content">

        <span class="card-category">

            ${local.categoria}

        </span>

        <h3>

            ${local.nome}

        </h3>

        <p>

            ${local.descricao}

        </p>

        ${botao}

    </div>
    `;

    return card;

}
/*
=========================================================
RENDERIZAR CARDS
=========================================================
*/

function renderizarCards(lista){

    if(!cardsContainer){

        return;

    }

    cardsContainer.innerHTML = "";

    if(lista.length === 0){

        cardsContainer.innerHTML =

        `
        <div class="erro">

            Nenhum resultado encontrado.

        </div>
        `;

        if(

            typeof atualizarMarcadores ===
            "function"

        ){

            atualizarMarcadores([]);

        }

        return;

    }

    lista.forEach(local=>{

        cardsContainer.appendChild(

            criarCard(local)

        );

    });

    if(

        typeof atualizarMarcadores ===
        "function"

    ){

        atualizarMarcadores(lista);

    }

}

/*
=========================================================
PESQUISAR LOCAIS
=========================================================
*/

function pesquisarLocais(texto){

    const termo = normalizarTexto(texto);

    if(termo === ""){

        locaisFiltrados = [...locais];

        renderizarCards(locaisFiltrados);

        return;

    }

    locaisFiltrados = locais.filter(local=>{

        return(

            normalizarTexto(local.nome)

                .includes(termo)

            ||

            normalizarTexto(local.categoria)

                .includes(termo)

            ||

            normalizarTexto(local.descricao)

                .includes(termo)

        );

    });

    renderizarCards(locaisFiltrados);

}
/*
=========================================================
CARREGAR LISTA
=========================================================
*/

async function carregarLista(arquivo, container){

    if(!container){

        return;

    }

    try{

        const resposta =

            await fetch(arquivo);

        if(!resposta.ok){

            container.innerHTML = "";

            return;

        }

        const lista =

            await resposta.json();

        container.innerHTML = "";

        lista.forEach(item=>{

            container.appendChild(

                criarCard(item)

            );

        });

    }

    catch(erro){

        console.error(erro);

    }

}

/*
=========================================================
CARREGAR COMÉRCIOS
=========================================================
*/

async function carregarComercios(){

    await carregarLista(

        "data/comercios.json",

        commerceContainer

    );

}

/*
=========================================================
CARREGAR ARTISTAS
=========================================================
*/

async function carregarArtistas(){

    await carregarLista(

        "data/artistas.json",

        artistsContainer

    );

}

/*
=========================================================
CARREGAR EVENTOS
=========================================================
*/

async function carregarEventos(){

    await carregarLista(

        "data/eventos.json",

        eventsContainer

    );

}
/*
=========================================================
NAVBAR INTELIGENTE
=========================================================
*/

const navbar = document.querySelector(".navbar");

let ultimoScroll = 0;

window.addEventListener(

    "scroll",

    ()=>{

        if(!navbar){

            return;

        }

        const scrollAtual = window.pageYOffset;

        /*
        Sempre visível no topo
        */

        if(scrollAtual <= 20){

            navbar.classList.remove("oculta");

            ultimoScroll = scrollAtual;

            return;

        }

        /*
        Esconde ao descer
        */

        if(

            scrollAtual > ultimoScroll

            &&

            scrollAtual > 120

        ){

            navbar.classList.add("oculta");

        }

        /*
        Mostra ao subir
        */

        else{

            navbar.classList.remove("oculta");

        }

        ultimoScroll = scrollAtual;

    }

);
/*
=========================================================
MENU HAMBÚRGUER
=========================================================
*/

const menuToggle =

    document.getElementById("menuToggle");

const menu =

    document.getElementById("menu");

if(menuToggle && menu){

    menuToggle.addEventListener(

        "click",

        ()=>{

            menu.classList.toggle("ativo");

            menuToggle.textContent =

                menu.classList.contains("ativo")

                ? "✕"

                : "☰";

        }

    );

    document.querySelectorAll(

        ".menu a"

    ).forEach(link=>{

        link.addEventListener(

            "click",

            ()=>{

                menu.classList.remove("ativo");

                menuToggle.textContent = "☰";

            }

        );

    });

}
/*
=========================================================
INICIALIZAÇÃO
=========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    async ()=>{

        await carregarLocais();

        await carregarComercios();

        await carregarArtistas();

        await carregarEventos();

    }

);
