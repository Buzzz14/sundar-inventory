import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    slug: { type: String, unique: true, lowercase: true },
  },
  { timestamps: true, versionKey: false }
);

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update && update.name) {
    this.setUpdate({
      ...update,
      slug: slugify(update.name, { lower: true, strict: true })
    });
  }
  next();
});

export default mongoose.model("Category", categorySchema);
