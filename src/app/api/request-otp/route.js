import { generateOTP, sendOTP, storeOTP } from '@/lib/otp';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    const validDomain = '@sowtech.co.in';
    if (!email.endsWith(validDomain)) {
      return new Response(JSON.stringify({ message: `Only emails ending with ${validDomain} are allowed` }), { status: 400 });
    }

    const otp = generateOTP();
    await sendOTP(email, otp);
    storeOTP(email, otp);

    return new Response(JSON.stringify({ message: 'OTP sent successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
