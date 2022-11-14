export class Licensor {
    constructor(licensor=licensor, fk=fk) {
        this.lic_id = licensor['mal_id'];
        this.mal_id = fk;
        this.name = licensor['name'];
    }

    toString() {
        return "Licensor";
    }
}