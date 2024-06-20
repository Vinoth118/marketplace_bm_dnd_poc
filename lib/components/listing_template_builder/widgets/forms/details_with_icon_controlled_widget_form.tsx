import { Flex, FormControl, FormLabel, IconButton, Input } from "@chakra-ui/react";
import { DetailsWithIconControlledWidgetData } from "../../builder_types";
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ImageFormListWithDND, { ConditionalImageItem } from "../../../image_list_with_dnd";
import { v4 as uuidv4 } from 'uuid';
import UploadImagesContainer from "../../../image-upload-container";
import { covertImageWidgetDataToStateDataType } from "..";
import { IoMdEye } from "react-icons/io";

type DetailsWithIconControlledWidgetDataFormProps = {
    initialData: DetailsWithIconControlledWidgetData
}

const DetailsWithIconControlledWidgetDataForm = forwardRef<{ getFormData: () => DetailsWithIconControlledWidgetData }, DetailsWithIconControlledWidgetDataFormProps>(({ initialData }, forwardedRef) => {
    const [widgetName, setWidgetName] = useState(initialData?.customWidgetName ?? '');
    const [data, setData] = useState({ list: covertImageWidgetDataToStateDataType([...(initialData?.data ?? [])], 'DETAILS_WITH_ICON_CONTROLLED').map(e => ({ ...e, id: e.id ?? uuidv4() })) })

    useEffect(() => setData({ list: covertImageWidgetDataToStateDataType([...(initialData?.data ?? [])], 'DETAILS_WITH_ICON_CONTROLLED').map(e => ({ ...e, id: e.id ?? uuidv4() })) }), [initialData])

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

    const onChangeList = (list: ConditionalImageItem<true, false>[]) => setData({ list: list as typeof data['list'] })

    const onClickAddNewItem = () => setData(prev => ({ ...prev, list: [...prev.list, { path: '', additional_field_1: '', additional_field_2: '', id: uuidv4() }] }));

    const onUploadComplete = (items: { path: string, id: string }[]) => setData(prev => ({ ...prev, list: [...prev.list, ...items.map(e => ({ path: e.path, additional_field_1: '', additional_field_2: '', id: e.id }))] }));

    const onClickSubmit = () => {
        const submitData = {
            widgetId: initialData?.widgetId,
            customWidgetName: widgetName,
            widgetType: initialData?.widgetType,
            data: data.list.filter(e => e.path.trim() != '').map(({ id, path, additional_field_1 }) => ({ id, path, heading: additional_field_1 }))
        }
        return submitData;
    }

    useImperativeHandle(forwardedRef, () => {
        return { getFormData: onClickSubmit };
    }, [data, widgetName]);

    return (
        <Flex w = '100%' direction={'column'} gap = '20px'>
            <FormControl>
                <FormLabel>Custom widget name</FormLabel>
                <Input value = {widgetName} onChange={e => setWidgetName(e.target.value)} />
            </FormControl>
            <FormControl>
                <Flex mb = '10px' w = '100%' alignItems={'center'} gap = '10px'>
                    <FormLabel m = {0}>Icons list</FormLabel>
                    {/* <IconButton size = 'sm' variant={'ghost'} onClick={onOpen} icon={<Icon w = '20px' h = '20px' as = {IoMdEye} />} aria-label="preview_form_icon" /> */}
                </Flex>
                <Flex w = '100%' direction={'column'} gap = '20px' bg = 'white' boxShadow={'0 0 2px 1px rgba(0,0,0,0.1)'} borderRadius={'12px'} p = '10px'>
                    <ImageFormListWithDND<true, false>
                        currentList={data.list}
                        onChangeList={onChangeList}
                        onChangeItemValue={onChangeItemValue} 
                        onRemoveItem={onRemoveItem} 
                        aditionalField1Label="Heading"
                    />
                    <UploadImagesContainer 
                        showAddItemButton
                        onClickAddItem={onClickAddNewItem}
                        onUploadComplete={onUploadComplete}
                    />
                </Flex>
            </FormControl>
        </Flex>
    );
})

export default DetailsWithIconControlledWidgetDataForm;