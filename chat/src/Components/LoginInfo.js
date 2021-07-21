import { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { actionUserInfo } from "../Actions";

const LoginInfo = ({ login, nick, _id, getUserInfo }) => {
    useEffect(() => {
        // здесь нужен именно undefined, так как из базы может прийти null или ""
        // undefined - значит еще не было инфы из базы
        if (nick === undefined) {
            getUserInfo(_id);
        }
    }, []);

    return (
        <span className="mx-2 text-white ">
            {login ? (
                <span className="text-nowrap">
                    <span className="text-nowrap"> {`${nick ? nick : login}`} </span>
                    {/* {" / "}
                    <span className="text-nowrap">{`Login: ${login}`}</span>
                    <br />
                    <span className="text-nowrap">{`_id: ${_id}`}</span> */}
                </span>
            ) : (
                <Link to="/">"You should log in"</Link>
            )}
        </span>
    );
};

export const CLoginInfo = connect((s) => ({ login: s.auth.payload, nick: s.auth.nick, _id: s.auth.payloadId }), {
    getUserInfo: actionUserInfo,
})(LoginInfo);
