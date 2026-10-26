/** Browser composition; desktop and sidebar hosts reuse the application and view. */
import {GameSession} from '../app/session.ts';
import {mountGame} from '../ui/app.ts';
import '../ui/style.css';
const root=document.querySelector<HTMLElement>('#app');
if(!root)throw new Error('Application root is missing.');
mountGame(root,new GameSession());
