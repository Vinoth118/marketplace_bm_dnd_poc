import { Flex, FormControl, FormLabel, FormErrorMessage, Input, IconButton, Icon } from "@chakra-ui/react";
import { ImageCarouselWidgetData, ImageSectionWidgetAnswerData, WidgetAnswer } from "../types";
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { covertImageWidgetDataToStateDataType, getWidgetDefaultAnsweData } from ".";
import { Active, defaultDropAnimationSideEffects, DndContext, DragCancelEvent, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, DropAnimation, KeyboardSensor, MeasuringStrategy, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { v4 as uuidv4 } from 'uuid';
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { MdDragIndicator } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import ImageFormListWithDND, { ConditionalImageItem } from "../../image_list_with_dnd";
import UploadImagesContainer from "../../image-upload-container";

type ImageSectionFormProps = {
    initialData?: ImageSectionWidgetAnswerData,
    onSubmit: (data: ImageSectionWidgetAnswerData) => void
}

const ImageSectionForm = forwardRef<{ getFormData: () => WidgetAnswer['data'] | null }, ImageSectionFormProps>(({ initialData, onSubmit }, forwardedRef) => {
    const [data, setData] = useState({ list: covertImageWidgetDataToStateDataType([...(initialData?.list ?? (getWidgetDefaultAnsweData('IMAGE_SECTION') as ImageSectionWidgetAnswerData)?.list)]).map(e => ({ ...e, id: uuidv4() })) })

    useEffect(() => setData({ list: covertImageWidgetDataToStateDataType([...(initialData?.list ?? (getWidgetDefaultAnsweData('IMAGE_SECTION') as ImageSectionWidgetAnswerData)?.list)]).map(e => ({ ...e, id: uuidv4() })) }), [initialData])

    const onChangeItemValue = (event: ChangeEvent<HTMLInputElement>, itemId: string, type: 'IMAGE_URL' | "ADDITIONAL_FIELD_1" | "ADDITIONAL_FIELD_2") => {
        setData(prev => ({
            list: prev.list.map(item => {
                if(item.id == itemId) {
                    const tempItem: typeof item = JSON.parse(JSON.stringify(item));
                    tempItem.path = event.target.value;
                    return tempItem;
                }
                return item;
            })
        }))
    }

    const onRemoveItem = (itemId: string) => setData(prev => ({ ...prev, list: prev.list.filter(e => e.id != itemId) }));

    const onChangeList = (list: ConditionalImageItem<false, false>[]) => setData({ list: list as typeof data['list'] })

    const onClickAddNewItem = () => setData(prev => ({ ...prev, list: [...prev.list, { path: '', additional_field_1: '', additional_field_2: '', id: uuidv4() }] }));

    const onUploadComplete = (items: { path: string, id: string }[]) => setData(prev => ({ ...prev, list: [...prev.list, ...items.map(e => ({ path: e.path, additional_field_1: '', additional_field_2: '', id: e.id }))] }));

    const onClickSubmit = () => {
        const submitData: ImageSectionWidgetAnswerData = JSON.parse(JSON.stringify(data))
        submitData.list = data.list.filter(e => e.path.trim() != '').map(({ path }) => ({ path}));
        onSubmit(submitData);
        return submitData;
    }

    useImperativeHandle(forwardedRef, () => {
        return { getFormData: onClickSubmit };
    }, [data]);

    return (
        <Flex w = '100%' direction={'column'} gap = '20px'>
            <ImageFormListWithDND<false, false>
                currentList={data.list}
                onChangeList={onChangeList}
                onChangeItemValue={onChangeItemValue} 
                onRemoveItem={onRemoveItem} 
            />
            <UploadImagesContainer 
                showAddItemButton
                onClickAddItem={onClickAddNewItem}
                onUploadComplete={onUploadComplete}
            />
        </Flex>
    );
})

export default ImageSectionForm;

