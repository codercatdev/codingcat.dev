import algoliasearch from 'algoliasearch';
import sanityClient from '@sanity/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { isValidRequest } from '@sanity/webhook';

import { config as sanityConfig, webhook } from '@/config/sanity';
import { config as algoliaConfig } from '@/config/algolia';

const algolia = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);
const sanity = sanityClient(sanityConfig);

/**
 *  This function receives webhook POSTs from Sanity and updates, creates or
 *  deletes records in the corresponding Algolia indices.
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.body);

  if (!isValidRequest(req, webhook.secret)) {
    res.status(401).json({ success: false, message: 'Invalid signature' });
    return;
  }
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400);
    res.json({ message: 'Bad request' });
    return;
  }
  const publishedAt = req.body?.publishedAt;
  let publish = false;
  if (publishedAt) {
    publish = publishedAt < new Date().toISOString();
  }
  console.log('Published: ', publish);

  // Configure this to match an existing Algolia index name
  const algoliaIndex = algolia.initIndex(algoliaConfig.index);
  try {
    let result;
    if (req.body?.deleted) {
      // remove if doc removed
      result = await algoliaIndex.deleteObject(req.body?.deleted);
    } else if (req.body?.updated && !publish) {
      // remove if not published after update
      result = await algoliaIndex.deleteObject(req.body?.updated);
    } else if (publish) {
      // create when in publish state
      result = await algoliaIndex.saveObject(req.body);
    }
    console.log(result ? `Result: ${JSON.stringify(result)}` : 'Nothing Done.');
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.json({ message: 'Error check logs' });
    res.status(500).end();
  }
};

export default handler;