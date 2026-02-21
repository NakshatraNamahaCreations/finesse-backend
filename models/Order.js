const mongoose = require("mongoose");

/* ================= ADDRESS SCHEMA ================= */

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    address1: {
      type: String,
      required: true
    },
    address2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  { _id: false }
);


/* ================= ORDER ITEM SCHEMA ================= */

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    productName: {
      type: String,
      required: true
    },

    productImage: {
      type: String
    },

    price: {
      type: Number,
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    packSize: {
      type: String
    }
  },
  { _id: false }
);


/* ================= MAIN ORDER SCHEMA ================= */

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: {
      type: [orderItemSchema],
      required: true
    },

    shippingAddress: {
      type: shippingAddressSchema,   // 🔥 fixed here
      required: true
    },

    totalAmount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      default: "COD"
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending"
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
      ],
      default: "Pending"
    },

    deliveredAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);