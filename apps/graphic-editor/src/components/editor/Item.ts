import {
  type Widget,
  Container,
  GestureDetector,
  State,
  StatefulWidget,
  BoxDecoration,
  Border,
} from '@meursyphus/flitter';
import { getEventManager, Event, EventManager, SelectItemEvent } from '../../event';
import { View } from 'rune-ts';

export abstract class Item<DATA extends object = object> extends StatefulWidget {
  constructor(public data: DATA) {
    super();
  }

  abstract createView(state: ItemState): View;
  abstract build(data: DATA): Widget;

  override createState(): ItemState<DATA> {
    return new ItemState(this.data);
  }
}

export class ShowSettingViewEvent extends Event<View> {}

export abstract class SettingView<DATA extends object = object> extends View {
  protected item: ItemState<DATA>;

  constructor(item: ItemState<DATA>) {
    super({});
    this.item = item;
  }

  protected notify() {
    this.item.notify();
  }
}

export class ItemState<DATA extends object = object> extends State<Item<DATA>> {
  private _view!: View;
  private _eventManager: EventManager = getEventManager();
  private _selected = false;

  constructor(public data: DATA) {
    super();
  }
  override initState(): void {
    this._view = this.widget.createView(this);

    this._eventManager.on(SelectItemEvent, (e) => {
      const selected = e.detail === this.widget;
      this._setSelected(selected);
      if (selected) {
        this._eventManager.emit(new ShowSettingViewEvent(this._view));
      }
    });
  }

  private _setSelected(selected: boolean) {
    this._selected = selected;
    this.setState();
  }

  notify() {
    this.setState();
  }

  override build() {
    return GestureDetector({
      onClick: () => {
        this._eventManager.emit(new SelectItemEvent(this.widget));
      },
      child: Container({
        decoration: this._selected
          ? new BoxDecoration({
              border: Border.all({ color: 'red', width: 2 }),
            })
          : undefined,
        child: this.widget.build(this.data),
      }),
    });
  }
}
