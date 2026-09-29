import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    plainPassword: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["Admin", "Pengurus", "Pengunjung"],
      default: "Pengunjung",
    },
  },
  { timestamps: true }
);

// Delete cached model to ensure schema changes (e.g. new fields) are always applied
delete mongoose.models.User;

export default mongoose.model("User", UserSchema);
