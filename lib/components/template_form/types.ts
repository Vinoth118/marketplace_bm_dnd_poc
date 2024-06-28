import { DynamicFormAnswerData } from "../dynamic_form/types"

export type ImageSectionWidgetAnswerData = {
    list: { path: string }[]
}

export type ImageCarouselWidgetAnswerData = {
    list: (ImageSectionWidgetAnswerData['list'][1] & {
        navigateTo: string
    })[]
}

export type ExpandableWidgetAnswerData = {
    list: {
        outer: string,
        inner: string
    }[]
}

export type FeatureHighlighterWidgetAnswerData = {
    list: {
        heading: string,
        content: string
    }[]
}

export type FeatureWithIconWidgetAnswerData = {
    list: {
        path: string,
        feature: string
    }[]
}

export type FeatureWithIconControlledWidgetAnswerData = {
    answers: string[]
}

export type DetailsWithIconWidgetAnswerData = {
    list: (FeatureHighlighterWidgetAnswerData['list'][1] & {
        path: string,
    })[]
}

export type DetailsWithIconControlledWidgetAnswerData = {
    answers: { id: string, content: string }[]
}

export type ListingBasicInfoWidgetAnswerData = {
    name: string,
    price?: string | number,
    strikeThroughPrice?: string |  number,
    aditional_info: string[]
}

export type ListingCarouselWidgetAnswerData = {
    list: {
        thumbnailPath: string,
        name: string,
        price?: string | number,
        strikeThroughPrice?: string |  number,
        navigateTo: string
    }[]
}

export type CustomContentWidgetAnswerData = {
    content: any
}

export type DynamicFormWidgetAnswerData = {
    answers: DynamicFormAnswerData
}

export type WidgetAnswer = {
    id: string,
    data: ImageSectionWidgetAnswerData | 
        ImageCarouselWidgetAnswerData |
        ExpandableWidgetAnswerData |
        FeatureHighlighterWidgetAnswerData |
        FeatureWithIconWidgetAnswerData |
        FeatureWithIconControlledWidgetAnswerData |
        DetailsWithIconWidgetAnswerData |
        DetailsWithIconControlledWidgetAnswerData |
        ListingBasicInfoWidgetAnswerData |
        ListingCarouselWidgetAnswerData |
        CustomContentWidgetAnswerData | 
        DynamicFormWidgetAnswerData;
}

export type TemplateAnswer = WidgetAnswer[]