import React, { } from 'react'
import { View } from 'react-native';

const StyledPageControl = ({ count, activeIndex, containerStyle, activeColor, inactiveColor }) => {
    return (
        <View style={[{ alignSelf: 'center', flexDirection: 'row' }, containerStyle]}>
            {
                [...Array(count).keys()].map((index) =>
                    <View
                        key={index.toString()}
                        style={{
                            marginLeft: index == 0 ? 0 : 6,
                            borderRadius: 4,
                            height: 8,
                            width: activeIndex == index ? 20 : 12,
                            backgroundColor: activeIndex == index ? activeColor : inactiveColor
                        }} />
                )
            }
        </View>
    )
}

export default StyledPageControl;