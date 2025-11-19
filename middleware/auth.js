const { OAuth2Client } = require("google-auth-library");

// 1. Your "VIP List" - Only these emails can access data
const ALLOWED_USERS = [
  "sanjeevkumar.s@unilever.com",
  // "pratyusha.garaye@unilever.com"
];

// 2. The Client ID you created in the previous step (React Frontend ID)
const CLIENT_ID =
  "1076232659917-0l8b4f8p3a4tqttfp4n6ouddgk0nm9mt.apps.googleusercontent.com";

const client = new OAuth2Client(CLIENT_ID);

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the header: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send("No token provided");
    }

    const token = authHeader.split(" ")[1];

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userEmail = payload.email;

    // Check if user is allowed
    if (!ALLOWED_USERS.includes(userEmail)) {
      console.log(`Blocked access attempt from: ${userEmail}`);
      return res.status(403).send("You are not authorized to view this data.");
    }

    // Success! Add user info to request and move on
    req.user = payload;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).send("Invalid authentication token.");
  }
};

module.exports = authMiddleware;
