import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Icon, IconButton, Input, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Select } from "@chakra-ui/react";
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { MdAddCircleOutline, MdColorLens } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import { ElementSettings, SelectElement, SelectElementSettings } from "../../../types";
import { getElementDefaultSettings } from "..";
import MyColorPicker from "@/lib/components/color-picker";
import { FaRegTrashCan } from "react-icons/fa6";

const convertToStateData = (settings: SelectElement['settings']) => {
    return {
        ...settings,
        values: settings.values.map(e => ({ ...e, uniqeId: uuidv4() }))
    }
}

type SelectElementFormProps = {
    initialData?: SelectElement['settings'],
    onSubmit: (data: SelectElement['settings']) => void
}

const SelectElementForm = forwardRef<{ getFormData: () => ElementSettings | null }, SelectElementFormProps>(({ initialData, onSubmit }, forwardedRef) => {
    const [data, setData] = useState(convertToStateData({ ...getElementDefaultSettings('SELECT') as SelectElement['settings'], ...initialData }));

    useEffect(() => setData(convertToStateData({ ...getElementDefaultSettings('SELECT') as SelectElement['settings'], ...initialData })), [initialData])

    const onChangeColor = (color: string) => setData(prev => ({ ...prev, fontColor: color }))

    const onChangeInput = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, input: 'inputName' | 'inputPlaceholder' | 'fontSize' | 'align' | 'customId') => {
        setData(prev => ({ ...prev, [input]: event.target.value }))
    }

    const onChangeOption = (event: ChangeEvent<HTMLInputElement>, index: number, input: 'id' | 'value') => {
        setData(prev => ({ ...prev, values: prev.values.map((item, i) => i == index ? ({ ...item, [input]: event.target.value }) : item) }))
    }

    const onAddOption = (index: number) => {
        setData(prev => ({ ...prev, values: [...prev.values.slice(0, index + 1), { uniqeId: uuidv4(), id: '', value: '' }, ...prev.values.slice(index + 1)] }))
    }

    const onDeleteOption = (id: string) => {
        setData(prev => ({ ...prev, values: prev.values.filter(item => item.uniqeId != id) }))
    }

    const onClickSubmit = () => {
        const submitData: SelectElement['settings'] = JSON.parse(JSON.stringify(data))
        submitData.values = data.values.filter(item => item.id.trim() != '' && item.value.trim() != '').map(({ id, value }) => ({ id, value }));
        onSubmit(submitData);
        return submitData;
    }

    useImperativeHandle(forwardedRef, () => {
        return { getFormData: onClickSubmit };
    }, [data]);

    return (
        <Flex w = '100%' direction={'column'} gap = '10px'>
            <FormControl>
                <FormLabel>Custom identifier</FormLabel>
                <Input value = {data.customId} onChange={(e) => onChangeInput(e, 'customId')} />
                <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl>
                <FormLabel>Input name</FormLabel>
                <Input value = {data.inputName} onChange={(e) => onChangeInput(e, 'inputName')} />
                <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl>
                <FormLabel>Placeholder text</FormLabel>
                <Input value = {data.inputPlaceholder} onChange={(e) => onChangeInput(e, 'inputPlaceholder')} />
                <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl>
                <FormLabel>Font size</FormLabel>
                <Input value = {data.fontSize} onChange={(e) => onChangeInput(e, 'fontSize')} />
                <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl>
                <FormLabel>Font size</FormLabel>
                <Popover placement="auto">
                    {(props) => (
                        <>
                            <Flex cursor={"pointer"} alignItems={"center"} borderRadius = "5px" p = "2px">
                                <PopoverTrigger>
                                {
                                    data.fontColor == "" 
                                    ? <Flex
                                    as = "button" 
                                    border = "2px" 
                                    borderStyle = {"dashed"}
                                    borderColor = "brand.borderColor" 
                                    w = "70px"
                                    h = "70px"
                                    borderRadius = {"10px"}
                                    alignItems={"center"}
                                    justifyContent = {"center"}
                                    >
                                    <Icon color = {"gray"} w = "80%" h = "80%" as = {MdColorLens}/>
                                    </Flex>
                                    : <Flex
                                    as = "button" 
                                    w = "70px" 
                                    h = "70px" 
                                    border = "1px" 
                                    borderRadius = "10px"
                                    borderColor = "brand.borderColor" 
                                    bg = {data.fontColor}
                                    />
                                }
                                </PopoverTrigger>
                            </Flex>
                            <PopoverContent margin = "10px" p = "0px" w = {225}>
                                <PopoverArrow />                             
                                <PopoverBody display = "flex" px = '10px' flexDirection={"column"} alignItems={"center"}>
                                    {
                                        props.isOpen &&
                                        <MyColorPicker 
                                            height = {100} 
                                            currentColor = {data.fontColor} 
                                            onSubmit = {color => onChangeColor(color)} 
                                            onClose = {props.onClose} 
                                        />
                                    }
                                </PopoverBody>
                            </PopoverContent>
                        </>
                    )}
                </Popover>
                <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl>
                <FormLabel>Align</FormLabel>
                <Select value = {data.align} onChange={(e) => onChangeInput(e, 'align')} >
                    <option value = {'LEFT'}>Left</option>
                    <option value = {'CENTER'}>Center</option>
                    <option value = {'RIGHT'}>Right</option>
                </Select>
                <FormErrorMessage></FormErrorMessage>
            </FormControl>
            <FormControl>
                <Flex w = '100%' direction={'column'} gap = '10px'>
                    <Flex w = '100%' gap = '10px'>
                        <FormLabel m = '0px' w = '40%'>Options</FormLabel>
                        <FormLabel m = '0px' w = '40%'>Value</FormLabel>
                    </Flex>
                    {
                        data.values.map((item, index) => {
                            return <Flex key = {item.uniqeId} gap = '10px'>
                                <Input w = '40%' value = {item.value} onChange = {e => onChangeOption(e, index, 'value')} />
                                <Input w = '40%' flexGrow={1} value = {item.id} onChange = {e => onChangeOption(e, index, 'id')} />
                                <IconButton
                                    aria-label="add_item"
                                    w = '35px' h = 'inherit' colorScheme="green"
                                    onClick = {e => onAddOption(index)}
                                    icon={<Icon w = '20px' h = '20px' as = {MdAddCircleOutline} />}
                                />
                                {
                                    data.values.length > 1 &&
                                    <IconButton
                                        aria-label="delete_item"
                                        w = '35px' h = 'inherit' colorScheme="red"
                                        onClick = {e => onDeleteOption(item.uniqeId)}
                                        icon={<Icon w = '18px' h = '18px' as = {FaRegTrashCan} />}
                                    />
                                }
                            </Flex>
                        })
                    }
                </Flex>
                <FormErrorMessage></FormErrorMessage>
            </FormControl>
        </Flex>
    );
})

export default SelectElementForm;