import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
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

export default mongoose.model("Item", itemSchema);
