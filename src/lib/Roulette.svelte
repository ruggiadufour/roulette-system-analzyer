<script>
  import BetButton from './BetButton.svelte'

  let rows = Array.from({length:12},(_,i)=>i+1)
    .map((v,i)=>{
      let arr = Array.from({length:3},(_,i)=>i+1)
        return arr.reduce((acc,val)=>{
          const id = val+3*i
          acc.push({
            id,
            text: id,
            type:'number'
          })
          if(id<3*(i+1)){
            acc.push({
              id: `${id}-${val+1+3*i}`,
              text: `${id}-${val+1+3*i}`,
              type: 'between-number-2'
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
            type: j===1?'between-number-4':'between-number-2'
          }))
        )
      }
      return acc
    },[])

  const multipliers = {
    simple: 1,
    double: 2,
    number: 35,
    'between-number-2': 15,
    'between-number-4': 7,
    'zero-number': 0,
    'zero': 0,
  }
  const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
  let coinSelected = 5
  let balance = 10000
  let cycles = 1000
  let showStats = false
  let logs = []
  $: lostBets = logs.filter(v=>v.earn===0).length
  $: maxWin = logs.reduce((a,v)=>v.diffEarn>a ? v.diffEarn : a,0)
  $: totalBet = Object.values(bets).reduce((acc,val)=>val.bet+acc,0);
  let bets = {
    // "2-3": {
    //     "id": "2-3",
    //     "text": "2-3",
    //     "type": "between-number-2",
    //     "bet": 2
    // },
    // "11-12": {
    //     "id": "11-12",
    //     "text": "11-12",
    //     "type": "between-number-2",
    //     "bet": 2
    // },
    // "17-18": {
    //     "id": "17-18",
    //     "text": "17-18",
    //     "type": "between-number-2",
    //     "bet": 2
    // },
    // "24-27": {
    //     "id": "24-27",
    //     "text": "24-27",
    //     "type": "between-number-2",
    //     "bet": 2
    // },
    // "33-36": {
    //     "id": "33-36",
    //     "text": "33-36",
    //     "type": "between-number-2",
    //     "bet": 2
    // },
    // "29-32": {
    //     "id": "29-32",
    //     "text": "29-32",
    //     "type": "between-number-2",
    //     "bet": 2
    // },
    // "34-35": {
    //     "id": "34-35",
    //     "text": "34-35",
    //     "type": "between-number-2",
    //     "bet": 2
    // },
    // "25-26": {
    //     "id": "25-26",
    //     "text": "25-26",
    //     "type": "between-number-2",
    //     "bet": 2
    // },
    // "19-20": {
    //     "id": "19-20",
    //     "text": "19-20",
    //     "type": "between-number-2",
    //     "bet": 2
    // },
    // "13-14": {
    //     "id": "13-14",
    //     "text": "13-14",
    //     "type": "between-number-2",
    //     "bet": 2
    // },
    // "4-7": {
    //     "id": "4-7",
    //     "text": "4-7",
    //     "type": "between-number-2",
    //     "bet": 2
    // },
    // "28-31": {
    //     "id": "28-31",
    //     "text": "28-31",
    //     "type": "between-number-2",
    //     "bet": 2
    // }
  }

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

  const actions = {
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
    const rouletteNumber = parseInt(Math.random()*36)
    // const n = 8
    balance-=totalBet

    const betsArr = Object.entries(bets)
    const earn = betsArr.reduce((acc,[k,v])=>{
      const calc = (b)=> (b ? v.bet*multipliers[v.type]+v.bet : 0) + acc
      switch (v.type){
        case 'zero':
          return 0 + acc
        case 'number':
          return calc(rouletteNumber===v.id)
        case 'between-number-4':
          return calc(v.id.split('-').includes(String(rouletteNumber)))
        case 'between-number-2':
          return calc(v.id.split('-').includes(String(rouletteNumber)))
        default:
          return calc(actions[k](rouletteNumber))
      }
    },0)
    balance+=earn
    logs.push({rouletteNumber, earn, diffEarn: earn-totalBet})
  }



  const handleCalculate = ()=>{
    logs = []
    for(let i = 0;i <cycles; i++) {
      calculation()
    }
    console.log(logs)
  }

  const zeroEdge = ['0-1','0-2','0-3']
  const dozenCols = ['1_dozen_col','2_dozen_col','3_dozen_col']
</script>
<div class="roulette max-w-[500px]">
  <div class="flex flex-col">
    <label>Balance:</label>
    <input class="text-center mb-2" type="text" bind:value={balance}>
    <label>Cycles:</label>
    <input class="text-center mb-2" type="text" bind:value={cycles}>
    <label>Coin:</label>
    <select class="text-center mb-6" bind:value={coinSelected}>
      <option value={1}>1</option>
      <option value={2}>2</option>
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>
    <button class="mb-2" on:click={()=>bets={}}>
    Clear bets
    </button>
    <button on:click={handleCalculate}>
    Calculate
    </button>
    <span class="mb-10 mt-5 font-bold bg-red-500">Bet: {totalBet}</span>
  </div>
  <div class="grid grid-cols-[100px_auto] gap-[10px] mb-10">
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
    <div>
      <!-- zero -->
      <BetButton
        id="0"
        text="0"
        type="zero"
        bets={bets[0]?.bet||0}
        on:handleSubstractBet={handleSubstractBet}
        on:handleAddBet={handleAddBet}
        class="w-full"
      />
      <div class='flex'>
        {#each zeroEdge as id}
          <BetButton
            id={id}
            text="0"
            type="zero-number"
            bets={bets[id]?.bet||0}
            on:handleSubstractBet={handleSubstractBet}
            on:handleAddBet={handleAddBet}  
          />
        {/each}
      </div>
        
      <!-- 36 numbers -->
      <div class="numbers-wrapper grid grid-cols-[auto_10px_auto_10px_auto]">
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
      <div class='flex gap-[10px] mt-[10px]'>
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
            <span> {((cycles-lostBets)/cycles*100).toFixed(2)}% ({cycles-lostBets}/{cycles}) </span>
          </span>
          <span>
            <span class="font-bold">Max win:</span>
            <span> {maxWin} </span>
          </span>
          <span>
            <span class="font-bold">Cycles to recover lost:</span>
            <span> {totalBet/maxWin} </span>
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