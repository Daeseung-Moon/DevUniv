import { Item } from './Item';
import { Event, getEventManager } from '../../libs/EventManager';
import { View, html, type Html } from 'rune-ts';
import { Paragraph, Rectangle } from './base-items';

export class CreateItemEvent extends Event<Item> {}

interface MenuOption {
  generateItem: () => Item;
  label: string;
}

const defaultOptions: MenuOption[] = [
  { generateItem: () => new Rectangle(), label: 'Rectangle' },
  { generateItem: () => new Paragraph(), label: 'Paragraph' },
];

export class ItemCreateMenuView extends View<MenuOption[]> {
  constructor(options: MenuOption[] = []) {
    super([...defaultOptions, ...options]);
  }

  protected override onRender(): void {}

  protected override template(): Html {
    return html`
      <ul>
        ${this.data.map((item) => html`<li>${new ItemCreateMenuOptionView(item)}</li>`)}
      </ul>
    `;
  }
}

class ItemCreateMenuOptionView extends View<MenuOption> {
  private _eventManager = getEventManager();
  protected override onRender(): void {
    this.element().addEventListener('click', () => {
      this._eventManager.emit(new CreateItemEvent(this.data.generateItem()));
    });
  }

  protected override template(data: MenuOption): Html {
    return html`<button>${data.label}</button>`;
  }
}
