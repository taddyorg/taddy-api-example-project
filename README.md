# Taddy Example Project
A example Node.js project using Taddy's API.

## Example of using the Taddy API
To see an example of working with our API, see `index.js` and more specifically `taddyGraphqlRequest`. 

## Mocking a webhook event
Mocking a webhook event allows you to prepare for them before you start recieving live webhook events from Taddy's API. Learn more about [Taddy webhooks](https://taddy.org/developers/podcast-api/webhooks). To mock an event, please follow these steps:

### 1. Install 3rd Party Dependencies

```
yarn install
```

### 2. Create and fill out an `.env` file with your API Key details.

```
cp .env.example .env
```

This copies the `.env.example` template file and creates a new file `.env`. Follow the instructions in [https://taddy.org/developers/intro-to-taddy-graphql-api](https://taddy.org/developers/intro-to-taddy-graphql-api) to get your API Key And User ID. 

### 3. Mock a webhook event

You can choose from one of the following events:

```
//podcastseries events
podcastseries.created, podcastseries.updated, podcastseries.deleted, podcastseries.new_episodes_released

//podcastepisode events
podcastepisode.created, podcastepisode.updated, podcastepisode.deleted

//itunesinfo events
itunesinfo.created, itunesinfo.updated, itunesinfo.deleted
```

Then run the `mock-webhook-event` command, in the format: `yarn mock-webhook-event ${event} ${uuid}`

#### Example:
```
yarn mock-webhook-event podcastseries.updated d682a935-ad2d-46ee-a0ac-139198b83bcc
```