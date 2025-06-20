import { Team } from './Pokemon.js'

function addUpdateTeamsList(pair, teamsList){
  if(teamsList.length == 0){
    //console.log('First Pair Added');
    const t1 = new Team();
    t1.addPair(pair);
    t1.setShow(true);
    teamsList.push(t1);
  }
  else{
    teamsList.sort((a, b) => b.pairs.length - a.pairs.length);
    //console.log("Team Creation for Pair " + pair.key);
    const t2 = new Team();
    t2.addPair(pair);
    let cloneArr = [];
    let currLength = teamsList[0].pairs.length;
    let prevIndex = 0;
    let index = 0;
    let currTeam = teamsList[index];
    //console.log("Team 0: " + currTeam + ", pairs " + currTeam.pairs.length);
    while(currLength > 0){
     //console.log("Beginning Loop, index: " + index + " Team: " + teamsList[index].key + " " + currLength + " vs. " + teamsList[index].pairs.length);
      while(teamsList[index] && currLength == teamsList[index].pairs.length){
        currTeam = teamsList[index];
        //console.log("Team 0: " + currTeam + ", pairs " + currTeam.pairs.length);
        //console.log("Can Team " + currTeam.key + " add pair " + pair.key + "?" + " Team: " + teamsList[index].key + " " + currLength + " vs. " + teamsList[index].pairs.length);
        if(currTeam.canAdd(pair)){
          //console.log("Can add!");
          const t3 = new Team([...currTeam.pairs], false);
          t2.addParent(currTeam);
          cloneArr.push(t3);
          currTeam.addPair(pair);
        }
        index++;
        if(teamsList[index]){
          //console.log(" Team: " + teamsList[index].key + " " + currLength + " vs. " + teamsList[index].pairs.length);
        }
      }
      //console.log("Finsished length " + currLength);
      for(let i = prevIndex; i < index; i++){
        for(let j = 0; j < cloneArr.length; j++){
          if(teamsList[i].pairs.length != cloneArr[j].pairs.length){
            //console.log("Is Team " + teamsList[i].key + " a viable parent for Team " + cloneArr[j].key);
             if(cloneArr[j].isParent(teamsList[i])){
               //console.log("Viable Parent!")
               cloneArr[j].addAllParents(teamsList[i]);
             }
          }
        }
      }
      teamsList.splice(index, 0, ...cloneArr);
      index += cloneArr.length;
      cloneArr = [];
      currLength--;
    }
    teamsList.push(t2);
  }
  return teamsList;
}

// two types of bad parents: parents that were deleted, and parents that are no longer parents

/* function idea stllChild fix

UPON CREATION OF TEAM, CHECK ALL PARENTS INSTANTLY

sort teams by length 3,2,1

begin add, for a single length, ex all 3 pair teams

if pair can be added to team, update team, put clone in side array, count how many

repeat until all teams of length are checked

take cloned teams in side array and check all teams again if parent
  if same length skip
  if bigger length, check parenthood
    if parent add to team parent array, recursively add all of their parents too (remember to remove dupes)

skip clone array size indexes, repeat again on length - 1


    const t2 = new Team();
    cloneArr = []
    t2.addPair(pair);
    console.log('-----------------------');
    console.log('Beginning Team Updates for pair ' + pair.key);
    for(let i = 0; i < teamsList.length; i++){
      output = "";
      currTeam = teamsList[i];
      output = output.concat('Checking Team ' + currTeam.key);
      if(currTeam.canAdd(pair)){  // pair works with team at index
        output = output.concat(' Can add pair!')
        t2.setShow(true);

        // clone pair, add to teamList right after
        t3 = new Team([...currTeam.pairs], false, [currTeam])
        output = output.concat(" Adding Clone Team ", t3.key)
        teamsList.splice(i + 1, 0, t3);
        
        // add current pair to team
        currTeam.addPair(pair);

        t2.addParent(currTeam);
        // index + 2
        i++;
      }
      else{
        output = output.concat(" Couldn't add pair")
      }
      console.log(output)
    }
    console.log('Team ' + (t2.key) + " added: " + t2.show)
    teamsList.push(t2);
  }
  return teamsList;
}

*/

function delUpdateTeamsList(pair, teamsList){
  return teamsList.filter(team => !team.pairs.some(tpair => tpair.key === pair.key));
}

export { addUpdateTeamsList, delUpdateTeamsList};