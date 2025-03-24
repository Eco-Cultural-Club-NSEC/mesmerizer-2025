export const registrationReceivedMailTemplate = (participant) => {
  return {
    subject: `Your Registration for ${participant.event} is Received!`,
    content: `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 16px;
          color: #333;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #0073e6;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .header h2 {
          color: #0073e6;
          margin: 0;
        }
        .details {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .details ul {
          list-style: none;
          padding: 0;
        }
        .details li {
          padding: 8px 0;
          border-bottom: 1px solid #ddd;
        }
        .details li:last-child {
          border-bottom: none;
        }
        .footer {
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        .footer a {
          color: #0073e6;
          text-decoration: none;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Registration Received ✅</h2>
          <p>Thank you for registering for ${participant.event}!</p>
        </div>

        <p>Dear ${participant.name[0]
          .split(" ")
          .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
          .join(" ")},</p>

        <p>We have successfully received your registration details.</p>

        <div class="details">
          <h3>Registration Details</h3>
          <ul>
            <li><strong>Participant Name:</strong> ${participant.name.join(", ")}</li>
            <li><strong>Email:</strong> ${participant.email}</li>
            <li><strong>WhatsApp Number:</strong> ${participant.whatsapp_no}</li>
            <li><strong>Alternative Phone Number:</strong> ${
              participant.alt_phone
            }</li>
            <li><strong>Event:</strong> ${participant.event}</li>
            <li><strong>Event Date:</strong> ${new Date(participant.event_date).toDateString()}</li>
            <li><strong>Event Location:</strong> ${participant.event_location}</li>
            <li><strong>College Name:</strong> ${participant.collage_name}</li>
            <li><strong>Amount Paid:</strong> ₹${participant.amount_paid}</li>
            <li><strong>Transaction ID:</strong> ${participant.transaction_id}</li>
          </ul>
        </div>

        <p>You will receive another email confirming your event participation after we verify your payment.</p>

        <p>If you have any questions, feel free to contact us:</p>
        <p>
          📧 <a href="mailto:official.ecocultural@gmail.com">official.ecocultural@gmail.com</a><br />
          📞 (123) 456-7890
        </p>

        <div class="footer">
          <p>Best regards,</p>
          <p><strong>Mesmerizer Team</strong></p>
        </div>
      </div>
    </body>
  </html>
  `,
  };
};