"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from "@headlessui/react";
import {
  Bars3Icon,
  DocumentDuplicateIcon,
  HomeIcon,
  IdentificationIcon,
  NewspaperIcon,
  Square2StackIcon,
  UsersIcon,
  XMarkIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import AccordionItem from "../AccordianItem";

const navigationItems = [
  {
    name: "Home",
    href: "/admin/dashboard",
    icon: HomeIcon,
    current: true,
  },
  {
    name: "About Us",
    href: "/admin/about",
    icon: IdentificationIcon,
    current: false,
  },
  { name: "Our Team", href: "/admin/team", icon: UsersIcon, current: false },
  {
    name: "Our Sectors",
    icon: Square2StackIcon,
    current: false,
    subItems: [
      { name: "Marine, Energy & Crewing", href: "/admin/sectors/marine" },
      { name: "Ports & Terminals", href: "/admin/sectors/ports-and-terminals" },
      { name: "Personal Lines", href: "/admin/sectors/personal-lines" },
    ],
  },
  {
    name: "Claims",
    href: "/admin/claims",
    icon: DocumentDuplicateIcon,
    current: false,
  },
  { name: "News", href: "/admin/news", icon: NewspaperIcon, current: false },
  { name: "Contact Us", href: "/admin/contact-us", icon: PhoneIcon, current: false },
];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

interface AdminPanelLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export default function AdminPanelLayout({ children, currentPage }: AdminPanelLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navigation, setNavigation] = useState(navigationItems);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (currentPage) {
      setNavigation(
        navigationItems.map((item) =>
          item.href === currentPage ? { ...item, current: true } : { ...item, current: false }
        )
      );
    }
  }, [currentPage]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div className="flex h-16 shrink-0 items-center">
                  <Image alt="Your Company" src="/logo/logo.svg" className="h-8 w-auto" height={10} width={10} />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            {item.subItems ? (
                              <AccordionItem
                                name={item.name}
                                icon={item.icon}
                                subItems={item.subItems}
                                isOpen={openAccordion === item.name}
                                onToggle={() => setOpenAccordion(openAccordion === item.name ? null : item.name)}
                              />
                            ) : (
                              <a
                                href={item.href}
                                className={classNames(
                                  item.current
                                    ? "bg-gray-50 text-primary"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-primary",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                )}
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className={classNames(
                                    item.current ? "text-primary" : "text-gray-400 group-hover:text-primary",
                                    "h-6 w-6 shrink-0"
                                  )}
                                />
                                {item.name}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <div className="flex h-16 shrink-0 items-center">
              <Image alt="Your Company" src="/logo/logo-dark.svg" className="h-8 w-auto" height={10} width={10} />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        {item.subItems ? (
                          <AccordionItem
                            name={item.name}
                            icon={item.icon}
                            subItems={item.subItems}
                            isOpen={openAccordion === item.name}
                            onToggle={() => setOpenAccordion(openAccordion === item.name ? null : item.name)}
                          />
                        ) : (
                          <a
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-50 text-primary"
                                : "text-gray-700 hover:bg-gray-50 hover:text-primary",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className={classNames(
                                item.current ? "text-primary" : "text-gray-400 group-hover:text-primary",
                                "h-6 w-6 shrink-0"
                              )}
                            />
                            {item.name}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <a
                    href="#"
                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                  >
                    <Image
                      alt=""
                      src="https://avatar.iran.liara.run/public/42"
                      height={8}
                      width={8}
                      className="h-8 w-8 rounded-full bg-gray-50"
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">Admin</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
          <a href="#">
            <span className="sr-only">Your profile</span>
            <Image
              alt=""
              src="https://avatar.iran.liara.run/public/42"
              height={8}
              width={8}
              className="h-8 w-8 rounded-full bg-gray-50"
            />
          </a>
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
}
