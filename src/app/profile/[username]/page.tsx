import {
  getAllUserPost,
  getUserLikedPosts,
  getUserProfileByUsername,
  isFollowing,
} from "@/actions/profile.action";
import { notFound } from "next/navigation";
import React from "react";
import ProfileClient from "../ProfileClient";

// export async function genarateMetadata({
//   params,
// }: {
//   params: { username: string };
// }) {
//   const user = await getUserProfileByUsername(params.username);
//   console.log("user for genaratemetadat", user);
//   if (!user) {
//     return;
//   }
//   return {
//     title: `${user.name ?? user.username}`,
//     description: "A user can write his BIO",
//   };
// }

async function ProfilePage({ params }: { params: { username: string } }) {
  //   console.log("this is params user:", params);
  const user = await getUserProfileByUsername(params.username);
  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getAllUserPost(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  await new Promise((resolve) => setTimeout(resolve, 3000));
  return (
    <ProfileClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}

export default ProfilePage;
