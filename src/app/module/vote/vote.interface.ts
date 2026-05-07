/*

model Vote {
    id        String    @id @default(uuid())
    ideaId    String
    idea      Idea      @relation(fields: [ideaId], references: [id], onDelete: Cascade)
    userId    String
    user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
    type      VOTE_TYPE
    createdAt DateTime  @default(now())
    updatedAt DateTime  @updatedAt

    @@index([ideaId])
    @@index([userId])
    @@map("votes")
}

*/
export enum VOTE_TYPE {
  UP = "UP",
  DOWN = "DOWN",
}

export interface ICreateVotePayload {
  ideaId: string;
  type: VOTE_TYPE;
  userId: string;
}
export interface IRemoveVotePayload {
  id: string;
  ideaId: string;
  userId: string;
}
