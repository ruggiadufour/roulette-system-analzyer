<script lang="ts">
	import BetMultiplier from './BetMultiplier.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { multiplierTypes } from '../types';
	const dispatch = createEventDispatcher();
	export let text: string,
		id: string | number,
		type: multiplierTypes | 'disabled',
		bets = 0,
		color = 'white';
	let clazz = '';
	export { clazz as class };
	const betweens: multiplierTypes[] = ['SPLIT', 'STREET', 'CORNER', 'BASKET', 'SIXLINE'];
	let style: HTMLStyleElement | null = null;
	$: classColor = color === 'red' ? 'bg-red-500' : `bg-${color}`;

	const handleAddBet = (id: string | number) => dispatch('handleAddBet', { id, text, type });
	const handleSubstractBet = (id: string | number) =>
		dispatch('handleSubstractBet', { id, text, type });

	const handleMouseOver = () => {
		style = document.createElement('style');
		style.type = 'text/css';
		const classes = String(id)
			.split('-')
			.map((i) => `.id-${i}`)
			.join(', ');
		style.innerHTML = `
      .bet-number:not(${classes}){
        opacity: .3;
        transition: opacity .5s;
      }`;
		document.getElementsByTagName('head')[0].appendChild(style);
	};

	const handleMouseOut = () => style && style.remove();
</script>

{#if type === 'disabled'}
	<div class="relative min-h-[10px] w-full cursor-default" />
{:else if betweens.includes(type)}
	<div
		class="group relative min-h-[10px] w-full cursor-pointer"
		data-testid={id}
		on:click={() => handleAddBet(id)}
		on:contextmenu|preventDefault={() => handleSubstractBet(id)}
		on:mouseover={handleMouseOver}
		on:mouseout={handleMouseOut}
	>
		{#if bets}
			<span
				class="absolute inset-1/2 z-10 flex h-[20px] w-[20px] translate-y-[-50%] translate-x-[-50%] transform select-none items-center justify-center rounded-full bg-green-500 text-white"
			>
				{bets}
			</span>
		{/if}
		<BetMultiplier
			class="translate--[-50%] absolute top-[100%] left-[50%] hidden translate-x-[-50%] group-hover:block"
			{type}
		/>
	</div>
{:else}
	<button
		class={`bet-number group relative h-[40px] w-[40px] cursor-pointer ${classColor} flex items-center justify-center text-black text-${
			color !== 'white' ? 'white' : 'black'
		} id-${id} ${clazz || ''}`}
		data-testid={id}
		on:click={() => handleAddBet(id)}
		on:contextmenu|preventDefault={() => handleSubstractBet(id)}
	>
		{text}
		{#if bets}
			<span
				class="absolute inset-1/2 z-10 flex h-[20px] w-[20px] translate-y-[-50%] translate-x-[-50%] transform select-none items-center justify-center rounded-full bg-green-500 text-white"
			>
				{bets}
			</span>
		{/if}

		<BetMultiplier class="absolute bottom-[-20px] hidden group-hover:block" {type} />
	</button>
{/if}
