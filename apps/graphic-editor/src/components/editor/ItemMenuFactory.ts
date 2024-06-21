import type { Item } from './Item';

export interface MenuOption {
  generateItem: () => Item;
  label: string;
}

class ItemMenuFactory {
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

let itemMenuFactory: ItemMenuFactory | null = null;

export function getItemMenuFactory() {
  if (!itemMenuFactory) {
    itemMenuFactory = new ItemMenuFactory();
  }
  return itemMenuFactory;
}
