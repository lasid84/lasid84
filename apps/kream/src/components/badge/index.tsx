import clsx from 'clsx';
import { useTranslation } from "react-i18next";

export type BadgeSize = "sm" | "md" | "lg";

export type BadgeProps = {
    rounded?: boolean;
    size: BadgeSize;
    color: string;
    name?: string;
    children?: React.ReactNode;
};


export const Badge: React.FC<BadgeProps> = ({
    rounded = false,
    size = "md",
    color,
    name,
    children,
}) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-wrap items-center justify-start w-full mb-2 space-x-2">
            <span
                className={clsx(
                    "uppercase font-bold inline-flex text-center bg-transparent border border-current",
                    color,
                    rounded && "rounded-lg",
                    size === "md" && "text-xs px-2 py-1",
                    size === "sm" && "text-xs px-2 py-0",
                    size === "lg" && "text-xs px-2 py-2",
                )}>
                {name ? t(name) : ''}
            </span>
        </div>
    );



};
