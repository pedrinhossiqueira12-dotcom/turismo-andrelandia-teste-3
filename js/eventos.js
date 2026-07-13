/*
=========================================================
GUIA TURÍSTICO DE ANDRELÂNDIA
EVENTOS
=========================================================
*/

let eventos = [];

const eventsContainer =
document.getElementById("eventsContainer");

/*
=========================================================
CARREGAR JSON
=========================================================
*/

async function carregarEventos(){

    try{

        const resposta =
        await fetch("data/eventos.json");

        if(!resposta.ok){

            throw new Error(
                "Erro ao carregar eventos."
            );

        }

        eventos =
        await resposta.json();

        criarCardsEventos(eventos);

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

function criarCardsEventos(lista){

    if(!eventsContainer){

        return;

    }

    eventsContainer.innerHTML = "";

    lista.forEach(evento=>{

        const card =
        document.createElement("article");

        card.className = "card";

        card.innerHTML = `

            <img
            src="${evento.capa}"
            alt="${evento.nome}">

            <div class="card-content">

                <span class="card-category">

                    ${evento.categoria}

                </span>

                <h3>

                    ${evento.nome}

                </h3>

                <p>

                    ${evento.descricao}

                </p>

                <p>

                    <strong>Data:</strong> ${evento.data}

                </p>

            </div>

        `;

        eventsContainer.appendChild(card);

    });

}

/*
=========================================================
INICIALIZAÇÃO
=========================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    carregarEventos

);
