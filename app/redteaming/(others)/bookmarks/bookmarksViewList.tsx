'use client';
import React, { CSSProperties, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { MainSectionSurface } from '@/app/components/mainSectionSurface';
import { colors } from '@/app/customColors';

interface CustomStyle extends CSSProperties {
  WebkitLineClamp?: string;
  WebkitBoxOrient?: 'vertical';
}
const ellipsisStyle: CustomStyle = {
  display: '-webkit-box',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical',
};

function BookmarksViewList({ bookmarks }: { bookmarks: BookMark[] }) {
  const [selectedBookmark, setSelectedBookmark] = useState<BookMark | undefined>(
    bookmarks && bookmarks.length > 0 ? bookmarks[0] : undefined
  );

  const hasBookmarks = bookmarks && bookmarks.length > 0;

  return (
    <MainSectionSurface
      closeLinkUrl="/"
      height="100%"
      bgColor={colors.moongray['950']}>
      <div className="relative h-full">
        <header className="flex gap-5 w-full mb-3 justify-between items-end">
          <h1 className="text-[1.6rem] text-white mt-3">Bookmarks</h1>
        </header>
        <main
          className="grid grid-cols-2 gap-5 mb-3"
          style={{ height: 'calc(100% - 140px)' }}>
          <ul className="divide-y divide-moongray-700 pr-1 overflow-y-auto custom-scrollbar">
            {hasBookmarks ? (
              bookmarks.map((bm) => {
                const isSelected =
                  selectedBookmark &&
                  bm.name === selectedBookmark.name &&
                  bm.bookmark_time === selectedBookmark.bookmark_time;
                return (
                  <li
                    key={bm.bookmark_time}
                    className="p-6 bg-moongray-900 text-white hover:bg-moongray-800 
                    hover:border-moonwine-700 cursor-pointer"
                    style={{
                      transition: 'background-color 0.2s ease-in-out',
                      ...(isSelected && {
                        backgroundColor: colors.moongray['700'],
                      }),
                    }}
                    onClick={() => setSelectedBookmark(bm)}>
                    <div className="flex gap-2 mb-2">
                      <Icon name={IconName.Ribbon} />
                      <h4 className="text-[1rem] font-semibold">{bm.name}</h4>
                    </div>
                    <p
                      className="text-[0.8rem] h-[40px] overflow-hidden text-moongray-400 break-all break-words"
                      style={ellipsisStyle}>
                      {bm.prompt}
                    </p>
                  </li>
                );
              })
            ) : (
              <li className="p-6 text-moongray-400 text-center">No bookmark added</li>
            )}
          </ul>
          <section className="text-white border border-moonwine-500 p-4 rounded-md overflow-y-auto custom-scrollbar bg-moongray-800">
            {hasBookmarks && selectedBookmark ? (
              <>
                <div className="flex gap-2 mb-4">
                  <Icon
                    name={IconName.Ribbon}
                    size={24}
                  />
                  <h3 className="text-[1.2rem] font-semibold">
                    {selectedBookmark.name}
                  </h3>
                </div>
                <p className="text-[0.8rem] mb-4 text-moongray-300">
                  Bookmarked at {selectedBookmark.bookmark_time}
                </p>
                <h4 className="text-[1.15rem] font-semibold mt-10 mb-2">Prompt</h4>
                <p className="text-[0.95rem] mb-4 text-moongray-300">
                  {selectedBookmark.prompt}
                </p>
                <h4 className="text-[1.15rem] font-semibold mt-10 mb-2">
                  Prepared Prompt
                </h4>
                <p className="text-[0.95rem] mb-4 text-moongray-300">
                  {selectedBookmark.prepared_prompt}
                </p>
                <h4 className="text-[1.15rem] font-semibold mt-10 mb-2">
                  Response
                </h4>
                <p className="text-[0.95rem] mb-4 text-moongray-300">
                  {selectedBookmark.response}
                </p>
                <h4 className="text-[1.15rem] font-semibold mt-10 mb-2">
                  Prompt Template
                </h4>
                <p className="text-[0.95rem] mb-4 text-moongray-300">
                  {selectedBookmark.prompt_template || 'None'}
                </p>
                <h4 className="text-[1.15rem] font-semibold mt-10 mb-2">
                  Context Strategy
                </h4>
                <p className="text-[0.95rem] mb-4 text-moongray-300">
                  {selectedBookmark.context_strategy || 'None'}
                </p>
                <h4 className="text-[1.15rem] font-semibold mt-10 mb-2">
                  Attack Module
                </h4>
                <p className="text-[0.95rem] mb-4 text-moongray-300">
                  {selectedBookmark.attack_module || 'None'}
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Icon name={IconName.Ribbon} size={40} color={colors.moongray[400]} />
                <p className="text-moongray-400 mt-4 text-lg">No bookmark added</p>
              </div>
            )}
          </section>
        </main>
        <footer className="absolute bottom-0 w-full flex justify-end gap-4">
          <a href="/api/v1/bookmarks">
            <Button
              size="lg"
              mode={ButtonType.PRIMARY}
              text="Export Bookmarks"
              hoverBtnColor={colors.moongray[1000]}
              pressedBtnColor={colors.moongray[900]}
            />
          </a>
        </footer>
      </div>
    </MainSectionSurface>
  );
}

export { BookmarksViewList };
