import App from "../App";

export type LoginTypeAProps = {
  children: React.ReactNode;
};

const LoginTypeC: React.FC<LoginTypeAProps> = ({children}) => (
  <App>
    <div
      data-layout="LoginTypeC"
      className="w-full h-screen bg-center bg-no-repeat bg-cover bg-[url('/images/post-1.jpg')]">
      <div className="p-0">{children}</div>
    </div>
  </App>
);

export default LoginTypeC;
