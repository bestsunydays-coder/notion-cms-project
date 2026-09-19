import { NextRequest, NextResponse } from 'next/server';

const VISITORS_FILE = 'visitors-data.json';
const STORAGE_PATH = process.cwd() + '/data';

interface VisitorData {
  date: string;
  count: number;
}

async function ensureDataDir() {
  const fs = await import('fs').then(m => m.promises);
  try {
    await fs.mkdir(STORAGE_PATH, { recursive: true });
  } catch {
    // 디렉토리가 이미 존재할 수 있음
  }
}

async function getVisitorData(): Promise<VisitorData> {
  const fs = await import('fs').then(m => m.promises);
  await ensureDataDir();

  const today = new Date().toISOString().split('T')[0];
  const filepath = `${STORAGE_PATH}/${VISITORS_FILE}`;

  try {
    const data = await fs.readFile(filepath, 'utf-8');
    const parsed = JSON.parse(data);

    // 날짜가 다르면 카운트 초기화
    if (parsed.date !== today) {
      return { date: today, count: 0 };
    }

    return parsed;
  } catch {
    // 파일이 없으면 새로 생성
    return { date: today, count: 0 };
  }
}

async function saveVisitorData(data: VisitorData) {
  const fs = await import('fs').then(m => m.promises);
  await ensureDataDir();

  const filepath = `${STORAGE_PATH}/${VISITORS_FILE}`;
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * GET: 오늘의 방문자 수 조회
 */
export async function GET() {
  try {
    const data = await getVisitorData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('방문자 수 조회 실패:', error);
    return NextResponse.json({ date: new Date().toISOString().split('T')[0], count: 0 });
  }
}

/**
 * POST: 방문자 수 증가 (하루에 한 번만)
 */
export async function POST(request: NextRequest) {
  try {
    const data = await getVisitorData();
    data.count += 1;
    await saveVisitorData(data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('방문자 수 업데이트 실패:', error);
    return NextResponse.json(
      { error: '방문자 수 업데이트 실패' },
      { status: 500 }
    );
  }
}
