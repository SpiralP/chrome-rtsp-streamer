import Xvfb from "@cypress/xvfb";
import { Promise } from "bluebird";
import execa from "execa";
import ffmpegPath from "ffmpeg-static";
import puppeteer from "puppeteer";

export const commonOptions: string[] = [
  "-hide_banner",
  "-loglevel",
  "warning",
  "-stats",
];

(async () => {
  const args = process.argv.slice(2);
  const addr = args[0];
  if (!addr) throw new Error("need to specify address");

  const xvfb = Promise.promisifyAll(
    new Xvfb({
      xvfb_args: ["-screen", "0", "1920x1080x24", "-ac"],
      onStderrData(data) {
        console.warn(data.toString());
      },
    })
  );

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
  await page.goto("https://soundcloud.com/moretinmusic/unholy-20202020");

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
  const ffmpeg = execa(ffmpegPath, ffmpegArgs, {
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
