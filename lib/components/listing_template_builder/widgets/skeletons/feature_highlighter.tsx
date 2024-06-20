import { Circle, Flex, Heading } from "@chakra-ui/react";
import { WidgetSkeletonProps } from "..";

const FeatureHighlighterWidgetSkeleton = ({ headerElement, borderRadius = '8px', customWidgetName } : WidgetSkeletonProps) => {
    return (
        <Flex w = '100%' direction={'column'} borderRadius={borderRadius} border = '1px' borderColor={'gray.200'}>
            <Flex borderTopRadius={borderRadius} w = '100%' h = '50px' bg = 'white' alignItems={'center'} justifyContent={'space-between'} pl = '15px'>
                <Heading size = 'sm'>{customWidgetName ?? `Feature Highlighter`}</Heading>
                {headerElement}
            </Flex>
            <Flex w = '100%' h = 'fit-content' p = '15px' bg = 'gray.100' minH = '150px' borderBottomRadius={borderRadius} gap ='10px' justifyContent={'center'} alignItems={'center'}>
                <Flex w = '100%' direction={'column'} gap = '5px' alignItems={'center'}>
                    <Flex bg = 'gray.400' w = '70px' h = '12px' borderRadius={'20px'}></Flex>
                    <Flex bg = 'gray.300' w = '40px' h = '8px' borderRadius={'20px'}></Flex>
                </Flex>
                <Flex h = '60px' w = '4px' bg = 'gray.300' borderRadius={'20px'}></Flex>
                <Flex w = '100%' direction={'column'} gap = '5px' alignItems={'center'}>
                    <Flex bg = 'gray.400' w = '70px' h = '12px' borderRadius={'20px'}></Flex>
                    <Flex bg = 'gray.300' w = '40px' h = '8px' borderRadius={'20px'}></Flex>
                </Flex>
                <Flex h = '60px' w = '4px' bg = 'gray.300' borderRadius={'20px'}></Flex>
                <Flex w = '100%' direction={'column'} gap = '5px' alignItems={'center'}>
                    <Flex bg = 'gray.400' w = '70px' h = '12px' borderRadius={'20px'}></Flex>
                    <Flex bg = 'gray.300' w = '40px' h = '8px' borderRadius={'20px'}></Flex>
                </Flex>
            </Flex>
            
        </Flex>
    );
}

export default FeatureHighlighterWidgetSkeleton;