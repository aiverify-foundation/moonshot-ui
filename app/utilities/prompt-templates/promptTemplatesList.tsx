'use client';
import { useSearchParams } from 'next/navigation';
import React, { CSSProperties, useState } from 'react';
import { Icon, IconName } from '@/app/components/IconSVG';
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

function PromptTemplatesList({ templates }: { templates: PromptTemplate[] }) {
  const searchParams = useSearchParams();
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate>(
    () => {
      const name = searchParams.get('name');
      if (!Boolean(name)) {
        return templates[0];
      }
      return templates.find((tp) => tp.name === name) || templates[0];
    }
  );

  return (
    <MainSectionSurface
      closeLinkUrl="/"
      height="100%"
      bgColor={colors.moongray['950']}>
      <div className="relative h-full">
        <header className="flex gap-5 w-full mb-3 justify-between items-end">
          <h1 className="text-[1.6rem] text-white mt-3">Prompt Templates</h1>
        </header>
        <main
          className="grid grid-cols-2 gap-5 mb-3"
          style={{ height: 'calc(100% - 90px)' }}>
          <ul className="divide-y divide-moongray-700 pr-1 overflow-y-auto custom-scrollbar">
            {templates.map((template) => {
              const isSelected = template.name === selectedTemplate.name;
              return (
                <li
                  key={template.name}
                  className="p-6 bg-moongray-900 text-white hover:bg-moongray-800 
                  hover:border-moonwine-700 cursor-pointer"
                  style={{
                    transition: 'background-color 0.2s ease-in-out',
                    ...(isSelected && {
                      backgroundColor: colors.moongray['700'],
                    }),
                  }}
                  onClick={() => setSelectedTemplate(template)}>
                  <div className="flex gap-2 mb-2">
                    <Icon name={IconName.MoonPromptTemplate} />
                    <h4 className="text-[1rem] font-semibold">
                      {template.name}
                    </h4>
                  </div>
                  <p
                    className="text-[0.8rem] h-[40px] overflow-hidden text-moongray-400 break-all break-words"
                    style={ellipsisStyle}>
                    {template.description}
                  </p>
                </li>
              );
            })}
          </ul>
          <section
            className="text-white border border-moonwine-500 p-4 rounded-md 
            overflow-y-auto custom-scrollbar bg-moongray-800">
            <div className="flex gap-2 mb-4">
              <Icon
                name={IconName.MoonPromptTemplate}
                size={24}
              />
              <h3 className="text-[1.2rem] font-semibold">
                {selectedTemplate.name}
              </h3>
            </div>
            <p className="text-[0.95rem] mb-4">
              {selectedTemplate.description}
            </p>
            <h4 className="text-[1.15rem] font-semibold mt-10 mb-2">
              Template
            </h4>
            <div className="text-[0.95rem] mb-4">
              <pre className="whitespace-pre-wrap">
                {selectedTemplate.template}
              </pre>
            </div>
          </section>
        </main>
      </div>
    </MainSectionSurface>
  );
}

export { PromptTemplatesList };
