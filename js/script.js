const MAX_TEAMS = 5;
const MAX_CHARACTERS = 3;

class User{
    constructor(userName, password, teams){
        this.userName = userName;
        this.password = password;
        this.teams = teams;
    }
}

class Attack{
    constructor(name, pow, prio, special, prob, probSpecEf){
        this.nameAt = name;
        this.power = pow;
        this.prio = prio;
        this.special = special;
        this.prob = prob;
        this.probSpecEf = probSpecEf;
        this.sDes = "Poder: " + this.power*10 + " Prob: " + this.prob*100 + "% Prioridad: " + this.prio + " (" + this.probSpecEf*100;
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
            case 17:
                this.sDes += "% de bajar el ataque al enemigo)";
                break;
            case 18:
                this.sDes += "% de bajar la defensa al enemigo)";
                break;
            case 19:
                this.sDes += "% de bajar la velocidad al enemigo)";
                break;
            default: 
                this.sDes += "";
                break;
        }    
            
    }

    usedAttack(){
        return " usó " + this.nameAt;
    }
        
}

class Status{
    constructor(type, desc){
        this.type = type;
        this.desc = desc;
    }
   
}

class Character {
    constructor(hpT, def, atc, spd, name, id, side, att1, att2){
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
        this.side = side;
        this.id = id;
    }
}

class Team{
    constructor(name,size, chars, wins, games){
        this.name = name;
        this.size = size;
        this.chars = chars;
        this.wins = wins;
        this.games = games;
    }
}

function lowersHP(defder, power, atc, def){
    if (defder.chStatus.type != 16){
        if(defder.sustituteHP > 0){
            defder.sustituteHP -= power*atc/def*4;
            defder.sustituteHP <= 0 && (defder.chStatus.desc = "");
        } else {
            defder.curHP -= power*atc/def*4;
        }
    } else textareaBattleLog.value += `\n\n${defder.chName} se protegió`;       
}


function attacks(attker, defder, att, textareaBattleLog){
    textareaBattleLog.value += `\n\n${attker.chName} ${att.usedAttack()}`;
            if(att.prob >= Math.random()){
                if((attker.chStatus.type != 1 && attker.chStatus.type != 4) || Math.random() > 0.5){
                    lowersHP(defder, att.power, attker.atc, defder.def);
                    specialEffect = att.probSpecEf >= Math.random();
                    if(specialEffect){
                        switch(att.special){
                            case 3: //cura estado
                                    if(attker.chStatus.type != 0 && attker.chStatus.type != 12){
                                        textareaBattleLog.value += `\n\n${attker.chName} dejo de estar ${attker.chStatus.desc}`;
                                        attker.chStatus.type = 0;
                                        attker.chStatus.desc = "";
                                    }
                                    break;
                            case 5: //sube ataque
                                if(attker.modAtc < 6){
                                    textareaBattleLog.value += `\n\n${attker.chName} se subio el ataque`;
                                    attker.modAtc++;
                                    /* if(attker.modAtc >= 0){
                                        attker.atc = attker.atcBase*(1 + attker.modAtc*0.5); 
                                    } else{
                                        attker.atc = attker.atcBase/(1 - attker.modAtc*0.5)
                                    } */
                                    (attker.modAtc >= 0)? attker.atc = attker.atcBase*(1 + attker.modAtc*0.5):attker.atc = attker.atcBase/(1 - attker.modAtc*0.5);
                                } else textareaBattleLog.value += `\n\n${attker.chName} tiene el ataque máximo`;
                                break;
                            case 6: //sub defensa
                                if(attker.modDef < 6){
                                    textareaBattleLog.value += `\n\n${attker.chName} se subio la defensa`;
                                    attker.modDef++;
                                    /* if(attker.modDef >= 0){
                                        attker.def = attker.defBase*(1 + attker.modDef*0.5); 
                                    } else{
                                        attker.def = attker.defBase/(1 - attker.modDef*0.5)
                                    } */
                                    (attker.modDef >= 0)?attker.def = attker.defBase*(1 + attker.modDef*0.5):attker.def = attker.defBase/(1 - attker.modDef*0.5);
                                } else textareaBattleLog.value += `\n\n${attker.chName} tiene la defensa máxima`;
                                    
                                break;
                            case 7: //sube velocidad
                                if(attker.modSpd < 6){
                                    textareaBattleLog.value += `\n\n${attker.chName} se subio la velocidad`;
                                    attker.modSpd++;
                                    /* if(attker.modSpd >= 0){
                                        attker.spd = attker.spdBase*(1 + attker.modSpd*0.5); 
                                    } else{
                                        attker.spd = attker.spdBase/(1 - attker.modSpd*0.5)
                                    } */
                                    (attker.modSpd >= 0)?attker.spd = attker.spdBase*(1 + attker.modSpd*0.5):attker.spd = attker.spdBase/(1 - attker.modSpd*0.5);
                                } else textareaBattleLog.value += `\n\n${attker.chName} tiene la velocidad máxima`;
                                break;
                            case 8: //recurrente (de 1 a 4 golpes)
                                hitTimes = 1;
                                while(0.65 > Math.random() && hitTimes < 4){
                                    lowersHP(defder, att.power, attker.atc, defder.def);
                                    hitTimes++;
                                }
                                textareaBattleLog.value += `\n\n${attker.chName} pegó ${hitTimes} vez/veces`;
                                break;
                            case 9: //doble golpe
                                lowersHP(defder, att.power, attker.atc, defder.def);
                                textareaBattleLog.value += `\n\n${attker.chName} pegó 2 veces`;
                                break;
                            case 10: //ataques con un daño extra
                                extraPower = Math.random()*5;
                                lowersHP(defder, extraPower, attker.atc, defder.def);
                                textareaBattleLog.value += `\n\n${attker.chName} pegó con un ${parseInt(extraPower*10)} extra de poder`;
                                break;
                            case 11: //sustituto
                                if(attker.sustituteHP <= 0){
                                    if(attker.curHP > attker.chHP*0.25){
                                        attker.curHP -= attker.chHP*0.25;
                                        attker.sustituteHP = attker.chHP*0.25;
                                        attker.chStatus.desc = "sustituto";
                                    } else{
                                        textareaBattleLog.value += `\n\n${attker.chName} no tiene vida suficiente para el sustituto`;
                                    }
                                } else {
                                    textareaBattleLog.value += `\n\n${attker.chName} ya tiene un sustituto activo`;
                                }  
                                break;
                            case 12: // curacion por turnos
                                if (attker.chStatus.type == 0){
                                    attker.chStatus.type = 12;
                                    attker.chStatus.desc = "curado por cada turno"; 
                                } else {
                                    textareaBattleLog.value += `\n\n${attker.chName} ya está ${attker.chStatus.desc}`;
                                }
                                break;
                            case 13: //cura 33%
                                attker.curHP += attker.chHP/3;
                                /* if (attker.curHP > attker.chHP){
                                    attker.curHP = attker.chHP
                                } */
                                attker.curHP > attker.chHP && (attker.curHP = attker.chHP);
                                textareaBattleLog.value += `\n\n${attker.chName} se curó un 33% de vida`;
                                break;
                            case 14: //daño de retroceso
                                lowersHP(attker, att.power*0.25, attker.atc, defder.def);
                                textareaBattleLog.value += `\n\n${attker.chName} perdió vida por retroceso`;
                                break;
                            case 15: //previene  un estado
                                if(attker.chStatus.type == 0){
                                    attker.chStatus.type = 15;
                                    attker.concenTurns = 3;
                                    attker.chStatus.desc = "concentrado";
                                    textareaBattleLog.value += `\n\n${attker.chName} está concentrado`;
                                } else {
                                    textareaBattleLog.value += `\n\n${attker.chName} ya está ${attker.chStatus.desc}`;
                                }
                                break;
                            case 16: //protección
                                attker.chStatus.type = 16;
                                attker.chStatus.desc = "protegido";
                                textareaBattleLog.value += `\n\n${attker.chName} está protegido`;
                                break;
                            case 17: //baja ataque
                                if(defder.modAtc > -6){
                                    textareaBattleLog.value += `\n\n${attker.chName} le bajó el ataque a ${defder.chName}`;
                                    defder.modAtc--;
                                    (defder.modAtc >= 0)? defder.atc = defder.atcBase*(1 + defder.modAtc*0.5):defder.atc = defder.atcBase/(1 - defder.modAtc*0.5);
                                } else textareaBattleLog.value += `\n\n${defder.chName} tiene el ataque mínimo`;
                                break;
                            case 18: //baja defensa
                            if(defder.modDef > -6){
                                textareaBattleLog.value += `\n\n${attker.chName} le bajó la defensa a ${defder.chName}`;
                                defder.modDef--;
                                (defder.modDef >= 0)? defder.def = defder.defBase*(1 + defder.modDef*0.5):defder.def = defder.defBase/(1 - defder.modDef*0.5);
                            } else textareaBattleLog.value += `\n\n${defder.chName} tiene la defensa mínima`;
                                break;
                            case 19: //baja velocidad
                            if(defder.modSpd > -6){
                                textareaBattleLog.value += `\n\n${attker.chName} le bajó la velocidad a ${defder.chName}`;
                                defder.modSpd--;
                                (defder.modSpd >= 0)? defder.spd = defder.spdBase*(1 + defder.modSpd*0.5):defder.spd = defder.spdBase/(1 - defder.modSpd*0.5);
                            } else textareaBattleLog.value += `\n\n${defder.chName} tiene la velocidad mínimo`;
                                break;
                            default:
                                break; 
                        }
                    } else {
                        switch(att.special){
                            case 8:
                            case 9:
                                textareaBattleLog.value += `\n\n${attker.chName} pegó 1 vez`;
                                break;
                            default:
                                break;
                        }
                    }
                    if (defder.chStatus.type == 0 || defder.chStatus.type == 12){
                        if(specialEffect){
                            switch (att.special){
                                case 1:
                                    textareaBattleLog.value += `\n\n${defder.chName} está confundido!`; 
                                    defder.chStatus.type = 1;
                                    defder.chStatus.desc = "confundido";
                                    break;
                                case 2: 
                                    textareaBattleLog.value += `\n\n${defder.chName} pierde vida cada turno`;
                                    defder.chStatus.desc = "extrangulado";
                                    defder.chStatus.type = 2;
                                    break;
                                case 4: 
                                    textareaBattleLog.value += `\n\n${defder.chName} está paralizado`;
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
                            textareaBattleLog.value += `\n\n${defder.chName} previno el estado pero perdió la concentración`;
                        } else {
                            textareaBattleLog.value += `\n\n${defder.chName} ya está ${defder.chStatus.desc}. No puede tener más de un estado`;
                        }
                    }
                    
                } else {
                    if(attker.chStatus.type == 1){
                        attker.curHP -= att.power*attker.atc*(1-attker.def/100);
                        textareaBattleLog.value += `\n\n${attker.chName} se pegó a sí mismo`;
                    } else if(defder.chStatus.type == 16){
                        textareaBattleLog.value += `\n\n${attker.chName} se protegió`;
                        defder.chStatus.type = 0; 
                    } 
                    else {
                        textareaBattleLog.value += `\n\n${attker.chName} se quedó paralizado!`;
                    }
                        
                } 
            }else textareaBattleLog.value += `\n\n${attker.chName} fallo...`;
}

function updStatus(char, textareaBattleLog){
    if (char.curHP > 0){
        switch (char.chStatus.type){ //para cuando haya otros status
            case 1: 
                if (Math.random() > 0.5){
                    textareaBattleLog.value += `\n\n${char.chName} se liberó de la confusión`;
                    char.chStatus.type = 0;
                    char.chStatus.desc = "";
                } else textareaBattleLog.value += `\n\n${char.chName} sigue confuncido`;
                break;
            case 2: 
                char.curHP -= 0.05*char.chHP;
                textareaBattleLog.value += `\n\n${char.chName} perdió vida por el extrangulamiento`;
                break;
            case 12:
                char.curHP -= 0.05*char.chHP;
                textareaBattleLog.value += `\n\n${char.chName} ganó vida por la curación por turnos`;
                break;
            case 15:
                char.concenTurns--;
                if (char.concenTurns == 0){
                    char.chStatus.type = 0;
                    char.chStatus.desc = "";
                    textareaBattleLog.value += `\n\n${char.chName} perdió la concetración`;
                }
                break;
            case 16:
                char.chStatus.type = 0;
                char.chStatus.desc = "";
                textareaBattleLog.value += `\n\n${char.chName} dejó de estar protegido`;
                break;
            default:
                break;
        }
    }
        
 
}

function addCharToNewTeam(teamCharArray, charSelected, divNewChars, isEdit, teams){
    if (teamCharArray.length < MAX_CHARACTERS && !teamCharArray.some((char) => !charSelected.chName.localeCompare(char.chName))){
        let ind;
        if(isEdit){
            ind = parseInt(divNewChars.getAttribute("id").slice(9));
        } else ind = teams.length + 1; 
        teamCharArray.push(new Character(charSelected.chHP, charSelected.def, charSelected.atc, charSelected.spd, charSelected.chName, charSelected.id, charSelected.side, charSelected.att1, charSelected.att2));
        let divCard = document.createElement("div");
        divCard.setAttribute("id", `char${charSelected.id}Team${ind}`);
        divCard.setAttribute("class", "charCard");
        divCard.innerHTML = `
        <h4 id="name${charSelected.id}Team${ind}">${charSelected.chName}</h4>
        <img id="imgChar" src="../img/tb${charSelected.id}.jpg" alt="${charSelected.id}">
        <div id="stats${charSelected.id}Team${ind}">
            <p id="attackChar${teamCharArray.length}Team${ind}">Attack: ${charSelected.atc}</p>
            <p id="defenseChar${teamCharArray.length}Team${ind}">Defense: ${charSelected.def}</p>
            <p id="healthChar${teamCharArray.length}Team${ind}">Health: ${charSelected.chHP}</p>
            <p id="speedChar${teamCharArray.length}Team${ind}">Speed: ${charSelected.spd}</p>
        </div>`
        divNewChars.append(divCard);
        let btnDel = document.createElement("button");
        setButtonAttributes(btnDel, `char${charSelected.id}Team${ind}`, "button2--purple", "Delete");
        btnDel.onclick = () => {
            teamCharArray.splice(teamCharArray.indexOf(teamCharArray.find((char) => `char${char.id}Team${ind}` == divCard.getAttribute("id"))), 1);
            divCard.remove();
            
        }
        divCard.append(btnDel);

        
    } else alert("El equipo es hasta 3 personajes y no puedes repetir");
}

function genHTMLTeamChars(team, ind){
    let htmlTeamChars = " ";
    team.chars.forEach((char, indChar) => {
        htmlTeamChars += `<div id="char${char.id}Team${ind}" class="charCard">
        <h4 id="name${char.id}Team${ind}">${char.chName}</h4>
        <img id="imgChar" src="../img/tb${char.id}.jpg" alt="${char.id}">
        <div id="stats${char.id}Team${ind}">
            <p id="attackChar${indChar}Team${ind}">Attack: ${char.atc}</p>
            <p id="defenseChar${indChar}Team${ind}">Defense: ${char.def}</p>
            <p id="healthChar${indChar}Team${ind}">Health: ${char.chHP}</p>
            <p id="speedChar${indChar}Team${ind}">Speed: ${char.spd}</p>
        </div>
    </div>`;
    });
    return htmlTeamChars;
}

function updateTeams(teams, divYourTeams, divTeams, editButtons, deleteButtons){
    divYourTeams.innerHTML = " ";
    teams.forEach(({name, chars}, ind) => {
        divTeams[ind].innerHTML =`
                <h3 id="teamName${ind}" class="subMainTitle3">${name}</h3>`;
        let divChars = document.createElement(`div`);
        divChars.setAttribute("id", `charsTeam${ind}`);
        divChars.setAttribute("class", "flexible--rowWrap chars");
        chars.forEach(({id, chName, atc, def, chHP, spd}, indChar)=>{
            let divCard = document.createElement("div");
            divCard.setAttribute("id", `char${id}Team${ind}`);
            divCard.setAttribute("class", "charCard");
            divCard.innerHTML = `<h4 id="name${id}Team${ind}">${chName}</h4>
            <img id="imgChar" src="../img/tb${id}.jpg" alt="${id}">
            <div id="stats${id}Team${ind}">
                <p id="attackChar${indChar}Team${ind}">Attack: ${atc}</p>
                <p id="defenseChar${indChar}Team${ind}">Defense: ${def}</p>
                <p id="healthChar${indChar}Team${ind}">Health: ${chHP}</p>
                <p id="speedChar${indChar}Team${ind}">Speed: ${spd}</p>
            </div>`;
            
            divChars.append(divCard);
        })
        divTeams[ind].append(divChars);
        divTeams[ind].append(editButtons[ind]);
        divTeams[ind].append(deleteButtons[ind]);
        divYourTeams.append(divTeams[ind]);
    });
}

function setConfirmListener(btnConfirm, loggedUser, teamCharArray, divYourTeams, divTeams, editButtons, deleteButtons){
    btnConfirm.addEventListener("click", ()=>{
        if(teamCharArray.length > 0){
            updateTeams(loggedUser.teams, divYourTeams, divTeams, editButtons, deleteButtons);
            localStorage.setItem(`user${loggedUser.userName}`, JSON.stringify(loggedUser));
            sessionStorage.setItem(`loggedUser`, JSON.stringify(loggedUser));
            secBuilder.innerHTML = " ";
            tbYourTeams.appendChild(btnAddTeam);
        } else alert("Your team must have at least 1 character");
            
    });
}

function setButtonAttributes(button, btnId, btnClass, btnInnerText){
    button.setAttribute("id", btnId);
    button.setAttribute("class", btnClass);
    button.innerText = btnInnerText;
}

function cancel(modal){
    modal.remove();
}

function logIn(btnNavLogIn, btnNavUser, userName, nav){
    btnNavLogIn.remove();
    btnNavUser.innerText = `${userName}`;
    nav.append(btnNavUser);
}

function parseAtt(att){
    return new Attack(att.nameAt, att.power, att.prio, att.special, att.prob, att.probSpecEf);
}

function cpuAction(cpu, cpuTeam, charToSelecCpu){
    charToSelecCpu = cpuTeam.filter((char)=> char.curHP > 0 && cpu != char);

    /* if(charToSelecCpu.length > 0){
        atOp = Math.round(Math.random()*4 + 1);
    } else {
        atOp = Math.round(Math.random()*3 + 1);
    } */
    (charToSelecCpu.length > 0)?atOp = Math.round(Math.random()*4 + 1):atOp = Math.round(Math.random()*3 + 1);

    switch (atOp){
        case 1: 
        case 2:
            return cpu.att1;
        case 3:
        case 4:
            return cpu.att2
        case 5:
            cpu.atc = cpu.atcBase;
            cpu.def = cpu.defBase;
            cpu.spd = cpu.spdBase;
            cpu.modAtc = 0;
            cpu.modDef = 0;
            cpu.modSpd = 0;
            return null;
        default:
            return null;
    }
}

function getNewCharCpu(cpu, charToSelecCpu, cpuTeam){
    charToSelecCpu = cpuTeam.filter((char)=> char.curHP > 0 && cpu != char);
    let charOp = Math.round(Math.random()*(charToSelecCpu.length - 1));
    return cpuTeam.find((char)=> charToSelecCpu[charOp].chName.toUpperCase() == char.chName.toUpperCase());
}

function resetTeam(teamCharArray){
    teamCharArray.forEach((char)=>{
        char.curHP = char.chHP;
        char.atc = char.atcBase;
        char.def = char.defBase;
        char.spd = char.spdBase;
        char.modAtc = 0;
        char.modDef = 0;
        char.modSpd = 0;
        char.chStatus.desc = "";
        char.chStatus.type = 0;
    });
}

function resetBestTeamsTableValues(){
    let i = 0;
    while (i < 3){
        let teamName = document.getElementById(`tableTeam${i+1}`);
        let winRate = document.getElementById(`winRate${i+1}`);
        let games = document.getElementById(`games${i+1}`);
        teamName.innerText = " ----- ";
        winRate.innerText = " ----- ";
        games.innerText = " ----- ";
        i++;
    }
}

function updateStats(character, name){
    let spanAtc = document.getElementById(`spanAtc${name}`);
    let spanDef = document.getElementById(`spanDef${name}`);
    let spanSpd = document.getElementById(`spanSpd${name}`);
    let spanModAtc = document.getElementById(`spanModAtc${name}`);
    let spanModDef = document.getElementById(`spanModDef${name}`);
    let spanModSpd = document.getElementById(`spanModSpd${name}`);
    let hAtt1Name = document.getElementById(`nameAtt1${name}`);
    let pAtt1Desc = document.getElementById(`descAtt1${name}`);
    let hAtt2Name = document.getElementById(`nameAtt2${name}`);
    let pAtt2Desc = document.getElementById(`descAtt2${name}`);

    spanAtc.innerText = character.atcBase.toFixed(2);
    spanDef.innerText = character.defBase.toFixed(2);
    spanSpd.innerText = character.spdBase.toFixed(2);
    spanModAtc.innerText = character.atc.toFixed(2);
    spanModDef.innerText = character.def.toFixed(2);
    spanModSpd.innerText = character.spd.toFixed(2);

    if(character.modAtc > 0){
        spanModAtc.className = "boostedStat";
    } else if(character.modAtc < 0) {
        spanModAtc.className = "loweredStat";
    } else spanModAtc.className = "";

    if(character.modDef > 0){
        spanModDef.className = "boostedStat";
    } else if(character.modDef < 0) {
        spanModDef.className = "loweredStat";
    } else spanModDef.className = "";

    if(character.modSpd > 0){
        spanModSpd.className = "boostedStat";
    } else if(character.modSpd < 0) {
        spanModSpd.className = "loweredStat";
    } else spanModSpd.className = "";

    hAtt1Name.innerText = character.att1.nameAt;
    pAtt1Desc.innerText = character.att1.sDes;
    hAtt2Name.innerText = character.att2.nameAt;
    pAtt2Desc.innerText = character.att2.sDes;

}

const tableBestTeams = document.getElementById("tableBestTeams");
const btnAddTeam = document.createElement("button");
setButtonAttributes(btnAddTeam, "btnAddTeam", "button2--green", "Add Team");
const btnNeedsLogIn = document.createElement("button");
setButtonAttributes(btnNeedsLogIn, "btnNeedsLogIn", "button2--red", "You must log in");
const main = document.getElementById("main");
const tbYourTeams = document.getElementById("tbYourTeams");
const secYourBTeams = document.getElementById("yourBTeams");
const secSelectYourTeam = document.getElementById("selectYourTeam");
const divYourTeams = document.getElementById("teams");
const secBuilder = document.getElementById("builder");
const nav = document.getElementById("nav");
const btnNavLogIn = document.createElement("button");
setButtonAttributes(btnNavLogIn, "log", "log", "Log In");
const btnNavUser = document.createElement("button");
setButtonAttributes(btnNavUser, "navUser", "userOp", "");
const btnLogSignIn = document.getElementById("btnLogSignIn");
const btnLogOut = document.getElementById("btnLogOut");
const btnCancelIn = document.getElementById("btnCancelIn");
const btnCancelOut = document.getElementById("btnCancelOut");
const modalLogSignIn = document.getElementById("modalLogSignIn");
modalLogSignIn.remove();
const modalLogOut = document.getElementById("modalLogOut");
modalLogOut.remove();
const newCharCards = new Array();
const divTeams = new Array();
const editButtons = new Array();
const deleteButtons = new Array();
const btnLightSide = document.createElement("button");
setButtonAttributes(btnLightSide, "btnLightSide", "button2--blue", "Light Side");
const btnDarkSide = document.createElement("button");
setButtonAttributes(btnDarkSide, "btnDarkSide", "button2--red", "Dark Side");
const btnCreate = document.createElement("button");
setButtonAttributes(btnCreate, "btnCreate", "button2--purple", "Create");
const btnConfirm = document.createElement("button");
setButtonAttributes(btnConfirm, "btnConfirm", "button2--purple", "Confirm");
const artCharSide = document.createElement("article");
artCharSide.setAttribute("id", "charSide");
const divNewChars = document.createElement("div");
divNewChars.setAttribute("id", "newChars");
divNewChars.setAttribute("class", "flexible--row chars");
const btnStartBattle = document.createElement("button");
setButtonAttributes(btnStartBattle, "btnStart", "button--green", "Battle!!"); 
const secBattle = document.getElementById("secBattle");
const btnExit = document.createElement("button");
setButtonAttributes(btnExit, "btnExit", "button--purple", "Exit");
const btnCancelSwitch = document.createElement("button");
setButtonAttributes(btnCancelSwitch, "btnCancelSwitch", "button3--red", "Cancel");
const divEnemy = document.getElementById("divEnemy");
const divEnemyCard = document.getElementById("divBattleCardEnemy");
const divUserCard = document.getElementById("divBattleCardUser");
const btnEndBattle = document.getElementById("btnEndBattle");
const divAtOptions = document.createElement("div");
divAtOptions.setAttribute("id", "atOptions");
divAtOptions.setAttribute("class", "atOptions flexible--column");
const btnAtt1 = document.createElement("button");
setButtonAttributes(btnAtt1, "btnAtt1", "button3--blue", "");
const btnAtt2 = document.createElement("button");
setButtonAttributes(btnAtt2, "btnAtt2", "button3--blue", "");
const btnSwitch = document.createElement("button");
setButtonAttributes(btnSwitch, "btnSwitch", "button3--blue", "");
const textareaBattleLog = document.getElementById("textareaBattleLog");
const btnResetStats = document.createElement("button");
setButtonAttributes(btnResetStats, "btnResetStats", "button2--red", "Reset Stadistics");
const divEnemyStats = document.getElementById("enemyStats");

const divUserStats = document.getElementById("userStats");

const arrChar = new Array();


nav.append(btnNavLogIn);

let isEdit;
let op;
let player, cpu;
let contTurns;
let cpuChanges;
let charToSelecPlayer;
let charToSelecCpu;
let attC;
let btnsChar;


arrChar.push(new Character(220.0, 8.7, 9.6, 8.8, "Darth Vader", "Vader", "Dark", new Attack("Golpe Oscuro", 9.5, 0, 17, 1, 0.1), new Attack("Extrangulamiento", 6.5, 0, 2, 0.9, 0.3))); //Crea Darth Vader
arrChar.push(new Character(250.0, 9.1, 9, 8.5, "Obi-Wan Kenobi", "ObiWan", "Light", new Attack("Soresu - Obi-Wan", 8, 0, 18, 1, 0.2), new Attack("Confusión", 0, 2, 1, 0.5, 1))); //Crea Obi-Wan
arrChar.push(new Character(190.0, 9.3, 9, 9.5, "Yoda", "Yoda", "Light", new Attack("Ataru", 9, 0, 7, 0.9, 0.3), new Attack("Conoce al Enemigo", 4, 0, 3, 0.95, 1))); //Crea Yoda
arrChar.push(new Character(260.0, 9, 9.4, 9.1, "Darth Sidious", "Sidious", "Dark", new Attack("El Poder del Lado Oscuro", 9.5, 0, 18, 0.95, 0.1), new Attack("Rayos de la Fuerza", 5, 0, 4, 1, 0.2))); //Crea Darth Sidious
arrChar.push(new Character(275.0, 9.3, 9, 8.3, "Ben Kenobi", "Ben", "Light", new Attack("Soresu - Ben", 8.5, 0, 6, 1, 0.5), new Attack("Estos no son los Droides que Buscas", 3, 2, 1, 0.9, 0.5))); //Crea Ben Kenobi
arrChar.push(new Character(220.0, 8.5, 9, 9.3, "Darth Maul", "Maul", "Dark", new Attack("Poder Descontrolado", 6, 0, 9, 1, 0.5), new Attack("Ira Extrema", 5, 0, 2, 1, 0.3))); //Crea Darth Maul
arrChar.push(new Character(200.0, 8.6, 9.5, 9, "Anakin Skywalker", "Anakin", "Light", new Attack("Djem So - Anakin", 12, 0, 14, 0.8, 1), new Attack("El Elegido...", 6, 0, 2, 1, 0.3)));//Crea Anakin Skywalker
arrChar.push(new Character(210.0, 8.4, 9.2, 9.1, "Ahsoka Tano", "Ahsoka", "Light", new Attack("Doble Sable", 5.5, 0, 9, 1, 0.8), new Attack("Ataque Sorpresa", 5, 1, 5, 1, 0.3)));//Crea Ashoka Tano
arrChar.push(new Character(260.0, 8.6, 9, 9.1, "Qui-Gon Jinn", "QuiGon", "Light", new Attack("Liberación", 8, 0, 3, 1, 0.7), new Attack("Ataru - Qui-Gon", 7, 1, 5, 0.9, 0.5))); //Qui-Gon Jinn
arrChar.push(new Character(240.0, 8.8, 9.4, 8.8, "Rey Skywalker", "Rey", "Light", new Attack("Sanación de la Fuerza", 0, 0, 13, 1, 1), new Attack("Embestida", 9.5, 0, 5, 0.9, 0.2))); //Rey Skywalker
arrChar.push(new Character(220.0, 9, 9.5, 9.2, "Luke Skywalker", "Luke", "Light", new Attack("Golpe de Gracia", 8.5, 0, 1, 1, 0.3), new Attack("Ilusión de la Fuerza", 0, 0, 11, 1, 1))); //Luke Skywalker
arrChar.push(new Character(250.0, 8.5, 7.5, 7.5, "Leia Organa", "Leia", "Light", new Attack("Primera Impresión", 6.5, 1, 5, 1, 0.5), new Attack("Servicio de Sanación", 0, 0, 12, 1, 1))); //Leia Organa
arrChar.push(new Character(150.0, 7.9, 9, 9, "Han Solo", "Han", "Light", new Attack("No hay Trato", 7, 0, 9, 1, 0.6), new Attack("Bomba Secreta", 8, 0, 10, 1, 1))); //Han Solo
arrChar.push(new Character(290.0, 8.5, 9, 7.1, "Chewbacca", "Chew", "Light", new Attack("Rrwaahhggg", 12, 0, 14, 0.8, 1), new Attack("Hwaaurrgh ghaawwu huagg", 7, 0, 10, 1, 1))); //Chewbacca
arrChar.push(new Character(230.0, 9.1, 8.9, 9.2, "Ezra Bridger", "Ezra", "Light", new Attack("Lucha Contra el Lado Oscuro", 3, 0, 15, 1, 1), new Attack("Estrategia Definitiva", 8.5, 0, 5, 1, 0.4))); //Ezra Bridger
arrChar.push(new Character(260.0, 9.4, 8.7, 8.4, "Kanan Jarrus", "Kanan", "Light", new Attack("Escudo de la Fuerza", 0, 4, 16, 0.5, 1), new Attack("Ataque y Cobertura", 6, 0, 6, 0.9, 0.7))); //Kanan Jarrus
arrChar.push(new Character(200.0, 8.4, 8, 7.5, "Padmé Amidala", "Padme", "Light", new Attack("Disparos Múltiples", 3, 0, 8, 0.95, 1), new Attack("Disparo a Cubierto", 6.5, 0, 17, 1, 0.6))); //Padmé Amidala
arrChar.push(new Character(270.0, 9.5, 8.9, 8.6, "Mace Windu", "Mace", "Light", new Attack("Vaapad Ofensivo", 9, 0, 5, 0.95, 0.7), new Attack("Vapaad Defensivo", 5.5, 0, 6, 0.95, 0.8))); //Mace Windu
arrChar.push(new Character(220.0, 8.2, 7.7, 8.2, "Clone Trooper", "Clone", "Light", new Attack("Ráfaga de Disparos", 3, 0, 8, 0.95, 1), new Attack("Ataque Disuasivo", 4, 1, 19, 1, 0.4))); //Clone Trooper
arrChar.push(new Character(250.0, 8.7, 8.5, 8.3, "The Mandalorian", "Mando", "Light", new Attack("Escudo de Beskar - Mandalorian", 1, 4, 16, 0.5, 1), new Attack("Ataque Explosivo", 9, 0, 10, 0.9, 1))); //The Mandalorian
arrChar.push(new Character(230.0, 8.6, 9.2, 9.1, "Count Dooku", "Dooku", "Dark", new Attack("Makashi - Dooku", 10, 0, 7, 0.9, 0.1), new Attack("Ataque de Rayos", 6.5, 0, 4, 0.95, 0.4))); //Count Dooku
arrChar.push(new Character(240.0, 8.9, 9.5, 8.3, "General Grievous", "Grievous", "Dark", new Attack("Makashi - Grievous", 4.5, 0, 8, 0.8, 1), new Attack("Extrema Ofensiva", 12, 0, 14, 0.8, 1))); //General Grievous
arrChar.push(new Character(210.0, 8, 8.4, 8, "Jango Fett", "Jango", "Dark", new Attack("Misil Teledirigido", 10, 0, 10, 0.85, 1), new Attack("Jett Pack", 4, 1, 7, 1, 0.7))); //Jango Fett
arrChar.push(new Character(200.0, 7.9, 8.5, 8.5, "Boba Fett", "Boba", "Dark", new Attack("Misil Explosivo", 12, 0, 10, 0.75, 1), new Attack("Armadura de Beskar", 0, 1, 6, 1, 1))); //Boba Fett
arrChar.push(new Character(210.0, 7.9, 8.5, 8, "Moff Gideon", "Gideon", "Dark", new Attack("Sable Oscuro", 7, 0, 9, 0.9, 0.6), new Attack("Predice al Enemigo", 3, 3, 15, 1, 1))); //Moff Gideon
arrChar.push(new Character(200.0, 8.1, 9.5, 9.3, "Asajj Ventress", "Asajj", "Dark", new Attack("Espada Doble", 5.5, 0, 9, 1, 0.95), new Attack("Sanación de Hermandad", 0, 0, 12, 1, 1))); //Asajj Ventress
arrChar.push(new Character(220.0, 8.6, 8.3, 8.1, "Captain Phasma", "Phasma", "Dark", new Attack("Subfusil Bláster", 3.5, 0, 8, 0.9, 1), new Attack("Escudo de Beskar - Phasma", 1.5, 1, 16, 0.5, 1))); //Captain Phasma
arrChar.push(new Character(230.0, 8.2, 8.1, 8.5, "Kylo Ren", "Ren", "Dark", new Attack("Parálisis", 10, 0, 4, 0.75, 0.5), new Attack("Odio", 8.5, 0, 2, 0.9, 0.4))); //Kylo Ren
arrChar.push(new Character(170.0, 8.2, 8.1, 8.5, "Grand Admiral Thrawn", "Thrawn", "Dark", new Attack("Preve el siguiente movimiento", 5, 1, 15, 1, 0.85), new Attack("Mejora las defensas", 8.5, 0, 6, 0.95, 0.7))); //Grand Admiral Thrawn
arrChar.push(new Character(250.0, 8.9, 9.3, 8.6, "Savage Opress", "Savage", "Dark", new Attack("Golpes Agresivos", 3, 0, 8, 1, 1), new Attack("Furia", 15, 0, 14, 0.7, 1))); //Savage Opress
arrChar.push(new Character(260.0, 8.6, 9.2, 8.1, "Mother Talzin", "Talzin", "Dark", new Attack("Hechizo Sanador", 0, 0, 13, 1, 1), new Attack("Sanación de las Hermanas", 6, 0, 12, 0.9, 1))); //Mother Talzin
arrChar.push(new Character(250.0, 9.2, 9.5, 9.1, "Darth Bane", "Bane", "Dark", new Attack("Espíritu del Pasado", 0, 0, 11, 1, 1), new Attack("Poder Ancestral", 6, 0, 18, 0.9, 1))); //Darth Bane
arrChar.push(new Character(260.0, 8.6, 9.2, 8.1, "StormTrooper", "Storm", "Dark", new Attack("Ráfaga de Disparos", 3, 0, 8, 0.95, 1), new Attack("Ataque Agresivo", 8.5, 0, 5, 1, 0.4))); //StormTrooper
arrChar.push(new Character(260.0, 8.6, 9.2, 8.1, "Bossk", "Bossk", "Dark", new Attack("MudaPiel", 0, 0, 3, 1, 1), new Attack("Regalo Explosivo", 7.5, 0, 10, 0.95, 1))); //Bossk




let playerTeam;
let cpuTeam = new Array();
let teams = new Array();


let playerChar;
let i = 0;
let selectedChar = " ";
let teamCharArray;
let loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));

if(divYourTeams){
    divYourTeams.innerHTML = " ";
    secBuilder.innerHTML = " "; 
}

const loadToYourTeams = () =>{
    let divTeam = document.createElement("article");
    divTeam.setAttribute("class", "team");

    let btnEdi = document.createElement("button");
    setButtonAttributes(btnEdi, ``, "button2--green", "Edit Team");
    let btnDel = document.createElement("button");
    setButtonAttributes(btnDel, "", "button2--red", "Delete Team");

    btnEdi.addEventListener("click", ()=>{
        if(secBuilder.innerHTML == " " || confirm("Si continuas borrarás el equipo que estabas creando, ¿Desea continuar?")){
            isEdit = true;
            let ind = divTeams.indexOf(divTeam);
            teamCharArray = loggedUser.teams[ind].chars;
            divNewChars.innerHTML = " ";
            divNewChars.setAttribute("id", `charsTeam${ind}`);
            btnAddTeam.remove();
            secBuilder.innerHTML = `
            <article id="newTeam" class="newTeam" >
                <label for="teamName">TeamName</label><br>
                <input id="newTeamName" type="text" name="teamName" placeholder="New Team">
            </article>`;
            const editTeamName = document.getElementById(`newTeamName`);
            editTeamName.value = loggedUser.teams[ind].name;
            
            for(let i = 0; i < teamCharArray.length; i++){
                let divCard = document.createElement("div");
                let {id, chName, atc, def, chHP, spd} = loggedUser.teams[ind].chars[i];
                divCard.setAttribute("id", `char${id}Team${ind}`);
                divCard.setAttribute("class", "charCard");

                divCard.innerHTML = `<h4 id="name${id}Team${ind}">${chName}</h4>
                <img id="imgChar" src="../img/tb${id}.jpg" alt="${id}">
                <div id="stats${id}Team${ind}">
                    <p id="attackChar${i}Team${ind}">Attack: ${atc}</p>
                    <p id="defenseChar${i}Team${ind}">Defense: ${def}</p>
                    <p id="healthChar${i}Team${ind}">Health: ${chHP}</p>
                    <p id="speedChar${i}Team${ind}">Speed: ${spd}</p>
                </div>`;
                let btnDel = document.createElement("button");
                setButtonAttributes(btnDel, ``, "button2--purple", "Delete");
                btnDel.onclick = () => {
                    i = teamCharArray.indexOf(teamCharArray.find(({id})=> `char${id}Team${ind}` == divCard.getAttribute("id")));
                    teamCharArray.splice(i, 1);
        
                    divCard.remove();

                }
                divCard.append(btnDel);
                divNewChars.append(divCard);
            } 
            const secNewTeam = document.getElementById("newTeam");
            secBuilder.append(btnLightSide);
            setConfirmListener(btnConfirm, loggedUser, teamCharArray, divYourTeams, divTeams, editButtons, deleteButtons); 
            secBuilder.append(btnConfirm);
            secBuilder.append(btnDarkSide);
            artCharSide.innerHTML = " ";
            secBuilder.append(artCharSide);
            secNewTeam.append(divNewChars);    
        }; 
    });

    btnDel.addEventListener("click", ()=>{
        let i = divTeams.indexOf(divTeam);
        loggedUser.teams.splice(i, 1);
        divTeams.splice(i, 1);
        deleteButtons.splice(i, 1);
        editButtons.splice(i, 1);
        localStorage.setItem(`user${loggedUser.userName}`, JSON.stringify(loggedUser));
        sessionStorage.setItem(`loggedUser`, JSON.stringify(loggedUser));
        updateTeams(loggedUser.teams, divYourTeams, divTeams, editButtons,deleteButtons);
    })

    editButtons.push(btnEdi);
    deleteButtons.push(btnDel);
    divTeams.push(divTeam);
    tbYourTeams.appendChild(btnAddTeam);
}

const loadUser = (loggedUser) =>{
    logIn(btnNavLogIn, btnNavUser, loggedUser.userName, nav);
    btnNeedsLogIn.remove();
    loggedUser.teams.forEach(team =>{
        resetTeam(team.chars);
    });

    if(divYourTeams){
        loggedUser.teams.forEach(()=>{
             loadToYourTeams();
        });
        tbYourTeams.append(btnAddTeam);
        updateTeams(loggedUser.teams, divYourTeams, divTeams, editButtons,deleteButtons);
    }
    if(tableBestTeams){
        let teamsToSort = loggedUser.teams.filter(({games})=> games != 0);
        teamsToSort.sort((a, b) => b.wins/b.games - a.wins/a.games);
        let i = 0;
        while (i < 3 && i < teamsToSort.length){
            let teamName = document.getElementById(`tableTeam${i+1}`);
            let winRate = document.getElementById(`winRate${i+1}`);
            let games = document.getElementById(`games${i+1}`);
            teamName.innerText = teamsToSort[i].name;
            winRate.innerText = (teamsToSort[i].wins/teamsToSort[i].games).toFixed(2);
            games.innerText = teamsToSort[i].games;
            i++;
        }
        
        secYourBTeams.append(btnResetStats);
    }
    if(secSelectYourTeam){
        divEnemyStats.remove(); 
        divUserStats.remove();

        loggedUser.teams.forEach((team, ind)=>{
            let artTeam = document.createElement("article");
            artTeam.setAttribute("id", `team${ind}`);
            artTeam.setAttribute("class", "selectTeam");

            artTeam.innerHTML = `
            <h3 id="nameTeam${ind}" class="subMainTitle3">Team1</h3>
            <div id="charsTeam${ind}" class="flexible--row chars">`;
            secSelectYourTeam.appendChild(artTeam);
            const editTeamName = document.getElementById(`nameTeam${ind}`);
            editTeamName.innerText = team.name;

            const divChars = document.getElementById(`charsTeam${ind}`);

            for(let i = 0; i < team.chars.length; i++){
                let divCard = document.createElement("div");
                let {chName, id, atc, def, chHP, spd} = team.chars[i];
                divCard.setAttribute("id", `char${id}Team${ind}`);
                divCard.setAttribute("class", "charCard");

                divCard.innerHTML = `<h4 id="name${id}Team${ind}">${chName}</h4>
                <img id="imgChar" src="../img/tb${id}.jpg" alt="${id}">
                <div id="stats${id}Team${ind}">
                    <p id="attackChar${i}Team${ind}">Attack: ${atc}</p>
                    <p id="defenseChar${i}Team${ind}">Defense: ${def}</p>
                    <p id="healthChar${i}Team${ind}">Health: ${chHP}</p>
                    <p id="speedChar${i}Team${ind}">Speed: ${spd}</p>
                </div>`;

                divChars.append(divCard);
            }

            let btnSel = document.createElement("button");
            setButtonAttributes(btnSel, `btnSelTeam${ind}`, "button2--blue", "Select Team");

            btnSel.addEventListener("click", ()=>{                
                playerTeam = team;
                resetTeam(playerTeam.chars);
    
                let artSelectedTeam = document.querySelector(".selectedTeam");

                if(artSelectedTeam){
                    artSelectedTeam.classList.remove("selectedTeam");
                    let btnSelected = document.getElementById(`btnSelT${artSelectedTeam.getAttribute("id").slice(1)}`);
                    btnSelected.innerText = "Select Team";
                    btnSelected.className = "button2--blue";
                    btnStartBattle.remove();
                }                
                
                artTeam.classList.add("selectedTeam");
                artTeam.appendChild(btnStartBattle);
                btnSel.innerText = "Selected";
                btnSel.className = "button2--green";
            });

            artTeam.appendChild(btnSel);
        });
        secBattle.remove();
    }
}

const updBattleScene = (character, charToSelec, team, name) =>{
    let HPPercentage = Math.ceil(character.curHP*100/character.chHP);
    let span = document.getElementById(`span${name}`);
    let hName = document.getElementById(`name${name}`);
    let progressTot = document.getElementById(`progressTot${name}`);
    let progressHP = document.getElementById(`prog${name}`);
    let progressPrevHP = document.getElementById(`progPrev${name}`); 
    let prevPercentage = progressHP.offsetWidth*100/progressTot.offsetWidth - HPPercentage;

    
    hName.innerText = character.chName;
    (prevPercentage >= 0)? progressPrevHP.style = `width: ${prevPercentage}%;`:progressPrevHP.style = `width: 0%;`;
    progressHP.style = `width: ${HPPercentage}%;`;
    span.innerText = `${HPPercentage}%`;
    

    if(character.modAtc != 0){
        (character.modAtc > 0)?span.innerText += `  -- Atc: x${1 + character.modAtc*0.5}`:span.innerText += `  -- Atc: x${(1/(1 - character.modAtc*0.5)).toFixed(2)}`;
    }

    if(character.modDef != 0){
        (character.modDef > 0)?span.innerText += `  -- Def: x${1 + character.modDef*0.5}`:span.innerText += `  -- Def: x${(1/(1 - character.modDef*0.5)).toFixed(2)}`;
    }

    if(character.modSpd != 0){
        (character.modSpd > 0)?span.innerText += `  -- Spd: x${1 + character.modSpd*0.5}`:span.innerText += `  -- Spd: x${(1/(1 - character.modSpd*0.5)).toFixed(2)}`;
        
    }
    /* if (character.chStatus.desc.trim() != ""){
        document.getElementById(`pStatusDesc${name}`).innerText = `Estado: ${character.chStatus.desc}`;
    } else document.getElementById(`pStatusDesc${name}`).innerText = ""; */
    
    (character.chStatus.desc.trim() != "")? document.getElementById(`pStatusDesc${name}`).innerText = `Estado: ${character.chStatus.desc}`:document.getElementById(`pStatusDesc${name}`).innerText = "";

    document.getElementById(`img${name}`).setAttribute("src", `../img/tb${character.id}.jpg`);

    let divSubtitutes = document.getElementById(`divSubtitutes${name}`);
    divSubtitutes.innerHTML = " ";
    charToSelec = team.filter((char)=> char.curHP > 0 && character != char);
    charToSelec.forEach((char)=>{
        divSubtitutes.innerHTML += `
            <div class="flexible--column">
                <p>${char.chName}</p>
                <div class="progress">
                    <div class="progressBar" style="width: ${Math.ceil(char.curHP*100/char.chHP)}%;></div>
                    <div class="progressBarPrev"></div>
                </div>
            </div>`;
    });
}

const turnStarts = (player, cpu, attP, attC, charToSelecPlayer, charToSelecCpu, playerTeam, cpuTeam, playerChanges, cpuChanges, textareaBattleLog, contTurns, btnSwitch)=>{
    textareaBattleLog.value += `\n\n---------- Turn ${contTurns} ---------`;
    let playFirs = Math.random() > 0.5;

    if (playerChanges || cpuChanges || attP.prio > attC.prio || attP.prio == attC.prio && player.spd > cpu.spd || attP.prio == attC.prio && player.spd == cpu.spd && playFirs){
        if (playerChanges){
            textareaBattleLog.value += `\n\nSe cambió a ${player.chName}`;
        } else {
            if (cpuChanges){
                textareaBattleLog.value += `\n\nSe cambió a ${cpu.chName}! (${Math.ceil(cpu.curHP/cpu.chHP*100)}%)`;
                updBattleScene(cpu, charToSelecCpu, cpuTeam, "Cpu");
            }
            textareaBattleLog.value += "\n\nAtacas primero";
            attacks(player, cpu, attP, textareaBattleLog);
        }
        
        /* if(!cpuChanges){
            if (cpu.curHP > 0){
                attacks(cpu, player, attC, textareaBattleLog);
            } 
        } */
       !cpuChanges && cpu.curHP > 0 && attacks(cpu, player, attC, textareaBattleLog);
        

    } else {
        if(cpuChanges){
            textareaBattleLog.value += `\n\nSe cambió a ${cpu.chName}! (${Math.ceil(cpu.curHP/cpu.chHP*100)}%)`;
            updBattleScene(cpu, charToSelecCpu, cpuTeam, "Cpu");
        } else{
            if (playerChanges){
                textareaBattleLog.value += `\n\nSe cambió a ${player.chName}`;
            }
            textareaBattleLog.value += `\n\nEl rival ataca primero`;
            attacks(cpu, player, attC, textareaBattleLog);
        }       
        /* if(!playerChanges){
            if (player.curHP > 0){
                attacks(player, cpu, attP, textareaBattleLog);
            }                        
        } */
        !playerChanges && player.curHP > 0 && attacks(player, cpu, attP, textareaBattleLog);
    }

    if (player.spd > cpu.spd || player.spd == cpu.spd && playFirs){
        updStatus(player, textareaBattleLog);
        updStatus(cpu, textareaBattleLog); 
    } else {
        updStatus(cpu, textareaBattleLog); 
        updStatus(player, textareaBattleLog);
    }
        

    if(player.curHP < 0){
        player.curHP = 0;
        textareaBattleLog.value += `\n\n${player.chName} se debilitó`;
        btnSwitch.click();
    }
    if (cpu.curHP < 0){
        cpu.curHP = 0;
        textareaBattleLog.value += `\n\n${cpu.chName} se debilitó`;
  
    }

    updBattleScene(player, charToSelecPlayer, playerTeam, "User");
    updBattleScene(cpu, charToSelecCpu, cpuTeam, "Cpu");  

 
    textareaBattleLog.scrollTo(0,textareaBattleLog.scrollHeight);//

}

if(loggedUser){
    loadUser(loggedUser);
} else{
    if(divYourTeams){
        tbYourTeams.append(btnNeedsLogIn);
    } else if(tableBestTeams){
        secYourBTeams.append(btnNeedsLogIn);
    } else if (secSelectYourTeam){
        secSelectYourTeam.append(btnNeedsLogIn);
        secBattle.remove();
    }
}



btnNavLogIn.addEventListener("click", ()=>{
    main.prepend(modalLogSignIn);
    document.getElementById("inputUserName").value = "";
    document.getElementById("inputPass").value = "";
});

btnNeedsLogIn.onclick = ()=>{
    btnNavLogIn.click();
}

btnNavUser.addEventListener("click", ()=>{
    main.prepend(modalLogOut);
})

btnCancelIn.onclick = () => {
    cancel(modalLogSignIn);
}

btnCancelOut.onclick = () =>{
    cancel(modalLogOut);
    sessionStorage.removeItem("loggedUser");
}

btnLogSignIn.addEventListener("click", ()=>{
    let userName = document.getElementById("inputUserName").value;
    let pass = document.getElementById("inputPass").value;
    let signedUser;
    /* while(i < localStorage.length && !exists){
        let key = localStorage.key(i);
        signedUser = JSON.parse(localStorage.getItem(key));
        exists = signedUser.userName == userName;
        i++;
    } */
    signedUser = JSON.parse(localStorage.getItem(`user${userName}`));
    if(userName.trim() != "" && pass != "" && !signedUser){
        signedUser = new User(userName, pass, new Array());
        localStorage.setItem(`user${userName}`, JSON.stringify(signedUser));
        btnCancelIn.click();
        sessionStorage.setItem("loggedUser", JSON.stringify(signedUser));
        loggedUser = signedUser;
        loadUser(loggedUser);
    } else if (signedUser){
        if(signedUser.password == pass){
            btnCancelIn.click();
            sessionStorage.setItem("loggedUser", JSON.stringify(signedUser));
            teams = signedUser.teams;
            loggedUser = signedUser;
            loadUser(loggedUser);
            
        } else alert("Contraseña Incorrecta");
    } else alert("Debe ingresar un nombre o una contraseña");
});

btnLogOut.addEventListener("click", ()=>{
    btnCancelOut.click();
    btnNavUser.remove();
    nav.append(btnNavLogIn);
    if(divYourTeams){
        divYourTeams.innerHTML = " ";
        tbYourTeams.appendChild(btnNeedsLogIn);
        /* if(secBuilder.innerHTML.trim() != ""){
            secBuilder.innerHTML = " ";
        } else btnAddTeam.remove(); */
        (secBuilder.innerHTML.trim() != "")? secBuilder.innerHTML = " ":btnAddTeam.remove();
    }
    if(tableBestTeams){
        secYourBTeams.appendChild(btnNeedsLogIn);
        for(let i = 0; i<3; i++){
            let teamName = document.getElementById(`tableTeam${i+1}`);
            let winRate = document.getElementById(`winRate${i+1}`);
            let games = document.getElementById(`games${i+1}`);
            teamName.innerText = " ------ ";
            winRate.innerText = " ------ ";
            games.innerText = " ------ ";
        }
    }
    if(secSelectYourTeam){
        secSelectYourTeam.innerHTML = " ";
        secBattle.remove();
        main.append(secSelectYourTeam);
        secSelectYourTeam.append(btnNeedsLogIn);
    }
});

btnResetStats.addEventListener("click", ()=>{
    loggedUser.teams.forEach((team)=>{
        team.games = 0;
        team.wins = 0;
    });
    sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    localStorage.setItem(`user${loggedUser.userName}`, JSON.stringify(loggedUser));
    resetBestTeamsTableValues();
});


btnAddTeam.addEventListener("click", ()=>{
    teamCharArray = new Array();
    btnAddTeam.remove();
    secBuilder.innerHTML = `
    <article id="newTeam" class="newTeam" >
        <label for="teamName">TeamName</label><br>
        <input id="newTeamName" type="text" name="teamName" placeholder="New Team">
    </article>`;
    secBuilder.append(btnLightSide);
    secBuilder.append(btnCreate);
    secBuilder.append(btnDarkSide);
    secBuilder.append(artCharSide);
    isEdit = false;
    
    const secNewTeam = document.getElementById("newTeam");
    secNewTeam.append(divNewChars);
    divNewChars.innerHTML = " ";
});

btnLightSide.onclick = ()=>{
    artCharSide.className = "lightSide flexible--rowWrap";
    artCharSide.innerHTML = " ";
    const lightSideCharacters = arrChar.filter((char) => char.side.toUpperCase() == "LIGHT");
    lightSideCharacters.sort((a, b)=> a.chName.localeCompare(b.chName));
    lightSideCharacters.forEach((char)=>{
        artCharSide.innerHTML += `
        <div id="char${char.id}" class="charCard flexible--column">
            <h2 id="name${char.id}" class="tit">${char.chName}</h2>
            <img src="../img/tb${char.id}.jpg" alt="${char.id}">
            <div id="stats${char.id}" class="stats flexible--rowWrap">
                <p id="attack${char.id}">Attack: ${char.atc}</p>
                <p id="defense${char.id}">Defense: ${char.def}</p>
                <p id="health${char.id}">Health: ${char.chHP}</p>
                <p id="speed${char.id}">Speed: ${char.spd}</p>
            </div>
        </div>`
    });
    const charCards = document.querySelectorAll(".charCard");
    charCards.forEach((card)=>{
        card.addEventListener("click", ()=>{
            charSelected = lightSideCharacters.find(({id})=> card.getAttribute("id") == `char${id}`);
            addCharToNewTeam(teamCharArray, charSelected, divNewChars, isEdit, teams);
        });
    });
};

btnDarkSide.onclick = ()=>{
    artCharSide.className = "darkSide flexible--rowWrap";
    artCharSide.innerHTML = " ";
    const darkSideCharacters = arrChar.filter(({side}) => side.toUpperCase() == "DARK");
    darkSideCharacters.sort((a, b)=> a.chName.localeCompare(b.chName));
    darkSideCharacters.forEach(({id, chName, atc, def, chHP, spd})=>{
        artCharSide.innerHTML += `<div id="char${id}" class="charCard flexible--column">
        <h2 id="name${id}" class="tit">${chName}</h2>
        <img src="../img/tb${id}.jpg" alt="${id}">
        <div id="stats${id}" class="stats flexible--rowWrap">
            <p id="attack${id}">Attack: ${atc}</p>
            <p id="defense${id}">Defense: ${def}</p>
            <p id="health${id}">Health: ${chHP}</p>
            <p id="speed${id}">Speed: ${spd}</p>
        </div>`
    });

    

    const charCards = document.querySelectorAll(".charCard");
    charCards.forEach((card)=>{
        card.addEventListener("click", ()=>{
            charSelected = darkSideCharacters.find(({id})=> card.getAttribute("id") == `char${id}`);
            addCharToNewTeam(teamCharArray, charSelected, divNewChars, isEdit, loggedUser.teams);
        });
    });
}

btnCreate.addEventListener("click", ()=>{
    let teamName = document.getElementById("newTeamName").value
    if(loggedUser.teams.length < MAX_TEAMS && teamCharArray.length > 0 && teamName.trim() != ""){
        loggedUser.teams.push(new Team(teamName, teamCharArray.length, teamCharArray, 0, 0));
        
        loadToYourTeams();
        updateTeams(loggedUser.teams, divYourTeams, divTeams, editButtons,deleteButtons);
        localStorage.setItem(`user${loggedUser.userName}`, JSON.stringify(loggedUser));
        sessionStorage.setItem(`loggedUser`, JSON.stringify(loggedUser));
        secBuilder.innerHTML = " ";
    } else alert(`Solo se pueden crear hasta ${MAX_TEAMS} equipos, tienen que tener al menos un integrante y un nombre`);
});

btnStartBattle.addEventListener("click", ()=>{
    loggedUser.teams.find(team => playerTeam.name == team.name).games += 1;
    sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    localStorage.setItem(`user${loggedUser.userName}`, JSON.stringify(loggedUser));
    secSelectYourTeam.remove();
    main.append(secBattle); 
   
    
    textareaBattleLog.value = "";
    contTurns = 0;

    cpuTeam = new Array();
    let nC;
    for(let i = 0; i<3; i++){
        do{
            nC = Math.round(Math.random()*(arrChar.length - 1));
        } while (cpuTeam.some((char) => !arrChar[nC].chName.localeCompare(char.chName)));
        cpu = new Character(arrChar[nC].chHP, arrChar[nC].def, arrChar[nC].atc, arrChar[nC].spd, arrChar[nC].chName, arrChar[nC].id, arrChar[nC].side, arrChar[nC].att1, arrChar[nC].att2);
        cpuTeam.push(cpu);
    }


    player = playerTeam.chars[0];
    cpu = cpuTeam[0];
    attC = null;
    

    charToSelecPlayer = playerTeam.chars.filter((char)=> char.curHP > 0 && player != char);
    charToSelecCpu = cpuTeam.filter((char)=> char.curHP > 0 && cpu != char);

    updBattleScene(player, charToSelecPlayer, playerTeam.chars, "User");
    let divUser = document.getElementById("divUser");
    divUser.append(divAtOptions);
    divAtOptions.append(btnAtt1);
    divAtOptions.append(btnAtt2);
    divAtOptions.append(btnSwitch);
    /* divAtOptions.innerHTML = `
        <button id="btnAtt1" class="button3--blue"><h4>${player.att1.nameAt}</h4><p>${player.att1.sDes}</p></button>
        <button id="btnAtt2" class="button3--blue"><h4>${player.att2.nameAt}</h4><p>${player.att2.sDes}</p></button>
        <button id="btnSwitch" class="button3--blue"><h4>Switch Character</h4></button>`; */
    updBattleScene(cpu, charToSelecCpu, cpuTeam, "Cpu");
    
   btnAtt1.innerHTML = `<h4>${player.att1.nameAt}</h4><p>${player.att1.sDes}</p>`;
   btnAtt2.innerHTML = `<h4>${player.att2.nameAt}</h4><p>${player.att2.sDes}</p>`;
   btnSwitch.innerHTML = `<h4>Switch Character</h4>`;
    
});

btnAtt1.addEventListener("click", ()=>{
    cpuChanges = false;
    contTurns++;
    attC = cpuAction(cpu, cpuTeam, charToSelecCpu);
    if(!attC){
        cpuChanges = true;
        cpu = getNewCharCpu(cpu, charToSelecCpu, cpuTeam);
    }
    attP = parseAtt(player.att1);
    turnStarts(player, cpu, attP, attC, charToSelecPlayer, charToSelecCpu, playerTeam.chars, cpuTeam, false, cpuChanges, textareaBattleLog, contTurns, btnSwitch);
    if(cpu.curHP == 0){
        if(cpuTeam.reduce((hpT, char) => hpT += char.curHP, 0) > 0){
            cpu = getNewCharCpu(cpu, charToSelecCpu, cpuTeam);
            textareaBattleLog.value += `\n\nSe cambió a ${cpu.chName}! (${Math.ceil(cpu.curHP/cpu.chHP*100)}%)`;
            updBattleScene(cpu, charToSelecCpu, cpuTeam, "Cpu");
        } else btnEndBattle.click();
    }
});

btnAtt2.addEventListener("click", ()=>{
    cpuChanges = false;
    contTurns++;
    attC = cpuAction(cpu, cpuTeam, charToSelecCpu);
    if(!attC){
        cpuChanges = true;
        cpu = getNewCharCpu(cpu, charToSelecCpu, cpuTeam);
    }
    attP = parseAtt(player.att2);
    turnStarts(player, cpu, attP, attC, charToSelecPlayer, charToSelecCpu, playerTeam.chars, cpuTeam, false, cpuChanges, textareaBattleLog, contTurns, btnSwitch);
    if(cpu.curHP == 0){
        if(cpuTeam.reduce((hpT, char) => hpT += char.curHP, 0) > 0){
            cpu = getNewCharCpu(cpu, charToSelecCpu, cpuTeam);
            textareaBattleLog.value += `\n\nSe cambió a ${cpu.chName}! (${Math.ceil(cpu.curHP/cpu.chHP*100)}%)`;
            updBattleScene(cpu, charToSelecCpu, cpuTeam, "Cpu");
        } else btnEndBattle.click();
    
       
    }
});

btnSwitch.addEventListener("click", ()=>{
    contTurns++;
    btnsChar = new Array();
    btnAtt1.remove();
    btnAtt2.remove();
    btnSwitch.remove();
    if(playerTeam.chars.reduce((hpT, char) => hpT += char.curHP,0) > 0){
        charToSelecPlayer.forEach((char, ind)=>{
            
            btnsChar.push(document.createElement(`button`))
            //divAtOptions.innerHTML += `<button id="btnChar${ind}" class="button3--blue">${char.chName}</button>`;
            setButtonAttributes(btnsChar[ind],`btnChar${ind}`, "button3--blue", `${char.chName}`);
            divAtOptions.append(btnsChar[ind]);

            /* if(char.chStatus.desc.trim() != ""){
                btnsChar[ind].innerText += ` - Estado: ${char.chStatus.desc}`;
            } */
            char.chStatus.desc.trim() != "" && (btnsChar[ind].innerText += ` - Estado: ${char.chStatus.desc}`);


            btnsChar[ind].addEventListener("click", ()=>{
                cpuChanges = false;
                attC = cpuAction(cpu, cpuTeam, charToSelecCpu);
                if(!attC){
                    cpuChanges = true;
                    cpu = getNewCharCpu(cpu, charToSelecCpu, cpuTeam);
                }
                let playerSwitchedHP = player.curHP;
                player.atc = player.atcBase;
                player.def = player.defBase;
                player.spd = player.spdBase;
                player.modAtc = 0;
                player.modDef = 0;
                player.modSpd = 0;
                player = playerTeam.chars.find((character)=> charToSelecPlayer[ind].chName.toUpperCase() == character.chName.toUpperCase());
                charToSelecPlayer = playerTeam.chars.filter((char)=> char.curHP > 0 && player != char);
                updBattleScene(player, charToSelecPlayer, playerTeam.chars, "User");
                
                if(playerSwitchedHP > 0){
                    turnStarts(player, cpu, null, attC, charToSelecPlayer, charToSelecCpu, playerTeam.chars, cpuTeam, true, cpuChanges, textareaBattleLog, contTurns, btnSwitch);
                    if(cpu.curHP == 0){
                        if(cpuTeam.reduce((hpT, char) => hpT += char.curHP, 0) > 0){
                            cpu = getNewCharCpu(cpu, charToSelecCpu, cpuTeam);
                            textareaBattleLog.value += `\n\nSe cambió a ${cpu.chName}! (${Math.ceil(cpu.curHP/cpu.chHP*100)}%)`;
                        } else btnEndBattle.click();
                        
                    }
                } else {
                    textareaBattleLog.value += `\n\nSe cambió a ${player.chName}`;
                }
                    


                btnCancelSwitch.remove();
                btnsChar.forEach((btn)=>{
                    btn.remove();
                });

                btnAtt1.innerHTML = `<h4>${player.att1.nameAt}</h4><p>${player.att1.sDes}</p>`;
                btnAtt2.innerHTML = `<h4>${player.att2.nameAt}</h4><p>${player.att2.sDes}</p>`;
                divAtOptions.append(btnAtt1);
                divAtOptions.append(btnAtt2);
                divAtOptions.append(btnSwitch);
            });
        });
        /* if(player.curHP > 0){
            divAtOptions.append(btnCancelSwitch);
        } */
        player.curHP > 0 && divAtOptions.append(btnCancelSwitch);
    } else {
        btnEndBattle.click();
    }    
    
});

btnCancelSwitch.addEventListener("click", ()=>{
    btnCancelSwitch.remove();
    let btnChars = document.querySelectorAll(".button3--blue");
    btnChars.forEach((btn)=>{
        btn.remove();
    });
    divAtOptions.append(btnAtt1);
    divAtOptions.append(btnAtt2);
    divAtOptions.append(btnSwitch);
});

if(divEnemyCard){
    divEnemyCard.addEventListener("mouseenter", ()=>{
        divEnemyCard.append(divEnemyStats);
        updateStats(cpu, "Cpu");
    });

    window.addEventListener("scroll", ()=>{
        divEnemyStats.style.top = (document.body.offsetHeight - document.getElementById("footer").offsetHeight - secBattle.offsetHeight + divEnemyCard.offsetHeight - window.scrollY - 5) + "px";
    });// - divEnemyCard.offsetHeight  + 

    divEnemyCard.addEventListener("mouseleave", ()=>{
        divEnemyStats.remove();
    });

    divUserCard.addEventListener("mouseenter", ()=>{
        divUserCard.append(divUserStats);
        divUserStats.style.top = (document.body.offsetHeight - document.getElementById("footer").offsetHeight - divUserCard.offsetHeight - divUserStats.offsetHeight - window.scrollY - 10) + "px";
        updateStats(player, "User");
    });

    window.addEventListener("scroll", ()=>{
        divUserStats.style.top = (document.body.offsetHeight - document.getElementById("footer").offsetHeight - divUserCard.offsetHeight - divUserStats.offsetHeight - window.scrollY - 10) + "px";
    });

    divUserCard.addEventListener("mouseleave", ()=>{
        divUserStats.remove();
    });
}
    


if(btnEndBattle){
    btnEndBattle.addEventListener("click", ()=>{
        btnEndBattle.remove();
        btnAtt1.remove();
        btnAtt2.remove();
        btnSwitch.remove();
        btnsChar && btnsChar.forEach((btn)=>btn.remove());
        btnCancelSwitch.remove();
        divEnemy.append(btnExit);
        let playerTHP = playerTeam.chars.reduce((hpT, char)=> hpT += char.curHP, 0);
        let cpuTHP = cpuTeam.reduce((hpT, char)=> hpT += char.curHP, 0);
        if(playerTHP > 0 && cpuTHP == 0){
            textareaBattleLog.value += `\n\n\ ----- Result ---- \n\n${loggedUser.userName} has won!!!`;
            loggedUser.teams.find(team => playerTeam.name == team.name).wins++;
            sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
            localStorage.setItem(`user${loggedUser.userName}`, JSON.stringify(loggedUser));
        } else if ((playerTHP > 0 && cpuTHP > 0 && confirm("If you leave, you will lose the battle...")) || (playerTHP == 0 && cpuTHP > 0)){
            textareaBattleLog.value += `\n\n\ ----- Result ---- \n\n${loggedUser.userName} has lost...`;
        } else if(cpuTHP == 0){
            textareaBattleLog.value += `\n\n\ ----- Result ---- \n\nIt's a draw!!!`; 
        } else {
            btnExit.remove();
            divAtOptions.append(btnAtt1);
            divAtOptions.append(btnAtt2);
            divAtOptions.append(btnSwitch);
            btnsChar && btnsChar.forEach((btn)=>divAtOptions.append(btn));
            divEnemy.append(btnEndBattle);
        }
        textareaBattleLog.scrollTo(0,textareaBattleLog.scrollHeight);
        
    });
}


btnExit.addEventListener("click", ()=>{
    btnExit.remove();
    divEnemy.append(btnEndBattle);
    resetTeam(playerTeam.chars);
    divAtOptions.remove();
    secBattle.remove();
    main.append(secSelectYourTeam);
});
