export type DynamicFormElementType = 'TEXT' | 'CHECKBOX' | 'MULTI_CHECKBOX' | 'SELECT'

export type ElementBasicSettings = {
    inputName: string,
    inputPlaceholder: string,
    fontSize: number,
    fontColor: string,
    align: 'LEFT' | 'RIGHT' | 'CENTER'
}

export type DynamicFormElement = {
    id: string,
    type: DynamicFormElementType,
    settings: ElementBasicSettings
}

export type TextElementSettings = ElementBasicSettings;

export type TextElement = DynamicFormElement & {
    settings: ElementBasicSettings
}

export type SelectElementSettings = ElementBasicSettings & {
    values: { id: string, value: string }[]
};

export type SelectElement = DynamicFormElement & {
    settings: SelectElementSettings
}

export type MultiCheckboxElementSettings = ElementBasicSettings & {
    values: { id: string, value: string }[],
    checkboxDirection: 'COLUMN' | 'ROW'
}

export type MultiCheckboxElement = DynamicFormElement & {
    settings: MultiCheckboxElementSettings
}

export type CheckboxElementSettings = ElementBasicSettings

export type CheckboxElement = DynamicFormElement & {
    settings: CheckboxElementSettings
}

export type ElementSettings = (
    TextElementSettings | 
    SelectElementSettings |
    CheckboxElementSettings | 
    MultiCheckboxElementSettings
)

export type DynamicFormTemplate = (
    TextElement |
    SelectElement | 
    MultiCheckboxElement | 
    CheckboxElement
)[]

export type DynamicFormElementAnswerData = {
    id: string,
    inputName: string,
    value: any
}

export type TextElementAnswerData = Omit<DynamicFormElementAnswerData, 'value'> & {
    value: string
}

export type SelectElementAnswerData = TextElementAnswerData

export type MultiCheckboxElementAnswerData = Omit<DynamicFormElementAnswerData, 'value'> & {
    value: string[]
}

export type CheckboxElementAnswerData = Omit<DynamicFormElementAnswerData, 'value'> & {
    value: boolean
}

export type DynamicFormAnswerData = (
    TextElementAnswerData |
    SelectElementAnswerData |
    MultiCheckboxElementAnswerData | 
    CheckboxElementAnswerData
)[]