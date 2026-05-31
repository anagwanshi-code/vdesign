import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = (formData.get("name") as string) || "No Name";
    const email = (formData.get("email") as string) || "No Email";
    const phone = (formData.get("contactNumber") as string) || "No Phone";
    const method = (formData.get("preferredMethod") as string) || "Not specified";
    const company = (formData.get("company") as string) || "Not specified";
    const website = (formData.get("website") as string) || "Not specified";
    const service = (formData.get("service") as string) || "Not specified";
    const details = (formData.get("details") as string) || "No details provided";
    const budget = (formData.get("budget") as string) || "Not specified";
    const timeline = (formData.get("timeline") as string) || "Not specified";
    const attachment = formData.get("attachment") as File | null;

    const attachments: {
      filename: string;
      content: Buffer;
      contentType: string;
    }[] = [];

    if (attachment && attachment.size > 0) {
      const bytes = await attachment.arrayBuffer();
      const buffer = Buffer.from(bytes);
      attachments.push({
        filename: attachment.name,
        content: buffer,
        contentType: attachment.type,
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const htmlContent = `
      <h2>New Consultation Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone} (Prefers: ${method})</p>
      <p><strong>Website:</strong> ${website}</p>
      <br/>
      <h3>Project Details</h3>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Timeline:</strong> ${timeline}</p>
      <p><strong>Description:</strong><br/> ${details}</p>
    `;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New Lead: ${service} for ${name}`,
      html: htmlContent,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
