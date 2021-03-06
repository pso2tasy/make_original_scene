主に [ PSO2 ](http://pso2.jp) ユーザーに Twitter 上で楽しまれている、[ #ssに字幕を入れてオリジナルシーンを作ってみる ](https://twitter.com/search?src=typd&q=%23ss%E3%81%AB%E5%AD%97%E5%B9%95%E3%82%92%E5%85%A5%E3%82%8C%E3%81%A6%E3%82%AA%E3%83%AA%E3%82%B8%E3%83%8A%E3%83%AB%E3%82%B7%E3%83%BC%E3%83%B3%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%8B) というタグの支援ツールです。

## 注意
この README は、主に Windows 10 向けに書かれています。

## 必要なもの
- OS  
		多分色々なんでも。手元では Windows 10 です。
- [ nodejs ](https://nodejs.org/en/)  
		色々に使用。手元では 8.9.1 です。  
		コマンドラインで node -v してバージョンが出ればOK。
- [ Python 2.7 ](https://www.python.org/download/releases/2.7/)  
		concatが使用。手元では 2.7.14 です。  
		コマンドラインで python -v してバージョンが出ればOK。
- [ windows-build-tools ](https://github.com/felixrieseberg/windows-build-tools)  
		管理者権限のPowerShellで `npm install -g --production windows-build-tools` してインストールします。

## 使いかた（Windwos 向け）
1. git clone https://github.com/pso2tasy/make_original_scene.git  
		または zip ダウンロードでお手元に。
2. `cd make_original_scene`
3. `npm install -g gulp`
4. ~~ `npm insall --msys_version=2015` ~~ いらないかも
5. `gulp compile` すると `public` に必要なファイルが作られます。

## 配布について
ライセンスは [ MIT License ](https://ja.wikipedia.org/wiki/MIT_License)です。

## インストールがうまく行かない
1. Python は 3.x.x じゃなくて 2.7 ですか？  
		> Python (v2.7.10 recommended, v3.x.x is not supported)  
		> [nodejs/node-gyp](https://github.com/nodejs/node-gyp)

		# 普段3系を使いたいなら、Python 2.7 だけ入れて npm でだけ使うと良いらしいです。
		npm config set python c:\python27
