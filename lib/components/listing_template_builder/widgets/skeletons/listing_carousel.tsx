import { Image, Flex, Heading, Icon } from "@chakra-ui/react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { WidgetSkeletonProps } from "..";

const ListingCarouselWidgetSkeleton = ({ headerElement, borderRadius = '8px' } : WidgetSkeletonProps) => {
    return (
        <Flex w = '100%' h = 'inherit' direction={'column'} borderRadius={borderRadius} border = '1px' borderColor={'gray.200'}>
            <Flex borderTopRadius={borderRadius} w = '100%' h = '50px' bg = 'white' alignItems={'center'} justifyContent={'space-between'} pl = '15px'>
                <Heading size = 'sm'>Listing Carousel</Heading>
                {headerElement}
            </Flex>
            <Flex w = '100%' position={'relative'} p = '15px' bg = 'gray.100' h = '150px' borderBottomRadius={borderRadius} gap ='20px' justifyContent={'center'} alignItems={'center'}>
                <Icon w = '25px' h = '25px' color = 'gray.400' as = {MdArrowBackIosNew} />
                <Flex w = '90px' flexShrink={0} borderRadius={'4px'} bg = 'white' h = '100%' direction={'column'}>
                    <Image w = '100%' h = '100%' borderRadius={'4px'} objectFit={'contain'} src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" />
                    <Flex h = '50%' direction={'column'} gap = '5px' p = '8px'>
                        <Flex bg = 'gray.400' w = '70px' h = '6px' borderRadius={'20px'}></Flex>
                        <Flex bg = 'gray.300' w = '40px' h = '5px' borderRadius={'20px'}></Flex>
                        <Flex bg = 'gray.300' w = '20px' h = '3px' borderRadius={'20px'}></Flex>
                    </Flex>
                </Flex>
                <Flex w = '90px' flexShrink={0} borderRadius={'4px'} bg = 'white' h = '100%' direction={'column'}>
                    <Image w = '100%' h = '100%' borderRadius={'4px'} objectFit={'contain'} src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" />
                    <Flex h = '50%' direction={'column'} gap = '5px' p = '8px'>
                        <Flex bg = 'gray.400' w = '70px' h = '6px' borderRadius={'20px'}></Flex>
                        <Flex bg = 'gray.300' w = '40px' h = '5px' borderRadius={'20px'}></Flex>
                        <Flex bg = 'gray.300' w = '20px' h = '3px' borderRadius={'20px'}></Flex>
                    </Flex>
                </Flex>
                <Icon w = '25px' h = '25px' color = 'gray.400' as = {MdArrowForwardIos} />
            </Flex>
            
        </Flex>
    );
}

export default ListingCarouselWidgetSkeleton;