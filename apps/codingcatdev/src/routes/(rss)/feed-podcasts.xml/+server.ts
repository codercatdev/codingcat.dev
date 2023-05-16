import { getContentTypeDirectory, listContent } from '$lib/server/content';
import { ContentType, type Content } from '$lib/types';
import { buildFeed } from '../rss';


const contentType = ContentType.post;

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
	const contentItems = (await listContent<Content>({
		contentItems: await getContentTypeDirectory<Content>(ContentType.podcast),
		limit: 10000
	})).content

	//xml rss feed response
	return new Response(
		buildFeed({
			contentType, contents: (await listContent({ contentItems, limit: 10000 })).content
		}).rss2(),
		{
			headers: {
				'content-type': 'application/rss+xml', 'cache-control': 'max-age=0, s-maxage=3600',
			},
		}
	)
}