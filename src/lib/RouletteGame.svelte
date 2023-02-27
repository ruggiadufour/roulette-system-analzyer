<script lang="ts">
	import BetButton from './BetButton.svelte';
	import Roulette from './Roulette.svelte';
	import { generateBetNumbers } from '../utils';
	import { reds, multipliers, coins } from '../utils/constants';
	import { multipliersEnum, type betModel, type betTypes, type multiplierTypes } from '../types';

	export let randomNumberGenerator = () => Math.floor(Math.random() * 37) + 1;
	/* it generates the number bets () */
	let rows = generateBetNumbers();

	let coinSelected = 5;
	let balance = 1000;
	let cycles = 1;
	let rouletteNumber: number | string = 'None';
	let showStats = false;
	let keepStats = false;
	let logs: { rouletteNumber: number | string; earn: number; diffEarn: number }[] = [];
	let bets: Record<string | number, betModel> = {};
	let lastGain = 0;
	$: lostBets = logs.filter((v) => v.earn === 0).length;
	$: maxWin = logs.reduce((a, v) => (v.diffEarn > a ? v.diffEarn : a), 0);
	$: totalBet = Object.values(bets).reduce((acc, val) => val.bet + acc, 0);

	const handleAddBet = ({ detail }: { detail: betModel }) => {
		const sid = String(detail.id);
		if (!bets[sid]?.bet) {
			bets[sid] = detail;
			bets[sid].bet = coinSelected;
		} else {
			bets[sid].bet += coinSelected;
		}
	};

	const handleSubstractBet = ({ detail }: { detail: betModel }) => {
		const sid = String(detail.id);
		if (bets[sid].bet - coinSelected <= 0) {
			bets[sid].bet = 0;
			delete bets[sid];
		} else {
			bets[sid].bet -= coinSelected;
		}
	};

	const isInRange: Record<betTypes, (n: number) => boolean> = {
		'1_dozen': (n: number) => n <= 12,
		'2_dozen': (n: number) => n > 12 && n <= 24,
		'3_dozen': (n: number) => n > 24 && n <= 36,
		'1_dozen_col': (n: number) => (n - 1) % 3 === 0,
		'2_dozen_col': (n: number) => (n - 2) % 3 === 0,
		'3_dozen_col': (n: number) => (n - 3) % 3 === 0,
		'19_to_36': (n: number) => n >= 19 && n <= 36,
		'1_to_18': (n: number) => n >= 1 && n <= 18,
		odd: (n: number) => n % 2 !== 0,
		even: (n: number) => n % 2 === 0,
		black: (n: number) => !reds.includes(n),
		red: (n: number) => reds.includes(n)
	};

	const calculation = () => {
		rouletteNumber = randomNumberGenerator();
		if (rouletteNumber === 37) {
			rouletteNumber = '00';
		}
		balance -= totalBet;

		const betsArr = Object.entries(bets) as [betTypes, betModel][];
		const earn = betsArr.reduce((acc, [k, v]) => {
			const calc = (b: boolean): number => (b ? v.bet * multipliersEnum[v.type] + v.bet : 0) + acc;
			switch (v.type) {
				case 'STRAIGHT':
					return calc(rouletteNumber === v.id);
				case 'SPLIT':
				case 'STREET':
				case 'CORNER':
				case 'BASKET':
				case 'SIXLINE':
					return calc(String(v.id).split('-').includes(String(rouletteNumber)));
				default:
					return calc(isInRange[k](rouletteNumber as number));
			}
		}, 0);
		balance += earn;
		lastGain = earn - totalBet;
		logs = [...logs, { rouletteNumber, earn, diffEarn: earn - totalBet }];
	};

	const handleCalculate = () => {
		if (!keepStats) {
			logs = [];
		}
		for (let i = 0; i < cycles; i++) {
			calculation();
		}
		console.log(logs);
	};

	const zeroEdge: { id: string; type: multiplierTypes | 'disabled' }[] = [
		{ id: '0-00-1-2-3', type: 'BASKET' },
		{ id: '0-1', type: 'SPLIT' },
		{ id: '0-1-2', type: 'STREET' },
		{ id: '0-1-2', type: 'disabled' },
		{ id: '00-2-3', type: 'STREET' },
		{ id: '00-3', type: 'SPLIT' }
	];
	const dozenCols = ['1_dozen_col', '2_dozen_col', '3_dozen_col'];
</script>

<div class="roulette max-w-[500px]s grid grid-cols-[1fr_1fr] gap-5">
	<div class="flex flex-col">
		<div class="relative mb-6 aspect-square w-full">
			<Roulette />
		</div>

		<div class="mb-2 flex flex-col" title="Simulates the money">
			<label>Balance:</label>
			<input class="mb-2 text-center" placeholder="Balance" type="text" bind:value={balance} />
		</div>
		<div class="mb-2 flex flex-col" title="How many times play automatically">
			<label>Cycles:</label>
			<input class="text-center" placeholder="Cycles" type="text" bind:value={cycles} />
		</div>
		<label>Coin:</label>
		<select placeholder="Coins" class="mb-2 text-center" bind:value={coinSelected}>
			{#each coins as coin}
				<option value={coin}>{coin} coins</option>
			{/each}
		</select>
		<div
			class="mb-2 flex items-center justify-center gap-2"
			title="If checked, after each play it will remain the previous stats"
		>
			<label for="keep-stats">Keep stats:</label>
			<input id="keep-stats" type="checkbox" bind:checked={keepStats} />
		</div>
		<button class="mb-2" on:click={() => (bets = {})}> Clear bets </button>
		<button on:click={handleCalculate}> Start </button>
		<span class="mt-5 bg-blue-500 font-bold">Total bet: {totalBet}</span>
		<span class="mb-5 mt-5 bg-red-500 font-bold">Last number: {rouletteNumber}</span>
		<span class="mb-10 bg-green-500 font-bold">Last gain: {lastGain}</span>
	</div>

	<div class="mb-10 grid grid-cols-[100px_auto]">
		<!-- side bets -->
		<div class="mt-[50px] mb-[50px] flex flex-col items-center justify-evenly gap-[10px]">
			<div class="flex h-full w-full justify-center gap-[10px]">
				<div class="flex w-full flex-col items-center justify-center gap-[10px]">
					<BetButton
						id="1_to_18"
						text="1 to 18"
						type="SIMPLE"
						bets={bets['1_to_18']?.bet || 0}
						on:handleSubstractBet={handleSubstractBet}
						on:handleAddBet={handleAddBet}
						class="h-full w-full"
					/>
					<BetButton
						id="even"
						text="Even"
						type="SIMPLE"
						bets={bets['even']?.bet || 0}
						on:handleSubstractBet={handleSubstractBet}
						on:handleAddBet={handleAddBet}
						class="h-full w-full"
					/>
				</div>
				<BetButton
					id="1_dozen"
					text="1st dozen"
					type="DOUBLE"
					bets={bets['1_dozen']?.bet || 0}
					on:handleSubstractBet={handleSubstractBet}
					on:handleAddBet={handleAddBet}
					class="h-full w-full"
				/>
			</div>
			<div class="flex h-full w-full justify-center gap-[10px]">
				<div class="flex w-full flex-col items-center justify-center gap-[10px]">
					<BetButton
						id="black"
						text="Black"
						type="SIMPLE"
						bets={bets['black']?.bet || 0}
						on:handleSubstractBet={handleSubstractBet}
						on:handleAddBet={handleAddBet}
						class="h-full w-full"
					/>
					<BetButton
						id="red"
						text="Red"
						type="SIMPLE"
						bets={bets['red']?.bet || 0}
						on:handleSubstractBet={handleSubstractBet}
						on:handleAddBet={handleAddBet}
						class="h-full w-full"
					/>
				</div>
				<BetButton
					id="2_dozen"
					text="2nd dozen"
					type="DOUBLE"
					bets={bets['2_dozen']?.bet || 0}
					on:handleSubstractBet={handleSubstractBet}
					on:handleAddBet={handleAddBet}
					class="h-full w-full"
				/>
			</div>
			<div class="flex h-full w-full justify-center gap-[10px]">
				<div class="flex w-full flex-col items-center justify-center gap-[10px]">
					<BetButton
						id="odd"
						text="Odd"
						type="SIMPLE"
						bets={bets['odd']?.bet || 0}
						on:handleSubstractBet={handleSubstractBet}
						on:handleAddBet={handleAddBet}
						class="h-full w-full"
					/>
					<BetButton
						id="19_to_36"
						text="19 to 36"
						type="SIMPLE"
						bets={bets['19_to_36']?.bet || 0}
						on:handleSubstractBet={handleSubstractBet}
						on:handleAddBet={handleAddBet}
						class="h-full w-full"
					/>
				</div>
				<BetButton
					id="3_dozen"
					text="3rd dozen"
					type="DOUBLE"
					bets={bets['3_dozen']?.bet || 0}
					on:handleSubstractBet={handleSubstractBet}
					on:handleAddBet={handleAddBet}
					class="h-full w-full"
				/>
			</div>
		</div>

		<!-- number bets -->
		<div class="w-min">
			<!-- zero -->
			<div class="flex gap-[10px]">
				<BetButton
					id="0"
					text="0"
					type="STRAIGHT"
					bets={bets[0]?.bet || 0}
					on:handleSubstractBet={handleSubstractBet}
					on:handleAddBet={handleAddBet}
					class="ml-[10px] w-full"
				/>
				<BetButton
					id="00"
					text="00"
					type="STRAIGHT"
					bets={bets['00']?.bet || 0}
					on:handleSubstractBet={handleSubstractBet}
					on:handleAddBet={handleAddBet}
					class="w-full"
				/>
			</div>
			<div class="grid grid-cols-[10px_auto_10px_auto_10px_auto]">
				{#each zeroEdge as edge}
					<BetButton
						id={edge.id}
						text="0"
						type={edge.type}
						bets={bets[edge.id]?.bet || 0}
						on:handleSubstractBet={handleSubstractBet}
						on:handleAddBet={handleAddBet}
					/>
				{/each}
			</div>

			<!-- 36 numbers -->
			<div class="numbers-wrapper grid grid-cols-[10px_auto_10px_auto_10px_auto]">
				{#each rows as row}
					{#each row as el}
						<BetButton
							{...el}
							bets={bets[el.id]?.bet || 0}
							color={reds.includes(Number(el.id)) ? 'red' : 'black'}
							on:handleSubstractBet={handleSubstractBet}
							on:handleAddBet={handleAddBet}
						/>
					{/each}
				{/each}
			</div>

			<!-- dozen cols -->
			<div class="mt-[10px] ml-[10px] flex gap-[10px]">
				{#each dozenCols as id}
					<BetButton
						{id}
						text="2:1"
						type="DOUBLE"
						bets={bets[id]?.bet || 0}
						on:handleSubstractBet={handleSubstractBet}
						on:handleAddBet={handleAddBet}
					/>
				{/each}
			</div>
		</div>
	</div>

	<!-- stats -->
	{#if logs.length}
		<div class={`fixed left-0 bottom-0 z-20 flex h-max w-full flex-col bg-red-500 p-2`}>
			<span class="cursor-pointer text-lg font-semibold" on:click={() => (showStats = !showStats)}>
				Stats
			</span>
			{#if showStats}
				<div class="flex flex-col">
					<span>
						<span class="font-bold">System efficiency:</span>
						<span>
							{(((logs.length - lostBets) / logs.length) * 100).toFixed(2)}% ({logs.length -
								lostBets}/{logs.length})
						</span>
					</span>
					<span>
						<span class="font-bold">Max win:</span>
						<span> {maxWin} </span>
					</span>
					<span>
						<span class="font-bold">Cycles to recover lost:</span>
						<span> {(totalBet / maxWin).toFixed(2)} </span>
					</span>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	button {
		color: black;
		background-color: white;
		border-radius: 0;
	}
</style>
