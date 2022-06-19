import { ICartProduct } from '../../interfaces';
import { CartState } from './';

type CartActionType =
	| { type: '[Cart] - LoadCart from cookie | storage'; payload: ICartProduct[] }
	| { type: '[Cart] - Update products in cart'; payload: ICartProduct[] };

export const cartReducer = (
	state: CartState,
	action: CartActionType
): CartState => {
	switch (action.type) {
		case '[Cart] - LoadCart from cookie | storage':
			return {
				...state,
			};
		case '[Cart] - Update products in cart':
			return {
				...state,
				cart: [...action.payload],
			};
		default:
			return state;
	}
};
