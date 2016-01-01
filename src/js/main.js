var app = function()
{
 var ratio = {
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
    ctx.fillStyle     = '#fff';
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
    stroke(3, 3, 0);
    stroke(3, -3, 0);
    stroke(3, 0, 3);
    stroke(3, 0, -3);
    stroke(10, 0, 0);
    stroke(10, 0, 0);
    stroke(10, 0, 0);
    stroke(10, 0, 0);
  };
  var afterDrop = function(canvas){
    ratio.height = canvas.height / ratio.base.height;
    ratio.width  = canvas.width / ratio.base.width;
    // 1080 に対して70 の比率をもとにしているので。
    vm.$data.maskHeight = parseInt(canvas.height * 70 / 1080);
  };

  // ドラッグアンドドロップで画像を読み込む処理を追加。
  dragOnDrop(canvas, {callback:{onload: afterDrop}});

  var vm = new Vue({
    el: '#application',
    data: {
      text: 'ここに文字を入れます。',
      copyright  : true, // (C)SEGA を入れるかどうか
      mask       : true, // 上下の黒帯 を入れるかどうか
      maskHeight: 70,   // 上下の黒帯 px 
      canvas     : canvas,
      imageData  : null,
      fileName   : '',
      sequence   : false,
      msBrowser  : false,
    },
    created: function(){ 
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.indexOf('edge') != -1) {
        this.msBrowser = true;
      } else if (ua.indexOf('chrome') != -1){
      } else if (ua.indexOf('firefox') != -1){
      } else {
        this.msBrowser = true;
        this.sequence = true;
      }
    },
    methods: {
      edit: function(event) {
        if(this.mask) mask(canvas);
        caption(canvas);
        this.fileName  = canvas.file.name;
        if(this.copyright) copyright(canvas);
        if(this.sequence === true) {
          this.appendSequence(event);
        }
        if(this.msBrowser === false) {
          this.imageData = canvas.toDataURL();
        }
      },
      msDownload: function(event) {
        var blob = this.canvas.msToBlob();
        if (window.navigator.msSaveBlob) {
          console.log(this.fileName);
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

