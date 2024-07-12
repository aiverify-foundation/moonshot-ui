'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { CSSProperties, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { colors } from '@/app/views/shared-components/customColors';
import { TextInput } from '@/app/components/textInput';

interface CustomStyle extends CSSProperties {
  webkitLineClamp?: string;
  webkitBoxOrient?: 'vertical';
}
const ellipsisStyle: CustomStyle = {
  display: '-webkit-box',
  webkitLineClamp: '2',
  webkitBoxOrient: 'vertical',
};

function CookbooksViewList({ cookbooks }: { cookbooks: Cookbook[] }) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCookbook, setSelectedCookbook] = useState<Cookbook>(() => {
    const id = searchParams.get('id');
    if (!Boolean(id)) {
      return cookbooks[0];
    }
    return cookbooks.find((cb) => cb.id === id) || cookbooks[0];
  });

  const filteredCookbooks = cookbooks.filter((cb) =>
    cb.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  return (
    <div className="h-full">
      <header className="flex gap-5 w-full mb-3 justify-between items-end">
        <h1 className="text-[1.6rem] text-white mt-3">Cookbooks</h1>
        <Link href={`/benchmarking/cookbooks/new`}>
          <Button
            size="md"
            mode={ButtonType.OUTLINE}
            leftIconName={IconName.Plus}
            text="Create New Cookbook"
            hoverBtnColor={colors.moongray[800]}
          />
        </Link>
      </header>
      <main
        className="flex gap-5 mb-3"
        style={{ height: 'calc(100% - 70px)' }}>
        <section className="flex flex-col flex-1">
          <div className="relative">
            <TextInput
              name="search"
              placeholder="Search by name"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Icon
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
          <ul
            className="divide-y divide-moongray-700 pr-1
              overflow-y-auto custom-scrollbar">
            {filteredCookbooks.map((cookbook) => {
              const isSelected = cookbook.id === selectedCookbook.id;
              return (
                <li
                  key={cookbook.id}
                  className="p-6 bg-moongray-900 text-white hover:bg-moongray-800 
                      hover:border-moonwine-700 cursor-pointer"
                  style={{
                    transition: 'background-color 0.2s ease-in-out',
                    ...(isSelected && {
                      backgroundColor: colors.moongray['700'],
                    }),
                  }}
                  onClick={() => setSelectedCookbook(cookbook)}>
                  <div className="flex gap-2 mb-2">
                    <Icon name={IconName.Book} />
                    <h4 className="text-[1rem] font-semibold">
                      {cookbook.name}
                    </h4>
                  </div>
                  <p
                    className="text-[0.8rem] h-[40px] overflow-hidden text-ellipsis text-moongray-400"
                    style={ellipsisStyle}>
                    {cookbook.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
        <section
          className="text-white border border-moonwine-500 p-4 rounded-md 
          overflow-y-auto custom-scrollbar bg-moongray-800 flex-1">
          <div className="flex gap-2 mb-4">
            <Icon
              name={IconName.Book}
              size={24}
            />
            <h3 className="text-[1.2rem] font-semibold">
              {selectedCookbook.name}
            </h3>
          </div>
          <p className="text-[0.95rem] text-moongray-300">
            {selectedCookbook.description}
          </p>
          <h4 className="text-[1.15rem] font-semibold mt-10 mb-1">Recipes</h4>
          <p className="text-[0.95rem] text-moongray-300">
            {selectedCookbook.recipes.map((recipe, idx) => {
              return (
                <span key={recipe}>
                  {recipe}
                  {idx === selectedCookbook.recipes.length - 1 ? '' : `,`}
                  &nbsp;
                </span>
              );
            })}
          </p>
        </section>
      </main>
    </div>
  );
}

export { CookbooksViewList };
