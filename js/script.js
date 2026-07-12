/*
=========================================================
GUIA TURÍSTICO DE ANDRELÂNDIA
script.js
=========================================================
*/

let locais = [];
let comercios = [];
let artistas = [];
let eventos = [];

const cardsContainer =
document.getElementById("cardsContainer");

const commerceCardsContainer =
document.getElementById("commerceCardsContainer");

const artistsContainer =
document.getElementById("artistsContainer");

const eventsContainer =
document.getElementById("eventsContainer");

const searchInput =
document.getElementById("searchInput");
/*
=========================================================
CARREGAR JSON
=========================================================
*/
function normalizarTexto(texto){

    return (texto || "")

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .toLowerCase()

        .trim();

}
async function carregarDados(){

    try{

        const [

            respostaLocais,

            respostaComercios,

            respostaArtistas,

            respostaEventos

        ] = await Promise.all([

            fetch("data/locais.json"),

            fetch("data/comercios.json"),

            fetch("data/artistas.json"),

            fetch("data/eventos.json")

        ]);

        if(

            !respostaLocais.ok ||

            !respostaComercios.ok ||

            !respostaArtistas.ok ||

            !respostaEventos.ok

        ){

            throw new Error("Erro ao carregar os dados.");

        }

        locais = await respostaLocais.json();

        comercios = await respostaComercios.json();

        artistas = await respostaArtistas.json();

        eventos = await respostaEventos.json();

        criarCards(locais);

        criarComercios(comercios);

        criarArtistas(artistas);

        criarEventos(eventos);

    }

    catch(erro){

        console.error(erro);

        cardsContainer.innerHTML =

        `
        <div class="erro">

            Não foi possível carregar os dados.

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
function criarComercios(lista){

    if(!commerceCardsContainer) return;

    commerceCardsContainer.innerHTML="";

    lista.forEach(comercio=>{

        const card=document.createElement("article");

        card.className="card";

        card.innerHTML=`

            <img src="${comercio.capa}" alt="${comercio.nome}" loading="lazy">

            <div class="card-content">

                <span class="card-category">

                    ${comercio.categoria}

                </span>

                <h3>${comercio.nome}</h3>

                <p>${comercio.descricao}</p>

                <a

                    class="card-button"

                    href="${comercio.link}">

                    Conhecer

                </a>

            </div>

        `;

        commerceCardsContainer.appendChild(card);

    });

}
function criarArtistas(lista){

    if(!artistsContainer) return;

    artistsContainer.innerHTML="";

    lista.forEach(artista=>{

        const card=document.createElement("article");

        card.className="card";

        card.innerHTML=`

            <img src="${artista.imagem}" alt="${artista.nome}" loading="lazy">

            <div class="card-content">

                <span class="card-category">

                    ${artista.categoria}

                </span>

                <h3>${artista.nome}</h3>

                <p>${artista.descricao}</p>

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
function criarEventos(lista){

    if(!eventsContainer) return;

    eventsContainer.innerHTML="";

    lista.forEach(evento=>{

        const card=document.createElement("article");

        card.className="card";

        card.innerHTML=`

            <img src="${evento.imagem}" alt="${evento.nome}" loading="lazy">

            <div class="card-content">

                <span class="card-category">

                    Evento

                </span>

                <h3>${evento.nome}</h3>

                <p>${evento.descricao}</p>

            </div>

        `;

        eventsContainer.appendChild(card);

    });

}
/*
=========================================================
PESQUISA EM TEMPO REAL
=========================================================
*/

function pesquisarLocais(texto){

    const termo = normalizarTexto(texto);

const resultado = locais.filter(local=>{

    return [

        local.nome,

        local.categoria,

        local.descricao,

        local.historia,

        local.curiosidades,

        local.destaque,

        local.endereco

    ]

    .some(campo=>

        normalizarTexto(campo)

        .includes(termo)

    );

});

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

        carregarDados();

    }

);
