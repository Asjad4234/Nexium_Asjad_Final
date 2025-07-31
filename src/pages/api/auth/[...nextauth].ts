import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { clientPromise } from '../../../lib/mongodb';
import type { NextAuthOptions } from "next-auth"

// Validate environment variables
if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not set');
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('GOOGLE_CLIENT_SECRET is not set');
}
if (!process.env.NEXTAUTH_URL) {
    throw new Error('NEXTAUTH_URL is not set');
}
if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET is not set');
}

console.log('NextAuth Config - Environment Variables:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING');

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile: (profile) => {
                return {
                    id: profile.sub,
                    name: profile.name || 'Anonymous',
                    email: profile.email,
                    image: profile.picture || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y', // Default image if not provided
                }
            }
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error', // Error code passed in query string as ?error=
        verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: undefined // If set, new users will be directed here on first sign in
    },
    callbacks: {
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            session.user.id = user.id;
            return session
        },
        async redirect({ url, baseUrl }) {
            console.log('NextAuth redirect callback:', { url, baseUrl });
            // Always redirect to the index page after sign-in, unless specific pages are requested
            if (url.includes('RecipeDetail') || url.includes('ChatAssistant')) return url
            return baseUrl; // this is equivalent to '/'
        },
        async signIn({ user, account, profile, email, credentials }) {
            console.log('NextAuth signIn callback:', { 
                user: user?.email, 
                account: account?.provider,
                profile: profile?.email 
            });
            return true;
        }
    },
    debug: true, // Enable debug mode to see detailed logs
    logger: {
        error(code, ...message) {
            console.error('NextAuth Error:', code, ...message);
        },
        warn(code, ...message) {
            console.warn('NextAuth Warning:', code, ...message);
        },
        debug(code, ...message) {
            console.log('NextAuth Debug:', code, ...message);
        }
    }
}

export default NextAuth(authOptions)