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
    <header className="bg-white border-b-2 border-gray-200 backdrop-blur-sm bg-white/900 transition-all duration-300 hover:shadow-md">
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
        <div className="flex lg:hidden items-center justify-center w-[50%]">
          <form
            action={async (data: FormData) => {
              const keyword = data.get('keyword') as string;
              const params = new URLSearchParams();
              params.append('q', keyword);
              redirect(`/search?${params.toString()}`);
            }}
            className="relative w-full group"
          >
            <div className="relative flex items-center w-full">
              <Input
                autoComplete="off"
                name="keyword"
                className="w-full pl-4 pr-12 py-3 bg-transparent border-2 border-gray-200 
                        rounded-lg transition-all duration-300 ease-in-out
                        focus:border-gray-900 focus:ring-0 focus:outline-none
                        placeholder:text-gray-400 text-gray-900"
                placeholder="検索..."
              />
              <Button
                type="submit"
                className="absolute right-2 p-2 rounded-md 
                        bg-transparent hover:bg-gray-100 
                        transition-all duration-300 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <Search
                  size={20}
                  className="text-gray-500 group-hover:text-gray-900 
                            transition-colors duration-300"
                />
              </Button>
            </div>
            <div
              className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 
                        group-hover:w-full transition-all duration-300 ease-in-out"
            />
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
        <div className="hidden lg:flex items-center justify-end space-x-4 w-[25%]">
          <form
            action={async (data: FormData) => {
              const keyword = data.get('keyword') as string;
              const params = new URLSearchParams();
              params.append('q', keyword);
              redirect(`/search?${params.toString()}`);
            }}
            className="relative group w-96"
          >
            <div className="relative flex items-center w-full">
              <Input
                autoComplete="off"
                name="keyword"
                className="w-full pl-4 pr-12 py-2.5 bg-transparent border-2 border-gray-200 
                        rounded-lg transition-all duration-300 ease-in-out
                        focus:border-gray-900 focus:ring-0 focus:outline-none
                        placeholder:text-gray-400 text-gray-900 text-sm"
                placeholder="検索..."
              />
              <Button
                type="submit"
                className="absolute right-2 p-1.5 rounded-md 
                        bg-transparent hover:bg-gray-100 
                        transition-all duration-300 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <Search
                  size={18}
                  className="text-gray-500 group-hover:text-gray-900 
                            transition-colors duration-300"
                />
              </Button>
            </div>
            <div
              className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 
                        group-hover:w-full transition-all duration-300 ease-in-out"
            />
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
