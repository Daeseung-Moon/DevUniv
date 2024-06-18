import { html, Page } from 'rune-ts';
import klass from './HelloWorld.module.scss';
import { Renderer, Settings } from '../../components/editor';

export class GraphicEditor extends Page<object> {
  override template() {
    return html`<div class=${klass.graphic_editor}>${new Renderer()} ${new Settings()}</div> `;
  }
}
