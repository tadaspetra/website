import { useState, type PointerEvent } from "react";
import youtubeChannel from "../_assets/youtube-channel.png";
import xAccount from "../_assets/x-account.png";
import gdeProfile from "../_assets/gde-profile.png";

interface AchievementCard {
  imageSrc: string;
  alt: string;
  caption: string;
  imageClassName: string;
  rotateZ?: number;
  wrapperClassName?: string;
}

interface AchievementCardProps {
  card: AchievementCard;
}

const cards: AchievementCard[] = [
  {
    imageSrc: youtubeChannel.src,
    alt: "Tadas Petra YouTube channel showing popular Flutter videos",
    caption: "YouTube channel",
    imageClassName: "h-full w-full -translate-y-2 scale-110 object-cover",
    rotateZ: -3,
    wrapperClassName: "sm:w-[34%] sm:translate-x-8 sm:translate-y-6 md:w-[38%] md:translate-x-12",
  },
  {
    imageSrc: xAccount.src,
    alt: "Tadas Petra X profile with follower count and bio",
    caption: "X audience",
    imageClassName: "h-full w-full -translate-y-6 scale-125 object-cover",
    rotateZ: 1,
    wrapperClassName: "sm:z-10 sm:w-[32%] sm:-translate-y-5 md:w-[34%]",
  },
  {
    imageSrc: gdeProfile.src,
    alt: "Google Developers profile for Tadas Petra specializing in Dart and Flutter",
    caption: "Google Developer Expert",
    imageClassName: "h-full w-full translate-x-[5%] object-cover [clip-path:inset(0_24%_0_14%)]",
    rotateZ: 4,
    wrapperClassName: "sm:w-[34%] sm:-translate-x-8 sm:translate-y-1 md:w-[37%] md:-translate-x-12",
  },
];

function getCardTransform(rotateX = 0, rotateY = 0, rotateZ = 0, lift = 0): string {
  return `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) translateY(${lift}px)`;
}

function AchievementCardItem({ card }: AchievementCardProps) {
  const baseTransform = getCardTransform(0, 0, card.rotateZ);
  const [transform, setTransform] = useState(baseTransform);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setTransform(
      getCardTransform(y * -8, x * 10, card.rotateZ, -3),
    );
  };

  const handlePointerLeave = () => {
    setTransform(baseTransform);
  };

  return (
    <div className={card.wrapperClassName}>
      <figure
        className="mx-auto w-full max-w-[21rem] rounded-2xl border border-neutral-200 bg-white px-2 pt-2 pb-3 shadow-lg shadow-neutral-200/60 transition-[box-shadow,transform] duration-200 ease-out will-change-transform hover:shadow-xl hover:shadow-neutral-300/60 sm:max-w-none dark:shadow-black/40 dark:hover:shadow-black/55"
        style={{ transform }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div className="aspect-square overflow-hidden rounded-xl">
          <img src={card.imageSrc} alt={card.alt} className={card.imageClassName} />
        </div>
        <figcaption className="px-2 pt-2 pb-1 text-center font-['Reenie_Beanie',cursive] text-xl font-normal leading-tight text-neutral-600">
          {card.caption}
        </figcaption>
      </figure>
    </div>
  );
}

export default function AchievementCards() {
  return (
    <div className="mx-4 mt-10 mb-20 flex max-w-full flex-col gap-4 perspective-[1000px] sm:mx-0 sm:flex-row sm:items-start sm:justify-center sm:gap-0">
      {cards.map((card) => (
        <AchievementCardItem key={card.caption} card={card} />
      ))}
    </div>
  );
}
