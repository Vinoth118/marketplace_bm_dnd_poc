
import { Button, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/dist/css/rcp.css";

interface MyColorPickerProps {
    height: number,
    onSubmit: (color: string) => void,
    currentColor: string,
    onClose: () => void
}

const MyColorPicker = ({ height, currentColor, onSubmit, onClose }: MyColorPickerProps) => {
    const [color, setColor] = useColor(currentColor);
    
    useEffect(() => {
        setColor(prev => ({ ...prev, hex: currentColor }));
    }, [currentColor])

    const onClickConfirm = () => {
        onSubmit(color.hex);
        onClose();
    }
    
    return (
        <Flex w = '100%' gap = "10px" direction={'column'} alignItems={"center"}>
            <Flex borderRadius = "5px" w = {'100%'} border = "1px" borderColor = "brand.borderColor" bg = {color.hex} h = {"35px"}></Flex>
            <ColorPicker height={height} color={color} onChange={setColor} hideInput = {['hsv', 'rgb']} />
            <Flex gridGap = "10px" w = {'100%'}>
                <Button w = "100%" onClick = {onClose} px = {"17px"} h = '40px' bg = "gray.100" color = "black"  >Cancel</Button>
                <Button w = "100%" onClick = {onClickConfirm} px = {"17px"} h = '40px' colorScheme='green'  >Confirm</Button>
            </Flex>
        </Flex>
    );
}

export default MyColorPicker;
