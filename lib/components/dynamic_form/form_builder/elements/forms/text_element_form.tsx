import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Icon, Input, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Select } from "@chakra-ui/react";
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { MdAddCircleOutline, MdColorLens } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import { TextElement } from "../../../types";
import { getElementDefaultSettings } from "..";
import MyColorPicker from "@/lib/components/color-picker";

type TextElementFormProps = {
    initialData?: TextElement['settings'],
    onSubmit: (data: TextElement['settings']) => void
}

const TextElementForm = forwardRef<{ getFormData: () => TextElement['settings'] | null }, TextElementFormProps>(({ initialData, onSubmit }, forwardedRef) => {
    const [data, setData] = useState<TextElement['settings']>({ ...getElementDefaultSettings('TEXT'), ...initialData });

    useEffect(() => setData({ ...getElementDefaultSettings('TEXT'), ...initialData }), [initialData])

    const onChangeColor = (color: string) => setData(prev => ({ ...prev, fontColor: color }))

    const onChangeInput = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, input: 'inputName' | 'inputPlaceholder' | 'fontSize' | 'align' | 'customId') => {
        setData(prev => ({ ...prev, [input]: event.target.value }))
    }

    const onClickSubmit = () => {
        onSubmit(data);
        return data;
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
        </Flex>
    );
})

export default TextElementForm;