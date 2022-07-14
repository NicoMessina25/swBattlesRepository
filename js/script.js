
class Attack{
    constructor(name, pow){
        this.nameAt = name;
        this.power = pow;
        this.special = 0;
        this.sDes = "";
    }
}

class Status{
    constructor(type, turns){
        this.stType = type;
        this.stTurns = turns;
    }
   
}

class Character {
    constructor(hpT, def, atc, name){
        this.chHP = hpT;
        this.def = def;
        this.atc = atc;
        this.chName = name;
        this.chStatus = new Status(0,0);
    }
}

class ObiWan extends Character{
    constructor(hpT, def, atc, name){
        super(hpT, def, atc, name);
        this.att1 = new Attack("Empujon de la fuerza", 8);
        this.att2 = new Attack("Confusion", 0);
        this.att2.special = 1;
        this.att2.sDes = "(" + this.att2.power*10 + ") (Probabilidad de confundir al enemigo)";
    }

    usedAttack1(){
        return this.chName + " uso " + this.att1.nameAt;
    }

    usedAttack2(){
        return this.chName + " uso " + this.att2.nameAt;
    }

    att2SAcion(){
        return Math.random() > 0.5;
    }
}

class DarthVader extends Character{
    constructor(hpT, def, atc, name){
        super(hpT, def, atc, name);
        this.att1 = new Attack("Sable Oscuro", 9.5);
        this.att2 = new Attack("Extrangulamiento", 6);
        this.att2.special = 2;
        this.att2.sDes = "(" + this.att2.power*10 + ") (el enemigo pierde vida por tres turnos)";
    }

    usedAttack1(){
        return this.chName + " uso " + this.att1.nameAt;
    }

    usedAttack2(){
        return this.chName + " uso " + this.att2.nameAt;
    }

}

let op;
let player, cpu;
const arrChar = new Array(32);
arrChar.push(new ObiWan(hpOW, defOW, atcOW, nameOW));

arrChar.forEach(function(char, ind, arrChar){
    console.log(char + " " + ind);
});


let atcDV = 9.3, defDV = 7.4, hpDV = 100.0, nameDV = "Darth Vader", naAt1DV = "Sable Oscuro", powAt1DV = 95, naAt2DV = "Extrangulamiento", powAt2DV = 60;
let atcOW = 8.1, defOW = 9.1, hpOW = 150.0, nameOW = "Obi-Wan Kenobi";
do{
    op = prompt("Seleccione su personaje: \n 1- " + nameDV +  ":\n - Vida: " + hpDV + "\n - At: " + atcDV*10 + "\n - Def: " + defDV*10 + "\n 2- " + nameOW +":\n - Vida: " + hpOW + "\n - At: " + atcOW*10 + "\n- Def: " + defOW*10);
} while (op > '2' || op < '1');
    

if (op == '1'){
    player = new DarthVader(hpDV, defDV, atcDV, nameDV);
    cpu = new ObiWan(hpOW, defOW, atcOW, nameOW);
} else {
    cpu = new DarthVader(hpDV, defDV, atcDV, nameDV);
    player = new ObiWan(hpOW, defOW, atcOW, nameOW);
}
alert("Elegiste a " + player.chName + "!");

let hpP = player.chHP;
let hpC = cpu.chHP;
let pieVid = 0;
let pegaASMis = false;;
let atCPU = false;
let atPowOp;

while (hpP > 0 && hpC>0){
        do{
            atPowOp = prompt("Elige un ataque: \n 1- " + player.att1.nameAt + " (" + player.att1.power*10 + ") \n 2- " + player.att2.nameAt + " " + player.att2.sDes);
        } while (op > '2' || op < '1');

        if (atPowOp == '1'){
            alert(player.usedAttack1());
            if(player.chStatus.stType != 1){
                hpC = hpC - player.att1.power*player.atc*(1-cpu.def/100);
            } else {
                hpP = hpP - player.att1.power*player.atc*(1-player.def/100);
                alert(player.chName + " se pego a si mismo");
                player.chStatus.stType = 0;
                player.chStatus.stTurns = 0;
                alert(player.chName + " se libro de la confusion");
            }
                
        } else {
            alert(player.usedAttack2());
            if(player.chStatus.stType != 1){
                 hpC = hpC - player.att2.power*player.atc*(1-cpu.def/100);
                if (player.att2.special == 1){
                    pegaASMis = player.att2SAcion();
                    if (pegaASMis){
                        alert(cpu.chName + " esta confundido!");
                        cpu.chStatus.stType = 1;
                        cpu.chStatus.stTurns = 1;
                    } else {
                        alert(player.chName + " fallo...");
                    } 
                } else if ((player.att2.special == 2)){
                        if (cpu.chStatus.stTurns == 0){
                            alert(cpu.chName + " pierde vida cada turno por tres turnos");
                            cpu.chStatus.stTurns = 3;
                            cpu.chStatus.stType = 2;
                        } else alert(cpu.chName + " ya estaba extrangulado");
                } 
            } else {
                hpP = hpP - player.att2.power*player.atc*(1-player.def/100);
                alert(player.chName + " se pego a si mismo");
                player.chStatus.stType = 0;
                player.chStatus.stTurns = 0;
                alert(player.chName + " se libro de la confusion");
            }
                          
        }

        atCPU = Math.random() > 0.5;
        
        if (hpC > 0){
            if(atCPU){
                alert(cpu.usedAttack1());
                if(cpu.chStatus.stType != 1){
                    hpP = hpP - cpu.att1.power*cpu.atc*(1-player.def/100);
                } else {
                    hpC = hpC - cpu.att1.power*cpu.atc*(1-cpu.def/100);
                    alert(cpu.chName + " se pego a si mismo");
                    cpu.chStatus.stType = 0;
                    cpu.chStatus.stTurns = 0;
                    alert(cpu.chName + " se libro de la confusion");
            }
            } else {
                alert(cpu.usedAttack2());
                if(cpu.chStatus.stType != 1){
                    hpP = hpP - cpu.att2.power*cpu.atc*(1-player.def/100);
                    if (cpu.att2.special == 1){
                        pegaASMis = cpu.att2SAcion();
                        if (pegaASMis){
                            alert(player.chName + " esta confundido!");
                            player.chStatus.stType = 1;
                            player.chStatus.stTurns = 1;
                        } else {
                            alert(cpu.chName + " fallo...");
                        } 
                    } else if ((cpu.att2.special == 2)){
                            if (player.chStatus.stTurns == 0){
                                alert(player.chName + " pierde vida cada turno por tres turnos");
                                player.chStatus.stTurns = 3;
                                player.chStatus.stType = 2;
                            } else alert(player.chName + " ya estaba extrangulado");
                    } 
                } else {
                    hpC = hpC - cpu.att2.power*cpu.atc*(1-cpu.def/100);
                    alert(cpu.chName + " se pego a si mismo");
                    cpu.chStatus.stType = 0;
                    cpu.chStatus.stTurns = 0;
                    alert(cpu.chName + " se libro de la confusion");
                }  
                                    
            }              
        }
            

        if (player.chStatus.stTurns > 1){
            player.chStatus.stTurns--; 
            if (player.chStatus.stType == 2){ //para cuando haya otros status
                hp2 *= 0.95;
                alert("Quedan " + player.chStatus.stTurns + " turno/s de extrangulamiento");
            }
            if (player.chStatus.stTurns == 0){
                player.chStatus.stType = 0;
            }
        }

        if(hpP < 0){
            hpP = 0;
        }
        if (hpC < 0){
            hpC = 0;
        }

        alert(player.chName + " (HP: " + parseInt(hpP/player.chHP*100) + "%) \n\n " + cpu.chName + " (HP: " + parseInt(hpC/cpu.chHP*100) + "%)");
    } 

if(hpP > 0){
    alert(player.chName + "!! (HP: " + parseInt(hpP/player.chHP*100) + "%)");
} else {
    alert(cpu.chName + "!! (HP: " + parseInt(hpC/cpu.chHP*100) + "%)");
}
//*/
