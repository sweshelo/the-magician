import { getDeck } from '@/actions/deck';
import { DeckDetail } from '@/feature/DeckManagement/DeckDetail';
import { Metadata } from 'next';
// FIXME: TS 5.9 + Next.js 16.1.6 で 'next/navigation' から notFound をインポートすると TS2305 が発生するため内部パスを使用。
import { notFound } from 'next/dist/client/components/not-found';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const deck = await getDeck(id);

  if (!deck) {
    return { title: 'デッキが見つかりません' };
  }

  const title = `${deck.title} - デッキ詳細`;
  const description = `${deck.owner.displayName} のデッキ (${deck.cards.length}枚)`;

  return {
    title,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const deck = await getDeck(id);

  if (!deck) {
    notFound();
  }

  return <DeckDetail deck={deck} />;
}
