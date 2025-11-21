import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        await connectDB();
        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user) throw new Error("No user found");
        
        // If user has no password (e.g. Google auth), force them to use Google
        if (!user.password) throw new Error("Please login with Google");
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
            isVerified: true,
          });
        } else {
          // Allow Google login for existing users (even if provider is 'email')
          // We trust Google's verification of the email address
          return true;
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user) {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email });
        if (dbUser) {
          // @ts-ignore
          session.user.id = dbUser._id.toString();
          session.user.name = dbUser.name;
          session.user.image = dbUser.image;
        }
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};