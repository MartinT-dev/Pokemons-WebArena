export default class Pokemon {

    constructor(id, name, type, imageFront, imageBack, hp, defense, attack, speed, ability, move1,move2,move3,move4, specialAttack, specialDefense) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.imageFront = imageFront;
        this.imageBack = imageBack;
        this.hp = hp;
        this.defense = defense;
        this.attack = attack;
        this.speed = speed;
        this.ability = ability;
        this.move1 = move1;
        this.move2 = move2;
        this.move3 = move3;
        this.move4 = move4;
        this.specialAttack = specialAttack;
        this.specialDefense = specialDefense;
    };


    //This is a static method that accepts a pokemon from the api's response and maps it to a pokemon class.
    static pokemonFactory = (pokemonInfo) => {

            
            const id = pokemonInfo.id;
            const name = pokemonInfo.name[0].toUpperCase() + pokemonInfo.name.slice(1);;  
            const abilities = pokemonInfo.abilities.filter((ability) => ability.is_hidden == false);
            const ability = abilities[0].ability.name;
            const moves = pokemonInfo.moves.slice(0, 4).map((m) => m.move.name);
            const type = pokemonInfo.types.map(type => type.type.name);

            const hp = pokemonInfo.stats[0].base_stat;
            const speed = pokemonInfo.stats[5].base_stat;
            const attack = pokemonInfo.stats[1].base_stat;
            const specialAttack = pokemonInfo.stats[3].base_stat;
            const defense = pokemonInfo.stats[2].base_stat;
            const specialDefense = pokemonInfo.stats[4].base_stat;


            const frontImg = pokemonInfo.sprites['front_default'];
            const backImg = pokemonInfo.sprites['back_default'];

            const pokemonObj =

                new Pokemon(
                    
                    id, name, type,
                    frontImg,backImg,hp,
                    defense, attack, speed,
                    ability, moves[0],moves[1],moves[2],moves[3],
                     specialAttack, specialDefense);

            return pokemonObj;
     
    };


};