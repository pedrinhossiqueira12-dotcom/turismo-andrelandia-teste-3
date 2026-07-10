/*
=========================================================
GUIA TURÍSTICO DE ANDRELÂNDIA
gallery.js
=========================================================
*/

let lightbox = null;
let lightboxImagem = null;

/*
=========================================================
CRIAR LIGHTBOX
=========================================================
*/

function criarLightbox() {

    if (document.getElementById("lightbox")) {
        return;
    }

    lightbox = document.createElement("div");
    lightbox.id = "lightbox";

    lightbox.innerHTML = `
        <div class="lightbox-overlay">
            <img id="lightboxImagem" alt="Imagem ampliada">
        </div>
    `;

    document.body.appendChild(lightbox);

    lightboxImagem =
        document.getElementById("lightboxImagem");

    lightbox.addEventListener("click", () => {

        lightbox.style.display = "none";

    });

}

/*
=========================================================
CRIAR GALERIA
=========================================================
*/

function criarGaleria(imagens) {

    const galeria =
        document.getElementById("galeria");

    if (!galeria) return;

    galeria.innerHTML = "";

    criarLightbox();

    imagens.forEach((imagem) => {

        const img =
            document.createElement("img");

        img.src = "../" + imagem;

        img.alt = "Foto do ponto turístico";

        img.loading = "lazy";

        img.addEventListener("click", () => {

            lightboxImagem.src = img.src;

            lightbox.style.display = "flex";

        });

        galeria.appendChild(img);

    });

}