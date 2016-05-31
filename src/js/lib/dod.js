/**!
 * dragOnDrop
 *
 * @license MIT (http://www.opensource.org/licenses/mit-license.php)
 * @author pso2tasy
 * @version 0.0.2
 *
 * dragOnDrop(callback)
 * callbackにcallback(file)としてファイルオブジェクトを渡す
 *
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
  var dragOnDrop = function(callback)
  {
    window.addEventListener("dragover", function(evt) {
      // デフォルト処理をOFF
      evt.preventDefault();
    }, false);
  
    window.addEventListener("drop", function(evt) {
      // デフォルト処理をOFF
      evt.preventDefault();
      var file = evt.dataTransfer.files[0];
  
      if (!file.type.match(/^image\/(png|jpeg|gif)$/)) return;
      callback(file);
  
    });
  }
  return dragOnDrop;
}));
