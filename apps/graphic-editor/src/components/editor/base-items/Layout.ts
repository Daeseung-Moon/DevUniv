import {
  Axis,
  Container,
  EdgeInsets,
  Flex,
  ZIndex,
  MainAxisSize,
  SizedBox,
  Widget,
  GestureDetector,
} from '@meursyphus/flitter';
import { Item, ItemState, SettingView } from '../Item';
import { View, html, type Html, on } from 'rune-ts';
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
    return new LayoutSettingView(state);
  }
}

class LayoutSettingView extends SettingView<Props> {
  private _itemMenuFactory = getItemMenuFactory();

  @on('submit')
  _handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(e.target as HTMLFormElement);

    // padding 대입
    this.item.data.paddingTop = Number(formData.get('paddingTop'));
    this.item.data.paddingRight = Number(formData.get('paddingRight'));
    this.item.data.paddingBottom = Number(formData.get('paddingBottom'));
    this.item.data.paddingLeft = Number(formData.get('paddingLeft'));

    // direction 설정
    this.item.data.direction =
      formData.get('direction') === 'row' ? Axis.horizontal : Axis.vertical;

    this.item.notify();
  }

  private _handleCreate(item: Item) {
    this.item.data.children.push(
      GestureDetector({
        onMouseDown: (e) => {
          console.log('hi');
          e.stopPropagation();
        },
        child: item,
      }),
    );
    this.item.notify();
  }
  protected override template(): Html {
    return html`
      <form>
        <fieldset>
          <legend>자식들 추가하시오...</legend>
          ${this._itemMenuFactory.options.map((option) => {
            return new ItemOptionButton({ option, onClick: (item) => this._handleCreate(item) });
          })}
        </fieldset>
        <fieldset>
          <label>
            방향 설정:
            <select name="direction">
              <option value="row" ${this.item.data.direction === Axis.horizontal ? 'selected' : ''}>
                가로
              </option>
              <option
                value="column"
                ${this.item.data.direction === Axis.vertical ? 'selected' : ''}
              >
                세로
              </option>
            </select>
          </label>
        </fieldset>
        <fieldset style="display: grid; grid-template-columns: 1fr 1fr;">
          <legend>패딩 설정</legend>
          <label>
            상단 패딩:
            <input type="number" name="paddingTop" value="${this.item.data.paddingTop}" />
          </label>
          <label>
            우측 패딩:
            <input type="number" name="paddingRight" value="${this.item.data.paddingRight}" />
          </label>
          <label>
            하단 패딩:
            <input type="number" name="paddingBottom" value="${this.item.data.paddingBottom}" />
          </label>
          <label>
            좌측 패딩:
            <input type="number" name="paddingLeft" value="${this.item.data.paddingLeft}" />
          </label>
        </fieldset>

        <button type="submit">제출</button>
      </form>
    `;
  }
}

class ItemOptionButton extends View<{ option: MenuOption; onClick: (item: Item) => void }> {
  @on('click')
  _handleClick() {
    this.data.onClick(this.data.option.generateItem());
  }

  protected override template(): Html {
    return html`<button type="button">${this.data.option.label}</button> `;
  }
}
