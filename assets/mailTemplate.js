export const registrationReceivedMailTemplate = (participant) => ({
  subject: `Application Received for ${participant.event}`,
  content: `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 16px;
        }
        h2 {
          font-size: 1.5em;
          margin-bottom: 10px;
        }
        p {
          margin-bottom: 20px;
        }
        ul {
          margin-bottom: 20px;
          padding-left: 20px;
        }
        li {
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <h2>Dear ${participant.name[0]
        .split(" ")
        .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
        .join(" ")},</h2>
      <p>
        Thank you for your application for ${
          participant.event
        }. We have successfully received your registration details.
      </p>
      <p>
        Please find your registration details below:
        <ul>
          <li><strong>Participant Name:</strong> ${participant.name.join(
            ", "
          )}</li>
          <li><strong>Email:</strong> ${participant.email}</li>
          <li><strong>WhatsApp Number:</strong> ${participant.whatsapp_no}</li>
          <li><strong>Alternative Phone Number:</strong> ${
            participant.alt_phone
          }</li>
          <li><strong>Event:</strong> ${participant.event}</li>
          <li><strong>Event Date:</strong> ${participant.event_date}</li>
          <li><strong>Event Location:</strong> ${
            participant.event_location
          }</li>
          <li><strong>College Name:</strong> ${participant.collage_name}</li>
          <li><strong>Amount Paid:</strong> ${participant.amount_paid}</li>
          <li><strong>Transaction ID:</strong> ${
            participant.transaction_id
          }</li>
        </ul>
      </p>
      <p>
        You will receive another email confirming your event participation after we verify your payment.
      </p>
      <p>
        If you have any questions, please contact us at <a href="mailto:official.ecocultural@gmail.com">official.ecocultural@gmail.com</a> or call us at (123) 456-7890.
      </p>
      <p>
        Best regards,
        <br />
        Mesmerizer Team
      </p>
    </body>
  </html>
  `,
});
