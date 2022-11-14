export class Genre {
    constructor(genre=genre, fk=fk) {
        this.gen_id = genre['mal_id'];
        this.mal_id = fk;
        this.name = genre['name'];
    }

    toString() {
        return "Genre";
    }
}