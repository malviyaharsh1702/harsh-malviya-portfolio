const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const dns = require("dns").promises;
const validator = require("validator");

const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");

const Contact = require("./Contact");

const app = express();

// Deployment ke liye PORT ready
const PORT = process.env.PORT || 5000;


// =========================================
// BASIC SECURITY
// =========================================

app.disable("x-powered-by");


// =========================================
// NODEMAILER SETUP
// =========================================

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_APP_PASSWORD
    }
});


// =========================================
// MIDDLEWARE
// =========================================

// Abhi local development ke liye open CORS.
// Deployment ke time Netlify URL ke according restrict karenge.
app.use(cors());

app.use(express.json({
    limit: "10kb"
}));


// =========================================
// RATE LIMITER
// =========================================

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    max: 5,

    message: {
        success: false,
        message:
            "Too many messages sent. Please try again later."
    },

    standardHeaders: true,

    legacyHeaders: false
});


// =========================================
// MONGODB CONNECTION
// =========================================

mongoose.connect(process.env.MONGODB_URI)

    .then(() => {

        console.log(
            "MongoDB Connected Successfully!"
        );

    })

    .catch((error) => {

        console.error(
            "MongoDB Connection Failed:",
            error.message
        );

    });


// =========================================
// CONTACT FORM API
// =========================================

app.post(
    "/api/contact",
    contactLimiter,

    async (req, res) => {

        try {

            const {
                name,
                email,
                message
            } = req.body;


            // =====================================
            // REQUIRED FIELD VALIDATION
            // =====================================

            if (
                typeof name !== "string" ||
                typeof email !== "string" ||
                typeof message !== "string" ||
                !name.trim() ||
                !email.trim() ||
                !message.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please fill all fields."

                });

            }


            // =====================================
            // CLEAN INPUT
            // =====================================

            const cleanName =
                name.trim();

            const cleanEmail =
                email
                    .trim()
                    .toLowerCase();

            const cleanMessage =
                message.trim();


            // =====================================
            // LENGTH VALIDATION
            // =====================================

            if (cleanName.length > 80) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name is too long."

                });

            }


            if (cleanEmail.length > 120) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email is too long."

                });

            }


            if (cleanMessage.length > 2000) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Message is too long."

                });

            }


            // =====================================
            // EMAIL FORMAT VALIDATION
            // =====================================

            if (
                !validator.isEmail(
                    cleanEmail
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter a valid email address."

                });

            }


            // =====================================
            // EMAIL DOMAIN / MX CHECK
            // =====================================

            const domain =
                cleanEmail
                    .split("@")[1]
                    .toLowerCase();


            try {

                const mxRecords =
                    await dns.resolveMx(
                        domain
                    );


                if (
                    !mxRecords ||
                    mxRecords.length === 0
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "This email domain cannot receive emails."

                    });

                }

            }

            catch (error) {

                return res.status(400).json({

                    success: false,

                    message:
                        "This email domain does not exist."

                });

            }


            // =====================================
            // SAVE MESSAGE TO MONGODB
            // =====================================

            const newContact =
                new Contact({

                    name:
                        cleanName,

                    email:
                        cleanEmail,

                    message:
                        cleanMessage

                });


            await newContact.save();


            // =====================================
            // SEND EMAIL NOTIFICATION
            // =====================================

            try {

                await transporter.sendMail({

                    from:
                        process.env.SENDER_EMAIL,

                    to:
                        process.env.RECEIVER_EMAIL,

                    replyTo:
                        cleanEmail,

                    subject:
                        "New Portfolio Contact Message",

                    text:
`New message received from your portfolio:

Name: ${cleanName}
Email: ${cleanEmail}

Message:
${cleanMessage}`

                });


                console.log(
                    "Email notification sent successfully!"
                );

            }

            catch (emailError) {

                console.error(
                    "Email Notification Failed:",
                    emailError.message
                );

            }


            // =====================================
            // SUCCESS RESPONSE
            // =====================================

            return res.status(201).json({

                success: true,

                message:
                    "Message sent successfully!"

            });

        }


        // =========================================
        // GENERAL ERROR
        // =========================================

        catch (error) {

            console.error(
                "Contact Error:",
                error.message
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to save message"

            });

        }

    }
);


// =========================================
// TEST ROUTE
// =========================================

app.get("/", (req, res) => {

    res.send(
        "Harsh Malviya Portfolio Backend is Running!"
    );

});


// =========================================
// START SERVER
// =========================================

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});