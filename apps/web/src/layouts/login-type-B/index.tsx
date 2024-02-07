import App from "../App";

export type LoginTypeBProps = {
  children: React.ReactNode;
};

const LoginTypeB: React.FC<LoginTypeBProps> = ({children}) => (  
  <App>
    <div
      data-layout="LoginTypeA"
      className="w-full h-screen bg-center bg-no-repeat bg-cover bg-[url('/images/login_bg2.jpg')]">
      <div className="p-0">{children}</div>
    </div>
  </App>
);

export default LoginTypeB;
