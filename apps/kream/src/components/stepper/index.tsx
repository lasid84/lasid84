
import { Steps1, Steps2, Steps3, Steps4 } from "components/stepper/steps";

export type WidgetProps = {
    title?: React.ReactNode;
    right?: React.ReactNode;
    children: React.ReactNode;
  };

const Stepper: React.FC<WidgetProps> = ({
    title,
    right,
    children,
}) => {
    return (
        <>
            <div className="w-full bg-white border border-white rounded-lg dark:bg-gray-900 dark:border-gray-800">
                {(title || right) && (
                    <div className="flex flex-row items-center justify-between mb-6">
                        <div className="flex flex-col">
                            {/* <div className="text-sm font-light text-gray-500">{title}</div> */}
                        </div>
                        {right}
                    </div>
                )}
                <Steps4 />
                {/* <Steps3 /> */}
            </div>
        </>
    );
};

export default Stepper;
