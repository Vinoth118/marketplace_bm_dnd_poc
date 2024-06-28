"use client"
import { Text, Flex, Heading, Tag, Icon, Button, Divider, IconButton } from "@chakra-ui/react";
import { DynamicFormWidgetAnswerData } from "../../template_form/types";
import { MdHome, MdLocationOn } from "react-icons/md";
import { FaFileLines } from "react-icons/fa6";
import { IoMdEye, IoMdHeartEmpty } from "react-icons/io";
import { DynamicFormWidgetData } from "../../listing_template_builder/builder_types";
import { CheckboxElementAnswerData, DynamicFormAnswerData, MultiCheckboxElementAnswerData, MultiCheckboxElementSettings, SelectElementSettings, TextElementAnswerData } from "../../dynamic_form/types";

type ListingInformationsWidgetUIProps = {
    answers: DynamicFormWidgetAnswerData['answers'],
    template: DynamicFormWidgetData['data']
}

const ListingInformationsWidgetUI = ({ answers, template }: ListingInformationsWidgetUIProps) => {
    const data = {
        title: '',
        topFeatures: [] as string[],
        isTestDriveAvailable: false,
        parkedLocation: '',
        monthlyPrice: '',
        price: '',
        sellingPrice: '',
        offerPrice: '',
        isZeroDownPaymentAvailable: false,
        bookButtonName: 'BOOK FREE TEST DRIVE'
    };

    const getAnswer = <T extends TextElementAnswerData['value'] | CheckboxElementAnswerData['value'] | MultiCheckboxElementAnswerData['value'],>(elementAnswerData: DynamicFormAnswerData[1]): T => {
        switch(elementAnswerData.elementType) {
            case 'TEXT': {
                return elementAnswerData.value as T;
            }
            case 'SELECT': {
                const settings = template.find(e => e.id == elementAnswerData.id)?.settings as SelectElementSettings;
                const value = settings.values.find(e => e.id == elementAnswerData.value);
                return (value?.value ?? '') as T
            }
            case 'CHECKBOX': {
                return elementAnswerData.value as T;
            }
            case 'MULTI_CHECKBOX': {
                const settings = template.find(e => e.id == elementAnswerData.id)?.settings as MultiCheckboxElementSettings;
                const values = settings.values.filter(e => (elementAnswerData.value as string[]).includes(e.id)).map(e => e.value);
                return (values ?? []) as T
            }
        }
    }

    answers.forEach(answer => {
        switch(answer.customId) {
            case 'product_title': {
                data.title = getAnswer(answer);
                break;
            }
            case 'top_features': {
                data.topFeatures = getAnswer(answer);
                break;
            }
            case 'test_drive': {
                data.isTestDriveAvailable = getAnswer(answer);
                break;
            }
            case 'parked_address': {
                data.parkedLocation = getAnswer(answer);
                break;
            }
            case 'monthly_price': {
                data.monthlyPrice = getAnswer(answer);
                break;
            }
            case 'compare_at_price': {
                data.price = getAnswer(answer);
                break;
            }
            case 'selling_price': {
                data.sellingPrice = getAnswer(answer);
                break;
            }
            case 'offer_price': {
                data.offerPrice = getAnswer(answer);
                break;
            }
            case 'zero_down_payment': {
                data.isZeroDownPaymentAvailable = answer.value == 'YES';
                break;
            }
        }
    })
    
    return (
        <Flex w = '100%' position={'sticky'} top = {0} zIndex={999999} direction={'column'} gap = '30px' py = {['20px', '20px', '20px', '30px', '30px']} px = {['0px', '0px', '0px', '25px', '45px']} borderWidth = {['0px', '0px', '0px', '1px', '1px']} borderColor = '#dde5eb' borderRadius={'15px'}>
            <Flex w = '100%' direction={'column'} gap = '5px'>
                <Heading size = {['md', 'lg', 'lg', 'lg', 'lg']}>{data.title}</Heading>
                <Flex w = '100%' flexWrap={'wrap'} gap = '15px'>
                    {
                        data.topFeatures.map(item => {
                            return <Tag key = {item} size = 'lg' px = '20px' fontSize={'xs'} bg = '#fafafa'>{item}</Tag>
                        })
                    }
                </Flex>
            </Flex>
            <Flex w = '100%' direction={'column'} gap = '15px'>
                {
                    data.isTestDriveAvailable &&
                    <Flex gap = '10px' alignItems={'center'}>
                        <Icon w = '18px' h = '18px' color = '#465166' as = {MdHome} />
                        <Text m = '0px' color = '#465166'>Home Test Drive Available</Text>
                    </Flex>
                }
                <Button variant={'unstyled'} h = 'fit-content' fontWeight={'normal'} _focus={{ outline: 'none', boxShadow: 'none' }} _focusWithin={{ outline: 'none', boxShadow: 'none' }}>
                    <Flex gap = '10px' alignItems={'center'}>
                        <Flex w = '18px' justifyContent={'center'}>
                            <Icon w = '18px' h = '18px' color = '#0c72c6' as = {MdLocationOn} />
                        </Flex>
                        <Text  m = '0px'  color = '#0c72c6'>Parked at: <strong>{data.parkedLocation}</strong></Text>
                    </Flex>
                </Button>
                <Button variant={'unstyled'} h = 'fit-content' fontWeight={'normal'} _focus={{ outline: 'none', boxShadow: 'none' }} _focusWithin={{ outline: 'none', boxShadow: 'none' }}>
                    <Flex gap = '10px' alignItems={'center'}>
                        <Flex w = '18px' justifyContent={'center'}>
                            <Icon w = '14px' h = '14px' color = '#0c72c6' as = {FaFileLines} />
                        </Flex>
                        <Text m = '0px'  color = '#0c72c6'>View <strong>Inspection Report</strong></Text>
                    </Flex>
                </Button>
                <Button variant={'unstyled'} h = 'fit-content' fontWeight={'normal'} _focus={{ outline: 'none', boxShadow: 'none' }} _focusWithin={{ outline: 'none', boxShadow: 'none' }}>
                    <Flex gap = '10px' alignItems={'center'}>
                        <Flex w = '18px' justifyContent={'center'}>
                            <Icon w = '18px' h = '18px' color = '#0c72c6' as = {IoMdEye} />
                        </Flex>
                        <Text m = '0px'  color = '#0c72c6'>View <strong>Service History Report</strong></Text>
                    </Flex>
                </Button>
            </Flex>
            <Divider my = '0px' />
            <Flex w = '100%' gap = '15px' justifyContent={'space-between'}>
                <Flex w = '100%' direction={'column'} gap = '10px' justifyContent={'space-between'}>
                    <Heading size = {['sm', 'md', 'md', 'md', 'md']} color = '#ef6e0b'>₹9,736/month</Heading>
                    {data.isZeroDownPaymentAvailable && <Text m = '0px' mt = '-5px' color = '#465166' fontWeight={['normal', 'bold', 'bold', 'bold', 'bold']} fontSize={['small', 'md', 'md', 'md', 'md']}>On Zero down payment</Text>}
                    <Button variant={'unstyled'} h = 'fit-content' _focus={{ outline: 'none', boxShadow: 'none' }} _focusWithin={{ outline: 'none', boxShadow: 'none' }}>
                        <Flex gap = '10px' alignItems={'center'}>
                            <Text m = '0px' fontSize={['small', 'md', 'md', 'md', 'md']} color = '#0c72c6'>CHECK ELIGIBILITY   →</Text>
                        </Flex>
                    </Button>
                </Flex>
                <Flex w = '100%' direction={'column'} gap = '10px' alignItems={'flex-end'} justifyContent={'space-between'}>
                    <Flex alignItems={'center'} gap = '10px'>
                        <Tag size = {['md', 'lg', 'lg', 'lg', 'lg']} whiteSpace={'nowrap'} color = '#00ba67' fontSize={'sm'} fontWeight={'bold'} bg = 'rgba(0,186,103,.1)' borderRadius={'13px'}>₹{data.offerPrice}k off</Tag>
                        <Heading size = {['sm', 'md', 'md', 'md', 'md']} whiteSpace={'nowrap'} m = '0px'>₹{data.sellingPrice} Lakh</Heading>
                    </Flex>
                    <Text m = '0px' mt = '-5px' color = '#465166' fontWeight={['normal', 'bold', 'bold', 'bold', 'bold']} as = 's'>₹{data.price} Lakh</Text>
                    <Button variant={'unstyled'} h = 'fit-content' _focus={{ outline: 'none', boxShadow: 'none' }} _focusWithin={{ outline: 'none', boxShadow: 'none' }}>
                        <Flex gap = '10px' alignItems={'center'}>
                            <Text m = '0px' fontSize={['small', 'md', 'md', 'md', 'md']} color = '#0c72c6'>CHECK ELIGIBILITY   →</Text>
                        </Flex>
                    </Button>
                </Flex>
            </Flex>
            <Flex w = '100%' gap = '15px'>
                <IconButton 
                    aria-label="favorite"
                    size = 'lg' 
                    bg = '#fafafa'
                    borderRadius={'12px'}
                    icon = {<Icon w = '25px' h = '25px' as = {IoMdHeartEmpty} />}
                    _focus={{ outline: 'none', boxShadow: 'none' }} _focusWithin={{ outline: 'none', boxShadow: 'none' }}
                />
                <Button bg = '#ef6e0b' color = 'white' w = '100%' borderRadius={'12px'} _focus={{ outline: 'none', boxShadow: 'none' }} _focusWithin={{ outline: 'none', boxShadow: 'none' }} _hover={{}}>BOOK FREE TEST DRIVE</Button>
            </Flex>
        </Flex>
    );
}

export default ListingInformationsWidgetUI;
