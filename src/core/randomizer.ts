/** Injectable Fisher–Yates bags; no rendering or snapshot read draws randomness. */
import {TYPES,type PieceType} from './geometry.ts';
export class SevenBag {
  private bag:PieceType[]=[];
  private index=0;
  private readonly random:()=>number;
  constructor(random:()=>number){this.random=random;}
  reset(){this.bag=[];this.index=0;}
  next():PieceType {
    if(this.index===this.bag.length){
      const bag:PieceType[]=[...TYPES];
      for(let i=bag.length-1;i>0;i--){
        const value=this.random();
        if(!Number.isFinite(value)||value<0||value>=1)throw new RangeError('Random source must return a finite value in [0, 1)');
        const j=Math.floor(value*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]];
      }
      this.bag=bag;this.index=0;
    }
    return this.bag[this.index++];
  }
}
