import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { User } from '../../../models';
import bcrypt from 'bcryptjs';
import { jwt } from '../../../utils';

type Data = | {
  message: string
} | {
  token: string;
  user: { name: string; email: string; role: string }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must have at least 6 characters' });
  }

  if (name.length < 2) {
    return res.status(400).json({ message: 'Name must have at least 2 characters' });
  }

  // todo: validate email
  //if (email)

  await db.connect();
  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const newUser = new User({
    email: email.toLocaleLowerCase(),
    password: bcrypt.hashSync(password),
    role: 'client',
    name,
  });

  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Check server logs' });
  }

  const { _id, role } = newUser;

  const token = jwt.signToken(_id, email);

  return res.status(200).json({
    token,
    user: {
      email,
      role,
      name,
    },
  });

};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return registerUser(req, res);
    default:
      res.status(400).json({ message: 'Bad Request' });
  }
}