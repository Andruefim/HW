import { ButtonToMain, ButtonCancel } from "../Components";
import { urlUploadConst } from "../const";
import { actionDelUserFromChatList, actionCreateNewChat, actionAddUserToChatList } from "../Actions";
import { connect } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { store } from "../Reducers";
import { useRef } from "react";
import history from "../history";
import { CUserInfo } from "../Layout";
import { CAllUsersList } from "../Layout";
import { useDropzone } from "react-dropzone";
import logo from "../images/logo23.png";
import chat_square_text from "../icons/chat-square-text.svg";
import userEvent from "@testing-library/user-event";

const MemberItem = ({ member, myId, dellFromList = null }) => {
    return (
        <span className="fs-5">
            <span className="badge bg-secondary  m-1 rounded-1 gradient">
                {member.nick || member.login}

                <button
                    type="button"
                    className="btn-close ms-2 text-light "
                    aria-label="Close"
                    disabled={member._id === myId}
                    onClick={() => {
                        if (typeof dellFromList === "function") dellFromList(member._id);
                    }}
                ></button>
            </span>
        </span>
    );
};

const CMemberItem = connect(
    (s, { member }) => ({
        member,
        myId: s.auth.payloadId,
    }),
    { dellFromList: actionDelUserFromChatList }
)(MemberItem);

const NewChatDashBoard = ({ members = {}, chatUpsert = null, _chatId, myChats = [], addUserToList, myId }) => {
    const [chatMembers, setChatMembers] = useState(Object.values(members));
    const [inpTitle, setInpTitle] = useState("");
    const uploadRef = useRef(null); // ссылка на input type=file для авы
    const inputTiylegRef = useRef(null);
    const [srcAva, setSrcAva] = useState("");
    const chatInfo = useRef({});

    // достаем из redux даные о чате, который хотим редактировать
    useEffect(() => {
        if (_chatId) {
            // let chatInfo = {};

            myChats = myChats.filter((chat) => chat._id === _chatId); // оставляем в myChats только редактируемый
            chatInfo.current = myChats && myChats[0];

            if (chatInfo.current && Object.keys(chatInfo.current).length) {
                inputTiylegRef.current.value = chatInfo.current.title;
                setInpTitle(chatInfo.current.title);
                chatInfo.current.members.forEach((mem) => {
                    if (typeof addUserToList === "function") {
                        addUserToList(mem);
                    }
                });
            }
        }
    }, [myChats]);

    useEffect(() => {
        setChatMembers(Object.values(members));
    }, [members]);

    const doCreateNewChat = () => {
        if (typeof chatUpsert === "function") {
            chatUpsert({
                _id: _chatId,
                title: inpTitle,
                members: chatMembers,
                avaFile: uploadRef.current && uploadRef.current.files && uploadRef.current.files[0],
            });
        }
    };

    function previewFile() {
        let file = uploadRef.current && uploadRef.current.files && uploadRef.current.files[0];
        let reader = new FileReader();

        reader.onloadend = function () {
            setSrcAva(reader.result);
        };

        if (file) {
            // console.log(file);
            reader.readAsDataURL(file);
        } else {
            setSrcAva("");
        }
    }

    // console.log(chatInfo.current);

    return (
        <>
            <div className="ChatDashBoard bg-light">
                <h5>{_chatId ? "Update chat:" : "New Chat:"}</h5>
                {myId !== (chatInfo.current && chatInfo.current.owner && chatInfo.current.owner._id) && _chatId && (
                    <span className="text-danger fw-bolder mb-2">You have no rights to edit this chat.</span>
                )}
                <table className="table table-bordered align-middle">
                    <tbody>
                        <tr>
                            <td className={`fw-bolder}`}>Chat title:</td>
                            <td>
                                <input
                                    className=" mb-2 p-2"
                                    placeholder="Title for new chat"
                                    onChange={(e) => setInpTitle(e.target.value)}
                                    ref={inputTiylegRef}
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            
                        </tr>
                        <tr>
                            <td>Chat members:</td>
                            <td>
                                {chatMembers.map((member) => (
                                    <CMemberItem key={member._id} member={member} />
                                ))}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <ButtonCancel />
                {!(myId !== (chatInfo.current && chatInfo.current.owner && chatInfo.current.owner._id) && _chatId) && (
                    <Button
                        className="gradient rounded-3 ms-2 mb-2"
                        disabled={!inpTitle}
                        onClick={doCreateNewChat}
                        variant="secondary btn-sm"
                    >
                        
                        <span className="ms-2">{_chatId ? "Update chat" : "Create new chat"}</span>
                    </Button>
                )}
            </div>
        </>
    );
};

export const CNewChatDashBoard = connect(
    (s, { _chatId }) => ({ myChats: s.auth.chats, members: s.newChatUsers, myId: s.auth.payloadId, _chatId }),
    {
        chatUpsert: actionCreateNewChat,
        addUserToList: actionAddUserToChatList,
    }
)(NewChatDashBoard);
