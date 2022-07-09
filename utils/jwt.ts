import jwt from 'jsonwebtoken';

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('No JWT seed - Check env variables');
  }

  return jwt.sign(
    //payload
    {
      _id, email,

    },
    //seed
    process.env.JWT_SECRET_SEED,

    // Options
    {
      expiresIn: '30d',
    },
  );
};