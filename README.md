# 🌌 Nostr Activity Analysis Tools

このディレクトリには、Nostr プロトコル上での個人の活動データを取得・分析し、美しいレポートを生成するためのツール群が含まれています。

## 🛠️ セットアップ

### 1. 依存関係のインストール

ルート直下で以下を実行してください：

```bash
npm install
```

### 2. 設定のカスタマイズ

`config.js` を編集するか、環境変数を設定して取得対象を指定します。

- `YEAR`: 対象年
- `PUBKEYS`: 対象とする Nostr 公開鍵（Hex 形式）の配列
- `RELAYS`: データの取得に使用するリレーのリスト
- `NOSTR_LINK_PREFIX`: レポート内のイベントリンク形式（デフォルト: `nostr:`）
  - `nostr:` を指定すると直接引用形式になります。
  - `https://lumilumi.app/` などの URL を指定すると Web リンクになります。

## 🚀 ワークフロー

以下の順序でスクリプトを実行することで、最終的なレポートが生成されます。

### Step 1: データの取得

テキスト投稿（Kind 1）とエンゲージメント（リアクション、リポスト、Zap）を取得します。

```bash
node fetch_nostr.js
node fetch_engagement.js
```

- 出力: `./<YEAR>/nostr_activity.json`, `./<YEAR>/nostr_engagement.json` (対象年のフォルダが存在しない場合は自動作成されます)

### Step 2: エンゲージメントの分析

取得したデータを統合し、月ごとの統計やバズった投稿を抽出します。

```bash
node analyze_engagement.js
```

- 出力: `./<YEAR>/nostr_viral_insights.json` (出力は対象年フォルダ内に保存されます)

### Step 3: レポートの自動生成

分析結果に基づき、Markdown 形式のアクティビティレポートを機械的に生成します。

```bash
node generate_summary.js
```

- 出力: `./<YEAR>/nostr_summary_<YEAR>.md` (対象年フォルダ内に保存されます)

## 📁 ファイル構成

- `config.js`: 共通設定（公開鍵、リレー、リンク形式）
- `fetch_nostr.js`: テキスト投稿の取得
- `fetch_engagement.js`: リアクション等の取得
- `analyze_engagement.js`: データの集計とインサイトの抽出
- `generate_summary.js`: Markdown レポートの生成
- `README.md`: このドキュメント

## 📝 補足

- 取得期間はスクリプト内の `startMonth` で調整可能です。
- データが巨大な場合（数万件以上）、取得に時間がかかることがあります。進捗はコンソールにログ出力されます。
