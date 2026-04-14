import useTableStore from "../store/tableStore";
import { ComboObject, DiceCount, DiceOptions, Distribution, Probability } from "../types/types";



const getCombinations = (count: number, selectedOptions: DiceOptions) => {
  const target = count - 1;
  const combinations: string[][] = [];
  const max_depth = 10;
  const comboSet = new Set();

  const search = (remaining: number, currentCombo: string[]) => {
    if (remaining === 0) {
      const comboString = currentCombo.sort().join(',');
      if (!comboSet.has(comboString)) {
        comboSet.add(comboString);
        combinations.push(currentCombo.reverse());
      }
      return;
    }

    if (currentCombo.length >= max_depth || comboSet.size >= 10) {
      return;
    }

    for (const die in selectedOptions) {
      if(!selectedOptions[die].enabled) {
        continue;
      }
      if (die === 'd2' && currentCombo.length > 0) {
        const d2Count = currentCombo.reduce((acc, curr) => {
          return curr === 'd2' ? acc + 1 : acc
        }, 0);
        if (d2Count > 1) {
          return;
        }
      }
      if ((selectedOptions[die].value - 1) <= remaining) {
        search(remaining - (selectedOptions[die].value - 1), [...currentCombo, die]);
      }
    }

  }
  search(target, []);
  return combinations;
}

const getCombinationDistribution = (combination: string[], selectedOptions: DiceOptions) => {
  let distribution: Distribution = {
    0: 1
  };
  for (const die of combination) {
    const newDistribution: Distribution = {};
    for (const value in distribution) {
      const valueInt = parseInt(value);
      for (let face = 1; face <= selectedOptions[die].value; face++) {
        const key: number = valueInt + face;
        newDistribution[key] = (newDistribution[key] || 0) + distribution[valueInt];
      }
    }
    distribution = newDistribution;
  }
  return distribution;
}

const getCombinationProbabilities = (distribution: Distribution, total: number) => {
  const probabilities: Probability = {};
  for (const sum in distribution) {
    probabilities[sum] = distribution[sum] / total;
  }
  return probabilities;
}

const getCombinationVariance = (probabilities: Probability) => {
  let mean = 0;
  for(const prob in probabilities) {
    mean += parseInt(prob) * probabilities[prob];
  }

  let variance = 0;
  for(const prob in probabilities) {
    variance += ((parseInt(prob) - mean) ** 2) * probabilities[prob];
  }

  return variance;
}

const getCombinationStandardDeviation = (variance: number) => {
  return Math.sqrt(variance);
}

const getDiceCounts = (combination: string[]) => {
  const diceCounts: DiceCount = {};
  for (const die of combination) {
    diceCounts[die] = (diceCounts[die] + 1) || 1;
  }
  return diceCounts;
}

const getDiceString = (diceCounts: DiceCount) => {
  const diceStrings = [];
  const sortDice = (a: string, b: string) => parseInt(b.substring(1)) - parseInt(a.substring(1));
  const sortedCounts = Object.keys(diceCounts).sort(sortDice).reduce(
    (obj: DiceCount, key) => {
      obj[key] = diceCounts[key];
      return obj;
    },
    {}
  );

  for (const die in sortedCounts) {
    diceStrings.push(`${sortedCounts[die]}${die}`);
  }
  return diceStrings.join(' + ');
}

const getCombinationObject = (combination: string[], count: number, selectedOptions: DiceOptions) => {
  const diceCounts = getDiceCounts(combination);
  const diceString = getDiceString(diceCounts);
  const distribution = getCombinationDistribution(combination, selectedOptions);
  const total = combination.reduce((acc, curr) => acc * selectedOptions[curr].value, 1);
  const probabilities = getCombinationProbabilities(distribution, total);
  const variance = getCombinationVariance(probabilities);
  const standardDeviation = getCombinationStandardDeviation(variance);

  return {
    count,
    diceCounts,
    diceString,
    combination,
    distribution,
    probabilities,
    variance,
    standardDeviation,
    selectedOptions
  }
}

const getCombinationObjects = (count: number, selectedOptions: DiceOptions) => {
  const combinations = getCombinations(count, selectedOptions);
  const comboObjects = [];
  for (const combo of combinations) {
    comboObjects.push(getCombinationObject(combo, count, selectedOptions))
  }
  return comboObjects;
}

const getHints = (comboObjs: ComboObject[], selectedOptions: DiceOptions) => {
  const isSingleDie = comboObjs.find(combo => combo.combination.length === 1);
  if (!isSingleDie) {
    const { entries } = useTableStore.getState();
    const target = entries.length;
    const threshold = 8;
    const validOptions = Object.values(selectedOptions).filter(option => option.enabled);
    const singleDieSolutions = validOptions.sort((a, b) => a.value - b.value);

    const closestMin = singleDieSolutions.findLast(die => die.value < target);
    const closestMax = singleDieSolutions.find(die => die.value > target);
    const minDiff = closestMin && target - closestMin.value;
    const maxDiff = closestMax && closestMax.value - target;

    return {
      ...(minDiff && minDiff < threshold && { closestMin: closestMin.value }),
      ...(minDiff && minDiff < threshold && { minDiff }),
      ...(maxDiff && maxDiff < threshold && { closestMax: closestMax.value }),
      ...(maxDiff && maxDiff < threshold && { maxDiff })
    }
  }
}

const getMostLikelyRolls = (comboObj: ComboObject) => {
  let distribution: Distribution = comboObj.distribution;
  const sortedKeys = Object.keys(distribution).sort((a, b) => distribution[b] - distribution[a]);
  const results = [sortedKeys[0]];
  let i = 1; 
  while(distribution[sortedKeys[i]] == distribution[results[0]]) {
    results.push(sortedKeys[i]);
    i++;
  }
  return results;
}

const getLeastLikelyRolls = (comboObj: ComboObject) => {
  let distribution: Distribution = comboObj.distribution;
  const sortedKeys = Object.keys(distribution).sort((a, b) => distribution[a] - distribution[b]);
  const results = [sortedKeys[0]];
  let i = 1; 
  while(distribution[sortedKeys[i]] == distribution[results[0]]) {
    results.push(sortedKeys[i]);
    i++;
  }
  return results;
}

export {
    getCombinations,
    getCombinationDistribution,
    getCombinationProbabilities,
    getCombinationVariance,
    getDiceCounts,
    getDiceString,
    getCombinationObject,
    getCombinationObjects,
    getHints,
    getMostLikelyRolls,
    getLeastLikelyRolls,
    getCombinationStandardDeviation
}