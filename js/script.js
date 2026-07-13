/*
=========================================================
GUIA TURÍSTICO DE ANDRELÂNDIA
script.js
Versão 2.0
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
Remove acentos e converte para minúsculas.
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

        /*
        Atualiza o mapa caso ele já tenha sido criado.
        */

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

        cardsContainer.innerHTML =

        `
        <div class="erro">

            Não foi possível carregar os locais.

        </div>
        `;

    }

}

/*
=========================================================
CRIAR CARD
=========================================================
*/

function criarCard(local){
function criarCard(local){

    let link = `pages/local.html?id=${local.id}`;

    if(local.tipo === "comercio"){

        link = `pages/comercio.html?id=${local.id}`;

    }

    else if(local.tipo === "artista"){

        link = local.instagram;

    }

    else if(local.tipo ==="evento"){

        link = `pages/evento.html?id=${local.id}`;

    }

    const card =
    document.createElement("article");

    card.className =
    "card";

    card.innerHTML = `
    
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

        <a
    class="card-button"
    href="${link}"
    ${local.tipo === "artista" ? 'target="_blank" rel="noopener"' : ""}>

    Conhecer
    
    </a>

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
PESQUISA
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

        const nome =
        normalizarTexto(local.nome);

        const categoria =
        normalizarTexto(local.categoria);

        const descricao =
        normalizarTexto(local.descricao);

        return(

            nome.includes(termo)

            ||

            categoria.includes(termo)

            ||

            descricao.includes(termo)

        );

    });

    renderizarCards(locaisFiltrados);

}

/*
=========================================================
CARREGAR COMÉRCIOS
=========================================================
*/

async function carregarComercios(){

    if(!commerceContainer){

        return;

    }

    try{

        const resposta =
        await fetch("data/comercios.json");

        if(!resposta.ok){

            return;

        }

        const comercios =
        await resposta.json();

        commerceContainer.innerHTML = "";

        comercios.forEach(comercio=>{

            commerceContainer.appendChild(

                criarCard(comercio)

            );

        });

    }

    catch(erro){

        console.error(erro);

    }

}

/*
=========================================================
CARREGAR ARTISTAS
=========================================================
*/

async function carregarArtistas(){

    if(!artistsContainer){

        return;

    }

    try{

        const resposta =
        await fetch("data/artistas.json");

        if(!resposta.ok){

            return;

        }

        const artistas =
        await resposta.json();

        artistsContainer.innerHTML = "";

        artistas.forEach(artista=>{

            artistsContainer.appendChild(

                criarCard(artista)

            );

        });

    }

    catch(erro){

        console.error(erro);

    }

}

/*
=========================================================
CARREGAR EVENTOS
=========================================================
*/

async function carregarEventos(){

    if(!eventsContainer){

        return;

    }

    try{

        const resposta =
        await fetch("data/eventos.json");

        if(!resposta.ok){

            return;

        }

        const eventos =
        await resposta.json();

        eventsContainer.innerHTML = "";

        eventos.forEach(evento=>{

            eventsContainer.appendChild(

                criarCard(evento)

            );

        });

    }

    catch(erro){

        console.error(erro);

    }

}

/*
=========================================================
EVENTOS
=========================================================
*/

if(searchInput){

    searchInput.addEventListener(

        "input",

        function(evento){

            pesquisarLocais(

                evento.target.value

            );

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

    async function(){

        await carregarLocais();

        await carregarComercios();

        await carregarArtistas();

        await carregarEventos();

    }

);
