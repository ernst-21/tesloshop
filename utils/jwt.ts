import jwt from 'jsonwebtoken';

export const signToken = (_id: string, email: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('No JWT seed - Check env variables');
  }

  return jwt.sign(
    //payload
    {
      _id,
      email,
    },
    //seed
    process.env.JWT_SECRET_SEED,

    // Options
    {
      expiresIn: '30d',
    }
  );
};

export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('No JWT seed - Check env variables');
  }

  // if (token.length < 10) {
  //   Promise.reject('Invalid JWT');
  // }

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
        if (err) return reject('Not valid JWT');
        const { _id } = payload as { _id: string };

        resolve(_id);
      });
    } catch (error) {
      reject('Not valid JWT');
    }
  });
};
