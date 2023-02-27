<script lang="ts">
	import { type multiplierTypes, multipliersEnum } from '../types';

	export let type: multiplierTypes;
	let clazz = '';
	export { clazz as class };
</script>

<div class={`bet-multiplier z-10 rounded-[5px] bg-blue-500 px-[2px] text-white ${clazz}`}>
	<div class="triangle absolute top-[-11px] left-[50%] h-3 w-3  translate-x-[-50%] bg-blue-500" />
	{multipliersEnum[type]}:1
</div>

<style>
	.triangle {
		clip-path: polygon(50% 48%, 0% 100%, 100% 100%);
	}
</style>
