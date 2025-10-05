# Rete.js v2におけるビジュアルカスタマイズ手法の包括的分析

## 序論

本レポートは、ビジュアルプログラミングフレームワークであるRete.jsのバージョン2（以下、Rete.js v2）におけるノード、ソケット、コネクションのスタイル、配置、および表現を変更するためのアプローチを包括的に分析し、体系的に整理することを目的とする。Rete.js v2は、単なるライブラリではなく、高度にモジュール化されたフレームワークとして設計されている。 このアーキテクチャは、バージョン1からの根本的な再設計の成果であり、コアロジックとビジュアル表現が明確に分離されている点が最大の特徴である。

Rete.js v2のコア哲学は、モジュール性、適応性、そして処理指向にある。 この哲学を具現化するため、フレームワークはUIに依存しないコアエンジン（`NodeEditor`）と、特定のUIフレームワーク（React、Vue、Angular、Svelteなど）に特化したレンダリングプラグイン群という構造を採用している。 このアーキテクチャの転換により、ビジュアルに関するあらゆるカスタマイズは、選択したレンダリングプラグインのAPIを介して行われることになった。したがって、Rete.js v2のビジュアルカスタマイズを深く理解するためには、このプラグインベースのエコシステムの構造と、各プラグインが提供するカスタマイズのインターフェースを正確に把握することが不可欠である。

本レポートでは、まずカスタマイズの基礎となる概念を解説し、次に公式に推奨される主要なカスタマイズアプローチであるコンポーネントベースのカスタマイズ手法を各UIフレームワーク別に詳述する。さらに、コネクションの挙動やノードの自動配置といった高度なカスタマイズ、そして代替アプローチとしての低レベルなDOM操作やCSSオーバーライドについても掘り下げ、それぞれの利点と欠点を明らかにする。これにより、開発者が自身のプロジェクト要件に最適なカスタマイズ手法を選択し、実装するための信頼性の高い技術的指針を提供することを目指す。

---

## 第1章 ビジュアルカスタマイズの基礎概念

Rete.js v2におけるビジュアルカスタマイズのアプローチを理解するためには、エディタを構成する主要なコンポーネントの役割と相互作用を把握することが不可欠である。この章では、`NodeEditor`、`AreaPlugin`、レンダリングプラグイン、そしてプリセットという4つの核心的な概念について詳述し、カスタマイズの全体像を明らかにする。

### 1.1. NodeEditor: 抽象グラフとしての役割

`NodeEditor`は、Rete.js v2の心臓部であり、グラフの論理的な状態を管理する非ビジュアルなコンテナである。 その主な責務は、ノードとコネクションの追加、削除、およびそれらの関係性の維持にある。

`NodeEditor`はUIから完全に独立しており、クライアントサイドだけでなく、サーバーサイド（Node.jsなど）でも動作可能である。 この特性は、Rete.jsが単なる描画ツールではなく、グラフデータの処理にも重点を置いていることを示している。

カスタマイズの観点から見ると、`NodeEditor`レベルでの操作は、`editor.addNode()`や`editor.addConnection()`といったメソッドを介したグラフデータの操作に限定される。 外観やスタイルに関する情報は一切含まれず、あくまで抽象的なデータ構造として機能する。この厳格な関心の分離こそが、Rete.js v2の柔軟性の源泉となっている。

### 1.2. AreaPlugin: ビジュアルキャンバスの提供

`AreaPlugin`は、`NodeEditor`が管理する抽象グラフをユーザーが視覚的に操作するための「舞台」を提供する。 具体的には、エディタが描画されるHTML要素（コンテナ）を管理し、ズームやパン（視点移動）といった基本的なインタラクション機能を提供する。

`AreaPlugin`自体は、ノードやコネクションを直接描画するロジックを持たない。その代わり、他のビジュアル関連プラグイン（レンダリングプラグインやコネクションプラグインなど）を受け入れるためのエントリーポイントとして機能する。 また、`AreaExtensions`を通じて、ノード選択（`selectableNodes`）やノードの重なり順の制御（`simpleNodesOrder`）といった拡張機能を追加できる。 ビジュアルカスタマイズにおいて、`AreaPlugin`はすべての視覚要素が配置され、インタラクションが発生する基盤となる。

### 1.3. レンダリングプラグイン: DOMへの架け橋

レンダリングプラグインは、`NodeEditor`の抽象的なグラフデータを、特定のUIフレームワークを用いて実際のDOM要素に変換する役割を担う。 Rete.js v2は、主要なUIフレームワークに対応する公式プラグインを提供している。

*   `rete-react-plugin`
*   `rete-vue-plugin`
*   `rete-angular-plugin`
*   `rete-svelte-plugin`
*   `@retejs/lit-plugin`

これらのプラグインは、`area.use(render)`という形式で`AreaPlugin`に登録される。 これにより、`AreaPlugin`は描画処理を登録されたレンダリングプラグインに委譲する。このアーキテクチャが意味するところは極めて重要である。すなわち、Rete.js v2におけるノード、ソケット、コネクションのスタイルや構造の変更は、すべて選択したレンダリングプラグインのAPIを通じて行われるということである。コアライブラリはUIに依存しないため、ビジュアルに関するカスタマイズは必然的にレンダリングプラグインの責務となる。

### 1.4. プリセット: 「デフォルトテーマ」エンジン

各レンダリングプラグインは、標準的な外観を提供するための「プリセット」を備えている。 最も一般的に使用されるのが`classic`プリセットであり、`Presets.classic.setup()`を呼び出すことで有効になる。 このプリセットには、ノード、ソケット、コネクション、そして基本的なコントロール（テキスト入力や数値入力）をレンダリングするためのデフォルトコンポーネント一式が含まれている。

このプリセットの`setup()`メソッドこそが、カスタマイズAPIの主要なエントリーポイントである。開発者はこのメソッドに設定オブジェクトを渡すことで、デフォルトのコンポーネントを独自のカスタムコンポーネントに置き換えたり、挙動を微調整したりすることができる。このプリセットベースの設計パターンは、`rete-context-menu-plugin`など、エコシステム内の他のプラグインでも一貫して採用されており、Rete.js v2におけるカスタマイズの標準的な作法となっている。

---

## 第2章 主要アプローチ: `customize`によるコンポーネントベースのカスタマイズ

Rete.js v2でビジュアル要素をカスタマイズする上で最も強力かつ公式に推奨される手法は、レンダリングプラグインのプリセットが提供する`customize`プロパティを利用したコンポーネントの置換である。このアプローチにより、開発者はデフォルトのコンポーネントを独自のカスタムコンポーネントに差し替えることで、デザインと機能を完全に制御できる。

### 2.1. `customize`プロパティ: コンポーネント置換の中央API

`customize`プロパティは、`Presets.classic.setup()`のようなプリセット設定関数に渡されるオブジェクトのキーである。 このオブジェクト内には、`node`、`connection`、`socket`、`control`といったキーに対応する関数を定義できる。これらの関数は、それぞれに対応する要素がレンダリングされる際に呼び出される「コンポーネントファクトリ」として機能する。

各関数は、引数として`context`オブジェクトを受け取る。このオブジェクトには、現在レンダリング対象となっている要素のデータ（`context.payload`）が含まれている。 開発者はこの`payload`の内容（例えば、ノードのラベルや特定のプロパティ）を評価し、条件に応じて異なるコンポーネントを返すことができる。これにより、「特定の種類のノードだけ外観を変える」といった動的なカスタマイズが容易に実現できる。この柔軟性が、`customize`プロパティをRete.js v2におけるビジュアルカスタマイズの要たらしめている。

以下の表は、主要なUIフレームワークにおけるカスタマイズの要点をまとめたものである。

| 特徴 | React.js (`rete-react-plugin`) | Vue.js (`rete-vue-plugin`) | Svelte (`rete-svelte-plugin`) |
| :--- | :--- | :--- | :--- |
| **カスタムコンポーネント** | React Functional/Class Component (.tsx) | Single-File Component (.vue) | Svelte Component (.svelte) |
| **スタイリング統合** | styled-components | Scoped CSS / SCSS | Scoped CSS / SCSS |
| **イベント伝播の制御** | `e.stopPropagation()` または `<Drag.NoDrag>` | `@pointerdown.stop` | `on:pointerdown|stopPropagation` |
| **ベースコンポーネントのソース** | `rete-react-plugin/src/presets/classic/components/*.tsx` | `rete-vue-plugin/src/presets/classic/components/*.vue` | `rete-svelte-plugin/src/presets/classic/components/*.svelte` |

### 2.2. React.js (`rete-react-plugin`)によるカスタマイズ

`rete-react-plugin`を使用する場合、カスタマイズはカスタムReactコンポーネントを作成し、`customize`プロパティを介してそれらを登録することで行う。

#### 方法論とスタイリング

最も一般的な方法は、ReactのFunctional Componentとしてカスタムコンポーネントを定義することである。スタイリングには`styled-components`の利用が推奨されており、`classic`プリセットのデフォルトコンポーネントもこのライブラリで構築されている。 公式のカスタマイズサンプルでも、`styled-components`が依存関係に含まれていることが確認できる。

既存のコンポーネントにスタイルを追加する簡単な方法は、デフォルトのコンポーネント（例: `Presets.classic.Node`）をラップし、`styles`プロップを渡すことである。

```typescript
import { Presets } from "rete-react-plugin";
import styled, { css } from "styled-components";

const myNodeStyles = css<{ selected?: boolean }>`
  background: #f0f8ff;
  border-color: #8a2be2;
  ${(props) =>
    props.selected &&
    css`
      border-color: #ff4500;
    `}
`;

function StyledNode(props: { data: Schemes['Node'] }) {
  return <Presets.classic.Node styles={() => myNodeStyles} {...props} />;
}

// レンダリングプラグインの設定
render.addPreset(Presets.classic.setup({
  customize: {
    node(context) {
      // 特定のノードにのみ適用することも可能
      if (context.payload.label === "Custom Styled Node") {
        return StyledNode;
      }
      return Presets.classic.Node;
    }
  }
}));
```

#### コントロールとインタラクティビティ

ボタンのようなインタラクティブな要素をカスタムコントロールとして追加する場合、`AreaPlugin`によるドラッグイベントの捕捉を防ぐために、イベントの伝播を停止する必要がある。これは、コンポーネント内で`onPointerDown={(e) => e.stopPropagation()}`を呼び出すか、インタラクティブな要素を`rete-react-plugin`が提供する`<Drag.NoDrag>`コンポーネントでラップすることで実現できる。

```typescript
import { Drag } from "rete-react-plugin";

//... customize.control(context) 内で...
return (props) => (
  <Drag.NoDrag>
    <button onClick={props.data.onClick}>
      {props.data.label}
    </button>
  </Drag.NoDrag>
);
```

#### コードリファレンス

完全なカスタムコンポーネント（ノードの構造全体を変更する場合など）を実装する際は、公式ドキュメントが`rete-react-plugin`のソースコード内にある`presets/classic/components`ディレクトリのコンポーネント（`Node.tsx`, `Socket.tsx`など）を出発点として使用することを推奨している。 また、CodeSandboxで提供されている公式のカスタマイズサンプルは、具体的な実装を理解するための最も価値のあるリソースである。

### 2.3. Vue.js (`rete-vue-plugin`)によるカスタマイズ

`rete-vue-plugin`では、Vueの単一ファイルコンポーネント（SFC, .vueファイル）を用いてカスタマイズを行うのが標準的なアプローチである。

#### 方法論とスタイリング

カスタムコンポーネントを`.vue`ファイルとして作成し、`customize`プロパティの各ファクトリ関数からそのコンポーネントを返す。スタイリングは、SFCの`<style scoped>`ブロック内で標準的なCSSまたはSCSSを用いて行う。

```typescript
// render-plugin.ts
import CustomNode from './CustomNode.vue';
import CustomButton from './CustomButton.vue';

render.addPreset(Presets.classic.setup({
  customize: {
    node(context) {
      if (context.payload.label === 'Custom Vue Node') {
        return CustomNode;
      }
      return Presets.classic.Node;
    },
    control(context) {
      if (context.payload.isButton) {
        return CustomButton;
      }
      return Presets.classic.Control;
    }
  }
}));
```

#### コントロールとインタラクティビティ

Reactと同様に、カスタムコントロール内のインタラクティブな要素ではイベント伝播の制御が重要である。Vueでは、`@pointerdown.stop=""`ディレクティブを使用してこれを実現する。

```html
<template>
  <button @pointerdown.stop="" @click="data.onClick">
    {{ data.label }}
  </button>
</template>
<script>
//...
</script>
```

#### 高度な統合

`rete-vue-plugin`のユニークな機能として、`VuePlugin`のコンストラクタで`setup`オプションを指定することにより、カスタムのVueアプリケーションインスタンスを注入できる点がある。これにより、VuetifyやVue I18Nといったプロジェクト全体で使用しているVueプラグインを、Rete.jsエディタ内のコンポーネントでも利用可能になる。

#### コードリファレンス

カスタムコンポーネントのテンプレートとして、`rete-js/vue-plugin`リポジトリの`presets/classic/components`ディレクトリにある`Node.vue`や`Socket.vue`が利用できる。 CodeSandbox上の公式サンプルも、実践的なコード例として非常に有用である。

### 2.4. Svelte (`rete-svelte-plugin`)によるカスタマイズ

`rete-svelte-plugin`を用いたカスタマイズも、他のフレームワークと同様のパターンに従う。

#### 方法論とスタイリング

`.svelte`ファイルとしてカスタムコンポーネントを作成し、`customize`プロパティを介して登録する。スタイリングは、コンポーネント内の`<style>`タグで行い、Svelteのスコープ付きCSSの恩恵を受けることができる。

```typescript
// render-plugin.ts
import CustomNode from './CustomNode.svelte';

render.addPreset(Presets.classic.setup({
  customize: {
    node(context) {
      if (context.payload.label === 'Custom Svelte Node') {
        return CustomNode;
      }
      return Presets.classic.Node;
    }
  }
}));
```

#### コントロールとインタラクティビティ

イベント伝播の制御には、`on:pointerdown|stopPropagation`ディレクティブを使用する。これにより、`AreaPlugin`がクリックイベントなどを捕捉するのを防ぐ。

```svelte
<script>
  export let data;
</script>

<button on:pointerdown|stopPropagation on:click={data.onClick}>
  {data.label}
</button>
```

#### コードリファレンス

`rete-js/svelte-plugin`リポジトリの`presets/classic/components`ディレクトリが、カスタムコンポーネントを作成する際のベースとして提供されている。 CodeSandbox上の公式カスタマイズサンプルは、完全な動作環境での実装例を示している。

---

## 第3章 高度なコネクションとソケットのカスタマイズ

ノードエディタの視覚的な表現力とインタラクティビティは、コネクション（接続線）とソケットの挙動に大きく依存する。単にコンポーネントの外観を変更するだけでなく、コネクションの描画パス、生成プロセス、そしてノードへの接続位置をカスタマイズすることで、より直感的で特殊な用途に適したエディタを構築できる。この章では、これらの高度なカスタマイズを実現するための専門的なプラグインと設定オプションについて詳述する。

コネクションのカスタマイズは、複数の関心事が分離された多層的なアプローチを要求する。具体的には、(1) 外観（レンダリングされるコンポーネント）、(2) 形状（SVGパスの曲線や直線）、(3) 挙動（ユーザーのインタラクションフロー）、(4) 位置（ソケットへの接続点）という4つの側面があり、それぞれが異なるプラグインや設定オプションによって制御される。この構造を理解することが、効果的なカスタマイズの鍵となる。

### 3.1. コネクションのパスと外観の変更

#### `rete-connection-path-plugin`によるパスの制御

コネクションのSVGパスの形状は、`rete-connection-path-plugin`によって制御される。このプラグインは、コネクションの始点と終点を結ぶパスの計算方法を定義する`transformer`を提供する。

*   **`classic` transformer:** デフォルトの曲線パスを生成する。
*   **`linear` transformer:** 直線のパスを生成する。これは、より図式的な表現が求められる場合に有用である。公式の「Undirected」サンプルでは、この直線パスが効果的に使用されている。

カスタムの`transformer`関数を提供することで、ベジェ曲線やステップ状のパスなど、完全に独自のパス形状を実装することも可能である。

#### 選択可能なコネクションの実装

コネクション自体を選択可能にし、選択状態に応じてスタイルを変更するカスタマイズも可能である。公式ドキュメントでは、`AreaExtensions.selector()`と連携し、クリックされたコネクションの`selected`状態を管理するカスタムReactコンポーネントの実装方法が示されている。 この実装の要点は、ユーザーのクリックを容易にするために、可視のパスの上に透明で幅の広い`HoverPath`を重ねるというUX上の工夫である。これにより、細い線でもクリックしやすくなる。

```typescript
// styled-componentsを使用した実装例
const Path = styled.path<{ selected?: boolean }>`
  stroke: ${(props) => (props.selected? "orange" : "steelblue")};
  stroke-width: 2px;
  fill: none;
`;

const HoverPath = styled.path`
  fill: none;
  stroke: transparent;
  stroke-width: 15px; /* クリック領域を広げる */
  pointer-events: auto;
`;

// カスタムコネクションコンポーネント内
<g>
  <HoverPath d={path} />
  <Path selected={props.data.selected} d={path} />
</g>```

### 3.2. コネクション生成挙動のカスタマイズ

ユーザーがコネクションを生成する際のインタラクションは、`rete-connection-plugin`が提供するプリセットによって定義される。

*   **`ClassicFlow`**: 出力ソケットをクリックし、次に入力ソケットをクリックすることでコネクションを生成する、最も一般的なフロー。
*   **`BidirectFlow`**: ソケットをクリックし、そのままドラッグして反対側のソケット上でドロップすることでコネクションを生成するフロー。

#### `makeConnection`オプションによる完全な制御

これらのフローのコンストラクタに`makeConnection`関数を渡すことで、ユーザーによるコネクション生成プロセスに介入できる。 この関数は、コネクションが生成される直前に呼び出され、開発者はここで独自の検証ロジック（例：特定の型同士の接続のみを許可する）を実装したり、標準のプレーンオブジェクトの代わりにカスタム`Connection`クラスのインスタンスを生成してエディタに追加したりすることができる。これにより、コネクションに独自のプロパティやメソッドを持たせることが可能になる。

```typescript
import { ClassicFlow, getSourceTarget } from 'rete-connection-plugin';

connection.addPreset(() => new ClassicFlow({
  makeConnection(from, to, context) {
    const [source, target] = getSourceTarget(from, to) || [null, null];
    const { editor } = context;

    if (source && target) {
      // ここで独自の接続可否バリデーションを実行できる
      // if (!canConnect(source, target)) return false;

      editor.addConnection(
        new MyCustomConnection( // 独自のConnectionクラス
          editor.getNode(source.nodeId),
          source.key,
          editor.getNode(target.nodeId),
          target.key
        )
      );
      return true; // コネクションが正常に追加されたことを示す
    }
    return false;
  }
}));
```

### 3.3. ソケット接続点の調整

コネクションがノードのどこに接続されるかは、レンダリングプラグインの`classic.setup()`に渡される`socketPositionWatcher`オプションによって決定される。

#### `getDOMSocketPosition`によるオフセット調整

デフォルトのウォッチャーは`getDOMSocketPosition`であり、ソケットのDOM要素の中心を接続点とする。この関数に`offset`関数を渡すことで、接続点を中心から微調整できる。 例えば、ソケットの少し外側から線が出るように見せたい場合に有効である。

```typescript
import { getDOMSocketPosition } from 'rete-render-utils';

render.classic.setup({
  socketPositionWatcher: getDOMSocketPosition({
    offset({ x, y }, nodeId, side, key) {
      // 出力ソケットは右に10px、入力ソケットは左に10pxずらす
      const dx = side === 'output'? 10 : -10;
      return { x: x + dx, y: y };
    },
  })
});
```

#### `BaseSocketPosition`の拡張によるカスタム計算

円形ノードのように、接続点をノードの境界線上に配置したい場合や、パフォーマンス上の理由でDOM要素の計算を避けたい場合など、より高度な制御が必要な場合は、`BaseSocketPosition`クラスを拡張して独自のウォッチャーを実装できる。 `calculatePosition`メソッドをオーバーライドし、ノードの原点を基準とした相対座標を返すロジックを実装する。これにより、ノードの形状に合わせた精密な接続点制御が可能となる。「Undirected」サンプルのように、コネクションをノードの境界に正確に合わせる必要があるケースは、このアプローチの典型的な使用例である。

---

## 第4章 ノードのレイアウトと配置

ノードエディタにおける「配置」は、ユーザーによる手動操作だけでなく、プログラムによる制御やアルゴリズムに基づいた自動整理も含まれる。Rete.js v2は、`AreaPlugin`を介した直接的な位置操作APIと、`rete-auto-arrange-plugin`を通じた高度な自動レイアウト機能の両方を提供し、開発者がノードの配置を柔軟に管理できるようにしている。

### 4.1. プログラムによる配置と操作

`AreaPlugin`は、個々のノードの位置を直接制御するための基本的なAPIを提供する。これらは、ユーザーのアクションに応答してノードを動かしたり、エディタの表示状態を初期化したりする際に不可欠である。

#### ノードの位置変更

特定のノードを任意の位置に移動させるには、`area.translate()`メソッドを使用する。 このメソッドはノードIDと目標座標（または現在の位置からの差分）を引数にとり、ノードを指定された位置へ移動させる。

```typescript
// ノードID 'some-node-id' のノードを座標 (100, 200) に移動
await area.translate('some-node-id', { x: 100, y: 200 });
```

#### ビューポートの調整

エディタ上のすべてのノードが画面内に収まるようにビューポートのズームとパンを自動調整するには、`AreaExtensions.zoomAt()`拡張機能を使用する。 これは、グラフをロードした直後や、ユーザーが全体像を確認したい場合に特に有用である。

```typescript
import { AreaExtensions } from "rete-area-plugin";

// エディタ内の全ノードを取得
const allNodes = editor.getNodes();
// 全ノードが収まるようにビューポートを調整
AreaExtensions.zoomAt(area, allNodes);
```

**注意点:** このメソッドはノードの寸法を`clientWidth`や`clientHeight`から計算するため、ノードがDOMにレンダリングされ、表示状態になるまで正しく機能しない場合がある。確実な寸法計算のためには、ノードクラスに`width`と`height`プロパティを明示的に指定することが推奨される。

### 4.2. `rete-auto-arrange-plugin`による自動レイアウト

より複雑なグラフにおいて、ノードを手動で整理するのは非効率である。`rete-auto-arrange-plugin`は、強力なグラフ描画ライブラリである`elk.js`を利用して、ノードの位置をアルゴリズムに基づいて自動的に配置する機能を提供する。

#### 前提条件と設定

このプラグインを効果的に使用するための最も重要な前提条件は、レイアウトアルゴリズムが各ノードの寸法を必要とするため、ノードクラスに`width`と`height`プロパティを明示的に定義しておくことである。

```typescript
class MyNode extends ClassicPreset.Node {
  width = 180;
  height = 120;
}
```

プラグインの接続は通常通り`area.use()`で行い、classicプリセットを適用する。

```typescript
import { AutoArrangePlugin, Presets as ArrangePresets } from "rete-auto-arrange-plugin";

const arrange = new AutoArrangePlugin<Schemes>();
arrange.addPreset(ArrangePresets.classic.setup());
area.use(arrange);
```

#### レイアウトの実行とカスタマイズ

レイアウトの実行は、`arrange.layout()`メソッドを非同期で呼び出すことでトリガーされる。このメソッドは、配置をカスタマイズするためのオプションを受け入れる。

*   **アニメーション付き適用 (`applier`):** `ArrangeAppliers.TransitionApplier`を使用すると、ノードが新しい位置へ即座に移動するのではなく、スムーズなアニメーションで遷移させることができる。アニメーションの時間やイージング関数も設定可能である。
    ```typescript
    import { ArrangeAppliers } from "rete-auto-arrange-plugin";

    const applier = new ArrangeAppliers.TransitionApplier<Schemes, AreaExtra>({
      duration: 500, // 500msかけてアニメーション
      timingFunction: t => t < 0.5? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2 // ease-in-out
    });

    await arrange.layout({ applier });
    ```
*   **`elk.js`オプション (`options`):** `layout`メソッドの`options`プロパティを通じて、`elk.js`のレイアウトオプションを直接指定できる。これにより、ノード間の間隔、レイアウトの方向（上下左右）、使用するアルゴリズムなどを細かく制御できる。
    ```typescript
    await arrange.layout({
      options: {
        'elk.algorithm': 'layered',
        'elk.direction': 'DOWN', // 上から下へのレイアウト
        'elk.spacing.nodeNode': '50', // ノード間の間隔を50に設定
        'elk.layered.spacing.nodeNodeBetweenLayers': '80' // レイヤー間のノード間隔
      }
    });
    ```

このプラグインは、`rete-scopes-plugin`によって管理されるネストされたノード（サブグラフ）にも対応しており、Rete.jsエコシステムのプラグインが持つ高い合成可能性を示している。

---

## 第5章 代替アプローチ: 直接的なCSSと低レベル操作

コンポーネントベースのカスタマイズが最も堅牢で推奨される手法である一方、特定のシナリオではより直接的で低レベルなアプローチが有効な場合がある。この章では、CSSセレクタによるスタイルの上書きと、`AreaPlugin`のパイプシステムを利用したDOMの直接操作という2つの代替アプローチについて解説する。これらの手法は、迅速なプロトタイピングや、コンポーネントモデルでは対応が難しい動的な要求に応えるための「エスケープハッチ」として位置づけられるが、その利点と潜在的なリスクを理解した上で慎重に用いる必要がある。

### 5.1. CSSセレクタによるデフォルトスタイルの上書き

Rete.jsの`classic`プリセットによってレンダリングされる要素は、予測可能なCSSクラス名を持つ。これを利用して、グローバルなCSSファイルからスタイルを直接上書きすることができる。

#### 方法論とセレクタ

*   **ノード:** すべてのノードは`.node`クラスを持つ。加えて、`new ClassicPreset.Node('My Node')`のようにして作成されたノードは、ケバブケースに変換されたクラス名（この場合は`.my-node`）も持つ。
*   **ソケット:** すべてのソケットは`.socket`クラスを持つ。`new Rete.Socket('Number value')`のようにして定義されたソケットは、同様にケバブケース化された`.number-value`クラスを持つ。
*   **コンテキストメニュー:** コンテキストメニュー全体は`[rete-context-menu]`属性セレクタで、個々のアイテムは`.item`クラスでターゲットできる。

#### ユースケースと限界

このアプローチは、コンテキストメニューの幅や背景色を変更するなど、アプリケーション全体で一貫した軽微なスタイル調整には非常に効果的である。

```css
/* グローバルCSSファイル */
.node.my-node {
  background-color: lightblue;
}

.socket.number-value {
  background: #96b38a;
}

[rete-context-menu] {
  width: 300px !important; /* !importantが必要になる場合がある */
}
```

しかし、この手法には重大な欠点がある。GitHubのIssueでの議論が示すように、ReactやVue、AngularなどのモダンなUIフレームワークは、コンポーネントのスタイルが他のコンポーネントに影響を与えないように「スコープ付きCSS」の仕組みを持っている。 例えば、Angularは`[ng-content-*]`のようなユニークな属性を要素に追加するため、コンポーネント内で定義したスタイルはグローバルなRete.jsの要素には適用されない。結果として、開発者はスタイルの優先度を強制的に上げるために`!important`を使用したり、スコープを持たないグローバルなスタイルシートに定義を記述したりする必要に迫られる。これは保守性を低下させ、将来のライブラリのアップデートでスタイルが壊れるリスクを高めるため、大規模なカスタマイズには推奨されない。

### 5.2. イベントリスナーとパイプによる動的スタイリング

よりプログラム的で動的なスタイル操作を行いたいが、完全なカスタムコンポーネントを作成するほどではない場合、Rete.jsが提供する低レベルなイベントフックを利用する方法がある。

#### `area.addPipe`によるDOM要素へのアクセス

`AreaPlugin`が持つパイプシステムは、プラグイン内部で発生する様々なイベント（コンテキスト）をインターセプトするための強力な仕組みである。`'render'`コンテキストをリッスンすることで、ノードやコネクションがDOMにレンダリングされる瞬間に介入できる。

パイプ関数内では、`context.data.element`を通じてレンダリングされた生の`HTMLElement`にアクセスできる。これを利用して、任意のCSSクラスを動的に追加したり、インラインスタイルを設定したりすることが可能である。

```typescript
area.addPipe(context => {
  if (context.type === 'render' && context.data.type === 'node') {
    const nodeData = editor.getNode(context.data.payload.id);
    // 特定の条件に基づいてクラスを追加
    if (nodeData && nodeData.label === 'Highlight') {
      context.data.element.classList.add('highlighted-node');
    }
  }
  return context;
});
```

#### `editor.on`によるイベントリスニング

同様に、`editor`インスタンスのイベントリスナー（例: `editor.on('renderconnection')`）を使用して、特定の要素がレンダリングされた際にDOM要素（`el`）を取得し、直接スタイル属性を設定する方法もGitHubのIssueで議論されている。 これはv1時代のパターンに近い可能性があるが、v2でも同様のイベントフックが利用可能な場合がある。

#### このアプローチの意義とトレードオフ

これらの低レベルな操作は、宣言的なコンポーネントモデルの枠組みから逸脱するが、その代わりに大きな柔軟性を提供する。Vanilla JS環境でRete.jsを使用する場合や、パフォーマンスが非常に重要で、UIフレームワークの再レンダリングコストを避けたい動的なスタイリング（例：リアルタイムデータに応じてノードの色を頻繁に更新する）には最適な選択肢となり得る。

しかし、この手法は関心の分離の原則を破り、ロジックが分散しがちになるため、コードの可読性と保守性を損なうリスクがある。高レベルなコンポーネントベースのアプローチと、低レベルな命令型のDOM操作との間には明確なトレードオフが存在する。Rete.js v2は両方のアプローチを可能にすることで、開発者が直面する多様な課題に対して適切なツールを選択できる自由を提供している。

### 6.1. ソケットの詳細な調整・変更について

### 結論：推奨されるアプローチ

  * **見た目（色、形、アイコンなど）を大幅に変更したい場合：**
    **コンポーネントの置換**が最も強力で推奨される方法です。これにより、HTML構造とCSSを完全に制御できます [1, 2]。

  * **ノードに対するソケットの表示順序を変更したい場合：**
    `index`プロパティを使用するのが最も簡単で直接的な方法です [3]。

  * **コネクション（接続線）がソケットに接続される位置を微調整したい場合：**
    `socketPositionWatcher`オプションを使用するのが正しいアプローチです [4]。

-----

### 各アプローチの詳細

#### 1\. 見た目（表示スタイル）の変更

##### A) コンポーネントの置換（推奨）

ソケットのHTML構造やスタイルを根本的に変更したい場合に最適な方法です。使用しているUIフレームワーク（React, Vue, Svelteなど）のカスタムコンポーネントを作成し、レンダリングプラグインの`customize`プロパティを通じて登録します [1, 2, 5]。

**方法：**
`Presets.classic.setup()` の `customize` オプション内で `socket()` ハンドラを定義し、自作のコンポーネントを返します。

```typescript
// React.jsの場合の例
import { CustomSocket } from './CustomSocket'

render.addPreset(Presets.classic.setup({
  customize: {
    socket() {
      return CustomSocket; // 自作のReactコンポーネントを返す
    }
  }
}));
```

このアプローチにより、デザインシステムに合わせた独自のソケット（例：特定のアイコンを表示する、形状を円から四角に変えるなど）を自由に実装できます。カスタムコンポーネントの雛形として、各レンダリングプラグインのソースコード内にあるデフォルトの`Socket`コンポーネント（`Socket.tsx`, `Socket.vue`など）を参考にすることが公式に推奨されています [1, 2, 5]。

##### B) CSSセレクタによる上書き

簡単な色の変更など、軽微なスタイル調整であれば、CSSで上書きする方法も考えられます。`classic`プリセットで生成されるソケットには、特定のCSSクラスが付与されます。

  * **汎用クラス:** `.socket`
  * **固有クラス:** `new Rete.Socket('Number value')` のように定義されたソケットには、ケバブケースに変換された `.number-value` というクラスが付きます [6]。

**方法：**
グローバルなCSSファイルでこれらのセレクタを対象にスタイルを定義します。

```css
/* 特定のソケットの背景色を変更 */
.socket.number-value {
  background: #96b38a;
}
```

ただし、この方法はUIフレームワークのスコープ付きCSSと競合する可能性があり、スタイルの優先度を上げるために`!important`が必要になる場合があるため、大規模な変更には推奨されません [6]。

#### 2\. 配置と位置関係の変更

##### A) 表示順序の変更

一つのノードに複数の入力または出力がある場合、その表示順序は各ソケット（またはコントロール）の`index`プロパティで制御できます [3]。

**方法：**
`addInput`や`addOutput`で追加する際に、`index`プロパティを設定します。数値が小さいほど上に表示されます。

```typescript
const input1 = new ClassicPreset.Input(socket, 'Input B');
input1.index = 1; // 2番目に表示

const input2 = new ClassicPreset.Input(socket, 'Input A');
input2.index = 0; // 1番目に表示

node.addInput('b', input1);
node.addInput('a', input2);
```

##### B) 接続点の位置調整

コネクション（接続線）がソケットのどの点に接続されるかを制御するには、レンダリングプラグインの`socketPositionWatcher`オプションを使用します。

**方法1：オフセットによる微調整**
`getDOMSocketPosition`ユーティリティを使い、`offset`関数で接続点を中心からずらすことができます。例えば、ソケットの少し外側から線が出るように見せたい場合に有効です。

```typescript
import { getDOMSocketPosition } from 'rete-render-utils';

render.addPreset(Presets.classic.setup({
  socketPositionWatcher: getDOMSocketPosition({
    offset({ x, y }, nodeId, side, key) {
      // 出力ソケットは右に10px、入力ソケットは左に10pxずらす
      const dx = side === 'output'? 10 : -10;
      return { x: x + dx, y: y };
    },
  })
}));
```

**方法2：カスタム計算ロジックの実装**
円形ノードのように、接続点をノードの形状に合わせて動的に計算したい場合は、`BaseSocketPosition`クラスを継承して独自のウォッチャーを実装します。これにより、DOM要素の位置に依存しない、より高度な位置計算が可能になります。

---

## 結論と推奨事項

本レポートでは、Rete.js v2におけるノード、ソケット、コネクションのビジュアルカスタマイズに関する多様なアプローチを、公式ドキュメントおよびコミュニティの情報を基に詳細に分析した。分析の結果、Rete.js v2のアーキテクチャは、UIフレームワークに依存しないコアと、描画を担当する専門のレンダリングプラグインという明確な分離を特徴としており、この構造がカスタマイズ手法の全体像を決定づけていることが明らかになった。

開発者がプロジェクトの要件に応じて最適な手法を選択できるよう、以下に階層的な推奨事項を提示する。

1.  **主要な推奨アプローチ: コンポーネントベースのカスタマイズ**
    ノードの構造変更、カスタムコントロールの追加、あるいはアプリケーションのデザインシステムとの完全な統合など、重要かつ構造的なカスタマイズを行う場合は、常に第2章で詳述したコンポーネントベースのアプローチを選択すべきである。レンダリングプラグインの`customize`プロパティを通じてカスタムコンポーネントを注入するこの方法は、最も堅牢で保守性が高く、各UIフレームワークの思想に沿ったイディオマティックな実装を可能にする。

2.  **挙動とレイアウトの制御: 専門プラグインの活用**
    コネクションのパス形状（曲線か直線か）、生成時のインタラクション、あるいはノードの自動配置といった、外観以上の挙動やレイアウトに関するカスタマイズには、Rete.jsエコシステムが提供する専門プラグインを活用することが推奨される。第3章で解説した`rete-connection-path-plugin`や`rete-connection-plugin`、第4章の`rete-auto-arrange-plugin`などがこれにあたる。これらのプラグインは特定の課題を解決するために設計されており、安定した機能を提供する。

3.  **軽微なスタイル調整: CSSセレクタによるオーバーライド**
    コンテキストメニューの幅や、特定のソケットの色をグローバルに変更するなど、アプリケーション全体に適用する軽微なスタイル調整には、第5.1章で述べた直接的なCSSオーバーライドが許容される場合がある。ただし、UIフレームワークによるCSSのスコープ問題を念頭に置き、`!important`の使用や将来的なアップデートによる破損のリスクを理解した上で、限定的に使用すべきである。

4.  **高度な動的スタイリング: 低レベルなパイプ・イベント操作**
    コンポーネントモデルでは対応が困難な、パフォーマンスが要求される動的なスタイル変更や、Vanilla JS環境での統合など、特殊な要件に対しては、第5.2章で解説した低レベルなパイプやイベントを利用したDOM直接操作が最終手段として考えられる。これは強力な「エスケープハッチ」であるが、宣言的なモデルを破壊し、保守性を低下させる可能性があるため、そのトレードオフを十分に理解し、慎重に適用する必要がある。

総括すると、Rete.js v2は、開発者に対して明確なカスタマイズの階層を提供している。まずは高レベルで宣言的なコンポーネントベースのアプローチを検討し、次に専門的なプラグインの活用を考え、最後の手段としてのみ低レベルな操作に頼るという順序でアプローチすることが、長期的かつ安定したアプリケーション開発に繋がる最善の戦略であると結論付けられる。

---

## 引用文献

1.  Rete.js - JavaScript framework for visual programming, 10月 5, 2025にアクセス、 https://retejs.org/
2.  Documentation - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/docs/
3.  Integration - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/docs/concepts/integration/
4.  Editor - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/docs/concepts/editor/
5.  Basic editor - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/docs/guides/basic/
6.  React.js - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/docs/guides/renderers/react/
7.  Vue.js - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/docs/guides/renderers/vue/
8.  Svelte - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/docs/guides/renderers/svelte/
9.  retejs/react-plugin - GitHub, 10月 5, 2025にアクセス、 https://github.com/retejs/react-plugin
10. retejs/vue-plugin - GitHub, 10月 5, 2025にアクセス、 https://github.com/retejs/vue-plugin
11. Customization for React.js example - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/examples/customization/react/
12. Rete.js v2 customization - Codesandbox, 10月 5, 2025にアクセス、 https://codesandbox.io/s/rete-js-v2-customization-mf1brp
13. Vue.js example - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/examples/basic/vue/
14. rete-vue-plugin examples - CodeSandbox, 10月 5, 2025にアクセス、 https://codesandbox.io/examples/package/rete-vue-plugin
15. Svelte example - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/examples/basic/svelte/
16. Rete.js Svelte customization - CodeSandbox, 10月 5, 2025にアクセス、 https://codesandbox.io/p/sandbox/rete-js-svelte-customization-29v37z
17. Plugins - Rete.js, 10月 5, 2025にアクセス、 https://rete.readthedocs.io/en/latest/Plugins/
18. Undirected example - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/examples/undirected/
19. Selectable connections - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/docs/guides/selectable/connections/
20. Connections - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/docs/guides/connections/
21. FAQ - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/docs/faq/
22. Arrange nodes - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/docs/guides/arrange/
23. Arrange nodes example - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/examples/arrange/
24. Stable vertical render with arrange plugin (rete V2) · Issue #697 · retejs/rete - GitHub, 10月 5, 2025にアクセス、 https://github.com/retejs/rete/issues/697
25. Scopes - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/docs/guides/scopes/
26. Rete.js Node Editor UE4 Style - CodePen, 10月 5, 2025にアクセス、 https://codepen.io/shift-reality/pen/wOmyMV
27. Sockets - Rete.js - Read the Docs, 10月 5, 2025にアクセス、 https://rete.readthedocs.io/en/latest/Sockets
28. Rete.js: Getting started, 10月 5, 2025にアクセス、 https://rete.readthedocs.io/
29. Angular - Rete.js, 10月 5, 2025にアクセス、 https://retejs.org/docs/guides/renderers/angular/
30. Customize styling of context menu · Issue #9 · retejs/context-menu ..., 10月 5, 2025にアクセス、 https://github.com/retejs/context-menu-plugin/issues/9
31. Customize connection rendering (CSS) · Issue #21 · retejs ... - GitHub, 10月 5, 2025にアクセス、 https://github.com/retejs/connection-plugin/issues/21
32. Getting started with Rete.js | JavaScript framework for visual programming : r/retejs - Reddit, 10月 5, 2025にアクセス、 https://www.reddit.com/r/retejs/comments/165a16q/getting_started_with_retejs_javascript_framework/