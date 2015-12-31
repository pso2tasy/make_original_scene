主に [ PSO2 ](http://pso2.jp) ユーザーに Twitter 上で楽しまれている、[ #ssに字幕を入れてオリジナルシーンを作ってみる ](https://twitter.com/search?src=typd&q=%23ss%E3%81%AB%E5%AD%97%E5%B9%95%E3%82%92%E5%85%A5%E3%82%8C%E3%81%A6%E3%82%AA%E3%83%AA%E3%82%B8%E3%83%8A%E3%83%AB%E3%82%B7%E3%83%BC%E3%83%B3%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%8B) というタグの支援ツールです。

## 注意
この README は、主にWindows向けに書かれています。

## 必要なもの
- OS  
		多分色々なんでも。手元では Windows 10 です。
- [ nodejs ](https://nodejs.org/en/)  
		色々に使用。手元では 5.3.0 です。  
		コマンドラインで node -v してバージョンが出ればOK。
- NPM  
		nodejs を入れたら入っているはず……？
- [ Python 2.7 ](https://www.python.org/download/releases/2.7/)  
		concatが使用。手元では 2.7 です。  
		コマンドラインで python -v してバージョンが出ればOK。
- [ Visual Studio Community 2015 Edition ](https://www.visualstudio.com/ja-jp/products/visual-studio-community-vs.aspx)  
		Windows では必要です。Windows 7/8.1 だと 2012/2013 だとかなんとか。

## 使いかた（Windwos 向け）
1. git clone https://github.com/pso2tasy/make_original_scene.git  
		または zip ダウンロードでお手元に。
2. `cd make_original_scene`
3. `npm install -g gulp`
4. `npm insall --msys_version=2015`
5. `gulp compile` すると `public` に必要なファイルが作られます。

## 改造等のしかた
`src` の下にあるファイルを好きにいじって `gulp compile` すると良いです。  
html は jade フォルダの下に拡張子 `.jade` で置かないと反映されません。  
css は stylus フォルダの下に拡張子 `.styl` で置かないと反映されません。  
Javascript は js フォルダの下に拡張子 `.js` で置かないと反映されません。  

これらの対応は gulpfile.js で設定されているので、gulp について調べれば簡単に変えられます。  
HTML は [ Jade ](http://jade-lang.com/) です。HTML が分かるなら簡単に覚えられます。  
CSS は [ Stylus ](http://stylus-lang.com/) です。CSS が分かるなら簡単に覚えられます。  
Javascript は [ vue.js ](http://jp.vuejs.org/) を少しだけ使っています。  

## 配布について
ライセンスは [ MIT License ](https://ja.wikipedia.org/wiki/MIT_License)です。

## インストールがうまく行かない
1. Python は 3.x.x じゃなくて 2.7 ですか？  
		> Python (v2.7.10 recommended, v3.x.x is not supported)  
		> [nodejs/node-gyp](https://github.com/nodejs/node-gyp)

		# 普段3系を使いたいなら、Python 2.7 だけ入れて npm でだけ使うと良いらしいです。
		npm config set python c:\python27

2. [ Visual Studio Community 2015 Edition ](https://www.visualstudio.com/ja-jp/products/visual-studio-community-vs.aspx) はカスタムインストールしましたか？  
		カスタムインストールで Visual C++ を入れるらしいです。
				> Install Visual Studio Community 2015 Edition. (Custom Install, Select Visual C++ during the installation)  
				> [nodejs/node-gyp](https://github.com/nodejs/node-gyp)

