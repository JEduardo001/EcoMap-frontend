import {Text} from "react-native"

export const TextSize = ({children, style}) => {
  return (
    <Text style={style} allowFontScaling={false}>{children}</Text>
  )
}