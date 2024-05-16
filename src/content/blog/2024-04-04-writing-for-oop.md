---
author: おーせ
pubDatetime: 2024-04-04
title: オブジェクト指向あれこれ（雑記）
slug: writing-for-oop
featured: false
draft: false
# ogImage: https://user-images.githubusercontent.com/53733092/215771435-25408246-2309-4f8b-a781-1f3d93bdf0ec.png
tags:
  - オブジェクト指向とは
description: オブジェクト指向について少し勉強したので、学んだことをざっくりまとめます。
---

## はじめに
エンジニア1年生もそろそろ終盤にさしかかり2年目になろうとする中、理論的な理解が疎かになりがち。<br />
自分が勉強した理論を整理していきたいと思い、今回はオブジェクト指向プログラミングについてまとめようと思う。

## オブジェクト指向プログラミングとは？
実際にプログラムする現実世界の対象物を捉え、コードとして落とし込む手法。オブジェクト指向プログラミングを構成する要素には大きく以下の3つがある。
- クラス（カプセル化）
- ポリモーフィズム
- 継承

オブジェクト指向を駆使することで、以下のようなメリットがあります。<br />

#### 抽象化・カプセル化
データ（属性）とそれに関連する操作（メソッド）をまとめることができることで、コードの抽象化が可能になる。
また、クラスはデータを隠蔽し、外部からの不適切なアクセスを防ぐことができる。これを**カプセル化**と呼ぶ。
#### 再利用性
類似した振る舞いや構造を持つオブジェクトの集まりを定義することで、**コードの再利用性が向上し、同じ機能を実装する際に新たにコードを書く必要が減る**。
後述する継承やポリモーフィズムを活用することで、既存のクラスの振る舞いを変更することなく新しいクラスを定義することが可能になる。
#### 拡張性
新しい機能を追加したり既存の機能を変更したりすることが容易になりうる。
クラスを適切に設計することで、新しい機能を追加する際に既存のコードの修正を少なくすることが可能。
#### 保守性
**関連するデータと操作が一箇所にまとまるため、可読性が高くなる。**
変更が必要な場合も、関連するクラス内のみを修正すれば良いため、保守作業が行いやすい。


### クラス（カプセル化）とは
同じ属性（データ）と操作（メソッド）を持つオブジェクトの集合を定義するためのテンプレートまたは設計図としてクラスを定義できる。<br />
例えば、動物（Animal）というクラスがあるとし、このクラスは動物が持つ属性（種族、年齢、性別など）や操作（動く、鳴くなど）を定義する。
```python
class Animal:
    def __init__(self, species, age, gender):
        self.species = species
        self.age = age
        self.gender = gender

    def move(self):
        pass

    def make_sound(self):
        pass

class Dog(Animal):
    def __init__(self, name, age, gender):
        super().__init__("Dog", age, gender)
        self.name = name

    def move(self):
        print(f"{self.name} is walking.")

    def make_sound(self):
        print("わん!")

class Cat(Animal):
    def __init__(self, name, age, gender):
        super().__init__("Cat", age, gender)
        self.name = name

    def move(self):
        print(f"{self.name} is walking gracefully.")

    def make_sound(self):
        print("にゃー!")

# インスタンスを作成し、操作を実行
dog = Dog("Buddy", 5, "Male")
cat = Cat("Whiskers", 3, "Female")

dog.move()  # 出力: Buddy is walking.
dog.make_sound()  # 出力: わん!

cat.move()  # 出力: Whiskers is walking gracefully.
cat.make_sound()  # 出力: にゃー!
```
上記動物、犬、猫という対象に落とし込む際に、基本となる情報をクラスでまとめることで、冗長なコードを回避することが可能になり、再利用可能なコードを実装可能になる。<br />


### ポリモーフィズムとは
同じインタフェースを共有する複数のオブジェクトが、それぞれ異なる振る舞いを示すことができる特性を指す。例えば以下のような実装が挙げられる。

```python
class Animal:
    def make_sound(self):
        pass

class Dog(Animal):
    def make_sound(self):
        return "わん!"

class Cat(Animal):
    def make_sound(self):
        return "にゃー!"

# ポリモーフィズムの例
def animal_sound(animal):
    return animal.make_sound()

# 犬と猫のインスタンスを作成
dog = Dog()
cat = Cat()

print(animal_sound(dog))  # 出力: わん!
print(animal_sound(cat))  # 出力: にゃー!
```
上記のように、Animalクラスを基底クラスとして、`make_soundメソッド`を持つ基本的な動物の振る舞いを定義。DogクラスとCatクラスはそれぞれAnimalクラスを継承し、`make_soundメソッド`をオーバーライドして犬の鳴き声と猫の鳴き声を返している。<br />

`animal_sound関数`は、Animalクラスを継承した任意のクラスのインスタンスを受け取り、そのmake_soundメソッドを呼び出してその動物の鳴き声を返している。<br />
異なる種類の動物（Dog・Cat）が、鳴く（`make_sound`）という同一行為だが異なる振る舞い（「わん！」と「にゃー！」）するという挙動を実現している。

### 継承とは
既にここまでの実装でもいくつか出ているが、新たなクラスを作成する時に共通のインターフェースを持つ親要素のクラスが存在する場合、親クラスを継承してインターフェースを継承することが可能になる。<br />
クラスの実装例と同じだが、以下再掲する。<br />

```python
class Animal:
    def __init__(self, species, age, gender):
        self.species = species
        self.age = age
        self.gender = gender

    def move(self):
        pass

    def make_sound(self):
        pass

class Dog(Animal):
    def __init__(self, name, age, gender):
        super().__init__("Dog", age, gender)
        self.name = name

    def move(self):
        print(f"{self.name} is walking.")

    def make_sound(self):
        print("わん!")

class Cat(Animal):
    def __init__(self, name, age, gender):
        super().__init__("Cat", age, gender)
        self.name = name

    def move(self):
        print(f"{self.name} is walking gracefully.")

    def make_sound(self):
        print("にゃー!")

# インスタンスを作成し、操作を実行
dog = Dog("Buddy", 5, "Male")
cat = Cat("Whiskers", 3, "Female")

dog.move()  # 出力: Buddy is walking.
dog.make_sound()  # 出力: わん!

cat.move()  # 出力: Whiskers is walking gracefully.
cat.make_sound()  # 出力: にゃー!

```

上記のように基底クラスとなる`Animal`クラスをDogとCatで継承している。<br />
実装例をみてみると、以下の箇所が該当する。

```python
class Dog(Animal):
    def __init__(self, name, age, gender):
        super().__init__("Dog", age, gender)
        self.name = name
```
この実装でDogクラスの引数にAnimalを代入している。<br />
`__init__`メソッドによりクラスのコンストラクタを呼び出し、インスタンスかされる際に受け取る変数を設定。(`name, age, gender`)その上で、`super().__init__("Dog", age, gender)`によりAnimalクラスのコンストラクタで定義された共通の特性（`species`, `age`, `gender`）を初期化している。<br />

実際に、以下のとおりインスタンス化されることでAnimalクラスを継承し、犬のような挙動を実現することができる。<br />

```python
# Buddyという種族で5歳のオスという情報でインスタンス化
dog = Dog("Buddy", 5, "Male")

# Animalインターフェースを継承しているので、呼び出すこともできる。
dog.move()  # 出力: Buddy is walking.
dog.make_sound()  # 出力: わん!
```

## まとめ
簡単ですが、オブジェクト指向を構成する`クラス`・`ポリモーフィズム`・`継承`をざっくりまとめました。<br />
再利用性・保守性といった観点からオブジェクト指向に則ってプログラミングすることが大事だと思いました。<br />
