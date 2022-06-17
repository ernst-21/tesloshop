import React, { FC, useReducer, ReactNode } from 'react';
import { UiContext, uiReducer } from './';

export interface UiState {
	isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
	isMenuOpen: false,
};

type ProviderProps = {
	children: ReactNode;
};

export const UiProvider = ({ children }: ProviderProps) => {
	const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

	const toggleSideMenu = () => {
		dispatch({ type: '[UI] - ToggleMenu' });
	};

	return (
		<UiContext.Provider
			value={{
				...state,
				toggleSideMenu,
			}}
		>
			{children}
		</UiContext.Provider>
	);
};
