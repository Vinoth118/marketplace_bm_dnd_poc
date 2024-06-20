"use client"
import { Button, Flex, Heading, Icon, IconButton, Text } from "@chakra-ui/react";
//import { SampleTemplate as templateData1 } from './builder_types_1';
//import { SampleTemplate as templateData2 } from './builder_types_2';
import { Template, Widget } from './builder_types_2';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverEvent, DragStartEvent, TouchSensor, DragOverlay } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useMemo, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { v4 as uuidv4 } from 'uuid';
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { MdAddCircleOutline, MdDragIndicator } from "react-icons/md";

const Builder = () => {
    const [templateData, setTemplateData] = useState<Template>({ name: '', rows: [], columns: [], widgets: [] });
    const [draggingElements, setDraggingElements] = useState({ row: null as string | null, column: null as string | null, widget: null as string | null })
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const onAddNewRow = () => setTemplateData(prev => ({ ...prev, rows: [...prev.rows, { id: uuidv4(), position: prev.rows.length }] }));
    const onAddNewColumn = (row_id: string) => setTemplateData(prev => ({ ...prev, columns: [...prev.columns, { id: uuidv4(), position: prev.columns.filter(col => col.row_id == row_id).length, row_id }] }));
    const onAddNewWidget = (row_id: string, col_id: string) => setTemplateData(prev => ({ ...prev, widgets: [...prev.widgets, { id: uuidv4(), type: 'IMAGE_SECTION', position: prev.widgets.filter(widget => widget.row_id == row_id && widget.column_id == col_id).length, row_id, column_id: col_id }] }));

    const onDragStart = (event: DragStartEvent) => {
        if(event.active.data.current?.type == 'ROW') setDraggingElements(prev => ({ ...prev, row: event.active.id as string }))
        if(event.active.data.current?.type == 'COLUMN') setDraggingElements(prev => ({ ...prev, column: event.active.id as string }))
        if(event.active.data.current?.type == 'WIDGET') setDraggingElements(prev => ({ ...prev, widget: event.active.id as string }))
    }

    const onDragOver = (event: DragOverEvent) => {}

    const onDragEnd = (event: DragEndEvent) => {
        setDraggingElements(prev => ({ row: null, column: null, widget: null }))
    }
    
    const draggingRow = useMemo(() => {
        if(draggingElements.row == null) return null;
        return templateData.rows.find(row => row.id == draggingElements.row)
    }, [draggingElements.row]);
    
    const draggingColumn = useMemo(() => {
        if(draggingElements.column == null) return null;
        return templateData.columns.find(col => col.id == draggingElements.column)
    }, [draggingElements.column]);

    const draggingWidget = useMemo(() => {
        if(draggingElements.widget == null) return null;
        return templateData.widgets.find(widget => widget.id == draggingElements.widget)
    }, [draggingElements.widget]);

    return (
        <Flex w = 'fit-content' minW = '100%' minH = '80vh' direction={'column'} gap = '10px' p = '10px' bg = 'white' borderRadius={'12px'} boxShadow={'0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)'}>
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToWindowEdges]}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                <Flex w = '100%' direction={'column'} gap = '10px'>
                    <SortableContext 
                        items={templateData.rows}
                        strategy={verticalListSortingStrategy}
                    >
                        {
                            templateData.rows.map(row => {
                                return <SortableRow 
                                    key = {row.id} 
                                    id = {row.id}
                                    position = {row.position}
                                    row = {row}
                                    columns = {templateData.columns.filter(col => col.row_id == row.id)}
                                    widgets = {templateData.widgets.filter(widget => widget.row_id == row.id)}
                                    onAddNewColumn = {onAddNewColumn}
                                    onAddNewWidget = {onAddNewWidget}
                                />
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
                    createPortal(
                        <DragOverlay>
                            {
                                draggingElements.row && 
                                <SortableRow 
                                    id = {draggingElements.row}
                                    position = {draggingRow!.position}
                                    row = {draggingRow!}
                                    // isDragOverlay
                                    // columns={[]}
                                    // widgets={[]}
                                    columns = {templateData.columns.filter(col => col.row_id == draggingRow!.id)}
                                    widgets = {templateData.widgets.filter(widget => widget.row_id == draggingRow!.id)}
                                    onAddNewColumn = {onAddNewColumn}
                                    onAddNewWidget = {onAddNewWidget}
                                />
                            }
                            {
                                draggingElements.column && 
                                <SortableColumn 
                                    id = {draggingElements.column}
                                    position = {draggingColumn!.position}
                                    column = {draggingColumn!}
                                    // isDragOverlay
                                    // widgets={[]}
                                    widgets = {templateData.widgets.filter(widget => widget.column_id == draggingColumn!.id)}
                                    onAddNewWidget = {onAddNewWidget}
                                />
                            }
                            {
                                draggingElements.widget && 
                                <SortableWidget 
                                    id = {draggingElements.widget}
                                    position = {draggingWidget!.position}
                                    widget = {draggingWidget!}
                                    //isDragOverlay
                                />
                            }
                        </DragOverlay>,
                        document.body
                    )
                }
            </DndContext>
        </Flex>
    );
}

export default Builder;

type SortableRowProps = {
    id: string
    position: number,
    row: Template['rows'][1]
    columns: Template['columns'],
    widgets: Template['widgets'],
    isDragOverlay?: boolean,
    onAddNewColumn: (row_id: string) => void,
    onAddNewWidget: (row_id: string, col_id: string) => void
}

const SortableRow = ({ id, position, row, columns, widgets, isDragOverlay = false, onAddNewColumn, onAddNewWidget }: SortableRowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id, data: { type: 'ROW', row } });

    if(isDragOverlay) {
        return <Flex w = {'100%'} direction={'column'} borderBottom={'1px'} borderRadius={'8px'} borderColor={'brand.borderColor'}>
            <Flex gap = '20px' w = '100%' h = '50px' bg = 'green.100' borderTop={'1px'} borderInline={'1px'} borderTopRadius={'8px'} borderColor={'brand.borderColor'} alignItems={'center'} px = '10px'>
                <Heading mt = '-10px' size = 'sm'>Row {position + 1}</Heading>
                <Flex mt = '-10px' w = '80px' h = '100%' alignItems={'center'} gap = '5px' >
                    <IconButton variant={'ghost'} size = 'sm' aria-label="Delete Widget Icon" icon = {<Icon as = {FaRegTrashCan} w = '17px' h = '17px' />} />
                </Flex>
            </Flex>
            <Flex w = '100%' bg = 'white' mt = '-10px' borderTop={'1px'} borderInline={'1px'} borderRadius={'8px'} borderColor={'brand.borderColor'} p = '10px' gap = '10px' minH = '200px'></Flex>
        </Flex>
    }

    return (
        <Flex 
            ref = {setNodeRef} 
            transition = {transition}
            transform = {CSS.Transform.toString(transform)}
            opacity = {isDragging ? '0.4' : '1'}
            w = {'100%'} direction={'column'} borderBottom={'1px'} borderRadius={'8px'} borderColor={'brand.borderColor'}
        >
            <Flex {...listeners} {...attributes} gap = '20px' w = '100%' h = '50px' bg = 'green.100' borderTop={'1px'} borderInline={'1px'} borderTopRadius={'8px'} borderColor={'brand.borderColor'} alignItems={'center'} px = '10px'>
                <Heading mt = '-10px' size = 'sm'>Row {position + 1}</Heading>
                <Flex mt = '-10px' w = '80px' h = '100%' alignItems={'center'} gap = '5px' >
                    <IconButton variant={'ghost'} size = 'sm' aria-label="Delete Widget Icon" icon = {<Icon as = {FaRegTrashCan} w = '17px' h = '17px' />} />
                </Flex>
            </Flex>
            
            <Flex w = '100%' bg = 'white' mt = '-10px' borderTop={'1px'} borderInline={'1px'} borderRadius={'8px'} borderColor={'brand.borderColor'} p = '10px' gap = '10px' minH = '200px'>
                <SortableContext 
                    items={columns}
                    strategy={horizontalListSortingStrategy}
                >
                    {
                        columns.map(col => {
                            return <SortableColumn 
                                key = {col.id} 
                                id = {col.id}
                                position = {col.position}
                                column = {col}
                                widgets = {widgets.filter(widget => widget.column_id == col.id && widget.row_id == col.row_id)}
                                onAddNewWidget = {onAddNewWidget}
                            />
                        })
                    }
                </SortableContext>

                <Button minW = '200px' minH = '200px' onClick = {e => onAddNewColumn(id)} variant={'unstyled'} borderRadius={'10px'} border = '1px' borderStyle={'dashed'} borderColor={'brand.borderColor'} _hover = {{ bg: 'gray.100' }}>
                    <Flex w = '100%' h = '100%' direction={'column'} justifyContent={'center'} alignItems={'center'} gap = '20px'>
                        <Icon as = {MdAddCircleOutline} color = 'brand.borderColor' w = '70px' h = '70px' />
                        Add Column
                    </Flex>
                </Button>
            </Flex>
            
        </Flex>
    );
}

type SortableColumnProps = {
    id: string
    position: number,
    column: Template['columns'][1],
    widgets: Template['widgets'],
    isDragOverlay?: boolean,
    onAddNewWidget: (row_id: string, col_id: string) => void
}

const SortableColumn = ({ id, position, column, widgets, isDragOverlay = false, onAddNewWidget }: SortableColumnProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id, data: { type: 'COLUMN', column } });

    if(isDragOverlay) {
        return <Flex w = {'100%'} h = '100%' direction={'column'} borderBottom={'1px'} borderRadius={'8px'} borderColor={'brand.borderColor'} boxShadow={'0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)'}>
            <Flex gap = '20px' w = '100%' h = '50px' bg = 'orange.100' borderTop={'1px'} borderInline={'1px'} borderTopRadius={'8px'} borderColor={'brand.borderColor'} alignItems={'center'} px = '10px'>
                <Heading mt = '-10px' size = 'sm'>Column {position + 1}</Heading>
                <Flex mt = '-10px' w = '80px' h = '100%' alignItems={'center'} gap = '5px' >
                    <IconButton variant={'ghost'} size = 'sm' aria-label="Delete Column Icon" icon = {<Icon as = {FaRegTrashCan} w = '17px' h = '17px' />} />
                </Flex>
            </Flex>
            <Flex w = '100%' flexGrow={1} direction={'column'} bg = '#f6f6f6' mt = '-10px' borderTop={'1px'} borderRadius={'6px'} borderColor={'brand.borderColor'} p = '10px' gap = '10px' minH = '200px'></Flex>
        </Flex>
    }
    
    return (
        <Flex 
            ref = {setNodeRef} 
            transition = {transition}
            transform = {CSS.Transform.toString(transform)}
            opacity = {isDragging ? '0.4' : '1'}
            w = '100%' minW = '400px' direction={'column'} borderBottom={'1px'} borderInline={'1px'} borderRadius={'6px'} borderColor={'brand.borderColor'}
            boxShadow={'0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)'}
        >
            <Flex w = '100%' h = '50px' bg = 'orange.100' borderTop={'1px'} borderTopRadius={'6px'} borderColor={'brand.borderColor'} alignItems={'center'} pl = '10px' justifyContent={'space-between'}>
                <Heading mt = '-10px' size = 'sm'>Column {position + 1}</Heading>
                <Flex mt = '-10px' w = '80px' h = '100%' alignItems={'center'} gap = '5px' >
                    <Flex {...listeners} {...attributes} w = '30px' h = '30px' _hover = {{ bg: 'gray.100' }} borderRadius={'6px'}>
                        <Icon m = 'auto' as = {MdDragIndicator} w = '20px' h = '20px' />
                    </Flex>
                    <IconButton variant={'ghost'} size = 'sm' aria-label="Delete Column Icon" icon = {<Icon as = {FaRegTrashCan} w = '17px' h = '17px' />} />
                </Flex>
            </Flex>

            <Flex w = '100%' flexGrow={1} direction={'column'} bg = '#f6f6f6' mt = '-10px' borderTop={'1px'} borderRadius={'6px'} borderColor={'brand.borderColor'} p = '10px' gap = '10px' minH = '200px'>
                <SortableContext 
                    items={widgets}
                    strategy={verticalListSortingStrategy}
                >
                    {
                        widgets.map(widget => {
                            return <SortableWidget key = {widget.id} id = {widget.id} position={widget.position} widget = {widget} />
                        })
                    }
                </SortableContext>

                <Button minW = '200px' w = '100%' h = '50px' onClick = {e => onAddNewWidget(column.row_id, id)} variant={'unstyled'} borderRadius={'6px'} border = '1px' borderStyle={'dashed'} borderColor={'brand.borderColor'} _hover = {{ bg: 'gray.100' }}>
                    <Flex w = '100%' h = '100%' justifyContent={'center'} alignItems={'center'} gap = '10px'>
                        <Icon as = {MdAddCircleOutline} color = 'brand.borderColor' w = '30px' h = '30px' />
                        Add Widget
                    </Flex>
                </Button>
            </Flex>
        </Flex>
    );
}

type SortableWidgetProps = {
    id: string
    position: number,
    widget: Widget,
    isDragOverlay?: boolean,
}

const SortableWidget = ({ id, position, widget, isDragOverlay = false }: SortableWidgetProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id, data: { type: 'WIDGET', widget } });
    return (
        <Flex 
            ref = {setNodeRef} 
            transition = {transition}
            transform = {CSS.Transform.toString(transform)}
            opacity = {isDragging ? '0.4' : '1'}
            w = '100%' minH = '70px' borderRadius={'4px'} bg = 'white' alignItems={'center'} pl = '20px' 
            boxShadow={'0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)'}
        >
            <Flex flexGrow={1} alignItems={'center'}>
                {widget.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')} {position + 1}
            </Flex>
            <Flex w = '80px' h = '100%' alignItems={'center'} gap = '5px' >
                <Flex {...listeners} {...attributes} w = '30px' h = '30px' _hover = {{ bg: 'gray.100' }} borderRadius={'6px'}>
                    <Icon m = 'auto' as = {MdDragIndicator} w = '20px' h = '20px' />
                </Flex>
                <IconButton size = 'sm' variant={'ghost'} aria-label="Delete Widget Icon" icon = {<Icon as = {FaRegTrashCan} w = '17px' h = '17px' />} />
            </Flex>
        </Flex>
    );
}