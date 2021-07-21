import { Redirect } from "react-router-dom";
import history from "../history";
import { useState, useEffect } from "react";
import { actionSearchChat } from "../Actions";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";

export const AdditionalTools = ({ _userId, onSearch = null }) => {

    return (
        <div className="bg-light  text-nowrap ">

            <Button
                className="gradient ms-2 mb-2 rounded-3"
                variant="secondary btn-sm"
                onClick={() => {
                    history.push("/newchat");
                }}
            >
                <span className="ms-2">New Chat</span>
            </Button>
        </div>
    );
};

export const CAdditionalTools = connect(
    (s) => ({
        _userId: s.auth && s.auth.payloadId,
    })
)(AdditionalTools);
