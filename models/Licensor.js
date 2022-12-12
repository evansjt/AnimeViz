export class Licensor {
    constructor(licensor = null, fk = null) {
        if (licensor && fk) {
            this.lic_id = licensor['mal_id'];
            this.mal_id = fk;
            this.name = licensor['name'];
        }
    }

    toString() {
        return "licensors";
    }

    getSQLScript() {
        return 'db/insert-update-delete/UpsertLicensor.sql';
    }
}