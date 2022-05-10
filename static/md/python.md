# Python

## 基礎

- 代入

    [details]
    ```python
    a = 100
    a += 100
    ```

    計算結果などに「名前をつける」操作

- 負数

    [details]

    ```python
    -1
    ```

- 四則演算

    [details]

    ```python
    1 + 2 * 3 - 4 / 5
    ```

- 剰余

    [details]

    ```python
    # 100 / 7 = 商 + 剰余
    商 = 100 // 7
    剰余 = 100 % 7
    ```

- 冪乗

    [details]

    ```python
    # 2の15乗
    2 ** 15
    ```

- 演算の優先順位を指定する

    [details]

    ```python
    2 * ((3 + 4) * 5)
    ```

- 型

    [details]

    ```python
    # 整数 (int)
    1
    # 浮動小数 (float)
    1.0
    # 文字列 (str)
    "abc"
    # 真偽値 (bool)
    True, False
    # リスト (list)
    [1, 1.0, "abc"]
    # タプル (tuple)
    (1, 1.0, "abc")
    # 辞書 (dict)
    {"整数": 1, "float": 2, 3: 3.0}
    ```

    他にもある。`type(1)` などとすれば `1` の型を知ることができる。

- `for` 文

    [details]

    ```python
    for i in range(10):
        print(i)
    ```

- `if` 文

    [details]

    ```python
    if n % 2 == 0:
        print("nは偶数")
    elif n % 2 == 1:
        print("nは奇数")
    else:
        print("nは整数ではない")
    ```

- `while` 文

    [details]

    ```python
    while n
    ```

- リスト内包表記

    [details]

    ```python
    [2 * i for i in range(10)]
    # [0, 2, 4, ..., 18]
    ```

    `for` 文によってリストの要素を定義する。

- 関数

- クラス

- 外部パッケージを使う

## 型ヒント

## docstring

## テストコード

## import

## 発展

- `break`

- `continue`

- `...`

- `*args, **kwargs`

- `lambda` 式

- 引数のアスタリスク・スラッシュ

- `#!/usr/bin/env python3`

- `__add__` メソッド

- `if` 文を1行で書く

- `Exception`・エラー
