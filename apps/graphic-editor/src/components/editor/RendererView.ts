import { View, html } from 'rune-ts';
import {
  Widget,
  AppRunner,
  StatefulWidget,
  State,
  MultiChildRenderObjectWidget,
  MultiChildRenderObject,
  Size,
  Offset,
  RenderObject,
  Container,
  Alignment,
  EdgeInsets,
} from '@meursyphus/flitter';
import { ItemCreateMenuView } from './ItemCreatorView';
import { Paragraph, Rectangle, Layout } from './base-items';
import { getItemMenuRegister, type MenuOption } from './ItemMenuRegister';
import { store } from '../../store';

const defaultOptions: MenuOption[] = [
  { generateItem: () => new Rectangle(), label: 'Rectangle' },
  { generateItem: () => new Paragraph(), label: 'Paragraph' },
  { generateItem: () => new Layout(), label: 'Layout' },
];
const itemMenuFactory = getItemMenuRegister();
defaultOptions.forEach((option) => {
  itemMenuFactory.register(option);
});

export class RendererView extends View {
  private app!: AppRunner;

  constructor() {
    super({});
  }

  protected override onRender(): void {
    const view = this.element().getElementsByTagName('svg')[0];
    this.app = new AppRunner({ view });
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

  override initState(): void {
    /**
     * @todo: useSelectors를 구현해야함.
     */
    store.subscribe(() => {
      this.setState(() => {
        this._items = store.getState().createItem.items;
      });
    });
  }

  override build(): Widget {
    return Container({
      alignment: Alignment.center,
      padding: EdgeInsets.all(30),
      child: new Wrap({
        children: this._items,
      }),
    });
  }
}

class Wrap extends MultiChildRenderObjectWidget {
  override createRenderObject(): RenderObject {
    return new RenderWrap();
  }
  override updateRenderObject(): void {
    //
  }
}

class RenderWrap extends MultiChildRenderObject {
  constructor() {
    super({ isPainter: false });
  }
  protected override preformLayout(): void {
    /**
     * 자식들의 크기를 구하기 위한 Dry layout
     */
    this.children.forEach((child) => {
      child.layout(this.constraints);
    });

    let currentX = 0;
    let currentY = 0;
    let maxHeightInRow = 0;
    let maxWidth = 0;

    this.children.forEach((child) => {
      if (currentX + child.size.width > this.constraints.maxWidth) {
        // 새로운 줄로 이동
        currentX = 0;
        currentY += maxHeightInRow;
        maxHeightInRow = 0;
      }

      // 위젯 위치 설정
      child.offset = new Offset({ x: currentX, y: currentY });

      // 다음 위젯을 위한 X 위치 업데이트
      currentX += child.size.width;

      // 현재 줄에서 가장 높은 위젯의 높이 업데이트
      if (child.size.height > maxHeightInRow) {
        maxHeightInRow = child.size.height;
      }

      // 전체 컨테이너의 너비 업데이트
      maxWidth = Math.max(maxWidth, currentX);
    });

    // 전체 컨테이너의 높이 설정
    this.size = new Size({
      width: maxWidth,
      height: currentY + maxHeightInRow,
    });
  }
}
