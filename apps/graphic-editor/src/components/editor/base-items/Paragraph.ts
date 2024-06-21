import { Widget, Text, TextStyle } from '@meursyphus/flitter';
import { Item, ItemState, SettingView } from '../Item';
import { View, html, type Html } from 'rune-ts';

interface ParagraphData {
  text: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  fontFamily: string; // 폰트 패밀리 속성 추가
}

export class Paragraph extends Item<ParagraphData> {
  constructor({
    color = '#ffffff',
    fontSize = 24,
    fontWeight = 'normal',
    text = '하이요',
    fontFamily = 'Arial',
  }: Partial<ParagraphData> = {}) {
    super({ text, fontSize, fontWeight, color, fontFamily });
  }

  override build(data: ParagraphData): Widget {
    return Text(data.text, {
      style: new TextStyle({
        color: data.color,
        fontSize: data.fontSize,
        fontWeight: data.fontWeight,
        fontFamily: data.fontFamily,
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
      const formData = new FormData(e.target as HTMLFormElement);
      this.item.data.text = formData.get('text') as string;
      this.item.data.fontSize = Number(formData.get('fontSize'));
      this.item.data.fontWeight = formData.get('fontWeight') as string;
      this.item.data.color = formData.get('color') as string;
      this.item.data.fontFamily = formData.get('fontFamily') as string; // 폰트 패밀리 데이터 처리
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

        <fieldset>
          <label for="fontFamily">Font Family</label>
          <select id="fontFamily" name="fontFamily">
            <option value="Arial" ${this.item.data.fontFamily === 'Arial' ? 'selected' : ''}>
              Arial
            </option>
            <option value="Verdana" ${this.item.data.fontFamily === 'Verdana' ? 'selected' : ''}>
              Verdana
            </option>
            <option
              value="Times New Roman"
              ${this.item.data.fontFamily === 'Times New Roman' ? 'selected' : ''}
            >
              Times New Roman
            </option>
            <option value="Georgia" ${this.item.data.fontFamily === 'Georgia' ? 'selected' : ''}>
              Georgia
            </option>
            <option
              value="Courier New"
              ${this.item.data.fontFamily === 'Courier New' ? 'selected' : ''}
            >
              Courier New
            </option>
          </select>
        </fieldset>

        <button class="submit">Submit</button>
      </form>
    `;
  }
}
