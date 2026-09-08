/* =========================================
   CURSOR GLOW
========================================= */

const cursorGlow =
    document.querySelector(".cursor-glow");

document.addEventListener("mousemove", (e) => {

    cursorGlow.style.left =
        e.clientX + "px";

    cursorGlow.style.top =
        e.clientY + "px";

});



/* =========================================
   TYPING ANIMATION
========================================= */

const typingText =
    document.getElementById("typingText");

const words = [

    "FULL STACK DEVELOPER",
    "WEB DEVELOPER",
    "PROBLEM SOLVER",
    "TECH ENTHUSIAST"

];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {

    const currentWord =
        words[wordIndex];

    if (!deleting) {

        typingText.textContent =
            currentWord.substring(
                0,
                charIndex + 1
            );

        charIndex++;

        if (
            charIndex ===
            currentWord.length
        ) {

            deleting = true;

            setTimeout(
                typeEffect,
                1700
            );

            return;
        }

    } else {

        typingText.textContent =
            currentWord.substring(
                0,
                charIndex - 1
            );

        charIndex--;

        if (charIndex === 0) {

            deleting = false;

            wordIndex++;

            if (
                wordIndex >=
                words.length
            ) {

                wordIndex = 0;

            }

        }

    }

    setTimeout(
        typeEffect,
        deleting
            ? 45
            : 85
    );

}

typeEffect();



/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );

const revealObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "show"
                        );

                    }

                }
            );

        },

        {
            threshold: 0.12
        }

    );

revealElements.forEach(
    (element) => {

        revealObserver.observe(
            element
        );

    }
);



/* =========================================
   ACTIVE NAVIGATION
========================================= */

const sections =
    document.querySelectorAll(
        "section"
    );

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );

window.addEventListener(
    "scroll",
    () => {

        let current = "";

        sections.forEach(
            (section) => {

                const sectionTop =
                    section.offsetTop - 180;

                if (
                    window.scrollY >=
                    sectionTop
                ) {

                    current =
                        section.getAttribute(
                            "id"
                        );

                }

            }
        );

        navLinks.forEach(
            (link) => {

                link.classList.remove(
                    "active"
                );

                if (
                    link.getAttribute(
                        "href"
                    ) ===
                    "#" + current
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);



/* =========================================
   TERMINAL BUTTON
========================================= */

const terminalButton =
    document.querySelector(
        ".terminal-btn"
    );

terminalButton.addEventListener(
    "click",
    () => {

        document
            .querySelector(
                ".terminal-card"
            )
            .scrollIntoView({

                behavior: "smooth"

            });

    }
);



/* =========================================
   THEME BUTTON
========================================= */

const themeButton =
    document.getElementById(
        "themeBtn"
    );

themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light-mode"
        );

    }
);



/* =========================================
   PROJECT CARD MOUSE EFFECT
========================================= */

const cards =
    document.querySelectorAll(
        ".project-card, .skill, .certificate-card"
    );

cards.forEach(
    (card) => {

        card.addEventListener(
            "mousemove",
            (e) => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    e.clientX -
                    rect.left;

                const y =
                    e.clientY -
                    rect.top;

                card.style.background =
                    `radial-gradient(
                        circle at ${x}px ${y}px,
                        rgba(0,220,255,.08),
                        rgba(7,13,18,.7) 45%
                    )`;

            }
        );

        card.addEventListener(
            "mouseleave",
            () => {

                card.style.background =
                    "rgba(7,13,18,.7)";

            }
        );

    }
);



/* =========================================
   BUTTON CLICK EFFECT
========================================= */

const buttons =
    document.querySelectorAll(
        ".primary-btn, .secondary-btn"
    );

buttons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                button.style.transform =
                    "scale(.97)";

                setTimeout(
                    () => {

                        button.style.transform =
                            "";

                    },
                    120
                );

            }
        );

    }
);


/* =========================================
   CONTACT FORM → MONGODB
========================================= */

const contactForm =
    document.getElementById(
        "contactForm"
    );

const formStatus =
    document.getElementById(
        "formStatus"
    );

const sendButton =
    document.getElementById(
        "sendBtn"
    );


contactForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        formStatus.textContent = "";
        formStatus.className = "form-status";

        const name =
            document.getElementById(
                "name"
            ).value.trim();

        const email =
            document.getElementById(
                "email"
            ).value.trim();

        const message =
            document.getElementById(
                "message"
            ).value.trim();


        // Basic validation
        if (
            !name ||
            !email ||
            !message
        ) {

            formStatus.textContent =
                "Please fill all fields.";

            return;
        }


        // Disable button while sending
        sendButton.disabled = true;

        sendButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/contact",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            message
                        })
                    }
                );


            const data =
                await response.json();


            if (data.success) {

                formStatus.textContent =
                    "Message sent successfully!";

                contactForm.reset();

                setTimeout(() => {
                    formStatus.textContent = "";
                }, 3000);   

            } else {

                formStatus.textContent =
                    data.message ||
                    "Failed to send message.";

            }


        } catch (error) {

            console.error(
                "Contact Form Error:",
                error
            );

            formStatus.textContent =
                "Server connection failed.";

        }


        // Enable button again
        sendButton.disabled = false;

        sendButton.innerHTML =
            '<i class="fa-solid fa-paper-plane"></i> Send Message';

    }
);