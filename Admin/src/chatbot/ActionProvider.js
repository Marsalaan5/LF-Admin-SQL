class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleNext = (text) => {
    const message = this.createChatBotMessage(text);
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));

    if (text.toLowerCase().includes("email")) {
      this.setState((prev) => ({
        ...prev,
        currentWidget: "collectEmail"
      }));
    } else if (text.toLowerCase().includes("describe")) {
      this.setState((prev) => ({
        ...prev,
        currentWidget: "collectComplaint"
      }));
    }
  };
}

export default ActionProvider;
