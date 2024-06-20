import { Flex, FormControl, FormLabel, FormErrorMessage, Input, IconButton, Icon, Textarea } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { Active, defaultDropAnimationSideEffects, DndContext, DragCancelEvent, DragEndEvent, DragOverlay, DragStartEvent, DropAnimation, KeyboardSensor, MeasuringStrategy, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { MdDragIndicator } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import Image, { ImageProps } from 'next/image';
import { CSS } from "@dnd-kit/utilities";
import NextImageWithFallback from "./image_with_fallback";

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
};

export type QAndAItemType = { id: string, field_1: string, field_2: string };

type QandAFormListWithDNDProps = {
    currentList: QAndAItemType[],
    onChangeList: (list: QAndAItemType[]) => void,
    onChangeItemValue: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, itemId: string, type: 'FIELD_1' | 'FIELD_2') => void,
    onRemoveItem: (itemId: string) => void,
    field1Label: string,
    field2Label: string,
}

const QandAFormListWithDND = <EnableField1 extends boolean, EnableField2 extends boolean>({ currentList, onChangeList, onChangeItemValue, onRemoveItem, field1Label, field2Label }: QandAFormListWithDNDProps) => {
    const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const [draggingElement, setDraggingElement] = useState<null | Active>(null);

    const onDragStart = (event: DragStartEvent) => {
        setDraggingElement(event.active);
    }

    const onDragCancel = (event: DragCancelEvent) => {
        setDraggingElement(null);
    }

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setDraggingElement(null);
        if(over == null) return ;

        const activeIndex = currentList.findIndex(e => e.id == active.id)!
        const overIdex = currentList.findIndex(e => e.id == over.id)!
        
        onChangeList(arrayMove(currentList, activeIndex, overIdex));
    }

    return (
        <DndContext 
            sensors={sensors}
            autoScroll
            modifiers={[restrictToWindowEdges, restrictToVerticalAxis]}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}
            measuring={{
                droppable: {
                    strategy: MeasuringStrategy.Always,
                },
            }}
        >
            <SortableContext 
                items={currentList}
                strategy={verticalListSortingStrategy}
            >
                {
                    currentList.map((item, index) => {
                        return <QandAItem
                            key = {item.id} 
                            item = {item} 
                            onChange={onChangeItemValue} 
                            onRemove={onRemoveItem} 
                            field1Label={field1Label}
                            field2Label={field2Label}
                        />
                    })
                }
            </SortableContext>
            <DragOverlay dropAnimation={dropAnimation}>
                {draggingElement ? draggingElement.data.current?.overlay : <></>}
            </DragOverlay>
        </DndContext>
    );
}

export default QandAFormListWithDND;

type QandAItemProps = {
    item: QAndAItemType,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, itemId: string, type: 'FIELD_1' | 'FIELD_2') => void,
    onRemove: (id: string) => void,
    field1Label: string,
    field2Label: string
}

const QandAItem = ({ item, onChange, onRemove, field1Label, field2Label }: QandAItemProps) => {
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
        id: item.id,
        data: {
            overlay:  <Flex  w = '100%' bg = 'white' borderRadius={'10px'} border = '1px' borderColor = 'brand.borderColor'>
                <Flex flexGrow={1} direction={'column'} gap = '10px' p = '15px'>
                    <FormControl>
                        <FormLabel>{field1Label}</FormLabel>
                        <Input defaultValue = {item.field_1} />
                        <FormErrorMessage></FormErrorMessage>
                    </FormControl>
                    <FormControl>
                        <FormLabel>{field2Label}</FormLabel>
                        <Textarea defaultValue = {item.field_2} minH = '80px' />
                        <FormErrorMessage></FormErrorMessage>
                    </FormControl>
                </Flex>
                <Flex direction={'column'} borderLeft={'1px'} minW = '70px' borderColor = 'brand.borderColor' alignItems={'center'} justifyContent={'center'} borderRightRadius={'10px'}>
                    <Flex h = '100%' w = '100%' style = {{ touchAction: 'none' }}_hover = {{ bg: 'gray.100' }} borderTopRightRadius={'10px'} borderBottom = '1px' borderColor = 'brand.borderColor'>
                        <Icon m = 'auto' as = {MdDragIndicator} w = '30px' h = '30px' />
                    </Flex>
                    <IconButton color={'gray.600'} aria-label="delete_item" w = '100%' h = '100%' variant={'ghost'} icon = {<Icon w = '25px' h = '25px' as = {FaRegTrashCan} />} borderRadius={'0px'} borderBottomRightRadius={'10px'} />
                </Flex>
            </Flex>
        },
    });

    return (
        <Flex 
            ref = {setNodeRef} transform={CSS.Translate.toString(transform)} transition = {transition} opacity={isDragging ? '0.5' : '1'} 
            w = '100%' bg = 'white' borderRadius={'8px'} border = '1px' borderColor = 'brand.borderColor' 
        >
            <Flex flexGrow={1} direction={'column'} gap = '10px' p = '15px'>
                <FormControl>
                    <FormLabel>{field1Label}</FormLabel>
                    <Input value = {item.field_1} onChange={e => onChange(e, item.id, 'FIELD_1')} />
                    <FormErrorMessage></FormErrorMessage>
                </FormControl>
                <FormControl>
                    <FormLabel>{field2Label}</FormLabel>
                    <Textarea value = {item.field_2} onChange={e => onChange(e, item.id, 'FIELD_2')} minH = '80px' />
                    <FormErrorMessage></FormErrorMessage>
                </FormControl>
            </Flex>
            <Flex direction={'column'} borderLeft={'1px'} minW = '70px' borderColor = 'brand.borderColor' alignItems={'center'} justifyContent={'center'} borderRightRadius={'8px'}>
                <Flex h = '100%' w = '100%' style = {{ touchAction: 'none' }} ref = {setActivatorNodeRef} {...attributes} {...listeners} _hover = {{ bg: 'gray.100' }} borderTopRightRadius={'8px'} borderBottom = '1px' borderColor = 'brand.borderColor'>
                    <Icon color={'gray.600'} m = 'auto' as = {MdDragIndicator} w = '30px' h = '30px' />
                </Flex>
                <IconButton onClick={e => onRemove(item.id)} color={'gray.600'} aria-label="delete_item" w = '100%' h = '100%' variant={'ghost'} icon = {<Icon w = '25px' h = '25px' as = {FaRegTrashCan} />} borderRadius={'0px'} borderBottomRightRadius={'8px'} />
            </Flex>
        </Flex>
    );
}