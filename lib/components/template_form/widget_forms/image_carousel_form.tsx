import { Flex, FormControl, FormLabel, Text, Input, Progress, Icon, Button, IconButton } from "@chakra-ui/react";
import { ImageCarouselWidgetAnswerData, WidgetAnswer } from "../types";
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { covertImageWidgetDataToStateDataType, getWidgetDefaultAnsweData } from ".";
import { v4 as uuidv4 } from 'uuid';
import ImageFormListWithDND, { ConditionalImageItem } from "../../image_list_with_dnd";
import UploadImagesContainer from "../../image-upload-container";

type ImageCarouselFormProps = {
    initialData?: ImageCarouselWidgetAnswerData,
    onSubmit: (data: ImageCarouselWidgetAnswerData) => void
}

const ImageCarouselForm = forwardRef<{ getFormData: () => WidgetAnswer['data'] | null }, ImageCarouselFormProps>(({ initialData, onSubmit }, forwardedRef) => {
    const [data, setData] = useState({ list: covertImageWidgetDataToStateDataType([...(initialData?.list ?? (getWidgetDefaultAnsweData('IMAGE_CAROUSEL') as ImageCarouselWidgetAnswerData)?.list)]).map(e => ({ ...e, id: uuidv4() })) })

    useEffect(() => setData({ list: covertImageWidgetDataToStateDataType([...(initialData?.list ?? (getWidgetDefaultAnsweData('IMAGE_CAROUSEL') as ImageCarouselWidgetAnswerData)?.list)]).map(e => ({ ...e, id: uuidv4() })) }), [initialData])

    const onChangeItemValue = (event: ChangeEvent<HTMLInputElement>, itemId: string, type: 'IMAGE_URL' | 'ADDITIONAL_FIELD_1' | 'ADDITIONAL_FIELD_2') => {
        setData(prev => ({
            list: prev.list.map(item => {
                if(item.id == itemId) {
                    const tempItem: typeof item = JSON.parse(JSON.stringify(item));
                    tempItem[type == 'IMAGE_URL' ? 'path' : 'additional_field_1'] = event.target.value;
                    return tempItem;
                }
                return item;
            })
        }))
    }

    const onRemoveItem = (itemId: string) => setData(prev => ({ ...prev, list: prev.list.filter(e => e.id != itemId) }));

    const onChangeList = (list: ConditionalImageItem<true, false>[]) => setData({ list: list as typeof data['list'] });

    const onClickAddNewItem = () => setData(prev => ({ ...prev, list: [...prev.list, { path: '', additional_field_1: '', additional_field_2: '', id: uuidv4() }] }));

    const onUploadComplete = (items: { path: string, id: string }[]) => setData(prev => ({ ...prev, list: [...prev.list, ...items.map(e => ({ path: e.path, additional_field_1: '', additional_field_2: '', id: e.id }))] }));

    const onClickSubmit = () => {
        const submitData: ImageCarouselWidgetAnswerData = JSON.parse(JSON.stringify(data))
        submitData.list = data.list.filter(e => e.path.trim() != '').map(({ path, additional_field_1 }) => ({ path, navigateTo: additional_field_1 }));
        onSubmit(submitData);
        return submitData;
    }

    useImperativeHandle(forwardedRef, () => {
        return { getFormData: onClickSubmit };
    }, [data]);

    return (
        <Flex w = '100%' direction={'column'} gap = '20px'>
            <ImageFormListWithDND<true, false>
                currentList={data.list}
                onChangeList={onChangeList}
                onChangeItemValue={onChangeItemValue} 
                onRemoveItem={onRemoveItem} 
                aditionalField1Label="Navigate URL"
            />
            <UploadImagesContainer 
                showAddItemButton
                onClickAddItem={onClickAddNewItem}
                onUploadComplete={onUploadComplete}
            />
        </Flex>
    );
})

export default ImageCarouselForm;