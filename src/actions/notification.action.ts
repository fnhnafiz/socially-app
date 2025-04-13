"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";

export async function getAllNotification() {
  try {
    const userId = await getDbUserId();
    if (!userId) {
      return [];
    }
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            image: true,
          },
        },
        comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return notifications;
  } catch (error) {
    console.log("Error failed to notification", error);
    throw new Error("Error failed to notification");
  }
}

export async function readNotifications(notificationIds: string[]) {
  try {
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });
    return { success: true };
  } catch (error) {
    console.log("Error failed to fetch notificaiton", error);
    return { success: false };
  }
}
