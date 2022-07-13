import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces';
import { Product, Order } from '../../../models';

type Data =
  | {
      message: string;
    }
  | IOrder;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res);
    default:
      return res.status(400).json({ message: 'Bad request' });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { orderItems, total } = req.body as IOrder;

  // check that we have a user
  const session: any = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json({ message: 'You must be authenticated for this operation' });
  }

  // Create array of products

  const productsIds = orderItems.map((p) => p._id);
  await db.connect();

  const dbProducts = await Product.find({ _id: { $in: productsIds } });
  console.log({ dbProducts });

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find(
        (prod) => prod.id === current._id
      )?.price;

      if (!currentPrice) {
        throw new Error('Verify your cart again');
      }

      return currentPrice * current.quantity + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const backendTotal = subTotal * (taxRate + 1);

    if (backendTotal !== total) {
      throw new Error('Total do not match');
    }

    // Everything ok
    const userId = session.user._id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });
    await newOrder.save();
    await db.disconnect();

    return res.status(201).json(newOrder);
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    res.status(400).json({ message: error.message || 'Check server logs' });
  }

  return res.status(201).json(req.body);
};
