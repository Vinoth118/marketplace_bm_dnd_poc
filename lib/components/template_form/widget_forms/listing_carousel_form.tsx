import { Flex } from "@chakra-ui/react";
import { ListingCarouselWidgetAnswerData, WidgetAnswer } from "../types";
import { forwardRef, useEffect, useState } from "react";
import { getWidgetDefaultAnsweData } from ".";

type ListingCarouselFormProps = {
    initialData?: ListingCarouselWidgetAnswerData,
    onSubmit: (data: ListingCarouselWidgetAnswerData) => void
}

const ListingCarouselForm = forwardRef<{ getFormData: () => WidgetAnswer['data'] | null }, ListingCarouselFormProps>(({ initialData, onSubmit }, forwardedRef) => {
    const [data, setData] = useState(initialData ?? getWidgetDefaultAnsweData('IMAGE_SECTION') as ListingCarouselWidgetAnswerData)

    useEffect(() => setData(initialData ?? getWidgetDefaultAnsweData('IMAGE_SECTION') as ListingCarouselWidgetAnswerData), [initialData])

    const onClickSubmit = () => {
        onSubmit(data);
    }

    return (
        <Flex w = '100%' direction={'column'}></Flex>
    );
})

export default ListingCarouselForm;