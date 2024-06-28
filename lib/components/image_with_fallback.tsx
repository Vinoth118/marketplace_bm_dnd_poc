import { Flex, Spinner } from "@chakra-ui/react";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

const NextImageWithFallback = (props: ImageProps & { fallbackSrc?: string, loadingSpinner?: boolean }) => {
    const { src, fallbackSrc = 'https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg', loadingSpinner = false, ...rest } = props;
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoaded, setLoaded] = useState(!loadingSpinner);

    useEffect(() => {
        setImgSrc(src); 
        if(loadingSpinner) setLoaded(false)
    }, [src, fallbackSrc, loadingSpinner]);

    return (
        <Flex w = '100%' h = '100%' position={'relative'}>
            <Flex display={loadingSpinner != false && isLoaded == false ? 'flex' : 'none'} position={'absolute'} left = '50%' top = {'50%'} transform={'translate(-50%, -50%)'}  zIndex={9} w = {rest.width} h = {rest.height} ><Spinner w = '40px' h = '40px' thickness="4px" /></Flex>
            <Image
                {...rest}
                src={imgSrc}
                onError={() => setImgSrc(fallbackSrc)}
                onLoad={() => setLoaded(true)}
            />
        </Flex>
    );
}

export default NextImageWithFallback;