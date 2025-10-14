const { storage } = require("../../utils/firebase");

// CORS helpers
const setCorsHeaders = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

const handlePreflight = (req, res) => {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
};

module.exports = async (req, res) => {
  setCorsHeaders(res);
  if (handlePreflight(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { file, folder, fileName } = req.body;

    if (!file || !folder) {
      return res.status(400).json({ error: "File and folder are required" });
    }

    const bucket = storage.bucket();
    const storageFileName = `${folder}/${Date.now()}_${fileName || "file"}`;

    const base64Data = file.split(",")[1];
    if (!base64Data) {
      return res.status(400).json({ error: "Invalid file data" });
    }

    const fileBuffer = Buffer.from(base64Data, "base64");
    const fileUpload = bucket.file(storageFileName);

    await fileUpload.save(fileBuffer, {
      metadata: {
        contentType: "image/jpeg", // Adjust if needed
        metadata: {
          uploadedBy: "website",
          uploadedAt: new Date().toISOString(),
        },
      },
      resumable: false,
    });

    await fileUpload.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storageFileName}`;

    res.status(200).json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed", message: error.message });
  }
};
