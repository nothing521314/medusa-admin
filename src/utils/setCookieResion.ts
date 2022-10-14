export function setCookieRegion(regionId) {
  const now = new Date();
  const time = now.getTime();
  const expireTime = time + 100_000 * 36_000;
  now.setTime(expireTime);
  document.cookie = `activeRegion=${regionId};expires=${now.toUTCString()};path=/`;
}
