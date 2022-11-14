export class Demographic {
    constructor(demographic=demographic, fk=fk) {
        this.dem_id = demographic['mal_id'];
        this.mal_id = fk;
        this.name = demographic['name'];
    }

    toString() {
        return "Demographic";
    }
}