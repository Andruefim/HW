import { useRef, useState } from "react";
import { urlUploadConst } from "../const";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ButtonToMain } from "../Components";

export const PageUpload = () => {
    const [fl, setFl] = useState(false);
    const resultArray = useRef([]);
    const uploadImgRef = useRef(null);

    function MyDropzone() {
        const onDrop = useCallback(async (acceptedFiles) => {
            // console.log("МАССИВ", acceptedFiles);

            let reader = new FileReader();

            reader.onloadend = function () {
                uploadImgRef.current.src = reader.result;
            };

            if (acceptedFiles[0]) {
                reader.readAsDataURL(acceptedFiles[0]);
            } else {
                uploadImgRef.current.src = "";
            }

            setFl(false);

            let aaryOfFatchs = acceptedFiles.map((file) => {
                let dataSingl = new FormData();
                dataSingl.set("media", file);
                return fetch(`${urlUploadConst}/upload`, {
                    method: "POST",
                    headers: localStorage.authToken ? { Authorization: "Bearer " + localStorage.authToken } : {},
                    body: dataSingl,
                }).then((res) => res.json());
            });

            resultArray.current = [];

            await Promise.all(aaryOfFatchs)
                .then((responses) => responses.forEach((response) => resultArray.current.push(response)))
                .catch((e) => alert("Произошла ошибка.", e));

            console.log(resultArray.current);

            setFl(true);
        }, []);

        const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

        return (
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p className="border border-success">Drag 'n' drop some files here, or click to select files</p>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="m-2">
                PageUpload
                <ButtonToMain />
                <br />
                <br />
                <MyDropzone />
                <img src="" height="200" alt="Image preview..." ref={uploadImgRef}></img>
                <br />
                <br />
                Результат
                <br />
                {resultArray.current.map((res) => (
                    <img src={`${urlUploadConst}/${res.url}`} width="100px" key={res._id} />
                ))}
            </div>
        </>
    );
};
