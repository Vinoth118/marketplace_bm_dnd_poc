import DynamicFormBuilder from "@/lib/components/dynamic_form/form_builder/form_builder";
import DynamicFormRenderrer from "@/lib/components/dynamic_form/form_renderer/form_renderer";
import { DynamicFormTemplate } from "@/lib/components/dynamic_form/types";
import { Input, Flex, FormControl, FormLabel, Modal, useDisclosure, Button, ModalOverlay, ModalFooter, ModalHeader, ModalCloseButton, ModalContent, ModalBody, IconButton, Icon } from "@chakra-ui/react";
import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import { IoMdEye } from "react-icons/io";
import { MdPreview } from "react-icons/md";
import { DynamicFormWidgetData } from "../../builder_types";

type DynamicFormWidgetDataFormProps = {
    data: DynamicFormWidgetData,
}

const DynamicFormWidgetDataForm = forwardRef<{ getFormData: () => DynamicFormWidgetData }, DynamicFormWidgetDataFormProps>(({ data }, forwardedRef) => {
    const [widgetName, setWidgetName] = useState(data?.customWidgetName ?? '');
    const formTemplateSubmitTriggerRef = useRef<{ getFormTemplate: () => DynamicFormTemplate | null }>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useImperativeHandle(forwardedRef, () => {
        return { 
            getFormData: () => {
                return {
                    widgetId: data.widgetId,
                    customWidgetName: widgetName.trim(),
                    widgetType: data?.widgetType,
                    data: formTemplateSubmitTriggerRef.current?.getFormTemplate() ?? []
                }
            } 
        };
    });

    return (
        <Flex w = '100%' direction={'column'} gap = '15px'>
            <Modal scrollBehavior = 'inside' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent minW = {['0vw', '80vw', '80vw', '70vw', '1000px']}>
                    <ModalHeader>Form template preview</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody m = '0px'>
                        <DynamicFormRenderrer template={formTemplateSubmitTriggerRef.current?.getFormTemplate() ?? []} initialAnswerData={[]} onSubmit={() => {}} />
                    </ModalBody>
                    <ModalFooter>
                        <Button maxH = '40px' onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <FormControl>
                <FormLabel>Custom widget name</FormLabel>
                <Input value = {widgetName} onChange={e => setWidgetName(e.target.value)} />
            </FormControl>
            <FormControl>
                <Flex mb = '10px' w = '100%' alignItems={'center'} gap = '10px'>
                    <FormLabel m = {0}>Dynamic information form template</FormLabel>
                    <IconButton size = 'sm' variant={'ghost'} onClick={onOpen} icon={<Icon w = '20px' h = '20px' as = {IoMdEye} />} aria-label="preview_form_icon" />
                </Flex>
                <DynamicFormBuilder ref = {formTemplateSubmitTriggerRef} initialData={data?.data ?? []} onSubmit={() => {}} />
            </FormControl>
        </Flex>
    );
})

export default DynamicFormWidgetDataForm;