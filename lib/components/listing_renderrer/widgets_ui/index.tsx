import { DetailsWithIconControlledWidgetData, DynamicFormWidgetData, FeatureWithIconControlledWidgetData, Template, Widget } from "../../listing_template_builder/builder_types";
import { CustomContentWidgetAnswerData, DetailsWithIconControlledWidgetAnswerData, DetailsWithIconWidgetAnswerData, DynamicFormWidgetAnswerData, ExpandableWidgetAnswerData, FeatureHighlighterWidgetAnswerData, FeatureWithIconControlledWidgetAnswerData, FeatureWithIconWidgetAnswerData, ImageCarouselWidgetAnswerData, ImageSectionWidgetAnswerData, WidgetAnswer } from "../../template_form/types";
import CustomContentWidgetUI from "./custom_content_widget_ui";
import DetailsWithIconControlledWidgetUI from "./details_with_icon_controlled_widget_ui";
import DetailsWithIconWidgetUI from "./details_with_icon_widget_ui";
import ExpandableWidgetUI from "./expandable_widget_ui";
import FeatureHighlighterWidgetUI from "./feature_highlighter_widget_ui";
import FeatureWithIconWidgetUI from "./feature_with_icon_widget_ui";
import ImageCarouselWidgetUI from "./image_carousel_widget_ui";
import ImageSectionWidgetUI from "./image_section_widget_ui";
import ListingInformationsWidgetUI from "./listing_information_widget_ui";

type WidgetUIProps = {
    widget: Widget['type'],
    answerData: WidgetAnswer,
    widgetData: Template['widgetData'][1] | null
}

const WidgetUI = ({ widget, answerData, widgetData }: WidgetUIProps) => {
    switch(widget) {
        case 'IMAGE_SECTION': {
            const aData = answerData.data as ImageSectionWidgetAnswerData;
            return <ImageSectionWidgetUI imageList={aData.list}  />
        }
        case 'IMAGE_CAROUSEL': {
            const aData = answerData.data as ImageCarouselWidgetAnswerData;
            return <ImageCarouselWidgetUI imageList={aData.list}  />
        }
        case 'DETAILS_WITH_ICON': {
            const aData = answerData.data as DetailsWithIconWidgetAnswerData;
            return <DetailsWithIconWidgetUI list={aData.list} />
        }
        case 'DETAILS_WITH_ICON_CONTROLLED': {
            const aData = answerData.data as DetailsWithIconControlledWidgetAnswerData;
            const wData = widgetData as DetailsWithIconControlledWidgetData;
            const list = wData.data.map(item => {
                const content = aData.answers.find(e => e.id == item.id)?.content ?? '';
                return { path: item.path, heading: item.heading, content: content }
            })
            return <DetailsWithIconControlledWidgetUI list={list} title={wData.customWidgetName} />
        }
        case 'FEATURE_WITH_ICON': {
            const aData = answerData.data as FeatureWithIconWidgetAnswerData;
            return <FeatureWithIconWidgetUI list={aData.list} />
        }
        case 'FEATURE_WITH_ICON_CONTROLLED': {
            const aData = answerData.data as FeatureWithIconControlledWidgetAnswerData;
            const wData = widgetData as FeatureWithIconControlledWidgetData;
            const list = wData.data.filter(item => aData.answers.includes(item.id));
            return <FeatureWithIconWidgetUI list={list} title={wData.customWidgetName} />
        }
        case 'CUSTOM_CONTENT': {
            const aData = answerData.data as CustomContentWidgetAnswerData;
            return <CustomContentWidgetUI content={aData.content} />
        }
        case 'DYNAMIC_FORM': {
            const aData = answerData.data as DynamicFormWidgetAnswerData;
            const wData = widgetData as DynamicFormWidgetData;
            switch(wData.customWidgetName) {
                case 'Listing informations': {
                    return <ListingInformationsWidgetUI answers={aData.answers} template={wData.data} />
                }
            }
        }
        case 'EXPANDABLE': {
            const aData = answerData.data as ExpandableWidgetAnswerData;
            return <ExpandableWidgetUI list={aData.list}  />
        }
        case 'FEATURE_HIGHLIGHTER': {
            const aData = answerData.data as FeatureHighlighterWidgetAnswerData;
            return <FeatureHighlighterWidgetUI list={aData.list} />
        }
        case 'LISTING_CAROUSEL':  
        case 'LISTING_BASIC_INFO': 
        case 'CONTACT':
        default: <></>
    }
}

export default WidgetUI;

export {
    ImageSectionWidgetUI,
    ImageCarouselWidgetUI,
    DetailsWithIconWidgetUI,
    DetailsWithIconControlledWidgetUI,
    FeatureWithIconWidgetUI,
    CustomContentWidgetUI,
    ListingInformationsWidgetUI,
    ExpandableWidgetUI,
    FeatureHighlighterWidgetUI
}