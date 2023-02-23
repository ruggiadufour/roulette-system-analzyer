<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  export let text, id, type, bets = 0, color = 'white'
  let clazz;
  export { clazz as class };
  $: classColor = color === 'red' ? 'bg-red-500' : `bg-${color}`

  const handleAddBet = (id)=> dispatch('handleAddBet',{id,text,type})
  const handleSubstractBet = (id)=> dispatch('handleSubstractBet',{id,text,type})
</script>

{#if type.includes('between-number') || type==='zero-number'}
  <div 
    class="relative w-full min-h-[10px] cursor-pointer"
    on:click={()=>handleAddBet(id)}
    on:contextmenu|preventDefault={()=>handleSubstractBet(id)}
  >
    {#if bets}
      <span 
        class="absolute inset-1/2 bg-green-500 transform w-[20px] h-[20px] translate-y-[-50%] translate-x-[-50%] text-white rounded-full flex items-center justify-center select-none z-10"
      >
        {bets}
      </span>
    {/if}
  </div>
{:else}
  <button 
    class={`relative cursor-pointer w-[40px] h-[40px] ${classColor} text-black flex items-center justify-center ${clazz || ''} text-${color!=='white'?'white':'black'} id-${type==='number'?`number-${id}`:id}`}
    on:click={()=>handleAddBet(id)}
    on:contextmenu|preventDefault={()=>handleSubstractBet(id)}
  >
      {text}
      {#if bets}
        <span 
          class="absolute inset-1/2 bg-green-500 transform w-[20px] h-[20px] translate-y-[-50%] translate-x-[-50%] text-white rounded-full flex items-center justify-center select-none z-10"
        >
          {bets}
        </span>
      {/if}
  </button>
{/if}

<style global></style>