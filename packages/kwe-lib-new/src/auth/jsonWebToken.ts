
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

// 기본 JWT 서명 옵션
const DEFAULT_SIGN_OPTIONS: SignOptions = {
  expiresIn: "1d",
};

const SECRET_KEY = "Zwm18jRcFUOu1JoZtQw1ZgFY1fO/EDTSlttuoVEG25E=";

/**
 * JWT 액세스 토큰을 서명(sign)하는 함수
 *
 * @param payload - 토큰에 담을 데이터 (문자열, 객체, 버퍼 가능)
 * @param key - 서명에 사용할 비밀키 (기본값 SECRET_KEY)
 * @param options - jwt.sign 옵션 (기본값 DEFAULT_SIGN_OPTIONS)
 * @returns 서명된 토큰 문자열
 */
export const signJwtAccessToken = (
  payload: string | object | Buffer,
  key: string = SECRET_KEY,
  options: SignOptions = DEFAULT_SIGN_OPTIONS
): string => {
  const token = jwt.sign(payload, key, options);
  return token;
}

/**
 * JWT 토큰을 검증(verify)하는 함수
 *
 * @param token - 검증할 토큰 문자열
 * @returns 검증에 성공하면 디코딩된 데이터(JwtPayload|string), 실패하면 null
 */
export const verifyJwt = (token: string): JwtPayload | string | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
}
