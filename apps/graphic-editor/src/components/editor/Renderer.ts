import { View, html } from 'rune-ts';
import type { Widget } from '@meursyphus/flitter';
import c from './Editor.module.scss';

export class Renderer extends View {
  constructor() {
    super({});
  }
  protected override template() {
    return html` <div class=${c.renderer}>기모링</div> `;
  }
}
