import {
  type Widget,
  Container,
  GestureDetector,
  State,
  StatefulWidget,
  BoxDecoration,
  Border,
} from '@meursyphus/flitter';
import { getEventManager, Event, EventManager } from '../../libs';
import { View } from 'rune-ts';

interface FocusableProps {
  onFocus?: () => void;
  onBlur?: () => void;
  child: Widget;
}

let id = 0;
function getUniqueId() {
  return id++;
}

export abstract class Item<DATA extends object = object> extends StatefulWidget {
  constructor(public data: DATA) {
    super(getUniqueId());
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

  constructor(public data: DATA) {
    super();
  }
  override initState(): void {
    this._view = this.widget.createView(this);
  }

  notify() {
    console.log('notify', this.data);
    this.setState();
  }

  handleFocus() {
    this._eventManager.emit(new ShowSettingViewEvent(this._view));
  }

  override build() {
    console.log('rebuild', this.data);
    return new Focusable({
      onFocus: () => {
        this.handleFocus();
      },
      child: this.widget.build(this.data),
    });
  }
}

/*
 ********* internal *********
 */

class Focusable extends StatefulWidget {
  onFocus?: () => void;
  onBlur?: () => void;
  child: Widget;

  constructor({ onFocus, onBlur, child }: FocusableProps) {
    super();
    this.onFocus = onFocus;
    this.onBlur = onBlur;
    this.child = child;
  }

  override createState(): State<StatefulWidget> {
    return new FocusableState();
  }
}

class FocusEvent extends Event<FocusableState> {}

class FocusableState extends State<Focusable> {
  private _eventManager = getEventManager();
  private _focused = false;

  override initState(): void {
    this._eventManager.on(FocusEvent, (e) => {
      if (e.detail !== this) {
        this.setFocused(false);
      }
    });
  }

  private _handleClick() {
    this.setFocused(true);
    this.widget.onFocus?.();
  }

  setFocused(focused: boolean) {
    if (this._focused === focused) {
      return;
    }
    this.setState(() => {
      this._focused = focused;
      if (this._focused) {
        this._eventManager.emit(new FocusEvent(this));
      }
    });
  }

  override build() {
    return Container({
      decoration: this._focused
        ? new BoxDecoration({
            border: Border.all({ color: 'yellow', width: 2 }),
          })
        : undefined,
      child: GestureDetector({
        onClick: () => {
          this._handleClick();
        },
        child: this.widget.child,
      }),
    });
  }
}
