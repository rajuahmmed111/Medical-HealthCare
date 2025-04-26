import httpStatus from "http-status";
import nodemailer from "nodemailer";
import config from "../app/config";
import ApiError from "../Error/apiError";

const emailSender = async (subject: string, email: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
  });

  const emailTransport = transporter;

  const mailOptions = {
    from: `"" <${config.emailSender.email}>`,
    to: email,
    subject,
    html,
  };

  // Send the email
  try {
    const info = await emailTransport.sendMail(mailOptions);
    // console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error sending email");
  }
};

export default emailSender;
