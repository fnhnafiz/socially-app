// import {
//   getAllUserPost,
//   getUserLikedPosts,
//   getUserProfileByUsername,
//   isFollowing,
// } from "@/actions/profile.action";
// import { notFound } from "next/navigation";
// import React from "react";
// import ProfileClient from "../ProfileClient";

import {
  getAllUserPost,
  getUserLikedPosts,
  getUserProfileByUsername,
  isFollowing,
} from "@/actions/profile.action";
import { notFound } from "next/navigation";
import ProfileClient from "../ProfileClient";

// type Props = {
//   params: {
//     username: string;
//   };
// };

// export async function generateMetadata({
//   params,
// }: {
//   params: { username: string };
// }) {
//   const user = await getUserProfileByUsername(params.username);
//   if (!user) return;

//   return {
//     title: `${user.name ?? user.username}`,
//     description: user.bio || `Check out ${user.username}'s profile.`,
//   };
// }

// // export default async function ProfilePage({ params }: Props) {
// //   const user = await getUserProfileByUsername(params.username);
// //   if (!user) return notFound();

// //   const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
// //     getAllUserPost(user.id),
// //     getUserLikedPosts(user.id),
// //     isFollowing(user.id),
// //   ]);

// //   return (
// //     <ProfileClient
// //       user={user}
// //       posts={posts}
// //       likedPosts={likedPosts}
// //       isFollowing={isCurrentUserFollowing}
// //     />
// //   );
// // }
// export default async function ProfilePage({
//   params,
// }: {
//   params: { username: string };
// }) {
//   const user = await getUserProfileByUsername(params.username);
//   if (!user) return notFound();

//   const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
//     getAllUserPost(user.id),
//     getUserLikedPosts(user.id),
//     isFollowing(user.id),
//   ]);

//   return (
//     <ProfileClient
//       user={user}
//       posts={posts}
//       likedPosts={likedPosts}
//       isFollowing={isCurrentUserFollowing}
//     />
//   );
// }
// import {
//   getAllUserPost,
//   getUserLikedPosts,
//   getUserProfileByUsername,
//   isFollowing,
// } from "@/actions/profile.action";
// import { notFound } from "next/navigation";
// import ProfileClient from "../ProfileClient";

// type Props = {
//   params: Promise<{ username: string }>;
// };

// export async function generateMetadata({ params }: Props) {
//   const user = await getUserProfileByUsername(params.username);
//   if (!user) return;

//   return {
//     title: `${user.name ?? user.username}`,
//     description: user.bio || `Check out ${user.username}'s profile.`,
//   };
// }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;
  const user = await getUserProfileByUsername(username);
  if (!user) return;

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile.`,
  };
}
// params: Promise<{ slug: string }>
async function ProfilePageServer({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const username = (await params).username;
  const user = await getUserProfileByUsername(username);

  if (!user) notFound();

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
export default ProfilePageServer;

// export default async function ProfilePage({ params }: Props) {
//   const user = await getUserProfileByUsername(params.username);

//   if (!user) notFound();

//   const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
//     getAllUserPost(user.id),
//     getUserLikedPosts(user.id),
//     isFollowing(user.id),
//   ]);

//   return (
//     <ProfileClient
//       user={user}
//       posts={posts}
//       likedPosts={likedPosts}
//       isFollowing={isCurrentUserFollowing}
//     />
//   );
// }
// app/profile/[username]/page.tsx

// app/profile/[username]/page.tsx

// import {
//   getAllUserPost,
//   getUserLikedPosts,
//   getUserProfileByUsername,
//   isFollowing,
// } from "@/actions/profile.action";
// import { notFound } from "next/navigation";
// import ProfileClient from "../ProfileClient";
// import type { Metadata } from "next";

// // Correct type: NOT a promise
// type PageProps = {
//   params: {
//     username: string;
//   };
// };

// // ✅ This is correct and should work
// export async function generateMetadata({
//   params,
// }: PageProps): Promise<Metadata> {
//   const user = await getUserProfileByUsername(params.username); // NO optional chaining
//   if (!user) {
//     return {
//       title: "User not found",
//       description: "This user profile does not exist.",
//     };
//   }

//   return {
//     title: `${user.name ?? user.username}`,
//     description: user.bio || `Check out ${user.username}'s profile.`,
//   };
// }

// export default async function ProfilePageServer({ params }: PageProps) {
//   const user = await getUserProfileByUsername(params.username);

//   if (!user) notFound();

//   const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
//     getAllUserPost(user.id),
//     getUserLikedPosts(user.id),
//     isFollowing(user.id),
//   ]);

//   return (
//     <ProfileClient
//       user={user}
//       posts={posts}
//       likedPosts={likedPosts}
//       isFollowing={isCurrentUserFollowing}
//     />
//   );
// }
