import { Flex } from "@chakra-ui/react";
import { CustomContentWidgetAnswerData, WidgetAnswer } from "../types";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { getWidgetDefaultAnsweData } from ".";
import RichTextEditor from "../../rich_text_editor";

type CustomContentFormProps = {
    initialData?: CustomContentWidgetAnswerData,
    onSubmit: (data: CustomContentWidgetAnswerData) => void
}

const CustomContentForm = forwardRef<{ getFormData: () => WidgetAnswer['data'] | null }, CustomContentFormProps>(({ initialData, onSubmit }, forwardedRef) => {
    const [data, setData] = useState(initialData ?? getWidgetDefaultAnsweData('CUSTOM_CONTENT') as CustomContentWidgetAnswerData)

    useEffect(() => setData(initialData ?? getWidgetDefaultAnsweData('CUSTOM_CONTENT') as CustomContentWidgetAnswerData), [initialData])

    const onChange = (data: string) => setData({ content: data })

    const onClickSubmit = () => {
        onSubmit(data);
        return data;
    }

    useImperativeHandle(forwardedRef, () => {
        return { getFormData: onClickSubmit };
    }, [data]);

    return (
        <Flex w = '100%' direction={'column'}>
            <RichTextEditor initialData = {data.content ?? ''} onChange = {onChange} />
        </Flex>
    );
})

export default CustomContentForm;