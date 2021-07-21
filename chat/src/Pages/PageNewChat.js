import { ButtonToMain, ButtonCancel, CNewChatDashBoard } from "../Components";
import { urlUploadConst } from "../const";
import { actionGetAllUsers, actionAllUsersFind, actionDelUserFromChatList } from "../Actions";
import { connect } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { store } from "../Reducers";
import { useRef } from "react";
import history from "../history";
import { CUserInfo } from "../Layout";
import { CAllUsersList } from "../Layout";
import { useDropzone } from "react-dropzone";
import logo from "../images/logo23.png";
import chat_square_text from "../icons/chat-square-text.svg";
import userEvent from "@testing-library/user-event";

const PageNewChat = ({ doSearchUsers = null, match: { params: { _chatId = "" } = {} } = {} }) => {
    const [searchUserStr, setSearchUserStr] = useState("");

    // если не залогинены - вперед к регистрации/логину
    if (!store.getState().auth || !store.getState().auth.login) {
        history.push("/");
    }

    // если ввели поиск пользователей - будем искать
    useEffect(() => {
        if (searchUserStr && typeof doSearchUsers === "function") {
            doSearchUsers(0, searchUserStr);
        }
    }, [searchUserStr]);

    return (
        <div className="maxWidthPageMain">
            <div className="container-fluid">
                <div className="row g-3">
                    <div className="col-md-4">
                        <div className="maxWidthForSideBar shadow">
                            <div className="bg-light gradient shadow-sm border-2 rounded-3 flex-grow-1 pt-2">
                                <h6 className="ms-2 fs-5">Members:</h6>
                                <div className="p-2">
                                    <input
                                        className="form-control mb-2 border border-secondary border-2"
                                        placeholder="Search users"
                                        onInput={(e) => {
                                            setSearchUserStr(e.target.value);
                                        }}
                                    ></input>
                                </div>

                                <CAllUsersList searchUserStr={searchUserStr} />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <CNewChatDashBoard _chatId={_chatId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CPageNewChat = connect(null, { doSearchUsers: actionAllUsersFind })(PageNewChat);
