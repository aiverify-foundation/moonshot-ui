'use client';
import React from 'react';
import { getAllBookmarks } from '@/actions/getAllBookmarks';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { LoadingAnimation } from '@/app/components/loadingAnimation';
import { Modal } from '@/app/components/modal';
import { TextInput } from '@/app/components/textInput';
import { colors } from '@/app/customColors';
import { formatDate } from '@/app/lib/date-utils';
import { ColorCodedTemplateString } from './color-coded-template';

type ViewBookmarksModalProps = {
  onCloseIconClick: () => void;
  onPrimaryBtnClick: (preparedPrompt: string) => void;
};

function ViewBookmarksModal(props: ViewBookmarksModalProps) {
  const { onCloseIconClick, onPrimaryBtnClick } = props;
  const [bookmarks, setBookmarks] = React.useState<BookMark[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedBookmark, setSelectedBookmark] = React.useState<
    BookMark | undefined
  >();
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    async function callServerAction() {
      startTransition(async () => {
        const result = await getAllBookmarks();
        if (result.status === 'success') {
          setBookmarks(result.data);
        }
      });
    }
    callServerAction();
  }, []);

  const filteredBookmarks = bookmarks
    ? bookmarks.filter((bookmark) =>
        bookmark.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  function handlePrimaryBtnClick() {
    if (selectedBookmark) {
      onPrimaryBtnClick(selectedBookmark.prepared_prompt);
    }
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  React.useEffect(() => {
    if (bookmarks && bookmarks.length) {
      setSelectedBookmark(bookmarks[0]);
    }
  }, [bookmarks]);

  let detailsSection: React.ReactNode;

  if (selectedBookmark) {
    detailsSection = (
      <section
        className="text-white border border-moonwine-500 p-4 rounded-md 
            overflow-y-auto custom-scrollbar bg-moongray-800 h-full">
        <div className="flex gap-2 mb-4">
          <Icon
            name={IconName.Ribbon}
            size={24}
          />
          <h3 className="text-[1.3rem] font-semibold text-white">
            {selectedBookmark.name}
          </h3>
        </div>
        <p className="text-[0.95rem] text-moongray-300">
          Created on: {formatDate(selectedBookmark.bookmark_time)}
        </p>
        <h4 className="text-[1rem] font-semibold mt-10 mb-1">
          Prepared Prompt
        </h4>
        <p className="text-[0.95rem] text-moongray-300">
          {selectedBookmark.prepared_prompt}
        </p>
        <h4 className="text-[1rem] font-semibold mt-10 mb-1">Prompt</h4>
        <p className="text-[0.95rem] text-moongray-300">
          {selectedBookmark.prompt}
        </p>
        <h4 className="text-[1rem] font-semibold mt-10 mb-1">
          Prompt Template
        </h4>
        {selectedBookmark.prompt_template ? (
          <ColorCodedTemplateString
            fontColor={colors.moongray['300']}
            placeHolderColor="#f87171"
            template={selectedBookmark.prompt_template}
          />
        ) : (
          <p>No prompt template</p>
        )}
        <h4 className="text-[1rem] font-semibold mt-10 mb-1">Response</h4>
        <p className="text-[0.95rem] text-moongray-300">
          {selectedBookmark.response}
        </p>
        <h4 className="text-[1rem] font-semibold mt-10 mb-1">
          Context Strategy
        </h4>
        <p className="text-[0.95rem] text-moongray-300">
          {selectedBookmark.context_strategy
            ? selectedBookmark.context_strategy
            : 'No context strategy'}
        </p>
        <h4 className="text-[1rem] font-semibold mt-10 mb-1">Attack Module</h4>
        <p className="text-[0.95rem] text-moongray-300">
          {selectedBookmark.attack_module
            ? selectedBookmark.attack_module
            : 'No attack module'}
        </p>
      </section>
    );
  }

  const bookmarksList = (
    <ul
      className="divide-y divide-moongray-700 pr-1
        overflow-y-auto custom-scrollbar">
      {filteredBookmarks.map((bookmark) => {
        const isSelected =
          selectedBookmark && selectedBookmark.name === bookmark.name;
        return (
          <li
            key={bookmark.name}
            className="flex gap-4 p-6 bg-moongray-900 text-white hover:bg-moongray-800 
            hover:border-moonwine-700 cursor-pointer"
            style={{
              transition: 'background-color 0.2s ease-in-out',
              ...(isSelected && {
                backgroundColor: colors.moongray['700'],
              }),
            }}
            onClick={() => setSelectedBookmark(bookmark)}>
            <header className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Icon name={IconName.Ribbon} />
                <h3 className="text-[0.87rem] text-white">{bookmark.name}</h3>
              </div>
            </header>
          </li>
        );
      })}
    </ul>
  );

  const searchTextbox = (
    <div className="relative">
      <TextInput
        name="search"
        placeholder="Search by name"
        value={searchQuery}
        onChange={handleSearch}
      />
      <Icon
        role="button"
        ariaLabel="Clear search"
        style={{
          position: 'absolute',
          right: 8,
          top: 7,
        }}
        name={IconName.Close}
        size={20}
        onClick={() => setSearchQuery('')}
        color={colors.black}
      />
    </div>
  );

  return (
    <Modal
      top={-200}
      left={400}
      width={900}
      height={500}
      enableScreenOverlay
      overlayOpacity={0.8}
      bgColor={colors.moongray['800']}
      textColor="#FFFFFF"
      heading="Bookmarks"
      onCloseIconClick={onCloseIconClick}
      primaryBtnLabel="Use"
      secondaryBtnLabel="Cancel"
      onPrimaryBtnClick={
        !isPending && bookmarks.length ? handlePrimaryBtnClick : undefined
      }
      onSecondaryBtnClick={onCloseIconClick}>
      {isPending ? (
        <LoadingAnimation />
      ) : (
        <main
          className="flex gap-5 mb-3 w-full"
          style={{
            height: 'calc(100% - 90px)',
          }}>
          {!isPending && !bookmarks.length ? (
            <p>No bookmarks found</p>
          ) : (
            <div className="flex gap-4 h-full w-full">
              <div className="flex flex-col flex-1">
                {searchTextbox}
                {bookmarksList}
              </div>
              <div className="flex-1">{detailsSection}</div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 p-4 z-10">
            <a href="/api/v1/bookmarks">
              <Button
                size="md"
                width={150}
                mode={ButtonType.OUTLINE}
                text="Export Bookmarks"
                hoverBtnColor={colors.moongray[1000]}
                pressedBtnColor={colors.moongray[900]}
              />
            </a>
          </div>
        </main>
      )}
    </Modal>
  );
}

export { ViewBookmarksModal };
