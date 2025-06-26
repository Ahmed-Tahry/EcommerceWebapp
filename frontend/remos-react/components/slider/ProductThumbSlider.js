'use client'
import { useState } from 'react'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
export default function ProductThumbSlider({ direction }) {
	const [thumbsSwiper, setThumbsSwiper] = useState(null)
	const mainSwiperOptions = {
		modules: [FreeMode, Navigation, Thumbs],
		thumbs: { swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null },
		spaceBetween: 10,
		navigation: {
			nextEl: ".thumbs-next",
			prevEl: ".thumbs-prev",
		},
	}

	// Swiper options for the thumbnail slider
	const thumbnailSwiperOptions = {
		modules: [FreeMode, Navigation, Thumbs],
		spaceBetween: 10,
		slidesPerView: "auto",
		freeMode: true,
		watchSlidesProgress: true,
		breakpoints: {
			0: {
				direction: "horizontal",
			},
			768: {
				direction: direction,
			}
		},
	}
	return (
		<>
			<div className="thumbs-slider">
				<div className="swiper tf-product-media-thumbs other-image-zoom" data-direction="vertical">
					<Swiper {...thumbnailSwiperOptions} onSwiper={setThumbsSwiper} className="swiper-wrapper">
						<SwiperSlide>
							<div className="item">
								<img src="/images/products/product-detail-thumbs-1.png" alt="" />
							</div>
						</SwiperSlide>
						<SwiperSlide>
							<div className="item">
								<img src="/images/products/product-detail-thumbs-2.png" alt="" />
							</div>
						</SwiperSlide>
						<SwiperSlide>
							<div className="item">
								<img src="/images/products/product-detail-thumbs-3.png" alt="" />
							</div>
						</SwiperSlide>
						<SwiperSlide>
							<div className="item">
								<img src="/images/products/product-detail-thumbs-4.png" alt="" />
							</div>
						</SwiperSlide>
						<SwiperSlide>
							<div className="item">
								<img src="/images/products/product-detail-thumbs-5.png" alt="" />
							</div>
						</SwiperSlide>
					</Swiper>
				</div>
				<Swiper {...mainSwiperOptions} className="swiper tf-product-media-main" id="gallery-swiper-started">
					<div className="swiper-wrapper">
						<SwiperSlide>
							<div className="item">
								<a href="#" target="_blank" data-pswp-width="506px" data-pswp-height="810px">
									<img className="tf-image-zoom" src="/images/products/product-detail-1.png" alt="" />
								</a>
							</div>
						</SwiperSlide>
						<SwiperSlide>
							<div className="item">
								<a href="#" target="_blank" data-pswp-width="500px" data-pswp-height="500px">
									<img className="tf-image-zoom" src="/images/products/product-detail-2.png" alt="" />
								</a>
							</div>
						</SwiperSlide>
						<SwiperSlide>
							<div className="item">
								<a href="#" target="_blank" data-pswp-width="500px" data-pswp-height="500px">
									<img className="tf-image-zoom" src="/images/products/product-detail-3.png" alt="" />
								</a>
							</div>
						</SwiperSlide>
						<SwiperSlide>
							<div className="item">
								<a href="#" target="_blank" data-pswp-width="500px" data-pswp-height="500px">
									<img className="tf-image-zoom" src="/images/products/product-detail-4.png" alt="" />
								</a>
							</div>
						</SwiperSlide>
						<SwiperSlide>
							<div className="item">
								<a href="#" target="_blank" data-pswp-width="500px" data-pswp-height="500px">
									<img className="tf-image-zoom" src="/images/products/product-detail-5.png" alt="" />
								</a>
							</div>
						</SwiperSlide>
					</div>
					<div className="swiper-button-next button-style-arrow thumbs-next" />
					<div className="swiper-button-prev button-style-arrow thumbs-prev" />
				</Swiper>
			</div>
		</>
	)
}
