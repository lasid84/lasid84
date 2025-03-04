export type InputWrapperProps = {
  outerClassName: string;
  inline?: boolean;
  disableSpacing?: boolean;
  children: React.ReactNode;
};

export const InputWrapper: React.FC<InputWrapperProps> = ({
  inline = false,
  outerClassName,
  disableSpacing,
  children,
}) => {
  if (inline) {
    return (
      <div className={outerClassName}>
        <div className={`w-full py-0.5 flex items-center space-x-1 justify-items-start dark:text-black  ${outerClassName} `}>
          {children}
        </div>
      </div>
    );
  }
  return (
    // hidden block
    // // <div className={outerClassName}>
    //   <div className={`w-full space-y-1 ${outerClassName}`}>{children}</div>
    // // </div>
    <div className={outerClassName}>
      <div className={`w-full ${
        disableSpacing ? "space-y-0" : "space-y-0.5"
      }`}>{children}</div>
    </div>
  );
};

export type InlineInputWrapperProps = {
  outerClassName: string;
  children: React.ReactNode;
};

export const InlineInputWrapper: React.FC<InlineInputWrapperProps> = ({
  outerClassName,
  children,
}) => {
  return (
    <div className={outerClassName}>
      <div className="flex items-center space-x-2 space-y-1 justify-items-start">
        {children}
      </div>
    </div>
  );
};
