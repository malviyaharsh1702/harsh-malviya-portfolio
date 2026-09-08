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


        // =========================================
        // BASIC VALIDATION
        // =========================================

        if (
            !name ||
            !email ||
            !message
        ) {

            formStatus.textContent =
                "Please fill all fields.";

            return;
        }


        // =========================================
        // DISABLE BUTTON WHILE SENDING
        // =========================================

        sendButton.disabled = true;

        sendButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';


        try {

            // =====================================
            // SEND DATA TO LIVE RENDER BACKEND
            // =====================================

            const response =
                await fetch(
                    "https://harsh-malviya-portfolio-backend.onrender.com/api/contact",
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


            // =====================================
            // SUCCESS
            // =====================================

            if (data.success) {

                formStatus.textContent =
                    "Message sent successfully!";

                contactForm.reset();

                setTimeout(() => {

                    formStatus.textContent = "";

                }, 3000);


            } else {

                // =================================
                // BACKEND ERROR
                // =================================

                formStatus.textContent =
                    data.message ||
                    "Failed to send message.";

            }


        } catch (error) {

            // =====================================
            // SERVER CONNECTION ERROR
            // =====================================

            console.error(
                "Contact Form Error:",
                error
            );

            formStatus.textContent =
                "Server connection failed.";

        }


        // =========================================
        // ENABLE BUTTON AGAIN
        // =========================================

        sendButton.disabled = false;

        sendButton.innerHTML =
            '<i class="fa-solid fa-paper-plane"></i> Send Message';

    }
);