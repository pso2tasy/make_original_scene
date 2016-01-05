var app = function() {
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
     ctx.fillRect(0, 0, canvas.width, vm.maskHeight);
     ctx.fillRect(0, canvas.height, canvas.width, -vm.maskHeight);
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
    ctx.fillText('(C)SEGA', canvas.width - (10 * ratio.width), canvas.height - (6 * ratio.height));
  };
  var caption = function(canvas) {
    var fontSize   = parseInt(35 * ratio.height);
    var lineHeight = fontSize + (fontSize * ratio.height * 0.3);
    var captionX   = canvas.width / 2;
    var captionY   = canvas.height - vm.maskHeight - (20 * ratio.height);
    var ctx        = canvas.getContext('2d');

    ctx.textAlign    = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor  = '#000';
    ctx.fillStyle    = '#fff';
    ctx.font         = 'normal ' + fontSize.toString() + 'px cinecaption';

    // 何度も書いて無理やり縁取り
    var fill = function(blur, offsetX, offsetY) {
      ctx.shadowBlur    = blur;
      ctx.shadowOffsetX = offsetX;
      ctx.shadowOffsetY = offsetY;
      if(vm.text1 != '' && vm.text2 != '') {
        ctx.fillText(vm.text1, captionX, captionY - lineHeight);
        ctx.fillText(vm.text2, captionX, captionY);
      }else if(vm.text1 != '' && vm.text2 == '')
      {
        ctx.fillText(vm.text1, captionX, captionY);
      } else if(vm.text1 == '' && vm.text2 != '') {
        ctx.fillText(vm.text2, captionX, captionY);
      }
    };
    var stroke = function(blur, offsetX, offsetY) {
      ctx.shadowBlur    = blur;
      ctx.shadowOffsetX = offsetX;
      ctx.shadowOffsetY = offsetY;
      if(vm.text1 != '' && vm.text2 != '') {
        ctx.strokeText(vm.text1, captionX, captionY - lineHeight);
        ctx.strokeText(vm.text2, captionX, captionY);
      }else if(vm.text1 != '' && vm.text2 == '')
      {
        ctx.strokeText(vm.text1, captionX, captionY);
      } else if(vm.text1 == '' && vm.text2 != '') {
        ctx.strokeText(vm.text2, captionX, captionY);
      }
    };
    fill( 2,  3,  0);
    fill( 2, -3,  0);
    fill( 2,  0,  3);
    fill( 2,  0, -3);
    fill( 4,  2,  2);
    fill( 4,  2, -2);
    fill( 4, -2,  2);
    fill( 4, -2, -2);
    fill( 3,  0,  0);
    fill( 3,  0,  0);
    fill(20,  0,  0);
    ctx.shadowColor  = '#333';
    fill(20,  0,  0);
    ctx.shadowColor  = '#000';
    stroke(20, 0, 0);
    fill( 0,  0,  0);
  };
  var loadImage = function(canvas, image, file){
    canvas.width  = image.width;
    canvas.height = image.height;
    canvas.file   = file;
    var ctx       = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    ratio.height = canvas.height / ratio.base.height;
    ratio.width  = canvas.width / ratio.base.width;
    // 1080 に対して70 の比率をもとにしているので。
    vm.maskHeight = parseInt(canvas.height * 70 / 1080);
    vintageApi = new VintageJS(image);
  };

  var vm = new Vue({
    el: '#application',
    data: {
      text1          : '',
      text2          : '',
      copyright      : true, // (C)SEGA を入れるかどうか
      mask           : true, // 上下の黒帯 を入れるかどうか
      maskHeight     : 70,   // 上下の黒帯 px 
      canvas         : canvas,
      imageData      : null,
      fileName       : '',
      toJpeg         : true,
      sequence       : false,
      msBrowser      : false,
      downloadReady  : false,
      display2ndLine : false,
    },
    created: function() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.indexOf('edge') != -1) {
        this.msBrowser = true;
      } else if (ua.indexOf('chrome') != -1){
      } else if (ua.indexOf('firefox') != -1){
      } else {
        this.msBrowser = true;
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
      add2ndLine: function(event) {
        if(event.type='keypress') {
          if(event.keyCode == '13') {
            this.display2ndLine = true;
          }
          return;
        }
        this.display2ndLine = true;
      },
      fileType : function(toJpeg) {
        if(toJpeg == true) {
          return 'image/jpeg';
        }
        return 'image/png';
      },
      edit: function(event) {
        var changeExt = function(fileName, toJpeg) {
          if(toJpeg == true) {
            return fileName.replace(/.png$/, '.jpg');
          }
          fileName.replace(/.jpg$/, '.png');
          fileName.replace(/.jpeg$/, '.png');
          return fileName;
        };
        var appendSequence = function() {
          var image  = new Image();
          image.src    = canvas.toDataURL();
          image.width  = '640'; 
          image.height = '360';
          document.getElementById('control').appendChild(image);
        };

        if(this.mask) {
          mask(canvas);
        }

        caption(canvas);

        this.fileName  = changeExt(canvas.file.name, this.toJpeg);

        if(this.copyright) {
          copyright(canvas);
        }

        if(this.sequence === true) {
          appendSequence(event);
        }

        if(this.msBrowser === false) {
          this.imageData = canvas.toDataURL(this.fileType(this.toJpeg));
        }

        this.downloadReady = true;
      },
      msDownload: function() {
        // http://qiita.com/uin010bm/items/150003f016287750cf34
        function toBlob(base64, contentType) {
          var bin = atob(base64.replace(/^.*,/, ''));
          var buffer = new Uint8Array(bin.length);
          for (var i = 0; i < bin.length; i++) {
              buffer[i] = bin.charCodeAt(i);
          }
          try{
              var blob = new Blob([buffer.buffer], {
                  type: contentType
              });
          }catch (e){
              return false;
          }
          return blob;
        }
        var fileType = this.fileType(this.toJpeg);
        var image    = this.canvas.toDataURL(fileType);
        navigator.msSaveBlob(toBlob(image, fileType), this.fileName);
      },
    },
  });

  // ドラッグアンドドロップで画像を読み込む処理を追加。
  dragOnDrop(canvas, image, {callback:{onload: loadImage}});

  var welcome = new Image();
  welcome.onload = function() {
    loadImage(canvas, welcome, {});
  };
  welcome.src = "./file/img/welcome.jpg";
}();

