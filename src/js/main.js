define(['can/map', 'can/map/define'], function($map) {
  
  function calcViewable($target_top, $target_height, $view_top, $view_height) {
    var target_bottom = $target_top + $target_height,
        view_bottom = $view_top + $view_height;
    return !($target_top > view_bottom) && !(target_bottom < $view_top);
  }
  
  var Watcher = $map.extend({
    define: {
      status: {
          set: function($target) {
            this.attr('y', $target.pageYOffset);
            this.attr('vh', $target.innerHeight);
          }
      },
      optimal: {
        get: function() {
          var target = this.attr('target');
          
          if(!target) {
            return false;
          }
          
          var target_top = target.offsetTop,
              target_bottom = target_top + target.offsetHeight,
              view_height = this.attr('vh'),
              view_top = this.attr('y') + view_height/3,
              view_bottom = view_top + view_height - view_height/3 * 2;
          
          return !(target_top > view_bottom) && !(target_bottom < view_top);
        },
        value: false,
        type: 'boolean'
      },
      viewable: {
        get: function() {
          var target = this.attr('target'),
              target_top = target.offsetTop,
              target_bottom = target_top + target.offsetHeight,
              view_top = this.attr('y'),
              view_bottom = view_top + this.attr('vh');
          
              return !(target_top > view_bottom) && !(target_bottom < view_top);
        },
        value: false,
        type: 'boolean'
      },
      y: {
        type: 'number',
        value: 0
      },
      vh: {
        type: 'number',
        value: 0
      },
      target: {
        value: null
      }
    }
  });
  
  return function($element) {
    var watcher = new Watcher(),
        handler = function($event) {
          watcher.attr('status', this);
        };
    
    watcher.attr('target', $element);
    window.addEventListener('scroll', handler);
    window.addEventListener('unload', function() {
      window.removeEventListener('scroll', handler);
    });
    
    return watcher;
  }
});
