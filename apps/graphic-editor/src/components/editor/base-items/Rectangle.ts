import { BoxDecoration, Container, Widget } from '@meursyphus/flitter';
import { Item, ItemState, SettingView } from '../Item';
import { View, html, type Html } from 'rune-ts';

export class Rectangle extends Item<{ width: number; height: number; color: string }> {
  constructor({
    color = '#ADD8E6',
    width = 100,
    height = 100,
  }: { color?: string; width?: number; height?: number } = {}) {
    super({ width, height, color });
  }

  override build(data: { width: number; height: number; color: string }): Widget {
    return Container({
      width: data.width,
      height: data.height,
      decoration: new BoxDecoration({
        color: data.color,
      }),
    });
  }

  override createView(
    state: ItemState<{ width: number; height: number; color: string }>,
  ): View<object> {
    return new RectangleSettingView(state);
  }
}

class RectangleSettingView extends SettingView<{ width: number; height: number; color: string }> {
  protected override onRender(): void {
    this.element().addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(this.element() as HTMLFormElement);
      const width = formData.get('width') as string;
      const height = formData.get('height') as string;
      const color = formData.get('color') as string;

      this.item.data.width = Number(width);
      this.item.data.height = Number(height);
      this.item.data.color = color;
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

        <button class="submit">Submit</button>
      </form>
    `;
  }
}
