const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const CONSTANTS = require("../resources/consts/constants.ts");

export default async function sendEmail(email: any, subject: any, text?: any, hmtl?:any) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const accessToken = await oAuth2Client.getAccessToken();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        ...CONSTANTS.auth,
        accessToken: accessToken,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text?: text,
      html?: hmtl,
    });

    return true;   


  } catch (error) {
    console.log("this error", error);

    return false;
  }
}
