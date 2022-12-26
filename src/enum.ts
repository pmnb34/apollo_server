export const FEED_CREATE_POINT = 1; // 피드 추가 삭제시 변경되는 포인트

export const setTokenTime = (tokenTime: string) => {
    return Number(Math.ceil(Date.now() / 1000)) + Number(tokenTime);
  };
