// src/lib/otp.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let otpStore = {}; 

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}
// console.log(transporter)
// console.log(process.env.EMAIL_USER)
// console.log(process.env.EMAIL_PASS)
export async function sendOTP(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
}

export function storeOTP(email, otp) {
  otpStore[email] = otp;
  setTimeout(() => delete otpStore[email], 10 * 60 * 1000); 
}

export function verifyOTP(email, otp) {
  return otpStore[email] === otp;
}
