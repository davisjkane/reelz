(function(Backbone, _, $) {


var DetailModal = Curalate.FanReels.DetailModal;
    var CrateAndBarrelModal = DetailModal.extend({
        show: function() {
            DetailModal.prototype.show.apply(this, arguments);
            //If there is a sale price, show it
            $(".curalate-sale-price").each(function(){
                if( $(this).children("span").is(":empty") ) {
                    $(this).hide();
                }
                else {
                    $(this).show();
                }
            });
        }
    });
    
    // override with custom implementations
    Curalate.FanReels.DetailModal = CrateAndBarrelModal;

})(Curalate.Backbone, Curalate._, jQuery);