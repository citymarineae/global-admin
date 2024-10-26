"use client";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface SubItem {
  name: string;
  href: string;
}

interface AccordionItemProps {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subItems: SubItem[];
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ name, icon: Icon, subItems, isOpen, onToggle }) => {
  return (
    <li>
      <button
        onClick={onToggle}
        className={`w-full group flex items-center justify-between gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
          isOpen ? "bg-gray-50 text-primary" : "text-gray-700 hover:bg-gray-50 hover:text-primary"
        }`}
      >
        <div className="flex items-center gap-x-3">
          <Icon
            className={`h-6 w-6 shrink-0 ${isOpen ? "text-primary" : "text-gray-400 group-hover:text-primary"}`}
            aria-hidden="true"
          />
          {name}
        </div>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
      {isOpen && (
        <ul className="mt-1 space-y-1 pl-9">
          {subItems.map((subItem) => (
            <li key={subItem.name}>
              <a
                href={subItem.href}
                className="block rounded-md py-2 pl-3 pr-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary"
              >
                {subItem.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default AccordionItem;
