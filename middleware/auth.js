const { OAuth2Client } = require("google-auth-library");

const ALLOWED_USERS = [
  "sanjeevkumar.s@unilever.com",
  // "pratyusha.garaye@unilever.com"
];

const CLIENT_ID =
  "1076232659917-0l8b4f8p3a4tqttfp4n6ouddgk0nm9mt.apps.googleusercontent.com";

const client = new OAuth2Client(CLIENT_ID);

const authMiddleware = async (req, res, next) => {
  try {
    // Skip preflight OPTIONS requests
    if (req.method === "OPTIONS") {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send("No token provided");
    }

    const token = authHeader.split(" ")[1];

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userEmail = payload.email;

    if (!ALLOWED_USERS.includes(userEmail)) {
      console.log(`Blocked access attempt from: ${userEmail}`);
      return res.status(403).send("You are not authorized to view this data.");
    }

    req.user = payload;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).send("Invalid authentication token.");
  }
};

module.exports = authMiddleware;