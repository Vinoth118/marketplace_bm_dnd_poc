import { Flex, Heading, Image } from "@chakra-ui/react";
import { WidgetSkeletonProps } from "..";

const ImageSectionWidgetSkeleton = ({ headerElement, borderRadius = '8px' } : WidgetSkeletonProps) => {
    return (
        <Flex w = '100%' h = 'inherit' direction={'column'} borderRadius={borderRadius} border = '1px' borderColor={'gray.200'}>
            <Flex borderTopRadius={borderRadius} w = '100%' h = '50px' bg = 'white' alignItems={'center'} justifyContent={'space-between'} pl = '15px'>
                <Heading size = 'sm'>Image Section</Heading>
                {headerElement}
            </Flex>
            <Flex w = '100%' p = '15px' bg = 'gray.100' h = '150px' borderBottomRadius={borderRadius} gap ='10px' justifyContent={'center'}>
                <Flex w = '100%' borderRadius={'4px'} bg = 'white' h = '100%'>
                    <Image w = '100%' h = '100%' borderRadius={'4px'} objectFit={'contain'} src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" />
                </Flex>
                <Flex direction={'column'} gap = '10px'>
                    <Flex w = '70px' h = '70px' borderRadius={'4px'} p = '2px' bg = 'white'><Image w = '100%' h = '100%' borderRadius={'4px'} objectFit={'contain'} src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" /></Flex>
                    <Flex w = '70px' h = '70px' borderRadius={'4px'} p = '2px' bg = 'white'><Image w = '100%' h = '100%' borderRadius={'4px'} objectFit={'contain'} src="https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" /></Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default ImageSectionWidgetSkeleton;