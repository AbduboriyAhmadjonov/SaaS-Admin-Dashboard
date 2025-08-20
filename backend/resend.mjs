import { Resend } from 'resend';

const resend = new Resend('re_cht14V98_2EyQhMrd4NnQGu9k4VV1ErNC');

try {
  resend.emails.send({
    from: 'norepy@send.mail.abduboriy.tech', // onboarding@resend.dev
    to: 'ahmadjonovabduboriy3@gmail.com',
    subject: 'NO Hello World',
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
  });
} catch (error) {
  console.log('Error sending email:', error);
}
