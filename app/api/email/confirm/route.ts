/* /api/email/confirm/route.ts */

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { formData, totalPrice, sessionId } = await req.json(); // Receive formData, totalPrice, and sessionId from the request body



    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Monate sind 0-indiziert
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    const emailToSendCustomer = formData.email || 'no-reply@example.com'; // Customer's email address
    const emailToSendBusiness = process.env.EMAIL_USER || 'business@example.com'; // Your email address

    const customerSubject = 'Bestellbestätigung - PARK & GO Frankfurt';
    const businessSubject = `Neue Bestellung - Parkservice: ${formatDate(formData.pickupDate)}`;

    // Message for Customer including sessionId (payment reference)
    const messageForCustomer = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px;">
        <header style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #4caf50;">
          <h1 style="color: #4caf50; margin: 0;">Park and Go Frankfurt</h1>
          <p style="margin: 0; font-size: 14px; color: #555;">Vielen Dank für deine Bestellung!</p>
        </header>
        <section style="padding: 20px 0; color: #333;">
          <h2 style="margin: 0 0 10px; color: #4caf50;">Bestätigung des Parkservice</h2>
          <p><strong>Abholung:</strong> ${formatDate(formData.pickupDate)} um ${formData.pickupTime}</p>
          <p><strong>Abgabe:</strong> ${formatDate(formData.dropOffDate)} um ${formData.dropOffTime}</p>
          <p><strong>Treffpunkt:</strong> ${formData.meetingPoint}</p>
          <p><strong>Zusatzoptionen:</strong> ${formData.extras}</p>
          <p><strong>Gesamtpreis:</strong> €${totalPrice.toFixed(2)}</p>
          <p><strong>Zahlungsreferenz:</strong> ${sessionId}</p>
          <p style="margin-top: 20px;">Falls du Fragen hast, stehen wir dir gerne zur Verfügung.</p>
        </section>
      <footer style="text-align: center; padding-top: 20px; border-top: 2px solid #4caf50; color: #777;">
        <p style="margin: 0;">Park and Go Frankfurt</p>
        <p style="margin: 0;">info@parkandgo-frankfurt.de | 0176 8133 1984</p>
        <p style="margin: 0;">www.parkandgo-frankfurt.de</p>
      </footer>
      </div>
    `;
    
    // Message for Business including sessionId (payment reference)
    const messageForBusiness = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px;">
      <header style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #4caf50;">
        <h1 style="color: #4caf50; margin: 0;">Neue Bestellung - Park Service</h1>
        <p style="margin: 0; font-size: 14px; color: #555;">Bitte prüfen Sie die Details der neuen Bestellung</p>
      </header>
      <section style="padding: 20px 0; color: #333;">
        <h2 style="margin: 0 0 10px; color: #4caf50;">Bestelldetails</h2>
        <p><strong>Kunde:</strong> ${formData.name}</p>
        <p><strong>E-Mail:</strong> ${formData.email}</p>
        <p><strong>Abholung:</strong> ${formatDate(formData.pickupDate)} um ${formData.pickupTime}</p>
        <p><strong>Abgabe:</strong> ${formatDate(formData.dropOffDate)} um ${formData.dropOffTime}</p>
        <p><strong>Treffpunkt:</strong> ${formData.meetingPoint}</p>
        <p><strong>Zusatzoptionen:</strong> ${formData.extras}</p>
        <p><strong>Gesamtpreis:</strong> €${totalPrice.toFixed(2)}</p>
        <p><strong>Zahlungsreferenz:</strong> ${sessionId}</p>
        <p style="margin-top: 20px;">Die Bestellung wurde erfolgreich abgeschlossen und bezahlt.</p>
      </section>
      <footer style="text-align: center; padding-top: 20px; border-top: 2px solid #4caf50; color: #777;">
        <p style="margin: 0;">Park and Go Frankfurt</p>
        <p style="margin: 0;">info@parkandgo-frankfurt.de | 0176 8133 1984</p>
        <p style="margin: 0;">www.parkandgo-frankfurt.de</p>
      </footer>
    </div>
  `;
  
    // // Configure the transporter for sending emails
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.strato.de', // Use your SMTP server details
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: process.env.EMAIL_USER, // Sender email user (e.g., your business email)
    //     pass: process.env.EMAIL_PASS, // Sender email password
    //   },
    // });
    // Configure the transporter for sending emails
const transporter = nodemailer.createTransport({
  host: 'mail.your-server.de', // Replace with your Hetzner SMTP server
  port: 587, // Port for TLS
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER, // Sender email user (full email address)
    pass: process.env.EMAIL_PASS, // Sender email password
  },
  tls: {
    rejectUnauthorized: false, // Optional: Set to true if you're using a valid certificate
  },
});


    // Send email to the customer
    const customerMailOptions = {
      from: `"Park and Go Frankfurt" <${process.env.EMAIL_USER}>`,
      to: emailToSendCustomer,
      subject: customerSubject,
      html: messageForCustomer,
    };

    await transporter.sendMail(customerMailOptions);
    console.log('E-Mail an den Kunden gesendet');

    // Send email to the business (you)
    const businessMailOptions = {
      from: `"Park and Go Frankfurt" <${process.env.EMAIL_USER}>`,
      to: emailToSendBusiness,
      subject: businessSubject,
      html: messageForBusiness,
    };

    await transporter.sendMail(businessMailOptions);
    console.log('E-Mail an das Geschäft gesendet');

    return NextResponse.json({ message: 'E-Mails erfolgreich gesendet!' });
  } catch (error) {
    console.error('Fehler beim Senden der E-Mails:', error);
    return NextResponse.json({ message: 'E-Mails konnten nicht gesendet werden.', error }, { status: 500 });
  }
}
