/*
=========================================================
GUIA TURÍSTICO DE ANDRELÂNDIA
COMÉRCIOS
=========================================================
*/

let comercios = [];

const commerceContainer =
document.getElementById("commerceCardsContainer");

/*
=========================================================
CARREGAR JSON
=========================================================
*/

async function carregarComercios(){

    try{

        const resposta =
        await fetch("data/comercios.json");

        if(!resposta.ok){

            throw new Error(
                "Erro ao carregar comércios."
            );

        }

        comercios =
        await resposta.json();

        criarCardsComercios(comercios);

    }

    catch(erro){

        console.error(erro);

    }

}

/*
=========================================================
CRIAR CARDS
=========================================================
*/

function criarCardsComercios(lista){

    if(!commerceContainer){

        return;

    }

    commerceContainer.innerHTML = "";

    lista.forEach(comercio=>{

        const card =
        document.createElement("article");

        card.className = "card";

        card.innerHTML = `

            <img
            src="${comercio.capa}"
            alt="${comercio.nome}">

            <div class="card-content">

                <span class="card-category">

                    ${comercio.categoria}

                </span>

                <h3>

                    ${comercio.nome}

                </h3>

                <p>

                    ${comercio.descricao}

                </p>

                <a
                class="card-button"
                href="${comercio.instagram}"
                target="_blank">

                    Conhecer

                </a>

            </div>

        `;

        commerceContainer.appendChild(card);

    });

}

/*
=========================================================
INICIALIZAÇÃO
=========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    carregarComercios

);
