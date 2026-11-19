# moment株式会社 コーポレートサイト

https://www.moment-tokyo.jp/ の静的サイトです。

## 更新と自動公開

HTML、assets/style.css、assets/site.js、画像を編集し、main ブランチにコミットすると Cloudflare Pages が自動公開します。

## 公開設定

- プロジェクト: moment-hp
- 本番ブランチ: main
- フレームワーク: None
- ビルドコマンド: なし
- 出力ディレクトリ: .
- Pages URL: https://moment-hp.pages.dev/
- 独自ドメイン: moment-tokyo.jp / www.moment-tokyo.jp

## メールと別サイト

メール用DNSレコードは別に管理しています。既存のMX・TXT・メール関連レコードを維持してください。actify はお名前.com、compass は Vercel の既存設定を維持しています。

## AI検索・クローラ向けファイル

- robots.txt / sitemap.xml / llms.txt はサイトのルートに置いています。ページを追加・削除したら sitemap.xml と llms.txt も更新してください。
- 各ページの `<head>` に JSON-LD（Organization、トップは WebSite、下層は BreadcrumbList）を入れています。会社情報を変えたら全ページの JSON-LD も合わせて直してください。
