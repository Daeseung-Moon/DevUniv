import { View, html } from 'rune-ts';
import c from './Editor.module.scss';

export class Settings extends View {
  constructor() {
    super({});
  }
  protected override template() {
    return html`
      <div class=${c.settings}>
        <h1>Settings</h1>
      </div>
    `;
  }
}
