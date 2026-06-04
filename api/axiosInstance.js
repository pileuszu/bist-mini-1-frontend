import axios from "axios";
import {
  dbGetMe,
  dbUpdateProfile,
  dbGetProfile,
  dbGetPostList,
  dbGetPostDetail,
  dbCreatePost,
  dbUpdatePost,
  dbDeletePost,
  dbToggleLike,
  dbToggleBookmark,
  dbGetComments,
  dbCreateComment,
  dbFollowUser,
  dbUnfollowUser,
  dbGetFollowCount,
  dbGetFollowers,
  dbGetFollowings,
  dbGetNotifications,
  dbMarkNotificationRead,
  dbMarkAllNotificationsRead,
  dbGetChatRooms,
  dbGetOrCreateRoom,
  dbGetMessageHistory,
  dbMarkChatRead,
  dbAddChatMessage
} from "../utils/mockDb";

export const MOCK_MODE = true;

const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  if (typeof window !== "undefined" && window.location) {
    const hostname = window.location.hostname;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `http://${hostname}:8080`;
    }
  }
  
  return "http://localhost:8080";
};

const mockAdapter = async (config) => {
  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();
  const params = config.params || {};
  const token = config.headers?.Authorization?.split(" ")[1];

  let body = {};
  if (config.data) {
    try {
      if (typeof config.data === "string") {
        body = JSON.parse(config.data);
      } else {
        body = config.data;
      }
    } catch (e) {
      body = config.data;
    }
  }

  // Simulate network latency (250ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  let resData = null;
  let status = 200;

  try {
    // 1. Members
    if (url.includes("/api/members/login") && method === "post") {
      const members = JSON.parse(localStorage.getItem("slog_mock_members") || "[]");
      const found = members.find(m => m.loginId === body.loginId);
      if (found) {
        const mockToken = "header." + btoa(JSON.stringify({
          sub: String(found.memberId),
          nickname: found.nickname,
          exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 365 * 10
        })) + ".signature";
        resData = {
          accessToken: mockToken,
          nickname: found.nickname,
          memberId: found.memberId
        };
      } else {
        throw { status: 400, message: "아이디 또는 비밀번호를 잘못 입력했습니다." };
      }
    } else if (url.includes("/api/members/join") && method === "post") {
      const members = JSON.parse(localStorage.getItem("slog_mock_members") || "[]");
      const nextId = members.length > 0 ? Math.max(...members.map(m => m.memberId)) + 1 : 1;
      const newMember = {
        memberId: nextId,
        loginId: body.loginId,
        email: body.email,
        nickname: body.nickname,
        bio: "",
        profileImageUrl: null,
        interestTags: []
      };
      members.push(newMember);
      localStorage.setItem("slog_mock_members", JSON.stringify(members));
      resData = { status: "success", data: newMember };
    } else if (url.includes("/api/members/me") && method === "get") {
      const me = dbGetMe(token);
      resData = { status: "success", data: me };
    } else if (url.includes("/api/members/check-login-id") && method === "get") {
      const members = JSON.parse(localStorage.getItem("slog_mock_members") || "[]");
      resData = members.some(m => m.loginId === params.loginId);
    } else if (url.includes("/api/members/check-email") && method === "get") {
      const members = JSON.parse(localStorage.getItem("slog_mock_members") || "[]");
      resData = members.some(m => m.email === params.email);
    } else if (url.includes("/api/members/check-nickname") && method === "get") {
      const members = JSON.parse(localStorage.getItem("slog_mock_members") || "[]");
      resData = members.some(m => m.nickname === params.nickname);
    } else if (url.includes("/api/tags") && method === "get") {
      const tags = JSON.parse(localStorage.getItem("slog_mock_tags") || "[]");
      resData = tags;
    } else if (url.includes("/api/members/me/nickname") && method === "patch") {
      resData = { status: "success", data: dbUpdateProfile(token, { nickname: body.nickname }) };
    } else if (url.includes("/api/members/me/password") && method === "patch") {
      resData = { status: "success" };
    } else if (url.includes("/api/members/me/bio") && method === "patch") {
      resData = { status: "success", data: dbUpdateProfile(token, { bio: body.bio }) };
    } else if (url.includes("/api/members/me/profile-image") && method === "patch") {
      const randomImages = [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150"
      ];
      const selected = randomImages[Math.floor(Math.random() * randomImages.length)];
      resData = { status: "success", data: dbUpdateProfile(token, { profileImageUrl: selected }) };
    } else if (url.includes("/api/members/me/bookmarks") && method === "get") {
      const me = dbGetMe(token);
      if (me) {
        const bookmarks = JSON.parse(localStorage.getItem("slog_mock_bookmarks_" + me.memberId) || "[]");
        const posts = JSON.parse(localStorage.getItem("slog_mock_posts") || "[]");
        resData = { status: "success", data: posts.filter(p => bookmarks.includes(p.postId)) };
      } else {
        resData = { status: "success", data: [] };
      }
    } else if (url.includes("/api/members/me/interest-tags") && method === "get") {
      const me = dbGetMe(token);
      resData = { status: "success", data: me ? me.interestTags || [] : [] };
    } else if (url.includes("/api/members/me/interest-tags") && method === "patch") {
      resData = { status: "success", data: dbUpdateProfile(token, { interestTags: body.tagIds }) };
    } else if (url.match(/\/api\/members\/(\d+)\/profile/) && method === "get") {
      const memberId = url.match(/\/api\/members\/(\d+)\/profile/)[1];
      resData = { status: "success", data: dbGetProfile(memberId) };
    } else if (url.match(/\/api\/members\/(\d+)\/posts/) && method === "get") {
      const memberId = url.match(/\/api\/members\/(\d+)\/posts/)[1];
      const posts = JSON.parse(localStorage.getItem("slog_mock_posts") || "[]");
      resData = { status: "success", data: posts.filter(p => String(p.memberId) === String(memberId)) };
    } else if (url.match(/\/api\/members\/(\d+)\/is-me/) && method === "get") {
      const memberId = url.match(/\/api\/members\/(\d+)\/is-me/)[1];
      const me = dbGetMe(token);
      resData = { status: "success", data: me ? String(me.memberId) === String(memberId) : false };
    }

    // 2. Follows
    else if (url.match(/\/api\/follows\/(\d+)\/count/) && method === "get") {
      const memberId = url.match(/\/api\/follows\/(\d+)\/count/)[1];
      resData = { status: "success", data: dbGetFollowCount(memberId) };
    } else if (url.match(/\/api\/follows\/(\d+)\/followers/) && method === "get") {
      const memberId = url.match(/\/api\/follows\/(\d+)\/followers/)[1];
      resData = { status: "success", data: dbGetFollowers(memberId) };
    } else if (url.match(/\/api\/follows\/(\d+)\/followings/) && method === "get") {
      const memberId = url.match(/\/api\/follows\/(\d+)\/followings/)[1];
      resData = { status: "success", data: dbGetFollowings(memberId) };
    } else if (url.match(/\/api\/follows\/(\d+)/) && method === "post") {
      const followingId = url.match(/\/api\/follows\/(\d+)/)[1];
      resData = { status: "success", data: dbFollowUser(followingId, token) };
    } else if (url.match(/\/api\/follows\/(\d+)/) && method === "delete") {
      const followingId = url.match(/\/api\/follows\/(\d+)/)[1];
      resData = { status: "success", data: dbUnfollowUser(followingId, token) };
    } else if (url.includes("/api/follows/me/followers") && method === "get") {
      const me = dbGetMe(token);
      resData = { status: "success", data: me ? dbGetFollowers(me.memberId) : { count: 0, users: [] } };
    } else if (url.includes("/api/follows/me/followings") && method === "get") {
      const me = dbGetMe(token);
      resData = { status: "success", data: me ? dbGetFollowings(me.memberId) : { count: 0, users: [] } };
    }

    // 3. Posts
    else if (url.match(/\/api\/posts\/(\d+)\/mine/) && method === "get") {
      const postId = url.match(/\/api\/posts\/(\d+)\/mine/)[1];
      const me = dbGetMe(token);
      const posts = JSON.parse(localStorage.getItem("slog_mock_posts") || "[]");
      const post = posts.find(p => String(p.postId) === String(postId));
      resData = { status: "success", data: me && post ? String(post.memberId) === String(me.memberId) : false };
    } else if (url.match(/\/api\/posts\/(\d+)\/like/) && method === "post") {
      const postId = url.match(/\/api\/posts\/(\d+)\/like/)[1];
      resData = { status: "success", data: dbToggleLike(postId, token) };
    } else if (url.match(/\/api\/posts\/(\d+)\/bookmark/) && method === "post") {
      const postId = url.match(/\/api\/posts\/(\d+)\/bookmark/)[1];
      resData = { status: "success", data: dbToggleBookmark(postId, token) };
    } else if (url.match(/\/api\/posts\/(\d+)\/recommended/) && method === "get") {
      const postId = url.match(/\/api\/posts\/(\d+)\/recommended/)[1];
      const posts = JSON.parse(localStorage.getItem("slog_mock_posts") || "[]");
      const currentPost = posts.find(p => String(p.postId) === String(postId));
      let recommended = [];
      if (currentPost && currentPost.tags) {
        recommended = posts.filter(p => String(p.postId) !== String(postId) && p.tags && p.tags.some(t => currentPost.tags.includes(t)));
      }
      if (recommended.length === 0) {
        recommended = posts.filter(p => String(p.postId) !== String(postId)).slice(0, 4);
      } else {
        recommended = recommended.slice(0, 4);
      }
      resData = { status: "success", data: recommended };
    } else if (url.match(/\/api\/posts\/(\d+)/) && method === "get") {
      const postId = url.match(/\/api\/posts\/(\d+)/)[1];
      resData = dbGetPostDetail(postId, token);
    } else if (url.match(/\/api\/posts\/(\d+)/) && method === "put") {
      const postId = url.match(/\/api\/posts\/(\d+)/)[1];
      resData = { status: "success", data: dbUpdatePost(postId, body, token) };
    } else if (url.match(/\/api\/posts\/(\d+)/) && method === "delete") {
      const postId = url.match(/\/api\/posts\/(\d+)/)[1];
      resData = { status: "success", data: dbDeletePost(postId, token) };
    } else if (url.includes("/api/posts/temp/list") && method === "get") {
      resData = { status: "success", data: [] };
    } else if (url.match(/\/api\/posts\/temp\/(\d+)/) && method === "get") {
      resData = { status: "success", data: null };
    } else if (url.match(/\/api\/posts\/temp\/(\d+)/) && method === "delete") {
      resData = { status: "success" };
    } else if (url.includes("/api/posts") && method === "get") {
      resData = dbGetPostList({
        page: Number(params.page || 1),
        size: Number(params.size || 12),
        keyword: params.keyword || "",
        sort: params.sort || "latest"
      }, token);
    } else if (url.includes("/api/posts") && method === "post") {
      resData = { status: "success", data: dbCreatePost(body, token) };
    }

    // 4. Comments
    else if (url.match(/\/api\/comments\/post\/(\d+)/) && method === "get") {
      const postId = url.match(/\/api\/comments\/post\/(\d+)/)[1];
      resData = { status: "success", data: dbGetComments(postId, Number(params.page || 1), Number(params.size || 10)) };
    } else if (url.match(/\/api\/comments\/(\d+)\/mine/) && method === "get") {
      const commentId = url.match(/\/api\/comments\/(\d+)\/mine/)[1];
      const me = dbGetMe(token);
      const comments = JSON.parse(localStorage.getItem("slog_mock_comments") || "[]");
      const comment = comments.find(c => String(c.commentId) === String(commentId));
      resData = { status: "success", data: me && comment ? String(comment.memberId) === String(me.memberId) : false };
    } else if (url.match(/\/api\/comments\/(\d+)\/like/) && method === "post") {
      const commentId = url.match(/\/api\/comments\/(\d+)\/like/)[1];
      const comments = JSON.parse(localStorage.getItem("slog_mock_comments") || "[]");
      const idx = comments.findIndex(c => String(c.commentId) === String(commentId));
      let liked = false;
      if (idx !== -1) {
        comments[idx].likeCount = (comments[idx].likeCount || 0) + 1;
        liked = true;
        localStorage.setItem("slog_mock_comments", JSON.stringify(comments));
      }
      resData = { status: "success", data: liked };
    } else if (url.match(/\/api\/comments\/(\d+)/) && method === "put") {
      const commentId = url.match(/\/api\/comments\/(\d+)/)[1];
      const comments = JSON.parse(localStorage.getItem("slog_mock_comments") || "[]");
      const idx = comments.findIndex(c => String(c.commentId) === String(commentId));
      if (idx !== -1) {
        comments[idx].content = body.content;
        localStorage.setItem("slog_mock_comments", JSON.stringify(comments));
        resData = { status: "success", data: comments[idx] };
      }
    } else if (url.match(/\/api\/comments\/(\d+)/) && method === "delete") {
      const commentId = url.match(/\/api\/comments\/(\d+)/)[1];
      const comments = JSON.parse(localStorage.getItem("slog_mock_comments") || "[]");
      const filtered = comments.filter(c => String(c.commentId) !== String(commentId) && String(c.parentId) !== String(commentId));
      localStorage.setItem("slog_mock_comments", JSON.stringify(filtered));
      resData = { status: "success" };
    } else if (url.includes("/api/comments") && method === "post") {
      resData = { status: "success", data: dbCreateComment(body, token) };
    }

    // 5. Notifications
    else if (url.includes("/api/notifications/read-all") && method === "patch") {
      resData = { status: "success", data: dbMarkAllNotificationsRead(token) };
    } else if (url.match(/\/api\/notifications\/(\d+)\/read/) && method === "patch") {
      const notifId = url.match(/\/api\/notifications\/(\d+)\/read/)[1];
      resData = { status: "success", data: dbMarkNotificationRead(notifId) };
    } else if (url.match(/\/api\/notifications\/(\d+)/) && method === "delete") {
      const notifId = url.match(/\/api\/notifications\/(\d+)/)[1];
      const notifs = JSON.parse(localStorage.getItem("slog_mock_notifications") || "[]");
      const filtered = notifs.filter(n => String(n.notificationId) !== String(notifId));
      localStorage.setItem("slog_mock_notifications", JSON.stringify(filtered));
      resData = { status: "success" };
    } else if (url.includes("/api/notifications/all") && method === "delete") {
      localStorage.setItem("slog_mock_notifications", "[]");
      resData = { status: "success" };
    } else if (url.includes("/api/notifications") && method === "get") {
      resData = { status: "success", data: dbGetNotifications(token) };
    }

    // 6. Chats
    else if (url.includes("/api/chat/rooms/personal") && method === "post") {
      const partnerId = url.split("/").pop();
      resData = { status: "success", data: dbGetOrCreateRoom(partnerId, token) };
    } else if (url.match(/\/api\/chat\/rooms\/(\d+)\/messages/) && method === "get") {
      const roomId = url.match(/\/api\/chat\/rooms\/(\d+)\/messages/)[1];
      resData = { status: "success", data: dbGetMessageHistory(roomId, Number(params.page || 1), Number(params.size || 50)) };
    } else if (url.match(/\/api\/chat\/rooms\/(\d+)\/messages/) && method === "post") {
      const roomId = url.match(/\/api\/chat\/rooms\/(\d+)\/messages/)[1];
      const me = dbGetMe(token);
      resData = { status: "success", data: dbAddChatMessage(roomId, me.memberId, body.content, true) };
    } else if (url.match(/\/api\/chat\/rooms\/(\d+)\/read/) && method === "patch") {
      const roomId = url.match(/\/api\/chat\/rooms\/(\d+)\/read/)[1];
      resData = { status: "success", data: dbMarkChatRead(roomId, token) };
    } else if (url.match(/\/api\/chat\/messages\/(\d+)/) && method === "put") {
      const msgId = url.match(/\/api\/chat\/messages\/(\d+)/)[1];
      const rooms = JSON.parse(localStorage.getItem("slog_mock_chats") || "[]");
      let found = null;
      rooms.forEach(r => {
        const m = r.messages.find(msg => String(msg.messageId) === String(msgId));
        if (m) {
          m.content = body.content;
          found = m;
        }
      });
      localStorage.setItem("slog_mock_chats", JSON.stringify(rooms));
      resData = { status: "success", data: found };
    } else if (url.match(/\/api\/chat\/messages\/(\d+)/) && method === "delete") {
      const msgId = url.match(/\/api\/chat\/messages\/(\d+)/)[1];
      const rooms = JSON.parse(localStorage.getItem("slog_mock_chats") || "[]");
      rooms.forEach(r => {
        const mIdx = r.messages.findIndex(msg => String(msg.messageId) === String(msgId));
        if (mIdx !== -1) {
          r.messages[mIdx].isDeleted = true;
        }
      });
      localStorage.setItem("slog_mock_chats", JSON.stringify(rooms));
      resData = { status: "success" };
    } else if (url.includes("/api/chat/rooms") && method === "get") {
      resData = { status: "success", data: dbGetChatRooms(token) };
    }

    // 7. File Attachments
    else if (url.includes("/api/attachments/upload") && method === "post") {
      resData = {
        status: "success",
        data: [
          {
            attachmentId: 999,
            fileUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500"
          }
        ]
      };
    }

    if (resData === null) {
      console.warn("Unmatched Mock API:", method, url, body, params);
      throw { status: 404, message: "Mock Route Not Found" };
    }

    return {
      data: resData,
      status: status,
      statusText: "OK",
      headers: {},
      config
    };
  } catch (err) {
    console.error("Mock API Error:", err);
    return Promise.reject({
      response: {
        data: { message: err.message || "서버 에러" },
        status: err.status || 500,
        statusText: "Error",
        headers: {},
        config
      }
    });
  }
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

if (MOCK_MODE && typeof window !== "undefined") {
  axiosInstance.defaults.adapter = mockAdapter;
}

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log("인증이 필요하거나 토큰이 만료되었습니다.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;