//zmianynews
var reqAnimationFrame = (function() {
  return window[Hammer.prefixed(window, "requestAnimationFrame")] || function(callback) {
    setTimeout(callback, 1000 / 60);
  }
})();

function dirProp(direction, hProp, vProp) {
  return (direction & Hammer.DIRECTION_HORIZONTAL) ? hProp : vProp
}

/**
 * Carousel
 * @param container
 * @param direction
 * @constructor
 */
function HammerCarousel(container, direction) {
  this.container = container;
  this.direction = direction;
  this.nextarrow = $('.nextslide');
  this.prevarrow = $('.prevslide');
  this.panes = Array.prototype.slice.call(this.container.children, 0);
  this.containerSize = this.container[dirProp(direction, 'offsetWidth')];
  this.currentIndex = 0;

  this.hammer = new Hammer.Manager(this.container);
  this.hammer.add(new Hammer.Pan({
    direction: this.direction,
    threshold: 10
  }));
  this.hammer.on("panstart panmove panend pancancel", Hammer.bindFn(this.onPan, this));

  this.show(this.currentIndex);
  // this.arrows(this.currentIndex);
 this.nextarrow.click(function() {
console.log('a');
console.log('b');
         });
  this.prevarrow.click(function(){
console.log('a');
     });
}

HammerCarousel.prototype = {
  /**
   * show a pane
   * @param {Number} showIndex
   * @param {Number} [percent] percentage visible
   * @param {Boolean} [animate]
   */
 show: function (showIndex, percent, animate) {
    showIndex = Math.max(0, Math.min(showIndex, this.panes.length - 1));
    percent = percent || 0;

    var className = this.container.className;
    if (animate) {
      if (className.indexOf('animate') === -1) {
        this.container.className += ' animate';
      }
    } else {
      if (className.indexOf('animate') !== -1) {
        this.container.className = className.replace('animate', '').trim();
      }
    }


var paneIndex, pos, translate;
    for (paneIndex = 0; paneIndex < this.panes.length; paneIndex++) {
      pos = (this.containerSize / 100) * (((paneIndex - showIndex) * 100) + percent);
      if (this.direction & Hammer.DIRECTION_HORIZONTAL) {
        translate = 'translate3d(' + pos + 'px, 0, 0)';
      }
      this.panes[paneIndex].style.transform = translate;
      this.panes[paneIndex].style.mozTransform = translate;
      this.panes[paneIndex].style.webkitTransform = translate;
    }

    this.currentIndex = showIndex;



     //    this.nextarrow.click(function(){
     //    this.show(this.currentIndex, +1, translate);
     //    console.log('ccc');

     //  });

     // this.prevarrow.click(function(){
     //  console.log('ad');
     // });

    },




  /**
   * handle pan
   * @param {Object} ev
   */
  onPan: function (ev) {
    var delta = dirProp(this.direction, ev.deltaX);

    var percent = (100 / this.containerSize) * delta;
    var animate = false;

    if (ev.type == 'panend' || ev.type == 'pancancel') {
      if (Math.abs(percent) > 20 && ev.type == 'panend') {
        this.currentIndex += (percent < 0) ? 1 : -1;
      }
      percent = 0;
      animate = true;
    }



    this.show(this.currentIndex, percent, animate);


  }


// this.show(this.currentIndex, percent, animate);







};
// the horizontal pane scroller
Hammer.each(document.querySelectorAll(".panes"), function(container) {

  // setup the inner scroller
  new HammerCarousel(container, Hammer.DIRECTION_HORIZONTAL);

  // only recognize the inner pan when the outer is failing.
  // they both have a threshold of some px
  // inner.hammer.get('pan').requireFailure(outer.hammer.get('pan'));
});


// each pane should contain a vertical pane scroller
// Hammer.each(document.querySelectorAll(".panes"), function(container) {
//   // setup the inner scroller
//   var inner = new HammerCarousel(container, Hammer.DIRECTION_HORIZONTAL);

//   // only recognize the inner pan when the outer is failing.
//   // they both have a threshold of some px
//   outer.hammer.get('pan').requireFailure(inner.hammer.get('pan'));
// });
