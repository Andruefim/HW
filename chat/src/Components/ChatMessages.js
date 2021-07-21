import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useState, useEffect, useRef } from "react";
import logo from "../images//logo23.jpg";
import { actionGetMessagesByChatId, actionSearchMessagesByChatId } from "../Actions";
import ScrollableFeed from "react-scrollable-feed";
import { urlUploadConst } from "../const";
import history from "../history";
import { Button, Form, Modal } from "react-bootstrap";

const MediaItem = ({ mediaItem }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);

    let mediaUrl, mediaText;
    if (mediaItem && mediaItem.url) mediaUrl = mediaItem.url;
    if (mediaItem && mediaItem.text) mediaText = mediaItem.text;
    return (
        <>
            <div className="MediaItem m-1">
                <img src={`${urlUploadConst}/${mediaUrl}`} onClick={handleShow} />
                {mediaText && <div> {`${mediaText}`}</div>}
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modalImg border border-warning d-flex">
                        <img src={`${urlUploadConst}/${mediaUrl}`} />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

const Media = ({ media = null }) => {
    return (
        <>
            {media && media.length && (
                <>
                    <div className="d-flex flex-wrap ">
                        {/* {JSON.stringify(media, null, 4)} */}
                        {media.map((mediaItem) => (
                            <MediaItem key={mediaItem._id} mediaItem={mediaItem} />
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

const MessageItem = ({
    _id,
    createdAt = 0,
    text = "",
    media,
    owner: { _id: ownerId, login = "", nick = "", avatar },
    myId,
}) => {
    // первый _id - messageId

    if (!nick) nick = login;

    let date = new Date(+createdAt);
    let dateStr =
        date.getFullYear().toString().padStart(4, 0) +
        "." +
        (date.getMonth() + 1).toString().padStart(2, 0) +
        "." +
        date.getDate().toString().padStart(2, 0);

    return (
        <div className={`d-flex align-items-end ${myId === ownerId ? "justify-content-end" : ""}`}>

            <div
                className={`messageItem list-group-item m-1 gradient shadow-sm border-2 ${
                    myId === ownerId ? "list-group-item-secondary" : " list-group-item-light"
                }`}
            >


                <div className="lh-sm mb-2 text-seconary fw-bolder">{`${nick}`}</div>
                <Media media={media} />
                <div className="text-dark fs-6 lh-sm mb-3 text-wrap text-break">{text}</div>
                <span className="position-absolute bottom-0 end-0  badge rounded-pill bg-secondary">
                    {dateStr} <span className="visually-hidden">дата сообщения</span>
                </span>
            </div>
        </div>
    );
};

const MessagesList = ({ messages, myId, chatId, getMoreMessages = null }) => {
    const messagesEndRef = useRef(null); // указатель на пустой div  в коце сообщений для перемотки
    const messagesListBlockRef = useRef(null); // для отслеживания скролла
    const [offset, setOffset] = useState(Infinity); // для отслеживания скролла
    const [height, setHeight] = useState(Infinity); // для отслеживания скролла
    const [oldScrollHeight, seOldScrollHeight] = useState(Infinity); // для отслеживания скролла
    const isNeedMoreMessages = useRef(false);

    let arrayOfMessages = messages[chatId];

    const scrollToBottom = () => {
        if (height - offset < 10) {
            messagesEndRef.current.scrollIntoView();
        } else {
            messagesListBlockRef.current.scrollTop = messagesListBlockRef.current.scrollHeight - oldScrollHeight;
        }
        isNeedMoreMessages.current = false;
    };
    useEffect(scrollToBottom, [arrayOfMessages]);

    useEffect(() => {
        messagesListBlockRef.current.onscroll = () => {
            setOffset(Math.floor(messagesListBlockRef.current.scrollTop));
            seOldScrollHeight(messagesListBlockRef.current.scrollHeight);
        };
    }, []);

    useEffect(() => {
        setHeight(messagesListBlockRef.current.scrollHeight - messagesListBlockRef.current.clientHeight);
        setTimeout(() => {
            if (offset < 5) {
                if (!isNeedMoreMessages.current) {
                    isNeedMoreMessages.current = true;
                    if (typeof getMoreMessages === "function")
                        getMoreMessages(chatId, arrayOfMessages && arrayOfMessages.length);
                }
            }
        }, 16);
    }, [offset]);

    return (
        <div className="MessagesList" ref={messagesListBlockRef}>
            {!!arrayOfMessages && arrayOfMessages.map((mess) => <MessageItem key={mess._id} {...mess} myId={myId} />)}
            <div ref={messagesEndRef} />
        </div>
    );
};

const CMessagesList = connect(
    (s) => ({
        chatId: s.curChatId.curChatId,
        messages: s.msg,
        myId: s.auth && s.auth.payloadId,
    }),
    { getMoreMessages: actionSearchMessagesByChatId }
)(MessagesList);

const Messages = ({ _id = "", chatInfo, messages, getMsg }) => {

    if (chatInfo && _id) chatInfo = chatInfo.filter((chat) => chat._id === _id);

    if (!chatInfo || !chatInfo[0]) history.push("/");

    let avatar = chatInfo && chatInfo[0] && chatInfo[0].avatar && chatInfo[0].avatar.url;
    let title = chatInfo && chatInfo[0] && chatInfo[0].title && chatInfo[0].title.trim();

    useEffect(() => {
        if (
            typeof doSearchMsg === "function" &&
            !(messages && messages[_id] && messages[_id][0] && messages[_id][0].chat && messages[_id][0].chat._id)
        ) {
            getMsg(_id);
        }
    }, [_id]);

    return (

        <div className="mb-2">
            {chatInfo && chatInfo[0] && (
                <div className="position-relative  mb-3 border-2 border-secondary  text-dark">
                    <div className="d-flex justify-content-start align-items-center my-1">
                        <Link to={`/newchat/${_id}`} className="noUnderLine">
                            <div className="avatarka my-3" hidden>
                                {
                                    <div className="d-flex justify-content-center align-items-center bg-success border border-2 border-secondary gradient">
                                        <div className="fs-5 text-light fw-bolder">
                                            {title &&
                                                `${title.split(" ")[0][0].toUpperCase()}` +
                                                    `${
                                                        (title.split(" ").slice(1).pop() &&
                                                            title.split(" ").slice(1).pop()[0].toUpperCase()) ||
                                                        ""
                                                    }`}
                                        </div>
                                    </div>
                                }
                            </div>
                        </Link>
                        <div className="fs-5 fw-bolder ms-2">{`${title}`}</div>
                    </div>
                   
                </div>
            )}
            <div>
                <CMessagesList />
            </div>
        </div>
    );
};

const CMessages = connect((s) => ({ _id: s.curChatId.curChatId, messages: s.msg, chatInfo: s.auth.chats }), {
    getMsg: actionGetMessagesByChatId,
})(Messages);

export const ChatMessages = ({ _chatId = "" }) => <div>{!!_chatId && <CMessages />}</div>;
