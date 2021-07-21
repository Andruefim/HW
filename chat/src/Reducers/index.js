import React, { Component, useState, useEffect } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import jwt_decode from "jwt-decode";
import history from "../history";
import { actionUserInfo, countMsgInChat } from "../Actions";
import * as io from "socket.io-client";
const urlUploadConst = "http://chat.fs.a-level.com.ua";


export const socket = io.connect(urlUploadConst);

const actionSocketMessage = (msg) => ({ type: "SOCKET_MSG", msg });
const actionSocketChat = (chat) => ({ type: "SOCKET_CHAT", chat });
const actionSocketChatLeft = (chat_left) => ({ type: "SOCKET_CHAT_LEFT", chat_left });

console.log("- socket start -");  


socket.on("jwt_ok", (data) => console.log("jwt_ok", data));
socket.on("jwt_fail", (error) => console.log("jwt_fail", error));

socket.on("msg", (msg) => {
    console.log("soket msg - ", msg);
    store.dispatch(actionSocketMessage(msg));
});

socket.on("chat", (chat) => {
    console.log("soket chat - ", chat);
    store.dispatch(actionSocketChat(chat));
});

socket.on("chat_left", (chat_left) => {
    console.log("soket chat_left - ", chat_left);
    store.dispatch(actionSocketChatLeft(chat_left));
});

// этот редьюсер как бы совсем не нужен
// пусть побудет на период отладки
function socketReducer(state = {}, action) {
    if (["LOGOUT", "LOGIN"].includes(action.type)) return {};

    // console.log("-ACTION- : ", action);

    if (["SOCKET_MSG", "SOCKET_CHAT", "SOCKET_CHAT_LEFT"].includes(action.type)) {
        // console.log("-ACTION- : ", action);

        return { ...state, ...action };
    }

    return state;
}

function authReducer(state, action) {
    if (state === undefined) {
        if (!localStorage.authToken) {
            return {};
        } else {
            action.type = "LOGIN";
            action.jwt = localStorage.authToken;
        }
    }

    if (action.type === "LOGIN") {
        try {
            localStorage.authToken = action.jwt;
            // socket.emit("jwt", localStorage.authToken);   разкомментить
            // console.log("ЛОГИН", jwt_decode(action.jwt).sub.login);
            return {
                login: true,
                token: action.jwt,
                payload: jwt_decode(action.jwt).sub.login,
                payloadId: jwt_decode(action.jwt).sub.id,
                //FIXME: ниже отладочный _userId Antipmen
                // payloadId: "5e97105693e2915e617c6fc1",
            };
        } catch (error) {
            console.log(error);
            localStorage.removeItem("authToken");
            return {};
        }
    }

    if (action.type === "LOGOUT") {
        console.log("ЛОГАУТ");
        localStorage.removeItem("authToken");
        return {};
    }

    if (action.type === "INFO") {
        // console.log("INFO **************** ", action.userInfo);

        let tempObj = {
            ...state,
            payload: action.userInfo.login,
            payloadId: action.userInfo._id,
            nick: action.userInfo.nick,
            avatarUrl: action.userInfo.url,
            chats: action.userInfo.chats,
        };

        // для сортировки чатов по дате добавление поля lastModified
        if (Array.isArray(tempObj.chats)) {
            tempObj.chats = tempObj.chats.map((chat) => {
                chat.lastModified = chat.createdAt;
                return chat;
            });
        }

        return { ...tempObj };
    }

    // для корректной сортировки чатов по дате последнего сообщения
    if (action.type === "UPDATE_CHAT_LASTMODIFIED") {
        if (Array.isArray(state.chats)) {
            for (let i in state.chats) {
                if (state.chats[i]._id === action._chatId && state.chats[i].lastModified < action.lastMsgCreatedAt) {
                    // надо пересобрать объект, чтобы React "почуствовал" изменения
                    state.chats[i] = { ...state.chats[i], lastModified: action.lastMsgCreatedAt };
                }
            }
        }

        // сортировка списка чатов согласно полю lastModified
        if (Array.isArray(state.chats)) {
            state.chats.sort((a, b) => b.lastModified - a.lastModified);
        }

        // теперь пересобрать массив, чтобы React "почуствовал" изменения
        if (Array.isArray(state.chats)) {
            state.chats = [...state.chats];
        }

        // ну и пересобрать state, чтобы React "почуствовал" изменения
        return { ...state };
    }

    // пришло обновление чата
    if (action.type === "SOCKET_CHAT") {
        let newChat = {
            _id: action.chat._id,
            title: action.chat.title,
            createdAt: action.chat.createdAt,
            owner: action.chat.owner,
            avatar: action.chat.avatar,
            members: action.chat.members,
            lastModified: action.chat.lastModified,
        };

        state.chats = state.chats.filter((chat) => {
            return chat._id !== action.chat._id;
        });

        state.chats = [newChat, ...state.chats];

        // обновить счетчик
        countMsgInChat(action.chat._id);

        return { ...state };
    }

    // выдвигаем чат с новым сообщением на 1-е место
    // для всплытия этого чата на экране на самый верх
    if (action.type === "SOCKET_MSG") {
        let topChat;

        if (Array.isArray(state.chats)) {
            topChat = state.chats.find((el) => el._id === action.msg.chat._id);
        }

        // именно filter - чтобы удалить дубликаты, вдруг они там есть
        state.chats = state.chats.filter((chat) => chat._id !== action.msg.chat._id);

        state.chats = [topChat, ...state.chats];

        return { ...state };
    }

    if (action.type === "SOCKET_CHAT_LEFT") {
        state.chats = state.chats.filter((chat) => {
            return chat._id !== action.chat_left._id;
        });

        state.chats = [...state.chats];

        return { ...state };
    }

    return state;
}

// счетчики общего числа сообщений в чатах
function countReducer(state = {}, action) {
    if (["LOGOUT", "LOGIN"].includes(action.type)) return {};

    if (action.type === "NEW_COUNT") {
        return { ...state, ...action.count };
    }

    return state;
}

function msgReducer(state = {}, action) {
    if (["LOGOUT", "LOGIN"].includes(action.type)) return {};

    if (action.type === "NEW_CHAT") {
        return { ...state, ...action.msgs };
    }

    if (action.type === "CHAT_INS_HEAD") {
        let [key, value] = Object.entries(action.msgs)[0];
        return { ...state, [key]: [...value, ...state[key]] };
    }

    if (action.type === "SOCKET_MSG") {
        let newMsgItem = {
            _id: action.msg._id,
            createdAt: action.msg.createdAt,
            owner: {
                _id: action.msg.owner._id,
                login: action.msg.owner.login,
                nick: action.msg.owner.nick,
                avatar: { url: (action.msg.owner.avatar && action.msg.owner.avatar.url) || "" },
            },
            text: action.msg.text,
            chat: {
                _id: action.msg.chat._id,
                title: action.msg.chat.title,
                avatar: { url: (action.msg.chat.avatr && action.msg.chat.avatr.url) || "" },
            },
        };

        if (action.msg.media && action.msg.media[0]) {
            newMsgItem.media = [...action.msg.media];
        }

        // обновить счетчик
        countMsgInChat(action.msg.chat._id);

        if (state[action.msg.chat._id]) {
            return { ...state, ...{ [action.msg.chat._id]: [...state[action.msg.chat._id], newMsgItem] } };
        }

        return { ...state, ...{ [action.msg.chat._id]: newMsgItem } };
    }

    return state;
}

// список пользователей для нового создаваемого чата
function newChatUsersReducer(state = {}, action) {
    if (["LOGOUT", "LOGIN"].includes(action.type)) return {};

    if (action.type === "ADD_USER_TO_CHAT_LIST") {
        return { ...state, ...action.user };
    }

    if (action.type === "DELETE_USER_FROM_CHAT_LIST") {
        delete state[action._id];
        return { ...state };
    }

    if (action.type === "NEW_CHAT_LIST") {
        return { ...action.user };
    }

    return state;
}

function currentChatIdReducer(state = {}, action) {
    if (["LOGOUT", "LOGIN"].includes(action.type)) return {};

    if (action.type === "CURRENTID") {
        return { curChatId: action.curChatId };
    }

    return state;
}

function promiseReducer(state = {}, action) {
    if (["LOGOUT", "LOGIN"].includes(action.type)) return {};
    if (action.type === "PROMISE") {
        const { name = "default", status, payload, error } = action;
        if (status) {
            return {
                ...state,
                [name]: {
                    status,
                    payload: (status === "PENDING" && state[name] && state[name].payload) || payload,
                    error,
                },
            };
        }
    }
    return state;
}

export const actionPromise = (name, promise) => {
    const actionPending = () => ({ type: "PROMISE", name, status: "PENDING", payload: null, error: null });
    const actionResolved = (payload) => ({ type: "PROMISE", name, status: "RESOLVED", payload, error: null });
    const actionRejected = (error) => ({ type: "PROMISE", name, status: "REJECTED", payload: null, error });

    return async (dispatch) => {
        dispatch(actionPending());
        let payload;
        try {
            payload = await promise;
            dispatch(actionResolved(payload));
        } catch (e) {
            dispatch(actionRejected(e));
        }
        return payload;
    };
};

export const store = createStore(
    combineReducers({
        auth: authReducer,
        promise: promiseReducer,
        msg: msgReducer,
        curChatId: currentChatIdReducer,
        newChatUsers: newChatUsersReducer,
        countMsg: countReducer,
        // socket: socketReducer,
    }),
    applyMiddleware(thunk)
);

store.subscribe(() => console.log(store.getState()));
