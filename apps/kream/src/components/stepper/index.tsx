import StepList, {
  Steps1,
  Steps2,
  Steps3,  
} from "components/stepper/steps";

export type WidgetProps = {
  value?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
};

const Stepper: React.FC<WidgetProps> = ({ value, right, children }) => {
  return (
    <>
    <div className="w-8/12">
      <div className="w-full bg-white border border-white rounded-lg dark:bg-gray-900 dark:border-gray-800">
        {(value || right) && (
          <div className="flex flex-row items-center justify-between mb-6">
            <div className="flex flex-col">
              {/* <div className="text-sm font-light text-gray-500">{title}</div> */}
            </div>
            {right}
          </div>
        )}
        <StepList state = {value}/>
      </div>
      </div>
    </>
  );
};

export default Stepper;
