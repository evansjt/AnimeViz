export class Genre {
    constructor(genre = null, fk = null) {
        if (genre && fk) {
            this.gen_id = genre['mal_id'];
            this.mal_id = fk;
            this.name = genre['name'];
        }
    }

    toString() {
        return "genres";
    }

    getSQLScript() {
        return 'db/UpsertGenre.sql';
    }
}