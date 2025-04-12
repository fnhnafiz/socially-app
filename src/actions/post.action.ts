"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, image: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;
    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId,
      },
    });
    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.log("failed to create post:", error);
    return { success: false, error: "failed to create post" };
  }
}
export async function getAllPost() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.log("Error to faile for all posts");
    throw new Error("Failed to fetch all post from post dot actions");
  }
}
export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;
    // checking likes
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found");
    if (existingLike) {
      // unlike the post
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      // like the post
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId,
                  creatorId: userId,
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("error in the failed toggle likes", error);
    return { success: false, error: "Failed to likes" };
  }
}
export async function createComment(postId: string, content: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) {
      return;
    }
    if (!content) {
      throw new Error("Content must be required");
    }
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    if (!post) {
      throw new Error("Your post not found at this time");
    }

    const [comment] = await prisma.$transaction(async (tx) => {
      // create comment when a user write anything in the comment box area
      const newComment = await tx.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
        },
      });

      // create notification for if a user commenting on someone others post
      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            userId: post.authorId,
            creatorId: userId,
            postId,
            commentId: newComment.id,
          },
        });
      }
      return [newComment];
    });
    revalidatePath("/");
    return { success: true, comment };
  } catch (error) {
    console.log("Failed to create comment ", error);
    return { success: false, error: "Opps! comment failed" };
  }
}
export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      throw new Error("Your post not found at this momment");
    }
    if (post.authorId !== userId) {
      throw new Error("Oppss! you don't have permission for delete this post");
    }

    await prisma.post.delete({
      where: { id: postId },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Faild to deleted post from Deleted post", error);
    return { success: false, error: "Faild to deleted post from Deleted post" };
  }
}
