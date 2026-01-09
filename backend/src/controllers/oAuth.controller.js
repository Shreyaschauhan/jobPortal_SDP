import { User } from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";
import { ApiError } from "../utils/ApiError.js";
import { generateAccessAndRefreshTokens } from "./user.controller.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const handleGoogleAuth = async (req, res) => {
  const { token, role, bio, location, qualifications, experience } = req.body;

  if (!token) {
    throw new ApiError(400, "Google token is required");
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        username: name.replace(/\s+/g, ""),
        fullname: name,
        avatar: picture,
        password: "GOOGLE_AUTH_USER",
        role: role || "jobseeker",
        bio,
        location,
        qualifications,
        experience,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    // 🍪 SET COOKIES (THIS WAS MISSING)
    const cookieOptions = {
      httpOnly: true,
      secure: true,        // REQUIRED (Render + Vercel = HTTPS)
      sameSite: "None",    // REQUIRED for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json({
        success: true,
        message: "Google login successful",
        data: {
          user: loggedInUser,
        },
      });
  } catch (error) {
    console.error("Google authentication error:", error);
    throw new ApiError(401, "Google authentication failed");
  }
};

