const { taddyGraphqlRequest, taddyQuery } = require('./index');
const axios = require("axios");
const { get } = require('lodash');

async function run(){
  const inputs = process.argv.slice(2);
  const webhookEvent = inputs[0];
  const uuid = inputs[1];

  if(!webhookEvent) { 
    throw new Error("You must pass in a webhook event as the first argument. Valid webhook events are: " + [...validWebhookEvents].join(', ')); 
  }else if ( !validWebhookEvents.has(webhookEvent)) {
    throw new Error(`${webhookEvent} is not a valid webhook event. Valid webhook events are: ${[...validWebhookEvents].join(', ')}`);
  }else if(!uuid) {
    throw new Error("You must pass in a uuid as the second argument");
  }else if(!process.env.WEBHOOK_ENDPOINT_URL) {
    throw new Error("You must set the WEBHOOK_ENDPOINT_URL environment variable in your .env file");
  }

  const [taddyType, action] = webhookEvent.split('.');

  const query = getQuery({ taddyType });
  const variables = { uuid };

  const data = await taddyGraphqlRequest({ query, variables });
  const mockEvent = createMockWebhookEvent({ data, taddyType, action, uuid });
  console.log(mockEvent);
  await sendMockEventToEndpointUrl({ mockEvent });
}

const validWebhookEvents = new Set([
  'podcastseries.created', 'podcastseries.updated', 'podcastseries.deleted', 'podcastseries.new_episodes_released',
  'podcastepisode.created', 'podcastepisode.updated', 'podcastepisode.deleted',
  'itunesinfo.created', 'itunesinfo.updated', 'itunesinfo.deleted',
  'comicseries.created', 'comicseries.updated', 'comicseries.deleted', 'comicseries.new_issues_released',
  'comicissue.created', 'comicissue.updated', 'comicissue.deleted',
  'creator.created', 'creator.updated', 'creator.deleted', 'creator.new_content_released',
  'creatorcontent.created', 'creatorcontent.updated', 'creatorcontent.deleted',
  'hostingprovider.created', 'hostingprovider.updated', 'hostingprovider.deleted',
])

function getQuery({ taddyType }){
  switch(taddyType) {
    case 'podcastseries':
      return taddyQuery.GET_PODCASTSERIES;
    case 'podcastepisode':
      return taddyQuery.GET_PODCASTEPISODE;
    case 'itunesinfo':
      return taddyQuery.GET_ITUNESINFO;
    case 'comicseries':
      return taddyQuery.GET_COMICSERIES;
    case 'comicissue':
      return taddyQuery.GET_COMICISSUE;
    case 'creator':
      return taddyQuery.GET_CREATOR;
    case 'creatorcontent':
      return taddyQuery.GET_CREATORCONTENT;
    case 'hostingprovider':
      return taddyQuery.GET_HOSTINGPROVIDER;
    default:
      throw new Error(`ERROR in getQuery: taddyType: ${taddyType} is not supported`);
  }
}

function getDataProperty({ taddyType }){
  switch(taddyType) {
    case 'podcastseries':
      return 'getPodcastSeries';
    case 'podcastepisode':
      return 'getPodcastEpisode';
    case 'itunesinfo':
      return 'getItunesInfo';
    case 'comicseries':
      return 'getComicSeries';
    case 'comicissue':
      return 'getComicIssue';
    case 'creator':
      return 'getCreator';
    case 'creatorcontent':
      return 'getCreatorContent';
    case 'hostingprovider':
      return 'getHostingProvider';
    default:
      throw new Error(`ERROR in getDataProperty: taddyType: ${taddyType} is not supported`);
  }
}

function createMockWebhookEvent({ data, taddyType, action, uuid}){
  const dataForEvent = get(data, getDataProperty({ taddyType }), null);
  if (!dataForEvent) {
    throw new Error(`ERROR in createMockWebhookEvent: no data returned for taddyType: ${taddyType} and uuid: ${uuid}`);
  }
  return {
    uuid,
    taddyType,
    action,
    timestamp: Math.floor(Date.now()/1000),
    data: dataForEvent,
  }
}

async function sendMockEventToEndpointUrl({ mockEvent }) {
  try { 
    const options = {
      method: 'POST',
      url: process.env.WEBHOOK_ENDPOINT_URL,
      timeout: 1000 * 5,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'taddy.org/1.0',
        'X-TADDY-WEBHOOK-SECRET': process.env.WEBHOOK_SECRET,
      },
      data: mockEvent
    };
    
    await axios(options);
  }catch(error){
    console.log('sendMockEventToEndpointUrl error sending to ', process.env.WEBHOOK_ENDPOINT_URL, error && error.message);
  }
}

run();
