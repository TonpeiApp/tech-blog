'use client';

import { useState } from 'react';
import { Button, Dialog, DialogPanel, Input } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Search } from 'lucide-react';

const navigation = [
  { name: 'トップ', href: '/' },
  { name: 'ホームページ', href: 'https://info.tompedia.jp/' },
  { name: 'お問い合わせ', href: '#' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img alt="" src="/icon.png" className="h-8 w-auto" />
          </Link>
        </div>

        {/* PC画面用：ナビゲーションリンク */}
        <div className="hidden lg:flex lg:gap-x-12 justify-center flex-grow">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm/6 font-semibold text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* スマホ画面用：検索フォーム中央揃え */}
        <div className="flex lg:hidden items-center justify-center space-x-4">
          <form
            action={async (data: FormData) => {
              const keyword = data.get('keyword') as string;

              const params = new URLSearchParams();
              params.append('q', keyword);

              redirect(`/search?${params.toString()}`);
            }}
            className="flex items-center space-x-2 border border-gray-300 rounded-md p-2 shadow-sm max-w-xs"
          >
            <Input
              autoComplete="off"
              name="keyword"
              className="flex-grow p-2 text-sm border-none focus:ring-0"
              placeholder="検索..."
            />
            <Button className="bg-blue-500 text-white rounded-md px-3 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Search size={20} />
            </Button>
          </form>
        </div>

        {/* スマホ画面用：ハンバーガーメニュー */}
        <div className="lg:hidden flex items-center justify-end">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>

        {/* PC画面用：検索フォームを右側に配置 */}
        <div className="hidden lg:flex items-center justify-end space-x-4">
          <form
            action={async (data: FormData) => {
              const keyword = data.get('keyword') as string;

              const params = new URLSearchParams();
              params.append('q', keyword);

              redirect(`/search?${params.toString()}`);
            }}
            className="flex items-center space-x-2 border border-gray-300 rounded-md p-2 shadow-sm"
          >
            <Input
              autoComplete="off"
              name="keyword"
              className="p-2 text-sm border-none focus:ring-0"
              placeholder="検索..."
            />
            <Button className="bg-blue-500 text-white rounded-md px-3 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Search size={20} />
            </Button>
          </form>
        </div>
      </nav>

      {/* モバイルメニュー（ハンバーガーを開くと表示） */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img alt="" src="/icon.png" className="h-8 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
