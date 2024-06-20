import { Flex, FormControl, FormLabel, Text, Input, Progress, Icon, Button, IconButton } from "@chakra-ui/react";
import { MdAddCircleOutline, MdRefresh } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import NextImageWithFallback from "./image_with_fallback";
import { FaRegTrashCan } from "react-icons/fa6";
import axiosClient from "@/lib/utils/axios";
import { v4 as uuidv4 } from 'uuid';
import axios, { AxiosProgressEvent, AxiosRequestConfig, CancelTokenSource } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type UploadImagesContainerProps = {
    showAddItemButton?: boolean,
    onClickAddItem?: () => void,
    onUploadComplete: (items: { path: string, id: string }[]) => void
}

const UploadImagesContainer = ({ showAddItemButton, onClickAddItem, onUploadComplete }: UploadImagesContainerProps) => {
    type SelectedFileType = { id: string, name: string, url: string, file: File, isUploading: boolean, size: number, completedPercentage: number, error: boolean, type: string, uploadCancelToken: CancelTokenSource | null }
    const [selectedFiles, setSelectedFiles] = useState<SelectedFileType[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            let list: typeof selectedFiles = []
            setSelectedFiles(prev => {
                list = prev;
                return prev
            })
            list.forEach(item => {
                const cancelToken = item?.uploadCancelToken;
                if(cancelToken) cancelToken.cancel('Upload canceled by the user.');
            })
        }
    }, [])

    const onCaptureMediaFromLocal = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files == null || e.target.files.length < 1) return ; 
        setSelectedFiles([...e.target.files].map(file => ({ 
            file: file, 
            id: uuidv4(), 
            url: URL.createObjectURL(file), 
            isUploading: false, 
            size: file.size, 
            completedPercentage: 0, 
            name: file.name, 
            error: false, 
            type: file.type.split('/')?.[(file.type?.split('/')?.length ?? 0) - 1] ?? '',
            uploadCancelToken: null
        })));
        if(fileInputRef.current) {
            fileInputRef.current.files = null;
            fileInputRef.current.value = '';
        }
    }

    const onClickDeleteItem = (id: string) => {
        const cancelToken = selectedFiles.find(e => e.id == id)?.uploadCancelToken;
        setSelectedFiles(prev => prev.filter(e => e.id != id));
        if(cancelToken) {
            cancelToken.cancel('Upload canceled by the user.');
        }
    }

    const onClickSelectOrUpload = (retryItemId: string | null = null) => {
        if(selectedFiles.length < 1) {
            fileInputRef.current?.click();
            return ;
        } 

        selectedFiles.filter(e => retryItemId != null ? e.id == retryItemId : e.isUploading == false).map(file => {
            type apiResponseData = { contentType: string, name: string, path: string, type: string, vendorId: string, _id: string }[]
            let formData = new FormData();
            formData.append("files", file.file);
            const cancelToken = axios.CancelToken.source();
            setSelectedFiles(prev => prev.map(e => e.id == file.id ? { ...e, isUploading: true, uploadCancelToken: cancelToken, error: false } : e));
            const options: AxiosRequestConfig = { 
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    let percent = Math.floor( (progressEvent.loaded * 100) / (progressEvent?.total ?? 0))
                    if(percent < 100) {
                        setSelectedFiles(prev => prev.map(e => e.id == file.id ? { ...e, completedPercentage: percent, error: false } : e));
                    }
                },
                headers: {
                    Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6ImRldnNob3BwLmRlIiwiZW1haWwiOiJ2aWduZXNoQGV4YW1wbGUuY29tIiwidXNlcklkIjoiNjJjYmM0NGQ0YjMwZjAwZmI4NmRmNmI1IiwidXNlck5hbWUiOiJWaWduZXNoIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzE2Mzc1ODMzLCJleHAiOjE3MjE1NTk4MzN9.B4CkloIXXcTP5ys3MJ9Y9Lvm3BRdWTy2ATgLMvlvf-o'
                },
                cancelToken: cancelToken.token
            }
            axiosClient.post('https://api.devshopp.de/asset/upload', formData, options).then((response) => {
                if(response.data != null && response.data.success) {
                    const result = (response.data.data as apiResponseData).map((media, index) => { return { name: file != null ? file.name : media.name, path: media.path } });
                    onUploadComplete([{ path: result?.[0].path, id: file.id }])
                    setSelectedFiles(prev => prev.filter(e => e.id != file.id));
                } else {
                    setSelectedFiles(prev => prev.map(e => e.id == file.id ? { ...e, error: true, isUploading: false, completedPercentage: 0 } : e));
                }
            }).catch((error) => {
                if (axios.isCancel(error)) {
                    console.log('Upload canceled:', error.message);
                } else {
                    console.error('Upload error:', error);
                }
                setSelectedFiles(prev => prev.map(e => e.id == file.id ? { ...e, error: true, isUploading: false, completedPercentage: 0 } : e));
            });
        })
    }

    const onClickRetryUpload = (id: string) => onClickSelectOrUpload(id);

    return (
        <Flex w = '100%' direction={'column'} border = '1px' borderColor={'brand.borderColor'} borderRadius={'10px'} p = '10px' gap = '10px'>
            <Input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={onCaptureMediaFromLocal} multiple accept=".jpg,.jpeg,.png,.webp,.gif,.svg" />
            {
                showAddItemButton &&
                <>
                    <Button minW = '200px' w = '100%' h = '50px' onClick = {onClickAddItem} variant={'unstyled'} bg = 'white' borderRadius={'6px'} border = '1px' borderStyle={'dashed'} borderColor={'brand.borderColor'} _hover = {{ bg: 'gray.100' }}>
                        <Flex w = '100%' h = '100%' justifyContent={'center'} alignItems={'center'} gap = '10px'>
                            <Icon as = {MdAddCircleOutline} color = 'brand.borderColor' w = '30px' h = '30px' />
                            Add Item
                        </Flex>
                    </Button>
                    <Flex w = '100%' direction={'column'} position={'relative'} justifyContent={'center'} alignItems={'center'}>
                        <Flex w = '50%' h = '1px' bg = 'brand.borderColor' position={'absolute'} top = '50%' left = '25%'></Flex>
                        <Text w = 'fit-content' textAlign={'center'} bg = 'white' borderRadius={'100%'} px = '5px' zIndex={1}>Or</Text>
                    </Flex>
                </>
            }
            
            <Flex w = '100%' direction={'column'} minH = '100px' border = '1px' borderColor={'brand.borderColor'} borderStyle={'dashed'} borderRadius={'6px'} p = '10px' gap = '10px'>
                {
                    selectedFiles.length < 1 ?
                    <Flex w = '100%' h = '90px' alignItems={'center'} justifyContent={'center'}><Text w = '100%' textAlign={'center'}>No Items Selected!</Text></Flex> :
                    selectedFiles.map(item => {
                        return <Flex key = {item.id} w = '100%' border = '1px' borderColor={item.error ? 'red' : 'brand.borderColor'} borderRadius={'6px'} p = '10px' gap = '10px' alignItems={'center'}>
                            <Flex w = {'80px'} h = {'80px'} flexShrink={0} p = '5px' border = '1px' borderColor={'brand.borderColor'} borderRadius={'6px'}>
                                <Flex position={'relative'} w = '100%' h = '100%' borderRadius={'6px'}>
                                    <NextImageWithFallback src = {item.url} alt = 'image' fill style = {{ objectFit: 'contain' }} sizes='(max-width: 991px) 100vw, 49vw' loading='lazy' />
                                </Flex>
                            </Flex>
                            <Flex w = '100%' direction={'column'} gap = '10px' justifyContent={'center'}>
                                <Flex gap = '10px' justifyContent={'space-between'} alignItems={'flex-end'}>
                                    <Flex direction={'column'}>
                                        <Text noOfLines={1}>{item.name}</Text>
                                        <Flex gap = '5px' alignItems = 'center' flexWrap={'wrap'}>
                                            <Text>{item.type.toUpperCase()}</Text>
                                            <Flex w = '4px' h = '4px' bg = 'black' borderRadius = '100%'></Flex>
                                            <Text>{formatFileSize(item.size)}</Text>
                                            {item.error && <Text color = 'red'>Upload failed!</Text>}
                                        </Flex>
                                    </Flex>
                                    
                                    <Flex gap = {['5px', '5px', '10px', '10px', '10px']} alignItems={'center'}>
                                        <Text mr = {['5px', '5px', '10px', '10px', '10px']}>{item.completedPercentage}%</Text>
                                        <IconButton 
                                            onClick={e => onClickRetryUpload(item.id)} 
                                            isLoading = {item.isUploading} 
                                            color={'gray.600'} 
                                            aria-label="retry_upload_item" flexShrink={0} 
                                            minW = {['25px', '25px', '35px', '35px', '35px']} 
                                            maxH = {['25px', '25px', '35px', '35px', '35px']} 
                                            variant={'ghost'} 
                                            icon = {<Icon w = {['15px', '15px', '20px', '20px', '20px']} h = {['15px', '15px', '20px', '20px', '20px']} as = {item.error == false ? FiUpload : MdRefresh} />} 
                                        />
                                        <IconButton 
                                            onClick={e => onClickDeleteItem(item.id)} 
                                            color={'gray.600'} aria-label="delete_item" flexShrink={0} 
                                            minW = {['25px', '25px', '35px', '35px', '35px']} 
                                            maxH = {['25px', '25px', '35px', '35px', '35px']} 
                                            variant={'ghost'} 
                                            icon = {<Icon w = {['15px', '15px', '20px', '20px', '20px']} h = {['15px', '15px', '20px', '20px', '20px']} as = {FaRegTrashCan} />} 
                                        />
                                    </Flex>
                                </Flex>
                                <Progress colorScheme='green' size='md' value={item.completedPercentage} borderRadius={"5px"} isAnimated />
                            </Flex>
                        </Flex>
                    })
                }
            </Flex>
            <Button minW = '200px' w = '100%' h = '50px' onClick = {e => onClickSelectOrUpload()} variant={'unstyled'} bg = 'white' borderRadius={'6px'} border = '1px' borderStyle={'dashed'} borderColor={'brand.borderColor'} _hover = {{ bg: 'gray.100' }}>
                <Flex w = '100%' h = '100%' justifyContent={'center'} alignItems={'center'} gap = '10px'>
                    <Icon as = {FiUpload} color = 'brand.borderColor' w = '30px' h = '30px' />
                    {selectedFiles.length < 1 ? `Upload From Local` : 'Start Upload'}
                </Flex>
            </Button>
        </Flex>
    );
}

export default UploadImagesContainer;

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}