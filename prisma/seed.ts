import { PrismaClient, Perspective } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedChecklistItem {
  label: string;
  done: boolean;
}

interface SeedFoodItem {
  name: string;
  notes?: string;
  rating?: number;
  photoUrl?: string;
}

interface SeedPhoto {
  url: string;
  caption?: string;
}

interface SeedPlace {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  visitedAt: string;
  coverPhotoUrl: string;
  notes: string;
  perspective: Perspective;
  checklist: SeedChecklistItem[];
  foodList: SeedFoodItem[];
  photos: SeedPhoto[];
}

const places: SeedPlace[] = [
  {
    id: 'sa-pa',
    name: 'Sa Pa (Nóc Nhà Đông Dương)',
    lat: 22.3364,
    lng: 103.8438,
    region: 'Lào Cai · Tây Bắc',
    visitedAt: '2026-10-12',
    coverPhotoUrl: 'https://picsum.photos/seed/sapa/800/600',
    notes: 'Misty terraced rice fields and a sunrise above the clouds at Fansipan.',
    perspective: Perspective.shared,
    checklist: [
      { label: 'Trek through the terraced fields', done: true },
      { label: 'Catch sunrise at Fansipan', done: true },
      { label: "Visit a H'Mong village", done: true },
      { label: 'Try thắng cố at the market', done: false },
    ],
    foodList: [
      { name: 'Thắng cố', notes: 'Market stall near the church', rating: 4 },
      { name: 'Cơm lam', rating: 5 },
    ],
    photos: [{ url: 'https://picsum.photos/seed/sapa1/800/600' }],
  },
  {
    id: 'ta-xua',
    name: 'Tà Xùa — Săn Biển Mây Đỉnh Gió',
    lat: 21.2039,
    lng: 104.3903,
    region: 'Sơn La · Tây Bắc',
    visitedAt: '2026-10-01',
    coverPhotoUrl: 'https://picsum.photos/seed/taxua/800/600',
    notes:
      "Đốt lửa người H'Mông, đón bình minh mỏm Cá Heo & cà phê tại Tiệm Mây. Trọn vẹn 5/5 trải nghiệm.",
    perspective: Perspective.shared,
    checklist: [
      { label: 'Đón bình minh tại mỏm Cá Heo', done: true },
      { label: "Đốt lửa trại cùng người H'Mông", done: true },
      { label: 'Cà phê tại Tiệm Mây', done: true },
      { label: 'Săn mây ở sống lưng khủng long', done: true },
    ],
    foodList: [
      { name: 'Cà phê Tiệm Mây', rating: 5 },
      { name: 'Gà nướng mắc khén', rating: 5 },
    ],
    photos: [{ url: 'https://picsum.photos/seed/taxua1/800/600' }],
  },
  {
    id: 'hoi-an',
    name: 'Hội An Ancient Town',
    lat: 15.8801,
    lng: 108.338,
    region: 'Central Vietnam',
    visitedAt: '2026-03-14',
    coverPhotoUrl: 'https://picsum.photos/seed/hoi-an/800/600',
    notes: 'Lantern-lit old town by the Thu Bồn river. Best walked at dusk when the shop lanterns come on.',
    perspective: Perspective.shared,
    checklist: [
      { label: 'Walk the old town at night', done: true },
      { label: 'Release a lantern on the river', done: true },
      { label: 'Get a custom tailored shirt', done: false },
      { label: 'Day trip to An Bàng beach', done: false },
    ],
    foodList: [
      { name: 'Cao lầu', notes: 'Noodle stall near Chùa Cầu', rating: 5, photoUrl: 'https://picsum.photos/seed/caolau/400/300' },
      { name: 'Bánh mì Phượng', notes: 'Queue is worth it', rating: 5 },
      { name: 'White rose dumplings', rating: 4 },
    ],
    photos: [
      { url: 'https://picsum.photos/seed/hoian1/800/600', caption: 'Lanterns over the river' },
      { url: 'https://picsum.photos/seed/hoian2/800/600' },
    ],
  },
  {
    id: 'ha-long-bay',
    name: 'Hạ Long Bay',
    lat: 20.9101,
    lng: 107.1839,
    region: 'Northern Vietnam',
    visitedAt: '2026-01-02',
    coverPhotoUrl: 'https://picsum.photos/seed/halong/800/600',
    notes: 'Overnight cruise through the limestone karsts. Early morning kayaking was the highlight.',
    perspective: Perspective.partnerA,
    checklist: [
      { label: 'Book an overnight cruise', done: true },
      { label: 'Kayak through a lagoon', done: true },
      { label: 'Visit Sung Sot cave', done: true },
      { label: 'Catch sunrise on the top deck', done: false },
    ],
    foodList: [
      { name: 'Fresh squid on the boat', rating: 5 },
      { name: 'Chả mực Hạ Long', notes: 'Squid patty, grab some at the pier', rating: 4 },
    ],
    photos: [{ url: 'https://picsum.photos/seed/halong1/800/600' }],
  },
  {
    id: 'da-lat',
    name: 'Đà Lạt',
    lat: 11.9404,
    lng: 108.4583,
    region: 'Central Highlands',
    visitedAt: '2025-11-20',
    coverPhotoUrl: 'https://picsum.photos/seed/dalat/800/600',
    notes: 'Cool mountain air, pine forests, and more coffee shops than we could get through.',
    perspective: Perspective.partnerB,
    checklist: [
      { label: 'Watch sunrise at Langbiang', done: false },
      { label: 'Visit the Crazy House', done: true },
      { label: 'Coffee crawl downtown', done: true },
      { label: 'Walk the flower gardens', done: false },
    ],
    foodList: [
      { name: 'Bánh tráng nướng', notes: 'Vietnamese pizza, night market', rating: 5 },
      { name: 'Sữa đậu nành nóng', rating: 4 },
      { name: 'Lẩu gà lá é', rating: 5 },
    ],
    photos: [
      { url: 'https://picsum.photos/seed/dalat1/800/600' },
      { url: 'https://picsum.photos/seed/dalat2/800/600' },
    ],
  },
  {
    id: 'phu-quoc',
    name: 'Phú Quốc Island',
    lat: 10.2899,
    lng: 103.984,
    region: 'Southern Vietnam',
    visitedAt: '2025-08-05',
    coverPhotoUrl: 'https://picsum.photos/seed/phuquoc/800/600',
    notes: 'Beach week. The night market by Dinh Cau was the best dinner spot.',
    perspective: Perspective.shared,
    checklist: [
      { label: 'Snorkel An Thới archipelago', done: true },
      { label: 'Sunset at Dinh Cau', done: true },
      { label: 'Ride the Hon Thom cable car', done: false },
    ],
    foodList: [
      { name: 'Grilled scallops, night market', rating: 5 },
      { name: 'Gỏi cá trích (herring salad)', rating: 4 },
    ],
    photos: [{ url: 'https://picsum.photos/seed/phuquoc1/800/600' }],
  },
];

async function main(): Promise<void> {
  for (const place of places) {
    await prisma.place.upsert({
      where: { id: place.id },
      create: {
        id: place.id,
        name: place.name,
        lat: place.lat,
        lng: place.lng,
        region: place.region,
        visitedAt: new Date(place.visitedAt),
        coverPhotoUrl: place.coverPhotoUrl,
        notes: place.notes,
        perspective: place.perspective,
        checklist: { create: place.checklist },
        foodList: { create: place.foodList },
        photos: { create: place.photos },
      },
      update: {},
    });
    console.log(`Seeded place: ${place.name}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
