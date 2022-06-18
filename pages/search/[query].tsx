import { Typography } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui';
import { useRouter } from 'next/router';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

interface Props {
	products: IProduct[];
}

const SearchPage: NextPage<Props> = ({ products }) => {
	return (
		<ShopLayout
			title={'Teslo-Shop - Search'}
			pageDescription={'Encuentra Productos'}
		>
			<Typography variant='h1' component={'h1'}>
				Buscar producto
			</Typography>
			<Typography variant='h2' sx={{ mb: 1 }}>
				ABC --- 123
			</Typography>
			<ProductList products={products} />
		</ShopLayout>
	);
};

export default SearchPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const { query = '' } = params as { query: string };

	if (query?.length === 0) {
		return {
			redirect: {
				destination: '/',
				permanent: true,
			},
		};
	}

	// TODO: retornar otros productos
	let products = await dbProducts.getProductsByTerm(query);

	return {
		props: {
			products,
		},
	};
};
