export class Anime{
    constructor(animeData) {
        this.mal_id = animeData['mal_id'];
        this.title = animeData['title'];
        this.title_english = animeData['title_english'];
        this.title_japanese = animeData['title_japanese'];
        this.title_synonyms = animeData['title_synonyms'].toString();
        this.type = animeData['type'];
        this.source = animeData['source'];
        this.episodes = animeData['episodes'];
        this.status = animeData['status'];
        this.aired_from = animeData['aired']['from'];
        this.aired_to = animeData['aired']['to'];
        this.rating = animeData['rating'];
        this.score = animeData['score'];
        this.scored_by = animeData['scored_by'];
        this.rank = animeData['rank'];
        this.popularity = animeData['popularity'];
        this.members = animeData['members'];
        this.favorites = animeData['favorites'];
        this.season = animeData['season'];
        this.year = animeData['year'];
        this.broadcast_day = animeData['broadcast']['day'];
        this.broadcast_time = animeData['broadcast']['time'];
    }
}