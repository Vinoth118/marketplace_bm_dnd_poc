import ImageSectionWidgetSkeleton from "./skeletons/image_section";
import DetailsWithIconWidgetSkeleton from "./skeletons/details_with_icon";
import FeatureWithIconWidgetSkeleton from "./skeletons/feature_with_icon";
import ImageCarouselWidgetSkeleton from "./skeletons/image_carousel";
import ListingCarouselWidgetSkeleton from "./skeletons/listing_carousel";
import FeatureHighlighterWidgetSkeleton from "./skeletons/feature_highlighter";
import ListingBaiscInfoWidgetSkeleton from "./skeletons/listing_basic_info";
import CustomContentWidgetSkeleton from "./skeletons/custom_content_with_editor";
import ExpandableWidgetSkeleton from "./skeletons/expandable";
import DynamicFormWidgetSkeleton from "./skeletons/dynamic_form";
import DynamicFormWidgetDataForm from './forms/dynamic_form_widget_form';
import FeatureWithIconControlledWidgetDataForm from "./forms/feature_with_icon_controlled_widget_form";
import DetailsWithIconControlledWidgetDataForm from "./forms/details_with_icon_controlled_widget_form";
import DetailsWithIconControlledWidgetSkeleton from "./skeletons/details_with_icon_controlled";
import FeatureWithIconControlledWidgetSkeleton from "./skeletons/feature_with_icon_controlled";
import { DetailsWithIconControlledWidgetData, DynamicFormWidgetData, FeatureWithIconControlledWidgetData, Template, Widget } from "../builder_types";
import { RefObject } from "react";

export type WidgetSkeletonProps = {
    headerElement?: JSX.Element,
    customWidgetName?: string | null,
    borderRadius?: string | string[]
}

const WidgetSkeleton = ({ widget, borderRadius = '8px', headerElement, customWidgetName }: WidgetSkeletonProps & { widget: Widget['type'] }) => {
    switch(widget) {
        case 'IMAGE_SECTION': return <ImageSectionWidgetSkeleton headerElement = {headerElement} borderRadius = {borderRadius} />
        case 'DETAILS_WITH_ICON': return <DetailsWithIconWidgetSkeleton headerElement = {headerElement} borderRadius = {borderRadius} customWidgetName = {customWidgetName} />
        case 'DETAILS_WITH_ICON_CONTROLLED': return <DetailsWithIconControlledWidgetSkeleton headerElement = {headerElement} borderRadius = {borderRadius} customWidgetName = {customWidgetName} />
        case 'FEATURE_WITH_ICON': return <FeatureWithIconWidgetSkeleton headerElement = {headerElement} borderRadius = {borderRadius} customWidgetName = {customWidgetName} />
        case 'FEATURE_WITH_ICON_CONTROLLED': return <FeatureWithIconControlledWidgetSkeleton headerElement = {headerElement} borderRadius = {borderRadius} customWidgetName = {customWidgetName} />
        case 'IMAGE_CAROUSEL': return <ImageCarouselWidgetSkeleton headerElement = {headerElement} borderRadius = {borderRadius} />
        case 'LISTING_CAROUSEL': return <ListingCarouselWidgetSkeleton headerElement = {headerElement} borderRadius = {borderRadius} />
        case 'FEATURE_HIGHLIGHTER': return <FeatureHighlighterWidgetSkeleton headerElement = {headerElement} borderRadius = {borderRadius} />
        case 'LISTING_BASIC_INFO': return <ListingBaiscInfoWidgetSkeleton headerElement = {headerElement} borderRadius = {borderRadius} />
        case 'EXPANDABLE': return <ExpandableWidgetSkeleton headerElement = {headerElement} borderRadius = {borderRadius} />
        case 'CUSTOM_CONTENT': return <CustomContentWidgetSkeleton headerElement = {headerElement} borderRadius = {borderRadius} />
        case 'DYNAMIC_FORM': return <DynamicFormWidgetSkeleton headerElement = {headerElement} borderRadius = {borderRadius} customWidgetName = {customWidgetName} />
    }
}

export default WidgetSkeleton;

type WidgetDataFormProps = {
    widgetId: string | null, 
    widgetType: Widget['type'] | null, 
    widgetData: Template['widgetData'][1] | null
    forwardedRef: RefObject<{ getFormData: () => Template['widgetData'][1] }> 
}

export const WidgetDataForm = ({ widgetId, widgetType, widgetData, forwardedRef }: WidgetDataFormProps) => {
    if(widgetData == null) return <></>;
    switch(widgetType) {
        case 'DYNAMIC_FORM': {
            return <DynamicFormWidgetDataForm 
                ref = {forwardedRef as RefObject<{ getFormData: () => DynamicFormWidgetData }>} 
                data = {(widgetData as DynamicFormWidgetData)} 
            />
        }
        case 'FEATURE_WITH_ICON_CONTROLLED': {
            return <FeatureWithIconControlledWidgetDataForm 
                ref = {forwardedRef as RefObject<{ getFormData: () => FeatureWithIconControlledWidgetData }>} 
                initialData = {(widgetData as FeatureWithIconControlledWidgetData)} 
            />
        }
        case 'DETAILS_WITH_ICON_CONTROLLED': {
            return <DetailsWithIconControlledWidgetDataForm 
                ref = {forwardedRef as RefObject<{ getFormData: () => DetailsWithIconControlledWidgetData }>} 
                initialData = {(widgetData as DetailsWithIconControlledWidgetData)} 
            />
        }
    }
}

export const covertImageWidgetDataToStateDataType = (list: DetailsWithIconControlledWidgetData['data'] | FeatureWithIconControlledWidgetData['data'], type: 'FEATURE_WITH_ICON_CONTROLLED' | 'DETAILS_WITH_ICON_CONTROLLED') => {    
    switch(type) {
        case 'FEATURE_WITH_ICON_CONTROLLED': return (list as FeatureWithIconControlledWidgetData['data']).map(item => ({ id: item?.id ?? null, path: item.path, additional_field_1: item.feature , additional_field_2: '' }));
        case 'DETAILS_WITH_ICON_CONTROLLED': return (list as DetailsWithIconControlledWidgetData['data']).map(item => ({ id: item?.id ?? null, path: item.path, additional_field_1: item.heading , additional_field_2: '' }));
    }
}

export const widgetsWhichHasData = ['DETAILS_WITH_ICON_CONTROLLED', 'FEATURE_WITH_ICON_CONTROLLED', 'DYNAMIC_FORM'] as Widget['type'][];
export const getDefaultDataForTemplateWidgets = (type: typeof widgetsWhichHasData[1]) => {
    switch(type) {
        case 'DYNAMIC_FORM': return { data: [] as DynamicFormWidgetData['data'], customWidgetName: null, widgetType: type };
        case 'DETAILS_WITH_ICON_CONTROLLED': return { data: [], customWidgetName: null, widgetType: type };
        case 'FEATURE_WITH_ICON_CONTROLLED': return { data: [], customWidgetName: null, widgetType: type };
    }
    return { data: [], customWidgetName: null, widgetType: type };
}

export {
    DynamicFormWidgetDataForm,
    FeatureWithIconControlledWidgetDataForm as FeatureWithIconWidgetDataForm
}

export { 
    ImageSectionWidgetSkeleton , 
    DetailsWithIconWidgetSkeleton, 
    FeatureWithIconWidgetSkeleton, 
    ImageCarouselWidgetSkeleton, 
    ExpandableWidgetSkeleton,
    ListingCarouselWidgetSkeleton, 
    FeatureHighlighterWidgetSkeleton, 
    ListingBaiscInfoWidgetSkeleton, 
    CustomContentWidgetSkeleton,
    DetailsWithIconControlledWidgetSkeleton,
    FeatureWithIconControlledWidgetSkeleton
};