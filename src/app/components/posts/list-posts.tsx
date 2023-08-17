import { url } from '@/app/utils/env';
import { Post } from '@prisma/client';

async function getPosts() {
  try {
    const res = await fetch(`${url}/api/posts`);

    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }

    return res.json();
  } catch (error) {
    throw new Error(`Failed to fetch: ${error}`);
  }
}

export default async function ListPosts() {
  const posts: Post[] = await getPosts();

  if (posts.length === 0 || !posts) return <p>No Posts found.</p>;

  return (
    <div className="pt-10 flex gap-20">
      {posts &&
        posts.map(
          post =>
            post.isPublished && (
              <div
                key={post.id}
                className="flex w-full justify-center items-center flex-col border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 dark:text-black"
              >
                {post.title}
                {post.content}
              </div>
            )
        )}
    </div>
  );
}