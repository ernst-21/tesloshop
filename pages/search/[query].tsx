import { Box, Typography } from '@mui/material';
import type { GetServerSideProps, NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

interface Props {
	products: IProduct[];
	foundProducts: boolean;
	query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
	return (
		<ShopLayout
			title={'Teslo-Shop - Search'}
			pageDescription={'Encuentra Productos'}
		>
			<Typography variant='h1' component={'h1'}>
				Buscar productos
			</Typography>
			{foundProducts ? (
				<Typography textTransform={'capitalize'} variant='h2' sx={{ mb: 1 }}>
					{query}
				</Typography>
			) : (
				<Box display={'flex'}>
					<Typography variant='h2' sx={{ mb: 1 }}>
						No encontramos ningún producto
					</Typography>
					<Typography
						textTransform={'capitalize'}
						variant='h2'
						color='secondary'
						sx={{ ml: 1 }}
					>
						{query}
					</Typography>
				</Box>
			)}

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

	let products = await dbProducts.getProductsByTerm(query);
	const foundProducts = products.length > 0;

	// TODO: retornar otros productos
	if (!foundProducts) {
		products = await dbProducts.getAllProducts();
	}

	return {
		props: {
			products,
			foundProducts,
			query,
		},
	};
};
