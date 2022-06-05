import type { NextApiRequest, NextApiResponse } from 'next';

type Data = { message: string };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	res.status(400).json({ message: 'Must specify search query' });
}
