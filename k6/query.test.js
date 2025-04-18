import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 5,
  duration: "30s",
};

export default function () {
  const query = encodeURIComponent('{job="loadtest"}');
  const now = Date.now();
  const start = now - 5 * 60 * 1000; // 5 menit ke belakang

  const url = `http://10.140.0.103:3100/loki/api/v1/query_range?query=${query}&start=${
    start * 1_000_000
  }&end=${now * 1_000_000}&limit=100`;

  const res = http.get(url);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "has results": (r) => JSON.parse(r.body).data.result.length >= 0,
  });

  sleep(1);
}
