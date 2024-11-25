import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { feedback } = await request.json();

    if (!feedback || feedback.trim() === "") {
      return NextResponse.json(
        { message: "Feedback darf nicht leer sein." },
        { status: 400 }
      );
    }

    // SMTP-Konfiguration
    const transporter = nodemailer.createTransport({
      host: 'mail.your-server.de', // Hetzner SMTP Server (ersetzen)
      port: 587, // TLS Port
      secure: false, // STARTTLS aktivieren
      auth: {
        user: process.env.EMAIL_USER, // Vollständige E-Mail-Adresse
        pass: process.env.EMAIL_PASS, // E-Mail-Passwort
      },
      tls: {
        rejectUnauthorized: false, // Optional für selbstsignierte Zertifikate
      },
    });

    // E-Mail-Inhalt
    const mailOptions = {
      from: `"Park and Go Frankfurt" <${process.env.EMAIL_USER}>`, // Absender
      to: process.env.EMAIL_USER, // Zieladresse (z. B. ein Admin-Postfach)
      subject: 'Neues Kunden-Feedback von der Webseite',
      text: `Feedback: ${feedback}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #4caf50;">Neues Kunden-Feedback</h2>
          <p style="color: #333;">${feedback}</p>
        </div>
      `,
    };

    // E-Mail senden
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "Feedback erfolgreich gesendet. Danke!",
    });
  } catch (error) {
    console.error("Fehler beim Senden des Feedbacks:", error);
    return NextResponse.json(
      { message: "Fehler beim Senden des Feedbacks.", error },
      { status: 500 }
    );
  }
}
