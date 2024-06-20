import { Circle, Flex, Heading } from "@chakra-ui/react";
import { WidgetSkeletonProps } from "..";

const DetailsWithIconControlledWidgetSkeleton = ({ headerElement, borderRadius = '8px', customWidgetName } : WidgetSkeletonProps) => {
    return (
        <Flex w = '100%' direction={'column'} borderRadius={borderRadius} border = '1px' borderColor={'gray.200'}>
            <Flex borderTopRadius={borderRadius} w = '100%' h = '50px' bg = 'white' alignItems={'center'} justifyContent={'space-between'} pl = '15px'>
                <Heading size = 'sm'>{customWidgetName ?? `Details with Icon (Controlled)`}</Heading>
                {headerElement}
            </Flex>
            <Flex w = '100%' h = 'fit-content' p = '15px' flexWrap={'wrap'} bg = 'gray.100' minH = '150px' maxH = '150px' overflow={'hidden'} borderBottomRadius={borderRadius} gap ='20px' justifyContent={'center'}>
                {
                    Array.from(Array(24).keys()).map((_, index) => {
                        return <Flex key = {index} gap = '10px'>
                            <Circle bg = 'gray.400' size = '20px' />
                            <Flex direction={'column'} gap = '5px'>
                                <Flex bg = 'gray.400' w = '70px' h = '12px' borderRadius={'20px'}></Flex>
                                <Flex bg = 'gray.300' w = '40px' h = '8px' borderRadius={'20px'}></Flex>
                            </Flex>
                        </Flex>
                    })
                }
            </Flex>
            
        </Flex>
    );
}

export default DetailsWithIconControlledWidgetSkeleton;