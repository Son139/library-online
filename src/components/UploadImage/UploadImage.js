import { Avatar, Button, Input, Upload } from "antd";
import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/conflig";

export default function UploadImage() {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);
    const [sizeImage, setSizeImage] = useState(0);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };
    const uploadImg = () => {
        if (image.name !== null) {
            const storageRef = ref(storage, `images/${image.name}`);

            uploadBytes(storageRef, image)
                .then(() => {
                    getDownloadURL(storageRef)
                        .then((url) => {
                            setUrl(url);
                            setSizeImage(500);
                        })
                        .catch((error) => {
                            console.log(
                                error.message,
                                "error getting the image url",
                            );
                        });
                    setImage(null);
                })
                .catch((error) => {
                    console.log(error.message);
                });
        }
    };

    return (
        <>
            <Input type="file" onChange={handleImageChange} />
            <Button onClick={uploadImg}>Submit</Button>
            <Avatar shape="square" src={url} size={sizeImage} />
        </>
    );
}
