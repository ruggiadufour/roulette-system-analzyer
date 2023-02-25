<script>
  import BetMultiplier from './BetMultiplier.svelte'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  export let text, id, type, bets = 0, color = 'white'
  let clazz;
  export { clazz as class };
  const betweens = ['split','street','corner','basket','six-line']
  let style = null
  $: classColor = color === 'red' ? 'bg-red-500' : `bg-${color}`

  const handleAddBet = (id)=> dispatch('handleAddBet',{id,text,type})
  const handleSubstractBet = (id)=> dispatch('handleSubstractBet',{id,text,type})

  const handleMouseOver = () => {
    style = document.createElement('style');
    style.type = 'text/css';
    const classes = id.split('-').map((i)=>`.id-${i}`).join(', ')
    style.innerHTML = `
      .bet-number:not(${classes}){
        opacity: .3;
        transition: opacity .5s;
      } 
    `;
    document.getElementsByTagName('head')[0].appendChild(style);
  }

  const handleMouseOut = () => {
    style.remove()
  }
</script>

{#if type==='disabled'}
  <div 
    class="relative w-full min-h-[10px] cursor-pointer"
  ></div>
{:else if betweens.includes(type)}
  <div 
    class="relative group w-full min-h-[10px] cursor-pointer"
    data-testid={id}
    on:click={()=>handleAddBet(id)}
    on:contextmenu|preventDefault={()=>handleSubstractBet(id)}
    on:mouseover={handleMouseOver}
    on:mouseout={handleMouseOut}
  >
    {#if bets}
      <span 
        class="absolute inset-1/2 bg-green-500 transform w-[20px] h-[20px] translate-y-[-50%] translate-x-[-50%] text-white rounded-full flex items-center justify-center select-none z-10"
      >
        {bets}
      </span>
    {/if}
    <BetMultiplier class="hidden group-hover:block absolute top-[100%] left-[50%] translate-x-[-50%] translate--[-50%]" type={type} />
  </div>
{:else}
  <button 
    class={`bet-number group relative cursor-pointer w-[40px] h-[40px] ${classColor} text-black flex items-center justify-center text-${color!=='white'?'white':'black'} id-${type==='number'?`number-${id}`:id} ${clazz || ''}`}
    data-testid={id}
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

      <BetMultiplier class="hidden group-hover:block absolute bottom-[-20px]" type={type} />
  </button>
{/if}
