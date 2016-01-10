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
  var resetShadow = function(ctx, blur, offsetX, offsetY, color) {
     ctx.shadowColor   = color;
     ctx.shadowBlur    = blur;
     ctx.shadowOffsetX = offsetX;
     ctx.shadowOffsetY = offsetY;
  };
  var mask   = function(canvas) {
     var ctx    = canvas.getContext('2d');
     resetShadow(ctx, 0, 0, 0, '#000');
     ctx.fillStyle     = '#000';
     ctx.fillRect(0, 0, canvas.width, vm.maskHeight);
     ctx.fillRect(0, canvas.height, canvas.width, -vm.maskHeight);
  };
  var copyright = function(canvas) {
    var ctx    = canvas.getContext('2d');
    ctx.font = 'normal 400 ' + parseInt(18 * ratio.height).toString() + 'px Open Sans, sans-serif';
    resetShadow(ctx, 0, 0, 0, '#fff');
    ctx.textAlign     = 'left';
    ctx.textBaseline  = 'bottom';
    ctx.fillStyle     = 'rgba(255,255,255,0.5)';
    var text = '\u00A9SEGA';
    ctx.fillText(text , canvas.width - (10 * ratio.width) - ctx.measureText(text).width, canvas.height - vm.maskHeight - (2 * ratio.height));
  };
  var caption = function(canvas) {
    var fontSize   = parseInt(35 * ratio.height);
    var lineHeight = fontSize + (fontSize * ratio.height * 0.3);
    var captionX   = canvas.width / 2;
    var captionY   = canvas.height - vm.maskHeight - (20 * ratio.height);
    var ctx        = canvas.getContext('2d');

    ctx.textAlign    = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle    = '#fff';
    ctx.font         = 'normal ' + fontSize.toString() + 'px cinecaption';

    // 何度も書いて無理やり縁取り
    var fill = function(blur, offsetX, offsetY) {
      resetShadow(ctx, blur, offsetX, offsetY, '#000');
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
      resetShadow(ctx, blur, offsetX, offsetY, '#000');
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
    var ctx       = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    ratio.height = canvas.height / ratio.base.height;
    ratio.width  = canvas.width / ratio.base.width;
    // 1080 に対して70 の比率をもとにしているので。
    vm.fileName   = file.name;
    vm.maskHeight = parseInt(canvas.height * 70 / 1080);
    vintageApi = new VintageJS(canvas);
  };

  var vm = new Vue({
    el: '#application',
    computed: {
      sample         : function(){ return 'button' + this.count.sample % 8;},
      vignette       : function(){ return 'button' + this.count.vignette % 8;},
      contrastUp     : function(){ return 'button' + this.count.contrastUp % 8;},
      desaturate     : function(){ return 'button' + this.count.desaturate % 8;},
      brightnessUp   : function(){ return 'button' + this.count.brightnessUp % 8;},
      brightnessDown : function(){ return 'button' + this.count.brightnessDown % 8;},
      noise          : function(){ return 'button' + this.count.noise % 8;},
      moveDown       : function(){ return 'button' + this.count.moveDown % 8;},
      //apply         : function(){ return 'button' + this.count['apply'] % 8 },
      //reset         : function(){ return 'button' + this.count['return'] % 8 },
    },
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
      display        : {
        line2 : false,
      },
      count          : {
        sample         : 0,
        vignette       : 0,
        contrastUp     : 0,
        desaturate     : 0,
        brightnessUp   : 0,
        brightnessDown : 0,
        noise          : 0,
        moveDown       : 0,
        apply          : 0,
        reset          : 0,
      },
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
      countUp: function(target){
        this.count[target]++;
        console.log(target + ':'+ this.count[target]);
      }, 
      effect: function(type) {
        switch(type) {
          case 'sample':
            vintageApi.vintage({noise: 60,contrast: 50,desaturate: 0.4,brightness: -50,vignette: 1});
            break;
          case 'vignette':
            vintageApi.vintage({vignette: 1});
            break;
          case 'contrastUp':
            vintageApi.vintage({contrast: 5});
            break;
          case 'desaturate':
            vintageApi.vintage({desaturate: 0.2});
            break;
          case 'brightnessUp':
            vintageApi.vintage({brightness: 10});
            break;
          case 'brightnessDown':
            vintageApi.vintage({brightness: -10});
            break;
          case 'noise':
            vintageApi.vintage({noise: 30});
            break;
          case 'reset':
            vintageApi.reset();
            break;
          case 'apply':
            vintageApi.apply();
            break;
          case 'moveDown':
            var ctx    = this.canvas.getContext('2d');
            var data = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            var h = (parseInt)(this.maskHeight / 2);
            ctx.clearRect(0, 0, this.canvas.width, h);
            ctx.putImageData(data, 0, h);
            break;
        }
        this.countUp(type);
      },
      add2ndLine: function(event) {
        if(event.type='keypress') {
          if(event.keyCode == '13') {
            this.display.line2 = true;
          }
          if(event.type == 'click') {
            this.display.line2 = true;
          }
        }
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
          return fileName.replace(/.jpg$/, '.png').replace(/.jpeg$/, '.png');
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

        this.fileName  = changeExt(this.fileName, this.toJpeg);

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
    loadImage(canvas, welcome, {'name': 'welcome.jpg'});
  };
  welcome.src = "./file/img/welcome.jpg";
}();

