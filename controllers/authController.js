const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body; // ✅ added phone

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Optional: Phone validation (10 digit India example)
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ message: "Enter a valid 10-digit phone number" });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Optional: Prevent duplicate phone numbers
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hash,
      phone   // ✅ save phone
    });

    await user.save();

    res.status(201).json({ message: "Registered successfully" });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
    console.log("BODY:", req.body);
  }
};


/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,   
      { expiresIn: "7d" }
    );

    res.json({
      token,
      userId: user._id,
      name: user.name
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }

  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Decoded:", decoded);
  req.user = decoded;
  next();
} catch (error) {
  console.log("JWT ERROR:", error.message);
  return res.status(401).json({ message: "Invalid token" });
}
};