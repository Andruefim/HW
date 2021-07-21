import { CUserInfo } from "../Layout";
import { CAdditionalTools, ChatsList } from "../Components";

export const Sidebar = () => {
    return (
        <>
            <div className="bg-light gradient shadow-sm border-2 rounded-3 flex-grow-1">
                <CAdditionalTools />
                <ChatsList className="ChatsList" />
            </div>
        </>
    );
};
