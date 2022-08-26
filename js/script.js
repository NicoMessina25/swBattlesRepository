const MAX_TEAMS = 5;
const MAX_CHARACTERS = 3;
const MAX_LASTRESULTS = 3;
const SwalError = Swal.mixin({
    customClass: {
        confirmButton: 'button3--red',
      },
    buttonsStyling: false,
    title: '<h2 class="subMainTitle">ERROR!</h2>',
    color: '#F89595',
    background: '#0a0505',
    icon:`error`,
    iconColor:'#F89595',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
});
const SwalWarning = Swal.mixin({
    customClass: {
        confirmButton: 'button3--blue',
      },
    buttonsStyling: false,
    title: '<h2 class="subMainTitle">Warning!</h2>',
    color: '#92EAFD',
    background: '#0a0505',
    icon:`warning`,
    iconColor:'#92EAFD',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
});       
const SwalConfirm = Swal.mixin({
    customClass: {
        confirmButton: 'button3--green',
        cancelButton: 'button3--red',
      },
    title: '<h2 class="subMainTitle">Are you Sure?</h2>',
    
    buttonsStyling: false,
    icon: 'warning',
    color: '#92EAFD',
    background: '#0a0505',
    iconColor: '#92EAFD',   
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!'
});
const SwalInfoChar = Swal.mixin({
    buttonsStyling: false,
    imageWidth: '50%',
    imageHeight: 'auto',
    background: '#0a0505',
    confirmButtonText: "Nice!",
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
});

class User{
    constructor(userName, password, teams, lastResults){
        this.userName = userName;
        this.password = password;
        this.teams = teams;
        this.lastResults = lastResults;
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
        this.sDes = "Power: " + this.power*10 + " Accu: " + this.prob*100 + "% Priority: +" + this.prio + " (" + this.probSpecEf*100;
        switch (this.special) {
            case 1: 
                this.sDes += "% chance to confuse the enemy)";
                break;    
            case 2: 
                this.sDes += "% chance the enemy loses life each turn)";
                break;
            case 3: 
                this.sDes += "% chance to remove your status)";
                break;
            case 4:
                this.sDes += "% chance to paralyze the enemy)";
                break;
            case 5:
                this.sDes += "% chance to boost your attack)";
                break;
            case 6:
                this.sDes += "% chance to boost your defense)";
                break;
            case 7:
                this.sDes += "% chance to boost your speed)";
                break;
            case 8:
                this.sDes += "% chance to hit 1-4 times)";
                break;
            case 9:
                this.sDes += "% chance to hit 2 times)";
                break;
            case 10:
                this.sDes += "% chance to add up to 50 power to your attack)";
                break;
            case 11:
                this.sDes += "% chance to summon a decoy, but the user loses 25% of his life)";
                break;
            case 12:
                this.sDes += "% chance to heal yourself each turn)";
                break;
            case 13:
                this.sDes += "% chance to heal yourself)";
                break;
            case 14:
                this.sDes += "% chance to take knockback damage)";
                break;
            case 15:
                this.sDes += "% chance to prevent one negative status for the next 3 turns)";
                break;
            case 16:
                this.sDes += "% chance to protect your self from an attack)";
                break;
            case 17:
                this.sDes += "% chance to lower the enemy's attack)";
                break;
            case 18:
                this.sDes += "% chance to lower the enemy's defense)";
                break;
            case 19:
                this.sDes += "% chance to lower the enemy's speed)";
                break;
            default: 
                this.sDes += "";
                break;
        }    
            
    }

    usedAttack(){
        return " used " + this.nameAt;
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
    constructor(name, chars, wins, games){
        this.name = name;
        this.chars = chars;
        this.wins = wins;
        this.games = games;
    }
}

class Result{
    constructor(yourTeam, enemyTeam, isForfeit){
        this.yourTeam = yourTeam;
        this.enemyTeam = enemyTeam;
        this.isForfeit = isForfeit;
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
    } else textareaBattleLog.value += `\n\n${defder.chName} protected from the attack`;       
}


function attacks(attker, defder, att, textareaBattleLog){
    textareaBattleLog.value += `\n\n${attker.chName} ${att.usedAttack()}`;
            if(att.prob >= Math.random()){
                if((attker.chStatus.type != 1 && attker.chStatus.type != 4) || Math.random() > 0.5){
                    lowersHP(defder, att.power, attker.atc, defder.def);
                    specialEffect = att.probSpecEf >= Math.random();
                    if(specialEffect){
                        switch(att.special){
                            case 3: //heals status effect
                                    if(attker.chStatus.type != 0 && attker.chStatus.type != 12){
                                        textareaBattleLog.value += `\n\n${attker.chName} is no longer ${attker.chStatus.desc}`;
                                        attker.chStatus.type = 0;
                                        attker.chStatus.desc = "";
                                    }
                                    break;
                            case 5: //boosts attack
                                if(attker.modAtc < 6){
                                    textareaBattleLog.value += `\n\n${attker.chName} boosted his attack`;
                                    attker.modAtc++;
                                    attker.atc = (attker.modAtc >= 0)? attker.atcBase*(1 + attker.modAtc*0.5): attker.atcBase/(1 - attker.modAtc*0.5);
                                } else textareaBattleLog.value += `\n\n${attker.chName}'s attack is maximum`;
                                break;
                            case 6: //boosts defense
                                if(attker.modDef < 6){
                                    textareaBattleLog.value += `\n\n${attker.chName} boosted his defense`;
                                    attker.modDef++;
                                    attker.def = (attker.modDef >= 0)?attker.defBase*(1 + attker.modDef*0.5):attker.defBase/(1 - attker.modDef*0.5);
                                } else textareaBattleLog.value += `\n\n${attker.chName}'s defense is maximum`;
                                    
                                break;
                            case 7: //boosts speed
                                if(attker.modSpd < 6){
                                    textareaBattleLog.value += `\n\n${attker.chName} boosted his speed`;
                                    attker.modSpd++;
                                    attker.spd = (attker.modSpd >= 0)?attker.spdBase*(1 + attker.modSpd*0.5):attker.spdBase/(1 - attker.modSpd*0.5);
                                } else textareaBattleLog.value += `\n\n${attker.chName}'s speed is maximum`;
                                break;
                            case 8: //1-4 hits
                                hitTimes = 1;
                                while(0.65 > Math.random() && hitTimes < 4){
                                    lowersHP(defder, att.power, attker.atc, defder.def);
                                    hitTimes++;
                                }
                                textareaBattleLog.value += `\n\n${attker.chName} hit ${hitTimes} time/s`;
                                break;
                            case 9: //doble golpe
                                lowersHP(defder, att.power, attker.atc, defder.def);
                                textareaBattleLog.value += `\n\n${attker.chName} hit twice`;
                                break;
                            case 10: //ataques con un daño extra
                                extraPower = Math.random()*5;
                                lowersHP(defder, extraPower, attker.atc, defder.def);
                                textareaBattleLog.value += `\n\n${attker.chName} had ${parseInt(extraPower*10)} extra power`;
                                break;
                            case 11: //sustituto
                                if(attker.sustituteHP <= 0){
                                    if(attker.curHP > attker.chHP*0.25){
                                        attker.curHP -= attker.chHP*0.25;
                                        attker.sustituteHP = attker.chHP*0.25;
                                        attker.chStatus.desc = "decoy";
                                    } else{
                                        textareaBattleLog.value += `\n\n${attker.chName} doesn't have enough life to summon a decoy`;
                                    }
                                } else {
                                    textareaBattleLog.value += `\n\n${attker.chName} has already an active decoy`;
                                }  
                                break;
                            case 12: // healing by turns
                                if (attker.chStatus.type == 0){
                                    attker.chStatus.type = 12;
                                    attker.chStatus.desc = "healed every turn"; 
                                } else {
                                    textareaBattleLog.value += `\n\n${attker.chName} is already ${attker.chStatus.desc}`;
                                }
                                break;
                            case 13: //heals 33%
                                attker.curHP += attker.chHP/3;
                                attker.curHP > attker.chHP && (attker.curHP = attker.chHP);
                                textareaBattleLog.value += `\n\n${attker.chName} healed a 33%`;
                                break;
                            case 14: //knockback damage
                                lowersHP(attker, att.power*0.25, attker.atc, defder.def);
                                textareaBattleLog.value += `\n\n${attker.chName} took knockback damage`;
                                break;
                            case 15: //previene  un estado
                                if(attker.chStatus.type == 0){
                                    attker.chStatus.type = 15;
                                    attker.concenTurns = 3;
                                    attker.chStatus.desc = "focused";
                                    textareaBattleLog.value += `\n\n${attker.chName} is focused`;
                                } else {
                                    textareaBattleLog.value += `\n\n${attker.chName} is already ${attker.chStatus.desc}`;
                                }
                                break;
                            case 16: //protección
                                attker.chStatus.type = 16;
                                attker.chStatus.desc = "protrected";
                                textareaBattleLog.value += `\n\n${attker.chName} is protected`;
                                break;
                            case 17: //baja ataque
                                if(defder.modAtc > -6){
                                    textareaBattleLog.value += `\n\n${attker.chName} lowered ${defder.chName}'s attack`;
                                    defder.modAtc--;
                                    defder.atc = (defder.modAtc >= 0)? defder.atcBase*(1 + defder.modAtc*0.5): defder.atcBase/(1 - defder.modAtc*0.5);
                                } else textareaBattleLog.value += `\n\n${defder.chName}'s attack is the minimum`;
                                break;
                            case 18: //baja defensa
                            if(defder.modDef > -6){
                                textareaBattleLog.value += `\n\n${attker.chName} lowered ${defder.chName}'s defense`;
                                defder.modDef--;
                                defder.def = (defder.modDef >= 0)? defder.defBase*(1 + defder.modDef*0.5):defder.defBase/(1 - defder.modDef*0.5);
                            } else textareaBattleLog.value += `\n\n${defder.chName}'s defense is the minimum`;
                                break;
                            case 19: //baja velocidad
                            if(defder.modSpd > -6){
                                textareaBattleLog.value += `\n\n${attker.chName} lowered ${defder.chName}'s speed`;
                                defder.modSpd--;
                                defder.spd = (defder.modSpd >= 0)? defder.spdBase*(1 + defder.modSpd*0.5): defder.spdBase/(1 - defder.modSpd*0.5);
                            } else textareaBattleLog.value += `\n\n${defder.chName}'s speed is the minimun`;
                                break;
                            default:
                                break; 
                        }
                    } else {
                        switch(att.special){
                            case 8:
                            case 9:
                                textareaBattleLog.value += `\n\n${attker.chName} hit once`;
                                break;
                            default:
                                break;
                        }
                    }
                    if (defder.chStatus.type == 0 || defder.chStatus.type == 12){
                        if(specialEffect){
                            switch (att.special){
                                case 1:
                                    textareaBattleLog.value += `\n\n${defder.chName} is confused!`; 
                                    defder.chStatus.type = 1;
                                    defder.chStatus.desc = "confused";
                                    break;
                                case 2: 
                                    textareaBattleLog.value += `\n\n${defder.chName} loses life every turn`;
                                    defder.chStatus.desc = "strangulated";
                                    defder.chStatus.type = 2;
                                    break;
                                case 4: 
                                    textareaBattleLog.value += `\n\n${defder.chName} is paralyzed`;
                                    defder.chStatus.desc = "paralyzed";
                                    defder.chStatus.type = 4;
                                    break;
                                default:
                                    break;  //los casos 0,3 y 5-16 no dependen de que el enemigo tenga o no un estado  
                            }
                        }
                    } else if(att.special in [1,2,4]){
                        if(defder.chStatus.type == 15){
                            defder.chStatus.type = 0;
                            textareaBattleLog.value += `\n\n${defder.chName} prevented the status effect, however he lost his concentration`;
                        } else {
                            textareaBattleLog.value += `\n\n${defder.chName} is already ${defder.chStatus.desc}. He can't have more than one status effect`;
                        }
                    }
                    
                } else {
                    if(attker.chStatus.type == 1){
                        lowersHP(attker, att.power, attker.atc, attker.def);
                        //attker.curHP -= att.power*attker.atc*(1-attker.def/100);
                        textareaBattleLog.value += `\n\n${attker.chName} hit himself`;
                    } else /* if(defder.chStatus.type == 16){
                        textareaBattleLog.value += `\n\n${attker.chName} protected from the attack`;
                        defder.chStatus.type = 0; 
                    } 
                    else */ {
                        textareaBattleLog.value += `\n\n${attker.chName} paralyzed!`;
                    }
                        
                } 
            }else textareaBattleLog.value += `\n\n${attker.chName} missed...`;
}

function updStatus(char, textareaBattleLog){
    if (char.curHP > 0){
        switch (char.chStatus.type){ //para cuando haya otros status
            case 1: 
                if (Math.random() > 0.5){
                    textareaBattleLog.value += `\n\n${char.chName} broke free from the confusion`;
                    char.chStatus.type = 0;
                    char.chStatus.desc = "";
                } else textareaBattleLog.value += `\n\n${char.chName} is still confused`;
                break;
            case 2: 
                char.curHP -= 0.05*char.chHP;
                textareaBattleLog.value += `\n\n${char.chName} lost life because of the strangulation`;
                break;
            case 12:
                char.curHP += 0.05*char.chHP;
                char.curHP > char.chHP && (char.curHP = char.chHP);
                textareaBattleLog.value += `\n\n${char.chName} healed due to healing every turn`;
                break;
            case 15:
                char.concenTurns--;
                if (char.concenTurns == 0){
                    char.chStatus.type = 0;
                    char.chStatus.desc = "";
                    textareaBattleLog.value += `\n\n${char.chName} lost his focusing`;
                }
                break;
            case 16:
                char.chStatus.type = 0;
                char.chStatus.desc = "";
                textareaBattleLog.value += `\n\n${char.chName} is no longer protected`;
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
        divCard.className = "charCard flexible--column";
        divCard.innerHTML = `
        <h4 id="name${charSelected.id}Team${ind}">${charSelected.chName}</h4>
        <img id="imgChar" src="../img/tb${charSelected.id}.jpg" alt="${charSelected.id}">
        <div id="stats${charSelected.id}Team${ind}" class="stats flexible--column">
            <p id="attackChar${teamCharArray.length}Team${ind}"><i class="fa-solid fa-hand-fist"></i> Attack: ${charSelected.atc}</p>
            <p id="defenseChar${teamCharArray.length}Team${ind}"><i class="fa-solid fa-shield-halved"></i> Defense: ${charSelected.def}</p>
            <p id="healthChar${teamCharArray.length}Team${ind}"><i class="fa-solid fa-heart"></i> Health: ${charSelected.chHP}</p>
            <p id="speedChar${teamCharArray.length}Team${ind}"><i class="fa-solid fa-person-running"></i> Speed: ${charSelected.spd}</p>
        </div>`
        divNewChars.append(divCard);
        let btnDel = document.createElement("button");
        setButtonAttributes(btnDel, `char${charSelected.id}Team${ind}`, "button2--purple", "Delete ");
        btnDel.innerHTML += `<i class="fa-solid fa-trash"></i>`;
        btnDel.onclick = () => {
            teamCharArray.splice(teamCharArray.indexOf(teamCharArray.find((char) => `char${char.id}Team${ind}` == divCard.getAttribute("id"))), 1);
            divCard.remove();
            
        }
        divCard.append(btnDel);
        Toastify({
            text: `${charSelected.chName} added to the team, click to see it!`,
            duration: 3000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            className: "text--center",
            style: {
                color: "#0a0505",
                background: "linear-gradient(to right, #F7D0FE, #df3bfa)",
            },
            onClick: function(){
                window.scrollTo(0, document.body.offsetHeight - secBuilder.offsetHeight - document.getElementById("footer").offsetHeight);
            }
        }).showToast();
        
    } else SwalError.fire({
        html: `<p class="text--center">${MAX_CHARACTERS} is the maximum capacity for each team and you can't repeat</p>`,
        position: 'top',
        width: '100%',
        confirmButtonText: 'Close',
      });
}

function genHTMLTeamChars(team, ind){
    let htmlTeamChars = " ";
    team.chars.forEach((char, indChar) => {
        htmlTeamChars += `<div id="char${char.id}Team${ind}" class="charCard flexible--column">
        <h4 id="name${char.id}Team${ind}">${char.chName}</h4>
        <img id="imgChar" src="../img/tb${char.id}.jpg" alt="${char.id}">
        <div id="stats${char.id}Team${ind}" class="stats flexible--column">
            <p id="attackChar${indChar}Team${ind}"><i class="fa-solid fa-hand-fist"></i> Attack: ${char.atc}</p>
            <p id="defenseChar${indChar}Team${ind}"><i class="fa-solid fa-shield-halved"></i> Defense: ${char.def}</p>
            <p id="healthChar${indChar}Team${ind}"><i class="fa-solid fa-heart"></i> Health: ${char.chHP}</p>
            <p id="speedChar${indChar}Team${ind}"><i class="fa-solid fa-person-running"></i> Speed: ${char.spd}</p>
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
            divCard.setAttribute("class", "charCard flexible--column");
            divCard.innerHTML = `<h4 id="name${id}Team${ind}">${chName}</h4>
            <img id="imgChar" src="../img/tb${id}.jpg" alt="${id}">
            <div id="stats${id}Team${ind}" class="stats flexible--column">
                <p id="attackChar${indChar}Team${ind}"><i class="fa-solid fa-hand-fist"></i> Attack: ${atc}</p>
                <p id="defenseChar${indChar}Team${ind}"><i class="fa-solid fa-shield-halved"></i> Defense: ${def}</p>
                <p id="healthChar${indChar}Team${ind}"><i class="fa-solid fa-heart"></i> Health: ${chHP}</p>
                <p id="speedChar${indChar}Team${ind}"><i class="fa-solid fa-person-running"></i> Speed: ${spd}</p>
            </div>`;
            
            divChars.append(divCard);
        })
        divTeams[ind].append(divChars);
        divTeams[ind].append(editButtons[ind]);
        divTeams[ind].append(deleteButtons[ind]);
        divYourTeams.append(divTeams[ind]);
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
    return new Attack(att.nameAt, parseFloat(att.power), parseFloat(att.prio), parseFloat(att.special), parseFloat(att.prob), parseFloat(att.probSpecEf));
}

function parseChar(char){
    return new Character(parseFloat(char.hp), parseFloat(char.def), parseFloat(char.atc), parseFloat(char.spd), char.name, char.id, char.side, parseAtt(char.att1), parseAtt(char.att2));
}

function cpuAction(cpu, cpuTeam, charToSelecCpu){
    charToSelecCpu = cpuTeam.filter((char)=> char.curHP > 0 && cpu != char);
    atOp = (charToSelecCpu.length > 0)? Math.round(Math.random()*4 + 1):Math.round(Math.random()*3 + 1);

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
    let spanHP = document.getElementById(`spanHP${name}`);
    let spanAtc = document.getElementById(`spanAtc${name}`);
    let spanDef = document.getElementById(`spanDef${name}`);
    let spanSpd = document.getElementById(`spanSpd${name}`);
    let spanCurHP = document.getElementById(`spanCurHP${name}`);
    let spanModAtc = document.getElementById(`spanModAtc${name}`);
    let spanModDef = document.getElementById(`spanModDef${name}`);
    let spanModSpd = document.getElementById(`spanModSpd${name}`);
    let hAtt1Name = document.getElementById(`nameAtt1${name}`);
    let pAtt1Desc = document.getElementById(`descAtt1${name}`);
    let hAtt2Name = document.getElementById(`nameAtt2${name}`);
    let pAtt2Desc = document.getElementById(`descAtt2${name}`);

    spanHP.innerText = character.chHP.toFixed(2);
    spanAtc.innerText = character.atcBase.toFixed(2);
    spanDef.innerText = character.defBase.toFixed(2);
    spanSpd.innerText = character.spdBase.toFixed(2);
    spanCurHP.innerText = character.curHP.toFixed(2);
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

function saveData(loggedUser){
    sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    localStorage.setItem(`user${loggedUser.userName}`, JSON.stringify(loggedUser));
}

async function loadCharacters(arrChar){
    const response = await fetch("../js/characters.json");
    const chars = await response.json();
    chars.forEach((char)=>{
        arrChar.push(parseChar(char));
    });
}

function updateChars(chars, arrChar){
    chars.forEach((char)=>{
        let updatedChar = arrChar.find((character)=> character.id == char.id);
        char.chHP = updatedChar.chHP;
        char.curHP = updatedChar.curHP;
        char.atc = updatedChar.atc;
        char.atcBase = updatedChar.atcBase;
        char.def = updatedChar.def;
        char.defBase = updatedChar.defBase;
        char.spd = updatedChar.spd;
        char.spdBase = updatedChar.spdBase;
        char.att1 = updatedChar.att1;
        char.att2 = updatedChar.att2;
    });
    console.log(chars);
}

const tableBestTeams = document.getElementById("tableBestTeams");
const btnAddTeam = document.createElement("button");
setButtonAttributes(btnAddTeam, "btnAddTeam", "button2--green", "Add Team ");
btnAddTeam.innerHTML += `<i class="fa-solid fa-plus"></i>`;
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
setButtonAttributes(btnLightSide, "btnLightSide", "button2--blue", "Light Side ");
btnLightSide.innerHTML += `<i class="fa-solid fa-jedi"></i>`;
const btnDarkSide = document.createElement("button");
setButtonAttributes(btnDarkSide, "btnDarkSide", "button2--red", "Dark Side ");
btnDarkSide.innerHTML += `<i class="fa-brands fa-sith"></i>`;
const btnCreate = document.createElement("button");
setButtonAttributes(btnCreate, "btnCreate", "button2--purple", "Create ");
btnCreate.innerHTML += `<i class="fa-solid fa-circle-up"></i>`;
const artCharSide = document.createElement("article");
artCharSide.setAttribute("id", "charSide");
const divNewChars = document.createElement("div");
divNewChars.setAttribute("id", "newChars");
divNewChars.setAttribute("class", "flexible--row chars");
const btnStartBattle = document.createElement("button");
setButtonAttributes(btnStartBattle, "btnStart", "button--green", "Battle!! "); 
btnStartBattle.innerHTML += `<i class="fa-solid fa-play"></i>`;
const secBattle = document.getElementById("secBattle");
const btnExit = document.createElement("button");
setButtonAttributes(btnExit, "btnExit", "button--purple", "Exit");
const btnCancelSwitch = document.createElement("button");
setButtonAttributes(btnCancelSwitch, "btnCancelSwitch", "button3--red", "Cancel ");
btnCancelSwitch.innerHTML += `<i class="fa-solid fa-arrow-left"></i>`;
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
setButtonAttributes(btnResetStats, "btnResetStats", "button2--red", "Reset Statistics");
const divEnemyStats = document.getElementById("enemyStats");

const divUserStats = document.getElementById("userStats");

let arrChar;
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



let battleInCourse;
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
    setButtonAttributes(btnEdi, ``, "button2--green", "Edit Team ");
    btnEdi.innerHTML += `<i class="fa-solid fa-pencil"></i>`;
    let btnDel = document.createElement("button");
    setButtonAttributes(btnDel, "", "button2--red", "Delete Team ");
    btnDel.innerHTML += `<i class="fa-solid fa-xmark"></i>`;

    btnEdi.addEventListener("click", ()=>{
        if(secBuilder.innerHTML.trim() == ""){
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
                divCard.className = "charCard flexible--column";

                divCard.innerHTML = `<h4 id="name${id}Team${ind}">${chName}</h4>
                <img id="imgChar" src="../img/tb${id}.jpg" alt="${id}">
                <div id="stats${id}Team${ind}" class="stats flexible--column">
                    <p id="attackChar${i}Team${ind}"><i class="fa-solid fa-hand-fist"></i> Attack: ${atc}</p>
                    <p id="defenseChar${i}Team${ind}"><i class="fa-solid fa-shield-halved"></i> Defense: ${def}</p>
                    <p id="healthChar${i}Team${ind}"><i class="fa-solid fa-heart"></i> Health: ${chHP}</p>
                    <p id="speedChar${i}Team${ind}"><i class="fa-solid fa-person-running"></i> Speed: ${spd}</p>
                </div>`;
                let btnDel = document.createElement("button");
                setButtonAttributes(btnDel, ``, "button2--purple", "Delete ");
                btnDel.innerHTML += `<i class="fa-solid fa-trash"></i>`;
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
            
            let btnConfirm = document.createElement("button");
            setButtonAttributes(btnConfirm, "btnConfirm", "button2--purple", "Confirm ");
            btnConfirm.innerHTML += `<i class="fa-solid fa-circle-check"></i>`;

            btnConfirm.addEventListener("click", ()=>{
                if(teamCharArray.length > 0 && editTeamName.value.trim() != ""){
                    loggedUser.teams[ind].name = editTeamName.value;
                    updateTeams(loggedUser.teams, divYourTeams, divTeams, editButtons, deleteButtons);
                    localStorage.setItem(`user${loggedUser.userName}`, JSON.stringify(loggedUser));
                    sessionStorage.setItem(`loggedUser`, JSON.stringify(loggedUser));
                    secBuilder.innerHTML = " ";
                    tbYourTeams.appendChild(btnAddTeam);

                    Toastify({
                        text: `"${editTeamName.value}" team was successfully edited!`,
                        duration: 3000,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: false,
                        className: "userOp",
                        style: {
                          color: "#0a0505",
                          background: "linear-gradient(to right, #9BF5AE, #17e040)",
                        },
                      }).showToast();

                } else SwalWarning.fire({
                    html: '<p class="text--center">Your team must have at least 1 character and a team name</p>',
                    confirmButtonText: 'Close',
                  });                    
            });
            secBuilder.append(btnConfirm);
            secBuilder.append(btnDarkSide);
            artCharSide.innerHTML = " ";
            secBuilder.append(artCharSide);
            secNewTeam.append(divNewChars);
            window.scrollTo(0, document.body.offsetHeight - document.getElementById("footer").offsetHeight - secBuilder.offsetHeight);    
        } else SwalConfirm.fire({
            html: "<p class='text--center'>You will lose the team you are editing!</p>",
        }).then((result) => {
                if(result.isConfirmed){
                    secBuilder.innerHTML = "";
                    btnEdi.click();
                }
            }); 
    });

    btnDel.addEventListener("click", ()=>{
        SwalConfirm.fire({
            html: "<p class='text--center'>You won't be able to revert this!</p>",
        }).then((result) => {
            if (result.isConfirmed) {
                let i = divTeams.indexOf(divTeam);
                loggedUser.teams.splice(i, 1);
                divTeams.splice(i, 1);
                deleteButtons.splice(i, 1);
                editButtons.splice(i, 1);
                localStorage.setItem(`user${loggedUser.userName}`, JSON.stringify(loggedUser));
                sessionStorage.setItem(`loggedUser`, JSON.stringify(loggedUser));
                updateTeams(loggedUser.teams, divYourTeams, divTeams, editButtons,deleteButtons);
            }
          })
            
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
        arrChar = new Array();
        loadCharacters(arrChar).then(()=>{
            loggedUser.teams.forEach(team =>{
                updateChars(team.chars, arrChar);
            });
            localStorage.setItem(`user${loggedUser.userName}`, JSON.stringify(loggedUser));
            sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));

            loggedUser.teams.forEach(()=>{
                loadToYourTeams();
            });
            tbYourTeams.append(btnAddTeam);
            updateTeams(loggedUser.teams, divYourTeams, divTeams, editButtons,deleteButtons);
        });
        
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

        for(let i = 0; i < loggedUser.lastResults.length; i++){
            let result = document.getElementById(`result${i+1}`);
            let tableYourTeam = document.getElementById(`yourTeam${i+1}`);
            let tableEnemyTeam = document.getElementById(`enemyTeam${i+1}`);
            let yourTeam = loggedUser.lastResults[i].yourTeam;
            let enemyTeam = loggedUser.lastResults[i].enemyTeam;
            let yourCharsAlive = parseInt(yourTeam.chars.reduce((charsAlive, {curHP})=> charsAlive += (curHP > 0)? 1:0, 0));
            let enemyCharsAlive = parseInt(enemyTeam.reduce((charsAlive, {curHP})=> charsAlive += (curHP > 0)? 1:0, 0));
            tableEnemyTeam.innerText = "";
            tableYourTeam.innerText = "";


            result.innerText = `${yourCharsAlive} - ${enemyCharsAlive}`;
            if (yourCharsAlive > enemyCharsAlive){
                result.className = "win";
            } else if (yourCharsAlive < enemyCharsAlive || loggedUser.lastResults[i].isForfeit){
                result.className = "lose";
            }
            
            yourTeam.chars.forEach(({chName}, ind)=>{
                ind != 0 && (tableYourTeam.innerText += " /");
                tableYourTeam.innerText += ` ${chName}`;
            });

            enemyTeam.forEach(({chName}, ind)=>{
                ind != 0 && (tableEnemyTeam.innerText += " /");
                tableEnemyTeam.innerText += ` ${chName}`;
            });
        }
        
    }
    if(secSelectYourTeam){
        arrChar = new Array();
        loadCharacters(arrChar).then(()=>{
            loggedUser.teams.forEach(team =>{
                updateChars(team.chars, arrChar);
            });
            localStorage.setItem(`user${loggedUser.userName}`, JSON.stringify(loggedUser));
            sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));

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
                    divCard.className = "charCard flexible--column";

                    divCard.innerHTML = `<h4 id="name${id}Team${ind}">${chName}</h4>
                    <img id="imgChar" src="../img/tb${id}.jpg" alt="${id}">
                    <div id="stats${id}Team${ind}" class="stats flexible--column">
                        <p id="attackChar${i}Team${ind}"><i class="fa-solid fa-hand-fist"></i> Attack: ${atc}</p>
                        <p id="defenseChar${i}Team${ind}"><i class="fa-solid fa-shield-halved"></i> Defense: ${def}</p>
                        <p id="healthChar${i}Team${ind}"><i class="fa-solid fa-heart"></i> Health: ${chHP}</p>
                        <p id="speedChar${i}Team${ind}"><i class="fa-solid fa-person-running"></i> Speed: ${spd}</p>
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
        });
        document.getElementById("home").addEventListener("click",(e)=>{
            if(battleInCourse){
                e.preventDefault();
                SwalConfirm.fire({
                    html: "<p class='text--center'>If you leave, you will lose the battle...</p>",
                    confirmButtonText: "Yes, i want this to end right now!",
                    cancelButtonText: "I have a bad feeling about this...",
                }).then((result) => {
                    if(result.isConfirmed){
                        battleInCourse = false;
                        MAX_LASTRESULTS && loggedUser.lastResults.pop();
                        loggedUser.lastResults.unshift(new Result(playerTeam, cpuTeam, true));
                        saveData(loggedUser);
                        document.getElementById("home").click();
                    } 
                })
            }          
        });

        document.getElementById("lore").addEventListener("click", (e)=>{
            if(battleInCourse){
                e.preventDefault();
                SwalConfirm.fire({
                    html: "<p class='text--center'>If you leave, you will lose the battle...</p>",
                    confirmButtonText: "Yes, i want this to end right now!",
                    cancelButtonText: "I have a bad feeling about this...",
                }).then((result) => {
                    if(result.isConfirmed){
                        battleInCourse = false;
                        MAX_LASTRESULTS && loggedUser.lastResults.pop();
                        loggedUser.lastResults.unshift(new Result(playerTeam, cpuTeam, true));
                        saveData(loggedUser);
                        document.getElementById("lore").click();
                    } 
                })
            }
        });

        document.getElementById("teamBuilder").addEventListener("click", (e)=>{
            if(battleInCourse){
                e.preventDefault();
                SwalConfirm.fire({
                    html: "<p class='text--center'>If you leave, you will lose the battle...</p>",
                    confirmButtonText: "Yes, i want this to end right now!",
                    cancelButtonText: "I have a bad feeling about this...",
                }).then((result) => {
                    if(result.isConfirmed){
                        battleInCourse = false;
                        MAX_LASTRESULTS && loggedUser.lastResults.pop();
                        loggedUser.lastResults.unshift(new Result(playerTeam, cpuTeam, true));
                        saveData(loggedUser);
                        document.getElementById("teamBuilder").click();
                    } 
                })
            }
        });

        divEnemyStats.remove(); 
        divUserStats.remove();
        secSelectYourTeam.innerHTML = (loggedUser.teams.length == 0)? "<div class='text--justify'> You don't have any teams...</div>":"";
        
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
    progressPrevHP.style = (prevPercentage >= 0)? `width: ${prevPercentage}%;`:`width: 0%;`;
    progressHP.style = `width: ${HPPercentage}%;`;
    span.innerHTML = `<i class="fa-solid fa-heart"></i> ${HPPercentage}%`;
    

    if(character.modAtc != 0){
        span.innerHTML += (character.modAtc > 0)? `  -- <i class="fa-solid fa-hand-fist"></i> x${1 + character.modAtc*0.5}`:`  -- <i class="fa-solid fa-hand-fist"></i> x${(1/(1 - character.modAtc*0.5)).toFixed(2)}`;
    }

    if(character.modDef != 0){
        span.innerHTML += (character.modDef > 0)?`  -- <i class="fa-solid fa-shield-halved"></i> x${1 + character.modDef*0.5}`:`  -- <i class="fa-solid fa-shield-halved"></i> x${(1/(1 - character.modDef*0.5)).toFixed(2)}`;
    }

    if(character.modSpd != 0){
        span.innerHTML += (character.modSpd > 0)?`  -- <i class="fa-solid fa-person-running"></i> x${1 + character.modSpd*0.5}`:`  -- <i class="fa-solid fa-person-running"></i> x${(1/(1 - character.modSpd*0.5)).toFixed(2)}`;
        
    }    
    document.getElementById(`pStatusDesc${name}`).innerText = (character.chStatus.desc.trim() != "")? `Estado: ${character.chStatus.desc}`:"";

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

 
    textareaBattleLog.scrollTo(0,textareaBattleLog.scrollHeight);

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
}

btnLogSignIn.addEventListener("click", ()=>{
    let userName = document.getElementById("inputUserName").value;
    let pass = document.getElementById("inputPass").value;
    let signedUser;

    signedUser = JSON.parse(localStorage.getItem(`user${userName}`)) || false;
    if(userName.trim() != "" && pass != "" && !signedUser){
        signedUser = new User(userName, pass, new Array(),  new Array());
        localStorage.setItem(`user${userName}`, JSON.stringify(signedUser));
        btnCancelIn.click();
        sessionStorage.setItem("loggedUser", JSON.stringify(signedUser));
        loggedUser = signedUser;
        loadUser(loggedUser);
        Toastify({
            text: `${loggedUser.userName}! Successful sign up! Welcome to Star Wars Battles!!`,
            duration: 2000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            className: "userOp",
            style: {
              color: "#0a0505",
              background: "linear-gradient(to right, #9BF5AE, #17e040)",
            },
          }).showToast();
    } else if (signedUser){
        if(signedUser.password == pass){
            btnCancelIn.click();
            sessionStorage.setItem("loggedUser", JSON.stringify(signedUser));
            teams = signedUser.teams;
            loggedUser = signedUser;
            loadUser(loggedUser);
            Toastify({
                text: `Successful log in! Welcome ${loggedUser.userName}`,
                duration: 2000,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: false,// Prevents dismissing of toast on hover
                className: "userOp",
                style: {
                  color: "#0a0505",
                  background: "linear-gradient(to right, #9BF5AE, #17e040)",
                },
              }).showToast();
        } else SwalError.fire({
            html: `<p class="text--center">Incorrect Password</p>`,
            confirmButtonText: 'Try Again'
          });
    } else SwalWarning.fire({
        html:'<p class="text--center">You must enter your name and password</p>',
        confirmButtonText: 'Try Again',
      });
});

btnLogOut.addEventListener("click", ()=>{
    btnCancelOut.click();
    sessionStorage.removeItem("loggedUser");
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
        btnResetStats.remove();
        for(let i = 0; i<3; i++){
            let teamName = document.getElementById(`tableTeam${i+1}`);
            let winRate = document.getElementById(`winRate${i+1}`);
            let games = document.getElementById(`games${i+1}`);
            teamName.innerText = " ------ ";
            winRate.innerText = " ------ ";
            games.innerText = " ------ ";
        }
        for(let i = 0; i<MAX_LASTRESULTS; i++){
            let result = document.getElementById(`result${i+1}`);
            let tableYourTeam = document.getElementById(`yourTeam${i+1}`);
            let tableEnemyTeam = document.getElementById(`enemyTeam${i+1}`);
            result.innerText = " ------ ";
            result.className = "result";
            tableYourTeam.innerText = " ------ ";
            tableEnemyTeam.innerText = " ------ ";
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
    SwalConfirm.fire({
        html: "<p class='text--center'>You won't get them back again</p>",
        confirmButtonText: "Yes, delete them forever!",
        cancelButtonText: "Maybe I should stay with them",
    }).then(result => {
        if(result.isConfirmed){
            loggedUser.teams.forEach((team)=>{
                team.games = 0;
                team.wins = 0;
            });
            sessionStorage.setItem("loggedUser", JSON.stringify(loggedUser));
            localStorage.setItem(`user${loggedUser.userName}`, JSON.stringify(loggedUser));
            resetBestTeamsTableValues();
            Toastify({
                text: `Your stats are successfully gone!`,
                duration: 3000,
                gravity: "top",
                position: "right", 
                className: "userOp",
                style: {
                    color: "#0a0505",
                    background: "linear-gradient(to right, #9BF5AE, #17e040)",
                },
            }).showToast();
        } else {
            Toastify({
                text: `Your stats are safe`,
                duration: 2000,
                gravity: "top", 
                position: "right", 
                className: "text--center",
                style: {
                    color: "#0a0505",
                    background: "linear-gradient(to right, #92EAFD, #04c8f2)",
                },
            }).showToast();
        }
    })
    
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
            <div id="stats${char.id}" class="stats flexible--column">
                <p id="attack${char.id}"><i class="fa-solid fa-hand-fist"></i> Attack: ${char.atc}</p>
                <p id="defense${char.id}"><i class="fa-solid fa-shield-halved"></i> Defense: ${char.def}</p>
                <p id="health${char.id}"><i class="fa-solid fa-heart"></i> Health: ${char.chHP}</p>
                <p id="speed${char.id}"><i class="fa-solid fa-person-running"></i> Speed: ${char.spd}</p>
            </div>
        </div>`
    });
    const charCards = artCharSide.querySelectorAll(".charCard");
    charCards.forEach((card, ind)=>{
        let btnAttsInfo = document.createElement("button");
        setButtonAttributes(btnAttsInfo, `btnAttInfo${ind}`, "button2--blue", "Attacks");
        let btnAddCharToTeam = document.createElement("button");
        setButtonAttributes(btnAddCharToTeam, `btnAddChar${ind}`, "button2--blue", "Add to the Team");
        let charSelected;

        btnAddCharToTeam.addEventListener("click", ()=>{
            charSelected = lightSideCharacters.find(({id})=> card.getAttribute("id") == `char${id}`);
            addCharToNewTeam(teamCharArray, charSelected, divNewChars, isEdit, teams);
        });

        btnAttsInfo.addEventListener("click", ()=>{
            charSelected = lightSideCharacters.find(({id})=> card.getAttribute("id") == `char${id}`);
            SwalInfoChar.fire({
                customClass: {
                    confirmButton: 'button3--blue',
                  },
                title: `<h2 class="subMainTitle">${charSelected.chName}</h2>`,
                html: `<h4 class="text--center">"${charSelected.att1.nameAt}"</h4><p class="text--center">${charSelected.att1.sDes}</p>
                        <h4 class="text--center">"${charSelected.att2.nameAt}"</h4><p class="text--center">${charSelected.att2.sDes}</p>`,
                imageUrl: `../img/tb${charSelected.id}.jpg`,
                imageAlt: `info${charSelected.id}`,
                color: '#92EAFD',
            });
        });

        card.append(btnAddCharToTeam);
        card.append(btnAttsInfo);
        
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
        <div id="stats${id}" class="stats flexible--column">
            <p id="attack${id}"><i class="fa-solid fa-hand-fist"></i> Attack: ${atc}</p>
            <p id="defense${id}"><i class="fa-solid fa-shield-halved"></i> Defense: ${def}</p>
            <p id="health${id}"><i class="fa-solid fa-heart"></i> Health: ${chHP}</p>
            <p id="speed${id}"><i class="fa-solid fa-person-running"></i> Speed: ${spd}</p>
        </div>`
    });

    

    const charCards = artCharSide.querySelectorAll(".charCard");
    charCards.forEach((card, ind)=>{
        let btnAttsInfo = document.createElement("button");
        setButtonAttributes(btnAttsInfo, `btnAttInfo${ind}`, "button2--red", "Attacks");
        let btnAddCharToTeam = document.createElement("button");
        setButtonAttributes(btnAddCharToTeam, `btnAddChar${ind}`, "button2--red", "Add to the Team");
        let charSelected;

        btnAddCharToTeam.addEventListener("click", ()=>{
            charSelected = darkSideCharacters.find(({id})=> card.getAttribute("id") == `char${id}`)
            addCharToNewTeam(teamCharArray, charSelected, divNewChars, isEdit, loggedUser.teams);
        })

        btnAttsInfo.addEventListener("click", ()=>{
            charSelected = darkSideCharacters.find(({id})=> card.getAttribute("id") == `char${id}`);
            SwalInfoChar.fire({
                customClass: {
                    confirmButton: 'button3--red',
                  },
                title: `<h2 class="subMainTitle">${charSelected.chName}</h2>`,
                html: `<h4 class="text--center">"${charSelected.att1.nameAt}"</h4><p class="text--center">${charSelected.att1.sDes}</p>
                        <h4 class="text--center">"${charSelected.att2.nameAt}"</h4><p class="text--center">${charSelected.att2.sDes}</p>`,
                imageUrl: `../img/tb${charSelected.id}.jpg`,
                imageAlt: `info${charSelected.id}`,
                color: '#F89595',
            });
        });

        card.append(btnAddCharToTeam);
        card.append(btnAttsInfo);
        
    });
}

btnCreate.addEventListener("click", ()=>{
    let teamName = document.getElementById("newTeamName").value
    if(loggedUser.teams.length < MAX_TEAMS && teamCharArray.length > 0 && teamName.trim() != ""){
        loggedUser.teams.push(new Team(teamName, teamCharArray, 0, 0));
        
        loadToYourTeams();
        updateTeams(loggedUser.teams, divYourTeams, divTeams, editButtons,deleteButtons);
        localStorage.setItem(`user${loggedUser.userName}`, JSON.stringify(loggedUser));
        sessionStorage.setItem(`loggedUser`, JSON.stringify(loggedUser));
        secBuilder.innerHTML = " ";

        Toastify({
            text: `"${teamName}" team was successfully created!`,
            duration: 3000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: false,
            className: "userOp",
            style: {
              color: "#0a0505",
              background: "linear-gradient(to right, #9BF5AE, #17e040)",
            },
          }).showToast();

    } else SwalError.fire({  
        html: `<p class="text--center">${MAX_TEAMS} teams is the maximum capacity for each user, it must have at least 1 character and a team name</p>`,
        position: 'top',
        confirmButtonText: 'Close',
      });
});

btnStartBattle.addEventListener("click", ()=>{
    battleInCourse = true;
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
   btnSwitch.innerHTML = `<h4>Switch Character</h4><i class="fa-solid fa-repeat"></i>`;
    
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
    }); 

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
        battleInCourse = false;
        btnEndBattle.remove();
        btnAtt1.remove();
        btnAtt2.remove();
        btnSwitch.remove();
        btnsChar && btnsChar.forEach((btn)=>btn.remove());
        btnCancelSwitch.remove();
        divEnemy.append(btnExit);
        let playerTHP = playerTeam.chars.reduce((hpT, char)=> hpT += char.curHP, 0);
        let cpuTHP = cpuTeam.reduce((hpT, char)=> hpT += char.curHP, 0);
        loggedUser.lastResults.length == MAX_LASTRESULTS && loggedUser.lastResults.pop();
        loggedUser.lastResults.unshift(new Result(playerTeam, cpuTeam, false));
        if(playerTHP > 0 && cpuTHP == 0){
            textareaBattleLog.value += `\n\n\ ----- Result ---- \n\n${loggedUser.userName} has won!!!`;
            loggedUser.teams.find(team => playerTeam.name == team.name).wins++;
            saveData(loggedUser);
        } else if (playerTHP >= 0 && cpuTHP > 0){
            if(playerTHP > 0){
                SwalConfirm.fire({
                    html: "<p class='text--center'>If you leave, you will lose the battle...</p>",
                    confirmButtonText: "Yes, i want this to end right now!",
                    cancelButtonText: "I have a bad feeling about this...",
                }).then((result)=>{
                    if(result.isConfirmed){
                        loggedUser.lastResults[0].isForfeit = playerTHP > 0;
                        saveData(loggedUser);
                        textareaBattleLog.value += `\n\n\ ----- Result ---- \n\n${loggedUser.userName} has lost...`;
                    } else{
                        btnExit.remove();
                        battleInCourse = true;
                        divAtOptions.append(btnAtt1);
                        divAtOptions.append(btnAtt2);
                        divAtOptions.append(btnSwitch);
                        btnsChar && btnsChar.forEach((btn)=>divAtOptions.append(btn));
                        divEnemy.append(btnEndBattle);
                    }
                });
            } else {
                loggedUser.lastResults[0].isForfeit = playerTHP > 0;
                saveData(loggedUser);
                textareaBattleLog.value += `\n\n\ ----- Result ---- \n\n${loggedUser.userName} has lost...`;
            }
            
        } else {
            saveData(loggedUser);
            textareaBattleLog.value += `\n\n\ ----- Result ---- \n\nIt's a draw!!!`; 
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
