import { ChangeEvent } from "react";
import axiosClient from "./axios";
import { AxiosProgressEvent } from "axios";

const dummyTimeOut = (seconds: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, seconds)
    })
  }
  

interface UploadProps {
    event: ChangeEvent<HTMLInputElement>,
    onUploadStart: (numberOfItemsSelected: number) => void,
    onUploadEnd: (uploadedMediaList: { name: string, path: string }[] | "ERROR") => void,
    setImageUploadPercentage: (percent: number) => void
}

type apiResponseData = { contentType: string, name: string, path: string, type: string, vendorId: string, _id: string }[]

const MediaUpload = async ({ event, onUploadStart, onUploadEnd, setImageUploadPercentage }: UploadProps) => {    
    if(event.target.files) {
        const files: File[] = Array.from([...event.target.files]);
        let formData = new FormData();
        [...event.target.files].map((file) => formData.append("files", file))

        onUploadStart(event.target.files.length);
        
        //await dummyTimeOut(5000);

        const options = { onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            let percent = Math.floor( (progressEvent.loaded * 100) / (progressEvent?.total ?? 0))
            if(percent < 100) {
                setImageUploadPercentage(percent)
            }
        }}
        
        axiosClient.post('https://api.devshopp.de/asset/upload', formData, options).then((response) => {
            if(response.data != null && response.data.success) {
                setImageUploadPercentage(0);
                const result = (response.data.data as apiResponseData).map((media, index) => { return { name: files != null ? files[index].name : media.name, path: media.path } });
                try { event.target.value = ''; } catch (e) {}
                onUploadEnd(result);
            } else {
                setImageUploadPercentage(0);
                onUploadEnd("ERROR");
            }
        }).catch((error) => {
            console.log(error);
            setImageUploadPercentage(0);
            onUploadEnd("ERROR");
        })
    }
}

export default MediaUpload;