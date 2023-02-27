import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import Roulette from '../lib/Roulette.svelte';
import { multipliers_enum, reds, sideBetIds } from '../utils/constants.js';
import { getNumberCol, getNumberRow } from '../utils';

const BALANCE = 10000,
  CYCLES = 1,
  COINS = 10;

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

const testWin = async (winN, otherN, totalBets, gain) => {
  const wrapper = customRender(winN);
  await Promise.all(otherN.map((n) => fireEvent.click(wrapper.getByTestId(n))));
  await fireEvent.click(wrapper.getByText('Start'));

  expect(wrapper.getByText(`Total bet: ${totalBets}`)).toBeTruthy();
  expect(wrapper.getByText(`Last number: ${winN}`)).toBeTruthy();
  expect(wrapper.getByText(`Last gain: ${gain}`)).toBeTruthy();
};

const getRandom = (min, max) => parseInt(Math.random() * (max - min + 1)) + min;
let map = new Map();
for (let winN = 1; winN <= 36; winN++) {
  const nRandomBets = getRandom(4, 14);
  let randomBets = [];
  for (let j = 1; j <= nRandomBets; j++) {
    const randomBet = getRandom(1, 36);
    if (randomBet !== winN) {
      randomBets.push(randomBet);
    }
  }
  randomBets = [...new Set(randomBets)];
  map.set(winN, randomBets);
}

describe('test all kind of bet', () => {
  map.forEach((randomBets, winN) => {
    test(`straight bet to ${winN}`, () => {
      const allBets = [winN, ...randomBets];
      const totalBets = COINS * allBets.length;
      const gain = multipliers_enum.STRAIGHT * COINS + COINS - totalBets;

      testWin(winN, allBets, totalBets, gain);
    });
    test(`column dozen bet (win ${winN})`, () => {
      const col = getNumberCol(winN);
      const allBets = [...randomBets, `${col}_dozen_col`];
      const totalBets = COINS * allBets.length;
      const gain = (multipliers_enum.DOUBLE + 1) * COINS - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test(`row dozen bet (win ${winN})`, () => {
      const row = getNumberRow(winN);
      const allBets = [...randomBets, `${row}_dozen`];
      const totalBets = COINS * allBets.length;
      const gain = (multipliers_enum.DOUBLE + 1) * COINS - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test(`red bet to (${winN})`, () => {
      const allBets = [...randomBets, `red`];
      const totalBets = COINS * allBets.length;
      const earn = reds.includes(winN)
        ? (multipliers_enum.SIMPLE + 1) * COINS
        : 0;
      const gain = earn - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test(`black bet to (${winN})`, () => {
      const allBets = [...randomBets, `black`];
      const totalBets = COINS * allBets.length;
      const earn = !reds.includes(winN)
        ? (multipliers_enum.SIMPLE + 1) * COINS
        : 0;
      const gain = earn - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test(`odd bet to (${winN})`, () => {
      const allBets = [...randomBets, `odd`];
      const totalBets = COINS * allBets.length;
      const earn = winN % 2 === 1 ? (multipliers_enum.SIMPLE + 1) * COINS : 0;
      const gain = earn - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test(`even bet to (${winN})`, () => {
      const allBets = [...randomBets, `even`];
      const totalBets = COINS * allBets.length;
      const earn = winN % 2 === 0 ? (multipliers_enum.SIMPLE + 1) * COINS : 0;
      const gain = earn - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test(`1-18 bet to (${winN})`, () => {
      const allBets = [...randomBets, `1_to_18`];
      const totalBets = COINS * allBets.length;
      const earn = winN <= 18 ? (multipliers_enum.SIMPLE + 1) * COINS : 0;
      const gain = earn - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test(`19-36 bet to (${winN})`, () => {
      const allBets = [...randomBets, `19_to_36`];
      const totalBets = COINS * allBets.length;
      const earn = winN > 18 ? (multipliers_enum.SIMPLE + 1) * COINS : 0;
      const gain = earn - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test(`all side bet to (${winN})`, () => {
      const allBets = [...randomBets, winN, ...sideBetIds];
      const totalBets = COINS * allBets.length;

      let earn = 0;
      // straight
      earn += (multipliers_enum.STRAIGHT + 1) * COINS;
      // column dozen
      earn += (multipliers_enum.DOUBLE + 1) * COINS;
      // regular dozen
      earn += (multipliers_enum.DOUBLE + 1) * COINS;
      // odd
      earn += winN % 2 === 1 ? (multipliers_enum.SIMPLE + 1) * COINS : 0;
      // even
      earn += winN % 2 === 0 ? (multipliers_enum.SIMPLE + 1) * COINS : 0;
      // red
      earn += reds.includes(winN) ? (multipliers_enum.SIMPLE + 1) * COINS : 0;
      // black
      earn += !reds.includes(winN) ? (multipliers_enum.SIMPLE + 1) * COINS : 0;
      // 1 to 18
      earn += winN <= 18 ? (multipliers_enum.SIMPLE + 1) * COINS : 0;
      // 19 to 36
      earn += winN > 18 ? (multipliers_enum.SIMPLE + 1) * COINS : 0;

      const gain = earn - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
  });
});
