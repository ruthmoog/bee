import {describe, it} from 'node:test';
import assert from 'assert';
import {createBeeSightingSummary} from "../src/beeSummary.js";

describe('creating summaries', () => {
    it('counts same caste within a section', (t) => {
        const sightings = [
            {section: "s1", species: "Bumblebee Bombus", caste: "queen"},
            {section: "s1", species: "Bumblebee Bombus", caste: "queen"},
        ]
        const expectedSummary = {s1: {"Bumblebee Bombus": {queen: 2}}}
        const actualSummary = createBeeSightingSummary(sightings);
        assert.deepEqual(actualSummary, expectedSummary);
    });

    it('counts different castes within a section', (t) => {
        const sightings = [
            {section: "s1", species: "Bumblebee Bombus", caste: "queen"},
            {section: "s1", species: "Bumblebee Bombus", caste: "worker"},
        ];
        const expectedSummary = {s1: {"Bumblebee Bombus": {queen: 1, worker: 1}}};
        const actualSummary = createBeeSightingSummary(sightings);
        assert.deepEqual(actualSummary, expectedSummary);
    });

    it('counts same caste across sections', (t) => {
        const sightings = [
            {section: "s1", species: "Bumblebee Bombus", caste: "queen"},
            {section: "s2", species: "Bumblebee Bombus", caste: "queen"},
        ];
        const expectedSummary = {s1: {"Bumblebee Bombus": {queen: 1}}, s2: {"Bumblebee Bombus": {queen: 1}}};
        const actualSummary = createBeeSightingSummary(sightings);
        assert.deepEqual(actualSummary, expectedSummary);
    });

    it('counts different castes across sections', (t) => {
        const sightings = [
            {section: "s1", species: "Bumblebee Bombus", caste: "queen"},
            {section: "s2", species: "Bumblebee Bombus", caste: "worker"},
        ];
        const expectedSummary = {s1: {"Bumblebee Bombus": {queen: 1}}, s2: {"Bumblebee Bombus": {worker: 1}}};
        const actualSummary = createBeeSightingSummary(sightings);
        assert.deepEqual(actualSummary, expectedSummary);
    });

    it('counts different species across sections', (t) => {
        const sightings = [
            {section: "s1", species: "Bumblebee Bombus", caste: "queen"},
            {section: "s2", species: "Bumblebee Bombus", caste: "queen"},
            {section: "s1", species: "Bumblebee Bombus", caste: "queen"},
            {section: "s2", species: "Honeybee", caste: "queen"},
        ];
        const expectedSummary = {
            s1: {"Bumblebee Bombus": {queen: 2}},
            s2: {"Honeybee": {queen: 1}, "Bumblebee Bombus": {queen: 1}}
        };
        const actualSummary = createBeeSightingSummary(sightings);
        assert.deepEqual(actualSummary, expectedSummary);
    });

    it('counts multiple castes of different species across sections', (t) => {
        const sightings = [
            {section: "s1", species: "Bumblebee Bombus", caste: "queen"},
            {section: "s1", species: "Bumblebee Bombus", caste: "queen"},
            {section: "s1", species: "Bumblebee Bombus", caste: "worker"},
            {section: "s1", species: "Honeybee", caste: "worker"},
            {section: "s2", species: "Bumblebee Bombus", caste: "queen"},
            {section: "s2", species: "Honeybee", caste: "queen"},
            {section: "s2", species: "Bumblebee Bombus", caste: "worker"},
        ];
        const expectedSummary = {
            s1: {
                "Bumblebee Bombus": {queen: 2, worker: 1},
                "Honeybee": {worker: 1}
            },
            s2: {
                "Bumblebee Bombus": {queen: 1, worker: 1},
                "Honeybee": {queen: 1}
            }
        }
        const actualSummary = createBeeSightingSummary(sightings);
        assert.deepEqual(actualSummary, expectedSummary);
    });
    
})
