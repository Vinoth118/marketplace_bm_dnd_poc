import { RefObject } from "react";
import { CustomContentWidgetAnswerData, DetailsWithIconWidgetAnswerData, DynamicFormWidgetAnswerData, ExpandableWidgetAnswerData, FeatureHighlighterWidgetAnswerData, FeatureWithIconWidgetAnswerData, ImageCarouselWidgetData, ImageSectionWidgetAnswerData, ListingBasicInfoWidgetAnswerData, ListingCarouselWidgetAnswerData, WidgetAnswer } from "../types";
import { DynamicFormWidgetData, Template, Widget } from "../../listing_template_builder/builder_types";
import ExpandableForm from "./expandable_form";
import DetailsWithIconForm from "./details_with_icon_form";
import CustomContentForm from "./custom_content_form";
import FeatureHighlighterForm from "./feature_highlighter_form";
import FeatureWithIconForm from "./feature_with_icon_form";
import ImageSectionForm from "./image_section_form";
import ImageCarouselForm from "./image_carousel_form";
import ListingBasicInfoForm from "./listing_basic_info_form";
import ListingCarouselForm from "./listing_carousel_form";
import DynamicFormWidgetForm from "./dynamic_form_widget_form";

const sampleImagesData = [
    {
        path: 'temp2222-storage-bucket/1668499104135--original-imagc9cqjrrkzs47.webp',
        additional_field_1: '/page/naviage_to_id',
        additional_field_2: '/page/naviage_to_id',
    },
    {
        path: 'temp2222-storage-bucket/1657876662376-increase-sales-amazon-banner.jpeg',
        additional_field_1: '/page/naviage_to_id',
        additional_field_2: '/page/naviage_to_id',
    },
    {
        path: 'temp2222-storage-bucket/1657876662372-SanyoWebBanner01._CB1198675309_.jpg',
        additional_field_1: '/page/naviage_to_id',
        additional_field_2: '/page/naviage_to_id',
    },
    {
        path: 'temp2222-storage-bucket/1657876662365-banner.png',
        additional_field_1: '/page/naviage_to_id',
        additional_field_2: '/page/naviage_to_id',
    }
]

export const getWidgetDefaultAnsweData = (widget: Widget['type']): WidgetAnswer['data'] => {
    switch(widget) {
        case 'IMAGE_SECTION': return { list: [] }
        case 'IMAGE_CAROUSEL': return { list: [] }
        case 'DETAILS_WITH_ICON': return { list: [] }
        case 'FEATURE_WITH_ICON': return { list: [] }
        case 'LISTING_CAROUSEL': return { list: [] }
        case 'FEATURE_HIGHLIGHTER': return { list: [] }
        case 'EXPANDABLE': return { list: [] }
        case 'LISTING_BASIC_INFO': return { 
            name: '',
            price: 0,
            strikeThroughPrice: 0,
            aditional_info: []
        }
        case 'CUSTOM_CONTENT': return { content: '' }
        case 'CUSTOM_CONTENT': return { answers: [] }
        default: return { list: [] }
    }
}

export const covertImageWidgetDataToStateDataType = (list: ImageSectionWidgetAnswerData['list'] | ImageCarouselWidgetData['list'] | DetailsWithIconWidgetAnswerData['list'] | FeatureWithIconWidgetAnswerData['list']) => {
    const type = list.length < 1 ? 'IMAGE_SECTION' : 
        'navigateTo' in list?.[0] ? 'IMAGE_CAROUSEL' : 
        'feature' in list?.[0] ? 'FEATURE_WITH_ICON' :
        'heading' in list?.[0] || 'content' in list?.[0] ? 'DETAILS_WITH_ICON' : 'IMAGE_SECTION';
    
    switch(type) {
        case 'IMAGE_SECTION': return list.map(item => ({ path: item.path, additional_field_1: '', additional_field_2: '' }));
        case 'IMAGE_CAROUSEL': return (list as ImageCarouselWidgetData['list']).map(item => ({ path: item.path, additional_field_1: item.navigateTo , additional_field_2: '' }));
        case 'FEATURE_WITH_ICON': return (list as FeatureWithIconWidgetAnswerData['list']).map(item => ({ path: item.path, additional_field_1: item.feature , additional_field_2: '' }));
        case 'DETAILS_WITH_ICON': return (list as DetailsWithIconWidgetAnswerData['list']).map(item => ({ path: item.path, additional_field_1: item.heading , additional_field_2: item.content }));
    }
}

export const covertTwoInputWidgetDataToStateDataType = (list: FeatureHighlighterWidgetAnswerData['list'] | ExpandableWidgetAnswerData['list'], type: Widget['type']) => {
    switch(type) {
        case 'FEATURE_HIGHLIGHTER': return (list as FeatureHighlighterWidgetAnswerData['list']).map(item => ({ field_1: item.heading, field_2: item.content }));
        case 'EXPANDABLE': return (list as ExpandableWidgetAnswerData['list']).map(item => ({ field_1: item.outer, field_2: item.inner }));
    }
    return [];
}

type WidgetFormProps = { 
    initialAnswerData: WidgetAnswer['data'] | null, 
    widgetData: Template['widgetData'][1] | null,
    type: Widget['type'] | null, 
    forwardedRef: RefObject<{ getFormData: () => WidgetAnswer["data"] | null }> 
}

const WidgetForm = ({ initialAnswerData, widgetData, type, forwardedRef }: WidgetFormProps) => {
    if(type == null) return <></>;
    switch(type) {
        case 'CONTACT':
        case 'CUSTOM_CONTENT': return <CustomContentForm initialData={initialAnswerData as CustomContentWidgetAnswerData} onSubmit={e => {}} ref = {forwardedRef} />;
        case 'DETAILS_WITH_ICON': return <DetailsWithIconForm initialData={initialAnswerData as DetailsWithIconWidgetAnswerData} onSubmit={e => {}} ref = {forwardedRef} />;
        case 'EXPANDABLE': return <ExpandableForm initialData={initialAnswerData as ExpandableWidgetAnswerData} onSubmit={e => {}} ref = {forwardedRef} />;
        case 'FEATURE_HIGHLIGHTER': return <FeatureHighlighterForm initialData={initialAnswerData as FeatureHighlighterWidgetAnswerData} onSubmit={e => {}} ref = {forwardedRef} />;
        case 'FEATURE_WITH_ICON': return <FeatureWithIconForm initialData={initialAnswerData as FeatureWithIconWidgetAnswerData} onSubmit={e => {}} ref = {forwardedRef} />;
        case 'IMAGE_SECTION': return <ImageSectionForm initialData={initialAnswerData as ImageSectionWidgetAnswerData} onSubmit={e => {}} ref = {forwardedRef} />;
        case 'IMAGE_CAROUSEL': return <ImageCarouselForm initialData={initialAnswerData as ImageCarouselWidgetData} onSubmit={e => {}} ref = {forwardedRef} />;
        case 'LISTING_BASIC_INFO': return <ListingBasicInfoForm initialData={initialAnswerData as ListingBasicInfoWidgetAnswerData} onSubmit={e => {}} ref = {forwardedRef} />;
        case 'LISTING_CAROUSEL': return <ListingCarouselForm initialData={initialAnswerData as ListingCarouselWidgetAnswerData} onSubmit={e => {}} ref = {forwardedRef} />;
        case 'DYNAMIC_FORM': return <DynamicFormWidgetForm initialData={initialAnswerData as DynamicFormWidgetAnswerData} widgetData={widgetData as DynamicFormWidgetData} onSubmit={e => {}} ref = {forwardedRef} />;
    }
}

export default WidgetForm;

export {
    ExpandableForm,
    ImageSectionForm,
    ImageCarouselForm,
    FeatureHighlighterForm,
    FeatureWithIconForm,
    ListingBasicInfoForm,
    ListingCarouselForm,
    DetailsWithIconForm,
    CustomContentForm,
}