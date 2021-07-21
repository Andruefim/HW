import logo from "../images//logo23.jpg";
import { connect } from "react-redux";
import { urlUploadConst } from "../const";
import { Link } from "react-router-dom";
import { CCounter } from "../Components";
import personFillIcon from "../icons/person-fill.svg";
import history from "../history";
import { useEffect } from "react";
import { useState } from "react";

const ChatItem = ({ _id = "", avatar, title, currentChatId }) => {

    return (
        <Link to={`/main/${_id}`} className="noUnderLine">
            <>
                <li
                    className={
                        _id === currentChatId
                            ? "list-group-item list-group-item-secondary m-1 gradient shadow border-2 rounded-1"
                            : "list-group-item list-group-item-light m-1 gradient shadow-sm border-2 rounded-1"
                    }
                >
                    <div className="d-flex justify-content-start align-items-center">  
                        <div className="text-dark fs-6 fw-bolder py-3 ms-2 lh-1">{`${title}`}</div>
                    </div>
                    
                </li>
            </>
        </Link>
    );
};

const List = ({ arrayOfChats, userId, currentChatId }) => {

    if (!arrayOfChats) return <></>;

    return (
        <ul className="list-group" role="tablist">
            {arrayOfChats.map((a) => (
                <ChatItem key={a._id} {...a} userId={userId} currentChatId={currentChatId} />
            ))}
        </ul>
    );
};

const CList = connect((s) => ({
    currentChatId: s.curChatId && s.curChatId.curChatId,
    arrayOfChats: s.auth && s.auth.chats,
    userId: s.auth && s.auth.payloadId,
}))(List);

export const ChatsList = () => (
    <div className="ChatsList" style={{backgroundImage: "url(https://neuronacreativa.com/cattleya/app-assets/images/backgrounds/chat-bg-2.png)"}}>
        <CList />
    </div>
);
