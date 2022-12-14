# Anime DataViz - *The Ultimate Anime Data Visualization Dashboard*
<img alt="sanjiro" src="https://sportshub.cbsistatic.com/i/2021/10/20/1d426743-26ef-4801-8eb3-8fbdb7d2afc9/demon-slayer.jpg" width="50%" align="right" />

## About the Project
Anime DataViz is a data visualization dashboard that shows various displays of anime-related data pulled from the [Jikan.moe API](https://docs.api.jikan.moe/) (the unofficial open-source clone of [MyAnimeList](https://myanimelist.net/)'s API which updates consistently with the MyAnimeList database).

The **public client application** can be accessed here: https://anime-dataviz.onrender.com/

The Anime DataViz website hosted by [Render](https://render.com/) makes use of the following tools:
- [Node.js](https://nodejs.org/en/)
- a [ReactJS](https://reactjs.org/) frontend
  - Visualization libraries:
    - [React Plotly](https://plotly.com/javascript/react/)
    - [Cytoscape.js](https://js.cytoscape.org/)
    - [React FusionCharts](https://www.fusioncharts.com/dev/getting-started/react/your-first-chart-using-react)
* an [ExpressJS](https://expressjs.com/) backend
* a [PostgreSQL](https://www.postgresql.org/) database (also hosted by [Render](https://render.com/))

## Specifications
The Anime DataViz project consists of two different parts:
- [server.js](https://github.com/evansjt/AnimeViz/blob/main/server.js):
  - The web-server application which end-users will be interacting with. It is responsible for loading existing data from the database and utilizing visualization libraries to create plots, charts, etc. that are specialized for interpretting the context of each data set. The public version of this web-server is hosted on [Render](https://render.com/).
- [worker.js](https://github.com/evansjt/AnimeViz/blob/main/worker.js):
  - The worker application which is performed synchronously with the application (the end-user has no access to this). It is responsible for fetching data from the Jikan.moe application and inserting/updating new data from each paginated result to the database and deleting missing data from the database when the paginated result contains no data matching that from the database. A full database update can take up to 1 hour and 30 minutes on the public database and around 16-17 minutes on a local database. The external server-run version is hosted on [Render](https://render.com/) as a web server (which is a webpage that only returns a 200 status) and refreshed every 5 minutes by a [cron-job](https://cron-job.org/en/) application (since Render's *background worker* feature includes a premium, which Heroku used to include for free...until they decided to charge for EVERYTHING!).

## Local Setup
If you so choose to run the application locally, the following requirements must first be met:
1. Install the latest version of Node.js.
2. Install all of the dependencies in package-lock.json in the server and the client using npm or yarn.
3. Create a database named "animedb" on a local PostgreSQL server that is open on port 5432 of localhost.

To run the worker, run `node worker.js` from the root of the project. This will run on port 3000 and create the required tables in the "animedb" database and populate them with data fetched from Jikan.moe. After it fetches all of the pages from Jikan.moe, the worker will restart the fetching process until the application quits.

The worker application will print progress updates on the terminal as each page is read into the database. Once an entire sweep of the Jikan.moe website has been made, the terminal will print this message:

```diff
+ Database updated: XXXXX rows inserted/affected
  JikanAPI2animedb: X:XX:XX.XXX (m:ss.mmm)
```

To run the server, run `node server.js` from the root of the project. This will run the web app locally on port 8080 (*localhost:8080*). ***It is recommended that the worker application makes a complete first sweep of all of the pages from Jikan.moe before running the web app server.***

## Visualizations
The [visualizations](https://github.com/evansjt/AnimeViz/tree/main/client/src/visualizations) shown on the dashboard help to answer the following questions:
- ### *Given the average number of members of all anime titles released per year, approximately what year(s) released is each type of anime media most popular?*
  >\**OVA = original video animation; anime released directly to home video format (what westerners know as ???direct-to-video???)*<br />
  >\**ONA = original net animation (anime released directly to the internet)*
  ><img alt="avg_membership_per_year" src="https://user-images.githubusercontent.com/32036244/206972002-3b036c5a-3ba9-4d87-bff1-1b85b55b9f16.png" />
  - This line graph (*created by [React Plotly](https://reactjs.org/)*) shows the trending average number of members per anime media type that has been released per year.
    
    Members are users who have added an anime entry to a list linked to their account on MyAnimeList.net; this line chart should not implied to be interpreted as a series of sequential events, but rather an aggregation of special interests in anime that had been released in years now or prior. \[E.g., Someone could not have become a member of the *Astro Boy* anime when it was first aired in the 1960s&#8212;(since MyAnimeList.net didn't exist back then)&#8212;but someone who wanted to watch reruns of *Astro Boy* today could become a member of that anime if they added that entry to a list on their MyAnimeList account.\]
    
    Upon hovering over a point, a label will not only show the average membership of anime titles of a certain media type released during that year, but also the anime title released during that year with the most members. The user may also click on that point to open a new tab to the MyAnimeList webpage of that title.
    - React Visualization: [AvgMembersPerYear.jsx](https://github.com/evansjt/AnimeViz/blob/main/client/src/visualizations/AvgMembersPerYear.jsx)
    - Express Route: [AvgMembersPerYr.js](https://github.com/evansjt/AnimeViz/blob/main/routes/AvgMembersPerYr.js) *(Route address: [/avg-mem-per-yr](https://anime-dataviz.onrender.com/avg-mem-per-yr))*
    - Database Query: [GetAverageMembershipPerYear.sql](https://github.com/evansjt/AnimeViz/blob/main/db/select/GetAverageMembershipPerYear.sql)
- ### *Among the last five years, which quarter of the year are anime TV shows most popular?*
  ><p align="center"><img alt="quarterly_membership_per_last_5_years" src="https://user-images.githubusercontent.com/32036244/206889889-74bb14bd-c6cd-45f3-9eea-469a78b421b6.png" height="500px" /></p>
  - This radial graph (*created by [React Plotly](https://reactjs.org/)*) shows the sum of memberships for all anime media released in a certain quarter for each year over the past 5 years (e.g., one point can represent the total number of members of all anime released within the spring of the year 2019).
    - React Visualization: [QuarterlyMembersPerLast5Years.jsx](https://github.com/evansjt/AnimeViz/blob/main/client/src/visualizations/QuarterlyMembersPerLast5Years.jsx)
    - Express Route: [QuarterlyMembersPerLast5Years.js](https://github.com/evansjt/AnimeViz/blob/main/routes/QuarterlyMembersPerLast5Years.js) *(Route address: [/qtly-mem-per-lst5yrs](https://anime-dataviz.onrender.com/qtly-mem-per-lst5yrs))*
    - Database Query: [GetQuarterlyMembersPerLast5Years.sql](https://github.com/evansjt/AnimeViz/blob/main/db/select/GetQuarterlyMembersPerLast5Years.sql)
- ### *What is the composition of age ratings among anime media within the Boys Love genre?*
  >\**Boys Love* = *Japanese fictional media that features romantic/homoerotic relationships between male characters*<br />
  >\**Hentai?????????*??? = *(lit.trans.: ???pervert???) a subset of anime media which contains adult-only pornographic content*
  ><p align="center"><img alt="age_rating_composition_of_bl_titles" src="https://user-images.githubusercontent.com/32036244/206890851-112f95d5-4d94-4ea0-8df1-3eb8e0d87f0a.png" height="500px" /></p>
  - This pie chart (*created by [React Plotly](https://reactjs.org/)*) shows the composition of anime titles in the Boys Love genre containing a certain age rating.
  
    Upon hovering over a section of the pie chart, the element underneath the chart will show a list of the Top 10 most popular Boys Love anime titles as well as links to those titles on MyAnimeList.net. Upon hovering over each title, the image shown within the element will change to that associated with the given title.
    - React Visualization: [AgeRatingCompOfBLGenre.jsx](https://github.com/evansjt/AnimeViz/blob/main/client/src/visualizations/AgeRatingCompOfBLGenre.jsx)
    - Express Route: [AgeRatingCompOfBLGenre.js](https://github.com/evansjt/AnimeViz/blob/main/routes/AgeRatingCompOfBLGenre.js) *(Route address: [/age-rating-comp-of-bl-genre](https://anime-dataviz.onrender.com/age-rating-comp-of-bl-genre))*
    - Database Query: [GetTop10BLAnimePerAgeRating.sql](https://github.com/evansjt/AnimeViz/blob/main/db/select/GetTop10BLAnimePerAgeRating.sql)
- ### *Which anime producers have collaborated with each other the most?*
  ><img alt="freq_of_collab_bw_prods" src="https://user-images.githubusercontent.com/32036244/206891741-8efab7ba-e687-4876-afd0-80e0c0ef1674.png" />
  - This network diagram (*created by [Cytoscape.js](https://js.cytoscape.org/)*)) displays the relationship between the top *N* anime producers (*N* can be set from 2 to the maximum number of existing producers by entering a number into the number field and clicking the "Generate" button). Each node is represented by individual producers of anime media and each edge is represented by at least one collaboration between two producers. The weight (or thickness) of each edge is relative to the number of collaborations between the two given producers. The graph's view is zoomable and pannable upon scroll and drag, respectively, and each node can be dragged around the graph.
    - React Visualization: [CollaboratingProducers.jsx](https://github.com/evansjt/AnimeViz/blob/main/client/src/visualizations/CollaboratingProducers.jsx)
    - Express Route: [CollaboratingProducers.js](https://github.com/evansjt/AnimeViz/blob/main/routes/CollaboratingProducers.js)<br />*(Route address: [/collab-prods/**:n**](https://anime-dataviz.onrender.com/collab-prods/10)* [where **:n** = top **n** producers with the most collaborations]*)*
    - Database Query: [GetTopNthCollaboratingProducers.sql](https://github.com/evansjt/AnimeViz/blob/main/db/select/GetTopNthCollaboratingProducers.sql)
- ### *Among each age rating, what is the comparison between the most frequently aired time of day (JST) per day of the week?*
  ><p align="center"><img alt="mode_bc_times_among_age_ratings" src="https://user-images.githubusercontent.com/32036244/206892170-a98e4a4c-401e-40ae-b6be-c4dcb2485409.png" height="500px" /></p>
  - This visualization, created using two radial graphs (*created by [React Plotly](https://reactjs.org/)*), shows the most frequent broadcast times per day of the week for each broadcasted anime containing a certain age rating.
  
    Since time is relative to each region of the world, it was pertinent to include two different radar charts: one that shows the most frequent broadcast times (per day of the week) in Japan Standard Time (JST), and another that shows the same times converted to another timezone (such as US mainland timezones: PST, MST, CST, EST). To set a specific timezone, use the searchbox marked with the label "See broadcast times in another timezone:" to find a known timezone under the given list.
    - React Visualization: [DailyModeBroadcastTimesPerAgeRating.jsx](https://github.com/evansjt/AnimeViz/blob/main/client/src/visualizations/DailyModeBroadcastTimesPerAgeRating.jsx)
    - Express Route: [DailyModeBroadcastTimesPerAgeRating.js](https://github.com/evansjt/AnimeViz/blob/main/routes/DailyModeBroadcastTimesPerAgeRating.js)<br />*(Route address: [/daily-mode-bc-times-per-rating/**:TZ**](https://anime-dataviz.onrender.com/daily-mode-bc-times-per-rating/JST)* [where **:TZ** = any supported timezone abbreviation (e.g. JST, PST, EST, etc.)]*)*
    - Database Query: [GetDailyModeBroadcastTimesPerAgeRating.sql](https://github.com/evansjt/AnimeViz/blob/main/db/select/GetDailyModeBroadcastTimesPerAgeRating.sql)
- ### *What is the demographic breakdown among Boys Love and Girls Love titles?*
  >\***Boys Love* = *Japanese fictional media that features romantic/homoerotic relationships between male characters*<br />
  >\***Girls Love* = *Japanese fictional media that features romantic/homoerotic relationships between female characters*<br />
  >\*Josei????????????= older female audience, \*Shoujo????????????= younger female audience<br />
  >\*Seinen????????????= older male audience, \*Shounen????????????= younger male audience,<br />
  ><p align="center"><img alt="demographic_comp_bl_gl_titles" src="https://user-images.githubusercontent.com/32036244/207217250-f010b6af-2f90-421e-b73f-7c819a7bdc3a.png" height="500px" /></p>
  - This bar chart (*created by [React Plotly](https://reactjs.org/)*) shows the comparison between the percentages of all Boys Love** titles and Girls Love** titles that are catered to certain demographic groups (Josei*, Shoujo*, Seinen*, Shounen*, Kids, or no specific demographic).
    - React Visualization: [DemographicsOfBLandGLTitles.jsx](https://github.com/evansjt/AnimeViz/blob/main/client/src/visualizations/DemographicsOfBLandGLTitles.jsx)
    - Express Route: [DemographicsOfBLandGLTitles.js](https://github.com/evansjt/AnimeViz/blob/main/routes/DemographicsOfBLandGLTitles.js) *(Route address: [/demographics-of-bl-gl-titles](https://anime-dataviz.onrender.com/demographics-of-bl-gl-titles))*
    - Database Query: [GetBLAndGLDemographic.sql](https://github.com/evansjt/AnimeViz/blob/main/db/select/GetBLAndGLDemographic.sql)
- ### *Which licensors and studios have worked with each other the most frequently?*
  ><p align="center"><img alt="freq_of_collab_bw_lic_stud" src="https://user-images.githubusercontent.com/32036244/206894159-9e93ad9b-7fa1-4502-9268-3e8d558ae990.png" width="50%" /></p>
  - This heat map (*created by [React Plotly](https://reactjs.org/)*) shows mappings between each existing licensor and each existing studio who have worked together as well as each mapping's color intensity (relative to the number of collaborations between each licensor and studio).
    - React Visualization: [CollaboratingLicensorsAndStudios.jsx](https://github.com/evansjt/AnimeViz/blob/main/client/src/visualizations/CollaboratingLicensorsAndStudios.jsx)
    - Express Route: [CollaboratingLicensorsAndStudios.js](https://github.com/evansjt/AnimeViz/blob/main/routes/CollaboratingLicensorsAndStudios.js) *(Route address: [/collab-lics-studs](https://anime-dataviz.onrender.com/collab-lics-studs))*
    - Database Query: [GetCollaboratingLicensorsAndStudios.sql](https://github.com/evansjt/AnimeViz/blob/main/db/select/GetCollaboratingLicensorsAndStudios.sql)
- ### *What is the longest-running anime TV series?*
  ><p align="center"><img alt="top_50_longest_running_anime_tv" src="https://user-images.githubusercontent.com/32036244/207158178-702e4bff-6bf1-410d-9577-62fa3f48c9b2.png" width="50%" /></p>
  - The horizontal bar char (*created by [React Plotly](https://reactjs.org/)*) shows the relationship between the number of days aired and the number of episodes aired from each of the Top 50 longest running anime TV series. Upon clicking any of the bars related to a specific anime title, a new tab will open and redirect the user to the MyAnimeList webpage related to that anime.
    
    The Gantt chart (*created by [React FusionCharts](https://www.fusioncharts.com/dev/getting-started/react/your-first-chart-using-react)*) compares the timespans between each anime's airing, taking in account their start and end dates.
    - React Visualization: [LongestRunningTVAnimeSeries.jsx](https://github.com/evansjt/AnimeViz/blob/main/client/src/visualizations/LongestRunningTVAnimeSeries.jsx)
    - Express Route: [LongestRunningTVAnimeSeries.js](https://github.com/evansjt/AnimeViz/blob/main/routes/LongestRunningTVAnimeSeries.js) *(Route address: [/longest-running-tv-anime-series](https://anime-dataviz.onrender.com/longest-running-tv-anime-series))*
    - Database Query: [GetTop50LongestRunningTVAnime.sql](https://github.com/evansjt/AnimeViz/blob/main/db/select/GetTop50LongestRunningTVAnime.sql)
