import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT, 10) || 3001;
const API_KEY: string =
	process.env.COIN_MARKET_CAP_API_KEY! ||
	'db496c63-4b91-4857-845c-71dd2eadf2ca';

const requestOptions = {
	headers: {
		'X-CMC_PRO_API_KEY': API_KEY,
	},
};

app.use(cors());
app.use(express.json());

app.use('/cryptocurrencies', async (req: Request, res: Response) => {
	try {
		const response = await axios.get(
			`https://pro-api.coinmarketcap.com/v1/cryptocurrency/map`,
			requestOptions
		);

		const {
			data: { data: currencies },
		} = response;
		return res.json({ currencies });
	} catch (error: any) {
		res.json({ error: error.message, code: error.code });
	}
});

app.use('/fiats', async (req: Request, res: Response) => {
	try {
		const response = await axios.get(
			`https://pro-api.coinmarketcap.com/v1/fiat/map`,
			requestOptions
		);

		const {
			data: { data: currencies },
		} = response;
		return res.json({ currencies });
	} catch (error: any) {
		res.json({ error: error.message, code: error.code });
	}
});

app.use('/convert/:amount/:from/:to', async (req: Request, res: Response) => {
	const amount = req.params.amount;
	const from = req.params.from;
	const to = req.params.to;

	console.log('req.params', req.params);

	try {
		const response = await axios.get(
			`https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=${amount}&symbol=${from}&convert=${to}`,
			requestOptions
		);

		const {
			data: {
				data: { quote },
			},
		} = response;
		return res.json({ amount: quote[to].price });
	} catch (error: any) {
		res.json({ error: error.message, code: error.code });
	}
});

if (process.env.NODE_ENV === 'production') {
	//Set Static folder
	app.use(express.static('build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
	});
}

app.listen(PORT, function () {
	console.log(`Express server listening on port ${PORT}`);
});
