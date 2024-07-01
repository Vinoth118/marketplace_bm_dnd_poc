"use client"
import { Text, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Flex, Heading } from "@chakra-ui/react";
import Image from "next/image";
import { ExpandableWidgetAnswerData } from "../../template_form/types";

interface ExpandableWidgetUIProps {
    list: ExpandableWidgetAnswerData['list'],
    title?: string | null
} 

const ExpandableWidgetUI = ({ list, title }: ExpandableWidgetUIProps) => {
    return (
        <Accordion allowToggle display={'flex'} flexDir={'column'} gap = '30px' w = "100%">
            {
                list.map(item => {
                    return <AccordionItem key = {item.outer} py = "20px" border = "1px" borderColor={'brand.borderColor'} borderRadius={"10px"} transition={'box-shadow 300ms ease-in-out'} boxShadow={'0 1px 2px rgba(46, 50, 60, .09)'} _hover={{ boxShadow: '0 3px 9px rgba(46, 50, 60, .09)' }}> 
                        {(props) => 
                            <>
                                <AccordionButton px = {['20px', '20px', '20px', '32px', '32px']} gap = {['20px', '20px', '20px', '30px', '30px']} border = "0px" borderRadius={"8px"} _hover={{}}  display={"flex"} justifyContent={"space-between"} _focus = {{ boxShadow: "none", outline: 'none' }} _focusVisible={{ boxShadow: 'none' }} _focusWithin={{ boxShadow: 'none' }}>
                                    <Flex gap = {['15px', '15px', '15px', '25px', '25px']} alignItems={'center'}>
                                        <Flex flexShrink={0} position={'relative'} w = {['35px', '35px', '35px', '50px', '50px']} h = {['35px', '35px', '35px', '50px', '50px']}>
                                            <Image src = '/discuss-issue.svg' alt = 'logo' fill style={{ objectFit: 'contain' }} />
                                        </Flex>
                                        <Heading m = '0px' textAlign={'start'} fontSize={'18px'} color = 'black'>{item.outer}</Heading>
                                    </Flex>
                                    <AccordionIcon w = '35px' h = '35px' />
                                </AccordionButton>
                                <AccordionPanel py = '0px' pr = {['20px', '20px', '50px', '50px', '60px']} pl = {['20px', '20px', '70px', '108px', '108px']} borderRadius={"10px"}>
                                    <Flex display={['flex', 'flex', 'none', 'none', 'none']} my = '15px' w = '100%' borderTop = '1px' borderColor = 'brand.borderColor'></Flex>
                                    {item.inner}
                                </AccordionPanel>
                            </>
                        }
                    </AccordionItem>
                })
            }
        </Accordion>
    );
}

export default ExpandableWidgetUI;