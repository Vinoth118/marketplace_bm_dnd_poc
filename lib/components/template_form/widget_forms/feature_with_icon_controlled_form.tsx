import { Checkbox, Flex, FormControl, FormLabel } from "@chakra-ui/react";
import { FeatureWithIconControlledWidgetAnswerData, WidgetAnswer } from "../types";
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FeatureWithIconControlledWidgetData } from "../../listing_template_builder/builder_types";
import NextImageWithFallback from "../../image_with_fallback";

type FeatureWithIconControlledFormProps = {
    initialData?: FeatureWithIconControlledWidgetAnswerData,
    widgetData: FeatureWithIconControlledWidgetData,
    onSubmit: (data: FeatureWithIconControlledWidgetAnswerData) => void
}

const FeatureWithIconControlledForm = forwardRef<{ getFormData: () => WidgetAnswer['data'] | null }, FeatureWithIconControlledFormProps>(({ initialData, widgetData, onSubmit }, forwardedRef) => {
    const [data, setData] = useState({ answers: initialData?.answers ?? [] })

    useEffect(() => setData({ answers: initialData?.answers ?? []}), [initialData])

    const onCheckChangeFeature = (event: ChangeEvent<HTMLInputElement>, itemId: string) => {
        setData(prev => ({ answers: event.target.checked ? [...prev.answers, itemId] : prev.answers.filter(e => e != itemId) }))
    }

    const onClickSubmit = () => {
        const submitData: FeatureWithIconControlledWidgetAnswerData = {
            answers: data.answers
        }
        onSubmit(submitData);
        return submitData;
    }

    useImperativeHandle(forwardedRef, () => {
        return { getFormData: onClickSubmit };
    }, [data]);

    return (
        <Flex w = '100%' direction={'column'} gap = '20px'>
            <Flex w = '100%' gap = '15px' justifyContent={'center'} flexWrap={'wrap'} alignItems={'stretch'}>
                {
                    widgetData.data.map(item => {
                        const isChecked = data?.answers.findIndex(answerId => answerId == item.id) > -1;
                        return <Flex key = {item.id} h = 'auto' w = 'fit-content' gap = '10px' borderRadius={'8px'} border = '1px' borderColor={'brand.borderColor'}>
                            <FormControl display={'flex'}>
                                <Flex w = '80px' h = '100%' flexShrink={0} borderRight = '1px' borderColor={'brand.borderColor'} p = '10px' justifyContent={'center'} alignItems={'center'}>
                                    <Checkbox 
                                        isChecked = {isChecked}
                                        onChange = {(e) => onCheckChangeFeature(e, item.id)}
                                        h = 'fit-content' w = 'fit-content'
                                        _focusVisible = {{ boxShadow: 'green 0px 1px 4px, green 0px 0px 0px 3px;' }}
                                        sx={{
                                            "& .chakra-checkbox__control": {
                                                transition: 'all 200ms ease-in-out',
                                                borderWidth: "2px",
                                                width: "34px",
                                                height: "36px",
                                                _focusVisible: { boxShadow: 'green 0px 1px 4px, green 0px 0px 0px 3px;' },
                                            },
                                        }}
                                        _checked={{
                                            "& .chakra-checkbox__control": {
                                                borderColor: 'green',
                                                background: "green",
                                                color: "white",
                                                _hover: { background: "green", boxShadow: 'none', outline: 'none', borderColor: 'green' }
                                            },
                                        }}
                                        size="other"
                                        iconSize={'20px'}
                                    />
                                </Flex>
                                <Flex w = '100%' direction={'column'} p = '10px' maxW = '130px'>   
                                    <FormLabel w = '100%' textAlign={'center'}>{item.feature}</FormLabel>
                                    <Flex w = {'50px'} h = {'50px'} flexShrink={0} borderRadius={'6px'} alignSelf={'center'}>
                                        <Flex position={'relative'} w = '100%' h = '100%' borderRadius={'6px'}>
                                            <NextImageWithFallback src = {item.path.startsWith('http') ? item.path : `https://storage.googleapis.com/${item.path}`} alt = 'image' fill style = {{ objectFit: 'contain' }} sizes='(max-width: 991px) 100vw, 49vw' loading='lazy' />
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </FormControl>
                        </Flex>
                    })
                }
            </Flex>
        </Flex>
    );
})

export default FeatureWithIconControlledForm;