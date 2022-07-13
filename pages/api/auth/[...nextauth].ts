import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { db, dbUsers } from '../../../database';

export default NextAuth({
  providers: [
    // OAuth authentication providers...

    Credentials({
      name: 'Custom Login',
      credentials: {
        email: {
          label: 'Email:',
          type: 'email',
          placeholder: 'email@email.com',
        },
        password: {
          label: 'Password:',
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials) {
        console.log({ credentials });
        //TODO: validate
        //return { name: 'John', email: 'john@google.com', role: 'admin' };
        return await dbUsers.checkUserEmail(
          credentials!.email,
          credentials!.password
        );
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  session: {
    maxAge: 2592000,
    strategy: 'jwt',
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {},

  // Callbacks
  callbacks: {
    async jwt({ token, account, user }) {
      //console.log({ token, account, user });
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(
              user?.email || '',
              user?.name || ''
            );
            break;
          case 'credentials':
            token.user = user;
            break;
        }
      }

      return token;
    },

    async session({ session, token, user }) {
      //console.log({ session, token, user });
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    },
  },
});
