import React, { FC, useReducer, ReactNode } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
	cart: ICartProduct[];
}

const CART_INITIAL_STATE: CartState = {
	cart: [],
};

type ProviderProps = {
	children: ReactNode;
};

export const CartProvider = ({ children }: ProviderProps) => {
	const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

	const addProductToCart = (product: ICartProduct) => {
		//dispatch({ type: '[Cart] - Add Product', payload: product });

		const productInCart = state.cart.some((p) => p._id === product._id);
		if (!productInCart)
			return dispatch({
				type: '[Cart] - Update products in cart',
				payload: [...state.cart, product],
			});
		const productInCartButDifferentSize = state.cart.some(
			(p) => p._id === product._id && p.size === product.size
		);

		if (!productInCartButDifferentSize)
			return dispatch({
				type: '[Cart] - Update products in cart',
				payload: [...state.cart, product],
			});

		// Acumular
		const updateProduct = state.cart.map((p) => {
			if (p._id !== product._id) return p;
			if (p.size !== product.size) return p;

			p.quantity += product.quantity;
			return p;
		});

		dispatch({
			type: '[Cart] - Update products in cart',
			payload: updateProduct,
		});
	};

	return (
		<CartContext.Provider
			value={{
				...state,
				addProductToCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
