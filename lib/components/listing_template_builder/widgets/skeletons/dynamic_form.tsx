import { Circle, Flex, Heading, Icon } from "@chakra-ui/react";
import { WidgetSkeletonProps } from "..";
import { IoCheckbox } from "react-icons/io5";

const DynamicFormWidgetSkeleton = ({ headerElement, borderRadius = '8px', customWidgetName } : WidgetSkeletonProps) => {
    return (
        <Flex w = '100%' direction={'column'} borderRadius={borderRadius} border = '1px' borderColor={'gray.200'}>
           <Flex borderTopRadius={borderRadius} w = '100%' h = '50px' bg = 'white' alignItems={'center'} justifyContent={'space-between'} pl = '15px'>
                <Heading size = 'sm'>{customWidgetName ?? `Dynamic Form`}</Heading>
                {headerElement}
            </Flex>
            <Flex w = '100%' h = 'fit-content' p = '10px' bg = 'gray.100' minH = '150px' borderBottomRadius={borderRadius} gap ='10px' justifyContent={'center'} alignItems={'center'}>
                <Flex direction={'column'} gap = '10px' border = '1px' borderStyle={'dashed'} borderColor={'gray.500'} p = '15px' borderRadius={'5px'}>
                    <Flex bg = 'gray.400' w = '60px' h = '8px' borderRadius={'20px'}></Flex>
                    <Flex bg = 'white' w = '200px' h = '30px' border = '1px' borderColor={'gray.500'} borderRadius={'6px'}></Flex>
                    <Flex h = 'fit-content' w = '100%' alignItems={'center'} gap = '10px'>
                        <Icon w = '35px' h = '35px' color = 'gray.500' as = {IoCheckbox} />
                        <Flex direction={'column'} gap = '5px'>
                            <Flex bg = 'gray.400' w = '150px' h = '10px' borderRadius={'20px'}></Flex>
                            <Flex bg = 'gray.400' w = '50px' h = '10px' borderRadius={'20px'}></Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            
        </Flex>
    );
}

export default DynamicFormWidgetSkeleton;