"use client"
import { Text, Flex, Heading, Icon, Image } from "@chakra-ui/react";
import { FeatureWithIconWidgetAnswerData } from "../../template_form/types";
import NextImageWithFallback from "../../image_with_fallback";

type FeatureWithIconWidgetUIProps = {
    list: FeatureWithIconWidgetAnswerData['list'],
    title?: string | null
}

const FeatureWithIconWidgetUI = ({ list, title }: FeatureWithIconWidgetUIProps) => {
    const titleText = title != null && title.trim() != '' ? title : null;
    return (
        <Flex w = '100%' direction={'column'} gap = {['20px', '20px', '40px', '40px', '40px']}>
            {titleText && <Heading size = 'lg'>{titleText}</Heading>}
            <Flex w = '100%' p = '15px' border = '1px solid #dde5eb' borderRadius={'15px'} flexWrap={'wrap'} gap = '30px' rowGap={'20px'}>
                {
                    list.map((item, index) => {
                        return <Flex key = {index} w = {['100%', '44%', '45%', '30%', '30%']} p = '10px' gap = '10px' flexGrow={0}>
                            <Flex w = {'25px'} h = {'25px'} flexShrink={0} borderRadius={'6px'}>
                                <Flex position={'relative'} w = '100%' h = '100%' borderRadius={'6px'}>
                                    <NextImageWithFallback src = {item.path.startsWith('http') ? item.path : `https://storage.googleapis.com/${item.path}`} alt = 'image' fill style = {{ objectFit: 'contain' }} sizes='(max-width: 991px) 100vw, 49vw' loading='lazy' />
                                </Flex>
                            </Flex>
                            <Flex w = '100%' direction={'column'} gap = '5px'>
                                <Text>{item.feature}</Text>
                            </Flex>
                        </Flex>
                    })
                }
            </Flex>
        </Flex>
    );
}

export default FeatureWithIconWidgetUI;
