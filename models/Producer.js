export class Producer {
    constructor(producer = null, fk = null) {
        if (producer && fk) {
            this.prod_id = producer['mal_id'];
            this.mal_id = fk;
            this.name = producer['name'];
        }
    }

    toString() {
        return "producers";
    }

    getSQLScript() {
        return 'db/UpsertProducer.sql';
    }
}