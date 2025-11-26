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

---

## 日本語版について / Japanese Version

### 開発環境 / Development Environment

このリポジトリのソースコードをコンパイルするには、以下の環境が必要です：

1. **ZILFコンパイラ**: [ZILF](https://foss.heptapod.net/zilf/zilf) はZIL（Zork Implementation Language）ファイルをZ-machineバイナリ（.z3、.z5など）にコンパイルするためのオープンソースコンパイラです。
   - ダウンロード: https://foss.heptapod.net/zilf/zilf/-/releases
   - .NET Framework（Windows）または Mono（macOS/Linux）が必要です

2. **Z-machineインタープリタ**: コンパイルされたゲームを実行するには、Z-machineインタープリタが必要です：
   - [Frotz](https://davidgriffith.gitlab.io/frotz/) - コマンドライン/コンソール用
   - [Lectrote](https://github.com/erkyrath/lectrote) - クロスプラットフォームGUIアプリ
   - [Gargoyle](https://github.com/garglk/garglk) - 複数のIF形式に対応

#### コンパイル手順の例

```bash
# ZILFを使用してコンパイル（基本的なコマンド）
zilf zork1.zil
zapf zork1.zap
```

### ライセンスについて / License Information

このリポジトリは **MITライセンス** で公開されています。MITライセンスは非常に寛容なオープンソースライセンスであり、以下のことが許可されています：

- ✅ **商用利用**: 商業目的での利用が可能
- ✅ **改変**: ソースコードの改変が可能（日本語版の作成を含む）
- ✅ **配布**: 改変版の配布が可能
- ✅ **サブライセンス**: 異なるライセンスでの再配布も可能
- ✅ **私的利用**: 個人的な使用が可能

**日本語版を作成することはライセンス上完全に可能です。** 著作権表示とライセンス文を含めれば、自由に翻訳・改変・配布できます。

### 日本語版作成のガイド / Guide for Creating Japanese Version

日本語版を作成する際の主なポイント：

1. **テキストの翻訳**: `.zil`ファイル内の英語テキスト（ゲームの説明、メッセージなど）を日本語に翻訳します。

2. **パーサーの対応**: 日本語入力に対応するには、`gparser.zil`を大幅に改修する必要があります。日本語の文法構造は英語と異なるため、これは大きな技術的課題となります。

3. **文字コード**: Z-machineの標準文字セットには日本語文字が含まれていないため、Unicode対応のインタープリタを使用するか、代替アプローチを検討する必要があります。

4. **代替アプローチ**: 
   - [Inform 7](http://inform7.com/) など、より現代的なIF開発システムを使用して日本語版を再実装する
   - [Twine](https://twinery.org/) などのシステムで選択肢ベースのバージョンを作成する

ご質問やご提案がありましたら、Issueを作成してください。
