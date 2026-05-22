import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: 'easeOut' },
    },
};

export interface NavItemType {
    id: string;
    label: string | React.ReactNode;
    href: string;
    isActive?: boolean;
    description?: string;
}

export interface NavGroupType {
    id: string | number;
    title: string | React.ReactNode;
    subtitle?: string;
    badge?: string | number;
    isExpanded: boolean;
    onToggle: () => void;
    items: NavItemType[];
}

interface SidebarMenuProps {
    groups: NavGroupType[];
    onItemClick: () => void;
    groupTitle?: string;
}

const groupButtonBaseClass =
    'flex w-full items-start justify-between gap-2 rounded-2xl border px-3 py-2.5 text-left transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-rail dark:focus-visible:ring-offset-shell-rail-dark sm:gap-1.5 sm:rounded-xl sm:px-2 sm:py-1.5';

const itemLinkBaseClass =
    'flex items-start gap-2 rounded-2xl border px-3 py-2.5 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-rail dark:focus-visible:ring-offset-shell-rail-dark sm:rounded-xl sm:px-2 sm:py-1.5';

export const SidebarMenu = React.memo(({ groups, onItemClick, groupTitle }: SidebarMenuProps) => {
    const expandedGroup = groups.find((group) => group.isExpanded);

    return (
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="custom-scrollbar h-[30%] shrink-0 overflow-y-auto border-b border-gold-border/20 overscroll-contain dark:border-dark-border/70"
            >
                {groupTitle && (
                    <div className="sticky top-0 z-10 hidden bg-shell-rail/85 p-4 backdrop-blur-sm dark:bg-shell-rail-dark/85 lg:block">
                        <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-text-primary/65 dark:text-dark-text-primary/65">{groupTitle}</h2>
                    </div>
                )}

                <div className="space-y-1 px-2 py-2 sm:space-y-0.5 sm:py-1">
                    {groups.map((group) => (
                        <motion.button
                            type="button"
                            variants={itemVariants}
                            key={group.id}
                            onClick={group.onToggle}
                            aria-expanded={group.isExpanded}
                            className={`${groupButtonBaseClass} ${
                                group.isExpanded
                                    ? 'border-gold-primary/18 bg-shell-main/72 text-text-primary shadow-[0_12px_28px_-22px_rgba(0,0,0,0.35)] dark:bg-shell-main-dark/72 dark:text-gold-light'
                                    : 'border-transparent text-text-secondary hover:border-gold-border/12 hover:bg-gold-surface/40 dark:text-dark-text-secondary dark:hover:border-dark-border/60 dark:hover:bg-white/5'
                            }`}
                        >
                            <div className="flex flex-1 flex-col pr-1">
                                <span className={`break-keep text-[15px] leading-snug sm:text-[13px] ${group.isExpanded ? 'font-semibold text-text-primary dark:text-gold-light' : 'font-semibold'}`}>
                                    {group.title}
                                </span>
                                {group.subtitle && (
                                    <span
                                        className={`mt-0.5 break-keep text-[12px] sm:mt-0 sm:text-[11.5px] ${
                                            group.isExpanded ? 'font-medium text-text-secondary opacity-70 dark:text-dark-text-secondary' : 'font-medium opacity-60'
                                        }`}
                                    >
                                        {group.subtitle}
                                    </span>
                                )}
                            </div>
                            {group.badge && (
                                <span className={`mt-0.5 shrink-0 rounded-full border border-gold-border/12 px-2 py-0.5 text-[11px] font-semibold text-gold-primary dark:border-dark-border/60 dark:text-gold-light ${group.isExpanded ? 'opacity-100' : 'opacity-70'}`}>
                                    {group.badge}
                                </span>
                            )}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            <div className="custom-scrollbar flex-1 overflow-y-auto bg-transparent overscroll-contain">
                <div className="space-y-0.5 px-2 py-2 sm:space-y-0 sm:py-1">
                    {expandedGroup ? (
                        expandedGroup.items.map((item) => (
                            <NavLink
                                key={item.id}
                                to={item.href}
                                onClick={onItemClick}
                                className={({ isActive }) =>
                                    `${itemLinkBaseClass} ${
                                        isActive || item.isActive
                                            ? 'border-gold-primary/18 bg-shell-main/72 font-medium text-text-primary shadow-[0_12px_28px_-22px_rgba(0,0,0,0.3)] dark:border-gold-primary/20 dark:bg-shell-main-dark/70 dark:text-gold-light'
                                            : 'border-transparent text-text-secondary hover:border-gold-border/12 hover:bg-gold-surface/30 hover:text-text-primary dark:text-dark-text-secondary dark:hover:border-dark-border/60 dark:hover:bg-white/5'
                                    }`
                                }
                            >
                                <span
                                    className={`mt-[2px] min-w-[46px] whitespace-nowrap text-[13px] font-semibold sm:min-w-[45px] sm:text-[13px] ${
                                        item.isActive ? 'text-gold-primary dark:text-gold-light' : 'text-text-secondary/65 dark:text-dark-text-secondary/65'
                                    }`}
                                >
                                    {item.label}
                                </span>
                                {item.description && <span className="line-clamp-1 text-[14px] leading-relaxed opacity-90 sm:text-[13px]">{item.description}</span>}
                            </NavLink>
                        ))
                    ) : (
                        <div className="p-8 text-center text-sm text-text-secondary dark:text-dark-text-secondary">카테고리를 먼저 선택해 주세요.</div>
                    )}
                </div>
            </div>
        </>
    );
});
