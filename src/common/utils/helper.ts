import { promisify } from 'node:util';
import { createHmac } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const log = console;

export default Object.freeze({
  delay: promisify(setTimeout),

  uuid: uuidv4,

  encodeToken(payload: jwt.JwtPayload, options?: jwt.SignOptions): Promise<string> {
    try {
      return new Promise((res, rej) => {
        if (options) {
          jwt.sign(payload, process.env.JWT_SECRET!, options, (err, token) => {
            if (err || !token) return rej(err);
            res(token);
          });
        } else {
          jwt.sign(payload, process.env.JWT_SECRET!, (err, token) => {
            if (err || !token) return rej(err);
            res(token);
          });
        }
      });
    } catch (err: any) {
      log.error({}, `Server :> JWT Sign Error , ${err.message}`);
      return Promise.reject(err ? err.message : undefined);
    }
  }, // options: { expiresIn: 30 } // seconds

  decodeToken(token: string, options?: jwt.DecodeOptions) {
    try {
      return options ? jwt.decode(token, options) : jwt.decode(token);
    } catch (error: any) {
      console.log('Server :> JWT decodeToken Error', error.message);
      return error ? error.message : undefined;
    }
  },

  verifyToken(token: string) {
    return new Promise<{ status: boolean; payload: any }>(res => {
      jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
        if (err) res({ status: false, payload: err.message });
        else res({ status: true, payload: decoded });
      });
    });
  }, // jwt expired || invalid signature

  encryptPassword(password: string) {
    return createHmac('sha256', process.env.JWT_SECRET!).update(password).digest('hex');
  },

  validateEmail(email: string) {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  },

  validateMobile(mobile: string) {
    return String(mobile).match(/^[0-9]{10}$/);
  },

  isStrongPassword(password: string) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password);

    return password.length >= minLength && hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
  },
});
