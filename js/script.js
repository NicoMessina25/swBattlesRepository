class Attack{
    constructor(name, pow, prio, special){
        this.nameAt = name;
        this.power = pow;
        this.prio = prio;
        this.special = special;
        switch (this.special) {
            case 1: 
                this.sDes = "(" + this.power*10 + ") (Probabilidad de confundir al enemigo)";
                break;    
            case 2: 
                this.sDes = "(" + this.power*10 + ") (Probabilidad de que el enemigo pierda vida cada turno)";
                break;
            case 3: 
                this.sDes = "(" + this.power*10 + ") (Probabilidad de curarte el estado)";
                break;
            default: 
                this.sDes = "";
                break;
        }    
            
    }

    usedAttack(){
        return " uso " + this.nameAt;
    }

    attProb(){
        switch (this.special){
            case 1: return Math.random() > 0.5;
            case 2: return Math.random() > 0.2;
            case 3: return Math.random() > 0.1;
            default: return true;
        }
        
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
        this.def = def;
        this.atc = atc;
        this.spd = spd;
        this.chName = name;
        this.chStatus = new Status(0,"");
        this.att1 = att1;
        this.att2 = att2;
    }
}

function attacks(attker, defder, att){
    alert(attker.chName + att.usedAttack());
            sAtProb = att.attProb();
            if(sAtProb){
                if(attker.chStatus.type != 1){
                    defder.curHP -= att.power*attker.atc*(1-defder.def/100);
                    if (defder.chStatus.type == 0){
                        switch (att.special){
                            case 1: 
                                alert(defder.chName + " esta confundido!");
                                defder.chStatus.type = 1;
                                defder.chStatus.desc = "confundido";
                                break;
                            case 2: 
                                alert(defder.chName + " pierde vida cada turno");
                                defder.chStatus.desc = "extrangulado";
                                defder.chStatus.type = 2;
                            case 3:
                                if(attker.chStatus.type != 0){
                                    alert(attker.chName + " dejo de estar " + attker.chStatus.desc);
                                    attker.chStatus.type = 0;
                                    char.chStatus.desc = "";
                                }
                            default:; //caso 0
                        }
                    } else if(att.special != 0){
                        alert(defder.chName + " ya esta " + defder.chStatus.desc + ". No puede tener mas de un estado");
                    } 
                } else {
                    attker.curHP -= att.power*attker.atc*(1-attker.def/100);
                    alert(attker.chName + " se pego a si mismo");
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
            default:;
        }
    }
        
 
}


let op;
let player, cpu;
const arrChar = new Array();

arrChar.push(new Character(220.0, 8.7, 9.6, 8.8, "Darth Vader", new Attack("Sable Oscuro", 9.5, 0, 0), new Attack("Extrangulamiento", 6, 0, 2))); //Crea Darth Vader
arrChar.push(new Character(250.0, 9.1, 9, 8.5, "Obi-Wan Kenobi", new Attack("Empujon de la fuerza", 8, 0, 0), new Attack("Confusion", 0, 1, 1))); //Crea Obi-Wan
arrChar.push(new Character(190.0, 9.3, 9, 9.5, "Yoda", new Attack("Sable Veloz", 9, 0, 0), new Attack("Conoce al Enemigo", 4, 0, 3))); //Crea Yoda


arrChar.forEach(function(char){
    console.log(char);
});

do{
    let chaSelec = "Seleccione un personaje: "
    arrChar.forEach(function(char, ind){
        chaSelec += "\n" + (ind+1) + "- " + char.chName + ":\n - Vida: " + char.chHP + "\n - At: " + char.atc*10 + "\n - Def: " + char.def*10 + "\n - Vel: " + char.spd;
    });
    op = parseInt(prompt(chaSelec));
} while (op > arrChar.length || op < 1);

if (!Number.isNaN(op)){
    let nP = op-1;
    let nC = Math.round(Math.random()*(arrChar.length - 1));
    console.log(nC);

    player = new Character(arrChar[nP].chHP, arrChar[nP].def, arrChar[nP].atc, arrChar[nP].spd, arrChar[nP].chName, arrChar[nP].att1, arrChar[nP].att2);
    cpu = new Character(arrChar[nC].chHP, arrChar[nC].def, arrChar[nC].atc, arrChar[nC].spd, arrChar[nC].chName, arrChar[nC].att1, arrChar[nC].att2);

    alert("Elegiste a " + player.chName + "!");
    alert("Te enfrentas a " + cpu.chName + "!");

    let atCPU = false;
    let atPowOp;


    while (player.curHP > 0 && cpu.curHP>0){

        let attP, attC;
        do{
            atPowOp = parseInt(prompt("Elige un ataque: \n 1- " + player.att1.nameAt + " (" + player.att1.power*10 + ") \n 2- " + player.att2.nameAt + " " + player.att2.sDes));
        } while (atPowOp > 2 || atPowOp < 1);

        if (atPowOp == 1){
            attP = player.att1;
        } else attP = player.att2;

        atCPU = Math.random() > 0.5;

        if(atCPU){
            attC = cpu.att1;
        } else attC = cpu.att2;

        let playFirs = Math.random() > 0.5;

        if (attP.prio > attC.prio || attP.prio == attC.prio && player.spd > cpu.spd || attP.prio == attC.prio && player.spd == cpu.spd && playFirs){
            alert("Atacas primero");
            attacks(player, cpu, attP);
            
            if (cpu.curHP > 0){
                attacks(cpu, player, attC);
            } 
            

        } else {
            alert("El rival ataca primero");
            attacks(cpu, player, attC);        
            if (player.curHP > 0){
                attacks(player, cpu, attP);
            
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

        alert(player.chName + " (HP: " + parseInt(player.curHP/player.chHP*100) + "%) Estado: -" + player.chStatus.desc + " (Tú)\n\n" + cpu.chName + " (HP: " + parseInt(cpu.curHP/cpu.chHP*100) + "%) Estado: -" + cpu.chStatus.desc + " (Rival)");
                
    }             

    if(player.curHP > 0){
        alert(player.chName + " gana!! (HP: " + parseInt(player.curHP/player.chHP*100) + "%)");
    } else if (cpu.curHP > 0){
        alert(cpu.chName + " gana!! (HP: " + parseInt(cpu.curHP/cpu.chHP*100) + "%)");
    } else {
        alert("Empate!!");
    }
    arrChar[op-1].curHP = arrChar[op-1].chHP;
} else alert("Cancelaste");


//*/
