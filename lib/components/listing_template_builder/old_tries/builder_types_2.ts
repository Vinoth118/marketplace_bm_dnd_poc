export type WidgetType = 'IMAGE_SECTION' | 'DETAILS_WITH_ICON' | 'LISTING_BASIC_INFO' | 'CONTACT' | 'FEATURE_HIGHLIGHTER';

export type Widget = {
    id: string,
    type: WidgetType,
    position: number,
    column_id: string,
    row_id: string,
}

export type TemplateColumn = {
    id: string,
    position: number,
    row_id: string
}

export type TemplateRow = {
    id: string,
    position: number
}

export type Template = {
    name: string,
    rows: TemplateRow[],
    columns: TemplateColumn[],
    widgets: Widget[]
}

export type WidgetAnswer = {
    id: string
    widget_id: number,
    column_id: number,
    row_id: number,
    data: any
}

export type TemplateAnswer = WidgetAnswer[]