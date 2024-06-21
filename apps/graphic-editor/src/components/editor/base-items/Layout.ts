import {
  Axis,
  Border,
  BorderRadius,
  BoxDecoration,
  Container,
  EdgeInsets,
  Flex,
  MainAxisSize,
  Radius,
  SizedBox,
  Widget,
} from '@meursyphus/flitter';
import { Item, ItemState, SettingView } from '../Item';
import { View, html, type Html } from 'rune-ts';
import { getItemMenuFactory, type MenuOption } from '../ItemMenuFactory';

interface Props {
  direction: Axis;
  children: Widget[];
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
}

export class Layout extends Item<Props> {
  constructor({
    direction = Axis.vertical,
    children = [],
    paddingTop = 20,
    paddingRight = 20,
    paddingBottom = 20,
    paddingLeft = 20,
  }: Partial<Props> = {}) {
    super({ direction, children, paddingTop, paddingRight, paddingBottom, paddingLeft });
  }

  override build(data: Props): Widget {
    return data.children.length > 0
      ? Container({
          padding: EdgeInsets.only({
            top: data.paddingTop,
            right: data.paddingRight,
            bottom: data.paddingBottom,
            left: data.paddingLeft,
          }),
          child: Flex({
            mainAxisSize: MainAxisSize.min,
            children: data.children,
            direction: data.direction,
          }),
        })
      : SizedBox({ width: 200, height: 200 });
  }

  override createView(state: ItemState<Props>): View<object> {
    return new RectangleSettingView(state);
  }
}

class RectangleSettingView extends SettingView<Props> {
  private _itemMenuFactory = getItemMenuFactory();

  protected override onRender(): void {
    this.element().addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);

      this.item.notify();
    });
  }

  protected override template(): Html {
    return html`
      <form>
        ${this._itemMenuFactory.options.map((option) => {
          return new ItemOptionButton(option);
        })}
      </form>
    `;
  }
}

class ItemOptionButton extends View<MenuOption> {
  protected override template(): Html {
    return html` <button>${this.data.label}</button> `;
  }
}
