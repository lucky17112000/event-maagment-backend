/*


model Idea {
    id               String      @id @default(uuid())
    title            String
    problemStatement String
    solutinon        String
    description      String
    images           String[]    @default([])
    authorId         String
    author           User        @relation(fields: [authorId], references: [id], onDelete: Cascade)
    categoryId       String
    category         Category    @relation(fields: [categoryId], references: [id], onDelete: Cascade)
    status           IDEA_STATUS @default(UNDER_REVIEW)
    isPaid           Boolean     @default(false)
    price            Float?
    isDeleted        Boolean     @default(false)
    deletedAt        DateTime?
    createdAt        DateTime    @default(now())
    updatedAt        DateTime    @updatedAt
    votes            Vote[]
    //   comments         Comment[]
    purchases        Purchase[]
    payments         Payment[]
    feedback         Feedback?

    @@index([authorId])
    @@index([categoryId])
    @@map("idea")
}

*/
export {};
