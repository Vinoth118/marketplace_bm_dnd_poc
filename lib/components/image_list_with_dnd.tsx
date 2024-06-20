import { Flex, FormControl, FormLabel, FormErrorMessage, Input, IconButton, Icon } from "@chakra-ui/react";
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

type ImageItemType = { path: string; id: string, additional_field_1?: string, additional_field_2?: string };
type ImageItemTypeWithBothAditionalFields = Omit<ImageItemType, 'additional_field_1' | 'additional_field_2'> & { additional_field_1: string; additional_field_2: string };
type ImageItemTypeWithAditionalField1 = Omit<ImageItemType, 'additional_field_1'> & { additional_field_1: string; };
type ImageItemTypeWithAditionalField2 = Omit<ImageItemType, 'additional_field_2'> & { additional_field_2: string };

export type ConditionalImageItem<
  EnableField1 extends boolean,
  EnableField2 extends boolean
> = EnableField1 extends true
  ? EnableField2 extends true
    ? ImageItemTypeWithBothAditionalFields
    : ImageItemTypeWithAditionalField1
  : EnableField2 extends true
  ? ImageItemTypeWithAditionalField2
  : ImageItemType;

type ImageListWithDNDProps<EnableField1 extends boolean, EnableField2 extends boolean> = {
    currentList: ConditionalImageItem<EnableField1, EnableField2>[],
    onChangeList: (list: ConditionalImageItem<EnableField1, EnableField2>[]) => void,
    onChangeItemValue: (event: ChangeEvent<HTMLInputElement>, itemId: string, type: 'IMAGE_URL' | 'ADDITIONAL_FIELD_1' | 'ADDITIONAL_FIELD_2') => void,
    onRemoveItem: (itemId: string) => void,
    aditionalField1Label?: string,
    aditionalField2Label?: string,
}

type ConditionalLabels<
  EnableField1 extends boolean,
  EnableField2 extends boolean
> = EnableField1 extends true
  ? EnableField2 extends true
    ? { aditionalField1Label: string; aditionalField2Label: string }
    : { aditionalField1Label: string }
  : EnableField2 extends true
    ? { aditionalField2Label: string }
    : {};

type ConditionalImageListWithDNDProps<
    EnableField1 extends boolean,
    EnableField2 extends boolean
> = ImageListWithDNDProps<EnableField1, EnableField2> & ConditionalLabels<EnableField1, EnableField2>;

const ImageFormListWithDND = <EnableField1 extends boolean, EnableField2 extends boolean>({ currentList, onChangeList, onChangeItemValue, onRemoveItem, aditionalField1Label, aditionalField2Label }: ConditionalImageListWithDNDProps<EnableField1, EnableField2>) => {
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
                        return <ImageItem<EnableField1, EnableField2> 
                            key = {item.id} 
                            item = {item} 
                            onChange={onChangeItemValue} 
                            onRemove={onRemoveItem} 
                            aditionalField1Label={aditionalField1Label!}
                            aditionalField2Label={aditionalField2Label!}
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

export default ImageFormListWithDND;

type ImageItemProps<EnableField1 extends boolean, EnableField2 extends boolean> = {
    item: ConditionalImageItem<EnableField1, EnableField2>,
    onChange: (event: ChangeEvent<HTMLInputElement>, itemId: string, type: 'IMAGE_URL' | 'ADDITIONAL_FIELD_1' | 'ADDITIONAL_FIELD_2') => void,
    onRemove: (id: string) => void,
    aditionalField1Label?: string,
    aditionalField2Label?: string,
}

type ConditionalImageItemProps<
  EnableField1 extends boolean,
  EnableField2 extends boolean
> = ImageItemProps<EnableField1, EnableField2> & ConditionalLabels<EnableField1, EnableField2>;

const ImageItem = <EnableField1 extends boolean, EnableField2 extends boolean>({ item, onChange, onRemove, aditionalField1Label, aditionalField2Label }: ConditionalImageItemProps<EnableField1, EnableField2>) => {
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
            overlay:  <Flex 
                w = '100%' bg = 'white' borderRadius={'8px'} border = '1px' borderColor = 'brand.borderColor' 
                direction={['column-reverse', 'column-reverse', 'column', 'column', 'column']} pb = {aditionalField1Label == undefined && aditionalField2Label == undefined  ? '1px' : '0px'}
            >
                <Flex direction={['column', 'column', 'row', 'row', 'row']} justifyContent={'center'}>
                    <Flex w = '100%' h = {['200px', '200px', '100%', '100%', '100%']} minH = {aditionalField2Label != undefined ? '285px'  : '195px'} borderRightWidth = {['0px', '0px', '1px', '1px', '1px']} borderBottomWidth = {['1px', '1px', '0px', '0px', '0px']} borderColor = 'brand.borderColor' p = '15px'>
                        <Flex position={'relative'} w = {'100%'} minH = {'100%'}>
                            <NextImageWithFallback src = {item.path.startsWith('http') ? item.path : `https://storage.googleapis.com/${item.path}`} alt = 'image' fill style = {{ objectFit: 'contain' }} sizes='(max-width: 991px) 100vw, 49vw' loading='lazy' />
                        </Flex>
                    </Flex>
                    <Flex w = '100%' direction={'column'} gap = '10px' p = '15px'>
                        <FormControl>
                            <FormLabel>Image URL</FormLabel>
                            <Input defaultValue = {item.path} />
                            <FormErrorMessage></FormErrorMessage>
                        </FormControl>
                        {
                            aditionalField1Label &&
                            <FormControl>
                                <FormLabel>{aditionalField1Label}</FormLabel>
                                <Input defaultValue = {item.additional_field_1} />
                                <FormErrorMessage></FormErrorMessage>
                            </FormControl>
                        }
                        {
                            aditionalField2Label &&
                            <FormControl>
                                <FormLabel>{aditionalField2Label}</FormLabel>
                                <Input defaultValue = {item.additional_field_2} />
                                <FormErrorMessage></FormErrorMessage>
                            </FormControl>
                        }
                    </Flex>
                </Flex>
                <Flex 
                    w = {aditionalField1Label == undefined && aditionalField2Label == undefined ? ['100%', '100%', '50%', '50%', '50%'] : '100%'} 
                    position={aditionalField1Label == undefined && aditionalField2Label == undefined ? ['initial', 'initial', 'absolute', 'absolute', 'absolute'] : 'initial'} 
                    right = '0px' bottom={'0px'} alignItems={'center'} justifyContent={'center'} 
                    borderTopWidth={['0px', '0px', '1px', '1px', '1px']} borderBottomWidth = {['1px', '1px', '0px', '0px', '0px']} borderColor = 'brand.borderColor' h = '50px' pr = {aditionalField1Label == undefined && aditionalField2Label == undefined  ? '1px' : '0px'}
                >
                    <IconButton onClick={e => onRemove(item.id)} color={'gray.600'} aria-label="delete_item" ml = '1px' w = '100%' h = '100%' variant={'ghost'} icon = {<Icon w = '25px' h = '25px' as = {FaRegTrashCan} />} borderRadius={'0px'}  borderTopLeftRadius={['8px', '8px', '0px', '0px', '0px']} borderBottomLeftRadius={aditionalField1Label == undefined && aditionalField2Label == undefined ? '1px' : ['0px', '0px', '8px', '8px', '8px']} />
                    <Flex borderLeft={'1px'} h = '100%' w = '100%' style = {{ touchAction: 'none' }} _hover = {{ bg: 'gray.100' }} borderTopRightRadius={['8px', '8px', '0px', '0px', '0px']} borderBottomRightRadius={['0px', '0px', '8px', '8px', '8px']} borderColor = 'brand.borderColor'>
                        <Icon color={'gray.600'} m = 'auto' as = {MdDragIndicator} w = '30px' h = '30px' />
                    </Flex>
                </Flex>
            </Flex>
        },
    });
    
    const image = item.path.startsWith('http') ? item.path : `https://storage.googleapis.com/${item.path}`;

    return (
        <Flex 
            ref = {setNodeRef} transform={CSS.Translate.toString(transform)} transition = {transition} opacity={isDragging ? '0.5' : '1'} 
            w = '100%' bg = 'white' borderRadius={'8px'} border = '1px' borderColor = 'brand.borderColor' 
            direction={['column-reverse', 'column-reverse', 'column', 'column', 'column']} position={'relative'}
        >
            <Flex direction={['column', 'column', 'row', 'row', 'row']} justifyContent={'center'}>
                <Flex w = '100%' h = {['200px', '200px', '100%', '100%', '100%']} minH = '195px' borderRightWidth = {['0px', '0px', '1px', '1px', '1px']} borderBottomWidth = {['1px', '1px', '0px', '0px', '0px']} borderColor = 'brand.borderColor' p = '15px'>
                    <Flex position={'relative'} w = {'100%'} minH = {'100%'}>
                        <NextImageWithFallback src = {image} alt = 'image' fill style = {{ objectFit: 'contain' }} sizes='(max-width: 991px) 100vw, 49vw' loading='lazy' loadingSpinner />
                    </Flex>
                </Flex>
                <Flex w = '100%' direction={'column'} gap = '10px' p = '15px'>
                    <FormControl>
                        <FormLabel>Image URL</FormLabel>
                        <Input value = {item.path} onChange={e => onChange(e, item.id, 'IMAGE_URL')} />
                        <FormErrorMessage></FormErrorMessage>
                    </FormControl>
                    {
                        aditionalField1Label &&
                        <FormControl>
                            <FormLabel>{aditionalField1Label}</FormLabel>
                            <Input value = {item.additional_field_1} onChange={e => onChange(e, item.id, 'ADDITIONAL_FIELD_1')} />
                            <FormErrorMessage></FormErrorMessage>
                        </FormControl>
                    }
                    {
                        aditionalField2Label &&
                        <FormControl>
                            <FormLabel>{aditionalField2Label}</FormLabel>
                            <Input value = {item.additional_field_2} onChange={e => onChange(e, item.id, 'ADDITIONAL_FIELD_2')} />
                            <FormErrorMessage></FormErrorMessage>
                        </FormControl>
                    }
                </Flex>
            </Flex>
            <Flex 
                w = {aditionalField1Label == undefined && aditionalField2Label == undefined ? ['100%', '100%', '50%', '50%', '50%'] : '100%'} 
                position={aditionalField1Label == undefined && aditionalField2Label == undefined ? ['initial', 'initial', 'absolute', 'absolute', 'absolute'] : 'initial'} 
                right = '0px' bottom={'0px'} alignItems={'center'} justifyContent={'center'} 
                borderTopWidth={['0px', '0px', '1px', '1px', '1px']} borderBottomWidth = {['1px', '1px', '0px', '0px', '0px']} borderColor = 'brand.borderColor' h = '50px'
            >
                <IconButton onClick={e => onRemove(item.id)} color={'gray.600'} aria-label="delete_item" ml = '1px' w = '100%' h = '100%' variant={'ghost'} icon = {<Icon w = '25px' h = '25px' as = {FaRegTrashCan} />} borderRadius={'0px'} borderTopLeftRadius={['8px', '8px', '0px', '0px', '0px']} borderBottomLeftRadius={aditionalField1Label == undefined && aditionalField2Label == undefined ? '1px' : ['0px', '0px', '8px', '8px', '8px']} />
                <Flex borderLeft={'1px'} h = '100%' w = '100%' style = {{ touchAction: 'none' }} ref = {setActivatorNodeRef} {...attributes} {...listeners} _hover = {{ bg: 'gray.100' }} borderTopRightRadius={['8px', '8px', '0px', '0px', '0px']} borderBottomRightRadius={['0px', '0px', '8px', '8px', '8px']} borderColor = 'brand.borderColor'>
                    <Icon color={'gray.600'} m = 'auto' as = {MdDragIndicator} w = '30px' h = '30px' />
                </Flex>
            </Flex>
        </Flex>
    );
}