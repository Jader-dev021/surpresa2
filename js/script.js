/* =========================
   ELEMENTOS
========================= */

const intro =
    document.getElementById("intro");

const startBtn =
    document.getElementById("startBtn");

const music =
    document.getElementById("music");

const musicControl =
    document.getElementById("musicControl");

const finalSection =
    document.getElementById("final");

const question =
    document.getElementById("question");

const relationship =
    document.getElementById("relationship");

const yesBtn =
    document.getElementById("yesBtn");

const noBtn =
    document.getElementById("noBtn");

const noMessage =
    document.getElementById("noMessage");


let musicPlaying = false;
let finalReached = false;
let noAttempts = 0;


/* =========================
   COMEÇAR
========================= */

startBtn.addEventListener(
    "click",
    () => {

        intro.classList.add("hidden");

        music.volume = 0.18;

        music
            .play()
            .then(() => {

                musicPlaying = true;

                musicControl.textContent = "Ⅱ";

            })
            .catch(() => {});

        createPetals(10);

    }
);


/* =========================
   MÚSICA
========================= */

musicControl.addEventListener(
    "click",
    () => {

        if (musicPlaying) {

            music.pause();

            musicPlaying = false;

            musicControl.textContent = "♪";

        } else {

            music.play();

            musicPlaying = true;

            musicControl.textContent = "Ⅱ";

        }

    }
);


/* =========================
   REVEAL
========================= */

const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    } else {
                        entry.target.classList.remove("visible");
                    }

                }
            );

        },

        {
            threshold: 0.15
        }

    );


document
    .querySelectorAll(".reveal")
    .forEach(
        element => {

            observer.observe(element);

        }
    );


/* =========================
   PÉTALAS
========================= */

function createPetal() {

    const petal =
        document.createElement("div");

    petal.className = "petal";

    petal.style.left =
        Math.random() * 100 + "vw";

    petal.style.animationDuration =
        5 + Math.random() * 5 + "s";

    document.body.appendChild(petal);

    setTimeout(
        () => petal.remove(),
        10000
    );

}


function createPetals(amount) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        setTimeout(
            createPetal,
            i * 200
        );

    }

}


/* =========================
   GALERIA
========================= */

const proofGallery =
    document.getElementById("proofGallery");

const openProofGallery =
    document.getElementById("openProofGallery");

const closeProofGallery =
    document.getElementById("closeProofGallery");

const galleryPhoto =
    document.getElementById("galleryPhoto");

const galleryCaption =
    document.getElementById("galleryCaption");

const galleryCurrent =
    document.getElementById("galleryCurrent");

const galleryTotal =
    document.getElementById("galleryTotal");

const galleryEnding =
    document.getElementById("galleryEnding");


const proofPhotos = [

    "assets/prova-01.jpeg",
    "assets/prova-02.jpeg",
    "assets/prova-03.jpeg",
    "assets/prova-04.jpeg",
    "assets/prova-05.jpeg",
    "assets/prova-06.jpeg",
    "assets/prova-07.jpeg",
    "assets/prova-08.jpeg",
    "assets/prova-09.jpeg",
    "assets/prova-10.jpeg",
    "assets/prova-11.jpeg",
    "assets/prova-12.jpeg",
    "assets/prova-13.jpeg",
    "assets/prova-14.jpeg",
    "assets/prova-15.jpeg"

];


const proofCaptions = [

    "Você provavelmente nem lembra disso, mas eu lembro.",

    "Talvez tenha parecido uma coisa pequena pra você. Pra mim não foi.",

    "Foi um daqueles momentos que me fizeram perceber o quanto você se importa.",

    "Você fez isso sem pensar muito. Eu guardei.",

    "Mais uma coisa que talvez você nem tenha percebido que significou tanto pra mim.",

    "Eu lembro do jeito que você falou comigo naquele dia.",

    "Pode parecer simples, mas foi importante pra mim.",

    "Foi assim que você me mostrou carinho sem precisar dizer muita coisa.",

    "Você talvez nem tenha percebido, mas eu percebi.",

    "Mais uma prova de que você demonstra muito mais do que acha.",

    "Esses pequenos momentos ficaram comigo.",

    "Você não precisa fazer algo enorme pra me fazer sentir amado.",

    "Às vezes é justamente nas pequenas coisas que eu mais percebo você.",

    "Eu poderia continuar colocando exemplos aqui por muito tempo. 😂",

    "E é por isso que eu queria que você soubesse disso."

];


let galleryIndex = 0;

galleryTotal.textContent =
    proofPhotos.length;


function showGalleryPhoto() {

    galleryPhoto.style.opacity = 0;

    setTimeout(
        () => {

            galleryPhoto.src =
                proofPhotos[galleryIndex];

            galleryCaption.textContent =
                proofCaptions[galleryIndex];

            galleryCurrent.textContent =
                galleryIndex + 1;

            galleryPhoto.style.opacity = 1;

        },
        180
    );

}


openProofGallery.addEventListener(
    "click",
    () => {

        galleryIndex = 0;

        showGalleryPhoto();

        proofGallery
            .classList
            .add("active");

        document.body.style.overflow =
            "hidden";

    }
);


function closeGallery() {

    proofGallery
        .classList
        .remove("active");

    document.body.style.overflow = "";

}


closeProofGallery.addEventListener(
    "click",
    closeGallery
);


/* =========================
   SWIPE
========================= */

let touchStartX = 0;
let touchEndX = 0;


proofGallery.addEventListener(
    "touchstart",
    event => {

        touchStartX =
            event.changedTouches[0].screenX;

    }
);


proofGallery.addEventListener(
    "touchend",
    event => {

        touchEndX =
            event.changedTouches[0].screenX;

        handleSwipe();

    }
);


function handleSwipe() {

    const distance =
        touchEndX - touchStartX;

    if (
        Math.abs(distance) < 50
    ) {
        return;
    }

    if (distance < 0) {

        nextProof();

    } else {

        previousProof();

    }

}


function nextProof() {

    if (
        galleryIndex <
        proofPhotos.length - 1
    ) {

        galleryIndex++;

        showGalleryPhoto();

    } else {

        closeGallery();

        showGalleryEnding();

    }

}


function previousProof() {

    if (
        galleryIndex > 0
    ) {

        galleryIndex--;

        showGalleryPhoto();

    }

}


/* =========================
   FINAL DA GALERIA
========================= */

function showGalleryEnding() {

    galleryEnding
        .classList
        .add("active");

    document.body.style.overflow =
        "hidden";


    const endings = [

        document.getElementById("ending1"),
        document.getElementById("ending2"),
        document.getElementById("ending3"),
        document.getElementById("ending4"),
        document.getElementById("ending5")

    ];


    endings.forEach(
        element => {

            element.classList.remove("show");

        }
    );


    endings.forEach(
        (element, index) => {

            setTimeout(
                () => {

                    element.classList.add("show");

                },
                900 + index * 1900
            );

        }
    );


    setTimeout(
        () => {

            galleryEnding
                .classList
                .remove("active");

            document.body.style.overflow = "";

        },
        12500
    );

}


/* =========================
   AGORA OLHA PRA MIM
========================= */

const finalObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting &&
                        !finalReached
                    ) {

                        finalReached = true;

                        finalSection
                            .classList
                            .add("active");

                        fadeMusicOut();


                        setTimeout(
                            () => {

                                question
                                    .classList
                                    .add("show");

                                question
                                    .scrollIntoView({
                                        behavior: "smooth"
                                    });

                            },
                            30000
                        );

                    }

                }
            );

        },

        {
            threshold: 0.7
        }

    );


finalObserver.observe(finalSection);


/* =========================
   FADE OUT
========================= */

function fadeMusicOut() {

    const fade =
        setInterval(
            () => {

                if (
                    music.volume > 0.02
                ) {

                    music.volume -= 0.02;

                } else {

                    music.volume = 0;

                    music.pause();

                    clearInterval(fade);

                    musicPlaying = false;

                    musicControl.textContent = "♪";

                }

            },
            100
        );

}


/* =========================
   BOTÃO NÃO
========================= */

function moveNoButton() {

    const container =
        document.querySelector(".buttons");

    const rect =
        container.getBoundingClientRect();

    const button =
        noBtn.getBoundingClientRect();

    const maxX =
        (rect.width - button.width) / 2;

    const maxY =
        (rect.height - button.height) / 2;

    const x =
        Math.random() * maxX * 2 - maxX;

    const y =
        Math.random() * maxY * 2 - maxY;

    noBtn.style.transform =
        `
        translate(
            ${x}px,
            ${y}px
        )
        `;

}


noBtn.addEventListener(
    "mouseenter",
    () => {

        noAttempts++;

        moveNoButton();

        if (noAttempts >= 3) {

            noMessage.textContent =
                "⚠️ Opção indisponível. 😂";

        }

    }
);


noBtn.addEventListener(
    "touchstart",
    event => {

        event.preventDefault();

        noAttempts++;

        moveNoButton();

        if (noAttempts >= 3) {

            noMessage.textContent =
                "⚠️ Opção indisponível. 😂";

        }

    }
);


noBtn.addEventListener(
    "click",
    () => {

        noAttempts++;

        moveNoButton();

        noMessage.textContent =
            "Essa opção misteriosamente não funciona. 😂";

    }
);


/* =========================
   SIM
========================= */

yesBtn.addEventListener(
    "click",
    () => {

        let startDate =
            localStorage.getItem(
                "relationshipStart"
            );


        if (!startDate) {

            startDate =
                new Date().toISOString();

            localStorage.setItem(
                "relationshipStart",
                startDate
            );

        }


        question.style.display =
            "none";


        relationship
            .classList
            .add("show");


        relationship
            .scrollIntoView({
                behavior: "smooth"
            });


        music.volume = 0;

        music
            .play()
            .then(() => {

                musicPlaying = true;

                musicControl.textContent = "Ⅱ";

                fadeMusicIn();

            })
            .catch(() => {});


        createPetals(35);

        startCounter();

    }
);


/* =========================
   FADE IN
========================= */

function fadeMusicIn() {

    const fade =
        setInterval(
            () => {

                if (
                    music.volume < 0.18
                ) {

                    music.volume += 0.01;

                } else {

                    music.volume = 0.18;

                    clearInterval(fade);

                }

            },
            100
        );

}


/* =========================
   CONTADOR ETERNO
========================= */

function startCounter() {

    const start =
        new Date(
            localStorage.getItem(
                "relationshipStart"
            )
        );


    function update() {

        const now =
            new Date();

        let difference =
            now - start;


        if (difference < 0) {
            difference = 0;
        }


        const totalSeconds =
            Math.floor(
                difference / 1000
            );


        const days =
            Math.floor(
                totalSeconds / 86400
            );


        const hours =
            Math.floor(
                (totalSeconds % 86400) / 3600
            );


        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );


        const seconds =
            totalSeconds % 60;


        document.getElementById("days")
            .textContent = days;


        document.getElementById("hours")
            .textContent =
            String(hours).padStart(2, "0");


        document.getElementById("minutes")
            .textContent =
            String(minutes).padStart(2, "0");


        document.getElementById("seconds")
            .textContent =
            String(seconds).padStart(2, "0");

    }


    update();

    setInterval(
        update,
        1000
    );

}


/* =========================
   LIGHTBOX
========================= */

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const closeLightbox =
    document.getElementById("closeLightbox");


document
    .querySelectorAll(
        ".timeline-item img, .sunset-gallery img, .moment img"
    )
    .forEach(
        photo => {

            photo.addEventListener(
                "click",
                () => {

                    lightboxImage.src =
                        photo.src;

                    lightbox
                        .classList
                        .add("active");

                }
            );

        }
    );


closeLightbox.addEventListener(
    "click",
    () => {

        lightbox
            .classList
            .remove("active");

    }
);


lightbox.addEventListener(
    "click",
    event => {

        if (
            event.target === lightbox
        ) {

            lightbox
                .classList
                .remove("active");

        }

    }
);


/* =========================
   ESC
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            lightbox
                .classList
                .remove("active");

            proofGallery
                .classList
                .remove("active");

            galleryEnding
                .classList
                .remove("active");

            document.body.style.overflow = "";

        }


        if (
            proofGallery
                .classList
                .contains("active")
        ) {

            if (
                event.key === "ArrowRight"
            ) {

                nextProof();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                previousProof();

            }

        }

    }
);