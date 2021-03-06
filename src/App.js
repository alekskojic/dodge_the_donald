/* FEEDBACK
  Great job using React to create this game. I like how you've separated out different parts of the game (like moving the player, spawning enemies, and checking for collisions)
  into their own methods, it helps keep your code module and easier to understand.
  One thing to be aware of when using setInterval: it will try to call the function every time your interval passes, even if the function hasn't finished running the last time.
  If you make your game more complex (requiring more calculations and time), this could cause a problem for you, with the delays becoming inconsistent.
  See here for more detail:http://javascript.info/tutorial/settimeout-setinterval#the-real-delay-of-setinterval 
*/
import React, { Component } from 'react';
import './App.css';
import KeyHandler, {KEYPRESS} from 'react-key-handler';


class App extends Component {
  constructor() {
    super();
    this.state = {
      score: 0,
      playerAlive: true,
      playerTop: -2,
      playerLeft: 10,  //players position
      enemies: [
        {text: 'en1', display: false, top: 3, left: 960}, //position of enemies
        {text: 'en2', display: false, top: 3, left: 960},
        {text: 'en3', display: false, top: 3, left: 960},
        {text: 'en4', display: false, top: 3, left: 960},
        {text: 'en5', display: false, top: 3, left: 960},
        {text: 'en6', display: false, top: 3, left: 960},
        {text: 'en7', display: false, top: 3, left: 960},
        {text: 'en8', display: false, top: 3, left: 960}
      ]
    } 
    
    this.checkForCrash = this.checkForCrash.bind(this);
    this.checkIfEnemyHasReachedEnd = this.checkIfEnemyHasReachedEnd.bind(this);
    this.checkToResetEnemyIndex = this.checkToResetEnemyIndex.bind(this);
    this.moveEnemiesLeft = this.moveEnemiesLeft.bind(this);
    this.playGame = this.playGame.bind(this);
    this.create2Enemies = this.create2Enemies.bind(this);
    this.create1Enemy = this.create1Enemy.bind(this);
    this.movePlayer = this.movePlayer.bind(this);
  }
   /* FEEDBACK
      I would try to combine the two create enemy functions into one, since they perform almost the same task.
      You could handle randomizing the number of enemies within this new create enemy function instead of in your game function,
      and prevent you from having to repeat some very similar code.
      If you need to access information from this function in your game function (like how many enemies were created), 
      your function could return that number/data
   */
   create2Enemies(enemyIndex, enemies, randomSingleOpenSpace) {
      randomSingleOpenSpace = Math.floor((Math.random() * 3) + 1);
      let secondEnemyIndex = enemyIndex + 1;
      if (enemyIndex === 7) {
        secondEnemyIndex = 0;
      }
      enemies[enemyIndex].display = true;
      enemies[secondEnemyIndex].display = true;
      if (randomSingleOpenSpace === 1){ //Check where the single open space is and render the 2 enemies in the other
        enemies[enemyIndex].top = 108; //two lanes
        enemies[secondEnemyIndex].top = 213;
      } else if (randomSingleOpenSpace === 2) {
        enemies[enemyIndex].top = 3;
        enemies[secondEnemyIndex].top = 213;
      } else if (randomSingleOpenSpace === 3) {
        enemies[enemyIndex].top = 3;
        enemies[secondEnemyIndex].top = 108;
      }
      this.setState({enemies: enemies});
   }

   create1Enemy(randomEnemyLocation, enemies, enemyIndex) {
      randomEnemyLocation = Math.floor((Math.random() * 3) + 1);
      enemies[enemyIndex].display = true;
      if (randomEnemyLocation === 1) {
        enemies[enemyIndex].top = 3;
      } else if (randomEnemyLocation === 2) {
        enemies[enemyIndex].top = 108;
      } else if (randomEnemyLocation === 3) {
        enemies[enemyIndex].top = 213;
      }
      this.setState({enemies: enemies});
   }

   moveEnemiesLeft(enemies) {
      let playerAlive;
      const newEnemies = enemies.map((enemy, index) => {
        if (enemy.display) {
          enemy.left -= 2;
        }
        return enemy;
      })
      this.setState({enemies: newEnemies});
   }

   checkIfEnemyHasReachedEnd(enemies) {
     const newEnemies = enemies.map((enemy, index) => {
       if (enemy.left === 0) {
         enemy.display = false;
         enemy.left = 960;
       }
       return enemy;
     })
     this.setState({enemies: newEnemies});
   }
   /*
      FEEDBACK: A shorter way of 'increasing' or 'resetting' the index would be to use the modulus (%) operator.
      enemyIndex = (enemyIndex + 1) % 8; 
      This would accomplish exactly what you're doing with this function, and is simple enough to do it within your game function instead.
   */
   checkToResetEnemyIndex(enemyIndex) { //Resets enemy index to zero if we have reached an enemy index of 5
     if (enemyIndex === 7) {
        enemyIndex = 0;
        return enemyIndex;
     } else {
        enemyIndex++;
        return enemyIndex; 
     }
   }

   checkForCrash(enemies) {
     let crash = false;
     for (let enemy of enemies) {
       if (enemy.left <= 54 && enemy.top === this.state.playerTop + 5) {
         crash = true;
       }
     }
     return crash;
   }

   playGame(e) {
    if (this.state.playerAlive) {
      e.preventDefault();
      let counter = 124;
      let enemyIndex = 0; // index of enemy
      let randomSingleOpenSpace; //open space for when 2 enemies are rendered
      let randomEnemyLocation; //enemy lane location for when 1 enemy is rendered
      let enemies = this.state.enemies;
      let game = setInterval(() => { 
          counter++;
            if (counter % 125 === 0) {
            const randomNumberOfEnemies = Math.floor((Math.random() * 2) + 1);
            if (randomNumberOfEnemies === 2) {
              this.create2Enemies(enemyIndex, enemies, randomSingleOpenSpace);
              enemyIndex = this.checkToResetEnemyIndex(enemyIndex);
              enemyIndex = this.checkToResetEnemyIndex(enemyIndex);
            } else if (randomNumberOfEnemies === 1) {
              this.create1Enemy(randomEnemyLocation, enemies, enemyIndex);
              enemyIndex = this.checkToResetEnemyIndex(enemyIndex);
            }
        }
        this.moveEnemiesLeft(enemies);
        const crash = this.checkForCrash(enemies);
        if (crash) {
          clearInterval(game);
          this.setState({playerAlive: false});
        } else {
          this.checkIfEnemyHasReachedEnd(enemies);
        }
        this.setState({score: this.state.score + 1}) 
        }, 1);
     } else {
      this.setState({
        score: 0,
        playerAlive: true,
        playerTop: -2,
        playerLeft: 10,  //players position
        enemies: [
          {text: 'en1', display: false, top: 3, left: 960}, //position of enemies
          {text: 'en2', display: false, top: 3, left: 960},
          {text: 'en3', display: false, top: 3, left: 960},
          {text: 'en4', display: false, top: 3, left: 960},
          {text: 'en5', display: false, top: 3, left: 960},
          {text: 'en6', display: false, top: 3, left: 960},
          {text: 'en7', display: false, top: 3, left: 960},
          {text: 'en8', display: false, top: 3, left: 960}
        ]
      }); 
     }
   }

   movePlayer(e) {
     e.preventDefault();
     const playerTop = this.state.playerTop;
     if (e.key === 'w' && playerTop !== -2) {
       this.setState({playerTop: playerTop - 105});
     } else if (e.key === 's' && playerTop !== 208) {
       this.setState({playerTop: playerTop + 105});
     }
   } 
  
  render() {
    const playerStyle = {top: this.state.playerTop, left: this.state.playerLeft}; //postion of player
    const shownEnemies = this.state.enemies.filter((enemy, index) => {
      return enemy.display;
    })
    const enemies = shownEnemies.map((enemy, index) => {
      const style = {top: enemy.top, left: enemy.left};
      return ( 
        <div className="enemies" style={style}></div>
      ) 
    })
    
    
    return (
      <div className="App">
          <header>
            <h1>Dodge the Donald</h1>
            <h2>Score: {this.state.score}</h2>
          </header>

          <div className="mainBox">
            <KeyHandler keyEventName={KEYPRESS} keyValue='w' onKeyHandle={this.movePlayer}/>
            <KeyHandler keyEventName={KEYPRESS} keyValue='s' onKeyHandle={this.movePlayer}/> 
            <div className="lane1"></div>
            <div className="lane2">
              <span className="gameOver">{this.state.playerAlive ? null : "REPUBLICANS WIN!"}</span>
            </div>
            <div className="lane3"></div>
            <div className="car" style={playerStyle}></div>
            {enemies}
            <button onClick={this.playGame}><h1>{this.state.playerAlive ? "Start" : "Reset"}</h1></button>
            <br/>
            <br/>
            <div>Use the W & S keys to move Hilary up and down.</div>
          </div>
      </div>
    );
  }
}

export default App;
