import Pokemon from './pokemon.js'

const battleMp3 = new Audio('audio/battle.mp3');

// UI Class 
class UI {

    

    //#region  --- Fetching the pokemons from the API ---


    // Fetching all 150 pokemons from the API

    static fetchPokemons = async () => {



        for (let i = 1; i <= 150; i++) {

            let pokemon = await (UI.getPokemon(i));

            UI.createPokemonCard(pokemon);

        }



    };

    // Fetching one depending on what id is given to the function
    static getPokemon = async (id) => {

        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        const res = await fetch(url);
        const pokemon = await res.json();

        return pokemon;

    };


    //#endregion


    //#region --- Creating the Pokemon Cards ---

    /* This function creates a card with the pokemon that is taken from the getPokemon function.
        It maps the nessecary things to the pokemonDiv which is appended to the main HTML.
    */
    static createPokemonCard = async (pokemon) => {

        //Here we get the returned Pokemon Class that is going to be used
        const id = pokemon.id;
        const pokemonCard = await UI.mapPokemon(id);

        //Here we pass it to the createPokeHTML to create a DIV and append the props of the Pokemon Class
        this.appendPokeHTML(pokemonCard);

    }


    //Here we get the pokemonCard that is a mapped Pokemon Class and we are going to populate the DIV with the class.
    static appendPokeHTML = (pokemonCard) => {


        // Creating the DIV and adding it a 'pokemon' class so that we can style it in CSS
        const pokemonDiv = document.createElement('div');
        pokemonDiv.classList.add('pokemon');

        const colors = {
            fire: '#FDDFDF',
            grass: '#DEFDE0',
            electric: '#FCF7DE',
            water: '#DEF3FD',
            ground: '#f4e7da',
            rock: '#d5d5d4',
            fairy: '#fceaff',
            poison: '#98d7a5',
            bug: '#f8d5a3',
            dragon: '#97b3e6',
            psychic: '#eaeda1',
            flying: '#F5F5F5',
            fighting: '#E6E0D4',
            normal: '#F5F5F5'
        };
        const mainTypes = Object.keys(colors);


        const pokeType = mainTypes.find(type => pokemonCard.type.indexOf(type) > -1);

        const color = colors[pokeType];

        pokemonDiv.style.backgroundColor = color;

        // Creating the HTML that will be appened to the main Container
        const pokemonInnerHTML = UI.createPokeHTML(pokemonCard, true, false);

        pokemonDiv.innerHTML = pokemonInnerHTML;

        //Apending the DIV 
        pokemonContainer.appendChild(pokemonDiv);

    }

    /* 
        This method accepts a pokemon , two boleans , one for checking if it's for creating a pokemon card , and the other one if it's my pokemon.
        We check for that , because depending on if it's my pokemon , it has to be displayed with the back image of the sprite.

    */
    static createPokeHTML = (pokemon, isForCard, isMyPokemon) => {

        if (isForCard === true) {

            let createdHTML = `
        
        <div class="img-container">
            <img src="${pokemon.imageFront}".png" alt="${pokemon.name}" />
        </div>
        <div class="info">
            <h3 class="name">${pokemon.name}</h3>
            <medium class="ability">Ability: <span>${pokemon.ability}</span></medium>
            <small class="type">Type: <span>${pokemon.type}</span></small>
            
            
        </div>

        <div class="moves">
            <ul class="movesList">
                
                <li>Move 1: ${pokemon.move1}</li>
                <li>Move 2: ${pokemon.move2}</li>
                <li>Move 3: ${pokemon.move3}</li>
                <li>Move 4: ${pokemon.move4}</li>
            </ul>

        </div>

        <div class="stats">
            <ul class="statsList">
                <li>Hp: ${pokemon.hp}</li>
                <li>Speed: ${pokemon.speed}</li>
                <li>Defense: ${pokemon.defense}</li>
                <li>Special-Defense: ${pokemon.specialDefense}</li>
                <li>Attack: ${pokemon.attack}</li>
                <li>Special-Attack: ${pokemon.specialAttack}</li>
            </ul>
        </div>

        <button id="battleBtn" onclick="UI.preparePokemons(${pokemon.id},${false})">Battle</button>
    `;
            return createdHTML;
        } else if (isForCard === false && isMyPokemon === true) {

            let createdHTML = `
            <div class="arena-pokemon1">
             <div class="arena-img-container1">
                    <img src="${pokemon.imageBack}".png" alt="" />
                </div>
                <div class="arena-info1">
                    <h3 class="arena-name1">${pokemon.name}</h3>
                    <canvas id="#displayHp1" class="displayHp1" width="160" height="40"></canvas>
                </div>
                
            </div>
            `;

            return createdHTML;
        } else {
            let createdHTML = `
            <div class="arena-pokemon2">
             <div class="arena-img-container2">
                    <img src="${pokemon.imageFront}".png" alt="" />
                </div>
                <div class="arena-info2">
                    <h3 class="arena-name2">${pokemon.name}</h3>
                    <canvas id="#displayHp2" class="displayHp2" width="160" height="40"></canvas>
                </div>
            </div>
            `;
            return createdHTML;
        }

    }


    //#endregion


    //#region  --- Mapping ---

    //Here we map the pokemon from the api's response to a pokemon class.
    static mapPokemon = async (id) => {

        const pokemon = await UI.getPokemon(id);

        const pokemonObj = Pokemon.pokemonFactory(pokemon);

        return pokemonObj;
    }

    //#endregion


    //#region  --- Preparing Pokemons for Battle ---


    static preparePokemons = async (myPokemonId, isPlayingAgain) => {

        this.music(false);

        if (isPlayingAgain === false) {


            container.classList.toggle('blurActive');
            popup.classList.toggle('popupActive');

        } else {
            popup.innerHTML = '';
            this.isPlayingAgain = false;

        }

        const myPokemon = await UI.mapPokemon(myPokemonId);

        const max = 20,
            min = 1;

        const enemyId = Math.floor(Math.random() * (max - 1)) + min;

        const enemyPokemon = await UI.mapPokemon(enemyId);



        this.displayPokemons(myPokemon, enemyPokemon);


        const hpBar1 = document.querySelector('.displayHp1').getContext('2d');
        const hpBar2 = document.querySelector('.displayHp2').getContext('2d');

        if (myPokemon.speed > enemyPokemon.speed) {
            let winner = await UI.pokemonBattle(myPokemon, enemyPokemon, hpBar1, hpBar2);

            if (winner.id == myPokemon.id) {
                let isMyPokemon = true;
                this.playAgainScreen(winner, isMyPokemon);
            } else {
                let isMyPokemon = false;
                this.playAgainScreen(winner, isMyPokemon);
            }
        } else {
            let winner = await UI.pokemonBattle(enemyPokemon, myPokemon, hpBar2, hpBar1);

            if (winner.id == myPokemon.id) {
                let isMyPokemon = true;
                this.playAgainScreen(myPokemon.id, isMyPokemon);
            } else {
                let isMyPokemon = false;
                this.playAgainScreen(myPokemon.id, isMyPokemon);
            }
        }

    }

    static displayPokemons = (pokemon1, pokemon2) => {

        //Here we create the two pokemon divs that will be appended
        let pokemon1Div = document.createElement('div');
        let pokemon2Div = document.createElement('div');


        pokemon1Div.innerHTML = UI.createPokeHTML(pokemon1, false, true);

        pokemon2Div.innerHTML = UI.createPokeHTML(pokemon2, false, false);


        // And here we apend them
        popup.appendChild(pokemon1Div);
        popup.appendChild(pokemon2Div);

        let hpBar1 = document.querySelector('.displayHp1').getContext('2d');
        let hpBar2 = document.querySelector('.displayHp2').getContext('2d');

        UI.drawHealthbar(hpBar1, 10, 10, 160, 40, pokemon1.hp, pokemon1.hp);
        UI.drawHealthbar(hpBar2, 10, 10, 160, 40, pokemon2.hp, pokemon2.hp);

    }

    //#endregion

    //#region --- Battle ---

    // This method calculates the dmg that the pokemon's attack will do 
    static pokemonAttack = async (attack, defense) => {

        const max = 50,
            min = 0;
        let rngDmg = Math.floor((Math.random() * max) + min);

        let attackDmg = (attack / defense) * rngDmg;

        attackDmg = Math.floor(attackDmg);


        return attackDmg;
    }


    /*
        This method accepts the two pokemon's , aswell as two hpBars. The pokemons are passed according to their speed respectively.
        This method uses a while cycle so that the page is 'frozen' until the battle is done. When one of the pokemons is defeated the winner's id is returned;
    */
    static pokemonBattle = async (pokemon1, pokemon2, hpBar1, hpBar2) => {

        console.log(`${pokemon1.name} goes first agains ${pokemon2.name}`);

        const delay = ms => new Promise(res => setTimeout(res, ms));

        const poke1MaxHp = pokemon1.hp;

        const poke2MaxHp = pokemon2.hp;

        let winner;

        while (pokemon1.hp > 0 && pokemon2.hp > 0) {

            await delay(2000);

            let attackDmg1 = await this.pokemonAttack(pokemon1.attack, pokemon2.defense);

            if (attackDmg1 > 0) {

                pokemon2.hp -= attackDmg1;
                this.hitWav();
                this.drawHealthbar(hpBar2, 10, 10, 160, 40, pokemon2.hp, poke2MaxHp);
                console.log(`Pokemon 2 Hp after the attack is  = ${pokemon2.hp}`);


            } else {

                console.log(`${pokemon1.name} missed`);
                await delay(1500);
            }

            if (pokemon2.hp <= 0) {
                console.log(`${pokemon1.name} won`);
                winner = pokemon1;
                break;
            } else {

                await delay(2000);

                let attackDmg2 = await this.pokemonAttack(pokemon2.attack, pokemon1.defense);

                if (attackDmg2 > 0) {

                    pokemon1.hp -= attackDmg2;

                    this.hitWav();

                    this.drawHealthbar(hpBar1, 10, 10, 160, 40, pokemon1.hp, poke1MaxHp);

                    console.log(`Pokemon 1 Hp after the attack is  = ${pokemon1.hp}`);
                } else {
                    console.log(`${pokemon2.name} missed`);
                    await delay(1500);
                }

                if (pokemon1.hp <= 0) {
                    console.log(`${pokemon2.name} won`);
                    winner = pokemon2;
                    break;
                }

            }

        }

        return winner;

    }

    //#endregion


    //#region --- Utilities ---

    //This method draws a canvas that is used for the HpBars of the pokemons.
    static drawHealthbar = (canvas, x, y, width, height, health, max_health) => {

        if (health >= max_health) {
            health = max_health;
        }
        if (health <= 0) {
            health = 0;
        }
        canvas.fillStyle = '#000000';
        canvas.fillRect(x, y, width, height);
        let colorNumber = Math.round((1 - (health / max_health)) * 0xff) * 0x10000 + Math.round((health / max_health) * 0xff) * 0x100;
        let colorString = colorNumber.toString(16);

        if (colorNumber >= 0x100000) {
            canvas.fillStyle = '#' + colorString;
        } else if (colorNumber << 0x100000 && colorNumber >= 0x10000) {
            canvas.fillStyle = '#0' + colorString;
        } else if (colorNumber << 0x10000) {
            canvas.fillStyle = '#00' + colorString;
        }
        canvas.fillRect(x + 1, y + 1, (health / max_health) * (width - 2), height - 2);
    }

    //This method clears the HTML of the Popup(the Modal) and adds a h1 that either says 'You win' or 'You lose' and displays two buttons 'Play again' and 'Exit'.

    static playAgainScreen = (myPokemonId, isMyPokemon) => {

        let isPlayingAgain = true;

        if (isMyPokemon === true) {
            this.music(true);
            console.log('You won!');
            popup.innerHTML = '';
            popup.innerHTML =
                `
                         <div class="btnsContainer">
                         <h1>'You win'</h1>
                         <button class="playAgainBtn" onclick="UI.preparePokemons(${myPokemonId},${isPlayingAgain})">Play Again</button>
                         <button class="closeModalBtn" onclick="UI.closeModal()">Exit</button>
                             </div>
                         `
          
            

        } else {
            
            this.music(true);
            console.log('You lost!');
            popup.innerHTML = '';
            popup.innerHTML =
                `
            <div class="btnsContainer">
            <h1>'You lose'</h1>
            <button class="playAgainBtn" onclick="UI.preparePokemons(${myPokemonId},${isPlayingAgain})">Play Again</button>
            <button class="closeModalBtn" onclick="UI.closeModal()">Exit</button>
                </div>
            `
          
        
        }

    }

    // This method closes the Popup
    static closeModal = () => {

        this.music(true);

        container.classList.toggle('blurActive');
        popup.classList.toggle('popupActive');

        popup.innerHTML = '';
    }

    static music = (isPaused) => {

        if(isPaused === true){
            battleMp3.pause();
            battleMp3.currentTime = 0;
        }else{
            
            battleMp3.play();
        }

    }

    static hitWav = () => {

        const hit = new Audio('audio/hit.wav');

        hit.play();

    }

    //#endregion

}

//DOM Elements
const container = document.querySelector('.container');
const popup = document.querySelector('.popup');

//Event Listeners

document.addEventListener('DOMContentLoaded', UI.fetchPokemons());
// *I added the UI Class due to the fact that i couldn't reach the battleBtn*
window.UI = UI;