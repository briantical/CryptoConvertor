import React, { useEffect, useState } from 'react';
import currency from 'currency.js';

import {
	ICurrency,
	convertCurrency,
	getFiatCurrencies,
	getCryptoCurrencies,
} from './utils';

const initCurrency: ICurrency = {
	id: 0,
	name: '',
	sign: '',
	symbol: '',
};

const ResultDisplay: React.FC<{
	amount: number;
	curr: ICurrency;
	className?: string;
}> = ({ amount, curr, className }) => {
	const { name, symbol, sign } = curr || initCurrency;

	return (
		<>
			<span className={className}>
				{` ${currency(amount, { separator: ',', symbol: '' }).format()}`}
			</span>
			<span>
				{name ? ` ${name} ${sign ? `"${sign}"` : ''} (${symbol}) ` : ''}
			</span>
		</>
	);
};

const App: React.FC = () => {
	const [loading, setLoading] = useState(true);

	const [to, setTo] = useState<string>('USD');
	const [from, setFrom] = useState<string>('BTC');

	const [fromCurrencies, setFromCurrencies] = useState<ICurrency[]>([]);
	const [toCurrencies, setToCurrencies] = useState<ICurrency[]>([]);

	const [amount, setAmount] = useState<number>(0);
	const [converted, setConverted] = useState<number>(0);

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(parseInt(e.target.value) || 0);
	};

	const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setTo(e.target.value);
	};

	const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setFrom(e.target.value);
	};

	const handleCurrencySwap = () => {
		setFrom(to);
		setTo(from);

		setFromCurrencies(toCurrencies);
		setToCurrencies(fromCurrencies);
	};

	useEffect(() => {
		const getCurrencies = async () => {
			setLoading(true);
			try {
				const cryptos = await getCryptoCurrencies();
				const fiats = await getFiatCurrencies();

				setFromCurrencies(cryptos);
				setToCurrencies(fiats);

				setLoading(false);
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		};

		getCurrencies();
	}, []);

	useEffect(() => {
		const handleCurrencyConversion = async () => {
			try {
				const conversion = await convertCurrency(from, to, amount);
				setConverted(conversion || 0);
			} catch (error: any) {
				console.log(error.message);
			}
		};

		handleCurrencyConversion();
	}, [from, to, amount]);

	const fromCurrency = fromCurrencies.find(({ symbol }) => symbol === from)!;
	const toCurrency = toCurrencies.find(({ symbol }) => symbol === to)!;

	return (
		<div className="container h-100 w-100">
			<div className="d-flex flex-column bg-light p-3">
				<div className="row justify-content-between align-items-center">
					<div className="col-5">
						<input
							min="0"
							step="0.1"
							type="number"
							id="amount"
							name="amount"
							value={amount}
							disabled={loading}
							onChange={handleAmountChange}
							className="form-control"
						/>
					</div>
				</div>

				<div className="row justify-content-between align-items-center">
					<div className="col-5">
						<select
							id="from"
							name="from"
							value={from}
							disabled={loading}
							className="form-select"
							onChange={handleFromChange}
						>
							<option value="">Select currency</option>
							{fromCurrencies.map((currency) => {
								const { id, name, symbol, sign } = currency;
								return (
									<option key={id} value={symbol}>
										{`${name} ${sign ? `"${sign}"` : ''} (${symbol})`}
									</option>
								);
							})}
						</select>
					</div>

					<div className="col-1 flex-grow-1">
						<button
							type="button"
							disabled={loading}
							onClick={handleCurrencySwap}
							className="btn btn-sm btn-primary w-100"
						>
							<i className="bi bi-arrow-left-right" />
						</button>
					</div>

					<div className="col-5 my-3">
						<select
							id="to"
							name="to"
							value={to}
							disabled={loading}
							className="form-select"
							onChange={handleToChange}
						>
							<option value="">Select currency</option>
							{toCurrencies.map((currency) => {
								const { id, name, symbol, sign } = currency;
								return (
									<option key={id} value={symbol}>
										{`${name} ${sign ? `"${sign}"` : ''} (${symbol})`}
									</option>
								);
							})}
						</select>
					</div>
				</div>

				<div className="d-flex justify-content-center align-items-center">
					<ResultDisplay amount={amount} curr={fromCurrency} />
					{` = `}
					<ResultDisplay
						amount={converted}
						curr={toCurrency}
						className="fw-bold mx-1"
					/>
				</div>
			</div>
		</div>
	);
};

export default App;
