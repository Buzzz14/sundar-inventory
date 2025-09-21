
import mongoose from "mongoose";
import slugify from "slugify";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    company: { type: String, trim: true, default: "Unknown" },
    description: { type: String, trim: true },
    cost_price: { type: Number, required: true, min: 0 },
    min_profit_percent: { type: Number, required: true, min: 0 },
    max_profit_percent: { type: Number, required: true, min: 0 },
    sale_price_min: { type: Number },
    sale_price_max: { type: Number },
    stock: { type: Number, default: 0, min: 0 },
    reorder_level: {
      type: Number,
      default: 1,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.stock;
        },
        message: (props) =>
          `Reorder level (${props.value}) cannot exceed current stock (${this.stock})`,
      },
    },
    photos: [String],
  },
  { timestamps: true, versionKey: false }
);

itemSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

itemSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model("Item", itemSchema);
