import { Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { DetailsWithIconControlledWidgetAnswerData, WidgetAnswer } from "../types";
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { DetailsWithIconControlledWidgetData } from "../../listing_template_builder/builder_types";
import NextImageWithFallback from "../../image_with_fallback";

type DetailsWithIconControlledFormProps = {
    initialData?: DetailsWithIconControlledWidgetAnswerData,
    widgetData: DetailsWithIconControlledWidgetData,
    onSubmit: (data: DetailsWithIconControlledWidgetAnswerData) => void
}

const DetailsWithIconControlledForm = forwardRef<{ getFormData: () => WidgetAnswer['data'] | null }, DetailsWithIconControlledFormProps>(({ initialData, widgetData, onSubmit }, forwardedRef) => {
    const [data, setData] = useState({ answers: widgetData.data.map(item => {
        const answer = initialData?.answers?.find(answer => answer.id == item.id)?.content ?? '';
        return { id: item.id, content: answer }
    }) })

    useEffect(() => {
        setData({ 
            answers: widgetData.data.map(item => {
                const answer = initialData?.answers?.find(answer => answer.id == item.id)?.content ?? '';
                return { id: item.id, content: answer }
            }) 
        })
    }, [initialData])

    const onChangeContent = (event: ChangeEvent<HTMLInputElement>, itemId: string) => {
        setData(prev => ({ answers: prev.answers.map(e => e.id == itemId ? { ...e, content: event.target.value } : e) }))
    }

    const onClickSubmit = () => {
        const submitData: DetailsWithIconControlledWidgetAnswerData = {
            answers: data.answers.filter(item => item.content.trim() != '')
        }
        onSubmit(submitData);
        return submitData;
    }

    useImperativeHandle(forwardedRef, () => {
        return { getFormData: onClickSubmit };
    }, [data]);

    return (
        <Flex w = '100%' direction={'column'} gap = '20px'>
            <Flex w = '100%' gap = '15px' justifyContent={'center'} flexWrap={'wrap'}>
                {
                    widgetData.data.map(item => {
                        const answer = data?.answers.find(answer => answer.id == item.id)?.content ?? '';
                        return <Flex key = {item.id} h = '100px' w = 'fit-content' p = '10px' gap = '10px' borderRadius={'8px'} border = '1px' borderColor={'brand.borderColor'}>
                            <Flex w = {'80px'} h = {'80px'} flexShrink={0} borderRadius={'6px'}>
                                <Flex position={'relative'} w = '100%' h = '100%' borderRadius={'6px'}>
                                    <NextImageWithFallback src = {item.path.startsWith('http') ? item.path : `https://storage.googleapis.com/${item.path}`} alt = 'image' fill style = {{ objectFit: 'contain' }} sizes='(max-width: 991px) 100vw, 49vw' loading='lazy' />
                                </Flex>
                            </Flex>
                            <Flex w = '100%' direction={'column'} gap = '10px'>
                                <FormControl>
                                    <FormLabel>{item.heading}</FormLabel>
                                    <Input value = {answer} onChange={(e) => onChangeContent(e, item.id)} placeholder="Enter details" />
                                </FormControl>
                            </Flex>
                        </Flex>
                    })
                }
            </Flex>
        </Flex>
    );
})

export default DetailsWithIconControlledForm;