import App from "../App";

export type LoginTypeAProps = {
  children: React.ReactNode;
};

const LoginTypeA: React.FC<LoginTypeAProps> = ({children}) => (
  <App>
    <div
      data-layout="LoginTypeA"
      className="w-full h-screen bg-center bg-no-repeat bg-cover bg-[url('/images/login_bg2.jpg')]">
      <div className="p-0">{children}</div>
    </div>
  </App>
);

export default LoginTypeA;
