/** Shared semantic controls and centered board, independent of the hosting platform. */
import {GameSession} from '../app/session.ts';
import type {Action} from '../core/game.ts';
import {renderBoard} from './board.ts';
export function mountGame(root:HTMLElement,session:GameSession){
 root.innerHTML=`<div class="shell"><header class="brand"><span class="brand-mark" aria-hidden="true">▦</span><div><h1>BLOCKFIELD</h1><p>Classic tetrominoes</p></div></header>
 <main class="game-layout"><aside class="info"><p class="eyebrow">CLASSIC MODE</p><h2>Make room.<br>Keep going.</h2><p class="intro">Move, turn, and find the fit.</p><div class="game-state"><span class="status-dot"></span><span role="status">Ready</span><span class="piece-name">—</span></div><button class="start" type="button">Start</button><section class="key-guide" aria-label="Keyboard controls"><h3>YOUR CONTROLS</h3><p><kbd>←</kbd><kbd>→</kbd><span>Move</span></p><p><kbd>↓</kbd><span>Move down</span></p><p><kbd>↑</kbd><kbd>X</kbd><span>Turn clockwise</span></p><p><kbd>Z</kbd><span>Turn counterclockwise</span></p><small>Click the board to focus controls.</small></section></aside>
 <div class="board-group"><div class="board-frame"><canvas width="300" height="600" tabindex="0" role="img" aria-label="Game board"></canvas></div><p class="board-caption">10 COLUMNS <span>×</span> 20 ROWS</p></div><div class="balance" aria-hidden="true"></div></main></div>`;
 const board=root.querySelector('canvas')!,start=root.querySelector<HTMLButtonElement>('.start')!,status=root.querySelector<HTMLElement>('[role=status]')!,piece=root.querySelector<HTMLElement>('.piece-name')!;
 const actions:Record<string,Action>={ArrowLeft:'left',ArrowRight:'right',ArrowDown:'down',ArrowUp:'rotateCW',x:'rotateCW',X:'rotateCW',z:'rotateCCW',Z:'rotateCCW'};
 start.addEventListener('click',()=>{session.start();board.focus();});
 board.addEventListener('keydown',event=>{const action=actions[event.key];if(!action)return;event.preventDefault();if(!event.repeat)session.act(action);});
 return session.subscribe(state=>{renderBoard(board,state);start.textContent=state.status==='idle'?'Start':'Restart';status.textContent={idle:'Ready',running:'In play',paused:'Paused',over:'Game over'}[state.status];piece.textContent=state.active?`${state.active.type} piece`:'—';});
}
