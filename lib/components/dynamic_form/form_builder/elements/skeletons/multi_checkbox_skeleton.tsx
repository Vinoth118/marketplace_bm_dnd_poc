import { Circle, Flex, Heading, Icon } from "@chakra-ui/react";
import { WidgetProps } from "..";
import { IoCheckbox } from "react-icons/io5";

const MultiCheckboxElementSkeleton = ({ headerElement, borderRadius = '8px' } : WidgetProps) => {
    return (
        <Flex w = '100%' direction={'column'} borderRadius={borderRadius} border = '1px' borderColor={'gray.200'}>
            <Flex borderTopRadius={borderRadius} w = '100%' h = '50px' bg = 'white' alignItems={'center'} justifyContent={'space-between'} pl = '15px'>
                <Heading size = 'sm'>Multi Checkbox</Heading>
                {headerElement}
            </Flex>
            <Flex w = '100%' h = 'fit-content' p = '15px' flexWrap={'wrap'} bg = 'gray.100' minH = '150px' borderBottomRadius={borderRadius} justifyContent={'center'} alignItems={'center'}>
                <Flex h = 'fit-content' p = '15px' w = '100%' direction={'row'} flexWrap={'wrap'} gap = '10px' bg = 'white' borderRadius={'8px'}>
                    <Flex h = 'fit-content' w = '100%' alignItems={'center'} gap = '10px'>
                        <Icon w = '25px' h = '25px' color = 'gray.500' as = {IoCheckbox} />
                        <Flex direction={'column'} gap = '5px'>
                            <Flex bg = 'gray.400' w = '150px' h = '6px' borderRadius={'20px'}></Flex>
                            <Flex bg = 'gray.400' w = '50px' h = '6px' borderRadius={'20px'}></Flex>
                        </Flex>
                    </Flex>
                    <Flex h = 'fit-content' w = 'fit-content' alignItems={'center'} gap = '10px'>
                        <Icon w = '25px' h = '25px' color = 'gray.500' as = {IoCheckbox} />
                        <Flex direction={'column'} gap = '5px'>
                            <Flex bg = 'gray.400' w = '80px' h = '6px' borderRadius={'20px'}></Flex>
                            <Flex bg = 'gray.400' w = '50px' h = '6px' borderRadius={'20px'}></Flex>
                        </Flex>
                    </Flex>
                    <Flex h = 'fit-content' w = 'fit-content' alignItems={'center'} gap = '10px'>
                        <Icon w = '25px' h = '25px' color = 'gray.500' as = {IoCheckbox} />
                        <Flex direction={'column'} gap = '5px'>
                            <Flex bg = 'gray.400' w = '50px' h = '6px' borderRadius={'20px'}></Flex>
                        </Flex>
                    </Flex>
                    <Flex h = 'fit-content' w = '100%' alignItems={'center'} gap = '10px'>
                        <Icon w = '25px' h = '25px' color = 'gray.500' as = {IoCheckbox} />
                        <Flex direction={'column'} gap = '5px'>
                            <Flex bg = 'gray.400' w = '170px' h = '6px' borderRadius={'20px'}></Flex>
                            <Flex bg = 'gray.400' w = '70px' h = '6px' borderRadius={'20px'}></Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            
        </Flex>
    );
}

export default MultiCheckboxElementSkeleton;