import nodemailer from 'nodemailer';

export const sendConfirmationEmail = async (
  name: string,
  email: string,
  token: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: process.env.OAUTH_TYPE,
        user: process.env.OAUTH_EMAIL,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
    } as nodemailer.TransportOptions);

    const mailOptions = {
      from: '"No Reply" <no-reply@example.com>',
      to: email,
      subject: 'Please Confirm Your Account',
      html: `
            <h2>Learning Mongoose - Email Confirmation</h2>
            <h3>Hi, ${name}</h3>
            <p>Thank you for registering with Learning Mongoose!</p>
            <p>Please confirm your email address by clicking on the link below:</p>
            <br/>
            <a href="${process.env.CLIENT_URL}/confirm/${token}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Confirm Your Email</a>
            <br/>
            <br/>
            <p>If you did not register for this account, please ignore this email.</p>
            <br/>
            <br/>
            <p>Best regards,<br>The Learning Mongoose Team</p>
            `,
    };

    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    throw error;
  }
};
