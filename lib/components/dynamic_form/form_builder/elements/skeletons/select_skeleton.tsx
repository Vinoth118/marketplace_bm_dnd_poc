import { Circle, Flex, Heading, Icon } from "@chakra-ui/react";
import { WidgetProps } from "..";
import { MdArrowCircleUp, MdArrowForwardIos } from "react-icons/md";
import { LiaHandPointerSolid } from "react-icons/lia";

const SelectFieldElementSkeleton = ({ headerElement, borderRadius = '8px' } : WidgetProps) => {
    return (
        <Flex w = '100%' direction={'column'} borderRadius={borderRadius} border = '1px' borderColor={'gray.200'}>
            <Flex borderTopRadius={borderRadius} w = '100%' h = '50px' bg = 'white' alignItems={'center'} justifyContent={'space-between'} pl = '15px'>
                <Heading size = 'sm'>Select Field</Heading>
                {headerElement}
            </Flex>
            <Flex w = '100%' h = 'fit-content' px = '15px' flexWrap={'wrap'} bg = 'gray.100' minH = '150px' borderBottomRadius={borderRadius} justifyContent={'center'} alignItems={'center'}>
                <Flex h = 'fit-content' w = '100%' direction={'column'} gap = '10px'>
                    <Flex h = 'fit-content' p = '8px' w = '100%' bg = 'white' borderRadius={'8px'} alignItems={'center'} gap = '10px' border = '2px' borderColor={'gray.400'} justifyContent={'space-between'}>
                        <Flex bg = 'gray.400' w = '150px' h = '8px' borderRadius={'20px'}></Flex>
                        <Icon w = '15px' h = '15px' color = 'gray.500' transform={'rotate(90deg)'} as = {MdArrowForwardIos} />
                    </Flex>
                    <Flex position={'relative'} w = '100%' direction={'column'} borderRadius={'8px'} minH = '50px' bg = 'white'>
                        <Flex flexShrink={0} p = '12px'>
                            <Flex bg = 'gray.400' w = '50px' h = '5px' borderRadius={'20px'}></Flex>
                        </Flex>
                        <Flex flexShrink={0} p = '12px' bg = 'green.100'>
                            <Flex bg = 'green.400' w = '150px' h = '5px' borderRadius={'20px'}></Flex>
                        </Flex>
                        <Flex flexShrink={0} p = '12px'>
                            <Flex bg = 'gray.400' w = '80px' h = '5px' borderRadius={'20px'}></Flex>
                        </Flex>
                        <Icon position={'absolute'} top = '40%' right = '15px' w = '18px' h = '18px' color = 'gray.500' as = {LiaHandPointerSolid} />
                    </Flex>
                </Flex>
            </Flex>
            
        </Flex>
    );
}

export default SelectFieldElementSkeleton;