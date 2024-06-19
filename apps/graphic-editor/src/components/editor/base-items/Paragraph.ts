import { Widget, Text, TextStyle } from '@meursyphus/flitter';
import { Item, ItemState, SettingView } from '../Item';
import { View, html, type Html } from 'rune-ts';

interface ParagraphData {
  text: string;
  fontSize: number;
  fontWeight: string;
  color: string;
}

export class Paragraph extends Item<ParagraphData> {
  constructor({
    color = '#ffffff',
    fontSize = 24,
    fontWeight = 'normal',
    text = '하이요',
  }: Partial<ParagraphData> = {}) {
    super({ text, fontSize, fontWeight, color });
  }

  override build(data: ParagraphData): Widget {
    return Text(data.text, {
      style: new TextStyle({
        color: data.color,
        fontSize: data.fontSize,
        fontWeight: data.fontWeight,
      }),
    });
  }

  override createView(state: ItemState<ParagraphData>): View<object> {
    return new ParagraphSettingView(state);
  }
}

class ParagraphSettingView extends SettingView<ParagraphData> {
  protected override onRender(): void {
    this.element().addEventListener('submit', (e) => {
      e.preventDefault();
      const textElement = this.element().querySelector('#text') as unknown as HTMLInputElement;
      const fontSizeElement = this.element().querySelector(
        '#fontSize',
      ) as unknown as HTMLInputElement;
      const fontWeightElement = this.element().querySelector(
        '#fontWeight',
      ) as unknown as HTMLInputElement;
      const colorElement = this.element().querySelector('#color') as unknown as HTMLInputElement;
      this.item.data.text = textElement.value;
      this.item.data.fontSize = Number(fontSizeElement.value);
      this.item.data.fontWeight = fontWeightElement.value;
      this.item.data.color = colorElement.value;
      this.item.notify();
    });
  }

  protected override template(): Html {
    return html`
      <form>
        <fieldset>
          <label for="text">Text</label>
          <input type="text" id="text" name="text" value="${this.item.data.text}" />
        </fieldset>

        <fieldset>
          <label for="fontSize">Font Size</label>
          <input type="number" id="fontSize" name="fontSize" value="${this.item.data.fontSize}" />
        </fieldset>

        <fieldset>
          <label for="fontWeight">Font Weight</label>
          <input
            type="text"
            id="fontWeight"
            name="fontWeight"
            value="${this.item.data.fontWeight}"
          />
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
