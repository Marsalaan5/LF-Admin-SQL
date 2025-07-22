import React from "react";

const NameForm = ({ setState, actionProvider }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    setState((prev) => ({ ...prev, name }));
    actionProvider.handleNext("Thanks! What's your email?");
  };

  return (
    <form onSubmit={handleSubmit} className="chat-form">
      <input
        name="name"
        placeholder="Enter your name"
        required
        className="chat-input"
      />
      <button type="submit" className="chat-button">Submit</button>
    </form>
  );
};

export default NameForm;
