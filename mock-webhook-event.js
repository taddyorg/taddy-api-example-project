const { taddyGraphqlRequest, taddyQuery } = require('./index');
const axios = require("axios");
const { get } = require('lodash');

async function run(){
  const inputs = process.argv.slice(2);
  const webhookEvent = inputs[0];
  const uuid = inputs[1];

  if(!webhookEvent) { 
    throw new Error("You must pass in a webhook event as the first argument. Please see https://taddy.org/developers/podcast-api/webhooks for a full list of valid events."); 
  }else if ( !validWebhookEvents.has(webhookEvent)) {
    throw new Error(`${webhookEvent} is not a valid webhook event. Please see https://taddy.org/developers/podcast-api/webhooks for a full list of valid events.`);
  }else if(!uuid) {
    throw new Error("You must pass in a uuid as the second argument");
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
  'itunesinfo.created', 'itunesinfo.updated', 'itunesinfo.deleted',
  'podcastepisode.created', 'podcastepisode.updated', 'podcastepisode.deleted'
])

function getQuery({ taddyType }){
  switch(taddyType) {
    case 'podcastseries':
      return taddyQuery.GET_PODCASTSERIES;
    case 'podcastepisode':
      return taddyQuery.GET_PODCASTEPISODE;
    case 'itunesinfo':
      return taddyQuery.GET_ITUNESINFO;
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
    default:
      throw new Error(`ERROR in getDataProperty: taddyType: ${taddyType} is not supported`);
  }
}

function createMockWebhookEvent({ data, taddyType, action, uuid}){
  const dataForEvent = get(data, getDataProperty({ taddyType }), null);
  if (!dataForEvent) {
    throw new Error(`ERROR in createMockWebhookEvent: no data returned for taddyType: ${taddyType} and uuid: ${uuid}. Usually this means the uuid is not correct.`);
  }
  return {
    uuid,
    taddyType,
    action,
    timestamp: Math.floor(Date.now()/1000),
    data: dataForEvent,
  }
}

async function sendMockEventToEndpointUrl({ mockEvent, endpointUrl }) {
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
    console.log('sendMockEventToEndpointUrl error sending to ', endpointUrl, error && error.message);
  }
}

run();
