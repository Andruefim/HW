//
//
import { urlUploadConst } from "../const";
import { actionPromise } from "../Reducers";
import { gql, actionSearchMessagesByChatId, actionUserInfo, actionAuthLogout } from "../Actions";
import history from "../history";
import { store } from "../Reducers";

export const actionMessageUpsert = ({ text, chatId, imgArray = [] }) => async (dispatch) => {

    let messageData = {
        text,
        chat: {
            _id: chatId,
        },
    };

    if (imgArray.current[0]) {
        messageData.media = imgArray.current.map((el) => ({
            _id: el._id,
        }));
    }


    let msgData = await dispatch(
        actionPromise(
            "MessageUpsert",
            gql(
                `mutation MessageUpsert($messageData:MessageInput){
                    MessageUpsert(message: $messageData){
                        _id
                        media{
                            _id
                            url
                        }
                    }
                }`,
                { messageData }
            )
        )
    );

  

    if (msgData.errors && msgData.errors[0] && msgData.errors[0].message) {

        dispatch(actionUserInfo(store.getState().auth.payloadId));
        history.push("/");
    }
};


const actionMediaUpsert = ({ chatId, mediaId }) => async (dispatch) => {
    let mediaData = await dispatch(
        actionPromise(
            "MediaUpsert",
            gql(
                `mutation med($mediaData:MediaInput){
                    MediaUpsert(media: $mediaData){
                        _id
                        owner{login}
                        text
                        url
                        type
                        userAvatar{login}
                        chatAvatars{title}
                    }
                }`,
                { mediaData: { _id: mediaId, chatAvatars: [{ _id: chatId }] } }
            )
        )
    );
};

export const actionCreateNewChat = ({ _id, title, members, avaFile }) => async (dispatch) => {


    members = members.map((mem) => ({ _id: mem._id }));

    let tempObj = { title, members };

    if (_id) {
        tempObj._id = _id;
    }

    let chatData = await dispatch(
        actionPromise(
            "ChatUpsert",
            gql(
                `mutation ChatUpsert($newChat:ChatInput){
                    ChatUpsert(chat:$newChat){
                        _id
                        title
                        owner{login}
                        members{login}
                    }
                }`,
                { newChat: tempObj }
            )
        )
    );


    if (chatData && chatData.data && chatData.data.ChatUpsert && chatData.data.ChatUpsert._id) {
        if (avaFile) {
            let avaUploadResult = await uploadMedia(avaFile);

            await dispatch(actionMediaUpsert({ chatId: chatData.data.ChatUpsert._id, mediaId: avaUploadResult._id }));
        }


        await dispatch(actionUserInfo(members[0]._id));

        history.push(`/main/${chatData.data.ChatUpsert._id}`);
    } else {
        alert("Ошибка создания/обновления чата");
        history.goBack();
    }
};

const uploadMedia = async (media) => {
    let dataSingl = new FormData();
    dataSingl.set("media", media);
    return await fetch(`${urlUploadConst}/upload`, {
        method: "POST",
        headers: localStorage.authToken ? { Authorization: "Bearer " + localStorage.authToken } : {},
        body: dataSingl,
    }).then((res) => res.json());
};

export const actionUserUpdate = ({ _id, login, nick, password, avaFile, isNeedLogout }) => async (dispatch) => {


    let dataObj = { _id };

    if (login) dataObj.login = login;
    if (nick) dataObj.nick = nick;
    if (password) dataObj.password = password;

    if (avaFile) {
        let avaUploadResult = await uploadMedia(avaFile);

        if (avaUploadResult && avaUploadResult._id) {
            dataObj.avatar = { _id: avaUploadResult._id };
        } else {
            alert("Ошибка загрузки аватарки");
        }
    }



    let userUpserResult = await dispatch(
        actionPromise(
            "UserUpsert",
            gql(
                `mutation UserUpsert($userData:UserInput){
                    UserUpsert(user: $userData){
                        _id
                        login
                        nick
                        avatar {url}
                        chats {
                            _id
                            title
                            owner{_id}
                            avatar {url}
                            members{_id login nick avatar{url}}
                        }
                    }
                }`,
                { userData: dataObj }
            )
        )
    );

 

    if (!userUpserResult.errors) {
        if (isNeedLogout) {
            await dispatch(actionAuthLogout());
        } else {
            await dispatch(actionUserInfo(_id));
        }
    } else {
        alert(`Обновить данные пользователя не удалось \n ${userUpserResult.errors}`);
    }

    history.push("/main");
};
