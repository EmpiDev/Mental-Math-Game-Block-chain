import React from "react";

const Admin = ({
  isOwner,
  contract,
  newQuestion,
  setNewQuestion,
  newSolution,
  setNewSolution,
  handleAddQuestion,
  handleSetFirstActive,
  handleNextQuestion,
  feedback
}) => (
  isOwner && contract ? (
    <div className="admin-panel">
      <h3>Admin</h3>
      <form onSubmit={handleAddQuestion} style={{ marginBottom: "1em" }}>
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Nouvelle question (ex: 5+7)"
          required
        />
        <input
          type="number"
          value={newSolution}
          onChange={(e) => setNewSolution(e.target.value)}
          placeholder="Solution (ex: 12)"
          required
        />
        <button type="submit">Ajouter la question</button>
      </form>
      <button onClick={handleSetFirstActive} style={{ marginRight: "0.5em" }}>
        Activer la première question
      </button>
      <button onClick={handleNextQuestion}>
        Passer à la question suivante
      </button>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  ) : (
    <p>Accès réservé à l'administrateur.</p>
  )
);

export default Admin;
