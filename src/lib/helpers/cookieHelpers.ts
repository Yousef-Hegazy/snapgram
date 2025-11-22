import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export const getCookie = async (name: string) => {
    const cks = await cookies();

    return cks.get(name)?.value;
}

export const setCookie = async (...args: [key: string, value: string, cookie?: Partial<ResponseCookie>] | [options: ResponseCookie]) => {
    const cks = await cookies();

    cks.set(...args)
}

export const deleteCookie = async (name: string) => {
    try {
        const cks = await cookies();
        cks.delete(name);
    } catch (error) {
        console.log(error)
    }
}
