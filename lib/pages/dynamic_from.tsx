"use client"
import { Flex, Skeleton } from "@chakra-ui/react";
import useLocalStorage from "../hooks/use_localstorage";
import dynamic from "next/dynamic";
import AppLayout from "../app/app_layout";
import { DynamicFormTemplate } from "../components/dynamic_form/types";
const DynamicFormRenderrer = dynamic(
    () => import('@/lib/components/dynamic_form/form_renderer/form_renderer'), 
    { 
        ssr: false, 
        loading: () => <Skeleton w = '100%' h = '100%' borderRadius={'10px'} />
    }
);
const DynamicFormBuilder = dynamic(
    () => import('@/lib/components/dynamic_form/form_builder/form_builder'), 
    { 
        ssr: false, 
        loading: () => <Skeleton w = '100%' h = '100%' borderRadius={'10px'} />
    }
);


export default function DynamicFormBuilderPage() {
    const [formTemplate, setFormTemplate] = useLocalStorage<DynamicFormTemplate>('form_template', []);

    const onSubmit = (data: DynamicFormTemplate) => setFormTemplate(data);
    
    return (
        <AppLayout>
            <Flex w = '100%' p = '10px' mt = '100px' direction={'column'} gap = '20px'>
                <DynamicFormBuilder initialData={formTemplate} onSubmit={onSubmit} />
                <Flex w = '100%' p = '20px' borderRadius={'10px'} bg = 'white'>
                    <DynamicFormRenderrer template={formTemplate} onSubmit={(answerData) => console.log(answerData)} />
                </Flex>
            </Flex>
        </AppLayout>
    );
}