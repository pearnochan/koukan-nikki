-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "login_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "record" (
    "rec_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "stage_id" TEXT NOT NULL,

    CONSTRAINT "record_pkey" PRIMARY KEY ("rec_id")
);

-- CreateTable
CREATE TABLE "recpac" (
    "rec_paticipant_id" TEXT NOT NULL,
    "rec_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "recpac_pkey" PRIMARY KEY ("rec_paticipant_id")
);

-- CreateTable
CREATE TABLE "image" (
    "image_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "rec_id" TEXT NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "tag" (
    "tag_id" TEXT NOT NULL,
    "tag_name" TEXT NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "rec_tag" (
    "rec_tag_id" TEXT NOT NULL,
    "rec_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "rec_tag_pkey" PRIMARY KEY ("rec_tag_id")
);

-- CreateTable
CREATE TABLE "stage" (
    "stage_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "required_count" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "stage_pkey" PRIMARY KEY ("stage_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recpac_rec_id_user_id_key" ON "recpac"("rec_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_tag_name_key" ON "tag"("tag_name");

-- CreateIndex
CREATE UNIQUE INDEX "rec_tag_rec_id_tag_id_key" ON "rec_tag"("rec_id", "tag_id");

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record" ADD CONSTRAINT "record_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "stage"("stage_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recpac" ADD CONSTRAINT "recpac_rec_id_fkey" FOREIGN KEY ("rec_id") REFERENCES "record"("rec_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recpac" ADD CONSTRAINT "recpac_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_rec_id_fkey" FOREIGN KEY ("rec_id") REFERENCES "record"("rec_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rec_tag" ADD CONSTRAINT "rec_tag_rec_id_fkey" FOREIGN KEY ("rec_id") REFERENCES "record"("rec_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rec_tag" ADD CONSTRAINT "rec_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("tag_id") ON DELETE RESTRICT ON UPDATE CASCADE;
