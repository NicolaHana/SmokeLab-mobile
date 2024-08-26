import React, { useImperativeHandle, useState } from "react";
import { forwardRef } from "react";
import ImagePicker from "react-native-image-crop-picker";
import StyledActionSheet from "./StyledActionSheet";

const StyledImagePicker = forwardRef(
  ({ title, multiple, onImagesPicked }, ref) => {
    const [visibleSourcePicker, setVisibleSourcePicker] = useState(false);
    useImperativeHandle(ref, () => ({
      present() {
        setVisibleSourcePicker(true);
      },
    }));
    const onTakePhotoPress = () => {
      ImagePicker.openCamera({
        mediaType: "photo",
        forceJpg: true,
        compressImageQuality: 0.2,
      })
        .then((image) => {
          console.log(image);
          onImagesPicked([image]);
          setTimeout(() => {
            setVisibleSourcePicker(false);
          }, 100);
        })
        .catch((error) => {
          console.log(error);
          setVisibleSourcePicker(false);
        });
    };
    const onPhotoLibraryPress = () => {
      ImagePicker.openPicker({
        mediaType: "photo",
        forceJpg: true,
        multiple: multiple,
        compressImageQuality: 0.2,
      })
        .then((images) => {
          if (multiple) {
            onImagesPicked(images);
          } else {
            onImagesPicked([images]);
          }
          setTimeout(() => {
            setVisibleSourcePicker(false);
          }, 100);
        })
        .catch((error) => {
          setVisibleSourcePicker(false);
        });
    };
    return (
      <StyledActionSheet
        visible={visibleSourcePicker}
        title={title}
        content={null}
        cancel={"Cancel"}
        options={["Take Photo", "Photo Library"]}
        onCancelPress={() => {
          setVisibleSourcePicker(false);
        }}
        onOptionPress={(index) => {
          if (index === 0) {
            onTakePhotoPress();
          } else if (index === 1) {
            onPhotoLibraryPress();
          }
        }}
      />
    );
  }
);

export default StyledImagePicker;
