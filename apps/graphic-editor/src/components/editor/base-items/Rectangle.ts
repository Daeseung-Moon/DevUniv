import {
  Border,
  BorderRadius,
  BoxDecoration,
  Container,
  Radius,
  Widget,
} from '@meursyphus/flitter';
import { Item, ItemState, SettingView } from '../Item';
import { View, html, type Html } from 'rune-ts';

interface Props {
  width: number;
  height: number;
  color: string;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderColor?: string;
  borderWidth?: number;
}

export class Rectangle extends Item<Props> {
  constructor({
    color = `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    width = 100,
    height = 100,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
    borderWidth,
    borderColor = '#ffffff',
  }: Partial<Props> = {}) {
    super({
      width,
      height,
      color,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius,
      borderWidth,
      borderColor,
    });
  }

  override build(data: Props): Widget {
    return Container({
      width: data.width,
      height: data.height,
      decoration: new BoxDecoration({
        color: data.color,
        borderRadius:
          data.borderTopLeftRadius ||
          data.borderTopRightRadius ||
          data.borderBottomRightRadius ||
          data.borderBottomLeftRadius
            ? new BorderRadius({
                topLeft: Radius.circular(data.borderTopLeftRadius ?? 0),
                topRight: Radius.circular(data.borderTopRightRadius ?? 0),
                bottomRight: Radius.circular(data.borderBottomRightRadius ?? 0),
                bottomLeft: Radius.circular(data.borderBottomLeftRadius ?? 0),
              })
            : undefined,
        border: data.borderWidth
          ? Border.all({
              color: data.borderColor,
              width: data.borderWidth,
            })
          : undefined,
      }),
    });
  }

  override createView(state: ItemState<Props>): View<object> {
    return new RectangleSettingView(state);
  }
}

class RectangleSettingView extends SettingView<Props> {
  protected override onRender(): void {
    this.element().addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(e.target as HTMLFormElement);
      const width = formData.get('width') as string;
      const height = formData.get('height') as string;
      const color = formData.get('color') as string;
      const borderTopLeftRadius = formData.get('borderTopLeftRadius') as string;
      const borderTopRightRadius = formData.get('borderTopRightRadius') as string;
      const borderBottomRightRadius = formData.get('borderBottomRightRadius') as string;
      const borderBottomLeftRadius = formData.get('borderBottomLeftRadius') as string;
      const borderColor = formData.get('borderColor') as string;
      const borderWidth = formData.get('borderWidth') as string;

      this.item.data.width = Number(width);
      this.item.data.height = Number(height);
      this.item.data.color = color;
      this.item.data.borderTopLeftRadius = Number(borderTopLeftRadius);
      this.item.data.borderTopRightRadius = Number(borderTopRightRadius);
      this.item.data.borderBottomRightRadius = Number(borderBottomRightRadius);
      this.item.data.borderBottomLeftRadius = Number(borderBottomLeftRadius);
      this.item.data.borderColor = borderColor;
      this.item.data.borderWidth = Number(borderWidth);
      this.item.notify();
    });
  }

  protected override template(): Html {
    return html`
      <form>
        <fieldset>
          <label for="width">Width</label>
          <input type="number" id="width" name="width" value="${this.item.data.width}" />
        </fieldset>

        <fieldset>
          <label for="height">Height</label>
          <input type="number" id="height" name="height" value="${this.item.data.height}" />
        </fieldset>

        <fieldset>
          <label for="color">Color</label>
          <input type="color" id="color" name="color" value="${this.item.data.color}" />
        </fieldset>

        <fieldset>
          <label for="borderTopLeftRadius">Top-Left Radius</label>
          <input
            type="number"
            id="borderTopLeftRadius"
            name="borderTopLeftRadius"
            value="${this.item.data.borderTopLeftRadius}"
          />
        </fieldset>

        <fieldset>
          <label for="borderTopRightRadius">Top-Right Radius</label>
          <input
            type="number"
            id="borderTopRightRadius"
            name="borderTopRightRadius"
            value="${this.item.data.borderTopRightRadius}"
          />
        </fieldset>

        <fieldset>
          <label for="borderBottomRightRadius">Bottom-Right Radius</label>
          <input
            type="number"
            id="borderBottomRightRadius"
            name="borderBottomRightRadius"
            value="${this.item.data.borderBottomRightRadius}"
          />
        </fieldset>

        <fieldset>
          <label for="borderBottomLeftRadius">Bottom-Left Radius</label>
          <input
            type="number"
            id="borderBottomLeftRadius"
            name="borderBottomLeftRadius"
            value="${this.item.data.borderBottomLeftRadius}"
          />
        </fieldset>

        <fieldset>
          <label for="borderColor">Border Color</label>
          <input
            type="color"
            id="borderColor"
            name="borderColor"
            value="${this.item.data.borderColor}"
          />
        </fieldset>

        <fieldset>
          <label for="borderWidth">Border Width</label>
          <input
            type="number"
            id="borderWidth"
            name="borderWidth"
            value="${this.item.data.borderWidth}"
          />
        </fieldset>

        <button class="submit">Submit</button>
      </form>
    `;
  }
}
