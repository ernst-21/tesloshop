import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui';
import { useRouter } from 'next/router';

const SearchPage: NextPage = () => {
	const { query } = useRouter();

	const { products, isLoading } = useProducts(`/search/${query.query}`);

	return (
		<ShopLayout
			title={'Teslo-Shop - Search'}
			pageDescription={'Encuentra Productos'}
		>
			<Typography variant='h1' component={'h1'}>
				Buscar producto
			</Typography>
			<Typography variant='h2' sx={{ mb: 1 }}>
				"{query.query}"
			</Typography>
			{isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
		</ShopLayout>
	);
};

export default SearchPage;
