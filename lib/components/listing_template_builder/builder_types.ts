import { DynamicFormTemplate } from "../dynamic_form/types"

export type WidgetType = (
    'IMAGE_SECTION' | 
    'DETAILS_WITH_ICON_CONTROLLED' | 
    'DETAILS_WITH_ICON' | 
    'FEATURE_WITH_ICON_CONTROLLED' | 
    'FEATURE_WITH_ICON' | 
    'LISTING_BASIC_INFO' | 
    'CONTACT' | 
    'FEATURE_HIGHLIGHTER' | 
    'IMAGE_CAROUSEL' | 
    'LISTING_CAROUSEL' | 
    'EXPANDABLE' | 
    'CUSTOM_CONTENT' | 
    'DYNAMIC_FORM'
)

export type Widget = {
    id: string,
    type: WidgetType,
}

export type TemplateColumn = {
    id: string,
    widgets: Widget[],
}

export type TemplateRow = {
    id: string,
    columns: TemplateColumn[],
}

export type TemplateWidgetData = {
    widgetId: string,
    widgetType: WidgetType,
    customWidgetName: string | null,
    data: any
}

export type DynamicFormWidgetData = Omit<TemplateWidgetData, 'data'> & {
    data: DynamicFormTemplate
}

type IconWidgetBaseData = {
    id: string
    path: string
}

export type DetailsWithIconControlledWidgetData = Omit<TemplateWidgetData, 'data'> & {
    data: (IconWidgetBaseData & {
        heading: string,
    })[]
}

export type FeatureWithIconControlledWidgetData = Omit<TemplateWidgetData, 'data'> & {
    data: (IconWidgetBaseData & {
        feature: string,
    })[]
}

export type Template = {
    name: string,
    data: TemplateRow[],
    widgetData: (
        DynamicFormWidgetData | 
        DetailsWithIconControlledWidgetData | 
        FeatureWithIconControlledWidgetData
    )[],
}

