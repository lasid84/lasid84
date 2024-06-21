/** @type {import('next').NextConfig} */
const nextConfig = {
    // i18n: null,
    reactStrictMode: false,
    // experimental: {
    //     missingSuspenseWithCSRBailout: false,
    // },
    experimental: {
   	 serverActions: {
	      allowedOrigins: ["dev-kream.web.kwe.co.kr", "dev-api-kream.web.kwe.co.kr", "localhost:3000"]
	    }
	  }

};
export default nextConfig;
