"use client"
import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, FlexProps, Heading, Icon, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, useRadioGroup } from "@chakra-ui/react";
import { Template, Widget } from './builder_types';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverEvent, DragStartEvent, TouchSensor, DragOverlay, Active, MeasuringStrategy, DropAnimation, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { AnimateLayoutChanges, arrayMove, defaultAnimateLayoutChanges, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PropsWithChildren,useRef, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { v4 as uuidv4 } from 'uuid';
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { MdAddCircleOutline, MdDragIndicator, MdEdit } from "react-icons/md";
import WidgetSkeleton, { getDefaultDataForTemplateWidgets, WidgetDataForm, widgetsWhichHasData } from "./widgets";
import RadioCard from "../radio_card";

const widget_list: Widget['type'][] = ['IMAGE_SECTION', 'DETAILS_WITH_ICON', 'DETAILS_WITH_ICON_CONTROLLED', 'LISTING_CAROUSEL', 'FEATURE_HIGHLIGHTER', 'DYNAMIC_FORM', 'IMAGE_CAROUSEL', 'FEATURE_WITH_ICON', 'FEATURE_WITH_ICON_CONTROLLED', 'EXPANDABLE', 'CUSTOM_CONTENT', 'LISTING_BASIC_INFO'];
const widget_list_to_render = [...widget_list, /*...shuffleArray([...widget_list])*/];

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
};

type ListingTemplateBuilderProps = {
    initialData: Template,
    onSubmit: (data: Template) => void
}

const ListingTemplateBuilder = ({ initialData, onSubmit }: ListingTemplateBuilderProps) => {
    const [templateData, setTemplateData] = useState<Template>({ name: initialData.name ?? '', data: initialData.data ?? [], widgetData: initialData?.widgetData ?? [] });
    const [draggingElement, setDraggingElement] = useState<null | Active>(null);
    const [clonedItems, setClonedItems] = useState<null | typeof templateData>(null);
    const [widgetPopupData, setWidgetPopupData] = useState({ isOpen: false, row_id: null as string | null, column_id: null as string | null, widget: null as Widget['type'] | null });
    const [editWidgetPopupData, setEditWidgetPopupData] = useState({ isOpen: false, widgetId: null as string | null, widgetName: null as string | null, widgetType: null as Widget['type'] | null, data: null as Template['widgetData'][1] | null });
    const widgetDataSubmitTriggerRef = useRef<{ getFormData: () => Template['widgetData'][1] }>(null);
    const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
    const { getRootProps: getSelectWidgetRootProps, getRadioProps: getSelectWidgetRadioProps } = useRadioGroup({
        name: 'to_be_added_widget_radio',
        onChange: async (widget: Widget['type']) => setWidgetPopupData(prev => ({ ...prev, widget: widget }))
    });

    const selectWidgetRadioGroup = getSelectWidgetRootProps();

    const onAddNewRow = () => {
        setTemplateData(prev => ({ ...prev, data: [...prev.data, { id: uuidv4(), columns: [] }] }))
    };
    const onAddNewColumn = (row_id: string) => {
        setTemplateData(prev => ({ 
            ...prev, 
            data: prev.data.map(e => {
                const row: typeof e = JSON.parse(JSON.stringify(e));
                if(row.id == row_id) row.columns.push({ id: uuidv4(), widgets: [] });
                return row;
            }) 
        }))
    };
    const onAddNewWidget = (row_id: string, col_id: string, widget: Widget['type']) => {
        const generatedId = uuidv4();
        const isWidgetHasData = widgetsWhichHasData.includes(widget);
        const widgetData: Template['widgetData'][1] = { ...getDefaultDataForTemplateWidgets(widget), widgetId: generatedId };
        setTemplateData(prev => ({ 
            ...prev, 
            data: prev.data.map(e => {
                const row: typeof e = JSON.parse(JSON.stringify(e));
                if(row.id == row_id) {
                    row.columns.map(col => {
                        if(col.id == col_id) col.widgets.push({ id: generatedId, type: widget })
                    })
                }
                return row;
            }),
            widgetData: isWidgetHasData == false ? prev.widgetData : [...prev.widgetData, widgetData]
        }))
        setWidgetPopupData({ isOpen: false, row_id: null, column_id: null, widget: null });
    }

    const onRemoveRow = (row_id: string) => {
        const row = templateData.data.find(e => e.id == row_id)!;
        const toBeRemovedWidgets = row.columns.flatMap(col => col.widgets.filter(e => widgetsWhichHasData.includes(e.type)).map(e => e.id));
        setTemplateData(prev => ({
            ...prev,
            data: prev.data.filter(e => e.id != row_id),
            widgetData: prev.widgetData.filter(e => toBeRemovedWidgets.includes(e.widgetId) == false)
        }))
    }
    const onRemoveColumn = (col_id: string, rowIndex: number) => {
        const col = templateData.data[rowIndex].columns.find(e => e.id == col_id)!;
        const toBeRemovedWidgets = col.widgets.filter(e => widgetsWhichHasData.includes(e.type)).map(e => e.id);
        setTemplateData(prev => ({
            ...prev,
            data: prev.data.map(e => {
                const row: typeof e = JSON.parse(JSON.stringify(e));
                row.columns = row.columns.filter(e => e.id != col_id);
                return row;
            }),
            widgetData: prev.widgetData.filter(e => toBeRemovedWidgets.includes(e.widgetId) == false)
        }))
    }
    const onRemoveWidget = (widget_id: string, rowIndex: number, colIndex: number) => {
        const templateWidget = templateData.data[rowIndex].columns[colIndex].widgets.find(e => e.id == widget_id)!;
        const isWidgetHasData = widgetsWhichHasData.includes(templateWidget.type);
        setTemplateData(prev => ({
            ...prev,
            data: prev.data.map(e => {
                const row: typeof e = JSON.parse(JSON.stringify(e));
                row.columns.map(col => {
                    col.widgets = col.widgets.filter(e => e.id != widget_id);
                })
                return row;
            }),
            widgetData: isWidgetHasData == false ? prev.widgetData : prev.widgetData.filter(e => e.widgetId != widget_id)
        }))
    }

    const onClickEditWidget = (widgetId: string, rowIndex: number, colIndex: number) => {
        const widgetData = templateData.widgetData.find(e => e.widgetId == widgetId);
        const templateWidget = templateData.data[rowIndex].columns[colIndex].widgets.find(e => e.id == widgetId);
        if(widgetData == null || templateWidget == null) return ;
        const widgetName = widgetData?.customWidgetName && widgetData?.customWidgetName.trim() != '' ? widgetData?.customWidgetName : templateWidget.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
        setEditWidgetPopupData({ 
            isOpen: true, 
            widgetId: widgetId, 
            widgetName: widgetName,
            widgetType: templateWidget.type,
            data: widgetData
        });
    } 
    const onClickSaveWidgetData = () => {
        const widgetData = widgetDataSubmitTriggerRef.current?.getFormData();
        console.log(widgetData)
        const widgetId = editWidgetPopupData.widgetId;
        if(widgetData == null) return ;
        setTemplateData(prev => ({
            ...prev,
            widgetData: prev.widgetData.map(e => {
                if(e.widgetId == widgetId) {
                    return { ...e, ...widgetData };
                }
                return e;
            })
        }))
        setEditWidgetPopupData(prev => ({ ...prev, isOpen: false }));
    }

    const onDragStart = (event: DragStartEvent) => {
        setClonedItems(templateData);
        setDraggingElement(event.active);
    }

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        if(active == null || active.data.current == null || over == null || over.data.current == null) return ;

        if(active.id == over.id) return ;

        const temp: typeof templateData = JSON.parse(JSON.stringify(templateData));

        const overType = over.data.current.type as 'ROW' | 'COLUMN' | 'WIDGET';

        if(active.data.current.type == 'COLUMN') {
            const activeColumnRow = temp.data.find(row => row.columns.findIndex(col => col.id == active.id) > -1)!;
            const activeColum = activeColumnRow.columns.find(col => col.id == active.id)!;
            let overRow = activeColumnRow;
            if(overType == 'ROW') overRow = temp.data.find(row => row.id == over.id)!;
            if(overType == 'COLUMN') overRow = temp.data.find(row => row.columns.findIndex(col => col.id == over.id) > -1)!;
            if(overType == 'WIDGET') overRow = temp.data.find(row => row.columns.findIndex(col => col.widgets.findIndex(wid => wid.id == over.id) > -1) > -1)!;
            
            const isOveredOnAnotherRow = activeColumnRow.id != overRow.id;
            const overRowIndex = temp.data.findIndex(row => row.id == overRow.id);
            let activeIndex = -1;
            let overIndex = -1;
            if(isOveredOnAnotherRow) {
                temp.data.forEach(row => {
                    if(row.id == activeColumnRow.id) row.columns = row.columns.filter(col => col.id != active.id);
                    if(row.id == overRow.id) {
                        row.columns.push(activeColum);
                        activeIndex = row.columns.length - 1;
                    }
                });
                const overColumn = overType == 'WIDGET' ? 
                    temp.data[overRowIndex].columns.find(col => col.widgets.findIndex(wid => wid.id == over.id) > -1)! : overType == 'COLUMN' ?
                    temp.data[overRowIndex].columns.find(col => col.id == over.id)! :
                    undefined;
                overIndex = temp.data[overRowIndex].columns.findIndex(col => col.id == overColumn?.id) ??  temp.data[overRowIndex].columns.length - 1;
            } else {
                activeIndex = temp.data[overRowIndex].columns.findIndex(e => e.id == active.id);
                overIndex = temp.data[overRowIndex].columns.findIndex(e => e.id == over.id);
            }

            temp.data[overRowIndex].columns = arrayMove(temp.data[overRowIndex].columns, activeIndex, overIndex)
        }

        if(active.data.current.type == 'WIDGET') {
            if(overType == 'ROW') return ;
            
            let activeWidgetColumn: typeof temp.data[0]['columns'][0] | undefined;
            let activeWidget: typeof temp.data[0]['columns'][0]['widgets'][0] | undefined;
            const activeWidgetRow = temp.data.find(row => {
                const column = row.columns.find(col => {
                    const widget = col.widgets.find(wid => wid.id == active.id);
                    if(widget != null) activeWidget = widget;
                    return widget != null;
                });
                if(column != null) activeWidgetColumn = column;
                return column != null;
            })!;
            let overRow = activeWidgetRow;
            let overRowIndex = -1;
            let overColumn = activeWidgetColumn;
            let overColumnIndex = -1;
            
            if(overType == 'COLUMN') {
                overRowIndex = temp.data.findIndex(row => {
                    const columnIndex = row.columns.findIndex(col => col.id == over.id);
                    if(columnIndex > -1) {
                        overColumn = row.columns[columnIndex];
                        overColumnIndex = columnIndex;
                    }
                    return columnIndex > -1;
                })!;
                overRow = temp.data[overRowIndex];
            }
            if(overType == 'WIDGET') {
                overRowIndex = temp.data.findIndex(row => {
                    const columnIndex = row.columns.findIndex(col => col.widgets.findIndex(wid => wid.id == over.id) > -1);
                    if(columnIndex > -1) {
                        overColumn = row.columns[columnIndex];
                        overColumnIndex = columnIndex;
                    }
                    return columnIndex > -1;
                })!;
                overRow = temp.data[overRowIndex];
            }

            const isOveredOnAnotherRow = activeWidgetRow.id != overRow.id;
            const isOveredOnAnotherColumn = activeWidgetColumn!.id != overColumn!.id;
            let activeIndex = -1;
            let overIndex = -1;
            
            if(isOveredOnAnotherRow) {
                const activeRowIndex = temp.data.findIndex(row => row.id == activeWidgetRow.id);
                const activeColumnIndex = temp.data[activeRowIndex].columns.findIndex(col => col.id == activeWidgetColumn!.id);
                temp.data[activeRowIndex].columns[activeColumnIndex].widgets = temp.data[activeRowIndex].columns[activeColumnIndex].widgets.filter(wid => wid.id != active.id);
                temp.data[overRowIndex].columns[overColumnIndex].widgets.push(activeWidget!);
                activeIndex = temp.data[overRowIndex].columns[overColumnIndex].widgets.length - 1;

                const overWidget = overType == 'WIDGET' ? temp.data[overRowIndex].columns[overColumnIndex].widgets.find(wid => wid.id == over.id)! : undefined;
                overIndex = temp.data[overRowIndex].columns[overColumnIndex].widgets.findIndex(wid => wid.id == overWidget?.id) ??  temp.data[overRowIndex].columns[overColumnIndex].widgets.length - 1;
            } else {
                if(isOveredOnAnotherColumn) {
                    temp.data[overRowIndex].columns.forEach(col => {
                        if(col.id == activeWidgetColumn!.id) col.widgets = col.widgets.filter(col => col.id != active.id);
                        if(col.id == overColumn!.id) {
                            col.widgets.push(activeWidget!);
                            activeIndex = col.widgets.length - 1;
                        }
                    });
                    const overWidget = overType == 'WIDGET' ? temp.data[overRowIndex].columns[overColumnIndex].widgets.find(wid => wid.id == over.id)! : undefined;
                    overIndex = temp.data[overRowIndex].columns[overColumnIndex].widgets.findIndex(wid => wid.id == overWidget?.id) ??  temp.data[overRowIndex].columns[overColumnIndex].widgets.length - 1;
                } else {
                    activeIndex = temp.data[overRowIndex].columns[overColumnIndex].widgets.findIndex(e => e.id == active.id);
                    overIndex = temp.data[overRowIndex].columns[overColumnIndex].widgets.findIndex(e => e.id == over.id);
                }
            }

            temp.data[overRowIndex].columns[overColumnIndex].widgets = arrayMove(temp.data[overRowIndex].columns[overColumnIndex].widgets, activeIndex, overIndex).filter(Boolean);
        }

        if(JSON.stringify(templateData) != JSON.stringify(temp)) setTemplateData(temp);
    }

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setDraggingElement(null);

        if(active == null || active.data.current == null || over == null || over.data.current == null) return ;

        if(active.id == over.id) return ;

        const temp: typeof templateData = JSON.parse(JSON.stringify(templateData));

        if(active.data.current.type == 'ROW') {
            const activeIndex = temp.data.findIndex(e => e.id == active.id);
            const overIndex = temp.data.findIndex(e => e.id == over.id);

            setTemplateData(prev => ({ ...prev, data: arrayMove(prev.data, activeIndex, overIndex) }))
        }
        
    }

    const onDragCancel = () => {
        if (clonedItems) {
          // Reset items to their original state in case items have been
          // Dragged across containers
          setTemplateData(clonedItems);
        }
    
        setDraggingElement(null)
        setClonedItems(null);
    };

    const onClickSubmit = () => {
        onSubmit(templateData)
    }

    return (
        <Flex w = '100%' h= '100%' direction={'column'} px = '50px' py = '100px'>
            <Flex zIndex={999} h = '70px' w = '100%' bg = 'white' position={'fixed'} top = {'0px'} left = {'0px'} alignItems={'center'} justifyContent={'flex-end'} px = '20px' boxShadow={'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px'}>
                <Button onClick={onClickSubmit} maxH = '40px' colorScheme='green'>Save</Button>
            </Flex>
            <Flex 
                w = 'fit-content' minW = '100%' h = 'fit-content' 
                direction={'column'} gap = '10px' p = '10px' 
                bg = {draggingElement?.data?.current?.type == 'ROW' ? 'rgb(235, 235, 235, 1)' : 'white'} borderRadius={'12px'}
                boxShadow={'0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)'}
            >
                
                <Modal scrollBehavior = 'inside' isOpen={widgetPopupData.isOpen} onClose={() => setWidgetPopupData(prev =>  ({ ...prev, isOpen: false }))}>
                    <ModalOverlay />
                    <ModalContent minW = {['0vw', '80vw', '80vw', '70vw', '1000px']}>
                        <ModalHeader>Choose Widget</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody m = '0px'>
                            <Flex {...selectWidgetRadioGroup} w = '100%' flexWrap={'wrap'} gap = '15px' justifyContent={'center'}>
                                {
                                    widget_list_to_render.map((widget, index) => {
                                        return <RadioCard key = {index} {...getSelectWidgetRadioProps({ value: widget })} isChecked = {widgetPopupData.widget == widget} borderRadius={'8px'}>
                                            <Flex minW = '300px' maxW = '300px' w = '100%'>
                                                <WidgetSkeleton widget = {widget}  />
                                            </Flex>
                                        </RadioCard>
                                    })
                                }
                            </Flex>
                        </ModalBody>
                        <ModalFooter>
                            <Button maxH = '40px' mr={3} onClick={() => setWidgetPopupData(prev =>  ({ ...prev, isOpen: false }))}>Close</Button>
                            <Button maxH = '40px' bg = 'green.200' onClick={() => onAddNewWidget(widgetPopupData.row_id!, widgetPopupData.column_id!, widgetPopupData.widget!)}>Add</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Drawer
                    isOpen={editWidgetPopupData.isOpen}
                    size = 'xl'
                    placement='right'
                    onClose={() => setEditWidgetPopupData(prev => ({ ...prev, isOpen: false }))}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Edit {editWidgetPopupData.widgetName}</DrawerHeader>

                        <DrawerBody>
                            <WidgetDataForm 
                                forwardedRef={widgetDataSubmitTriggerRef}
                                widgetId={editWidgetPopupData.widgetId}
                                widgetType={editWidgetPopupData.widgetType}
                                widgetData={editWidgetPopupData.data}
                            />
                        </DrawerBody>

                        <DrawerFooter>
                            <Button variant='outline' mr={3} px = '30px' onClick={() => setEditWidgetPopupData(prev => ({ ...prev, isOpen: false }))}> Cancel</Button>
                            <Button colorScheme='green' px = '40px' onClick={onClickSaveWidgetData}>Save</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
                <DndContext 
                    sensors={sensors}
                    autoScroll
                    //collisionDetection={closestCenter}
                    modifiers={[restrictToWindowEdges, ...draggingElement?.data?.current?.modifiers ?? []]}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                    onDragCancel={onDragCancel}
                    measuring={{
                        droppable: {
                        strategy: MeasuringStrategy.Always,
                        },
                    }}
                >
                    <Flex w = '100%' direction={'column'} gap = '10px'>
                        <SortableContext 
                            items={templateData.data}
                            strategy={verticalListSortingStrategy}
                        >
                            {
                                templateData.data.map((row, rowIndex) => {
                                    return <DroppableSortableContainer 
                                        key = {row.id}
                                        id = {row.id}
                                        DroppableComponent={Row}
                                        type = 'ROW'
                                        droppableProps={{ postion: rowIndex, onRemove: () => onRemoveRow(row.id), childIds: row.columns.map(e => e.id) }}
                                    >
                                        <SortableContext 
                                            items={row.columns}
                                            strategy={horizontalListSortingStrategy}
                                        >
                                            {
                                                row.columns.map((col, colIndex) => {
                                                    return <DroppableSortableContainer 
                                                        key = {col.id}
                                                        id = {col.id}
                                                        DroppableComponent={Column}
                                                        type = 'COLUMN'
                                                        droppableProps={{ postion: colIndex, onRemove: () => onRemoveColumn(col.id, rowIndex), childIds: col.widgets.map(e => e.id) }}
                                                    >
                                                            <SortableContext 
                                                                items={col.widgets}
                                                                strategy={verticalListSortingStrategy}
                                                            >
                                                                {
                                                                    col.widgets.map((widget, index) => {
                                                                        const isEditable = widgetsWhichHasData.includes(widget.type);
                                                                        const customName = templateData.widgetData.find(e => e.widgetId == widget.id)?.customWidgetName;
                                                                        return <WidgetCard 
                                                                            key = {widget.id} 
                                                                            id = {widget.id} 
                                                                            widget={widget} 
                                                                            customWidgetName={customName && customName.trim() != '' ? customName : null}
                                                                            position={index} 
                                                                            canEdit={isEditable} 
                                                                            onRemove={() => onRemoveWidget(widget.id, rowIndex, colIndex)} 
                                                                            onEdit={() => isEditable ? onClickEditWidget(widget.id, rowIndex, colIndex) : {}} 
                                                                        />
                                                                    })  
                                                                }
                                                                <Spacer />
                                                                <Button minW = '200px' w = '100%' h = '50px' onClick = {e => setWidgetPopupData(prev =>  ({ ...prev, isOpen: true, row_id: row.id, column_id: col.id, widget: null }))} variant={'unstyled'} bg = 'white' borderRadius={'6px'} border = '1px' borderStyle={'dashed'} borderColor={'brand.borderColor'} _hover = {{ bg: 'gray.100' }}>
                                                                    <Flex w = '100%' h = '100%' justifyContent={'center'} alignItems={'center'} gap = '10px'>
                                                                        <Icon as = {MdAddCircleOutline} color = 'brand.borderColor' w = '30px' h = '30px' />
                                                                        Add Widget
                                                                    </Flex>
                                                                </Button>
                                                            </SortableContext>
                                                    </DroppableSortableContainer>
                                                })
                                            }
                                            <Button minW = '400px' minH = '400px' onClick = {e => onAddNewColumn(row.id)} variant={'unstyled'} borderRadius={'10px'} border = '1px' borderStyle={'dashed'} borderColor={'brand.borderColor'} _hover = {{ bg: 'gray.100' }}>
                                                <Flex w = '100%' h = '100%' direction={'column'} justifyContent={'center'} alignItems={'center'} gap = '20px'>
                                                    <Icon as = {MdAddCircleOutline} color = 'brand.borderColor' w = '70px' h = '70px' />
                                                    Add Column
                                                </Flex>
                                            </Button>
                                        </SortableContext>
                                    </DroppableSortableContainer>
                                })
                            }
                        </SortableContext>
                        <Button maxW = '90vw' w = '100%' h = '200px' onClick = {onAddNewRow} variant={'unstyled'} borderRadius={'10px'} border = '1px' borderStyle={'dashed'} borderColor={'brand.borderColor'} _hover = {{ bg: 'gray.100' }}>
                            <Flex w = '100%' h = '100%' direction={'column'} justifyContent={'center'} alignItems={'center'} gap = '20px'>
                                <Icon as = {MdAddCircleOutline} color = 'brand.borderColor' w = '70px' h = '70px' />
                                Add Row
                            </Flex>
                        </Button>
                    </Flex>
                    {
                        typeof window != 'undefined' &&
                        createPortal(
                            <DragOverlay dropAnimation={dropAnimation}>
                                {draggingElement ? draggingElement.data.current?.overlay : <></>}
                            </DragOverlay>,
                            document.body
                        )
                    }
                </DndContext>
            </Flex>
        </Flex>
        
    );
}

export default ListingTemplateBuilder;

const animateLayoutChanges: AnimateLayoutChanges = (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true });

type DroppableSortableContainerProps = {
    id: string,
    DroppableComponent: typeof Row,
    type: 'COLUMN' | 'ROW'
    droppableProps: { postion: number, onRemove: () => void, childIds: string[] }
} & PropsWithChildren

const DroppableSortableContainer = ({ id, children, type, DroppableComponent, droppableProps }: DroppableSortableContainerProps) => {
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
        id,
        data: { 
            type: type, 
            //modifiers: type == 'ROW' ? [restrictToVerticalAxis] : [], 
            modifiers: [], 
            overlay: <DroppableComponent 
                position = {droppableProps.postion} 
                onRemove={droppableProps.onRemove} 
                style = {{ 
                    maxW: '50vw', 
                    minH: type == 'ROW' ? '200px' : '400px', maxH: '400px', 
                    overflow: 'hidden', bg: 'white', 
                    boxShadow: '0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)' 
                }}
            >
                {children}
            </DroppableComponent>
        },
        animateLayoutChanges
    });

    const isOver = (active != null && over != null && active.data.current?.type == 'WIDGET' && type == 'COLUMN' && droppableProps.childIds.includes(active?.id as string ?? '')) || 
        (active != null && over != null && active.data.current?.type == 'COLUMN' && type == 'ROW' && droppableProps.childIds.includes(active?.id as string ?? ''))
    
    return (
        <Flex ref = {setNodeRef} transform={CSS.Translate.toString(transform)} transition = {transition} opacity={isDragging ? '0.5' : '1'}>
            <DroppableComponent 
                dragHandleProps = {{ ...attributes, ...listeners, ...{ ref: setActivatorNodeRef } }} 
                position = {droppableProps.postion} 
                onRemove={droppableProps.onRemove}
                isOver = {isOver}
            >
                {children}
            </DroppableComponent>
        </Flex>
    );
}

type RowProps = {
    dragHandleProps?: React.HTMLAttributes<any>,
    position: number,
    onRemove: () => void,
    style?: FlexProps,
    isOver?: boolean
} & PropsWithChildren

const Row = ({ dragHandleProps, position, children, onRemove, style, isOver = false }: RowProps) => {
    return (
        <Flex direction={'column'} w = '100%' minH = '200px' border = '1px' borderRadius={'8px'} borderColor={'brand.borderColor'} {...style}>
            <Flex gap = '20px' flexShrink={0} w = '100%' h = '50px' bg = 'green.100' borderBottom = '1px' borderTopRadius={'8px'} borderColor={'brand.borderColor'} alignItems={'center'} px = '10px'>
                <Heading size = 'sm'>Row {position + 1}</Heading>
                <Flex w = '80px' h = '100%' alignItems={'center'} gap = '5px' >
                    <Flex  style = {{ touchAction: 'none' }} {...dragHandleProps} w = '30px' h = '30px' _hover = {{ bg: 'gray.100' }} borderRadius={'6px'}>
                        <Icon m = 'auto' as = {MdDragIndicator} w = '20px' h = '20px' />
                    </Flex>
                    <IconButton onClick = {onRemove} variant={'ghost'} size = 'sm' aria-label="Delete Row Icon" icon = {<Icon as = {FaRegTrashCan} w = '17px' h = '17px' />} />
                </Flex>
            </Flex>
            <Flex w = '100%' bg = {isOver ? 'rgb(235, 235, 235, 1)' : 'white'} borderBottomRadius={'8px'} borderColor={'brand.borderColor'} p = '10px' gap = '10px'>
                {children}
            </Flex>
        </Flex>
    );
}

type ColumnProps = {
    dragHandleProps?: React.HTMLAttributes<any>,
    position: number,
    onRemove: () => void,
    style?: FlexProps,
    isOver?: boolean
} & PropsWithChildren

const Column = ({ dragHandleProps, position, children, onRemove, style, isOver = false }: ColumnProps) => {
    return (
        <Flex direction={'column'} minW = '400px' w = '400px' minH = '400px' border = '1px' borderRadius={'8px'} borderColor={'brand.borderColor'} {...style} >
            <Flex gap = '20px' w = '100%' h = '50px' flexShrink={0} bg = 'orange.100' borderTopRadius={'8px'} alignItems={'center'} pl = '10px' >
                <Heading size = 'sm'>Column {position + 1}</Heading>
                <Flex w = '80px' h = '100%' alignItems={'center'} gap = '5px' >
                    <Flex  style = {{ touchAction: 'none' }} {...dragHandleProps} w = '30px' h = '30px' _hover = {{ bg: 'gray.100' }} borderRadius={'6px'}>
                        <Icon m = 'auto' as = {MdDragIndicator} w = '20px' h = '20px' />
                    </Flex>
                    <IconButton onClick = {onRemove} variant={'ghost'} size = 'sm' aria-label="Delete Column Icon" icon = {<Icon as = {FaRegTrashCan} w = '17px' h = '17px' />} />
                </Flex>
            </Flex>
            <Flex flexGrow={1} direction={'column'} w = '100%' bg = {isOver ? 'rgb(235, 235, 235, 1)' : 'white'} borderTop={'1px'} borderBottomRadius={'8px'} borderColor={'brand.borderColor'} p = '10px' gap = '10px'>
                {children}
            </Flex>
        </Flex>
    );
}

type WidgetCardProps = {
    id: string,
    position: number, 
    widget: Widget,
    customWidgetName?: string | null,
    canEdit?: boolean,
    onRemove: () => void,
    onEdit?: () => void
}

const WidgetCard = ({ id, position, widget, canEdit = false, onRemove, onEdit = () => {}, customWidgetName }: WidgetCardProps) => {
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
        id,
        data: { 
            type: "WIDGET", 
            overlay: <Flex 
                w = '100%' minH = '70px' borderRadius={'4px'} bg = 'white' alignItems={'center'} pl = '20px' 
                boxShadow={'0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)'}
            >
                <Flex flexGrow={1} alignItems={'center'}>
                    {(customWidgetName ?? widget.type).split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                </Flex>
                <Flex w = '100px' h = '100%' alignItems={'center'} gap = '5px' justifyContent={'flex-end'} mr = '10px'>
                    {
                        canEdit &&
                        <IconButton 
                            onClick={onEdit} 
                            size = 'sm' variant={'ghost'} 
                            icon = {<Icon w = '17px' h = '17px' as = {MdEdit} />} 
                            aria-label="edit_widget_data_button" 
                        />
                    }
                    <IconButton onClick = {onRemove} size = 'sm' variant={'ghost'} aria-label="Delete Widget Icon" icon = {<Icon as = {FaRegTrashCan} w = '17px' h = '17px' />} />
                    <Flex w = '30px' h = '30px' _hover = {{ bg: 'gray.100' }} borderRadius={'6px'}>
                        <Icon m = 'auto' as = {MdDragIndicator} w = '20px' h = '20px' />
                    </Flex>
                </Flex>
            </Flex>
        },
        animateLayoutChanges,
    });
    return (
        <Flex 
            ref = {setNodeRef} transform={CSS.Translate.toString(transform)} transition = {transition} opacity={isDragging ? '0.5' : '1'} 
            w = '100%' borderRadius={'8px'} bg = 'white' alignItems={'center'}
        >
             <WidgetSkeleton 
                widget = {widget.type} 
                borderRadius={'4px'} 
                customWidgetName = {customWidgetName}
                headerElement={
                    <Flex w = '100px' h = 'inherit' alignItems={'center'} gap = '5px' justifyContent={'flex-end'} mr = '10px'>
                        {
                            canEdit &&
                            <IconButton 
                                onClick={onEdit} 
                                size = 'sm' variant={'ghost'} 
                                icon = {<Icon w = '17px' h = '17px' as = {MdEdit} />} 
                                aria-label="edit_widget_data_button" 
                            />
                        }
                        <IconButton onClick = {onRemove} size = 'sm' variant={'ghost'} aria-label="Delete Widget Icon" icon = {<Icon as = {FaRegTrashCan} w = '17px' h = '17px' />} />
                        <Flex  style = {{ touchAction: 'none' }} ref = {setActivatorNodeRef} {...attributes} {...listeners} w = '30px' h = '30px' _hover = {{ bg: 'gray.100' }} borderRadius={'6px'}>
                            <Icon m = 'auto' as = {MdDragIndicator} w = '20px' h = '20px' />
                        </Flex>
                    </Flex>
                }
            />
        </Flex>
    );
}

function shuffleArray<T extends string[]>(array: T): T {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index between 0 and i
      const j = Math.floor(Math.random() * (i + 1));
  
      // Swap elements at indices i and j
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}