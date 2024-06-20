import { Flex, FormControl, FormLabel, Input, Select, Checkbox } from "@chakra-ui/react";
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { CheckboxElementAnswerData, DynamicFormAnswerData, DynamicFormTemplate, MultiCheckboxElement, MultiCheckboxElementAnswerData, SelectElement, SelectElementAnswerData, TextElementAnswerData } from "../types";


type DynamicFormRenderrerProps = {
    template: DynamicFormTemplate,
    initialAnswerData?: DynamicFormAnswerData,
    onSubmit: (data: DynamicFormAnswerData) => void
}

const DynamicFormRenderrer = forwardRef<{ getFormData: () => DynamicFormAnswerData }, DynamicFormRenderrerProps>(({ template, initialAnswerData, onSubmit }, forwardedRef) => {
    const [answerData, setAnswerData] = useState([...(initialAnswerData ?? [])]);

    useEffect(() => setAnswerData([...(initialAnswerData ?? [])]), [template, initialAnswerData]);

    const onChangeInputAndSelectElement = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, elementId: string) => {
        const temp: typeof answerData = JSON.parse(JSON.stringify(answerData));
        const index = temp.findIndex(item => item.id == elementId);
        if(index > -1) {
            temp[index].value = event.target.value;
        } else {
            const templateItem = template.find(e => e.id == elementId)!;
            temp.push({ id: templateItem.id, inputName: templateItem.settings.inputName, value: event.target.value })
        }
        setAnswerData(temp)
    }

    const onChangeCheckboxElement = (event: ChangeEvent<HTMLInputElement>, elementId: string) => {
        const temp: typeof answerData = JSON.parse(JSON.stringify(answerData));
        const index = temp.findIndex(item => item.id == elementId);
        if(index > -1) {
            temp[index].value = event.target.checked;
        } else {
            const templateItem = template.find(e => e.id == elementId)!;
            temp.push({ id: templateItem.id, inputName: templateItem.settings.inputName, value: event.target.checked })
        }
        setAnswerData(temp)
    }

    const onChangeMultiCheckboxElement = (event: ChangeEvent<HTMLInputElement>, elementId: string, valueId: string) => {
        const temp: typeof answerData = JSON.parse(JSON.stringify(answerData));
        const index = temp.findIndex(item => item.id == elementId);
        if(index > -1) {
            temp[index].value = event.target.checked ? [...(temp[index] as MultiCheckboxElementAnswerData).value, valueId] : (temp[index] as MultiCheckboxElementAnswerData).value.filter(e => e != valueId)
        } else {
            const templateItem = template.find(e => e.id == elementId)!;
            temp.push({ id: templateItem.id, inputName: templateItem.settings.inputName, value: event.target.checked ? [valueId] : [] })
        }
        setAnswerData(temp)
    }

    useImperativeHandle(forwardedRef, () => {
        return { getFormData: onClickSubmit };
    }, [answerData]);

    const onClickSubmit = () => {
        onSubmit(answerData);
        return answerData;
    }

    return (
        <Flex w = '100%' direction = 'column'>
            <Flex 
                w = 'fit-content' minW = '100%' h = 'fit-content'
                direction={'column'} gap = '10px'
            >
                {
                    template?.map((element, index) => {
                        let answer: DynamicFormAnswerData[1]['value'] | undefined = answerData.find(e => e.id == element.id)?.value;
                        switch(element.type) {
                            case 'TEXT': {
                                const value = (answer as TextElementAnswerData['value']) ?? ''
                                return <FormControl key = {element.id}>
                                    <FormLabel>{element.settings.inputName}</FormLabel>
                                    <Input value = {value} onChange={e => onChangeInputAndSelectElement(e, element.id)} placeholder={element.settings.inputPlaceholder} />
                                </FormControl>
                            }
                            case 'SELECT': {
                                const value = (answer as SelectElementAnswerData['value']) ?? ''
                                return <FormControl key = {element.id}>
                                    <FormLabel>{element.settings.inputName}</FormLabel>
                                    <Select value = {value} onChange={e => onChangeInputAndSelectElement(e, element.id)} placeholder={element.settings.inputPlaceholder}>
                                        {(element as SelectElement).settings.values.map(item => {
                                            return <option key = {item.id} value = {item.id}>{item.value}</option>
                                        })}
                                    </Select>
                                </FormControl>
                            }
                            case 'CHECKBOX': {
                                const isChecked = (answer as CheckboxElementAnswerData['value']) ?? false
                                return <FormControl key = {element.id}>
                                    <Checkbox isChecked = {isChecked} onChange={e => onChangeCheckboxElement(e, element.id)} defaultChecked>{element.settings.inputName}</Checkbox>
                                </FormControl>
                            }
                            case 'MULTI_CHECKBOX': {
                                const values = (answer as MultiCheckboxElementAnswerData['value']) ?? []
                                return <Flex key = {element.id} w = '100%' gap = '10px' flexWrap={'wrap'}>
                                    <FormLabel m = '0px'>{element.settings.inputName}</FormLabel>
                                    {(element as MultiCheckboxElement).settings.values.map((item, index) => {
                                        const isChecked = values.includes(item.id);
                                        return <Checkbox isChecked = {isChecked} onChange={e => onChangeMultiCheckboxElement(e, element.id, item.id)} w = {(element as MultiCheckboxElement).settings.checkboxDirection == 'COLUMN' ? '100%' : 'fit-content'} key = {item.id}>{item.value}</Checkbox>
                                    })}
                                </Flex>
                            }
                        }
                    })
                }
            </Flex>
        </Flex>
    );
})

export default DynamicFormRenderrer;