import { Button, Flex, Icon } from "@chakra-ui/react";
import { FeatureHighlighterWidgetAnswerData, WidgetAnswer } from "../types";
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { covertTwoInputWidgetDataToStateDataType, getWidgetDefaultAnsweData } from ".";
import QandAFormListWithDND, { QAndAItemType } from "../../q_and_list_with_dnd";
import { v4 as uuidv4 } from 'uuid';
import { MdAddCircleOutline } from "react-icons/md";

type FeatureHighlighterFormProps = {
    initialData?: FeatureHighlighterWidgetAnswerData,
    onSubmit: (data: FeatureHighlighterWidgetAnswerData) => void
}

const FeatureHighlighterForm = forwardRef<{ getFormData: () => WidgetAnswer['data'] | null }, FeatureHighlighterFormProps>(({ initialData, onSubmit }, forwardedRef) => {
    const [data, setData] = useState({ list: covertTwoInputWidgetDataToStateDataType([...(initialData?.list ?? (getWidgetDefaultAnsweData('FEATURE_HIGHLIGHTER') as FeatureHighlighterWidgetAnswerData)?.list), { heading: '', content: '' }], 'FEATURE_HIGHLIGHTER').map(e => ({ ...e, id: uuidv4() })) })

    useEffect(() => setData({ list: covertTwoInputWidgetDataToStateDataType([...(initialData?.list ?? (getWidgetDefaultAnsweData('FEATURE_HIGHLIGHTER') as FeatureHighlighterWidgetAnswerData)?.list), { heading: '', content: '' }], 'FEATURE_HIGHLIGHTER').map(e => ({ ...e, id: uuidv4() })) }), [initialData])

    const onChangeItemValue = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, itemId: string, type: 'FIELD_1' | 'FIELD_2') => {
        setData(prev => ({ ...prev, list: prev.list.map(e => e.id == itemId ? { ...e, [type.toLowerCase()]: event.target.value } : e) }));
    }

    const onRemoveItem = (itemId: string) => setData(prev => ({ ...prev, list: prev.list.filter(e => e.id != itemId) }));

    const onChangeList = (list: QAndAItemType[]) => setData({ list })

    const onClickAddNewItem = () => setData(prev => ({ ...prev, list: [...prev.list, { field_1: '', field_2: '', id: uuidv4() }] }));

    const onClickSubmit = () => {
        const submitData: FeatureHighlighterWidgetAnswerData = JSON.parse(JSON.stringify(data))
        submitData.list = data.list.filter(e => e.field_1.trim() != '' && e.field_2.trim() != '').map(({ field_1, field_2 }) => ({ heading: field_1, content: field_2 }));
        onSubmit(submitData);
        return submitData;
    }

    useImperativeHandle(forwardedRef, () => {
        return { getFormData: onClickSubmit };
    }, [data]);

    return (
        <Flex w = '100%' direction={'column'} gap = '20px'>
            <QandAFormListWithDND
                currentList={data.list}
                onChangeList={onChangeList}
                onChangeItemValue={onChangeItemValue} 
                onRemoveItem={onRemoveItem} 
                field1Label="Heading"
                field2Label="Content"
            />
            <Button minW = '200px' w = '100%' h = '50px' onClick = {onClickAddNewItem} variant={'unstyled'} bg = 'white' borderRadius={'6px'} border = '1px' borderStyle={'dashed'} borderColor={'brand.borderColor'} _hover = {{ bg: 'gray.100' }}>
                <Flex w = '100%' h = '100%' justifyContent={'center'} alignItems={'center'} gap = '10px'>
                    <Icon as = {MdAddCircleOutline} color = 'brand.borderColor' w = '30px' h = '30px' />
                    Add Item
                </Flex>
            </Button>
        </Flex>
    );
})

export default FeatureHighlighterForm;