import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email is already registered." });
  }

  const idx = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
  const randomAvatar = `https://avatar.iran.liara.run/public/${idx}`;

  const newUser = await User.create({
    fullName,
    email,
    password,
    profilePic: randomAvatar,
  });

  try {
    await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName,
      image: newUser.profilePic || "",
    });
    console.log(`Stream user created for ${newUser.fullName}`);
  } catch (error) {
    console.log("Error creating stream user: ", error);
  }

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // Accessible only by web server
    secure: process.env.NODE_ENV === "production", // Set to true in production
    sameSite: "strict", // CSRF protection
  });

  try {
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User registered successfully.", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Server error. Please try again." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // Accessible only by web server
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "strict", // CSRF protection
    });

    return res.status(200).json({ message: "Login successful.", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error. Please try again." });
  }
}

export function logout(req, res) {
  res.cookie("jwt", "", {
    maxAge: 1, // Expire the cookie immediately
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logout successful." });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location)
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        nativeLanguage,
        learningLanguage,
        location,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updateUser) return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updateUser._id.toString(),
        name: updateUser.fullName,
        image: updateUser.profilePic || "",
      });

      console.log(
        `Stream user updated after onboarding for ${updateUser.fullName}`
      );
    } catch (streamError) {
      console.log(
        "Error updating stream user during onboarding: ",
        streamError.message
      );
    }

    return res.status(200).json({ success: true, user: updateUser });
  } catch (error) {
    console.error("Onboarding error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
