const jwt = require("jsonwebtoken");

export default function checkRefreshToken(refreshToken: any) {
  try {
    const refreshTokenPayload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (refreshTokenPayload) {
      //genrate new access token
      const accessToken = jwt.sign(
        { email: refreshTokenPayload.email, role: refreshTokenPayload.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_LIFE }
      );
      return accessToken;
    }
  } catch (error) {
    return false;
  }
}
