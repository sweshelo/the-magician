import master from '@/submodule/suit/catalog/catalog';

export const getImageUrl = (catalogId: string, size?: string): string => {
  const isSelfHosting = process.env.NEXT_PUBLIC_IMAGE_SELF_HOSTING === 'true';

  if (isSelfHosting) return `/image/card/full/${catalogId}.jpg`;
  const baseUrl = `https://coj.sega.jp/player/img${master.get(catalogId)?.img}`;

  switch (size || process.env.NEXT_PUBLIC_IMAGE_SIZE) {
    case 'full':
      return baseUrl;
    case 'normal':
      return baseUrl.replace('large_card/card_large_', 'card/card_');
    case 'small':
    default:
      return baseUrl.replace('large_card/card_large_', 'thum/thum_');
  }
};
