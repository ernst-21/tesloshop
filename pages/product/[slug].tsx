import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { ShopLayout } from '../../components/layouts';
import { ProductSlideShow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { CartContext } from '../../context';
import { dbProducts } from '../../database';
import { ICartProduct, IProduct, ISize } from '../../interfaces';

interface Props {
	product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
	const router = useRouter();
	const { addProductToCart } = useContext(CartContext);
	const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
		_id: product._id,
		image: product.images[0],
		price: product.price,
		size: undefined,
		slug: product.slug,
		title: product.title,
		gender: product.gender,
		quantity: 1,
	});

	const selectedSize = (size: ISize) => {
		setTempCartProduct((currentProduct) => ({
			...currentProduct,
			size,
		}));
	};

	const onAddProduct = () => {
		if (!tempCartProduct.size) return;
		//TODO: llamar la acción del context para añadir al carrito

		addProductToCart(tempCartProduct);
		router.push('/cart');
	};

	const onUpdateQuantity = (quantity: number) => {
		setTempCartProduct((currentProduct) => ({
			...currentProduct,
			quantity,
		}));
	};

	return (
		<ShopLayout title={product.title} pageDescription={product.description}>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={7}>
					<ProductSlideShow images={product.images} />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Box display={'flex'} flexDirection={'column'}>
						{/* Titles */}
						<Typography variant='h1' component={'h1'}>
							{product.title}
						</Typography>
						<Typography variant='subtitle1' component={'h2'}>
							${product.price}
						</Typography>
						{/* Amount */}
						<Box sx={{ my: 2 }}>
							<Typography variant='subtitle2'>Cantidad</Typography>
							<ItemCounter
								currentValue={tempCartProduct.quantity}
								updateQuantity={onUpdateQuantity}
								maxValue={product.inStock > 10 ? 10 : product.inStock}
							/>
							<SizeSelector
								selectedSize={tempCartProduct.size}
								sizes={product?.sizes}
								onSelectedSize={(size) => selectedSize(size)}
							/>
						</Box>
						{/* Add to cart */}

						{product.inStock > 0 ? (
							<Button
								onClick={onAddProduct}
								color='secondary'
								className='circular-btn'
							>
								{tempCartProduct.size
									? 'Agregar al carrito'
									: 'Seleccione una talla'}
							</Button>
						) : (
							<Chip label='No disponible' color='error' variant='outlined' />
						)}

						{/* Description */}
						<Box sx={{ mt: 3 }}>
							<Typography variant='subtitle2'>Descripción</Typography>
							<Typography variant='body2'>{product.description}</Typography>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default ProductPage;

export const getStaticPaths: GetStaticPaths = async (ctx) => {
	const productSlugs = await dbProducts.getAllProductSlugs();

	return {
		paths: productSlugs.map(({ slug }) => ({
			params: {
				slug,
			},
		})),
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug = '' } = params as { slug: string };
	const product = await dbProducts.getProductBySlug(slug);

	if (!product) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {
			product,
		},
		// revalidar cada 24hrs
		revalidate: 60 * 60 * 24,
	};
};
