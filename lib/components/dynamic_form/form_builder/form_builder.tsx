import { Button, Checkbox, Flex, FormControl, FormLabel, Icon, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useRadio, useRadioGroup, UseRadioProps } from "@chakra-ui/react";
import { forwardRef, PropsWithChildren, useImperativeHandle, useRef, useState } from "react";
import { DynamicFormTemplate, DynamicFormElementType, DynamicFormElement, SelectElement, MultiCheckboxElement, ElementSettings} from "../types";
import { Active, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent, DragOverEvent, DragStartEvent, MeasuringStrategy, DragOverlay, defaultDropAnimationSideEffects, DropAnimation } from "@dnd-kit/core";
import { AnimateLayoutChanges, arrayMove, defaultAnimateLayoutChanges, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { MdAddCircleOutline, MdDragIndicator, MdEdit } from "react-icons/md";
import { getElementDefaultSettings, ElementSkeleton, DynamicFormBuilderElement, DynamicFormBuilderElementSettingsForm } from "./elements";
import { v4 as uuidv4 } from 'uuid';
import { CSS } from "@dnd-kit/utilities";
import { FaRegTrashCan } from "react-icons/fa6";
import { createPortal } from "react-dom";
import RadioCard from "../../radio_card";

const elementListToRender: DynamicFormElementType[] = ['TEXT', 'SELECT', 'CHECKBOX', 'MULTI_CHECKBOX'];

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
};

type DynamicFormBuilderProps = {
    initialData?: DynamicFormTemplate,
    onSubmit: (data: DynamicFormTemplate) => void,
    headerActions?: boolean
}

const DynamicFormBuilder = forwardRef<{ getFormTemplate: () => DynamicFormTemplate | null }, DynamicFormBuilderProps>(({ initialData, onSubmit, headerActions = false }, forwardedRef) => {
    const [formTemplate, setFormTemplate] = useState<DynamicFormTemplate>([...(initialData ?? [])]);
    const [draggingElement, setDraggingElement] = useState<null | Active>(null);
    const [clonedItems, setClonedItems] = useState<null | typeof formTemplate>(null);
    const [addElementPopupData, setAddElementPopupData] = useState({ isOpen: false, element: null as DynamicFormElementType | null });
    const [editElementPopupData, setEditElementPopupData] = useState({ isOpen: false, element: null as DynamicFormTemplate[1] | null });
    const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const elementDataSubmitTriggerRef = useRef<{ getFormData: () => ElementSettings | null }>(null);
    const { getRootProps: getSelectElementRootProps, getRadioProps: getSelectElementRadioProps } = useRadioGroup({
        name: 'add_new_element_radio',
        onChange: async (element: DynamicFormElementType) => setAddElementPopupData(prev => ({ ...prev, element: element }))
    });

    const selectElementRadioGroup = getSelectElementRootProps();

    const onAddNewElement = (element: DynamicFormElementType) => {
        setFormTemplate(prev => [...prev, { id: uuidv4(), type: element, settings: getElementDefaultSettings(element) }])
        setAddElementPopupData(prev =>  ({ ...prev, isOpen: false }))
    }

    const onClickEditElement = (id: string) => setEditElementPopupData(prev => ({ ...prev, isOpen: true, element: formTemplate.find(item => item.id == id)! }))

    const onClickDeleteElement = (id: string) => setFormTemplate(prev => prev.filter(item => item.id != id))

    const onClickSaveElementData = () => {
        const elementData = elementDataSubmitTriggerRef.current?.getFormData?.();
        if(elementData == null) return ;
        setFormTemplate(prev => prev.map(element => element.id == editElementPopupData.element?.id ? { ...element, settings: elementData } : element));
        setEditElementPopupData(prev =>  ({ ...prev, isOpen: false }))
    }

    const onDragStart = (event: DragStartEvent) => {
        setClonedItems(formTemplate);
        setDraggingElement(event.active);
    }

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setDraggingElement(null);

        if(active == null || active.data.current == null || over == null || over.data.current == null) return ;

        if(active.id == over.id) return ;

        const temp: typeof formTemplate = JSON.parse(JSON.stringify(formTemplate));

        const activeIndex = temp.findIndex(e => e.id == active.id);
        const overIndex = temp.findIndex(e => e.id == over.id);

        setFormTemplate(prev => arrayMove(prev, activeIndex, overIndex))
    }

    const onDragCancel = () => {
        if (clonedItems) {
          // Reset items to their original state in case items have been
          // Dragged across containers
          setFormTemplate(clonedItems);
        }
    
        setDraggingElement(null)
        setClonedItems(null);
    };

    useImperativeHandle(forwardedRef, () => {
        return { getFormTemplate: onClickSubmit };
    }, [formTemplate]);

    const onClickSubmit = () => {
        onSubmit(formTemplate);
        return formTemplate;
    }

    return (
        <Flex w = '100%' direction={'column'}>
            {
                headerActions &&
                <Flex zIndex={999} h = '70px' w = '100%' bg = 'white' position={'fixed'} top = {'0px'} left = {'0px'} alignItems={'center'} justifyContent={'flex-end'} px = '20px' boxShadow={'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px'}>
                    <Button onClick={onClickSubmit} maxH = '40px' colorScheme='green'>Save</Button>
                </Flex>
            }
            <Modal scrollBehavior = 'inside' isOpen={addElementPopupData.isOpen} onClose={() => setAddElementPopupData(prev =>  ({ ...prev, isOpen: false }))}>
                <ModalOverlay />
                <ModalContent minW = {['0vw', '80vw', '80vw', '70vw', '1000px']}>
                    <ModalHeader>Choose Element</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody m = '0px'>
                        <Flex {...selectElementRadioGroup} w = '100%' flexWrap={'wrap'} gap = '15px' justifyContent={'center'}>
                            {
                                elementListToRender.map((element, index) => {
                                    return <RadioCard key = {index} {...getSelectElementRadioProps({ value: element })} isChecked = {addElementPopupData.element == element} borderRadius={'8px'}>
                                        <Flex minW = '300px' maxW = '300px' w = '100%'>
                                            <ElementSkeleton element = {element}  />
                                        </Flex>
                                    </RadioCard>
                                })
                            }
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button maxH = '40px' mr={3} onClick={() => setAddElementPopupData(prev =>  ({ ...prev, isOpen: false }))}>Close</Button>
                        <Button maxH = '40px' bg = 'green.200' onClick={() => addElementPopupData.element != null ? onAddNewElement(addElementPopupData.element!) : {}}>Add</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal scrollBehavior = 'inside' isOpen={editElementPopupData.isOpen} onClose={() => setEditElementPopupData(prev =>  ({ ...prev, isOpen: false }))}>
                <ModalOverlay />
                <ModalContent minW = {['0vw', '80vw', '80vw', '70vw', '1000px']}>
                    <ModalHeader>Edit Element</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody m = '0px'>
                        <DynamicFormBuilderElementSettingsForm element = {editElementPopupData.element} forwardedRef = {elementDataSubmitTriggerRef} />
                    </ModalBody>
                    <ModalFooter>
                        <Button maxH = '40px' mr={3} onClick={() => setEditElementPopupData(prev =>  ({ ...prev, isOpen: false }))}>Close</Button>
                        <Button maxH = '40px' bg = 'green.200' onClick={() => editElementPopupData.element != null ? onClickSaveElementData() : {}}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <DndContext 
                sensors={sensors}
                autoScroll
                //collisionDetection={closestCenter}
                modifiers={[restrictToWindowEdges, restrictToVerticalAxis]}
                onDragStart={onDragStart}
                //onDragOver={onDragOver}
                onDragEnd={onDragEnd}
                onDragCancel={onDragCancel}
                measuring={{
                    droppable: {
                        strategy: MeasuringStrategy.Always,
                    },
                }}
            >
                <Flex p = '10px' direction={'column'} minH = '400px' w = '100%' gap = '15px' boxShadow={'0 0 2px 1px rgba(0,0,0,0.1)'} borderRadius={'12px'} bg = {draggingElement != null ? 'rgb(235, 235, 235, 1)' : 'white'} transition={'background 300ms ease-out'}>
                    <SortableContext 
                        items={formTemplate}
                        strategy={verticalListSortingStrategy}
                    >
                        {
                            formTemplate.map((element, index) => {
                                return <DraggableElement 
                                    key = {element.id} 
                                    element = {element} 
                                    onEdit={() => onClickEditElement(element.id)}
                                    onRemove={() => onClickDeleteElement(element.id)}
                                />
                            })
                        }
                    </SortableContext>
                    <Button minW = '200px' w = '100%' h = '50px' onClick = {e => setAddElementPopupData(prev =>  ({ ...prev, isOpen: true, element: null }))} variant={'unstyled'} bg = 'white' borderRadius={'6px'} border = '1px' borderStyle={'dashed'} borderColor={'brand.borderColor'} _hover = {{ bg: 'gray.100' }}>
                        <Flex w = '100%' h = '100%' justifyContent={'center'} alignItems={'center'} gap = '10px'>
                            <Icon as = {MdAddCircleOutline} color = 'brand.borderColor' w = '30px' h = '30px' />
                            Add Element
                        </Flex>
                    </Button>
                </Flex>
                <DragOverlay dropAnimation={dropAnimation}>
                    {draggingElement ? draggingElement.data.current?.overlay : <></>}
                </DragOverlay>
            </DndContext>
        </Flex>
    );
})

export default DynamicFormBuilder;

const animateLayoutChanges: AnimateLayoutChanges = (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true });

type DraggableElementProps = {
    element: DynamicFormTemplate[1],
    onRemove: () => void,
    onEdit: () => void
}

const DraggableElement = ({ element, onRemove, onEdit }: DraggableElementProps) => {
    const {
        active,
        attributes,
        isDragging,
        listeners,
        over,
        setNodeRef,
        setActivatorNodeRef,
        transition,
        transform,
    } = useSortable({
        id: element.id,
        data: { 
            modifiers: [], 
            overlay: <Flex direction={'column'} minH = '100px' w = '100%' borderRadius={'8px'} bg = 'white'>
                <Flex direction={'row'} borderInline={'1px'} borderTop={'1px'} borderTopRadius={'8px'} borderColor={'brand.borderColor'}>
                    <Flex h = '100%' minH = '40px' w = '100%' transition={'background 150ms ease-in-out'} style = {{ touchAction: 'none' }}_hover = {{ bg: 'gray.100' }} borderTopLeftRadius={'8px'}>
                        <Icon m = 'auto' as = {MdDragIndicator} w = '22px' h = '22px' />
                    </Flex>
                    <IconButton minH = '40px' color={'gray.600'} aria-label="delete_item" w = '100%' h = '100%' variant={'ghost'} icon = {<Icon w = '18px' h = '18px' as = {MdEdit} />} borderInline={'1px'} borderRadius={'0px'} borderColor={'brand.borderColor'} />
                    <IconButton minH = '40px' color={'gray.600'} aria-label="delete_item" w = '100%' h = '100%' variant={'ghost'} icon = {<Icon w = '18px' h = '18px' as = {FaRegTrashCan} />} borderRadius={'0px'} borderTopRightRadius={'8px'} />
                </Flex>
                <Flex flexGrow={1} h = '100%' w = '100%' p = '15px' borderBottomRadius={'8px'} border = '1px' borderColor={'brand.borderColor'}>
                    <DynamicFormBuilderElement element = {element} />
                </Flex>
            </Flex>
        },
        animateLayoutChanges
    });
    
    return (
        <Flex ref = {setNodeRef} transform={CSS.Translate.toString(transform)} transition = {transition} opacity={isDragging ? '0.5' : '1'}>
            <Flex direction={'column'} minH = '100px' w = '100%' borderRadius={'8px'} bg = 'white'>
                <Flex direction={'row'} borderInline={'1px'} borderTop={'1px'} borderTopRadius={'8px'} borderColor={'brand.borderColor'}>
                    <Flex minH = '40px' ref = {setActivatorNodeRef} {...attributes} {...listeners} h = '100%' w = '100%' transition={'background 150ms ease-in-out'} style = {{ touchAction: 'none' }}_hover = {{ bg: 'gray.100' }} borderTopLeftRadius={'8px'}>
                        <Icon m = 'auto' as = {MdDragIndicator} w = '22px' h = '22px' />
                    </Flex>
                    <IconButton onClick = {onEdit} minH = '40px' color={'gray.600'} aria-label="delete_item" w = '100%' h = '100%' variant={'ghost'} icon = {<Icon w = '18px' h = '18px' as = {MdEdit} />} borderInline={'1px'} borderRadius={'0px'} borderColor={'brand.borderColor'} />
                    <IconButton onClick = {onRemove} minH = '40px' color={'gray.600'} aria-label="delete_item" w = '100%' h = '100%' variant={'ghost'} icon = {<Icon w = '18px' h = '18px' as = {FaRegTrashCan} />} borderRadius={'0px'} borderTopRightRadius={'8px'} />
                </Flex>
                <Flex h = '100%' w = '100%' p = '15px' borderBottomRadius={'8px'} border = '1px' borderColor={'brand.borderColor'}>
                    <DynamicFormBuilderElement element = {element} />
                </Flex>
            </Flex>
        </Flex>
    );
}