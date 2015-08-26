(function (Backbone, _, $) {
    var Thumbnail = Curalate.FanReels.Thumbnail;
    var refreshIndices = function () {
        var thumbs = $("#curalate-fan-reel .curalate-thumbnail");
        thumbs.each(function (idx, elt) {
            $(elt).attr("data-curalate-thumb-idx", idx);
            $(elt).removeClass("curalate-thumbnail-large");
        });
    };
    
    var CartersMasonry = Curalate.FanReels.Masonry.extend({  
        addPhoto: function (photo) {
            var photoEl = new Thumbnail({
                model: photo,
                id: 'photo-' + photo.id,
                hasModal: this.hasModal
            }).render().el;
    
            this.$pictures.append($(photoEl).hide());

            if (photo.attributes.caption) {
                $(photoEl).find("[data-curalate-image]").attr("alt", photo.attributes.caption);
            }
            
            $(photoEl).find("[data-curalate-image]").attr("src",$(photoEl).find("[data-curalate-image]").attr("src"));
    
            //if thumbnail is a video, show play icon over it
            $('.curalate-thumbnail-video').each(function(){
                var that = this;
                if ($(that).children().length > 0) {
                    $(that).siblings('.curalate-play-thumbnail').show();
                    $(that).parent().siblings('.curalate-image-overlay').find(".curalate-hover").hide();
                }
            });

            $(photoEl).find('[data-curalate-username-or-user-full-name]').text(photo.attributes.user.username || photo.attributes.user.display_name || "");
            if(typeof photo.attributes.url != 'undefined' && photo.attributes.url.indexOf('instagram')!=-1 ){
                $(photoEl).find('.curalate-hover').addClass('curalate-hover-instagram');
            } else if(typeof photo.attributes.url != 'undefined' && photo.attributes.url.indexOf('twitter')!=-1 ){
                $(photoEl).find('.curalate-hover').addClass('curalate-hover-twitter');
            } else {
                $(photoEl).find('.curalate-hover').addClass('curalate-hover-upload');
            }
    
            this.queue.push(photoEl);
            refreshIndices();
        }      
    });
    Curalate.FanReels.Masonry = CartersMasonry;
    
    var DetailModal = Curalate.FanReels.DetailModal;
    var CartersModal = Curalate.FanReels.DetailModal.extend({
        template: function (attributes) {
            var response = DetailModal.prototype.template.apply(this, arguments);
            var $template = $(response).wrap('<div />').parent();
            
            $($template).find('[data-curalate-username-or-user-full-name]').text(attributes.user.username || attributes.user.display_name || "");
            
            if(typeof attributes.url != 'undefined' && attributes.url.indexOf('instagram')!=-1 ){
                $($template).find('#curalate-modal-username').addClass('curalate-modal-username-instagram');
            } else if(typeof attributes.url != 'undefined' && attributes.url.indexOf('twitter')!=-1 ){
                $($template).find('#curalate-modal-username').addClass('curalate-modal-username-twitter');
            } else {
                $($template).find('#curalate-modal-username').addClass('curalate-modal-username');
            }
            return $template.html();
        },
        show: function () {
            this.$el.show().addClass('active').children().addClass('active');
                /* Disable body scroll when modal is open */
                $("body").css({"overflow": "hidden"});
        },
        closeModal: function (m, l) {
            DetailModal.prototype.closeModal.apply(this, arguments);
            /*Re-enable body scroll when modal is closed */
            $("body").css({"overflow": "auto"});
        }    
    });
    Curalate.FanReels.DetailModal = CartersModal;
    
})(Curalate.Backbone, Curalate._, jQuery);
