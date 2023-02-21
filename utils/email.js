 // automatic send email after payment
 function sendMail(orders) {
    const { address, name, email, product, price, quantity } = orders;
  
  
    const mailOption = {
      from: process.env.EMAIL_SENDER,
      to: patient,
      subject: `We have received your payment for ${treatment} is on ${date} at ${slot} is Confirmed`,
      text: `Your payment for this Appointment ${treatment} is on ${date} at ${slot} is Confirmed`,
      html: `
        <div>
          <p> Hello ${patientName}, </p>
          <h3>Thank you for your payment . </h3>
          <h3>We have received your payment</h3>
          <p>Looking forward to seeing you on ${date} at ${slot}.</p>
          <h3>Our Address</h3>
          <p>Andor Killa Bandorban</p>
          <p>Bangladesh</p>
          <a href="">unsubscribe</a>
        </div>
      `
    };
  
  
    emailClient.sendMail(email, function (err, info) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('Message sent: ', info);
      }
    });
  }
  
  

  module.exports = sendMail;
  