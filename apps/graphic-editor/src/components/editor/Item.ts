import {
  type Widget,
  Container,
  GestureDetector,
  State,
  StatefulWidget,
  BoxDecoration,
  Border,
} from '@meursyphus/flitter';
import { View } from 'rune-ts';
import { store } from '../../store';
import { getEventManager, Event, EventManager } from '../../event';
import { selectItem } from '../../store/features/select-item';

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
  private _selected = false;
  private _eventManager = getEventManager();
  private _data: DATA;
  get data() {
    return this._data;
  }
  set data(data: DATA) {
    this._data = data;
    this.widget.data = data;
  }

  constructor(data: DATA) {
    super();
    this._data = data;
  }
  override initState(): void {
    this._view = this.widget.createView(this);

    /**
     * @todo: useSelector 구현해서 특정 상태변화만 감지할 수 있게 만들것
     */
    store.subscribe(() => {
      const selected = store.getState().selectedItem.item === this.widget;
      this._setSelected(selected);
    });

    this._setSelected(store.getState().selectedItem.item === this.widget);
  }

  private _setSelected(selected: boolean) {
    this.setState(() => {
      this._selected = selected;
      if (selected) {
        this._eventManager.emit(new ShowSettingViewEvent(this._view));
      }
    });
  }

  notify() {
    this.setState();
  }

  override build() {
    return GestureDetector({
      onClick: () => {
        store.dispatch(selectItem(this.widget));
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
