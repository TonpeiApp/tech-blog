import { load } from 'cheerio';
import hljs from 'highlight.js';
import { getArticleBySlug } from '@/lib/newt';
import type { Metadata } from 'next';
import type { Article } from '@/types/article';
import 'highlight.js/styles/github-dark.css';
import ShareButtons from './ShareButtons';
import Image from 'next/image';
import { format } from 'date-fns';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  return {
    title: article?.title,
    description: '投稿詳細ページです',
  };
}

export default async function Article({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return;

  const headings: string[] = [];

  const $ = load(article.contents2);
  $('h2').each((_, elm) => {
    const text = $(elm).text();
    headings.push(text);
    $(elm).contents().wrap(`<a id="${text}" href="#${text}"></a>`);
  });
  $('pre code').each((_, elm) => {
    const className = $(elm).attr('class');
    const classList = className ? className.split(':') : [];
    const language = classList[0]?.replace('language-', '');
    const fileName = classList[1];

    let result;
    if (language) {
      try {
        result = hljs.highlight($(elm).text(), { language });
      } catch {
        result = hljs.highlightAuto($(elm).text());
      }
    } else {
      result = hljs.highlightAuto($(elm).text());
    }
    $(elm).html(result.value);
    $(elm).addClass('hljs');

    if (fileName) {
      $(elm).parent().before(`<div><span>${fileName}</span></div>`);
    }
  });
  article.contents2 = $.html();

  console.log('カバー画像', article.coverImage.src);

  return (
    <main className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row space-y-8 lg:space-x-16 lg:space-y-0">
        {/* 左端の共有セクション */}
        <ShareButtons />
        <div className="flex-1 lg:w-[65%] bg-white shadow-lg rounded-lg p-4">
          <div className="mb-8 pb-4">
            {/* プロフィール画像と名前の表示 */}
            <div className="flex items-center mb-4">
              <div className="relative w-10 h-10 mr-3">
                {/* プロフィール画像 */}
                {article.author.profileImage ? (
                  <Image
                    src={article.author.profileImage.src}
                    alt={`${article.author.fullName}のプロフィール画像`}
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
              <p className="text-base font-bold text-gray-800 mb-2">{article.author.fullName}</p>
            </div>
            {/* Tag */}
            <div className="flex space-x-2 text-xs">
              {article.tags.length > 0 ? (
                article.tags.map((tag) => (
                  <p key={tag._id} className="text-gray-700 bg-gray-200 rounded px-2 py-1">
                    {tag.name}
                  </p>
                ))
              ) : (
                <p className="text-gray-700 bg-gray-200 rounded px-2 py-1">No Tags</p>
              )}
            </div>

            {/* 作成日 */}
            <time className="mt-3 text-sm text-gray-400 flex space-x-6">
              <div className="flex items-center space-x-2">
                <p className="font-medium">投稿日</p>
                <p>{format(new Date(article._sys.createdAt), 'yyyy年MM月dd日')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="font-medium">最終更新日</p>
                <p>{format(new Date(article._sys.updatedAt), 'yyyy年MM月dd日')}</p>
              </div>
            </time>
            {/* 記事タイトル */}
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-800">{article.title}</h1>
          </div>

          {/* 目次セクション */}
          <div className="lg:hidden mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">目次</h2>
            <ul className="mt-4 space-y-2">
              {headings.map((text, index) => (
                <li key={index}>
                  <a href={`#${text}`} className="text-blue-600 hover:text-blue-800">
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 記事内容 */}
          <section
            className="prose prose-lg max-w-none leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{ __html: article.contents2 }}
          />
        </div>

        {/* 全画面での右側の目次セクション */}
        <aside className="hidden lg:block flex-shrink-0">
          <div className="sticky top-3 flex flex-col items-center space-y-4">
            <div className="bg-white p-4 shadow-md rounded-md w-60">
              <h2 className="text-xl font-semibold text-gray-800">目次</h2>
              <ul className="mt-4 space-y-2">
                {headings.map((text, index) => (
                  <li key={index}>
                    <a href={`#${text}`} className="text-blue-600 hover:text-blue-800">
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
