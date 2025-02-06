import Image from 'next/image';
import Link from 'next/link';
import { getArticles } from '@/lib/newt';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';

export const metadata: Metadata = {
  title: 'Newt・Next.jsブログ',
  description: 'NewtとNext.jsを利用したブログです',
};

const tagBackgrounds: { [key: string]: string } = {
  フロントエンド: 'from-green-400 via-green-500 to-green-600',
  バックエンド: 'from-blue-400 via-blue-500 to-indigo-600',
  インフラ: 'from-gray-400 via-gray-500 to-gray-600',
  非エンジニア: 'from-yellow-400 via-yellow-500 to-orange-500',
};

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const q = await searchParams;
  const currentPage = parseInt((q.page as string) || '1');
  const pageSize = 10;
  const articles = await getArticles(currentPage, pageSize);
  const totalCount = articles.total;

  return (
    <main className="bg-white py-8">
      <div className="container mx-auto">
        <h1 className="text-2xl lg:text-4xl font-bold text-center text-gray-800 mb-8">
          とんペディア BLOG
        </h1>
        {/* 記事リスト */}
        <div className="sm:flex sm:justify-center">
          <div className="grid grid-cols-1 lg:w-[70%] lg:grid-cols-2 gap-8">
            {articles.items.map((article) => (
              <div key={article._id} className="flex flex-col relative w-full">
                <div
                  className={`bg-gradient-to-r ${
                    tagBackgrounds[article.tags[0]?.name] || 'from-gray-500 to-gray-700'
                  } p-6 flex flex-col sm:flex-row justify-between items-center h-60 relative w-full`}
                >
                  {/* 左側: タイトルとサブタイトル */}
                  <div className="flex-1">
                    <div className="absolute top-10 left-4 flex items-center">
                      <div>
                        <Image src={'/icon.png'} alt="" width={30} height={30} className="mr-2" />
                      </div>
                      <p className="font-mono text-xl text-white">tompedia TECH BLOG</p>
                    </div>
                    <Link
                      href={`articles/${article.slug}`}
                      className="px-4 text-2xl font-semibold text-white hover:underline absolute top-28 left-2"
                    >
                      {article.title}
                    </Link>
                  </div>

                  {/* 右側: アイコン画像 */}
                  <div className="w-20 h-20 sm:w-20 sm:h-20 flex-shrink-0 absolute top-3 right-3">
                    <Image
                      src={article.coverImage?.src || '/icon.png'}
                      alt={article.coverImage ? 'Cover Image' : 'Default Icon'}
                      width={80} // 必要に応じてサイズを調整
                      height={80}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    {/* プロフィール画像 */}
                    <div className="relative w-10 h-10 mr-3">
                      {article.author.profileImage?.src ? (
                        <Image
                          alt=""
                          src={article.author.profileImage.src}
                          layout="fill"
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-300 rounded-full">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* 著者名 */}
                    <h3 className="text-xl font-semibold">{article.author.fullName}</h3>
                  </div>

                  {/* 作成日 */}
                  <time className="mt-3 text-sm text-gray-400">
                    {format(new Date(article._sys.createdAt), 'yyyy年MM月dd日')}
                  </time>

                  {/* Tag */}
                  <div className="flex space-x-2 mt-2">
                    {article.tags.length > 0 ? (
                      article.tags.map((tag) => (
                        <p
                          key={tag._id}
                          className="text-white text-shadow bg-gray-800 rounded px-2 py-1"
                        >
                          {tag.name}
                        </p>
                      ))
                    ) : (
                      <p className="text-white text-shadow">No Tags</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="pt-10">
        <PaginationWithLinks page={currentPage} pageSize={pageSize} totalCount={totalCount} />
      </div>
    </main>
  );
}
