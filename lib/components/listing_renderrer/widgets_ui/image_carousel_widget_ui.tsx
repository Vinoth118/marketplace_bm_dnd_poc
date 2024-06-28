"use client"
import { Box, Circle, Flex, Heading, Icon, Image } from "@chakra-ui/react";
import Slider, { CustomArrowProps } from "react-slick";
import { ImageCarouselWidgetAnswerData } from "../../template_form/types";
import NextImageWithFallback from "../../image_with_fallback";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { MdArrowBackIos, MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useRef, useState } from "react";

type ImageCarouselWidgetUIProps = {
    imageList: ImageCarouselWidgetAnswerData['list']
}

const ImageCarouselWidgetUI = ({ imageList }: ImageCarouselWidgetUIProps) => {
    return (
        <Flex w = '100%' direction={'column'} gap = '20px'>
            <Box w = '100%' borderRadius={'20px'}>
                <Slider
                    className="single-carousel"
                    infinite
                    autoplay
                    slidesToShow={1}
                    slidesToScroll={1}
                    dots = {false}
                    nextArrow = {<NextArrow />}
                    prevArrow = {<PrevArrow />}
                >
                    {
                        imageList.map((image, index) => {
                            const imageSrc = image.path.startsWith('http') ? image.path : `https://storage.googleapis.com/${image.path}`;
                            return <Flex key = {image.path} position={'relative'} flexShrink={0} w = {'100%'} h = {['200px', '200px', '230px', '350px', '350px']} borderRadius={'20px'}>
                                <NextImageWithFallback src = {imageSrc} alt = 'image' fill style = {{ objectFit: 'cover', borderRadius: '20px' }} sizes='(max-width: 991px) 100vw, 49vw' loading='lazy' />
                            </Flex>
                        })
                    }
                </Slider>
            </Box>
        </Flex>
    );
}

export default ImageCarouselWidgetUI;

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