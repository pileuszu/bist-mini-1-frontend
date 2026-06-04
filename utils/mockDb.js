/**
 * SLog Mock Database & Interceptor Helpers (Runs entirely in browser localStorage)
 */

const DB_PREFIX = "slog_mock_";

const getStorageItem = (key, defaultVal) => {
  if (typeof window === "undefined") return defaultVal;
  const data = localStorage.getItem(DB_PREFIX + key);
  return data ? JSON.parse(data) : defaultVal;
};

const setStorageItem = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(DB_PREFIX + key, JSON.stringify(value));
  }
};

// ----------------------------------------------------
// Mock event emitter for SSE notifications and chats
// ----------------------------------------------------
export const mockEventBus = {
  listeners: new Set(),
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  },
  emit(type, data) {
    this.listeners.forEach((cb) => cb(type, data));
  }
};

if (typeof window !== "undefined") {
  window.mockEventBus = mockEventBus;
}

// ----------------------------------------------------
// Initial Seeds
// ----------------------------------------------------
const SEED_TAGS = [
  { tagId: 1, name: "React" },
  { tagId: 2, name: "Next.js" },
  { tagId: 3, name: "JavaScript" },
  { tagId: 4, name: "CSS" },
  { tagId: 5, name: "TypeScript" },
  { tagId: 6, name: "Spring" },
  { tagId: 7, name: "Database" },
  { tagId: 8, name: "Git" },
  { tagId: 9, name: "Coding" }
];

const SEED_MEMBERS = [
  {
    memberId: 1,
    loginId: "gildong",
    email: "gildong@slog.com",
    nickname: "홍길동",
    bio: "안녕하세요, SLog에 오신 것을 환영합니다! 열심히 공부하는 개발자 홍길동입니다. 🌱",
    profileImageUrl: null,
    interestTags: [1, 2, 3]
  },
  {
    memberId: 2,
    loginId: "dev_kim",
    email: "kim@slog.com",
    nickname: "김개발",
    bio: "Frontend Engineer / React, Next.js / 커피와 코딩을 좋아합니다. ☕",
    profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60",
    interestTags: [1, 2, 5]
  },
  {
    memberId: 3,
    loginId: "design_lee",
    email: "lee@slog.com",
    nickname: "이디자인",
    bio: "UI/UX Designer / 아름답고 직관적인 인터페이스를 연구합니다. 🎨",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
    interestTags: [3, 4]
  },
  {
    memberId: 4,
    loginId: "pm_park",
    email: "park@slog.com",
    nickname: "박기획",
    bio: "Product Manager / 문제를 해결하고 새로운 가치를 만드는 것을 좋아합니다. 🚀",
    profileImageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=60",
    interestTags: [8, 9]
  },
  {
    memberId: 5,
    loginId: "backend_choi",
    email: "choi@slog.com",
    nickname: "최백엔드",
    bio: "Backend Dev / Java, Spring Boot, MySQL / 대용량 아키텍처에 관심이 많습니다.",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
    interestTags: [6, 7]
  },
  {
    memberId: 6,
    loginId: "front_jung",
    email: "jung@slog.com",
    nickname: "정프론트",
    bio: "Front-end Dev / HTML, CSS, Javascript / 웹 표준과 스펙 문서를 읽는 것이 취미입니다.",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60",
    interestTags: [1, 3, 4]
  }
];

const SEED_FOLLOWS = [
  { followerId: 1, followingId: 2 }, // gildong follows dev_kim
  { followerId: 1, followingId: 6 }, // gildong follows front_jung
  { followerId: 2, followingId: 1 }, // dev_kim follows gildong
  { followerId: 3, followingId: 1 }  // design_lee follows gildong
];

const SEED_POSTS = [
  {
    postId: 1,
    title: "React 19 신기능 살펴보기: 무엇이 달라졌나?",
    content: "## React 19의 주요 변화\n\nReact 19 버전이 드디어 릴리즈되었습니다! 이번 업데이트에는 개발자 경험을 획기적으로 개선할 다양한 기능이 포함되어 있습니다.\n\n### 1. `useActionState` 훅 도입\n폼 전송이나 비동기 액션 처리를 간소화할 수 있는 훅이 도입되었습니다. 기존의 `useState` 여러 개로 관리하던 비동기 상태(pending, error, data)를 한 번에 다룰 수 있어 코드가 깔끔해집니다.\n\n### 2. Server Components 기본 지원\nNext.js에서 사용하던 서버 컴포넌트 개념이 리액트 스펙에 정식 포함되었습니다.\n\n리액트 19의 세부 스펙을 학습하고 토이 프로젝트에 먼저 시험해 보세요!",
    contentPreview: "React 19 버전이 드디어 릴리즈되었습니다! 이번 업데이트에는 개발자 경험을 획기적으로 개선할 다양한 기능이 포함되어 있습니다. useActionState 훅 도입...",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60",
    memberId: 2,
    nickname: "김개발",
    likeCount: 25,
    viewCount: 124,
    commentCount: 0,
    tags: ["React", "JavaScript"],
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    isLiked: false,
    isBookmarked: false
  },
  {
    postId: 2,
    title: "Next.js App Router 완벽 가이드 (16.2.4 버전 기준)",
    content: "## Next.js App Router 가이드\n\nNext.js App Router는 서버 컴포넌트를 기반으로 동작하는 라우팅 시스템입니다.\n\n### Layout과 Page\nApp Router 구조에서는 `layout.js`와 `page.js`가 중심을 이룹니다. `layout.js`는 페이지 이동 간 리렌더링되지 않으며, 공통 UI와 컴포넌트 상태를 유지하는 역할을 합니다.\n\n### Server Component vs Client Component\n- **서버 컴포넌트**: 서버에서 렌더링되어 HTML and 직렬화된 JSON만 브라우저로 내려보냅니다. 클라이언트 번들 사이즈를 줄이는 데 큰 역할을 합니다.\n- **클라이언트 컴포넌트**: `\"use client\"` 지시어를 상단에 선언합니다. 이벤트 리스너나 리액트 훅을 활용해야 할 때 사용합니다.\n\n궁금한 사항이 있으시면 편하게 댓글 남겨주세요!",
    contentPreview: "Next.js App Router는 서버 컴포넌트를 기반으로 동작하는 라우팅 시스템입니다. Layout과 Page 구조 설명 및 서버/클라이언트 컴포넌트의 차이점...",
    thumbnailUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=500&auto=format&fit=crop&q=60",
    memberId: 2,
    nickname: "김개발",
    likeCount: 42,
    viewCount: 245,
    commentCount: 17,
    tags: ["Next.js", "React"],
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    isLiked: false,
    isBookmarked: false
  },
  {
    postId: 3,
    title: "CSS Grid와 Flexbox 언제 무엇을 써야 할까?",
    content: "## Grid vs Flexbox\n\n프론트엔드 레이아웃을 잡을 때 항상 고민하는 주제입니다.\n\n### 1. Flexbox\n- **1차원 레이아웃**에 최적화되어 있습니다.\n- 가로 혹은 세로 방향 중 하나로만 정렬할 때 편리합니다.\n- 주 영역: 내비게이션 바, 아이템 가로 정렬 리스트.\n\n### 2. Grid\n- **2차원 레이아웃** (행과 열 모두)에 최적화되어 있습니다.\n- 격자 형태의 반응형 카드 뷰나 대시보드 구조에 적합합니다.\n- 주 영역: 메인 피드 정렬 카드 리스트.\n\n컨텍스트에 따라 가장 알맞은 도구를 선택해보세요!",
    contentPreview: "프론트엔드 레이아웃을 잡을 때 항상 고민하는 주제입니다. Flexbox와 Grid의 특장점과 적재적소 사용 가이드를 쉽고 명확하게 설명해 드립니다.",
    thumbnailUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60",
    memberId: 6,
    nickname: "정프론트",
    likeCount: 18,
    viewCount: 98,
    commentCount: 0,
    tags: ["CSS", "JavaScript"],
    createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    isLiked: false,
    isBookmarked: false
  },
  {
    postId: 4,
    title: "Spring Boot에서 Custom Annotation 만들기",
    content: "## Spring Boot Custom Annotation\n\n자바 스프링 프레임워크를 사용하다 보면 반복되는 유효성 검사나 로깅, 인가 절차를 접하게 됩니다. 이를 AOP와 함께 어노테이션으로 모듈화하면 가독성을 크게 높일 수 있습니다.\n\n```java\n@Target(ElementType.METHOD)\n@Retention(RetentionPolicy.RUNTIME)\npublic @interface LogExecutionTime {\n}\n```\n\n위와 같이 어노테이션 클래스를 선언하고 `@Aspect` 빈에서 로직을 구현하면 비즈니스 클래스 코드를 깔끔하게 분리할 수 있습니다.",
    contentPreview: "자바 스프링 프레임워크를 사용하다 보면 반복되는 유효성 검사나 로깅, 인가 절차를 접하게 됩니다. 이를 AOP와 함께 어노테이션으로 모듈화하여...",
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60",
    memberId: 5,
    nickname: "최백엔드",
    likeCount: 15,
    viewCount: 82,
    commentCount: 0,
    tags: ["Spring"],
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    isLiked: false,
    isBookmarked: false
  },
  {
    postId: 5,
    title: "Git 브랜치 전략: Git Flow vs GitHub Flow",
    content: "## Git 브랜치 전략 비교\n\n협업 생산성을 높이기 위한 가장 인기 있는 브랜치 관리 전략 두 가지를 비교합니다.\n\n### Git Flow\n- `master`, `develop`, `feature`, `release`, `hotfix` 5개의 고정 브랜치를 운영합니다.\n- 릴리즈 주기가 길고 체계적인 배포가 필요한 패키지나 금융 소프트웨어에 적합합니다.\n\n### GitHub Flow\n- `main` 브랜치 하나와 자유롭게 이름을 지정한 `feature` 브랜치만으로 운영합니다.\n- Pull Request를 통해 코드 리뷰를 거치고 빌드가 완료되면 즉시 `main`에 병합(배포)합니다.\n- 스타트업이나 웹 서비스 등 지속적 배포(CD)에 최적화된 단순하고 빠른 프로세스입니다.",
    contentPreview: "협업 생산성을 높이기 위한 가장 인기 있는 브랜치 관리 전략 두 가지를 비교합니다. Git Flow와 GitHub Flow의 정의 및 실무 적용 가이드.",
    thumbnailUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60",
    memberId: 4,
    nickname: "박기획",
    likeCount: 31,
    viewCount: 178,
    commentCount: 0,
    tags: ["Git"],
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    isLiked: false,
    isBookmarked: false
  }
];

// Generate 32 extra posts to easily show pagination (Total posts: 37)
const generateExtraPosts = () => {
  const posts = [];
  const writerPool = [
    { id: 2, name: "김개발" },
    { id: 3, name: "이디자인" },
    { id: 4, name: "박기획" },
    { id: 5, name: "최백엔드" },
    { id: 6, name: "정프론트" }
  ];
  const tagPool = ["Coding", "Git", "JavaScript", "React", "Next.js", "Spring", "Database"];
  const imagePool = [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60"
  ];

  for (let i = 1; i <= 32; i++) {
    const writer = writerPool[i % writerPool.length];
    const tags = [tagPool[i % tagPool.length], tagPool[(i + 2) % tagPool.length]];
    const thumb = imagePool[i % imagePool.length];
    posts.push({
      postId: 10 + i,
      title: `매일 한 줄 코딩 챌린지 - ${i}일차 학습 일지`,
      content: `### 챌린지 학습기록 ${i}일차\n\n오늘도 포기하지 않고 한 줄 코딩 챌린지를 진행했습니다. 매일 꾸준한 배움이 뛰어난 개발자를 완성합니다.\n\n#### 핵심 포인트\n1. 배운 것을 즉시 기록하여 장기 기억으로 전환하기\n2. 주 1회 코딩 회고 작성\n3. 웹 표준에 근거한 Semantic 태그 구성 연습\n\n지속 가능한 개발 습관을 길러보아요! 🌱`,
      contentPreview: `오늘도 포기하지 않고 한 줄 코딩 챌린지를 진행했습니다. 매일 꾸준한 배움이 뛰어난 개발자를 완성합니다. 배운 것을 즉시 기록하여...`,
      thumbnailUrl: thumb,
      memberId: writer.id,
      nickname: writer.name,
      likeCount: Math.floor(Math.abs(Math.sin(i)) * 25) + 3,
      viewCount: 45 + i * 8,
      commentCount: i % 5 === 0 ? 3 : 0,
      tags: tags,
      createdAt: new Date(Date.now() - (i + 1) * 24 * 3600 * 1000).toISOString(),
      isLiked: false,
      isBookmarked: false
    });
  }
  return posts;
};

const SEED_COMMENTS = [
  // 17 comments on Post 2 (Next.js App Router 완벽 가이드) to test comment load-more pagination
  { commentId: 1, postId: 2, parentId: null, memberId: 3, nickname: "이디자인", content: "Next.js App Router에 대해 정말 상세히 써주셨네요! 잘 배웠습니다. 🎨", createdAt: new Date(Date.now() - 4.5 * 24 * 3600 * 1000).toISOString(), likeCount: 5 },
  { commentId: 2, postId: 2, parentId: 1, memberId: 2, nickname: "김개발", content: "감사합니다 디자인님! 디자인과 연계된 구조도 포스팅해볼게요.", createdAt: new Date(Date.now() - 4.4 * 24 * 3600 * 1000).toISOString(), likeCount: 2 },
  { commentId: 3, postId: 2, parentId: null, memberId: 6, nickname: "정프론트", content: "서버 컴포넌트와 클라이언트 컴포넌트 구분이 명확하지 않았는데 큰 도움이 되었습니다.", createdAt: new Date(Date.now() - 4.2 * 24 * 3600 * 1000).toISOString(), likeCount: 8 },
  { commentId: 4, postId: 2, parentId: 3, memberId: 4, nickname: "박기획", content: "저도 그 부분이 헷갈렸는데 글 덕분에 이해가 가네요.", createdAt: new Date(Date.now() - 4.1 * 24 * 3600 * 1000).toISOString(), likeCount: 1 },
  { commentId: 5, postId: 2, parentId: null, memberId: 5, nickname: "최백엔드", content: "Server Action은 실무에서 쓸 만한가요?", createdAt: new Date(Date.now() - 4.0 * 24 * 3600 * 1000).toISOString(), likeCount: 3 },
  { commentId: 6, postId: 2, parentId: 5, memberId: 2, nickname: "김개발", content: "네! 간단한 폼 전송이나 API 호출 없이 서버 함수를 직접 호출할 때 유용합니다. 보안 문제도 설정으로 방지 가능하고요.", createdAt: new Date(Date.now() - 3.9 * 24 * 3600 * 1000).toISOString(), likeCount: 4 },
  { commentId: 7, postId: 2, parentId: null, memberId: 3, nickname: "이디자인", content: "글 진짜 깔끔해요. 북마크하고 두고두고 보겠습니다!", createdAt: new Date(Date.now() - 3.8 * 24 * 3600 * 1000).toISOString(), likeCount: 6 },
  { commentId: 8, postId: 2, parentId: null, memberId: 6, nickname: "정프론트", content: "Layout과 Template의 차이가 궁금해요.", createdAt: new Date(Date.now() - 3.7 * 24 * 3600 * 1000).toISOString(), likeCount: 2 },
  { commentId: 9, postId: 2, parentId: 8, memberId: 2, nickname: "김개발", content: "Layout은 상태를 유지하고, Template은 페이지 이동 시 항상 인스턴스를 새로 생성해 상태를 초기화합니다! 이 점 주의하셔서 골라 써보세요.", createdAt: new Date(Date.now() - 3.6 * 24 * 3600 * 1000).toISOString(), likeCount: 7 },
  { commentId: 10, postId: 2, parentId: null, memberId: 5, nickname: "최백엔드", content: "좋은 정보 감사합니다. 백엔드 연동 관련 글도 보고 싶네요.", createdAt: new Date(Date.now() - 3.5 * 24 * 3600 * 1000).toISOString(), likeCount: 1 },
  { commentId: 11, postId: 2, parentId: null, memberId: 4, nickname: "박기획", content: "넥스트 입문자인데 강추하는 글입니다!", createdAt: new Date(Date.now() - 3.4 * 24 * 3600 * 1000).toISOString(), likeCount: 3 },
  { commentId: 12, postId: 2, parentId: null, memberId: 6, nickname: "정프론트", content: "혹시 App Router에서 SEO 설정은 어떻게 하나요?", createdAt: new Date(Date.now() - 3.3 * 24 * 3600 * 1000).toISOString(), likeCount: 2 },
  { commentId: 13, postId: 2, parentId: 12, memberId: 2, nickname: "김개발", content: "metadata 객체를 export하거나 generateMetadata 함수를 사용하면 됩니다! 서버 측에서 HTML 파싱을 지원해 정적 SEO 최적화에 최고입니다.", createdAt: new Date(Date.now() - 3.2 * 24 * 3600 * 1000).toISOString(), likeCount: 5 },
  { commentId: 14, postId: 2, parentId: null, memberId: 3, nickname: "이디자인", content: "최고의 글입니다! 🚀", createdAt: new Date(Date.now() - 3.1 * 24 * 3600 * 1000).toISOString(), likeCount: 1 },
  { commentId: 15, postId: 2, parentId: null, memberId: 5, nickname: "최백엔드", content: "유익한 글 공유해주셔서 감사합니다. 공부 많이 되었습니다.", createdAt: new Date(Date.now() - 3.0 * 24 * 3600 * 1000).toISOString(), likeCount: 4 },
  { commentId: 16, postId: 2, parentId: null, memberId: 6, nickname: "정프론트", content: "댓글 수가 벌써 엄청나네요!", createdAt: new Date(Date.now() - 2.9 * 24 * 3600 * 1000).toISOString(), likeCount: 3 },
  { commentId: 17, postId: 2, parentId: 16, memberId: 2, nickname: "김개발", content: "많은 분들이 관심 가져주셔서 기쁩니다. 😊 언제든 또 찾아주세요!", createdAt: new Date(Date.now() - 2.8 * 24 * 3600 * 1000).toISOString(), likeCount: 2 }
];

const SEED_CHATS = [
  // Room 1 (Partner: 김개발)
  {
    roomId: 1,
    partnerId: 2,
    partnerNickname: "김개발",
    partnerProfileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    lastMessage: "네, 언제든 궁금한 점 있으면 말씀해주세요.",
    lastMessageTime: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    unreadCount: 1,
    messages: [
      { messageId: 1, roomId: 1, senderId: 2, senderNickname: "김개발", senderProfileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", messageType: "TEXT", content: "안녕하세요 길동님! 올리신 글 잘 읽었습니다.", createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), unreadCount: 0, isMine: false, isDeleted: false },
      { messageId: 2, roomId: 1, senderId: 1, senderNickname: "홍길동", senderProfileImage: null, messageType: "TEXT", content: "감사합니다 개발님! 자주 소통해요.", createdAt: new Date(Date.now() - 23 * 3600 * 1000).toISOString(), unreadCount: 0, isMine: true, isDeleted: false },
      { messageId: 3, roomId: 1, senderId: 2, senderNickname: "김개발", senderProfileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", messageType: "TEXT", content: "네, 언제든 궁금한 점 있으면 말씀해주세요.", createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), unreadCount: 1, isMine: false, isDeleted: false }
    ]
  },
  // Room 2 (Partner: 정프론트)
  {
    roomId: 2,
    partnerId: 6,
    partnerNickname: "정프론트",
    partnerProfileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    lastMessage: "네 무엇이든 물어보세요!",
    lastMessageTime: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    unreadCount: 0,
    messages: [
      { messageId: 4, roomId: 2, senderId: 1, senderNickname: "홍길동", senderProfileImage: null, messageType: "TEXT", content: "안녕하세요 프론트 개발 관련해서 여쭤볼 게 있습니다.", createdAt: new Date(Date.now() - 49 * 3600 * 1000).toISOString(), unreadCount: 0, isMine: true, isDeleted: false },
      { messageId: 5, roomId: 2, senderId: 6, senderNickname: "정프론트", senderProfileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", messageType: "TEXT", content: "네 무엇이든 물어보세요!", createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), unreadCount: 0, isMine: false, isDeleted: false }
    ]
  }
];

const SEED_NOTIFICATIONS = [
  { notificationId: 1, memberId: 1, type: "LIKE", message: "김개발님이 회원님의 게시글 'CSS Grid와 Flexbox...'를 좋아합니다.", isRead: false, redirectUrl: "/post/3", createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
  { notificationId: 2, memberId: 1, type: "COMMENT", message: "정프론트님이 회원님의 게시글 'CSS Grid와 Flexbox...'에 댓글을 남겼습니다: '정말 유익한 글이네요!'", isRead: false, redirectUrl: "/post/3", createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString() },
  { notificationId: 3, memberId: 1, type: "FOLLOW", message: "이디자인님이 회원님을 팔로우하기 시작했습니다.", isRead: false, redirectUrl: "/Mypage/user/3", createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString() }
];

// Initialize Database in localStorage
export const initMockDb = () => {
  if (typeof window === "undefined") return;

  if (localStorage.getItem(DB_PREFIX + "initialized") !== "v4") {
    setStorageItem("members", SEED_MEMBERS);
    setStorageItem("tags", SEED_TAGS);
    setStorageItem("posts", [...SEED_POSTS, ...generateExtraPosts()]);
    setStorageItem("comments", SEED_COMMENTS);
    setStorageItem("follows", SEED_FOLLOWS);
    setStorageItem("chats", SEED_CHATS);
    setStorageItem("notifications", SEED_NOTIFICATIONS);
    localStorage.setItem(DB_PREFIX + "initialized", "v4");

    // Automatically authenticate the default user (gildong)
    const mockToken = "header." + btoa(JSON.stringify({
      sub: "1",
      nickname: "홍길동",
      exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 365 * 10
    })) + ".signature";
    localStorage.setItem("accessToken", mockToken);
    localStorage.setItem("nickname", "홍길동");
  }
};

// Ensure database is initialized
initMockDb();

// ----------------------------------------------------
// Mock DB Controllers
// ----------------------------------------------------

export const dbGetMe = (token) => {
  const payload = decodeToken(token);
  if (!payload) return null;
  const members = getStorageItem("members", []);
  return members.find(m => String(m.memberId) === String(payload.sub)) || null;
};

const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
};

// Members CRUD
export const dbUpdateProfile = (token, fields) => {
  const me = dbGetMe(token);
  if (!me) throw new Error("Unauthorized");
  const members = getStorageItem("members", []);
  const updatedMembers = members.map(m => {
    if (m.memberId === me.memberId) {
      return { ...m, ...fields };
    }
    return m;
  });
  setStorageItem("members", updatedMembers);
  if (fields.nickname) {
    localStorage.setItem("nickname", fields.nickname);
  }
  return { ...me, ...fields };
};

export const dbGetProfile = (memberId) => {
  const members = getStorageItem("members", []);
  return members.find(m => String(m.memberId) === String(memberId)) || null;
};

// Posts CRUD
export const dbGetPostList = ({ page = 1, size = 12, keyword = "", sort = "latest" }, token) => {
  let posts = getStorageItem("posts", []);
  const me = dbGetMe(token);

  // Filter
  if (keyword) {
    const query = keyword.toLowerCase();
    posts = posts.filter(
      p =>
        p.title.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query) ||
        p.nickname.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
    );
  }

  // Sorting
  if (sort === "popular") {
    posts.sort((a, b) => b.likeCount - a.likeCount);
  } else if (sort === "recommend") {
    // Show posts matching user's interest tags, then others
    if (me && me.interestTags) {
      const tags = getStorageItem("tags", []);
      const interestNames = me.interestTags.map(id => tags.find(t => t.tagId === id)?.name).filter(Boolean);
      
      posts.sort((a, b) => {
        const aMatch = a.tags?.some(t => interestNames.includes(t)) ? 1 : 0;
        const bMatch = b.tags?.some(t => interestNames.includes(t)) ? 1 : 0;
        if (aMatch !== bMatch) return bMatch - aMatch;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else {
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  } else {
    // latest
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Populate isLiked, isBookmarked
  const follows = getStorageItem("follows", []);
  const bookmarkedIds = me ? getStorageItem("bookmarks_" + me.memberId, []) : [];
  const likedIds = me ? getStorageItem("likes_" + me.memberId, []) : [];

  const paginatedPosts = posts.map(p => ({
    ...p,
    isLiked: me ? likedIds.includes(p.postId) : false,
    isBookmarked: me ? bookmarkedIds.includes(p.postId) : false
  }));

  // Paging
  const totalCount = paginatedPosts.length;
  const totalPages = Math.ceil(totalCount / size);
  const start = (page - 1) * size;
  const paginated = paginatedPosts.slice(start, start + size);

  return {
    posts: paginated,
    totalPages,
    totalCount
  };
};

export const dbGetPostDetail = (postId, token) => {
  const posts = getStorageItem("posts", []);
  const postIndex = posts.findIndex(p => String(p.postId) === String(postId));
  if (postIndex === -1) return null;

  // Increment viewCount
  posts[postIndex].viewCount = (posts[postIndex].viewCount || 0) + 1;
  setStorageItem("posts", posts);

  const post = posts[postIndex];
  const me = dbGetMe(token);
  const bookmarkedIds = me ? getStorageItem("bookmarks_" + me.memberId, []) : [];
  const likedIds = me ? getStorageItem("likes_" + me.memberId, []) : [];

  return {
    ...post,
    isLiked: me ? likedIds.includes(post.postId) : false,
    isBookmarked: me ? bookmarkedIds.includes(post.postId) : false
  };
};

export const dbCreatePost = (data, token) => {
  const me = dbGetMe(token);
  if (!me) throw new Error("Unauthorized");
  
  const posts = getStorageItem("posts", []);
  const newPostId = posts.length > 0 ? Math.max(...posts.map(p => p.postId)) + 1 : 1;

  const newPost = {
    postId: newPostId,
    title: data.title,
    content: data.content,
    contentPreview: data.content.substring(0, 150),
    thumbnailUrl: data.thumbnailUrl || "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=500&auto=format&fit=crop&q=60",
    memberId: me.memberId,
    nickname: me.nickname,
    likeCount: 0,
    viewCount: 0,
    commentCount: 0,
    tags: data.tags || [],
    createdAt: new Date().toISOString()
  };

  posts.push(newPost);
  setStorageItem("posts", posts);

  // Trigger grass update by triggering any activity logic if needed
  return newPost;
};

export const dbUpdatePost = (postId, data, token) => {
  const me = dbGetMe(token);
  if (!me) throw new Error("Unauthorized");

  const posts = getStorageItem("posts", []);
  const index = posts.findIndex(p => String(p.postId) === String(postId));
  if (index === -1) throw new Error("Not Found");

  if (String(posts[index].memberId) !== String(me.memberId)) {
    throw new Error("Forbidden");
  }

  posts[index] = {
    ...posts[index],
    title: data.title,
    content: data.content,
    contentPreview: data.content.substring(0, 150),
    thumbnailUrl: data.thumbnailUrl || posts[index].thumbnailUrl,
    tags: data.tags || posts[index].tags
  };

  setStorageItem("posts", posts);
  return posts[index];
};

export const dbDeletePost = (postId, token) => {
  const me = dbGetMe(token);
  if (!me) throw new Error("Unauthorized");

  const posts = getStorageItem("posts", []);
  const index = posts.findIndex(p => String(p.postId) === String(postId));
  if (index === -1) throw new Error("Not Found");

  if (String(posts[index].memberId) !== String(me.memberId)) {
    throw new Error("Forbidden");
  }

  posts.splice(index, 1);
  setStorageItem("posts", posts);
  return true;
};

export const dbToggleLike = (postId, token) => {
  const me = dbGetMe(token);
  if (!me) throw new Error("Unauthorized");

  const likedKey = "likes_" + me.memberId;
  const likedIds = getStorageItem(likedKey, []);
  const posts = getStorageItem("posts", []);
  const postIndex = posts.findIndex(p => String(p.postId) === String(postId));

  if (postIndex === -1) throw new Error("Not Found");

  const alreadyLiked = likedIds.includes(Number(postId));
  let nextLiked = false;

  if (alreadyLiked) {
    const idx = likedIds.indexOf(Number(postId));
    likedIds.splice(idx, 1);
    posts[postIndex].likeCount = Math.max((posts[postIndex].likeCount || 0) - 1, 0);
  } else {
    likedIds.push(Number(postId));
    posts[postIndex].likeCount = (posts[postIndex].likeCount || 0) + 1;
    nextLiked = true;

    // Trigger Notification for the author
    if (String(posts[postIndex].memberId) !== String(me.memberId)) {
      dbCreateNotification(
        posts[postIndex].memberId,
        "LIKE",
        `${me.nickname}님이 회원님의 게시글 '${posts[postIndex].title}'을 좋아합니다.`,
        `/post/${postId}`
      );
    }
  }

  setStorageItem(likedKey, likedIds);
  setStorageItem("posts", posts);

  return nextLiked;
};

export const dbToggleBookmark = (postId, token) => {
  const me = dbGetMe(token);
  if (!me) throw new Error("Unauthorized");

  const bookmarkKey = "bookmarks_" + me.memberId;
  const bookmarkedIds = getStorageItem(bookmarkKey, []);

  const alreadyBookmarked = bookmarkedIds.includes(Number(postId));
  let nextBookmarked = false;

  if (alreadyBookmarked) {
    const idx = bookmarkedIds.indexOf(Number(postId));
    bookmarkedIds.splice(idx, 1);
  } else {
    bookmarkedIds.push(Number(postId));
    nextBookmarked = true;
  }

  setStorageItem(bookmarkKey, bookmarkedIds);
  return nextBookmarked;
};

// Comments CRUD
export const dbGetComments = (postId, page = 1, size = 10) => {
  const comments = getStorageItem("comments", []);
  const postComments = comments.filter(c => String(c.postId) === String(postId));
  
  // Sort comments by ID/createdAt
  postComments.sort((a, b) => a.commentId - b.commentId);

  // Group comments into hierarchy
  const roots = postComments.filter(c => c.parentId === null);
  const replies = postComments.filter(c => c.parentId !== null);

  // Page the root comments
  const totalCount = roots.length;
  const start = (page - 1) * size;
  const paginatedRoots = roots.slice(0, start + size); // Frontend incremental loader loads up to page * size roots

  // Assemble with replies directly nested or flattened
  const resultComments = [];
  paginatedRoots.forEach(root => {
    resultComments.push(root);
    // Find replies for this root
    const rootReplies = replies.filter(r => r.parentId === root.commentId);
    resultComments.push(...rootReplies);
  });

  return {
    comments: resultComments,
    totalCount: postComments.length
  };
};

export const dbCreateComment = (data, token) => {
  const me = dbGetMe(token);
  if (!me) throw new Error("Unauthorized");

  const comments = getStorageItem("comments", []);
  const newCommentId = comments.length > 0 ? Math.max(...comments.map(c => c.commentId)) + 1 : 1;

  const newComment = {
    commentId: newCommentId,
    postId: Number(data.postId),
    parentId: data.parentId ? Number(data.parentId) : null,
    memberId: me.memberId,
    nickname: me.nickname,
    profileImageUrl: me.profileImageUrl || null,
    content: data.content,
    createdAt: new Date().toISOString(),
    likeCount: 0
  };

  comments.push(newComment);
  setStorageItem("comments", comments);

  // Increment post commentCount
  const posts = getStorageItem("posts", []);
  const postIndex = posts.findIndex(p => String(p.postId) === String(data.postId));
  if (postIndex !== -1) {
    posts[postIndex].commentCount = (posts[postIndex].commentCount || 0) + 1;
    setStorageItem("posts", posts);

    // Notify author
    if (String(posts[postIndex].memberId) !== String(me.memberId)) {
      dbCreateNotification(
        posts[postIndex].memberId,
        "COMMENT",
        `${me.nickname}님이 회원님의 게시글 '${posts[postIndex].title}'에 댓글을 남겼습니다: '${data.content.substring(0, 20)}'`,
        `/post/${data.postId}`
      );
    }
  }

  return newComment;
};

// Social: Follows
export const dbFollowUser = (followingId, token) => {
  const me = dbGetMe(token);
  if (!me) throw new Error("Unauthorized");
  if (String(me.memberId) === String(followingId)) throw new Error("Cannot follow yourself");

  const follows = getStorageItem("follows", []);
  const alreadyFollows = follows.some(f => String(f.followerId) === String(me.memberId) && String(f.followingId) === String(followingId));

  if (!alreadyFollows) {
    follows.push({ followerId: me.memberId, followingId: Number(followingId) });
    setStorageItem("follows", follows);

    // Notify following user
    dbCreateNotification(
      Number(followingId),
      "FOLLOW",
      `${me.nickname}님이 회원님을 팔로우하기 시작했습니다.`,
      `/Mypage/user/${me.memberId}`
    );
  }
  return true;
};

export const dbUnfollowUser = (followingId, token) => {
  const me = dbGetMe(token);
  if (!me) throw new Error("Unauthorized");

  const follows = getStorageItem("follows", []);
  const index = follows.findIndex(f => String(f.followerId) === String(me.memberId) && String(f.followingId) === String(followingId));

  if (index !== -1) {
    follows.splice(index, 1);
    setStorageItem("follows", follows);
  }
  return true;
};

export const dbGetFollowCount = (memberId) => {
  const follows = getStorageItem("follows", []);
  const followerCount = follows.filter(f => String(f.followingId) === String(memberId)).length;
  const followingCount = follows.filter(f => String(f.followerId) === String(memberId)).length;
  return { followerCount, followingCount };
};

export const dbGetFollowers = (memberId) => {
  const follows = getStorageItem("follows", []);
  const members = getStorageItem("members", []);
  const followerIds = follows.filter(f => String(f.followingId) === String(memberId)).map(f => f.followerId);
  const users = members.filter(m => followerIds.includes(m.memberId)).map(m => ({
    memberId: m.memberId,
    nickname: m.nickname,
    profileImage: m.profileImageUrl
  }));
  return { count: users.length, users };
};

export const dbGetFollowings = (memberId) => {
  const follows = getStorageItem("follows", []);
  const members = getStorageItem("members", []);
  const followingIds = follows.filter(f => String(f.followerId) === String(memberId)).map(f => f.followingId);
  const users = members.filter(m => followingIds.includes(m.memberId)).map(m => ({
    memberId: m.memberId,
    nickname: m.nickname,
    profileImage: m.profileImageUrl
  }));
  return { count: users.length, users };
};

// Notifications
export const dbGetNotifications = (token) => {
  const me = dbGetMe(token);
  if (!me) return [];
  const notifs = getStorageItem("notifications", []);
  return notifs.filter(n => String(n.memberId) === String(me.memberId)).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const dbCreateNotification = (memberId, type, message, redirectUrl) => {
  const notifs = getStorageItem("notifications", []);
  const nextId = notifs.length > 0 ? Math.max(...notifs.map(n => n.notificationId)) + 1 : 1;
  const newNotif = {
    notificationId: nextId,
    memberId,
    type,
    message,
    isRead: false,
    redirectUrl,
    createdAt: new Date().toISOString()
  };
  notifs.push(newNotif);
  setStorageItem("notifications", notifs);

  // Emit SSE notification
  mockEventBus.emit("notification", newNotif);
  return newNotif;
};

export const dbMarkNotificationRead = (notificationId) => {
  const notifs = getStorageItem("notifications", []);
  const updated = notifs.map(n => {
    if (String(n.notificationId) === String(notificationId)) {
      return { ...n, isRead: true };
    }
    return n;
  });
  setStorageItem("notifications", updated);
  return true;
};

export const dbMarkAllNotificationsRead = (token) => {
  const me = dbGetMe(token);
  if (!me) return false;
  const notifs = getStorageItem("notifications", []);
  const updated = notifs.map(n => {
    if (String(n.memberId) === String(me.memberId)) {
      return { ...n, isRead: true };
    }
    return n;
  });
  setStorageItem("notifications", updated);
  return true;
};

// Chat rooms & messages
export const dbGetChatRooms = (token) => {
  const me = dbGetMe(token);
  if (!me) return [];
  
  const rooms = getStorageItem("chats", []);
  // Dynamic recalculation of unread messages and last message
  return rooms.map(room => {
    const isRoomUser = String(room.messages[0]?.senderId) === String(me.memberId) || room.partnerId !== me.memberId; // dummy logic or check partner
    // Let's filter rooms involving "me"
    // Since our mock has 2 rooms, gildong is memberId: 1
    const unread = room.messages.filter(m => String(m.senderId) !== String(me.memberId) && m.unreadCount > 0).length;
    const lastMsg = room.messages[room.messages.length - 1];

    return {
      roomId: room.roomId,
      partnerId: room.partnerId,
      partnerNickname: room.partnerNickname,
      partnerProfileImage: room.partnerProfileImage,
      lastMessage: lastMsg ? lastMsg.content : "",
      lastMessageTime: lastMsg ? lastMsg.createdAt : room.lastMessageTime,
      unreadCount: unread
    };
  });
};

export const dbGetOrCreateRoom = (partnerId, token) => {
  const me = dbGetMe(token);
  if (!me) throw new Error("Unauthorized");

  const rooms = getStorageItem("chats", []);
  let room = rooms.find(r => String(r.partnerId) === String(partnerId));

  if (!room) {
    const partner = dbGetProfile(partnerId);
    const newRoomId = rooms.length > 0 ? Math.max(...rooms.map(r => r.roomId)) + 1 : 1;
    room = {
      roomId: newRoomId,
      partnerId: Number(partnerId),
      partnerNickname: partner ? partner.nickname : `User ${partnerId}`,
      partnerProfileImage: partner ? partner.profileImageUrl : null,
      lastMessage: "",
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      messages: []
    };
    rooms.push(room);
    setStorageItem("chats", rooms);
  }

  return room;
};

export const dbGetMessageHistory = (roomId, page = 1, size = 50) => {
  const rooms = getStorageItem("chats", []);
  const room = rooms.find(r => String(r.roomId) === String(roomId));
  if (!room) return [];

  // Paging messages (reversed order like normal chats)
  const messages = [...room.messages];
  messages.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)); // Oldest first
  
  // Slice from end for paging
  const end = messages.length;
  const start = Math.max(0, end - page * size);
  return messages.slice(start, end).reverse(); // Return reversed history (latest first)
};

export const dbMarkChatRead = (roomId, token) => {
  const me = dbGetMe(token);
  if (!me) return false;

  const rooms = getStorageItem("chats", []);
  const roomIndex = rooms.findIndex(r => String(r.roomId) === String(roomId));
  if (roomIndex === -1) return false;

  rooms[roomIndex].messages = rooms[roomIndex].messages.map(m => {
    if (String(m.senderId) !== String(me.memberId)) {
      return { ...m, unreadCount: 0 };
    }
    return m;
  });

  setStorageItem("chats", rooms);
  mockEventBus.emit("chat_unread_update", { roomId, unreadCount: 0 });
  return true;
};

export const dbAddChatMessage = (roomId, senderId, content, isMine = false) => {
  const rooms = getStorageItem("chats", []);
  const idx = rooms.findIndex(r => String(r.roomId) === String(roomId));
  if (idx === -1) return null;

  const members = getStorageItem("members", []);
  const sender = members.find(m => String(m.memberId) === String(senderId));

  const newMsgId = rooms[idx].messages.length > 0 ? Math.max(...rooms[idx].messages.map(m => m.messageId)) + 1 : 1;
  const newMsg = {
    messageId: newMsgId,
    roomId: Number(roomId),
    senderId: Number(senderId),
    senderNickname: sender ? sender.nickname : `User ${senderId}`,
    senderProfileImage: sender ? sender.profileImageUrl : null,
    messageType: "TEXT",
    content,
    createdAt: new Date().toISOString(),
    unreadCount: isMine ? 1 : 0,
    isMine,
    isDeleted: false
  };

  rooms[idx].messages.push(newMsg);
  rooms[idx].lastMessage = content;
  rooms[idx].lastMessageTime = newMsg.createdAt;
  setStorageItem("chats", rooms);

  return newMsg;
};

// ----------------------------------------------------
// Mock WebSocket Stomp Client Class
// ----------------------------------------------------
export class MockStompClient {
  constructor(options) {
    this.options = options;
    this.connected = false;
    this.subscriptions = {};
  }

  activate() {
    this.connected = true;
    setTimeout(() => {
      if (this.options.onConnect) this.options.onConnect();
    }, 100);
  }

  deactivate() {
    this.connected = false;
    this.subscriptions = {};
  }

  subscribe(destination, callback) {
    this.subscriptions[destination] = callback;
    if (typeof window !== "undefined") {
      if (!window.mockStompSubscriptions) window.mockStompSubscriptions = {};
      window.mockStompSubscriptions[destination] = callback;
    }
    return {
      unsubscribe: () => {
        delete this.subscriptions[destination];
        if (typeof window !== "undefined" && window.mockStompSubscriptions) {
          delete window.mockStompSubscriptions[destination];
        }
      }
    };
  }

  publish({ destination, body, headers }) {
    const payload = JSON.parse(body);
    const token = headers?.Authorization?.split(" ")[1];
    const me = dbGetMe(token) || { memberId: 1, nickname: "홍길동" };

    if (destination === "/pub/chat/message") {
      const { roomId, content } = payload;
      
      // 1. Add user's message
      const userMsg = dbAddChatMessage(roomId, me.memberId, content, true);
      
      // Emit message to any active room subscribers
      const subKey = `/sub/chat/room/${roomId}`;
      const cb = typeof window !== "undefined" ? window.mockStompSubscriptions?.[subKey] : null;
      if (cb && userMsg) {
        cb({ body: JSON.stringify(userMsg) });
      }

      // 2. Trigger auto reply after 1.5 seconds to make the UI look alive
      setTimeout(() => {
        const rooms = getStorageItem("chats", []);
        const room = rooms.find(r => String(r.roomId) === String(roomId));
        if (!room) return;

        // Auto reply messages pool
        const replies = [
          "와! 정말 좋은 의견이네요. 💡",
          "저도 그 문제 때문에 고민했었는데 해결 방법을 찾은 것 같습니다.",
          "의견 주셔서 감사해요. 블로그에 정리해두었으니 나중에 참고해 보세요! 🌱",
          "오늘 스터디에서 한 번 시도해 보겠습니다. 수고하셨어요!",
          "반갑습니다! 자주 소통하면서 같이 공부해요. 😄",
          "코드 리뷰해주신 부분 수정해서 커밋했습니다. 감사합니다!"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        // Add partner message
        const partnerMsg = dbAddChatMessage(roomId, room.partnerId, randomReply, false);
        
        // Broadcast reply to subscriber
        if (cb && partnerMsg) {
          cb({ body: JSON.stringify(partnerMsg) });
        }

        // Send unread SSE update
        mockEventBus.emit("chat_unread_update", { roomId, unreadCount: 1 });
      }, 1500);
    }
  }
}
