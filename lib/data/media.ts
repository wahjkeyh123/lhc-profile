import type { StaticImageData } from "next/image";

import portrait from "@/public/assets/profile/liu-haocun.jpg";
import brilliantHer from "@/public/assets/works/brilliant-her.jpg";
import cliffWalkers from "@/public/assets/works/cliff-walkers.jpg";
import derailment from "@/public/assets/works/derailment.jpg";
import girlWhoWantedToFly from "@/public/assets/works/girl-who-wanted-to-fly.jpg";
import intoOurRomance from "@/public/assets/works/into-our-romance.jpg";
import leadingRole from "@/public/assets/works/leading-role.jpg";
import neverSayNever from "@/public/assets/works/never-say-never.jpg";
import oneSecond from "@/public/assets/works/one-second.jpg";
import redFlower from "@/public/assets/works/red-flower.jpg";
import rideOn from "@/public/assets/works/ride-on.jpg";
import sevenHearts from "@/public/assets/works/seven-hearts.jpg";
import shangganling from "@/public/assets/works/shangganling.jpg";
import theCrossing from "@/public/assets/works/the-crossing.jpg";
import theVanished from "@/public/assets/works/the-vanished.jpg";

/**
 * 以数据里的图片路径为键，换到静态导入的图片，
 * next/image 才能拿到尺寸并自动生成模糊占位。
 */
const media: Record<string, StaticImageData> = {
  "/assets/profile/liu-haocun.jpg": portrait,
  "/assets/works/brilliant-her.jpg": brilliantHer,
  "/assets/works/cliff-walkers.jpg": cliffWalkers,
  "/assets/works/derailment.jpg": derailment,
  "/assets/works/girl-who-wanted-to-fly.jpg": girlWhoWantedToFly,
  "/assets/works/into-our-romance.jpg": intoOurRomance,
  "/assets/works/leading-role.jpg": leadingRole,
  "/assets/works/never-say-never.jpg": neverSayNever,
  "/assets/works/one-second.jpg": oneSecond,
  "/assets/works/red-flower.jpg": redFlower,
  "/assets/works/ride-on.jpg": rideOn,
  "/assets/works/seven-hearts.jpg": sevenHearts,
  "/assets/works/shangganling.jpg": shangganling,
  "/assets/works/the-crossing.jpg": theCrossing,
  "/assets/works/the-vanished.jpg": theVanished,
};

export function resolveMedia(src: string): StaticImageData | string {
  return media[src] ?? src;
}
