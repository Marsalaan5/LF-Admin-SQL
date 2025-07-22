// import React from "react";
// import Chatbot from "react-chatbot-kit";
// import "react-chatbot-kit/build/main.css";

// import config from "./config";
// import MessageParser from "./MessageParser";
// import ActionProvider from "./Actionprovider";

// function ChatBotFlow() {
//   return (
//     <div className="chatbot-container" style={{ maxWidth: 400, margin: "0 auto" }}>
//       <Chatbot
//         config={config}
//         messageParser={MessageParser}
//         actionProvider={ActionProvider}
//       />
//     </div>
//   );
// }

// export default ChatBotFlow;



import React from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";

import config from "..chatbot/config.js";
import MessageParser from "..chatbot/MessageParser";
import ActionProvider from "../chatbot/ActionProvider";

function ChatBotFlow() {
  return (
    <div
      className="chatbot-container"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "350px",
        zIndex: 9999,
      }}
    >
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  );
}

export default ChatBotFlow;
