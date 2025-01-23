import NextAuth from "next-auth";
import { authOptions } from "@/utils/authOptions";

const nextAuthHandler = NextAuth(authOptions);
export { nextAuthHandler as GET, nextAuthHandler as POST };
