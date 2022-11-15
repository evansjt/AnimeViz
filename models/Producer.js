export class Producer {
    constructor(producer=producer, fk=fk) {
        this.prod_id = producer['mal_id'];
        this.mal_id = fk;
        this.name = producer['name'];
    }

    toString() {
        return "Producer";
    }
}