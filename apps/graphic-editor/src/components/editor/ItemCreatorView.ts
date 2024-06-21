import { Item } from './Item';
import { Event, getEventManager } from '../../event/EventManager';
import { View, html, type Html } from 'rune-ts';
import { getItemMenuFactory, type MenuOption } from './ItemMenuFactory';
import { SelectItemEvent } from '../../event';

export class CreateItemEvent extends Event<Item> {}

export class ItemCreateMenuView extends View {
  private _itemMenuFactory = getItemMenuFactory();
  constructor() {
    super({});
  }

  protected override onRender(): void {}

  protected override template(): Html {
    return html`
      <ul>
        ${this._itemMenuFactory.options.map(
          (item) => html`<li>${new ItemCreateMenuOptionView(item)}</li>`,
        )}
      </ul>
    `;
  }
}

class ItemCreateMenuOptionView extends View<MenuOption> {
  private _eventManager = getEventManager();
  protected override onRender(): void {
    this.element().addEventListener('click', () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleClick();
    });
  }

  async handleClick() {
    const widget = this.data.generateItem();
    await this._eventManager.emit(new CreateItemEvent(widget));
    await this._eventManager.emit(new SelectItemEvent(widget));
  }

  protected override template(data: MenuOption): Html {
    return html`<button>${data.label}</button>`;
  }
}
