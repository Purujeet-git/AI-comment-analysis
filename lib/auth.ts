import type { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions: NextAuthOptions = {
    providers: [
        FacebookProvider({
            clientId: process.env.META_CLIENT_ID!,
            clientSecret: process.env.META_CLIENT_SECRET!,

            authorization: {
                params: {
                    scope: [
                        "public_profile",
                        "pages_show_list",
                        "pages_read_engagement",
                        "business_management",
                    ].join(","),
                },
            },
        })
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, account }) {
            // Initial sign in
            if (account) {
                token.provider = account.provider;

                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;

                // Facebook User ID
                token.facebookUserId = account.providerAccountId;
            }

            return token;
        },

        async session({ session, token }) {
            session.provider = token.provider;

            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.expiresAt = token.expiresAt;

            session.user.facebookUserId = token.facebookUserId;
            session.user.facebookName = token.facebookName;
            session.user.facebookEmail = token.facebookEmail;

            session.user.pageId = token.pageId;
            session.user.pageName = token.pageName;

            session.user.instagramBusinessId = token.instagramBusinessId;
            session.user.instagramUsername = token.instagramUsername;

            session.user.role = token.role;

            return session;
        },
    }
};