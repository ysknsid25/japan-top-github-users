# Japan Top GitHub Users

元ネタは[@yusukebe](https://github.com/yusukebe)さんの[top-github-users-only-japan](https://github.com/yusukebe/top-github-users-only-japan)です。さらに本家は[Top GitHub Users By Country](https://github.com/gayanvoice/top-github-users")です。

元々は、

> [Top GitHub Users By Country](https://github.com/gayanvoice/top-github-users")がおもしろいのですが、いかんせん日本（に限らないけど）の更新頻度が低くて、情報が古いので、更新頻度を高めにした「日本に限った」ものを作りました。本家で使っている<a href="https://github.com/yusukebe/top-github-users-action">GitHub
> ActionsをForkしたもの</a>を使ってページを生成しています。

という経緯で日本版のTop GitHub
Usersの一覧を作成していたものがありました。が、Node
14のランタイム前提で動いていたりなどレガシーな部分が目立ってきており、「コントリビュートにより綺麗にしていくくらいならいっそDenoの勉強がてら綺麗に一から作ってしまおう」というモチベーションによりこのリポジトリを公開しています。

なので、もし気に入ったら[本家のレポジトリ](https://github.com/gayanvoice/top-github-users)や[yusukebeさんのリポジトリ](https://github.com/yusukebe/top-github-users-only-japan)に
⭐ するのをお忘れなく。

# Getting Start

## 1. 🔒 Create a new personal access token with repo workflow admin:org user options

Go to Settings -> Developer settings -> Personal Access Tokens and click on
Generate new token button. Give it any name and select `repo` `workflow`
`admin:org` -> `read:org` `user` -> `read:user` options and click on Generate
token button. ✂️ Copy the token.

## 2. set env

Save the token as an environment variable named `CUSTOM_TOKEN`

## 3. run

```bash
deno task exec
```
