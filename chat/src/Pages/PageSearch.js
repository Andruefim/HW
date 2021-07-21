import { ChatMessages } from "../Components";
import { Sidebar } from "../Layout";
import { store } from "../Reducers";
import history from "../history";
import { actionGetMessagesByChatId, actionSearchChat } from "../Actions";
import { connect } from "react-redux";
import { useState, useEffect } from "react";

//prettier-ignore
const PageMain = ({
    match: {params: { _chatId }},
    _userId,
    getChatList = null,
    getMesagesList = null,
}) => {
    // console.log("PageMain.js. - True _chatId: ", _chatId);

    useEffect(() => {
        if (typeof getChatList === "function") {
            getChatList(_userId);
        }
    }, [_userId]);

    useEffect(() => {
        if (typeof getMesagesList === "function") {
            getMesagesList(_chatId);
        }
    }, [_chatId]);

    if (
        //FIXME: надо засунуть router в redux
        !_userId ||
        !store.getState().auth ||
        !store.getState().auth.login ||
        _userId !== store.getState().auth.payloadId
    ) {
        history.push("/");
    }

    //FIXME: это временные _id
    _userId = "5e97105693e2915e617c6fc1"; // login "Antipmen"
    // if (_chatId) _chatId = "5e9ff91fd265602706d735cd"; // title "community"

    // if (typeof getData === "function") getData(_userId);

    return (
        <div className="PageMain container-fluid">
            <div className="row g-3">
                <div className="col-md-4">
                    {_userId + ` - подмена id`}
                    <Sidebar />
                </div>
                <div className="col-md-8">
                    <ChatMessages _chatId={_chatId} />
                </div>
            </div>
        </div>
    );
};

// prettier-ignore
export const CPageSearch = connect((s) => ({ _userId: s.auth && s.auth.payloadId }), {
    getChatList: actionSearchChat,
    getMesagesList: actionGetMessagesByChatId,
})(PageMain);
