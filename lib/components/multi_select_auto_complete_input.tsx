import { useOutsideClick, Flex, Tag, TagLabel, TagCloseButton, Menu, MenuButton, MenuList, MenuItem, Input, Icon } from "@chakra-ui/react";
import React from "react";
import { useRef, useState } from "react";
import { IconType } from "react-icons";
import { MdLocationOn } from "react-icons/md";

type MultiSelectAutoCompleteInputProps = {
    currentValues: (string | number)[],
    list: { id: string | number, value: string }[],
    onChange: (tags: (string | number)[]) => void,
    listLeftIcon?: JSX.Element | IconType
}

const MultiSelectAutoCompleteInput = ({ currentValues, list, listLeftIcon, onChange }: MultiSelectAutoCompleteInputProps) => {
    const [searchResult, setSearchResult] = useState<typeof list>([]);
    let listFirstItemRef = useRef<HTMLButtonElement>(null!);
    let inputRef = useRef<HTMLInputElement>(null!);
    let outSideRef = useRef<HTMLDivElement>(null!);

    useOutsideClick({
        ref: outSideRef,
        handler: () => setSearchResult([]),
    })

    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimeout(() => inputRef.current.focus(), 100)
        if(event.target.value == '') {
            setSearchResult(list.filter(e => currentValues.includes(e.id.toString()) == false));
            return ;
        }
        const result = list.filter(item => item.value.toLowerCase().includes(event.target.value.toLowerCase())).filter(e => currentValues.includes(e.id.toString()) == false);
        setSearchResult(result);
    }

    const onFocusInput = (updatedValues = currentValues) => {
        setTimeout(() => inputRef.current.focus(), 100)
        if(inputRef.current.value == '') {
            setSearchResult(list.filter(e => updatedValues.includes(e.id.toString()) == false));
            return ;
        }
        const result = list.filter(item => item.value.toLowerCase().includes(inputRef.current.value.toLowerCase())).filter(e => updatedValues.includes(e.id.toString()) == false);;
        setSearchResult(result);
    }

    const onDeleteTag = (toBeDeletedIndex: number) => {
        let tagsCopy: (string | number)[] = JSON.parse(JSON.stringify(currentValues));
        tagsCopy = tagsCopy.filter((tag, index) => index != toBeDeletedIndex);
        onChange(tagsCopy);
        onFocusInput(tagsCopy);
    }

    const onSelectItem = (itemId: string | number) => {
        onChange([...currentValues.filter(e => e != itemId), itemId])
        setSearchResult(prev => prev.filter(e => e.id != itemId))
        inputRef.current.value = '';
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        inputRef.current.focus();
        if(event.code == 'ArrowDown' || event.code == 'ArrowUp' || event.code == 'Tab') {
            listFirstItemRef.current?.focus()
        }
    }

    return (
        <Flex w = '100%' direction = 'column' ref = {outSideRef}>
            <Menu matchWidth autoSelect isOpen = {searchResult.length > 0} placement="bottom" eventListeners = {{ scroll: false }}>
                <Flex w = '100%' position={'relative'} direction={'column'}>
                    <MenuButton tabIndex={1} pointerEvents={'none'} position={'absolute'} w = '100%' h = '100%' zIndex={0} />
                    <Flex w = "100%" zIndex={999} gap = "5px" bg = "white" cursor = "text" onClick={() => inputRef.current.focus()} flexWrap={'wrap'} p = {currentValues.length != 0? "5px" : "0px"} border = "1px" borderRadius = "10px" borderColor="brand.borderColor" >
                        { 
                            currentValues.map((tag, index) => {
                                const value = list.find(e => e.id == tag)!;
                                return <Tag key = {value.id} size = 'lg'><TagLabel>{value.value}</TagLabel><TagCloseButton onClick = {() => onDeleteTag(index)} /></Tag>
                            }) 
                        }
                        <Input 
                            ref = {inputRef}
                            onChange = {onChangeInput} 
                            //placeholder="ex. 2 Angkasaraya Jln Ampang, Kuala Lumpur"
                            onKeyDown={onKeyDown}
                            onFocus={e => onFocusInput()}
                            autoComplete="off"
                            variant = "solid" bg = "white" _focus = {{border: "0px"}}
                            flex = {1} w = {currentValues.length > 0 ? 'min-content' : '100%'} 
                        />
                    </Flex>
                </Flex>
                <MenuList zIndex={1401} borderColor={'brand.borderColor'}>
                    {
                        searchResult.map((item, index) => {
                            return <MenuItem 
                                ref = {index == 0 ? listFirstItemRef : null}
                                onClick={() => onSelectItem(item.id)} 
                                alignItems={'flex-start'}
                                icon={
                                    listLeftIcon == null ?
                                    <Icon mt = '2px' w = '20px' h = '20px' as = {MdLocationOn} /> :
                                    isIconType(listLeftIcon) ?
                                    <Icon mt = '2px' w = '20px' h = '20px' as = {listLeftIcon} /> :
                                    listLeftIcon
                                }
                                key = {item.id}
                            >
                                {item.value}
                            </MenuItem>
                        })
                    }
                </MenuList>
            </Menu>
        </Flex>
    );
}

export default MultiSelectAutoCompleteInput;

function isIconType(value: any): value is IconType {
    return typeof value === 'function' && React.isValidElement(value({}));
}