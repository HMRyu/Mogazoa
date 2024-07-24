import appendErrorToQuery from '@/shared/utils/appendErrorToQuery';
import validateArray from '@/shared/utils/validateArray';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const signupRequest = async (params: { code: string; nickname: string }) => {
  const result = await axios.post(
    `https://mogazoa-api.vercel.app/5-5/auth/signUp/google`,
    {
      token: params.code,
      redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      nickname: params.nickname,
    },
  );
  return result;
};

const signinRequest = async (code: string) => {
  const result = await axios.post(
    `https://mogazoa-api.vercel.app/5-5/auth/signIn/google`,
    {
      token: code,
      redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
    },
  );
  return result;
};

const getIdToken = async (code: string) => {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
    code,
  });
  const result = await axios.post(
    `https://oauth2.googleapis.com/token?${params.toString()}`,
  );
  return result;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, state } = req.query;

  let idTokenRes;
  let response;
  try {
    idTokenRes = await getIdToken(validateArray(code));
    if (!idTokenRes) return;

    const { id_token: idToken } = idTokenRes.data;
    if (!state) {
      response = await signinRequest(idToken);
    } else {
      response = await signupRequest({
        nickname: validateArray(state),
        code: validateArray(code),
      });
    }

    if (response?.status === 200) {
      res.setHeader(
        'Set-Cookie',
        `accessToken=${response.data.accessToken}; Path=/;`,
      );
      res.redirect('/');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error?.response?.status === 403) {
        res.redirect(process.env.NEXT_PUBLIC_GOOGLE_SIGNUP_URI!);
      } else {
        const params = appendErrorToQuery(error);

        res.redirect(
          `${process.env.NEXT_PUBLIC_GOOGLE_SIGNUP_URI!}?${params?.toString()}`,
        );
      }
    }
  }
};

export default handler;