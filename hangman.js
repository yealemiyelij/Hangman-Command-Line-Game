var inquirer = require('inquirer');
var isLetter = require('is-letter');
var Word = require('./words.js');
var Game = require('./game.js');
//hangman picture
var hangManDisplay = Game.newWord.hangman;

require('events').EventEmitter.prototype._maxListeners = 100;
console.log("The Hangman Game is dedicated to predict the 'Name of clubs' which are known in English Preimer League!");


var hangman = {
	wordBank: Game.newWord.wordList,
	guessesRemaining: 10,
	guessedLetters: [],
	display: 0,
	currentWord: null,
	startGame: function () {
		var that = this;
		if (this.guessedLetters.length > 0) {
			this.guessedLetters = [];
		}

		inquirer.prompt([{
			name: "play",
			type: "confirm",
			message: "Ready to play?"
		}]).then(function (answer) {
			if (answer.play) {
				that.newGame();
			} else {
				console.log("Fine, I didn't want to play anyway..");
			}
		})
	},
	//starts new game.
	newGame: function () {
		if (this.guessesRemaining === 10) {
			console.log("Okay! Here we go!");
			console.log('*****************');
			var randNum = Math.floor(Math.random() * this.wordBank.length);
			this.currentWord = new Word(this.wordBank[randNum]);
			this.currentWord.getLets();
			console.log(this.currentWord.wordRender());
			this.keepPromptingUser();
		} else {
			this.resetGuessesRemaining();
			this.newGame();
		}
	},
	resetGuessesRemaining: function () {
		this.guessesRemaining = 10;
	},
	keepPromptingUser: function () {
		var that = this;
		//ask for letter guess
		inquirer.prompt([{
			name: "chosenLtr",
			type: "input",
			message: "Choose a letter:",
			validate: function (value) {
				if (isLetter(value)) {
					return true;
				} else {
					return false;
				}
			}
		}]).then(function (ltr) {
			var letterReturned = (ltr.chosenLtr).toUpperCase();
			var guessedAlready = false;
			for (var i = 0; i < that.guessedLetters.length; i++) {
				if (letterReturned === that.guessedLetters[i]) {
					guessedAlready = true;
				}
			}
			//if the letter wasn't guessed already run through entire function, else reprompt user
			if (guessedAlready === false) {
				that.guessedLetters.push(letterReturned);

				var found = that.currentWord.checkIfLetterFound(letterReturned);
				if (found === 0) {
					console.log('Nope! You guessed wrong.');
					that.guessesRemaining--;
					that.display++;
					console.log('Guesses remaining: ' + that.guessesRemaining);
					console.log(hangManDisplay[(that.display) - 1]);

					console.log('\n*******************');
					console.log(that.currentWord.wordRender());
					console.log('\n*******************');

					console.log("Letters guessed: " + that.guessedLetters);
				} else {
					console.log('Yes! You guessed right!');
					if (that.currentWord.didWeFindTheWord() === true) {
						console.log(that.currentWord.wordRender());
						console.log('Congratulations! You won the game!!!');
					} else {

						console.log('Guesses remaining: ' + that.guessesRemaining);
						console.log(that.currentWord.wordRender());
						console.log('\n*******************');
						console.log("Letters guessed: " + that.guessedLetters);
					}
				}
				if (that.guessesRemaining > 0 && that.currentWord.wordFound === false) {
					that.keepPromptingUser();
				} else if (that.guessesRemaining === 0) {
					console.log('Game over!');
					console.log('The word you were guessing was: ' + that.currentWord.word);
				}
			} else {
				console.log("You've guessed that letter already. Try again.")
				that.keepPromptingUser();
			}
		});
	},
	// resetGame: function () {
	// 	if (this.guessesRemaining & this.guessedLetters === o) {
	// 		console.log("Okay: ");
	// 		this.startGame();
	// 	} else {
	// 		console.log("thank, close and try another time.");
	// 	}
	// }

	// newOrReset: function () {
	// 	this.newGame();
	// }
}

hangman.startGame();