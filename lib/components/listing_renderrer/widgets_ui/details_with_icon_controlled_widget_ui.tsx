"use client"
import { Box, Text, Flex, Heading, Icon, Image } from "@chakra-ui/react";
import Slider, { CustomArrowProps } from "react-slick";
import { DetailsWithIconControlledWidgetAnswerData, DetailsWithIconWidgetAnswerData } from "../../template_form/types";
import NextImageWithFallback from "../../image_with_fallback";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

type DetailsWithIconControlledWidgetUIProps = {
    list: DetailsWithIconWidgetAnswerData['list'],
    title?: string | null
}

const DetailsWithIconControlledWidgetUI = ({ list, title }: DetailsWithIconControlledWidgetUIProps) => {
    const titleText = title != null && title.trim() != '' ? title : null;
    return (
        <Flex w = '100%' direction={'column'} gap = {['20px', '20px', '40px', '40px', '40px']}>
            {titleText && <Heading size = 'lg'>{titleText}</Heading>}
            <Flex w = '100%' p = '15px' border = '1px solid #dde5eb' borderRadius={'15px'} flexWrap={'wrap'} gap = '30px' rowGap={'35px'}>
                {
                    list.map((item, index) => {
                        return <Flex key = {index} w = {['44%', '44%', '45%', '30%', '30%']} p = '10px' gap = '10px' flexGrow={1}>
                            <Flex w = {'30px'} h = {'30px'} flexShrink={0} borderRadius={'6px'}>
                                <Flex position={'relative'} w = '100%' h = '100%' borderRadius={'6px'}>
                                    <NextImageWithFallback src = {item.path.startsWith('http') ? item.path : `https://storage.googleapis.com/${item.path}`} alt = 'image' fill style = {{ objectFit: 'contain' }} sizes='(max-width: 991px) 100vw, 49vw' loading='lazy' />
                                </Flex>
                            </Flex>
                            <Flex w = '100%' direction={'column'} gap = '5px'>
                                <Text m = '0px' p = '0px'>{item.heading}</Text>
                                <Text m = '0px' p = '0px' fontWeight={'bold'}>{item.content}</Text>
                            </Flex>
                        </Flex>
                    })
                }
            </Flex>
        </Flex>
    );
}

export default DetailsWithIconControlledWidgetUI;
