import { html, Page } from 'rune-ts';
import { RendererView, SidebarView } from '../../components/editor';

export class GraphicEditor extends Page<object> {
  override template() {
    return html`<div>${new RendererView()} ${new SidebarView()}</div> `;
  }
}
