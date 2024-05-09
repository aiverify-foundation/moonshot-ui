function BookmarksList() {
  return (
    <div className="flex flex-col min-h-[300px]">
      <h3 className="mb-5 text-white">Bookmarks</h3>
      <ul className="list-none bg-white rounded-sm">
        <li className="p-1 border-b">
          <p>Bookmark 1</p>
        </li>
        <li className="p-1 border-b">
          <p>Bookmark 2</p>
        </li>
        <li className="p-1 border-b">
          <p>Bookmark 3</p>
        </li>
        <li className="p-1">
          <p>Bookmark 4</p>
        </li>
      </ul>
    </div>
  );
}

export { BookmarksList };
