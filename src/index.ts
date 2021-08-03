import Xvfb from "@cypress/xvfb";
import { Promise } from "bluebird";
import execa from "execa";
import puppeteer from "puppeteer";

const args = process.argv.slice(2);
const addr = args[0] || process.env.RTSP_ADDRESS;
if (!addr) throw new Error("need to specify rtsp address");
const initialUrl = args[1];
if (!initialUrl) throw new Error("need to specify url");

const xvfb = Promise.promisifyAll(
  new Xvfb({
    xvfb_args: ["-screen", "0", "1920x1080x24", "-ac"],
    onStderrData(data) {
      console.warn(data.toString());
    },
  })
);

export const commonOptions: string[] = [
  "-hide_banner",
  "-loglevel",
  "warning",
  "-stats",
];

(async () => {
  console.log("xvfb.start");
  await xvfb.startAsync();

  const display = xvfb.display();
  console.log(`display: ${display}`);

  console.log("spawn awesome");
  const awesome = execa("awesome", {
    env: {
      DISPLAY: display,
      HOME: "/home/user",
    },
    stdio: ["ignore", "inherit", "inherit"],
  });

  console.log("puppeteer.launch");
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--start-maximized",
      "--display=" + display,
      "--autoplay-policy=no-user-gesture-required",
    ],
  });

  console.log("browser.newPage");
  const page = await browser.newPage();

  console.log("page.goto");
  await page.goto(initialUrl);

  console.log(`spawn ffmpeg for ${addr}`);
  const ffmpegArgs = [
    ...commonOptions,
    "-r",
    "30",
    "-f",
    "x11grab",
    "-draw_mouse",
    "0",
    "-s",
    "1920x1080",
    "-i",
    display,
    "-f",
    "alsa",
    "-i",
    "default",
    "-vcodec",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-acodec",
    "aac",
    "-f",
    "rtsp",
    "-rtsp_transport",
    "tcp",
    addr,
  ];
  console.log(`"${ffmpegArgs.join('" "')}"`);
  const ffmpeg = execa("ffmpeg", ffmpegArgs, {
    stdio: ["ignore", "inherit", "inherit"],
  });
  await ffmpeg;

  console.log("ffmpeg exited");

  awesome.kill("SIGTERM", {
    forceKillAfterTimeout: 3000,
  });
  try {
    await awesome;
  } catch {}

  // console.log("sleeping");
  // await new Promise((resolve) => setTimeout(resolve, 60000));

  console.log("browser.close");
  await browser.close();

  console.log("xvfb.stop");
  await xvfb.stopAsync();
})();
