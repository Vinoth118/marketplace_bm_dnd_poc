import { Image, Flex, Heading, Icon } from "@chakra-ui/react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { WidgetSkeletonProps } from "..";

const ImageCarouselWidgetSkeleton = ({ headerElement, borderRadius = '8px' } : WidgetSkeletonProps) => {
    return (
        <Flex w = '100%' h = 'inherit' direction={'column'} borderRadius={borderRadius} border = '1px' borderColor={'gray.200'}>
            <Flex borderTopRadius={borderRadius} w = '100%' h = '50px' bg = 'white' alignItems={'center'} justifyContent={'space-between'} pl = '15px'>
                <Heading size = 'sm'>Image Carousel</Heading>
                {headerElement}
            </Flex>
            <Flex w = '100%' position={'relative'} p = '15px' bg = 'gray.100' h = '150px' borderBottomRadius={borderRadius} gap ='10px' justifyContent={'center'} alignItems={'center'}>
                <Icon position={'absolute'} left = '30px' w = '25px' h = '25px' color = 'gray.400' as = {MdArrowBackIosNew} />
                <Flex w = '100%' borderRadius={'4px'} bg = 'white' h = '100%'>
                    <Image w = '100%' h = '100%' borderRadius={'4px'} objectFit={'contain'} src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" />
                </Flex>
                <Icon position={'absolute'} right = '20px' w = '25px' h = '25px' color = 'gray.400' as = {MdArrowForwardIos} />
            </Flex>
            
        </Flex>
    );
}

export default ImageCarouselWidgetSkeleton;