import { Circle, Flex, Heading, Icon } from "@chakra-ui/react";
import { WidgetProps } from "..";

const TextFieldElementSkeleton = ({ headerElement, borderRadius = '8px' } : WidgetProps) => {
    return (
        <Flex w = '100%' direction={'column'} borderRadius={borderRadius} border = '1px' borderColor={'gray.200'}>
            <Flex borderTopRadius={borderRadius} w = '100%' h = '50px' bg = 'white' alignItems={'center'} justifyContent={'space-between'} pl = '15px'>
                <Heading size = 'sm'>Text Field</Heading>
                {headerElement}
            </Flex>
            <Flex w = '100%' h = 'fit-content' p = '15px' flexWrap={'wrap'} bg = 'gray.100' minH = '150px' borderBottomRadius={borderRadius} justifyContent={'center'} alignItems={'center'}>
                <Flex h = 'fit-content' w = '100%' direction={'column'} gap = '10px'>
                    <Flex bg = 'gray.400' w = '80px' h = '8px' borderRadius={'20px'}></Flex>
                    <Flex h = 'fit-content' p = '10px' w = '100%' bg = 'white' borderRadius={'8px'} alignItems={'center'} gap = '10px' border = '2px' borderColor={'gray.400'}>
                        <Flex bg = 'gray.400' w = '150px' h = '8px' borderRadius={'20px'}></Flex>
                        <Flex bg = 'gray.400' w = '2px' h = '20px' borderRadius={'20px'}></Flex>
                    </Flex>
                </Flex>
            </Flex>
            
        </Flex>
    );
}

export default TextFieldElementSkeleton;