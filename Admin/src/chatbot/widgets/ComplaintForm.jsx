import React from "react";

const ComplaintForm = ({ setState, state }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const complaint = e.target.complaint.value;
    const fullData = { ...state, complaint };

    try {
      const res = await fetch("/api/complaints/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullData)
      });

      if (res.ok) {
        setState((prev) => ({ ...prev, complaint }));
        alert("Complaint submitted successfully!");
      } else {
        alert("Something went wrong!");
      }
    } catch (err) {
      console.error("Error submitting complaint:", err);
      alert("Error submitting complaint.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-form">
      <textarea
        name="complaint"
        placeholder="Type your complaint..."
        required
        className="chat-textarea"
      />
      <button type="submit" className="chat-button">Submit</button>
    </form>
  );
};

export default ComplaintForm;
