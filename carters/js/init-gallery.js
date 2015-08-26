var Curalate = Curalate || {};
Curalate.FanReels = Curalate.FanReels || {};
Curalate.FanReels.Masonry = Curalate.FanReels.Masonry || {};

(function() {
    var _createElement = function(tag, attr) {
            var attName,
                el = document.createElement(tag);
            for (attName in attr) {
                el.setAttribute(attName, attr[attName]);
            }
            return el;
        },
        _loadScript = function(src) {
            return _createElement("script", {
                type: 'text/javascript',
                charset: 'UTF-8',
                src: src
            });
        };
    
    /**
     * Initializes this custom Fan Reel implementation.
     */
    Curalate.FanReels.Masonry.load = function(options) {
        var callback,
            baseScript = _loadScript('//api.curalate.com/js-min/fanreel-masonry-impl.min.js'),
            customScript = _loadScript('js/custom-gallery.js'),
            loadCallback = function() {
                if (typeof customScript.onload === "object") {
                    customScript.onload = callback;
                } else {
                    customScript.onreadystatechange = function() {
                        if (this.readyState === "loaded" || this.readyState === "complete") {
                            callback();
                        }
                    }
                }
                document.body.appendChild(customScript);
            };
        options.hasModal = true;
        options.infiniteScroll = true;

        callback = function() {
            Curalate.FanReels.Masonry.load(options);
        };
        
        if (typeof baseScript.onload === "object") {
            baseScript.onload = loadCallback;
        } else {
            baseScript.onreadystatechange = function() {
                if (this.readyState === "loaded" || this.readyState === "complete") {
                    loadCallback();
                }
            }
        }

        document.body.appendChild(baseScript);
    };
    
})();