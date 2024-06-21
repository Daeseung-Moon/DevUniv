import { View, html, type Html } from 'rune-ts';
import { getItemMenuFactory, type MenuOption } from './ItemMenuFactory';
import { store } from '../../store';
import { selectItem } from '../../store/features/select-item';
import { addItem } from '../../store/features/create-item';

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
  protected override onRender(): void {
    this.element().addEventListener('click', () => {
      this.handleClick();
    });
  }

  handleClick() {
    const widget = this.data.generateItem();
    store.dispatch(addItem(widget));
    store.dispatch(selectItem(widget));
  }

  protected override template(data: MenuOption): Html {
    return html`<button>${data.label}</button>`;
  }
}
