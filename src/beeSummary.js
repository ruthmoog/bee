export function createBeeSightingSummary(sightings) {
    return sightings.reduce((summary, sighting) => {
        // we need to update the section for the given sighting
        // look up the section from the summary (or create a new section)

        const currentSection = summary[sighting.section] || {}
        summary[sighting.section] = currentSection;

        // look up the species count in the current section
        let currentSpeciesCount = currentSection[sighting.species];

        // if we haven't seen this caste (but we have seen the species)
        if (!currentSpeciesCount) {
            // if the species hasnt been seen in this section, add a record of it, with its caste
            currentSection[sighting.species] = {[sighting.caste]: 1};
        } else if (!currentSection[sighting.species][sighting.caste]) {
            // add the caste
            currentSection[sighting.species][sighting.caste] = 1
        } else {
            // increment the caste
            currentSection[sighting.species][sighting.caste]++;
        }
        return summary
    }, {});
}