# Taddy Example Project
A example Node.js project using Taddy's API.

## Example of using the Taddy API
To see an example of working with our API, see `index.js` and more specifically `taddyGraphqlRequest`. 

## Mocking a webhook event
Mocking a webhook event allows you to prepare for them before you start recieving live webhook events from Taddy's API.

Learn more about [Taddy webhooks](https://taddy.org/developers/podcast-api/webhooks). To mock an event, please follow these steps:

### 1. Install 3rd Party Dependencies

```
yarn install
```

### 2. Create and fill out an `.env` file with your API Key details.

```
cp .env.example .env
```

This copies the `.env.example` template file and creates a new file `.env`. 

- Follow the instructions in [https://taddy.org/developers/intro-to-taddy-graphql-api](https://taddy.org/developers/intro-to-taddy-graphql-api) to get your API Key And User ID (use that to fill in TADDY_USER_ID & TADDY_API_KEY in the `.env` file).

- Then use your local webhook endpoint for WEBHOOK_ENDPOINT_URL & (Optionally) make up WEBHOOK_SECRET. **We mock a webhook event by 1) getting actually data from Taddy's API and then 2) sending it to the local webhook endpoint you enter here.**

### 3. Mock a webhook event

You can choose from one of the following events:

```
//podcastseries events
podcastseries.created, podcastseries.updated, podcastseries.deleted, podcastseries.new_episodes_released

//podcastepisode events
podcastepisode.created, podcastepisode.updated, podcastepisode.deleted

//itunesinfo events
itunesinfo.created, itunesinfo.updated, itunesinfo.deleted

//comicseries events
comicseries.created, comicseries.updated, comicseries.deleted, comicseries.new_issues_released

//comicissue events
comicissue.created, comicissue.updated, comicissue.deleted

//creator events
creator.created, creator.updated, creator.deleted, creator.new_content_released

//creatorcontent events
creatorcontent.created, creatorcontent.updated, creatorcontent.deleted
```

Then run the `mock-webhook-event` command, in the format: `yarn mock-webhook-event ${event} ${uuid}`

#### Example:
```
yarn mock-webhook-event podcastseries.updated cb8d858a-3ef4-4645-8942-67e55c0927f2
yarn mock-webhook-event podcastepisode.updated a2b41ecd-565c-4f29-8cf9-ac737bcc8d99
yarn mock-webhook-event itunesinfo.updated cb8d858a-3ef4-4645-8942-67e55c0927f2
yarn mock-webhook-event comicseries.updated 96cc49d7-a95d-4266-b408-b57c7d26a62e
yarn mock-webhook-event comicissue.updated a542ad55-4ebf-456d-b6c8-a4e8e3fd81ae
yarn mock-webhook-event creator.updated 87aa38ce-2960-4fde-83e6-e638a2d77b2d
yarn mock-webhook-event creatorcontent.updated 
```