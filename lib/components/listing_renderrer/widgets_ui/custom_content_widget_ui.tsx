"use client"
import { Flex } from "@chakra-ui/react";
import { CustomContentWidgetAnswerData } from "../../template_form/types";

type CustomContentWidgetUIProps = {
    content: CustomContentWidgetAnswerData
}

const CustomContentWidgetUI = ({ content }: CustomContentWidgetUIProps) => {
    return (
        <Flex dangerouslySetInnerHTML={{ __html: content }}></Flex>
    );
}

export default CustomContentWidgetUI;
