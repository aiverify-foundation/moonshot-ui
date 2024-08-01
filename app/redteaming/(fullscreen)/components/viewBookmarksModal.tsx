'use client';
import React from 'react';
import { getAllBookmarks } from '@/actions/getAllBookmarks';
import { Icon, IconName } from '@/app/components/IconSVG';
import { TextInput } from '@/app/components/textInput';
import { colors } from '@/app/views/shared-components/customColors';
import { Modal } from '@/app/views/shared-components/modal/modal';

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

  React.useEffect(() => {
    async function callServerAction() {
      const result = await getAllBookmarks();
      if (result.status === 'success') {
        setBookmarks(result.data);
      }
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
      <section className="p-2 bg-moongray-950 w-[480px]">
        <header className="flex flex-col gap-2 mb-4">
          <div className="flex gap-2">
            <Icon name={IconName.Ribbon} />
            <h3 className="text-[1rem] font-semibold text-white">
              {selectedBookmark.name}
            </h3>
          </div>
        </header>
      </section>
    );
  }

  const bookmarksList = (
    <ul>
      {filteredBookmarks.map((bookmark) => {
        const isSelected =
          selectedBookmark && selectedBookmark.name === bookmark.name;
        return (
          <li
            key={bookmark.name}
            className={`p-2 ${!isSelected && 'hover:bg-moongray-900'} active:bg-moongray-600 cursor-pointer 
          ${isSelected ? 'bg-moongray-950' : 'bg-moongray-700'}`}
            onClick={() => setSelectedBookmark(bookmark)}
            style={{
              transition: 'background-color 0.2s ease-in-out',
            }}>
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
      width="auto"
      height={600}
      enableScreenOverlay
      overlayOpacity={0.8}
      bgColor={colors.moongray['800']}
      textColor="#FFFFFF"
      heading="Bookmarks"
      onCloseIconClick={onCloseIconClick}
      primaryBtnLabel="use"
      secondaryBtnLabel="cancel"
      onPrimaryBtnClick={handlePrimaryBtnClick}>
      {!bookmarks.length ? (
        <p>No bookmarks found</p>
      ) : (
        <div className="flex gap-4 h-full">
          <div className="flex flex-col">
            {searchTextbox}
            {bookmarksList}
          </div>
          {detailsSection}
        </div>
      )}
    </Modal>
  );
}

export { ViewBookmarksModal };
