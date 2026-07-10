/*
=========================================================
GUIA TURÍSTICO DE ANDRELÂNDIA
script.js
=========================================================
*/

let locais = [];

const cardsContainer =
document.getElementById("cardsContainer");

const searchInput =
document.getElementById("searchInput");

/*
=========================================================
CARREGAR JSON
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

        criarCards(locais);

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
CRIAR CARDS
=========================================================
*/

function criarCards(lista){

    cardsContainer.innerHTML = "";

    if(lista.length === 0){

        cardsContainer.innerHTML =

        `
        <div class="erro">

            Nenhum local encontrado.

        </div>
        `;

        return;

    }

    lista.forEach(local=>{

        const card =
        document.createElement("article");

        card.className =
        "card";

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

            <a
                class="card-button"
                href="pages/local.html?id=${local.id}">

                Conhecer

            </a>

        </div>
        `;

        cardsContainer.appendChild(card);

    });

}

/*
=========================================================
PESQUISA EM TEMPO REAL
=========================================================
*/

function pesquisarLocais(texto){

    const termo = texto
        .toLowerCase()
        .trim();

    const resultado = locais.filter(local =>

        local.nome
            .toLowerCase()
            .includes(termo)

        ||

        local.categoria
            .toLowerCase()
            .includes(termo)

        ||

        local.descricao
            .toLowerCase()
            .includes(termo)

    );

    criarCards(resultado);

}

/*
=========================================================
EVENTO DO CAMPO DE PESQUISA
=========================================================
*/

if(searchInput){

    searchInput.addEventListener(

        "input",

        (evento)=>{

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

    ()=>{

        carregarLocais();

    }

);
