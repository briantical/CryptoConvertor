import React from 'react';
import { shallow } from 'enzyme';
import App, { ResultDisplay } from './App';

describe('Crypto Convertor', () => {
	const component = shallow(<App />);
	const subComponent = shallow(
		<ResultDisplay
			amount={210}
			curr={{ id: 100, name: 'Bitcoin', symbol: 'BTC' }}
		/>
	);

	it('should render without crashing', () => {
		expect(component.exists()).toBe(true);
		expect(component.hasClass('convertor')).toBe(true);
	});

	it('Should render the ResultDisplay component', () => {
		expect(subComponent.exists()).toBe(true);

		const nodes = subComponent.find('span');
		expect(nodes.hostNodes()).toHaveLength(2);
	});

	it('Should have amount input', () => {
		const amountInput = component.find('input[name="amount"]');
		expect(amountInput.hostNodes()).toHaveLength(1);
	});

	it('Should have currency selects', () => {
		const selectNodes = component.find('select');
		expect(selectNodes.hostNodes()).toHaveLength(2);
	});
});
