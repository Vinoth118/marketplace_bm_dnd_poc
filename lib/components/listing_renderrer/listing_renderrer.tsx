import { Flex, FormControl, FormLabel, Input, Select, Checkbox } from "@chakra-ui/react";
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Template } from "../listing_template_builder/builder_types";
import { TemplateAnswer } from "../template_form/types";
import WidgetSkeleton from "../listing_template_builder/widgets";
import WidgetUI from "./widgets_ui";


type DynamicFormRenderrerProps = {
    template: Template,
    listingData: TemplateAnswer
}

const ListingRenderrerRenderrer = ({ template, listingData }: DynamicFormRenderrerProps) => {

    return (
        <Flex w = '100%' direction = 'column' gap = {['20px', '20px', '40px', '40px', '40px']}>
            {
                template.data.map((row, index) => {
                    return <Flex key = {row.id} w = '100%' gap = '30px' direction={['column', 'column', 'column', 'row', 'row']}>
                        {
                            row.columns.map((col, index, array) => {
                                const width = array.length < 2 ? '100%' : index == 0 ? ['100%', '100%', '100%', '55%', '55%'] : index == 1 ? ['100%', '100%', '100%', '43%', '43%'] : 'auto'
                                return <Flex key = {col.id} id = {col.id} w = {width} direction={'column'} gap = {['20px', '20px', '40px', '40px', '40px']}>
                                    {
                                        col.widgets.map((widget, index) => {
                                            const customName = template.widgetData.find(e => e.widgetId == widget.id)?.customWidgetName;
                                            const widgetAnswerData = listingData.find(e => e.id == widget.id)!;
                                            const widgetData = template.widgetData.find(e => e.widgetId == widget.id) ?? null;
                                            return <WidgetUI 
                                                key = {widget.id} 
                                                widget = {widget.type}
                                                answerData = {widgetAnswerData}
                                                widgetData = {widgetData}
                                            />
                                        })
                                    }
                                </Flex>
                            })
                        }
                    </Flex>
                })
            }
        </Flex>
    );
}

export default ListingRenderrerRenderrer;