export const ARCHITECTURES = [
  {id:'wide',code:'A',name:'Wider datapath',short:'512-bit · 1 GHz',width:512,frequency:1,engines:1,color:'#4c5cde'},
  {id:'fast',code:'B',name:'Higher frequency',short:'256-bit · 2 GHz',width:256,frequency:2,engines:1,color:'#078a84'},
  {id:'parallel',code:'C',name:'Parallel engines',short:'2 × 256-bit · 1 GHz',width:256,frequency:1,engines:2,color:'#bd650e'}
] as const;
export type ArchId = typeof ARCHITECTURES[number]['id'];
export type Assumption = {overhead:number;bubbles:number;utilization:number;parallelEfficiency:number;power:number;area:number;timingRisk:number;routing:number;scalability:number;uncertainty:number;clockShortfall:number;trial:boolean;achievedFrequency:number;source:string};
export type State = {architectures:Record<ArchId,Assumption>;target:number;powerBudget:number;areaBudget:number;cap:number;capEnabled:boolean;baseline:ArchId;tab:string};
// Scale reference, not a measurement of any of the three requested architectures.
// FlooNoC, 12 nm, TT 0.8 V / 25 C, post-layout 4 KiB neighbor DMA transfer:
// about 15% of 127.7 mW is attributed to DMA, wide AXI4 Xbar and NoC (VI-D).
// https://arxiv.org/html/2409.17606v2
export const POWER_REFERENCE = {tileMilliwatts:127.7,transportFraction:0.15,url:'https://arxiv.org/html/2409.17606v2'} as const;
export const wattsToMilliwatts=(watts:number)=>watts*1000;
export const milliwattsToWatts=(milliwatts:number)=>milliwatts/1000;
export const STARTER_POWER_W=milliwattsToWatts(20); // Rounded scale-only hypothesis, equal for A/B/C.
export const STARTER_POWER_BUDGET_W=milliwattsToWatts(50); // Editable example constraint, not a source value.
// FlooNoC Table III: 1.37 mm² NoC area over 32 tiles. Fig. 9(a) / VI-C:
// NoC 3.5%, NoC + wide Xbar 6.9%, DMA 5.3% of tile logic.
// Applying those proportions to the mean NoC area yields ~0.149 mm².
// This is an approximate occupied-logic scale, not a block floorplan footprint.
export const AREA_REFERENCE={totalNocMm2:1.37,tiles:32,nocPercent:3.5,interconnectPercent:6.9,dmaPercent:5.3,url:'https://arxiv.org/html/2409.17606v2'} as const;
export const referenceTransportAreaMm2=()=>AREA_REFERENCE.totalNocMm2/AREA_REFERENCE.tiles*(AREA_REFERENCE.interconnectPercent+AREA_REFERENCE.dmaPercent)/AREA_REFERENCE.nocPercent;
export const STARTER_AREA_MM2=0.15; // Rounded scale-only estimate; equal for A/B/C.
export const STARTER_AREA_BUDGET_MM2=0.20; // Editable logic-area allowance, not a published limit.
const initial=(power:number,area:number,timingRisk:number,routing:number,scalability:number):Assumption=>({overhead:10,bubbles:5,utilization:80,parallelEfficiency:90,power,area,timingRisk,routing,scalability,uncertainty:25,clockShortfall:10,trial:false,achievedFrequency:1,source:''});
export const makeDefaults=():State=>({architectures:{wide:initial(STARTER_POWER_W,STARTER_AREA_MM2,3,4,3),fast:{...initial(STARTER_POWER_W,STARTER_AREA_MM2,5,2,2),achievedFrequency:2},parallel:initial(STARTER_POWER_W,STARTER_AREA_MM2,2,3,4)},target:40,powerBudget:STARTER_POWER_BUDGET_W,areaBudget:STARTER_AREA_BUDGET_MM2,cap:80,capEnabled:true,baseline:'wide',tab:'overview'});
export const bounds:Record<Exclude<keyof Assumption,'trial'|'source'>,[number,number]>={overhead:[0,100],bubbles:[0,100],utilization:[0,100],parallelEfficiency:[0,100],power:[0.000001,100000],area:[0.001,100000],timingRisk:[1,5],routing:[1,5],scalability:[1,5],uncertainty:[0,95],clockShortfall:[0,100],achievedFrequency:[0.01,20]};
export type Action={type:'arch';id:ArchId;key:keyof Assumption;value:number|boolean|string}|{type:'shared';key:'overhead'|'bubbles'|'utilization';value:number}|{type:'global';key:'target'|'powerBudget'|'areaBudget'|'cap';value:number}|{type:'cap';value:boolean}|{type:'baseline';value:ArchId}|{type:'tab';value:string}|{type:'reset'};
export function reducer(state:State,action:Action):State {
  if(action.type==='reset') return makeDefaults();
  if(action.type==='baseline') return ARCHITECTURES.some(a=>a.id===action.value)?{...state,baseline:action.value}:state;
  if(action.type==='tab') return ['overview','assumptions','decision','model'].includes(action.value)?{...state,tab:action.value}:state;
  if(action.type==='cap') return typeof action.value==='boolean'?{...state,capEnabled:action.value}:state;
  if(action.type==='global') {if(!Number.isFinite(action.value))return state;const min=action.key==='target'?0.01:action.key==='powerBudget'?0.000001:0.001;return {...state,[action.key]:Math.min(100000,Math.max(min,action.value))};}
  if(action.type==='shared') {if(!Number.isFinite(action.value))return state;return {...state,architectures:Object.fromEntries(ARCHITECTURES.map(a=>[a.id,{...state.architectures[a.id],[action.key]:Math.max(0,Math.min(100,action.value))}])) as State['architectures']};}
  if(!state.architectures[action.id])return state;
  let value=action.value;
  if(action.key==='trial'){if(typeof value!=='boolean')return state;}
  else if(action.key==='source'){if(typeof value!=='string')return state;value=value.slice(0,1000);}
  else {if(typeof value!=='number'||!Number.isFinite(value))return state;const range=bounds[action.key];if(!range)return state;value=Math.min(range[1],Math.max(range[0],value));if(['timingRisk','routing','scalability'].includes(action.key))value=Math.round(value);}
  return {...state,architectures:{...state.architectures,[action.id]:{...state.architectures[action.id],[action.key]:value}}};
}
const safeRatio=(a:number,b:number)=>b>0?a/b:null;
export function calculate(state:State){
 const cap=state.capEnabled?state.cap:Infinity;
 const results=ARCHITECTURES.map(arch=>{
  const a=state.architectures[arch.id];
  const trial=a.trial&&a.source.trim().length>0;
  const f=trial?a.achievedFrequency:arch.frequency;
  const raw=arch.width/8*arch.frequency*arch.engines;
  const clockRaw=arch.width/8*f*arch.engines;
  const efficiency=(1-a.overhead/100)*(1-a.bubbles/100)*a.utilization/100*(arch.engines>1?a.parallelEfficiency/100:1);
  const unc=a.uncertainty/100;
  const beforeCap=clockRaw*efficiency;
  const throughput=Math.min(beforeCap,cap);
  const low=Math.min(beforeCap*(1-a.clockShortfall/100),cap);
  const powerLow=a.power*(1-unc),powerHigh=a.power*(1+unc),areaLow=a.area*(1-unc),areaHigh=a.area*(1+unc);
  const nominalPass=throughput>=state.target&&a.power<=state.powerBudget&&a.area<=state.areaBudget;
  const robustPass=low>=state.target&&powerHigh<=state.powerBudget&&areaHigh<=state.areaBudget;
  return {...arch,...a,trialVerified:trial,f,raw,clockRaw,efficiency,beforeCap,throughput,low,powerLow,powerHigh,areaLow,areaHigh,nominalPass,robustPass,capLimited:beforeCap>cap,energy:safeRatio(a.power*125,throughput),energyLow:safeRatio(powerLow*125,throughput),energyHigh:safeRatio(powerHigh*125,low),perfPerWatt:throughput/a.power,perfPerArea:throughput/a.area,clockPeriod:1/f};
 });
 const base=results.find(a=>a.id===state.baseline)!;
 return results.map(a=>({...a,normalizedT:safeRatio(a.throughput,base.throughput),normalizedP:a.power/base.power,normalizedA:a.area/base.area,normalizedEnergy:a.energy!==null&&base.energy!==null?safeRatio(a.energy,base.energy):null,pareto:!results.some(b=>b.id!==a.id&&b.throughput>=a.throughput&&b.power<=a.power&&b.area<=a.area&&(b.throughput>a.throughput||b.power<a.power||b.area<a.area))}));
}
export function decision(state:State){
 const rows=calculate(state); const robust=rows.filter(a=>a.robustPass); const nominal=rows.filter(a=>a.nominalPass);
 const lowestEnergy=nominal.filter(a=>a.energy!==null).sort((a,b)=>a.energy!-b.energy!)[0];
 const energyLeaders=lowestEnergy?nominal.filter(a=>a.energy!==null&&Math.abs(a.energy-lowestEnergy.energy!)<=Math.max(1,lowestEnergy.energy!)*1e-12):[];
 return {rows,robust,nominal,lowestEnergy,energyLeaders,trialCount:rows.filter(a=>a.trialVerified).length,title:robust.length?'A shortlist within your bounds':nominal.length?'Feasible at nominal assumptions':'Revisit the capacity or budgets',text:robust.length?`${robust.map(a=>a.code).join(', ')} meet throughput, power and area limits across the entered sensitivity bounds. Timing and routing still need review.`:nominal.length?`${nominal.map(a=>a.code).join(', ')} meet the nominal limits, but no option clears every sensitivity bound. Keep the choice provisional.`:'No option meets all three nominal limits. Identify the limiting constraint before choosing width, frequency or parallelism.'};
}
