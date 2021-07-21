import { ChatMessages } from "../Components";
import { Sidebar } from "../Layout";
import { store } from "../Reducers";
import history from "../history";
import { actionSearchMessagesByChatId, actionCurChatId, actionMessageUpsert } from "../Actions";
import { connect } from "react-redux";
import { useState, useEffect, useRef } from "react";
import userEvent from "@testing-library/user-event";
import { useDropzone } from "react-dropzone";
import React, { useCallback } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { urlUploadConst } from "../const";

const MessageInput = ({ curChatId: { curChatId } = {}, messageUpsert }) => {
    const textRef = useRef({});
    const textRefModal = useRef({});
    const [text, setText] = useState("");
    const [dropFiles, setDropFiles] = useState([]);
    const resultArray = useRef([]);

    const textTyping = (e) => {
        setText(e.target.value);
        // console.log(e);
    };

    // отправка по Enter
    const sendMsgByEnterKey = (e) => {
        if (["NumpadEnter", "Enter"].includes(e.code) && !e.shiftKey && text.trim()) {
            sendMsg();
        }
    };

    const sendMsg = () => {
        if (text.trim()) {
            // console.log(text.trim());
            setText("");
            setShow(false);
            if (textRef.current) {
                textRef.current.value = "";
                textRefModal.current.value = "";
            }
            messageUpsert({ text: text.trim(), chatId: curChatId, imgArray: resultArray });
        }
    };

    useEffect(() => {
        setText("");

        if (textRef.current) {
            textRef.current.value = "";
        }
    }, [curChatId]);

    const onDrop = useCallback(async (acceptedFiles) => {
        resultArray.current = [];

        if (acceptedFiles[0]) {
            handleShow();
        }

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
            .catch((e) => alert("Ошибка загрузки.", e));

        // console.log(resultArray.current);
        setDropFiles([...resultArray.current]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            {curChatId && (
                <>
                    <div className="bg-light shadow-sm border border-2 rounded-3 MessageInput">
                        <div className="position-relative">
                            <textarea
                                className="form-control h-75"
                                placeholder="Write a message"
                                ref={textRef}
                                onChange={textTyping}
                                onKeyUp={sendMsgByEnterKey}
                                key={"mainTextarea"}
                            ></textarea>
                            <span
                                className="position-absolute bottom-0 end-0  badge rounded-pill bg-success"
                                role-button="true"
                                onClick={sendMsg}
                            >
                               
                            </span>
                        </div>
                        <div className="border">
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />

                                {isDragActive ? (
                                    <>
                                        
                                        <span className="text-secondary">Drop the files</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="px-2 fs-3 text-secondary"></i>{" "}
                                        <span className="text-secondary">Drop the files</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <Modal show={show} onHide={handleClose} key={"sendModal"}>
                        <Modal.Header closeButton>
                            <Modal.Title></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="modalImgSend d-flex" key={"sendModalDiv"}>
                                {/* {"Images"} */}
                                {dropFiles.map((file) => (
                                    <div>
                                        <img src={`${urlUploadConst}/${file.url}`} key={file._id} />
                                    </div>
                                ))}
                            </div>
                            <div className="position-relative">
                                <textarea
                                    className="form-control h-75"
                                    placeholder="Write a message..."
                                    ref={textRefModal}
                                    onChange={textTyping}
                                    onKeyUp={sendMsgByEnterKey}
                                ></textarea>
                                <span
                                    className="position-absolute bottom-0 end-0  badge rounded-pill bg-success"
                                    role-button="true"
                                    onClick={sendMsg}
                                >
                                    <i className="bi bi-chat-dots"></i> <i className="bi bi-reply-fill"></i>
                                </span>
                            </div>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </>
    );
};

export const CMessageInput = connect((s) => ({ curChatId: s.curChatId }), { messageUpsert: actionMessageUpsert })(
    MessageInput
);

//prettier-ignore
const PageMain = ({
    match: {        params: { _chatId },    },
    _userId,
    messages, // из редакса через коннект
    getMesagesList = null,
    setCurId = null, // из редакса через коннект
}) => {
 

    if (
        !_userId ||
        !store.getState().auth ||
        !store.getState().auth.login ||
        _userId !== store.getState().auth.payloadId
        // чтобы не зайти в чужой чат и не увидеть то, что тебе видеть не положено
    ) {
        history.push("/");
    }
    //
    //
    //
    //
    useEffect(() => {
        if (typeof setCurId === "function") setCurId(_chatId);

        if (
            typeof getMesagesList === "function" &&
            _chatId &&
            !(messages && messages[_chatId] && messages[_chatId][0])
        ) {
            getMesagesList(_chatId);
        }
    }, [_chatId]);

  

    return (
        <div className="maxWidthPageMain">
            <div className="container-fluid ">
                <div className="row g-3 ">
                    <div className="col-md-4">
                        <div className="maxWidthForSideBar shadow">
                            <Sidebar />
                        </div>
                    </div>
                    <div className="col-md-8 rounded-3 shadow" style={{backgroundImage: "url(https://neuronacreativa.com/cattleya/app-assets/images/backgrounds/chat-bg-2.png)"}}>
                        <div className="pageMain_ChatMessages mb-2">
                            <div className="maxWidthForMsg">
                                <ChatMessages _chatId={_chatId} />
                            </div>
                        </div>
                        <div className="maxWidthForMsg">
                            <CMessageInput />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CPageMain = connect((s) => ({ _userId: s.auth && s.auth.payloadId, messages: s.msg, myChats:s.auth.chats }), {
    setCurId: actionCurChatId,
    getMesagesList: actionSearchMessagesByChatId,
})(PageMain);
