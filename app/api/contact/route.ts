import { NextResponse } from 'next/server';
import emailjs from '@emailjs/nodejs';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    console.log(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      process.env.EMAILJS_PUBLIC_KEY,
      process.env.EMAILJS_PRIVATE_KEY
    );

    // Initialize EmailJS
    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
      to_name: 'Yuvraj',
      reply_to: email,
    };

    // Send email using EmailJS
    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      }
    );

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    );
  }
} 