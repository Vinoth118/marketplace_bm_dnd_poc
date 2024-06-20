import { Circle, Flex, Heading, Icon } from "@chakra-ui/react";
import { WidgetSkeletonProps } from "..";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { FaCode } from "react-icons/fa6";

const CustomContentWidgetSkeleton = ({ headerElement, borderRadius = '8px' } : WidgetSkeletonProps) => {
    return (
        <Flex w = '100%' direction={'column'} borderRadius={borderRadius} border = '1px' borderColor={'gray.200'}>
            <Flex borderTopRadius={borderRadius} w = '100%' h = '50px' bg = 'white' alignItems={'center'} justifyContent={'space-between'} pl = '15px'>
                <Heading size = 'sm'>Custom Content</Heading>
                {headerElement}
            </Flex>
            <Flex w = '100%' h = 'fit-content' p = '15px' flexWrap={'wrap'} bg = 'gray.100' minH = '150px' maxH = '150px' overflow={'hidden'} borderBottomRadius={borderRadius} gap ='20px' justifyContent={'center'} alignItems={'center'}>
                <Icon w = '120px' h = '120px' color = 'gray.400' as = {FaCode} />
            </Flex>
            
        </Flex>
    );
}

export default CustomContentWidgetSkeleton;