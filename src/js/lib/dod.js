/**!
 * dragOnDrop
 *
 * @license MIT (http://www.opensource.org/licenses/mit-license.php)
 * @author pso2tasy
 * @version 0.0.2
 *
 * option:
 *   callback:
 *     drop: drop 処理後に呼ばれるコールバック関数
 */
(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory();
    }
    else if(typeof define === 'function' && define.amd) {
        define('dragondrop', [], factory);
    }
    else {
        root['dragOnDrop'] = factory();
    }
}(this, function() {
  var dragOnDrop = function(canvas, image, option)
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
  
      var reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = function(evt) {
        image.onload = function() {
          if(option.callback.onload !== 'undefined') option.callback.onload(canvas, image, file);
        }
        image.src = evt.target.result;
      }
    });
  }
  return dragOnDrop;
}));
