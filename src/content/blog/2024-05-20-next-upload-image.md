---
author: おーせ
pubDatetime: 2024-05-20
title: Next.jsのRouteHandlerで画像アップロード（CloudflareR2）
slug: next-upload-image
featured: false
draft: true
tags:
  - Next.js
  - 画像アップロード
description: Next.jsのアプリでCloudflareR2に画像アップロードする実装
---

## はじめに
現在Next.jsでアプリを作っていて、先日実装した画像アップロード機能が思いのほか苦戦したので、備忘録を残そうかと思います。

## 使用技術
- Next.js（RouteHandlerを使用）
- Cloudflare R2

今回ストレージはS3ではなくCloudflareR2を選択しました。
無料プラン枠も広かったですし、一度S3も試してみましたが画像取得速度はR2の方が早かったため、R2を採用しました。
S3もCDNとしてCloudFrontの設定をしていれば表示も早くなったと思いますが、料金的にもそこまでかけたくなかったのでそのままR2にしたというのが本音です。
## 実装手順
それぞれ順を追って記載していきます。
### CloudflareR2の設定
まず、CloudflareR2を設定し、バケットを作成する必要があります。




### Client側でFormDataを作成、送信
### APIエンドポイントの作成

