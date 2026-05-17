import { desc } from 'drizzle-orm';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import env from '@/env.mjs';
import GuestbookEntry from '@/components/guestbook/guestbook-entry';
import GuestbookForm from '@/components/guestbook/guestbook-form';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { guestbook } from '@/lib/db/schema';

import type { Metadata } from 'next/types';

interface GuestbookProps {
  params: {
    locale: string;
  };
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'de' }];
}

export async function generateMetadata({
  params: { locale },
}: GuestbookProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'guestbook' });
  return {
    title: t('title'),
    openGraph: {
      images: [`${env.NEXT_PUBLIC_WEBSITE_URL}/api/og?title=${t('title')}`],
    },
    twitter: {
      images: [`${env.NEXT_PUBLIC_WEBSITE_URL}/api/og?title=${t('title')}`],
    },
  };
}

async function getGuestbook() {
  try {
    const data = await db
      .select({
        id: guestbook.id,
        body: guestbook.body,
        email: guestbook.email,
        created_by: guestbook.created_by,
        updated_at: guestbook.updated_at,
      })
      .from(guestbook)
      .orderBy(desc(guestbook.updated_at))
      .limit(100)
      .execute();

    return data.map((entry) => {
      return { ...entry, updated_at: entry.updated_at.toISOString() };
    });
  } catch (error) {
    console.error('Failed to fetch guestbook entries:', error);
    return [];
  }
}

const GuestbookPage = ({ params: { locale } }: GuestbookProps) => {
  return (
    <div className="mx-auto mb-16 flex w-full max-w-3xl flex-col items-start justify-center">
      <Suspense>
        <GuestbookFormWrapper />
        <GuestbookEntries locale={locale} />
      </Suspense>
    </div>
  );
};

async function GuestbookEntries({ locale }: { locale: string }) {
  let entries: {
    id: number;
    body: string;
    email: string;
    created_by: string;
    updated_at: string;
  }[] = [];
  let session = null;
  let t = (key: string) => key;

  try {
    const results = await Promise.allSettled([
      getGuestbook(),
      auth(),
      getTranslations({ locale, namespace: 'guestbook' }),
    ]);

    if (results[0].status === 'fulfilled') {
      entries = results[0].value;
    }
    if (results[1].status === 'fulfilled') {
      session = results[1].value;
    }
    if (results[2].status === 'fulfilled') {
      t = results[2].value as unknown as (key: string) => string;
    }
  } catch (error) {
    console.error('Error loading guestbook entries:', error);
  }

  return (
    <div className="mt-4 space-y-8">
      {entries.map((entry) => (
        <GuestbookEntry
          key={entry.id.toString()}
          entry={entry}
          session={session}
          locale={locale}
          deleteText={t('delete')}
        />
      ))}
    </div>
  );
}

async function GuestbookFormWrapper() {
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    console.error('Error fetching auth session for guestbook form:', error);
  }
  return <GuestbookForm session={session} />;
}

export default GuestbookPage;
