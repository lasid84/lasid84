/** @type {import('next').NextConfig} */
const nextConfig = {
    // i18n: null,
    reactStrictMode: false,
    // experimental: {
    //     missingSuspenseWithCSRBailout: false,
    // },
    experimental: {
   	 serverActions: {
	      allowedOrigins: ["dev-kream.web.kwe.co.kr", "dev-api-kream.web.kwe.co.kr", "localhost:3000", "kream-web.kwe.co.kr", "api-kream-web.kwe.co.kr", "unipass.customs.go.kr"]
	    }
	  }

};
export default nextConfig;

// const nextConfig = {
//   async headers() {
//       return [
//           {
//               // matching all API routes
//               source: "/api/:path*",
//               headers: [
//                   { key: "Access-Control-Allow-Credentials", value: "true" },
//                   { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
//                   { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
//                   { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
//               ]
//           }
//       ]
//   },
//   experimental: {
//    	 serverActions: {
// 	      allowedOrigins: ["dev-kream.web.kwe.co.kr", "dev-api-kream.web.kwe.co.kr", "localhost:3000", "kream-web.kwe.co.kr", "api-kream-web.kwe.co.kr"]
// 	    }
//     }
// }

// export default nextConfig;

// const headers = [
//   "Accept", "Accept-Version", "Content-Length",
//   "Content-MD5", "Content-Type", "Date", "X-Api-Version",
//   "X-CSRF-Token", "X-Requested-With",
// ];

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true, 
//   experimental: {
//     serverActions: {
//         allowedOrigins: ["dev-kream.web.kwe.co.kr", "dev-api-kream.web.kwe.co.kr", "localhost:3000"]
//       }
//   },
//   env: {
//     ALLOWED_NEXT_AUTH_URLS:
//     ["http://(.+\\.|)dev-kream.web.kwe.co.kr/?","http://(.+\\.|)dev-api-kream.web.kwe.co.kr/?","http://(.+\\.|)localhost:3000/?"], ALLOWED_HEADERS:
//     headers.join(", "), CORS_DEFAULTS: {
//       methods: [], // making this blank by default - you have to override it per-call
//       origin: "*",
//       allowedHeaders: headers.join(", "),
//       credentials: true,
//     },
//   }, async headers() {
//     return [
//       {
// 	source: "/api/(.*)", headers: [
// 	  { key: "Access-Control-Allow-Credentials", value:
// 	  "true" }, { key: "Access-Control-Allow-Origin",
// 	  value: "*" }, {
// 	    key: "Access-Control-Allow-Methods", value:
// 	    "GET,OPTIONS,PATCH,DELETE,POST,PUT",
// 	  }, {
// 	    key: "Access-Control-Allow-Headers", value:
// 	    headers.join(", "),
// 	  },
// 	],
//       },
//     ];
//   },

// };
// export default nextConfig;
