require('dotenv').config(); //loads .env file to get process.env to work
const { GraphQLClient, gql } = require('graphql-request');

async function taddyGraphqlRequest({ query, variables }) {
  const endpointUrl = "https://api.taddy.org/";
    
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Example App',
    'X-USER-ID': process.env.TADDY_USER_ID,
    'X-API-KEY': process.env.TADDY_API_KEY,
  }
  
  try {
    const client = new GraphQLClient(endpointUrl, { headers })
    const data = await client.request(query, variables)
    return data;
  }catch(e) {
    console.log("inside sentTaddyGraphqlRequest", e)
  }
}

const SEARCH_FOR_TERM_QUERY = gql`
  query searchForTerm($term: String, $page: Int, $limitPerPage: Int, $filterForTypes: [TaddyType], $filterForCountries: [Country], $filterForLanguages: [Language], $filterForGenres: [Genre], $filterForSeriesUuids: [ID], $filterForNotInSeriesUuids: [ID], $isExactPhraseSearchMode: Boolean, $isSafeMode: Boolean, $searchResultsBoostType: SearchResultBoostType) {
    searchForTerm(term: $term, page: $page, limitPerPage: $limitPerPage, filterForTypes: $filterForTypes, filterForCountries: $filterForCountries, filterForLanguages: $filterForLanguages, filterForGenres: $filterForGenres, filterForSeriesUuids: $filterForSeriesUuids, filterForNotInSeriesUuids: $filterForNotInSeriesUuids, isExactPhraseSearchMode: $isExactPhraseSearchMode, isSafeMode: $isSafeMode, searchResultsBoostType:$searchResultsBoostType) {
      searchId
      podcastSeries {
        uuid
        name
        rssUrl
        itunesId
      }
      podcastEpisodes {
        uuid
        guid
        name
        audioUrl
      }
    }
  }
`

const GET_PODCASTSERIES = gql`
  query getPodcastSeries($uuid: ID) {
    getPodcastSeries(uuid: $uuid){
      uuid
      hash
      name
      description
      imageUrl
      datePublished
      language
      seriesType
      contentType
      isExplicitContent
      copyright
      websiteUrl
      rssUrl
      rssOwnerName
      rssOwnerPublicEmail
      authorName
      isComplete
      isBlocked
      itunesId
      genres
      childrenHash
      itunesInfo{
        uuid
        publisherId
        publisherName
        baseArtworkUrl
        baseArtworkUrlOf(size: 640)
      }
    }
  }
`

const GET_PODCASTEPISODE = gql`
  query getPodcastEpisode($uuid: ID) {
    getPodcastEpisode(uuid: $uuid){
      uuid
      hash
      name
      description
      imageUrl
      datePublished
      guid
      subtitle
      audioUrl
      videoUrl
      fileLength
      fileType
      duration
      episodeType
      seasonNumber
      episodeNumber
      websiteUrl
      isExplicitContent
      isRemoved
      podcastSeries{
        uuid
        name
        rssUrl
        itunesId
      }
    }
  }
`

const GET_ITUNESINFO = gql`
  query getItunesInfo($uuid: ID) {
    getItunesInfo(uuid: $uuid){
      uuid
      hash
      subtitle
      summary
      baseArtworkUrl
      publisherId
      publisherName
      country
      podcastSeries{
        uuid
        name
        rssUrl
        itunesId
      }
    }
  }
`

module.exports = {
  taddyGraphqlRequest,
  taddyQuery: {
    SEARCH_FOR_TERM_QUERY,
    GET_PODCASTSERIES,
    GET_PODCASTEPISODE,
    GET_ITUNESINFO,
  }
}