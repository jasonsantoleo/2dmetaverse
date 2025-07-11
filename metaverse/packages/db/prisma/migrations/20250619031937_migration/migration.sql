-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceElements" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "elementId" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,

    CONSTRAINT "SpaceElements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Elements" (
    "id" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Map" (
    "id" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapElements" (
    "id" TEXT NOT NULL,
    "elementId" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,

    CONSTRAINT "MapElements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Space_id_key" ON "Space"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceElements_id_key" ON "SpaceElements"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Elements_id_key" ON "Elements"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Map_id_key" ON "Map"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MapElements_id_key" ON "MapElements"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_id_key" ON "Avatar"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceElements" ADD CONSTRAINT "SpaceElements_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceElements" ADD CONSTRAINT "SpaceElements_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Elements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapElements" ADD CONSTRAINT "MapElements_elementId_fkey" FOREIGN KEY ("elementId") REFERENCES "Elements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapElements" ADD CONSTRAINT "MapElements_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
