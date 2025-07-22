import { createChatBotMessage } from "react-chatbot-kit";
import NameForm from "../chatbot/widgets/NameForm";
import EmailForm from "../chatbot/widgets/EmailForm";
import ComplaintForm from "../chatbot/widgets/ComplaintForm";

const config = {
  initialMessages: [
    createChatBotMessage("Hi! I can help you file a complaint. What's your name?", {
      widget: "collectName"
    }),
  ],
  botName: "SupportBot",
  customStyles: {
    botMessageBox: { backgroundColor: '#0d6efd' },
    chatButton: { backgroundColor: '#0d6efd' },
  },
  state: {
    name: '',
    email: '',
    complaint: '',
  },
  widgets: [
    {
      widgetName: "collectName",
      widgetFunc: (props) => <NameForm {...props} />,
    },
    {
      widgetName: "collectEmail",
      widgetFunc: (props) => <EmailForm {...props} />,
    },
    {
      widgetName: "collectComplaint",
      widgetFunc: (props) => <ComplaintForm {...props} />,
    },
  ]
};

export default config;
