// client/src/App.js
import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import "./App.css";

// Importer l'ABI et l'adresse du contrat
import MentalMathGameArtifact from "./contracts/MentalMathGame.json";
import contractAddressData from "./contracts/contract-address.json";
import NavBar from "./NavBar";
import Game from "./Game";
import Admin from "./Admin";
import About from "./About";

const CONTRACT_ADDRESS = contractAddressData.MentalMathGame;
const CONTRACT_ABI = MentalMathGameArtifact.abi;

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const [currentProblem, setCurrentProblem] = useState("");
  const [isQuestionActive, setIsQuestionActive] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [balance, setBalance] = useState("");
  const [contractBalance, setContractBalance] = useState("");
  const [rewardValue, setRewardValue] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newSolution, setNewSolution] = useState("");

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const currentAccount = accounts[0];
        setAccount(currentAccount);

        const web3Signer = await web3Provider.getSigner();
        setSigner(web3Signer);

        const gameContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          web3Signer
        );
        setContract(gameContract);

        const userEthBalance = await web3Provider.getBalance(currentAccount);
        setBalance(ethers.formatEther(userEthBalance));

        console.log("Wallet connected:", currentAccount);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setFeedback("Erreur de connexion au portefeuille: " + error.message);
      }
    } else {
      setFeedback("MetaMask n'est pas installé. Veuillez l'installer.");
      console.error("MetaMask not found");
    }
  }, []);

  const fetchContractData = useCallback(async () => {
    if (contract) {
      try {
        const [problem, active] = await contract.getQuestion();
        setCurrentProblem(problem);
        setIsQuestionActive(active);

        const cBalance = await contract.getContractBalance();
        setContractBalance(ethers.formatEther(cBalance));

        const rAmount = await contract.getRewardAmount();
        setRewardValue(ethers.formatEther(rAmount));

        if (account) {
          const userEthBalance = await provider.getBalance(account);
          setBalance(ethers.formatEther(userEthBalance));
        }
      } catch (error) {
        console.error("Error fetching contract data:", error);
        setFeedback("Erreur de récupération des données du contrat.");
      }
    }
  }, [contract, account, provider]);

  useEffect(() => {
    // Tenter de se connecter au démarrage si déjà autorisé
    // connectWallet(); // Peut être un peu aggressif, l'utilisateur préfère cliquer

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        console.log("Account changed:", accounts[0]);
        // Reconnecter avec le nouveau compte
        connectWallet();
      });
      window.ethereum.on("chainChanged", (chainId) => {
        console.log("Network changed to:", chainId);
        // Recharger la page ou reconnecter pour s'adapter au nouveau réseau
        window.location.reload();
      });
    }

    // Nettoyage des écouteurs d'événements
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, [connectWallet]);

  useEffect(() => {
    if (contract) {
      fetchContractData();

      // Écouter les événements du contrat
      const onAnswerCorrect = (player, reward, newScore) => {
        if (player.toLowerCase() === account?.toLowerCase()) {
          setFeedback(
            `Bravo ! Vous avez gagné ${ethers.formatEther(reward)} ETH. Votre score est maintenant ${ethers.formatEther(newScore)}.`
          );
          fetchContractData(); // Rafraîchir les données (balances, etc.)
        }
      };
      const onAnswerIncorrect = (player) => {
        if (player.toLowerCase() === account?.toLowerCase()) {
          setFeedback("Mauvaise réponse. Essayez encore !");
        }
      };
      const onQuestionSet = (problem, solution) => {
        setFeedback(
          "Une nouvelle question a été définie par l'administrateur."
        );
        fetchContractData();
      };

      contract.on("AnswerCorrect", onAnswerCorrect);
      contract.on("AnswerIncorrect", onAnswerIncorrect);
      contract.on("QuestionSet", onQuestionSet);

      return () => {
        contract.off("AnswerCorrect", onAnswerCorrect);
        contract.off("AnswerIncorrect", onAnswerIncorrect);
        contract.off("QuestionSet", onQuestionSet);
      };
    }
  }, [contract, account, fetchContractData]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!contract || !userAnswer) {
      setFeedback(
        "Veuillez connecter votre portefeuille et entrer une réponse."
      );
      return;
    }
    setFeedback("Soumission de la réponse...");
    try {
      const answerNum = parseInt(userAnswer, 10);
      if (isNaN(answerNum)) {
        setFeedback("Veuillez entrer un nombre valide.");
        return;
      }
      const tx = await contract.submitAnswer(answerNum);
      await tx.wait(); // Attendre la confirmation de la transaction
      // Le feedback sera mis à jour par l'event listener
      setUserAnswer(""); // Réinitialiser le champ de réponse
    } catch (error) {
      console.error("Error submitting answer:", error);
      let errorMessage = "Erreur lors de la soumission.";
      if (error.reason) {
        // Erreur de revert du contrat
        errorMessage = `Erreur du contrat: ${error.reason}`;
      } else if (error.message) {
        errorMessage = `Erreur: ${error.message}`;
      }
      setFeedback(errorMessage);
    }
  };

  // Vérifier si l'utilisateur est le propriétaire du contrat
  useEffect(() => {
    const checkOwner = async () => {
      if (contract && account) {
        try {
          const owner = await contract.owner();
          setIsOwner(owner.toLowerCase() === account.toLowerCase());
        } catch (e) {
          setIsOwner(false);
        }
      }
    };
    checkOwner();
  }, [contract, account]);

  // Ajout d'une question (admin)
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion || !newSolution) {
      setFeedback("Veuillez remplir la question et la solution.");
      return;
    }
    try {
      const tx = await contract.addQuestion(newQuestion, newSolution);
      await tx.wait();
      setFeedback("Question ajoutée !");
      setNewQuestion("");
      setNewSolution("");
      fetchContractData();
    } catch (error) {
      setFeedback("Erreur lors de l'ajout de la question.");
    }
  };

  // Passer à la question suivante (admin)
  const handleNextQuestion = async () => {
    try {
      const tx = await contract.nextQuestion();
      await tx.wait();
      setFeedback("Question suivante activée.");
      fetchContractData();
    } catch (error) {
      setFeedback("Erreur lors du passage à la question suivante.");
    }
  };

  // Activer la première question (admin)
  const handleSetFirstActive = async () => {
    try {
      const tx = await contract.setFirstQuestionActive();
      await tx.wait();
      setFeedback("Première question activée.");
      fetchContractData();
    } catch (error) {
      setFeedback("Erreur lors de l'activation de la première question.");
    }
  };

  return (
    <Router>
      <div className="App">
        <NavBar isOwner={isOwner} />
        <header className="App-header">
          {!account ? (
            <button onClick={connectWallet}>
              Connecter le Portefeuille (MetaMask)
            </button>
          ) : null}
          <Routes>
            <Route
              path="/"
              element={
                <Game
                  account={account}
                  balance={balance}
                  contractBalance={contractBalance}
                  rewardValue={rewardValue}
                  contract={contract}
                  isQuestionActive={isQuestionActive}
                  currentProblem={currentProblem}
                  userAnswer={userAnswer}
                  setUserAnswer={setUserAnswer}
                  handleSubmitAnswer={handleSubmitAnswer}
                  feedback={feedback}
                />
              }
            />
            <Route
              path="/about"
              element={<About />}
            />
            <Route
              path="/admin"
              element={
                <Admin
                  isOwner={isOwner}
                  contract={contract}
                  newQuestion={newQuestion}
                  setNewQuestion={setNewQuestion}
                  newSolution={newSolution}
                  setNewSolution={setNewSolution}
                  handleAddQuestion={handleAddQuestion}
                  handleSetFirstActive={handleSetFirstActive}
                  handleNextQuestion={handleNextQuestion}
                  feedback={feedback}
                />
              }
            />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
