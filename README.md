**Table des Matières**

1. [Introduction](#introduction)
2. [Comment y jouer](#1-comment-y-jouer)
   1. [Connexion du portefeuille](#11-connexion-du-portefeuille)
   2. [Répondre à une question](#12-répondre-à-une-question)
   3. [Réception de la récompense](#13-réception-de-la-récompense)
   4. [Lancement des questions (admin)](#14-lancement-des-questions-pour-administrateur)
   5. [Ajouter une nouvelle question](#15-ajouter-une-nouvelle-question)
   6. [Question disponible pour les utilisateurs](#16-question-disponible-pour-les-utilisateurs)
   7. [Navigation entre les questions](#17-navigation-entre-les-questions)
3. [Architecture Technique](#2-architecture-technique)
   1. [Vue d'Ensemble](#21-vue-densemble)
   2. [Diagramme Architectural](#22-diagramme-architectural)
4. [Rôle de Chaque Composant](#3-rôle-de-chaque-composant)
   1. [React (Frontend)](#31-react-frontend)
   2. [Ethers.js](#32-ethersjs)
   3. [MetaMask (Portefeuille)](#33-metamask-portefeuille)
   4. [Ganache (Blockchain Locale)](#34-ganache-blockchain-locale)
   5. [Hardhat (Framework de Développement)](#35-hardhat-framework-de-développement)
   6. [Smart Contract MentalMathGame.sol](#36-smart-contract-mentalmathgamesol)
5. [Fonctionnement de la Logique de Récompense](#4-fonctionnement-de-la-logique-de-récompense)
6. [Déploiement et Test de l'Application Localement](#5-déploiement-et-test-de-lapplication-localement)
   1. [Prérequis](#51-prérequis)
   2. [Déploiement du Smart Contract](#52-déploiement-du-smart-contract)
   3. [Lancement du Frontend](#53-lancement-du-frontend)
   4. [Test de l'Application](#54-test-de-lapplication)
7. [Conclusion](#7-conclusion)

---

**0. Introduction**

Ce document décrit l'architecture technique et le fonctionnement d'une application décentralisée (DApp) de calcul mental. L'objectif de cette DApp est de permettre aux utilisateurs de répondre à des questions de calcul simples et de recevoir des récompenses en Ether (ETH) pour les réponses correctes. L'application est conçue pour fonctionner initialement sur une blockchain locale simulée (Ganache) et utilise React pour l'interface utilisateur et Hardhat pour le développement et le déploiement du smart contract.

**1. Comment y jouer**

## 1.1 Connexion Du Portefeuille

Avant de commencer, connectez votre portefeuille MetaMask en cliquant sur le bouton **"Connecter le portefeuille"**.

<div style="text-align:center;"> <img src="Pasted image 20250522161921.png" alt="Connexion MetaMask" width="500"/> </div>

---

## 1.2 Répondre à Une Question

Une fois connecté, une question de calcul mental vous sera présentée. Entrez votre réponse, puis cliquez sur **"Soumettre"**. Une demande de signature apparaîtra dans MetaMask.

<div style="text-align:center;"> <img src="Pasted image 20250522162104.png" alt="Soumettre une réponse" width="500"/> </div>

---

## 1.3 Réception De la Récompense

Si la réponse est correcte et que le contrat dispose de suffisamment d’ETH, vous recevrez automatiquement une récompense dans votre portefeuille.

<div style="text-align:center;"> <img src="Pasted image 20250522162204.png" alt="Récompense après bonne réponse" width="500"/> </div>

---

## 1.4 Lancement Des Questions (pour Administrateur)

Le panneau d’administration est accessible uniquement si votre portefeuille est celui de l’administrateur. Ce panneau vous permet de lancer de nouvelles questions ou de naviguer entre les questions existantes.

<div style="text-align:center;"> <img src="Pasted image 20250522162245.png" alt="Accès administrateur" width="500"/> </div>

---

## 1.5 Ajouter Une Nouvelle Question

Depuis le panneau admin, vous pouvez ajouter une nouvelle question. Exemple : **"5 x 5 = 25"**.

<div style="text-align:center;"> <img src="Pasted image 20250522162327.png" alt="Ajout d'une nouvelle question" width="500"/> </div>

---

## 1.6 Question Disponible Pour Les Utilisateurs

Une fois ajoutée, la question est visible par les joueurs, qui peuvent maintenant y répondre.

<div style="text-align:center;"> <img src="Pasted image 20250522162433.png" alt="Question disponible pour les utilisateurs" width="500"/> </div>

---

## 1.7 Navigation Entre Les Questions

L’administrateur peut également passer à la **question suivante** ou revenir à la **question précédente** à tout moment.

---

> ✅ **Résumé**
>
> - Connectez MetaMask
> 
> - Répondez à une question
> 
> - Signez la transaction
> 
> - Recevez une récompense en ETH si la réponse est correcte
> 
> - L’admin gère les questions depuis un panneau dédié

**2. Architecture Technique**

**2.1. Vue d'Ensemble**

L'application suit une architecture client-serveur typique des DApps, où le "serveur" est la blockchain Ethereum (simulée par Ganache) et le smart contract. Le client est une application web React s'exécutant dans le navigateur de l'utilisateur.

- **Frontend (Client):** Interface utilisateur construite avec React, permettant l'interaction avec l'utilisateur.
- **Portefeuille (Wallet):** MetaMask, une extension de navigateur, gère les comptes Ethereum de l'utilisateur, signe les transactions et interagit avec la blockchain.
- **Bibliothèque d'Interaction Blockchain:** Ethers.js est utilisé dans le frontend React pour communiquer avec la blockchain Ethereum.
- **Nœud Blockchain:** Ganache simule un nœud Ethereum local, traitant les transactions et maintenant l'état de la blockchain.
- **Smart Contract:** Logique métier de l'application, écrite en Solidity et déployée sur la blockchain Ganache.

**2.2. Diagramme Architectural**

![[Pasted image 20250521115117.png]]

---

**3. Rôle de Chaque Composant**

**3.1. React (Frontend)**

- **Rôle:** Fournir l'interface utilisateur graphique (GUI) avec laquelle l'utilisateur interagit.
- **Fonctionnalités:**
  - Afficher la question de calcul mental.
  - Permettre à l'utilisateur de saisir sa réponse.
  - Gérer l'état de l'application (compte connecté, question actuelle, feedback).
  - Initier les interactions avec le smart contract via Ethers.js.
  - Afficher le solde ETH de l'utilisateur et du contrat.
  - Fournir un bouton pour connecter le portefeuille MetaMask.

**3.2. Ethers.js**

- **Rôle:** Bibliothèque JavaScript complète pour interagir avec la blockchain Ethereum.
- **Fonctionnalités:**
  - Se connecter à un fournisseur Ethereum (MetaMask).
  - Récupérer les comptes de l'utilisateur et le signataire.
  - Instancier des objets de contrat JavaScript basés sur l'ABI et l'adresse du contrat.
  - Envoyer des transactions (appels de fonctions modifiant l'état) au smart contract.
  - Appeler des fonctions de lecture (view/pure) du smart contract.
  - Formater les données vers et depuis la blockchain.
  - Écouter les événements émis par le smart contract.

**3.3. MetaMask (Portefeuille)**

- **Rôle:** Agit comme un pont entre le navigateur et la blockchain Ethereum, et gère les clés privées de l'utilisateur.
- **Fonctionnalités:**
  - Stocker de manière sécurisée les clés privées de l'utilisateur.
  - Permettre à l'utilisateur de gérer plusieurs comptes Ethereum.
  - Demander la confirmation de l'utilisateur pour signer et envoyer des transactions.
  - Injecter un fournisseur Ethereum (window.ethereum) dans le navigateur pour que les DApps puissent s'y connecter.
  - Se connecter à différents réseaux Ethereum (Mainnet, testnets, local).

**3.4. Ganache (Blockchain Locale)**

- **Rôle:** Fournir un environnement de blockchain Ethereum personnel et simulé pour le développement et les tests locaux.
- **Fonctionnalités:**
  - Créer une blockchain locale avec des comptes pré-financés en ETH.
  - Miner instantanément les transactions (ou configurer le minage par blocs).
  - Fournir une interface graphique pour inspecter les blocs, les transactions et les états des comptes.
  - Exposer un point de terminaison RPC (par ex. http://127.0.0.1:7545) auquel Hardhat et MetaMask peuvent se connecter.
  - Permettre de configurer le Network ID (Chain ID).

**3.5. Hardhat (Framework de Développement)**

- **Rôle:** Environnement de développement complet pour la compilation, le test et le déploiement de smart contracts Ethereum.
- **Fonctionnalités:**
  - Compiler les contrats Solidity en bytecode et ABI.
  - Exécuter des tests unitaires et d'intégration pour les smart contracts (avec Mocha, Chai).
  - Fournir un réseau local Hardhat pour des tests rapides.
  - Gérer le déploiement des contrats sur divers réseaux (local, testnets, mainnet) via des scripts.
  - Intégrer des plugins pour étendre ses fonctionnalités (ex: hardhat-ethers).

**3.6. Smart Contract MentalMathGame.sol**

- **Rôle:** Contient la logique métier immuable de l'application, exécutée sur la blockchain.
- **Fonctionnalités:**
  - `owner`: Adresse du déployeur/administrateur du contrat.
  - `rewardAmount`: Montant d'ETH récompensé pour une réponse correcte.
  - `questions`: Tableau de structures `Question`. Chaque `Question` contient `problem` (string), `solution` (uint256), et `active` (bool).
  - `currentQuestionIndex`: Index de la question actuellement active ou de la prochaine à être activée dans le tableau `questions`.
  - `playerScores`: Mapping associant l'adresse d'un joueur à son score (total des récompenses gagnées).
  - `constructor`: Initialise le propriétaire et le montant de la récompense.
  - `fundContract()`: Permet à quiconque de financer le contrat en ETH.
  - `addQuestion(string memory _problem, uint256 _solution)`: Fonction réservée à l'`owner` pour ajouter une nouvelle question (problème et solution) au tableau `questions`. La question est initialement inactive.
  - `nextQuestion()`: Fonction réservée à l'`owner` pour désactiver la question courante et activer la question suivante dans le tableau.
  - `setFirstQuestionActive()`: Fonction réservée à l'`owner` pour activer la première question (index 0) du tableau.
  - `submitAnswer(uint256 _userAnswer)`: Fonction publique que les joueurs appellent pour soumettre une réponse. Vérifie la réponse contre la solution de la question active (`questions[currentQuestionIndex]`). Si correcte, transfère `rewardAmount` au joueur, met à jour son score, et désactive la question.
  - `withdrawFunds()`: Fonction réservée à l'`owner` pour retirer les fonds du contrat.
  - `receive()` et `fallback()`: Fonctions permettant au contrat de recevoir des ETH envoyés directement à son adresse.
  - Événements: `QuestionSet`, `AnswerCorrect`, `AnswerIncorrect`, `FundsWithdrawn`, `ContractFunded`, `QuestionAdded`, `NextQuestion` pour informer le frontend des actions importantes.

---

**4. Fonctionnement de la Logique de Récompense**

La logique de récompense est entièrement gérée par le smart contract `MentalMathGame.sol`.

1. **Financement du Contrat:**
   - Avant que des récompenses puissent être distribuées, le contrat doit détenir des ETH. L'administrateur (ou toute autre adresse) peut appeler la fonction `fundContract()` en envoyant une transaction avec une certaine valeur d'ETH. Ces ETH sont stockés dans le solde du contrat.
   - Alternativement, des ETH peuvent être envoyés directement à l'adresse du contrat via les fonctions `receive()` ou `fallback()`.

2. **Gestion des Questions par l'Administrateur:**

   - L'administrateur du contrat utilise les fonctions suivantes :
     - `addQuestion(string memory _problem, uint256 _solution)`: Pour ajouter des questions et leurs solutions.
     - `setFirstQuestionActive()`: Pour activer la première question ajoutée.
     - `nextQuestion()`: Pour passer à la question suivante, désactivant la précédente et activant la nouvelle.

3. **Soumission de la Réponse par l'Utilisateur:**

   - L'utilisateur, via l'interface React, saisit sa réponse et clique sur "Soumettre".
   - Le frontend appelle la fonction `submitAnswer(uint256 _userAnswer)` du smart contract. Cette transaction est signée par l'utilisateur via MetaMask.

4. **Vérification et Distribution de la Récompense On-Chain:**

   - La fonction `submitAnswer` du contrat s'exécute :
     - Elle vérifie d'abord qu'il y a des questions disponibles et que la question à `currentQuestionIndex` est active (`questions[currentQuestionIndex].active`).
     - Elle vérifie si le solde du contrat est suffisant pour payer la récompense (`address(this).balance >= rewardAmount`).
     - Elle compare `_userAnswer` avec `questions[currentQuestionIndex].solution`.
     - Si la réponse est correcte :
       - Le score du joueur (`playerScores[msg.sender]`) est incrémenté par `rewardAmount`.
       - La récompense `rewardAmount` est transférée de l'adresse du contrat à l'adresse de l'appelant (`msg.sender`) en utilisant `msg.sender.call{value: rewardAmount}("")`.
       - La question actuelle (`questions[currentQuestionIndex]`) est désactivée (`active = false`).
       - Un événement `AnswerCorrect` est émis.
     - Si la réponse est incorrecte, un événement `AnswerIncorrect` est émis.

5. **Conditions pour la Récompense:**

   - La réponse de l'utilisateur doit être correcte.
   - Le contrat doit avoir suffisamment d'ETH pour couvrir `rewardAmount`.
   - La question à `currentQuestionIndex` doit être active.

**5. Déploiement et Test de l'Application Localement**

**5.1. Prérequis**

- Node.js et npm/yarn.
- Ganache GUI (ou Ganache CLI).
- MetaMask (extension de navigateur).
- Un navigateur web (Chrome, Firefox).

**5.2. Déploiement du Smart Contract**

1. **Démarrer Ganache:** Lancez l'application Ganache GUI. Créez un nouveau workspace ou utilisez celui par défaut. Configurez son Network ID à 1337 (ou mettez à jour hardhat.config.js en conséquence).
2. **Configurer Hardhat:** Vérifiez que hardhat.config.js contient la configuration réseau pour Ganache (URL: http://127.0.0.1:7545, chainId: 1337).
3. **Compiler le Contrat:**

`cd mental-math-dapp # Aller à la racine du projet npx hardhat compile`

- **Exécuter le Script de Déploiement:**

`npx hardhat run scripts/deploy.js --network ganache`

Ce script déploie le contrat `MentalMathGame`. Ensuite, il finance le contrat (par exemple, avec 200 ETH comme configuré dans le script `deploy.js`), ajoute plusieurs questions prédéfinies, et active la première question. Il copie également l'ABI du contrat et son adresse déployée dans `client/src/contracts/` pour que le frontend puisse y accéder.

**5.3. Lancement du Frontend**

1. **Naviguer vers le Répertoire Client:**

   `cd client`

- **Installer les Dépendances (si pas déjà fait):**

  `npm install`

- **Démarrer le Serveur de Développement React:**

  `npm start`

L'application s'ouvrira automatiquement dans votre navigateur par défaut (généralement http://localhost:3000).

**5.4. Test de l'Application**

1. **Configurer MetaMask:**

   - Ouvrez MetaMask dans votre navigateur.
   - Connectez-vous à un réseau personnalisé pointant vers Ganache (Nom: Ganache Local, URL RPC: http://127.0.0.1:7545, Chain ID: 1337, Symbole: ETH).
   - Importez un compte depuis Ganache en utilisant sa clé privée. Ce compte aura des ETH de test.

2. **Interagir avec la DApp:**

   - Sur la page de la DApp (http://localhost:3000), cliquez sur "Connecter le Portefeuille".
   - Autorisez la connexion dans MetaMask pour le compte importé.
   - L'application devrait afficher la question initiale (ex: "2 + 2 ?").
   - Entrez la réponse correcte (ex: 4) et cliquez sur "Soumettre".
   - MetaMask demandera de confirmer la transaction. Approuvez-la.
   - Après la confirmation de la transaction par Ganache (instantanée), le feedback devrait indiquer une réponse correcte et une récompense.
   - Vérifiez que le solde ETH de votre compte dans MetaMask a augmenté du montant de la récompense, et que le solde du contrat a diminué.
   - Testez avec une réponse incorrecte pour voir le feedback approprié.

**7. Conclusion**

Cette DApp de calcul mental démontre les concepts fondamentaux du développement d'applications décentralisées en utilisant React, Hardhat, Ethers.js et une blockchain locale comme Ganache. Elle illustre comment un smart contract peut gérer une logique métier (vérification de réponses, distribution de récompenses) de manière transparente et sécurisée sur la blockchain. La migration vers un testnet public comme Sepolia montre la voie vers un déploiement sur le réseau principal Ethereum. Ce projet sert de base solide pour explorer des fonctionnalités plus avancées et des cas d'utilisation plus complexes dans l'écosystème blockchain.
