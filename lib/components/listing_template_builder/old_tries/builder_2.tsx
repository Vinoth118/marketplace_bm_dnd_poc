"use client"
import { Button, Flex, FlexProps, Heading, Icon, IconButton, Text } from "@chakra-ui/react";
//import { SampleTemplate as templateData1 } from './builder_types_1';
//import { SampleTemplate as templateData2 } from './builder_types_2';
import { Template } from './builder_types_2';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverEvent, DragStartEvent, TouchSensor, DragOverlay, Active, MeasuringStrategy, DropAnimation, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { AnimateLayoutChanges, arrayMove, defaultAnimateLayoutChanges, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MouseEventHandler, PropsWithChildren, useMemo, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { v4 as uuidv4 } from 'uuid';
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { MdAddCircleOutline, MdDragIndicator } from "react-icons/md";

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
};

const Builder = () => {
    const [templateData, setTemplateData] = useState<Template>({ name: '', rows: [], columns: [], widgets: [] });
    const [draggingElement, setDraggingElement] = useState<null | Active>(null);
    const [clonedItems, setClonedItems] = useState<null | typeof templateData>(null);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const onAddNewRow = () => setTemplateData(prev => ({ ...prev, rows: [...prev.rows, { id: uuidv4(), position: prev.rows.length }] }));
    const onAddNewColumn = (row_id: string) => setTemplateData(prev => ({ ...prev, columns: [...prev.columns, { id: uuidv4(), position: prev.columns.filter(col => col.row_id == row_id).length, row_id }] }));
    const onAddNewWidget = (row_id: string, col_id: string) => setTemplateData(prev => ({ ...prev, widgets: [...prev.widgets, { id: uuidv4(), type: 'IMAGE_SECTION', position: prev.widgets.filter(widget => widget.row_id == row_id && widget.column_id == col_id).length, row_id, column_id: col_id }] }));

    const onRemoveRow = (row_id: string) => setTemplateData(prev => ({ ...prev, rows: prev.rows.filter(e => e.id != row_id), columns: prev.columns.filter(e => e.row_id != row_id), widgets: prev.widgets.filter(e => e.row_id != row_id) }));
    const onRemoveColumn = (col_id: string) => setTemplateData(prev => ({ ...prev, columns: prev.columns.filter(e => e.id != col_id), widgets: prev.widgets.filter(e => e.column_id != col_id) }));
    const onRemoveWidget = (widget_id: string) => setTemplateData(prev => ({ ...prev, widgets: prev.widgets.filter(e => e.id != widget_id) }));

    const onDragStart = (event: DragStartEvent) => {
        setTemplateData(templateData);
        setDraggingElement(event.active);
    }

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        if(active == null || active.data.current == null || over == null || over.data.current == null) return ;

        if(active.id == over.id) return ;

        const temp: typeof templateData = JSON.parse(JSON.stringify(templateData));
        
        if(active.data.current.type == 'COLUMN') {
            const activeColum = temp.columns.find(e => e.id == active.id)!;
            let activeRow = temp.columns.find(e => e.id == active.id)?.row_id;
            let overRow = temp.columns.find(e => e.id == active.id)?.row_id;
            let overColumn = temp.columns.find(e => e.id == active.id)?.id;

            if(over.data.current.type == 'WIDGET') {
                const overWidget = temp.widgets.find(e => e.id == over.id);
                overRow = overWidget?.row_id;
                overColumn = overWidget?.column_id;
            }
            if(over.data.current.type == 'COLUMN') {
                const overColumnTemp = temp.columns.find(e => e.id == over.id);
                overRow = overColumnTemp?.row_id;
                overColumn = overColumnTemp?.id;
            }
            if(over.data.current.type == 'ROW') {
                const overRowTemp = temp.rows.find(e => e.id == over.id);
                overRow = overRowTemp?.id;
                overColumn = undefined;
            }

            const overColumnPosition = over.data.current.type == 'ROW' ? temp.rows.filter(e => e.id == overRow).length : temp.columns.find(e => e.id == overColumn)?.position ?? temp.rows.filter(e => e.id == overRow).length;
            let afterItems = temp.columns.filter(e => e.row_id == overRow && e.position > overColumnPosition);
            let beforeItems = temp.columns.filter(e => e.row_id == overRow && e.position <= overColumnPosition);
            console.log(JSON.parse(JSON.stringify(beforeItems)), JSON.parse(JSON.stringify(afterItems)))
            if(overRow == activeRow) {
                beforeItems = beforeItems.filter(e => e.id != activeColum.id);
                afterItems = afterItems.filter(e => e.id != activeColum.id);
            }
            if(overColumnPosition > activeColum.position) beforeItems.push(activeColum); else beforeItems.unshift(activeColum)
            const columns = [...beforeItems, ...afterItems].map((e, index) => {
                e.position = index;
                e.row_id = overRow!;
                return e;
            });

            const rowColumns = [...temp.columns.filter(e => e.row_id != overRow), ...columns];
            temp.columns = rowColumns;
            temp.widgets.forEach(e => {
                if(e.column_id == active.id) e.row_id = overRow!;
            })
        }

        if(JSON.stringify(templateData) != JSON.stringify(temp)) setTemplateData(temp);
    }

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setDraggingElement(null);
        
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

    return (
        <Flex w = 'fit-content' minW = '100%' h = 'fit-content' direction={'column'} gap = '10px' p = '10px' bg = {draggingElement?.data?.current?.type == 'ROW' ? 'rgb(235, 235, 235, 1)' : 'white'} borderRadius={'12px'} boxShadow={'0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)'}>
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
                        items={templateData.rows}
                        strategy={verticalListSortingStrategy}
                    >
                        {
                            templateData.rows.map(row => {
                                const rowColumns = templateData.columns.filter(col => col.row_id == row.id);
                                return <DroppableSortableContainer 
                                    key = {row.id}
                                    id = {row.id}
                                    DroppableComponent={Row}
                                    type = 'ROW'
                                    droppableProps={{ postion: row.position, onRemove: () => onRemoveRow(row.id), childIds: rowColumns.map(e => e.id) }}
                                >
                                    <SortableContext 
                                        items={rowColumns}
                                        strategy={horizontalListSortingStrategy}
                                    >
                                        {
                                            rowColumns.map(col => {
                                                const colWidgets = templateData.widgets.filter(widget => widget.row_id == col.row_id && widget.column_id == col.id);
                                                return <DroppableSortableContainer 
                                                    key = {col.id}
                                                    id = {col.id}
                                                    DroppableComponent={Column}
                                                    type = 'COLUMN'
                                                    droppableProps={{ postion: col.position, onRemove: () => onRemoveColumn(col.id), childIds: colWidgets.map(e => e.id) }}
                                                >
                                                        <SortableContext 
                                                            items={colWidgets}
                                                            strategy={verticalListSortingStrategy}
                                                        >
                                                            {
                                                                colWidgets.map(widget => {
                                                                    return <Widget key = {widget.id} id = {widget.id} widget={widget} position={widget.position} onRemove={() => onRemoveWidget(widget.id)} />
                                                                })
                                                            }
                                                            <Button minW = '200px' w = '100%' h = '50px' onClick = {e => onAddNewWidget(col.row_id, col.id)} variant={'unstyled'} borderRadius={'6px'} border = '1px' borderStyle={'dashed'} borderColor={'brand.borderColor'} _hover = {{ bg: 'gray.100' }}>
                                                                <Flex w = '100%' h = '100%' justifyContent={'center'} alignItems={'center'} gap = '10px'>
                                                                    <Icon as = {MdAddCircleOutline} color = 'brand.borderColor' w = '30px' h = '30px' />
                                                                    Add Widget
                                                                </Flex>
                                                            </Button>
                                                        </SortableContext>
                                                </DroppableSortableContainer>
                                            })
                                        }
                                        <Button minW = '200px' minH = '200px' onClick = {e => onAddNewColumn(row.id)} variant={'unstyled'} borderRadius={'10px'} border = '1px' borderStyle={'dashed'} borderColor={'brand.borderColor'} _hover = {{ bg: 'gray.100' }}>
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
    );
}

export default Builder;

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
            overlay: <DroppableComponent position = {droppableProps.postion} onRemove={droppableProps.onRemove} style = {{ maxW: '50vw', minH: type == 'ROW' ? '200px' : '400px', maxH: '400px', overflow: 'hidden', bg: 'white' }}>{children}</DroppableComponent>
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
            <Flex gap = '20px' w = '100%' h = '50px' bg = 'green.100' borderBottom = '1px' borderTopRadius={'8px'} borderColor={'brand.borderColor'} alignItems={'center'} px = '10px'>
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
        <Flex direction={'column'} minW = '400px' w = '400px' minH = '200px' border = '1px' borderRadius={'8px'} borderColor={'brand.borderColor'} {...style} boxShadow={'0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)'}>
            <Flex gap = '20px' w = '100%' h = '50px' bg = 'orange.100' borderTopRadius={'8px'} alignItems={'center'} pl = '10px' >
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

type WidgetProps = {
    id: string,
    position: number, 
    widget: Template['widgets'][1],
    onRemove: () => void
}

const Widget = ({ id, position, widget, onRemove }: WidgetProps) => {
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
                    {widget.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')} {position + 1}
                </Flex>
                <Flex w = '80px' h = '100%' alignItems={'center'} gap = '5px' >
                    <Flex w = '30px' h = '30px' _hover = {{ bg: 'gray.100' }} borderRadius={'6px'}>
                        <Icon m = 'auto' as = {MdDragIndicator} w = '20px' h = '20px' />
                    </Flex>
                    <IconButton onClick = {onRemove} size = 'sm' variant={'ghost'} aria-label="Delete Widget Icon" icon = {<Icon as = {FaRegTrashCan} w = '17px' h = '17px' />} />
                </Flex>
            </Flex>
        },
        animateLayoutChanges,
    });
    return (
        <Flex 
            ref = {setNodeRef} transform={CSS.Translate.toString(transform)} transition = {transition} opacity={isDragging ? '0.5' : '1'} 
            w = '100%' minH = '70px' borderRadius={'4px'} bg = 'white' alignItems={'center'} pl = '20px' 
            boxShadow={'0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)'}
        >
            <Flex flexGrow={1} alignItems={'center'}>
                {widget.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')} {position + 1}
            </Flex>
            <Flex w = '80px' h = '100%' alignItems={'center'} gap = '5px' >
                <Flex  style = {{ touchAction: 'none' }} ref = {setActivatorNodeRef} {...attributes} {...listeners} w = '30px' h = '30px' _hover = {{ bg: 'gray.100' }} borderRadius={'6px'}>
                    <Icon m = 'auto' as = {MdDragIndicator} w = '20px' h = '20px' />
                </Flex>
                <IconButton onClick = {onRemove} size = 'sm' variant={'ghost'} aria-label="Delete Widget Icon" icon = {<Icon as = {FaRegTrashCan} w = '17px' h = '17px' />} />
            </Flex>
        </Flex>
    );
}