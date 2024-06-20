import { Circle, Flex, Heading, Icon } from "@chakra-ui/react";
import { WidgetProps } from "..";
import { IoCheckbox } from "react-icons/io5";

const CheckboxElementSkeleton = ({ headerElement, borderRadius = '8px' } : WidgetProps) => {
    return (
        <Flex w = '100%' direction={'column'} borderRadius={borderRadius} border = '1px' borderColor={'gray.200'}>
            <Flex borderTopRadius={borderRadius} w = '100%' h = '50px' bg = 'white' alignItems={'center'} justifyContent={'space-between'} pl = '15px'>
                <Heading size = 'sm'>Checkbox</Heading>
                {headerElement}
            </Flex>
            <Flex w = '100%' h = 'fit-content' p = '15px' flexWrap={'wrap'} bg = 'gray.100' minH = '150px' borderBottomRadius={borderRadius} justifyContent={'center'} alignItems={'center'}>
                <Flex h = 'fit-content' p = '15px' w = '100%' direction={'column'} gap = '10px' bg = 'white' borderRadius={'8px'}>
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

export default CheckboxElementSkeleton;