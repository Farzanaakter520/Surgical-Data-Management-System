"use client";

import { useState, useEffect } from "react";

interface Section {
  title: string;
  component: React.ReactNode;
}

interface CollapsibleSectionListProps {
  sections: Section[];
  initiallyOpen?: boolean; 
}

export default function CollapsibleSectionList({
  sections,
  initiallyOpen = true,
}: CollapsibleSectionListProps) {

  const [openSections, setOpenSections] = useState<Set<string>>(new Set());


  useEffect(() => {
    if (initiallyOpen) {
      const allTitles = sections.map((s) => s.title);
      setOpenSections(new Set(allTitles));
    }
  }, [sections, initiallyOpen]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title); 
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  return (
//     <div className="flex flex-col space-y-2 min-w-full">
//       {sections.map((section) => (
//         <div className="font-semibold text-green-500 mb-4 text-lg"key={section.title}>
//           <button
//             className="w-50 text-left px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 font-medium"
//             onClick={() => toggleSection(section.title)}
//           >
//             {section.title}
//           </button>

//           {openSections.has(section.title) && (
//             <div className="mt-2 ">{section.component}</div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
<div className="flex flex-col space-y-3 min-w-full">
  {sections.map((section) => (
    <div
      key={section.title}
      className="font-semibold text-blue-700 mb-4 text-lg"
    >
      <button
        onClick={() => toggleSection(section.title)}
        className="w-full text-left px-4 py-3 rounded-xl 
                   bg-gradient-to-r from-blue-50 to-blue-100/60 
                   hover:from-blue-100 hover:to-blue-200/70
                   border border-blue-200/60
                   shadow-sm hover:shadow-md 
                   font-medium text-blue-800
                   transition-all duration-300
                   backdrop-blur-md"
      >
        {section.title}
      </button>

      {openSections.has(section.title) && (
        <div
          className="mt-3 p-4 rounded-2xl bg-white/90 shadow-inner border border-blue-100"
        >
          {section.component}
        </div>
      )}
    </div>
  ))}
</div>
  );
}