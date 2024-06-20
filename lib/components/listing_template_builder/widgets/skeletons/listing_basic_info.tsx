import { Circle, Flex, Heading } from "@chakra-ui/react";
import { WidgetSkeletonProps } from "..";

const ListingBaiscInfoWidgetSkeleton = ({ headerElement, borderRadius = '8px' } : WidgetSkeletonProps) => {
    return (
        <Flex w = '100%' direction={'column'} borderRadius={borderRadius} border = '1px' borderColor={'gray.200'}>
           <Flex borderTopRadius={borderRadius} w = '100%' h = '50px' bg = 'white' alignItems={'center'} justifyContent={'space-between'} pl = '15px'>
                <Heading size = 'sm'>Listing Basics</Heading>
                {headerElement}
            </Flex>
            <Flex w = '100%' h = 'fit-content' p = '15px' bg = 'gray.100' minH = '150px' borderBottomRadius={borderRadius} gap ='10px' justifyContent={'center'} alignItems={'center'}>
                <Flex direction={'column'} gap = '10px'>
                    <Flex bg = 'gray.500' w = '200px' h = '15px' borderRadius={'20px'}></Flex>
                    <Flex bg = 'gray.300' w = '140px' h = '8px' borderRadius={'20px'}></Flex>
                    <Flex gap = '20px'>
                        <Flex bg = 'gray.400' w = '60px' h = '8px' borderRadius={'20px'}></Flex>
                        <Flex bg = 'gray.400' w = '40px' h = '8px' borderRadius={'20px'}></Flex>
                        <Flex bg = 'gray.400' w = '40px' h = '8px' borderRadius={'20px'}></Flex>
                    </Flex>
                    <Flex bg = 'gray.300' w = '100px' h = '14px' borderRadius={'20px'}></Flex>
                </Flex>
            </Flex>
            
        </Flex>
    );
}

export default ListingBaiscInfoWidgetSkeleton;