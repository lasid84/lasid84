import App from "../App";

export type CenteredProps = {
  children: React.ReactNode;
};

const Centered: React.FC<CenteredProps> = ({children}) => (
  <App>
    <div
      data-layout="centered"
      className="flex items-center justify-center w-full h-screen text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-white">
      <div className="p-4 lg:p-0">{children}</div>
    </div>
  </App>
);

export default Centered;
