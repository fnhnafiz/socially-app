"use client";
import {
  getAllNotification,
  readNotifications,
} from "@/actions/notification.action";
import NotificationSkeleton from "@/components/NotificationSkeleton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { formatDistanceToNow } from "date-fns";
import {
  HeartIcon,
  Image,
  MessageCircleIcon,
  UserPlusIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Notifications = Awaited<ReturnType<typeof getAllNotification>>;
type Notification = Notifications[number];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "LIKE":
      return <HeartIcon className="size-4 text-red-500" />;
    case "COMMENT":
      return <MessageCircleIcon className="size-4 text-blue-500" />;
    case "FOLLOW":
      return <UserPlusIcon className="size-4 text-green-500" />;
    default:
      return null;
  }
};

function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await getAllNotification();
        setNotifications(data);

        const unReadNotification = data.filter((n) => !n.read).map((n) => n.id);
        if (unReadNotification.length > 0) {
          await readNotifications(unReadNotification);
        }
      } catch (error) {
        toast.error("Failed to fetch notifications");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllNotifications();
  }, []);
  if (isLoading) {
    return <NotificationSkeleton />;
  }
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <span className="text-s, text-muted-foreground">
              {notifications.filter((n) => !n.read).length} unread
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {notifications.length === 0 ? (
              <>
                <div className="p-4 text-center">No Notificaions</div>
              </>
            ) : (
              <>
                {notifications.map((notify) => (
                  <div
                    key={notify.id}
                    className={`flex items-start gap-4 p-4 border-b hover:bg-muted/25 transition-colors ${
                      !notify.read ? "bg-muted/50" : ""
                    }`}
                  >
                    <Avatar className="mt-1">
                      <AvatarImage
                        src={notify.creator.image ?? "/avatar.png"}
                      />
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notify.type)}
                        <span>
                          <span className="mr-2">
                            {notify.creator.name ?? notify.creator.username}
                          </span>

                          {notify.type === "FOLLOW"
                            ? "started following you"
                            : notify.type === "LIKE"
                            ? "liked your post"
                            : "comment on your post"}
                        </span>
                      </div>
                      {notify.post &&
                        (notify.type === "LIKE" ||
                          (notify.type === "COMMENT" && (
                            <div className="pl-6 space-y-2">
                              <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                                <p>{notify.post.content}</p>

                                {notify.post.image && (
                                  <img
                                    src={notify.post.image}
                                    alt="content image"
                                    className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                                  />
                                )}
                              </div>

                              {notify.type === "COMMENT" && notify.comment && (
                                <div className="text-sm p-2 bg-accent/50 rounded-md">
                                  {" "}
                                  {notify.comment.content}
                                </div>
                              )}
                            </div>
                          )))}
                      <p className="text-sm text-muted-foreground pl-6">
                        {formatDistanceToNow(new Date(notify.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotificationPage;
