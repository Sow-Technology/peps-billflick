import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail, handleEmailSignIn } from "./app/_actions/auth";
import { User } from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "your-email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Retrieve existing user by email
        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
          // If user doesn't exist, create a new user
          const newUser = await handleEmailSignIn(email, password);
          return {
            id: newUser._id.toString(),
            email: newUser.email,
          };
        }

        // Verify password using bcrypt
        const isPasswordValid = await bcrypt.compare(
          password,
          existingUser.password
        );
        if (!isPasswordValid) {
          throw new Error("Invalid credentials"); // Throw error if password is incorrect
        }

        // Return user object if authorization is successful
        return {
          id: existingUser._id.toString(),
          email: existingUser.email,
          role: existingUser.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.email = token.email;
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user, account }) {
      if (account) {
        const existingUser = await User.findOne({ email: user.email });
        token.accessToken = account.access_token;
        token = { ...existingUser._doc };
        token.id = existingUser._id.toString();
        token.role = existingUser.role;
      }
      return token;
    },
  },
});
