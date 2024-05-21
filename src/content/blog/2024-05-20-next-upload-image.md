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
[HP概要](https://www.cloudflare.com/ja-jp/developer-platform/r2)にもあるとおり、無料プラン枠も広かったですし、
一度S3も試してみましたが画像取得速度はR2の方が早かったため、R2を採用しました。
無料プラン枠としては以下のとおりです。（2024年5月時点）
- ストレージ 10GB/月
- 状態の変更 100万/月
- 読み取り  1000万/月


S3もCDNとしてCloudFrontの設定をしていれば表示も早くなったと思いますが、料金的にもそこまでかけたくなかったのでそのままR2にしたというのが本音。
## 実装手順
それぞれ順を追って記載します。
### CloudflareR2の設定
まず、CloudflareR2を設定し、バケットを作成する必要がある。
こちらは以下サイトを参考にしました。

- [Cloudflare R2を使ってファイル管理を行うための基礎](https://reffect.co.jp/cloudflare/cloudflare-r2-basic)
- [Cloudflare R2 の準備](https://zenn.dev/nino/books/30e21d37af73b5/viewer/init-cloudflare)

バケットを作成し、以下情報を取得し、`.env`ファイルに記載。
（秘匿情報なので`.gitignore`ファイルには必ず`.env`を追加しgit管理から除外すること）
```zsh
REGION='auto'
BUCKET_NAME='test'
CLOUDFLARE_ACCESS_KEY_ID=xxxxxxxxx
CLOUDFLARE_ACCESS_KEY=xxxxxxxxx
CLOUDFLARE_ENDPOINT=xxxxxxxxx

IMAGE_HOST_URL=有効にしたサブドメインを記載
```

### APIエンドポイントの作成
Next.jsのRouteHandlerを活用し、APIエンドポイントを作成。
まずは、オブジェクト操作に必要なSDKをインストールする。
```zsh
npm i @aws-sdk/client-s3
```
必要なエンドポイントを以下のように作成（不要な記載は削除）
今回は名前とプロフィール画像を登録する実装に使用。

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse, NextRequest } from 'next/server'

import { prisma, main } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const image = formData.get('image') as File

  const {
    CLOUDFLARE_ACCESS_KEY_ID,
    CLOUDFLARE_ENDPOINT,
    CLOUDFLARE_ACCESS_KEY,
    REGION,
    BUCKET_NAME,
  } = process.env

  try {
    await main()
  
    const s3Client = new S3Client({
      region: REGION,
      endpoint: CLOUDFLARE_ENDPOINT as string,
      credentials: {
        accessKeyId: CLOUDFLARE_ACCESS_KEY_ID || '',
        secretAccessKey: CLOUDFLARE_ACCESS_KEY || '',
      },
    })

    const fileName = `${Date.now()}-${id}-${name}`
    const buffer = Buffer.from(await image.arrayBuffer())

    const uploadImage: any = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: image.type,
      ACL: 'public-read',
    }

    const command = new PutObjectCommand(uploadImage)
    await s3Client.send(command)
    const imageUrl = `${process.env.AVATAR_HOST_URL}/${fileName}`

    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: name,
        image: imageUrl,
      },
    })
    return NextResponse.json({ message: 'Success', user }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: 'Error', err }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
```

ClientからはImage情報をFormDataに格納して送信するため、`const formData = await req.formData()`として受け取り、
`id`、`name`、`image`と格納されている情報を抽出。（もっといい書き方あるかも。）
```typescript
const s3Client = new S3Client({
      region: REGION,
      endpoint: CLOUDFLARE_ENDPOINT as string,
      credentials: {
        accessKeyId: CLOUDFLARE_ACCESS_KEY_ID || '',
        secretAccessKey: CLOUDFLARE_ACCESS_KEY || '',
      },
    })

```
S3Clientに必要な情報をセットしてインスタンス化しており、バケット操作ができる準備を整える。

```typescript
    const fileName = `${Date.now()}-${id}-${name}`
    const buffer = Buffer.from(await image.arrayBuffer())

    const uploadImage: any = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: image.type,
      ACL: 'public-read',
    }

    const command = new PutObjectCommand(uploadImage)
```
`uploadImage`を定義。S3のライブラリにある`PutObjectCommand`を用いてバケットに送信する情報に整形する。
（`uploadImage`で定義しているJSONのキーは全て大文字から始まるので注意。小文字だとエラーになる。）

```typescript
await s3Client.send(command)
```

最後にインスタンス化した`s3Client`によりバケットに格納情報を送信する処理を行えば、アップロード完了。
以下のコードはDb保存処理なので、今回は関係ないため説明割愛。
### Client側でFormDataを作成、送信

