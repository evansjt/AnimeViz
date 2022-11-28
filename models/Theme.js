export class Theme {
    constructor(theme = null, fk = null) {
        if (theme && fk) {
            this.theme_id = theme['mal_id'];
            this.mal_id = fk;
            this.name = theme['name'];
        }
    }

    toString() {
        return "themes";
    }

    getSQLScript() {
        return 'db/UpsertTheme.sql';
    }
}