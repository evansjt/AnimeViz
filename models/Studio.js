export class Studio {
    constructor(studio=studio, fk=fk) {
        this.stud_id = studio['mal_id'];
        this.mal_id = fk;
        this.name = studio['name'];
    }

    toString() {
        return "Studio";
    }
}