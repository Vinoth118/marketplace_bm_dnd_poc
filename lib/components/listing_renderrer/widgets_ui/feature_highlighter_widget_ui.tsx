"use client"
import { Text, Flex, Heading, Icon, Image, Divider } from "@chakra-ui/react";
import { FeatureHighlighterWidgetAnswerData } from "../../template_form/types";
import NextImageWithFallback from "../../image_with_fallback";
import React from "react";

type FeatureHighlighterWidgetUIProps = {
    list: FeatureHighlighterWidgetAnswerData['list'],
}

const FeatureHighlighterWidgetUI = ({ list }: FeatureHighlighterWidgetUIProps) => {
    return (
        <Flex w = '100%' direction={'column'} gap = {['20px', '20px', '40px', '40px', '40px']}>
            <Flex w = '100%' p = '15px' border = '1px solid #dde5eb' borderRadius={'15px'} direction={['column', 'column', 'row', 'row', 'row']} justifyContent={'center'} alignItems={'center'}>
                {
                    list.map((item, index) => {
                        return <React.Fragment key = {index}>
                            <Flex minH = '100px' w = '100%' direction={['column', 'column', 'row', 'row', 'row']} alignItems={'center'} justifyContent={'center'}>
                                <Flex w = '100%' gap = '10px' direction={'column'} justifyContent={'center'} alignItems={'center'}>
                                    <Heading m = '0px' textAlign={'center'} size = 'sm'>{item.heading}</Heading>
                                    <Text m = '0px' textAlign={'center'}>{item.content}</Text>
                                </Flex>
                            </Flex>
                            {index != list.length - 1 && <Flex bg= '#dde5eb' m = '0px' w = {['90%', '90%', '2px', '2px', '2px']} h = {['1px', '1px', '90%', '90%', '90%']} />}
                        </React.Fragment>
                    })
                }
            </Flex>
        </Flex>
    );
}

export default FeatureHighlighterWidgetUI;
