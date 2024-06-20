import { Flex, useRadio, UseRadioProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

type RadioCardProps =  UseRadioProps & PropsWithChildren & {
    borderRadius?: string | string[]
}

const RadioCard = ({ children, borderRadius = '4px', ...restProps }: RadioCardProps) => {
    const { getInputProps, getRadioProps } = useRadio(restProps)
  
    const input = getInputProps()
    const checkbox = getRadioProps()
  
    return (
      <Flex 
        flexShrink={0}
        as='label' cursor='pointer' tabIndex={1} _focusVisible={{ outline: 'none' }} _focusWithin={{ outline: 'none' }} _focus={{ outline: 'none' }}
        opacity = {restProps.isDisabled ? '0.6' : 'auto'}
        borderRadius = {borderRadius}
        boxShadow={restProps.isChecked ? `green 0px 1px 4px, green 0px 0px 0px 3px;` : 'none'}
        onFocus={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if(restProps.isChecked == false) input?.onChange?.({ target: { value: input.value } } as any)
        }}
    >
        <input {...input} />
        <Flex {...checkbox} m = 'auto' textAlign={'center'}>
            {children}
        </Flex>
      </Flex>
    )
}

export default RadioCard;