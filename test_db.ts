const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  const Anak = mongoose.model("Anak", new mongoose.Schema({ gambar: String }, { strict: false }));
  
  // Find all Anak without gambar
  const anaks = await Anak.find({ $or: [{ gambar: { $exists: false } }, { gambar: "" }] });
  
  if (anaks.length > 0) {
    // Just give the first anak the image we uploaded
    anaks[0].gambar = '6a6dea0a7b3aaf357ec10387';
    await anaks[0].save();
    console.log("Fixed Anak:", anaks[0]._id);
  } else {
    console.log("No Anak needed fixing.");
  }
  
  process.exit();
}

fix();
