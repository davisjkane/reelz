(function(Backbone, _, $) {

	var _fFirstPage = true;

    var Photos = Curalate.FanReels.Photos;
    var CrateAndBarrelPhotos = Curalate.FanReels.Photos.extend({
        retrieve: function(options) {

            options = options ? _.clone(options) : {};

            var success = options.success,
            complete = options.complete,
            that = this;

			if (_fFirstPage) {
				that.limit = 14;
				_fFirstPage = false;
			} else {
				that.limit = 15;
			}

            options.complete = function(options) {
                if (complete) complete(options);
                that.trigger('fetch:complete');
                complete = true;
            };

            options.success = function(collection, resp) {
                that.trigger('retrieve');
                if (success) success(collection, resp, options);
                that.bookmark = resp.bookmark;
                //removes load button if new images added less that limit
                if(resp.items.length < collection.limit) {
                	$(".curalate-load-more").css("display", "none");
                } else {
                	$(".curalate-load-more").css("display", "inline-block");
				}
            };

             // options.remove MUST be set to false so that new models
             // returned from our sync are appended to the colleciton.
             // This is where our collection differs from a normal Backbone collection
             // All models exist on the server and models will never be made client-side
             // Because of this, the 'fetch' method on this collection changes behavior
             // from fetching the 'default set of models' to fetching 'models at this collection's offset'
             options.remove = false;

             this.trigger('fetch:begin');
             return Backbone.Collection.prototype.fetch.apply(this, [options]);
        },

        fetchMore: function(options) {
            if (this.bookmark != null) {
                this.retrieve(options);
            } else if (options.complete) {
                $(".curalate-load-more").hide();
                // We call complete directly since the request is technically now complete but we delay
                // it momentarily to allow event chaining by the caller who expects this to be asynchronous.
                setTimeout(options.complete, 1);
            }
        }
    });

    // override with custom implementations
    Curalate.FanReels.Photos = CrateAndBarrelPhotos;

})(Curalate.Backbone, Curalate._, jQuery);