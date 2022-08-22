(function ($) {

  const ocBtn = $('.js-open_close');
  const trg = $('.modelcource__content');
  $(ocBtn).on('click', function () {
    $(this).next(trg).slideToggle();
  });


  jQuery('.js-scroll').on('click',function(){
    let target = jQuery(this).attr('href');
    jQuery("html,body").animate({
      scrollTop: jQuery(target).offset().top - 120
    }, 500);
    return false;
  })

})(jQuery);