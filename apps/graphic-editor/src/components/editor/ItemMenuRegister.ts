import type { Item } from './Item';

export interface MenuOption {
  generateItem: () => Item;
  label: string;
}

class ItemMenuRegister {
  private _options: MenuOption[] = [];

  register(option: MenuOption) {
    this._options.push(option);
  }

  destroy() {
    this._options = [];
  }

  get options() {
    return this._options;
  }
}

let itemMenuFactory: ItemMenuRegister | null = null;

export function getItemMenuRegister() {
  if (!itemMenuFactory) {
    itemMenuFactory = new ItemMenuRegister();
  }
  return itemMenuFactory;
}
