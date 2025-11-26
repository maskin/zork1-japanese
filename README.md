# Zork I 日本語版 / Zork I Japanese Edition

🎮 **[今すぐブラウザでプレイ / Play Now in Browser](https://maskin.github.io/zork1-japanese/)**

---

## 日本語について / About Japanese Version

このリポジトリは、1980年にInfocom社が制作した伝説的テキストアドベンチャーゲーム「Zork I」をGitHub Pages上でプレイできるようにしたものです。ゲーム自体は英語ですが、日本語の翻訳ヒントと操作説明を追加しています。

This repository provides a browser-based version of the legendary text adventure game "Zork I" created by Infocom in 1980. The game itself is in English, but Japanese translation hints and instructions have been added.

### 特徴 / Features

- 🌐 ブラウザで直接プレイ可能（インストール不要）
- 🇯🇵 日本語の操作説明とヒント
- 💾 セーブ/ロード機能
- 📱 モバイル対応レスポンシブデザイン
- 🎨 レトロなターミナル風インターフェース

### 遊び方 / How to Play

1. [ゲームページ](https://maskin.github.io/zork1-japanese/)にアクセス
2. 英語のコマンドを入力してゲームを操作
3. 基本コマンド：
   - `look` - 周りを見る
   - `north/south/east/west` - 移動する
   - `take [物]` - 物を取る
   - `inventory` - 持ち物を見る
   - `open [物]` - 開ける
   - `help` - ヘルプを表示

---

# Zork I Source Code Collection

Zork I is a 1980 interactive fiction game written by Marc Blank, Dave Lebling, Bruce Daniels and Tim Anderson and published by Infocom.

Further information on Zork I:

* [Wikipedia](https://en.wikipedia.org/wiki/Zork_I)
* [The Digital Antiquarian](https://www.filfre.net/2012/01/selling-zork/)
* [The Interactive Fiction Database](https://ifdb.tads.org/viewgame?id=0dbnusxunq7fw5ro)
* [The Infocom Gallery](http://gallery.guetech.org/zork1/zork1.html)
* [IFWiki](http://www.ifwiki.org/index.php/Zork_I)

__What is this Repository?__

This repository is a directory of source code for the Infocom game "Zork I", including a variety of files both used and discarded in the production of the game. It is written in ZIL (Zork Implementation Language), a refactoring of MDL (Muddle), itself a dialect of LISP created by MIT students and staff.

The source code was contributed anonymously and represents a snapshot of the Infocom development system at time of shutdown - there is no remaining way to compare it against any official version as of this writing, and so it should be considered canonical, but not necessarily the exact source code arrangement for production.

__Basic Information on the Contents of This Repository__

It is mostly important to note that there is currently no known way to compile the source code in this repository into a final "Z-machine Interpreter Program" (ZIP) file using an official Infocom-built compiler. There is a user-maintained compiler named [ZILF](http://zilf.io) that has been shown to successfully compile these .ZIL files with minor issues. There are .ZIP files in some of the Infocom Source Code repositories but they were there as of final spin-down of the Infocom Drive and the means to create them is currently lost.

Throughout its history, Infocom used a TOPS20 mainframe with a compiler (ZILCH) to create and edit language files - this repository is a mirror of the source code directory archive of Infocom but could represent years of difference from what was originally released.

In general, Infocom games were created by taking previous Infocom source code, copying the directory, and making changes until the game worked the way the current Implementor needed. Structure, therefore, tended to follow from game to game and may or may not accurately reflect the actual function of the code.

There are also multiple versions of the "Z-Machine" and code did change notably between the first years of Infocom and a decade later. Addition of graphics, sound and memory expansion are all slowly implemented over time.

__What is the Purpose of this Repository__

This collection is meant for education, discussion, and historical work, allowing researchers and students to study how code was made for these interactive fiction games and how the system dealt with input and processing.

Researchers are encouraged to share their discoveries about the information in this source code and the history of Infocom and its many innovative employees.
