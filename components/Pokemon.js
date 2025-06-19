import { logToFile } from '../components/log';  // Import log function from log.js

let teamIdCounter = 1;

function Pokemon(name, types, species, form) {
  this.name = name;
  this.types = types;
  this.species = species;
  this.form = form;
}

function Pair(pk1, pk2, key) {
  this.pk1 = pk1;
  this.pk2 = pk2;
  this.key = key;
  console.log(key);
}

function Team(pairs, boolean, parents) {
  this.key = teamIdCounter;
  teamIdCounter++;
  this.pairs = [];
  this.show = true;
  this.parents = new Set();
  //console.log("PARENTS SIZE " + this.parents.size);
  if (arguments.length === 1) {
    this.pairs = pairs;
    //for(let i = 0; i < pairs.length; i++){
    //  this.key = this.key.concat(pairs[i].key);
    //  if((i+1) != pairs.length){
    //    this.key = this.key.concat(",")
    //   }
    // }
    //  console.log("Key :" , this.key);
  } else if (arguments.length === 2) {
    this.pairs = pairs;
    this.show = boolean;
    //for(let i = 0; i < pairs.length; i++){
    //  this.key = this.key.concat(pairs[i].key);
    //  if((i+1) != pairs.length){
    //    this.key = this.key.concat(",")
    //  }
    //}
    //console.log("Key :" , this.key);
  } else if (arguments.length === 3) {
    this.pairs = pairs;
    this.show = boolean;
    this.parents = new Set(parents);
  }
}

Team.prototype.addPair = function (pair) {
  this.pairs.push(pair);
  //if(this.pairs.length != 1){
  //  this.key = this.key.concat(",");
  //}
  //this.key = this.key.concat(pair.key);
  //console.log("Key :" , this.key);
};

Team.prototype.canAdd = function (pair) {
  // Iterating through existing pairs in the team
  if (this.pairs.length >= 6) {
    return false;
  }
  for (let existingPair of this.pairs) {
    // Checking for matching types
    if (
      existingPair.pk1.types[0] === pair.pk1.types[0] || // Check pk1's first type
      existingPair.pk2.types[0] === pair.pk1.types[0] || // Check pk2's first type against pk1's type
      existingPair.pk1.types[0] === pair.pk2.types[0] || // Check pk1's first type against pk2's type
      existingPair.pk2.types[0] === pair.pk2.types[0] // Check pk2's first type
    ) {
      return false; // Matching type found, cannot add pair
    }
  }
  return true; // No matching types found, can add pair
};

Team.prototype.setShow = function (boolean) {
  this.show = boolean;
};

Team.prototype.addParent = function (parent) {
  //console.log('Team ' + this.key + ' adding Parent Team ' + parent.key);
  this.parents.add(parent);
};


//TEAM 9 INFINITE LOOPS CAREFUL
Team.prototype.stillChild = function () {
  //let output = '';
  //output = output.concat('Team ', this.key, ' stillChild Parent Size (Before): ', this.parents.size);
  let remove = false;

  // Use for...of to iterate over the Set directly
  for (let parent of this.parents) {
    //output = output.concat(' Checking Parent Team ', parent.key);
    //console.log(' Checking Parent Team ', parent.key);

    for (let i = 0; i < this.pairs.length; i++) {
      //output = output.concat(' Does Team ', parent.key, ' have pair ', this.pairs[i].key);
      
      if (!parent.pairs.some((pair) => pair.key === this.pairs[i].key)) {
        //output = output.concat(" Doesn't have pair! Remove! ");
        remove = true;
        break; // Break out of the inner loop as soon as a mismatch is found
      } else {
        //output = output.concat(' Does have pair');
      }
    }

    if (remove) {
      //output = output.concat(' Removing parent team ', parent.key);
      this.parents.delete(parent);  // Use `delete` to remove the parent from the set
      remove = false;
    }
  }

  //output = output.concat(' Team ', this.key, ' stillChild Parent Size (After): ', this.parents.size);
  //console.log(output);
  
  return this.parents.size > 0;
};




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

*/

Team.prototype.isParent = function(par) {
  //console.log("Entering...");
  if (!this.pairs || !par.pairs) {
    console.error("Error: pairs is not defined or not initialized correctly");
    return false;
  }

  //console.log("Checking pairs for Team:", this.key);
  //console.log("Current team's pairs:", this.pairs);
  //console.log("Parent team's pairs:", par.pairs);

  for (let i = 0; i < this.pairs.length; i++) {
    const pair = this.pairs[i];
    //console.log(`Checking if pair ${pair.key} exists in parent team ${par.key}`);
    
    const existsInParent = par.pairs.some(parentPair => parentPair.key === pair.key);
    
    if (!existsInParent) {
      //console.log(`Pair ${pair.key} does not exist in parent team ${par.key}`);
      return false; // Return false if any pair is missing
    }
  }

  return true; // Return true if all pairs exist in the parent
};




Team.prototype.addAllParents = function (parent) {
  // Check if the parent is already in the parent set to avoid infinite loops
  //console.log('Team ' + this.key + ' adding Parent Team ' + parent.key);
  
  // Add the parent to the team’s parent set
  this.parents.add(parent);
  
  // Recursively add all of the parent's parents
  parent.parents.forEach((grandParent) => {
    this.addAllParents(grandParent); // Recursive call
  });
};

// Export the constructor function

Team.prototype.removedParents = function(teamsList, removeParents) {
  let parentsCounter = 0;
  //console.log("Team " + this.key + "");

  // Convert set to an array for safe iteration since we'll be removing elements during iteration
  const parentsArray = Array.from(this.parents);

  for (let i = 0; i < parentsArray.length; i++) {
    const parent = parentsArray[i];
    //console.log("Parent Key: " + parent.key + "");

    // Check if the parent exists in teamsList
    if (!teamsList.some(team => team.key === parent.key)) {
      if (removeParents) {
        this.parents.delete(parent);  // Use delete to remove from the Set
        i--;  // Decrement i to account for the removed element
      } else {
        //console.log("Not removing parents!");
        parentsCounter++;
      }
    }
  }

  // If removeParents is true, return whether all parents are removed (i.e., set size is 0)
  if (removeParents) {
    return this.parents.size === 0;
  }
  
  // Otherwise, return if all parents were "not found" (i.e., parentsCounter matches parents size)
  //console.log("Returning for Team " + this.key + ": " + parentsCounter + " == " + this.parents.size + " ");
  return parentsCounter === this.parents.size;
};


Team.prototype.addUpdate = function () {
  //console.log('Team ', this.key, ' addUpdate parent size: ', this.parents.size);
  this.show = !this.stillChild();
};

Team.prototype.delUpdate = function (teamsList) {
  this.show =  this.removedParents(teamsList, true);
};

Team.prototype.filterUpdate = function (teamsList) {
  this.show = this.removedParents(teamsList, false);
};

Team.prototype.isTopParent = function (parent){
  return parent.parents.length == 0;
};

export { Pokemon, Pair, Team };
