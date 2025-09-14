import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  company: { type: String, trim: true, default: "Unknown" },
  description: { type: String, trim: true },
  cost_price: { type: Number, required: true, min: 0 },
  sale_price_min: { type: Number, required: true, min: 0 },
  sale_price_max: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (value) {
        return value >= this.sale_price_min;
      },
      message:
        "Maximum sale price must be greater than or equal to minimum sale price",
    },
  },
  stock: { type: Number, default: 0, min: 0 },
  photos: [String],
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
});

export default mongoose.model("Item", itemSchema);