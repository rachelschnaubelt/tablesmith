import useTableStore from "../store/tableStore";

const getCombinations = (count, selectedOptions) => {
  const target = count - 1;
  const combinations = [];
  const max_depth = 10;
  const comboSet = new Set();

  const search = (remaining, currentCombo) => {
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

const getCombinationDistribution = (combination, selectedOptions) => {
  let distribution = {
    0: 1
  };
  for (const die of combination) {
    const newDistribution = {};
    for (const value in distribution) {
      const valueInt = parseInt(value);
      for (let face = 1; face <= selectedOptions[die].value; face++) {
        const key = valueInt + face;
        newDistribution[key] = (newDistribution[key] || 0) + distribution[valueInt];
      }
    }
    distribution = newDistribution;
  }
  return distribution;
}

const getCombinationProbabilities = (distribution, total) => {
  const probabilities = {};
  for (const sum in distribution) {
    probabilities[sum] = distribution[sum] / total;
  }
  return probabilities;
}

const getCombinationVariance = (probabilities, count, total) => {
  const avg = 1 / count;
  let variance = 0;
  for (const prob in probabilities) {
    variance += (avg - probabilities[prob]) ** 2;
    variance /= parseInt(prob);
  }
  return variance;
}

const getDiceCounts = (combination) => {
  const diceCounts = {};
  for (const die of combination) {
    diceCounts[die] = (diceCounts[die] + 1) || 1;
  }
  return diceCounts;
}

const getDiceString = (diceCounts) => {
  const diceStrings = [];
  const sortDice = (a, b) => parseInt(b.substring(1)) - parseInt(a.substring(1));
  const sortedCounts = Object.keys(diceCounts).sort(sortDice).reduce(
    (obj, key) => {
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

const getCombinationObject = (combination, count, selectedOptions) => {
  const diceCounts = getDiceCounts(combination);
  const diceString = getDiceString(diceCounts);
  const distribution = getCombinationDistribution(combination, selectedOptions);
  const total = combination.reduce((acc, curr) => acc * selectedOptions[curr].value, 1);
  const probabilities = getCombinationProbabilities(distribution, total);
  const variance = getCombinationVariance(probabilities, count, total);
  // entries

  return {
    count,
    diceCounts,
    diceString,
    combination,
    distribution,
    probabilities,
    variance,
    selectedOptions
  }
}

const getCombinationObjects = (count, selectedOptions) => {
  const combinations = getCombinations(count, selectedOptions);
  const comboObjects = [];
  for (const combo of combinations) {
    comboObjects.push(getCombinationObject(combo, count, selectedOptions))
  }
  return comboObjects;
}

const getHints = (comboObjs, selectedOptions) => {
  const isSingleDie = comboObjs.find(combo => combo.combination.length === 1);
  if (!isSingleDie) {
    const { entries } = useTableStore.getState();
    const target = entries.length;
    const threshold = 8;
    const singleDieSolutions = Object.values(selectedOptions).sort((a, b) => a.value - b.value);

    const closestMin = singleDieSolutions.findLast(die => die.value < target);
    const closestMax = singleDieSolutions.find(die => die.value > target);
    const minDiff = closestMin && target - closestMin.value;
    const maxDiff = closestMax && closestMax.value - target;

    return {
      ...(minDiff < threshold && { closestMin: closestMin.value }),
      ...(minDiff < threshold && { minDiff }),
      ...(maxDiff < threshold && { closestMax: closestMax.value }),
      ...(maxDiff < threshold && { maxDiff })
    }
  }
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
    getHints
}