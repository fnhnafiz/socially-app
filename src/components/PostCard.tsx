"use client";

import {
  createComment,
  deletePost,
  getAllPost,
  toggleLike,
} from "@/actions/post.action";
import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";

import { formatDistanceToNow } from "date-fns";
import DeleteAlert from "./DeleteAlert";

type Posts = Awaited<ReturnType<typeof getAllPost>>;
type Post = Posts[number];

function PostCard({ post, dbUserId }: { post: Post; dbUserId: string | null }) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsliking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId)
  );
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);

  //   funtionality for the post section
  const handleLike = async () => {
    if (isLiking) {
      return;
    }
    try {
      setIsliking(true);
      setHasLiked((prev) => !prev);
      setOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      setOptimisticLikes(post._count.likes);
      setHasLiked(post.likes.some((like) => like.userId === dbUserId));
    } finally {
      setIsliking(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) {
      return;
    }

    try {
      setIsCommenting(true);
      const result = await createComment(post.id, newComment);
      if (result?.success) {
        toast.success("Your comment done successfully!");
        setNewComment("");
      }
    } catch (error) {
      toast.error("Opps! failed your comment");
      setNewComment("");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting) {
      return;
    }
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (result?.success) {
        toast.success("Remove your post");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Opps! failed to deleted post");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Card className="overflow-hidden ">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Post user Image */}
          <div className="flex gap-3 sm:space-x-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="size-9 sm:w-10 sm:h-10">
                <AvatarImage src={post.author.image ?? "/avatar.png"} />
              </Avatar>
            </Link>
            {/* post and commenting box */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link
                    href={`/profile/${post.author.username}`}
                    className="font-semibold truncate"
                  >
                    {post.author.name}
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href={`/profile/${post.author.username}`}>
                      @{post.author.username}
                    </Link>
                    <span>.</span>
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div>
                </div>
                {dbUserId === post.author.id && (
                  <DeleteAlert
                    isDeleting={isDeleting}
                    onDelete={handleDeletePost}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PostCard;
