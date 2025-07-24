// const nodemailer = require("nodemailer");


// function renderTemplate(templateName, data) {
//   const filePath = path.join(__dirname, "emailTemplates", `${templateName}.html`);
//   const source = fs.readFileSync(filePath, "utf8");
//   const template = Handlebars.compile(source);
//   return template(data);
// }

// const transporter = nodemailer.createTransport({
//   service: "Gmail", // or SMTP service
//   auth: {
//     user: process.env.EMAIL_USER, 
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendComplaintEmail = async (to, subject, html) => {
//   const mailOptions = {
//     from: `"CCMS System" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//   };

//   return transporter.sendMail(mailOptions);
// };

// export default sendComplaintEmail;




import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
dotenv.config();



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function renderTemplate(templateName, data) {
  const filePath = path.join(__dirname, "templates", `${templateName}.html`);
  console.log("Template path:", filePath);
  const source = fs.readFileSync(filePath, "utf8");
  const template = Handlebars.compile(source);
  return template(data);
}

export const transporter = nodemailer.createTransport({
  service: "Gmail", // or other SMTP service
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendComplaintEmail(to, subject, html) {
  const mailOptions = {
    from: `"CCMS System" <${process.env.EMAIL_ID}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}


