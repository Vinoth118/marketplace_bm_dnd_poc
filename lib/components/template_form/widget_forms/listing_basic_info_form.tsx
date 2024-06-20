import { Flex } from "@chakra-ui/react";
import { ListingBasicInfoWidgetAnswerData, WidgetAnswer } from "../types";
import { forwardRef, useEffect, useState } from "react";
import { getWidgetDefaultAnsweData } from ".";

type ListingBasicInfoFormProps = {
    initialData?: ListingBasicInfoWidgetAnswerData,
    onSubmit: (data: ListingBasicInfoWidgetAnswerData) => void
}

const ListingBasicInfoForm = forwardRef<{ getFormData: () => WidgetAnswer['data'] | null }, ListingBasicInfoFormProps>(({ initialData, onSubmit }, forwardedRef) => {
    const [data, setData] = useState(initialData ?? getWidgetDefaultAnsweData('IMAGE_SECTION') as ListingBasicInfoWidgetAnswerData)

    useEffect(() => setData(initialData ?? getWidgetDefaultAnsweData('IMAGE_SECTION') as ListingBasicInfoWidgetAnswerData), [initialData])

    const onClickSubmit = () => {
        onSubmit(data);
    }

    return (
        <Flex w = '100%' direction={'column'}></Flex>
    );
})

export default ListingBasicInfoForm;