import { CheckboxElement, DynamicFormElementType, DynamicFormTemplate, ElementBasicSettings, ElementSettings, MultiCheckboxElement, SelectElement, SelectElementSettings, TextElement } from "../../types";
import TextFieldElementSkeleton from "./skeletons/text_skeleton";
import SelectFieldElementSkeleton from "./skeletons/select_skeleton";
import CheckboxElementSkeleton from "./skeletons/checkbox_skeleton";
import MultiCheckboxElementSkeleton from "./skeletons/multi_checkbox_skeleton";
import { v4 as uuidv4 } from 'uuid';
import { Checkbox, Flex, FormControl, FormLabel, Input, Select } from "@chakra-ui/react";
import TextElementForm from "./forms/text_element_form";
import { RefObject } from "react";
import SelectElementForm from "./forms/select_element_form";

export type WidgetProps = {
    headerElement?: JSX.Element,
    borderRadius?: string | string[]
}

const ElementSkeleton = ({ element, borderRadius = '8px', headerElement }: { element: DynamicFormElementType, borderRadius?: string | string[], headerElement?: JSX.Element }) => {
    switch(element) {
        case 'TEXT': return <TextFieldElementSkeleton headerElement = {headerElement} borderRadius = {borderRadius} />
        case 'SELECT': return <SelectFieldElementSkeleton headerElement = {headerElement} borderRadius = {borderRadius} />
        case 'CHECKBOX': return <CheckboxElementSkeleton headerElement = {headerElement} borderRadius = {borderRadius} />
        case 'MULTI_CHECKBOX': return <MultiCheckboxElementSkeleton headerElement = {headerElement} borderRadius = {borderRadius} />
    }
}

const DynamicFormBuilderElement = ({ element }: { element: DynamicFormTemplate[1] }) => {
    switch(element.type) {
        case 'TEXT': {
            return <FormControl>
                <FormLabel>{element.settings.inputName}</FormLabel>
                <Input placeholder={element.settings.inputPlaceholder} />
            </FormControl>
        }
        case 'SELECT': {
            return <FormControl>
                <FormLabel>{element.settings.inputName}</FormLabel>
                <Select placeholder={element.settings.inputPlaceholder}>
                    {(element as SelectElement).settings.values.map(item => {
                        return <option key = {item.id} value = {item.id}>{item.value}</option>
                    })}
                </Select>
            </FormControl>
        }
        case 'CHECKBOX': {
            return <FormControl>
                <Checkbox defaultChecked>{element.settings.inputName}</Checkbox>
            </FormControl>
        }
        case 'MULTI_CHECKBOX': {
            return <Flex w = '100%' gap = '10px' flexWrap={'wrap'}>
                <FormLabel m = '0px'>{element.settings.inputName}</FormLabel>
                {(element as MultiCheckboxElement).settings.values.map((item, index) => {
                    return <Checkbox w = {(element as MultiCheckboxElement).settings.checkboxDirection == 'COLUMN' ? '100%' : 'fit-content'} key = {item.id} defaultChecked = {index % 2 == 1}>{item.value}</Checkbox>
                })}
            </Flex>
        }
    }
}


const DynamicFormBuilderElementSettingsForm = ({ element, forwardedRef }: { element: DynamicFormTemplate[1] | null, forwardedRef:  RefObject<{ getFormData: () => ElementSettings | null }>  }) => {
    if(element == null) return <></>
    switch(element.type) {
        case 'CHECKBOX':
        case 'TEXT': {
            return <TextElementForm initialData={element.settings} onSubmit={e => {}} ref = {forwardedRef} /> 
        }
        case 'MULTI_CHECKBOX':
        case 'SELECT': {
            return <SelectElementForm initialData={element.settings as SelectElementSettings} onSubmit={e => {}} ref = {forwardedRef} /> 
        }
    }
}

export {
    ElementSkeleton,
    DynamicFormBuilderElement,
    DynamicFormBuilderElementSettingsForm
}

export const getElementDefaultSettings = (element: DynamicFormElementType): DynamicFormTemplate[1]['settings'] => {
    const defaultSettings: ElementBasicSettings = {
        inputName: 'Input name',
        inputPlaceholder: 'Input placeholder',
        fontSize: 14,
        fontColor: 'black',
        align: 'LEFT'
    }
    switch(element) {
        case 'TEXT': return JSON.parse(JSON.stringify(defaultSettings)) as TextElement['settings'];
        case 'SELECT': return { ...defaultSettings, values: [{ id: 'Sample value 1', value: 'Sample value 1' }, { id: 'Sample value 2', value: 'Sample value 2' }, { id: 'Sample value 3', value: 'Sample value 3' }] } as SelectElement['settings'];
        case 'MULTI_CHECKBOX': return { ...defaultSettings, checkboxDirection: 'COLUMN', values: [{ id: 'Sample value 1', value: 'Sample value 1' }, { id: 'Sample value 2', value: 'Sample value 2' }, { id: 'Sample value 3', value: 'Sample value 3' }] } as MultiCheckboxElement['settings'];
        case 'CHECKBOX': return JSON.parse(JSON.stringify(defaultSettings)) as CheckboxElement['settings'];
        default: return JSON.parse(JSON.stringify(defaultSettings));
    }
}

export { 
    TextFieldElementSkeleton,
    SelectFieldElementSkeleton,
    CheckboxElementSkeleton,
    MultiCheckboxElementSkeleton
};