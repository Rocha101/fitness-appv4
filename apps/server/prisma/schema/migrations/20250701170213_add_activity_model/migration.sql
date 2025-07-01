-- CreateTable
CREATE TABLE "activity" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "intensity" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "emoji" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("_id")
);

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE CASCADE;
