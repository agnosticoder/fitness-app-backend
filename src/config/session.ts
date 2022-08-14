import { IronSessionOptions } from 'iron-session';

declare module 'iron-session' {
    interface IronSessionData {
        user?: {
            id: string;
        };
    }
}

export const { NODE_ENV = 'develoment', PASSWORD = 'secret', NAME = 'fitness-resort' } = process.env;
const IN_PROD = NODE_ENV === 'production';

export const LOGIN_SESS_OPTIONS: IronSessionOptions = {
    cookieName: NAME,
    password: PASSWORD,
    cookieOptions: {
        secure: IN_PROD,
        httpOnly: IN_PROD,
        maxAge: 1000 * 60 * 60 * 2,
    },
};

if(IN_PROD){
    console.log = () => {};
}