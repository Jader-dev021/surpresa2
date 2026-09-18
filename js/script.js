if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("beforeunload", () => {
    window.scrollTo(0, 0);
});

window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});


/* =========================================================
   ELEMENTOS
========================================================= */

const intro = document.getElementById("intro");
const startBtn = document.getElementById("startBtn");
const music = document.getElementById("music");
const musicControl = document.getElementById("musicControl");

const finalSection = document.getElementById("final");
const question = document.getElementById("question");
const relationship = document.getElementById("relationship");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const noMessage = document.getElementById("noMessage");
const acceptedMessage = document.getElementById("acceptedMessage");
const questionTitle = document.getElementById("questionTitle");

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

const acceptanceCelebration =
    document.getElementById("acceptanceCelebration");

const celebrationCanvas =
    document.getElementById("celebrationCanvas");

const celebrationEmojis =
    document.getElementById("celebrationEmojis");


/* =========================================================
   ESTADO
========================================================= */

let musicPlaying = false;
let finalReached = false;
let noAttempts = 0;
let counterInterval = null;

let relationshipAccepted =
    localStorage.getItem("relationshipAccepted") === "true";

const RELATIONSHIP_KEY = "relationshipStart";
const ACCEPTED_KEY = "relationshipAccepted";


/*
    Depois do pedido, se você quiser colocar o horário
    diretamente no código, basta preencher esta variável.

    Exemplo:
    const FIXED_RELATIONSHIP_START =
        "2026-09-19T18:42:31.000-03:00";

    Enquanto estiver vazia, o site usa o horário salvo
    no localStorage.
*/

const FIXED_RELATIONSHIP_START = "";


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /*
        IMPORTANTE:

        Se ainda não houve o SIM, a pergunta NÃO é exibida
        aqui.

        Ela permanece escondida pelo CSS e só será exibida
        pelo finalObserver depois dos 30 segundos.
    */

    if (relationshipAccepted) {

        /*
            Se ela já aceitou em uma visita anterior,
            a pergunta continua aparecendo normalmente.
        */

        showQuestion(false, true);
        showRelationship(false);
        startCounter();

        /*
            Toda vez que o site for aberto depois do SIM,
            a pequena transição de "Você aceitou!" volta a aparecer.
        */

        setTimeout(() => {
            playAcceptanceCelebration(false);
        }, 700);
    }

    createPetals(8);
});


/* =========================================================
   INTRO / MÚSICA
========================================================= */

startBtn.addEventListener("click", async () => {

    intro.classList.add("hidden");

    music.volume = 0.18;

    try {

        await music.play();

        musicPlaying = true;
        musicControl.textContent = "Ⅱ";

    } catch {

        musicPlaying = false;
        musicControl.textContent = "♪";
    }

    createPetals(10);

    setTimeout(() => {
        document.body.classList.add("site-started");
    }, 500);
});


musicControl.addEventListener("click", async () => {

    if (musicPlaying) {

        music.pause();

        musicPlaying = false;
        musicControl.textContent = "♪";

        return;
    }

    try {

        await music.play();

        musicPlaying = true;
        musicControl.textContent = "Ⅱ";

    } catch {

        console.warn(
            "Não foi possível iniciar a música."
        );
    }
});


/* =========================================================
   FADE DA MÚSICA
========================================================= */

function fadeMusicOut() {

    const fade = setInterval(() => {

        music.volume = Math.max(
            0,
            music.volume - 0.02
        );

        if (music.volume <= 0) {

            clearInterval(fade);

            music.pause();
            musicPlaying = false;
        }

    }, 100);
}


function fadeMusicIn() {

    clearInterval(window.musicFadeIn);

    music.volume = 0;

    window.musicFadeIn = setInterval(() => {

        music.volume = Math.min(
            0.18,
            music.volume + 0.01
        );

        if (music.volume >= 0.18) {

            clearInterval(window.musicFadeIn);
        }

    }, 100);
}


/* =========================================================
   REVEALS
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");

const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -5% 0px"
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);
});


/* =========================================================
   PÉTALAS
========================================================= */

function createPetal() {

    const petal =
        document.createElement("div");

    petal.className = "petal";

    petal.style.left =
        `${Math.random() * 100}vw`;

    petal.style.animationDuration =
        `${5 + Math.random() * 5}s`;

    petal.style.animationDelay =
        `${Math.random() * 1.5}s`;

    petal.style.transform =
        `rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(petal);

    setTimeout(() => {

        petal.remove();

    }, 11000);
}


function createPetals(amount = 10) {

    for (let i = 0; i < amount; i++) {

        setTimeout(
            createPetal,
            i * 200
        );
    }
}


/* =========================================================
   GALERIA DE PROVAS
========================================================= */

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


const proofPhotos =
    Array.from(
        { length: 16 },
        (_, index) =>
            `assets/provas/prova-${String(index + 1).padStart(2, "0")}.jpeg`
    );


const proofCaptions = [

    "Você lembra disso? ❤️",

    "Às vezes você nem percebe o quanto esses pequenos detalhes significam pra mim.",

    "Um jeito seu de demonstrar carinho.",

    "Mais uma vez em que você cuidou de mim sem perceber.",

    "Essas coisas ficam guardadas.",

    "Porque carinho também aparece nos detalhes.",

    "Você talvez nem tenha pensado muito nisso na hora.",

    "Mas eu pensei.",

    "Eu percebi.",

    "Eu guardei.",

    "E foi importante pra mim.",

    "Cada pequeno gesto conta.",

    "Cada conversa conta.",

    "Cada cuidado conta.",

    "Você demonstra mais do que imagina.",

    "E ainda existem muitas outras que eu poderia mostrar. ❤️"

];


let galleryIndex = 0;


function showGalleryPhoto(index) {

    galleryPhoto.classList.add("changing");

    setTimeout(() => {

        galleryPhoto.src =
            proofPhotos[index];

        galleryCaption.textContent =
            proofCaptions[index];

        galleryCurrent.textContent =
            index + 1;

        galleryTotal.textContent =
            proofPhotos.length;

        galleryPhoto.classList.remove("changing");

    }, 180);
}


function openGallery() {

    galleryIndex = 0;

    showGalleryPhoto(galleryIndex);

    proofGallery.classList.add("active");

    proofGallery.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "gallery-open"
    );
}


function closeGallery() {

    proofGallery.classList.remove("active");

    proofGallery.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "gallery-open"
    );
}


openProofGallery.addEventListener(
    "click",
    openGallery
);


closeProofGallery.addEventListener(
    "click",
    closeGallery
);


function nextProof() {

    if (galleryIndex < proofPhotos.length - 1) {

        galleryIndex++;

        showGalleryPhoto(
            galleryIndex
        );

        return;
    }

    closeGallery();

    showGalleryEnding();
}


function previousProof() {

    if (galleryIndex <= 0) {
        return;
    }

    galleryIndex--;

    showGalleryPhoto(
        galleryIndex
    );
}


let galleryStartX = 0;
let galleryEndX = 0;


galleryPhoto.addEventListener(
    "touchstart",
    event => {

        galleryStartX =
            event.changedTouches[0].screenX;

    },
    { passive: true }
);


galleryPhoto.addEventListener(
    "touchend",
    event => {

        galleryEndX =
            event.changedTouches[0].screenX;

        const difference =
            galleryStartX - galleryEndX;

        if (Math.abs(difference) < 50) {
            return;
        }

        if (difference > 0) {

            nextProof();

        } else {

            previousProof();
        }

    },
    { passive: true }
);


/* =========================================================
   FINAL DA GALERIA
========================================================= */

function showGalleryEnding() {

    galleryEnding.classList.add("active");

    galleryEnding.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "gallery-open"
    );


    const paragraphs =
        galleryEnding.querySelectorAll("p");


    paragraphs.forEach(
        paragraph =>
            paragraph.classList.remove("show")
    );


    paragraphs.forEach(
        (paragraph, index) => {

            setTimeout(() => {

                paragraph.classList.add(
                    "show"
                );

            }, 900 + index * 1900);
        }
    );
}


function closeGalleryEnding() {

    galleryEnding.classList.remove("active");

    galleryEnding.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "gallery-open"
    );
}


/* =========================================================
   AGORA OLHA PRA MIM — MOMENTO FINAL
========================================================= */

/*
    Tempo que o "Agora olha pra mim."
    permanece sozinho antes da pergunta.

    30 segundos = 30000ms
*/

const FINAL_HOLD_TIME = 30000;


const finalObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (
                    entry.isIntersecting &&
                    !finalReached
                ) {

                    finalReached = true;

                    /*
                        Ativa apenas a animação do
                        "Agora olha pra mim."
                    */

                    finalSection.classList.add(
                        "active"
                    );


                    /*
                        A pergunta permanece escondida.

                        Só depois de 30 segundos ela
                        recebe a classe "show".
                    */

                    setTimeout(() => {

                        question.classList.add(
                            "show"
                        );

                    }, FINAL_HOLD_TIME);
                }
            });
        },
        {
            threshold: 0.7
        }
    );


finalObserver.observe(finalSection);


/* =========================================================
   PERGUNTA
========================================================= */

function showQuestion(
    scroll = false,
    accepted = false
) {

    question.classList.add("show");


    if (accepted) {

        question.classList.add(
            "accepted"
        );

        yesBtn.classList.add(
            "accepted"
        );

        noBtn.classList.add(
            "accepted"
        );

        questionTitle.textContent =
            "Você aceita? ❤️";
    }


    /*
        Este parâmetro continua existindo para
        preservar o comportamento original,
        mas o fluxo dos 30 segundos NÃO usa scroll.
    */

    if (scroll) {

        setTimeout(() => {

            question.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 150);
    }
}


/* =========================================================
   BOTÃO NÃO
========================================================= */

function moveNoButton() {

    const buttons =
        document.querySelector(".buttons");

    if (!buttons) {
        return;
    }


    const buttonRect =
        noBtn.getBoundingClientRect();

    const areaRect =
        buttons.getBoundingClientRect();


    const maxX =
        Math.max(
            30,
            (areaRect.width - buttonRect.width) / 2 - 10
        );


    const maxY =
        Math.max(
            50,
            (areaRect.height - buttonRect.height) / 2 - 10
        );


    let x =
        (Math.random() * 2 - 1) *
        maxX;

    let y =
        (Math.random() * 2 - 1) *
        maxY;


    /*
        Evita que o NÃO fique praticamente
        em cima do SIM.
    */

    if (Math.abs(x) < 80) {

        x +=
            x < 0
                ? -90
                : 90;
    }


    const rotation =
        (Math.random() * 16) - 8;


    noBtn.style.setProperty(
        "--no-x",
        `${x}px`
    );

    noBtn.style.setProperty(
        "--no-y",
        `${y}px`
    );

    noBtn.style.setProperty(
        "--no-rotation",
        `${rotation}deg`
    );


    noBtn.classList.add(
        "dodging"
    );
}


function registerNoAttempt() {

    if (relationshipAccepted) {
        return;
    }


    noAttempts++;

    moveNoButton();


    let message = "";


    if (noAttempts === 1) {

        message =
            "Tem certeza? 👀";

    } else if (noAttempts === 2) {

        message =
            "Pensa com carinho... ❤️";

    } else {

        message =
            "Opção indisponível 😂";
    }


    noMessage.textContent =
        message;

    noMessage.classList.add(
        "message-visible"
    );
}


noBtn.addEventListener(
    "pointerenter",
    event => {

        if (
            event.pointerType === "mouse"
        ) {

            registerNoAttempt();
        }
    }
);


noBtn.addEventListener(
    "pointerdown",
    event => {

        if (
            event.pointerType === "touch" ||
            event.pointerType === "pen"
        ) {

            event.preventDefault();

            registerNoAttempt();
        }
    }
);


noBtn.addEventListener(
    "click",
    event => {

        event.preventDefault();

        /*
            No mouse, o pointerenter já fez o movimento.
            O clique ainda conta caso ela consiga clicar.
        */

        if (noAttempts === 0) {

            registerNoAttempt();
        }
    }
);


/* =========================================================
   SIM
========================================================= */

yesBtn.addEventListener(
    "click",
    async () => {

        /*
            O horário é registrado PRIMEIRO.

            Esse instante é o início oficial do contador.
        */

        const now =
            new Date().toISOString();


        let start =
            localStorage.getItem(
                RELATIONSHIP_KEY
            );


        if (!start) {

            start = now;

            localStorage.setItem(
                RELATIONSHIP_KEY,
                start
            );
        }


        localStorage.setItem(
            ACCEPTED_KEY,
            "true"
        );


        relationshipAccepted = true;


        /*
            Estado visual
        */

        question.classList.add(
            "accepted"
        );

        yesBtn.classList.add(
            "accepted"
        );

        noBtn.classList.add(
            "accepted"
        );


        noMessage.classList.remove(
            "message-visible"
        );


        /*
            Mostra o resultado imediatamente,
            sem exigir outro clique.
        */

        showRelationship(true);

        startCounter();


        /*
            Comemoração cinematográfica.
        */

        playAcceptanceCelebration(
            true
        );


        /*
            Música volta suavemente.
        */

        music.currentTime = 0;

        music.volume = 0;


        try {

            await music.play();

            musicPlaying = true;

            musicControl.textContent =
                "Ⅱ";

            fadeMusicIn();

        } catch {

            musicPlaying = false;

            musicControl.textContent =
                "♪";
        }
    }
);


/* =========================================================
   RELACIONAMENTO
========================================================= */

function showRelationship(
    scroll = false
) {

    relationship.classList.add(
        "show"
    );


    if (scroll) {

        setTimeout(() => {

            relationship.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 300);
    }
}


/* =========================================================
   CONTADOR
========================================================= */

function getRelationshipStart() {

    if (FIXED_RELATIONSHIP_START) {

        return FIXED_RELATIONSHIP_START;
    }


    return localStorage.getItem(
        RELATIONSHIP_KEY
    );
}


function startCounter() {

    if (counterInterval) {

        clearInterval(
            counterInterval
        );
    }


    updateCounter();


    counterInterval =
        setInterval(
            updateCounter,
            1000
        );
}


function updateCounter() {

    const start =
        getRelationshipStart();


    if (!start) {
        return;
    }


    const startDate =
        new Date(start);

    const now =
        new Date();


    let elapsed =
        Math.max(
            0,
            now - startDate
        );


    const totalSeconds =
        Math.floor(
            elapsed / 1000
        );


    const days =
        Math.floor(
            totalSeconds / 86400
        );


    const hours =
        Math.floor(
            (totalSeconds % 86400) /
            3600
        );


    const minutes =
        Math.floor(
            (totalSeconds % 3600) /
            60
        );


    const seconds =
        totalSeconds % 60;


    daysElement.textContent =
        days;

    hoursElement.textContent =
        String(hours).padStart(2, "0");

    minutesElement.textContent =
        String(minutes).padStart(2, "0");

    secondsElement.textContent =
        String(seconds).padStart(2, "0");
}


/* =========================================================
   COMEMORAÇÃO CINEMATOGRÁFICA
========================================================= */

let celebrationAnimationFrame = null;


function playAcceptanceCelebration(
    firstAcceptance = true
) {

    if (
        !acceptanceCelebration ||
        !celebrationCanvas
    ) {

        return;
    }


    acceptanceCelebration.classList.remove(
        "fade-out"
    );

    acceptanceCelebration.classList.add(
        "active"
    );


    acceptanceCelebration.setAttribute(
        "aria-hidden",
        "false"
    );


    createCelebrationEmojis();

    runFireworks();


    /*
        A comemoração é um momento cinematográfico,
        mas depois devolve o controle para a página.
    */

    setTimeout(() => {

        acceptanceCelebration.classList.add(
            "fade-out"
        );

    }, firstAcceptance ? 5000 : 4300);


    setTimeout(() => {

        acceptanceCelebration.classList.remove(
            "active",
            "fade-out"
        );

        acceptanceCelebration.setAttribute(
            "aria-hidden",
            "true"
        );

    }, firstAcceptance ? 6100 : 5400);
}


/* =========================================================
   EMOJIS
========================================================= */

function createCelebrationEmojis() {

    celebrationEmojis.innerHTML = "";


    const emojis = [
        "❤️",
        "💖",
        "💕",
        "💗",
        "💘",
        "🥰",
        "😍"
    ];


    const amount =
        window.innerWidth < 600
            ? 28
            : 42;


    for (let i = 0; i < amount; i++) {

        const emoji =
            document.createElement("span");


        emoji.className =
            "celebration-emoji";


        emoji.textContent =
            emojis[
                Math.floor(
                    Math.random() *
                    emojis.length
                )
            ];


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            180 +
            Math.random() *
            Math.max(
                220,
                window.innerWidth * 0.65
            );


        const x =
            Math.cos(angle) *
            distance;


        const y =
            Math.sin(angle) *
            distance;


        emoji.style.setProperty(
            "--emoji-x",
            `${x}px`
        );


        emoji.style.setProperty(
            "--emoji-y",
            `${y}px`
        );


        emoji.style.setProperty(
            "--emoji-scale",
            `${0.7 + Math.random() * 0.8}`
        );


        emoji.style.setProperty(
            "--emoji-rotation",
            `${-180 + Math.random() * 360}deg`
        );


        emoji.style.setProperty(
            "--emoji-duration",
            `${2.5 + Math.random() * 2.2}s`
        );


        emoji.style.left =
            `${20 + Math.random() * 60}%`;


        emoji.style.top =
            `${25 + Math.random() * 50}%`;


        celebrationEmojis.appendChild(
            emoji
        );
    }
}


/* =========================================================
   FOGOS + PARTÍCULAS
========================================================= */

function runFireworks() {

    const canvas =
        celebrationCanvas;

    const ctx =
        canvas.getContext("2d");


    if (!ctx) {
        return;
    }


    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    const width =
        window.innerWidth;

    const height =
        window.innerHeight;


    canvas.width =
        width * dpr;

    canvas.height =
        height * dpr;


    canvas.style.width =
        `${width}px`;

    canvas.style.height =
        `${height}px`;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    const particles = [];
    const rockets = [];


    const colors = [
        "#f19caf",
        "#ff4f7b",
        "#ff7898",
        "#ffffff",
        "#ffd6df"
    ];


    function createRocket() {

        rockets.push({

            x:
                width *
                (0.15 +
                Math.random() * 0.7),

            y:
                height + 20,

            targetY:
                height *
                (0.15 +
                Math.random() * 0.38),

            speed:
                8 +
                Math.random() * 4,

            color:
                colors[
                    Math.floor(
                        Math.random() *
                        colors.length
                    )
                ],

            trail: []
        });
    }


    function explode(
        x,
        y,
        color
    ) {

        const amount =
            55 +
            Math.floor(
                Math.random() * 35
            );


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const angle =
                Math.random() *
                Math.PI *
                2;


            const speed =
                2 +
                Math.random() *
                5.5;


            particles.push({

                x,
                y,

                vx:
                    Math.cos(angle) *
                    speed,

                vy:
                    Math.sin(angle) *
                    speed,

                gravity:
                    0.035 +
                    Math.random() * 0.025,

                friction:
                    0.985,

                life:
                    55 +
                    Math.random() * 45,

                maxLife:
                    100,

                size:
                    1 +
                    Math.random() * 2.2,

                color
            });
        }


        /*
            Pequena segunda explosão
            para deixar o fogo mais cheio.
        */

        for (
            let i = 0;
            i < 18;
            i++
        ) {

            const angle =
                Math.random() *
                Math.PI *
                2;


            const speed =
                1 +
                Math.random() *
                2.5;


            particles.push({

                x,
                y,

                vx:
                    Math.cos(angle) *
                    speed,

                vy:
                    Math.sin(angle) *
                    speed,

                gravity: 0.02,

                friction: 0.99,

                life:
                    35 +
                    Math.random() * 30,

                maxLife: 65,

                size:
                    0.7 +
                    Math.random() * 1.4,

                color: "#fff"
            });
        }
    }


    let elapsed = 0;

    let lastTime =
        performance.now();


    function animate(
        currentTime
    ) {

        const delta =
            Math.min(
                32,
                currentTime -
                lastTime
            );


        lastTime =
            currentTime;


        elapsed += delta;


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /*
            Lança foguetes durante
            a primeira parte da animação.
        */

        if (
            elapsed < 3900 &&
            Math.random() < 0.045
        ) {

            createRocket();
        }


        /*
            Foguetes
        */

        for (
            let i = rockets.length - 1;
            i >= 0;
            i--
        ) {

            const rocket =
                rockets[i];


            rocket.y -=
                rocket.speed *
                (delta / 16);


            rocket.trail.push({

                x: rocket.x,
                y: rocket.y
            });


            if (
                rocket.trail.length > 8
            ) {

                rocket.trail.shift();
            }


            ctx.beginPath();


            for (
                let t = 0;
                t < rocket.trail.length;
                t++
            ) {

                const point =
                    rocket.trail[t];


                if (t === 0) {

                    ctx.moveTo(
                        point.x,
                        point.y
                    );

                } else {

                    ctx.lineTo(
                        point.x,
                        point.y
                    );
                }
            }


            ctx.strokeStyle =
                rocket.color;

            ctx.globalAlpha = 0.55;

            ctx.lineWidth = 1.5;

            ctx.stroke();

            ctx.globalAlpha = 1;


            if (
                rocket.y <=
                rocket.targetY
            ) {

                explode(
                    rocket.x,
                    rocket.y,
                    rocket.color
                );

                rockets.splice(i, 1);
            }
        }


        /*
            Partículas
        */

        for (
            let i = particles.length - 1;
            i >= 0;
            i--
        ) {

            const particle =
                particles[i];


            particle.x +=
                particle.vx *
                (delta / 16);


            particle.y +=
                particle.vy *
                (delta / 16);


            particle.vx *=
                particle.friction;


            particle.vy *=
                particle.friction;


            particle.vy +=
                particle.gravity *
                (delta / 16);


            particle.life -=
                delta / 16;


            if (
                particle.life <= 0
            ) {

                particles.splice(i, 1);

                continue;
            }


            const alpha =
                Math.max(
                    0,
                    particle.life /
                    particle.maxLife
                );


            ctx.beginPath();


            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                particle.color;


            ctx.globalAlpha =
                alpha;


            ctx.fill();
        }


        ctx.globalAlpha = 1;


        if (
            elapsed < 5700 ||
            particles.length > 0 ||
            rockets.length > 0
        ) {

            celebrationAnimationFrame =
                requestAnimationFrame(
                    animate
                );

        } else {

            cancelAnimationFrame(
                celebrationAnimationFrame
            );
        }
    }


    /*
        Primeiros fogos imediatos.
    */

    setTimeout(() => {

        explode(
            width * 0.25,
            height * 0.35,
            colors[0]
        );

    }, 250);


    setTimeout(() => {

        explode(
            width * 0.72,
            height * 0.28,
            colors[3]
        );

    }, 550);


    setTimeout(() => {

        explode(
            width * 0.5,
            height * 0.2,
            colors[1]
        );

    }, 950);


    setTimeout(() => {

        explode(
            width * 0.32,
            height * 0.48,
            colors[4]
        );

    }, 1500);


    requestAnimationFrame(
        animate
    );
}


/* =========================================================
   LIGHTBOX
========================================================= */

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const closeLightbox =
    document.getElementById("closeLightbox");


const zoomableImages =
    document.querySelectorAll(
        ".timeline-item img, .sunset-gallery img, .moment img"
    );


zoomableImages.forEach(image => {

    image.addEventListener(
        "click",
        () => {

            lightboxImage.src =
                image.src;

            lightboxImage.alt =
                image.alt || "Foto ampliada";

            lightbox.classList.add(
                "active"
            );
        }
    );
});


function closeImageLightbox() {

    lightbox.classList.remove(
        "active"
    );
}


closeLightbox.addEventListener(
    "click",
    closeImageLightbox
);


lightbox.addEventListener(
    "click",
    event => {

        if (
            event.target === lightbox
        ) {

            closeImageLightbox();
        }
    }
);


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {

            return;
        }


        closeGallery();
        closeGalleryEnding();
        closeImageLightbox();
    }
);


/* =========================================================
   PREVENÇÃO DO DUPLO CLIQUE NO SIM
========================================================= */

yesBtn.addEventListener(
    "dblclick",
    event => {

        event.preventDefault();
    }
);


/* =========================================================
   VÍDEOS — ÁUDIO
========================================================= */

const videos =
    document.querySelectorAll("video");


videos.forEach((video) => {

    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;


    video.addEventListener(
        "loadedmetadata",
        () => {

            video.muted = false;
            video.defaultMuted = false;
            video.volume = 1;
        }
    );


    video.addEventListener(
        "play",
        () => {

            video.muted = false;
            video.volume = 1;
        }
    );
});


/* =========================================================
   RESIZE DO CANVAS
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            !acceptanceCelebration.classList.contains(
                "active"
            )
        ) {

            return;
        }

        /*
            O próximo disparo da comemoração
            recriará o canvas com o tamanho correto.
        */
    }
);