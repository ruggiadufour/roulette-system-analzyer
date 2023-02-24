import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import Roulette from '../lib/Roulette.svelte';

describe('Roulette', () => {
  it('test bet when is straight number', async () => {
    const wrapper = render(Roulette, { randomNumberGenerator: () => 1 });
    const number = wrapper.getByText('1');
    await fireEvent.click(number);

    const startBet = wrapper.getByText('Start');
    await fireEvent.click(startBet);

    wrapper.getByText('Last number: 1');
  });
});
