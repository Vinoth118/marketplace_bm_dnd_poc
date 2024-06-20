import { Alert, AlertIcon, Button, Flex, FormControl, FormErrorMessage, FormLabel, Icon, IconButton, Input, Select, Text } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import DigitInput from "./inputs/digit_input";
import PriceInput from "./inputs/price_input";
import { FaRegTrashCan } from "react-icons/fa6";
import { getNumberFromString } from "../utils/utill_methods";

type ClaimHistoryResponse = {
    steps: any,
    claim_history: {
        claim: {
            label: string
            values: { id: string, value: string }[],
        },
        atleast_one_required_error_message: string,
        field_required_error_message: string,
        aditional_info_title_label: string
        year_of_claim_label: string,
        year_of_claim_help_text: string,
        amount_of_claim_label: string,
        description_label: string,
        description_description: string,
        aggrement_label_1: string,
        aggrement_label_2: string,
        aggrement_label_3: string,
        aggrement_label_4: string,
        add_record: string,
        continue_label: string
    }
}

type AnswerData = {
    claim_history: {
        claim: string;
        records: {
            year: number;
            amount: number;
            description: string;
        }[];
    };
}

const getInitialClaimRecords = (exisitngList: AnswerData['claim_history']['records']): ((AnswerData['claim_history']['records'][1]) & { id: string, error: boolean })[] => {
    return [
        ...exisitngList.map(item => {
            return {
                id: uuidv4(),
                year: item.year,
                amount: item.amount,
                description: item.description,
                error: false
            }
        }),
        {
            id: uuidv4(),
            year: 0,
            amount: 0,
            description: '',
            error: false
        }
    ]
}

const Claim = () => {
    const labelResponse: ClaimHistoryResponse = {
        steps: {
            step_1: {
                label: 'Business Profile',
                is_completed: true,
                icon_path: '/icon.svg'
            },
            step_2: {
                label: 'Risk Location & Sum Assured',
                is_completed: true,
                icon_path: '/icon.svg'
            },
            step_3: {
                label: 'Security Measures',
                is_completed: true,
                icon_path: '/icon.svg',
            },
        },
        claim_history: {
            claim: {
                label: "Claim history",
                values: [
                    { id: "1", value: 'Within 3 years' },
                    { id: "2", value: 'Within 5 years' },
                    { id: "3", value: 'No Claims' }
                ]
            },
            atleast_one_required_error_message: 'Please provide atleast one claim record',
            field_required_error_message: 'Both year and amount of claim is required!',
            aditional_info_title_label: 'Please provide additional information',
            year_of_claim_label: 'Year of Claim',
            year_of_claim_help_text: 'Ex. 2000',
            amount_of_claim_label: 'Amount of Claim',
            description_label: 'Description',
            description_description: 'Describe claim details',
            aggrement_label_1: "aggrement_label_1dd",
            aggrement_label_2: "aggrement_label_2",
            aggrement_label_3: "aggrement_label_3",
            aggrement_label_4: "aggrement_label_4",
            add_record: '+ Add Record',
            continue_label: 'Continue'
        },
        
    }

    const answerData = {
        claim_history: {
            claim: '3',
            records: [
                {
                    year: 2023,
                    amount: 140000,
                    description: 'test description'
                }
            ]
        }
    }

    const [data, setData] = useState({
        claim: answerData.claim_history.claim ?? '3',
        records: getInitialClaimRecords([]),
        oneRecordRequiredError: false
    })

    const onChangeClaim = (event: ChangeEvent<HTMLSelectElement>) => {
        setData(prev => ({ ...prev, claim: event.target.value }));
    }

    const onChangeYearOfClaim = (event: ChangeEvent<HTMLInputElement>, id: string) => {
        let inputValue: null | number = 0;
        if(event.target.value != '') { inputValue = getNumberFromString(event.target.value) ?? 0 }
        inputValue = Math.trunc(inputValue);

        const amountValue = data.records.find(e => e.id == id)?.amount ?? 0;
        const fieldError = inputValue == 0 || amountValue == 0;

        setData(prev => ({ 
            ...prev, 
            records: prev.records.map(record => {
                if(record.id == id) {
                    return {
                        ...record,
                        year: inputValue,
                        error: fieldError
                    }
                }
                return record;
            })
        }))
    }

    const onChangeAmountOfClaim = (event: ChangeEvent<HTMLInputElement>, id: string) => {
        let inputValue: null | number = 0;
        if(event.target.value != '') { inputValue = getNumberFromString(event.target.value) ?? 0 }
        inputValue = Math.trunc(inputValue);

        const yearValue = data.records.find(e => e.id == id)?.year ?? 0;
        const fieldError = inputValue == 0 || yearValue == 0;

        setData(prev => ({ 
            ...prev, 
            records: prev.records.map(record => {
                if(record.id == id) {
                    return {
                        ...record,
                        amount: inputValue,
                        error: fieldError
                    }
                }
                return record;
            })
        }))
    }

    const onChangeDescription = (event: ChangeEvent<HTMLInputElement>, id: string) => {
        setData(prev => ({ 
            ...prev, 
            records: prev.records.map(record => {
                if(record.id == id) {
                    return {
                        ...record,
                        description: event.target.value
                    }
                }
                return record;
            })
        }))
    }

    const onClickAddRecord = () => {
        setData(prev => ({ 
            ...prev, 
            records: [
                ...prev.records, 
                {
                    id: uuidv4(),
                    year: 0,
                    amount: 0,
                    description: '',
                    error: false
                }
            ]
        }))
    }

    const onClickDeleteRecord = (id: string) => {
        setData(prev => ({ 
            ...prev, 
            records: prev.records.filter(e => e.id != id)
        }))
    }

    const isFormInvalid = () => {
        const tempData: typeof data = JSON.parse(JSON.stringify(data));
        tempData.records.forEach(record => {
            record.error = record.amount === 0 || record.year == 0;
        })
        tempData.oneRecordRequiredError = tempData.claim != '3' && tempData.records.length < 1;
        setData(tempData)

        return tempData.oneRecordRequiredError == true || tempData.records.some(e => e.error);
    }

    const onSubmit = () => {
        if(isFormInvalid()) return ;
        const toBeSubmitedData = {
            claim: data.claim,
            records: data.records.map(e => ({ year_of_claim: e.year, amount_of_claim: e.amount, description: e.description }))
        }
        console.log(toBeSubmitedData)
    }

    return (
        <Flex w = '100%' direction={'column'} gap = '10px' bg = 'white' p = '20px' borderRadius={'10px'}>

            <FormControl>
                <Select value={data.claim} onChange={onChangeClaim}>
                    {
                        labelResponse.claim_history.claim.values.map(value => {
                            return <option key = {value.id} value = {value.id}>{value.value}</option>
                        })
                    }
                </Select>
            </FormControl>

            {
                data.oneRecordRequiredError && 
                <Alert status={'error'} borderRadius={'10px'}>
                    <AlertIcon />
                    {labelResponse.claim_history.atleast_one_required_error_message}
                </Alert>
            }

            {
                data.claim != '3' &&
                <>
                    <Flex w = '100%' direction={'column'} gap = {['20px', '20px', '20px', '10px', '10px']}>
                        <Flex display={['none', 'none', 'none', 'flex', 'flex']} flexShrink={0} gap = '10px'>
                            <Text w = {['100%', '100%', '100%', '22%', '22%']} color = 'brand.text' fontSize={'14px'}>Year of Claim</Text>
                            <Text w = {['100%', '100%', '100%', '22%', '22%']} color = 'brand.text' fontSize={'14px'}>Amount of Claim</Text>
                            <Text w = {['100%', '100%', '100%', '28%', '28%']} color = 'brand.text' fontSize={'14px'}>Description</Text>
                        </Flex>
                        {
                            data.records.map((record, index, array) => {
                                return <FormControl key = {record.id} isInvalid = {record.error}>
                                    <Flex w = '100%' direction={['column', 'column', 'column', 'row', 'row']} gap = '10px'>

                                        <FormControl w = {['100%', '100%', '100%', '22%', '22%']} isInvalid = {record.error && record.year == 0}>
                                            <FormLabel display={['block', 'block', 'block', 'none', 'none']}>{labelResponse.claim_history.year_of_claim_label}</FormLabel>
                                            <DigitInput emptyOnZero forceUpdateOnValueChange currentValue={record.year} onChange={e => onChangeYearOfClaim(e, record.id)} inputProps = {{ placeholder: labelResponse.claim_history.year_of_claim_help_text }} />
                                            <FormErrorMessage display={['block', 'block', 'block', 'none', 'none']} ml = '10px'>{labelResponse.claim_history.field_required_error_message}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl  w = {['100%', '100%', '100%', '22%', '22%']} isInvalid = {record.error && record.amount == 0}>
                                            <FormLabel display={['block', 'block', 'block', 'none', 'none']}>{labelResponse.claim_history.amount_of_claim_label}</FormLabel>
                                            <PriceInput currentPrice={record.amount} onChange={e => onChangeAmountOfClaim(e, record.id)} />
                                            <FormErrorMessage ml = '10px' display={['block', 'block', 'block', 'none', 'none']}>{labelResponse.claim_history.field_required_error_message}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl w = {['100%', '100%', '100%', '28%', '28%']}>
                                            <FormLabel display={['block', 'block', 'block', 'none', 'none']}>{labelResponse.claim_history.description_label}</FormLabel>
                                            <Input value={record.description} onChange={e => onChangeDescription(e, record.id)} placeholder = {labelResponse.claim_history.description_description} />
                                        </FormControl>

                                        {
                                            array.length > 1 &&
                                            <IconButton 
                                                w = 'fit-content'
                                                onClick = {e => onClickDeleteRecord(record.id)}
                                                variant = {'outline'}
                                                aria-label = {"delete_info"} 
                                                isRound  size = 'lg'
                                                icon = {<Icon as = {FaRegTrashCan} />}
                                            />
                                        }

                                    </Flex>
                                    <FormErrorMessage ml = '10px' display={['none', 'none', 'none', 'block', 'block']}>{labelResponse.claim_history.field_required_error_message}</FormErrorMessage>
                                </FormControl>
                            })
                        }
                    </Flex>
                    <Button onClick={onClickAddRecord} h = '45px' mt = '20px' width={['100%', '100%', '100%', '130px', '130px']} variant={'outline'} fontSize={'14px'}>+ Add Record</Button>
                </>
            }

            

            <Button onClick = {onSubmit} colorScheme = 'blue'>Submit</Button>

        </Flex>
    );
}

export default Claim;