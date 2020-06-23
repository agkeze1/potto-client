import React, { FC, useState } from "react";
import wordCount from "word-character-count";
import { toast } from "react-toastify";

interface iProp {
    onSubmit?: any;
    total: number;
}

const MessageEditor: FC<iProp> = ({ onSubmit, total }) => {
    const perPage = 140;
    const [word, setWord] = useState<number>(0);
    const [character, setCharacter] = useState<number>(0);
    const [message, setMessage] = useState<string>();

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                if (message?.trim()) {
                    onSubmit(message);
                } else {
                    toast.info("You are not allowed to send an empty text message!", {
                        position: "bottom-right",
                    });
                }
            }}
        >
            <textarea
                onChange={async ({ currentTarget: { value } }) => {
                    setCharacter(value.length);
                    const _res = await wordCount.WordCount(value);
                    setWord(_res.WordCount);
                    setMessage(value);
                }}
                name="message"
                id="message"
                cols={30}
                rows={10}
                className="form-control"
            ></textarea>

            <div
                className="mt-5"
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignContent: "center",
                }}
            >
                <div>
                    <strong>Word count</strong>:{" "}
                    <span className="text-primary" style={{ fontSize: "1.5em" }}>
                        {word}
                    </span>
                </div>
                <div>
                    <strong>Character count</strong>{" "}
                    <span className="text-primary" style={{ fontSize: "1.5em" }}>
                        {Intl.NumberFormat("en-US").format(character)}
                    </span>
                </div>
                <div>
                    <strong>Page count</strong>{" "}
                    <span className="text-primary" style={{ fontSize: "1.5em" }}>
                        {Math.ceil(character / perPage)}
                    </span>
                </div>
                {total > 0 && (
                    <div>
                        <strong>Receiver</strong>{" "}
                        <span className="text-primary" style={{ fontSize: "1.5em" }}>
                            {Intl.NumberFormat("en-US").format(total)}
                        </span>
                    </div>
                )}
            </div>
            <div className="text-right mt-3">
                <button className="btn btn-primary" type="submit">
                    Send Message <div className="os-icon os-icon-send"></div>
                </button>
            </div>
        </form>
    );
};

export default MessageEditor;
