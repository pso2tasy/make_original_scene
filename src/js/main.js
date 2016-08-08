var Mask = function(canvas, print, height) {
  this.print  = print;
  this.height = height;
  this.canvas = canvas;
  this.setCanvas = function(canvas) {
    this.canvas = canvas;
  };
  this.drawMask = function(height) {
    if(this.print != true) {
      return;
    }
    var ctx    = canvas.getContext('2d');
    ctx.shadowColor   = '#000';
    ctx.shadowBlur    = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle     = '#000';
    ctx.fillRect(0, 0, canvas.width, height);
    ctx.fillRect(0, canvas.height, canvas.width, -height);
  };
};

var Copyright = function(canvas, print, baseline) {
  this.canvas = canvas;
  this.ratio = {
    width : 1,
    height : 1,
  };
  this.baseline = baseline;
  this.setBaseline = function(baseline) {
    this.baseline = baseline;
  };
  this.setRatio = function(ratio) {
    this.ratio.width = ratio.width;
    this.ratio.height = ratio.height;
  };
  this.setCanvas = function(canvas) {
    this.canvas = canvas;
  };
  this.print = print;
  this.text  = '\u00A9SEGA';
  this.draw = function() {
    var ctx    = this.canvas.getContext('2d');

    ctx.font = 'normal 400 ' + parseInt(18 * this.ratio.height).toString() + 'px Open Sans, sans-serif';
    ctx.shadowColor   = 'rgba(32,32,32,0.2)';
    ctx.shadowBlur    = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;
    ctx.textAlign     = 'left';
    ctx.textBaseline  = 'bottom';
    ctx.fillStyle     = 'rgba(255,255,255,0.9)';

    console.log(this.ratio.width);
    console.log(ctx.measureText(this.text).width);
    ctx.fillText(this.text , this.canvas.width - (10 * this.ratio.width) - ctx.measureText(this.text).width, this.baseline);
  };
};

var twitter = function(text, images) {
  var child;
  var request = superagent;
  var upload = function(token, images) {
    request
      .post('https://asp.tasy.space/myscene/upload.php')
      .field('token', token)
      .attach('images[0]', images[0])
      .end(function(err, res) {
        tweet(token);
    });
  }
  var tweet = function(token) {
    child.location.href = 'https://asp.tasy.space/myscene/tweet.php?tweet='+text+'&token='+token;
  }

  child = window.open();
  request
    .get('https://asp.tasy.space/myscene/start.php')
    .end(function(err, res){
      var token = res.body.token;
      if(typeof images === 'undefined' || images.length == 0) {
        tweet(token);
        return;
      }
      upload(token, images);
  });
}

// http://qiita.com/uin010bm/items/150003f016287750cf34
var toBlob = function(base64, contentType) {
  console.log('toBlob type:' + contentType);
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


var app = function() {
  var copyrightType = {
    default: 0,
    onMask: 1,
  };
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

  var setImageToCanvas = function(file) {
    if(file != undefined) {
      image.onload = function() {
        loadImage(canvas, this, file);
      }
      image.src = URL.createObjectURL(file);
    }
  };
  var canvas    = document.getElementById('canvas');
  var copyright = new Copyright(canvas, true, 0);
  var mask      = new Mask(canvas, true, 70);

  var resetShadow = function(ctx, blur, offsetX, offsetY, color) {
    ctx.shadowColor   = color;
    ctx.shadowBlur    = blur;
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
  };
  var drawCopyright = function(canvas, type) {
    var ctx    = canvas.getContext('2d');
    var position = {
      x : 0,
      y : 0,
    };
    var baseline = canvas.height - mask.height - (2 * ratio.height);
    if(mask.print !== true || type == copyrightType.onMask) {
      baseline = canvas.height - (2 * ratio.height);
    }
    copyright.setBaseline(baseline);
    copyright.setRatio(ratio);
    copyright.setCanvas(canvas);
    copyright.draw();
  };

  var caption = function(canvas) {
    var captionColor = '#fff';
    var fontSize   = parseInt(35 * ratio.height);
    var lineHeight = fontSize + (fontSize * ratio.height * 0.3);
    var captionX   = canvas.width / 2;
    var captionY   = canvas.height - mask.height - (20 * ratio.height);
    var ctx        = canvas.getContext('2d');

    ctx.textAlign    = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle    = captionColor;
    ctx.font         = 'normal ' + fontSize.toString() + 'px cinecaption';

    // 何度も書いて無理やり縁取り
    var fill = function(blur, offsetX, offsetY, shadowColor) {
      if(shadowColor == undefined) {
        shadowColor = 'rgba(0,0,0,0.6)';
      }
      resetShadow(ctx, blur, offsetX, offsetY, shadowColor);
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
    fill(20,  0,  0, 'rgba(48,48,48,0.6)');
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
    // 縦画像の時、文字サイズとマスクの計算に使う比率を調整
    if(image.width < image.height) {
      ratio.height = canvas.height / ratio.base.width;
      ratio.width  = canvas.width / ratio.base.height;
    }
    vm.fileName   = file.name;
    // 1080 に対して70 の比率をもとにしているので。
    mask.height = parseInt(canvas.height * 70 / 1080);
    vintageApi = new VintageJS(canvas);
  };
  var vm = new Vue({
    el: '#application',
    data: {
      text1          : '',
      text2          : '',
      copyrightType  : copyrightType,
      setting : {
        copyright : {
          print: true, // (C)SEGA ON/OFF
          type : copyrightType.default,
        },
      },
      mask           : mask, // 上下の黒帯 を入れるかどうか
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
      smartphone    : false,
      tweetText     : ''
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

      if(ua.indexOf('android ') != -1
          || ua.indexOf('iphone') != -1
          || ua.indexOf('ipad') != -1) {
        this.smartphone = true;
      }

      // welcomeImage読み込み
      if(this.smartphone == false) {
        image.onload = function() {
          loadImage(canvas, this, {'name': 'welcome.jpg'});
        };
        image.src = "./file/img/welcome.jpg";
      }
    },
    methods: {
      loadFromButton: function(evt) {
        setImageToCanvas(evt.target.files[0]);
      },
      tweet: function(){
        var images = [];
        var fileType = this.fileType(this.toJpeg);
        
        console.log('tweet with type:'+fileType);
        images.push(toBlob(this.canvas.toDataURL(fileType), fileType));
        twitter(this.tweetText, images);
      },
      move: function() {
        var ctx    = this.canvas.getContext('2d');
        var data = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var h = (parseInt)(mask.height / 2);
        ctx.clearRect(0, 0, this.canvas.width, h);
        ctx.putImageData(data, 0, h);
      },
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
          case 'apply':
            vintageApi.apply();
            break;
        }
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

        mask.setCanvas(canvas);
        mask.drawMask(mask.height);

        caption(canvas);

        this.fileName  = changeExt(this.fileName, this.toJpeg);

        if(this.setting.copyright.print) {
          drawCopyright(canvas, this.setting.copyright.type);
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
        var fileType = this.fileType(this.toJpeg);
        var image    = this.canvas.toDataURL(fileType);
        navigator.msSaveBlob(toBlob(image, fileType), this.fileName);
      },
    },
  });

  // ドラッグアンドドロップで画像を読み込む処理を追加。
  dragOnDrop(function(file) {
    setImageToCanvas(file);
  });

}();

