// =========================================
// PORTFOLIO MAIN SCRIPT
// =========================================


// =========================================
// REVEAL ANIMATION
// =========================================

const revealElements =
    document.querySelectorAll(".reveal");

const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach((element) => {

    revealObserver.observe(element);

});


// =========================================
// CURSOR GLOW
// =========================================

const cursorGlow =
    document.querySelector(".cursor-glow");


if (cursorGlow) {

    document.addEventListener(
        "mousemove",
        (e) => {

            cursorGlow.style.left =
                e.clientX + "px";

            cursorGlow.style.top =
                e.clientY + "px";

        }
    );

}


// =========================================
// NAVBAR ACTIVE LINK
// =========================================

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".nav-link");


window.addEventListener(
    "scroll",
    () => {

        let currentSection = "";

        sections.forEach((section) => {

            const sectionTop =
                section.offsetTop - 180;

            const sectionHeight =
                section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY <
                    sectionTop + sectionHeight
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        navLinks.forEach((link) => {

            link.classList.remove("active");

            const href =
                link.getAttribute("href");

            if (
                href ===
                "#" + currentSection
            ) {

                link.classList.add("active");

            }

        });

    }
);


// =========================================
// SMOOTH NAVIGATION
// =========================================

navLinks.forEach((link) => {

    link.addEventListener(
        "click",
        (e) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {

                return;

            }


            const target =
                document.querySelector(
                    targetId
                );


            if (target) {

                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

});


// =========================================
// CONTACT FORM
// =========================================

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


if (
    contactForm &&
    formStatus &&
    sendButton
) {

    contactForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            formStatus.textContent = "";

            formStatus.className =
                "form-status";


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


            // =====================================
            // BASIC VALIDATION
            // =====================================

            if (
                !name ||
                !email ||
                !message
            ) {

                formStatus.textContent =
                    "Please fill all fields.";

                formStatus.classList.add(
                    "error"
                );

                return;

            }


            // =====================================
            // DISABLE BUTTON
            // =====================================

            sendButton.disabled = true;

            sendButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';


            try {

                // =================================
                // LIVE RENDER BACKEND
                // =================================

                const response =
                    await fetch(
                        "https://harsh-malviya-portfolio-backend.onrender.com/api/contact",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    name,
                                    email,
                                    message
                                })
                        }
                    );


                const data =
                    await response.json();


                // =================================
                // SUCCESS
                // =================================

                if (data.success) {

                    formStatus.textContent =
                        "Message sent successfully!";

                    formStatus.classList.add(
                        "success"
                    );

                    contactForm.reset();


                    setTimeout(() => {

                        formStatus.textContent =
                            "";

                        formStatus.className =
                            "form-status";

                    }, 3000);


                } else {

                    formStatus.textContent =
                        data.message ||
                        "Failed to send message.";

                    formStatus.classList.add(
                        "error"
                    );

                }


            } catch (error) {

                console.error(
                    "Contact Form Error:",
                    error
                );


                formStatus.textContent =
                    "Server connection failed.";

                formStatus.classList.add(
                    "error"
                );

            }


            // =================================
            // ENABLE BUTTON
            // =================================

            sendButton.disabled = false;

            sendButton.innerHTML =
                '<i class="fa-solid fa-paper-plane"></i> Send Message';

        }
    );

}


// =========================================
// INDIAN WELCOME INTRO
// =========================================

function startIntro() {

    const introScreen =
        document.getElementById("introScreen");

    if (!introScreen) {
        return;
    }

    setTimeout(() => {

        introScreen.classList.add("hide");

        setTimeout(() => {

            introScreen.style.display = "none";

            if (introScreen.parentNode) {
                introScreen.remove();
            }

        }, 1000);

    }, 5000);
}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        startIntro
    );

} else {

    startIntro();

}