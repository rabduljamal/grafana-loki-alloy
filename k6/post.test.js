import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    hit_target_rps: {
      executor: "constant-arrival-rate",
      rate: 10000, // 🎯 1000 requests per second
      timeUnit: "1s", // per detik
      duration: "60s",
      preAllocatedVUs: 100, // jumlah VUs awal
      maxVUs: 500, // batas maksimal VUs (penting saat beban naik)
    },
  },
};

export default function () {
  const res = http.post(
    "http://10.140.0.103:3100/loki/api/v1/push",
    JSON.stringify({
      streams: [
        {
          stream: { job: "loadtest" },
          values: [[`${Date.now() * 1_000_000}`, "this is a log line from k6"]],
        },
      ],
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(res, {
    "status is 204": (r) => r.status === 204,
  });
}
