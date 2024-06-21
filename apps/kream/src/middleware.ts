
import type { NextRequest } from 'next/server'

// const { log } = require('@repo/kwe-lib/components/logHelper');
 
// export function middleware(request: NextRequest) {
//   // log("middleware", request);
//   // const currentUser = request.cookies.get('currentUser')?.value
 
//   // if (currentUser && !request.nextUrl.pathname.startsWith('/dashboard')) {
//   //   return Response.redirect(new URL('/dashboard', request.url))
//   // }
 
//   // if (!currentUser && !request.nextUrl.pathname.startsWith('/login')) {
//   //   return Response.redirect(new URL('/login', request.url))
//   // }
// }
 
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// }

import { NextResponse } from "next/server";

const { log } = require('@repo/kwe-lib/components/logHelper');

// the list of all allowed origins
const allowedOrigins = [
  'http://localhost:3000', 
  'http://dev-kream.web.kwe.co.kr', 
  'http://dev-kream.web.kwe.co.kr/login', 
  'http://dev-api-kream.web.kwe.co.kr'
];

export function middleware(req:NextRequest) {
    // retrieve the current response
    const res = NextResponse.next()

    // retrieve the HTTP "Origin" header 
    // from the incoming request
    var origin = req.headers.get("origin") || ''

    // if the origin is an allowed one,
    // add it to the 'Access-Control-Allow-Origin' header
    log("origin", origin)
    if (allowedOrigins.includes(origin)) {
      res.headers.append('Access-Control-Allow-Origin', origin);
    }

    // add the remaining CORS headers to the response
    res.headers.append('Access-Control-Allow-Credentials', "true")
    res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    res.headers.append(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    return res
}

// specify the path regex to apply the middleware to
export const config = {
    matcher: '/api/:path*',
}