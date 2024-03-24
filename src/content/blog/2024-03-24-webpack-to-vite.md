---
author: おーせ
pubDatetime: 2024-03-24
title: webpackからviteに乗り換え奮闘記(Laravel・Vite)
slug: webpack-to-vite
featured: true
draft: true
# ogImage: https://user-images.githubusercontent.com/53733092/215771435-25408246-2309-4f8b-a781-1f3d93bdf0ec.png
tags:
  - Laravel
  - Vite
description: Laravel・Vueのプロジェクトでwebpackからviteに乗り換えたので、その奮闘記を書き記します。
---

## はじめに
プロジェクト(Laravel)のモジュールバンドラーを`Webpack`から`Vite`に乗り換えたのでその備忘録として記載します。<br />

## webpackからviteに移行する手順
詳しくは[Readouble](https://readouble.com/laravel/10.x/ja/vite.html)に記載されている[移行ガイド](https://github.com/laravel/vite-plugin/blob/main/UPGRADE.md#migrating-from-laravel-mix-to-vite)通りに行いました。<br />
行なったことは以下のとおりです。<br />

- `Vite`と`Laravel`プラグインをインストールする
- `Vite`の設定（`vite.config.js`の作成）
- `package.json`(npmスクリプト)の更新
- 環境変数の更新
- `webpack`関連のライブラリをアンインストール
- requireをimport文に修正
- bladeに対してviteのディレクティブを記載・参照する。（`@vite('resources/js/app.js')`などの設定）

## 実際の作業
それぞれ簡単に説明していきます。

### `Vite`と`Laravel`プラグインをインストールする
こちらは以下ライブラリ(`vite`、`laravel-vite-plugin`)のインストールをします。<br />
```zsh
npm install --save-dev vite laravel-vite-plugin
```
本プロジェクトでは`Vue`も使っていたので、`@vitejs/plugin-vue`のインストールを行いました。<br />
```zsh
npm install --save-dev @vitejs/plugin-vue
```
これらインストールしたライブラリをもとに`vite.config.js`を作成しました。
### `Vite`の設定（`vite.config.js`の作成）
Viteの設定を行うために、`vite.config.js`を作成し、以下のように記述します。
```javascript
import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import fs from "fs";
import 'dotenv/config';

const host = process.env.APP_DOMAIN ?? 'localhost';

export default defineConfig({
    server: {
        host: host,
        hmr: {
            host
        },
        https: {
            key: fs.readFileSync(`/etc/vite/ssl/local-key.pem`),
            cert: fs.readFileSync(`/etc/vite/ssl/local-cert.pem`),
        },
        watch: {
            usePolling: true,
        }
    },
    plugins: [
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        laravel({
            input: [
                'resources/sass/app.scss',
                'resources/js/app.ts',
            ],
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.esm-bundler.js',
        },
    },
});
```

それぞれのディレクティブでやっていることを簡単に触れてみます。
