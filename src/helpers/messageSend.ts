import { type AtpAgent, RichText } from '@atproto/api';

export default async function messageSend(
  text: string,
  agent: AtpAgent,
  masto: any,
): Promise<void> {
  const rt = new RichText({ text });
  await rt.detectFacets(agent);

  await agent.post({
    text: rt.text,
    facets: rt.facets,
    langs: ['en', 'ja'],
  });

  await masto.v1.statuses.create({
    status: text,
    visibility: 'public',
  });
}
