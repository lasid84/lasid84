import { memo } from "react";

type Props = {
    event: event;
}

type event = {
    onClickFull: (e: React.MouseEvent<HTMLDivElement>) => void;
    onClickMilestone: (e: React.MouseEvent<HTMLDivElement>) => void;
    onClickIRRC2: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Tab = memo((props: Props) => {
    return (
        <div className="flex flex-row justify-start">
            <div className="px-2 py-1 mx-px mt-1 bg-indigo-200 cursor-pointer rounded-t-md hover:bg-white" onClick={props.event.onClickFull}>
                <span className="flex items-center justify-center p-1 text-gray-500 rounded">Full</span>
            </div>
            <div className="px-2 py-1 mx-px mt-1 bg-indigo-200 cursor-pointer rounded-t-md hover:bg-white" onClick={props.event.onClickMilestone}>
                <span className="flex items-center justify-center p-1 text-gray-500 rounded">Milestone</span>
            </div>
            <div className="px-2 py-1 mx-px mt-1 bg-indigo-200 cursor-pointer rounded-t-md hover:bg-white" onClick={props.event.onClickIRRC2}>
                <span className="flex items-center justify-center p-1 text-gray-500 rounded">IRR/C2</span>
            </div>
        </div>
    );
});