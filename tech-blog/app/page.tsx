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
    <main className="bg-white py-8">
      <div className="container mx-auto">
        <h1 className="text-2xl lg:text-4xl font-bold text-center text-gray-800 mb-8">
          とんペディア BLOG
        </h1>

        {/* 記事リスト */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 lg:w-[70%] lg:grid-cols-2 gap-8">
            {articles.map((article) => (
              <div key={article._id} className="flex flex-col">
                <p>{article.tags[0].name}</p>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex flex-col justify-between h-40">
                  <p className="font-mono text-lg text-white mb-4">tompedia TECH BLOG</p>
                  {/* 記事タイトル */}
                  <Link
                    href={`articles/${article.slug}`}
                    className="text-2xl font-semibold text-white"
                  >
                    {article.title}
                  </Link>
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
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </main>
  );
}
