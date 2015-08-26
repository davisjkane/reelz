(function (Backbone, _, $) {
    var responsiveSizes = [{'windowWidth':768,'pageSize' : 3}, {'windowWidth':480,'pageSize':2}, {'windowWidth':380,'pageSize':1}];

    var FanReelCarousel = Curalate.FanReels.Carousel;
    var CartersCarousel = FanReelCarousel.extend({
        initialize: function (options) {
            var that = this,
                photoCount;
                
            FanReelCarousel.prototype.initialize.apply(this, arguments);
            _.extend(this, {
                initPageSize: options.pageSize
            });

            this.collection.once('retrieve', function (collection) {
                if (this.length > 0) {
                    $("#curalate-fan-reel").show();
                } else {
                    $("#curalate-fan-reel").hide();
                }
                
                if (this.length !== 0) {
                    $(window).bind("load", function(){
                        that.reinitSizes();
                    });
                }
            });
            
            $(window).bind("resize", function(){
                that.reinitSizes();
                that.$pictures.css("left", -that.thumbnailWidth*that.currentPage);
            });
        }, 
        reinitSizes: function(){
            var nav_space = 88;
            this.pageSize = this.getPerPage();
            this.thumbnailWidth = Math.floor(($("#curalate-content").width()-nav_space) / this.pageSize);

            $(".curalate-thumbnail").width(this.thumbnailWidth - parseInt($(".curalate-thumbnail").css('margin-right')), 10);
            $('#curalate-fan-reel').height(this.thumbnailWidth - parseInt($(".curalate-thumbnail").css('margin-right')), 10);
            this.$('.curalate-viewport').css({
                width: ($("#curalate-content").width() - nav_space)
            });
            
            this.pageSize = this.pageSize+1;
            this.totalPages = Math.max(this.collection.length - this.pageSize, 1);
            this.pageWidth = this.pageSize * this.thumbnailWidth;
            
            if (this.pageWidth >= this.thumbnailWidth*this.collection.length) {
                this.navigation.next.css('visibility', 'hidden');
            }
            $("#curalate-products-preloader").hide();
        },
        getPerPage: function(){
            var windowWidth = $(window).width();
            var ret = this.initPageSize;
            _.each(responsiveSizes, function(item) {
                if (windowWidth <= item.windowWidth) {
                    ret = item.pageSize;
                }
            });
            
            return ret;
        },
        previous: function(event) {
            var that = this;
            event.preventDefault();
            // If we have a page to navigate to, go there
            if (this.currentPage !== 0 && !this.isAnimating) {
                this.navigation.next.css('visibility', 'visible');
                
                this.isAnimating = true;
                this.$pictures.animate({
                    left: this.$pictures.position().left + this.thumbnailWidth
                }, 'fast', function() {
                    that.isAnimating = false;
                });
                this.currentPage--;
                
                if (this.currentPage === 0) {
                    this.navigation.previous.css('visibility', 'hidden');
                }
            }
        },        
        next: function(event) {
            var that = this;
            event.preventDefault();
            this.navigation.previous.css('visibility', 'visible');
            
            if (this.currentPage <= this.collection.length - this.pageSize && !this.isAnimating) {
                this.isAnimating = true;
                this.$pictures.animate({
                    left: this.$pictures.position().left - this.thumbnailWidth
                }, 'fast', function() {
                    that.isAnimating = false;
                });
                this.currentPage++;
                if (this.currentPage === this.collection.length - this.pageSize) {
                    this.collection.retrieve({
                        success: function(){
                            that.reinitSizes();
                        }
                    });
                }
            }

            if (this.currentPage > this.totalPages) {
                this.navigation.next.css('visibility', 'hidden');
            }
        },
        addPhoto: function(photo) {
            var previousTotalPages = this.totalPages || 1;
            // Create the view for the added Photo model
            var photoView = new Curalate.FanReels.Thumbnail({
                model: photo,
                id: 'photo-' + photo.id,
                hasModal: this.hasModal,
                metadata: this.options.metadata
            });

            var el = photoView.render().el;
            //if thumbnail is a video, show play icon over it
            $(el).find('.curalate-thumbnail-video').each(function(){
                if ($(this).children().length > 0) {
                    $(this).siblings('.curalate-play-thumbnail').show();
                } else {
                    $(this).parent().find('.curalate-play-thumbnail').remove();
                }
            }); 
            
            this.$pictures.append(el);

            // Update the total pages
            if (this.scroll === 'page') {
                this.totalPages = Math.ceil(this.collection.length / this.pageSize);
            } else if (this.scroll === 'one') {
                this.totalPages = Math.max(this.collection.length - this.pageSize, 1);
            }
            if (this.totalPages > previousTotalPages) {
                this.navigation.next.css('visibility', 'visible');
            }
            
           
        },

    });
    Curalate.FanReels.Carousel = CartersCarousel;
    
    var DetailModal = Curalate.FanReels.DetailModal;
    var CartersModal = DetailModal.extend({
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
        }
    });
    Curalate.FanReels.DetailModal = CartersModal;
    
})(Curalate.Backbone, Curalate._, jQuery);