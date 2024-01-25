import App from "../App";

export type LoginTypeAProps = {
  children: React.ReactNode;
};

const LoginTypeA: React.FC<LoginTypeAProps> = ({children}) => (
  <App>
    <div
      data-layout="LoginTypeA"
      className="w-full h-screen flex items-center justify-center bg-center	bg-no-repeat bg-cover bg-[url('/images/login_bg1.jpg')]">
      <div className="p-4 lg:p-0">{children}</div>
    </div>
  </App>
);

export default LoginTypeA;
