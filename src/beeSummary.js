export function createBeeSightingSummary(sightings) {

    return sightings.reduce((summary, sighting) => {
        // look up the section from the summary (or create a new section)
        const currentSection = summary[sighting.section] || {}

        // look up the species count in the current section
        if (!currentSection[sighting.species]) {// if we haven't seen this caste (but we have seen the species)
            addSpeciesAndCaste(currentSection, sighting);
        } else {
            incrementCaste(currentSection[sighting.species], sighting.caste)
        }

        // Update the section
        summary[sighting.section] = currentSection;
        return summary
    }, {});
}

function incrementCaste(species, caste) {
    species[caste] = species[caste] ? species[caste] +1 : 1
}

function addSpeciesAndCaste(currentSection, sighting) {
    currentSection[sighting.species] = {[sighting.caste]: 1};
}
