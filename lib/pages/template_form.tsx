"use client"
import { Flex, Skeleton } from "@chakra-ui/react";
import useLocalStorage from "../hooks/use_localstorage";
import { Template } from "../components/listing_template_builder/builder_types";
import dynamic from "next/dynamic";
import AppLayout from "../app/app_layout";
import { TemplateAnswer } from "../components/template_form/types";
const TemplateFormRenderrer = dynamic(
    () => import('@/lib/components/template_form/template_form'), 
    { 
        ssr: false, 
        loading: () => <Flex w = '100vw' h = '100vh'>
            <Skeleton w = '100%' h = '100%' borderRadius={'10px'} />
        </Flex> 
    }
);


export default function TemplateFormPage() {
    const [localTemplate, setLocalTemplate] = useLocalStorage<Template>('template', { name: '', data: [], widgetData: [] });
    const [localAnswerData, setLocalAnswerData] = useLocalStorage<TemplateAnswer>('template_answers', []);

    const onSubmit = (data: TemplateAnswer) => setLocalAnswerData(data);

    return (
        <AppLayout>
            <Flex w = '100%' p = '10px' mt = '100px'>
                <TemplateFormRenderrer template={localTemplate} initialData={localAnswerData} onSubmit = {onSubmit} />
            </Flex>
        </AppLayout>
    );
}