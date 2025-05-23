import React from "react";

const Game = ({
  account,
  balance,
  contractBalance,
  rewardValue,
  contract,
  isQuestionActive,
  currentProblem,
  userAnswer,
  setUserAnswer,
  handleSubmitAnswer,
  feedback
}) => (
  <div className="game-area">
    <h2>Jeu de Calcul Mental Décentralisé</h2>
    <p>Connecté : {account?.substring(0, 6)}...{account?.substring(account.length - 4)}</p>
    <p>Votre Solde ETH : {balance} ETH</p>
    <p>Solde du Contrat : {contractBalance} ETH</p>
    <p>Récompense par question : {rewardValue} ETH</p>
    {contract && isQuestionActive ? (
      <div>
        <h3>Question : {currentProblem}</h3>
        <form onSubmit={handleSubmitAnswer}>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Votre réponse"
            required
          />
          <button type="submit">Soumettre</button>
        </form>
      </div>
    ) : (
      <p>Aucune question active pour le moment.</p>
    )}
    {feedback && <p className="feedback">{feedback}</p>}
  </div>
);

export default Game;
