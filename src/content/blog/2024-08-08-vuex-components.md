---
author: おーせ
pubDatetime: 2024-08-10
title: Vuexを使ったコンポーネント間の干渉方法
slug: vuex-components
featured: false
draft: true
tags:
  - Vue
  - Vuex
description: Vuexを使用した独立した他のコンポーネントに対してレンダリングを強制するTips
---

## はじめに
コンポーネント間でそれぞれ別のAPIを叩いている場合があるとする。<br />
今回は片方のコンポーネントが更新された場合、もう片方のコンポーネントも更新されAPIを取得する実装を検証します。<br />
実務で独立したコンポーネント同士が干渉するような実装ができないなぁ、と思って閃いたので備忘録として残すといった感じです。<br />

## 実装の方針
今回は一応以下のように独立したコンポーネントAとBが並列で並んでいることを想定しています。<br />
```vue
<template>
  <div>
    <ComponentA />
    <ComponentB />
  </div>
</template>

<script>
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'

export default {
  name: 'ParentPage',
  components: {
    ComponentA,
    ComponentB
  }
}
</script>
```
実装については以下の2つが思いつきました。<br />
というか根本はどちらも同じですが...<br />

- Vuexを利用して変更を監視する仕組みを作る
今回思いついた実装方法として一番ピンきた実装です。<br />
ComponentAのAPI通信で取得した値をVuexのStateに格納。<br />
それ（State）をcomponentBで呼び出しwatchで監視することでcomponentBでもAPI通信を再度行うといった実装です。

- Vuexを使わず、emitやpropsとして受け渡す。 
Vuexではなくemitなどで親コンポーネントに渡して、それをPropsとしてComponentBに受け渡す。それをwatchヘルパーで監視するという手法です。
大まかな流れは変わりませんが、Vuexを使うほどグローバルに使う値でもないなぁ、という場合はdataの受け渡しでもいいかもしれません。<br />


## 最後に

