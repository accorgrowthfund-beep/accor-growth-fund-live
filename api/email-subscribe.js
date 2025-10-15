// api/subscribe.js
// const nodemailer = require("nodemailer");

// module.exports = async (req, res) => {
//   const { name, email, message } = req.body;

//   if (!name || !email || !message) {
//     return res.status(400).json({ success: false, message: "Name, email and message are required" });
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASS,
//       },
//     });

//     // Admin email
//     const adminMailOptions = {
//       from: process.env.GMAIL_USER,
//       to: "yashtv001.tracewave@gmail.com", // admin email
//       subject: "New Contact Form Submission",
//       text: `New message from ${name} (${email}):\n\n${message}`,
//     };

//     // User confirmation email
//     const userMailOptions = {
//       from: process.env.GMAIL_USER,
//       to: email,
//       subject: "Thank you for contacting us!",
//       text: `Hi ${name},\n\nThank you for reaching out! We have received your message:\n"${message}"\n\nWe will get back to you soon.\n\nBest regards,\nCapithon Team`,
//     };

//     await Promise.all([
//       transporter.sendMail(adminMailOptions),
//       transporter.sendMail(userMailOptions),
//     ]);

//     res.status(200).json({ success: true, message: "Message sent successfully!" });
//   } catch (error) {
//     console.error("Error sending emails:", error);
//     res.status(500).json({ success: false, message: "Error sending emails" });
//   }
// };

const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  const { action } = req.query;

 if (action === "sitemap") {
  try {
    const response = await fetch("https://accorgrowthfund.com/api/blog-details/get");
    if (!response.ok) {
      const errText = await response.text();
      console.error("Fetch failed:", errText);
      return res.status(500).send("Failed to fetch blog data");
    }

    const result = await response.json();
    console.log("Fetched result:", result);

    // ✅ SAFELY extract blogs
    let blogs = [];

    // result could be array itself OR object with `data`
    if (Array.isArray(result)) {
      blogs = result;
      console.log(result?.data?.data, "result?.data");
      
    } else if (Array.isArray(result?.data?.data)) {
      blogs = result?.data?.data;
    } else {
      console.warn("Unexpected blog response structure");
    }

    const BASE_URL = "https://accorgrowthfund.com";

    const staticPaths = [
      "",
      "insights.html",
      "about-us.html",
      "InvestmentStrategies.html",
      "faqs.html",
      "contact-us.html",
    ];

    const staticUrls = staticPaths.map((path) => `
  <url>
    <loc>${BASE_URL}/${path}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("\n");

    const blogUrls = blogs.map((blog) => `
  <url>
    <loc>${BASE_URL}/blog/${blog.id}</loc>
    <lastmod>${blog.updated_date || blog.created_date || new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${blogUrls}
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemap);
  } catch (err) {
    console.error("Error generating sitemap:", err.stack || err);
    res.status(500).send("Error generating sitemap");
  }
}
 else {
    // 👉 Default to email form logic
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
        to: "yashtv001.tracewave@gmail.com", // admin
        subject: "New Contact Form Submission",
        text: `New message from ${name} (${email}):\n\n${message}`,
      };

      const adminResult = await transporter.sendMail(adminMailOptions);

      if (adminResult.accepted && adminResult.accepted.length > 0) {
        // Confirmation to user
        const userMailOptions = {
          from: process.env.GMAIL_USER,
          to: email,
          subject: "Thank you for contacting us!",
          text: `Hi ${name},\n\nThank you for reaching out! We have received your message:\n"${message}"\n\nWe will get back to you soon.\n\nBest regards,\nCapithon Team`,
        };

        const userResult = await transporter.sendMail(userMailOptions);

        if (userResult.accepted && userResult.accepted.length > 0) {
          return res.status(200).json({ success: true, message: "Message sent successfully!" });
        } else {
          return res.status(500).json({ success: false, message: "Failed to send confirmation email to user" });
        }
      } else {
        return res.status(500).json({ success: false, message: "Failed to send email to admin" });
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      return res.status(500).json({ success: false, message: "Error sending emails" });
    }
  }
};
