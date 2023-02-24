import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import Roulette from '../lib/Roulette.svelte';

const BALANCE = 10000,
  CYCLES = 1,
  COINS = 10,
  STRAIGHT = 35;

const customRender = (n) => {
  const wrapper = render(Roulette, { randomNumberGenerator: () => n });
  fireEvent.change(wrapper.getByPlaceholderText('Balance'), {
    target: { value: BALANCE },
  });
  fireEvent.change(wrapper.getByPlaceholderText('Cycles'), {
    target: { value: CYCLES },
  });
  fireEvent.change(wrapper.getByPlaceholderText('Coins'), {
    target: { value: COINS },
  });
  return wrapper;
};

const testWin = (allBets, gain, totalBets) => async () => {
  const wrapper = customRender(winN);
  await Promise.all(allBets.map((n) => fireEvent.click(wrapper.getByText(n))));
  await fireEvent.click(wrapper.getByText('Start'));
  const gain = STRAIGHT * COINS + COINS - totalBets;

  wrapper.getByText(`Total bet: ${totalBets}`);
  wrapper.getByText(`Last number: ${winN}`);
  wrapper.getByText(`Last gain: ${gain}`);
};

const testWinStraight = (winN, otherN) => async () => {
  const allBets = [winN, ...otherN];
  const totalBets = COINS * allBets.length;
  testWin(allBets, totalBets);
};

const testWinColumnDozen = (winN, otherN) => async () => {
  const col = (winN + 2) % 3;
  const allBets = [winN, ...otherN];
  const colBets = allBets.filter((n) => (n - col) % 3 === 0);
  const totalBets = COINS * colBets.length;
  testWin(allBets, totalBets);
};

const testWinRowDozen = (winN, otherN) => async () => {
  const allBets = [winN, ...otherN];
  const rowBets = allBets.filter(
    (n) => n >= 12 * (1 - 1) + 1 && n <= 12 * (1 - 1) + 12
  );
  const totalBets = COINS * rowBets.length + 1;
  testWin(allBets, totalBets);
};

const getRandom = (min, max) => parseInt(Math.random() * (max - min + 1)) + min;

describe('test all straight bets', () => {
  for (let winN = 1; winN <= 36; winN++) {
    const nOtherNumber = getRandom(4, 14);
    const otherN = [];
    for (let j = 1; j <= nOtherNumber; j++) {
      const r = getRandom(1, 36);
      if (r !== winN) {
        otherN.push(r);
      }
    }
    test(`straight bet to ${winN}`, testWinStraight(winN, otherN));
    test(
      `column dozen bet to ${winN} (col: ${(winN + 2) % 3})`,
      testWinColumnDozen(i, otherN)
    );
    test(`row dozen bet to ${winN} (row: the one ${winN} is placed)`, () => {
      const allBets = [winN, ...otherN];
      const rowBets = allBets.filter(
        (n) => n >= 12 * (1 - 1) + 1 && n <= 12 * (1 - 1) + 12
      );
      const totalBets = COINS * rowBets.length;
      testWin(allBets, totalBets);
    });
  }
});
