import axios from 'axios';

export interface ICurrency {
	id: number;
	name: string;
	sign?: string;
	symbol: string;
}

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';

export const getCryptoCurrencies = async (): Promise<ICurrency[]> => {
	try {
		const response = await axios.get(`${SERVER_URL}cryptocurrencies`);

		const {
			data: { currencies },
		} = response;

		return currencies;
	} catch (error: any) {
		throw new Error(error?.message);
	}
};

export const getFiatCurrencies = async (): Promise<ICurrency[]> => {
	try {
		const response = await axios.get(`${SERVER_URL}fiats`);

		const {
			data: { currencies },
		} = response;

		return currencies;
	} catch (error: any) {
		throw new Error(error?.message);
	}
};

export const convertCurrency = async (
	from: string,
	to: string,
	amount: number
): Promise<number> => {
	try {
		const response = await axios.get(
			`${SERVER_URL}convert/${amount}/${from}/${to}`
		);
		const {
			data: { amount: result },
		} = response;

		return result;
	} catch (error: any) {
		throw new Error(error?.message);
	}
};
