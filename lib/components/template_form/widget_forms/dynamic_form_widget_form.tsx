import { Flex, FormControl, FormLabel, Text, Input, Progress, Icon, Button, IconButton } from "@chakra-ui/react";
import { DynamicFormWidgetAnswerData, ImageCarouselWidgetData, WidgetAnswer } from "../types";
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { covertImageWidgetDataToStateDataType, getWidgetDefaultAnsweData } from ".";
import { v4 as uuidv4 } from 'uuid';
import ImageFormListWithDND, { ConditionalImageItem } from "../../image_list_with_dnd";
import UploadImagesContainer from "../../image-upload-container";
import DynamicFormRenderrer from "../../dynamic_form/form_renderer/form_renderer";
import { DynamicFormAnswerData } from "../../dynamic_form/types";
import { DynamicFormWidgetData } from "../../listing_template_builder/builder_types";

type DynamicFormWidgetFormProps = {
    initialData?: DynamicFormWidgetAnswerData,
    widgetData: DynamicFormWidgetData
    onSubmit: (data: DynamicFormWidgetAnswerData) => void
}

const DynamicFormWidgetForm = forwardRef<{ getFormData: () => WidgetAnswer['data'] | null }, DynamicFormWidgetFormProps>(({ initialData, widgetData, onSubmit }, forwardedRef) => {
    const formAnswerDataSubmitTriggerRef = useRef<{ getFormData: () => DynamicFormAnswerData }>(null);

    const onClickSubmit = () => {
        const formAnswers = formAnswerDataSubmitTriggerRef.current?.getFormData() ?? [];
        onSubmit({ answers: formAnswers });
        return { answers: formAnswers };
    }

    useImperativeHandle(forwardedRef, () => {
        return { getFormData: onClickSubmit };
    });

    return (
        <Flex w = '100%' direction={'column'} gap = '20px'>
            <DynamicFormRenderrer ref =  {formAnswerDataSubmitTriggerRef} template={widgetData?.data ?? []} initialAnswerData={initialData?.answers ?? []} onSubmit={() => {}} />
        </Flex>
    );
})

export default DynamicFormWidgetForm;