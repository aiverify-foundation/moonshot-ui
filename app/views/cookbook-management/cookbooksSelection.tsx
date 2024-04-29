import { Icon, IconName } from '@/app/components/IconSVG';
import { Button, ButtonType } from '@/app/components/button';
import { colors } from '@/app/views/shared-components/customColors';
import { PopupSurface } from '@/app/views/shared-components/popupSurface.tsx/popupSurface';
import { TabsBar, TabItem } from '@/app/views/shared-components/tabsBar';
import { useState } from 'react';
import { CookbookAbout } from './cookbookAbout';

const tabItems: TabItem[] = [
  { id: 'quality', label: 'Quality' },
  { id: 'capability', label: 'Capability' },
  { id: 'trustsafety', label: 'Trust & Safety' },
  { id: 'others', label: 'Others' },
];

const mockCookbooksQuality: Cookbook[] = [
  {
    id: '1',
    name: 'English Language',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    recipes: [
      {
        id: '1',
        name: 'Recipe 1',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        id: '1',
        name: 'Recipe 2',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        id: '1',
        name: 'Recipe 3',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
    ],
  },
  {
    id: '2',
    name: 'Tamil Language',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
    recipes: [
      {
        id: '1',
        name: 'Recipe 2',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        id: '1',
        name: 'Recipe 2',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
      {
        id: '1',
        name: 'Recipe 3',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
    ],
  },
  {
    id: '3',
    name: 'Hugging Face OpenLLM Leaderboard',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
    recipes: [],
  },
];

const mockCookbooksCapability: CookbookWithRecipe[] = [
  {
    id: '1',
    name: 'Cookbook Capability 1',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    recipes: [
      {
        id: '1',
        name: 'Recipe 1',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
    ],
  },
  {
    id: '2',
    name: 'Cookbook Capability 2',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
    recipes: [],
  },
  {
    id: '3',
    name: 'Cookbook Capability 3',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
    recipes: [],
  },
];

type Props = {
  onClose: () => void;
};

type CookbookItemProps = {
  cookbook: CookbookWithRecipe;
  selected: boolean;
  onSelect: (cookbook: CookbookWithRecipe) => void;
  onAboutClick: (cookbook: CookbookWithRecipe) => void;
};

function CookbookItem(props: CookbookItemProps) {
  const { cookbook, selected, onSelect, onAboutClick } = props;
  const [isSelected, setIsSelected] = useState(selected);

  function handleClick() {
    setIsSelected(!isSelected);
    onSelect(cookbook);
  }

  return (
    <li
      className="flex flex-col gap-2 border rounded-lg p-6 cursor-pointer border-moongray-800
      text-white hover:bg-moongray-800 hover:border-moonpurple text-[0.9rem] mb-[15px]"
      style={{
        flexBasis: '49%',
        ...(isSelected
          ? {
              backgroundColor: colors.moongray['800'],
              borderColor: colors.moonpurple,
            }
          : {}),
      }}
      onClick={handleClick}>
      <header className="flex flex-basis-[100%] justify-between">
        <div className="flex gap-2 text-white">
          <Icon name={IconName.Book} />
          <h3 className="font-bold">{cookbook.name}</h3>
        </div>
        <input
          type="checkbox"
          className="w-2 h-2 shrink-0"
          checked={isSelected}
          onChange={handleClick}
        />
      </header>
      <p>{cookbook.description}</p>
      <footer className="flex justify-between">
        <p>7,900 prompts</p>
        <span
          className="decoration-1 underline cursor-pointer"
          onClick={() => onAboutClick(cookbook)}>
          About
        </span>
      </footer>
    </li>
  );
}

function CookbooksSelection(props: Props) {
  const { onClose } = props;
  const [activeTab, setActiveTab] = useState('quality');
  const [cookbookDetails, setCookbookDetails] = useState<
    CookbookWithRecipe | undefined
  >();

  function handleTabClick(id: string) {
    setActiveTab(id);
  }

  function handleCookbookSelect(cb: Cookbook) {
    console.log(cb);
  }

  function handleAboutClick(cb: Cookbook) {
    console.log(cb);
    setCookbookDetails(cb);
  }

  const cookbooks =
    activeTab === 'quality' ? mockCookbooksQuality : mockCookbooksCapability;

  const categoryDesc =
    activeTab === 'quality'
      ? "Quality evaluates the model's ability to consistently produce content that meets general correctness and application-specific standards."
      : "Capability assesses the AI model's ability to perform within the context of the unique requirements and challenges of a particular domain or task.";

  return (
    <div className="flex flex-col pt-4 w-full h-full">
      {cookbookDetails ? (
        <PopupSurface
          height="100%"
          padding="0px"
          onCloseIconClick={() => setCookbookDetails(undefined)}>
          <CookbookAbout
            cookbook={cookbookDetails}
            checked
          />
        </PopupSurface>
      ) : (
        <PopupSurface
          height="100%"
          onCloseIconClick={onClose}
          headerContent={
            <section className="flex items-center justify-flex-start gap-5">
              <TabsBar
                tabItems={tabItems}
                barColor={colors.moongray['800']}
                selectedTabColor={colors.moonpurple}
                activeTabId={activeTab}
                onTabClick={handleTabClick}
              />
            </section>
          }>
          <section className="flex flex-col gap-7 pt-6 px-8">
            <p className="text-white">{categoryDesc}</p>
            <ul
              className="flex flex-row flex-wrap gap-[2%] w-[100%] overflow-y-auto custom-scrollbar px-4"
              style={{ height: 'calc(100% - 50px)' }}>
              {cookbooks.map((cookbook) => (
                <CookbookItem
                  key={cookbook.id}
                  cookbook={cookbook}
                  selected={false}
                  onSelect={handleCookbookSelect}
                  onAboutClick={handleAboutClick}
                />
              ))}
            </ul>
          </section>
          <footer className="absolute bottom-0 flex justify-between items-center bg-moonpurple p-2 px-5 rounded-b-2xl w-full text-white">
            <div className="flex gap-5">
              <div className="flex flex-col justify-center">
                <div className="text-[1rem] leading-[1.1rem] text-end">
                  Estimated time
                </div>
                <div className="text-[0.8rem] leading-[1.1rem] text-moongray-300 text-end">
                  assuming <span className="decoration-1 underline">10s</span>{' '}
                  per prompt
                </div>
              </div>
              <div className="flex">
                <h3 className="text-[2.4rem] font-bolder tracking-wide leading-[3rem] text-white mb-0">
                  13
                  <span className="text-[1.1rem] leading-[1.1rem] text-moongray-300">
                    hrs
                  </span>
                  48
                  <span className="text-[1.1rem] leading-[1.1rem] text-moongray-300">
                    mins
                  </span>
                </h3>
              </div>
            </div>
            <span className="text-[1.5rem] decoration-1 underline text-white cursor-pointer">
              OK
            </span>
          </footer>
        </PopupSurface>
      )}
    </div>
  );
}

export { CookbooksSelection };
