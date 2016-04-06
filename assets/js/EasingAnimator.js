var EasingAnimator = function(opt){
        opt = opt || {};
        this.easingInterval = opt.easingInterval;
        this.duration = opt.duration || 2000;  
        this.step = opt.step || 50;  
        this.easingFn = opt.easingFn  || function easeInOutElastic(t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
        };
        this.callBack = opt.callBack || function(){};
        this.finalCallBack = opt.finalCallBack || function(){};
    };
EasingAnimator.makeFromCallback = function(callBack){
    return new EasingAnimator({
        callBack: callBack
    });
};
EasingAnimator.prototype.easeProp = function(obj, propDict){
    propDict = propDict || {};

    var self = this,
        t = 0,
        out_vals = JSON.parse(JSON.stringify(obj));

    clearInterval(self.easingInterval);
    self.easingInterval = setInterval(function(){
        t+= self.step;
        if (t >= self.duration) {
            clearInterval(self.easingInterval);
            self.callBack(propDict);
            self.finalCallBack();
            return;
        }
        var percent = self.easingFn(t, 0, 1, self.duration);
        Object.keys(propDict).forEach(function(key, i) {
            var old_val = obj[key];

            out_vals[key] = old_val - percent*(old_val - propDict[key]);
        });
        self.callBack(out_vals);
    }, self.step);
};

/////// ---------------------------

var ZoomAnimator = function(opt) {
    opt = opt || {};
    this.zoomInterval = opt.zoomInterval;
    this.duration = opt.duration;
};
//increment start until reach end
ZoomAnimator.prototype.zoomIn = function(start, end, callBackFunc, completeFunc) {
    var self = this;
    var t = start;
    if (start >= end) {
        completeFunc();
        return;
    }
    clearInterval(self.zoomInterval);
    self.zoomInterval = setInterval(function() {
        if (t>end) {
            clearInterval(self.zoomInterval);
            console.log("ZoomIn: Terminating");
            completeFunc();
            return;
        }
        callBackFunc(t);
        t += 1;
    }, self.duration);
};
//decrement start until reach end
ZoomAnimator.prototype.zoomOut = function(start, end, callBackFunc, completeFunc) {
    var self = this;
    var t = start;
    if (start <= end) {
        completeFunc();
        return;
    }
    clearInterval(self.zoomInterval);
    self.zoomInterval = setInterval(function() {
        if (t<end) {
            clearInterval(self.zoomInterval);
             console.log("ZoomOut: Terminating");
            completeFunc();
            return;
        }
        callBackFunc(t);
         t -= 1;
    }, self.duration);
};
