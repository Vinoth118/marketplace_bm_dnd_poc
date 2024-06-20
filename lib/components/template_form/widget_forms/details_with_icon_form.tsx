import { Flex } from "@chakra-ui/react";
import { DetailsWithIconWidgetAnswerData, WidgetAnswer } from "../types";
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { covertImageWidgetDataToStateDataType, getWidgetDefaultAnsweData } from ".";
import ImageFormListWithDND, { ConditionalImageItem } from "../../image_list_with_dnd";
import { v4 as uuidv4 } from 'uuid';
import UploadImagesContainer from "../../image-upload-container";

type DetailsWithIconFormProps = {
    initialData?: DetailsWithIconWidgetAnswerData,
    onSubmit: (data: DetailsWithIconWidgetAnswerData) => void
}

const DetailsWithIconForm = forwardRef<{ getFormData: () => WidgetAnswer['data'] | null }, DetailsWithIconFormProps>(({ initialData, onSubmit }, forwardedRef) => {
    const [data, setData] = useState({ list: covertImageWidgetDataToStateDataType([...(initialData?.list ?? (getWidgetDefaultAnsweData('DETAILS_WITH_ICON') as DetailsWithIconWidgetAnswerData)?.list)]).map(e => ({ ...e, id: uuidv4() })) })

    useEffect(() => setData({ list: covertImageWidgetDataToStateDataType([...(initialData?.list ?? (getWidgetDefaultAnsweData('DETAILS_WITH_ICON') as DetailsWithIconWidgetAnswerData)?.list)]).map(e => ({ ...e, id: uuidv4() })) }), [initialData])

    const onChangeItemValue = (event: ChangeEvent<HTMLInputElement>, itemId: string, type: 'IMAGE_URL' | 'ADDITIONAL_FIELD_1' | 'ADDITIONAL_FIELD_2') => {
        setData(prev => ({
            list: prev.list.map(item => {
                if(item.id == itemId) {
                    const tempItem: typeof item = JSON.parse(JSON.stringify(item));
                    const key = type == 'IMAGE_URL' ? 'path' : type == 'ADDITIONAL_FIELD_1' ? 'additional_field_1' : 'additional_field_2'
                    tempItem[key] = event.target.value;
                    return tempItem;
                }
                return item;
            })
        }))
    }

    const onRemoveItem = (itemId: string) => setData(prev => ({ ...prev, list: prev.list.filter(e => e.id != itemId) }));

    const onChangeList = (list: ConditionalImageItem<true, false>[]) => setData({ list: list as typeof data['list'] })

    const onClickAddNewItem = () => setData(prev => ({ ...prev, list: [...prev.list, { path: '', additional_field_1: '', additional_field_2: '', id: uuidv4() }] }));

    const onUploadComplete = (items: { path: string, id: string }[]) => setData(prev => ({ ...prev, list: [...prev.list, ...items.map(e => ({ path: e.path, additional_field_1: '', additional_field_2: '', id: e.id }))] }));

    const onClickSubmit = () => {
        const submitData: DetailsWithIconWidgetAnswerData = JSON.parse(JSON.stringify(data))
        submitData.list = data.list.filter(e => e.path.trim() != '').map(({ path, additional_field_1, additional_field_2 }) => ({ path, heading: additional_field_1, content: additional_field_2 }));
        onSubmit(submitData);
        return submitData;
    }

    useImperativeHandle(forwardedRef, () => {
        return { getFormData: onClickSubmit };
    }, [data]);

    return (
        <Flex w = '100%' direction={'column'} gap = '20px'>
            <ImageFormListWithDND<true, true>
                currentList={data.list}
                onChangeList={onChangeList}
                onChangeItemValue={onChangeItemValue} 
                onRemoveItem={onRemoveItem} 
                aditionalField1Label="Heading"
                aditionalField2Label="Conent"
            />
            <UploadImagesContainer 
                showAddItemButton
                onClickAddItem={onClickAddNewItem}
                onUploadComplete={onUploadComplete}
            />
        </Flex>
    );
})

export default DetailsWithIconForm;