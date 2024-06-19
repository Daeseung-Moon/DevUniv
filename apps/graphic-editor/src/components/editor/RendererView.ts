import { View, html } from 'rune-ts';
import {
  Widget,
  AppRunner,
  StatefulWidget,
  Center,
  State,
  Row,
  MainAxisSize,
  Column,
} from '@meursyphus/flitter';
import { EventManager, getEventManager } from '../../libs/EventManager';
import { CreateItemEvent, ItemCreateMenuView } from './ItemCreatorView';

export class RendererView extends View {
  private app!: AppRunner;

  constructor() {
    super({});
  }

  protected override onRender(): void {
    const svg = this.element().getElementsByTagName('svg')[0];
    this.app = new AppRunner({ view: svg });
    this.app.onMount({
      resizeTarget: this.element(),
    });
    this.app.runApp(new Renderer());
  }
  protected override template() {
    return html`
      <div>
        ${new ItemCreateMenuView()}
        <svg style="width: 100%; height: 100%;" />
      </div>
    `;
  }
}

class Renderer extends StatefulWidget {
  constructor() {
    super({});
  }

  override createState(): RendererState {
    return new RendererState();
  }
}

class RendererState extends State<Renderer> {
  private _items: Widget[] = [];
  private _eventManager: EventManager = getEventManager();

  override initState(): void {
    this._eventManager.on(CreateItemEvent, (event) => {
      this.setState(() => {
        this._items.push(event.detail);
      });
    });
  }

  override build(): Widget {
    return Center({
      child: Column({
        mainAxisSize: MainAxisSize.min,
        children: this._items,
      }),
    });
  }
}
