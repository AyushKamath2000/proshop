import React, { useRef, useState, useEffect } from "react";
import generateChatMessage from "../Google/ConfigForChatBot";

const ChatModal = ({ show, onClose }) => {
    const styles = {
        backdrop: {
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.1)",
            zIndex: 1999,
        },
        modal: {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "360px",
            height: "600px",
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "rgba(0,0,0,0.24) 0px 3px 8px",
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            fontFamily: "Raleway, sans-serif",
        },
        header: {
            background: "#1a1a1a",
            color: "white",
            padding: "12px 16px",
            borderRadius: "20px 20px 0 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        closeBtn: {
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
        },
        body: {
            flex: 1,
            padding: "8px",
            overflowY: "auto",
        },
        inputTextWrapper: {
            display: "flex",
            justifyContent: "flex-end",
            padding: "8px",
        },
        bubbleBase: {
            width: "80%",
            padding: "16px",
            margin: "8px 0",
            borderRadius: "20px",
            fontSize: "16px",
        },
        modelBubble: {
            background: "#f5f5f5",
        },
        userBubble: {
            background: "#3d88f9",
            color: "white",
            alignSelf: "flex-end",
        },
        inputArea: {
            height: "70px",
            display: "flex",
            alignItems: "center",
            padding: "0 8px",
            borderTop: "1px solid lightgray",
        },
        input: {
            flex: 1,
            height: "40px",
            paddingLeft: "20px",
            border: "none",
            background: "#f5f5f5",
            borderRadius: "20px",
            fontSize: "16px",
        },
        sendBtn: {
            height: "40px",
            width: "40px",
            marginLeft: "12px",
            border: "none",
            borderRadius: "100%",
            background: "#3d88f9",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
        },
    };

    const sendMessage = () => {
        if (!message) return;

        setMessageKeyValue((prev) => [
            ...prev,
            {
                role: "user",
                parts: [{ text: message }],
            },
        ]);
        setLoading(true);
        setMessage("");
    };
    const modalRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [messageKeyValue, setMessageKeyValue] = useState([
        {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
    ]);

    useEffect(() => {
        const last = messageKeyValue[messageKeyValue.length - 1];
        if (last.role !== "user") return;

        const userText = last.parts[0].text;

        generateChatMessage(userText, messageKeyValue).then((response) => {
            setMessageKeyValue((prev) => [
                ...prev,
                {
                    role: "model",
                    parts: [{ text: response.text || "Sorry, cannot load your message." }],
                },
            ]);
            setLoading(false);
        });
    }, [messageKeyValue]);

    if (!show) return null;
    return (
        <>
            <div style={styles.backdrop} />

            <div ref={modalRef} style={styles.modal}>
                <div style={styles.header}>
                    <span>AI CHAT BOT</span>
                    <button style={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div style={styles.body}>
                    {messageKeyValue.map((msgObj, index) =>
                        msgObj.role === "model" ? (
                            msgObj.parts.map((part, partIndex) => (
                                <p
                                    key={`${index}-p-${partIndex}`}
                                    style={{ ...styles.bubbleBase, ...styles.modelBubble }}
                                >
                                    {part.text}
                                </p>
                            ))
                        ) : (
                            <div style={styles.inputTextWrapper} key={index}>
                                {msgObj.parts.map((part, partIndex) => (
                                    <p
                                        key={`${index}-p-${partIndex}`}
                                        style={{ ...styles.bubbleBase, ...styles.userBubble }}
                                    >
                                        {part.text}
                                    </p>
                                ))}
                            </div>
                        )
                    )}
                    {loading && (
                        <div style={{ textAlign: "center", margin: "16px 0" }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>

                <div style={styles.inputArea}>
                    <input
                        value={message}
                        onInput={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        style={styles.input}
                        disabled={loading}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") sendMessage();
                        }}
                    />
                    <button onClick={sendMessage} style={styles.sendBtn} disabled={loading}>
                        ➤
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatModal;
