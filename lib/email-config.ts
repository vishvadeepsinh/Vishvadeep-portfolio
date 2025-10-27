import nodemailer from "nodemailer"

const gmailUser = process.env.GMAIL_USER || ""
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD || ""

let transporter: nodemailer.Transporter | null = null

export function getEmailTransporter() {
  if (!transporter && gmailUser && gmailAppPassword) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    })
  }
  return transporter
}

// Contact form messages are now stored in the database and can be viewed in the admin panel

export async function sendEmail(to: string, subject: string, html: string) {
  console.log("[v0] Email sending is disabled. Messages are stored in the database.")
  return { success: false, error: "Email service not available in this environment" }
}
