-- CreateEnum Language
DO $$ BEGIN
  CREATE TYPE "Language" AS ENUM (
    'ENGLISH',
    'GERMAN',
    'FRENCH',
    'SPANISH',
    'RUSSIAN',
    'UKRAINIAN',
    'POLISH',
    'CZECH',
    'ROMANIAN',
    'CHINESE_SIMPLIFIED',
    'CHINESE_TRADITIONAL',
    'JAPANESE',
    'KOREAN',
    'THAI',
    'VIETNAMESE',
    'INDONESIAN',
    'TAGALOG',
    'HINDI',
    'TAMIL',
    'TELUGU',
    'KANNADA',
    'MARATHI',
    'BENGALI',
    'SWAHILI',
    'AMHARIC',
    'YORUBA',
    'IGBO',
    'PORTUGUESE_BRAZILIAN',
    'SPANISH_LATIN_AMERICAN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable User - add language field
ALTER TABLE "User" ADD COLUMN "language" "Language" NOT NULL DEFAULT 'ENGLISH';

-- CreateIndex on language for faster queries
CREATE INDEX "User_language_idx" ON "User"("language");
