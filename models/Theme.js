export class Theme {
    constructor(theme=theme, fk=fk) {
        this.theme_id = theme['mal_id'];
        this.mal_id = fk;
        this.name = theme['name'];
    }

    toString() {
        return "Theme";
    }
}