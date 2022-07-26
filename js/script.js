class Attack{
    constructor(name, pow, prio, special, prob, probSpecEf){
        this.nameAt = name;
        this.power = pow;
        this.prio = prio;
        this.special = special;
        this.prob = prob;
        this.probSpecEf = probSpecEf;
        this.sDes = "( Poder: " + this.power*10 + " Prob: " + this.prob*100 + "% Prioridad: " + this.prio + ") (" + this.probSpecEf*100;
        switch (this.special) {
            case 1: 
                this.sDes += "% de confundir al enemigo)";
                break;    
            case 2: 
                this.sDes += "% de que el enemigo pierda vida cada turno)";
                break;
            case 3: 
                this.sDes += "% de curarte el estado)";
                break;
            case 4:
                this.sDes += "% de paralizar al enemigo)";
                break;
            case 5:
                this.sDes += "% de subirse el ataque)";
                break;
            case 6:
                this.sDes += "% de subirse la defensa)";
                break;
            case 7:
                this.sDes += "% de subirse la velocidad)";
                break;
            case 8:
                this.sDes += "% de golpear de 1 a 4 veces)";
                break;
            case 9:
                this.sDes += "% de golpear 2 veces)";
                break;
            case 10:
                this.sDes += "% de tener hasta 50 más de poder)";
                break;
            case 11:
                this.sDes += "% de invocar un sustituto pero el usuario pierde el 25% de vida)";
                break;
            case 12:
                this.sDes += "% de curarse en cada turno)";
                break;
            case 13:
                this.sDes += "% de curarse un porcentaje de vida)";
                break;
            case 14:
                this.sDes += "% de recibir daño de retroceso)";
                break;
            case 15:
                this.sDes += "% de prevenir un estado por tres turnos)";
                break;
            case 16:
                this.sDes += "% de protegerse de un ataque completo)";
                break;
            default: 
                this.sDes += "";
                break;
        }    
            
    }

    usedAttack(){
        return " uso " + this.nameAt;
    }
        
}

class Status{
    constructor(type, desc){
        this.type = type;
        this.desc = desc;
    }
   
}

class Character {
    constructor(hpT, def, atc, spd, name, att1, att2){
        this.chHP = hpT;
        this.curHP = hpT;
        this.atcBase = atc;
        this.defBase = def;
        this.spdBase = spd;
        this.def = def;
        this.atc = atc;
        this.spd = spd;
        this.chName = name;
        this.chStatus = new Status(0,"");
        this.att1 = att1;
        this.att2 = att2;
        this.modAtc = 0;
        this.modDef = 0;
        this.modSpd = 0;
        this.sustituteHP = 0;
        this.concenTurns = 0;
    }
}

function lowersHP(defder, power, atc, def){
    if (defder.chStatus.type != 16){
        if(defder.sustituteHP > 0){
            defder.sustituteHP -= power*atc/def*4;
            if (defder.sustituteHP <= 0){
                defder.chStatus.desc = "";
            }
        } else {
            defder.curHP -= power*atc/def*4;
        }
    } else alert(defder.chName + " se protegió");       
}

function attacks(attker, defder, att){
    alert(attker.chName + att.usedAttack());
            if(att.prob >= Math.random()){
                if((attker.chStatus.type != 1 && attker.chStatus.type != 4) || Math.random() > 0.5){
                    lowersHP(defder, att.power, attker.atc, defder.def);
                    specialEffect = att.probSpecEf >= Math.random();
                    if(specialEffect){
                        switch(att.special){
                            case 3: //cura estado
                                    if(attker.chStatus.type != 0 && attker.chStatus.type != 12){
                                        alert(attker.chName + " dejo de estar " + attker.chStatus.desc);
                                        attker.chStatus.type = 0;
                                        attker.chStatus.desc = "";
                                    }
                                    break;
                            case 5: //sube ataque
                                alert(attker.chName + " se subio el ataque");
                                attker.modAtc++;
                                if(attker.modAtc >= 0){
                                    attker.atc = attker.atcBase*(1 + attker.modAtc*0.5); 
                                } else{
                                    attker.atc = attker.atcBase/(1 - attker.modAtc*0.5)
                                }
                                break;
                            case 6: //sub defensa
                                alert(attker.chName + " se subio la defensa");
                                attker.modDef++;
                                if(attker.modDef >= 0){
                                    attker.def = attker.defBase*(1 + attker.modDef*0.5); 
                                } else{
                                    attker.def = attker.defBase/(1 - attker.modDef*0.5)
                                }
                                break;
                            case 7: //sube velocidad
                                alert(attker.chName + " se subio la velocidad");
                                attker.modSpd++;
                                if(attker.modSpd >= 0){
                                    attker.spd = attker.spdBase*(1 + attker.modSpd*0.5); 
                                } else{
                                    attker.spd = attker.spdBase/(1 - attker.modSpd*0.5)
                                }
                                break;
                            case 8: //recurrente (de 1 a 4 golpes)
                                hitTimes = 1;
                                while(0.65 > Math.random() && hitTimes < 4){
                                    lowersHP(defder, att.power, attker.atc, defder.def);
                                    hitTimes++;
                                }
                                alert(attker.chName + " pegó " + hitTimes + " vez/veces");
                                break;
                            case 9: //doble golpe
                                lowersHP(defder, att.power, attker.atc, defder.def);
                                alert(attker.chName + " pegó 2 veces");
                                break;
                            case 10: //ataques con un daño extra
                                extraPower = Math.random()*5;
                                lowersHP(defder, extraPower, attker.atc, defder.def);
                                alert(attker.chName + " pegó con un " + parseInt(extraPower*10) + " extra de poder");
                                break;
                            case 11: //sustituto
                                if(attker.sustituteHP <= 0){
                                    if(attker.curHP > attker.chHP*0.25){
                                        attker.curHP -= attker.chHP*0.25;
                                        attker.sustituteHP = attker.chHP*0.25;
                                        attker.chStatus.desc = "sustituto";
                                    } else{
                                        alert(attker.chName + " no tiene vida suficiente para el sustituto");
                                    }
                                } else {
                                    alert(attker.chName + " ya tiene un sustituto activo");
                                }  
                                break;
                            case 12: // curacion por turnos
                                if (attker.chStatus.type == 0){
                                    attker.chStatus.type = 12;
                                    attker.chStatus.desc = "curado por cada turno"; 
                                } else {
                                    alert(attker.chName + " ya está " + attker.chStatus.desc);
                                }
                                break;
                            case 13: //cura 33%
                                attker.curHP += attker.chHP/3;
                                if (attker.curHP > attker.chHP){
                                    attker.curHP = attker.chHP
                                }
                                alert(attker.chName + " se curó un 33% de vida");
                                break;
                            case 14: //daño de retroceso
                                lowersHP(attker, att.power*0.25, attker.atc, defder.def);
                                alert(attker.chName + " perdió vida por retroceso");
                                break;
                            case 15: //previene  un estado
                                if(attker.chStatus.type == 0){
                                    attker.chStatus.type = 15;
                                    attker.concenTurns = 3;
                                    attker.chStatus.desc = "concentrado";
                                    alert(attker.chName + " está concentrado");
                                } else {
                                    alert(attker.chName + " ya está " + attker.chStatus.desc);
                                }
                                break;
                            case 16: //protección
                                attker.chStatus.type = 16;
                                attker.chStatus.desc = "protegido";
                                alert(attker.chName + " está protegido");
                                break;
                            default:
                                break; 
                        }
                    } else {
                        switch(att.special){
                            case 8:
                            case 9:
                                alert(attker.chName + " pegó una vez");
                                break;
                            default:
                                break;
                        }
                    }
                    if (defder.chStatus.type == 0 || defder.chStatus.type == 12){
                        if(specialEffect){
                            switch (att.special){
                                case 1: 
                                    alert(defder.chName + " está confundido!");
                                    defder.chStatus.type = 1;
                                    defder.chStatus.desc = "confundido";
                                    break;
                                case 2: 
                                    alert(defder.chName + " pierde vida cada turno");
                                    defder.chStatus.desc = "extrangulado";
                                    defder.chStatus.type = 2;
                                    break;
                                case 4: alert(defder.chName + " está paralizado");
                                    defder.chStatus.desc = "paralizado";
                                    defder.chStatus.type = 4;
                                    break;
                                default:
                                    break;  //los casos 0,3 y 5-16 no dependen de que el enemigo tenga o no un estado  
                            }
                        }
                    } else if(att.special in [1,2,4]){
                        if(defder.chStatus.type == 15){
                            defder.chStatus.type = 0;
                            alert(defder.chName + " previno el estado pero perdió la concentración");
                        } else {
                            alert(defder.chName + " ya está " + defder.chStatus.desc + ". No puede tener más de un estado");
                        }
                    }
                    
                } else {
                    if(attker.chStatus.type == 1){
                        attker.curHP -= att.power*attker.atc*(1-attker.def/100);
                        alert(attker.chName + " se pegó a sí mismo");
                    } else if(defder.chStatus.type == 16){
                        alert(defder.chName + " se protegió");
                        defder.chStatus.type = 0; 
                    } 
                    else {
                        alert(attker.chName + " se quedó paralizado!");
                    }
                        
                } 
            }else alert(attker.chName + " fallo...");
}

function updStatus(char){
    if (char.curHP > 0){
        switch (char.chStatus.type){ //para cuando haya otros status
            case 1: 
                if (Math.random() > 0.5){
                    alert(char.chName + " se libero de la confusion");
                    char.chStatus.type = 0;
                    char.chStatus.desc = "";
                } else alert(char.chName + " sigue confundido");
                break;
            case 2: 
                char.curHP -= 0.05*char.chHP;
                alert(char.chName + " perdio vida por el extrangulamiento");
                break;
            case 12:
                char.curHP -= 0.05*char.chHP;
                alert(char.chName + " ganó vida por la curación por turnos");
                break;
            case 15:
                char.concenTurns--;
                if (char.concenTurns == 0){
                    char.chStatus.type = 0;
                    char.chStatus.desc = "";
                    alert(char.chName + " perdió la concetración");
                }
                break;
            case 16:
                char.chStatus.type = 0;
                char.chStatus.desc = "";
                alert(char.chName + " dejó de estar protegido");
                break;
            default:
                break;
        }
    }
        
 
}

function changeChar(activeChar, charToSelec, charTeam, random){
    let charOp;
    activeChar.atc = activeChar.atcBase;
    activeChar.def = activeChar.defBase;
    activeChar.spd = activeChar.spdBase;
    activeChar.modAtc = 0;
    activeChar.modDef = 0;
    activeChar.modSpd = 0;
    if (!random){
        let charOptions = "Selecciona el personaje: ";
        charToSelec.forEach((char, i)=>{
            charOptions += `\n ${i + 1} ${char.chName} (${Math.ceil(char.curHP/char.chHP*100)}%)`;
        })
        do{
            charOp = parseInt(prompt(charOptions));
        } while (charOp > charToSelec.length || charOp < 1);
        charOp--;
        player = charTeam.find((char)=> charToSelec[charOp].chName.toUpperCase() == char.chName.toUpperCase());
        alert(`Se cambió a ${player.chName}! (${Math.ceil(player.curHP/player.chHP*100)}%)`);
    } else {
        charOp = Math.round(Math.random()*(charToSelec.length - 1));
        cpu = charTeam.find((char)=> charToSelec[charOp].chName.toUpperCase() == char.chName.toUpperCase());
        alert(`Se cambió a ${cpu.chName}! (${Math.ceil(cpu.curHP/cpu.chHP*100)}%)`);
    }
    
    
}


let op;
let player, cpu;
const arrChar = new Array();

arrChar.push(new Character(220.0, 8.7, 9.6, 8.8, "Darth Vader", new Attack("Golpe Oscuro", 9.5, 0, 5, 1, 0.1), new Attack("Extrangulamiento", 6.5, 0, 2, 0.9, 0.3))); //Crea Darth Vader
arrChar.push(new Character(250.0, 9.1, 9, 8.5, "Obi-Wan Kenobi", new Attack("Soresu - Obi-Wan", 8, 0, 7, 1, 0.2), new Attack("Confusión", 0, 2, 1, 0.5, 1))); //Crea Obi-Wan
arrChar.push(new Character(190.0, 9.3, 9, 9.5, "Yoda", new Attack("Ataru", 9, 0, 7, 0.9, 0.3), new Attack("Conoce al Enemigo", 4, 0, 3, 0.95, 1))); //Crea Yoda
arrChar.push(new Character(260.0, 9, 9.4, 9.1, "Darth Sidious", new Attack("El Poder del Lado Oscuro", 9.5, 0, 7, 0.95, 0.1), new Attack("Rayos de la Fuerza", 5, 0, 4, 1, 0.2))); //Crea Darth Sidious
arrChar.push(new Character(275.0, 9.3, 9, 8.3, "Ben Kenobi", new Attack("Soresu - Ben", 8.5, 0, 6, 1, 0.5), new Attack("Estos no son los Droides que Buscas", 3, 2, 1, 0.9, 0.5))); //Crea Ben Kenobi
arrChar.push(new Character(220.0, 8.5, 9, 9.3, "Darth Maul", new Attack("Poder Descontrolado", 6, 0, 9, 1, 0.5), new Attack("Ira Extrema", 5, 0, 2, 1, 0.3))); //Crea Darth Maul
arrChar.push(new Character(200.0, 8.6, 9.5, 9, "Anakin Skywalker", new Attack("Djem So - Anakin", 12, 0, 14, 0.8, 1), new Attack("El Elegido...", 6, 0, 2, 1, 0.3)));//Crea Anakin Skywalker
arrChar.push(new Character(210.0, 8.4, 9.2, 9.1, "Ashoka Tano", new Attack("Doble Sable", 5.5, 0, 9, 1, 0.8), new Attack("Ataque Sorpresa", 5, 1, 5, 1, 0.3)));//Crea Ashoka Tano
arrChar.push(new Character(260.0, 8.6, 9, 9.1, "Qui-Gon Jinn", new Attack("Liberación", 8, 0, 3, 1, 0.7), new Attack("Ataru - Qui-Gon", 7, 1, 5, 0.9, 0.5))); //Qui-Gon Jinn
arrChar.push(new Character(240.0, 8.8, 9.4, 8.8, "Rey Skywalker", new Attack("Sanación de la Fuerza", 0, 0, 13, 1, 1), new Attack("Embestida", 9.5, 0, 5, 0.9, 0.2))); //Rey Skywalker
arrChar.push(new Character(220.0, 9, 9.5, 9.2, "Luke Skywalker", new Attack("Golpe de Gracia", 8.5, 0, 1, 1, 0.3), new Attack("Ilusión de la Fuerza", 0, 0, 11, 1, 1))); //Luke Skywalker
arrChar.push(new Character(250.0, 8.5, 7.5, 7.5, "Leia Organa", new Attack("Primera Impresión", 6.5, 1, 5, 1, 0.5), new Attack("Servicio de Sanación", 0, 0, 12, 1, 1))); //Leia Organa
arrChar.push(new Character(150.0, 7.9, 9, 9, "Han Solo", new Attack("No hay Trato", 7, 0, 9, 1, 0.6), new Attack("Bomba Secreta", 8, 0, 10, 1, 1))); //Han Solo
arrChar.push(new Character(290.0, 8.5, 9, 7.1, "Chewbacca", new Attack("Rrwaahhggg", 12, 0, 14, 0.8, 1), new Attack("Hwaaurrgh ghaawwu huagg", 7, 0, 10, 1, 1))); //Chewbacca
arrChar.push(new Character(230.0, 9.1, 8.9, 9.2, "Ezra Bridger", new Attack("Lucha Contra el Lado Oscuro", 3, 0, 15, 1, 1), new Attack("Estrategia Definitiva", 8.5, 0, 5, 1, 0.4))); //Ezra Bridger
arrChar.push(new Character(260.0, 9.4, 8.7, 8.4, "Kanan Jarrus", new Attack("Escudo de la Fuerza", 0, 4, 16, 0.5, 1), new Attack("Ataque y Cobertura", 6, 0, 6, 0.9, 0.7))); //Kanan Jarrus
arrChar.push(new Character(200.0, 8.4, 8, 7.5, "Padmé Amidala", new Attack("Disparos Múltiples", 3, 0, 8, 0.95, 1), new Attack("Disparo a Cubierto", 6.5, 0, 6, 1, 0.6))); //Padmé Amidala
arrChar.push(new Character(270.0, 9.5, 8.9, 8.6, "Mace Windu", new Attack("Vaapad Ofensivo", 9, 0, 5, 0.95, 0.7), new Attack("Vapaad Defensivo", 5.5, 0, 6, 0.95, 0.8))); //Mace Windu
arrChar.push(new Character(220.0, 8.2, 7.7, 8.2, "Clone Trooper", new Attack("Ráfaga de Disparos", 3, 0, 8, 0.95, 1), new Attack("Ataque Ágil", 4, 1, 7, 1, 0.4))); //Clone Trooper
arrChar.push(new Character(250.0, 8.7, 8.5, 8.3, "The Mandalorian", new Attack("Escudo de Beskar - Mandalorian", 1, 4, 16, 0.5, 1), new Attack("Ataque Explosivo", 9, 0, 10, 0.9, 1))); //The Mandalorian
arrChar.push(new Character(230.0, 8.6, 9.2, 9.1, "Count Dooku", new Attack("Makashi - Dooku", 10, 0, 7, 0.9, 0.1), new Attack("Ataque de Rayos", 6.5, 0, 4, 0.95, 0.4))); //Count Dooku
arrChar.push(new Character(240.0, 8.9, 9.5, 8.3, "General Grievous", new Attack("Makashi - Grievous", 4.5, 0, 8, 0.8, 1), new Attack("Extrema Ofensiva", 12, 0, 14, 0.8, 1))); //General Grievous
arrChar.push(new Character(210.0, 8, 8.4, 8, "Jango Fett", new Attack("Misil Teledirigido", 10, 0, 10, 0.85, 1), new Attack("Jett Pack", 4, 1, 7, 1, 0.7))); //Jango Fett
arrChar.push(new Character(200.0, 7.9, 8.5, 8.5, "Boba Fett", new Attack("Misil Explosivo", 12, 0, 10, 0.75, 1), new Attack("Armadura de Beskar", 0, 1, 6, 1, 1))); //Boba Fett
arrChar.push(new Character(210.0, 7.9, 8.5, 8, "Moff Gideon", new Attack("Sable Oscuro", 7, 0, 9, 0.9, 0.6), new Attack("Predice al Enemigo", 3, 3, 15, 1, 1))); //Moff Gideon
arrChar.push(new Character(200.0, 8.1, 9.5, 9.3, "Asajj Ventress", new Attack("Espada Doble", 5.5, 0, 9, 1, 0.95), new Attack("Sanación de Hermandad", 0, 0, 12, 1, 1))); //Asajj Ventress
arrChar.push(new Character(220.0, 8.6, 8.3, 8.1, "Captain Phasma", new Attack("Subfusil Bláster", 3.5, 0, 8, 0.9, 1), new Attack("Escudo de Beskar - Phasma", 1.5, 1, 16, 0.5, 1))); //Captain Phasma
arrChar.push(new Character(230.0, 8.2, 8.1, 8.5, "Kylo Ren", new Attack("Parálisis", 10, 0, 4, 0.75, 0.5), new Attack("Odio", 8.5, 1, 2, 0.9, 0.4))); //Kylo Ren
arrChar.push(new Character(170.0, 8.2, 8.1, 8.5, "Grand Admiral Thrawn", new Attack("Preve el siguiente movimiento", 5, 1, 15, 1, 0.85), new Attack("Mejora las defensas", 8.5, 1, 6, 0.95, 0.7))); //Grand Admiral Thrawn
arrChar.push(new Character(250.0, 8.9, 9.3, 8.6, "Savage Opress", new Attack("Golpes Agresivos", 3, 0, 8, 1, 1), new Attack("Furia", 15, 0, 14, 0.7, 1))); //Savage Opress
arrChar.push(new Character(260.0, 8.6, 9.2, 8.1, "Mother Talzin", new Attack("Hechizo Sanador", 0, 0, 13, 1, 1), new Attack("Sanación de las Hermanas", 6, 0, 12, 0.9, 1))); //Mother Talzin
arrChar.push(new Character(250.0, 9.2, 9.5, 9.1, "Darth Bane", new Attack("Espíritu del Pasado", 0, 0, 11, 1, 1), new Attack("Poder Ancestral", 6, 0, 5, 0.9, 1))); //Darth Bane
arrChar.push(new Character(260.0, 8.6, 9.2, 8.1, "StormTrooper", new Attack("Ráfaga de Disparos", 3, 0, 8, 0.95, 1), new Attack("Ataque Agresivo", 8.5, 0, 5, 1, 0.4))); //StormTrooper
arrChar.push(new Character(260.0, 8.6, 9.2, 8.1, "Bossk", new Attack("MudaPiel", 0, 0, 3, 1, 1), new Attack("Regalo Explosivo", 7.5, 0, 10, 0.95, 1))); //Bossk



/* arrChar.forEach(function(char){
    console.log(char);
}); */

const playerTeam = new Array();
const cpuTeam = new Array();

let playerChar;
let i = 0;
let selectedChar = " ";

while (i<3 && selectedChar){
     do{
        let chaSelec = "Seleccione el personaje " + (i+1) + " (escribe el nombre completo y sin repetir):\n"
        arrChar.forEach(function(char){
            chaSelec += " - " + char.chName;
        });
        selectedChar = prompt(chaSelec);
        if (selectedChar){
            playerChar = arrChar.find((char) => char.chName.toUpperCase() == selectedChar.toUpperCase());
            console.log(playerChar);
        }
    } while ((!playerChar || playerTeam.some((char) => !playerChar.chName.localeCompare(char.chName))) && selectedChar);

    if(selectedChar){
        player = new Character(playerChar.chHP, playerChar.def, playerChar.atc, playerChar.spd, playerChar.chName, playerChar.att1, playerChar.att2);

        playerTeam.push(player);
    }        
    i++;
}
   

if (selectedChar){
    let nC;
    for(let i = 0; i<3; i++){
        do{
            nC = Math.round(Math.random()*(arrChar.length - 1));
        } while (cpuTeam.some((char) => !arrChar[nC].chName.localeCompare(char.chName)));
        cpu = new Character(arrChar[nC].chHP, arrChar[nC].def, arrChar[nC].atc, arrChar[nC].spd, arrChar[nC].chName, arrChar[nC].att1, arrChar[nC].att2);
        cpuTeam.push(cpu);
    }

    let team = "";

    playerTeam.forEach((char) => {
        team += char.chName + " - ";
    })
    alert("Elegiste a " + team + "!");

    team = "";
    cpuTeam.forEach((char) => {
        team += char.chName + " - ";
    })
    alert("Te enfrentas a " + team + "!");

    let atOp;

    player = playerTeam[0];
    cpu = cpuTeam[0];
    let charToSelecPlayer;
    let charToSelecCpu;

    while (playerTeam.reduce((hpT, char) => hpT += char.curHP, 0) > 0 && cpuTeam.reduce((hpT, char)=> hpT += char.curHP, 0) > 0){
        let playerChanges;
        let cpuChanges;
        let attP, attC;
        let opNumber = 2;

        if (player.curHP == 0){
            changeChar(player, charToSelecPlayer, playerTeam, false);
        }

        if(cpu.curHP == 0){
            changeChar(cpu, charToSelecCpu, cpuTeam, true);
        }

        playerChanges = false;
        cpuChanges = false;
        
        do{
            let textToShow = "Elige un movimienyo: \n 1- " + player.att1.nameAt + " " + player.att1.sDes + " \n 2- " + player.att2.nameAt + " " + player.att2.sDes;
            charToSelecPlayer = playerTeam.filter((char)=> char.curHP > 0 && player != char);
            if(charToSelecPlayer.length > 0){
                textToShow += "\n 3- Cambiar de Personaje";
                opNumber++;
            }
            atOp = parseInt(prompt(textToShow));
        } while ((atOp > opNumber || atOp < 1) || Number.isNaN(atOp));

        switch (atOp){
            case 1:  
                attP = player.att1;
                break;
            case 2: 
                attP = player.att2;
                break;
            case 3:
                playerChanges = true;
                break;
            default:
                break;
        }

        charToSelecCpu = cpuTeam.filter((char)=> char.curHP > 0 && cpu != char);

        if(charToSelecCpu.length > 0){
            atOp = Math.round(Math.random()*4 + 1);
        } else {
            atOp = Math.round(Math.random()*3 + 1);
        }
    
        switch (atOp){
            case 1: 
            case 2:
                attC = cpu.att1;
                break;
            case 3:
            case 4:
                attC = cpu.att2
                break;
            case 5:
                cpuChanges = true;
                break;
            default:
                break;
        }


        let playFirs = Math.random() > 0.5;

        if (playerChanges || cpuChanges || attP.prio > attC.prio || attP.prio == attC.prio && player.spd > cpu.spd || attP.prio == attC.prio && player.spd == cpu.spd && playFirs){
            if (playerChanges){
                changeChar(player, charToSelecPlayer, playerTeam, false);
            } else {
                if (cpuChanges){
                    changeChar(cpu, charToSelecCpu, cpuTeam, true);
                }
                alert("Atacas primero");
                attacks(player, cpu, attP);
            }
            
            if(!cpuChanges){
                if (cpu.curHP > 0){
                    attacks(cpu, player, attC);
                } 
            }
           
            

        } else {
            if(cpuChanges){
                changeChar(cpu, charToSelecCpu, cpuTeam, true);
            } else{
                if (playerChanges){
                    changeChar(player, charToSelecPlayer, playerTeam, false);
                }
                alert("El rival ataca primero");
                attacks(cpu, player, attC);  
            }       
            if(!playerChanges){
                if (player.curHP > 0){
                    attacks(player, cpu, attP);
                
                }                        
            }
        }

        if (player.spd > cpu.spd || player.spd == cpu.spd && playFirs){
            updStatus(player);
            updStatus(cpu); 
        } else {
            updStatus(cpu); 
            updStatus(player);
        }
            

        if(player.curHP < 0){
            player.curHP = 0;
            alert(player.chName + " se debilitó");
        }
        if (cpu.curHP < 0){
            cpu.curHP = 0;
            alert(cpu.chName + " se debilitó");
        }

        alert(`${player.chName} (HP: ${Math.ceil(player.curHP/player.chHP*100)}%) Estado: - ${player.chStatus.desc} (Tú)\n\n ${cpu.chName} (HP: ${Math.ceil(cpu.curHP/cpu.chHP*100)}%) Estado: - ${cpu.chStatus.desc} (Rival)`);
                
    }             

    if(player.curHP > 0){
        alert(`${player.chName} gana!! (HP: ${Math.ceil(player.curHP/player.chHP*100)}%) (Tú)`);
    } else if (cpu.curHP > 0){
        alert(cpu.chName + " gana!! (HP: " + Math.ceil(cpu.curHP/cpu.chHP*100) + "%) (Rival)");
    } else {
        alert("Empate!!");
    }

    console.log(playerTeam);
    console.log(cpuTeam);

} else alert("Cancelaste");


//*/
