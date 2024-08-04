import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import convertToK from '@/utils/convertToK';
import { FollowerRanking } from '@/types/follow/followers/followers-type';
import { Ranking } from '@/components/shared';

type RankingCardType = Omit<
  FollowerRanking,
  'updatedAt' | 'createdAt' | 'teamId'
> & {
  ranking: number;
};

const RankingCard = ({
  image,
  nickname,
  description,
  reviewCount,
  followersCount,
  ranking,
  id,
}: RankingCardType) => {
  return (
    <Link href={`/user/${id}`} className="flex-shrink-0 xl:w-full">
      <div className="flex items-center gap-2.5 rounded-2xl px-[20px] py-[10px] transition-all duration-300 hover:bg-[#252530]">
        <div className="relative flex size-[42px] overflow-hidden rounded-full border border-var-gray1">
          <Image
            sizes="40px"
            src={image || 'images/user-no-image.svg'}
            alt={description || '이미지 없음'}
            fill
            style={{
              objectFit: 'contain',
            }}
            loading="eager"
          />
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Ranking ranking={ranking} />
              <div className="text-[14px] font-normal text-var-white md:text-[16px]">
                {nickname}
              </div>
            </div>
            <ul className="flex gap-3.5 text-[10px] font-light text-var-gray1 md:text-[12px]">
              <li>팔로워 {convertToK(followersCount)}</li>
              <li>리뷰 {convertToK(reviewCount)}</li>
            </ul>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RankingCard;
