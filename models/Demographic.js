export class Demographic {
    constructor(demographic = null, fk = null) {
        if (demographic && fk) {
            this.dem_id = demographic['mal_id'];
            this.mal_id = fk;
            this.name = demographic['name'];
        }
    }

    toString() {
        return "demographics";
    }

    getSQLScript() {
        return 'db/UpsertDemographic.sql';
    }
}