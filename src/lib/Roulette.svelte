<script>
  import BetButton from './BetButton.svelte'

  /* it generates the number bets () */
  let rows = Array.from({length:12},(_,i)=>i+1)
    .map((v,i)=>{
      let arr = Array.from({length:3},(_,x)=>x+1)
        return arr.reduce((acc,val)=>{
          const id = val+3*i
          if((id-1)%3===0){
            acc.push({
              id: `${id}-${val+1+3*i}-${val+2+3*i}`,
              text: `${id}-${val+1+3*i}-${val+2+3*i}`,
              type: i%2===0?'street':'street'
            })
          }
          acc.push({
            id,
            text: id,
            type:'straight'
          })
          if(id<3*(i+1)){
            acc.push({
              id: `${id}-${val+1+3*i}`,
              text: `${id}-${val+1+3*i}`,
              type: 'split'
            })
          }
          return acc
        },[])
      })
    .reduce((acc,val,i,arr)=>{
      acc.push(val)
      if(arr[i+1]){
        acc.push(
          val.map((v,j)=>({
            id: `${v.id}-${arr[i+1][j].id}`,
            text: `${v.id}-${arr[i+1][j].id}`,
            type: j===0?'six-line':j%2===0?'corner':'split'
          }))
        )
      }
      return acc
    },[])

  const multipliers = {
    straight: 35,
    split: 15,
    street: 11,
    corner: 8,
    basket: 6,
    'six-line': 5,
    simple: 1,
    double: 2,
  }
  const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
  let coinSelected = 5
  let balance = 1000
  let cycles = 1
  let rouletteNumber = 'None'
  let showStats = false
  let keepStats = false
  let logs = []
  let bets = {}
  $: lostBets = logs.filter(v=>v.earn===0).length
  $: maxWin = logs.reduce((a,v)=>v.diffEarn>a ? v.diffEarn : a,0)
  $: totalBet = Object.values(bets).reduce((acc,val)=>val.bet+acc,0);

  const handleAddBet = ({detail})=>{
    const sid = String(detail.id)
    if(!bets[sid]?.bet){
      bets[sid] = detail
      bets[sid].bet = coinSelected
      
    } else {
      bets[sid].bet += coinSelected
    }
    console.log(bets,)
  }

  const handleSubstractBet = ({detail})=>{
    const sid = String(detail.id)
    if(bets[sid].bet - coinSelected <= 0) {
      bets[sid].bet = 0
      delete bets[sid]
    } else {
      bets[sid].bet -= coinSelected
    }
  }

  const isInRange = {
    '1_dozen':(n)=> n<=12,
    '2_dozen':(n)=> n>12 && n<=24,
    '3_dozen':(n)=> n>24 && n<=36,
    '1_dozen_col':(n)=> (n-1)%3===0,
    '2_dozen_col':(n)=> (n-2)%3===0,
    '3_dozen_col':(n)=> (n-3)%3===0,
    '19_to_36':(n)=>n>=19 && n<=36,
    '1_to_18':(n)=>n>=1 && n<=18,
    'odd':(n)=>n%2!==0,
    'even':(n)=>n%2===0,
    'black':(n)=>!reds.includes(n),
    'red':(n)=>reds.includes(n),
  }
  
  const calculation = ()=>{
    rouletteNumber = '00'//parseInt(Math.random()*37)
    if(rouletteNumber===37){
      rouletteNumber = '00'
    }
    balance-=totalBet

    const betsArr = Object.entries(bets)
    const earn = betsArr.reduce((acc,[k,v])=>{
      const calc = (b)=> (b ? v.bet*multipliers[v.type]+v.bet : 0) + acc
      switch (v.type){
        case 'straight':
          return calc(rouletteNumber===v.id)
        case 'split':
        case 'street':
        case 'corner':
        case 'basket':
        case 'six-line':
          return calc(v.id.split('-').includes(String(rouletteNumber)))
        default:
          return calc(isInRange[k](rouletteNumber))
      }
    },0)
    balance+=earn
    logs = [...logs, {rouletteNumber, earn, diffEarn: earn-totalBet}]
  }



  const handleCalculate = ()=>{
    if(!keepStats) {
      logs = []
    }
    for(let i = 0;i <cycles; i++) {
      calculation()
    }
    console.log(logs)
  }

  const zeroEdge = [
    {id: '0-00-1-2-3', type:'basket'},
    {id: '0-1', type:'split'},
    {id: '0-1-2', type:'street'},
    {id: '0-1-2', type:'disabled'},
    {id: '00-2-3', type:'street'},
    {id: '00-3', type:'split'},
  ]
  const dozenCols = ['1_dozen_col','2_dozen_col','3_dozen_col']
</script>
<div class="roulette max-w-[500px]">
  <div class="flex flex-col">
    <label>Balance:</label>
    <input class="text-center mb-2" type="text" bind:value={balance}>
    <label>Cycles:</label>
    <input class="text-center mb-2" type="text" bind:value={cycles}>
    <label>Coin:</label>
    <select class="text-center mb-2" bind:value={coinSelected}>
      <option value={1}>1</option>
      <option value={2}>2</option>
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>
    <div class="flex items-center justify-center gap-2 mb-2">
      <label for="keep-stats">Keep stats:</label>
      <input id="keep-stats" type="checkbox" bind:checked={keepStats}>
    </div>
    <button class="mb-2" on:click={()=>bets={}}>
      Clear bets
    </button>
    <button on:click={handleCalculate}>
      Start
    </button>
    <span class="mb-2 mt-5 font-bold bg-green-500">Total bet: {totalBet}</span>
    <span class="mb-10 mt-5 font-bold bg-red-500">Last number: {rouletteNumber}</span>
  </div>
  <div class="grid grid-cols-[100px_auto]  mb-10">
    <div class='mt-[50px] mb-[50px] gap-[10px] flex flex-col justify-evenly items-center'>
      <div class="w-full h-full flex justify-center gap-[10px]">
        <div class="w-full flex gap-[10px] flex-col justify-center items-center">
        
          <BetButton
            id="1_to_18"
            text="1 to 18"
            type="simple"
            bets={bets["1_to_18"]?.bet||0}
            on:handleSubstractBet={handleSubstractBet}
            on:handleAddBet={handleAddBet}
            class="h-full w-full"
          />
          <BetButton
            id="even"
            text="Even"
            type="simple"
            bets={bets["even"]?.bet||0}
            on:handleSubstractBet={handleSubstractBet}
            on:handleAddBet={handleAddBet}
            class="h-full w-full"
          />
        </div>
        <BetButton
          id="1_dozen"
          text="1st dozen"
          type="double"
          bets={bets["1_dozen"]?.bet||0}
          on:handleSubstractBet={handleSubstractBet}
          on:handleAddBet={handleAddBet}
          class="h-full w-full"
        />
      </div>
      <div class="w-full h-full flex justify-center gap-[10px]">
        <div class="w-full flex gap-[10px] flex-col justify-center items-center">
          <BetButton
            id="black"
            text="Black"
            type="simple"
            bets={bets["black"]?.bet||0}
            on:handleSubstractBet={handleSubstractBet}
            on:handleAddBet={handleAddBet}
            class="h-full w-full"
          />
          <BetButton
            id="red"
            text="Red"
            type="simple"
            bets={bets["red"]?.bet||0}
            on:handleSubstractBet={handleSubstractBet}
            on:handleAddBet={handleAddBet}
            class="h-full w-full"
          />
        </div>
        <BetButton
          id="2_dozen"
          text="2nd dozen"
          type="double"
          bets={bets["2_dozen"]?.bet||0}
          on:handleSubstractBet={handleSubstractBet}
          on:handleAddBet={handleAddBet}
          class="h-full w-full"
        />
      </div>
      <div class="w-full h-full flex justify-center gap-[10px]">
        <div class="w-full flex gap-[10px] flex-col justify-center items-center">
          <BetButton
            id="odd"
            text="Odd"
            type="simple"
            bets={bets["odd"]?.bet||0}
            on:handleSubstractBet={handleSubstractBet}
            on:handleAddBet={handleAddBet}
            class="h-full w-full"
          />
          <BetButton
            id="19_to_36"
            text="19 to 36"
            type="simple"
            bets={bets["19_to_36"]?.bet||0}
            on:handleSubstractBet={handleSubstractBet}
            on:handleAddBet={handleAddBet}
            class="h-full w-full"
          />
        </div>
        <BetButton
          id="3_dozen"
          text="3rd dozen"
          type="double"
          bets={bets["3_dozen"]?.bet||0}
          on:handleSubstractBet={handleSubstractBet}
          on:handleAddBet={handleAddBet}
          class="h-full w-full"
        />
      </div>
    </div>
    <div class="">
      <!-- zero -->
      <div class="flex gap-[10px]">
        <BetButton
          id="0"
          text="0"
          type="straight"
          bets={bets[0]?.bet||0}
          on:handleSubstractBet={handleSubstractBet}
          on:handleAddBet={handleAddBet}
          class="w-full ml-[10px]"
        />
        <BetButton
          id="00"
          text="00"
          type="straight"
          bets={bets['00']?.bet||0}
          on:handleSubstractBet={handleSubstractBet}
          on:handleAddBet={handleAddBet}
          class="w-full"
        />
      </div>
      <div class='grid grid-cols-[10px_auto_10px_auto_10px_auto]'>
        {#each zeroEdge as edge}
          <BetButton
            id={edge.id}
            text="0"
            type={edge.type}
            bets={bets[edge.id]?.bet||0}
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
            bets={bets[el.id]?.bet||0}
            color={reds.includes(el.id)?'red':'black'}
            on:handleSubstractBet={handleSubstractBet}
            on:handleAddBet={handleAddBet}
          />
        {/each}
      {/each}
      </div>

      <!-- dozen cols -->
      <div class='flex gap-[10px] mt-[10px] ml-[10px]'>
        {#each dozenCols as id}
          <BetButton
            id={id}
            text="2:1"
            type="double"
            bets={bets[id]?.bet||0}
            on:handleSubstractBet={handleSubstractBet}
            on:handleAddBet={handleAddBet}  
          />
        {/each}
      </div>
    </div>
  </div>

  <!-- stats -->
  {#if logs.length}
    <div class={`fixed w-full h-max p-2 left-0 bottom-0 bg-red-500 z-20 flex flex-col`}>
      <span
        class="font-semibold text-lg cursor-pointer"
        on:click={()=>showStats=!showStats}
      >
        Stats
      </span>
      {#if showStats}
        <div class="flex flex-col">
          <span>
            <span class="font-bold">System efficiency:</span>
            <span> 
              {((logs.length-lostBets)/logs.length*100).toFixed(2)}% ({logs.length-lostBets}/{logs.length})
            </span>
          </span>
          <span>
            <span class="font-bold">Max win:</span>
            <span> {maxWin} </span>
          </span>
          <span>
            <span class="font-bold">Cycles to recover lost:</span>
            <span> {(totalBet/maxWin).toFixed(2)} </span>
          </span>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style global>
button {
  color:black;
  background-color:white;
  border-radius:0;
}

</style>