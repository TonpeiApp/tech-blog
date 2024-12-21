import Image from 'next/image';
import Link from 'next/link';
import { getArticles } from '@/lib/newt';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import Pagination from './Pagination';

export const metadata: Metadata = {
  title: 'Newt・Next.jsブログ',
  description: 'NewtとNext.jsを利用したブログです',
};

export default async function Home() {
  const articles = await getArticles();
  const totalPages = 10; // 仮の値
  const currentPage = 1; // 仮の値

  return (
    <main className="bg-gray-100 py-8 px-4">
      <div className="container mx-auto">
        <h1 className="text-2xl lg:text-4xl font-bold text-center text-gray-800 mb-8">
          とんペディア BLOG
        </h1>

        {/* 記事リスト */}
        <div className="grid grid-cols-1 gap-8 lg:justify-items-center">
          {articles.map((article) => (
            <div
              key={article._id}
              className="lg:w-[50%] sm:w-full bg-white p-6 rounded-md shadow-md hover:shadow-lg transition-shadow"
            >
              {/* 著者情報 */}
              <div className="flex items-center mb-4">
                {/* プロフィール画像 */}
                <div className="relative w-10 h-10 mr-3">
                  {article.author.profileImage?.src ? (
                    <Image
                      alt={`${article.author.fullName} のプロフィール画像`}
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
              <br />

              {/* 記事タイトル */}
              <Link
                href={`articles/${article.slug}`}
                className="md:text-2xl text-xl font-semibold text-blue-600 hover:text-blue-800"
              >
                {article.title}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </main>
  );
}
