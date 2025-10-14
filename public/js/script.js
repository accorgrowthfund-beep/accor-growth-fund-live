var THEMEMASCOT = {};
(function ($) {
	("use strict");

	THEMEMASCOT.isRTL = {
		check: function () {
			if ($("html").attr("dir") === "rtl") {
				return true;
			} else {
				return false;
			}
		},
	};

	THEMEMASCOT.isLTR = {
		check: function () {
			if ($("html").attr("dir") !== "rtl") {
				return true;
			} else {
				return false;
			}
		},
	};

	//Hide Loading Box (Preloader)
	function handlePreloader() {
		if ($(".preloader").length) {
			$(".preloader").delay(200).fadeOut(500);
		}
	}

	function loadHeader() {
		const preloader = document.querySelector(".page-wrapper .preloader");
		fetch("/components/header.html")
			.then(response => response.text())
			.then(data => {
				// Create a wrapper for the header
				const tempDiv = document.createElement("div");
				tempDiv.innerHTML = data.trim();
				if (preloader) {
					preloader.insertAdjacentElement("afterend", tempDiv.firstElementChild);
				}
				$("select").niceSelect();


				// Scroll to 1000px Down Button
				if ($(".goBottom-btn").length) {
					$(".goBottom-btn").on("click", function () {
						$("html, body").animate({ scrollTop: 1000 }, 500);
					});
				}
				headerStyle();
				//Submenu Dropdown Toggle
				if ($(".main-header li.dropdown ul").length) {
					$(".main-header .navigation li.dropdown").append(
						'<div class="dropdown-btn"><i class="fa fa-angle-down"></i></div>'
					);
					//Megamenu Toggle
				}

				//Hidder bar
				if ($(".hidden-bar").length) {
					//Menu Toggle Btn
					$(".toggle-hidden-bar").on("click", function () {
						$("body").addClass("active-hidden-bar");
					});

					//Menu Toggle Btn
					$(".hidden-bar-back-drop, .hidden-bar .close-btn").on(
						"click",
						function () {
							$("body").removeClass("active-hidden-bar");
						}
					);
				}

				//Mobile Nav Hide Show
				if ($(".mobile-menu").length) {
					var mobileMenuContent = $(".main-header .main-menu .navigation").html();

					$(".mobile-menu .navigation").append(mobileMenuContent);
					$(".sticky-header .navigation").append(mobileMenuContent);
					$(".mobile-menu .close-btn").on("click", function () {
						$("body").removeClass("mobile-menu-visible");
					});

					//Dropdown Button
					$(".mobile-menu li.dropdown .dropdown-btn").on("click", function () {
						$(this).prev("ul").slideToggle(500);
						$(this).toggleClass("active");
						$(this).prev(".mega-menu").slideToggle(500);
					});

					//Menu Toggle Btn
					$(".mobile-nav-toggler").on("click", function () {
						$("body").addClass("mobile-menu-visible");
					});

					//Menu Toggle Btn
					$(".mobile-menu .menu-backdrop, .mobile-menu .close-btn").on(
						"click",
						function () {
							$("body").removeClass("mobile-menu-visible");
						}
					);
				}

				//Header Search
				if ($(".search-btn").length) {
					$(".search-btn").on("click", function () {
						$(".main-header").addClass("moblie-search-active");
					});
					$(".close-search, .search-back-drop").on("click", function () {
						$(".main-header").removeClass("moblie-search-active");
					});
				}
			})
			.catch(err => console.error("Error loading header:", err));
	}

	function loadFooter() {
		const pageWrapper = document.querySelector(".page-wrapper");

		// Load Footer
		fetch("/components/footer.html")
			.then(response => response.text())
			.then(data => {
				const tempDiv = document.createElement("div");
				tempDiv.innerHTML = data.trim();
				if (pageWrapper) {
					pageWrapper.insertAdjacentElement("beforeend", tempDiv.firstElementChild);
				}
				const years = document.getElementById("year");
				if (years) {
					years.textContent = new Date().getFullYear();
				}
				$("select").niceSelect();
				// Scroll to Top Button
				if ($(".goTop-btn").length) {
					$(".goTop-btn").on("click", function () {
						$("html, body").animate({ scrollTop: 0 }, 500);
					});
				}
			})
			.catch(err => console.error("Error loading footer:", err));
	}

	function loadDashboardSidebar() {
		const currentPage = window.location.pathname;
		if (currentPage.endsWith("aDash.html")) {
			fetch("/components/sidebar2.html")
				.then(response => response.text())
				.then(data => {
					document.body.insertAdjacentHTML("afterbegin", data);
				})
				.catch(error => console.error("Error loading sidebar:", error));
		}
	}






	function headerStyle() {
		if ($(".main-header").length) {
			var windowpos = $(window).scrollTop();
			var siteHeader = $(".header-style-one");
			var scrollLink = $(".scroll-to-top");
			var sticky_header = $(".main-header .sticky-header");
			if (windowpos > 100) {
				sticky_header.addClass("fixed-header animated slideInDown");
				scrollLink.fadeIn(300);
			} else {
				sticky_header.removeClass("fixed-header animated slideInDown");
				scrollLink.fadeOut(300);
			}
			if (windowpos > 1) {
				siteHeader.addClass("fixed-header");
			} else {
				siteHeader.removeClass("fixed-header");
			}
		}
	}

	function messageHereForm() {

		const form = document.getElementById("messageHere");

		if (form) {
			form.addEventListener("submit", function (e) {
				e.preventDefault();

				const name = document.getElementById("name").value.trim();
				const email = document.getElementById("email").value.trim();
				const service = document.getElementById("service").value;
				const message = document.getElementById("message").value.trim();


			});
		}
	}

	function loadFaqs() {
		let getFaqs = document.getElementById("faqs_list");

		if (getFaqs) {
			fetch("../json/faqs.json")
				.then(response => {
					return response.json()
				})
				.then(data => {
					const faqWrapper = document.getElementById("faq-wrapper");


					data.data.forEach(section => {
						// Convert title into valid ID
						const sectionId = section.title.replace(/\s+/g, '-').replace(/&/g, 'and');

						// Create column
						const column = document.createElement("div");
						column.className = "faq-column col-lg-12 pb-30";

						// Section title
						const secTitle = `
        <div class="sec-title ">
          <h3>${section.title}</h3>
        </div>
      `;

						// UL wrapper
						const ul = document.createElement("ul");
						ul.className = "accordion-box style-two wow fadeInLeft";

						// Loop through FAQs
						section.list.forEach((faq, index) => {
							const li = document.createElement("li");
							li.className = "accordion block";

							li.innerHTML = `
          <div class="acc-btn border-bottom-0">
            ${faq.q}
            <div class="icon fa fa-plus"></div>
          </div>
          <div class="acc-content ">
            <div class="content">
              <div class="text">${faq.a}</div>
            </div>
          </div>
        `;

							ul.appendChild(li);
						});

						// Inner column
						const inner = document.createElement("div");
						inner.className = "inner-column";
						inner.id = sectionId;
						inner.appendChild(ul);

						// Add everything into column
						column.innerHTML = secTitle;
						column.appendChild(inner);

						// Append column into wrapper
						faqWrapper.appendChild(column);
					});

					// Accordion Box
					if ($('.accordion-box').length) {
						$(".accordion-box").on('click', '.acc-btn', function () {
							var outerBox = $(this).parents('.accordion-box');
							var target = $(this).parents('.accordion');

							// If clicked one is already active → close it
							if ($(this).hasClass("active")) {
								$(this).removeClass("active");
								target.removeClass("active-block");
								$(this).next('.acc-content').slideUp(300);
							} else {
								// Otherwise open it and close others
								$(outerBox).find('.accordion .acc-btn').removeClass('active');
								$(outerBox).find('.accordion .acc-content').slideUp(300);
								$(outerBox).find('.accordion').removeClass('active-block');

								$(this).addClass('active');
								target.addClass('active-block');
								$(this).next('.acc-content').slideDown(300);
							}
						});
					}

					// if ($(".acc-btn").length) {
					// 	$(".acc-btn").on("click", function () {
					// 		var $clickedItem = $(this).closest(".acc-item");

					// 		if ($clickedItem.hasClass("active")) {
					// 			$clickedItem
					// 				.removeClass("active")
					// 				.find(".acc-collapse")
					// 				.slideUp()
					// 				.removeClass("show");
					// 		} else {
					// 			$(".acc-item")
					// 				.removeClass("active")
					// 				.find(".acc-collapse")
					// 				.slideUp()
					// 				.removeClass("show");
					// 			$clickedItem
					// 				.addClass("active")
					// 				.find(".acc-collapse")
					// 				.slideDown()
					// 				.addClass("show");
					// 		}
					// 	});
					// }
					// $(".hzAccordion__item").on("click", function () {
					// 	$(this).addClass("active").siblings().removeClass("active");
					// });
					// if ($('.accordion-box').length) {
					// 	$(".accordion-box").on('click', '.acc-btn', function () {
					// 		var outerBox = $(this).parents('.accordion-box');
					// 		var target = $(this).parents('.accordion');

					// 		if ($(this).hasClass('active') !== true) {
					// 			$(outerBox).find('.accordion .acc-btn').removeClass('active ');
					// 		}

					// 		if ($(this).next('.acc-content').is(':visible')) {
					// 			return false;
					// 		} else {
					// 			$(this).addClass('active');
					// 			$(outerBox).children('.accordion').removeClass('active-block');
					// 			$(outerBox).find('.accordion').children('.acc-content').slideUp(300);
					// 			target.addClass('active-block');
					// 			$(this).next('.acc-content').slideDown(300);
					// 		}
					// 	});
					// }
				})
				.catch(err => console.error("Error loading FAQs:", err));

		}
		$(".hzAccordion__item").on("click", function () {
			$(this).addClass("active").siblings().removeClass("active");
		});
		if ($(".acc-btn").length) {
			$(".acc-btn").on("click", function () {
				var $clickedItem = $(this).closest(".acc-item");

				if ($clickedItem.hasClass("active")) {
					$clickedItem
						.removeClass("active")
						.find(".acc-collapse")
						.slideUp()
						.removeClass("show");
				} else {
					$(".acc-item")
						.removeClass("active")
						.find(".acc-collapse")
						.slideUp()
						.removeClass("show");
					$clickedItem
						.addClass("active")
						.find(".acc-collapse")
						.slideDown()
						.addClass("show");
				}
			});
		}
	}


	// Second Swiper   



	// Banner four slider area start here ***
	$(window).on("load", function () {
		// Banner one slider area start here ***
		if ($(".banner-slider").length) {
			const bannerSwiper = new Swiper(".banner-slider", {
				loop: true,
				slidesPerView: 1,
				effect: "fade",
				speed: 3000,
				autoplay: {
					delay: 7000,
					disableOnInteraction: false,
				},
				navigation: {
					nextEl: ".banner-arry-next",
					prevEl: ".banner-arry-prev",
				},
				pagination: {
					el: ".banner-pagination",
					clickable: true,
				},
				on: {
					init: () => animateSwiper(),
					slideChange: () => animateSwiper(),
				},
			});

			function animateSwiper() {
				$(".banner-slider .swiper-slide-active [data-animation]").each(function () {
					const $el = $(this);
					const anim = $el.data("animation");
					const delay = $el.data("delay") || "0s";
					const duration = $el.data("duration") || "1s";

					$el
						.addClass(`${anim} animated`)
						.css({
							animationDelay: delay,
							animationDuration: duration,
						})
						.one("animationend", () => {
							$el.removeClass(`${anim} animated`);
						});
				});
			}
		}

		// Banner one slider area end here ***

		// Banner four slider area start here ***
		if ($(".banner-slider-four").length) {
			const bannerFourSwiper = new Swiper(".banner-slider-four", {
				slidesPerView: 1,
				spaceBetween: 0,
				loop: true, // ✅ Recommended if you want infinite loop
				speed: 3000,
				autoplay: {
					delay: 5000,
					disableOnInteraction: false,
				},
				effect: "fade",
				fadeEffect: {
					crossFade: true,
				},
				navigation: {
					nextEl: ".banner-slider-four-next",
					prevEl: ".banner-slider-four-prev",
				},
			});
		}
		// Banner four slider area end here ***

		// Banner four slider area start here ***
		if ($(".banner-slider-five").length) {
			const bannerFiveSwiper = new Swiper(".banner-slider-five", {
				slidesPerView: 1,
				spaceBetween: 0,
				loop: true,
				speed: 1500,
				autoplay: {
					delay: 5000,
					disableOnInteraction: false,
				},
				effect: "fade",
				fadeEffect: {
					crossFade: true,
				},
				navigation: {
					nextEl: ".banner-slider-five-next",
					prevEl: ".banner-slider-five-prev",
				},
			});
		}
		// Banner four slider area end here ***

		// First Swiper
		if ($(".one-grid-slider").length) {
			const oneGridSwiper = new Swiper(".one-grid-slider", {
				slidesPerView: 1, // Displays one slide at a time
				spaceBetween: 0,
				loop: true,
				speed: 2000,
				autoplay: {
					delay: 3000,
					disableOnInteraction: false,
				},
				navigation: {
					nextEl: ".one-grid-next, .testimonial-next-three", // Update your HTML to match
					prevEl: ".one-grid-prev, .testimonial-prev-three",
				},
			});
		}

		//service-carousel
		if ($(".service-slider").length) {
			var swiper = new Swiper(".service-slider", {
				spaceBetween: 30,
				speed: 1000,
				loop: true,
				autoplay: {
					delay: 4000,
					disableOnInteraction: false,
				},
				breakpoints: {
					320: {
						slidesPerView: 1,
					},
					991: {
						slidesPerView: 2,
					},
					1399: {
						slidesPerView: 3,
					},
				},
			});
		}

		// service-carousel Two
		var swiper = new Swiper(".service-two-slider2", {
			loop: true,
			slidesPerView: 4,
			navigation: true,
			spaceBetween: 0,
			speed: 1000,
			breakpoints: {
				1199: {
					slidesPerView: 4,
				},
				991: {
					slidesPerView: 3,
				},
				320: {
					slidesPerView: 2,
				},
			},
			navigation: {
				nextEl: ".service-two-next",
				prevEl: ".service-two-prev",
			},
		});

		// Testinomials Carousel
		if ($(".testimonial-slider-content").length) {
			var slider = new Swiper(".testimonial-slider-content", {
				slidesPerView: 1,
				spaceBetween: 30,
				navigation: true,
				centeredSlides: true,
				loop: true,
				loopedSlides: 6,
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
			});
			var thumbs = new Swiper(".testimonial-thumbs", {
				slidesPerView: "auto",
				spaceBetween: 0,
				centeredSlides: true,
				loop: true,
				slideToClickedSlide: true,
			});
			slider.controller.control = thumbs;
			thumbs.controller.control = slider;
		}

		//brand-carousel
		if ($(".brand-slider").length) {
			var swiper = new Swiper(".brand-slider", {
				loop: true,
				freemode: true,
				slidesPerView: 1,
				spaceBetween: 0,
				centeredSlides: true,
				allowTouchMove: false,
				speed: 3000,
				autoplay: {
					delay: 1,
					disableOnInteraction: true,
				},
				breakpoints: {
					320: {
						slidesPerView: 2,
					},
					575: {
						slidesPerView: 3,
					},
					991: {
						slidesPerView: 4,
					},
					1399: {
						slidesPerView: 5,
					},
				},
			});
		}

		// Blog Slider
		if ($(".blog-slider").length) {
			var swiper = new Swiper(".blog-slider", {
				loop: true,
				spaceBetween: 24,
				speed: 1000,
				pagination: {
					el: ".blog-pagination",
					clickable: true,
				},
				breakpoints: {
					767: {
						slidesPerView: 1,
					},
					991: {
						slidesPerView: 2,
					},
					1199: {
						slidesPerView: 3,
					},
				},
			});
		}

		// Case Slider
		if ($(".case-slider").length) {
			var swiper = new Swiper(".case-slider", {
				loop: true,
				spaceBetween: 35,
				speed: 1000,
				autoplay: {
					delay: 3000,
					disableOnInteraction: false,
				},
				breakpoints: {
					767: {
						slidesPerView: 2,
					},
					1199: {
						slidesPerView: 3,
					},
					1399: {
						slidesPerView: 4,
					},
				},
			});
		}

		// Testimonial Slider five
		if ($(".testimonial-slider-five").length) {
			var swiper = new Swiper(".testimonial-slider-five", {
				loop: true,
				spaceBetween: 35,
				speed: 1000,
				autoplay: {
					delay: 3000,
					disableOnInteraction: false,
				},
				pagination: {
					el: ".testimonial-pagination",
					clickable: true,
				},
				breakpoints: {
					767: {
						slidesPerView: 1,
					},
					1350: {
						slidesPerView: 2,
					},
					1600: {
						slidesPerView: 3,
					},
				},
			});
		}

		// Testinomials Carousel
		var swiper = new Swiper(".testimonial-slider", {
			loop: true,
			navigation: true,
			spaceBetween: 30,
			speed: 1000,
			navigation: {
				nextEl: ".testimonial-next",
				prevEl: ".testimonial-prev",
			},
		});

		var swiper = new Swiper(".testimonial-slider-two", {
			loop: "true",
			navigation: true,
			spaceBetween: 30,
			speed: 1000,
			autoplay: {
				delay: 4000,
				disableOnInteraction: false,
			},
			navigation: {
				nextEl: ".testimonial-next-two",
				prevEl: ".testimonial-prev-two",
			},
		});

		if (
			$(".testimonial-slider-four").length &&
			$(".testimonial-slider-thumb-four").length
		) {
			var swiperThumb = new Swiper(".testimonial-slider-thumb-four", {
				spaceBetween: 15,
				speed: 1000,
				freeMode: true,
				breakpoints: {
					320: { slidesPerView: 1 },
					575: { slidesPerView: 2 },
					991: { slidesPerView: 3 },
				},
			});

			var swiper = new Swiper(".testimonial-slider-four", {
				spaceBetween: 50,
				speed: 1000,
				autoplay: {
					delay: 5000,
					disableOnInteraction: false,
				},
				thumbs: {
					swiper: swiperThumb,
				},
			});
		}

		var swiper = new Swiper(".testimonial-slider-six", {
			loop: "true",
			navigation: true,
			spaceBetween: 30,
			speed: 1000,
			autoplay: {
				delay: 4000,
				disableOnInteraction: false,
			},
			navigation: {
				nextEl: ".testimonial-next-six",
				prevEl: ".testimonial-prev-six",
			},
		});
	});
	// Banner four slider area end here ***

	//testimonial-carousel Two
	if ($(".testimonial-carousel-two").length) {
		$(".testimonial-carousel-two").slick({
			infinite: true,
			speed: 300,
			slidesToShow: 3,
			slidesToScroll: 1,
			dots: false,
			arrows: true,
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 3,
					},
				},
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 2,
					},
				},
				{
					breakpoint: 600,
					settings: {
						slidesToShow: 1,
					},
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
					},
				},
			],
		});
	}

	// Testimonial Carousel
	if ($(".testimonial-carousel-one").length) {
		$(".testimonial-carousel-one").slick({
			infinite: true,
			speed: 300,
			slidesToShow: 1,
			slidesToScroll: 1,
			dots: true,
			arrows: false,
			navText: [
				'<span class="icon-arrow-left"></span>',
				'<span class="icon-arrow-right"></span>',
			],
		});
	}

	//testimonial-carousel Single
	if ($(".testimonial-single-slider").length) {
		$(".testimonial-single-slider").slick({
			infinite: true,
			dots: true,
			arrows: false,
			autoplay: true,
			autoplaySpeed: 3000,
			fade: false,
			fadeSpeed: 1000,
		});
	}
	//product bxslider
	if ($(".product-details .bxslider").length) {
		$(".product-details .bxslider").bxSlider({
			nextSelector: ".product-details #slider-next",
			prevSelector: ".product-details #slider-prev",
			nextText: '<i class="fa fa-angle-right"></i>',
			prevText: '<i class="fa fa-angle-left"></i>',
			mode: "fade",
			auto: "true",
			speed: "700",
			pagerCustom: ".product-details .slider-pager .thumb-box",
		});
	}

	//MixItup Gallery
	if ($(".filter-list").length) {
		$(".filter-list").mixItUp({});
	}

	//Jquery Knob animation  // Pie Chart Animation
	if ($(".dial").length) {
		$(".dial").appear(
			function () {
				var elm = $(this);
				var color = elm.attr("data-fgColor");
				var perc = elm.attr("value");

				elm.knob({
					value: 0,
					min: 0,
					max: 100,
					skin: "tron",
					readOnly: true,
					thickness: 0.15,
					dynamicDraw: true,
					displayInput: false,
				});
				$({ value: 0 }).animate(
					{ value: perc },
					{
						duration: 2000,
						easing: "swing",
						progress: function () {
							elm.val(Math.ceil(this.value)).trigger("change");
						},
					}
				);
				//circular progress bar color
				$(this).append(function () {
					// elm.parent().parent().find('.circular-bar-content').css('color',color);
					//elm.parent().parent().find('.circular-bar-content .txt').text(perc);
				});
			},
			{ accY: 20 }
		);
	}

	// Hover add & remove js area start here ***
	$(".gellery-block").hover(function () {
		$(".gellery-block").removeClass("active");
		$(this).addClass("active");
	});

	// Hover add & remove js area end here ***

	// Nice seclect area start here ***
	$(document).ready(function () {
		$("select").niceSelect();
	});



	//Fact Counter + Text Count
	if ($(".count-box").length) {
		$(".count-box").appear(
			function () {
				var $t = $(this),
					n = $t.find(".count-text").attr("data-stop"),
					r = parseInt($t.find(".count-text").attr("data-speed"), 10);

				if (!$t.hasClass("counted")) {
					$t.addClass("counted");
					$({
						countNum: $t.find(".count-text").text(),
					}).animate(
						{
							countNum: n,
						},
						{
							duration: r,
							easing: "linear",
							step: function () {
								$t.find(".count-text").text(Math.floor(this.countNum));
							},
							complete: function () {
								$t.find(".count-text").text(this.countNum);
							},
						}
					);
				}
			},
			{ accY: 0 }
		);
	}

	//Tabs Box
	if ($(".tabs-box").length) {
		$(".tabs-box .tab-buttons .tab-btn").on("click", function (e) {
			e.preventDefault();
			var target = $($(this).attr("data-tab"));

			if ($(target).is(":visible")) {
				return false;
			} else {
				target
					.parents(".tabs-box")
					.find(".tab-buttons")
					.find(".tab-btn")
					.removeClass("active-btn");
				$(this).addClass("active-btn");
				target
					.parents(".tabs-box")
					.find(".tabs-content")
					.find(".tab")
					.fadeOut(0);
				target
					.parents(".tabs-box")
					.find(".tabs-content")
					.find(".tab")
					.removeClass("active-tab animated fadeIn");
				$(target).fadeIn(300);
				$(target).addClass("active-tab animated fadeIn");
			}
		});
	}

	// Background image ***
	$("[data-background").each(function () {
		$(this).css(
			"background-image",
			"url( " + $(this).attr("data-background") + "  )"
		);
	});

	//product bxslider
	if ($(".product-details .bxslider").length) {
		$(".product-details .bxslider").bxSlider({
			nextSelector: ".product-details #slider-next",
			prevSelector: ".product-details #slider-prev",
			nextText: '<i class="fa fa-angle-right"></i>',
			prevText: '<i class="fa fa-angle-left"></i>',
			mode: "fade",
			auto: "true",
			speed: "700",
			pagerCustom: ".product-details .slider-pager .thumb-box",
		});
	}

	//Quantity box
	$(".quantity-box .add").on("click", function () {
		if ($(this).prev().val() < 999) {
			$(this)
				.prev()
				.val(+$(this).prev().val() + 1);
		}
	});

	$(".quantity-box .sub").on("click", function () {
		if ($(this).next().val() > 1) {
			if ($(this).next().val() > 1)
				$(this)
					.next()
					.val(+$(this).next().val() - 1);
		}
	});

	// Mouse move paralax area end here ***
	if ($(window).width() > 780) {
		$(".paralax__animation").mousemove(function (e) {
			$("[data-depth]").each(function () {
				var depth = $(this).data("depth");
				var amountMovedX = (e.pageX * -depth) / 4;
				var amountMovedY = (e.pageY * -depth) / 4;

				$(this).css({
					transform:
						"translate3d(" +
						amountMovedX +
						"px," +
						amountMovedY +
						"px, 0)",
				});
			});
		});
	}
	// Mouse move paralax area end here ***

	//Price Range Slider
	if ($(".price-range-slider").length) {
		$(".price-range-slider").slider({
			range: true,
			min: 10,
			max: 99,
			values: [10, 60],
			slide: function (event, ui) {
				$("input.property-amount").val(ui.values[0] + " - " + ui.values[1]);
			},
		});

		$("input.property-amount").val(
			$(".price-range-slider").slider("values", 0) +
			" - $" +
			$(".price-range-slider").slider("values", 1)
		);
	}

	// count Bar
	if ($(".count-bar").length) {
		$(".count-bar").appear(
			function () {
				var el = $(this);
				var percent = el.data("percent");
				$(el).css("width", percent).addClass("counted");
			},
			{
				accY: -50,
			}
		);
	}

	//Tabs Box
	if ($(".tabs-box").length) {
		$(".tabs-box .tab-buttons .tab-btn").on("click", function (e) {
			e.preventDefault();
			var target = $($(this).attr("data-tab"));

			if ($(target).is(":visible")) {
				return false;
			} else {
				target
					.parents(".tabs-box")
					.find(".tab-buttons")
					.find(".tab-btn")
					.removeClass("active-btn");
				$(this).addClass("active-btn");
				target
					.parents(".tabs-box")
					.find(".tabs-content")
					.find(".tab")
					.fadeOut(0);
				target
					.parents(".tabs-box")
					.find(".tabs-content")
					.find(".tab")
					.removeClass("active-tab animated fadeIn");
				$(target).fadeIn(300);
				$(target).addClass("active-tab animated fadeIn");
			}
		});
	}

	//Progress Bar
	if ($(".progress-line").length) {
		$(".progress-line").appear(
			function () {
				var el = $(this);
				var percent = el.data("width");
				$(el).css("width", percent + "%");
			},
			{ accY: 0 }
		);
	}

	//LightBox / Fancybox
	if ($(".lightbox-image").length) {
		$(".lightbox-image").fancybox({
			openEffect: "fade",
			closeEffect: "fade",
			helpers: {
				media: {},
			},
		});
	}

	// Scroll to a Specific Div
	if ($(".scroll-to-target").length) {
		$(".scroll-to-target").on("click", function () {
			var target = $(this).attr("data-target");
			// animate
			$("html, body").animate(
				{
					scrollTop: $(target).offset().top,
				},
				0
			);
		});
	}

	// Elements Animation
	if ($(".wow").length) {
		Splitting();
		var wow = new WOW({
			boxClass: "wow",
			animateClass: "animated",
			offset: 0,
			mobile: true,
			live: true,
		});
		wow.init();
	}

	/* ---------------------------------------------------------------------- */
	/* ----------- Activate Menu Item on Reaching Different Sections ---------- */
	/* ---------------------------------------------------------------------- */
	var $onepage_nav = $(".onepage-nav");
	var $sections = $("section");
	var $window = $(window);
	function TM_activateMenuItemOnReach() {
		if ($onepage_nav.length > 0) {
			var cur_pos = $window.scrollTop() + 2;
			var nav_height = $onepage_nav.outerHeight();
			$sections.each(function () {
				var top = $(this).offset().top - nav_height - 80,
					bottom = top + $(this).outerHeight();

				if (cur_pos >= top && cur_pos <= bottom) {
					$onepage_nav
						.find("a")
						.parent()
						.removeClass("current")
						.removeClass("active");
					$sections.removeClass("current").removeClass("active");
					$onepage_nav
						.find('a[href="#' + $(this).attr("id") + '"]')
						.parent()
						.addClass("current")
						.addClass("active");
				}

				if (cur_pos <= nav_height && cur_pos >= 0) {
					$onepage_nav
						.find("a")
						.parent()
						.removeClass("current")
						.removeClass("active");
					$onepage_nav
						.find('a[href="#header"]')
						.parent()
						.addClass("current")
						.addClass("active");
				}
			});
		}
	}

	/* ==========================================================================
   When document is Scrollig, do
   ========================================================================== */

	$(window).on("scroll", function () {
		headerStyle();
		TM_activateMenuItemOnReach();
	});

	/* ==========================================================================
   When document is loading, do
   ========================================================================== */

	$(window).on("load", function () {
		handlePreloader();
		loadHeader();
		loadFooter();
		loadDashboardSidebar();
		loadFaqs();
		// loadChart();
		messageHereForm();
	});
})(window.jQuery);




function updateStepsLine() {
	const wrapper = document.querySelector(".how-to-invest .steps-wrapper");
	if (wrapper) {
		const steps = wrapper.querySelectorAll(".step");
		if (steps) {
			const line = wrapper.querySelector(".steps-line");

			if (!steps.length || !line) return;

			const first = steps[0];
			const last = steps[steps.length - 1];

			// Get start at middle of first step
			const start = first.offsetTop + first.offsetHeight / 2;
			// Get end at middle of last step
			const end = last.offsetTop + last.offsetHeight / 2;

			// Apply to line
			line.style.top = start + "px";
			line.style.height = (end - start) + "px";
		}
	}

}

async function loadBannerDetails() {
	try {
		const response = await fetch("/api/banner-details/get", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response
	} catch (error) {
		return error;
	}
}

async function loadChartDetails() {
	try {
		const response = await fetch("/api/chart-details/get", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response
	} catch (error) {
		return error;
	}
}
async function loadTableDetails() {
	try {
		const response = await fetch("/api/table-details/get", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response
	} catch (error) {
		return error;
	}
}

async function loadBlogDetails() {
	try {
		const response = await fetch("/api/blog-details/add-edit", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response
	} catch (error) {
		return error;
	}
}

async function fetchFundStats() {
	const statsGrid = document.querySelector(".stats-grid");

	try {
		// Step 1: show skeleton placeholders in numbers/dates
		const numericFields = statsGrid.querySelectorAll(".stat-card p");
		numericFields.forEach(p => {
			if (p && !p.classList.contains("heading_date")) {
				p.innerHTML = `<span class="skeleton" style="width:80px;height:16px;"></span>`;
			} else if (p.classList.contains("heading_date")) {
				p.innerHTML = `<span class="skeleton" style="width:100px;height:12px;"></span>`;
			}
		});

		const response = await loadBannerDetails();
		const result = await response.json();

		if (response.ok) {
			const statsCards = statsGrid.querySelectorAll(".stat-card");

			result?.data?.data?.forEach((item) => {
				statsCards.forEach((card) => {
					const title = card.querySelector("h4")?.innerText.trim();
					if (title === item.title) {
						// Investment / main value
						const mainValue = card.querySelector("p.mt-2") || card.querySelector("p");
						if (mainValue) mainValue.textContent = item.investment || "0%";

						// Progress bar
						const progressBar = card.querySelector(".progress .progress");
						if (progressBar) {
							let perc = 0;
							if (item.percentage) {
								const match = item.percentage.match(/[\d.]+/);
								perc = match ? parseFloat(match[0]) : 0;
							}
							progressBar.style.width = `${perc}%`;
						}

						// Date
						const dateElem = card.querySelector(".heading_date") || card.querySelector("p:nth-child(3)");
						if (dateElem) dateElem.textContent = item.date || "";
					}
				});
			});

		} else {
			console.error("Error fetching fund stats:", result.message);
		}

	} catch (err) {
		console.error("Fetch error:", err);
	}
}


// Call the function
fetchFundStats();

// function loadChart() {
// 		let findChart = document.querySelector("#chart2");
// 		if (findChart) {
// 			let options2 = {
// 				chart: {
// 					type: 'line',
// 					height: 400,
// 					toolbar: { show: false }
// 				},
// 				series: [
// 					{
// 						name: 'Accor Growth Fund',
// 						data: [100, 123, 157, 138, 128, 132, 139, 147, 158, 158]
// 					},
// 					{
// 						name: 'Nifty Small Cap 250',
// 						data: [100, 101, 95, 88, 82, 84, 88, 92, 93, 90]
// 					}
// 				],
// 				colors: ['#39acab', '#7ac464'],
// 				xaxis: {
// 					categories: ['Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025', 'Aug 2025']
// 				},
// 				stroke: {
// 					curve: 'smooth',
// 					width: 3
// 				},
// 				markers: {
// 					size: 6
// 				},
// 				legend: {
// 					position: 'top',
// 					horizontalAlign: 'right'
// 				},
// 				grid: {
// 					borderColor: '#e0e0e0',
// 					strokeDashArray: 4
// 				},
// 				tooltip: {
// 					shared: true,
// 					intersect: false
// 				}
// 			};
// 			chart2 = new ApexCharts(findChart, options2);
// 			chart2.render();
// 		}
// 	}

async function fetchChartDetails() {
	const navElem = document.querySelector(".strategy-section-two h4");
	const dateElem = document.querySelector(".strategy-section-two p.mb-0");
	const growthElem = document.querySelector(".growth_since .text-2");
	const chartContainer = document.querySelector("#chart2");
	const chartPoints = document.querySelector(".chart_points");

	try {
		// Step 1: Show skeletons — but don't replace the #chart2 element itself
		if (navElem)
			navElem.innerHTML = `NAV: <span class="skeleton" style="width:80px;height:16px;"></span>`;
		if (dateElem)
			dateElem.innerHTML = `<span class="skeleton" style="width:100px;height:12px;"></span>`;
		if (growthElem)
			growthElem.innerHTML = `<span class="skeleton" style="width:60px;height:14px;"></span>`;

		// Add skeleton overlay *inside* chart container
		let chartSkeleton = document.createElement("div");
		chartSkeleton.className = "chart-skeleton";
		chartSkeleton.innerHTML = `<div class="skeleton" style="width:100%;height:400px;border-radius:8px;"></div>`;
		if (chartContainer) {
			chartContainer.innerHTML = ""; // clear any existing chart
			chartContainer.appendChild(chartSkeleton);
		}

		if (chartPoints)
			chartPoints.innerHTML = `<li><span class="skeleton" style="width:80%;height:12px;"></span></li>
                               <li><span class="skeleton" style="width:90%;height:12px;"></span></li>
                               <li><span class="skeleton" style="width:70%;height:12px;"></span></li>`;

		// Step 2: Fetch chart details
		const response = await loadChartDetails();
		const result = await response.json();

		if (!response.ok) {
			console.error("Error fetching chart details:", result.message);
			return;
		}

		const data = result?.data;
		if (!data) return;

		// Step 3: Remove skeletons
		document.querySelectorAll(".skeleton").forEach(el => el.remove());

		// Step 4: Update info fields
		if (navElem) navElem.textContent = `NAV: ${data.nav || "₹0.00"}`;
		if (dateElem) dateElem.textContent = data.date || "";
		if (growthElem) growthElem.textContent = data.GrowthSinceInception || "0%";

		// Step 5: Update chart points
		if (chartPoints) {
			chartPoints.innerHTML = "";
			data.lines?.forEach(line => {
				const li = document.createElement("li");
				li.textContent = `* ${line}`;
				chartPoints.appendChild(li);
			});
		}

		// Step 6: Render chart inside existing container
		if (chartContainer) {
			chartContainer.innerHTML = ""; // clear skeleton
			const options = {
				chart: {
					type: "line",
					height: 400,
					toolbar: { show: false },
				},
				series: data.series || [],
				colors: data.colors || ["#39acab", "#7ac464"],
				xaxis: {
					categories: data.categories || [],
				},
				stroke: { curve: "smooth", width: 3 },
				markers: { size: 6 },
				legend: { position: "top", horizontalAlign: "right" },
				grid: { borderColor: "#e0e0e0", strokeDashArray: 4 },
				tooltip: { shared: true, intersect: false },
			};
			const chart2 = new ApexCharts(chartContainer, options);
			chart2.render();
		}
	} catch (err) {
		console.error("Fetch chart details error:", err);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	fetchChartDetails();
});

async function fetchTableDetails() {
	const tableBody = document.querySelector(".dashborad_table tbody");
	const anchorSection = document.querySelector(".anchor_performance_section");

	try {
		// 🩶 STEP 1: Show skeleton loaders (keep same layout)
		if (tableBody) {
			tableBody.innerHTML = "";
			for (let i = 0; i < 6; i++) {
				const tr = document.createElement("tr");
				for (let j = 0; j < 5; j++) {
					const td = document.createElement("td");
					td.innerHTML = `<span class="skeleton" style="width:100px;height:14px;display:block;margin:6px 0;"></span>`;
					tr.appendChild(td);
				}
				tableBody.appendChild(tr);
			}
		}

		if (anchorSection) {
			anchorSection.innerHTML = "";
			for (let i = 0; i < 2; i++) {
				const card = document.createElement("div");
				card.className = "anchor_performance_card";
				card.innerHTML = `
          <div class="anchor_performance_card_header">
            <div class="anchor_performance_meta">
              <h3 class="anchor_performance_card_title"><span class="skeleton" style="width:150px;height:16px;"></span></h3>
              <span><span class="skeleton" style="width:80px;height:12px;"></span></span>
            </div>
            <span class="anchor_performance_badge"><span class="skeleton" style="width:40px;height:12px;"></span></span>
          </div>
          <div class="anchor_performance_card_body">
            <div class="anchor_performance_grid">
              <div>
                <p class="anchor_performance_label">Lead Managers</p>
                <p class="anchor_performance_value"><span class="skeleton" style="width:120px;height:12px;"></span></p>
              </div>
              <div>
                <p class="anchor_performance_label">Amount Invested</p>
                <p class="anchor_performance_value"><span class="skeleton" style="width:100px;height:12px;"></span></p>
              </div>
            </div>
          </div>`;
				anchorSection.appendChild(card);
			}
		}

		// 🧭 STEP 2: Fetch API
		const response = await loadTableDetails();
		const result = await response.json();

		if (!response.ok) {
			console.error("Error fetching table details:", result.message);
			return;
		}

		const data = result?.data;
		if (!data || !Array.isArray(data)) return;

		// 💡 STEP 3: Clear skeletons
		if (tableBody) tableBody.innerHTML = "";
		if (anchorSection) anchorSection.innerHTML = "";

		// 💾 STEP 4: Populate Table
		data.forEach((item, index) => {
			const tr = document.createElement("tr");
			tr.className = index % 2 === 0 ? "wow bounceInLeft" : "wow bounceInRight";

			tr.innerHTML = `
        <td><p>${item.company_name || "-"}</p></td>
        <td><p>${item.issue_type || "-"}</p></td>
        <td><p>${item.lead_manager || "-"}</p></td>
<td><p>${item.listing_date ? new Date(item.listing_date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "-"}</p></td>
        <td><p>${item.amount_invested || "-"}</p></td>`;
			tableBody.appendChild(tr);
		});

		// 💾 STEP 5: Populate Anchor Cards
		data.forEach((item, index) => {
			const card = document.createElement("div");
			card.className = `anchor_performance_card wow ${index % 2 === 0 ? "bounceInLeft" : "bounceInRight"}`;
			card.setAttribute("data-wow-duration", "1500ms");

			card.innerHTML = `
        <div class="anchor_performance_card_header">
          <div class="anchor_performance_meta">
            <h3 class="anchor_performance_card_title">${item.company_name || "-"}</h3>
            <span>${item.listing_date || "-"}</span>
          </div>
          <span class="anchor_performance_badge">${item.issue_type || "-"}</span>
        </div>
        <div class="anchor_performance_card_body">
          <div class="anchor_performance_grid">
            <div class="anchor_performance_lead">
              <p class="anchor_performance_label">Lead Managers</p>
              <p class="anchor_performance_value">${item.lead_manager || "-"}</p>
            </div>
            <div>
              <p class="anchor_performance_label">Amount Invested</p>
              <p class="anchor_performance_value">${item.amount_invested || "-"}</p>
            </div>
          </div>
        </div>`;
			anchorSection.appendChild(card);
		});
	} catch (err) {
		console.error("Fetch table details error:", err);
	}
}

// 👇 Run after DOM loads
document.addEventListener("DOMContentLoaded", () => {
	fetchTableDetails();
});


document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("subscribeForm");
	const formMessage = document.getElementById("formMessage");
	const submitBtn = document.getElementById("submitBtn");

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		const name = form.form_name.value.trim();
		const email = form.form_email.value.trim();
		const message = form.form_message.value.trim();

		// Clear previous message
		formMessage.textContent = "";
		formMessage.style.color = "";

		if (!name || !email || !message) {
			formMessage.textContent = "Please fill all fields";
			formMessage.style.color = "red";
			return;
		}

		// Show loader on button
		const originalBtnText = submitBtn.innerHTML;
		submitBtn.disabled = true;
		submitBtn.innerHTML = `<i class="fa fa-spinner fa-spin"></i> Sending...`;

		try {
			const response = await fetch("/api/email-subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, message }),
			});

			const result = await response.json();

			if (response.ok) {
				showToast(result.message || "Subscription successful!", "#4CAF50")
				form.reset();
			} else {
				showToast(result.message || "Something went wrong!")
			}
		} catch (err) {
			console.error("Error submitting form:", err);
			showToast(err.message || "Error sending your message. Please try again later.")
		} finally {
			// Revert button
			submitBtn.disabled = false;
			submitBtn.innerHTML = originalBtnText;
		}
	});
});

window.addEventListener("load", updateStepsLine);
window.addEventListener("resize", updateStepsLine);

function showToast(msg, bgColor = "#FF0000") {
	Toastify({
		text: msg,
		duration: 3000,
		gravity: "top",
		position: "right",
		backgroundColor: bgColor
	}).showToast();
}

function generateSiteMap(){
	fetch("https://accorgrowthfund.com/api/email-subscribe?action=sitemap")
  .then(res => res.text())
  .then(xml => {
    console.log("Sitemap XML:", xml);
  });
}