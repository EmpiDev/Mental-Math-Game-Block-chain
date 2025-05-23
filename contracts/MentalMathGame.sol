// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

contract MentalMathGame {
    address payable public owner;
    uint256 public rewardAmount;

    struct Question {
        string problem;
        uint256 solution;
        bool active;
    }

    Question[] public questions;
    uint256 public currentQuestionIndex;
    mapping(address => uint256) public playerScores;

    event QuestionSet(string problem, uint256 solution);
    event AnswerCorrect(address indexed player, uint256 reward, uint256 newScore);
    event AnswerIncorrect(address indexed player);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event ContractFunded(address indexed funder, uint256 amount);
    event QuestionAdded(string problem, uint256 solution);
    event NextQuestion(uint256 newIndex);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    constructor(uint256 _initialRewardAmount) {
        owner = payable(msg.sender);
        rewardAmount = _initialRewardAmount;
        console.log("MentalMathGame deployed by:", msg.sender);
        console.log("Initial reward amount set to:", _initialRewardAmount);
    }

    function fundContract() public payable {
        require(msg.value > 0, "Must send ETH to fund");
        emit ContractFunded(msg.sender, msg.value);
        console.log("Contract funded with:", msg.value, "wei. New balance:", address(this).balance);
    }

    function addQuestion(string memory _problem, uint256 _solution) public onlyOwner {
        questions.push(Question(_problem, _solution, false));
        emit QuestionAdded(_problem, _solution);
    }

    function nextQuestion() public onlyOwner {
        require(questions.length > 0, "No questions available");
        if (questions.length > currentQuestionIndex) {
            questions[currentQuestionIndex].active = false;
        }
        currentQuestionIndex++;
        require(currentQuestionIndex < questions.length, "No more questions");
        questions[currentQuestionIndex].active = true;
        emit NextQuestion(currentQuestionIndex);
        emit QuestionSet(questions[currentQuestionIndex].problem, questions[currentQuestionIndex].solution);
    }

    function setFirstQuestionActive() public onlyOwner {
        require(questions.length > 0, "No questions available");
        currentQuestionIndex = 0;
        questions[0].active = true;
        emit QuestionSet(questions[0].problem, questions[0].solution);
    }

    function submitAnswer(uint256 _answer) public payable {
        require(questions.length > 0, "No questions available.");
        require(questions[currentQuestionIndex].active, "No active question available.");
        require(address(this).balance >= rewardAmount, "Contract does not have enough funds for reward.");

        if (_answer == questions[currentQuestionIndex].solution) {
            playerScores[msg.sender] += rewardAmount;
            (bool success, ) = msg.sender.call{value: rewardAmount}("");
            require(success, "Failed to send reward ETH");

            emit AnswerCorrect(msg.sender, rewardAmount, playerScores[msg.sender]);
            console.log("Player", msg.sender, "answered correctly. Rewarded:", rewardAmount);

            questions[currentQuestionIndex].active = false;
        } else {
            emit AnswerIncorrect(msg.sender);
            console.log("Player", msg.sender, "answered incorrectly.");
        }
    }

    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Contract has no funds to withdraw.");
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Failed to withdraw funds");
        emit FundsWithdrawn(owner, balance);
        console.log("Owner withdrew", balance, "wei. Remaining balance:", address(this).balance);
    }

    receive() external payable {
         emit ContractFunded(msg.sender, msg.value);
    }
    fallback() external payable {
         emit ContractFunded(msg.sender, msg.value);
    }

    function getQuestion() public view returns (string memory, bool) {
        if (questions.length == 0) {
            return ("", false);
        }
        return (questions[currentQuestionIndex].problem, questions[currentQuestionIndex].active);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getRewardAmount() public view returns (uint256) {
        return rewardAmount;
    }
}