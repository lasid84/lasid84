export type ButtonProps = {
    title: React.ReactNode;
    children: React.ReactNode;
    left?: React.ReactNode;
    middle?: React.ReactNode;
    right?: React.ReactNode;
  };

const Button: React.FC<ButtonProps> = ({
    title,
    children,
    left,
    middle,
    right,
  }) => {
    return (
      <div className="w-full p-4 rounded-lg bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <div className="text-xs font-light text-gray-500 uppercase">
              {title}
            </div>
          </div>
        </div>
        {(left || middle || right) &&
        <div className="flex flex-row items-start justify-between">
          {left 
            ? <div className="flex flex-row space-x-1 mb-4">{left}</div>
            : <div></div>
          }
          {middle 
            ? <div className="flex flex-row space-x-1 mb-4">{middle}</div>
            : <div></div>
          }
          {right 
            ? <div className="flex flex-row space-x-1 mb-4">{right}</div>
            : <div></div>
          }
        </div>
        }
        <div className="flex flex-row items-start justify-between">
          <div className="flex flex-col">{children}</div>
        </div>
      </div>
    );
  };
  
  export default Button;