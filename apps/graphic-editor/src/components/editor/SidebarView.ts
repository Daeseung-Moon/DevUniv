import { View, html } from 'rune-ts';

import { getEventManager, EventManager } from '../../event';
import { ShowSettingViewEvent } from './Item';

export class SidebarView extends View {
  private _eventManager: EventManager;
  private _view: View | null;

  constructor() {
    super({});
    this._eventManager = getEventManager();
    this._view = null;

    this._eventManager.on(ShowSettingViewEvent, (event) => {
      this._view = event.detail;
      this.redraw();
    });
  }

  protected override onRender(): void {}

  protected override template() {
    return html`
      <div>
        <h1>Settings</h1>
        ${this._view}
      </div>
    `;
  }
}
