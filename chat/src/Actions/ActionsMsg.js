//

export const actionMsgNewChat = (msgArr) => {

    return { type: "NEW_CHAT", msgs: { [msgArr[0].chat._id]: msgArr } };
};

export const actionMsgInsertInHead = (msgArr) => {

    return { type: "CHAT_INS_HEAD", msgs: { [msgArr[0].chat._id]: msgArr } };
};

export const actionCurChatId = (curChatId) => ({ type: "CURRENTID", curChatId });

export const actionUpdateChatCreatedAt = (_chatId, lastMsgCreatedAt) => ({
    type: "UPDATE_CHAT_LASTMODIFIED",
    _chatId,
    lastMsgCreatedAt,
});
