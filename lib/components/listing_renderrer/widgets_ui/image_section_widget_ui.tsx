"use client"
import { Box, Circle, Flex, Heading, Icon, Image, useMediaQuery } from "@chakra-ui/react";
import Slider, { CustomArrowProps } from "react-slick";
import { ImageSectionWidgetAnswerData } from "../../template_form/types";
import NextImageWithFallback from "../../image_with_fallback";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { MdArrowBackIos, MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { RefObject, useEffect, useRef, useState } from "react";

type ImageSectionWidgetUIProps = {
    imageList: ImageSectionWidgetAnswerData['list']
}

const ImageSectionWidgetUI = ({ imageList }: ImageSectionWidgetUIProps) => {
    const [nav1, setNav1] = useState<RefObject<Slider> | undefined>();
    const [nav2, setNav2] = useState<RefObject<Slider> | undefined>();
    const [slideIndex, setSlideIndex] = useState(0);
    let sliderRef = useRef<Slider>(null);
    let sliderRef2 = useRef<Slider>(null);
    const [isMobile] = useMediaQuery('(max-width: 600px)')

    useEffect(() => {
        setNav1(sliderRef);
        setNav2(sliderRef2);
    }, []);

    const onClickItem = (index: number) => {
        setSlideIndex(index);
        //sliderRef.current?.slickGoTo(index)
    }

    return (
        <Flex w = '100%' direction={'column'} gap = '20px' borderRadius={isMobile ? '0px' : '20px'}>
            <Box w = {['calc(100% + 20px)', 'calc(100% + 80px)', '100%', '100%', '100%']} ml = {['-10px', '-40px', '0px', '0px', '0px']} borderRadius={isMobile ? '0px' : '20px'}>
                <Slider
                    className="single-carousel"
                    asNavFor={nav2 as any}
                    ref = {e => (sliderRef = e as any)}
                    infinite
                    autoplay = {false}
                    slidesToShow={1}
                    slidesToScroll={1}
                    dots = {false}
                    nextArrow = {<NextArrow />}
                    prevArrow = {<PrevArrow />}
                    afterChange={index => setSlideIndex(index)}
                >
                    {
                        imageList.map((image, index) => {
                            const imageSrc = image.path.startsWith('http') ? image.path : `https://storage.googleapis.com/${image.path}`;
                            return <Flex key = {image.path} position={'relative'} flexShrink={0} w = {'100%'} h = {['200px', '250px', '300px', '420px', '420px']} borderRadius={isMobile ? '0px' : '20px'}>
                                <NextImageWithFallback src = {imageSrc} alt = 'image' fill style = {{ objectFit: 'cover', borderRadius: isMobile ? '0px' : '20px' }} sizes='(max-width: 991px) 100vw, 49vw' loading='lazy' />
                            </Flex>
                        })
                    }
                </Slider>
            </Box>
            <Box w = '100%' borderRadius={'15px'}>
                <Slider
                    className="multi-carousel"
                    asNavFor={nav1 as any}
                    ref = {e => (sliderRef2 = e as any)}
                    focusOnSelect = {true}
                    infinite = {false}
                    autoplay = {false}
                    dots = {false}
                    slidesToShow = {4} 
                    slidesToScroll = {2}  
                    nextArrow = {<NextArrow />}
                    prevArrow = {<PrevArrow />}
                    responsive={[
                        {
                            breakpoint: 1200,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 2,
                            }
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 5,
                                slidesToScroll: 1,
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 5,
                                slidesToScroll: 1,
                            }
                        },
                        {
                            breakpoint: 576,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 1,
                            }
                        },
                    ]}
                >
                    {
                        imageList.map((image, index) => {
                            const imageSrc = image.path.startsWith('http') ? image.path : `https://storage.googleapis.com/${image.path}`;
                            return <Flex key = {image.path} cursor={'pointer'} position={'relative'} border = {slideIndex == index ? '2px' : '0px'} borderColor={'tomato'} flexShrink={0} w = {'100%'} maxW = {isMobile ? '70px' : '100%'} h = {['70px', '70px', '100px', '100px', '100px']} borderRadius={isMobile ? '100%' : '18px'}>
                                <NextImageWithFallback src = {imageSrc} alt = 'image' fill style = {{ objectFit: 'cover', borderRadius: isMobile ? '100%' : '15px' }} sizes='(max-width: 991px) 100vw, 49vw' loading='lazy' />
                            </Flex>
                        })
                    }
                </Slider>
            </Box>
        </Flex>
    );
}

export default ImageSectionWidgetUI;

const NextArrow = ({ className, style, onClick }: CustomArrowProps) => {
    return (
        <Flex zIndex={999} className={className} style = {style} onClick = {onClick}>
            <Circle size='40px' bg='rgba(70,81,102,.5)'>
                <Icon w = '20px' h = '20px' color = 'white' as = {MdArrowForwardIos} />
            </Circle>
        </Flex>
    );
}
  
const PrevArrow = ({ className, style, onClick }: CustomArrowProps) => {
    return (
        <Flex zIndex={9999} className={className} style = {style} onClick = {onClick}>
            <Circle size='40px' bg='rgba(70,81,102,.5)'>
                <Icon mr = '5px' w = '20px' h = '20px' color = 'white' as = {MdArrowBackIosNew} />
            </Circle>
        </Flex>
    );
}