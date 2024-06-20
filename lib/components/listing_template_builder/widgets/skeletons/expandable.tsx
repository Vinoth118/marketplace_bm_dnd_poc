import { Circle, Flex, Heading, Icon } from "@chakra-ui/react";
import { WidgetSkeletonProps } from "..";
import { MdArrowCircleUp, MdArrowForwardIos } from "react-icons/md";

const ExpandableWidgetSkeleton = ({ headerElement, borderRadius = '8px' } : WidgetSkeletonProps) => {
    return (
        <Flex w = '100%' direction={'column'} borderRadius={borderRadius} border = '1px' borderColor={'gray.200'}>
            <Flex borderTopRadius={borderRadius} w = '100%' h = '50px' bg = 'white' alignItems={'center'} justifyContent={'space-between'} pl = '15px'>
                <Heading size = 'sm'>Expandable</Heading>
                {headerElement}
            </Flex>
            <Flex w = '100%' h = 'fit-content' p = '15px' flexWrap={'wrap'} bg = 'gray.100' minH = '150px' borderBottomRadius={borderRadius} justifyContent={'center'}>
                <Flex w = '100%' direction={'column'}  bg = 'white' borderRadius={'8px'} justifyContent={'center'}>
                    <Flex direction={'column'} px = '10px' w = '100%' borderBottom={'1px'} borderColor={'gray.400'} pb = '10px' gap = '10px'>
                        <Flex w = '100%' py = '5px' justifyContent={'space-between'} alignItems={'center'}>
                            <Flex bg = 'gray.400' w = '150px' h = '8px' borderRadius={'20px'}></Flex>
                            <Icon w = '15px' h = '15px' color = 'gray.500' transform={'rotate(270deg)'} as = {MdArrowForwardIos} />
                        </Flex>
                        <Flex bg = 'gray.300' w = '100%' h = '8px' borderRadius={'20px'}></Flex>
                        <Flex bg = 'gray.300' w = '120px' h = '8px' borderRadius={'20px'}></Flex>
                    </Flex>
                    <Flex w= '100%' px = '10px' pt = '10px' justifyContent={'space-between'} alignItems={'center'}>
                        <Flex bg = 'gray.400' w = '200px' h = '8px' borderRadius={'20px'}></Flex>
                        <Icon w = '15px' h = '15px' color = 'gray.500' transform={'rotate(90deg)'} as = {MdArrowForwardIos} />
                    </Flex>
                </Flex>
            </Flex>
            
        </Flex>
    );
}

export default ExpandableWidgetSkeleton;