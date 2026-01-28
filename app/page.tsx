import { MainHero } from "@/components/posts/MainHero";
import { ClassList } from "@/components/posts/ClassList";

/** FLOW: FE1 홈(클래스 탐색) - 필터 + 카드 그리드. 카드 클릭 → /classes/[id] (상세) */
export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-5">
      <MainHero />
      <ClassList />
    </main>
  );
}
