import { PrismaClient, Perspective } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TEST_USERNAME = 'testuser';
const TEST_PASSWORD = 'Test1234!';
const TEST_DISPLAY_NAME = 'Test User';
const PLACE_COUNT = 50;

const REGIONS = [
  'Hà Nội · Miền Bắc',
  'Hải Phòng · Miền Bắc',
  'Ninh Bình · Miền Bắc',
  'Lào Cai · Tây Bắc',
  'Hà Giang · Tây Bắc',
  'Quảng Ninh · Đông Bắc',
  'Nghệ An · Bắc Trung Bộ',
  'Huế · Miền Trung',
  'Đà Nẵng · Miền Trung',
  'Quảng Nam · Miền Trung',
  'Bình Định · Nam Trung Bộ',
  'Khánh Hòa · Nam Trung Bộ',
  'Lâm Đồng · Tây Nguyên',
  'Đắk Lắk · Tây Nguyên',
  'TP. Hồ Chí Minh · Miền Nam',
  'Vũng Tàu · Miền Nam',
  'Cần Thơ · Miền Tây',
  'An Giang · Miền Tây',
  'Kiên Giang · Miền Tây',
  'Cà Mau · Miền Tây',
];

const CHECKLIST_TEMPLATES = [
  'Check in khách sạn',
  'Chụp ảnh tại điểm tham quan chính',
  'Thử đặc sản địa phương',
  'Mua quà lưu niệm',
  'Xem hoàng hôn/bình minh',
  'Trải nghiệm hoạt động địa phương',
];

const FOOD_TEMPLATES = ['Phở', 'Bún chả', 'Bánh xèo', 'Hủ tiếu', 'Cơm tấm', 'Bánh cuốn', 'Chè'];

const PERSPECTIVES: Perspective[] = [Perspective.shared, Perspective.partnerA, Perspective.partnerB];

function pick<T>(items: T[], index: number): T {
  return items[index % items.length];
}

function randomInRange(min: number, max: number, seed: number): number {
  const fraction = ((seed * 9301 + 49297) % 233280) / 233280;
  return min + fraction * (max - min);
}

async function createTestUser(): Promise<void> {
  const existing = await prisma.user.findUnique({ where: { username: TEST_USERNAME } });
  if (existing) {
    console.log(`Test account already exists: ${TEST_USERNAME}`);
    return;
  }
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
  await prisma.user.create({
    data: { username: TEST_USERNAME, displayName: TEST_DISPLAY_NAME, passwordHash },
  });
  console.log(`Created test account: ${TEST_USERNAME} / ${TEST_PASSWORD}`);
}

async function createTestPlaces(): Promise<void> {
  for (let i = 1; i <= PLACE_COUNT; i += 1) {
    const id = `test-place-${i}`;
    const existing = await prisma.place.findUnique({ where: { id } });
    if (existing) {
      continue;
    }

    const lat = randomInRange(8.5, 23.3, i);
    const lng = randomInRange(102.1, 109.4, i * 7);
    const visitedAt = new Date(2025, (i * 3) % 12, (i % 27) + 1);

    await prisma.place.create({
      data: {
        id,
        name: `Địa điểm test #${i}`,
        lat,
        lng,
        region: pick(REGIONS, i),
        visitedAt,
        coverPhotoUrl: `https://picsum.photos/seed/testplace${i}/800/600`,
        notes: `Dữ liệu test tự sinh số ${i} để kiểm tra danh sách/phân trang.`,
        perspective: pick(PERSPECTIVES, i),
        checklist: {
          create: Array.from({ length: 2 + (i % 3) }, (_, j) => ({
            label: pick(CHECKLIST_TEMPLATES, i + j),
            done: (i + j) % 2 === 0,
          })),
        },
        foodList: {
          create: Array.from({ length: 1 + (i % 3) }, (_, j) => ({
            name: pick(FOOD_TEMPLATES, i + j),
            rating: 3 + ((i + j) % 3),
          })),
        },
        photos: {
          create: [{ url: `https://picsum.photos/seed/testplace${i}photo/800/600` }],
        },
      },
    });

    if (i % 10 === 0) {
      console.log(`Seeded ${i}/${PLACE_COUNT} test places`);
    }
  }
}

async function main(): Promise<void> {
  await createTestUser();
  await createTestPlaces();
  console.log(`Done. Login with username="${TEST_USERNAME}" password="${TEST_PASSWORD}".`);
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
