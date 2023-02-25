<script>
  import { multipliers } from '../utils/constants.js'
  export let type
  let clazz;
  export { clazz as class };
</script>

<div class={`bet-multiplier bg-blue-500 z-10 px-[2px] rounded-[5px] text-white ${clazz}`}>
  <div class="triangle bg-blue-500 absolute top-[-11px] left-[50%] translate-x-[-50%]  w-3 h-3"></div>
  {multipliers[type]}:1
</div>

<style>
  .triangle {
    clip-path: polygon(50% 48%, 0% 100%, 100% 100%);
  }
</style>
