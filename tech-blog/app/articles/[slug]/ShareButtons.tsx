'use client';

import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LineShareButton,
  LineIcon,
} from 'next-share';

export default function ShareButtons() {
  return (
    <aside className="lg:w-16 flex-shrink-0">
      <div className="hidden lg:sticky lg:top-3 lg:flex lg:flex-col lg:items-center lg:space-y-4">
        {/* デスクトップ用の縦並び表示 */}
        <FacebookShareButton
          url={'https://github.com/next-share'}
          quote={'next-share is a social share buttons for your next React apps.'}
          hashtag={'#nextshare'}
          aria-label="Share on Facebook"
        >
          <FacebookIcon size={40} round />
        </FacebookShareButton>
        <TwitterShareButton
          url={'https://github.com/next-share'}
          title={'next-share is a social share buttons for your next React apps.'}
          aria-label="Share on Twitter"
        >
          <TwitterIcon size={40} round />
        </TwitterShareButton>
        <LineShareButton
          url={'https://github.com/next-share'}
          title={'next-share is a social share buttons for your next React apps.'}
          aria-label="Share on Line"
        >
          <LineIcon size={40} round />
        </LineShareButton>
      </div>

      {/* スマホ用の横並び表示 */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 flex justify-center gap-20 py-2 lg:hidden">
        <FacebookShareButton
          url={'https://github.com/next-share'}
          quote={'next-share is a social share buttons for your next React apps.'}
          hashtag={'#nextshare'}
          aria-label="Share on Facebook"
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton
          url={'https://github.com/next-share'}
          title={'next-share is a social share buttons for your next React apps.'}
          aria-label="Share on Twitter"
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <LineShareButton
          url={'https://github.com/next-share'}
          title={'next-share is a social share buttons for your next React apps.'}
          aria-label="Share on Line"
        >
          <LineIcon size={32} round />
        </LineShareButton>
      </div>
    </aside>
  );
}
