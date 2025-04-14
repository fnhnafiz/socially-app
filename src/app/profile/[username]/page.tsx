import {
  getAllUserPost,
  getUserLikedPosts,
  getUserProfileByUsername,
  isFollowing,
} from "@/actions/profile.action";
import { notFound } from "next/navigation";
import React from "react";
import ProfileClient from "../ProfileClient";

// ✅ Correct Type: matches what Next.js expects in the App Router
type Props = {
  params: {
    username: string;
  };
};

export default async function ProfilePage({ params }: Props) {
  const user = await getUserProfileByUsername(params.username);
  if (!user) return notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getAllUserPost(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfileClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}
