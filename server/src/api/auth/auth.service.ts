import { RefreshToken, User } from "@prisma/client";
import prisma from "../../utils/db";
import { hashToken } from "../../utils/hashToken";

// used when we create a refresh token.
export function addRefreshTokenToWhitelist({
  jti,
  refreshToken,
  userId,
}: {
  jti: string;
  refreshToken: string;
  userId: User["id"];
}) {
  return prisma.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
}

// used to check if the token sent by the client is in the database.
export function findRefreshTokenById(id: RefreshToken["id"]) {
  return prisma.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

// soft delete tokens after usage.
export function deleteRefreshToken(id: RefreshToken["id"]) {
  return prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
}

export function revokeTokens(userId: User["id"]) {
  return prisma.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
}
