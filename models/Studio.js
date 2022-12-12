export class Studio {
    constructor(studio = null, fk = null) {
        if (studio && fk) {
            this.stud_id = studio['mal_id'];
            this.mal_id = fk;
            this.name = studio['name'];
        }
    }

    toString() {
        return "studios";
    }

    getSQLScript() {
        return 'db/insert-update-delete/UpsertStudio.sql';
    }
}