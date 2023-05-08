import {describe, it} from 'node:test';
import assert from 'assert';
import {createBeeSightingSummary} from "../src/beeSummary.js";

describe('creating summaries', () => {
    it('counts same caste within a section', (t) => {
        const sightings = [
            {section:"s1",species:"Bumblebee Bombus",caste:"queen"},
            {section:"s1",species:"Bumblebee Bombus",caste:"queen"},
        ]
        const expectedSummary = {s1: {"Bumblebee Bombus": {queen: 2}}}
        const actualSummary = createBeeSightingSummary(sightings);
        assert.deepEqual(actualSummary, expectedSummary);
    });
})
