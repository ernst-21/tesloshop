import React, { useReducer, ReactNode, useEffect, useState } from 'react';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie';

export interface CartState {
  cart: ICartProduct[];
  numberOfItems: number,
  subTotal: number,
  tax: number,
  total: number
}

const CART_INITIAL_STATE: CartState = {
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
};

type ProviderProps = {
  children: ReactNode;
};

export const CartProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);
  const [mounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const cookieProducts = Cookie.get('cart')
        ? JSON.parse(Cookie.get('cart')!)
        : [];
      dispatch({
        type: '[Cart] - LoadCart from cookie | storage',
        payload: cookieProducts,
      });
      setIsMounted(true);
    } catch (e) {
      console.log(e);
      dispatch({
        type: '[Cart] - LoadCart from cookie | storage',
        payload: [],
      });
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      Cookie.set('cart', JSON.stringify(state.cart));
    }
  }, [state.cart, mounted]);

  useEffect(() => {

    const numberOfItems = state.cart.reduce((prev, current: ICartProduct) => prev + current.quantity, 0);
    const subTotal = state.cart.reduce((prev, current: ICartProduct) => (current.price * current.quantity) + prev, 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total: subTotal * (taxRate + 1),
    };
    dispatch({type: '[Cart] - Update order summary', payload: orderSummary})
  }, [state.cart, mounted]);

  const addProductToCart = (product: ICartProduct) => {

    const productInCart = state.cart.some((p) => p._id === product._id);
    if (!productInCart)
      return dispatch({
        type: '[Cart] - Update products in cart',
        payload: [...state.cart, product],
      });
    const productInCartButDifferentSize = state.cart.some(
      (p) => p._id === product._id && p.size === product.size,
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

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Change cart quantity', payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[Cart] - Remove product in cart', payload: product });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
