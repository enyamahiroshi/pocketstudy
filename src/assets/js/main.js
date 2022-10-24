(function ($) {

  /* --------------------------------------------------
    メニュー開閉
  -------------------------------------------------- */
  const body = $('body');
  const header = $('.header');
  const BtnOpen = $('.js-tgl-menu');
  const classname = 'is-open';
  $(window).on('resize', function () {
    if (window.matchMedia( "(min-width: 768px)" ).matches) {
      if (body.hasClass(classname)) {
        body.removeClass(classname);
        header.removeClass(classname);
      }
    }
  });
  BtnOpen.on('tap click', function () {
    if (body.hasClass(classname)) {
      body.removeClass(classname);
      header.removeClass(classname);
    } else {
      body.addClass(classname);
      header.addClass(classname);
    }
  });

  /* --------------------------------------------------
    スクロールで処理
  -------------------------------------------------- */
  const trg = $('.js-scroll-top');
  const scrollY = $('.main').offset().top; // scroll量
  const aadclass = 'is-fixed'; // add css class
	$(window).on('load scroll', function () {
		if($(this).scrollTop() > scrollY && trg.hasClass(aadclass) == false) {
      trg.addClass(aadclass);
		}
		else if($(this).scrollTop() < scrollY && trg.hasClass(aadclass) == true){
      trg.removeClass(aadclass);
		}
  });

  /* --------------------------------------------------
    anchor link
  -------------------------------------------------- */
  const anchor = 'a[href^="#"]';
  const pageHeader = $('.header');
  const headerHeight = pageHeader.height();
  const speed = 200;
  $(anchor).on('tap click', function () {
    const href= $(this).attr("href");
    const target = href == "#" || href == "" ? 'html' : href;
    const position = $(target).offset().top - headerHeight;
    $("html, body").stop().animate({scrollTop:position}, speed, 'swing');
    return false;
  });
  $(window).on('load', function () {
    if(document.URL.match("#")) {
      const str = location.href ;
      const cut_str = "#";
      const index = str.indexOf(cut_str);
      const href = str.slice(index);
      const target = href;
      const position = $(target).offset().top - headerHeight;
      $("html, body").stop().animate({scrollTop:position}, speed, 'swing');
      return false;
    }
  });

})(jQuery);