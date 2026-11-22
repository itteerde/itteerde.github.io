
const party = [
    'Actor.H6DSaCHG4p4BEI5t', // Old Man Kelly
    'Actor.FyFRyyIWkPGJdykU', // Enona
    'Actor.nOhIzDIvVr8Hx7hv', // Corinne Vale
    'Actor.5VUzhf74KMqjThM5', // Amber Sunshadow
    'Actor.xhu7HXG6GwPYUKwB', // Nikki Doboro
    'Actor.aty1EvOcmp1D8Avd', // Sinder Jack Marrow
    'Actor.m8PlmFST5MscpRrs', // Suture
];

class Character {
    /**
     * @type {Actor}
     */
    _actor;

    constructor(actor) {
        this._actor = actor;
    }

    /**
     * Serializes the Foundry Actor document into a plain object safe for JSON.
     */
    toJSON() {
        return this._actor.toObject();
    }
}

class Foundry2GitHub {
    /**
     * @type {Array<Character>}
     */
    _party = [];

    constructor(partyMembers = []) {
        this._party = partyMembers;
    }

    static async create(uuids) {
        const promises = uuids.map(async (uuid) => {
            try {
                const actor = await fromUuid(uuid);
                return actor ? new Character(actor) : null;
            } catch (error) {
                console.error(`Failed to load ${uuid}:`, error);
                return null;
            }
        });

        const results = await Promise.all(promises);
        return new Foundry2GitHub(results.filter(Boolean));
    }

    /**
         * Exports the _party array as a downloadable JSON file in the browser.
         * @param {string} [filename="party.json"] - The name of the downloaded file.
         */
    exportParty(filename = "party.json") {
        const jsonString = JSON.stringify(this._party, null, 2);

        // Foundry VTT v13+ namespaced helper
        if (typeof foundry?.utils?.saveDataToFile === "function") {
            foundry.utils.saveDataToFile(jsonString, "application/json", filename);
            return;
        }

        // Standard Vanilla Browser API fallback
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Usage:
const f2g = await Foundry2GitHub.create(party);
f2g.exportParty("my-party.json");