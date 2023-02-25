import '@testing-library/jest-dom';
import { render, fireEvent, debug } from '@testing-library/svelte';
import Roulette from '../lib/Roulette.svelte';
import { multipliers_enum, reds } from '../utils/constants.js';

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

const testWin = async (winN, ids, totalBets, gain) => {
  const wrapper = customRender(winN);
  await Promise.all(ids.map((n) => fireEvent.click(wrapper.getByTestId(n))));
  await fireEvent.click(wrapper.getByText('Start'));

  expect(wrapper.queryByText(`Total bet: ${totalBets}`)).toBeTruthy();
  expect(wrapper.queryByText(`Last number: ${winN}`)).toBeTruthy();
  expect(wrapper.queryByText(`Last gain: ${gain}`)).toBeTruthy();
};

// const testSideBet = async (winN, ids,)=>{

// }

const getRandom = (min, max) => parseInt(Math.random() * (max - min + 1)) + min;

describe('test all kind of bet', () => {
  let map = new Map();
  for (let winN = 1; winN <= 36; winN++) {
    const nOtherNumber = getRandom(4, 14);
    let otherN = [];
    for (let j = 1; j <= nOtherNumber; j++) {
      const r = getRandom(1, 36);
      if (r !== winN) {
        otherN.push(r);
      }
    }
    otherN = [...new Set(otherN)];
    map.set(winN, otherN);
    test(`straight bet to ${winN}`, () => {
      const allBets = [winN, ...otherN];
      const totalBets = COINS * allBets.length + winN === 5 ? 1 : 0;
      const gain = multipliers_enum.STRAIGHT * COINS + COINS - totalBets;

      testWin(winN, allBets, totalBets, gain);
    });
    test.skip(`column dozen bet (win ${winN})`, () => {
      const col = ((winN - 1) % 3) + 1;
      const allBets = [...otherN, `${col}_dozen_col`];
      const totalBets = COINS * allBets.length;
      const gain = (multipliers_enum.DOUBLE + 1) * COINS - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test.skip(`row dozen bet (win ${winN})`, () => {
      const row = winN <= 12 ? 1 : winN <= 24 ? 2 : 3;
      const allBets = [...otherN, `${row}_dozen`];
      const totalBets = COINS * allBets.length;
      const gain = (multipliers_enum.DOUBLE + 1) * COINS - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test.skip(`red bet to (${winN})`, () => {
      const allBets = [...otherN, `red`];
      const totalBets = COINS * allBets.length;
      const earn = reds.includes(winN)
        ? (multipliers_enum.SIMPLE + 1) * COINS
        : 0;
      const gain = earn - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test.skip(`black bet to (${winN})`, () => {
      const allBets = [...otherN, `black`];
      const totalBets = COINS * allBets.length;
      const earn = !reds.includes(winN)
        ? (multipliers_enum.SIMPLE + 1) * COINS
        : 0;
      const gain = earn - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test.skip(`odd bet to (${winN})`, () => {
      const allBets = [...otherN, `odd`];
      const totalBets = COINS * allBets.length;
      const earn = winN % 2 === 1 ? (multipliers_enum.SIMPLE + 1) * COINS : 0;
      const gain = earn - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test.skip(`even bet to (${winN})`, () => {
      const allBets = [...otherN, `even`];
      const totalBets = COINS * allBets.length;
      const earn = winN % 2 === 0 ? (multipliers_enum.SIMPLE + 1) * COINS : 0;
      const gain = earn - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test.skip(`1-18 bet to (${winN})`, () => {
      const allBets = [...otherN, `1_to_18`];
      const totalBets = COINS * allBets.length;
      const earn = winN <= 18 ? (multipliers_enum.SIMPLE + 1) * COINS : 0;
      const gain = earn - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
    test.skip(`19-36 bet to (${winN})`, () => {
      const allBets = [...otherN, `19_to_36`];
      const totalBets = COINS * allBets.length;
      const earn = winN > 18 ? (multipliers_enum.SIMPLE + 1) * COINS : 0;
      const gain = earn - totalBets;
      testWin(winN, allBets, totalBets, gain);
    });
  }
});
