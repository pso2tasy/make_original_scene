/**
 * option:
 *   callback:
 *     drop: drop 処理後に呼ばれるコールバック関数
 */
var dragOnDrop = function(canvas, option)
{
  window.addEventListener("dragover", function(evt) {
    // デフォルト処理をOFF
    evt.preventDefault();
  }, false);

  window.addEventListener("drop", function(evt) {
    var ctx    = canvas.getContext("2d");
    // デフォルト処理をOFF
    evt.preventDefault();
    var file = evt.dataTransfer.files[0];

    if (!file.type.match(/^image\/(png|jpeg|gif)$/)) return;

    var image  = new Image();
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function(evt) {
      image.onload = function() {
        canvas.width  = image.width;
        canvas.height = image.height;
        canvas.file = file;
        ctx.drawImage(image, 0, 0);
        if(option.callback.onload !== 'undefined') option.callback.onload(canvas);
      }
      image.src = evt.target.result;
    }
  });
}
