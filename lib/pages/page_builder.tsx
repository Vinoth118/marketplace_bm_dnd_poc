"use client"
import { Flex, Skeleton } from "@chakra-ui/react";
import useLocalStorage from "../hooks/use_localstorage";
import { Template } from "../components/listing_template_builder/builder_types";
import dynamic from "next/dynamic";
const Builder = dynamic(
    () => import('@/lib/components/listing_template_builder/builder'), 
    { 
        ssr: false, 
        loading: () => <Flex w = '100vw' h = '100vh' px = '50px' py = '100px'>
            <Skeleton w = '100%' h = '100%' borderRadius={'10px'} />
        </Flex> 
    }
);

export default function PageBuilder() {
    const [localData, setLocalData] = useLocalStorage<Template>('template', { name: '', data: [], widgetData: [] });

    const onSubmit = (data: Template) => {
        setLocalData(data)
    }
    return (
        <Flex w = '100%' h = '100vh' direction={'column'} overflow={'scroll'}>
            <Builder initialData={localData} onSubmit={onSubmit} />
        </Flex>
    );
}