import { View, html, type Html } from 'rune-ts';

export class UndoRedoView extends View {
  constructor() {
    super({});
  }

  protected override onRender(): void {
    this.element()
      .querySelector('#undo')
      ?.addEventListener('click', () => {
        /**
         * @todo: undo 구현할것
         */
      });
    this.element()
      .querySelector('#redo')
      ?.addEventListener('click', () => {
        /**
         * @todo: redo 구현할것
         */
      });
  }

  protected override template(): Html {
    return html`
      <div>
        <button id="undo">undo</button>
        <button id="redo">redo</button>
      </div>
    `;
  }
}
