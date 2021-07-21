//

export const actionNewChatList = (user) => {
    return { type: "NEW_CHAT_LIST", user: { [user._id]: user } };
};

export const actionAddUserToChatList = (user) => {
    return { type: "ADD_USER_TO_CHAT_LIST", user: { [user._id]: user } };
};

export const actionDelUserFromChatList = (_id) => {
    return { type: "DELETE_USER_FROM_CHAT_LIST", _id };
};
