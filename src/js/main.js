var app = function()
{
  var vintageApi;
  var image  = new Image();
  var ratio  = {
    width:  1,
    height: 1,
    base: {
      width: 1280,
      height: 720
    }
  };

  var canvas = document.getElementById('canvas');
  var mask   = function(canvas) {
     var ctx    = canvas.getContext('2d');
     ctx.shadowBlur    = 0;
     ctx.shadowOffsetX = 0;
     ctx.shadowOffsetY = 0;
     ctx.fillStyle     = '#000';
     ctx.fillRect(0, 0, canvas.width, vm.$data.maskHeight);
     ctx.fillRect(0, canvas.height, canvas.width, -vm.$data.maskHeight);
  };
  var copyright = function(canvas) {
    var ctx    = canvas.getContext('2d');
    //ctx.font = 'normal ' + parseInt(30 * ratio.height).toString() + 'px Century Gothic';
    ctx.font = 'normal ' + parseInt(30 * ratio.height).toString() + 'px Roboto';
    ctx.shadowBlur    = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.textAlign     = 'right';
    ctx.textBaseline  = 'end';
    ctx.fillStyle     = '#dfdfdf';
    console.log(canvas.height);
    ctx.fillText('(C)SEGA', canvas.width - (10 * ratio.width), canvas.height - (6 * ratio.height));
  };
  var caption = function(canvas) {
    var ctx    = canvas.getContext('2d');
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor  = '#000';
    ctx.fillStyle    = '#fff';
    ctx.font         = 'normal ' + parseInt(35 * ratio.height).toString() + 'px cinecaption';

    // 何度も書いて無理やり縁取り
    var stroke = function(blur, offsetX, offsetY) {
      ctx.shadowBlur    = blur;
      ctx.shadowOffsetX = offsetX;
      ctx.shadowOffsetY = offsetY;
      ctx.fillText(vm.$data.text, canvas.width / 2, canvas.height - vm.$data.maskHeight - (20 * ratio.height));
    };
    stroke( 3,  3,  0);
    stroke( 3, -3,  0);
    stroke( 3,  0,  3);
    stroke( 3,  0, -3);
    stroke(10,  0,  0);
    stroke(10,  0,  0);
    stroke(10,  0,  0);
    stroke(10,  0,  0);
  };
  var afterDrop = function(canvas, image, file){
    var ctx       = canvas.getContext('2d');
    canvas.width  = image.width;
    canvas.height = image.height;
    canvas.file   = file;
    ctx.drawImage(image, 0, 0);
    ratio.height = canvas.height / ratio.base.height;
    ratio.width  = canvas.width / ratio.base.width;
    // 1080 に対して70 の比率をもとにしているので。
    vm.$data.maskHeight = parseInt(canvas.height * 70 / 1080);
    vintageApi = new VintageJS(image);
  };

  // ドラッグアンドドロップで画像を読み込む処理を追加。
  dragOnDrop(canvas, image, {callback:{onload: afterDrop}});

  var vm = new Vue({
    el: '#application',
    data: {
      text          : 'ここに文字を入れます。',
      copyright     : true, // (C)SEGA を入れるかどうか
      mask          : true, // 上下の黒帯 を入れるかどうか
      maskHeight    : 70,   // 上下の黒帯 px 
      canvas        : canvas,
      imageData     : null,
      fileName      : '',
      toJpeg        : true,
      sequence      : false,
      msBrowser     : false,
      downloadReady : false,
    },
    created: function(){ 
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.indexOf('edge') != -1) {
        this.msBrowser = true;
        this.toJpeg    = false;
      } else if (ua.indexOf('chrome') != -1){
      } else if (ua.indexOf('firefox') != -1){
      } else {
        this.msBrowser = true;
        this.toJpeg    = false;
      }
    },
    methods: {
      effect: function(type) {
        switch(type) {
          case 'sample':
            vintageApi.vintage({noise: 60,contrast: 50,desaturate: 0.4,brightness: -50,vignette: 1});
            break;
          case 'vignette':
            vintageApi.vintage({vignette: 1});
            break;
          case 'contrast+':
            vintageApi.vintage({contrast: 5});
            break;
          case 'desaturate':
            vintageApi.vintage({desaturate: 0.2});
            break;
          case 'brightness+':
            vintageApi.vintage({brightness: 10});
            break;
          case 'brightness-':
            vintageApi.vintage({brightness: -10});
            break;
          case 'noise':
            vintageApi.vintage({noise: 30});
            break;
          case 'reset':
            vintageApi.reset();
            break;
        }
      },
      fileType: function() {
        if(this.toJpeg == true) {
          return 'image/jpeg';
        }
        return 'image/png';
      },
      changeExt: function(fileName) {
        if(this.toJpeg == true) {
          return fileName.replace(/.png$/, '.jpg');
        }
        fileName.replace(/.jpg$/, '.png');
        fileName.replace(/.jpeg$/, '.png');
        return fileName;
      },
      edit: function(event) {
        if(this.mask) mask(canvas);
        caption(canvas);
        this.fileName  = this.changeExt(canvas.file.name);
        if(this.copyright) copyright(canvas);
        if(this.sequence === true) {
          this.appendSequence(event);
        }
        if(this.msBrowser === false) {
          this.imageData = canvas.toDataURL(this.fileType());
        }
        this.downloadReady = true;
      },
      msDownload: function(event) {
        var blob = this.canvas.msToBlob();
        if (window.navigator.msSaveBlob) {
          window.navigator.msSaveOrOpenBlob(blob, this.fileName);
        }
      },
      appendSequence: function(event) {
        var image  = new Image();
        image.src    = canvas.toDataURL();
        image.width  = '640'; 
        image.height = '360';
        document.getElementById('control').appendChild(image);
      },
    }
  });

}();

