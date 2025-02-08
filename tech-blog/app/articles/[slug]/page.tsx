import { load } from 'cheerio';
import hljs from 'highlight.js';
import { getArticleBySlug, getRelatedArticlesByTags } from '@/lib/newt';
import type { Metadata } from 'next';
import type { Article } from '@/types/article';
import 'highlight.js/styles/github-dark.css';
import ShareButtons from './ShareButtons';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
import { addCopyButtonsToCodeBlocks } from '@/utils/codeBlock';
import Script from 'next/script';

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

// 関連記事を取得する関数
async function getRelatedArticles(currentArticle: Article): Promise<Article[]> {
  const tagIds = currentArticle.tags.map((tag) => tag._id);
  return await getRelatedArticlesByTags(tagIds, currentArticle._id);
}

// 関連記事カードコンポーネント
function RelatedArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} className="block group">
      <div className="bg-gray-50 p-4 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200">
        <div className="flex items-center mb-3">
          <div className="relative w-8 h-8 mr-2">
            {article.author.profileImage ? (
              <Image
                src={article.author.profileImage.src}
                alt={`${article.author.fullName}のプロフィール画像`}
                layout="fill"
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-300 rounded-full text-xs">
                No Image
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600">{article.author.fullName}</p>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-800 transition-colors duration-200">
          {article.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag._id}
              className="text-xs text-gray-600 bg-gray-200 rounded-full px-3 py-1"
            >
              {tag.name}
            </span>
          ))}
        </div>
        <time className="mt-3 text-xs text-gray-500 block">
          {format(new Date(article._sys.createdAt), 'yyyy年MM月dd日')}
        </time>
      </div>
    </Link>
  );
}

// 関連記事セクションコンポーネント
function RelatedArticlesSection({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">関連記事</h2>
      <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="grid gap-4 md:grid-cols-1">
          {articles.map((article) => (
            <RelatedArticleCard key={article._id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function Article({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return;
  article.contents2 = addCopyButtonsToCodeBlocks(article.contents2);

  // 関連記事を取得
  const relatedArticles = await getRelatedArticles(article);
  const headings: string[] = [];
  const $ = load(article.contents2);

  $('h2').each((_, elm) => {
    const text = $(elm).text();
    headings.push(text);
    $(elm).contents().wrap(`<a id="${text}" href="#${text}"></a>`);
  });

  // コピー機能のスクリプトを先に定義
  const copyScript = `
    <script>
      // グローバルスコープに関数を定義
      window.copyCodeToClipboard = function(button) {
        const codeElement = button.parentElement.querySelector('code');
        const textToCopy = codeElement.textContent;
        
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            // Success feedback
            button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
            setTimeout(() => {
              button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
            }, 2000);
          })
          .catch(err => console.error('Failed to copy:', err));
      }
    </script>
  `;

  // スクリプトを先にHTMLに追加
  $('head').append(copyScript);

  // コードブロック処理
  $('pre').each((_, elm) => {
    const codeElement = $(elm);
    const codeContent = codeElement.text();

    // ハイライトの適用
    const highlighted = hljs.highlightAuto(codeContent);

    // 新しいHTML構造
    const newHtml = `
      <div class="relative group">
        <pre class="!mt-0"><code class="hljs">${highlighted.value}</code></pre>
        <button
          onclick="copyCodeToClipboard(this)"
          class="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700/50 text-gray-300 
                opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 
                hover:bg-gray-700/75 focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label="コードをクリップボードにコピー"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
    `;

    $(elm).replaceWith(newHtml);
  });

  // 最終的なHTMLを生成
  article.contents2 = $.html();
  return (
    <>
      <Script id="copy-code" strategy="afterInteractive">
        {`
          window.copyCodeToClipboard = function(button) {
            const codeElement = button.parentElement.querySelector('code');
            const textToCopy = codeElement.textContent;
            
            navigator.clipboard.writeText(textToCopy)
              .then(() => {
                // Success feedback
                button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
                setTimeout(() => {
                  button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                }, 2000);
              })
              .catch(err => console.error('Failed to copy:', err));
          };
        `}
      </Script>
      <main className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row space-y-8 lg:space-x-8 lg:space-y-0">
          {/* 左端の共有セクション */}
          <ShareButtons />

          {/* メインコンテンツ */}
          <div className="flex-1 lg:w-[65%]">
            {/* 記事本文 */}
            <div className="bg-white shadow-lg rounded-lg p-4 mb-8">
              <div className="mb-8 pb-4">
                {/* プロフィール画像と名前の表示 */}
                <div className="flex items-center mb-4">
                  <div className="relative w-10 h-10 mr-3">
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
                  <p className="text-base font-bold text-gray-800 mb-2">
                    {article.author.fullName}
                  </p>
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
                <time className="mt-3 text-xs lg:text-base text-gray-400 flex space-x-6">
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
                <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-800">
                  {article.title}
                </h1>
              </div>

              {/* 目次セクション（モバイル） */}
              <div className="lg:hidden mb-8">
                <h2 className="text-2xl font-semibold text-gray-800">目次</h2>
                <ul className="mt-4 space-y-2">
                  {headings.map((text, index) => (
                    <li key={index}>
                      <a
                        href={`#${text}`}
                        className="text-purple-800 duration-100 hover:bg-gray-200"
                      >
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
            {/* 関連記事 */}
            <div className="lg:hidden">
              <RelatedArticlesSection articles={relatedArticles} />
            </div>
          </div>

          {/* 右サイドバー（PC画面） */}
          <div className="w-max">
            {/* 目次の表示 */}
            <aside className="hidden lg:block flex-shrink-0 sticky top-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 shadow-md rounded-md w-72">
                  <h2 className="text-xl font-semibold text-gray-800">目次</h2>
                  <ul className="mt-4 space-y-2">
                    {headings.map((text, index) => (
                      <li key={index}>
                        <a
                          href={`#${text}`}
                          className="block w-full text-purple-800 duration-100 hover:bg-gray-200"
                        >
                          {text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* 関連記事表示 */}
                {relatedArticles.length > 0 && (
                  <div className="w-72">
                    <RelatedArticlesSection articles={relatedArticles} />
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
