"use client"
import { Flex, Skeleton } from "@chakra-ui/react";
import useLocalStorage from "../hooks/use_localstorage";
import { Template } from "../components/listing_template_builder/builder_types";
import dynamic from "next/dynamic";
import AppLayout from "../app/app_layout";
import { TemplateAnswer } from "../components/template_form/types";
const ListingRenderrerRenderrer = dynamic(
    () => import('@/lib/components/listing_renderrer/listing_renderrer'), 
    { 
        ssr: false, 
        loading: () => <Flex w = '100vw' h = '100vh'>
            <Skeleton w = '100%' h = '100%' borderRadius={'10px'} />
        </Flex> 
    }
);


export default function ListingPage() {
    const [localTemplate] = useLocalStorage<Template>('template', { name: '', data: [], widgetData: [] });
    const [localAnswerData] = useLocalStorage<TemplateAnswer>('template_answers', []);

    return (
        <AppLayout rootProps={{ bg: 'white' }}>
            <Flex w = '100%' my = '100px'>
                <ListingRenderrerRenderrer template={localTemplate} listingData={localAnswerData} />
            </Flex>
        </AppLayout>
    );
}