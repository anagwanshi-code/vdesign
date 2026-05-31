import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      preferredContactMode,
      subject,
      message,
    } = body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New General Inquiry: ${subject || "No Subject"}`,
      html: `<h3>New Message from Contact Page</h3>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone || "—"}</p>
             <p><strong>Company:</strong> ${company || "—"}</p>
             <p><strong>Preferred contact:</strong> ${preferredContactMode || "—"}</p>
             <p><strong>Message:</strong><br/> ${message}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Message API error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
