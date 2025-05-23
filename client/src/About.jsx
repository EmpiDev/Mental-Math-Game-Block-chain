import React from "react";

const About = () => (
  <div className="about-area">
    <h2>À propos du Jeu</h2>
    <p>
      Ce jeu de calcul mental décentralisé est une DApp (application décentralisée) qui permet aux utilisateurs de répondre à des questions de calcul mental simples et de recevoir des récompenses en Ether (ETH) pour chaque bonne réponse.
    </p>
    <h3>Fonctionnement</h3>
    <ul>
      <li>Connectez votre portefeuille MetaMask pour participer.</li>
      <li>Répondez à la question affichée. Si votre réponse est correcte, vous recevez une récompense en ETH directement sur votre portefeuille !</li>
      <li>Chaque question ne peut être résolue qu'une seule fois. Une fois résolue, l'administrateur active la suivante.</li>
    </ul>
    <h3>Technologies utilisées</h3>
    <ul>
      <li><b>React</b> : Interface utilisateur interactive.</li>
      <li><b>Solidity</b> : Smart contract qui gère la logique du jeu et les récompenses.</li>
      <li><b>Ethers.js</b> : Communication entre le frontend et la blockchain.</li>
      <li><b>MetaMask</b> : Gestion de votre compte Ethereum et signature des transactions.</li>
      <li><b>Ganache</b> : Blockchain locale pour le développement et les tests.</li>
      <li><b>Hardhat</b> : Outils de développement et de déploiement des smart contracts.</li>
    </ul>
    <h3>But pédagogique</h3>
    <p>
      Ce projet a pour objectif de vous initier aux concepts de la blockchain, des smart contracts et des DApps, tout en s'amusant avec des calculs mentaux !
    </p>
    <h3>Comment jouer ?</h3>
    <ol>
      <li>Connectez votre portefeuille MetaMask.</li>
      <li>Répondez à la question affichée.</li>
      <li>Recevez votre récompense en ETH si la réponse est correcte.</li>
    </ol>
    <p>Pour plus de détails techniques, consultez le README du projet.</p>
  </div>
);

export default About;
