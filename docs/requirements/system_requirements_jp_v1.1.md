# システム要件定義書（System Requirements, SR）

AI Chatbot（Google Gemini API）

```text
Version : 1.1
Status  : Frozen（Logic Freeze / Gate 0）
Date    : 2026/01/29
Owner   : BrSE Dang
Input   : Client Requirements v1.1
```

---

## 1. 本書の目的
本書は、Client Requirements（顧客要求）をシステム要件へ落とし込み、**設計・開発・テスト**の判断基準を統一することを目的とする。  
本書の内容は、BrSE/Dev/QA の合意済みベースラインとして扱い、変更は Decision/Change Request を通して管理する。

---

## 2. システム範囲

### 2.1 In Scope
- Webサイトに埋め込むチャットボットUI（ポップアップウィジェット）
- Google Gemini API と連携し、回答を生成
- テキストチャット、画像アップロード（Vision）、絵文字ピッカーを提供
- Desktop / Mobile ブラウザで動作（レスポンシブ対応）

### 2.2 Out of Scope
- チャットボット利用者のユーザー管理（認証・認可）
- サーバー側での履歴保存（server-side persistence）やマルチデバイス同期
- 管理画面・分析（Analytics）
- 高度なモデレーション、ストリーミング応答（トークン逐次表示）
- 複数AIプロバイダ対応（v1は Gemini のみ）

---

## 3. アクター

| Actor | 説明 |
|------|------|
| End User | Webサイト上でチャットボットを利用するユーザー |
| AI System（Gemini） | AI応答を提供する外部サービス（Google Gemini） |
| Web System | チャットボットを埋め込むWebサイト（ブラウザ実行環境） |

---

## 4. システム概要

### 4.1 論理構成（Logical Architecture）
End User → Chatbot UI（Browser） →（Proxy API：任意/Phase2）→ Google Gemini API

### 4.2 設計方針（Architecture Principles）
- **UI層とAIサービス層を分離**し、保守性を確保する
- **本番環境で API Key を公開しない**（Phase2 で Proxy/Serverless 推奨）
- モデル変更（例：gemini-2.0-flash / gemini-2.5-flash-lite 等）を将来的に差し替え可能な構造にする

---

## 5. 機能要件（Functional Requirements）

### 5.1 機能要件一覧（SR-01〜SR-14）
| ID    | 要件名（短） | 詳細 |
|------|--------------|------|
| SR-01 | チャットボットウィジェット表示 | 画面右下にトグルボタンを表示し、ポップアップを開閉できること |
| SR-02 | 入力欄の自動伸縮 | Textarea が内容に応じて高さを自動調整すること |
| SR-03 | 初期あいさつ表示 | 初回表示時にボットの定型メッセージを表示すること |
| SR-04 | ユーザー送信メッセージ表示 | 送信したテキスト/画像を user-message として表示すること |
| SR-05 | AIへのリクエスト送信 | テキスト/画像を Gemini API に送信すること |
| SR-06 | AI応答表示 | 取得した応答を bot-message として表示し、基本的なMarkdown整形を適用すること |
| SR-07 | 画像アップロード | 画像の選択、プレビュー、送信前キャンセルができること |
| SR-08 | Visionリクエスト | 画像を base64 でエンコードし、プロンプトと一緒に Gemini へ送信できること |
| SR-09 | 絵文字ピッカー | 絵文字を選択し、カーソル位置へ挿入できること |
| SR-10 | Thinkingインジケータ | AI応答待ち中に “thinking（3点）” を表示すること |
| SR-11 | エラーハンドリング | API/ネットワークエラーを表示し、UIがクラッシュしないこと |
| SR-12 | （OP-03）履歴保存 | localStorage に履歴を保存し、リロード後に復元できること |
| SR-13 | （OP-04）画像制限 | 画像は 5MB 以下、PNG/JPG(JPEG)/WebP のみ許可すること |
| SR-14 | （OP-02）言語自動判定 | 既定は英語、ユーザー入力言語を推定し同言語で返答すること |

---

## 6. 非機能要件（Non-Functional Requirements）

### 6.1 非機能要件一覧（NFR-01〜NFR-05）
| ID    | 要件名（短） | 詳細 |
|------|--------------|------|
| NFR-01 | セキュリティ | API Key の保護、localStorage に機密情報を保存しない |
| NFR-02 | 性能 | 目標応答 < 5秒、UIスクロール滑らか、絵文字ピッカーの遅延ロード |
| NFR-03 | 互換性 | Desktop/Mobile の主要ブラウザに対応 |
| NFR-04 | データ制限 | 画像サイズ制限、localStorage 容量制限に配慮 |
| NFR-05 | 拡張性 | provider/model 差し替えが容易なコード構造 |

### 6.2 非機能要件 詳細
#### NFR-01：セキュリティ
- **Phase 1**：デモ/開発用途として、API Key をクライアントに置く（公開リスクあり）
- **Phase 2（将来）**：Proxy サーバーまたは Serverless Function を用いて API Key を秘匿する
- localStorage に **機密情報（API Key、Token、個人識別情報など）** を保存しない

#### NFR-02：性能
- 目標応答時間：短い質問で **5秒未満**（ネットワーク・モデルに依存）
- メッセージ増加時も UI のスクロールが滑らかであること
- 絵文字ピッカーは必要時にロード（Lazy loading）し、初期表示を阻害しないこと

#### NFR-03：互換性
- Desktop：Chrome / Edge / Safari（最新版）
- Mobile：Chrome Android / Safari iOS（最新版）
- レスポンシブ：Mobile ではフルスクリーン、Desktop ではポップアップ表示

#### NFR-04：データ制限
- 画像アップロード：**5MB 以下**
- 対応形式：PNG / JPG(JPEG) / WebP
- localStorage：ブラウザ依存（一般に **約5〜10MB**）のため、保存サイズ上限を考慮すること

#### NFR-05：拡張性
- AIモデル/プロバイダの差し替えを前提に、API呼び出し層を分離すること
- UI コンポーネントとサービス層を分割して保守性を高めること

---

## 7. データ＆インターフェース（Data & Interface）

### 7.1 Input Data
- **テキストプロンプト**：String（UTF-8）
- **画像**：base64 文字列 ＋ mimeType（image/png, image/jpeg, image/webp）
- **チャット履歴**：message 配列（role: user/model、parts: text / inline_data）

### 7.2 Output Data
- **AI応答テキスト**：Markdown を含む可能性あり
- **エラーメッセージ**：APIエラー、ネットワークエラー、クォータ超過などの説明文

### 7.3 Storage（localStorage）
- Key：`chatHistory`
- Value：message オブジェクトの JSON 配列
- Lifetime：ユーザーがブラウザデータを削除するまで、またはアプリが明示的にクリアするまで保持

### 7.4 API 連携（Gemini）
- Endpoint：`https://generativelanguage.googleapis.com/v1/models/{model}:generateContent`
- Model：`gemini-2.0-flash` / `gemini-2.5-flash-lite`（または同等）
- Method：POST
- Headers：`Content-Type: application/json`
- Query：`key={API_KEY}`

---

## 8. 前提条件＆制約

### 8.1 前提条件（Assumptions）
- クライアントが Gemini API を利用可能な **有効な API Key** を提供する
- 対象 Web サイトが JS/CSS の埋め込みと外部 API 呼び出しを許可している
- ユーザーブラウザが localStorage / FileReader / ES6+ をサポートしている
- API 呼び出しに必要なネットワーク接続が確保されている

### 8.2 制約（Constraints）
- **Gemini API クォータ**：Free tier はリクエスト数/トークンに制限がある
- **ブラウザ制限**：localStorage 容量は環境依存（約5〜10MB）
- **ペイロード制限**：画像を含むため、リクエストサイズ上限に達する可能性がある
- **セキュリティ**：Phase 1 で Proxy を用いない場合、API Key がクライアント側に露出する（デモ用途に限定）

---

## 9. トレーサビリティ（Traceability Matrix）

| Client Req | System Req | 説明 |
|------------|------------|------|
| FR-01 | SR-01 | トグルで開閉 |
| FR-02 | SR-03 | 初期あいさつ |
| FR-03 | SR-04, SR-05, SR-06 | テキスト送受信 |
| FR-04 | SR-04 | Enter / Shift+Enter |
| FR-05 | SR-02 | 入力欄自動伸縮 |
| FR-06 | SR-07 | 画像選択・プレビュー・キャンセル |
| FR-07 | SR-08 | Vision（画像＋テキスト） |
| FR-08 | SR-09 | 絵文字挿入 |
| FR-09 | SR-10 | Thinking 表示 |
| FR-10 | SR-11 | エラー表示 |
| OP-03 | SR-12 | localStorage 履歴 |
| OP-04 | SR-13 | 画像 5MB / 形式制限 |
| OP-02 | SR-14 | 言語自動判定 |

---

## 10. Open Points（解決済）

### OP-01：Proxy Server
**決定**：Phase 1 は Proxy 必須ではない（API Key 露出：デモ/開発限定）。Phase 2 で Node/Serverless を推奨。

### OP-02：既定言語
**決定**：既定は英語。ユーザー入力言語を推定し、同言語で返答する。

### OP-03：画像制限
**決定**：5MB 以下、PNG/JPG(JPEG)/WebP を許可。

### OP-04：履歴保存
**決定**：localStorage（クライアント側）。デバイス間同期は行わない。

---

## 11. 改訂履歴（Revision History）
| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | 2026/01/29 | Initial draft version | BrSE Dang |
| 1.1 | 2026/01/29 | CR v1.1 反映。Open Points 解決、localStorage/画像制限/言語自動判定を追記し Freeze | BrSE Dang |
