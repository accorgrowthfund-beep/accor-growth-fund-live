// // api/subscribe.js
// const nodemailer = require("nodemailer");

// module.exports = async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({ success: false, message: "Email is required" });
//     }

//     try {
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.GMAIL_USER,
//                 pass: process.env.GMAIL_PASS,
//             },
//         });

//         const adminMailOptions = {
//             from: process.env.GMAIL_USER,
//             to: "yashtv001.tracewave@gmail.com", // admin email
//             subject: "New Newsletter Subscription",
//             text: `A new user subscribed with email: ${email}`,
//         };

//         const userMailOptions = {
//             from: process.env.GMAIL_USER,
//             to: email,
//             subject: "Welcome to our Newsletter!",
//             text: `Hi there,\n\nThank you for subscribing to our newsletter! You’ll now receive updates, news, and special offers from us.\n\nBest regards,\nCapithon Team`,
//         };

//         await Promise.all([
//             transporter.sendMail(adminMailOptions),
//             transporter.sendMail(userMailOptions),
//         ]);

//         res.status(200).json({ success: true, message: "Subscription successful! Emails sent." });
//     } catch (error) {
//         console.error("Error sending subscription emails:", error);
//         res.status(500).json({ success: false, message: "Error processing subscription" });
//     }
// };


// api/subscribe.js
const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email and message are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Admin email
    const adminMailOptions = {
      from: process.env.GMAIL_USER,
      to: "yashtv001.tracewave@gmail.com", // admin email
      subject: "New Contact Form Submission",
      text: `New message from ${name} (${email}):\n\n${message}`,
    };

    // User confirmation email
    const userMailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Thank you for contacting us!",
      text: `Hi ${name},\n\nThank you for reaching out! We have received your message:\n"${message}"\n\nWe will get back to you soon.\n\nBest regards,\nCapithon Team`,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ success: false, message: "Error sending emails" });
  }
};


// // api/send-mail.js
// const nodemailer = require("nodemailer");

// module.exports = async (req, res) => {
//   const { fname, lname, email, phone, category, message } = req.body;

//   try {
//     let transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASS,
//       },
//     });

//     let mailOptions = {
//       from: process.env.GMAIL_USER,
//       to: "yashtv001.tracewave@gmail.com",
//       subject: "New Free Consultation Request",
//       text: `Name: ${fname} ${lname}
// Email: ${email}
// Phone: ${phone}
// Category: ${category}
// Message: ${message}`,
//     };

//     // Send the email using the transporter
//     await transporter.sendMail(mailOptions);

//     // Respond with a success message
//     res.status(200).json({ success: true, message: "Mail sent successfully!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Error sending mail" });
//   }
// };
