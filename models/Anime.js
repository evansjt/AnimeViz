export class Anime {
    constructor(animeData) {
        this.mal_id = animeData['mal_id'];
        this.url = animeData['url'];
        this.image_jpg = animeData['images']['jpg']['image_url'];
        this.image_webp = animeData['images']['webp']['image_url'];
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
        this.broadcast_info = this.parseBroadcastInfo(animeData['broadcast']);
    }

    parseBroadcastInfo(broadcastInfo) {
        const dow = { Mondays: 1, Tuesdays: 2, Wednesdays: 3, Thursdays: 4, Fridays: 5, Saturdays: 6, Sundays: 7 };
        if (broadcastInfo['day'] && broadcastInfo['time'])
            return `12/${dow[broadcastInfo['day']]}/1969 ${broadcastInfo['time']}+09:00`;
        return null;
    }
}