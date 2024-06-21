import type { Item } from '../components/editor/Item';
import { Event } from './EventManager';

export class SelectItemEvent extends Event<Item> {}
