import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const token = generateStreamToken(req.user.id);

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error in getStreamToken controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
