import { 
  Game, 
  HeroConfig, 
  BookingFieldConfig, 
  PopupConfig, 
  CompanyInfo, 
  Notice, 
  Review, 
  InteractiveSettings,
  NavMenuConfig
} from '../types';

export const INITIAL_GAMES: Game[] = [
  {
    id: 'game-1',
    title: '큐브 스페이스: 차원의 문',
    subtitle: '시공간이 뒤엉킨 3D 퍼즐 차원에서 탈출하라!',
    summary: '입체적인 퍼즐 루빅스 큐브의 원리를 이용해 차원의 열쇠를 찾는 화려한 SF 인버시브 테마',
    description: `차원의 문이 열리고 3D 공간의 퍼즐 장치들이 작동합니다. 
팀원들과 협동하여 입체 블록을 맞추고, 숨겨진 암호를 해독해 차원의 에너지를 정상화해야 합니다!
네온 라이팅과 최첨단 인터랙티브 기믹이 결합된 '퍼즐퍼즐'의 대표 인기 테마.`,
    difficulty: 3,
    minPlayers: 2,
    maxPlayers: 6,
    playTimeMinutes: 60,
    pricePerPerson: 22000,
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1000&q=80',
    tags: ['SF/미래', '입체퍼즐', '협동필수', '커플추천', '사진맛집'],
    category: '입체 퍼즐룸',
    isFeatured: true,
    highlightBadges: ['BEST 1위', '인증샷 명소', '난이도 ★★★☆☆'],
    landingHtml: `<div class="space-y-4">
      <h3 class="text-xl font-bold text-purple-400">🌀 게임 스토어 대표 테마 소개</h3>
      <p class="text-gray-300 leading-relaxed">
        차원의 문 너머에는 완벽한 큐브 형태의 방들이 기다리고 있습니다. 방 내부의 가구와 벽면 전체가 대형 퍼즐 장치로 동작하며, 
        빛과 소리의 신호에 따라 다음 방으로 연결되는 경로가 변경됩니다.
      </p>
      <div class="p-4 bg-purple-950/40 border border-purple-500/30 rounded-xl">
        <h4 class="font-semibold text-purple-300">💡 핵심 포인트</h4>
        <ul class="list-disc list-inside text-sm text-gray-300 mt-2 space-y-1">
          <li>화려한 LED 퍼즐 장치와 감각적인 사운드 트랙</li>
          <li>입문자부터 숙련자까지 즐길 수 있는 단계별 힌트 시스템</li>
          <li>성공 시 특별 제작된 '퍼즐퍼즐 차원 패치' 기념품 증정</li>
        </ul>
      </div>
    </div>`
  },
  {
    id: 'game-2',
    title: '미스테리 룸: 아티팩트의 비밀',
    subtitle: '고대 유물 속에 숨겨진 퍼즐 고리를 풀어라',
    summary: '신비로운 아티팩트와 감성적인 조명, 두뇌 플레이를 극대화하는 감성 퍼즐 어드벤처',
    description: `박물관 지하 비밀 수장고에 보관된 고대 퍼즐 상자들. 
각 상자를 풀 때마다 숨겨진 보석의 비밀이 드러납니다. 
직관적인 감각과 관찰력이 필요한 감성 중심의 인테리어와 몰입감 높은 퍼즐 게임!`,
    difficulty: 4,
    minPlayers: 2,
    maxPlayers: 5,
    playTimeMinutes: 70,
    pricePerPerson: 24000,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    tags: ['미스테리', '감성테마', '두뇌회전', '친구들과', '몰입감최상'],
    category: '어드벤처 퍼즐',
    isFeatured: true,
    highlightBadges: ['NEW 테마', '두뇌풀가동', '난이도 ★★★★☆'],
    landingHtml: `<div class="space-y-4">
      <h3 class="text-xl font-bold text-pink-400">🔮 아티팩트의 비밀 포인트</h3>
      <p class="text-gray-300 leading-relaxed">
        실제 고풍스러운 마감재와 신비한 룬 문자가 새겨진 퍼즐 교구를 직접 만지고 조합하는 아날로그+디지털 융합 퍼즐입니다.
      </p>
    </div>`
  },
  {
    id: 'game-3',
    title: '마법의 퍼즐 저택',
    subtitle: '알록달록 젤리 마법사와 함께하는 퍼즐 파티!',
    summary: '귀여운 비주얼과 다채로운 색감의 미니 퍼즐 미션이 가득한 포토제닉 테마',
    description: `마법 저택의 구석구석을 탐험하며 젤리 마법사가 만든 수수께끼 퍼즐을 풀어보세요. 
어렵지 않고 재미있는 감성 인터랙티브 미션이 가득하여 20대 데이트 및 친구들의 인생샷 촬영지로 대인기!`,
    difficulty: 2,
    minPlayers: 2,
    maxPlayers: 4,
    playTimeMinutes: 50,
    pricePerPerson: 20000,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    tags: ['귀여움', '입문자추천', '인생샷', '색감맛집', '쉬운난이도'],
    category: '파티 퍼즐룸',
    isFeatured: true,
    highlightBadges: ['입문자 강추', '데이트 1위', '난이도 ★★☆☆☆'],
    landingHtml: `<div class="space-y-4">
      <h3 class="text-xl font-bold text-indigo-400">🏰 마법 저택 파티 테마</h3>
      <p class="text-gray-300 leading-relaxed">
        화려한 파스텔 톤 가구와 생동감 넘치는 무드 조명속에서 즐기는 미니 퍼즐 파티! 
      </p>
    </div>`
  }
];

export const INITIAL_HERO_CONFIG: HeroConfig = {
  badgeText: '✨ 2026 TRENDY PUZZLE STORE ✨',
  title: '두뇌를 자극하는 스타일리시한 공간',
  highlightTitleText: 'Puzzle Puzzle',
  subtitle: '상상했던 모든 퍼즐이 감각적인 플레이 공간으로 펼쳐집니다.',
  description: '친구, 연인과 함께 몰입하는 3D 인터랙티브 퍼즐 체험 스토어. 지금 예약하고 특별한 모험을 시작하세요!',
  bgType: 'interactive-cubes',
  bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
  primaryButtonText: '지금 바로 예약하기 🎯',
  primaryButtonUrl: '#games-section',
  secondaryButtonText: '스토어 안내 및 위치 📍',
  secondaryButtonUrl: '#about-section',
  showSecondaryButton: true,
};

export const INITIAL_BOOKING_FIELDS: BookingFieldConfig[] = [
  { id: 'f-1', key: 'userName', label: '예약자 성함', placeholder: '홍길동', type: 'text', required: true, enabled: true, order: 1 },
  { id: 'f-2', key: 'userPhone', label: '연락처 (전화번호)', placeholder: '010-1234-5678', type: 'tel', required: true, enabled: true, order: 2 },
  { id: 'f-3', key: 'userEmail', label: '이메일 주소', placeholder: 'example@email.com', type: 'email', required: false, enabled: true, order: 3 },
  { id: 'f-4', key: 'userAddress', label: '주소 (선택)', placeholder: '서울특별시 마포구 연남동 123-45', type: 'address', required: false, enabled: true, order: 4 },
  { id: 'f-5', key: 'players', label: '참여 인원 수', placeholder: '인원 선택', type: 'number', required: true, enabled: true, order: 5 },
  { id: 'f-6', key: 'specialRequest', label: '요청 사항 / 방문 경로', placeholder: '예: 인스타그램 보고 예약합니다, 힌트 많이 주세요!', type: 'textarea', required: false, enabled: true, order: 6 },
];

export const INITIAL_POPUPS: PopupConfig[] = [
  {
    id: 'popup-1',
    title: '🎉 퍼즐퍼즐 OPEN기념 20% 특별 할인!',
    content: '퍼즐퍼즐 공식 웹사이트 오픈 기념! 첫 예약 시 모든 게임 20% 즉시 할인 쿠폰을 적용해 드립니다.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    linkUrl: '#games-section',
    linkText: '할인 가격으로 예약하기 →',
    active: true,
    size: 'medium',
    widthPx: 420,
    heightPx: 520,
  }
];

export const INITIAL_COMPANY_INFO: CompanyInfo = {
  visible: true,
  title: 'PUZZLE PUZZLE 스토어 소개',
  subtitle: '오프라인과 입체 퍼즐이 결합된 독창적인 문화 플레이 스페이스',
  contentHtml: `<div class="space-y-4">
    <p class="text-base leading-relaxed">
      <strong>'퍼즐퍼즐(Puzzle Puzzle)'</strong>은 상상 속 입체 퍼즐과 고난도 트릭 장치를 감각적인 공간 디자인으로 실현한 프리미엄 퍼즐 체험 스토어입니다.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      <div class="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
        <h4 class="font-bold text-purple-400 mb-1">🎮 독창적 입체 기믹</h4>
        <p class="text-sm text-gray-300">자체 개발한 3D 루빅스 큐브 연동 장치와 디지털 모션 센서 기반 퍼즐</p>
      </div>
      <div class="p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
        <h4 class="font-bold text-pink-400 mb-1">📸 감성 포토존 스팟</h4>
        <p class="text-sm text-gray-300">20대 취향저격 네온 조명과 파스텔톤 시그니처 큐브 오브제 연출</p>
      </div>
    </div>
  </div>`,
  address: '서울특별시 마포구 와우산로 21길 19 (홍대입구역 9번 출구 도보 5분)',
  phone: '02-789-1024',
  businessHours: '매일 11:00 ~ 23:00 (연중무휴)',
  instagramUrl: 'https://instagram.com',
  kakaoUrl: 'https://kakao.com',
};

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'notice-1',
    title: '📢 [이벤트] 여름 시즌 한정 퍼즐 챌린지 및 스페셜 굿즈 증정!',
    content: '여름 시즌을 맞아 큐브 스페이스를 40분 이내에 클리어하시는 분들께 한정판 퍼즐퍼즐 아크릴 키링을 증정합니다.',
    category: 'event',
    date: '2026-07-20',
    isPinned: true,
    isImportant: true,
    views: 1240,
  },
  {
    id: 'notice-2',
    title: '🧩 신규 게임 [미스테리 룸: 아티팩트의 비밀] 정식 오픈!',
    content: '오래 기다려주신 신규 아티팩트 테마가 오픈되었습니다. 상시 예약이 가능하며 난이도는 별 4개입니다.',
    category: 'notice',
    date: '2026-07-15',
    isPinned: true,
    isImportant: false,
    views: 890,
  },
  {
    id: 'notice-3',
    title: '🏆 [당첨자 발표] 6월 베스트 리뷰어 이벤트 당첨자 안내',
    content: '6월 한 달간 정성스러운 사진 리뷰를 작성해주신 5분의 당첨자를 발표합니다. 축하드립니다!',
    category: 'winner',
    date: '2026-07-01',
    isPinned: false,
    isImportant: false,
    views: 450,
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userId: 'u-101',
    userName: '퍼즐마스터_민지',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    gameId: 'game-1',
    gameTitle: '큐브 스페이스: 차원의 문',
    rating: 5,
    content: '진짜 조명 연출이랑 퍼즐 기믹 미쳤어요!! 인생샷도 엄청 건졌고 큐브 맞출 때 쾌감이 대박입니다. 친구들이랑 또 올 거예요 💜',
    tags: ['인생샷', '기믹대박', '재방문의사100%'],
    createdAt: '2026-07-24',
    likesCount: 18,
    isVerifiedBooking: true,
  },
  {
    id: 'rev-2',
    userId: 'u-102',
    userName: '데이트러버_현우',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    gameId: 'game-3',
    gameTitle: '마법의 퍼즐 저택',
    rating: 5,
    content: '여자친구랑 100일 기념으로 왔는데 너무 만족스러웠어요! 아기자기해서 어렵지 않고 재밌게 풀 수 있었습니다. 강력 추천!',
    tags: ['커플강추', '분위기굿', '친절해요'],
    createdAt: '2026-07-22',
    likesCount: 12,
    isVerifiedBooking: true,
  }
];

export const INITIAL_INTERACTIVE_SETTINGS: InteractiveSettings = {
  enableCubeParticles: true,
  enable3dHover: true,
  particleSpeed: 'medium',
  cursorGlow: true,
};

export const INITIAL_NAV_MENU_CONFIG: NavMenuConfig = {
  home: '홈',
  games: '게임 예약',
  reviews: '고객 리뷰',
  notices: '공지 & 이벤트',
  about: '브랜드 소개',
};

