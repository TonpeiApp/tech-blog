import { searchArticles } from '@/lib/newt';
import Link from 'next/link';
import { NextPage } from 'next';

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

const Page: NextPage<PageProps> = async ({ searchParams }) => {
  const { q = '' } = await searchParams;
  const articles = await searchArticles(q);

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">「{q}」の検索結果</h1>

      {articles.length > 0 ? (
        articles.map((article) => (
          <div key={article._id} className="bg-gray-50 shadow-md rounded-lg overflow-hidden mb-6">
            <div className="p-5">
              {/* タイトルの上に著者名と作成日 */}
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span className="font-medium">著者: {article.author.fullName}</span>
                <span className="font-medium">
                  作成日: {new Date(article._sys.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* タイトル */}
              <Link
                href={`articles/${article.slug}`}
                className="sm:text-2xl text-xl font-semibold text-gray-700 hover:text-gray-900 mb-3 block"
              >
                {article.title}
              </Link>

              {/* タイトル下にタグ */}
              <div className="flex flex-wrap space-x-2">
                {article.tags.length > 0 ? (
                  article.tags.map((tag) => (
                    <span
                      key={tag._id}
                      className="text-xs font-medium text-white bg-gray-700 rounded px-2 py-1"
                    >
                      {tag.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs font-medium text-gray-500">No Tags</span>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">検索結果が見つかりませんでした。</p>
      )}
    </div>
  );
};

export default Page;
