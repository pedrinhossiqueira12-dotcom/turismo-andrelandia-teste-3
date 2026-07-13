/*
=========================================================
GUIA TURÍSTICO DE ANDRELÂNDIA
ARTISTAS
=========================================================
*/

let artistas = [];

const artistsContainer =
document.getElementById("artistsContainer");

/*
=========================================================
CARREGAR JSON
=========================================================
*/

async function carregarArtistas(){

    try{

        const resposta =
        await fetch("data/artistas.json");

        if(!resposta.ok){

            throw new Error(
                "Erro ao carregar artistas."
            );

        }

        artistas =
        await resposta.json();

        criarCardsArtistas(artistas);

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

function criarCardsArtistas(lista){

    if(!artistsContainer){

        return;

    }

    artistsContainer.innerHTML = "";

    lista.forEach(artista=>{

        const card =
        document.createElement("article");

        card.className = "card";

        card.innerHTML = `

            <img
            src="${artista.capa}"
            alt="${artista.nome}">

            <div class="card-content">

                <span class="card-category">

                    ${artista.categoria}

                </span>

                <h3>

                    ${artista.nome}

                </h3>

                <p>

                    ${artista.descricao}

                </p>

                <a
                class="card-button"
                href="${artista.instagram}"
                target="_blank">

                    Instagram

                </a>

            </div>

        `;

        artistsContainer.appendChild(card);

    });

}

/*
=========================================================
INICIALIZAÇÃO
=========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    carregarArtistas

);
