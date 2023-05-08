export function createBeeSightingSummary (sightings) {
    const beeSightingsSummary = sightings.reduce((summary, sighting) => {
        // we need to update the section for the given sighting

        // look up the section from the summary (or create a new section)
        let currentSection = summary[sighting.section];
        if (!currentSection) {
            currentSection = {}
        }
        summary[sighting.section] = currentSection

        // look up the species count in the current section
        const currentSpeciesCount = currentSection[sighting.species];

        if (!currentSpeciesCount) {
            // if the species hasnt been seen in this section, add a record of it, with its caste
            currentSection[sighting.species] = {[sighting.caste]: 1};
        } else {
            // if we haven't seen this caste (but we have seen the species)
            if (!currentSection[sighting.species][sighting.caste]) {
                // add the caste
                currentSection[sighting.species][sighting.caste] = 1
            } else {
                // increment the caste
                currentSection[sighting.species][sighting.caste]++;
            }
        }
        return summary
    }, {});
    return beeSightingsSummary;
}