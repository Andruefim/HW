//

import { ButtonToMain } from "../Components";
import { urlUploadConst } from "../const";
import { actionDelUserFromChatList, actionAddUserToChatList, actionNewChatList } from "../Actions";
import { connect } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { store } from "../Reducers";
import { useRef } from "react";
import history from "../history";
import { CUserInfo } from "../Layout";

const UserItem = ({ _id, login, nick, avatar, myId, addUserToList = null, delUserFromList = null, newChatUsers }) => {
    const avatarUrl = avatar && avatar.url;

    // если нет ника, то берем логин
    nick = !!nick ? nick : login;

    const doSelectUser = () => {
        if (_id !== myId) {
            if (_id in newChatUsers) {
                if (typeof addUserToList === "function") {
                    delUserFromList(_id);
                }
            } else {
                if (typeof delUserFromList === "function") {
                    addUserToList({ _id, login, nick, avatar });
                }
            }
        }
    };

    return (
        <>
            <li
                className={`position-relative m-2 list-group-item-${
                    _id in newChatUsers || _id === myId ? "secondary rounded-1 shadow" : "light rounded-1 shadow-sm"
                } m-1 gradient border-2 `}
                onClick={doSelectUser}
            >
                <div className="d-flex justify-content-start align-items-center py-3">
                    
                    <div className="text-dark fs-5 ms-2 lh-sm">{`${nick}`}</div>
                </div>
                {/* FIXME: */}
                {/* <span className="position-absolute bottom-0 end-0  badge rounded-pill bg-secondary">
                    {_id}
                    <span className="visually-hidden">_id пользователя</span>
                </span> */}
            </li>
        </>
    );
};

const CUserItem = connect(
    (s) => ({
        newChatUsers: s.newChatUsers,
    }),
    { delUserFromList: actionDelUserFromChatList, addUserToList: actionAddUserToChatList }
)(UserItem);

const AllUsersList = ({
    searchUserResultArr,
    myId,
    myLogin,
    myNick,
    myAvatarUrl,
    myChats = [],
    createNewChatList = null,
    searchUserStr,
}) => {
    // создаем новый список пользователей нового чата со мной во главе
    useEffect(() => {
        if (typeof createNewChatList === "function")
            createNewChatList({ _id: myId, login: myLogin, nick: myNick, avatar: { url: myAvatarUrl } });
    }, []);

    let tempResult;

    // если из базы ничего еще не пришло по поиску пользователей,
    // то посмотрим на всех, с кeм мы вообще уже общались в чатах

    // эта проверка нужна, так как если моих чатов нет, то из базы приходит null
    if (!myChats) myChats = [];

    if (!searchUserStr || !searchUserResultArr) {
        let tempObj = {};
        for (let chat of myChats) {
            for (let member of chat.members) {
                let { _id, ...restData } = member;
                tempObj = { ...tempObj, [_id]: member };
            }
        }
        tempResult = Object.values(tempObj);
    } else {
        tempResult = searchUserResultArr;
    }

    // выкидываем пользователей, у которых (ник из одних пробелов) или (нет ника но логин из одних пробелов)
    // с ними не интересно общаться ))
    // это глюки базы - таких пользователей быть не должно

    searchUserResultArr = tempResult
        .filter((el) => {
            if (!el.login) return false;
            if (el.nick && !el.nick.replace(/ +/g, " ").trim()) {
                return false;
            } else {
                return !!el.login.replace(/ +/g, " ").trim();
            }
        })
        .sort((a, b) => ((a.nick || a.login) > (b.nick || b.login) ? 1 : -1));

    return (
        <div className="bg-light AllUsersList rounded-3">
            <ul className="list-group " role="tablist">
                {!!searchUserResultArr &&
                    searchUserResultArr.map((user) => <CUserItem key={user._id} {...user} myId={myId} />)}
            </ul>
        </div>
    );
};

export const CAllUsersList = connect(
    (s, { searchUserStr }) => ({
        searchUserStr,
        searchUserResultArr:
            s.promise &&
            s.promise.UserFind &&
            s.promise.UserFind.payload &&
            s.promise.UserFind.payload.data &&
            s.promise.UserFind.payload.data.UserFind,
        myId: s.auth.payloadId,
        myLogin: s.auth.payload,
        myNick: s.auth.nick,
        myAvatarUrl: s.auth.avatarUrl,

        myChats: s.auth.chats,
    }),
    {
        createNewChatList: actionNewChatList,
    }
)(AllUsersList);
