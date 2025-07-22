import React from "react";

const EmailForm = ({ setState, actionProvider }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    setState((prev) => ({ ...prev, email }));
    actionProvider.handleNext("Great. Please describe your complaint.");
  };

  return (
    <form onSubmit={handleSubmit} className="chat-form">
      <input
        name="email"
        type="email"
        placeholder="Enter your email"
        required
        className="chat-input"
      />
      <button type="submit" className="chat-button">Submit</button>
    </form>
  );
};

export default EmailForm;
